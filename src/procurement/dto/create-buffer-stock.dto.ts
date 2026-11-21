import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
} from 'class-validator';

export class CreateBufferStockDto {
  @IsString()
  @IsNotEmpty()
  itemCode!: string;

  @IsString()
  @IsNotEmpty()
  itemName!: string;

  @IsString()
  @IsNotEmpty()
  category!: string; // RAW_MATERIALS, SPARE_PARTS, CONSUMABLES

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @Min(0)
  currentStock!: number;

  @IsNumber()
  @Min(0)
  minimumBufferStock!: number;

  @IsNumber()
  @Min(0)
  maximumCapacityStock!: number;

  @IsNumber()
  @Min(0)
  reorderPoint!: number;

  @IsNumber()
  @Min(0)
  averageDailyConsumption!: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  leadTimeDays?: number;

  @IsBoolean()
  @IsOptional()
  jitScheduleActive?: boolean;

  @IsString()
  @IsOptional()
  jitDeliveryCadence?: string; // DAILY_JIS, BI_WEEKLY, WEEKLY, ON_CALL

  @IsString()
  @IsOptional()
  primaryVendorName?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateStockLevelDto {
  @IsNumber()
  @Min(0)
  currentStock!: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
