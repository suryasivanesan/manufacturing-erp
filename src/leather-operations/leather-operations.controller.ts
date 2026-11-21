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
import { LeatherOperationsService, UserContext } from './leather-operations.service';
import { CreateHideWetBlueBatchDto } from './dto/create-hide-wetblue-batch.dto';
import { CreateRetanningDyeingCrustLogDto } from './dto/create-retanning-dyeing-crust-log.dto';
import { CreateSplittingShavingLogDto } from './dto/create-splitting-shaving-log.dto';
import { CreateFinishingEmbossingLogDto } from './dto/create-finishing-embossing-log.dto';
import { CreateLeatherQcAreaRecordDto } from './dto/create-leather-qc-area-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('leather')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeatherOperationsController {
  constructor(private readonly leatherService: LeatherOperationsService) {}

  private extractUser(req: any): UserContext {
    return {
      id: req?.user?.id || 'usr-leather-mgr-01',
      email: req?.user?.email || 'leather.manager@plant-enterprise.com',
      role: req?.user?.role || 'HIDE_WETBLUE_MANAGER',
      department: req?.user?.department || 'PRODUCTION',
      designation: req?.user?.designation || 'MANAGER',
      companyId: req?.user?.companyId || 'company_isolated_01',
      firstName: req?.user?.firstName || 'Matteo Rossi',
    };
  }

  // =========================================================================
  // 1. HIDE & WET-BLUE TANNING BATCHES
  // =========================================================================

  @Get('wet-blue')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.HIDE_WETBLUE_MANAGER,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
  )
  async getHideWetBlueBatches(@Request() req: any) {
    const user = this.extractUser(req);
    return this.leatherService.getHideWetBlueBatches(user);
  }

  @Post('wet-blue')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.HIDE_WETBLUE_MANAGER,
  )
  async createHideWetBlueBatch(
    @Request() req: any,
    @Body() dto: CreateHideWetBlueBatchDto,
  ) {
    const user = this.extractUser(req);
    return this.leatherService.createHideWetBlueBatch(dto, user);
  }

  // =========================================================================
  // 2. RETANNING, DYEING & CRUST LOGS
  // =========================================================================

  @Get('crust')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.RETANNING_DYEING_CRUST_MANAGER,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
  )
  async getRetanningDyeingCrustLogs(@Request() req: any) {
    const user = this.extractUser(req);
    return this.leatherService.getRetanningDyeingCrustLogs(user);
  }

  @Post('crust')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.RETANNING_DYEING_CRUST_MANAGER,
  )
  async createRetanningDyeingCrustLog(
    @Request() req: any,
    @Body() dto: CreateRetanningDyeingCrustLogDto,
  ) {
    const user = this.extractUser(req);
    return this.leatherService.createRetanningDyeingCrustLog(dto, user);
  }

  // =========================================================================
  // 3. SPLITTING & SHAVING CALIBRATION LOGS
  // =========================================================================

  @Get('splitting')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.SPLITTING_SHAVING_CALIBRATION_MANAGER,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
  )
  async getSplittingShavingLogs(@Request() req: any) {
    const user = this.extractUser(req);
    return this.leatherService.getSplittingShavingLogs(user);
  }

  @Post('splitting')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.SPLITTING_SHAVING_CALIBRATION_MANAGER,
  )
  async createSplittingShavingLog(
    @Request() req: any,
    @Body() dto: CreateSplittingShavingLogDto,
  ) {
    const user = this.extractUser(req);
    return this.leatherService.createSplittingShavingLog(dto, user);
  }

  // =========================================================================
  // 4. FINISHING, BUFFING & EMBOSSING LOGS
  // =========================================================================

  @Get('finishing')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.FINISHING_BUFFING_EMBOSSING_MANAGER,
  )
  async getFinishingEmbossingLogs(@Request() req: any) {
    const user = this.extractUser(req);
    return this.leatherService.getFinishingEmbossingLogs(user);
  }

  @Post('finishing')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.FINISHING_BUFFING_EMBOSSING_MANAGER,
  )
  async createFinishingEmbossingLog(
    @Request() req: any,
    @Body() dto: CreateFinishingEmbossingLogDto,
  ) {
    const user = this.extractUser(req);
    return this.leatherService.createFinishingEmbossingLog(dto, user);
  }

  // =========================================================================
  // 5. LEATHER QC, AREA MEASUREMENT & CERTIFICATION
  // =========================================================================

  @Get('qc-area')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.LEATHER_QC_AREA_MEASUREMENT_MANAGER,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
  )
  async getLeatherQcAreaRecords(@Request() req: any) {
    const user = this.extractUser(req);
    return this.leatherService.getLeatherQcAreaRecords(user);
  }

  @Post('qc-area')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.LEATHER_QC_AREA_MEASUREMENT_MANAGER,
  )
  async createLeatherQcAreaRecord(
    @Request() req: any,
    @Body() dto: CreateLeatherQcAreaRecordDto,
  ) {
    const user = this.extractUser(req);
    return this.leatherService.createLeatherQcAreaRecord(dto, user);
  }

  @Patch('qc-area/:id/certify')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.LEATHER_QC_AREA_MEASUREMENT_MANAGER,
  )
  async certifyLeatherQcAreaRecord(
    @Request() req: any,
    @Param('id') id: string,
  ) {
    const user = this.extractUser(req);
    return this.leatherService.certifyLeatherQcAreaRecord(id, user);
  }

  // =========================================================================
  // AUDIT REPORT EXPORT
  // =========================================================================

  @Get('audit/export')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.HIDE_WETBLUE_MANAGER,
    Role.RETANNING_DYEING_CRUST_MANAGER,
    Role.SPLITTING_SHAVING_CALIBRATION_MANAGER,
    Role.FINISHING_BUFFING_EMBOSSING_MANAGER,
    Role.LEATHER_QC_AREA_MEASUREMENT_MANAGER,
  )
  async exportLeatherAudit(@Request() req: any, @Response() res: any) {
    const user = this.extractUser(req);
    const { filename, content } = await this.leatherService.exportLeatherAudit(user);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(content);
  }
}
