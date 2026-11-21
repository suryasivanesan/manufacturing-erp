import {
  Injectable,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import {
  Department,
  Designation,
  EXECUTIVE_ROLES,
  MANUFACTURING_DEPARTMENTS,
  resolveRoleFromHierarchy,
  Role,
  STEEL_SPECIALIZED_ROLES,
  STEEL_SPECIALIZED_ROLES_METADATA,
  GLASS_SPECIALIZED_ROLES,
  GLASS_SPECIALIZED_ROLES_METADATA,
  CHEMICAL_SPECIALIZED_ROLES,
  CHEMICAL_SPECIALIZED_ROLES_METADATA,
  PAINT_SPECIALIZED_ROLES,
  PAINT_SPECIALIZED_ROLES_METADATA,
  ALL_SPECIALIZED_ROLES_METADATA,
} from '../auth/constants/rbac.constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

export interface ActorContext {
  id: string;
  role: Role;
  department: Department;
  companyId?: string | null;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns standard metadata for the 10 manufacturing departments and management levels.
   */
  getHierarchyMetadata() {
    return {
      departments: MANUFACTURING_DEPARTMENTS,
      designations: Object.values(Designation),
      roles: Object.values(Role),
      steelSpecializedRoles: STEEL_SPECIALIZED_ROLES_METADATA,
      glassSpecializedRoles: GLASS_SPECIALIZED_ROLES_METADATA,
      chemicalSpecializedRoles: CHEMICAL_SPECIALIZED_ROLES_METADATA,
      paintSpecializedRoles: PAINT_SPECIALIZED_ROLES_METADATA,
      allSpecializedRoles: ALL_SPECIALIZED_ROLES_METADATA,
    };
  }

  /**
   * List all employees belonging to the authenticated company, optionally filtered.
   */
  async findAllByCompany(
    companyId: string | null | undefined,
    filters?: { department?: Department; search?: string },
  ) {
    if (!companyId) {
      throw new BadRequestException('Company association is required to list employees.');
    }

    const where: Prisma.UserWhereInput = { companyId };

    if (filters?.department) {
      where.department = filters.department;
    }

    if (filters?.search && filters.search.trim().length > 0) {
      const q = filters.search.trim();
      where.AND = [
        {
          OR: [
            { firstName: { contains: q } },
            { lastName: { contains: q } },
            { email: { contains: q } },
            { username: { contains: q } },
            { employeeCode: { contains: q } },
          ],
        },
      ];
    }

    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        employeeCode: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        department: true,
        designation: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: [{ department: 'asc' }, { createdAt: 'desc' }],
    });

    return {
      total: users.length,
      users,
    };
  }

  /**
   * Create a new employee within the company with strict department & hierarchy validation.
   */
  async createEmployee(actor: ActorContext, dto: CreateUserDto) {
    if (!actor.companyId) {
      throw new BadRequestException('Actor is not linked to an active company.');
    }
    const companyId = actor.companyId;

    let resolvedRole: Role;
    try {
      resolvedRole = resolveRoleFromHierarchy(
        dto.department,
        dto.designation,
        dto.specializedRole,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Invalid role hierarchy';
      throw new BadRequestException(message);
    }

    // Only Executive leadership (CEO, MD, OWNER) can provision another Executive account
    if (
      dto.department === Department.EXECUTIVE &&
      !EXECUTIVE_ROLES.includes(actor.role)
    ) {
      throw new ForbiddenException(
        'Only CEO, MD, or Owner can assign Executive leadership roles.',
      );
    }

    const normalizedEmail = dto.email.trim().toLowerCase();
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingEmail) {
      throw new ConflictException('An account with this corporate email already exists.');
    }

    const baseUsername = (dto.username || normalizedEmail.split('@')[0])
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_');

    let finalUsername = baseUsername;
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: finalUsername },
    });
    if (existingUsername) {
      finalUsername = `${baseUsername}_${Math.floor(100 + Math.random() * 900)}`;
    }

    const deptMeta = MANUFACTURING_DEPARTMENTS.find((d) => d.key === dto.department);
    const deptCount = await this.prisma.user.count({
      where: { companyId, department: dto.department as any },
    });
    const generatedCode =
      dto.employeeCode?.trim().toUpperCase() ||
      `${deptMeta?.codePrefix || 'EMP'}-${String(deptCount + 1).padStart(3, '0')}`;

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const createdUser = await this.prisma.user.create({
      data: {
        employeeCode: generatedCode,
        email: normalizedEmail,
        username: finalUsername,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName || null,
        phone: dto.phone || null,
        department: dto.department as any,
        designation: dto.designation as any,
        role: resolvedRole as any,
        companyId,
        isActive: true,
      },
      select: {
        id: true,
        employeeCode: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        department: true,
        designation: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    this.logger.log(
      `User ${actor.id} provisioned ${createdUser.email} as ${createdUser.role} in company ${companyId}`,
    );

    return {
      message: 'Employee onboarded and role assigned successfully.',
      user: createdUser,
    };
  }

  /**
   * Reassign an existing employee's department, designation, and RBAC role.
   */
  async updateEmployeeRole(
    actor: ActorContext,
    targetUserId: string,
    dto: UpdateUserRoleDto,
  ) {
    if (!actor.companyId) {
      throw new BadRequestException('Actor is not linked to an active company.');
    }
    const companyId = actor.companyId;

    const target = await this.prisma.user.findFirst({
      where: { id: targetUserId, companyId },
    });

    if (!target) {
      throw new NotFoundException('Employee record not found in your organization.');
    }

    let resolvedRole: Role;
    try {
      resolvedRole = resolveRoleFromHierarchy(
        dto.department,
        dto.designation,
        dto.specializedRole,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Invalid role hierarchy';
      throw new BadRequestException(message);
    }

    const targetCurrentRole = target.role as unknown as Role;
    const isPromotingToExecutive = dto.department === Department.EXECUTIVE;
    const isTargetExecutive = EXECUTIVE_ROLES.includes(targetCurrentRole);

    if ((isPromotingToExecutive || isTargetExecutive) && !EXECUTIVE_ROLES.includes(actor.role)) {
      throw new ForbiddenException(
        'Only CEO, MD, or Owner can modify or assign Executive leadership roles.',
      );
    }

    // Prevent demoting the last remaining Executive Owner/CEO
    if (isTargetExecutive && !isPromotingToExecutive) {
      const executiveCount = await this.prisma.user.count({
        where: {
          companyId,
          role: { in: EXECUTIVE_ROLES as any },
          isActive: true,
        },
      });
      if (executiveCount <= 1) {
        throw new BadRequestException(
          'Cannot demote the last active Executive (CEO/MD/Owner) of the organization.',
        );
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: target.id },
      data: {
        department: dto.department as any,
        designation: dto.designation as any,
        role: resolvedRole as any,
        firstName: dto.firstName !== undefined ? dto.firstName : target.firstName,
        lastName: dto.lastName !== undefined ? dto.lastName : target.lastName,
        phone: dto.phone !== undefined ? dto.phone : target.phone,
        isActive: dto.isActive !== undefined ? dto.isActive : target.isActive,
      },
      select: {
        id: true,
        employeeCode: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        department: true,
        designation: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
      },
    });

    this.logger.log(
      `User ${actor.id} updated role for ${updated.email} -> ${updated.role}`,
    );

    return {
      message: 'Employee role and department updated successfully.',
      user: updated,
    };
  }

  /**
   * Toggle employee active/suspended status.
   */
  async toggleStatus(actor: ActorContext, targetUserId: string) {
    if (!actor.companyId) {
      throw new BadRequestException('Actor is not linked to an active company.');
    }
    if (actor.id === targetUserId) {
      throw new BadRequestException('You cannot deactivate your own active session account.');
    }

    const target = await this.prisma.user.findFirst({
      where: { id: targetUserId, companyId: actor.companyId },
    });

    if (!target) {
      throw new NotFoundException('Employee record not found in your organization.');
    }

    if (
      EXECUTIVE_ROLES.includes(target.role as unknown as Role) &&
      !EXECUTIVE_ROLES.includes(actor.role)
    ) {
      throw new ForbiddenException(
        'Only Executive leadership can suspend or activate another Executive account.',
      );
    }

    const updated = await this.prisma.user.update({
      where: { id: target.id },
      data: { isActive: !target.isActive },
      select: {
        id: true,
        email: true,
        isActive: true,
        role: true,
      },
    });

    return {
      message: `Employee account ${updated.isActive ? 'activated' : 'deactivated'}.`,
      user: updated,
    };
  }

  /**
   * Remove an employee from the company directory.
   */
  async removeEmployee(actor: ActorContext, targetUserId: string) {
    if (!actor.companyId) {
      throw new BadRequestException('Actor is not linked to an active company.');
    }
    if (actor.id === targetUserId) {
      throw new BadRequestException('You cannot delete your own account.');
    }

    const target = await this.prisma.user.findFirst({
      where: { id: targetUserId, companyId: actor.companyId },
    });

    if (!target) {
      throw new NotFoundException('Employee record not found in your organization.');
    }

    if (
      EXECUTIVE_ROLES.includes(target.role as unknown as Role) &&
      !EXECUTIVE_ROLES.includes(actor.role)
    ) {
      throw new ForbiddenException(
        'Only Executive leadership can remove an Executive account.',
      );
    }

    await this.prisma.user.delete({ where: { id: target.id } });

    return {
      success: true,
      message: 'Employee removed from organization directory.',
    };
  }
}
