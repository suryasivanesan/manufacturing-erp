import { Module } from '@nestjs/common';
import { FurnitureOperationsController } from './furniture-operations.controller';
import { FurnitureOperationsService } from './furniture-operations.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FurnitureOperationsController],
  providers: [FurnitureOperationsService],
  exports: [FurnitureOperationsService],
})
export class FurnitureOperationsModule {}
