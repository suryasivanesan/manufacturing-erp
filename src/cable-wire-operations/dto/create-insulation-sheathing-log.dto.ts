import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateInsulationSheathingLogDto {
  @IsString()
  @IsNotEmpty({ message: 'Extrusion line ID is required' })
  extrusionLineId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Cable specification is required' })
  cableSpecification!: string;

  @IsString()
  @IsOptional()
  insulationOrSheathLayer?: string; // INSULATION, INNER_SHEATH, OUTER_SHEATH

  @IsString()
  @IsOptional()
  compoundType?: string; // PVC_TYPE_A, PVC_ST2, XLPE, ZHFR, HDPE

  @IsString()
  @IsNotEmpty({ message: 'Compound lot number is required' })
  compoundLotNumber!: string;

  @IsNumber()
  @Min(0.1, { message: 'Compound consumption is required' })
  compoundConsumptionKg!: number;

  @IsNumber()
  @IsOptional()
  barrelZone1TempCelsius?: number;

  @IsNumber()
  @IsOptional()
  barrelZone2TempCelsius?: number;

  @IsNumber()
  @IsOptional()
  barrelZone3TempCelsius?: number;

  @IsNumber()
  @IsOptional()
  barrelZone4TempCelsius?: number;

  @IsNumber()
  @IsOptional()
  crossheadTempCelsius?: number;

  @IsNumber()
  @IsOptional()
  dieHeadTempCelsius?: number;

  @IsNumber()
  @Min(0.1, { message: 'Caterpillar haul-off speed is required' })
  caterpillarHaulOffSpeedMpm!: number;

  @IsNumber()
  @IsOptional()
  screwRpm?: number;

  @IsNumber()
  @Min(0.1, { message: 'Measured outer diameter is required' })
  measuredOuterDiameterMm!: number;

  @IsNumber()
  @Min(0.1, { message: 'Target outer diameter is required' })
  targetOuterDiameterMm!: number;

  @IsNumber()
  @IsOptional()
  meltPressureBar?: number;

  @IsNumber()
  @IsOptional()
  coolingTroughWaterTempCelsius?: number;

  @IsString()
  @IsOptional()
  operatorNotes?: string;
}
