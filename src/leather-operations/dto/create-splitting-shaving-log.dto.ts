import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateSplittingShavingLogDto {
  @IsString()
  @IsNotEmpty({ message: 'Log number is required' })
  logNumber!: string;

  @IsString()
  @IsNotEmpty({ message: 'Machine ID is required' })
  machineId!: string;

  @IsString()
  @IsOptional()
  bladeCalibrationStatus?: string; // CALIBRATED, BLADE_WEAR_ALERT, REALIGNMENT_DUE

  @IsNumber()
  @Min(0)
  @Max(100)
  bladeSharpnessIndex!: number;

  @IsNumber()
  @Min(0.2, { message: 'Target thickness must be at least 0.2 mm' })
  targetThicknessMm!: number;

  @IsNumber()
  @Min(0.01)
  toleranceMm!: number;

  @IsNumber()
  @Min(0.1)
  point1ThicknessMm!: number;

  @IsNumber()
  @Min(0.1)
  point2ThicknessMm!: number;

  @IsNumber()
  @Min(0.1)
  point3ThicknessMm!: number;

  @IsNumber()
  @Min(0.1)
  point4ThicknessMm!: number;

  @IsNumber()
  @Min(0.1)
  point5ThicknessMm!: number;

  @IsNumber()
  @IsOptional()
  averageThicknessMm?: number;

  @IsString()
  @IsOptional()
  thicknessUniformityStatus?: string; // UNIFORM, OUT_OF_TOLERANCE, RE_SHAVING_DUE

  @IsNumber()
  @Min(0)
  shavingWasteWeightKg!: number;

  @IsNumber()
  @Min(1)
  hidesProcessed!: number;

  @IsString()
  @IsNotEmpty({ message: 'Thickness range category is required' })
  thicknessRangeCategory!: string;

  @IsString()
  @IsNotEmpty({ message: 'Split drop action is required' })
  splitDropAction!: string; // SUEDE_SPLIT_STAGED, DROP_SPLIT_SCRAP

  @IsString()
  @IsOptional()
  status?: string; // IN_PROGRESS, INSPECTION_PASSED, CALIBRATION_HOLD

  @IsString()
  @IsOptional()
  operatorNotes?: string;
}
