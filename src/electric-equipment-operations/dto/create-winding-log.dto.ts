import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
} from 'class-validator';

export class CreateCoilWindingLogDto {
  @IsString()
  @IsOptional()
  windingLogCode?: string;

  @IsString()
  @IsNotEmpty()
  workOrderNumber!: string;

  @IsString()
  @IsNotEmpty()
  coilPartNumber!: string;

  @IsNumber()
  @Min(0.1)
  transformerOrMotorRatingKva!: number;

  @IsString()
  @IsNotEmpty()
  wireGaugeSwgOrMm!: string;

  @IsString()
  @IsOptional()
  conductorMaterial?: string; // COPPER, ALUMINUM

  @IsNumber()
  @Min(0.01)
  conductorWeightKg!: number;

  @IsNumber()
  @Min(1)
  calculatedTurnsTarget!: number;

  @IsNumber()
  @Min(1)
  actualTurnsCount!: number;

  @IsNumber()
  @Min(0)
  windingMachineCounterReading!: number;

  @IsNumber()
  @Min(0)
  interTurnSurgeTestVoltageKv!: number;

  @IsBoolean()
  @IsOptional()
  interTurnInsulationTestPassed?: boolean;

  @IsString()
  @IsNotEmpty()
  windingMachineId!: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
