import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateVehicleEntryDto {
  @IsString()
  @IsNotEmpty()
  vehicleNumber!: string;

  @IsString()
  @IsNotEmpty()
  vehicleType!: string; // "HEAVY_LORRY", "CONTAINER_TRAILER", "TANKER", "LCV_MINI_TRUCK", "VISITOR_CAR", "TWO_WHEELER"

  @IsString()
  @IsNotEmpty()
  driverName!: string;

  @IsString()
  @IsOptional()
  driverPhone?: string;

  @IsString()
  @IsOptional()
  driverLicenseNumber?: string;

  @IsString()
  @IsOptional()
  transporterAgency?: string;

  @IsString()
  @IsNotEmpty()
  entryPurpose!: string; // "RAW_MATERIAL_INWARD", "FINISHED_GOODS_OUTWARD", "SPARES_CONSUMABLES", "SCRAP_OUTWARD", "VISITOR_TRANSPORT"

  @IsString()
  @IsOptional()
  ewayBillNumber?: string;

  @IsString()
  @IsOptional()
  taxInvoiceRef?: string;

  @IsString()
  @IsOptional()
  deliveryChallanRef?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  grossWeightKg?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  tareWeightKg?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  netWeightKg?: number;

  @IsString()
  @IsNotEmpty()
  securityOfficerName!: string;

  @IsBoolean()
  @IsOptional()
  sealNumberVerified?: boolean;

  @IsString()
  @IsOptional()
  securityCheckNotes?: string;
}

export class UpdateVehicleEntryStatusDto {
  @IsString()
  @IsNotEmpty()
  gateEntryStatus!: string; // "ENTRY_LOGGED", "WEIGHBRIDGE_IN_PROGRESS", "UNLOADING_LOADING_AT_BAY", "WEIGHBRIDGE_OUT_COMPLETED", "EXIT_CLEARED"

  @IsDateString()
  @IsOptional()
  outwardTimestamp?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  grossWeightKg?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  tareWeightKg?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  netWeightKg?: number;

  @IsBoolean()
  @IsOptional()
  sealNumberVerified?: boolean;

  @IsString()
  @IsOptional()
  securityCheckNotes?: string;
}
