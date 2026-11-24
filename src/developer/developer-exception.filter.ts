import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorLoggerService } from './error-logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('GlobalExceptionFilter');

  constructor(private readonly errorLogger: ErrorLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let responseBody: any = null;

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        responseBody = res;
        message = (res as any).message || exception.message || 'Http Exception';
        if (Array.isArray(message)) {
          message = message.join(', ');
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const stack = exception instanceof Error ? exception.stack : undefined;
    const companyId =
      (request.headers['company-id'] as string) ||
      (request as any).user?.companyId ||
      null;
    const userEmail = (request as any).user?.email || null;

    // Record error in memory (retains last 100 errors)
    this.errorLogger.recordError({
      endpoint: request.url || request.originalUrl || '/',
      method: request.method || 'UNKNOWN',
      statusCode: status,
      message,
      stack,
      companyId,
      userEmail,
      source: 'backend',
    });

    if (!response.headersSent) {
      response.status(status).json(
        responseBody || {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message,
        },
      );
    }
  }
}
