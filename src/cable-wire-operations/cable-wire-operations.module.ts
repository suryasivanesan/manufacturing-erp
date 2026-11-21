import { Module } from '@nestjs/common';
import { CableWireOperationsService } from './cable-wire-operations.service';
import { CableWireOperationsController } from './cable-wire-operations.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CableWireOperationsController],
  providers: [CableWireOperationsService],
  exports: [CableWireOperationsService],
})
export class CableWireOperationsModule {}
