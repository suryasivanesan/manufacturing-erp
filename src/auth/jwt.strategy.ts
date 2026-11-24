import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './interfaces/auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ||
        'manufacturing-erp-default-secret-key-3.8',
    });
  }

  async validate(payload: JwtPayload) {
    // Platform Developer Authentication Bypass: Developers have system-wide scope without tenant constraints
    if (payload.role === 'DEVELOPER' || (payload as any).isDeveloper || payload.sub === 'developer-system') {
      return {
        id: payload.sub || 'developer-system',
        email: payload.email || 'erp@devel.com',
        username: payload.username || 'platform-developer',
        role: 'DEVELOPER',
        isDeveloper: true,
        department: 'SYSTEM',
        designation: 'PLATFORM_DEVELOPER',
        companyId: 'developer-system',
      };
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
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

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User account no longer active or token expired');
    }

    // Strict Multi-Tenancy: Every authenticated user must be bound to a valid company
    if (!user.companyId || !user.company) {
      throw new UnauthorizedException('User is not associated with an active company facility');
    }

    if (!user.company.isActive) {
      throw new UnauthorizedException('Company account suspended');
    }

    // Verify company association matches payload companyId to prevent cross-tenant token tampering
    if (payload.companyId && user.companyId !== payload.companyId) {
      throw new UnauthorizedException('Tenant context integrity violation: Mismatched company identification');
    }

    const { password: _password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
