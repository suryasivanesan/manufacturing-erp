import { IsNotEmpty, IsNumber, IsOptional, IsString, IsBoolean, Min, Max } from 'class-validator';

export class CreateLabTestDto {
  @IsOptional()
  @IsString()
  testId?: string;

  @IsNotEmpty({ message: 'Batch number is required' })
  @IsString()
  batchNumber!: string;

  @IsNotEmpty({ message: 'Product name is required' })
  @IsString()
  productName!: string;

  @IsOptional()
  @IsString()
  sampleSource?: string;

  @IsNotEmpty({ message: 'Purity percentage is required' })
  @IsNumber({}, { message: 'Purity must be a number' })
  @Min(0, { message: 'Purity cannot be negative' })
  @Max(100, { message: 'Purity cannot exceed 100%' })
  purityPercent!: number;

  @IsNotEmpty({ message: 'pH level is required' })
  @IsNumber({}, { message: 'pH must be a valid number' })
  @Min(0, { message: 'pH cannot be less than 0' })
  @Max(14, { message: 'pH cannot exceed 14' })
  phLevel!: number;

  @IsNotEmpty({ message: 'Moisture/Water content percentage is required' })
  @IsNumber({}, { message: 'Moisture content must be a number' })
  @Min(0, { message: 'Moisture cannot be negative' })
  moistureWaterPercent!: number;

  @IsOptional()
  @IsNumber()
  densityGml?: number;

  @IsOptional()
  @IsBoolean()
  testPassed?: boolean;

  @IsOptional()
  @IsBoolean()
  dispatchCleared?: boolean;

  @IsOptional()
  @IsString()
  chemistNotes?: string;
}
