import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateAttendancePayrollDto {
  @IsString()
  @IsNotEmpty()
  employeeId!: string;

  @IsString()
  @IsNotEmpty()
  employeeName!: string;

  @IsString()
  @IsNotEmpty()
  department!: string;

  @IsString()
  @IsOptional()
  shiftCode?: string; // GENERAL, SHIFT_A_MORNING, SHIFT_B_EVENING, SHIFT_C_NIGHT

  @IsString()
  @IsNotEmpty()
  month!: string; // e.g. "2026-11"

  @IsString()
  @IsOptional()
  biometricPunchCardId?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalDaysPresent?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalDaysAbsent?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalPaidLeaves?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  overtimeHours?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  overtimePay?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  shiftAllowance?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  nightShiftIncentive?: number;

  @IsNumber()
  @Min(0)
  baseGrossSalary!: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  deductions?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  netPayable?: number;

  @IsString()
  @IsOptional()
  paymentStatus?: string; // PENDING, PROCESSED, DISBURSED

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ProcessPayrollWageDto {
  @IsString()
  @IsNotEmpty()
  paymentStatus!: string; // PROCESSED, DISBURSED

  @IsString()
  @IsOptional()
  notes?: string;
}
