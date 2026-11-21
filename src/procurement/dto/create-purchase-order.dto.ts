import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class CreatePurchaseOrderDto {
  @IsString()
  @IsNotEmpty()
  prNumber!: string;

  @IsString()
  @IsNotEmpty()
  vendorName!: string;

  @IsString()
  @IsOptional()
  vendorCode?: string;

  @IsString()
  @IsNotEmpty()
  orderCategory!: string; // RAW_MATERIALS, SPARE_PARTS, CONSUMABLES

  @IsString()
  @IsNotEmpty()
  itemDescription!: string;

  @IsNumber()
  @Min(0.01)
  orderedQuantity!: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @Min(0.01)
  unitPrice!: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  taxRatePercentage?: number;

  @IsString()
  @IsOptional()
  deliveryTerms?: string; // EX_WORKS, FOB, CIF, FOR_DESTINATION

  @IsString()
  @IsOptional()
  paymentTerms?: string; // ADVANCE, NET_30, NET_60, LC_AT_SIGHT

  @IsString()
  @IsNotEmpty()
  expectedDeliveryDate!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdatePoDispatchStatusDto {
  @IsString()
  @IsNotEmpty()
  dispatchStatus!: string; // DISPATCHED_TO_VENDOR, ACKNOWLEDGED_BY_VENDOR, PARTIALLY_DELIVERED, FULFILLED, CANCELLED

  @IsString()
  @IsOptional()
  notes?: string;
}
