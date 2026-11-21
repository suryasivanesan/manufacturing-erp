import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateWeavingKnittingLogDto {
  @IsString()
  @IsNotEmpty({ message: 'Loom or knitting machine identifier is required' })
  loomNumber!: string;

  @IsString()
  @IsOptional()
  loomType?: string; // AIR_JET_LOOM, RAPIER_LOOM, CIRCULAR_KNITTING, FLAT_BED_KNITTING

  @IsString()
  @IsNotEmpty({ message: 'Warp yarn lot number is required' })
  warpYarnLot!: string;

  @IsString()
  @IsNotEmpty({ message: 'Weft yarn lot number is required' })
  weftYarnLot!: string;

  @IsString()
  @IsNotEmpty({ message: 'Beam allocation code is required' })
  beamAllocationCode!: string;

  @IsNumber()
  @Min(1, { message: 'Loom speed in RPM must be greater than 0' })
  loomSpeedRpm!: number;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Warp breakages cannot be negative' })
  warpBreakagesPerHour?: number;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Weft breakages cannot be negative' })
  weftBreakagesPerHour?: number;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Total stop time cannot be negative' })
  totalStopTimeMinutes?: number;

  @IsString()
  @IsOptional()
  stopTimeReason?: string;

  @IsString()
  @IsOptional()
  greigeRollNumber?: string;

  @IsNumber()
  @Min(1, { message: 'Greige fabric length must be at least 1 meter' })
  greigeFabricLengthMeters!: number;

  @IsNumber()
  @Min(0.1, { message: 'Greige fabric weight must be at least 0.1 kg' })
  greigeFabricWeightKg!: number;

  @IsString()
  @IsOptional()
  epiPpiSetting?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  operatorNotes?: string;
}
