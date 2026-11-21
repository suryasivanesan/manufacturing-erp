import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, IsIn } from 'class-validator';

export class CreateInventoryLaborDto {
  @IsString()
  @IsNotEmpty({ message: 'Worker name is required' })
  workerName!: string;

  @IsString()
  @IsOptional()
  laborCode?: string;

  @IsString()
  @IsNotEmpty({ message: 'Designation is required' })
  designation!: string; // FORKLIFT_OPERATOR, WAREHOUSE_SUPERVISOR, MATERIAL_HANDLER, STORE_CLERK

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

export class UpdateInventoryLaborAttendanceDto {
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

export class AdjustInventoryLaborSalaryDto {
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
