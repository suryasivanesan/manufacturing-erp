import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateReactorCycleDto {
  @IsOptional()
  @IsString()
  batchCode?: string;

  @IsNotEmpty({ message: 'Reactor identifier is required' })
  @IsString()
  reactorId!: string;

  @IsNotEmpty({ message: 'Product name is required' })
  @IsString()
  productName!: string;

  @IsOptional()
  @IsString()
  currentStage?: string;

  @IsNotEmpty({ message: 'Target yield in kg is required' })
  @IsNumber({}, { message: 'Target yield must be a valid number' })
  @Min(0.01, { message: 'Target yield must be greater than zero' })
  targetYieldKg!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  actualYieldKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  steamConsumptionKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  coolingWaterM3?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  powerConsumptionKwh?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  downtimeHours?: number;

  @IsOptional()
  @IsString()
  downtimeReason?: string;

  @IsOptional()
  @IsString()
  stageRemarks?: string;
}
