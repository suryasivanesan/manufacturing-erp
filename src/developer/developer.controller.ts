import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DeveloperService } from './developer.service';
import { DeveloperGuard } from './developer.guard';

@Controller('developer')
export class DeveloperController {
  constructor(private readonly developerService: DeveloperService) {}

  /**
   * Retrieve overview of companies, users, system health and runtime errors
   * GET /developer/overview
   */
  @Get('overview')
  @UseGuards(DeveloperGuard)
  async getOverview() {
    return this.developerService.getOverview();
  }

  /**
   * Reset a user's password from the developer console
   * POST /developer/reset-user-password
   */
  @Post('reset-user-password')
  @UseGuards(DeveloperGuard)
  @HttpCode(HttpStatus.OK)
  async resetUserPassword(
    @Body() body: { userId: string; newPassword?: string },
  ) {
    return this.developerService.resetUserPassword(body.userId, body.newPassword);
  }

  /**
   * Clear in-memory captured error logs
   * POST /developer/clear-errors
   */
  @Post('clear-errors')
  @UseGuards(DeveloperGuard)
  @HttpCode(HttpStatus.OK)
  async clearErrors() {
    return this.developerService.clearErrors();
  }

  /**
   * Record errors captured from client-side / frontend telemetry
   * POST /developer/report-frontend-error
   */
  @Post('report-frontend-error')
  @HttpCode(HttpStatus.OK)
  async reportFrontendError(
    @Body()
    body: {
      message: string;
      stack?: string;
      endpoint?: string;
      statusCode?: number;
      companyId?: string;
      userEmail?: string;
    },
  ) {
    return this.developerService.recordFrontendError(body);
  }
}
