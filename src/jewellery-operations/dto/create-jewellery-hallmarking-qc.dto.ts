import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max, IsBoolean } from 'class-validator';

export class CreateJewelleryHallmarkingQcDto {
  @IsString()
  @IsNotEmpty({ message: 'QC report number is required' })
  qcReportNumber!: string;

  @IsString()
  @IsNotEmpty({ message: 'Product serial number is required' })
  productSerialNumber!: string;

  @IsString()
  @IsNotEmpty({ message: 'Item description is required' })
  itemDescription!: string;

  @IsNumber()
  @Min(0.01, { message: 'Gross weight must be greater than 0' })
  grossWeightGrams!: number;

  @IsNumber()
  @Min(0.01, { message: 'Net gold weight must be greater than 0' })
  netGoldWeightGrams!: number;

  @IsString()
  @IsNotEmpty({ message: 'Metal purity tested is required' })
  metalPurityTested!: string; // 22KT_916, 18KT_750, etc.

  @IsNumber()
  @Min(1, { message: 'XRF spectrometer purity % must be at least 1%' })
  @Max(100, { message: 'XRF spectrometer purity % cannot exceed 100%' })
  xrfSpectrometerPurityPct!: number;

  @IsNumber()
  @IsOptional()
  diamondCaratWeight?: number;

  @IsString()
  @IsOptional()
  diamondClarityGrade?: string; // FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2

  @IsString()
  @IsOptional()
  diamondColorGrade?: string; // D, E, F, G, H, I, J

  @IsString()
  @IsOptional()
  diamondCutGrade?: string; // EXCELLENT, VERY_GOOD, GOOD

  @IsString()
  @IsOptional()
  gemstoneLabCertificationId?: string;

  @IsString()
  @IsNotEmpty({ message: 'BIS Hallmark Laser HUID is required' })
  bisHallmarkLaserHuid!: string; // 6-digit alphanumeric

  @IsBoolean()
  @IsOptional()
  laserEngravingVerified?: boolean;

  @IsString()
  @IsOptional()
  certificateOfAuthenticityNumber?: string;

  @IsString()
  @IsOptional()
  coaIssuedAt?: string;

  @IsString()
  @IsOptional()
  certifiedByManager?: string;

  @IsString()
  @IsOptional()
  qcStatus?: string; // PENDING_XRF, XRF_PASSED, BIS_HUID_ENGRAVED, HALLMARKED_AND_CERTIFIED, PURITY_REJECTED

  @IsBoolean()
  @IsOptional()
  dispatchBlocked?: boolean;

  @IsString()
  @IsOptional()
  inspectorRemarks?: string;
}
