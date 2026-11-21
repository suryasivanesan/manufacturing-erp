import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateVendorReconciliationDto {
  @IsString()
  @IsNotEmpty()
  vendorName!: string;

  @IsString()
  @IsNotEmpty()
  poNumber!: string;

  @IsString()
  @IsNotEmpty()
  grnNumber!: string;

  @IsString()
  @IsNotEmpty()
  supplierInvoiceNumber!: string;

  @IsNumber()
  @Min(0)
  invoiceAmount!: number;

  @IsNumber()
  @Min(0)
  grnReceivedAmount!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  onTimeDeliveryScorePct?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  qualityPassRatePct?: number;

  @IsString()
  @IsOptional()
  debitNoteNumber?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  debitNoteAmount?: number;

  @IsString()
  @IsOptional()
  settlementDueDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class SettleVendorPaymentDto {
  @IsString()
  @IsNotEmpty()
  paymentSettlementStatus!: string; // APPROVED_FOR_PAYMENT, SETTLED_PAID, BLOCKED_ON_HOLD

  @IsString()
  @IsOptional()
  notes?: string;
}
