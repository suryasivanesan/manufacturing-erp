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
import { TextilesOperationsService, UserContext } from './textiles-operations.service';
import { CreateSpinningYarnLogDto } from './dto/create-spinning-yarn-log.dto';
import { CreateWeavingKnittingLogDto } from './dto/create-weaving-knitting-log.dto';
import { CreateDyeingProcessLogDto } from './dto/create-dyeing-process-log.dto';
import { CreateGarmentingFinishingLogDto } from './dto/create-garmenting-finishing-log.dto';
import { CreateFabricQualityInspectionDto } from './dto/create-fabric-quality-inspection.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('textiles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TextilesOperationsController {
  constructor(private readonly textilesService: TextilesOperationsService) {}

  private extractUser(req: any): UserContext {
    return {
      id: req?.user?.id || 'usr-tex-mgr-01',
      email: req?.user?.email || 'textiles.manager@plant-enterprise.com',
      role: req?.user?.role || 'SPINNING_YARN_MANAGER',
      department: req?.user?.department || 'PRODUCTION',
      designation: req?.user?.designation || 'MANAGER',
      companyId: req?.user?.companyId || 'company_isolated_01',
      firstName: req?.user?.firstName || 'Rajesh Patel',
    };
  }

  // =========================================================================
  // 1. SPINNING & YARN PRODUCTION
  // =========================================================================

  @Get('spinning')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.SPINNING_YARN_MANAGER,
  )
  async getSpinningLogs(@Request() req: any) {
    const user = this.extractUser(req);
    return this.textilesService.getSpinningLogs(user);
  }

  @Post('spinning')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.SPINNING_YARN_MANAGER,
  )
  async createSpinningLog(@Request() req: any, @Body() dto: CreateSpinningYarnLogDto) {
    const user = this.extractUser(req);
    return this.textilesService.createSpinningLog(dto, user);
  }

  // =========================================================================
  // 2. WEAVING & KNITTING OPERATIONS
  // =========================================================================

  @Get('weaving')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.INVENTORY,
    Role.WEAVING_KNITTING_MANAGER,
  )
  async getWeavingLogs(@Request() req: any) {
    const user = this.extractUser(req);
    return this.textilesService.getWeavingLogs(user);
  }

  @Post('weaving')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.WEAVING_KNITTING_MANAGER,
  )
  async createWeavingLog(@Request() req: any, @Body() dto: CreateWeavingKnittingLogDto) {
    const user = this.extractUser(req);
    return this.textilesService.createWeavingLog(dto, user);
  }

  // =========================================================================
  // 3. DYEING & WET PROCESSING
  // =========================================================================

  @Get('dyeing')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.DYEING_PROCESS_MANAGER,
  )
  async getDyeingLogs(@Request() req: any) {
    const user = this.extractUser(req);
    return this.textilesService.getDyeingLogs(user);
  }

  @Post('dyeing')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.DYEING_PROCESS_MANAGER,
  )
  async createDyeingLog(@Request() req: any, @Body() dto: CreateDyeingProcessLogDto) {
    const user = this.extractUser(req);
    return this.textilesService.createDyeingLog(dto, user);
  }

  @Patch('dyeing/:id/approve-shade')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.DYEING_PROCESS_MANAGER,
  )
  async approveDyeShade(@Request() req: any, @Param('id') id: string) {
    const user = this.extractUser(req);
    return this.textilesService.approveDyeShade(id, user);
  }

  // =========================================================================
  // 4. GARMENTING & FINISHING
  // =========================================================================

  @Get('garmenting')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.INVENTORY,
    Role.GARMENTING_FINISHING_MANAGER,
  )
  async getGarmentingLogs(@Request() req: any) {
    const user = this.extractUser(req);
    return this.textilesService.getGarmentingLogs(user);
  }

  @Post('garmenting')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.GARMENTING_FINISHING_MANAGER,
  )
  async createGarmentingLog(@Request() req: any, @Body() dto: CreateGarmentingFinishingLogDto) {
    const user = this.extractUser(req);
    return this.textilesService.createGarmentingLog(dto, user);
  }

  // =========================================================================
  // 5. FABRIC QUALITY & QA INSPECTION
  // =========================================================================

  @Get('quality-inspections')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.FABRIC_QUALITY_INSPECTION_MANAGER,
  )
  async getFabricQualityInspections(@Request() req: any) {
    const user = this.extractUser(req);
    return this.textilesService.getFabricQualityInspections(user);
  }

  @Post('quality-inspections')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.FABRIC_QUALITY_INSPECTION_MANAGER,
  )
  async createFabricQualityInspection(@Request() req: any, @Body() dto: CreateFabricQualityInspectionDto) {
    const user = this.extractUser(req);
    return this.textilesService.createFabricQualityInspection(dto, user);
  }

  @Patch('quality-inspections/:id/certify')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.FABRIC_QUALITY_INSPECTION_MANAGER,
  )
  async certifyFabricRoll(@Request() req: any, @Param('id') id: string) {
    const user = this.extractUser(req);
    return this.textilesService.certifyFabricRoll(id, user);
  }

  // =========================================================================
  // 6. EXCEL AUDIT EXPORT
  // =========================================================================

  @Get('export/audit')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.QUALITY,
    Role.SPINNING_YARN_MANAGER,
    Role.WEAVING_KNITTING_MANAGER,
    Role.DYEING_PROCESS_MANAGER,
    Role.GARMENTING_FINISHING_MANAGER,
    Role.FABRIC_QUALITY_INSPECTION_MANAGER,
  )
  async exportTextilesAuditExcel(@Request() req: any, @Response() res: any) {
    const user = this.extractUser(req);
    const { fileName, buffer, mimeType } = await this.textilesService.exportTextilesAuditExcel(user);

    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}
