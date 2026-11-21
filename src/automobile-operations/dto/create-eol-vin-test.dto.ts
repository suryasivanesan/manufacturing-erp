import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateEolVinTestingRecordDto {
  @IsString()
  @IsOptional()
  vin?: string;

  @IsString()
  @IsNotEmpty()
  buildOrderNumber!: string;

  @IsString()
  @IsNotEmpty()
  modelName!: string;

  @IsBoolean()
  @IsOptional()
  wheelAlignmentPassed?: boolean;

  @IsString()
  @IsNotEmpty()
  camberToeAngleValues!: string;

  @IsNumber()
  @Min(0)
  dynoRollSpeedKmph!: number;

  @IsNumber()
  @Min(0)
  dynoBrakeEfficiencyPct!: number;

  @IsBoolean()
  @IsOptional()
  absEbdDecelerationPassed?: boolean;

  @IsBoolean()
  @IsOptional()
  adasCameraRadarCalibrated?: boolean;

  @IsBoolean()
  @IsOptional()
  waterIngressShowerPassed?: boolean;

  @IsString()
  @IsNotEmpty()
  ecuFirmwareVersionFlashing!: string;

  @IsBoolean()
  @IsOptional()
  engineOrMotorSerialMatched?: boolean;

  @IsBoolean()
  @IsOptional()
  batteryPackSerialMatched?: boolean;

  @IsBoolean()
  @IsOptional()
  transmissionSerialMatched?: boolean;

  @IsBoolean()
  @IsOptional()
  statutoryTraceabilityCertified?: boolean;

  @IsString()
  @IsOptional()
  eolStatus?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
