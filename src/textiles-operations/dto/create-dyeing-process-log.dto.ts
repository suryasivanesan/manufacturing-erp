import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateDyeingProcessLogDto {
  @IsString()
  @IsNotEmpty({ message: 'Dyeing machine identifier is required' })
  dyeMachineId!: string;

  @IsString()
  @IsOptional()
  fabricRollsListJson?: string;

  @IsNumber()
  @Min(1, { message: 'Fabric length must be at least 1 meter' })
  fabricLengthMeters!: number;

  @IsNumber()
  @Min(0.1, { message: 'Fabric weight must be at least 0.1 kg' })
  fabricWeightKg!: number;

  @IsString()
  @IsNotEmpty({ message: 'Dye recipe code is required' })
  dyeRecipeCode!: string;

  @IsString()
  @IsOptional()
  dyestuffComponentsJson?: string;

  @IsString()
  @IsOptional()
  liquorRatio?: string;

  @IsNumber()
  @Min(20, { message: 'Machine temperature must be at least 20°C' })
  machineTempCelsius!: number;

  @IsNumber()
  @Min(0, { message: 'Chamber pressure cannot be negative' })
  chamberPressureBar!: number;

  @IsNumber()
  @Min(1, { message: 'Cycle duration must be at least 1 minute' })
  cycleDurationMinutes!: number;

  @IsNumber()
  @Min(1, { message: 'pH level must be at least 1' })
  @Max(14, { message: 'pH level cannot exceed 14' })
  phLevel!: number;

  @IsString()
  @IsNotEmpty({ message: 'Target shade code or Pantone is required' })
  targetShadeCode!: string;

  @IsNumber()
  @Min(0, { message: 'Delta E variance cannot be negative' })
  deltaEColorDeviation!: number;

  @IsString()
  @IsOptional()
  shadeApprovalStatus?: string;

  @IsString()
  @IsOptional()
  shadeApprovedBy?: string;

  @IsString()
  @IsOptional()
  operatorNotes?: string;
}
