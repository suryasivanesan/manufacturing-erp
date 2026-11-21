import { IsString, IsNotEmpty, IsNumber, IsOptional, IsIn, Min } from 'class-validator';

export class CreateTaxRecordDto {
  @IsString()
  @IsNotEmpty({ message: 'Tax type is required' })
  @IsIn(['GST', 'CORPORATE_TAX', 'TDS', 'ADVANCE_TAX', 'CUSTOMS_DUTY'])
  taxType!: string;

  @IsString()
  @IsNotEmpty({ message: 'Fiscal period is required (e.g. 2026-Q3, 2026-11)' })
  fiscalPeriod!: string;

  @IsNumber()
  @Min(0, { message: 'Taxable amount cannot be negative' })
  taxableAmount!: number;

  @IsNumber()
  @Min(0, { message: 'Tax rate percentage cannot be negative' })
  taxRatePercentage!: number;

  @IsNumber()
  @Min(0, { message: 'Tax liability amount cannot be negative' })
  taxAmount!: number;

  @IsOptional()
  taxDetails?: any;

  @IsString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ApproveTaxPaymentDto {
  @IsString()
  @IsNotEmpty({ message: 'Approval status is required' })
  @IsIn(['APPROVED', 'REJECTED'])
  approvalStatus!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class MarkTaxPaidDto {
  @IsString()
  @IsNotEmpty({ message: 'Tax challan reference number is required' })
  challanReference!: string;

  @IsString()
  @IsOptional()
  accountCode?: string;

  @IsString()
  @IsOptional()
  paidAt?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
