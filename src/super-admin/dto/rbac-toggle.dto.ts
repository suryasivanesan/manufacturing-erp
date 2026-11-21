import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class RbacToggleDto {
  @IsBoolean()
  @IsNotEmpty({ message: 'isPortalAccessGranted flag is required' })
  isPortalAccessGranted!: boolean;

  @IsString()
  @IsOptional()
  roleOverride?: string;

  @IsString()
  @IsOptional()
  reason?: string;
}
