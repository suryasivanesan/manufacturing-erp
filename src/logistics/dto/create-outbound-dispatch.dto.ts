import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsDateString,
  IsBoolean,
} from 'class-validator';

export class CreateOutboundDispatchDto {
  @IsString()
  @IsNotEmpty()
  clientConsigneeName!: string;

  @IsString()
  @IsOptional()
  salesOrderRef?: string;

  @IsString()
  @IsNotEmpty()
  destinationRoute!: string;

  @IsString()
  @IsNotEmpty()
  vehicleTypeAllocated!: string; // "HEAVY_LORRY_32_FT", "CONTAINER_TRAILER", "MINI_TRUCK_EICHER", "LIGHT_COMMERCIAL_VEHICLE"

  @IsString()
  @IsNotEmpty()
  allocatedVehicleNumber!: string;

  @IsString()
  @IsNotEmpty()
  transporterAgency!: string;

  @IsNumber()
  @Min(0)
  freightRateNegotiated!: number;

  @IsString()
  @IsOptional()
  freightRateType?: string; // "PER_TRIP_FLAT", "PER_TON_KM", "PER_KG"

  @IsString()
  @IsOptional()
  multiDropLocationsJson?: string;

  @IsNumber()
  @Min(0.01)
  totalWeightKg!: number;

  @IsDateString()
  @IsNotEmpty()
  scheduledDeparture!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateOutboundStatusDto {
  @IsString()
  @IsNotEmpty()
  dispatchStatus!: string; // "SCHEDULED", "STAGED_AT_BAY", "DISPATCHED_ON_ROUTE", "DELIVERED_POD_RECEIVED"

  @IsBoolean()
  @IsOptional()
  podReceived?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}
