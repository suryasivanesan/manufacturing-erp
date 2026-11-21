import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateSandingFinishingLogDto {
  @IsString()
  @IsNotEmpty({ message: 'Finishing job code is required' })
  finishingJobCode!: string;

  @IsString()
  @IsNotEmpty({ message: 'Furniture product name is required' })
  furnitureProductName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Sanding grit progression is required' })
  sandingGritProgression!: string; // e.g. "P80 -> P120 -> P180 -> P240 -> P320 Orbital"

  @IsString()
  @IsNotEmpty({ message: 'Wide belt sander ID is required' })
  wideBeltSanderId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Wood stain color is required' })
  woodStainColor!: string;

  @IsString()
  @IsNotEmpty({ message: 'Finish type is required' })
  finishType!: string; // POLYURETHANE_PU_TOPCOAT, WATER_BASED_UV_LACQUER, MELAMINE_FINISH, HARDWAX_OIL_NATURAL

  @IsNumber()
  @Min(5, { message: 'Sealer coat thickness must be at least 5 microns' })
  sealerCoatMicrons!: number;

  @IsNumber()
  @Min(5, { message: 'Topcoat thickness must be at least 5 microns' })
  topcoatMicrons!: number;

  @IsNumber()
  @Min(0, { message: 'Dust extraction PPM cannot be negative' })
  sprayBoothDustExtractionPpm!: number;

  @IsNumber()
  @Min(20, { message: 'Booth relative humidity must be at least 20%' })
  @Max(90, { message: 'Booth relative humidity cannot exceed 90%' })
  boothRelativeHumidityPct!: number;

  @IsNumber()
  @Min(15, { message: 'Booth temperature must be at least 15°C' })
  @Max(45, { message: 'Booth temperature cannot exceed 45°C' })
  boothTempCelsius!: number;

  @IsNumber()
  @Min(0, { message: 'Gloss level cannot be negative' })
  @Max(100, { message: 'Gloss level cannot exceed 100 GU' })
  glossLevel60DegGu!: number;

  @IsString()
  @IsOptional()
  crossHatchAdhesionGrade?: string; // 5B_EXCELLENT, 4B_GOOD, 3B_FAIR, 0B_FLAKED

  @IsString()
  @IsNotEmpty({ message: 'Chemical formulation code is required' })
  chemicalFormulationCode!: string;

  @IsNumber()
  @Min(1, { message: 'Pieces polished count must be at least 1' })
  piecesPolishedCount!: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  inspectorRemarks?: string;
}
