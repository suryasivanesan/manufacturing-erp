import { IsString, IsNotEmpty, IsNumber, IsOptional, IsIn, Min } from 'class-validator';

export class CreateFinancialMetricDto {
  @IsString()
  @IsNotEmpty({ message: 'Fiscal month is required (e.g., 2026-11)' })
  fiscalMonth!: string;

  @IsString()
  @IsOptional()
  @IsIn(['MONTHLY', 'QUARTERLY', 'ANNUAL'])
  period?: string;

  @IsNumber()
  @Min(0, { message: 'Production volume cannot be negative' })
  productionVolume!: number;

  @IsNumber()
  @Min(0, { message: 'Sales volume cannot be negative' })
  salesVolume!: number;

  @IsNumber()
  @Min(0, { message: 'Revenue cannot be negative' })
  revenue!: number;

  @IsNumber()
  @Min(0, { message: 'Raw material cost cannot be negative' })
  rawMaterialCost!: number;

  @IsNumber()
  @Min(0, { message: 'Labor cost cannot be negative' })
  laborCost!: number;

  @IsNumber()
  @Min(0, { message: 'Operating expenses cannot be negative' })
  expenses!: number;

  @IsNumber()
  @IsOptional()
  taxExpense?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
