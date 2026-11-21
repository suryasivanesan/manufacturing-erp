import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateThermalInspectionDto {
  @IsNotEmpty({ message: 'Inspection lot number is required' })
  @IsString()
  lotNumber!: string;

  @IsNotEmpty({ message: 'Product type description is required' })
  @IsString()
  productType!: string;

  @IsOptional()
  @IsInt({ message: 'Inspected sample count must be an integer' })
  @Min(1, { message: 'Sample count must be at least 1' })
  inspectedSampleCount?: number;

  @IsOptional()
  @IsInt({ message: 'Bubbles/seeds count must be an integer' })
  @Min(0, { message: 'Defect count cannot be negative' })
  defectBubblesSeeds?: number;

  @IsOptional()
  @IsInt({ message: 'Pinholes/stones count must be an integer' })
  @Min(0, { message: 'Defect count cannot be negative' })
  defectPinholesStones?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Warping deviation must be a valid number' })
  @Min(0, { message: 'Warping deviation cannot be negative' })
  defectWarpingMm?: number;

  @IsNotEmpty({ message: 'Thermal shock test result (true/false) is required' })
  @IsBoolean()
  thermalShockTestPassed!: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'Thermal shock delta T must be a valid number' })
  thermalShockDeltaT?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Impact strength must be a valid number' })
  impactStrengthJoules?: number;

  @IsOptional()
  @IsString()
  lotStatus?: string;

  @IsOptional()
  @IsString()
  inspectorNotes?: string;
}
