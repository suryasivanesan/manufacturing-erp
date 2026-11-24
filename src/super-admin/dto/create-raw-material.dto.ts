import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateRawMaterialDto {
  @IsString()
  @IsOptional()
  materialCode?: string;

  @IsString()
  @IsNotEmpty({ message: 'Material name is required' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  category!: string;

  @IsNumber()
  @Min(0, { message: 'Cost price must be non-negative' })
  costPrice!: number;

  @IsNumber()
  @Min(0, { message: 'Selling / valuation price must be non-negative' })
  sellingPrice!: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  rate?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  unitPrice?: number;

  @IsString()
  @IsNotEmpty({ message: 'Unit of measurement is required' })
  unit!: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  currentStock?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  reorderLevel?: number;

  @IsString()
  @IsOptional()
  supplierName?: string;

  @IsString()
  @IsOptional()
  storageLocation?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
