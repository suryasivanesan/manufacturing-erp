import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Department, Designation, Role } from '../../auth/constants/rbac.constants';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  firstName!: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  lastName?: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid corporate email address' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  email!: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @MinLength(3, { message: 'Username must contain at least 3 characters' })
  username?: string;

  @IsNotEmpty({ message: 'Temporary password is required' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  employeeCode?: string;

  @IsNotEmpty({ message: 'Department is required' })
  @IsEnum(Department, { message: 'Invalid manufacturing department' })
  department!: Department;

  @IsNotEmpty({ message: 'Designation / Management level is required' })
  @IsEnum(Designation, { message: 'Invalid designation level' })
  designation!: Designation;

  @IsOptional()
  @IsEnum(Role, { message: 'Invalid specialized role' })
  specializedRole?: Role;
}
