import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  ALL_INDUSTRY_CATEGORIES,
  ALL_SUB_CATEGORIES,
  IndustryCategory,
  SubCategory,
} from '../constants/industry.constants';

export class RegisterDto {
  /**
   * Official registered company / enterprise name
   * @example "Apex Steel & Alloys Ltd."
   */
  @IsNotEmpty({ message: 'Company Name is required' })
  @IsString({ message: 'Company Name must be a string' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MinLength(2, { message: 'Company Name must be at least 2 characters' })
  companyName!: string;

  /**
   * GST Number (alphanumeric enterprise tax identifier)
   * @example "27AAACA1234A1Z5"
   */
  @IsNotEmpty({ message: 'GST Number is required' })
  @IsString({ message: 'GST Number must be a string' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  gstNumber!: string;

  /**
   * Official Corporate / Administrator Email
   * @example "admin@apexsteel.com"
   */
  @IsNotEmpty({ message: 'Email address is required' })
  @IsEmail({}, { message: 'Please provide a valid corporate email address' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  email!: string;

  /**
   * Optional custom username for login
   * @example "apex_admin"
   */
  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MinLength(3, { message: 'Username must contain at least 3 characters' })
  username?: string;

  /**
   * Account Password for initial administrator authentication
   * @example "SecurePlantPass2026"
   */
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  /**
   * Primary Industry Category from the refined 5 standard sectors:
   * 1. Heavy and Raw Materials
   * 2. Chemical Industries
   * 3. Engineering, Machinery and Electronics
   * 4. Consumer Goods
   * 5. Food
   * @example "Heavy and Raw Materials"
   */
  @IsNotEmpty({ message: 'Industry Category is required' })
  @IsString({ message: 'Industry Category must be a string' })
  @IsIn(ALL_INDUSTRY_CATEGORIES, {
    message: `Industry Category must be one of: ${ALL_INDUSTRY_CATEGORIES.join(', ')}`,
  })
  industryCategory!: string;

  /**
   * Specific sector selected within the category strictly from the 15 refined sub-categories
   * @example "Steel and Heavy Metals"
   */
  @IsNotEmpty({ message: 'Sub-Category is required' })
  @IsString({ message: 'Sub-Category must be a string' })
  @IsIn(ALL_SUB_CATEGORIES, {
    message: `Sub-Category must be one of: ${ALL_SUB_CATEGORIES.join(', ')}`,
  })
  subCategory!: string;

  /**
   * Associated default measurement unit (MT, kg, m, m2, Pcs, ltr, gm, etc.)
   * @example "MT"
   */
  @IsNotEmpty({ message: 'Default Unit configuration is required' })
  @IsString({ message: 'Default Unit must be a string' })
  defaultUnit!: string;

  /**
   * Optional contact phone number
   */
  @IsOptional()
  @IsString()
  phone?: string;

  /**
   * Optional city location of plant
   */
  @IsOptional()
  @IsString()
  city?: string;

  /**
   * Optional physical plant address
   */
  @IsOptional()
  @IsString()
  address?: string;
}
