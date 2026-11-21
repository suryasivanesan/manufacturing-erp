import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateHydrostaticBurstTestDto {
  @IsOptional()
  @IsString()
  certificateNumber?: string;

  @IsNotEmpty({ message: 'Test sample barcode is required' })
  @IsString()
  testSampleBarcode!: string;

  @IsNotEmpty({ message: 'Pipe specification is required' })
  @IsString()
  pipeSpecification!: string;

  @IsOptional()
  @IsString()
  testType?: string;

  @IsNotEmpty({ message: 'Target test pressure is required' })
  @IsNumber()
  @Min(0.5)
  targetTestPressureBar!: number;

  @IsNotEmpty({ message: 'Achieved burst pressure is required' })
  @IsNumber()
  @Min(0)
  achievedBurstPressureBar!: number;

  @IsNotEmpty({ message: 'Test duration in hours is required' })
  @IsNumber()
  @Min(0.01)
  testDurationHours!: number;

  @IsOptional()
  @IsNumber()
  waterBathTempCelsius?: number;

  @IsOptional()
  @IsNumber()
  calculatedHoopStressMpa?: number;

  @IsOptional()
  @IsString()
  failureMode?: string;

  @IsOptional()
  @IsString()
  complianceStatus?: string;

  @IsOptional()
  @IsBoolean()
  complianceCertificateIssued?: boolean;

  @IsOptional()
  @IsString()
  certifiedByRole?: string;

  @IsOptional()
  @IsString()
  destructiveTestNotes?: string;
}
