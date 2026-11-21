import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateProcurementSourcingDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  category!: string; // RAW_MATERIALS, SPARE_PARTS, CONSUMABLES, PACKAGING, CAPITAL_EQUIPMENT

  @IsString()
  @IsNotEmpty()
  materialDescription!: string;

  @IsNumber()
  @Min(0.01)
  targetQuantity!: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  invitedVendorsCount?: number;

  @IsNumber()
  @IsOptional()
  lowestQuotedRate?: number;

  @IsString()
  @IsOptional()
  approvedVendorName?: string;

  @IsNumber()
  @IsOptional()
  approvedRate?: number;

  @IsString()
  @IsOptional()
  arcContractCode?: string;

  @IsString()
  @IsOptional()
  arcValidFrom?: string;

  @IsString()
  @IsOptional()
  arcValidTill?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  vendorAuditScore?: number;

  @IsString()
  @IsOptional()
  comparativeSummaryJson?: string;

  @IsString()
  @IsOptional()
  status?: string; // RFQ_ISSUED, QUOTES_RECEIVED, COMPARATIVE_ANALYZED, ARC_FINALIZED, CANCELLED

  @IsString()
  @IsOptional()
  notes?: string;
}

export class FinalizeArcContractDto {
  @IsString()
  @IsNotEmpty()
  approvedVendorName!: string;

  @IsNumber()
  @Min(0.01)
  approvedRate!: number;

  @IsString()
  @IsNotEmpty()
  arcValidFrom!: string;

  @IsString()
  @IsNotEmpty()
  arcValidTill!: string;

  @IsNumber()
  @IsOptional()
  vendorAuditScore?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
