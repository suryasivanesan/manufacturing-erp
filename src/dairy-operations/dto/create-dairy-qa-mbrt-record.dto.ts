import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';

export class CreateDairyQaMbrtRecordDto {
  @IsString()
  @IsNotEmpty({ message: 'Test report number is required' })
  testReportNumber!: string;

  @IsString()
  @IsNotEmpty({ message: 'Sample batch code is required' })
  sampleBatchCode!: string;

  @IsString()
  @IsNotEmpty({ message: 'Sample type is required' })
  sampleType!: string; // RAW_SILO_MILK, PASTEURIZED_PACKAGED, FERMENTED_CURD, BULK_TANKER_INWARD

  @IsNumber()
  @Min(0.1, { message: 'MBRT decolorization hours must be positive' })
  @Max(12.0)
  mbrtDecolorizationHours!: number;

  @IsString()
  @IsNotEmpty({ message: 'MBRT quality grade is required' })
  mbrtQualityGrade!: string; // EXCELLENT_OVER_5H, GOOD_3_4H, FAIR_1_2H, POOR_UNDER_30M

  @IsString()
  @IsNotEmpty({ message: 'Antibiotic residue test is required' })
  antibioticResidueTest!: string; // NEGATIVE_PASSED, POSITIVE_CONTAMINATED

  @IsNumber()
  @Min(0.0)
  @Max(5.0)
  aflatoxinM1Ppb!: number;

  @IsNumber()
  @Min(0)
  somaticCellCountPerMl!: number;

  @IsNumber()
  @Min(0)
  totalColiformCountCfu!: number;

  @IsBoolean()
  @IsOptional()
  packagingGateBlocked?: boolean;

  @IsString()
  @IsOptional()
  clearanceCertificateNumber?: string;

  @IsString()
  @IsOptional()
  certifiedByManager?: string;

  @IsString()
  @IsOptional()
  status?: string; // TESTING_IN_PROGRESS, APPROVED_FOR_PACKAGING, REJECTED_ANTIBIOTIC_HOLD, QUARANTINED

  @IsString()
  @IsOptional()
  notes?: string;
}
