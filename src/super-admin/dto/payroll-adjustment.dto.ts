import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class PayrollAdjustmentDto {
  @IsString()
  @IsNotEmpty({ message: 'User ID is required' })
  userId!: string;

  @IsString()
  @IsOptional()
  month?: string; // Format "YYYY-MM"

  @IsNumber()
  @Min(0)
  @IsOptional()
  baseSalary?: number;

  @IsNumber()
  @IsOptional()
  increments?: number; // Positive increment / bonus

  @IsNumber()
  @Min(0)
  @IsOptional()
  deductions?: number; // Deductions / leave penalty

  @IsNumber()
  @Min(0)
  @IsOptional()
  attendanceDays?: number;

  @IsString()
  @IsOptional()
  status?: string; // ACTIVE, HIRE, TERMINATED

  @IsString()
  @IsOptional()
  remarks?: string;
}
