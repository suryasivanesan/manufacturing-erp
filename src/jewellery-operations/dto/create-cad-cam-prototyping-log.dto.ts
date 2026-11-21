import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateCadCamPrototypingLogDto {
  @IsString()
  @IsNotEmpty({ message: 'Design code is required' })
  designCode!: string;

  @IsString()
  @IsNotEmpty({ message: 'Design name is required' })
  designName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Design category is required' })
  designCategory!: string; // RING, NECKLACE, EARRINGS, BANGLE, BRACELET, PENDANT

  @IsString()
  @IsNotEmpty({ message: 'CAD file version is required' })
  cadFileVersion!: string;

  @IsString()
  @IsOptional()
  cadFileStorageUrl?: string;

  @IsString()
  @IsNotEmpty({ message: 'Manufacturing order number is required' })
  manufacturingOrderNumber!: string;

  @IsString()
  @IsNotEmpty({ message: '3D Printer ID is required' })
  threeDPrinterId!: string;

  @IsNumber()
  @Min(0.01, { message: 'Wax/resin weight must be greater than 0' })
  waxResinWeightGrams!: number;

  @IsString()
  @IsNotEmpty({ message: 'Master rubber mold code is required' })
  masterRubberMoldCode!: string;

  @IsNumber()
  @Min(0.01, { message: 'Expected 18K gold weight must be greater than 0' })
  expectedGoldWeight18kGrams!: number;

  @IsNumber()
  @Min(0.01, { message: 'Expected 22K gold weight must be greater than 0' })
  expectedGoldWeight22kGrams!: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  designerNotes?: string;
}
