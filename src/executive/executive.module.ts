import { Module } from '@nestjs/common';
import { ExecutiveService } from './executive.service';
import { ExecutiveController } from './executive.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ApprovalsModule } from '../approvals/approvals.module';

@Module({
  imports: [PrismaModule, ApprovalsModule],
  controllers: [ExecutiveController],
  providers: [ExecutiveService],
  exports: [ExecutiveService],
})
export class ExecutiveModule {}
