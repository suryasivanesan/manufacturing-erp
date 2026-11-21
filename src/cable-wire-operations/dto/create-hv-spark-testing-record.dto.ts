import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsInt, IsBoolean } from 'class-validator';

export class CreateHvSparkTestingRecordDto {
  @IsString()
  @IsNotEmpty({ message: 'Drum or spool serial number is required' })
  drumOrSpoolNumber!: string;

  @IsString()
  @IsNotEmpty({ message: 'Cable specification is required' })
  cableSpecification!: string;

  @IsNumber()
  @Min(1, { message: 'Cable length is required' })
  cableLengthMeters!: number;

  @IsNumber()
  @Min(1, { message: 'Test speed is required' })
  testSpeedMpm!: number;

  @IsNumber()
  @Min(0.5, { message: 'Applied spark test voltage is required' })
  appliedSparkVoltageKv!: number;

  @IsInt()
  @Min(0, { message: 'Spark fault count cannot be negative' })
  sparkFaultCount!: number;

  @IsString()
  @IsOptional()
  faultLocationsMeterMarks?: string;

  @IsNumber()
  @Min(0.001, { message: 'Conductor DC resistance is required' })
  conductorDcResistanceOhmPerKm!: number;

  @IsNumber()
  @Min(0.001, { message: 'Maximum permitted DC resistance is required' })
  maxPermittedResistanceOhmPerKm!: number;

  @IsNumber()
  @IsOptional()
  meterMarkingInitial?: number;

  @IsNumber()
  @IsOptional()
  meterMarkingFinal?: number;

  @IsBoolean()
  @IsOptional()
  meterMarkingAccuracyCalibrated?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}
