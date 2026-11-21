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

    if (user.company && !user.company.isActive) {
      throw new UnauthorizedException('Company account suspended');
    }

    // Verify company association matches payload companyId to prevent cross-tenant token tampering
    if (payload.companyId && user.companyId !== payload.companyId) {
      throw new UnauthorizedException('Tenant context integrity violation');
    }

    const { password: _password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
