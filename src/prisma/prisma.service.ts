import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  // Dynamic index signature to support specialized operational models added to schema
  [key: string]: any;

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Connected to Manufacturing ERP Database via Prisma');
    } catch (error) {
      this.logger.error('Database connection failed', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Disconnected from Manufacturing ERP Database');
  }
}
