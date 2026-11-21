import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateExtrusionCalenderingLogDto {
  @IsOptional()
  @IsString()
  runNumber?: string;

  @IsNotEmpty({ message: 'Line type is required' })
  @IsString()
  lineType!: string;

  @IsNotEmpty({ message: 'Die profile code is required' })
  @IsString()
  dieProfileCode!: string;

  @IsNotEmpty({ message: 'Target thickness is required' })
  @IsNumber()
  @Min(0.1)
  @Max(50)
  targetThicknessMm!: number;

  @IsNotEmpty({ message: 'Actual thickness is required' })
  @IsNumber()
  @Min(0.1)
  @Max(50)
  actualThicknessMm!: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(2.0)
  gaugeToleranceMm?: number;

  @IsNotEmpty({ message: 'Temperature zone is required' })
  @IsNumber()
  @Min(40)
  @Max(180)
  temperatureZoneCelsius!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tensionKiloNewton?: number;

  @IsNotEmpty({ message: 'Roll stock number is required' })
  @IsString()
  rollStockNumber!: string;

  @IsNotEmpty({ message: 'Roll length is required' })
  @IsNumber()
  @Min(1)
  rollLengthMeters!: number;

  @IsNotEmpty({ message: 'Roll weight is required' })
  @IsNumber()
  @Min(1)
  rollWeightKg!: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  lineSpeedMpm?: number;

  @IsOptional()
  @IsString()
  complianceStatus?: string;

  @IsOptional()
  @IsString()
  operatorNotes?: string;
}
