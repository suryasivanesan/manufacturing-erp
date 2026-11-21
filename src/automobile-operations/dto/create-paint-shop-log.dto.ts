import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreatePaintShopCorrosionLogDto {
  @IsString()
  @IsOptional()
  logCode?: string;

  @IsString()
  @IsNotEmpty()
  skidCarrierId!: string;

  @IsString()
  @IsNotEmpty()
  biwBodyNumber!: string;

  @IsString()
  @IsNotEmpty()
  modelCode!: string;

  @IsNumber()
  @Min(0)
  edDipBathSolidContentPct!: number;

  @IsNumber()
  @Min(0)
  edBathPhLevel!: number;

  @IsNumber()
  @Min(0)
  edBathConductivityUsCm!: number;

  @IsNumber()
  @Min(0)
  edVoltageVolts!: number;

  @IsNumber()
  @Min(1)
  edDipTimeSeconds!: number;

  @IsNumber()
  boothTemperatureCelsius!: number;

  @IsNumber()
  @Min(0)
  boothRelativeHumidityPct!: number;

  @IsString()
  @IsNotEmpty()
  currentColorCode!: string;

  @IsString()
  @IsNotEmpty()
  scheduledNextColorCode!: string;

  @IsNumber()
  @Min(0)
  colorPurgeSolventLossLtr!: number;

  @IsNumber()
  ovenBakeZone1TempCelsius!: number;

  @IsNumber()
  ovenBakeZone2TempCelsius!: number;

  @IsNumber()
  @Min(1)
  ovenCuringTimeMinutes!: number;

  @IsNumber()
  @Min(1)
  filmThicknessMicrons!: number;

  @IsBoolean()
  @IsOptional()
  antiCorrosionPassWarranty?: boolean;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  technicianNotes?: string;
}
