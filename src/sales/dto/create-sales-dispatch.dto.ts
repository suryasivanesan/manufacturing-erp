import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateSalesDispatchDto {
  @IsString()
  @IsNotEmpty()
  salesOrderNumber!: string;

  @IsString()
  @IsNotEmpty()
  clientCompanyName!: string;

  @IsString()
  @IsNotEmpty()
  deliveryChallanNumber!: string;

  @IsString()
  @IsOptional()
  eWayBillNumber?: string;

  @IsString()
  @IsNotEmpty()
  transporterFleetCarrier!: string;

  @IsString()
  @IsNotEmpty()
  vehicleNumber!: string;

  @IsString()
  @IsOptional()
  driverNameAndContact?: string;

  @IsNumber()
  @Min(0.01)
  dispatchWeightKg!: number;

  @IsString()
  @IsNotEmpty()
  destinationLocation!: string;

  @IsString()
  @IsOptional()
  loadingBay?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateSalesDispatchStatusDto {
  @IsString()
  @IsNotEmpty()
  dispatchStatus!: string; // "LOADING_IN_PROGRESS", "DISPATCHED_IN_TRANSIT", "DELIVERED_POD_RECEIVED", "RETURNED"

  @IsBoolean()
  @IsOptional()
  proofOfDeliveryReceived?: boolean;

  @IsDateString()
  @IsOptional()
  deliveredAt?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
