import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateEmployeeRelationDto {
  @IsString()
  @IsNotEmpty()
  relationType!: string; // GRIEVANCE, DISCIPLINARY, PERFORMANCE_APPRAISAL, ENGAGEMENT_EVENT, RECOGNITION

  @IsString()
  @IsOptional()
  employeeId?: string;

  @IsString()
  @IsOptional()
  employeeName?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsNotEmpty()
  subject!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  appraisalRating?: number;

  @IsString()
  @IsOptional()
  disciplinaryActionTaken?: string;

  @IsString()
  @IsOptional()
  resolutionNotes?: string;

  @IsString()
  @IsOptional()
  hearingDate?: string;

  @IsString()
  @IsOptional()
  status?: string; // OPEN, UNDER_INVESTIGATION, RESOLVED, CLOSED

  @IsString()
  @IsOptional()
  assignedOfficer?: string;
}

export class ResolveEmployeeRelationDto {
  @IsString()
  @IsNotEmpty()
  status!: string; // RESOLVED, CLOSED

  @IsString()
  @IsNotEmpty()
  resolutionNotes!: string;

  @IsString()
  @IsOptional()
  disciplinaryActionTaken?: string;
}
