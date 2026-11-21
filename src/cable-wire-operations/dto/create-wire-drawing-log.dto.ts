import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateWireDrawingLogDto {
  @IsString()
  @IsNotEmpty({ message: 'Machine identifier is required (e.g. Rod Breakdown RBM-01)' })
  machineId!: string;

  @IsString()
  @IsOptional()
  conductorMaterial?: string; // COPPER, ALUMINIUM

  @IsNumber()
  @Min(0.01, { message: 'Inlet diameter must be greater than 0' })
  inletDiameterMm!: number;

  @IsNumber()
  @Min(0.01, { message: 'Outlet diameter must be greater than 0' })
  outletDiameterMm!: number;

  @IsNumber()
  @Min(0, { message: 'Wire elongation ratio cannot be negative' })
  wireElongationRatio!: number; // Percentage elongation e.g. 28.5%

  @IsString()
  @IsNotEmpty({ message: 'Drawing die set ID is required' })
  drawingDieSetId!: string;

  @IsNumber()
  @IsOptional()
  dieWearMicrons?: number;

  @IsString()
  @IsOptional()
  dieInventoryStatus?: string;

  @IsNumber()
  @Min(0.1, { message: 'Inlet weight is required' })
  inletWeightKg!: number;

  @IsNumber()
  @Min(0.1, { message: 'Outlet weight is required' })
  outletWeightKg!: number;

  @IsNumber()
  @IsOptional()
  annealingCurrentAmps?: number;

  @IsNumber()
  @IsOptional()
  annealingVoltageVolts?: number;

  @IsNumber()
  @IsOptional()
  annealingTempCelsius?: number;

  @IsNumber()
  @IsOptional()
  lineSpeedMpm?: number;

  @IsString()
  @IsOptional()
  shiftType?: string;

  @IsString()
  @IsOptional()
  operatorNotes?: string;
}
