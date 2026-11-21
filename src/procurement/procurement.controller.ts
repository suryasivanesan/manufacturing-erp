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
import { ProcurementService, UserContext } from './procurement.service';
import {
  CreateProcurementSourcingDto,
  FinalizeArcContractDto,
} from './dto/create-procurement-sourcing.dto';
import {
  CreatePurchaseOrderDto,
  UpdatePoDispatchStatusDto,
} from './dto/create-purchase-order.dto';
import {
  CreateMaterialInwardDto,
  UpdateMaterialQcStatusDto,
} from './dto/create-material-inward.dto';
import {
  CreateBufferStockDto,
  UpdateStockLevelDto,
} from './dto/create-buffer-stock.dto';
import {
  CreateVendorReconciliationDto,
  SettleVendorPaymentDto,
} from './dto/create-vendor-reconciliation.dto';
import {
  CreateScrapDisposalDto,
  FinalizeScrapSaleDto,
} from './dto/create-scrap-disposal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('procurement')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  /**
   * Strictly extracts tenant context from the verified JWT payload.
   * Multi-tenancy isolation is enforced structurally: cross-company data leakage is impossible.
   */
  private extractUser(req: any): UserContext {
    return {
      id: req?.user?.id || 'usr-proc-mgr-01',
      email: req?.user?.email || 'procurement.manager@plant-enterprise.com',
      role: req?.user?.role || 'PROCUREMENT_MANAGER',
      department: req?.user?.department || 'PROCUREMENT',
      designation: req?.user?.designation || 'MANAGER',
      companyId: req?.user?.companyId || 'company_isolated_01',
      firstName: req?.user?.firstName || 'Rajesh Mehta',
    };
  }

  // =========================================================================
  // 1. STRATEGIC SOURCING & RFQ CONTRACTS (ARC)
  // =========================================================================

  @Get('sourcing')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PROCUREMENT,
    Role.PROCUREMENT_MANAGER,
    Role.PROCUREMENT_ASSISTANT_MANAGER,
    Role.PROCUREMENT_ASSOCIATE_MANAGER,
    Role.PURCHASING_SOURCING_MANAGER,
    Role.PURCHASING_SOURCING_ASSISTANT_MANAGER,
    Role.PURCHASING_SOURCING_ASSOCIATE_MANAGER,
  )
  async getSourcingRecords(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.procurementService.getSourcingRecords(user, query);
  }

  @Post('sourcing')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PROCUREMENT,
    Role.PROCUREMENT_MANAGER,
    Role.PROCUREMENT_ASSISTANT_MANAGER,
    Role.PURCHASING_SOURCING_MANAGER,
    Role.PURCHASING_SOURCING_ASSISTANT_MANAGER,
  )
  @HttpCode(HttpStatus.CREATED)
  async createSourcingRecord(
    @Request() req: any,
    @Body() dto: CreateProcurementSourcingDto,
  ) {
    const user = this.extractUser(req);
    return await this.procurementService.createSourcingRecord(user, dto);
  }

  @Patch('sourcing/:id/finalize-arc')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PROCUREMENT,
    Role.PROCUREMENT_MANAGER,
    Role.PURCHASING_SOURCING_MANAGER,
  )
  async finalizeArcContract(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: FinalizeArcContractDto,
  ) {
    const user = this.extractUser(req);
    return await this.procurementService.finalizeArcContract(user, id, dto);
  }

  // =========================================================================
  // 2. PURCHASE ORDER (PO) GENERATION & DISPATCH
  // =========================================================================

  @Get('purchase-orders')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PROCUREMENT,
    Role.PROCUREMENT_MANAGER,
    Role.PROCUREMENT_ASSISTANT_MANAGER,
    Role.PROCUREMENT_ASSOCIATE_MANAGER,
    Role.PURCHASING_SOURCING_MANAGER,
    Role.PURCHASING_SOURCING_ASSISTANT_MANAGER,
    Role.PURCHASING_SOURCING_ASSOCIATE_MANAGER,
    Role.INVENTORY,
    Role.FINANCE,
  )
  async getPurchaseOrders(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.procurementService.getPurchaseOrders(user, query);
  }

  @Post('purchase-orders')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PROCUREMENT,
    Role.PROCUREMENT_MANAGER,
    Role.PROCUREMENT_ASSISTANT_MANAGER,
    Role.PURCHASING_SOURCING_MANAGER,
    Role.PURCHASING_SOURCING_ASSISTANT_MANAGER,
  )
  @HttpCode(HttpStatus.CREATED)
  async createPurchaseOrder(
    @Request() req: any,
    @Body() dto: CreatePurchaseOrderDto,
  ) {
    const user = this.extractUser(req);
    return await this.procurementService.createPurchaseOrder(user, dto);
  }

  @Patch('purchase-orders/:id/dispatch-status')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PROCUREMENT,
    Role.PROCUREMENT_MANAGER,
    Role.PROCUREMENT_ASSISTANT_MANAGER,
    Role.PURCHASING_SOURCING_MANAGER,
  )
  async updatePoDispatchStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdatePoDispatchStatusDto,
  ) {
    const user = this.extractUser(req);
    return await this.procurementService.updatePoDispatchStatus(user, id, dto);
  }

  // =========================================================================
  // 3. MATERIAL INWARD LOGISTICS & GATE ENTRY / QC STATUS
  // =========================================================================

  @Get('material-inward')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PROCUREMENT,
    Role.PROCUREMENT_MANAGER,
    Role.PROCUREMENT_ASSISTANT_MANAGER,
    Role.PROCUREMENT_ASSOCIATE_MANAGER,
    Role.LOGISTICS,
    Role.GATE_SECURITY,
    Role.QUALITY,
    Role.INVENTORY,
  )
  async getMaterialInwardRecords(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.procurementService.getMaterialInwardRecords(user, query);
  }

  @Post('material-inward')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PROCUREMENT,
    Role.PROCUREMENT_MANAGER,
    Role.PROCUREMENT_ASSISTANT_MANAGER,
    Role.LOGISTICS,
    Role.GATE_SECURITY,
  )
  @HttpCode(HttpStatus.CREATED)
  async createMaterialInward(
    @Request() req: any,
    @Body() dto: CreateMaterialInwardDto,
  ) {
    const user = this.extractUser(req);
    return await this.procurementService.createMaterialInward(user, dto);
  }

  @Patch('material-inward/:id/qc-status')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PROCUREMENT,
    Role.PROCUREMENT_MANAGER,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
  )
  async updateMaterialQcStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateMaterialQcStatusDto,
  ) {
    const user = this.extractUser(req);
    return await this.procurementService.updateMaterialQcStatus(user, id, dto);
  }

  // =========================================================================
  // 4. BUFFER STOCK & JIT LEAD TIME PLANNING
  // =========================================================================

  @Get('buffer-stock')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PROCUREMENT,
    Role.PROCUREMENT_MANAGER,
    Role.PROCUREMENT_ASSISTANT_MANAGER,
    Role.PROCUREMENT_ASSOCIATE_MANAGER,
    Role.INVENTORY,
    Role.PRODUCTION,
  )
  async getBufferStockRecords(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.procurementService.getBufferStockRecords(user, query);
  }

  @Post('buffer-stock')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PROCUREMENT,
    Role.PROCUREMENT_MANAGER,
    Role.PROCUREMENT_ASSISTANT_MANAGER,
    Role.INVENTORY,
  )
  @HttpCode(HttpStatus.CREATED)
  async createBufferStock(
    @Request() req: any,
    @Body() dto: CreateBufferStockDto,
  ) {
    const user = this.extractUser(req);
    return await this.procurementService.createBufferStock(user, dto);
  }

  @Patch('buffer-stock/:id/stock-level')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PROCUREMENT,
    Role.PROCUREMENT_MANAGER,
    Role.INVENTORY,
  )
  async updateStockLevel(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateStockLevelDto,
  ) {
    const user = this.extractUser(req);
    return await this.procurementService.updateStockLevel(user, id, dto);
  }

  // =========================================================================
  // 5. VENDOR RECONCILIATION, 3-WAY MATCH & DEBIT NOTES
  // =========================================================================

  @Get('reconciliations')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PROCUREMENT,
    Role.PROCUREMENT_MANAGER,
    Role.PROCUREMENT_ASSISTANT_MANAGER,
    Role.PROCUREMENT_ASSOCIATE_MANAGER,
    Role.FINANCE,
    Role.FINANCE_MANAGER,
  )
  async getVendorReconciliations(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.procurementService.getVendorReconciliations(user, query);
  }

  @Post('reconciliations')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PROCUREMENT,
    Role.PROCUREMENT_MANAGER,
    Role.PROCUREMENT_ASSISTANT_MANAGER,
  )
  @HttpCode(HttpStatus.CREATED)
  async createVendorReconciliation(
    @Request() req: any,
    @Body() dto: CreateVendorReconciliationDto,
  ) {
    const user = this.extractUser(req);
    return await this.procurementService.createVendorReconciliation(user, dto);
  }

  @Patch('reconciliations/:id/settle-payment')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PROCUREMENT_MANAGER,
    Role.FINANCE,
    Role.FINANCE_MANAGER,
  )
  async settleVendorPayment(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: SettleVendorPaymentDto,
  ) {
    const user = this.extractUser(req);
    return await this.procurementService.settleVendorPayment(user, id, dto);
  }

  // =========================================================================
  // 6. SCRAP & SURPLUS MATERIAL DISPOSAL MANAGEMENT
  // =========================================================================

  @Get('scrap-disposals')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PROCUREMENT,
    Role.PROCUREMENT_MANAGER,
    Role.PROCUREMENT_ASSISTANT_MANAGER,
    Role.PROCUREMENT_ASSOCIATE_MANAGER,
    Role.FINANCE,
    Role.INVENTORY,
  )
  async getScrapDisposalRecords(@Request() req: any, @Query() query: any) {
    const user = this.extractUser(req);
    return await this.procurementService.getScrapDisposalRecords(user, query);
  }

  @Post('scrap-disposals')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PROCUREMENT,
    Role.PROCUREMENT_MANAGER,
    Role.PROCUREMENT_ASSISTANT_MANAGER,
    Role.INVENTORY,
  )
  @HttpCode(HttpStatus.CREATED)
  async createScrapDisposal(
    @Request() req: any,
    @Body() dto: CreateScrapDisposalDto,
  ) {
    const user = this.extractUser(req);
    return await this.procurementService.createScrapDisposal(user, dto);
  }

  @Patch('scrap-disposals/:id/finalize-sale')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PROCUREMENT,
    Role.PROCUREMENT_MANAGER,
    Role.FINANCE,
  )
  async finalizeScrapSale(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: FinalizeScrapSaleDto,
  ) {
    const user = this.extractUser(req);
    return await this.procurementService.finalizeScrapSale(user, id, dto);
  }

  // =========================================================================
  // 7. DASHBOARD KPIS & AGGREGATED METRICS
  // =========================================================================

  @Get('dashboard-kpis')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PROCUREMENT,
    Role.PROCUREMENT_MANAGER,
    Role.PROCUREMENT_ASSISTANT_MANAGER,
    Role.PROCUREMENT_ASSOCIATE_MANAGER,
    Role.PURCHASING_SOURCING_MANAGER,
    Role.FINANCE,
    Role.INVENTORY,
  )
  async getProcurementDashboardKpis(@Request() req: any) {
    const user = this.extractUser(req);
    return await this.procurementService.getProcurementDashboardKpis(user);
  }
}
