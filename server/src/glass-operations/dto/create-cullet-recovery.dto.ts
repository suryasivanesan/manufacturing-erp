import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCulletRecoveryDto {
  @IsOptional()
  @IsString()
  recordNumber?: string;

  @IsNotEmpty({ message: 'Production line name is required' })
  @IsString()
  productionLine!: string;

  @IsNotEmpty({ message: 'Hot end rejection weight is required' })
  @IsNumber({}, { message: 'Hot end rejection weight must be a valid number' })
  @Min(0, { message: 'Hot end rejection weight cannot be negative' })
  hotEndRejectionWeight!: number;

  @IsNotEmpty({ message: 'Cold end rejection weight is required' })
  @IsNumber({}, { message: 'Cold end rejection weight must be a valid number' })
  @Min(0, { message: 'Cold end rejection weight cannot be negative' })
  coldEndRejectionWeight!: number;

  @IsNotEmpty({ message: 'Recovered cullet weight is required' })
  @IsNumber({}, { message: 'Recovered cullet weight must be a valid number' })
  @Min(0, { message: 'Recovered cullet weight cannot be negative' })
  recoveredCulletWeight!: number;

  @IsOptional()
  @IsString()
  reconciliationNotes?: string;
}
