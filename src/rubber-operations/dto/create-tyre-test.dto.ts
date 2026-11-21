import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateTyreUniformityTestDto {
  @IsOptional()
  @IsString()
  testRecordNumber?: string;

  @IsNotEmpty({ message: 'Tyre serial number is required' })
  @IsString()
  tyreSerialNumber!: string;

  @IsNotEmpty({ message: 'DOT code is required' })
  @IsString()
  dotCode!: string;

  @IsNotEmpty({ message: 'Tyre size pattern is required' })
  @IsString()
  tyreSizePattern!: string;

  @IsNotEmpty({ message: 'Radial runout is required' })
  @IsNumber()
  @Min(0)
  @Max(10)
  radialRunoutMm!: number;

  @IsNotEmpty({ message: 'Lateral runout is required' })
  @IsNumber()
  @Min(0)
  @Max(10)
  lateralRunoutMm!: number;

  @IsNotEmpty({ message: 'Radial force variation is required' })
  @IsNumber()
  @Min(0)
  radialForceVariationN!: number;

  @IsNotEmpty({ message: 'Lateral force variation is required' })
  @IsNumber()
  @Min(0)
  lateralForceVariationN!: number;

  @IsNotEmpty({ message: 'Conicity is required' })
  @IsNumber()
  @Min(0)
  conicityN!: number;

  @IsNotEmpty({ message: 'Dynamic balance static is required' })
  @IsNumber()
  @Min(0)
  dynamicBalanceStaticGram!: number;

  @IsNotEmpty({ message: 'Dynamic balance couple is required' })
  @IsNumber()
  @Min(0)
  dynamicBalanceCoupleGram!: number;

  @IsOptional()
  @IsString()
  gradingClassification?: string;

  @IsOptional()
  @IsBoolean()
  clearedForDispatch?: boolean;

  @IsOptional()
  @IsString()
  remarks?: string;
}
