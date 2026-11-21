import { Module } from '@nestjs/common';
import { TextilesOperationsService } from './textiles-operations.service';
import { TextilesOperationsController } from './textiles-operations.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TextilesOperationsController],
  providers: [TextilesOperationsService],
  exports: [TextilesOperationsService],
})
export class TextilesOperationsModule {}
