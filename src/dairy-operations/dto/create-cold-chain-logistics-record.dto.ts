import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, Min, Max, IsDateString } from 'class-validator';

export class CreateColdChainLogisticsRecordDto {
  @IsString()
  @IsNotEmpty({ message: 'Dispatch tracking code is required' })
  dispatchTrackingCode!: string;

  @IsString()
  @IsNotEmpty({ message: 'Product SKU is required' })
  productSku!: string;

  @IsString()
  @IsNotEmpty({ message: 'Product description is required' })
  productDescription!: string;

  @IsString()
  @IsNotEmpty({ message: 'Cold room storage bay is required' })
  coldRoomStorageBay!: string;

  @IsNumber()
  @Min(-5.0)
  @Max(15.0)
  coldRoomTempCelsius!: number;

  @IsString()
  @IsNotEmpty({ message: 'Reefer vehicle number is required' })
  reeferVehicleNumber!: string;

  @IsNumber()
  @Min(-5.0)
  @Max(15.0)
  inTransitTempCelsius!: number;

  @IsBoolean()
  @IsOptional()
  tempLoggerDataLogValid?: boolean;

  @IsDateString()
  @IsNotEmpty({ message: 'MFG timestamp is required' })
  mfgTimestamp!: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Use-by timestamp is required' })
  useByTimestamp!: string;

  @IsNumber()
  @Min(0.0)
  remainingShelfLifeHours!: number;

  @IsString()
  @IsOptional()
  fifoFefoStatus?: string; // OPTIMAL_FEFO, EXPEDITE_DISPATCH, CRITICAL_NEAR_EXPIRY, EXPIRED_QUARANTINE

  @IsString()
  @IsNotEmpty({ message: 'Shipping barcode is required' })
  shippingBarcode!: string;

  @IsBoolean()
  @IsOptional()
  dispatchBlocked?: boolean;

  @IsBoolean()
  @IsOptional()
  temperatureCompliant?: boolean;

  @IsString()
  @IsOptional()
  dispatcherNotes?: string;
}
