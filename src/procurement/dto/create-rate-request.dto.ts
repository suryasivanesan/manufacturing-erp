import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateRateRequestDto {
  @IsNotEmpty()
  @IsString()
  rawMaterialId!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  proposedRate!: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
