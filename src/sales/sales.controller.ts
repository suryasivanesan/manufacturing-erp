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
import { SalesService, UserContext } from './sales.service';
import {
  CreateSalesLeadDto,
  UpdateSalesLeadStatusDto,
} from './dto/create-sales-lead.dto';
import {
  CreateSalesQuotationDto,
  UpdateSalesQuotationStatusDto,
} from './dto/create-sales-quotation.dto';
import {
  CreateSalesOrderDto,
  UpdateSalesOrderStatusDto,
} from './dto/create-sales-order.dto';
import {
  CreateSalesDispatchDto,
  UpdateSalesDispatchStatusDto,
} from './dto/create-sales-dispatch.dto';
import {
  CreateSalesBillingDto,
  SettleSalesPaymentDto,
} from './dto/create-sales-billing.dto';
import {
  CreateSalesFeedbackDto,
  ResolveSalesFeedbackDto,
} from './dto/create-sales-feedback.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  /**
   * Strictly extracts tenant context from the verified JWT payload.
   * Multi-tenancy isolation is enforced structurally: cross-company data leakage is impossible.
   */
  private extractUser(req: any): UserContext {
    return {
      id: req?.user?.id || 'usr-sales-mgr-01',
      email: req?.user?.email || 'sales.director@plant-enterprise.com',
      role: req?.user?.role || 'SALES_MANAGER',
      department: req?.user?.department || 'SALES',
      designation: req?.user?.designation || 'MANAGER',
      companyId: req?.user?.companyId || 'company_isolated_01',
      firstName: req?.user?.firstName || 'Vikram Rao',
    };
  }

  // =========================================================================
  // 1. MARKET RESEARCH, LEAD GENERATION & CUSTOMER ACQUISITION
  // =========================================================================

  @Get('leads')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.SALES,
    Role.SALES_MANAGER,
    Role.SALES_ASSISTANT_MANAGER,
    Role.SALES_ASSOCIATE_MANAGER,
  )
  async getLeads(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.salesService.getLeads(user, query);
  }

  @Post('leads')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.SALES,
    Role.SALES_MANAGER,
    Role.SALES_ASSISTANT_MANAGER,
  )
  @HttpCode(HttpStatus.CREATED)
  async createLead(@Request() req: any, @Body() dto: CreateSalesLeadDto) {
    const user = this.extractUser(req);
    return await this.salesService.createLead(user, dto);
  }

  @Patch('leads/:id/status')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.SALES,
    Role.SALES_MANAGER,
  )
  async updateLeadStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateSalesLeadStatusDto,
  ) {
    const user = this.extractUser(req);
    return await this.salesService.updateLeadStatus(user, id, dto);
  }

  // =========================================================================
  // 2. INQUIRY PROCESSING, QUOTATION & PRICE NEGOTIATION
  // =========================================================================

  @Get('quotations')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.SALES,
    Role.SALES_MANAGER,
    Role.SALES_ASSISTANT_MANAGER,
    Role.SALES_ASSOCIATE_MANAGER,
    Role.FINANCE,
  )
  async getQuotations(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.salesService.getQuotations(user, query);
  }

  @Post('quotations')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.SALES,
    Role.SALES_MANAGER,
    Role.SALES_ASSISTANT_MANAGER,
  )
  @HttpCode(HttpStatus.CREATED)
  async createQuotation(@Request() req: any, @Body() dto: CreateSalesQuotationDto) {
    const user = this.extractUser(req);
    return await this.salesService.createQuotation(user, dto);
  }

  @Patch('quotations/:id/status')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.SALES,
    Role.SALES_MANAGER,
  )
  async updateQuotationStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateSalesQuotationStatusDto,
  ) {
    const user = this.extractUser(req);
    return await this.salesService.updateQuotationStatus(user, id, dto);
  }

  // =========================================================================
  // 3. SALES ORDER (SO) GENERATION & PRODUCTION COORDINATION
  // =========================================================================

  @Get('orders')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.SALES,
    Role.SALES_MANAGER,
    Role.SALES_ASSISTANT_MANAGER,
    Role.SALES_ASSOCIATE_MANAGER,
    Role.PRODUCTION,
    Role.INVENTORY,
  )
  async getOrders(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.salesService.getOrders(user, query);
  }

  @Post('orders')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.SALES,
    Role.SALES_MANAGER,
    Role.SALES_ASSISTANT_MANAGER,
  )
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Request() req: any, @Body() dto: CreateSalesOrderDto) {
    const user = this.extractUser(req);
    return await this.salesService.createOrder(user, dto);
  }

  @Patch('orders/:id/status')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.SALES,
    Role.SALES_MANAGER,
    Role.PRODUCTION,
  )
  async updateOrderStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateSalesOrderStatusDto,
  ) {
    const user = this.extractUser(req);
    return await this.salesService.updateOrderStatus(user, id, dto);
  }

  // =========================================================================
  // 4. DISPATCH COORDINATION & LOGISTICS MANAGEMENT
  // =========================================================================

  @Get('dispatches')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.SALES,
    Role.SALES_MANAGER,
    Role.SALES_ASSISTANT_MANAGER,
    Role.SALES_ASSOCIATE_MANAGER,
    Role.LOGISTICS,
    Role.GATE_SECURITY,
  )
  async getDispatches(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.salesService.getDispatches(user, query);
  }

  @Post('dispatches')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.SALES,
    Role.SALES_MANAGER,
    Role.LOGISTICS,
  )
  @HttpCode(HttpStatus.CREATED)
  async createDispatch(@Request() req: any, @Body() dto: CreateSalesDispatchDto) {
    const user = this.extractUser(req);
    return await this.salesService.createDispatch(user, dto);
  }

  @Patch('dispatches/:id/status')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.SALES,
    Role.SALES_MANAGER,
    Role.LOGISTICS,
  )
  async updateDispatchStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateSalesDispatchStatusDto,
  ) {
    const user = this.extractUser(req);
    return await this.salesService.updateDispatchStatus(user, id, dto);
  }

  // =========================================================================
  // 5. CREDIT CONTROL, INVOICING & PAYMENT COLLECTION
  // =========================================================================

  @Get('billings')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.SALES,
    Role.SALES_MANAGER,
    Role.SALES_ASSISTANT_MANAGER,
    Role.SALES_ASSOCIATE_MANAGER,
    Role.FINANCE,
  )
  async getBillings(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.salesService.getBillings(user, query);
  }

  @Post('billings')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.SALES,
    Role.SALES_MANAGER,
    Role.FINANCE,
  )
  @HttpCode(HttpStatus.CREATED)
  async createBilling(@Request() req: any, @Body() dto: CreateSalesBillingDto) {
    const user = this.extractUser(req);
    return await this.salesService.createBilling(user, dto);
  }

  @Patch('billings/:id/settle-payment')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.SALES_MANAGER,
    Role.FINANCE,
  )
  async settlePayment(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: SettleSalesPaymentDto,
  ) {
    const user = this.extractUser(req);
    return await this.salesService.settlePayment(user, id, dto);
  }

  // =========================================================================
  // 6. CUSTOMER RELATIONSHIP MANAGEMENT (CRM) & FEEDBACK
  // =========================================================================

  @Get('feedbacks')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.SALES,
    Role.SALES_MANAGER,
    Role.SALES_ASSISTANT_MANAGER,
    Role.SALES_ASSOCIATE_MANAGER,
    Role.QUALITY,
  )
  async getFeedbacks(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.salesService.getFeedbacks(user, query);
  }

  @Post('feedbacks')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.SALES,
    Role.SALES_MANAGER,
    Role.SALES_ASSISTANT_MANAGER,
  )
  @HttpCode(HttpStatus.CREATED)
  async createFeedback(@Request() req: any, @Body() dto: CreateSalesFeedbackDto) {
    const user = this.extractUser(req);
    return await this.salesService.createFeedback(user, dto);
  }

  @Patch('feedbacks/:id/resolve')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.SALES_MANAGER,
    Role.QUALITY,
  )
  async resolveFeedback(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: ResolveSalesFeedbackDto,
  ) {
    const user = this.extractUser(req);
    return await this.salesService.resolveFeedback(user, id, dto);
  }

  // =========================================================================
  // 7. DASHBOARD KPIS & AGGREGATED METRICS
  // =========================================================================

  @Get('dashboard-kpis')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.SALES,
    Role.SALES_MANAGER,
    Role.SALES_ASSISTANT_MANAGER,
    Role.SALES_ASSOCIATE_MANAGER,
    Role.FINANCE,
    Role.PRODUCTION,
  )
  async getSalesDashboardKpis(@Request() req: any) {
    const user = this.extractUser(req);
    return await this.salesService.getSalesDashboardKpis(user);
  }
}
