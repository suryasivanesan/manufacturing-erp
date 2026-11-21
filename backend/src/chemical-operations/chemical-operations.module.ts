import { Module } from '@nestjs/common';
import { ChemicalOperationsController } from './chemical-operations.controller';
import { ChemicalOperationsService } from './chemical-operations.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ChemicalOperationsController],
  providers: [ChemicalOperationsService],
  exports: [ChemicalOperationsService],
})
export class ChemicalOperationsModule {}
