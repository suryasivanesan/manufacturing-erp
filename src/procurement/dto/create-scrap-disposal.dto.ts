import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateScrapDisposalDto {
  @IsString()
  @IsNotEmpty()
  scrapType!: string; // FERROUS_HEAVY_MELTING_SCRAP, ALUMINUM_TURNINGS_BORINGS, COPPER_WIRE_ENDS, PVC_POLYMER_REGIND, PACKAGING_WOOD_CARDBOARD

  @IsString()
  @IsNotEmpty()
  storageYardLocation!: string;

  @IsNumber()
  @Min(0.01)
  accumulatedWeightKg!: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsString()
  @IsOptional()
  surplusMaterialOrigin?: string;

  @IsString()
  @IsOptional()
  tenderReferenceNumber?: string;

  @IsString()
  @IsOptional()
  winningBidderName?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  winningBidRatePerKg?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalRevenueRealized?: number;

  @IsString()
  @IsOptional()
  gatePassPassoutNumber?: string;

  @IsString()
  @IsOptional()
  status?: string; // ACCUMULATING, TENDER_FLOATED, BIDS_EVALUATED, SOLD_DISPATCHED

  @IsString()
  @IsOptional()
  notes?: string;
}

export class FinalizeScrapSaleDto {
  @IsString()
  @IsNotEmpty()
  winningBidderName!: string;

  @IsNumber()
  @Min(0.01)
  winningBidRatePerKg!: number;

  @IsString()
  @IsOptional()
  gatePassPassoutNumber?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
