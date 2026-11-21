import { IsString, IsNotEmpty, IsOptional, IsIn, IsNumber, Min } from 'class-validator';

export class CreateQualityCheckDto {
  @IsString()
  @IsNotEmpty({ message: 'Inspection type must be RAW_MATERIAL or FINISHED_PRODUCT' })
  @IsIn(['RAW_MATERIAL', 'FINISHED_PRODUCT'])
  type!: 'RAW_MATERIAL' | 'FINISHED_PRODUCT';

  @IsString()
  @IsNotEmpty({ message: 'Item code / SKU is required' })
  itemCode!: string;

  @IsString()
  @IsNotEmpty({ message: 'Item name is required' })
  itemName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Batch number is required' })
  batchNumber!: string;

  @IsNumber()
  @Min(0.01)
  lotSize!: number;

  @IsNumber()
  @Min(0.01)
  sampleSize!: number;

  @IsString()
  @IsNotEmpty({ message: 'Unit of measurement is required' })
  unit!: string;

  @IsString()
  @IsNotEmpty({ message: 'Inspection outcome status is required' })
  @IsIn(['PASS', 'FAIL', 'REWORK'])
  status!: 'PASS' | 'FAIL' | 'REWORK';

  @IsString()
  @IsOptional()
  defectCategory?: string;

  @IsNotEmpty({ message: 'Inspection parameter measurements and test results are required' })
  inspectionData!: any;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsString()
  @IsOptional()
  inspectorName?: string;
}
