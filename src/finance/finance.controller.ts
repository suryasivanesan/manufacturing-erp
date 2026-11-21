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
import { FinanceService, UserContext } from './finance.service';
import {
  CreateFinanceTaskDto,
  UpdateFinanceTaskStatusDto,
} from './dto/create-finance-task.dto';
import { CreateFinancialMetricDto } from './dto/create-financial-metric.dto';
import {
  CreatePayrollRequestDto,
  ApprovePayrollRequestDto,
  DisbursePayrollRequestDto,
} from './dto/manage-payroll-request.dto';
import {
  CreateCashBankLedgerDto,
  UpdateCashBankBalanceDto,
} from './dto/manage-cash-bank.dto';
import {
  CreateTaxRecordDto,
  ApproveTaxPaymentDto,
  MarkTaxPaidDto,
} from './dto/manage-tax-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('finance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  private extractUser(req: any): UserContext {
    return {
      id: req?.user?.id || 'usr-fin-mgr-01',
      email: req?.user?.email || 'finance.manager@plant-enterprise.com',
      role: req?.user?.role || 'FINANCE_MANAGER',
      department: req?.user?.department || 'FINANCE',
      designation: req?.user?.designation || 'MANAGER',
      companyId: req?.user?.companyId || 'company_isolated_01',
      firstName: req?.user?.firstName || 'Vikram Malhotra',
    };
  }

  // =========================================================================
  // 1. PERSONNEL & HIERARCHICAL STRUCTURE
  // =========================================================================

  @Get('hierarchy')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.FINANCE,
    Role.FINANCE_MANAGER,
    Role.FINANCE_ASSISTANT_MANAGER,
    Role.FINANCE_ASSOCIATE_MANAGER,
  )
  async getHierarchy(@Request() req: any) {
    const user = this.extractUser(req);
    return this.financeService.getFinanceHierarchy(user);
  }

  // =========================================================================
  // 2. TASK DELEGATION & MANAGEMENT
  // =========================================================================

  @Get('tasks')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.FINANCE,
    Role.FINANCE_MANAGER,
    Role.FINANCE_ASSISTANT_MANAGER,
    Role.FINANCE_ASSOCIATE_MANAGER,
  )
  async getTasks(@Request() req: any, @Query('status') status?: string) {
    const user = this.extractUser(req);
    return this.financeService.getFinanceTasks(user, status);
  }

  @Post('tasks')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.FINANCE,
    Role.FINANCE_MANAGER,
  )
  async createTask(@Request() req: any, @Body() dto: CreateFinanceTaskDto) {
    const user = this.extractUser(req);
    return this.financeService.createFinanceTask(user, dto);
  }

  @Patch('tasks/:id/status')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.FINANCE,
    Role.FINANCE_MANAGER,
    Role.FINANCE_ASSISTANT_MANAGER,
    Role.FINANCE_ASSOCIATE_MANAGER,
  )
  async updateTaskStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateFinanceTaskStatusDto,
  ) {
    const user = this.extractUser(req);
    return this.financeService.updateFinanceTaskStatus(user, id, dto);
  }

  // =========================================================================
  // 3. FINANCIAL METRICS & PROFIT / LOSS STATEMENTS
  // =========================================================================

  @Get('metrics')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.FINANCE,
    Role.FINANCE_MANAGER,
    Role.FINANCE_ASSISTANT_MANAGER,
    Role.FINANCE_ASSOCIATE_MANAGER,
  )
  async getMetrics(@Request() req: any, @Query('fiscalMonth') fiscalMonth?: string) {
    const user = this.extractUser(req);
    return this.financeService.getFinancialMetrics(user, fiscalMonth);
  }

  @Post('metrics')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.FINANCE,
    Role.FINANCE_MANAGER,
  )
  async createMetric(@Request() req: any, @Body() dto: CreateFinancialMetricDto) {
    const user = this.extractUser(req);
    return this.financeService.createFinancialMetric(user, dto);
  }

  @Get('profit-loss')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.FINANCE,
    Role.FINANCE_MANAGER,
    Role.FINANCE_ASSISTANT_MANAGER,
    Role.FINANCE_ASSOCIATE_MANAGER,
  )
  async getProfitLoss(@Request() req: any, @Query('fiscalMonth') fiscalMonth?: string) {
    const user = this.extractUser(req);
    return this.financeService.getProfitLossStatement(user, fiscalMonth);
  }

  // =========================================================================
  // 4. PAYROLL & SUPER ADMIN FUND RELEASE APPROVAL WORKFLOW
  // =========================================================================

  @Get('payroll-requests')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.FINANCE,
    Role.FINANCE_MANAGER,
    Role.FINANCE_ASSISTANT_MANAGER,
    Role.FINANCE_ASSOCIATE_MANAGER,
  )
  async getPayrollRequests(
    @Request() req: any,
    @Query('month') month?: string,
    @Query('status') status?: string,
  ) {
    const user = this.extractUser(req);
    return this.financeService.getPayrollRequests(user, month, status);
  }

  @Post('payroll-requests')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.FINANCE,
    Role.FINANCE_MANAGER,
    Role.FINANCE_ASSISTANT_MANAGER,
  )
  async createPayrollRequest(@Request() req: any, @Body() dto: CreatePayrollRequestDto) {
    const user = this.extractUser(req);
    return this.financeService.createPayrollRequest(user, dto);
  }

  @Patch('payroll-requests/:id/approve')
  @Roles(Role.SUPER_ADMIN, Role.EXECUTIVE)
  async approvePayrollRequest(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: ApprovePayrollRequestDto,
  ) {
    const user = this.extractUser(req);
    return this.financeService.approvePayrollRequest(user, id, dto);
  }

  @Post('payroll-requests/:id/disburse')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.FINANCE,
    Role.FINANCE_MANAGER,
  )
  async disbursePayrollFunds(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: DisbursePayrollRequestDto,
  ) {
    const user = this.extractUser(req);
    return this.financeService.disbursePayrollFunds(user, id, dto);
  }

  // =========================================================================
  // 5. CASH & BANK LEDGER ACCOUNTS
  // =========================================================================

  @Get('ledger')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.FINANCE,
    Role.FINANCE_MANAGER,
    Role.FINANCE_ASSISTANT_MANAGER,
    Role.FINANCE_ASSOCIATE_MANAGER,
  )
  async getLedgers(@Request() req: any) {
    const user = this.extractUser(req);
    return this.financeService.getCashBankLedgers(user);
  }

  @Post('ledger')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.FINANCE,
    Role.FINANCE_MANAGER,
  )
  async createLedger(@Request() req: any, @Body() dto: CreateCashBankLedgerDto) {
    const user = this.extractUser(req);
    return this.financeService.createCashBankLedger(user, dto);
  }

  @Patch('ledger/:id/balance')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.FINANCE,
    Role.FINANCE_MANAGER,
    Role.FINANCE_ASSISTANT_MANAGER,
  )
  async updateBalance(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateCashBankBalanceDto,
  ) {
    const user = this.extractUser(req);
    return this.financeService.updateAccountBalance(user, id, dto);
  }

  // =========================================================================
  // 6. TAX CONFIGURATION & SUPER ADMIN APPROVAL
  // =========================================================================

  @Get('taxes')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.FINANCE,
    Role.FINANCE_MANAGER,
    Role.FINANCE_ASSISTANT_MANAGER,
    Role.FINANCE_ASSOCIATE_MANAGER,
  )
  async getTaxes(
    @Request() req: any,
    @Query('fiscalPeriod') fiscalPeriod?: string,
    @Query('taxType') taxType?: string,
  ) {
    const user = this.extractUser(req);
    return this.financeService.getTaxRecords(user, fiscalPeriod, taxType);
  }

  @Post('taxes')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.FINANCE,
    Role.FINANCE_MANAGER,
    Role.FINANCE_ASSISTANT_MANAGER,
  )
  async createTaxRecord(@Request() req: any, @Body() dto: CreateTaxRecordDto) {
    const user = this.extractUser(req);
    return this.financeService.createTaxRecord(user, dto);
  }

  @Patch('taxes/:id/approve')
  @Roles(Role.SUPER_ADMIN, Role.EXECUTIVE)
  async approveTaxPayment(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: ApproveTaxPaymentDto,
  ) {
    const user = this.extractUser(req);
    return this.financeService.approveTaxPayment(user, id, dto);
  }

  @Patch('taxes/:id/pay')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.FINANCE,
    Role.FINANCE_MANAGER,
  )
  async markTaxPaid(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: MarkTaxPaidDto,
  ) {
    const user = this.extractUser(req);
    return this.financeService.markTaxPaid(user, id, dto);
  }

  // =========================================================================
  // 7. DATE-TIME STAMPED ENTERPRISE EXCEL AUDIT EXPORT
  // =========================================================================

  @Get('export/excel')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.FINANCE,
    Role.FINANCE_MANAGER,
    Role.FINANCE_ASSISTANT_MANAGER,
    Role.FINANCE_ASSOCIATE_MANAGER,
  )
  async exportExcel(@Request() req: any, @Response() res: any) {
    const user = this.extractUser(req);
    const exportResult = await this.financeService.exportFinanceExcel(user);

    res.setHeader('Content-Type', exportResult.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${exportResult.fileName}"`);
    res.setHeader('X-File-Name', exportResult.fileName);
    return res.end(exportResult.buffer);
  }
}
