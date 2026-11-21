import { Module } from '@nestjs/common';
import { DairyOperationsController } from './dairy-operations.controller';
import { DairyOperationsService } from './dairy-operations.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DairyOperationsController],
  providers: [DairyOperationsService],
  exports: [DairyOperationsService],
})
export class DairyOperationsModule {}
