import { IsString, IsNotEmpty, IsOptional, IsIn, IsNumber, Min } from 'class-validator';

export class CreateWarehouseStorageDto {
  @IsString()
  @IsOptional()
  storageCode?: string;

  @IsString()
  @IsNotEmpty({ message: 'Storage type must be RAW_MATERIAL or FINISHED_GOODS' })
  @IsIn(['RAW_MATERIAL', 'FINISHED_GOODS'])
  type!: 'RAW_MATERIAL' | 'FINISHED_GOODS';

  @IsString()
  @IsNotEmpty({ message: 'Item code / SKU is required' })
  itemCode!: string;

  @IsString()
  @IsNotEmpty({ message: 'Item name is required' })
  itemName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Storage location (Bay, Bin, Silo) is required' })
  location!: string;

  @IsNumber()
  @Min(0)
  quantity!: number;

  @IsString()
  @IsNotEmpty({ message: 'Unit of measurement is required' })
  unit!: string;

  @IsNumber()
  @Min(0)
  unitValue!: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minLevel?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxLevel?: number;
}
