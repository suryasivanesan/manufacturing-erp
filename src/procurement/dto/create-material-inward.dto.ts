import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateMaterialInwardDto {
  @IsString()
  @IsNotEmpty()
  poNumber!: string;

  @IsString()
  @IsNotEmpty()
  vendorName!: string;

  @IsString()
  @IsNotEmpty()
  transporterName!: string;

  @IsString()
  @IsNotEmpty()
  vehicleNumber!: string;

  @IsString()
  @IsOptional()
  driverContact?: string;

  @IsString()
  @IsOptional()
  eWayBillNumber?: string;

  @IsString()
  @IsNotEmpty()
  challanInvoiceNumber!: string;

  @IsNumber()
  @Min(0)
  weighbridgeGrossKg!: number;

  @IsNumber()
  @Min(0)
  weighbridgeTareKg!: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsString()
  @IsOptional()
  qcInspectionStatus?: string; // PENDING_LAB_TEST, UNDER_INSPECTION, QC_PASSED, QC_REJECTED, CONDITIONAL_APPROVAL

  @IsString()
  @IsOptional()
  warehouseLocationBay?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateMaterialQcStatusDto {
  @IsString()
  @IsNotEmpty()
  qcInspectionStatus!: string; // QC_PASSED, QC_REJECTED, CONDITIONAL_APPROVAL

  @IsString()
  @IsOptional()
  qcTestReportNumber?: string;

  @IsString()
  @IsOptional()
  warehouseLocationBay?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
