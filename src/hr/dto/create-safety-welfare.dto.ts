import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateSafetyWelfareDto {
  @IsString()
  @IsNotEmpty()
  category!: string; // PPE_ISSUANCE, SAFETY_DRILL, CANTEEN_HYGIENE, FIRST_AID_HEALTH, WORKER_AMENITY

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
  @IsOptional()
  ppeItemsIssued?: string;

  @IsString()
  @IsOptional()
  ppeBatchLot?: string;

  @IsString()
  @IsOptional()
  safetyDrillType?: string;

  @IsString()
  @IsOptional()
  safetyDrillDate?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  canteenInspectionScore?: number;

  @IsString()
  @IsOptional()
  firstAidIncidentType?: string;

  @IsString()
  @IsOptional()
  welfareAmenityDetails?: string;

  @IsString()
  @IsOptional()
  status?: string; // ACTIVE, COMPLETED, SCHEDULED, INSPECTED

  @IsString()
  @IsOptional()
  inspectorOrIssuer?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateSafetyWelfareStatusDto {
  @IsString()
  @IsNotEmpty()
  status!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
