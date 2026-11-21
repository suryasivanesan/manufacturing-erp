import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponse } from './interfaces/auth.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * New Company Registration endpoint
   * POST /auth/register
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Enterprise Sign In endpoint
   * POST /auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  /**
   * Protected route to retrieve authenticated user profile with company configuration
   * Returns ONLY the specialized roles pertinent strictly to the tenant's sub-category
   * GET /auth/profile
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any) {
    const user = req.user;
    const subCategory = user?.company?.subCategory;
    const allowedSpecializedRoles = this.authService.getSpecializedRolesForSubCategory(subCategory);

    return {
      ...user,
      industryCategory: user?.company?.industryCategory,
      subCategory: user?.company?.subCategory,
      defaultUnit: user?.company?.defaultUnit,
      allowedSpecializedRoles,
    };
  }

  /**
   * Retrieve company profile configuration strictly scoped to registered sub-category
   * GET /auth/company
   */
  @Get('company')
  @UseGuards(JwtAuthGuard)
  getCompany(@Request() req: any) {
    const user = req.user;
    const company = user?.company;
    const subCategory = company?.subCategory;
    const allowedSpecializedRoles = this.authService.getSpecializedRolesForSubCategory(subCategory);

    return {
      company,
      industryCategory: company?.industryCategory,
      subCategory: company?.subCategory,
      defaultUnit: company?.defaultUnit,
      allowedSpecializedRoles,
    };
  }
}
