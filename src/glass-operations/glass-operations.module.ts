import { Module } from '@nestjs/common';
import { GlassOperationsController } from './glass-operations.controller';
import { GlassOperationsService } from './glass-operations.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GlassOperationsController],
  providers: [GlassOperationsService],
  exports: [GlassOperationsService],
})
export class GlassOperationsModule {}
