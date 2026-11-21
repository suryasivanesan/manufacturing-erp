import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHeatTestDto {
  @IsNotEmpty({ message: 'Heat identification number is required' })
  @IsString()
  heatNumber!: string;

  @IsNotEmpty({ message: 'Steel grade is required (e.g. Fe500D, SS-304)' })
  @IsString()
  grade!: string;

  @IsOptional()
  @IsString()
  batchNumber?: string;

  // Spectrometry Chemical Composition %
  @IsOptional()
  @IsNumber()
  carbon?: number;

  @IsOptional()
  @IsNumber()
  manganese?: number;

  @IsOptional()
  @IsNumber()
  silicon?: number;

  @IsOptional()
  @IsNumber()
  sulphur?: number;

  @IsOptional()
  @IsNumber()
  phosphorus?: number;

  @IsOptional()
  @IsNumber()
  chromium?: number;

  // Mechanical Properties
  @IsOptional()
  @IsNumber()
  yieldStrength?: number;

  @IsOptional()
  @IsNumber()
  tensileStrength?: number;

  @IsOptional()
  @IsNumber()
  elongation?: number;

  @IsOptional()
  @IsString()
  labTechnicianNotes?: string;
}
