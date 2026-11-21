import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ElectricEquipmentOperationsService } from './electric-equipment-operations.service';
import { ElectricEquipmentOperationsController } from './electric-equipment-operations.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ElectricEquipmentOperationsController],
  providers: [ElectricEquipmentOperationsService],
  exports: [ElectricEquipmentOperationsService],
})
export class ElectricEquipmentOperationsModule {}
