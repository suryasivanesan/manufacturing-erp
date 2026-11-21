import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePackagingComplianceDto {
  @IsOptional()
  @IsString()
  packLotNumber?: string;

  @IsNotEmpty({ message: 'Batch number is required' })
  @IsString()
  batchNumber!: string;

  @IsNotEmpty({ message: 'Product name is required' })
  @IsString()
  productName!: string;

  @IsNotEmpty({ message: 'Container size is required (e.g. 1L, 4L, 10L, 20L)' })
  @IsString()
  containerSize!: string;

  @IsNotEmpty({ message: 'Container type is required (e.g. TIN_CAN, HDPE_BUCKET, STEEL_DRUM)' })
  @IsString()
  containerType!: string;

  @IsNotEmpty({ message: 'Quantity of containers is required' })
  @IsNumber({}, { message: 'Quantity must be a valid number' })
  @Min(1)
  quantityContainers!: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  shelfLifeMonths?: number;

  @IsNotEmpty({ message: 'Batch code printed imprint is required' })
  @IsString()
  batchCodePrinted!: string;

  @IsNotEmpty({ message: 'VOC content in g/L is required' })
  @IsNumber({}, { message: 'VOC content must be a valid number' })
  @Min(0)
  vocContentGramsPerLiter!: number;

  @IsOptional()
  @IsBoolean()
  antiStaticBondingVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  flammableSolventPermitValid?: boolean;

  @IsOptional()
  @IsString()
  warehouseLocationBay?: string;

  @IsOptional()
  @IsString()
  complianceSignOff?: string;
}
