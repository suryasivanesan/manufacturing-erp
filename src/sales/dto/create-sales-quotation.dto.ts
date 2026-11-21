import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsDateString,
} from 'class-validator';

export class CreateSalesQuotationDto {
  @IsString()
  @IsNotEmpty()
  clientCompanyName!: string;

  @IsString()
  @IsNotEmpty()
  productDescription!: string;

  @IsNumber()
  @Min(0.01)
  orderQuantity!: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @Min(0)
  rawMaterialCost!: number;

  @IsNumber()
  @Min(0)
  productionOverheadCost!: number;

  @IsNumber()
  @Min(0)
  profitMarginPct!: number;

  @IsNumber()
  @IsOptional()
  calculatedBaseRate?: number;

  @IsNumber()
  @Min(0)
  finalQuotedRate!: number;

  @IsNumber()
  @IsOptional()
  creditPeriodDays?: number;

  @IsNumber()
  @IsOptional()
  advancePaymentPct?: number;

  @IsString()
  @IsOptional()
  deliveryChargesTerms?: string; // "EX_WORKS", "FOR_DESTINATION", "FOB_PORT"

  @IsString()
  @IsOptional()
  inquiryReference?: string;

  @IsString()
  @IsOptional()
  leadId?: string;

  @IsDateString()
  @IsOptional()
  validTill?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateSalesQuotationStatusDto {
  @IsString()
  @IsNotEmpty()
  status!: string; // "DRAFT_CALCULATED", "SUBMITTED_TO_CLIENT", "UNDER_NEGOTIATION", "AGREEMENT_FINALIZED", "REJECTED"

  @IsNumber()
  @IsOptional()
  finalQuotedRate?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
