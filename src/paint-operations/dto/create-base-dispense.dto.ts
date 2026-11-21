import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateBaseDispenseDto {
  @IsOptional()
  @IsString()
  dispenseTrackingNumber?: string;

  @IsNotEmpty({ message: 'Base tank ID is required' })
  @IsString()
  baseTankId!: string;

  @IsNotEmpty({ message: 'Base type is required' })
  @IsString()
  baseType!: string;

  @IsNotEmpty({ message: 'Dispenser machine ID is required' })
  @IsString()
  dispenserMachineId!: string;

  @IsNotEmpty({ message: 'Target volume in Liters is required' })
  @IsNumber({}, { message: 'Target volume must be a valid number' })
  @Min(0.1)
  targetVolumeLtr!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  colorantWhiteMl?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  colorantBlackMl?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  colorantYellowOxideMl?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  colorantRedOxideMl?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  colorantPhthaloBlueMl?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  colorantPhthaloGreenMl?: number;

  @IsOptional()
  @IsString()
  reconciliationStatus?: string;

  @IsOptional()
  @IsNumber()
  variancePercentage?: number;

  @IsOptional()
  @IsString()
  operatorNotes?: string;
}
