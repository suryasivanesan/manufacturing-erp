import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsDateString,
} from 'class-validator';

export class CreateSalesBillingDto {
  @IsString()
  @IsNotEmpty()
  salesOrderNumber!: string;

  @IsString()
  @IsOptional()
  deliveryChallanNumber?: string;

  @IsString()
  @IsNotEmpty()
  clientCompanyName!: string;

  @IsString()
  @IsOptional()
  clientGstNumber?: string;

  @IsNumber()
  @Min(0.01)
  totalInvoiceAmount!: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  taxAmount?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  dealerCreditLimit?: number;

  @IsDateString()
  @IsNotEmpty()
  paymentDueDate!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class SettleSalesPaymentDto {
  @IsNumber()
  @Min(0.01)
  paidAmount!: number;

  @IsString()
  @IsNotEmpty()
  paymentReferenceUTR!: string;

  @IsString()
  @IsOptional()
  paymentStatus?: string; // "PARTIALLY_PAID", "FULLY_SETTLED"

  @IsString()
  @IsOptional()
  notes?: string;
}
