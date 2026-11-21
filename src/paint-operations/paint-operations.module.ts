import { Module } from '@nestjs/common';
import { PaintOperationsController } from './paint-operations.controller';
import { PaintOperationsService } from './paint-operations.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PaintOperationsController],
  providers: [PaintOperationsService],
  exports: [PaintOperationsService],
})
export class PaintOperationsModule {}
