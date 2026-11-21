import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreatePressShopBiwLogDto {
  @IsString()
  @IsOptional()
  logNumber?: string;

  @IsString()
  @IsNotEmpty()
  pressLineId!: string;

  @IsString()
  @IsNotEmpty()
  dieSetId!: string;

  @IsString()
  @IsNotEmpty()
  panelPartNumber!: string;

  @IsString()
  @IsNotEmpty()
  panelName!: string;

  @IsNumber()
  @Min(0)
  dieChangeoverDurationMinutes!: number;

  @IsNumber()
  @Min(1)
  strokeCountShift!: number;

  @IsNumber()
  @Min(1)
  cumulativeDieStrokes!: number;

  @IsString()
  @IsNotEmpty()
  coilOrBlankBatchNumber!: string;

  @IsString()
  @IsNotEmpty()
  sheetMetalGrade!: string;

  @IsNumber()
  @Min(0.1)
  blankThicknessMm!: number;

  @IsBoolean()
  @IsOptional()
  weldQualityInspectionPassed?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  weldSpotCountInspected?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  weldDefectsDetected?: number;

  @IsString()
  @IsOptional()
  surfaceDefectsDetected?: string;

  @IsString()
  @IsOptional()
  inspectionClearanceStatus?: string;

  @IsString()
  @IsOptional()
  inspectorNotes?: string;
}
