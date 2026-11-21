import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
} from 'class-validator';

export class CreateHvRoutineTestingRecordDto {
  @IsString()
  @IsOptional()
  testReportNumber?: string;

  @IsString()
  @IsNotEmpty()
  unitSerialNumber!: string;

  @IsString()
  @IsOptional()
  equipmentType?: string; // POWER_TRANSFORMER, DISTRIBUTION_TRANSFORMER, MV_SWITCHGEAR, HT_INDUCTION_MOTOR

  @IsNumber()
  @Min(0.1)
  ratedVoltageKv!: number;

  @IsNumber()
  @Min(0.1)
  appliedHighVoltageKv!: number;

  @IsNumber()
  @Min(0.01)
  leakageCurrentMilliAmps!: number;

  @IsNumber()
  @Min(0.1)
  insulationResistanceMegohms!: number;

  @IsNumber()
  @IsOptional()
  breakdownVoltageKv?: number;

  @IsNumber()
  @Min(0)
  partialDischargePicoCoulombs!: number;

  @IsBoolean()
  @IsOptional()
  isInstrumentCalibrated?: boolean;

  @IsString()
  @IsNotEmpty()
  calibrationCertId!: string;

  @IsString()
  @IsNotEmpty()
  calibrationValidUntil!: string;

  @IsBoolean()
  @IsOptional()
  dispatchBlocked?: boolean;

  @IsString()
  @IsOptional()
  clearanceStatus?: string;

  @IsString()
  @IsOptional()
  certificateNumber?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
