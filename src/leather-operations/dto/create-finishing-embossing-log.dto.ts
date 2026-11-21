import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateFinishingEmbossingLogDto {
  @IsString()
  @IsNotEmpty({ message: 'Finish batch code is required' })
  finishBatchCode!: string;

  @IsString()
  @IsNotEmpty({ message: 'Article name is required' })
  articleName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Finish formulation code is required' })
  finishFormulationCode!: string;

  @IsString()
  @IsNotEmpty({ message: 'Finishing type is required' })
  finishingType!: string; // ANILINE, SEMI_ANILINE, PIGMENTED, PULL_UP, PATENT

  @IsString()
  @IsNotEmpty({ message: 'Spray booth line ID is required' })
  sprayBoothLineId!: string;

  @IsNumber()
  @Min(5)
  sprayViscositySecs!: number;

  @IsNumber()
  @Min(0.5)
  sprayPressureBar!: number;

  @IsNumber()
  @Min(30)
  tunnelDryingTempCelsius!: number;

  @IsString()
  @IsNotEmpty({ message: 'Embossing pattern is required' })
  embossingPattern!: string; // NAPPA, CROCO, PEBBLE_GRAIN, SAFFIANO, SMOOTH

  @IsNumber()
  @Min(40)
  embossingPlateTempCelsius!: number;

  @IsNumber()
  @Min(10)
  embossingPressureBar!: number;

  @IsNumber()
  @Min(0.5)
  embossingDwellTimeSecs!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  glossLusterGu!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  targetGlossGu!: number;

  @IsNumber()
  @Min(100)
  colorFastnessRubCycles!: number;

  @IsNumber()
  @Min(1)
  hidesFinishedCount!: number;

  @IsString()
  @IsOptional()
  status?: string; // SPRAYING, EMBOSSING, FINISHING_COMPLETED, RE_BUFF_REQUIRED

  @IsString()
  @IsOptional()
  supervisorNotes?: string;
}
