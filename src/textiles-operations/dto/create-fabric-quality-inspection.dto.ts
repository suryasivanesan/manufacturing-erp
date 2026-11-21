import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';

export class CreateFabricQualityInspectionDto {
  @IsString()
  @IsNotEmpty({ message: 'Fabric roll number is required' })
  fabricRollNumber!: string;

  @IsString()
  @IsNotEmpty({ message: 'Fabric construction description is required' })
  fabricConstruction!: string;

  @IsNumber()
  @Min(1, { message: 'Inspected length must be at least 1 meter' })
  inspectedLengthMeters!: number;

  @IsNumber()
  @Min(1, { message: 'Fabric width in inches must be at least 1' })
  widthInches!: number;

  @IsNumber()
  @Min(1, { message: 'Measured GSM must be greater than 0' })
  measuredGsm!: number;

  @IsNumber()
  @Min(1, { message: 'Target GSM must be greater than 0' })
  targetGsm!: number;

  @IsNumber()
  @Min(0, { message: 'Warp shrinkage cannot be negative' })
  warpShrinkagePct!: number;

  @IsNumber()
  @Min(0, { message: 'Weft shrinkage cannot be negative' })
  weftShrinkagePct!: number;

  @IsNumber()
  @Min(0, { message: '4-Point defect score cannot be negative' })
  fourPointDefectScore!: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  maxAllowableDefectScore?: number;

  @IsNumber()
  @Min(1, { message: 'Color fastness rating minimum is 1' })
  @Max(5, { message: 'Color fastness rating maximum is 5' })
  colorFastnessRating!: number;

  @IsString()
  @IsOptional()
  inspectionResult?: string; // PASSED, SECONDS_GRADE, REJECTED

  @IsBoolean()
  @IsOptional()
  dispatchBlocked?: boolean;

  @IsString()
  @IsOptional()
  qualityCertificateNumber?: string;

  @IsString()
  @IsOptional()
  certifiedByRole?: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}
