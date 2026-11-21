import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateWeighbridgeSlipDto {
  @IsNotEmpty({ message: 'Truck registration number is required' })
  @IsString()
  truckNumber!: string;

  @IsOptional()
  @IsString()
  driverName?: string;

  @IsOptional()
  @IsString()
  driverPhone?: string;

  @IsNotEmpty({ message: 'Supplier or Buyer name is required' })
  @IsString()
  supplierOrBuyer!: string;

  @IsNotEmpty({ message: 'Material name is required' })
  @IsString()
  materialName!: string;

  @IsOptional()
  @IsString()
  poNumber?: string;

  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @IsNotEmpty({ message: 'Gross weight is required' })
  @IsNumber({}, { message: 'Gross weight must be a valid number' })
  @Min(0, { message: 'Gross weight cannot be negative' })
  grossWeight!: number;

  @IsNotEmpty({ message: 'Tare weight is required' })
  @IsNumber({}, { message: 'Tare weight must be a valid number' })
  @Min(0, { message: 'Tare weight cannot be negative' })
  tareWeight!: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  approvalNotes?: string;
}
