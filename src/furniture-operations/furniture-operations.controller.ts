import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FurnitureOperationsService, UserContext } from './furniture-operations.service';
import { CreateTimberKilnBatchDto } from './dto/create-timber-kiln-batch.dto';
import { CreateCncNestingPanelLogDto } from './dto/create-cnc-nesting-panel-log.dto';
import { CreateUpholsteryFoamCuttingLogDto } from './dto/create-upholstery-foam-cutting-log.dto';
import { CreateSandingFinishingLogDto } from './dto/create-sanding-finishing-log.dto';
import { CreateKdPackagingKittingRecordDto } from './dto/create-kd-packaging-kitting-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('furniture')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FurnitureOperationsController {
  constructor(private readonly furnitureService: FurnitureOperationsService) {}

  private extractUser(req: any): UserContext {
    return {
      id: req?.user?.id || 'usr-furniture-mgr-01',
      email: req?.user?.email || 'furniture.manager@plant-enterprise.com',
      role: req?.user?.role || 'TIMBER_SEASONING_KILN_MANAGER',
      department: req?.user?.department || 'PRODUCTION',
      designation: req?.user?.designation || 'MANAGER',
      companyId: req?.user?.companyId || 'company_isolated_01',
      firstName: req?.user?.firstName || 'Hans Weber',
    };
  }

  // =========================================================================
  // DASHBOARD SUMMARY & KPIS
  // =========================================================================

  @Get('summary')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.PACKING,
    Role.PACKING_MANAGER,
    Role.TIMBER_SEASONING_KILN_MANAGER,
    Role.DIMENSION_MILL_CNC_MANAGER,
    Role.UPHOLSTERY_FOAM_CUTTING_MANAGER,
    Role.SANDING_FINISHING_POLISHING_MANAGER,
    Role.KD_PACKAGING_HARDWARE_KITTING_MANAGER,
  )
  async getSummary(@Request() req: any) {
    const user = this.extractUser(req);
    return this.furnitureService.getFurnitureDashboardSummary(user);
  }

  // =========================================================================
  // 1. TIMBER SEASONING KILN BATCHES
  // =========================================================================

  @Get('kiln')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.TIMBER_SEASONING_KILN_MANAGER,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
  )
  async getTimberKilnBatches(@Request() req: any) {
    const user = this.extractUser(req);
    return this.furnitureService.getTimberKilnBatches(user);
  }

  @Post('kiln')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.TIMBER_SEASONING_KILN_MANAGER,
    Role.INVENTORY,
  )
  async createTimberKilnBatch(@Request() req: any, @Body() dto: CreateTimberKilnBatchDto) {
    const user = this.extractUser(req);
    return this.furnitureService.createTimberKilnBatch(user, dto);
  }

  @Get('kiln/:id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.TIMBER_SEASONING_KILN_MANAGER,
    Role.INVENTORY,
  )
  async getTimberKilnBatchById(@Request() req: any, @Param('id') id: string) {
    const user = this.extractUser(req);
    return this.furnitureService.getTimberKilnBatchById(user, id);
  }

  // =========================================================================
  // 2. CNC NESTING & PANEL LOGS
  // =========================================================================

  @Get('cnc')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.DIMENSION_MILL_CNC_MANAGER,
  )
  async getCncNestingLogs(@Request() req: any) {
    const user = this.extractUser(req);
    return this.furnitureService.getCncNestingLogs(user);
  }

  @Post('cnc')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.DIMENSION_MILL_CNC_MANAGER,
  )
  async createCncNestingLog(@Request() req: any, @Body() dto: CreateCncNestingPanelLogDto) {
    const user = this.extractUser(req);
    return this.furnitureService.createCncNestingLog(user, dto);
  }

  @Get('cnc/:id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.DIMENSION_MILL_CNC_MANAGER,
  )
  async getCncNestingLogById(@Request() req: any, @Param('id') id: string) {
    const user = this.extractUser(req);
    return this.furnitureService.getCncNestingLogById(user, id);
  }

  // =========================================================================
  // 3. UPHOLSTERY & FOAM CUTTING LOGS
  // =========================================================================

  @Get('upholstery')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.UPHOLSTERY_FOAM_CUTTING_MANAGER,
    Role.INVENTORY,
  )
  async getUpholsteryFoamLogs(@Request() req: any) {
    const user = this.extractUser(req);
    return this.furnitureService.getUpholsteryFoamLogs(user);
  }

  @Post('upholstery')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.UPHOLSTERY_FOAM_CUTTING_MANAGER,
    Role.INVENTORY,
  )
  async createUpholsteryFoamLog(@Request() req: any, @Body() dto: CreateUpholsteryFoamCuttingLogDto) {
    const user = this.extractUser(req);
    return this.furnitureService.createUpholsteryFoamLog(user, dto);
  }

  @Get('upholstery/:id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.UPHOLSTERY_FOAM_CUTTING_MANAGER,
    Role.INVENTORY,
  )
  async getUpholsteryFoamLogById(@Request() req: any, @Param('id') id: string) {
    const user = this.extractUser(req);
    return this.furnitureService.getUpholsteryFoamLogById(user, id);
  }

  // =========================================================================
  // 4. SANDING & FINISHING LOGS
  // =========================================================================

  @Get('finishing')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.SANDING_FINISHING_POLISHING_MANAGER,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
  )
  async getSandingFinishingLogs(@Request() req: any) {
    const user = this.extractUser(req);
    return this.furnitureService.getSandingFinishingLogs(user);
  }

  @Post('finishing')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.SANDING_FINISHING_POLISHING_MANAGER,
    Role.QUALITY,
  )
  async createSandingFinishingLog(@Request() req: any, @Body() dto: CreateSandingFinishingLogDto) {
    const user = this.extractUser(req);
    return this.furnitureService.createSandingFinishingLog(user, dto);
  }

  @Get('finishing/:id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.SANDING_FINISHING_POLISHING_MANAGER,
    Role.QUALITY,
  )
  async getSandingFinishingLogById(@Request() req: any, @Param('id') id: string) {
    const user = this.extractUser(req);
    return this.furnitureService.getSandingFinishingLogById(user, id);
  }

  // =========================================================================
  // 5. KD PACKAGING & HARDWARE KITTING RECORDS
  // =========================================================================

  @Get('packaging')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PACKING,
    Role.PACKING_MANAGER,
    Role.KD_PACKAGING_HARDWARE_KITTING_MANAGER,
    Role.INVENTORY,
    Role.QUALITY,
  )
  async getKdPackagingRecords(@Request() req: any) {
    const user = this.extractUser(req);
    return this.furnitureService.getKdPackagingRecords(user);
  }

  @Post('packaging')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PACKING,
    Role.PACKING_MANAGER,
    Role.KD_PACKAGING_HARDWARE_KITTING_MANAGER,
    Role.INVENTORY,
    Role.QUALITY,
  )
  async createKdPackagingRecord(@Request() req: any, @Body() dto: CreateKdPackagingKittingRecordDto) {
    const user = this.extractUser(req);
    return this.furnitureService.createKdPackagingRecord(user, dto);
  }

  @Get('packaging/:id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PACKING,
    Role.PACKING_MANAGER,
    Role.KD_PACKAGING_HARDWARE_KITTING_MANAGER,
    Role.INVENTORY,
    Role.QUALITY,
  )
  async getKdPackagingRecordById(@Request() req: any, @Param('id') id: string) {
    const user = this.extractUser(req);
    return this.furnitureService.getKdPackagingRecordById(user, id);
  }

  @Post('packaging/:id/certify')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PACKING,
    Role.PACKING_MANAGER,
    Role.KD_PACKAGING_HARDWARE_KITTING_MANAGER,
    Role.QUALITY,
  )
  async certifyKdPackagingRecord(@Request() req: any, @Param('id') id: string) {
    const user = this.extractUser(req);
    return this.furnitureService.certifyKdPackagingRecord(user, id);
  }

  @Post('packaging/:id/toggle-block')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PACKING,
    Role.PACKING_MANAGER,
    Role.KD_PACKAGING_HARDWARE_KITTING_MANAGER,
    Role.QUALITY,
  )
  async toggleDispatchBlock(@Request() req: any, @Param('id') id: string) {
    const user = this.extractUser(req);
    return this.furnitureService.toggleDispatchBlock(user, id);
  }
}
