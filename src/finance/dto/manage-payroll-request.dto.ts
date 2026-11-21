import { IsString, IsNotEmpty, IsNumber, IsOptional, IsIn, Min } from 'class-validator';

export class CreatePayrollRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Payroll month is required (e.g., 2026-11)' })
  month!: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsNumber()
  @Min(1, { message: 'Must include at least 1 employee' })
  totalEmployees!: number;

  @IsNumber()
  @Min(0, { message: 'Gross salary cannot be negative' })
  totalGrossSalary!: number;

  @IsNumber()
  @Min(0, { message: 'Deductions cannot be negative' })
  totalDeductions!: number;

  @IsNumber()
  @Min(0, { message: 'Calculated salaries cannot be negative' })
  calculatedSalaries!: number;

  @IsOptional()
  calculatedDetails?: any;

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class ApprovePayrollRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Approval status is required' })
  @IsIn(['APPROVED', 'REJECTED'])
  status!: string;

  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class DisbursePayrollRequestDto {
  @IsString()
  @IsOptional()
  accountCode?: string;

  @IsString()
  @IsOptional()
  transactionReference?: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}
