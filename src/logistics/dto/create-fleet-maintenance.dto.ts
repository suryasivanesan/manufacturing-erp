import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsDateString,
} from 'class-validator';

export class CreateFleetMaintenanceDto {
  @IsString()
  @IsNotEmpty()
  fleetVehicleCode!: string;

  @IsString()
  @IsNotEmpty()
  registrationNumber!: string;

  @IsString()
  @IsNotEmpty()
  vehicleModel!: string;

  @IsString()
  @IsOptional()
  ownershipType?: string; // "COMPANY_OWNED", "DEDICATED_CONTRACT_LEASE", "SPOT_MARKET_CARRIER"

  @IsDateString()
  @IsNotEmpty()
  fitnessCertificateExpiry!: string;

  @IsDateString()
  @IsNotEmpty()
  insurancePolicyExpiry!: string;

  @IsDateString()
  @IsNotEmpty()
  pucEmissionExpiry!: string;

  @IsNumber()
  @Min(0)
  currentOdometerKm!: number;

  @IsNumber()
  @IsOptional()
  fuelMileageKmpl?: number;

  @IsString()
  @IsOptional()
  gpsDeviceImei?: string;

  @IsString()
  @IsOptional()
  liveLocationCoordinates?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateFleetStatusDto {
  @IsString()
  @IsNotEmpty()
  vehicleStatus!: string; // "ACTIVE_ON_ROAD", "IN_WORKSHOP_SERVICING", "FITNESS_RENEWAL_DUE", "STANDBY_YARD"

  @IsNumber()
  @IsOptional()
  currentOdometerKm?: number;

  @IsNumber()
  @IsOptional()
  fuelConsumptionLiters?: number;

  @IsDateString()
  @IsOptional()
  lastServicingDate?: string;

  @IsNumber()
  @IsOptional()
  nextServicingDueKm?: number;

  @IsString()
  @IsOptional()
  liveLocationCoordinates?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
