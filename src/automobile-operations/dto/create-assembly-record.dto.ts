import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateVehicleAssemblyRecordDto {
  @IsString()
  @IsOptional()
  buildOrderNumber?: string;

  @IsString()
  @IsNotEmpty()
  modelName!: string;

  @IsString()
  @IsNotEmpty()
  variantCode!: string;

  @IsString()
  @IsNotEmpty()
  colorVariant!: string;

  @IsString()
  @IsOptional()
  currentAssemblyStation?: string;

  @IsNumber()
  @Min(1)
  stationCycleTimeSeconds!: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  taktTimeTargetSeconds?: number;

  @IsNumber()
  @IsOptional()
  cycleVarianceSeconds?: number;

  @IsString()
  @IsNotEmpty()
  engineOrMotorSerialNumber!: string;

  @IsString()
  @IsNotEmpty()
  transmissionOrGearboxSerial!: string;

  @IsString()
  @IsNotEmpty()
  highVoltageBatteryPackSerial!: string;

  @IsString()
  @IsNotEmpty()
  axleSubassemblySerial!: string;

  @IsString()
  @IsOptional()
  workInProgressStage?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  dailyOutputSequence?: number;

  @IsString()
  @IsOptional()
  assemblyTechnicianNotes?: string;
}
