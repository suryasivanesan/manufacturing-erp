import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ReconcileJobworkDto {
  @IsNotEmpty({ message: 'Received processed weight is required' })
  @IsNumber()
  @Min(0, { message: 'Received weight cannot be negative' })
  receivedWeight!: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Scrap returned weight cannot be negative' })
  scrapReturnedWeight?: number;

  @IsOptional()
  @IsString()
  reconciliationNotes?: string;
}
