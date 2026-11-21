import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateDangerousGoodsDto {
  @IsOptional()
  @IsString()
  dispatchTrackingNumber?: string;

  @IsNotEmpty({ message: 'Batch number is required' })
  @IsString()
  batchNumber!: string;

  @IsNotEmpty({ message: 'Product name is required' })
  @IsString()
  productName!: string;

  @IsOptional()
  @IsString()
  unNumber?: string;

  @IsNotEmpty({ message: 'Proper shipping name is required' })
  @IsString()
  properShippingName!: string;

  @IsOptional()
  @IsString()
  hazardClass?: string;

  @IsOptional()
  @IsString()
  packingGroup?: string;

  @IsOptional()
  @IsString()
  hazchemCode?: string;

  @IsOptional()
  @IsBoolean()
  tremcardIssued?: boolean;

  @IsNotEmpty({ message: 'Vehicle registration number is required' })
  @IsString()
  vehicleRegistrationNumber!: string;

  @IsNotEmpty({ message: 'Driver name is required' })
  @IsString()
  driverName!: string;

  @IsNotEmpty({ message: 'Driver license number is required' })
  @IsString()
  driverLicenseNumber!: string;

  @IsOptional()
  @IsBoolean()
  driverHazmatEndorsementValid?: boolean;

  @IsOptional()
  @IsString()
  statutoryTransitPermitNumber?: string;

  @IsOptional()
  @IsString()
  routeClearanceStatus?: string;

  @IsOptional()
  @IsString()
  dispatchNotes?: string;
}
