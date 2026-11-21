import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Request,
  Response,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { QualityService, UserContext } from './quality.service';
import { CreateQualityTaskDto } from './dto/create-quality-task.dto';
import { UpdateQualityTaskStatusDto } from './dto/update-quality-task-status.dto';
import { CreateQualityCheckDto } from './dto/create-quality-check.dto';
import { CreateQualityReportDto } from './dto/create-quality-report.dto';
import {
  CreateDepartmentLaborDto,
  UpdateLaborAttendanceDto,
  AdjustLaborSalaryDto,
} from './dto/manage-labor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('quality')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QualityController {
  constructor(private readonly qualityService: QualityService) {}

  private extractUser(req: any): UserContext {
    return {
      id: req?.user?.id || 'usr-qmgr-01',
      email: req?.user?.email || 'quality.manager@plant-enterprise.com',
      role: req?.user?.role || 'QUALITY_MANAGER',
      department: req?.user?.department || 'QUALITY',
      designation: req?.user?.designation || 'MANAGER',
      companyId: req?.user?.companyId || 'company_isolated_01',
      firstName: req?.user?.firstName || 'Dr. Ramesh Sharma',
    };
  }

  // =========================================================================
  // 1. QUALITY HIERARCHY & TASK ASSIGNMENT
  // =========================================================================

  @Get('hierarchy')
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.EXECUTIVE,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.QUALITY_ASSISTANT_MANAGER,
    Role.QUALITY_ASSOCIATE_MANAGER,
  )
  async getHierarchy(@Request() req: any) {
    const user = this.extractUser(req);
    return this.qualityService.getDepartmentHierarchy(user);
  }

  @Post('tasks')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
  )
  async createTask(@Request() req: any, @Body() dto: CreateQualityTaskDto) {
    const user = this.extractUser(req);
    return this.qualityService.createTask(user, dto);
  }

  @Get('tasks')
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.EXECUTIVE,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.QUALITY_ASSISTANT_MANAGER,
    Role.QUALITY_ASSOCIATE_MANAGER,
  )
  async getTasks(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('assigneeId') assigneeId?: string,
  ) {
    const user = this.extractUser(req);
    return this.qualityService.getTasks(user, status, assigneeId);
  }

  @Patch('tasks/:id/status')
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.QUALITY_ASSISTANT_MANAGER,
    Role.QUALITY_ASSOCIATE_MANAGER,
  )
  async updateTaskStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateQualityTaskStatusDto,
  ) {
    const user = this.extractUser(req);
    return this.qualityService.updateTaskStatus(user, id, dto);
  }

  // =========================================================================
  // 2. DUAL QUALITY INSPECTIONS (Raw Materials & Finished Products)
  // =========================================================================

  @Post('checks')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.QUALITY_ASSISTANT_MANAGER,
    Role.QUALITY_ASSOCIATE_MANAGER,
  )
  async createQualityCheck(
    @Request() req: any,
    @Body() dto: CreateQualityCheckDto,
  ) {
    const user = this.extractUser(req);
    return this.qualityService.createQualityCheck(user, dto);
  }

  @Get('checks')
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.EXECUTIVE,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.QUALITY_ASSISTANT_MANAGER,
    Role.QUALITY_ASSOCIATE_MANAGER,
  )
  async getQualityChecks(
    @Request() req: any,
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    const user = this.extractUser(req);
    return this.qualityService.getQualityChecks(user, type, status);
  }

  // =========================================================================
  // 3. QUALITY OPERATIONS REPORTS (RM In/Used, FG Out, Rework In/Out)
  // =========================================================================

  @Post('reports')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.QUALITY_ASSISTANT_MANAGER,
  )
  async createQualityReport(
    @Request() req: any,
    @Body() dto: CreateQualityReportDto,
  ) {
    const user = this.extractUser(req);
    return this.qualityService.createQualityReport(user, dto);
  }

  @Get('reports')
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.EXECUTIVE,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.QUALITY_ASSISTANT_MANAGER,
    Role.QUALITY_ASSOCIATE_MANAGER,
  )
  async getQualityReports(@Request() req: any, @Query('shift') shift?: string) {
    const user = this.extractUser(req);
    return this.qualityService.getQualityReports(user, shift);
  }

  // =========================================================================
  // 4. DEPARTMENT LABOR & ATTENDANCE MANAGEMENT
  // =========================================================================

  @Get('labor')
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.EXECUTIVE,
    Role.HR,
    Role.HR_MANAGER,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.QUALITY_ASSISTANT_MANAGER,
  )
  async getDepartmentLabor(
    @Request() req: any,
    @Query('month') month?: string,
  ) {
    const user = this.extractUser(req);
    return this.qualityService.getDepartmentLabor(user, month);
  }

  @Post('labor')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.HR,
    Role.HR_MANAGER,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
  )
  async createDepartmentLabor(
    @Request() req: any,
    @Body() dto: CreateDepartmentLaborDto,
  ) {
    const user = this.extractUser(req);
    return this.qualityService.createDepartmentLabor(user, dto);
  }

  @Patch('labor/:id/attendance')
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.HR,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.QUALITY_ASSISTANT_MANAGER,
  )
  async updateLaborAttendance(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateLaborAttendanceDto,
  ) {
    const user = this.extractUser(req);
    return this.qualityService.updateLaborAttendance(user, id, dto);
  }

  @Patch('labor/:id/salary')
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.HR,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
  )
  async adjustLaborSalary(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: AdjustLaborSalaryDto,
  ) {
    const user = this.extractUser(req);
    return this.qualityService.adjustLaborSalary(user, id, dto);
  }

  // =========================================================================
  // 5. EXCEL EXPORT WITH PRECISE DATE-TIME STAMP
  // =========================================================================

  @Get('export/excel')
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.EXECUTIVE,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.QUALITY_ASSISTANT_MANAGER,
  )
  async exportQualityExcel(@Request() req: any, @Response() res: any) {
    const user = this.extractUser(req);
    const result = await this.qualityService.exportQualityExcel(user);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${result.fileName}"`,
    );
    res.setHeader('X-Audit-Timestamp', result.timeStamp);
    res.status(HttpStatus.OK).send(result.csvContent);
  }
}
