import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePipeExtrusionLogDto {
  @IsOptional()
  @IsString()
  logNumber?: string;

  @IsNotEmpty({ message: 'Line ID is required' })
  @IsString()
  lineId!: string;

  @IsNotEmpty({ message: 'Pipe diameter is required' })
  @IsNumber()
  @Min(10)
  pipeDiameterMm!: number;

  @IsNotEmpty({ message: 'Pressure class is required' })
  @IsString()
  pressureClass!: string;

  @IsOptional()
  @IsString()
  pipeMaterial?: string;

  @IsNotEmpty({ message: 'Barrel zone 1 temperature is required' })
  @IsNumber()
  barrelZone1TempCelsius!: number;

  @IsNotEmpty({ message: 'Barrel zone 2 temperature is required' })
  @IsNumber()
  barrelZone2TempCelsius!: number;

  @IsNotEmpty({ message: 'Barrel zone 3 temperature is required' })
  @IsNumber()
  barrelZone3TempCelsius!: number;

  @IsNotEmpty({ message: 'Barrel zone 4 temperature is required' })
  @IsNumber()
  barrelZone4TempCelsius!: number;

  @IsNotEmpty({ message: 'Die head temperature is required' })
  @IsNumber()
  dieHeadTempCelsius!: number;

  @IsNotEmpty({ message: 'Screw RPM is required' })
  @IsNumber()
  screwRpm!: number;

  @IsNotEmpty({ message: 'Haul-off speed (mpm) is required' })
  @IsNumber()
  haulOffSpeedMpm!: number;

  @IsNotEmpty({ message: 'Melt pressure (bar) is required' })
  @IsNumber()
  meltPressureBar!: number;

  @IsOptional()
  @IsNumber()
  meltTemperatureCelsius?: number;

  @IsOptional()
  @IsNumber()
  vacuumCalibrationTankBar?: number;

  @IsOptional()
  @IsString()
  shiftType?: string;

  @IsNotEmpty({ message: 'Shift output in kg is required' })
  @IsNumber()
  @Min(0)
  shiftOutputKg!: number;

  @IsNotEmpty({ message: 'Shift output in meters is required' })
  @IsNumber()
  @Min(0)
  shiftOutputMeters!: number;

  @IsNotEmpty({ message: 'Machinery run hours are required' })
  @IsNumber()
  @Min(0)
  machineryRunHours!: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  operatorNotes?: string;
}
