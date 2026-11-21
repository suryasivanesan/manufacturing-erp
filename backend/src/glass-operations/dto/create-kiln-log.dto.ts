import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateKilnLogDto {
  @IsNotEmpty({ message: 'Furnace identifier is required' })
  @IsString()
  furnaceId!: string;

  @IsNotEmpty({ message: 'Melting zone temperature is required' })
  @IsNumber({}, { message: 'Melting zone temperature must be a valid number' })
  meltingZoneTemp!: number;

  @IsNotEmpty({ message: 'Refining zone temperature is required' })
  @IsNumber({}, { message: 'Refining zone temperature must be a valid number' })
  refiningZoneTemp!: number;

  @IsNotEmpty({ message: 'Annealing lehr temperature is required' })
  @IsNumber({}, { message: 'Annealing lehr temperature must be a valid number' })
  annealingLehrTemp!: number;

  @IsNotEmpty({ message: 'Natural gas or fuel consumption is required' })
  @IsNumber({}, { message: 'Gas consumption must be a valid number' })
  gasConsumptionCubicMtr!: number;

  @IsOptional()
  @IsNumber({}, { message: 'Melted glass weight in MT must be a valid number' })
  meltedGlassTons?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Fuel per ton must be a valid number' })
  fuelPerTonGlass?: number;

  @IsOptional()
  @IsBoolean()
  burnerMaintenanceDue?: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'Crown pressure must be a valid number' })
  crownPressureMmWg?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Thermal shock delta T must be a valid number' })
  thermalShockDeltaT?: number;

  @IsOptional()
  @IsString()
  operatorNotes?: string;
}
