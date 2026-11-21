import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RubberOperationsService } from './rubber-operations.service';
import { CreateRubberCompoundingBatchDto } from './dto/create-compounding-batch.dto';
import { CreateExtrusionCalenderingLogDto } from './dto/create-extrusion-log.dto';
import { CreateTyreBuildingRecordDto } from './dto/create-tyre-building.dto';
import { CreateCuringVulcanizationLogDto } from './dto/create-curing-log.dto';
import { CreateTyreUniformityTestDto } from './dto/create-tyre-test.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('rubber-operations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RubberOperationsController {
  constructor(private readonly rubberService: RubberOperationsService) {}

  // =========================================================================
  // 1. RUBBER COMPOUNDING & MOONEY VISCOSITY (RUBBER_COMPOUNDING_MANAGER)
  // =========================================================================

  @Post('compounding')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.RUBBER_COMPOUNDING_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createCompoundingBatch(
    @Request() req: any,
    @Body() dto: CreateRubberCompoundingBatchDto,
  ) {
    return this.rubberService.createCompoundingBatch(req.user, dto);
  }

  @Get('compounding')
  @Roles(
    Role.RUBBER_COMPOUNDING_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.PRODUCTION_ASSISTANT_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getCompoundingBatches(@Request() req: any) {
    return this.rubberService.getCompoundingBatches(req.user);
  }

  @Get('compounding/:id')
  @Roles(
    Role.RUBBER_COMPOUNDING_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getCompoundingBatchById(@Request() req: any, @Param('id') id: string) {
    return this.rubberService.getCompoundingBatchById(req.user, id);
  }

  // =========================================================================
  // 2. EXTRUSION & CALENDERING (EXTRUSION_CALENDERING_MANAGER)
  // =========================================================================

  @Post('extrusion')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.EXTRUSION_CALENDERING_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createExtrusionLog(
    @Request() req: any,
    @Body() dto: CreateExtrusionCalenderingLogDto,
  ) {
    return this.rubberService.createExtrusionLog(req.user, dto);
  }

  @Get('extrusion')
  @Roles(
    Role.EXTRUSION_CALENDERING_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.PRODUCTION_ASSISTANT_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getExtrusionLogs(@Request() req: any) {
    return this.rubberService.getExtrusionLogs(req.user);
  }

  @Get('extrusion/:id')
  @Roles(
    Role.EXTRUSION_CALENDERING_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getExtrusionLogById(@Request() req: any, @Param('id') id: string) {
    return this.rubberService.getExtrusionLogById(req.user, id);
  }

  // =========================================================================
  // 3. GREEN TYRE BUILDING & WIP TRACKING (TYRE_BUILDING_MANAGER)
  // =========================================================================

  @Post('tyre-building')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.TYRE_BUILDING_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createTyreBuildingRecord(
    @Request() req: any,
    @Body() dto: CreateTyreBuildingRecordDto,
  ) {
    return this.rubberService.createTyreBuildingRecord(req.user, dto);
  }

  @Get('tyre-building')
  @Roles(
    Role.TYRE_BUILDING_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.PRODUCTION_ASSISTANT_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getTyreBuildingRecords(@Request() req: any) {
    return this.rubberService.getTyreBuildingRecords(req.user);
  }

  @Get('tyre-building/:id')
  @Roles(
    Role.TYRE_BUILDING_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getTyreBuildingRecordById(@Request() req: any, @Param('id') id: string) {
    return this.rubberService.getTyreBuildingRecordById(req.user, id);
  }

  // =========================================================================
  // 4. CURING & VULCANIZATION PRESS MONITORING (CURING_VULCANIZATION_MANAGER)
  // =========================================================================

  @Post('curing')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.CURING_VULCANIZATION_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createCuringLog(
    @Request() req: any,
    @Body() dto: CreateCuringVulcanizationLogDto,
  ) {
    return this.rubberService.createCuringLog(req.user, dto);
  }

  @Get('curing')
  @Roles(
    Role.CURING_VULCANIZATION_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.PRODUCTION_ASSISTANT_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getCuringLogs(@Request() req: any) {
    return this.rubberService.getCuringLogs(req.user);
  }

  @Get('curing/:id')
  @Roles(
    Role.CURING_VULCANIZATION_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getCuringLogById(@Request() req: any, @Param('id') id: string) {
    return this.rubberService.getCuringLogById(req.user, id);
  }

  // =========================================================================
  // 5. TYRE UNIFORMITY & DYNAMIC BALANCING (TYRE_TESTING_UNIFORMITY_MANAGER)
  // =========================================================================

  @Post('testing')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.TYRE_TESTING_UNIFORMITY_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createTyreUniformityTest(
    @Request() req: any,
    @Body() dto: CreateTyreUniformityTestDto,
  ) {
    return this.rubberService.createTyreUniformityTest(req.user, dto);
  }

  @Get('testing')
  @Roles(
    Role.TYRE_TESTING_UNIFORMITY_MANAGER,
    Role.QUALITY_MANAGER,
    Role.QUALITY_ASSISTANT_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getTyreUniformityTests(@Request() req: any) {
    return this.rubberService.getTyreUniformityTests(req.user);
  }

  @Get('testing/:id')
  @Roles(
    Role.TYRE_TESTING_UNIFORMITY_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getTyreUniformityTestById(@Request() req: any, @Param('id') id: string) {
    return this.rubberService.getTyreUniformityTestById(req.user, id);
  }
}
