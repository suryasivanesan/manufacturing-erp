import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateHazmatRecordDto {
  @IsOptional()
  @IsString()
  manifestNumber?: string;

  @IsNotEmpty({ message: 'Waste type description is required' })
  @IsString()
  wasteType!: string;

  @IsOptional()
  @IsString()
  unClassification?: string;

  @IsNotEmpty({ message: 'CPCB waste category is required' })
  @IsString()
  wasteCategoryCpcb!: string;

  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a valid number' })
  @Min(0.01, { message: 'Quantity must be greater than zero' })
  quantityLtrOrKg!: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsNotEmpty({ message: 'Disposal method is required' })
  @IsString()
  disposalMethod!: string;

  @IsNotEmpty({ message: 'Handling permit number is required' })
  @IsString()
  handlingPermitNumber!: string;

  @IsOptional()
  @IsString()
  permitExpiryDate?: string;

  @IsOptional()
  @IsString()
  ppeComplianceStatus?: string;

  @IsOptional()
  @IsNumber()
  ppeAuditScore?: number;

  @IsOptional()
  @IsString()
  statutoryRegulatoryBody?: string;

  @IsOptional()
  @IsString()
  auditNotes?: string;
}
