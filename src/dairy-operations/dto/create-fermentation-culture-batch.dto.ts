import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateFermentationCultureBatchDto {
  @IsString()
  @IsNotEmpty({ message: 'Fermentation batch code is required' })
  fermentationBatchCode!: string;

  @IsString()
  @IsNotEmpty({ message: 'Product category is required' })
  productCategory!: string; // CURD_DAHI, GREEK_YOGURT, PANEER_COAGULATION, CHEDDAR_CHEESE, PROBIOTIC_CHAAS

  @IsNumber()
  @Min(50, { message: 'Base milk volume must be at least 50 L' })
  baseMilkVolumeLtr!: number;

  @IsString()
  @IsNotEmpty({ message: 'Starter culture strain is required' })
  starterCultureStrain!: string;

  @IsNumber()
  @Min(5.0, { message: 'Inoculation dosage must be at least 5.0 g' })
  inoculationDosageGrams!: number;

  @IsNumber()
  @Min(20.0)
  @Max(55.0)
  inoculationTempCelsius!: number;

  @IsString()
  @IsNotEmpty({ message: 'Incubation chamber ID is required' })
  incubationChamberId!: string;

  @IsNumber()
  @Min(0.5)
  @Max(48.0)
  incubationDurationHours!: number;

  @IsNumber()
  @Min(3.5, { message: 'Curd pH must be at least 3.5' })
  @Max(7.0, { message: 'Curd pH cannot exceed 7.0' })
  currentCurdPh!: number;

  @IsNumber()
  @Min(3.5)
  @Max(7.0)
  targetCurdPh!: number;

  @IsNumber()
  @Min(0.1)
  @Max(2.5)
  titratableAcidityPct!: number;

  @IsNumber()
  @Min(1.0)
  @Max(10.0)
  coagulationFirmnessScore!: number;

  @IsNumber()
  @Min(10.0)
  finalCurdYieldKg!: number;

  @IsNumber()
  @Min(0.0)
  wheyDrainageLiters!: number;

  @IsString()
  @IsOptional()
  status?: string; // INOCULATION_STAGED, INCUBATING, COAGULATING, FERMENTATION_COMPLETED, HIGH_ACIDITY_ALERT

  @IsString()
  @IsOptional()
  technicianNotes?: string;
}
