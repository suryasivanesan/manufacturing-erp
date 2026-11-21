import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePipeUltrasonicInspectionDto {
  @IsOptional()
  @IsString()
  inspectionCode?: string;

  @IsNotEmpty({ message: 'Batch number is required' })
  @IsString()
  batchNumber!: string;

  @IsNotEmpty({ message: 'Pipe diameter is required' })
  @IsNumber()
  @Min(10)
  pipeDiameterMm!: number;

  @IsNotEmpty({ message: 'Nominal thickness is required' })
  @IsNumber()
  @Min(0.5)
  nominalThicknessMm!: number;

  @IsNotEmpty({ message: 'Minimum measured thickness is required' })
  @IsNumber()
  minMeasuredThicknessMm!: number;

  @IsNotEmpty({ message: 'Maximum measured thickness is required' })
  @IsNumber()
  maxMeasuredThicknessMm!: number;

  @IsNotEmpty({ message: 'Wall eccentricity percentage is required' })
  @IsNumber()
  wallEccentricityPercent!: number;

  @IsNotEmpty({ message: 'Outer diameter measured is required' })
  @IsNumber()
  outerDiameterMeasuredMm!: number;

  @IsOptional()
  @IsNumber()
  pipeLengthMeters?: number;

  @IsOptional()
  @IsBoolean()
  ovalityTolerancePassed?: boolean;

  @IsOptional()
  @IsBoolean()
  isWallThicknessInTolerance?: boolean;

  @IsOptional()
  @IsBoolean()
  packagingBlocked?: boolean;

  @IsOptional()
  @IsString()
  clearanceStatus?: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsOptional()
  @IsString()
  inspectionNotes?: string;

  @IsOptional()
  @IsString()
  inspectorId?: string;
}
