import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEhsIncidentDto {
  @IsNotEmpty({ message: 'Incident type is required (NEAR_MISS, FIRST_AID, LOST_TIME, HOT_WORK_PERMIT, SAFETY_AUDIT)' })
  @IsString()
  incidentType!: string;

  @IsNotEmpty({ message: 'Severity is required (LOW, MEDIUM, HIGH, CRITICAL)' })
  @IsString()
  severity!: string;

  @IsNotEmpty({ message: 'Plant shop-floor location is required' })
  @IsString()
  plantLocation!: string;

  @IsNotEmpty({ message: 'Incident or permit description is required' })
  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  correctiveAction?: string;

  @IsOptional()
  @IsBoolean()
  hotWorkPermitRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  hotWorkPermitApproved?: boolean;

  @IsOptional()
  @IsString()
  permitValidUntil?: string;
}
