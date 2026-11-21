import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
} from 'class-validator';

export class CreateWarehouseHandlingDto {
  @IsString()
  @IsNotEmpty()
  warehouseZone!: string; // "ZONE-A-HEAVY-METALS", "ZONE-B-FINISHED-GOODS", "ZONE-C-TEMPERATURE-CONTROLLED"

  @IsString()
  @IsNotEmpty()
  binRackingLocation!: string;

  @IsString()
  @IsNotEmpty()
  storedItemDescription!: string;

  @IsString()
  @IsNotEmpty()
  handlingEquipmentUsed!: string; // "FORKLIFT_3_TON", "OVERHEAD_EOT_CRANE_15T", "REACH_TRUCK", "PALLET_JACK_ELECTRIC"

  @IsString()
  @IsNotEmpty()
  equipmentOperatorName!: string;

  @IsNumber()
  @Min(0.01)
  loadWeightKg!: number;

  @IsNumber()
  @IsOptional()
  ambientTemperatureC?: number;

  @IsNumber()
  @IsOptional()
  relativeHumidityPct?: number;

  @IsString()
  @IsOptional()
  storageConditionStatus?: string; // "OPTIMAL", "TEMPERATURE_ALERT", "HUMIDITY_WARNING", "RACK_OVERLOAD_RISK"

  @IsBoolean()
  @IsOptional()
  stackingSafetyClearance?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateWarehouseHandlingDto {
  @IsString()
  @IsNotEmpty()
  storageConditionStatus!: string;

  @IsNumber()
  @IsOptional()
  ambientTemperatureC?: number;

  @IsNumber()
  @IsOptional()
  relativeHumidityPct?: number;

  @IsBoolean()
  @IsOptional()
  stackingSafetyClearance?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}
