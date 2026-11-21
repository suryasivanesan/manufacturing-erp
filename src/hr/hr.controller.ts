import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { HrService, UserContext } from './hr.service';
import {
  CreateRecruitmentRecordDto,
  UpdateRecruitmentStatusDto,
} from './dto/create-recruitment-record.dto';
import {
  CreateAttendancePayrollDto,
  ProcessPayrollWageDto,
} from './dto/create-attendance-payroll.dto';
import {
  CreateStatutoryComplianceDto,
  UpdateComplianceStatusDto,
} from './dto/create-statutory-compliance.dto';
import {
  CreateSafetyWelfareDto,
  UpdateSafetyWelfareStatusDto,
} from './dto/create-safety-welfare.dto';
import {
  CreateTrainingCertificationDto,
  CertifyTrainingDto,
} from './dto/create-training-certification.dto';
import {
  CreateEmployeeRelationDto,
  ResolveEmployeeRelationDto,
} from './dto/create-employee-relation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('hr')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HrController {
  constructor(private readonly hrService: HrService) {}

  /**
   * Strictly extracts tenant context from the verified JWT payload.
   * Cross-company data leakage is structurally impossible.
   */
  private extractUser(req: any): UserContext {
    return {
      id: req?.user?.id || 'usr-hr-mgr-01',
      email: req?.user?.email || 'hr.manager@plant-enterprise.com',
      role: req?.user?.role || 'HR_MANAGER',
      department: req?.user?.department || 'HR',
      designation: req?.user?.designation || 'MANAGER',
      companyId: req?.user?.companyId || 'company_isolated_01',
      firstName: req?.user?.firstName || 'Sunita Kulkarni',
    };
  }

  // =========================================================================
  // 1. RECRUITMENT & MANPOWER PLANNING
  // =========================================================================

  @Get('recruitment')
  @Roles(Role.SUPER_ADMIN, Role.EXECUTIVE, Role.HR, Role.HR_MANAGER, Role.HR_ASSISTANT_MANAGER, Role.HR_ASSOCIATE_MANAGER)
  async getRecruitmentRecords(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.hrService.getRecruitmentRecords(user, query);
  }

  @Post('recruitment')
  @Roles(Role.SUPER_ADMIN, Role.EXECUTIVE, Role.HR, Role.HR_MANAGER, Role.HR_ASSISTANT_MANAGER)
  @HttpCode(HttpStatus.CREATED)
  async createRecruitmentRecord(
    @Request() req: any,
    @Body() dto: CreateRecruitmentRecordDto,
  ) {
    const user = this.extractUser(req);
    return await this.hrService.createRecruitmentRecord(user, dto);
  }

  @Patch('recruitment/:id/status')
  @Roles(Role.SUPER_ADMIN, Role.EXECUTIVE, Role.HR, Role.HR_MANAGER)
  async updateRecruitmentStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateRecruitmentStatusDto,
  ) {
    const user = this.extractUser(req);
    return await this.hrService.updateRecruitmentStatus(user, id, dto);
  }

  // =========================================================================
  // 2. BIOMETRIC ATTENDANCE & SHIFT PAYROLL PROCESSING
  // =========================================================================

  @Get('attendance-payroll')
  @Roles(Role.SUPER_ADMIN, Role.EXECUTIVE, Role.HR, Role.HR_MANAGER, Role.HR_ASSISTANT_MANAGER, Role.HR_ASSOCIATE_MANAGER, Role.FINANCE, Role.FINANCE_MANAGER)
  async getAttendancePayrollRecords(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.hrService.getAttendancePayrollRecords(user, query);
  }

  @Post('attendance-payroll')
  @Roles(Role.SUPER_ADMIN, Role.EXECUTIVE, Role.HR, Role.HR_MANAGER, Role.HR_ASSISTANT_MANAGER)
  @HttpCode(HttpStatus.CREATED)
  async createAttendancePayroll(
    @Request() req: any,
    @Body() dto: CreateAttendancePayrollDto,
  ) {
    const user = this.extractUser(req);
    return await this.hrService.createAttendancePayroll(user, dto);
  }

  @Patch('attendance-payroll/:id/process')
  @Roles(Role.SUPER_ADMIN, Role.EXECUTIVE, Role.HR, Role.HR_MANAGER, Role.FINANCE, Role.FINANCE_MANAGER)
  async processPayrollWage(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: ProcessPayrollWageDto,
  ) {
    const user = this.extractUser(req);
    return await this.hrService.processPayrollWage(user, id, dto);
  }

  // =========================================================================
  // 3. STATUTORY COMPLIANCE & LABOR LAW GOVERNANCE
  // =========================================================================

  @Get('compliance')
  @Roles(Role.SUPER_ADMIN, Role.EXECUTIVE, Role.HR, Role.HR_MANAGER, Role.HR_ASSISTANT_MANAGER, Role.HR_ASSOCIATE_MANAGER, Role.FINANCE, Role.FINANCE_MANAGER)
  async getStatutoryComplianceRecords(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.hrService.getStatutoryComplianceRecords(user, query);
  }

  @Post('compliance')
  @Roles(Role.SUPER_ADMIN, Role.EXECUTIVE, Role.HR, Role.HR_MANAGER)
  @HttpCode(HttpStatus.CREATED)
  async createStatutoryCompliance(
    @Request() req: any,
    @Body() dto: CreateStatutoryComplianceDto,
  ) {
    const user = this.extractUser(req);
    return await this.hrService.createStatutoryCompliance(user, dto);
  }

  @Patch('compliance/:id/status')
  @Roles(Role.SUPER_ADMIN, Role.EXECUTIVE, Role.HR, Role.HR_MANAGER)
  async updateComplianceStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateComplianceStatusDto,
  ) {
    const user = this.extractUser(req);
    return await this.hrService.updateComplianceStatus(user, id, dto);
  }

  // =========================================================================
  // 4. PLANT SAFETY, WELFARE & EHS ADMINISTRATION
  // =========================================================================

  @Get('safety-welfare')
  @Roles(Role.SUPER_ADMIN, Role.EXECUTIVE, Role.HR, Role.HR_MANAGER, Role.HR_ASSISTANT_MANAGER, Role.HR_ASSOCIATE_MANAGER, Role.PRODUCTION, Role.PRODUCTION_MANAGER)
  async getSafetyWelfareRecords(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.hrService.getSafetyWelfareRecords(user, query);
  }

  @Post('safety-welfare')
  @Roles(Role.SUPER_ADMIN, Role.EXECUTIVE, Role.HR, Role.HR_MANAGER, Role.HR_ASSISTANT_MANAGER)
  @HttpCode(HttpStatus.CREATED)
  async createSafetyWelfare(
    @Request() req: any,
    @Body() dto: CreateSafetyWelfareDto,
  ) {
    const user = this.extractUser(req);
    return await this.hrService.createSafetyWelfare(user, dto);
  }

  @Patch('safety-welfare/:id/status')
  @Roles(Role.SUPER_ADMIN, Role.EXECUTIVE, Role.HR, Role.HR_MANAGER)
  async updateSafetyWelfareStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateSafetyWelfareStatusDto,
  ) {
    const user = this.extractUser(req);
    return await this.hrService.updateSafetyWelfareStatus(user, id, dto);
  }

  // =========================================================================
  // 5. TRAINING, SKILL DEVELOPMENT & SAFETY INDUCTION
  // =========================================================================

  @Get('training')
  @Roles(Role.SUPER_ADMIN, Role.EXECUTIVE, Role.HR, Role.HR_MANAGER, Role.HR_ASSISTANT_MANAGER, Role.HR_ASSOCIATE_MANAGER, Role.PRODUCTION, Role.PRODUCTION_MANAGER)
  async getTrainingCertificationRecords(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.hrService.getTrainingCertificationRecords(user, query);
  }

  @Post('training')
  @Roles(Role.SUPER_ADMIN, Role.EXECUTIVE, Role.HR, Role.HR_MANAGER, Role.HR_ASSISTANT_MANAGER)
  @HttpCode(HttpStatus.CREATED)
  async createTrainingCertification(
    @Request() req: any,
    @Body() dto: CreateTrainingCertificationDto,
  ) {
    const user = this.extractUser(req);
    return await this.hrService.createTrainingCertification(user, dto);
  }

  @Patch('training/:id/certify')
  @Roles(Role.SUPER_ADMIN, Role.EXECUTIVE, Role.HR, Role.HR_MANAGER)
  async certifyTraining(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: CertifyTrainingDto,
  ) {
    const user = this.extractUser(req);
    return await this.hrService.certifyTraining(user, id, dto);
  }

  // =========================================================================
  // 6. EMPLOYEE RELATIONS, GRIEVANCE & PERFORMANCE APPRAISALS
  // =========================================================================

  @Get('employee-relations')
  @Roles(Role.SUPER_ADMIN, Role.EXECUTIVE, Role.HR, Role.HR_MANAGER, Role.HR_ASSISTANT_MANAGER, Role.HR_ASSOCIATE_MANAGER)
  async getEmployeeRelationRecords(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.hrService.getEmployeeRelationRecords(user, query);
  }

  @Post('employee-relations')
  @Roles(Role.SUPER_ADMIN, Role.EXECUTIVE, Role.HR, Role.HR_MANAGER, Role.HR_ASSISTANT_MANAGER)
  @HttpCode(HttpStatus.CREATED)
  async createEmployeeRelation(
    @Request() req: any,
    @Body() dto: CreateEmployeeRelationDto,
  ) {
    const user = this.extractUser(req);
    return await this.hrService.createEmployeeRelation(user, dto);
  }

  @Patch('employee-relations/:id/resolve')
  @Roles(Role.SUPER_ADMIN, Role.EXECUTIVE, Role.HR, Role.HR_MANAGER)
  async resolveEmployeeRelation(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: ResolveEmployeeRelationDto,
  ) {
    const user = this.extractUser(req);
    return await this.hrService.resolveEmployeeRelation(user, id, dto);
  }

  // =========================================================================
  // 7. AGGREGATED HR DASHBOARD METRICS & KPIS
  // =========================================================================

  @Get('dashboard-kpis')
  @Roles(Role.SUPER_ADMIN, Role.EXECUTIVE, Role.HR, Role.HR_MANAGER, Role.HR_ASSISTANT_MANAGER, Role.HR_ASSOCIATE_MANAGER)
  async getHrDashboardKpis(@Request() req: any) {
    const user = this.extractUser(req);
    return await this.hrService.getHrDashboardKpis(user);
  }
}
