import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Department, Designation, Role } from '../../auth/constants/rbac.constants';

export class UpdateUserRoleDto {
  @IsNotEmpty({ message: 'Department is required' })
  @IsEnum(Department, { message: 'Invalid manufacturing department' })
  department!: Department;

  @IsNotEmpty({ message: 'Designation / Management level is required' })
  @IsEnum(Designation, { message: 'Invalid designation level' })
  designation!: Designation;

  @IsOptional()
  @IsEnum(Role, { message: 'Invalid specialized role' })
  specializedRole?: Role;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  firstName?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
