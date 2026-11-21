import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';

export class CreateSalesFeedbackDto {
  @IsString()
  @IsNotEmpty()
  clientCompanyName!: string;

  @IsString()
  @IsOptional()
  salesOrderNumber?: string;

  @IsString()
  @IsOptional()
  invoiceNumber?: string;

  @IsString()
  @IsNotEmpty()
  feedbackType!: string; // "CUSTOMER_COMPLAINT", "PRODUCT_REJECTION", "WARRANTY_CLAIM", "PRODUCT_IMPROVEMENT_FEEDBACK", "SERVICE_RATING"

  @IsString()
  @IsNotEmpty()
  issueDescription!: string;

  @IsString()
  @IsOptional()
  severityLevel?: string; // "LOW", "MEDIUM", "HIGH", "CRITICAL"

  @IsNumber()
  @IsOptional()
  @Min(0)
  rejectedQuantity?: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  customerRating?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ResolveSalesFeedbackDto {
  @IsString()
  @IsNotEmpty()
  resolutionStatus!: string; // "OPEN_INVESTIGATING", "UNDER_QA_ANALYSIS", "REPLACEMENT_DISPATCHED", "RESOLVED_CLOSED"

  @IsBoolean()
  @IsOptional()
  qualityReplacementApproved?: boolean;

  @IsString()
  @IsOptional()
  replacementOrderCode?: string;

  @IsString()
  @IsOptional()
  capaActionPlan?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
