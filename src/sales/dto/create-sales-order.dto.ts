import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsDateString,
  IsBoolean,
} from 'class-validator';

export class CreateSalesOrderDto {
  @IsString()
  @IsNotEmpty()
  clientPurchaseOrderNo!: string;

  @IsString()
  @IsNotEmpty()
  clientCompanyName!: string;

  @IsString()
  @IsNotEmpty()
  productName!: string;

  @IsNumber()
  @Min(0.01)
  orderQuantity!: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @Min(0)
  unitRate!: number;

  @IsString()
  @IsOptional()
  quotationReference?: string;

  @IsDateString()
  @IsNotEmpty()
  estimatedDeliveryDate!: string;

  @IsString()
  @IsOptional()
  assignedProductionLine?: string;

  @IsString()
  @IsOptional()
  inventoryStockCheckStatus?: string; // "STOCK_SUFFICIENT", "PARTIAL_STOCK", "STOCK_SHORTAGE_REQUIRING_MELT"

  @IsBoolean()
  @IsOptional()
  productionManagerConfirmed?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateSalesOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  orderStatus!: string; // "ORDER_CONFIRMED", "IN_PRODUCTION", "QUALITY_INSPECTION", "READY_FOR_DISPATCH", "DISPATCHED", "COMPLETED"

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  executionProgressPct?: number;

  @IsString()
  @IsOptional()
  inventoryStockCheckStatus?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
