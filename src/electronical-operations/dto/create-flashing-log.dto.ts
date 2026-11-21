import {
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateFirmwareFlashingLogDto {
  @IsString()
  @IsOptional()
  flashLogCode?: string;

  @IsString()
  @IsNotEmpty()
  deviceSerialNumber!: string;

  @IsString()
  @IsOptional()
  macAddress?: string;

  @IsString()
  @IsNotEmpty()
  workOrderNumber!: string;

  @IsString()
  @IsNotEmpty()
  firmwareName!: string;

  @IsString()
  @IsNotEmpty()
  firmwareVersion!: string;

  @IsString()
  @IsNotEmpty()
  checksumSha256!: string;

  @IsString()
  @IsOptional()
  flashStatus?: string;

  @IsString()
  @IsNotEmpty()
  flashingStationId!: string;

  @IsString()
  @IsOptional()
  operatorUsername?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
