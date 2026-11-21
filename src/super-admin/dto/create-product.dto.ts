import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  category!: string;

  @IsNumber()
  @Min(0, { message: 'Cost price must be non-negative' })
  costPrice!: number;

  @IsNumber()
  @Min(0, { message: 'Selling price must be non-negative' })
  sellingPrice!: number;

  @IsString()
  @IsNotEmpty({ message: 'Unit is required' })
  unit!: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  currentStock?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minStockLevel?: number;

  @IsString()
  @IsOptional()
  hsnCode?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
