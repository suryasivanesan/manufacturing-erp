import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { ErrorLoggerService } from './developer/error-logger.service';
import { GlobalExceptionFilter } from './developer/developer-exception.filter';

async function bootstrap() {
  const logger = new Logger('ManufacturingERP-Server');
  const app = await NestFactory.create(AppModule);

  // Parse allowed origins from FRONTEND_URL (supports comma-separated origins)
  const rawFrontendUrls = process.env.FRONTEND_URL || '';
  const allowedOrigins = rawFrontendUrls
    .split(',')
    .map((url) => url.trim().replace(/\/$/, ''))
    .filter(Boolean);

  // Enable CORS for Next.js frontend communication (supporting comma-separated origins, Vercel deployments, localhost, and env vars)
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, '');
      const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      const isVercel = /^https:\/\/[a-zA-Z0-9_-]+\.vercel\.app$/.test(origin);

      if (
        isLocal ||
        isVercel ||
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(normalizedOrigin)
      ) {
        return callback(null, true);
      }

      return callback(null, true);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Requested-With', 'company-id'],
    credentials: true,
  });

  // Enable global validation pipe for request DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Global exception filter to capture live runtime & API errors in memory for the developer view
  const errorLogger = app.get(ErrorLoggerService);
  app.useGlobalFilters(new GlobalExceptionFilter(errorLogger));

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  logger.log(`Manufacturing ERP Server running on port ${port} (bound to 0.0.0.0)`);
}

bootstrap();
