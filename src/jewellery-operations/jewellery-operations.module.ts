import { Module } from '@nestjs/common';
import { JewelleryOperationsService } from './jewellery-operations.service';
import { JewelleryOperationsController } from './jewellery-operations.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [JewelleryOperationsController],
  providers: [JewelleryOperationsService],
  exports: [JewelleryOperationsService],
})
export class JewelleryOperationsModule {}
