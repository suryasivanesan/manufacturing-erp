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
import { ElectronicalOperationsService } from './electronical-operations.service';
import { CreateSmtPcbAssemblyLogDto } from './dto/create-smt-log.dto';
import { CreateElectricalTestingRecordDto } from './dto/create-testing-record.dto';
import { CreateFirmwareFlashingLogDto } from './dto/create-flashing-log.dto';
import { CreateComponentEbomRecordDto } from './dto/create-ebom-record.dto';
import { CreateEsdCleanroomAuditLogDto } from './dto/create-esd-audit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('electronical-operations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ElectronicalOperationsController {
  constructor(private readonly electronicalService: ElectronicalOperationsService) {}

  // =========================================================================
  // 1. SMT & PCB ASSEMBLY OPERATIONS (SMT_PCB_ASSEMBLY_MANAGER)
  // =========================================================================

  @Post('smt-logs')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.SMT_PCB_ASSEMBLY_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createSmtLog(
    @Request() req: any,
    @Body() dto: CreateSmtPcbAssemblyLogDto,
  ) {
    return this.electronicalService.createSmtLog(req.user, dto);
  }

  @Get('smt-logs')
  @Roles(
    Role.SMT_PCB_ASSEMBLY_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.PRODUCTION_ASSISTANT_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getSmtLogs(@Request() req: any) {
    return this.electronicalService.getSmtLogs(req.user);
  }

  @Patch('smt-logs/:id/status')
  @Roles(
    Role.SMT_PCB_ASSEMBLY_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  updateSmtStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body('status') status: 'RUNNING' | 'REFLOW_OPTIMAL' | 'REFLOW_ALERT' | 'COMPLETED',
    @Body('notes') notes?: string,
  ) {
    return this.electronicalService.updateSmtStatus(req.user, id, status, notes);
  }

  // =========================================================================
  // 2. ELECTRICAL TESTING & CALIBRATION (ELECTRICAL_TESTING_CALIBRATION_MANAGER)
  // =========================================================================

  @Post('testing-records')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.ELECTRICAL_TESTING_CALIBRATION_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createTestingRecord(
    @Request() req: any,
    @Body() dto: CreateElectricalTestingRecordDto,
  ) {
    return this.electronicalService.createTestingRecord(req.user, dto);
  }

  @Get('testing-records')
  @Roles(
    Role.ELECTRICAL_TESTING_CALIBRATION_MANAGER,
    Role.QUALITY_MANAGER,
    Role.QUALITY_ASSISTANT_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getTestingRecords(@Request() req: any) {
    return this.electronicalService.getTestingRecords(req.user);
  }

  @Patch('testing-records/:id/certify')
  @Roles(
    Role.ELECTRICAL_TESTING_CALIBRATION_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  certifyElectricalRecord(@Request() req: any, @Param('id') id: string) {
    return this.electronicalService.certifyElectricalRecord(req.user, id);
  }

  // =========================================================================
  // 3. FIRMWARE FLASHING & SERIAL MAPPING (FIRMWARE_FLASHING_MANAGER)
  // =========================================================================

  @Post('flashing-logs')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.FIRMWARE_FLASHING_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createFlashingLog(
    @Request() req: any,
    @Body() dto: CreateFirmwareFlashingLogDto,
  ) {
    return this.electronicalService.createFlashingLog(req.user, dto);
  }

  @Get('flashing-logs')
  @Roles(
    Role.FIRMWARE_FLASHING_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.PRODUCTION_ASSISTANT_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getFlashingLogs(@Request() req: any) {
    return this.electronicalService.getFlashingLogs(req.user);
  }

  @Get('flashing-logs/verify/:deviceSerialNumber')
  @Roles(
    Role.FIRMWARE_FLASHING_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  verifyFirmwareMapping(
    @Request() req: any,
    @Param('deviceSerialNumber') deviceSerialNumber: string,
  ) {
    return this.electronicalService.verifyFirmwareMapping(req.user, deviceSerialNumber);
  }

  // =========================================================================
  // 4. COMPONENT OBSOLESCENCE & EBOM LIFECYCLE (COMPONENT_OBSOLESCENCE_EBOM_MANAGER)
  // =========================================================================

  @Post('ebom-records')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.COMPONENT_OBSOLESCENCE_EBOM_MANAGER,
    Role.INVENTORY_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createEbomRecord(
    @Request() req: any,
    @Body() dto: CreateComponentEbomRecordDto,
  ) {
    return this.electronicalService.createEbomRecord(req.user, dto);
  }

  @Get('ebom-records')
  @Roles(
    Role.COMPONENT_OBSOLESCENCE_EBOM_MANAGER,
    Role.INVENTORY_MANAGER,
    Role.INVENTORY_ASSISTANT_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getEbomRecords(@Request() req: any) {
    return this.electronicalService.getEbomRecords(req.user);
  }

  @Patch('ebom-records/:id/approve-substitute')
  @Roles(
    Role.COMPONENT_OBSOLESCENCE_EBOM_MANAGER,
    Role.INVENTORY_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  approveSubstitutePart(
    @Request() req: any,
    @Param('id') id: string,
    @Body('substitutePartNumber') substitutePartNumber: string,
    @Body('ecoNumber') ecoNumber?: string,
  ) {
    return this.electronicalService.approveSubstitutePart(
      req.user,
      id,
      substitutePartNumber,
      ecoNumber,
    );
  }

  // =========================================================================
  // 5. ESD & CLEANROOM COMPLIANCE (ESD_CLEANROOM_COMPLIANCE_MANAGER)
  // =========================================================================

  @Post('esd-audits')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.ESD_CLEANROOM_COMPLIANCE_MANAGER,
    Role.EHS_SAFETY_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createEsdAudit(
    @Request() req: any,
    @Body() dto: CreateEsdCleanroomAuditLogDto,
  ) {
    return this.electronicalService.createEsdAudit(req.user, dto);
  }

  @Get('esd-audits')
  @Roles(
    Role.ESD_CLEANROOM_COMPLIANCE_MANAGER,
    Role.EHS_SAFETY_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getEsdAudits(@Request() req: any) {
    return this.electronicalService.getEsdAudits(req.user);
  }

  @Patch('esd-audits/:id/status')
  @Roles(
    Role.ESD_CLEANROOM_COMPLIANCE_MANAGER,
    Role.EHS_SAFETY_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  updateEsdStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body('status') status: 'COMPLIANT' | 'WARNING' | 'NON_COMPLIANT',
    @Body('notes') notes?: string,
  ) {
    return this.electronicalService.updateEsdStatus(req.user, id, status, notes);
  }
}
