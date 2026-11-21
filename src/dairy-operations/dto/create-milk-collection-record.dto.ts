import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateMilkCollectionRecordDto {
  @IsString()
  @IsNotEmpty({ message: 'Collection code is required' })
  collectionCode!: string;

  @IsString()
  @IsNotEmpty({ message: 'Tanker registration number is required' })
  tankerRegistrationNumber!: string;

  @IsString()
  @IsNotEmpty({ message: 'Supplier or farmer group is required' })
  supplierOrFarmerGroup!: string;

  @IsString()
  @IsOptional()
  driverName?: string;

  @IsNumber()
  @Min(1000, { message: 'Gross weight must be at least 1,000 kg' })
  grossWeightKg!: number;

  @IsNumber()
  @Min(500, { message: 'Tare weight must be at least 500 kg' })
  tareWeightKg!: number;

  @IsNumber()
  @IsOptional()
  netWeightKg?: number;

  @IsNumber()
  @IsOptional()
  netVolumeLiters?: number;

  @IsNumber()
  @Min(1.0, { message: 'Fat percentage must be at least 1.0%' })
  @Max(15.0, { message: 'Fat percentage cannot exceed 15.0%' })
  fatPercentage!: number;

  @IsNumber()
  @Min(5.0, { message: 'Solids-not-fat percentage must be at least 5.0%' })
  @Max(12.0, { message: 'Solids-not-fat percentage cannot exceed 12.0%' })
  snfPercentage!: number;

  @IsNumber()
  @IsOptional()
  @Min(0.0)
  @Max(50.0)
  addedWaterPercentage?: number;

  @IsNumber()
  @Min(1.010, { message: 'Milk density must be at least 1.010 g/ml' })
  @Max(1.040, { message: 'Milk density cannot exceed 1.040 g/ml' })
  milkDensity!: number;

  @IsNumber()
  @Min(0.0, { message: 'Milk temperature cannot be negative' })
  @Max(25.0, { message: 'Milk temperature cannot exceed 25.0°C' })
  milkTemperatureCelsius!: number;

  @IsString()
  @IsOptional()
  paymentGradeStatus?: string; // GRADE_A_PREMIUM, GRADE_B_STANDARD, CONDITIONAL_APPROVAL, REJECTED_SOUR

  @IsNumber()
  @Min(10.0, { message: 'Rate per liter must be at least 10 INR' })
  ratePerLiterInr!: number;

  @IsNumber()
  @IsOptional()
  totalPaymentInr?: number;

  @IsString()
  @IsNotEmpty({ message: 'Chilling silo ID is required' })
  chillingSiloId!: string;

  @IsNumber()
  @Min(0.0)
  @Max(10.0)
  siloTemperatureCelsius!: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  operatorNotes?: string;
}
