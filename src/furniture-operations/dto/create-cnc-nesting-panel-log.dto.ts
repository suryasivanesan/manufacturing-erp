import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateCncNestingPanelLogDto {
  @IsString()
  @IsNotEmpty({ message: 'Nesting job code is required' })
  nestingJobCode!: string;

  @IsString()
  @IsNotEmpty({ message: 'Furniture article name is required' })
  furnitureArticleName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Panel material type is required' })
  panelMaterialType!: string; // MDF_PRE_LAMINATED, PARTICLE_BOARD, BIRCH_PLYWOOD, SOLID_WOOD_PANEL

  @IsString()
  @IsNotEmpty({ message: 'Sheet dimensions in mm are required' })
  sheetDimensionsMm!: string;

  @IsString()
  @IsNotEmpty({ message: 'CNC machine ID is required' })
  cncMachineId!: string;

  @IsString()
  @IsNotEmpty({ message: 'G-code NC program file name is required' })
  gCodeProgramFile!: string;

  @IsNumber()
  @Min(1, { message: 'Total sheets processed must be at least 1' })
  totalSheetsProcessed!: number;

  @IsNumber()
  @Min(0, { message: 'Nested parts yield cannot be negative' })
  @Max(100, { message: 'Nested parts yield cannot exceed 100%' })
  nestedPartsYieldPct!: number;

  @IsNumber()
  @Min(0, { message: 'Offcut waste percentage cannot be negative' })
  @Max(100, { message: 'Offcut waste percentage cannot exceed 100%' })
  offcutWastePct!: number;

  @IsString()
  @IsNotEmpty({ message: 'Edge banding line ID is required' })
  edgeBandingLineId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Edge banding tape type is required' })
  edgeBandingTapeType!: string;

  @IsNumber()
  @Min(140, { message: 'Glue pot temperature must be at least 140°C' })
  @Max(240, { message: 'Glue pot temperature cannot exceed 240°C' })
  gluePotTempCelsius!: number;

  @IsNumber()
  @Min(1, { message: 'Feed rate must be at least 1 m/min' })
  feedRateMetersPerMin!: number;

  @IsNumber()
  @Min(1, { message: 'Sub-components routed count must be at least 1' })
  subComponentsRoutedCount!: number;

  @IsNumber()
  @IsOptional()
  machiningToleranceMm?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  operatorNotes?: string;
}
