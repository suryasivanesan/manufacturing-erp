import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateCastingMeltingCycleDto {
  @IsString()
  @IsNotEmpty({ message: 'Casting tree code is required' })
  castingTreeCode!: string;

  @IsString()
  @IsNotEmpty({ message: 'Furnace ID is required' })
  furnaceId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Target karatage is required' })
  targetKaratage!: string; // 22KT_916, 18KT_750, 14KT_585, SILVER_925

  @IsNumber()
  @Min(0.1, { message: 'Pure gold input must be greater than 0' })
  pureGoldInputGrams!: number;

  @IsString()
  @IsNotEmpty({ message: 'Alloy master composition is required' })
  alloyMasterComposition!: string;

  @IsNumber()
  @Min(0.01, { message: 'Alloy weight must be greater than 0' })
  alloyWeightGrams!: number;

  @IsNumber()
  @Min(0.1, { message: 'Total input weight must be greater than 0' })
  totalInputWeightGrams!: number;

  @IsNumber()
  @Min(500, { message: 'Melting temperature must be at least 500 °C' })
  meltingTempCelsius!: number;

  @IsNumber()
  @Min(0, { message: 'Vacuum pressure cannot be negative' })
  vacuumPressureMbar!: number;

  @IsNumber()
  @Min(0.1, { message: 'Casted tree weight must be greater than 0' })
  castedTreeWeightGrams!: number;

  @IsNumber()
  @Min(0, { message: 'Casting yield percentage cannot be negative' })
  @Max(100, { message: 'Casting yield percentage cannot exceed 100%' })
  castingYieldPercentage!: number;

  @IsNumber()
  @Min(0, { message: 'Crucible scrap weight cannot be negative' })
  crucibleScrapWeightGrams!: number;

  @IsNumber()
  @Min(0, { message: 'Scrap dust recovery cannot be negative' })
  scrapDustRecoveryGrams!: number;

  @IsNumber()
  @Min(0, { message: 'Unaccounted loss cannot be negative' })
  unaccountedLossGrams!: number;

  @IsString()
  @IsOptional()
  castingStatus?: string;

  @IsString()
  @IsOptional()
  metallurgistNotes?: string;
}
