import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
} from 'class-validator';

export class CreateStatutoryComplianceDto {
  @IsString()
  @IsNotEmpty()
  complianceType!: string; // PF_EPFO, ESI_ESIC, FACTORY_ACT, MINIMUM_WAGES_ACT, BONUS_ACT, LABOR_COMMITTEE

  @IsString()
  @IsNotEmpty()
  period!: string; // e.g. "2026-10" or "2026-Q3"

  @IsString()
  @IsOptional()
  challanOrRefNumber?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalCoveredEmployees?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  statutoryAmount?: number;

  @IsString()
  @IsNotEmpty()
  dueDate!: string;

  @IsString()
  @IsOptional()
  filingDate?: string;

  @IsString()
  @IsOptional()
  complianceStatus?: string; // PENDING, FILED, VERIFIED_IN_SPEC, AUDITED

  @IsBoolean()
  @IsOptional()
  minimumWageCompliant?: boolean;

  @IsString()
  @IsOptional()
  factoryActChecklistJson?: string;

  @IsString()
  @IsOptional()
  unionMeetingMinutes?: string;

  @IsString()
  @IsOptional()
  inspectorName?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateComplianceStatusDto {
  @IsString()
  @IsNotEmpty()
  complianceStatus!: string;

  @IsString()
  @IsOptional()
  challanOrRefNumber?: string;

  @IsString()
  @IsOptional()
  filingDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
