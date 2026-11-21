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
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GlassOperationsService } from './glass-operations.service';
import { CreateBatchFormulaDto } from './dto/create-batch-formula.dto';
import { CreateKilnLogDto } from './dto/create-kiln-log.dto';
import { CreateMouldRecordDto } from './dto/create-mould-record.dto';
import { CreateThermalInspectionDto } from './dto/create-thermal-inspection.dto';
import { CreateCulletRecoveryDto } from './dto/create-cullet-recovery.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('glass-operations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GlassOperationsController {
  constructor(private readonly glassService: GlassOperationsService) {}

  // =========================================================================
  // 1. BATCH HOUSE MANAGER ENDPOINTS
  // =========================================================================

  /**
   * Register a new batch recipe formula & cullet ratio
   * POST /glass-operations/batch-formulas
   */
  @Post('batch-formulas')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.BATCH_HOUSE_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createBatchFormula(
    @Request() req: any,
    @Body() dto: CreateBatchFormulaDto,
  ) {
    return this.glassService.createBatchFormula(req.user, dto);
  }

  /**
   * List batch recipes and mix formulations
   * GET /glass-operations/batch-formulas
   */
  @Get('batch-formulas')
  @Roles(
    Role.BATCH_HOUSE_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.PRODUCTION_ASSISTANT_MANAGER,
    Role.PRODUCTION_ASSOCIATE_MANAGER,
    Role.INVENTORY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getBatchFormulas(@Request() req: any) {
    return this.glassService.getBatchFormulas(req.user);
  }

  /**
   * Update silo and day-bin inventory levels
   * PATCH /glass-operations/batch-formulas/:id/silo-levels
   */
  @Patch('batch-formulas/:id/silo-levels')
  @Roles(
    Role.BATCH_HOUSE_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.INVENTORY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  updateSiloLevels(
    @Request() req: any,
    @Param('id') id: string,
    @Body('siloHopperLevels') siloHopperLevels: string,
  ) {
    return this.glassService.updateSiloLevels(req.user, id, siloHopperLevels);
  }

  // =========================================================================
  // 2. KILN & FURNACE MANAGER ENDPOINTS
  // =========================================================================

  /**
   * Log melting furnace and ceramic kiln telemetry
   * POST /glass-operations/kiln-logs
   */
  @Post('kiln-logs')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.KILN_FURNACE_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.MACHINE_MAINTENANCE_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createKilnLog(
    @Request() req: any,
    @Body() dto: CreateKilnLogDto,
  ) {
    return this.glassService.createKilnLog(req.user, dto);
  }

  /**
   * List kiln and furnace operational logs
   * GET /glass-operations/kiln-logs
   */
  @Get('kiln-logs')
  @Roles(
    Role.KILN_FURNACE_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.MACHINE_MAINTENANCE_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getKilnLogs(
    @Request() req: any,
    @Query('furnaceId') furnaceId?: string,
  ) {
    return this.glassService.getKilnLogs(req.user, furnaceId);
  }

  /**
   * Get furnace telemetry summary for health dashboard
   * GET /glass-operations/kiln-logs/summary
   */
  @Get('kiln-logs/summary')
  @Roles(
    Role.KILN_FURNACE_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.MACHINE_MAINTENANCE_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getFurnaceSummary(@Request() req: any) {
    return this.glassService.getFurnaceTelemetrySummary(req.user);
  }

  // =========================================================================
  // 3. MOULD & TOOLING MANAGER ENDPOINTS
  // =========================================================================

  /**
   * Register a new mould or die and initialize shot count life tracking
   * POST /glass-operations/mould-tooling
   */
  @Post('mould-tooling')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.MOULD_TOOLING_MANAGER,
    Role.MACHINE_MAINTENANCE_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createMouldRecord(
    @Request() req: any,
    @Body() dto: CreateMouldRecordDto,
  ) {
    return this.glassService.createMouldRecord(req.user, dto);
  }

  /**
   * List mould and die tooling records
   * GET /glass-operations/mould-tooling
   */
  @Get('mould-tooling')
  @Roles(
    Role.MOULD_TOOLING_MANAGER,
    Role.MACHINE_MAINTENANCE_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getMouldRecords(
    @Request() req: any,
    @Query('status') status?: string,
  ) {
    return this.glassService.getMouldRecords(req.user, status);
  }

  /**
   * Record shift shot cycles on a mould
   * PATCH /glass-operations/mould-tooling/:id/shots
   */
  @Patch('mould-tooling/:id/shots')
  @Roles(
    Role.MOULD_TOOLING_MANAGER,
    Role.MACHINE_MAINTENANCE_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  logMouldShots(
    @Request() req: any,
    @Param('id') id: string,
    @Body('incrementalShots') incrementalShots: number,
  ) {
    return this.glassService.logMouldShots(req.user, id, Number(incrementalShots));
  }

  /**
   * Complete refurbishment/polishing of mould cavity
   * PATCH /glass-operations/mould-tooling/:id/refurbish
   */
  @Patch('mould-tooling/:id/refurbish')
  @Roles(
    Role.MOULD_TOOLING_MANAGER,
    Role.MACHINE_MAINTENANCE_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  refurbishMould(
    @Request() req: any,
    @Param('id') id: string,
    @Body('notes') notes?: string,
  ) {
    return this.glassService.refurbishMould(req.user, id, notes);
  }

  // =========================================================================
  // 4. THERMAL QUALITY IN-CHARGE ENDPOINTS
  // =========================================================================

  /**
   * Record surface defect inspection & thermal shock quench endurance test
   * POST /glass-operations/thermal-inspections
   */
  @Post('thermal-inspections')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.THERMAL_QUALITY_INCHARGE,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createThermalInspection(
    @Request() req: any,
    @Body() dto: CreateThermalInspectionDto,
  ) {
    return this.glassService.createThermalInspection(req.user, dto);
  }

  /**
   * List thermal quality inspection tests
   * GET /glass-operations/thermal-inspections
   */
  @Get('thermal-inspections')
  @Roles(
    Role.THERMAL_QUALITY_INCHARGE,
    Role.QUALITY_MANAGER,
    Role.QUALITY_ASSISTANT_MANAGER,
    Role.QUALITY_ASSOCIATE_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getThermalInspections(@Request() req: any) {
    return this.glassService.getThermalInspections(req.user);
  }

  /**
   * Update inspection lot status (APPROVED, HOLD, REJECTED)
   * PATCH /glass-operations/thermal-inspections/:id/status
   */
  @Patch('thermal-inspections/:id/status')
  @Roles(
    Role.THERMAL_QUALITY_INCHARGE,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  updateInspectionStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body('lotStatus') lotStatus: 'APPROVED' | 'HOLD' | 'REJECTED',
    @Body('inspectorNotes') inspectorNotes?: string,
  ) {
    return this.glassService.updateInspectionStatus(req.user, id, lotStatus, inspectorNotes);
  }

  // =========================================================================
  // 5. CULLET RECOVERY MANAGER ENDPOINTS
  // =========================================================================

  /**
   * Record stage-wise scrap cullet rejections & calculate recovery %
   * POST /glass-operations/cullet-recovery
   */
  @Post('cullet-recovery')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.CULLET_RECOVERY_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.INVENTORY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createCulletRecovery(
    @Request() req: any,
    @Body() dto: CreateCulletRecoveryDto,
  ) {
    return this.glassService.createCulletRecovery(req.user, dto);
  }

  /**
   * List cullet scrap recovery records
   * GET /glass-operations/cullet-recovery
   */
  @Get('cullet-recovery')
  @Roles(
    Role.CULLET_RECOVERY_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.INVENTORY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getCulletRecoveryRecords(@Request() req: any) {
    return this.glassService.getCulletRecoveryRecords(req.user);
  }

  /**
   * Get mass balance metrics and environmental raw material / energy savings
   * GET /glass-operations/cullet-recovery/metrics
   */
  @Get('cullet-recovery/metrics')
  @Roles(
    Role.CULLET_RECOVERY_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.INVENTORY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getCulletMetrics(@Request() req: any) {
    return this.glassService.getCulletRecoveryMetrics(req.user);
  }
}
