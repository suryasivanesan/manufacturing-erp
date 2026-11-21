import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateKdPackagingKittingRecordDto {
  @IsString()
  @IsNotEmpty({ message: 'Kitting packing code is required' })
  kittingPackingCode!: string;

  @IsString()
  @IsNotEmpty({ message: 'Product SKU is required' })
  productSku!: string;

  @IsString()
  @IsNotEmpty({ message: 'Furniture title is required' })
  furnitureTitle!: string;

  @IsBoolean()
  @IsOptional()
  assemblyInstructionSheetIncluded?: boolean;

  @IsString()
  @IsNotEmpty({ message: 'Hardware blister pack code is required' })
  hardwareBlisterPackCode!: string;

  @IsBoolean()
  @IsOptional()
  hardwareScrewCountVerified?: boolean;

  @IsNumber()
  @Min(150, { message: 'Corrugated box GSM must be at least 150 GSM' })
  corrugatedBoxGsm!: number;

  @IsString()
  @IsNotEmpty({ message: 'Edge/corner protector type is required' })
  edgeCornerProtectorType!: string;

  @IsNumber()
  @Min(500, { message: 'Carton bursting strength must be at least 500 kPa' })
  cartonBurstingStrengthKpa!: number;

  @IsString()
  @IsNotEmpty({ message: 'Drop test standard is required' })
  dropTestStandard!: string; // ISTA_1A_10_DROPS_PASSED, ISTA_3A_PARCEL_DELIVERY_PASS, FAILED_CORNER_IMPACT

  @IsNumber()
  @Min(10, { message: 'Drop height must be at least 10 inches' })
  dropHeightInches!: number;

  @IsBoolean()
  @IsOptional()
  dropTestPassed?: boolean;

  @IsNumber()
  @Min(1, { message: 'Gross carton weight must be at least 1 kg' })
  grossCartonWeightKg!: number;

  @IsString()
  @IsNotEmpty({ message: 'Carton dimensions in mm are required' })
  cartonDimensionsMm!: string;

  @IsString()
  @IsNotEmpty({ message: 'Shipping barcode is required' })
  shippingBarcode!: string;

  @IsString()
  @IsOptional()
  assemblyClearancePassNumber?: string;

  @IsString()
  @IsOptional()
  certifiedByManager?: string;

  @IsBoolean()
  @IsOptional()
  dispatchBlocked?: boolean;

  @IsString()
  @IsOptional()
  packagingStatus?: string;

  @IsString()
  @IsOptional()
  inspectorNotes?: string;
}
