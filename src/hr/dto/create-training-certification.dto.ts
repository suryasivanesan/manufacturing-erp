import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';

export class CreateTrainingCertificationDto {
  @IsString()
  @IsNotEmpty()
  trainingType!: string; // SAFETY_INDUCTION, ON_THE_JOB_OJT, MACHINE_CERTIFICATION, PRODUCTIVITY_LEAN, HAZMAT_HANDLING

  @IsString()
  @IsNotEmpty()
  courseTitle!: string;

  @IsString()
  @IsNotEmpty()
  trainerName!: string;

  @IsString()
  @IsNotEmpty()
  targetDepartment!: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  attendeesCount?: number;

  @IsString()
  @IsOptional()
  employeeId?: string;

  @IsString()
  @IsOptional()
  employeeName?: string;

  @IsString()
  @IsOptional()
  certificationExpiry?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  assessmentScorePct?: number;

  @IsString()
  @IsOptional()
  ojtMentorName?: string;

  @IsString()
  @IsOptional()
  ojtCompletionStatus?: string; // NOT_STARTED, IN_PROGRESS, CERTIFIED, RE_TRAIN

  @IsString()
  @IsOptional()
  validTill?: string;

  @IsString()
  @IsOptional()
  status?: string; // SCHEDULED, ACTIVE, COMPLETED, EXPIRED

  @IsBoolean()
  @IsOptional()
  certificateIssued?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CertifyTrainingDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  assessmentScorePct?: number;

  @IsString()
  @IsOptional()
  ojtCompletionStatus?: string;

  @IsBoolean()
  @IsOptional()
  certificateIssued?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}
