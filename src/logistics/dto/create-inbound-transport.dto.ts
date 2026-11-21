import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsDateString,
} from 'class-validator';

export class CreateInboundTransportDto {
  @IsString()
  @IsNotEmpty()
  vendorSupplierName!: string;

  @IsString()
  @IsOptional()
  purchaseOrderRef?: string;

  @IsString()
  @IsNotEmpty()
  materialCategory!: string; // "RAW_MATERIALS", "CONSUMABLES", "SPARE_PARTS"

  @IsString()
  @IsNotEmpty()
  transporterFleet!: string;

  @IsString()
  @IsNotEmpty()
  vehicleNumber!: string;

  @IsString()
  @IsOptional()
  driverNameAndContact?: string;

  @IsNumber()
  @Min(0.01)
  inboundWeightKg!: number;

  @IsString()
  @IsNotEmpty()
  originLocation!: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledArrivalDate!: string;

  @IsString()
  @IsOptional()
  dockUnloadBay?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateInboundStatusDto {
  @IsString()
  @IsNotEmpty()
  transitStatus!: string; // "PICKUP_SCHEDULED", "IN_TRANSIT", "DELAYED_WEATHER_ROUTE", "ARRIVED_AT_GATE", "UNLOADED"

  @IsNumber()
  @IsOptional()
  @Min(0)
  delayHours?: number;

  @IsDateString()
  @IsOptional()
  actualArrivalDate?: string;

  @IsString()
  @IsOptional()
  dockUnloadBay?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
