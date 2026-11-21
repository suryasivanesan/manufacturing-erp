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
import { PipesOperationsService } from './pipes-operations.service';
import { CreatePipeExtrusionLogDto } from './dto/create-pipe-extrusion-log.dto';
import { CreatePipeUltrasonicInspectionDto } from './dto/create-ultrasonic-inspection.dto';
import { CreateHydrostaticBurstTestDto } from './dto/create-hydrostatic-test.dto';
import { CreateBellingSocketingLogDto } from './dto/create-belling-socketing-log.dto';
import { CreatePvcDryBlendBatchDto } from './dto/create-pvc-dry-blend.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('pipes-operations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PipesOperationsController {
  constructor(private readonly pipesService: PipesOperationsService) {}

  // =========================================================================
  // 1. PIPE EXTRUSION LINE OPERATIONS (EXTRUSION_LINE_OPERATIONS_MANAGER)
  // =========================================================================

  @Post('extrusion')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.EXTRUSION_LINE_OPERATIONS_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createExtrusionLog(
    @Request() req: any,
    @Body() dto: CreatePipeExtrusionLogDto,
  ) {
    return this.pipesService.createExtrusionLog(req.user, dto);
  }

  @Get('extrusion')
  @Roles(
    Role.EXTRUSION_LINE_OPERATIONS_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.PRODUCTION_ASSISTANT_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getExtrusionLogs(@Request() req: any) {
    return this.pipesService.getExtrusionLogs(req.user);
  }

  // =========================================================================
  // 2. ULTRASONIC WALL THICKNESS QUALITY (WALL_THICKNESS_QUALITY_INCHARGE)
  // =========================================================================

  @Post('ultrasonic')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.WALL_THICKNESS_QUALITY_INCHARGE,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createUltrasonicInspection(
    @Request() req: any,
    @Body() dto: CreatePipeUltrasonicInspectionDto,
  ) {
    return this.pipesService.createUltrasonicInspection(req.user, dto);
  }

  @Get('ultrasonic')
  @Roles(
    Role.WALL_THICKNESS_QUALITY_INCHARGE,
    Role.QUALITY_MANAGER,
    Role.QUALITY_ASSISTANT_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getUltrasonicInspections(@Request() req: any) {
    return this.pipesService.getUltrasonicInspections(req.user);
  }

  @Patch('ultrasonic/:id/gate')
  @Roles(
    Role.WALL_THICKNESS_QUALITY_INCHARGE,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  updatePackagingGate(
    @Request() req: any,
    @Param('id') inspectionId: string,
    @Body() body: { unblock: boolean; notes?: string },
  ) {
    return this.pipesService.updatePackagingGate(
      req.user,
      inspectionId,
      body.unblock,
      body.notes,
    );
  }

  // =========================================================================
  // 3. HYDROSTATIC BURST & COMPLIANCE TESTING (HYDROSTATIC_BURST_TESTING_MANAGER)
  // =========================================================================

  @Post('hydrostatic')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.HYDROSTATIC_BURST_TESTING_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createHydrostaticTest(
    @Request() req: any,
    @Body() dto: CreateHydrostaticBurstTestDto,
  ) {
    return this.pipesService.createHydrostaticTest(req.user, dto);
  }

  @Get('hydrostatic')
  @Roles(
    Role.HYDROSTATIC_BURST_TESTING_MANAGER,
    Role.QUALITY_MANAGER,
    Role.QUALITY_ASSISTANT_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getHydrostaticTests(@Request() req: any) {
    return this.pipesService.getHydrostaticTests(req.user);
  }

  // =========================================================================
  // 4. BELLING & SOCKETING CYCLES (SOCKETING_BELLING_JOINTING_MANAGER)
  // =========================================================================

  @Post('belling')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.SOCKETING_BELLING_JOINTING_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createBellingLog(
    @Request() req: any,
    @Body() dto: CreateBellingSocketingLogDto,
  ) {
    return this.pipesService.createBellingLog(req.user, dto);
  }

  @Get('belling')
  @Roles(
    Role.SOCKETING_BELLING_JOINTING_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.PRODUCTION_ASSISTANT_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getBellingLogs(@Request() req: any) {
    return this.pipesService.getBellingLogs(req.user);
  }

  // =========================================================================
  // 5. PVC DRY BLEND & REGRIND RATIO (PVC_DRY_BLEND_REGRIND_MANAGER)
  // =========================================================================

  @Post('dry-blend')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.PVC_DRY_BLEND_REGRIND_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createDryBlendBatch(
    @Request() req: any,
    @Body() dto: CreatePvcDryBlendBatchDto,
  ) {
    return this.pipesService.createDryBlendBatch(req.user, dto);
  }

  @Get('dry-blend')
  @Roles(
    Role.PVC_DRY_BLEND_REGRIND_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.PRODUCTION_ASSISTANT_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getDryBlendBatches(@Request() req: any) {
    return this.pipesService.getDryBlendBatches(req.user);
  }

  // =========================================================================
  // TELEMETRY SUMMARY
  // =========================================================================

  @Get('telemetry')
  @Roles(
    Role.EXTRUSION_LINE_OPERATIONS_MANAGER,
    Role.WALL_THICKNESS_QUALITY_INCHARGE,
    Role.HYDROSTATIC_BURST_TESTING_MANAGER,
    Role.SOCKETING_BELLING_JOINTING_MANAGER,
    Role.PVC_DRY_BLEND_REGRIND_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getTelemetrySummary(@Request() req: any) {
    return this.pipesService.getTelemetrySummary(req.user);
  }
}
