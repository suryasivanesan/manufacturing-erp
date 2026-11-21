import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateMaterialInspectionDto {
  @IsString()
  @IsNotEmpty()
  vehicleNumber!: string;

  @IsString()
  @IsOptional()
  gatePassRef?: string;

  @IsString()
  @IsOptional()
  challanInvoiceRef?: string;

  @IsString()
  @IsNotEmpty()
  materialType!: string; // "RAW_MATERIAL", "FINISHED_GOODS", "SPARE_PARTS", "SCRAP_METAL", "SUBCONTRACT_JOBWORK"

  @IsString()
  @IsNotEmpty()
  containerInspectionStatus!: string; // "SEAL_INTACT_VERIFIED", "SEAL_BROKEN_ALERT", "TARPAULIN_COVERED_OK", "OPEN_BODY_CHECKED"

  @IsString()
  @IsOptional()
  containerSealNumber?: string;

  @IsString()
  @IsNotEmpty()
  physicalVsChallanMatch!: string; // "MATCHED_VERIFIED", "QUANTITY_SHORTAGE", "EXCESS_UNAUTHORIZED_CARGO", "WRONG_ITEM_DETECTED"

  @IsBoolean()
  @IsOptional()
  contractLaborFriskingDone?: boolean;

  @IsBoolean()
  @IsOptional()
  metalDetectorCleared?: boolean;

  @IsBoolean()
  @IsOptional()
  unauthorizedMaterialFound?: boolean;

  @IsBoolean()
  @IsOptional()
  smugglingAlertFlag?: boolean;

  @IsString()
  @IsOptional()
  discrepancyRemarks?: string;

  @IsString()
  @IsNotEmpty()
  inspectingOfficerName!: string;
}

export class UpdateMaterialInspectionDto {
  @IsString()
  @IsNotEmpty()
  inspectionStatus!: string; // "PASSED_CLEARED", "DETAINED_FOR_AUDIT", "REJECTED_TURNED_BACK", "ESCALATED_TO_SECURITY_HEAD"

  @IsBoolean()
  @IsOptional()
  smugglingAlertFlag?: boolean;

  @IsString()
  @IsOptional()
  discrepancyRemarks?: string;
}
