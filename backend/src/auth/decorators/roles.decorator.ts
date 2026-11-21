import { SetMetadata } from '@nestjs/common';
import { Department, Designation, Role } from '../constants/rbac.constants';

export const ROLES_KEY = 'rbac_roles';
export const DEPARTMENTS_KEY = 'rbac_departments';
export const MIN_DESIGNATION_KEY = 'rbac_min_designation';

/**
 * Restrict endpoint access to specific Role enum values.
 * Executive roles (CEO, MD, OWNER) are implicitly granted access by RolesGuard unless overridden.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Restrict endpoint access to specific Manufacturing Departments.
 */
export const Departments = (...departments: Department[]) =>
  SetMetadata(DEPARTMENTS_KEY, departments);

/**
 * Restrict endpoint access to a minimum management hierarchy level
 * (e.g., Designation.MANAGER includes MANAGER, CEO, MD, OWNER).
 */
export const MinManagementLevel = (designation: Designation) =>
  SetMetadata(MIN_DESIGNATION_KEY, designation);
