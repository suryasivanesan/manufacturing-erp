import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateRubberCompoundingBatchDto {
  @IsOptional()
  @IsString()
  batchNumber?: string;

  @IsNotEmpty({ message: 'Compound grade is required' })
  @IsString()
  compoundGrade!: string;

  @IsOptional()
  @IsString()
  stage?: string;

  @IsNotEmpty({ message: 'Recipe version is required' })
  @IsString()
  recipeVersion!: string;

  @IsNotEmpty({ message: 'Polymer type is required' })
  @IsString()
  polymerType!: string;

  @IsNotEmpty({ message: 'Mooney viscosity ML (1+4) is required' })
  @IsNumber({}, { message: 'Mooney viscosity must be a number' })
  @Min(20, { message: 'Mooney viscosity must be at least 20 MU' })
  @Max(150, { message: 'Mooney viscosity cannot exceed 150 MU' })
  mooneyViscosityML!: number;

  @IsNotEmpty({ message: 'Carbon black dispersion score is required' })
  @IsNumber({}, { message: 'Dispersion score must be a number' })
  @Min(50, { message: 'Dispersion score must be at least 50%' })
  @Max(100, { message: 'Dispersion score cannot exceed 100%' })
  carbonBlackDispersionPercent!: number;

  @IsNotEmpty({ message: 'Batch weight is required' })
  @IsNumber()
  @Min(1)
  batchWeightKg!: number;

  @IsNotEmpty({ message: 'Mixing time is required' })
  @IsNumber()
  @Min(30)
  mixingTimeSeconds!: number;

  @IsNotEmpty({ message: 'Dump temperature is required' })
  @IsNumber()
  @Min(80)
  @Max(220)
  dumpTemperatureCelsius!: number;

  @IsOptional()
  @IsBoolean()
  curativesAdded?: boolean;

  @IsOptional()
  @IsString()
  traceabilityLotNumbers?: string;

  @IsOptional()
  @IsString()
  approvalStatus?: string;

  @IsOptional()
  @IsString()
  testedBy?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
