import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateMouldRecordDto {
  @IsNotEmpty({ message: 'Mould identification code is required' })
  @IsString()
  mouldCode!: string;

  @IsNotEmpty({ message: 'Mould type is required' })
  @IsString()
  mouldType!: string;

  @IsOptional()
  @IsString()
  materialType?: string;

  @IsOptional()
  @IsInt({ message: 'Cavity count must be an integer' })
  @Min(1, { message: 'Cavity count must be at least 1' })
  cavityCount?: number;

  @IsOptional()
  @IsInt({ message: 'Current shot count must be an integer' })
  @Min(0, { message: 'Current shot count cannot be negative' })
  currentShotCount?: number;

  @IsOptional()
  @IsInt({ message: 'Maximum rated shot life must be an integer' })
  @Min(1000, { message: 'Maximum rated shot life must be at least 1,000 cycles' })
  maxShotLife?: number;

  @IsOptional()
  @IsString()
  allocatedLine?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
