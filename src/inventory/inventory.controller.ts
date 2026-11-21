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
import { InventoryService, UserContext } from './inventory.service';
import {
  CreateInventoryTaskDto,
  UpdateInventoryTaskStatusDto,
} from './dto/create-inventory-task.dto';
import { CreateWarehouseStorageDto } from './dto/create-warehouse-storage.dto';
import { CreateProductionTransferDto } from './dto/create-production-transfer.dto';
import { CreateInventoryReportDto } from './dto/create-inventory-report.dto';
import {
  CreateInventoryLaborDto,
  UpdateInventoryLaborAttendanceDto,
  AdjustInventoryLaborSalaryDto,
} from './dto/manage-inventory-labor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  private extractUser(req: any): UserContext {
    return {
      id: req?.user?.id || 'usr-imgr-01',
      email: req?.user?.email || 'inventory.manager@plant-enterprise.com',
      role: req?.user?.role || 'INVENTORY_MANAGER',
      department: req?.user?.department || 'INVENTORY',
      designation: req?.user?.designation || 'MANAGER',
      companyId: req?.user?.companyId || 'company_isolated_01',
      firstName: req?.user?.firstName || 'Rajesh Nair',
    };
  }

  // =========================================================================
  // 1. INVENTORY HIERARCHY & TASK ASSIGNMENT
  // =========================================================================

  @Get('hierarchy')
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.EXECUTIVE,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.INVENTORY_ASSISTANT_MANAGER,
    Role.INVENTORY_ASSOCIATE_MANAGER,
  )
  async getHierarchy(@Request() req: any) {
    const user = this.extractUser(req);
    return this.inventoryService.getDepartmentHierarchy(user);
  }

  @Post('tasks')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
  )
  async createTask(@Request() req: any, @Body() dto: CreateInventoryTaskDto) {
    const user = this.extractUser(req);
    return this.inventoryService.createTask(user, dto);
  }

  @Get('tasks')
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.EXECUTIVE,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.INVENTORY_ASSISTANT_MANAGER,
    Role.INVENTORY_ASSOCIATE_MANAGER,
  )
  async getTasks(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('assigneeId') assigneeId?: string,
  ) {
    const user = this.extractUser(req);
    return this.inventoryService.getTasks(user, status, assigneeId);
  }

  @Patch('tasks/:id/status')
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.INVENTORY_ASSISTANT_MANAGER,
    Role.INVENTORY_ASSOCIATE_MANAGER,
  )
  async updateTaskStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateInventoryTaskStatusDto,
  ) {
    const user = this.extractUser(req);
    return this.inventoryService.updateTaskStatus(user, id, dto);
  }

  // =========================================================================
  // 2. DUAL WAREHOUSE STORAGE (Raw Materials & Finished Goods)
  // =========================================================================

  @Post('storage')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.INVENTORY_ASSISTANT_MANAGER,
  )
  async createWarehouseStorage(
    @Request() req: any,
    @Body() dto: CreateWarehouseStorageDto,
  ) {
    const user = this.extractUser(req);
    return this.inventoryService.createWarehouseStorage(user, dto);
  }

  @Get('storage')
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.EXECUTIVE,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.INVENTORY_ASSISTANT_MANAGER,
    Role.INVENTORY_ASSOCIATE_MANAGER,
  )
  async getWarehouseStorages(
    @Request() req: any,
    @Query('type') type?: string,
  ) {
    const user = this.extractUser(req);
    return this.inventoryService.getWarehouseStorages(user, type);
  }

  // =========================================================================
  // 3. PRODUCTION MATERIAL TRANSFERS WITH UNIT VALUES
  // =========================================================================

  @Post('transfers')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.INVENTORY_ASSISTANT_MANAGER,
    Role.INVENTORY_ASSOCIATE_MANAGER,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
  )
  async createProductionTransfer(
    @Request() req: any,
    @Body() dto: CreateProductionTransferDto,
  ) {
    const user = this.extractUser(req);
    return this.inventoryService.createProductionTransfer(user, dto);
  }

  @Get('transfers')
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.EXECUTIVE,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.INVENTORY_ASSISTANT_MANAGER,
    Role.INVENTORY_ASSOCIATE_MANAGER,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
  )
  async getProductionTransfers(
    @Request() req: any,
    @Query('type') type?: string,
  ) {
    const user = this.extractUser(req);
    return this.inventoryService.getProductionTransfers(user, type);
  }

  // =========================================================================
  // 4. OPERATIONS REPORTS (RM In/Used, FG Out)
  // =========================================================================

  @Post('reports')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.INVENTORY_ASSISTANT_MANAGER,
  )
  async createInventoryReport(
    @Request() req: any,
    @Body() dto: CreateInventoryReportDto,
  ) {
    const user = this.extractUser(req);
    return this.inventoryService.createInventoryReport(user, dto);
  }

  @Get('reports')
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.EXECUTIVE,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.INVENTORY_ASSISTANT_MANAGER,
    Role.INVENTORY_ASSOCIATE_MANAGER,
  )
  async getInventoryReports(@Request() req: any, @Query('period') period?: string) {
    const user = this.extractUser(req);
    return this.inventoryService.getInventoryReports(user, period);
  }

  // =========================================================================
  // 5. DEPARTMENT LABOR & ATTENDANCE MANAGEMENT
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
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.INVENTORY_ASSISTANT_MANAGER,
  )
  async getDepartmentLabor(
    @Request() req: any,
    @Query('month') month?: string,
  ) {
    const user = this.extractUser(req);
    return this.inventoryService.getDepartmentLabor(user, month);
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
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
  )
  async createDepartmentLabor(
    @Request() req: any,
    @Body() dto: CreateInventoryLaborDto,
  ) {
    const user = this.extractUser(req);
    return this.inventoryService.createDepartmentLabor(user, dto);
  }

  @Patch('labor/:id/attendance')
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.HR,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.INVENTORY_ASSISTANT_MANAGER,
  )
  async updateLaborAttendance(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateInventoryLaborAttendanceDto,
  ) {
    const user = this.extractUser(req);
    return this.inventoryService.updateLaborAttendance(user, id, dto);
  }

  @Patch('labor/:id/salary')
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.HR,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
  )
  async adjustLaborSalary(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: AdjustInventoryLaborSalaryDto,
  ) {
    const user = this.extractUser(req);
    return this.inventoryService.adjustLaborSalary(user, id, dto);
  }

  // =========================================================================
  // 6. EXCEL AUDIT EXPORT WITH PRECISE DATE-TIME STAMP
  // =========================================================================

  @Get('export/excel')
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.EXECUTIVE,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.INVENTORY_ASSISTANT_MANAGER,
  )
  async exportInventoryExcel(@Request() req: any, @Response() res: any) {
    const user = this.extractUser(req);
    const result = await this.inventoryService.exportInventoryExcel(user);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${result.fileName}"`,
    );
    res.setHeader('X-Audit-Timestamp', result.timeStamp);
    res.status(HttpStatus.OK).send(result.csvContent);
  }
}
