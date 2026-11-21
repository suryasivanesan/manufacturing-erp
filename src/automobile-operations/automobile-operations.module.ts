import { Module } from '@nestjs/common';
import { AutomobileOperationsController } from './automobile-operations.controller';
import { AutomobileOperationsService } from './automobile-operations.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AutomobileOperationsController],
  providers: [AutomobileOperationsService],
  exports: [AutomobileOperationsService],
})
export class AutomobileOperationsModule {}
