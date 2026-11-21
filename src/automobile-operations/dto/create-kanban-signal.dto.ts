import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateAutomobileKanbanSignalDto {
  @IsString()
  @IsOptional()
  signalCode?: string;

  @IsString()
  @IsNotEmpty()
  vinOrBuildOrderId!: string;

  @IsString()
  @IsNotEmpty()
  partNumber!: string;

  @IsString()
  @IsNotEmpty()
  partDescription!: string;

  @IsString()
  @IsNotEmpty()
  supplierName!: string;

  @IsString()
  @IsNotEmpty()
  dockLocationCode!: string;

  @IsString()
  @IsNotEmpty()
  targetStationId!: string;

  @IsString()
  @IsOptional()
  kanbanStatus?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  requiredQuantity?: number;

  @IsNumber()
  @IsOptional()
  deliveredQuantity?: number;

  @IsNumber()
  @IsOptional()
  sequenceNumber?: number;

  @IsString()
  @IsNotEmpty()
  deliveryEta!: string;

  @IsBoolean()
  @IsOptional()
  sequenceAccuracyVerified?: boolean;

  @IsString()
  @IsOptional()
  stockReplenishUrgency?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
