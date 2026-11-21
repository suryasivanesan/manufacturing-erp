import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { JewelleryOperationsService, UserContext } from './jewellery-operations.service';
import { CreateBullionVaultLedgerDto } from './dto/create-bullion-vault-ledger.dto';
import { CreateCadCamPrototypingLogDto } from './dto/create-cad-cam-prototyping-log.dto';
import { CreateCastingMeltingCycleDto } from './dto/create-casting-melting-cycle.dto';
import { CreateKarigarJobWorkDto } from './dto/create-karigar-job-work.dto';
import { CreateJewelleryHallmarkingQcDto } from './dto/create-jewellery-hallmarking-qc.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('jewellery')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JewelleryOperationsController {
  constructor(private readonly jewelleryService: JewelleryOperationsService) {}

  private extractUser(req: any): UserContext {
    return {
      id: req?.user?.id || 'usr-jewel-mgr-01',
      email: req?.user?.email || 'jewellery.manager@plant-enterprise.com',
      role: req?.user?.role || 'BULLION_VAULT_SECURITY_MANAGER',
      department: req?.user?.department || 'SECURITY',
      designation: req?.user?.designation || 'MANAGER',
      companyId: req?.user?.companyId || 'company_isolated_01',
      firstName: req?.user?.firstName || 'Rakesh Mehra',
    };
  }

  // =========================================================================
  // 1. BULLION VAULT & SECURITY LEDGER
  // =========================================================================

  @Get('vault')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.SECURITY,
    Role.SECURITY_MANAGER,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.BULLION_VAULT_SECURITY_MANAGER,
  )
  async getBullionVaultLedgers(@Request() req: any) {
    const user = this.extractUser(req);
    return this.jewelleryService.getBullionVaultLedgers(user);
  }

  @Post('vault')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.SECURITY,
    Role.SECURITY_MANAGER,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.BULLION_VAULT_SECURITY_MANAGER,
  )
  async createBullionVaultLedger(@Request() req: any, @Body() dto: CreateBullionVaultLedgerDto) {
    const user = this.extractUser(req);
    return this.jewelleryService.createBullionVaultLedger(dto, user);
  }

  // =========================================================================
  // 2. CAD/CAM & PROTOTYPING LOGS
  // =========================================================================

  @Get('cad-cam')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.CAD_CAM_PROTOTYPING_MANAGER,
  )
  async getCadCamPrototypingLogs(@Request() req: any) {
    const user = this.extractUser(req);
    return this.jewelleryService.getCadCamPrototypingLogs(user);
  }

  @Post('cad-cam')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.CAD_CAM_PROTOTYPING_MANAGER,
  )
  async createCadCamPrototypingLog(@Request() req: any, @Body() dto: CreateCadCamPrototypingLogDto) {
    const user = this.extractUser(req);
    return this.jewelleryService.createCadCamPrototypingLog(dto, user);
  }

  // =========================================================================
  // 3. CASTING & MELTING CYCLES
  // =========================================================================

  @Get('casting')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.CASTING_MELTING_MANAGER,
  )
  async getCastingMeltingCycles(@Request() req: any) {
    const user = this.extractUser(req);
    return this.jewelleryService.getCastingMeltingCycles(user);
  }

  @Post('casting')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.CASTING_MELTING_MANAGER,
  )
  async createCastingMeltingCycle(@Request() req: any, @Body() dto: CreateCastingMeltingCycleDto) {
    const user = this.extractUser(req);
    return this.jewelleryService.createCastingMeltingCycle(dto, user);
  }

  // =========================================================================
  // 4. GOLDSMITH & KARIGAR JOB WORK
  // =========================================================================

  @Get('karigar')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.INVENTORY,
    Role.GOLDSMITH_KARIGAR_MANAGER,
  )
  async getKarigarJobWorks(@Request() req: any) {
    const user = this.extractUser(req);
    return this.jewelleryService.getKarigarJobWorks(user);
  }

  @Post('karigar')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.GOLDSMITH_KARIGAR_MANAGER,
  )
  async createKarigarJobWork(@Request() req: any, @Body() dto: CreateKarigarJobWorkDto) {
    const user = this.extractUser(req);
    return this.jewelleryService.createKarigarJobWork(dto, user);
  }

  // =========================================================================
  // 5. GEMSTONE & BIS HALLMARKING QC
  // =========================================================================

  @Get('hallmarking-qc')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.GEMSTONE_HALLMARKING_QC_MANAGER,
  )
  async getJewelleryHallmarkingQcs(@Request() req: any) {
    const user = this.extractUser(req);
    return this.jewelleryService.getJewelleryHallmarkingQcs(user);
  }

  @Post('hallmarking-qc')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.GEMSTONE_HALLMARKING_QC_MANAGER,
  )
  async createJewelleryHallmarkingQc(@Request() req: any, @Body() dto: CreateJewelleryHallmarkingQcDto) {
    const user = this.extractUser(req);
    return this.jewelleryService.createJewelleryHallmarkingQc(dto, user);
  }

  @Patch('hallmarking-qc/:id/certify')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.GEMSTONE_HALLMARKING_QC_MANAGER,
  )
  async certifyJewelleryHallmarkingQc(@Request() req: any, @Param('id') id: string) {
    const user = this.extractUser(req);
    return this.jewelleryService.certifyJewelleryHallmarkingQc(id, user);
  }

  // =========================================================================
  // AUDIT REPORT EXPORT
  // =========================================================================

  @Get('audit/export')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.BULLION_VAULT_SECURITY_MANAGER,
    Role.CAD_CAM_PROTOTYPING_MANAGER,
    Role.CASTING_MELTING_MANAGER,
    Role.GOLDSMITH_KARIGAR_MANAGER,
    Role.GEMSTONE_HALLMARKING_QC_MANAGER,
  )
  async exportJewelleryAudit(@Request() req: any, @Response() res: any) {
    const user = this.extractUser(req);
    const { filename, content } = await this.jewelleryService.exportJewelleryAudit(user);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(content);
  }
}
