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
  RUBBER_SPECIALIZED_ROLES,
  RUBBER_SPECIALIZED_ROLES_METADATA,
  PIPES_SPECIALIZED_ROLES,
  PIPES_SPECIALIZED_ROLES_METADATA,
  AUTOMOBILE_SPECIALIZED_ROLES,
  AUTOMOBILE_SPECIALIZED_ROLES_METADATA,
  ALL_SPECIALIZED_ROLES_METADATA,
  getSpecializedRolesForSubCategory,
  isRoleAllowedForSubCategory,
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
   * Returns metadata for manufacturing departments and management levels,
   * strictly filtered to the company's specific registered sub-category.
   * Cross-category specialized roles from unrelated industries are excluded.
   */
  async getHierarchyMetadata(companyId?: string | null, subCategoryOverride?: string) {
    let subCategory = subCategoryOverride;
    let industryCategory: string | undefined;
    let defaultUnit: string | undefined;

    if (companyId) {
      const company = await this.prisma.company.findUnique({
        where: { id: companyId },
        select: { id: true, industryCategory: true, subCategory: true, defaultUnit: true },
      });
      if (company) {
        subCategory = subCategory || company.subCategory;
        industryCategory = company.industryCategory;
        defaultUnit = company.defaultUnit;
      }
    }

    // Return ONLY the specialized roles pertinent to this company's registered sub-category
    const pertinentSpecializedRoles = getSpecializedRolesForSubCategory(subCategory);
    const pertinentRoleKeys = new Set<string>(pertinentSpecializedRoles.map((r: any) => r.role as string));
    const pertinentDesignationKeys = new Set<string>(
      pertinentSpecializedRoles.map((r: any) => r.designationKey as string),
    );
    const allSpecializedRoleKeys = new Set<string>(
      ALL_SPECIALIZED_ROLES_METADATA.map((r: any) => r.role as string),
    );
    const allSpecializedDesignationKeys = new Set<string>(
      ALL_SPECIALIZED_ROLES_METADATA.map((r: any) => r.designationKey as string),
    );

    // Filter departments so unrelated specialized designations are completely excluded
    const filteredDepartments = MANUFACTURING_DEPARTMENTS.map((dept: any) => {
      const allowed = dept.allowedDesignations.filter((des: any) => {
        if (!allSpecializedDesignationKeys.has(des as string)) return true;
        return pertinentDesignationKeys.has(des as string);
      });
      const rawDeptDesigs = (dept as any).designations;
      const desigs = Array.isArray(rawDeptDesigs)
        ? rawDeptDesigs.filter((des: any) => {
            const k = (des?.key ?? des) as string;
            if (!allSpecializedDesignationKeys.has(k)) return true;
            return pertinentDesignationKeys.has(k);
          })
        : allowed.map((d: any) => ({ key: d, label: (d as string).replace(/_/g, ' ') }));
      return {
        ...dept,
        allowedDesignations: allowed,
        designations: desigs,
      };
    });

    const filteredDesignations = Object.values(Designation).filter((d: any) => {
      if (!allSpecializedDesignationKeys.has(d)) return true;
      return pertinentDesignationKeys.has(d);
    });

    const filteredRoles = Object.values(Role).filter((r: any) => {
      if (!allSpecializedRoleKeys.has(r)) return true;
      return pertinentRoleKeys.has(r);
    });

    return {
      activeSubCategory: subCategory || null,
      industryCategory: industryCategory || null,
      defaultUnit: defaultUnit || null,
      departments: filteredDepartments,
      designations: filteredDesignations,
      roles: filteredRoles,
      specializedRoles: pertinentSpecializedRoles,
    };
  }

  /**
   * List all employees belonging to the authenticated company, optionally filtered.
   * Multi-tenancy isolation strictly ensures zero access or visibility into other companies.
   */
  async findAllByCompany(
    companyId: string | null | undefined,
    filters?: { department?: Department; search?: string },
  ) {
    if (!companyId) {
      throw new ForbiddenException('Company association is required to list employees.');
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
        companyId: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: [{ department: 'asc' }, { createdAt: 'desc' }],
    });

    return {
      total: users.length,
      companyId,
      users,
    };
  }

  /**
   * Find a specific employee strictly belonging to the authenticated company.
   * Cross-tenant access is completely blocked (throws NotFoundException if user belongs to another company).
   */
  async findOneByCompany(companyId: string | null | undefined, targetUserId: string) {
    if (!companyId) {
      throw new ForbiddenException('Company association is required to view employee details.');
    }

    const user = await this.prisma.user.findFirst({
      where: { id: targetUserId, companyId },
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
        companyId: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Employee record not found in your organization.');
    }

    return user;
  }

  /**
   * Create a new employee within the company with strict department & hierarchy validation.
   * Strictly enforces company-level isolation:
   * - A SUPER_ADMIN or HR of Company A can ONLY create users in Company A.
   * - Role permissions are strictly confined to actor.companyId.
   */
  async createEmployee(actor: ActorContext, dto: CreateUserDto) {
    if (!actor.companyId) {
      throw new ForbiddenException('Actor is not linked to an active company.');
    }
    const companyId = actor.companyId;

    // Strict Tenant Role Isolation Check:
    // Only Executive leadership (SUPER_ADMIN, CEO, MD, OWNER, EXECUTIVE) or HR Managers of THIS company can provision users
    const actorRole = actor.role as Role;
    const isActorExecutive = EXECUTIVE_ROLES.includes(actorRole);
    const isActorHr =
      actorRole === Role.HR_MANAGER ||
      actorRole === Role.HR_ASSISTANT_MANAGER ||
      actorRole === Role.HR ||
      actor.department === Department.HR;

    if (!isActorExecutive && !isActorHr) {
      throw new ForbiddenException(
        `User with role "${actorRole}" in company "${companyId}" does not have authority to onboard employees.`,
      );
    }

    // Strict Industry Sub-Category Validation: Prevent Cross-Category Roles
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true, subCategory: true, industryCategory: true },
    });

    if (!company) {
      throw new NotFoundException('Company tenant record not found.');
    }

    if (dto.specializedRole) {
      const check = isRoleAllowedForSubCategory(company.subCategory, dto.specializedRole);
      if (!check.allowed) {
        throw new ForbiddenException(check.reason);
      }
    }
    if (dto.designation) {
      const check = isRoleAllowedForSubCategory(company.subCategory, dto.designation);
      if (!check.allowed) {
        throw new ForbiddenException(check.reason);
      }
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

    // Only Executive leadership (SUPER_ADMIN, CEO, MD, OWNER) can provision another Executive account within this company
    const isTargetExecutive =
      dto.department === Department.EXECUTIVE ||
      dto.designation === Designation.SUPER_ADMIN ||
      dto.designation === Designation.CEO ||
      dto.designation === Designation.MD ||
      dto.designation === Designation.OWNER ||
      dto.designation === Designation.EXECUTIVE ||
      EXECUTIVE_ROLES.includes(resolvedRole);

    if (isTargetExecutive && !isActorExecutive) {
      throw new ForbiddenException(
        'Only Executive leadership (SUPER_ADMIN, CEO, MD, Owner) can provision or assign Executive leadership roles.',
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

    const deptMeta = MANUFACTURING_DEPARTMENTS.find((d: any) => d.key === dto.department);
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
      throw new ForbiddenException('Actor is not linked to an active company.');
    }
    const companyId = actor.companyId;

    const actorRole = actor.role as Role;
    const isActorExecutive = EXECUTIVE_ROLES.includes(actorRole);
    const isActorHr =
      actorRole === Role.HR_MANAGER ||
      actorRole === Role.HR ||
      actor.department === Department.HR;

    if (!isActorExecutive && !isActorHr) {
      throw new ForbiddenException(
        `User with role "${actorRole}" does not have authority to modify employee roles in company "${companyId}".`,
      );
    }

    const target = await this.prisma.user.findFirst({
      where: { id: targetUserId, companyId },
    });

    if (!target) {
      throw new NotFoundException('Employee record not found in your organization.');
    }

    // Strict Industry Sub-Category Validation: Prevent Cross-Category Roles
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true, subCategory: true, industryCategory: true },
    });

    if (!company) {
      throw new NotFoundException('Company tenant record not found.');
    }

    if (dto.specializedRole) {
      const check = isRoleAllowedForSubCategory(company.subCategory, dto.specializedRole);
      if (!check.allowed) {
        throw new ForbiddenException(check.reason);
      }
    }
    if (dto.designation) {
      const check = isRoleAllowedForSubCategory(company.subCategory, dto.designation);
      if (!check.allowed) {
        throw new ForbiddenException(check.reason);
      }
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
    const isPromotingToExecutive =
      dto.department === Department.EXECUTIVE ||
      dto.designation === Designation.SUPER_ADMIN ||
      dto.designation === Designation.CEO ||
      dto.designation === Designation.MD ||
      dto.designation === Designation.OWNER ||
      dto.designation === Designation.EXECUTIVE ||
      EXECUTIVE_ROLES.includes(resolvedRole);
    const isTargetExecutive =
      EXECUTIVE_ROLES.includes(targetCurrentRole) ||
      target.department === Department.EXECUTIVE;

    if ((isPromotingToExecutive || isTargetExecutive) && !isActorExecutive) {
      throw new ForbiddenException(
        'Only Executive leadership (SUPER_ADMIN, CEO, MD, Owner) can modify or assign Executive leadership roles.',
      );
    }

    // Prevent demoting the last remaining Executive Owner/CEO/SUPER_ADMIN
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
          'Cannot demote the last active Executive (SUPER_ADMIN/CEO/MD/Owner) of the organization.',
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
        companyId: true,
        isActive: true,
        lastLoginAt: true,
      },
    });

    this.logger.log(
      `User ${actor.id} updated role for ${updated.email} -> ${updated.role} in company ${companyId}`,
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
      throw new ForbiddenException('Actor is not linked to an active company.');
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

    const actorRole = actor.role as Role;
    const isActorExecutive = EXECUTIVE_ROLES.includes(actorRole);
    const isActorHr =
      actorRole === Role.HR_MANAGER ||
      actorRole === Role.HR ||
      actor.department === Department.HR;

    if (!isActorExecutive && !isActorHr) {
      throw new ForbiddenException(
        `User with role "${actorRole}" does not have authority to modify employee status in company "${actor.companyId}".`,
      );
    }

    if (
      (EXECUTIVE_ROLES.includes(target.role as unknown as Role) || target.department === Department.EXECUTIVE) &&
      !isActorExecutive
    ) {
      throw new ForbiddenException(
        'Only Executive leadership can suspend or activate an Executive account.',
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
        companyId: true,
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
      throw new ForbiddenException('Actor is not linked to an active company.');
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

    const actorRole = actor.role as Role;
    const isActorExecutive = EXECUTIVE_ROLES.includes(actorRole);
    const isActorHr =
      actorRole === Role.HR_MANAGER ||
      actorRole === Role.HR ||
      actor.department === Department.HR;

    if (!isActorExecutive && !isActorHr) {
      throw new ForbiddenException(
        `User with role "${actorRole}" does not have authority to remove employees in company "${actor.companyId}".`,
      );
    }

    if (
      (EXECUTIVE_ROLES.includes(target.role as unknown as Role) || target.department === Department.EXECUTIVE) &&
      !isActorExecutive
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
