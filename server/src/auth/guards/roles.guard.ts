import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ROLES_KEY,
  DEPARTMENTS_KEY,
  MIN_DESIGNATION_KEY,
} from '../decorators/roles.decorator';
import {
  Department,
  Designation,
  DESIGNATION_HIERARCHY_WEIGHT,
  EXECUTIVE_ROLES,
  Role,
} from '../constants/rbac.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredDepartments = this.reflector.getAllAndOverride<Department[]>(
      DEPARTMENTS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const minDesignation = this.reflector.getAllAndOverride<Designation>(
      MIN_DESIGNATION_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no RBAC constraints are placed on the route, allow access
    if (
      (!requiredRoles || requiredRoles.length === 0) &&
      (!requiredDepartments || requiredDepartments.length === 0) &&
      !minDesignation
    ) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Access denied: Authenticated user context is missing.');
    }

    const userRole = user.role as Role;
    const userDepartment = user.department as Department;
    const userDesignation = user.designation as Designation;

    // Top-level Executive leadership (CEO, MD, OWNER) holds full enterprise authority
    if (EXECUTIVE_ROLES.includes(userRole)) {
      return true;
    }

    // Check explicit @Roles(...) constraint
    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(userRole)) {
        throw new ForbiddenException(
          `Access denied: Role "${userRole}" lacks permission. Required role(s): ${requiredRoles.join(', ')}.`,
        );
      }
    }

    // Check @Departments(...) constraint
    if (requiredDepartments && requiredDepartments.length > 0) {
      if (!requiredDepartments.includes(userDepartment)) {
        throw new ForbiddenException(
          `Access denied: Restricted to department(s) [${requiredDepartments.join(', ')}].`,
        );
      }
    }

    // Check @MinManagementLevel(...) hierarchical constraint
    if (minDesignation) {
      const userWeight = DESIGNATION_HIERARCHY_WEIGHT[userDesignation] ?? 0;
      const requiredWeight = DESIGNATION_HIERARCHY_WEIGHT[minDesignation] ?? 100;

      if (userWeight < requiredWeight) {
        throw new ForbiddenException(
          `Access denied: Requires ${minDesignation} level or higher within the department hierarchy.`,
        );
      }
    }

    return true;
  }
}
