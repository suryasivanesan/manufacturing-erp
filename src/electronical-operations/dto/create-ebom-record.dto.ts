import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateComponentEbomRecordDto {
  @IsString()
  @IsOptional()
  ebomCode?: string;

  @IsString()
  @IsNotEmpty()
  assemblyPartNumber!: string;

  @IsString()
  @IsNotEmpty()
  componentPartNumber!: string;

  @IsString()
  @IsNotEmpty()
  componentCategory!: string;

  @IsString()
  @IsOptional()
  lifecycleStatus?: string;

  @IsString()
  @IsOptional()
  substitutePartNumber?: string;

  @IsOptional()
  substituteApproved?: boolean;

  @IsString()
  @IsOptional()
  ecoNumber?: string;

  @IsString()
  @IsNotEmpty()
  vendorName!: string;

  @IsNumber()
  @Min(0)
  leadTimeWeeks!: number;

  @IsNumber()
  @Min(0)
  unitCostInr!: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
