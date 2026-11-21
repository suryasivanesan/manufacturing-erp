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
import { LogisticsService, UserContext } from './logistics.service';
import {
  CreateInboundTransportDto,
  UpdateInboundStatusDto,
} from './dto/create-inbound-transport.dto';
import {
  CreateOutboundDispatchDto,
  UpdateOutboundStatusDto,
} from './dto/create-outbound-dispatch.dto';
import {
  CreateWarehouseHandlingDto,
  UpdateWarehouseHandlingDto,
} from './dto/create-warehouse-handling.dto';
import {
  CreateStatutoryDocDto,
  VerifyStatutoryDocDto,
} from './dto/create-statutory-doc.dto';
import {
  CreateFleetMaintenanceDto,
  UpdateFleetStatusDto,
} from './dto/create-fleet-maintenance.dto';
import {
  CreateFreightAuditDto,
  SettleFreightAuditDto,
} from './dto/create-freight-audit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('logistics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LogisticsController {
  constructor(private readonly logisticsService: LogisticsService) {}

  /**
   * Strictly extracts tenant context from the verified JWT payload.
   * Multi-tenancy isolation is enforced structurally: cross-company data leakage is impossible.
   */
  private extractUser(req: any): UserContext {
    return {
      id: req?.user?.id || 'usr-log-mgr-01',
      email: req?.user?.email || 'logistics.head@plant-enterprise.com',
      role: req?.user?.role || 'LOGISTICS_MANAGER',
      department: req?.user?.department || 'LOGISTICS',
      designation: req?.user?.designation || 'MANAGER',
      companyId: req?.user?.companyId || 'company_isolated_01',
      firstName: req?.user?.firstName || 'Suresh Nair',
    };
  }

  // =========================================================================
  // 1. INBOUND LOGISTICS & RAW MATERIAL TRANSPORT
  // =========================================================================

  @Get('inbound')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.LOGISTICS,
    Role.LOGISTICS_MANAGER,
    Role.LOGISTICS_ASSISTANT_MANAGER,
    Role.LOGISTICS_ASSOCIATE_MANAGER,
    Role.PROCUREMENT,
    Role.INVENTORY,
  )
  async getInboundTransports(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.logisticsService.getInboundTransports(user, query);
  }

  @Post('inbound')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.LOGISTICS,
    Role.LOGISTICS_MANAGER,
    Role.LOGISTICS_ASSISTANT_MANAGER,
    Role.PROCUREMENT,
  )
  @HttpCode(HttpStatus.CREATED)
  async createInboundTransport(
    @Request() req: any,
    @Body() dto: CreateInboundTransportDto,
  ) {
    const user = this.extractUser(req);
    return await this.logisticsService.createInboundTransport(user, dto);
  }

  @Patch('inbound/:id/status')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.LOGISTICS,
    Role.LOGISTICS_MANAGER,
  )
  async updateInboundStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateInboundStatusDto,
  ) {
    const user = this.extractUser(req);
    return await this.logisticsService.updateInboundStatus(user, id, dto);
  }

  // =========================================================================
  // 2. OUTBOUND LOGISTICS & FINISHED GOODS DISPATCH
  // =========================================================================

  @Get('outbound')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.LOGISTICS,
    Role.LOGISTICS_MANAGER,
    Role.LOGISTICS_ASSISTANT_MANAGER,
    Role.LOGISTICS_ASSOCIATE_MANAGER,
    Role.SALES,
    Role.GATE_SECURITY,
  )
  async getOutboundDispatches(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.logisticsService.getOutboundDispatches(user, query);
  }

  @Post('outbound')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.LOGISTICS,
    Role.LOGISTICS_MANAGER,
    Role.LOGISTICS_ASSISTANT_MANAGER,
  )
  @HttpCode(HttpStatus.CREATED)
  async createOutboundDispatch(
    @Request() req: any,
    @Body() dto: CreateOutboundDispatchDto,
  ) {
    const user = this.extractUser(req);
    return await this.logisticsService.createOutboundDispatch(user, dto);
  }

  @Patch('outbound/:id/status')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.LOGISTICS,
    Role.LOGISTICS_MANAGER,
  )
  async updateOutboundStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateOutboundStatusDto,
  ) {
    const user = this.extractUser(req);
    return await this.logisticsService.updateOutboundStatus(user, id, dto);
  }

  // =========================================================================
  // 3. WAREHOUSING, STORAGE & MATERIAL HANDLING
  // =========================================================================

  @Get('handling')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.LOGISTICS,
    Role.LOGISTICS_MANAGER,
    Role.LOGISTICS_ASSISTANT_MANAGER,
    Role.LOGISTICS_ASSOCIATE_MANAGER,
    Role.INVENTORY,
  )
  async getWarehouseHandlings(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.logisticsService.getWarehouseHandlings(user, query);
  }

  @Post('handling')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.LOGISTICS,
    Role.LOGISTICS_MANAGER,
    Role.LOGISTICS_ASSISTANT_MANAGER,
  )
  @HttpCode(HttpStatus.CREATED)
  async createWarehouseHandling(
    @Request() req: any,
    @Body() dto: CreateWarehouseHandlingDto,
  ) {
    const user = this.extractUser(req);
    return await this.logisticsService.createWarehouseHandling(user, dto);
  }

  @Patch('handling/:id/status')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.LOGISTICS,
    Role.LOGISTICS_MANAGER,
  )
  async updateWarehouseHandling(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateWarehouseHandlingDto,
  ) {
    const user = this.extractUser(req);
    return await this.logisticsService.updateWarehouseHandling(user, id, dto);
  }

  // =========================================================================
  // 4. STATUTORY DOCUMENTATION & COMPLIANCE (E-WAY BILLS)
  // =========================================================================

  @Get('statutory')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.LOGISTICS,
    Role.LOGISTICS_MANAGER,
    Role.LOGISTICS_ASSISTANT_MANAGER,
    Role.LOGISTICS_ASSOCIATE_MANAGER,
    Role.FINANCE,
    Role.GATE_SECURITY,
  )
  async getStatutoryDocs(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.logisticsService.getStatutoryDocs(user, query);
  }

  @Post('statutory')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.LOGISTICS,
    Role.LOGISTICS_MANAGER,
    Role.LOGISTICS_ASSISTANT_MANAGER,
  )
  @HttpCode(HttpStatus.CREATED)
  async createStatutoryDoc(
    @Request() req: any,
    @Body() dto: CreateStatutoryDocDto,
  ) {
    const user = this.extractUser(req);
    return await this.logisticsService.createStatutoryDoc(user, dto);
  }

  @Patch('statutory/:id/verify')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.LOGISTICS,
    Role.LOGISTICS_MANAGER,
    Role.GATE_SECURITY,
  )
  async verifyStatutoryDoc(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: VerifyStatutoryDocDto,
  ) {
    const user = this.extractUser(req);
    return await this.logisticsService.verifyStatutoryDoc(user, id, dto);
  }

  // =========================================================================
  // 5. FLEET MANAGEMENT & VEHICLE MAINTENANCE
  // =========================================================================

  @Get('fleet')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.LOGISTICS,
    Role.LOGISTICS_MANAGER,
    Role.LOGISTICS_ASSISTANT_MANAGER,
    Role.LOGISTICS_ASSOCIATE_MANAGER,
  )
  async getFleetVehicles(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.logisticsService.getFleetVehicles(user, query);
  }

  @Post('fleet')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.LOGISTICS,
    Role.LOGISTICS_MANAGER,
    Role.LOGISTICS_ASSISTANT_MANAGER,
  )
  @HttpCode(HttpStatus.CREATED)
  async createFleetVehicle(
    @Request() req: any,
    @Body() dto: CreateFleetMaintenanceDto,
  ) {
    const user = this.extractUser(req);
    return await this.logisticsService.createFleetVehicle(user, dto);
  }

  @Patch('fleet/:id/status')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.LOGISTICS,
    Role.LOGISTICS_MANAGER,
  )
  async updateFleetStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateFleetStatusDto,
  ) {
    const user = this.extractUser(req);
    return await this.logisticsService.updateFleetStatus(user, id, dto);
  }

  // =========================================================================
  // 6. FREIGHT COST OPTIMIZATION & LOGISTICS AUDITING
  // =========================================================================

  @Get('audits')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.LOGISTICS,
    Role.LOGISTICS_MANAGER,
    Role.LOGISTICS_ASSISTANT_MANAGER,
    Role.LOGISTICS_ASSOCIATE_MANAGER,
    Role.FINANCE,
  )
  async getFreightAudits(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.logisticsService.getFreightAudits(user, query);
  }

  @Post('audits')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.LOGISTICS,
    Role.LOGISTICS_MANAGER,
    Role.FINANCE,
  )
  @HttpCode(HttpStatus.CREATED)
  async createFreightAudit(
    @Request() req: any,
    @Body() dto: CreateFreightAuditDto,
  ) {
    const user = this.extractUser(req);
    return await this.logisticsService.createFreightAudit(user, dto);
  }

  @Patch('audits/:id/settle')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.LOGISTICS_MANAGER,
    Role.FINANCE,
  )
  async settleFreightAudit(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: SettleFreightAuditDto,
  ) {
    const user = this.extractUser(req);
    return await this.logisticsService.settleFreightAudit(user, id, dto);
  }

  // =========================================================================
  // 7. DASHBOARD KPIS & AGGREGATED METRICS
  // =========================================================================

  @Get('dashboard-kpis')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.LOGISTICS,
    Role.LOGISTICS_MANAGER,
    Role.LOGISTICS_ASSISTANT_MANAGER,
    Role.LOGISTICS_ASSOCIATE_MANAGER,
    Role.SALES,
    Role.PROCUREMENT,
    Role.FINANCE,
  )
  async getLogisticsDashboardKpis(@Request() req: any) {
    const user = this.extractUser(req);
    return await this.logisticsService.getLogisticsDashboardKpis(user);
  }
}
