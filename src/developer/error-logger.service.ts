import { Injectable, Logger } from '@nestjs/common';

export interface CapturedError {
  id: string;
  timestamp: string;
  endpoint: string;
  method: string;
  statusCode: number;
  message: string;
  stack?: string;
  companyId?: string | null;
  userEmail?: string | null;
  source: 'backend' | 'frontend';
}

@Injectable()
export class ErrorLoggerService {
  private readonly logger = new Logger(ErrorLoggerService.name);
  private readonly maxErrors = 100;
  private readonly errors: CapturedError[] = [];

  recordError(entry: Omit<CapturedError, 'id' | 'timestamp'>): CapturedError {
    const errorRecord: CapturedError = {
      id: `err_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };

    this.errors.unshift(errorRecord);
    if (this.errors.length > this.maxErrors) {
      this.errors.pop();
    }

    this.logger.warn(
      `[${entry.source.toUpperCase()}] ${entry.method} ${entry.endpoint} - ${entry.statusCode}: ${entry.message}`,
    );

    return errorRecord;
  }

  getErrors(): CapturedError[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors.length = 0;
    this.logger.log('Developer error logs cleared');
  }
}
