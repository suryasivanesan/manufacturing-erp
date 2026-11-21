import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateFormulaMasterDto {
  @IsOptional()
  @IsString()
  formulaCode?: string;

  @IsNotEmpty({ message: 'Product name is required' })
  @IsString()
  productName!: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsNotEmpty({ message: 'Reaction stoichiometry equation is required' })
  @IsString()
  stoichiometryEquation!: string;

  @IsNotEmpty({ message: 'Theoretical yield in kg is required' })
  @IsNumber({}, { message: 'Theoretical yield must be a valid number' })
  @Min(0.01, { message: 'Theoretical yield must be greater than zero' })
  theoreticalYieldKg!: number;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  expectedCycleTimeHours?: number;

  @IsNotEmpty({ message: 'Reaction type is required' })
  @IsString()
  reactionType!: string;

  @IsOptional()
  @IsString()
  hazardClassification?: string;

  @IsOptional()
  @IsString()
  activeStatus?: string;

  @IsOptional()
  @IsString()
  rawMaterialsComposition?: string;

  @IsOptional()
  @IsString()
  safetyDataSheetUrl?: string;

  @IsOptional()
  @IsString()
  authorizationNotes?: string;
}
