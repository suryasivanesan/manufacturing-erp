import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateSmtPcbAssemblyLogDto {
  @IsString()
  @IsOptional()
  logCode?: string;

  @IsString()
  @IsNotEmpty()
  lineId!: string;

  @IsString()
  @IsNotEmpty()
  pcbBatchNumber!: string;

  @IsString()
  @IsNotEmpty()
  feederPlacementListNumber!: string;

  @IsString()
  @IsNotEmpty()
  componentReelLotNumbers!: string;

  @IsNumber()
  reflowZone1TempCelsius!: number;

  @IsNumber()
  reflowZone2TempCelsius!: number;

  @IsNumber()
  reflowPeakTempCelsius!: number;

  @IsNumber()
  @Min(0.01)
  conveyorSpeedMpm!: number;

  @IsNumber()
  @Min(0)
  dailyPcbOutputQty!: number;

  @IsNumber()
  @Min(0)
  passQty!: number;

  @IsNumber()
  @Min(0)
  reworkQty!: number;

  @IsString()
  @IsOptional()
  solderPasteType?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
