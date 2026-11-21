import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponse, JwtPayload, UserSummary } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new manufacturing enterprise with industry classification and unit mapping
   */
  async register(registerDto: RegisterDto) {
    const normalizedEmail = registerDto.email.trim().toLowerCase();
    const normalizedGst = registerDto.gstNumber.trim().toUpperCase();

    // 1. Verify if company with same GST Number already exists
    const existingGst = await this.prisma.company.findFirst({
      where: { gstNumber: normalizedGst },
    });
    if (existingGst) {
      this.logger.warn(`Registration rejected: Duplicate GSTIN "${normalizedGst}"`);
      throw new ConflictException('A company with this GST Number is already registered.');
    }

    // 2. Verify if corporate email already exists in Company or User table
    const existingCompanyEmail = await this.prisma.company.findFirst({
      where: { email: normalizedEmail },
    });
    if (existingCompanyEmail) {
      this.logger.warn(`Registration rejected: Duplicate company email "${normalizedEmail}"`);
      throw new ConflictException('A company with this email address is already registered.');
    }

    const existingUserEmail = await this.prisma.user.findFirst({
      where: { email: normalizedEmail },
    });
    if (existingUserEmail) {
      this.logger.warn(`Registration rejected: Duplicate user email "${normalizedEmail}"`);
      throw new ConflictException('This email is already in use by an existing user account.');
    }

    // 3. Hash account password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // 4. Generate unique company operational code
    const cleanPrefix =
      registerDto.companyName.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase() || 'MFG';
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const companyCode = `MFG-${cleanPrefix}-${randomDigits}`;

    // 5. Create Company record and initial Administrator User inside an atomic transaction
    const result = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const company = await tx.company.create({
        data: {
          companyName: registerDto.companyName.trim(),
          name: registerDto.companyName.trim(),
          code: companyCode,
          gstNumber: normalizedGst,
          email: normalizedEmail,
          password: hashedPassword,
          industryCategory: registerDto.industryCategory.trim(),
          subCategory: registerDto.subCategory.trim(),
          defaultUnit: registerDto.defaultUnit.trim(),
          phone: registerDto.phone?.trim() || null,
          city: registerDto.city?.trim() || null,
          address: registerDto.address?.trim() || null,
          isActive: true,
        },
      });

      // Prepare initial owner username
      const baseUsername = (registerDto.username || normalizedEmail.split('@')[0])
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_');

      let finalUsername = baseUsername;
      const existingUser = await tx.user.findFirst({ where: { username: finalUsername } });
      if (existingUser) {
        finalUsername = `${baseUsername}_${Math.floor(100 + Math.random() * 900)}`;
      }

      const user = await tx.user.create({
        data: {
          employeeCode: 'EXEC-001',
          email: normalizedEmail,
          username: finalUsername,
          password: hashedPassword,
          firstName: registerDto.companyName.trim(),
          department: 'EXECUTIVE',
          designation: 'OWNER',
          role: 'OWNER',
          companyId: company.id,
          isActive: true,
        },
      });

      return { company, user };
    });

    this.logger.log(
      `Successfully registered company "${result.company.companyName}" (${result.company.code})`,
    );

    return {
      success: true,
      message: 'Company registered successfully. You can now sign in with your corporate credentials.',
      company: {
        id: result.company.id,
        companyName: result.company.companyName,
        code: result.company.code,
        gstNumber: result.company.gstNumber,
        email: result.company.email,
        industryCategory: result.company.industryCategory,
        subCategory: result.company.subCategory,
        defaultUnit: result.company.defaultUnit,
      },
    };
  }

  /**
   * Validate user credentials against Prisma database
   */
  async validateUser(identifier: string, pass: string) {
    const normalizedIdentifier = identifier.trim();

    // Query user by either email or username with company association
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: normalizedIdentifier.toLowerCase() } },
          { username: { equals: normalizedIdentifier } },
        ],
      },
      include: {
        company: {
          select: {
            id: true,
            companyName: true,
            name: true,
            code: true,
            gstNumber: true,
            industryCategory: true,
            subCategory: true,
            defaultUnit: true,
            isActive: true,
          },
        },
      },
    });

    if (!user) {
      this.logger.warn(`Failed login attempt: User not found for identifier "${identifier}"`);
      throw new UnauthorizedException('Invalid Mail ID/Username or Password');
    }

    // Check if user account is active
    if (!user.isActive) {
      this.logger.warn(`Failed login attempt: User account ${user.id} is inactive`);
      throw new UnauthorizedException(
        'Your account has been deactivated. Contact enterprise administrator.',
      );
    }

    // Check if associated company facility is active
    if (user.company && !user.company.isActive) {
      this.logger.warn(`Failed login attempt: Company ${user.company.id} is inactive`);
      throw new UnauthorizedException('Your organization facility is inactive or suspended.');
    }

    // Compare provided password with bcrypt hash
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Failed login attempt: Invalid password for user ${user.id}`);
      throw new UnauthorizedException('Invalid Mail ID/Username or Password');
    }

    // Update last login timestamp in background
    this.prisma.user
      .update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        this.logger.error(`Error updating lastLoginAt for user ${user.id}: ${message}`);
      });

    // Return sanitized user object (omitting password hash)
    const { password: _password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  /**
   * Authenticate user and issue JWT token
   */
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto.identifier, loginDto.password);

    if (!user.companyId) {
      this.logger.warn(`Failed login: User ${user.id} has no registered company association`);
      throw new UnauthorizedException(
        'Your account is not linked to an active enterprise company tenant.',
      );
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: String(user.role),
      department: String(user.department),
      designation: String(user.designation),
      companyId: user.companyId,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const userSummary: UserSummary = {
      id: user.id,
      employeeCode: user.employeeCode,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: String(user.role),
      department: String(user.department),
      designation: String(user.designation),
      companyId: user.companyId,
      company: user.company
        ? {
            id: user.company.id,
            name: user.company.companyName || user.company.name || 'Manufacturing Plant',
            code: user.company.code || 'MFG-001',
          }
        : null,
    };

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 86400, // 24 hours in seconds
      user: userSummary,
    };
  }
}
