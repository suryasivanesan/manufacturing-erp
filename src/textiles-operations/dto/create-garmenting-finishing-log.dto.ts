import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';

export class CreateGarmentingFinishingLogDto {
  @IsString()
  @IsNotEmpty({ message: 'Style work order is required' })
  styleWorkOrder!: string;

  @IsString()
  @IsNotEmpty({ message: 'Buyer PO number is required' })
  buyerPoNumber!: string;

  @IsString()
  @IsOptional()
  garmentType?: string; // CREW_NECK_TSHIRT, DENIM_TROUSER, WOVEN_SHIRT, POLO_TSHIRT

  @IsNumber()
  @Min(0, { message: 'Marker efficiency percentage cannot be negative' })
  @Max(100, { message: 'Marker efficiency percentage cannot exceed 100%' })
  fabricMarkerEfficiencyPct!: number;

  @IsNumber()
  @Min(0, { message: 'Fabric nesting waste percentage cannot be negative' })
  @Max(100, { message: 'Fabric nesting waste percentage cannot exceed 100%' })
  fabricNestingWastePct!: number;

  @IsString()
  @IsNotEmpty({ message: 'Cutting table ID is required' })
  cuttingTableId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Bundle ticket code is required' })
  bundleTicketCode!: string;

  @IsString()
  @IsNotEmpty({ message: 'Sewing line identifier is required' })
  sewingLineId!: string;

  @IsNumber()
  @Min(0, { message: 'Daily sewing output cannot be negative' })
  dailySewingOutputPcs!: number;

  @IsNumber()
  @Min(1, { message: 'Sewing target pieces must be at least 1' })
  sewingTargetPcs!: number;

  @IsNumber()
  @Min(0, { message: 'Line WIP pieces cannot be negative' })
  lineWipPieces!: number;

  @IsString()
  @IsOptional()
  cartonBoxNumber?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  garmentPackedPcs?: number;

  @IsBoolean()
  @IsOptional()
  barcodeLabelPrinted?: boolean;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  supervisorNotes?: string;
}
