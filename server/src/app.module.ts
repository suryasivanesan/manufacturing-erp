import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SteelOperationsModule } from './steel-operations/steel-operations.module';
import { GlassOperationsModule } from './glass-operations/glass-operations.module';
import { ChemicalOperationsModule } from './chemical-operations/chemical-operations.module';
import { PaintOperationsModule } from './paint-operations/paint-operations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    SteelOperationsModule,
    GlassOperationsModule,
    ChemicalOperationsModule,
    PaintOperationsModule,
  ],
})
export class AppModule {}
