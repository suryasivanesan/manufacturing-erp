import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateDispersionBatchDto {
  @IsOptional()
  @IsString()
  batchCode?: string;

  @IsNotEmpty({ message: 'Mill ID is required' })
  @IsString()
  millId!: string;

  @IsNotEmpty({ message: 'Product name is required' })
  @IsString()
  productName!: string;

  @IsNotEmpty({ message: 'Resin type is required' })
  @IsString()
  resinType!: string;

  @IsNotEmpty({ message: 'Pigment type is required' })
  @IsString()
  pigmentType!: string;

  @IsNotEmpty({ message: 'Target viscosity is required' })
  @IsNumber({}, { message: 'Target viscosity must be a valid number' })
  @Min(10)
  targetViscosityKu!: number;

  @IsNotEmpty({ message: 'Current viscosity is required' })
  @IsNumber({}, { message: 'Current viscosity must be a valid number' })
  @Min(10)
  currentViscosityKu!: number;

  @IsOptional()
  @IsBoolean()
  loadingSequenceCompleted?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  grindingDurationMinutes?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  beadMillRunHours?: number;

  @IsOptional()
  @IsNumber()
  coolingWaterTempCelsius?: number;

  @IsOptional()
  @IsString()
  dispersionStatus?: string;

  @IsOptional()
  @IsString()
  operatorNotes?: string;
}
