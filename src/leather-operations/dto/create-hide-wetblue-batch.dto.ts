import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateHideWetBlueBatchDto {
  @IsString()
  @IsNotEmpty({ message: 'Batch number is required' })
  batchNumber!: string;

  @IsString()
  @IsNotEmpty({ message: 'Drum number is required' })
  drumNumber!: string;

  @IsString()
  @IsNotEmpty({ message: 'Raw hide type is required' })
  rawHideType!: string; // COW_HIDE, BUFFALO_HIDE, GOAT_SKIN, SHEEP_SKIN

  @IsString()
  @IsNotEmpty({ message: 'Raw hide grade is required' })
  rawHideGrade!: string; // GRADE_A_HEAVY, GRADE_B_MEDIUM, GRADE_C_LIGHT

  @IsNumber()
  @Min(1, { message: 'Raw hide weight must be greater than 0' })
  rawHideWeightKg!: number;

  @IsNumber()
  @Min(1, { message: 'Hide pieces count must be at least 1' })
  hidePiecesCount!: number;

  @IsNumber()
  @IsOptional()
  averageWeightPerHideKg?: number;

  @IsString()
  @IsNotEmpty({ message: 'Chemical recipe code is required' })
  chemicalRecipeCode!: string;

  @IsNumber()
  @Min(0, { message: 'Chrome basicity cannot be negative' })
  @Max(100, { message: 'Chrome basicity cannot exceed 100%' })
  chromeBasicityPct!: number;

  @IsNumber()
  @Min(0, { message: 'Tanning agent weight must be positive' })
  tanningAgentKg!: number;

  @IsNumber()
  @Min(0, { message: 'Soaking liming hours must be positive' })
  soakingLimingHours!: number;

  @IsNumber()
  @Min(1, { message: 'Drum rotation RPM must be positive' })
  drumRotationRpm!: number;

  @IsNumber()
  @Min(0.5, { message: 'Cycle duration must be at least 0.5 hours' })
  cycleDurationHours!: number;

  @IsNumber()
  @Min(0)
  @Max(14)
  initialPh!: number;

  @IsNumber()
  @Min(0)
  @Max(14)
  finalTanPh!: number;

  @IsNumber()
  @Min(50, { message: 'Shrinkage temperature must be at least 50°C' })
  shrinkageTempCelsius!: number;

  @IsString()
  @IsNotEmpty({ message: 'Wet blue lot number is required' })
  wetBlueLotNumber!: string;

  @IsNumber()
  @Min(0)
  wetBlueYieldPieces!: number;

  @IsString()
  @IsOptional()
  status?: string; // SOAKING_LIMING, PICKLING_TANNING, COMPLETED, DEFECT_QUARANTINE

  @IsString()
  @IsOptional()
  operatorNotes?: string;
}
