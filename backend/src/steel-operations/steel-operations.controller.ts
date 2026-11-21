import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SteelOperationsService } from './steel-operations.service';
import { CreateWeighbridgeSlipDto } from './dto/create-weighbridge-slip.dto';
import { CreateHeatTestDto } from './dto/create-heat-test.dto';
import { CreateJobworkChallanDto } from './dto/create-jobwork-challan.dto';
import { ReconcileJobworkDto } from './dto/reconcile-jobwork.dto';
import { CreateEhsIncidentDto } from './dto/create-ehs-incident.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('steel-operations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SteelOperationsController {
  constructor(private readonly steelService: SteelOperationsService) {}

  // =========================================================================
  // 1. WEIGHBRIDGE & LOGISTICS MANAGER ENDPOINTS
  // =========================================================================

  /**
   * Record Tare & Gross truck weights and link PO/Invoice
   * Restricted to WEIGHBRIDGE_LOGISTICS_MANAGER or Executive Leadership
   * POST /steel-operations/weighbridge/slips
   */
  @Post('weighbridge/slips')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.WEIGHBRIDGE_LOGISTICS_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.INVENTORY_MANAGER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createWeighbridgeSlip(
    @Request() req: any,
    @Body() dto: CreateWeighbridgeSlipDto,
  ) {
    return this.steelService.createWeighbridgeSlip(req.user, dto);
  }

  /**
   * List all weighbridge slips strictly scoped to authenticated company
   * GET /steel-operations/weighbridge/slips
   */
  @Get('weighbridge/slips')
  @Roles(
    Role.WEIGHBRIDGE_LOGISTICS_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.INVENTORY_MANAGER,
    Role.SECURITY_MANAGER,
  )
  getWeighbridgeSlips(@Request() req: any) {
    return this.steelService.findAllWeighbridgeSlips(req.user?.companyId);
  }

  /**
   * Approve Tare/Gross weight measurements and clear truck turnaround
   * PATCH /steel-operations/weighbridge/slips/:id/approve
   */
  @Patch('weighbridge/slips/:id/approve')
  @Roles(
    Role.WEIGHBRIDGE_LOGISTICS_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  approveWeighbridgeSlip(
    @Request() req: any,
    @Param('id') id: string,
    @Body('notes') notes?: string,
  ) {
    return this.steelService.approveWeighbridgeSlip(req.user, id, notes);
  }

  // =========================================================================
  // 2. METALLURGY LAB IN-CHARGE ENDPOINTS
  // =========================================================================

  /**
   * Upload spectrometry test results & record metal heat
   * Restricted to METALLURGY_LAB_INCHARGE or Executive Leadership
   * POST /steel-operations/metallurgy/heat-tests
   */
  @Post('metallurgy/heat-tests')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.METALLURGY_LAB_INCHARGE,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.QUALITY_MANAGER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createHeatTest(@Request() req: any, @Body() dto: CreateHeatTestDto) {
    return this.steelService.createHeatTest(req.user, dto);
  }

  /**
   * List all metallurgy heat tests strictly scoped to authenticated company
   * GET /steel-operations/metallurgy/heat-tests
   */
  @Get('metallurgy/heat-tests')
  @Roles(
    Role.METALLURGY_LAB_INCHARGE,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.QUALITY_MANAGER,
  )
  getHeatTests(@Request() req: any) {
    return this.steelService.findAllHeatTests(req.user?.companyId);
  }

  /**
   * Auto-generate & view Material Test Certificate (MTC)
   * Strictly verifies tenant isolation before certificate generation
   * GET /steel-operations/metallurgy/heat-tests/:id/mtc
   */
  @Get('metallurgy/heat-tests/:id/mtc')
  @Roles(
    Role.METALLURGY_LAB_INCHARGE,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.QUALITY_MANAGER,
    Role.SALES_MANAGER,
  )
  generateMtc(@Request() req: any, @Param('id') id: string) {
    return this.steelService.generateMtcCertificate(req.user, id);
  }

  // =========================================================================
  // 3. SUBCONTRACTING & JOB WORK MANAGER ENDPOINTS
  // =========================================================================

  /**
   * Issue material delivery challan for external metal processing
   * Restricted to SUBCONTRACTING_JOBWORK_MANAGER or Executive Leadership
   * POST /steel-operations/jobwork/challans
   */
  @Post('jobwork/challans')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.SUBCONTRACTING_JOBWORK_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.PRODUCTION_MANAGER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createJobworkChallan(
    @Request() req: any,
    @Body() dto: CreateJobworkChallanDto,
  ) {
    return this.steelService.createJobworkChallan(req.user, dto);
  }

  /**
   * List all subcontracting challans strictly scoped to authenticated company
   * GET /steel-operations/jobwork/challans
   */
  @Get('jobwork/challans')
  @Roles(
    Role.SUBCONTRACTING_JOBWORK_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.PRODUCTION_MANAGER,
  )
  getJobworkChallans(@Request() req: any) {
    return this.steelService.findAllJobworkChallans(req.user?.companyId);
  }

  /**
   * Reconcile job work: process weight loss/gain tracking & scrap return
   * PATCH /steel-operations/jobwork/challans/:id/reconcile
   */
  @Patch('jobwork/challans/:id/reconcile')
  @Roles(
    Role.SUBCONTRACTING_JOBWORK_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  reconcileJobwork(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: ReconcileJobworkDto,
  ) {
    return this.steelService.reconcileJobwork(req.user, id, dto);
  }

  // =========================================================================
  // 4. EHS & INDUSTRIAL SAFETY MANAGER ENDPOINTS
  // =========================================================================

  /**
   * Log workplace incident, near-miss, or safety audit report
   * Restricted to EHS_SAFETY_MANAGER or Executive Leadership
   * POST /steel-operations/ehs/incidents
   */
  @Post('ehs/incidents')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.EHS_SAFETY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createEhsIncident(@Request() req: any, @Body() dto: CreateEhsIncidentDto) {
    return this.steelService.createEhsIncident(req.user, dto);
  }

  /**
   * List all EHS incident and safety records strictly scoped to authenticated company
   * GET /steel-operations/ehs/incidents
   */
  @Get('ehs/incidents')
  @Roles(
    Role.EHS_SAFETY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getEhsIncidents(@Request() req: any) {
    return this.steelService.findAllEhsIncidents(req.user?.companyId);
  }

  /**
   * Electronically authorize Hot Work Permit (Furnace, Torch Cutting, Welding)
   * PATCH /steel-operations/ehs/permits/:id/approve
   */
  @Patch('ehs/permits/:id/approve')
  @Roles(
    Role.EHS_SAFETY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  approveHotWorkPermit(@Request() req: any, @Param('id') id: string) {
    return this.steelService.approveHotWorkPermit(req.user, id);
  }
}
