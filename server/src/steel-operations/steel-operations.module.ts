import { Module } from '@nestjs/common';
import { SteelOperationsController } from './steel-operations.controller';
import { SteelOperationsService } from './steel-operations.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SteelOperationsController],
  providers: [SteelOperationsService],
  exports: [SteelOperationsService],
})
export class SteelOperationsModule {}
