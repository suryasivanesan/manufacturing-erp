import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateEsdCleanroomAuditLogDto {
  @IsString()
  @IsOptional()
  auditCode?: string;

  @IsString()
  @IsNotEmpty()
  cleanroomZone!: string;

  @IsString()
  @IsNotEmpty()
  workstationNumber!: string;

  @IsNumber()
  wristStrapResistanceOhms!: number;

  @IsNumber()
  matGroundResistanceOhms!: number;

  @IsNumber()
  relativeHumidityPct!: number;

  @IsNumber()
  temperatureCelsius!: number;

  @IsString()
  @IsOptional()
  particleCountIsoClass?: string;

  @IsBoolean()
  @IsOptional()
  esdPackagingVerified?: boolean;

  @IsString()
  @IsOptional()
  auditStatus?: string;

  @IsString()
  @IsOptional()
  auditedByRole?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
