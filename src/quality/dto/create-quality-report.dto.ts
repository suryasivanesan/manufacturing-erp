import { IsString, IsNotEmpty, IsOptional, IsIn, IsNumber, Min } from 'class-validator';

export class CreateQualityReportDto {
  @IsString()
  @IsNotEmpty({ message: 'Shift is required' })
  @IsIn(['MORNING', 'AFTERNOON', 'NIGHT', 'GENERAL'])
  shift!: string;

  @IsNumber()
  @Min(0)
  rawMaterialsIn!: number;

  @IsNumber()
  @Min(0)
  rawMaterialsUsed!: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  rawMaterialsRejected?: number;

  @IsNumber()
  @Min(0)
  finishedGoodsInspected!: number;

  @IsNumber()
  @Min(0)
  finishedGoodsOut!: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  finishedGoodsRejected?: number;

  @IsNumber()
  @Min(0)
  reworkIn!: number;

  @IsNumber()
  @Min(0)
  reworkOut!: number;

  @IsString()
  @IsOptional()
  summary?: string;
}
