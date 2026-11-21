import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateFinanceTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Task title is required' })
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
  priority?: string;

  @IsString()
  @IsNotEmpty({ message: 'Assignee user ID (Assistant or Associate Finance Manager) is required' })
  assigneeId!: string;

  @IsString()
  @IsOptional()
  dueDate?: string;
}

export class UpdateFinanceTaskStatusDto {
  @IsString()
  @IsNotEmpty({ message: 'Status is required' })
  @IsIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'])
  status!: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}
