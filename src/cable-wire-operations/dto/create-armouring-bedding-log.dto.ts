import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsBoolean } from 'class-validator';

export class CreateArmouringBeddingLogDto {
  @IsString()
  @IsNotEmpty({ message: 'Machine identifier is required' })
  machineId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Cable core code is required' })
  cableCoreCode!: string;

  @IsString()
  @IsOptional()
  armourType?: string; // ROUND_STEEL_WIRE, FLAT_STEEL_STRIP, DOUBLE_STEEL_TAPE, ALUMINIUM_WIRE

  @IsString()
  @IsNotEmpty({ message: 'Steel reel lot number is required' })
  steelReelLotNumber!: string;

  @IsNumber()
  @Min(0, { message: 'Steel reel inventory balance cannot be negative' })
  steelReelInventoryBalanceKg!: number;

  @IsNumber()
  @Min(0.1, { message: 'Bedding thickness is required' })
  beddingThicknessMm!: number;

  @IsNumber()
  @Min(1, { message: 'Armour pitch is required' })
  armourPitchMm!: number;

  @IsNumber()
  @IsOptional()
  armourTensionBar?: number;

  @IsBoolean()
  @IsOptional()
  coverageUniformityInspectionPassed?: boolean;

  @IsNumber()
  @Min(0, { message: 'Measured armour coverage percentage is required' })
  measuredArmourCoveragePct!: number;

  @IsString()
  @IsNotEmpty({ message: 'WIP staging location is required' })
  wipStagingLocation!: string;

  @IsString()
  @IsOptional()
  operatorNotes?: string;
}
