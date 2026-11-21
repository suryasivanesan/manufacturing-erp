import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateRheologyTestDto {
  @IsOptional()
  @IsString()
  testId?: string;

  @IsNotEmpty({ message: 'Batch number is required' })
  @IsString()
  batchNumber!: string;

  @IsNotEmpty({ message: 'Product name is required' })
  @IsString()
  productName!: string;

  @IsNotEmpty({ message: 'Stormer Krebs Viscosity (KU) is required' })
  @IsNumber({}, { message: 'Krebs viscosity must be a valid number' })
  @Min(20)
  @Max(200)
  krebsViscosityKu!: number;

  @IsNotEmpty({ message: 'Density (g/mL) is required' })
  @IsNumber({}, { message: 'Density must be a valid number' })
  @Min(0.5)
  @Max(3.0)
  densityGml!: number;

  @IsNotEmpty({ message: 'Hegman gauge fineness (microns) is required' })
  @IsNumber({}, { message: 'Hegman fineness must be a valid number' })
  @Min(0)
  @Max(150)
  hegmanFinenessMicrons!: number;

  @IsNotEmpty({ message: 'Touch dry time in minutes is required' })
  @IsNumber({}, { message: 'Touch dry minutes must be a valid number' })
  @Min(1)
  touchDryMinutes!: number;

  @IsNotEmpty({ message: 'Hard dry time in minutes is required' })
  @IsNumber({}, { message: 'Hard dry minutes must be a valid number' })
  @Min(1)
  hardDryMinutes!: number;

  @IsOptional()
  @IsNumber()
  glossLevel60Deg?: number;

  @IsOptional()
  @IsBoolean()
  packagingCleared?: boolean;

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsOptional()
  @IsString()
  qaChemistNotes?: string;
}
