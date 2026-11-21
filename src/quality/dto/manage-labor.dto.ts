import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, IsIn } from 'class-validator';

export class CreateDepartmentLaborDto {
  @IsString()
  @IsNotEmpty({ message: 'Worker name is required' })
  workerName!: string;

  @IsString()
  @IsOptional()
  laborCode?: string;

  @IsString()
  @IsNotEmpty({ message: 'Designation is required' })
  designation!: string; // QUALITY_INSPECTOR, LAB_TECHNICIAN, TESTING_OPERATOR, ASSISTANT

  @IsString()
  @IsOptional()
  shift?: string;

  @IsString()
  @IsOptional()
  month?: string; // "2026-11"

  @IsNumber()
  @Min(0)
  dailyWage!: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  daysPresent?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  overtimeHours?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  allowances?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  deductions?: number;
}

export class UpdateLaborAttendanceDto {
  @IsNumber()
  @Min(0)
  daysPresent!: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  overtimeHours?: number;

  @IsString()
  @IsOptional()
  @IsIn(['SHIFT_A', 'SHIFT_B', 'SHIFT_C', 'GENERAL'])
  shift?: string;
}

export class AdjustLaborSalaryDto {
  @IsNumber()
  @Min(0)
  dailyWage!: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  allowances?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  deductions?: number;

  @IsString()
  @IsOptional()
  @IsIn(['PENDING', 'PAID', 'PROCESSED'])
  paymentStatus?: string;
}
