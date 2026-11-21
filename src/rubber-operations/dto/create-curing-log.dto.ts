import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateCuringVulcanizationLogDto {
  @IsOptional()
  @IsString()
  curingLogNumber?: string;

  @IsNotEmpty({ message: 'Curing press ID is required' })
  @IsString()
  curingPressId!: string;

  @IsOptional()
  @IsString()
  cavityNumber?: string;

  @IsNotEmpty({ message: 'Green tyre barcode is required' })
  @IsString()
  greenTyreBarcode!: string;

  @IsNotEmpty({ message: 'Cured tyre serial number is required' })
  @IsString()
  curedTyreSerial!: string;

  @IsNotEmpty({ message: 'SKU code is required' })
  @IsString()
  skuCode!: string;

  @IsNotEmpty({ message: 'Target cure time in seconds is required' })
  @IsNumber()
  @Min(60)
  targetCureTimeSeconds!: number;

  @IsNotEmpty({ message: 'Actual cure time in seconds is required' })
  @IsNumber()
  @Min(60)
  actualCureTimeSeconds!: number;

  @IsNotEmpty({ message: 'Top platen temperature is required' })
  @IsNumber()
  @Min(100)
  @Max(220)
  topPlatenTempCelsius!: number;

  @IsNotEmpty({ message: 'Bottom platen temperature is required' })
  @IsNumber()
  @Min(100)
  @Max(220)
  bottomPlatenTempCelsius!: number;

  @IsNotEmpty({ message: 'Steam dome pressure is required' })
  @IsNumber()
  @Min(1)
  @Max(30)
  steamDomePressureBar!: number;

  @IsNotEmpty({ message: 'Internal bladder pressure is required' })
  @IsNumber()
  @Min(1)
  @Max(35)
  internalBladderPressureBar!: number;

  @IsNotEmpty({ message: 'Bladder serial number is required' })
  @IsString()
  bladderSerialNumber!: string;

  @IsNotEmpty({ message: 'Bladder shot count is required' })
  @IsNumber()
  @Min(0)
  bladderShotCount!: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  bladderMaxShotLimit?: number;

  @IsOptional()
  @IsBoolean()
  bladderWarningTriggered?: boolean;

  @IsOptional()
  @IsString()
  curingStatus?: string;
}
