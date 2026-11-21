import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max, IsBoolean } from 'class-validator';

export class CreateLeatherQcAreaRecordDto {
  @IsString()
  @IsNotEmpty({ message: 'Inspection code is required' })
  inspectionCode!: string;

  @IsString()
  @IsNotEmpty({ message: 'Hide barcode is required' })
  hideBarcode!: string;

  @IsString()
  @IsNotEmpty({ message: 'Article name is required' })
  articleName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Batch reference number is required' })
  batchReferenceNumber!: string;

  @IsString()
  @IsNotEmpty({ message: 'Measurement machine type is required' })
  measurementMachineType!: string; // OPTICAL_DIGITAL_SCANNER, PIN_WHEEL_MECHANICAL

  @IsNumber()
  @Min(0.5, { message: 'Measured area must be greater than 0.5 sq ft' })
  measuredAreaSqFt!: number;

  @IsString()
  @IsNotEmpty({ message: 'Grade classification is required' })
  gradeClassification!: string; // GRADE_A_SELECT, GRADE_B_CHOICE, GRADE_C_UTILITY, REJECT

  @IsString()
  @IsOptional()
  grainDefectType?: string; // TICK_MARKS, HEALED_SCARS, LOOSE_GRAIN, VEININESS, NONE_DEFECT_FREE

  @IsNumber()
  @Min(10)
  @Max(100)
  usableCuttableAreaPct!: number;

  @IsBoolean()
  @IsOptional()
  rubFastnessPass?: boolean;

  @IsBoolean()
  @IsOptional()
  flexometerCyclesPass?: boolean;

  @IsString()
  @IsOptional()
  clearanceCertificateNumber?: string;

  @IsString()
  @IsOptional()
  certifiedByManager?: string;

  @IsBoolean()
  @IsOptional()
  dispatchBlocked?: boolean;

  @IsString()
  @IsOptional()
  qcStatus?: string; // PASSED, CONDITIONAL_APPROVAL, REJECTED_QUARANTINE

  @IsString()
  @IsOptional()
  inspectorNotes?: string;
}
