import { Module } from '@nestjs/common';
import { GateSecurityController } from './gate-security.controller';
import { GateSecurityService } from './gate-security.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GateSecurityController],
  providers: [GateSecurityService],
  exports: [GateSecurityService],
})
export class GateSecurityModule {}
