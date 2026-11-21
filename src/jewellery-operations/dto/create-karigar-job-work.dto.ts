import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsInt } from 'class-validator';

export class CreateKarigarJobWorkDto {
  @IsString()
  @IsNotEmpty({ message: 'Challan number is required' })
  challanNumber!: string;

  @IsString()
  @IsNotEmpty({ message: 'Karigar name is required' })
  karigarName!: string;

  @IsString()
  @IsOptional()
  karigarType?: string; // INTERNAL, EXTERNAL_WORKSHOP

  @IsString()
  @IsNotEmpty({ message: 'Work order number is required' })
  workOrderNumber!: string;

  @IsString()
  @IsNotEmpty({ message: 'Craftmanship type is required' })
  craftmanshipType!: string; // FILIGREE, MEENAKARI, STONE_SETTING, JADAU, POLISHING

  @IsNumber()
  @Min(0.01, { message: 'Issued metal weight must be greater than 0' })
  issuedMetalWeightGrams!: number;

  @IsString()
  @IsNotEmpty({ message: 'Issued metal purity is required' })
  issuedMetalPurity!: string; // 22KT_916, 18KT_750

  @IsInt()
  @IsOptional()
  issuedGemstonePieces?: number;

  @IsNumber()
  @IsOptional()
  issuedGemstoneCarats?: number;

  @IsNumber()
  @Min(0, { message: 'Received item weight cannot be negative' })
  receivedItemWeightGrams!: number;

  @IsNumber()
  @Min(0, { message: 'Returned scrap dust cannot be negative' })
  returnedScrapDustGrams!: number;

  @IsNumber()
  @Min(0, { message: 'Allowed wastage cannot be negative' })
  allowedWastageGrams!: number;

  @IsNumber()
  @IsOptional()
  actualWastageGrams?: number;

  @IsNumber()
  @IsOptional()
  wastageVarianceGrams?: number;

  @IsString()
  @IsOptional()
  wastageStatus?: string;

  @IsNumber()
  @Min(0, { message: 'Karigar making charges cannot be negative' })
  karigarMakingChargesInr!: number;

  @IsString()
  @IsOptional()
  paymentStatus?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
