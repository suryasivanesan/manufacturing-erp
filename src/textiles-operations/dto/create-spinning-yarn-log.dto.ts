import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateSpinningYarnLogDto {
  @IsString()
  @IsOptional()
  fiberType?: string; // COTTON_COMBED_100, POLY_COTTON_65_35, VISCOSE_RAYON, LINEN_BLEND

  @IsString()
  @IsOptional()
  blendRatioJson?: string;

  @IsNumber()
  @Min(1, { message: 'Active spindle count must be at least 1' })
  spindleCountActive!: number;

  @IsNumber()
  @Min(0, { message: 'Spindle utilization percentage cannot be negative' })
  @Max(100, { message: 'Spindle utilization percentage cannot exceed 100%' })
  spindleUtilizationPct!: number;

  @IsNumber()
  @Min(1, { message: 'English yarn count (Ne) must be greater than 0' })
  yarnCountNe!: number; // e.g. 40.0s Ne

  @IsNumber()
  @Min(100, { message: 'Count Strength Product (CSP) must be at least 100' })
  leaStrengthCsp!: number; // e.g. 2850.0

  @IsNumber()
  @Min(0, { message: 'Comber noil waste percentage cannot be negative' })
  @Max(100, { message: 'Comber noil waste percentage cannot exceed 100%' })
  comberNoilWastePct!: number;

  @IsNumber()
  @Min(0, { message: 'Waste weight cannot be negative' })
  wasteWeightKg!: number;

  @IsNumber()
  @Min(1, { message: 'Daily yarn output must be at least 1 kg' })
  dailyYarnOutputKg!: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  operatorNotes?: string;
}
