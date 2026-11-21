import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateVpiInsulationProcessLogDto {
  @IsString()
  @IsOptional()
  vpiCycleCode?: string;

  @IsString()
  @IsNotEmpty()
  tankId!: string;

  @IsString()
  @IsNotEmpty()
  batchNumber!: string;

  @IsNumber()
  @Min(0.1)
  equipmentRatingKva!: number;

  @IsNumber()
  preheatTempCelsius!: number;

  @IsNumber()
  @Min(0.1)
  preheatDurationHours!: number;

  @IsNumber()
  @Min(0.01)
  dryVacuumPressureMbar!: number;

  @IsNumber()
  @Min(1)
  vacuumDurationMinutes!: number;

  @IsNumber()
  resinBathTempCelsius!: number;

  @IsNumber()
  @Min(0.5)
  varnishSpecificGravity!: number;

  @IsNumber()
  @Min(1.0)
  varnishViscositySec!: number;

  @IsNumber()
  @Min(0.1)
  impregnationPressureBar!: number;

  @IsNumber()
  bakingTempCelsius!: number;

  @IsNumber()
  @Min(0.5)
  bakingCycleHours!: number;

  @IsNumber()
  @Min(0.01)
  insulationResistanceGigaOhms!: number;

  @IsString()
  @IsOptional()
  vpiProcessStatus?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
