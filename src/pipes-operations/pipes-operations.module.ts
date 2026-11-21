import { Module } from '@nestjs/common';
import { PipesOperationsController } from './pipes-operations.controller';
import { PipesOperationsService } from './pipes-operations.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PipesOperationsController],
  providers: [PipesOperationsService],
  exports: [PipesOperationsService],
})
export class PipesOperationsModule {}
