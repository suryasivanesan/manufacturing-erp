import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class DecideApprovalDto {
  @IsString()
  @IsNotEmpty({ message: 'Decision must be either APPROVE or REJECT' })
  @IsIn(['APPROVE', 'REJECT'])
  decision!: 'APPROVE' | 'REJECT';

  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
