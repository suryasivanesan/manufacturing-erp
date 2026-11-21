import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreatePasteurizationProcessingLogDto {
  @IsString()
  @IsNotEmpty({ message: 'Processing job code is required' })
  processingJobCode!: string;

  @IsString()
  @IsNotEmpty({ message: 'Product type is required' })
  productType!: string; // STANDARDIZED_MILK, TONED_MILK, DOUBLE_TONED, FULL_CREAM, SKIMMED_MILK

  @IsNumber()
  @Min(100, { message: 'Raw milk volume must be at least 100 L' })
  rawMilkVolumeLtr!: number;

  @IsString()
  @IsNotEmpty({ message: 'Pasteurizer line ID is required' })
  pasteurizerLineId!: string;

  @IsNumber()
  @Min(60.0, { message: 'Heating zone temperature must be at least 60.0°C' })
  @Max(95.0, { message: 'Heating zone temperature cannot exceed 95.0°C' })
  heatingZoneTempCelsius!: number;

  @IsNumber()
  @Min(5.0, { message: 'Holding time must be at least 5.0 seconds' })
  holdingTimeSeconds!: number;

  @IsString()
  @IsOptional()
  flowDiversionValveStatus?: string; // FORWARD_FLOW, DIVERTED_SUB_TEMP

  @IsNumber()
  @Min(0.5)
  @Max(10.0)
  steamPressureBar!: number;

  @IsNumber()
  @Min(0.0)
  @Max(15.0)
  chilledWaterTempCelsius!: number;

  @IsNumber()
  @Min(0.0)
  creamSeparationYieldLtr!: number;

  @IsNumber()
  @Min(20.0)
  @Max(60.0)
  creamFatPercentage!: number;

  @IsNumber()
  @Min(0.1)
  @Max(10.0)
  standardizedMilkFatPct!: number;

  @IsNumber()
  @Min(50.0, { message: 'Homogenization pressure must be at least 50 bar' })
  @Max(300.0, { message: 'Homogenization pressure cannot exceed 300 bar' })
  homogenizationPressureBar!: number;

  @IsNumber()
  @Min(0.0)
  steamConsumptionKg!: number;

  @IsNumber()
  @Min(0.0)
  chilledWaterKwh!: number;

  @IsString()
  @IsOptional()
  status?: string; // HEATING_RECIRCULATION, FORWARD_FLOW_ACTIVE, PASTEURIZED_RELEASED, DIVERSION_ALARM_HOLD

  @IsString()
  @IsOptional()
  operatorNotes?: string;
}
