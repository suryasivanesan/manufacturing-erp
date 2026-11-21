import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateSalesLeadDto {
  @IsString()
  @IsNotEmpty()
  clientCompanyName!: string;

  @IsString()
  @IsNotEmpty()
  contactPerson!: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsString()
  @IsOptional()
  contactEmail?: string;

  @IsString()
  @IsNotEmpty()
  leadSource!: string; // "MARKET_RESEARCH", "EXHIBITION_TRADE_FAIR", "DIRECT_INQUIRY", "PRODUCT_CATALOGUE_PITCH", "DIGITAL_PORTAL"

  @IsString()
  @IsNotEmpty()
  industrySegment!: string; // "AUTOMOTIVE_OEM", "INFRASTRUCTURE", "ELECTRONICS", "DEFENCE", "ENGINEERING"

  @IsString()
  @IsNotEmpty()
  targetProducts!: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  estimatedAnnualValue?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  leadScore?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  assignedSalesOfficer?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateSalesLeadStatusDto {
  @IsString()
  @IsNotEmpty()
  status!: string; // "NEW_INQUIRY", "CATALOGUE_SHARED", "MEETING_SCHEDULED", "QUALIFIED_PROSPECT", "CONVERTED_TO_RFQ", "LOST"

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  leadScore?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
