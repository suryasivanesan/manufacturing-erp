import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTyreBuildingRecordDto {
  @IsOptional()
  @IsString()
  buildBarcode?: string;

  @IsNotEmpty({ message: 'Tyre size pattern is required' })
  @IsString()
  tyreSizePattern!: string;

  @IsNotEmpty({ message: 'Building machine ID is required' })
  @IsString()
  buildingMachineId!: string;

  @IsOptional()
  @IsString()
  assemblyStage?: string;

  @IsNotEmpty({ message: 'BOM recipe ID is required' })
  @IsString()
  bomRecipeId!: string;

  @IsOptional()
  @IsString()
  innerLinerLot?: string;

  @IsOptional()
  @IsString()
  carcassPlyLot?: string;

  @IsOptional()
  @IsString()
  steelBeltLot?: string;

  @IsOptional()
  @IsString()
  treadExtrusionLot?: string;

  @IsOptional()
  @IsString()
  beadAssemblyLot?: string;

  @IsNotEmpty({ message: 'Green tyre weight is required' })
  @IsNumber()
  @Min(0.5)
  greenTyreWeightKg!: number;

  @IsOptional()
  @IsString()
  wipLocationBay?: string;

  @IsOptional()
  @IsString()
  inspectionStatus?: string;

  @IsOptional()
  @IsString()
  operatorId?: string;
}
