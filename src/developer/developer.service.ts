import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { ErrorLoggerService, CapturedError } from './error-logger.service';

export interface DeveloperOverviewResponse {
  health: {
    database: {
      connected: boolean;
      provider: string;
      status: string;
      latencyMs: number;
      error?: string | null;
    };
    server: {
      uptimeSeconds: number;
      uptimeFormatted: string;
      memory: {
        rssMB: number;
        heapTotalMB: number;
        heapUsedMB: number;
        externalMB: number;
      };
      nodeVersion: string;
      platform: string;
      timestamp: string;
    };
    counts: {
      totalCompanies: number;
      totalUsers: number;
      activeCompanies: number;
      activeUsers: number;
      capturedErrors: number;
    };
  };
  companies: Array<{
    id: string;
    companyName: string;
    code: string | null;
    gstNumber: string;
    email: string;
    industryCategory: string;
    subCategory: string;
    defaultUnit: string;
    city: string | null;
    phone: string | null;
    isActive: boolean;
    createdAt: Date;
    userCount: number;
    users: Array<{
      id: string;
      email: string;
      username: string | null;
      employeeCode: string | null;
      name: string;
      role: string;
      department: string;
      designation: string;
      isActive: boolean;
      lastLoginAt: Date | null;
      createdAt: Date;
      passwordHashPreview: string;
    }>;
  }>;
  errors: CapturedError[];
}

@Injectable()
export class DeveloperService {
  private readonly logger = new Logger(DeveloperService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly errorLogger: ErrorLoggerService,
  ) {}

  /**
   * Format seconds to human-readable string (e.g. "1d 4h 12m 30s")
   */
  private formatUptime(seconds: number): string {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(' ');
  }

  /**
   * Retrieve platform developer overview including database status, system health,
   * all registered tenant companies, user credentials metadata, and error logs.
   */
  async getOverview(): Promise<DeveloperOverviewResponse> {
    // 1. Check Database connection & response latency
    let dbConnected = false;
    let dbLatencyMs = 0;
    let dbError: string | null = null;
    const startPing = Date.now();

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbConnected = true;
      dbLatencyMs = Date.now() - startPing;
    } catch (err: any) {
      dbError = err.message || 'Unable to connect to database';
      this.logger.error(`Database connectivity check failed: ${dbError}`);
    }

    // 2. Compute server memory metrics
    const mem = process.memoryUsage();
    const memory = {
      rssMB: Math.round((mem.rss / (1024 * 1024)) * 10) / 10,
      heapTotalMB: Math.round((mem.heapTotal / (1024 * 1024)) * 10) / 10,
      heapUsedMB: Math.round((mem.heapUsed / (1024 * 1024)) * 10) / 10,
      externalMB: Math.round((mem.external / (1024 * 1024)) * 10) / 10,
    };

    const uptimeSeconds = Math.round(process.uptime());

    // 3. Aggregate company and user counts
    let totalCompanies = 0;
    let activeCompanies = 0;
    let totalUsers = 0;
    let activeUsers = 0;
    let companiesWithUsers: any[] = [];

    try {
      const [allCompanies, activeCompanyCount, allUsersCount, activeUserCount] =
        await Promise.all([
          this.prisma.company.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
              users: {
                select: {
                  id: true,
                  email: true,
                  username: true,
                  employeeCode: true,
                  firstName: true,
                  lastName: true,
                  role: true,
                  department: true,
                  designation: true,
                  isActive: true,
                  lastLoginAt: true,
                  createdAt: true,
                  password: true,
                },
                orderBy: { createdAt: 'asc' },
              },
            },
          }),
          this.prisma.company.count({ where: { isActive: true } }),
          this.prisma.user.count(),
          this.prisma.user.count({ where: { isActive: true } }),
        ]);

      companiesWithUsers = allCompanies;
      totalCompanies = allCompanies.length;
      activeCompanies = activeCompanyCount;
      totalUsers = allUsersCount;
      activeUsers = activeUserCount;
    } catch (err: any) {
      this.logger.error(`Failed to fetch companies and users: ${err.message}`);
    }

    // 4. Transform companies and users data with password hash previews
    const formattedCompanies = companiesWithUsers.map((c) => ({
      id: c.id,
      companyName: c.companyName || c.name || 'Enterprise Facility',
      code: c.code,
      gstNumber: c.gstNumber,
      email: c.email,
      industryCategory: c.industryCategory,
      subCategory: c.subCategory,
      defaultUnit: c.defaultUnit,
      city: c.city,
      phone: c.phone,
      isActive: c.isActive,
      createdAt: c.createdAt,
      userCount: c.users.length,
      users: c.users.map((u: any) => ({
        id: u.id,
        email: u.email,
        username: u.username,
        employeeCode: u.employeeCode,
        name: [u.firstName, u.lastName].filter(Boolean).join(' ') || u.username || 'User',
        role: String(u.role),
        department: String(u.department),
        designation: String(u.designation),
        isActive: u.isActive,
        lastLoginAt: u.lastLoginAt,
        createdAt: u.createdAt,
        passwordHashPreview: u.password ? `${u.password.substring(0, 16)}...` : 'N/A',
      })),
    }));

    // 5. Gather captured error records
    const errors = this.errorLogger.getErrors();

    return {
      health: {
        database: {
          connected: dbConnected,
          provider: 'PostgreSQL (Neon / Cloud DB)',
          status: dbConnected
            ? dbLatencyMs < 250
              ? 'Healthy'
              : 'Degraded'
            : 'Disconnected',
          latencyMs: dbLatencyMs,
          error: dbError,
        },
        server: {
          uptimeSeconds,
          uptimeFormatted: this.formatUptime(uptimeSeconds),
          memory,
          nodeVersion: process.version,
          platform: process.platform,
          timestamp: new Date().toISOString(),
        },
        counts: {
          totalCompanies,
          activeCompanies,
          totalUsers,
          activeUsers,
          capturedErrors: errors.length,
        },
      },
      companies: formattedCompanies,
      errors,
    };
  }

  /**
   * Reset a registered user's password directly from the developer console
   */
  async resetUserPassword(userId: string, newPassword?: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        company: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    const passwordToSet =
      newPassword && newPassword.trim().length >= 6
        ? newPassword.trim()
        : `Erp@${Math.floor(100000 + Math.random() * 900000)}`;

    const hashedPassword = await bcrypt.hash(passwordToSet, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    this.logger.log(
      `Developer reset password for user "${user.email}" (${user.id}) in company "${user.company?.companyName}"`,
    );

    return {
      success: true,
      message: `Password updated successfully for ${user.email}`,
      userId: user.id,
      userEmail: user.email,
      companyName: user.company?.companyName,
      newPassword: passwordToSet,
    };
  }

  /**
   * Clear in-memory captured error logs
   */
  clearErrors() {
    this.errorLogger.clearErrors();
    return {
      success: true,
      message: 'All captured runtime and API error logs have been cleared.',
    };
  }

  /**
   * Record errors captured from client-side frontend
   */
  recordFrontendError(payload: {
    message: string;
    stack?: string;
    endpoint?: string;
    statusCode?: number;
    companyId?: string;
    userEmail?: string;
  }) {
    const errorRecord = this.errorLogger.recordError({
      endpoint: payload.endpoint || '/client-ui',
      method: 'CLIENT_UI',
      statusCode: payload.statusCode || 500,
      message: payload.message || 'Unhandled Client Exception',
      stack: payload.stack,
      companyId: payload.companyId || null,
      userEmail: payload.userEmail || null,
      source: 'frontend',
    });

    return {
      success: true,
      errorId: errorRecord.id,
    };
  }
}
