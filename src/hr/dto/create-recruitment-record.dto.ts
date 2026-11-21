import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsEmail,
} from 'class-validator';

export class CreateRecruitmentRecordDto {
  @IsString()
  @IsNotEmpty()
  jobTitle!: string;

  @IsString()
  @IsNotEmpty()
  department!: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  positionsCount?: number;

  @IsString()
  @IsOptional()
  hiringAgency?: string;

  @IsString()
  @IsOptional()
  candidateName?: string;

  @IsString()
  @IsOptional()
  candidatePhone?: string;

  @IsEmail()
  @IsOptional()
  candidateEmail?: string;

  @IsString()
  @IsOptional()
  technicalInterviewStatus?: string; // SCHEDULED, PASSED, REJECTED, ON_HOLD

  @IsNumber()
  @Min(0)
  @Max(10)
  @IsOptional()
  interviewScore?: number;

  @IsString()
  @IsOptional()
  backgroundVerificationStatus?: string; // PENDING, IN_PROGRESS, VERIFIED, FAILED

  @IsString()
  @IsOptional()
  joiningFormalitiesStatus?: string; // PENDING, OFFER_RELEASED, DOCUMENTS_SUBMITTED, JOINED

  @IsString()
  @IsOptional()
  joiningDate?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  offeredSalary?: number;

  @IsString()
  @IsOptional()
  status?: string; // OPEN, IN_PROCESS, OFFERED, HIRED, CANCELLED

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateRecruitmentStatusDto {
  @IsString()
  @IsNotEmpty()
  status!: string;

  @IsString()
  @IsOptional()
  technicalInterviewStatus?: string;

  @IsNumber()
  @IsOptional()
  interviewScore?: number;

  @IsString()
  @IsOptional()
  backgroundVerificationStatus?: string;

  @IsString()
  @IsOptional()
  joiningFormalitiesStatus?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
