import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateQualityTaskDto {
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
  @IsNotEmpty({ message: 'Assignee user ID (Assistant or Associate Manager) is required' })
  assigneeId!: string;

  @IsString()
  @IsOptional()
  dueDate?: string;
}
