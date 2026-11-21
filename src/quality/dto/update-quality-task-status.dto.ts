import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class UpdateQualityTaskStatusDto {
  @IsString()
  @IsNotEmpty({ message: 'Status is required' })
  @IsIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'])
  status!: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}
