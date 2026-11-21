import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateNightPatrolDto {
  @IsString()
  @IsNotEmpty()
  patrolShift!: string; // "NIGHT_SHIFT_FIRST_HALF", "NIGHT_SHIFT_SECOND_HALF", "GRAVEYARD_PATROL_02AM"

  @IsString()
  @IsNotEmpty()
  leadPatrolGuardName!: string;

  @IsString()
  @IsOptional()
  accompanyingGuards?: string;

  @IsString()
  @IsNotEmpty()
  patrolCheckpointZone!: string; // "PERIMETER_NORTH_FENCE", "FINISHED_GOODS_YARD", "RAW_SCRAP_YARD", "HAZMAT_STORAGE", "SUBSTATION_TRANSFORMER", "ADMIN_OFFICE"

  @IsDateString()
  @IsOptional()
  checkpointScanTime?: string;

  @IsBoolean()
  @IsOptional()
  physicalLockSecure?: boolean;

  @IsString()
  @IsOptional()
  lockConditionDetails?: string;

  @IsString()
  @IsOptional()
  perimeterLightingStatus?: string; // "ADEQUATE_FLOODLIGHTS", "PARTIAL_DARKNESS", "FLOODLIGHT_FUSED_ALERT"

  @IsBoolean()
  @IsOptional()
  suspiciousActivityDetected?: boolean;

  @IsString()
  @IsOptional()
  suspiciousDetails?: string;

  @IsBoolean()
  @IsOptional()
  escalatedToSecurityManager?: boolean;

  @IsString()
  @IsOptional()
  securityManagerActionNotes?: string;
}

export class UpdateNightPatrolStatusDto {
  @IsBoolean()
  @IsOptional()
  suspiciousActivityDetected?: boolean;

  @IsString()
  @IsOptional()
  suspiciousDetails?: string;

  @IsBoolean()
  @IsOptional()
  escalatedToSecurityManager?: boolean;

  @IsString()
  @IsOptional()
  securityManagerActionNotes?: string;
}
