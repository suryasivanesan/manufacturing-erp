import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DeveloperController } from './developer.controller';
import { DeveloperService } from './developer.service';
import { ErrorLoggerService } from './error-logger.service';
import { DeveloperGuard } from './developer.guard';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret:
          config.get<string>('JWT_SECRET') ||
          'manufacturing-erp-default-secret-key-3.8',
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [DeveloperController],
  providers: [DeveloperService, ErrorLoggerService, DeveloperGuard],
  exports: [DeveloperService, ErrorLoggerService, DeveloperGuard],
})
export class DeveloperModule {}
