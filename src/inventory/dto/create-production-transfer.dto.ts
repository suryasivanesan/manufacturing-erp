import { IsString, IsNotEmpty, IsOptional, IsIn, IsNumber, Min } from 'class-validator';

export class CreateProductionTransferDto {
  @IsString()
  @IsNotEmpty({ message: 'Transfer type is required' })
  @IsIn(['ISSUE_TO_PRODUCTION', 'RECEIPT_FROM_PRODUCTION'])
  transferType!: 'ISSUE_TO_PRODUCTION' | 'RECEIPT_FROM_PRODUCTION';

  @IsString()
  @IsNotEmpty({ message: 'Production Line / Station is required' })
  lineId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Item code is required' })
  itemCode!: string;

  @IsString()
  @IsNotEmpty({ message: 'Item name is required' })
  itemName!: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  rawMaterialIssuedQty?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  finishedGoodsReceivedQty?: number;

  @IsString()
  @IsNotEmpty({ message: 'Unit of measurement is required' })
  unit!: string;

  @IsNumber()
  @Min(0)
  unitValue!: number;

  @IsString()
  @IsOptional()
  batchNumber?: string;

  @IsString()
  @IsOptional()
  handlerName?: string;
}
