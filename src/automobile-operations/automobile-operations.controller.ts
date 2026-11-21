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
import { AutomobileOperationsService } from './automobile-operations.service';
import { CreateAutomobileKanbanSignalDto } from './dto/create-kanban-signal.dto';
import { CreatePressShopBiwLogDto } from './dto/create-press-shop-log.dto';
import { CreateVehicleAssemblyRecordDto } from './dto/create-assembly-record.dto';
import { CreatePaintShopCorrosionLogDto } from './dto/create-paint-shop-log.dto';
import { CreateEolVinTestingRecordDto } from './dto/create-eol-vin-test.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('automobile-operations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AutomobileOperationsController {
  constructor(private readonly autoService: AutomobileOperationsService) {}

  // =========================================================================
  // 1. ELECTRONIC KANBAN (JIT / JIS) OPERATIONS (JIT_JIS_SUPPLY_CHAIN_MANAGER)
  // =========================================================================

  @Post('kanban')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.JIT_JIS_SUPPLY_CHAIN_MANAGER,
    Role.INVENTORY_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createKanbanSignal(
    @Request() req: any,
    @Body() dto: CreateAutomobileKanbanSignalDto,
  ) {
    return this.autoService.createKanbanSignal(req.user, dto);
  }

  @Get('kanban')
  @Roles(
    Role.JIT_JIS_SUPPLY_CHAIN_MANAGER,
    Role.INVENTORY_MANAGER,
    Role.INVENTORY_ASSISTANT_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getKanbanSignals(@Request() req: any) {
    return this.autoService.getKanbanSignals(req.user);
  }

  @Patch('kanban/:id/status')
  @Roles(
    Role.JIT_JIS_SUPPLY_CHAIN_MANAGER,
    Role.INVENTORY_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  updateKanbanStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body('status') status: 'TRIGGERED' | 'EN_ROUTE' | 'DELIVERED_LINE_SIDE' | 'CONSUMED' | 'DEPLETED',
    @Body('deliveredQuantity') deliveredQty?: number,
  ) {
    return this.autoService.updateKanbanStatus(req.user, id, status, deliveredQty);
  }

  // =========================================================================
  // 2. PRESS SHOP & BIW OPERATIONS (PRESS_SHOP_BIW_MANAGER)
  // =========================================================================

  @Post('press-shop')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.PRESS_SHOP_BIW_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createPressShopLog(
    @Request() req: any,
    @Body() dto: CreatePressShopBiwLogDto,
  ) {
    return this.autoService.createPressShopLog(req.user, dto);
  }

  @Get('press-shop')
  @Roles(
    Role.PRESS_SHOP_BIW_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.PRODUCTION_ASSISTANT_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getPressShopLogs(@Request() req: any) {
    return this.autoService.getPressShopLogs(req.user);
  }

  // =========================================================================
  // 3. VEHICLE ASSEMBLY (TCF) OPERATIONS (VEHICLE_ASSEMBLY_MANAGER)
  // =========================================================================

  @Post('assembly')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.VEHICLE_ASSEMBLY_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createAssemblyRecord(
    @Request() req: any,
    @Body() dto: CreateVehicleAssemblyRecordDto,
  ) {
    return this.autoService.createAssemblyRecord(req.user, dto);
  }

  @Get('assembly')
  @Roles(
    Role.VEHICLE_ASSEMBLY_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.PRODUCTION_ASSISTANT_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getAssemblyRecords(@Request() req: any) {
    return this.autoService.getAssemblyRecords(req.user);
  }

  @Patch('assembly/:id/station')
  @Roles(
    Role.VEHICLE_ASSEMBLY_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  updateStationProgress(
    @Request() req: any,
    @Param('id') id: string,
    @Body('station') station: string,
    @Body('wipStage') wipStage: string,
  ) {
    return this.autoService.updateStationProgress(req.user, id, station, wipStage);
  }

  // =========================================================================
  // 4. PAINT SHOP & ANTI-CORROSION (PAINT_SHOP_ANTI_CORROSION_MANAGER)
  // =========================================================================

  @Post('paint-shop')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.PAINT_SHOP_ANTI_CORROSION_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createPaintShopLog(
    @Request() req: any,
    @Body() dto: CreatePaintShopCorrosionLogDto,
  ) {
    return this.autoService.createPaintShopLog(req.user, dto);
  }

  @Get('paint-shop')
  @Roles(
    Role.PAINT_SHOP_ANTI_CORROSION_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.PRODUCTION_ASSISTANT_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getPaintShopLogs(@Request() req: any) {
    return this.autoService.getPaintShopLogs(req.user);
  }

  // =========================================================================
  // 5. END-OF-LINE (EOL) TESTING & VIN GATE-PASS (EOL_TESTING_VIN_MANAGER)
  // =========================================================================

  @Post('eol-vin')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.EOL_TESTING_VIN_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createEolVinTest(
    @Request() req: any,
    @Body() dto: CreateEolVinTestingRecordDto,
  ) {
    return this.autoService.createEolVinTest(req.user, dto);
  }

  @Get('eol-vin')
  @Roles(
    Role.EOL_TESTING_VIN_MANAGER,
    Role.QUALITY_MANAGER,
    Role.QUALITY_ASSISTANT_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getEolVinTests(@Request() req: any) {
    return this.autoService.getEolVinTests(req.user);
  }

  @Post('eol-vin/:id/gate-pass')
  @HttpCode(HttpStatus.OK)
  @Roles(
    Role.EOL_TESTING_VIN_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  issueGatePass(@Request() req: any, @Param('id') id: string) {
    return this.autoService.issueGatePass(req.user, id);
  }

  // =========================================================================
  // SUMMARY KPI TELEMETRY
  // =========================================================================

  @Get('summary')
  @Roles(
    Role.JIT_JIS_SUPPLY_CHAIN_MANAGER,
    Role.PRESS_SHOP_BIW_MANAGER,
    Role.VEHICLE_ASSEMBLY_MANAGER,
    Role.PAINT_SHOP_ANTI_CORROSION_MANAGER,
    Role.EOL_TESTING_VIN_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.INVENTORY_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getOperationsSummary(@Request() req: any) {
    return this.autoService.getOperationsSummary(req.user);
  }
}
