import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateBellingSocketingLogDto {
  @IsOptional()
  @IsString()
  cycleCode?: string;

  @IsNotEmpty({ message: 'Machine ID is required' })
  @IsString()
  machineId!: string;

  @IsOptional()
  @IsString()
  socketType?: string;

  @IsNotEmpty({ message: 'Pipe diameter is required' })
  @IsNumber()
  @Min(10)
  pipeDiameterMm!: number;

  @IsNotEmpty({ message: 'Heating oven temperature is required' })
  @IsNumber()
  heatingOvenTempCelsius!: number;

  @IsNotEmpty({ message: 'Forming time is required' })
  @IsNumber()
  @Min(1)
  formingTimeSeconds!: number;

  @IsNotEmpty({ message: 'Cooling time is required' })
  @IsNumber()
  @Min(1)
  coolingTimeSeconds!: number;

  @IsNotEmpty({ message: 'Total cycle time is required' })
  @IsNumber()
  @Min(1)
  totalCycleTimeSeconds!: number;

  @IsNotEmpty({ message: 'Rubber ring batch number is required' })
  @IsString()
  rubberRingBatchNumber!: string;

  @IsOptional()
  @IsString()
  rubberRingType?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  rubberRingsConsumed?: number;

  @IsNotEmpty({ message: 'Socket inner diameter is required' })
  @IsNumber()
  socketInnerDiameterMm!: number;

  @IsNotEmpty({ message: 'Socket depth is required' })
  @IsNumber()
  socketDepthMm!: number;

  @IsOptional()
  @IsBoolean()
  grooveRetentionTested?: boolean;

  @IsOptional()
  @IsBoolean()
  dimensionalAccuracyVerified?: boolean;

  @IsOptional()
  @IsString()
  cycleStatus?: string;

  @IsOptional()
  @IsString()
  operatorNotes?: string;
}
