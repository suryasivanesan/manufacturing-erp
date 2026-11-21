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
import { ElectricEquipmentOperationsService } from './electric-equipment-operations.service';
import { CreateCoilWindingLogDto } from './dto/create-winding-log.dto';
import { CreateCoreAssemblyLaminationLogDto } from './dto/create-core-log.dto';
import { CreateVpiInsulationProcessLogDto } from './dto/create-vpi-log.dto';
import { CreateHvRoutineTestingRecordDto } from './dto/create-hv-test.dto';
import { CreateBusbarEnclosureLogDto } from './dto/create-busbar-log.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('electric-equipment-operations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ElectricEquipmentOperationsController {
  constructor(
    private readonly electricEquipmentService: ElectricEquipmentOperationsService,
  ) {}

  // =========================================================================
  // 1. COIL WINDING & FABRICATION (WINDING_COIL_FABRICATION_MANAGER)
  // =========================================================================

  @Post('winding-logs')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.WINDING_COIL_FABRICATION_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createWindingLog(
    @Request() req: any,
    @Body() dto: CreateCoilWindingLogDto,
  ) {
    return this.electricEquipmentService.createWindingLog(req.user, dto);
  }

  @Get('winding-logs')
  @Roles(
    Role.WINDING_COIL_FABRICATION_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.PRODUCTION_ASSISTANT_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getWindingLogs(@Request() req: any) {
    return this.electricEquipmentService.getWindingLogs(req.user);
  }

  @Get('winding-logs/:id')
  @Roles(
    Role.WINDING_COIL_FABRICATION_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getWindingLogById(@Request() req: any, @Param('id') id: string) {
    return this.electricEquipmentService.getWindingLogById(req.user, id);
  }

  // =========================================================================
  // 2. CORE ASSEMBLY & CRGO LAMINATION (CORE_ASSEMBLY_LAMINATION_MANAGER)
  // =========================================================================

  @Post('core-assembly-logs')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.CORE_ASSEMBLY_LAMINATION_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.INVENTORY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createCoreAssemblyLog(
    @Request() req: any,
    @Body() dto: CreateCoreAssemblyLaminationLogDto,
  ) {
    return this.electricEquipmentService.createCoreAssemblyLog(req.user, dto);
  }

  @Get('core-assembly-logs')
  @Roles(
    Role.CORE_ASSEMBLY_LAMINATION_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.INVENTORY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getCoreAssemblyLogs(@Request() req: any) {
    return this.electricEquipmentService.getCoreAssemblyLogs(req.user);
  }

  @Get('core-assembly-logs/:id')
  @Roles(
    Role.CORE_ASSEMBLY_LAMINATION_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getCoreAssemblyLogById(@Request() req: any, @Param('id') id: string) {
    return this.electricEquipmentService.getCoreAssemblyLogById(req.user, id);
  }

  // =========================================================================
  // 3. VPI & INSULATION PROCESS (VPI_INSULATION_MANAGER)
  // =========================================================================

  @Post('vpi-process-logs')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.VPI_INSULATION_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createVpiProcessLog(
    @Request() req: any,
    @Body() dto: CreateVpiInsulationProcessLogDto,
  ) {
    return this.electricEquipmentService.createVpiProcessLog(req.user, dto);
  }

  @Get('vpi-process-logs')
  @Roles(
    Role.VPI_INSULATION_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getVpiProcessLogs(@Request() req: any) {
    return this.electricEquipmentService.getVpiProcessLogs(req.user);
  }

  @Get('vpi-process-logs/:id')
  @Roles(
    Role.VPI_INSULATION_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getVpiProcessLogById(@Request() req: any, @Param('id') id: string) {
    return this.electricEquipmentService.getVpiProcessLogById(req.user, id);
  }

  // =========================================================================
  // 4. HV ROUTINE TESTING & CERTIFICATION (HV_ROUTINE_TESTING_MANAGER)
  // =========================================================================

  @Post('hv-testing-records')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.HV_ROUTINE_TESTING_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createHvTestingRecord(
    @Request() req: any,
    @Body() dto: CreateHvRoutineTestingRecordDto,
  ) {
    return this.electricEquipmentService.createHvTestingRecord(req.user, dto);
  }

  @Get('hv-testing-records')
  @Roles(
    Role.HV_ROUTINE_TESTING_MANAGER,
    Role.QUALITY_MANAGER,
    Role.QUALITY_ASSISTANT_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getHvTestingRecords(@Request() req: any) {
    return this.electricEquipmentService.getHvTestingRecords(req.user);
  }

  @Patch('hv-testing-records/:id/certify')
  @Roles(
    Role.HV_ROUTINE_TESTING_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  certifyHvTestingRecord(
    @Request() req: any,
    @Param('id') id: string,
  ) {
    return this.electricEquipmentService.certifyHvTestingRecord(req.user, id);
  }

  // =========================================================================
  // 5. BUSBAR FABRICATION & ENCLOSURE (BUSBAR_FABRICATION_ENCLOSURE_MANAGER)
  // =========================================================================

  @Post('busbar-enclosure-logs')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.BUSBAR_FABRICATION_ENCLOSURE_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createBusbarEnclosureLog(
    @Request() req: any,
    @Body() dto: CreateBusbarEnclosureLogDto,
  ) {
    return this.electricEquipmentService.createBusbarEnclosureLog(req.user, dto);
  }

  @Get('busbar-enclosure-logs')
  @Roles(
    Role.BUSBAR_FABRICATION_ENCLOSURE_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.PRODUCTION_ASSISTANT_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getBusbarEnclosureLogs(@Request() req: any) {
    return this.electricEquipmentService.getBusbarEnclosureLogs(req.user);
  }
}
