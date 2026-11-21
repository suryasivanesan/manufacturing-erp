import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateApprovalRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Entity type is required (e.g. RAW_MATERIAL, PRODUCT, PRODUCTION_ORDER, PAYROLL_OVERRIDE)' })
  @IsIn(['RAW_MATERIAL', 'PRODUCT', 'PRODUCTION_ORDER', 'PAYROLL_OVERRIDE', 'COMPANY_CONFIG'])
  entityType!: string;

  @IsString()
  @IsOptional()
  entityId?: string;

  @IsString()
  @IsNotEmpty({ message: 'Action type is required (CREATE, UPDATE, DELETE)' })
  @IsIn(['CREATE', 'UPDATE', 'DELETE'])
  actionType!: string;

  @IsString()
  @IsNotEmpty({ message: 'Title is required for the approval request' })
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty({ message: 'Proposed changes payload is required' })
  proposedChanges!: any; // Object or JSON string

  @IsOptional()
  previousState?: any; // Object or JSON string
}
