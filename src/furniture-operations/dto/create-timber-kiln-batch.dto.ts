import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';

export class CreateTimberKilnBatchDto {
  @IsString()
  @IsNotEmpty({ message: 'Batch number is required' })
  batchNumber!: string;

  @IsString()
  @IsNotEmpty({ message: 'Kiln chamber ID is required' })
  kilnChamberId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Timber species is required' })
  timberSpecies!: string; // TEAK, OAK, SHEESHAM_ROSEWOOD, WALNUT, PINE, MAHOGANY

  @IsNumber()
  @Min(1, { message: 'Stack volume must be greater than 0 CFT' })
  stackVolumeCft!: number;

  @IsNumber()
  @Min(5, { message: 'Plank thickness must be at least 5 mm' })
  plankThicknessMm!: number;

  @IsNumber()
  @Min(5, { message: 'Initial green moisture content must be at least 5%' })
  @Max(100, { message: 'Initial moisture content cannot exceed 100%' })
  initialMoistureContentPct!: number;

  @IsNumber()
  @Min(4, { message: 'Target moisture content must be at least 4%' })
  @Max(20, { message: 'Target moisture content cannot exceed 20%' })
  targetMoistureContentPct!: number;

  @IsNumber()
  @Min(4, { message: 'Current moisture content must be at least 4%' })
  @Max(100, { message: 'Current moisture content cannot exceed 100%' })
  currentMoistureContentPct!: number;

  @IsNumber()
  @Min(20, { message: 'Chamber dry bulb temperature must be at least 20°C' })
  @Max(100, { message: 'Chamber temperature cannot exceed 100°C' })
  chamberTemperatureCelsius!: number;

  @IsNumber()
  @Min(10, { message: 'Relative humidity must be at least 10%' })
  @Max(100, { message: 'Relative humidity cannot exceed 100%' })
  relativeHumidityPct!: number;

  @IsNumber()
  @Min(0.5, { message: 'Drying cycle duration must be at least 0.5 days' })
  dryingCycleDurationDays!: number;

  @IsNumber()
  @Min(0, { message: 'Tangential shrinkage percentage cannot be negative' })
  tangentialShrinkagePct!: number;

  @IsNumber()
  @Min(0, { message: 'Radial shrinkage percentage cannot be negative' })
  radialShrinkagePct!: number;

  @IsNumber()
  @Min(0, { message: 'Volumetric shrinkage percentage cannot be negative' })
  volumetricShrinkagePct!: number;

  @IsBoolean()
  @IsOptional()
  caseHardeningStressTestPassed?: boolean;

  @IsString()
  @IsNotEmpty({ message: 'Stack location bay is required' })
  stackLocationBay!: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  operatorNotes?: string;
}
