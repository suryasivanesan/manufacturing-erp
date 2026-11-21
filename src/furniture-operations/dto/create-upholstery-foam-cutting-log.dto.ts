import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';

export class CreateUpholsteryFoamCuttingLogDto {
  @IsString()
  @IsNotEmpty({ message: 'Batch number is required' })
  batchNumber!: string;

  @IsString()
  @IsNotEmpty({ message: 'Furniture model name is required' })
  furnitureModelName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Fabric or leather type is required' })
  fabricOrLeatherType!: string;

  @IsNumber()
  @Min(0, { message: 'Marker efficiency cannot be negative' })
  @Max(100, { message: 'Marker efficiency cannot exceed 100%' })
  markerEfficiencyPct!: number;

  @IsNumber()
  @Min(0, { message: 'Fabric waste percentage cannot be negative' })
  @Max(100, { message: 'Fabric waste percentage cannot exceed 100%' })
  fabricWastePct!: number;

  @IsString()
  @IsNotEmpty({ message: 'Foam density grade is required' })
  foamDensityGrade!: string; // 32_DENSITY_HIGH_RESILIENCE, 40_DENSITY_PREMIUM_PU, MEMORY_FOAM_50D, BONDED_FOAM_80D

  @IsNumber()
  @Min(0.1, { message: 'Foam block volume must be at least 0.1 CBM' })
  foamBlockVolumeCbm!: number;

  @IsString()
  @IsNotEmpty({ message: 'CNC wire foam cutter ID is required' })
  cncWireFoamCutterId!: string;

  @IsNumber()
  @Min(1, { message: 'Cushion cores cut count must be at least 1' })
  cushionCoresCutCount!: number;

  @IsString()
  @IsNotEmpty({ message: 'Sewing line ID is required' })
  sewingLineId!: string;

  @IsNumber()
  @Min(1, { message: 'Sewing output pieces must be at least 1' })
  sewingOutputPieces!: number;

  @IsNumber()
  @Min(50, { message: 'Zipper seam pull strength must be at least 50 N' })
  zipperSeamPullStrengthN!: number;

  @IsBoolean()
  @IsOptional()
  californiaTb117Passed?: boolean;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  technicianNotes?: string;
}
