import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateInventoryReportDto {
  @IsString()
  @IsNotEmpty({ message: 'Report period is required' })
  period!: string; // DAILY, SHIFT_MORNING, SHIFT_AFTERNOON, SHIFT_NIGHT, WEEKLY

  @IsNumber()
  @Min(0)
  rawMaterialsIn!: number;

  @IsNumber()
  @Min(0)
  rawMaterialsUsed!: number;

  @IsNumber()
  @Min(0)
  finishedGoodsOut!: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  scrapGenerated?: number;

  @IsString()
  @IsOptional()
  summary?: string;
}
