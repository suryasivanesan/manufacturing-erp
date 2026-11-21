import { Module } from '@nestjs/common';
import { RubberOperationsController } from './rubber-operations.controller';
import { RubberOperationsService } from './rubber-operations.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RubberOperationsController],
  providers: [RubberOperationsService],
  exports: [RubberOperationsService],
})
export class RubberOperationsModule {}
