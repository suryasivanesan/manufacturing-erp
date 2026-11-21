import { Module } from '@nestjs/common';
import { ElectronicalOperationsController } from './electronical-operations.controller';
import { ElectronicalOperationsService } from './electronical-operations.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ElectronicalOperationsController],
  providers: [ElectronicalOperationsService],
  exports: [ElectronicalOperationsService],
})
export class ElectronicalOperationsModule {}
