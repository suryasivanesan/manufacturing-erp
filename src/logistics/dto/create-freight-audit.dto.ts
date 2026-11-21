import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsInt,
} from 'class-validator';

export class CreateFreightAuditDto {
  @IsString()
  @IsNotEmpty()
  transporterAgencyName!: string;

  @IsString()
  @IsNotEmpty()
  billingPeriod!: string; // e.g. "2026-11"

  @IsString()
  @IsOptional()
  contractAgreementCode?: string;

  @IsNumber()
  @Min(0)
  totalBilledAmount!: number;

  @IsNumber()
  @Min(0)
  verifiedApprovedAmount!: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  discrepancyDeductionAmount?: number;

  @IsInt()
  @Min(1)
  totalTripsAudited!: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  emptyReturnTripCount?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  backhaulingConsolidationCount?: number;

  @IsNumber()
  @IsOptional()
  costPerTonKmCalculated?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class SettleFreightAuditDto {
  @IsString()
  @IsNotEmpty()
  auditApprovalStatus!: string; // "AUDIT_PASSED_APPROVED", "VARIANCE_DISPUTED", "SETTLED_RELEASED", "UNDER_REVIEW"

  @IsString()
  @IsNotEmpty()
  settlementReferenceUTR!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
