import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
} from 'class-validator';

export class CreateBusbarEnclosureLogDto {
  @IsString()
  @IsOptional()
  fabricationCode?: string;

  @IsString()
  @IsNotEmpty()
  enclosurePanelId!: string;

  @IsString()
  @IsOptional()
  busbarMaterial?: string; // COPPER_ETP, ALUMINUM_EC

  @IsString()
  @IsNotEmpty()
  busbarCrossSectionMm!: string;

  @IsNumber()
  @Min(1.0)
  busbarCutLengthMm!: number;

  @IsNumber()
  bendAngleDegrees!: number;

  @IsNumber()
  @Min(0.1)
  bendingRadiusMm!: number;

  @IsNumber()
  @Min(1.0)
  phaseClearanceMm!: number;

  @IsNumber()
  @Min(1.0)
  creepageDistanceMm!: number;

  @IsBoolean()
  @IsOptional()
  clearanceCompliant?: boolean;

  @IsString()
  @IsOptional()
  powderCoatingColorRal?: string;

  @IsNumber()
  @Min(1.0)
  dryFilmThicknessMicrons!: number;

  @IsString()
  @IsNotEmpty()
  powderBatchLotNumber!: string;

  @IsString()
  @IsNotEmpty()
  assemblyRoutingStation!: string;

  @IsString()
  @IsOptional()
  inspectionStatus?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
