import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class DraftRawMaterialEditDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  costPrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  sellingPrice?: number;

  @IsString()
  @IsOptional()
  unit?: string;

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
  @IsNotEmpty({ message: 'Justification / business reason is mandatory for executive modification requests.' })
  reason!: string;
}

export class DraftProductEditDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  costPrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  sellingPrice?: number;

  @IsString()
  @IsOptional()
  unit?: string;

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
  status?: string;

  @IsString()
  @IsNotEmpty({ message: 'Justification / business reason is mandatory for executive modification requests.' })
  reason!: string;
}
