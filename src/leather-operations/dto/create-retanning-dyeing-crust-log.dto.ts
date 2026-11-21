import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateRetanningDyeingCrustLogDto {
  @IsString()
  @IsNotEmpty({ message: 'Batch code is required' })
  batchCode!: string;

  @IsString()
  @IsNotEmpty({ message: 'Wet blue lot number is required' })
  wetBlueLotNumber!: string;

  @IsString()
  @IsNotEmpty({ message: 'Leather article is required' })
  leatherArticle!: string; // UPPER_LEATHER, LINING, UPHOLSTERY, GARMENT_SUEDE

  @IsString()
  @IsNotEmpty({ message: 'Dye recipe code is required' })
  dyeRecipeCode!: string;

  @IsString()
  @IsNotEmpty({ message: 'Target shade is required' })
  targetShade!: string;

  @IsString()
  @IsNotEmpty({ message: 'Fatliquor composition is required' })
  fatliquorComposition!: string;

  @IsString()
  @IsNotEmpty({ message: 'Retanning agents are required' })
  retanningAgentsUsed!: string;

  @IsNumber()
  @Min(20, { message: 'Drum temperature must be realistic' })
  drumTempCelsius!: number;

  @IsString()
  @IsOptional()
  dyePenetrationStatus?: string; // FULL_PENETRATION, SURFACE_LEVEL, INCOMPLETE_PENETRATION

  @IsString()
  @IsNotEmpty({ message: 'Drying method is required' })
  dryingMethod!: string; // VACUUM_DRYING, TOGGLING, HANG_AIR_DRYING

  @IsNumber()
  @Min(20)
  dryingChamberTempCelsius!: number;

  @IsNumber()
  @Min(1)
  @Max(50)
  moistureContentPct!: number;

  @IsString()
  @IsNotEmpty({ message: 'Leather temper is required' })
  leatherTemper!: string; // VERY_SOFT, SOFT, MEDIUM_FIRM, FIRM

  @IsString()
  @IsOptional()
  crustBatchGrade?: string; // CRUST_PRIME_A, CRUST_COMMERCIAL_B, RE_DYE_REQUIRED

  @IsNumber()
  @Min(1)
  hidesCount!: number;

  @IsNumber()
  @Min(1)
  totalCrustAreaSqFt!: number;

  @IsString()
  @IsOptional()
  status?: string; // IN_PROCESS, CONDITIONING, CRUST_APPROVED, REWORK

  @IsString()
  @IsOptional()
  technicianNotes?: string;
}
