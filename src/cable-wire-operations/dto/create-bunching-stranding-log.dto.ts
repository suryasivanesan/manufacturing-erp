import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsInt } from 'class-validator';

export class CreateBunchingStrandingLogDto {
  @IsString()
  @IsNotEmpty({ message: 'Machine identifier is required' })
  machineId!: string;

  @IsString()
  @IsOptional()
  strandingType?: string; // BUNCHING, CONCENTRIC_STRANDING, COMPACTED_CONDUCTOR

  @IsString()
  @IsOptional()
  conductorMaterial?: string; // COPPER, ALUMINIUM

  @IsInt()
  @Min(1, { message: 'Strand count must be at least 1' })
  strandCount!: number; // e.g. 7, 19, 37, 61

  @IsNumber()
  @Min(0.01, { message: 'Single strand diameter must be positive' })
  singleStrandDiameterMm!: number;

  @IsNumber()
  @Min(0.1, { message: 'Conductor nominal area is required' })
  conductorNominalAreaSqMm!: number; // e.g. 2.5, 4.0, 16.0 sq.mm

  @IsNumber()
  @Min(0, { message: 'Machine RPM cannot be negative' })
  machineRpm!: number;

  @IsNumber()
  @Min(0, { message: 'Lay length cannot be negative' })
  layLengthMm!: number;

  @IsString()
  @IsOptional()
  layDirection?: string; // S_LAY, Z_LAY

  @IsString()
  @IsNotEmpty({ message: 'Bobbin allocation ID is required' })
  bobbinAllocationId!: string;

  @IsNumber()
  @IsOptional()
  scrapLossWeightKg?: number;

  @IsNumber()
  @Min(1, { message: 'Shift output length is required' })
  shiftOutputMeters!: number;

  @IsNumber()
  @Min(0.1, { message: 'Shift output weight is required' })
  shiftOutputKg!: number;

  @IsString()
  @IsOptional()
  operatorNotes?: string;
}
