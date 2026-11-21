import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateShadeMasterDto {
  @IsOptional()
  @IsString()
  shadeCode?: string;

  @IsNotEmpty({ message: 'Shade name is required' })
  @IsString()
  shadeName!: string;

  @IsNotEmpty({ message: 'Color family is required' })
  @IsString()
  colorFamily!: string;

  @IsOptional()
  @IsString()
  baseTypeRequired?: string;

  @IsNotEmpty({ message: 'Spectrophotometer L* value is required' })
  @IsNumber({}, { message: 'L* must be a valid number' })
  @Min(0, { message: 'L* cannot be less than 0' })
  @Max(100, { message: 'L* cannot exceed 100' })
  spectroL!: number;

  @IsNotEmpty({ message: 'Spectrophotometer a* value is required' })
  @IsNumber({}, { message: 'a* must be a valid number' })
  @Min(-128)
  @Max(127)
  spectroA!: number;

  @IsNotEmpty({ message: 'Spectrophotometer b* value is required' })
  @IsNumber({}, { message: 'b* must be a valid number' })
  @Min(-128)
  @Max(127)
  spectroB!: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(5.0)
  targetDeltaETolerance?: number;

  @IsOptional()
  @IsString()
  customTintingFormulaJson?: string;

  @IsOptional()
  @IsBoolean()
  formulaApproved?: boolean;

  @IsOptional()
  @IsString()
  status?: string;
}
