import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { CableWireOperationsService, UserContext } from './cable-wire-operations.service';
import { CreateWireDrawingLogDto } from './dto/create-wire-drawing-log.dto';
import { CreateBunchingStrandingLogDto } from './dto/create-bunching-stranding-log.dto';
import { CreateInsulationSheathingLogDto } from './dto/create-insulation-sheathing-log.dto';
import { CreateArmouringBeddingLogDto } from './dto/create-armouring-bedding-log.dto';
import { CreateHvSparkTestingRecordDto } from './dto/create-hv-spark-testing-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('cable-wire')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CableWireOperationsController {
  constructor(private readonly cableWireService: CableWireOperationsService) {}

  private extractUser(req: any): UserContext {
    return {
      id: req?.user?.id || 'usr-cable-mgr-01',
      email: req?.user?.email || 'cable.wire.manager@plant-enterprise.com',
      role: req?.user?.role || 'WIRE_DRAWING_ANNEALING_MANAGER',
      department: req?.user?.department || 'PRODUCTION',
      designation: req?.user?.designation || 'MANAGER',
      companyId: req?.user?.companyId || 'company_isolated_01',
      firstName: req?.user?.firstName || 'Alok Sharma',
    };
  }

  // =========================================================================
  // 1. WIRE DRAWING & ANNEALING
  // =========================================================================

  @Get('wire-drawing')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.WIRE_DRAWING_ANNEALING_MANAGER,
  )
  async getWireDrawingLogs(@Request() req: any) {
    const user = this.extractUser(req);
    return this.cableWireService.getWireDrawingLogs(user);
  }

  @Post('wire-drawing')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.WIRE_DRAWING_ANNEALING_MANAGER,
  )
  async createWireDrawingLog(@Request() req: any, @Body() dto: CreateWireDrawingLogDto) {
    const user = this.extractUser(req);
    return this.cableWireService.createWireDrawingLog(user, dto);
  }

  // =========================================================================
  // 2. BUNCHING & STRANDING
  // =========================================================================

  @Get('bunching-stranding')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.BUNCHING_STRANDING_MANAGER,
  )
  async getBunchingStrandingLogs(@Request() req: any) {
    const user = this.extractUser(req);
    return this.cableWireService.getBunchingStrandingLogs(user);
  }

  @Post('bunching-stranding')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.BUNCHING_STRANDING_MANAGER,
  )
  async createBunchingStrandingLog(@Request() req: any, @Body() dto: CreateBunchingStrandingLogDto) {
    const user = this.extractUser(req);
    return this.cableWireService.createBunchingStrandingLog(user, dto);
  }

  // =========================================================================
  // 3. EXTRUSION INSULATION & SHEATHING
  // =========================================================================

  @Get('insulation-sheathing')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.INSULATION_SHEATHING_MANAGER,
  )
  async getInsulationSheathingLogs(@Request() req: any) {
    const user = this.extractUser(req);
    return this.cableWireService.getInsulationSheathingLogs(user);
  }

  @Post('insulation-sheathing')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.INSULATION_SHEATHING_MANAGER,
  )
  async createInsulationSheathingLog(@Request() req: any, @Body() dto: CreateInsulationSheathingLogDto) {
    const user = this.extractUser(req);
    return this.cableWireService.createInsulationSheathingLog(user, dto);
  }

  // =========================================================================
  // 4. ARMOURING & BEDDING
  // =========================================================================

  @Get('armouring-bedding')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.ARMOURING_BEDDING_MANAGER,
  )
  async getArmouringBeddingLogs(@Request() req: any) {
    const user = this.extractUser(req);
    return this.cableWireService.getArmouringBeddingLogs(user);
  }

  @Post('armouring-bedding')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.ARMOURING_BEDDING_MANAGER,
  )
  async createArmouringBeddingLog(@Request() req: any, @Body() dto: CreateArmouringBeddingLogDto) {
    const user = this.extractUser(req);
    return this.cableWireService.createArmouringBeddingLog(user, dto);
  }

  // =========================================================================
  // 5. HIGH-VOLTAGE SPARK TESTING & ELECTRICAL QA
  // =========================================================================

  @Get('spark-testing')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.HV_SPARK_TESTING_QA_MANAGER,
  )
  async getHvSparkTestingRecords(@Request() req: any) {
    const user = this.extractUser(req);
    return this.cableWireService.getHvSparkTestingRecords(user);
  }

  @Post('spark-testing')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.HV_SPARK_TESTING_QA_MANAGER,
  )
  async createHvSparkTestingRecord(@Request() req: any, @Body() dto: CreateHvSparkTestingRecordDto) {
    const user = this.extractUser(req);
    return this.cableWireService.createHvSparkTestingRecord(user, dto);
  }

  // =========================================================================
  // 6. DATE-TIME STAMPED EXCEL AUDIT EXPORT
  // =========================================================================

  @Get('export/excel')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.QUALITY,
    Role.WIRE_DRAWING_ANNEALING_MANAGER,
    Role.BUNCHING_STRANDING_MANAGER,
    Role.INSULATION_SHEATHING_MANAGER,
    Role.ARMOURING_BEDDING_MANAGER,
    Role.HV_SPARK_TESTING_QA_MANAGER,
  )
  async exportExcel(@Request() req: any, @Response() res: any) {
    const user = this.extractUser(req);
    const exportResult = await this.cableWireService.exportCableWireExcel(user);

    res.setHeader('Content-Type', exportResult.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${exportResult.fileName}"`);
    res.setHeader('X-File-Name', exportResult.fileName);
    return res.end(exportResult.buffer);
  }
}
