import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAuditEntryDto {
  @IsString()
  @IsNotEmpty({ message: 'Action is required' })
  action!: string;

  @IsString()
  @IsNotEmpty({ message: 'Module name is required' })
  module!: string;

  @IsString()
  @IsNotEmpty({ message: 'Details description is required' })
  details!: string;

  @IsString()
  @IsOptional()
  movementType?: string; // INWARD, OUTWARD, TRANSFER, STATUS_CHANGE, RBAC_CHANGE

  @IsString()
  @IsOptional()
  userId?: string;
}
