import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DeveloperGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 1. Check if passport JwtStrategy already authenticated the user with DEVELOPER role
    if (
      request.user?.role === 'DEVELOPER' ||
      request.user?.isDeveloper ||
      request.user?.sub === 'developer-system'
    ) {
      return true;
    }

    // 2. Extract Bearer token from header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Developer authentication token required');
    }

    const token = authHeader.split(' ')[1];
    try {
      const secret =
        this.configService.get<string>('JWT_SECRET') ||
        'manufacturing-erp-default-secret-key-3.8';
      const payload = await this.jwtService.verifyAsync(token, { secret });

      if (
        payload.role === 'DEVELOPER' ||
        payload.isDeveloper ||
        payload.sub === 'developer-system'
      ) {
        request.user = payload;
        return true;
      }
    } catch {
      throw new UnauthorizedException('Invalid or expired developer authentication token');
    }

    throw new UnauthorizedException('Access denied: Developer privileges (role: DEVELOPER) required');
  }
}
