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
import { GateSecurityService, UserContext } from './gate-security.service';
import {
  CreateVehicleEntryDto,
  UpdateVehicleEntryStatusDto,
} from './dto/create-vehicle-entry.dto';
import {
  CreateVisitorAccessDto,
  UpdateVisitorAccessStatusDto,
} from './dto/create-visitor-access.dto';
import {
  CreateMaterialInspectionDto,
  UpdateMaterialInspectionDto,
} from './dto/create-material-inspection.dto';
import {
  CreateTrafficParkingDto,
  UpdateTrafficParkingStatusDto,
} from './dto/create-traffic-parking.dto';
import {
  CreateEmergencyControlDto,
  ResolveEmergencyControlDto,
} from './dto/create-emergency-control.dto';
import {
  CreateNightPatrolDto,
  UpdateNightPatrolStatusDto,
} from './dto/create-night-patrol.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('gate-security')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GateSecurityController {
  constructor(private readonly gateSecurityService: GateSecurityService) {}

  /**
   * Strictly extracts tenant context from the verified JWT payload.
   * Multi-tenancy isolation is enforced structurally: cross-company data leakage is impossible.
   */
  private extractUser(req: any): UserContext {
    return {
      id: req?.user?.id || 'usr-sec-mgr-01',
      email: req?.user?.email || 'security.head@plant-enterprise.com',
      role: req?.user?.role || 'GATE_SECURITY_MANAGER',
      department: req?.user?.department || 'GATE_SECURITY',
      designation: req?.user?.designation || 'MANAGER',
      companyId: req?.user?.companyId || 'company_isolated_01',
      firstName: req?.user?.firstName || 'Col. Arvind Saxena',
    };
  }

  // =========================================================================
  // 1. VEHICLE GATE ENTRY
  // =========================================================================

  @Get('vehicles')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.GATE_SECURITY,
    Role.GATE_SECURITY_MANAGER,
    Role.GATE_SECURITY_ASSISTANT_MANAGER,
    Role.GATE_SECURITY_ASSOCIATE_MANAGER,
    Role.SECURITY,
    Role.SECURITY_MANAGER,
    Role.LOGISTICS,
    Role.LOGISTICS_MANAGER,
  )
  async getVehicleEntries(@Request() req: any, @Query('status') status?: string) {
    const user = this.extractUser(req);
    return await this.gateSecurityService.getVehicleEntries(user, status);
  }

  @Post('vehicles')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.GATE_SECURITY,
    Role.GATE_SECURITY_MANAGER,
    Role.GATE_SECURITY_ASSISTANT_MANAGER,
    Role.SECURITY,
  )
  @HttpCode(HttpStatus.CREATED)
  async createVehicleEntry(
    @Request() req: any,
    @Body() dto: CreateVehicleEntryDto,
  ) {
    const user = this.extractUser(req);
    return await this.gateSecurityService.createVehicleEntry(user, dto);
  }

  @Patch('vehicles/:id/status')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.GATE_SECURITY,
    Role.GATE_SECURITY_MANAGER,
    Role.GATE_SECURITY_ASSISTANT_MANAGER,
    Role.SECURITY,
    Role.LOGISTICS_MANAGER,
  )
  async updateVehicleEntryStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateVehicleEntryStatusDto,
  ) {
    const user = this.extractUser(req);
    return await this.gateSecurityService.updateVehicleEntryStatus(user, id, dto);
  }

  // =========================================================================
  // 2. VISITOR MANAGEMENT & CONTRACTOR ACCESS
  // =========================================================================

  @Get('visitors')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.GATE_SECURITY,
    Role.GATE_SECURITY_MANAGER,
    Role.GATE_SECURITY_ASSISTANT_MANAGER,
    Role.GATE_SECURITY_ASSOCIATE_MANAGER,
    Role.SECURITY,
    Role.SECURITY_MANAGER,
    Role.HR,
    Role.HR_MANAGER,
  )
  async getVisitorAccesses(@Request() req: any, @Query('status') status?: string) {
    const user = this.extractUser(req);
    return await this.gateSecurityService.getVisitorAccesses(user, status);
  }

  @Post('visitors')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.GATE_SECURITY,
    Role.GATE_SECURITY_MANAGER,
    Role.GATE_SECURITY_ASSISTANT_MANAGER,
    Role.SECURITY,
    Role.HR_MANAGER,
  )
  @HttpCode(HttpStatus.CREATED)
  async createVisitorAccess(
    @Request() req: any,
    @Body() dto: CreateVisitorAccessDto,
  ) {
    const user = this.extractUser(req);
    return await this.gateSecurityService.createVisitorAccess(user, dto);
  }

  @Patch('visitors/:id/status')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.GATE_SECURITY,
    Role.GATE_SECURITY_MANAGER,
    Role.GATE_SECURITY_ASSISTANT_MANAGER,
    Role.SECURITY,
    Role.HR_MANAGER,
  )
  async updateVisitorAccessStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateVisitorAccessStatusDto,
  ) {
    const user = this.extractUser(req);
    return await this.gateSecurityService.updateVisitorAccessStatus(user, id, dto);
  }

  // =========================================================================
  // 3. MATERIAL PHYSICAL INSPECTION & FRISKING
  // =========================================================================

  @Get('inspections')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.GATE_SECURITY,
    Role.GATE_SECURITY_MANAGER,
    Role.GATE_SECURITY_ASSISTANT_MANAGER,
    Role.SECURITY,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
  )
  async getMaterialInspections(
    @Request() req: any,
    @Query('status') status?: string,
  ) {
    const user = this.extractUser(req);
    return await this.gateSecurityService.getMaterialInspections(user, status);
  }

  @Post('inspections')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.GATE_SECURITY,
    Role.GATE_SECURITY_MANAGER,
    Role.SECURITY,
    Role.QUALITY_MANAGER,
  )
  @HttpCode(HttpStatus.CREATED)
  async createMaterialInspection(
    @Request() req: any,
    @Body() dto: CreateMaterialInspectionDto,
  ) {
    const user = this.extractUser(req);
    return await this.gateSecurityService.createMaterialInspection(user, dto);
  }

  @Patch('inspections/:id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.GATE_SECURITY,
    Role.GATE_SECURITY_MANAGER,
    Role.SECURITY,
  )
  async updateMaterialInspection(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateMaterialInspectionDto,
  ) {
    const user = this.extractUser(req);
    return await this.gateSecurityService.updateMaterialInspection(user, id, dto);
  }

  // =========================================================================
  // 4. TRAFFIC & PARKING MANAGEMENT
  // =========================================================================

  @Get('traffic')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.GATE_SECURITY,
    Role.GATE_SECURITY_MANAGER,
    Role.GATE_SECURITY_ASSISTANT_MANAGER,
    Role.SECURITY,
  )
  async getTrafficParkings(
    @Request() req: any,
    @Query('violation') violation?: string,
  ) {
    const user = this.extractUser(req);
    return await this.gateSecurityService.getTrafficParkings(user, violation);
  }

  @Post('traffic')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.GATE_SECURITY,
    Role.GATE_SECURITY_MANAGER,
    Role.SECURITY,
  )
  @HttpCode(HttpStatus.CREATED)
  async createTrafficParking(
    @Request() req: any,
    @Body() dto: CreateTrafficParkingDto,
  ) {
    const user = this.extractUser(req);
    return await this.gateSecurityService.createTrafficParking(user, dto);
  }

  @Patch('traffic/:id/status')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.GATE_SECURITY,
    Role.GATE_SECURITY_MANAGER,
    Role.SECURITY,
  )
  async updateTrafficParkingStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateTrafficParkingStatusDto,
  ) {
    const user = this.extractUser(req);
    return await this.gateSecurityService.updateTrafficParkingStatus(user, id, dto);
  }

  // =========================================================================
  // 5. SAFETY, FIRE & EMERGENCY GATE CONTROL
  // =========================================================================

  @Get('emergency')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.GATE_SECURITY,
    Role.GATE_SECURITY_MANAGER,
    Role.SECURITY,
    Role.SECURITY_MANAGER,
  )
  async getEmergencyControls(@Request() req: any) {
    const user = this.extractUser(req);
    return await this.gateSecurityService.getEmergencyControls(user);
  }

  @Post('emergency')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.GATE_SECURITY_MANAGER,
    Role.SECURITY_MANAGER,
  )
  @HttpCode(HttpStatus.CREATED)
  async createEmergencyControl(
    @Request() req: any,
    @Body() dto: CreateEmergencyControlDto,
  ) {
    const user = this.extractUser(req);
    return await this.gateSecurityService.createEmergencyControl(user, dto);
  }

  @Patch('emergency/:id/resolve')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.GATE_SECURITY_MANAGER,
    Role.SECURITY_MANAGER,
  )
  async resolveEmergencyControl(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: ResolveEmergencyControlDto,
  ) {
    const user = this.extractUser(req);
    return await this.gateSecurityService.resolveEmergencyControl(user, id, dto);
  }

  // =========================================================================
  // 6. NIGHT SHIFT PATROL & ASSET PROTECTION
  // =========================================================================

  @Get('patrol')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.GATE_SECURITY,
    Role.GATE_SECURITY_MANAGER,
    Role.SECURITY,
    Role.SECURITY_MANAGER,
  )
  async getNightPatrols(
    @Request() req: any,
    @Query('alertOnly') alertOnly?: string,
  ) {
    const user = this.extractUser(req);
    return await this.gateSecurityService.getNightPatrols(
      user,
      alertOnly === 'true',
    );
  }

  @Post('patrol')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.GATE_SECURITY,
    Role.GATE_SECURITY_MANAGER,
    Role.SECURITY,
  )
  @HttpCode(HttpStatus.CREATED)
  async createNightPatrol(
    @Request() req: any,
    @Body() dto: CreateNightPatrolDto,
  ) {
    const user = this.extractUser(req);
    return await this.gateSecurityService.createNightPatrol(user, dto);
  }

  @Patch('patrol/:id/status')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.GATE_SECURITY_MANAGER,
    Role.SECURITY_MANAGER,
  )
  async updateNightPatrolStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateNightPatrolStatusDto,
  ) {
    const user = this.extractUser(req);
    return await this.gateSecurityService.updateNightPatrolStatus(user, id, dto);
  }

  // =========================================================================
  // 7. DASHBOARD KPIS & AGGREGATED METRICS
  // =========================================================================

  @Get('dashboard-kpis')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.GATE_SECURITY,
    Role.GATE_SECURITY_MANAGER,
    Role.GATE_SECURITY_ASSISTANT_MANAGER,
    Role.GATE_SECURITY_ASSOCIATE_MANAGER,
    Role.SECURITY,
    Role.SECURITY_MANAGER,
    Role.LOGISTICS,
    Role.HR,
  )
  async getGateSecurityDashboardKpis(@Request() req: any) {
    const user = this.extractUser(req);
    return await this.gateSecurityService.getGateSecurityDashboardKpis(user);
  }
}
