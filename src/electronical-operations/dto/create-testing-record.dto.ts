import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateElectricalTestingRecordDto {
  @IsString()
  @IsOptional()
  testReportNumber?: string;

  @IsString()
  @IsNotEmpty()
  pcbOrDeviceSerial!: string;

  @IsString()
  @IsNotEmpty()
  testRigId!: string;

  @IsNumber()
  voltageRangeVolts!: number;

  @IsNumber()
  currentConsumptionMilliAmps!: number;

  @IsNumber()
  @IsOptional()
  frequencyMhz?: number;

  @IsString()
  @IsNotEmpty()
  instrumentCalibrationCertId!: string;

  @IsString()
  @IsNotEmpty()
  calibrationCertValidUntil!: string;

  @IsBoolean()
  @IsOptional()
  isInstrumentCalibrated?: boolean;

  @IsString()
  @IsOptional()
  testResult?: string;

  @IsString()
  @IsOptional()
  defectLog?: string;

  @IsString()
  @IsOptional()
  clearanceCertificateNumber?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
