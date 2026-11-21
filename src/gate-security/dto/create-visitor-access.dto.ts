import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateVisitorAccessDto {
  @IsString()
  @IsNotEmpty()
  visitorName!: string;

  @IsString()
  @IsNotEmpty()
  visitorPhone!: string;

  @IsString()
  @IsNotEmpty()
  visitorOrganization!: string;

  @IsString()
  @IsNotEmpty()
  idProofType!: string; // "AADHAAR", "DRIVING_LICENSE", "PAN_CARD", "PASSPORT", "VOTER_ID"

  @IsString()
  @IsNotEmpty()
  idProofNumber!: string;

  @IsString()
  @IsNotEmpty()
  hostPersonToMeet!: string;

  @IsString()
  @IsNotEmpty()
  hostDepartment!: string; // "HR", "PRODUCTION", "PROCUREMENT", "QUALITY", "EXECUTIVE", "MAINTENANCE"

  @IsString()
  @IsNotEmpty()
  visitPurpose!: string; // "VENDOR_MEETING", "CANDIDATE_INTERVIEW", "AUDIT_INSPECTION", "MACHINE_SERVICING", "CLIENT_VISIT", "CONTRACTOR_WORK"

  @IsString()
  @IsOptional()
  rfidCardBadgeNumber?: string;

  @IsBoolean()
  @IsOptional()
  safetyPpeHelmetIssued?: boolean;

  @IsBoolean()
  @IsOptional()
  safetyPpeVestIssued?: boolean;

  @IsBoolean()
  @IsOptional()
  safetyPpeShoesVerified?: boolean;

  @IsBoolean()
  @IsOptional()
  safetyBriefingAcknowledged?: boolean;

  @IsString()
  @IsOptional()
  securityNotes?: string;
}

export class UpdateVisitorAccessStatusDto {
  @IsString()
  @IsNotEmpty()
  accessStatus!: string; // "ACTIVE_IN_PLANT", "CHECKED_OUT", "OVERSTAY_ALERT", "ACCESS_DENIED"

  @IsString()
  @IsOptional()
  departmentApprovalStatus?: string; // "PENDING", "APPROVED_BY_MANAGER", "REJECTED", "VISIT_COMPLETED"

  @IsString()
  @IsOptional()
  approvingManagerName?: string;

  @IsDateString()
  @IsOptional()
  checkOutTime?: string;

  @IsString()
  @IsOptional()
  securityNotes?: string;
}
