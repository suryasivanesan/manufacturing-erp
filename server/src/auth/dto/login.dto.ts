import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  /**
   * User identifier - can be registered Email Address or Username
   * @example "admin@plant.com" or "plant_operator1"
   */
  @IsNotEmpty({ message: 'Mail ID or Username is required' })
  @IsString({ message: 'Identifier must be a string' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MinLength(3, { message: 'Identifier must be at least 3 characters long' })
  identifier!: string;

  /**
   * User password in plain text to be verified against bcrypt hash
   * @example "SecureP@ss2026"
   */
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;
}
