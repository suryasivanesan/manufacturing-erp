import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateBatchFormulaDto {
  @IsOptional()
  @IsString()
  formulaCode?: string;

  @IsNotEmpty({ message: 'Batch formula name is required' })
  @IsString()
  batchName!: string;

  @IsNotEmpty({ message: 'Glass/Ceramic type is required' })
  @IsString()
  glassType!: string;

  @IsNotEmpty({ message: 'Silica sand weight is required' })
  @IsNumber({}, { message: 'Silica sand weight must be a valid number' })
  @Min(0, { message: 'Silica sand weight cannot be negative' })
  silicaSandWeight!: number;

  @IsNotEmpty({ message: 'Soda ash weight is required' })
  @IsNumber({}, { message: 'Soda ash weight must be a valid number' })
  @Min(0, { message: 'Soda ash weight cannot be negative' })
  sodaAshWeight!: number;

  @IsNotEmpty({ message: 'Limestone weight is required' })
  @IsNumber({}, { message: 'Limestone weight must be a valid number' })
  @Min(0, { message: 'Limestone weight cannot be negative' })
  limestoneWeight!: number;

  @IsOptional()
  @IsNumber({}, { message: 'Feldspar weight must be a valid number' })
  @Min(0, { message: 'Feldspar weight cannot be negative' })
  feldsparWeight?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Dolomite weight must be a valid number' })
  @Min(0, { message: 'Dolomite weight cannot be negative' })
  dolomiteWeight?: number;

  @IsNotEmpty({ message: 'Cullet recycled weight is required' })
  @IsNumber({}, { message: 'Cullet weight must be a valid number' })
  @Min(0, { message: 'Cullet weight cannot be negative' })
  culletWeight!: number;

  @IsOptional()
  @IsString()
  siloHopperLevels?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
