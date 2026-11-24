import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SuperAdminService, UserContext } from './super-admin.service';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { PayrollAdjustmentDto } from './dto/payroll-adjustment.dto';
import { RbacToggleDto } from './dto/rbac-toggle.dto';
import { CreateAuditEntryDto } from './dto/create-audit-entry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('super-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.CEO, Role.MD, Role.OWNER, Role.EXECUTIVE)
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  private extractUser(req: any): UserContext {
    return {
      id: req?.user?.id || 'super-admin-root',
      email: req?.user?.email || 'admin@plant-enterprise.com',
      role: req?.user?.role || 'SUPER_ADMIN',
      companyId: req?.user?.companyId || 'company_isolated_01',
      firstName: req?.user?.firstName || 'Super Admin',
    };
  }

  // =========================================================================
  // 1. WORK MONITORING API
  // =========================================================================

  @Get('work-monitoring')
  async getWorkMonitoring(@Request() req: any) {
    const user = this.extractUser(req);
    return this.superAdminService.getWorkMonitoring(user);
  }

  // =========================================================================
  // 2. DASHBOARD ANALYTICS API (Monthly Turnover, P&L, Output, Sales)
  // =========================================================================

  @Get('analytics')
  async getAnalytics(@Request() req: any) {
    const user = this.extractUser(req);
    return this.superAdminService.getDashboardAnalytics(user);
  }

  // =========================================================================
  // 3. RAW MATERIALS MANAGEMENT CRUD
  // =========================================================================

  @Get('raw-materials')
  async getRawMaterials(@Request() req: any) {
    const user = this.extractUser(req);
    return this.superAdminService.getRawMaterials(user);
  }

  @Post('raw-materials')
  @HttpCode(HttpStatus.CREATED)
  async createRawMaterial(@Request() req: any, @Body() dto: CreateRawMaterialDto) {
    const user = this.extractUser(req);
    return this.superAdminService.createRawMaterial(user, dto);
  }

  @Put('raw-materials/:id')
  async updateRawMaterial(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: Partial<CreateRawMaterialDto>,
  ) {
    const user = this.extractUser(req);
    return this.superAdminService.updateRawMaterial(user, id, dto);
  }

  @Delete('raw-materials/:id')
  async deleteRawMaterial(@Request() req: any, @Param('id') id: string) {
    const user = this.extractUser(req);
    return this.superAdminService.deleteRawMaterial(user, id);
  }

  // =========================================================================
  // 4. PRODUCT MANAGEMENT CRUD
  // =========================================================================

  @Get('products')
  async getProducts(@Request() req: any) {
    const user = this.extractUser(req);
    return this.superAdminService.getProducts(user);
  }

  @Get('products/:id')
  async getProduct(@Request() req: any, @Param('id') id: string) {
    const user = this.extractUser(req);
    return this.superAdminService.getProduct(user, id);
  }

  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Request() req: any, @Body() dto: CreateProductDto) {
    const user = this.extractUser(req);
    return this.superAdminService.createProduct(user, dto);
  }

  @Put('products/:id')
  async updateProduct(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: Partial<CreateProductDto>,
  ) {
    const user = this.extractUser(req);
    return this.superAdminService.updateProduct(user, id, dto);
  }

  @Delete('products/:id')
  async deleteProduct(@Request() req: any, @Param('id') id: string) {
    const user = this.extractUser(req);
    return this.superAdminService.deleteProduct(user, id);
  }

  // =========================================================================
  // 5. HR / PAYROLL & EMPLOYEE STATUS (Attendance, Adjustments, Hire/Terminate)
  // =========================================================================

  @Get('payroll')
  async getPayrolls(@Request() req: any, @Query('month') month?: string) {
    const user = this.extractUser(req);
    return this.superAdminService.getPayrolls(user, month);
  }

  @Post('payroll/adjust')
  @HttpCode(HttpStatus.OK)
  async adjustPayroll(@Request() req: any, @Body() dto: PayrollAdjustmentDto) {
    const user = this.extractUser(req);
    return this.superAdminService.adjustPayroll(user, dto);
  }

  @Patch('payroll/employee-status/:userId')
  async toggleHireTerminate(
    @Request() req: any,
    @Param('userId') targetUserId: string,
    @Body('status') newStatus: 'HIRE' | 'TERMINATED',
  ) {
    const user = this.extractUser(req);
    return this.superAdminService.toggleHireTerminate(user, targetUserId, newStatus);
  }

  // =========================================================================
  // 6. DEPARTMENT-WISE EXCEL EXPORT SERVICE
  // =========================================================================

  @Get('export/department-employees')
  async exportDepartmentEmployees(
    @Request() req: any,
    @Query('department') department?: string,
  ) {
    const user = this.extractUser(req);
    return this.superAdminService.exportDepartmentEmployeesExcel(user, department);
  }

  // =========================================================================
  // 7. RBAC PERMISSION MANAGEMENT (Grant / Revoke Portal Access)
  // =========================================================================

  @Patch('rbac/toggle-access/:userId')
  async togglePortalAccess(
    @Request() req: any,
    @Param('userId') targetUserId: string,
    @Body() dto: RbacToggleDto,
  ) {
    const user = this.extractUser(req);
    return this.superAdminService.togglePortalAccess(user, targetUserId, dto);
  }

  // =========================================================================
  // 8. COMPANY MOVEMENT AUDIT API
  // =========================================================================

  @Get('audit-logs')
  async getAuditLogs(@Request() req: any, @Query('limit') limit?: string) {
    const user = this.extractUser(req);
    const numLimit = limit ? parseInt(limit, 10) : 50;
    return this.superAdminService.getAuditLogs(user, numLimit);
  }

  @Post('audit-logs')
  @HttpCode(HttpStatus.CREATED)
  async recordAuditLog(@Request() req: any, @Body() dto: CreateAuditEntryDto) {
    const user = this.extractUser(req);
    await this.superAdminService.recordAuditMovement(user, dto);
    return { success: true, message: 'Movement recorded in audit log.' };
  }

  // =========================================================================
  // 9. NOTIFICATIONS & ALERTS API
  // =========================================================================

  @Get('notifications')
  async getNotifications(@Request() req: any) {
    const user = this.extractUser(req);
    return this.superAdminService.getNotifications(user);
  }

  @Patch('notifications/:id/read')
  async markNotificationRead(@Request() req: any, @Param('id') id: string) {
    const user = this.extractUser(req);
    return this.superAdminService.markNotificationRead(user, id);
  }

  @Patch('notifications/read-all')
  async markAllNotificationsRead(@Request() req: any) {
    const user = this.extractUser(req);
    return this.superAdminService.markAllNotificationsRead(user);
  }

  // =========================================================================
  // 10. RATE CHANGE REQUESTS & APPROVAL RECALCULATION
  // =========================================================================

  @Get('rate-requests')
  async getRateRequests(@Request() req: any, @Query('status') status?: string) {
    const user = this.extractUser(req);
    return this.superAdminService.getRateRequests(user, status);
  }

  @Post('rate-requests/:id/approve')
  async approveRateRequest(
    @Request() req: any,
    @Param('id') id: string,
    @Body('approvedRate') approvedRate?: number,
  ) {
    const user = this.extractUser(req);
    return this.superAdminService.approveRateRequest(user, id, approvedRate);
  }

  @Post('rate-requests/:id/reject')
  async rejectRateRequest(
    @Request() req: any,
    @Param('id') id: string,
    @Body('rejectionReason') rejectionReason?: string,
  ) {
    const user = this.extractUser(req);
    return this.superAdminService.rejectRateRequest(user, id, rejectionReason);
  }

  // =========================================================================
  // 11. DIRECT RAW MATERIAL RATE UPDATE (SUPER ADMIN DIRECT OVERRIDE)
  // =========================================================================

  @Patch('raw-materials/:id/rate')
  async updateRawMaterialRate(
    @Request() req: any,
    @Param('id') id: string,
    @Body('rate') rate: number,
    @Body('reason') reason?: string,
  ) {
    const user = this.extractUser(req);
    return this.superAdminService.updateRawMaterialRate(user, id, rate, reason);
  }

  // =========================================================================
  // 12. PRODUCT PRICING CONFIGURATION & BOM COST RECALCULATION
  // =========================================================================

  @Get('products/pricing-overview')
  async getProductPricingOverview(@Request() req: any, @Query('productId') productId?: string) {
    const user = this.extractUser(req);
    return this.superAdminService.getProductPricingOverview(user, productId);
  }

  @Patch('products/:id/pricing')
  async updateProductPricing(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const user = this.extractUser(req);
    const sellingPrice =
      typeof body === 'number'
        ? body
        : body?.sellingPrice !== undefined
        ? body.sellingPrice
        : body?.price;
    return this.superAdminService.updateProductPricing(user, id, sellingPrice);
  }

  @Patch('products/:id/selling-price')
  async updateProductSellingPrice(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const user = this.extractUser(req);
    const sellingPrice =
      typeof body === 'number'
        ? body
        : body?.sellingPrice !== undefined
        ? body.sellingPrice
        : body?.price;
    return this.superAdminService.updateProductPricing(user, id, sellingPrice);
  }

  @Post('products/:id/bom')
  async setProductBom(
    @Request() req: any,
    @Param('id') id: string,
    @Body('items') items: Array<{ rawMaterialId: string; quantity: number; scrapFactor?: number }>,
  ) {
    const user = this.extractUser(req);
    return this.superAdminService.setProductBom(user, id, items);
  }
}
