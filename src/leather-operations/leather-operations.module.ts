import { Module } from '@nestjs/common';
import { LeatherOperationsController } from './leather-operations.controller';
import { LeatherOperationsService } from './leather-operations.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LeatherOperationsController],
  providers: [LeatherOperationsService],
  exports: [LeatherOperationsService],
})
export class LeatherOperationsModule {}
