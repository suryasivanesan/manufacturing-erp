import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateCoreAssemblyLaminationLogDto {
  @IsString()
  @IsOptional()
  assemblyCode?: string;

  @IsString()
  @IsNotEmpty()
  coreBatchNumber!: string;

  @IsString()
  @IsNotEmpty()
  crgoGrade!: string;

  @IsNumber()
  @Min(1.0)
  slittingWidthMm!: number;

  @IsNumber()
  @Min(0.1)
  crgoWeightKg!: number;

  @IsString()
  @IsNotEmpty()
  stackingScheduleId!: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  coreStepCount?: number;

  @IsNumber()
  @Min(1.0)
  stackingHeightMm!: number;

  @IsNumber()
  @Min(0.1)
  clampingTorqueNm!: number;

  @IsNumber()
  @Min(0.01)
  noLoadLossWattsPerKg!: number;

  @IsNumber()
  @Min(0.01)
  totalNoLoadLossWatts!: number;

  @IsNumber()
  @Min(0.1)
  insulationResistanceMOhms!: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
