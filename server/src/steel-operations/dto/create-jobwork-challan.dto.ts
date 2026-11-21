import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateJobworkChallanDto {
  @IsNotEmpty({ message: 'Subcontractor / Vendor name is required' })
  @IsString()
  vendorName!: string;

  @IsOptional()
  @IsString()
  vendorGst?: string;

  @IsNotEmpty({ message: 'Process type is required (e.g. Galvanizing, Pickling, Heat Treatment, Slitting)' })
  @IsString()
  processType!: string;

  @IsNotEmpty({ message: 'Dispatched material description is required' })
  @IsString()
  materialSent!: string;

  @IsNotEmpty({ message: 'Sent weight is required' })
  @IsNumber()
  @Min(0.001, { message: 'Sent weight must be greater than zero' })
  sentWeight!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
