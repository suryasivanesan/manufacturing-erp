import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreatePvcDryBlendBatchDto {
  @IsOptional()
  @IsString()
  batchNumber?: string;

  @IsNotEmpty({ message: 'Recipe formula code is required' })
  @IsString()
  recipeFormulaCode!: string;

  @IsNotEmpty({ message: 'PVC resin K-value is required' })
  @IsNumber()
  @Min(50)
  @Max(80)
  pvcResinKValue!: number;

  @IsNotEmpty({ message: 'Virgin resin weight in kg is required' })
  @IsNumber()
  @Min(1)
  virginResinKg!: number;

  @IsNotEmpty({ message: 'Regrind material weight in kg is required' })
  @IsNumber()
  @Min(0)
  regrindMaterialKg!: number;

  @IsNotEmpty({ message: 'Total batch weight in kg is required' })
  @IsNumber()
  @Min(1)
  totalBatchWeightKg!: number;

  @IsNotEmpty({ message: 'Regrind blend percentage is required' })
  @IsNumber()
  @Min(0)
  @Max(100)
  regrindBlendPercentage!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  maxRegrindPermittedPct?: number;

  @IsNotEmpty({ message: 'One-pack stabilizer weight in kg is required' })
  @IsNumber()
  @Min(0.1)
  onePackStabilizerKg!: number;

  @IsNotEmpty({ message: 'Calcium carbonate filler weight in kg is required' })
  @IsNumber()
  @Min(0)
  calciumCarbonateFillerKg!: number;

  @IsOptional()
  @IsNumber()
  impactModifierKg?: number;

  @IsOptional()
  @IsNumber()
  processingAidKg?: number;

  @IsOptional()
  @IsNumber()
  pigmentTio2Kg?: number;

  @IsNotEmpty({ message: 'High speed mixer temperature is required' })
  @IsNumber()
  highSpeedMixerTempCelsius!: number;

  @IsNotEmpty({ message: 'Cooler mixer discharge temperature is required' })
  @IsNumber()
  coolerMixerDischargeTemp!: number;

  @IsOptional()
  @IsBoolean()
  regrindExceedsLimitBlocked?: boolean;

  @IsOptional()
  @IsString()
  batchStatus?: string;

  @IsOptional()
  @IsString()
  approvedByRole?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
