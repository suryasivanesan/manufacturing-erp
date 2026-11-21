import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateTrafficParkingDto {
  @IsString()
  @IsNotEmpty()
  vehicleCategory!: string; // "HEAVY_TRUCK_LORRY", "CONTAINER_TRAILER", "STAFF_FOUR_WHEELER", "TWO_WHEELER", "VISITOR_VEHICLE", "COMPANY_BUS"

  @IsString()
  @IsNotEmpty()
  vehicleRegistrationNumber!: string;

  @IsString()
  @IsNotEmpty()
  allocatedSlotOrBay!: string; // e.g. "BAY-03-UNLOAD", "TRUCK-YARD-T12", "STAFF-P1-24", "VISITOR-V05"

  @IsString()
  @IsNotEmpty()
  driverOrOwnerName!: string;

  @IsString()
  @IsOptional()
  driverContactPhone?: string;

  @IsBoolean()
  @IsOptional()
  fireExitClearanceVerified?: boolean;

  @IsString()
  @IsNotEmpty()
  trafficGuardName!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateTrafficParkingStatusDto {
  @IsString()
  @IsNotEmpty()
  parkingViolationStatus!: string; // "NO_VIOLATION", "OBSTRUCTING_FIRE_LANE", "UNAUTHORIZED_BAY_PARKING", "OVERNIGHT_UNAUTHORIZED", "RESOLVED"

  @IsDateString()
  @IsOptional()
  exitTime?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
