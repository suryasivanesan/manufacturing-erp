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
import { ChemicalOperationsService } from './chemical-operations.service';
import { CreateFormulaMasterDto } from './dto/create-formula-master.dto';
import { CreateHazmatRecordDto } from './dto/create-hazmat-record.dto';
import { CreateLabTestDto } from './dto/create-lab-test.dto';
import { CreateReactorCycleDto } from './dto/create-reactor-cycle.dto';
import { CreateDangerousGoodsDto } from './dto/create-dangerous-goods.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('chemical-operations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChemicalOperationsController {
  constructor(private readonly chemicalService: ChemicalOperationsService) {}

  // =========================================================================
  // 1. R&D FORMULA & STOICHIOMETRY (RD_FORMULA_CHEMIST_MANAGER)
  // =========================================================================

  @Post('formulas')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.RD_FORMULA_CHEMIST_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createFormulaMaster(@Request() req: any, @Body() dto: CreateFormulaMasterDto) {
    return this.chemicalService.createFormulaMaster(req.user, dto);
  }

  @Get('formulas')
  @Roles(
    Role.RD_FORMULA_CHEMIST_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.PRODUCTION_ASSISTANT_MANAGER,
    Role.PRODUCTION_ASSOCIATE_MANAGER,
    Role.QA_ANALYTICAL_LAB_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getFormulaMasters(@Request() req: any) {
    return this.chemicalService.getFormulaMasters(req.user);
  }

  @Patch('formulas/:id/authorize')
  @Roles(
    Role.RD_FORMULA_CHEMIST_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  authorizeFormula(
    @Request() req: any,
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('notes') notes?: string,
  ) {
    return this.chemicalService.authorizeFormula(req.user, id, status, notes);
  }

  // =========================================================================
  // 2. EHS HAZMAT & DISPOSAL MANIFESTS (EHS_HAZMAT_MANAGER)
  // =========================================================================

  @Post('hazmat')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.EHS_HAZMAT_MANAGER,
    Role.SECURITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createHazmatRecord(@Request() req: any, @Body() dto: CreateHazmatRecordDto) {
    return this.chemicalService.createHazmatRecord(req.user, dto);
  }

  @Get('hazmat')
  @Roles(
    Role.EHS_HAZMAT_MANAGER,
    Role.SECURITY_MANAGER,
    Role.SECURITY_ASSISTANT_MANAGER,
    Role.SECURITY_ASSOCIATE_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getHazmatRecords(@Request() req: any) {
    return this.chemicalService.getHazmatRecords(req.user);
  }

  // =========================================================================
  // 3. QA ANALYTICAL LAB & CERTIFICATE OF ANALYSIS (QA_ANALYTICAL_LAB_MANAGER)
  // =========================================================================

  @Post('lab-tests')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.QA_ANALYTICAL_LAB_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createLabTest(@Request() req: any, @Body() dto: CreateLabTestDto) {
    return this.chemicalService.createLabTest(req.user, dto);
  }

  @Get('lab-tests')
  @Roles(
    Role.QA_ANALYTICAL_LAB_MANAGER,
    Role.QUALITY_MANAGER,
    Role.QUALITY_ASSISTANT_MANAGER,
    Role.QUALITY_ASSOCIATE_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getLabTests(@Request() req: any) {
    return this.chemicalService.getLabTests(req.user);
  }

  // =========================================================================
  // 4. REACTOR BATCH CYCLES & UTILITIES (REACTOR_BATCH_PRODUCTION_MANAGER)
  // =========================================================================

  @Post('reactor-cycles')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.REACTOR_BATCH_PRODUCTION_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createReactorCycle(@Request() req: any, @Body() dto: CreateReactorCycleDto) {
    return this.chemicalService.createReactorCycle(req.user, dto);
  }

  @Get('reactor-cycles')
  @Roles(
    Role.REACTOR_BATCH_PRODUCTION_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.PRODUCTION_ASSISTANT_MANAGER,
    Role.PRODUCTION_ASSOCIATE_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getReactorCycles(@Request() req: any) {
    return this.chemicalService.getReactorCycles(req.user);
  }

  @Patch('reactor-cycles/:id/stage')
  @Roles(
    Role.REACTOR_BATCH_PRODUCTION_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  updateReactorStage(
    @Request() req: any,
    @Param('id') id: string,
    @Body('stage') stage: string,
    @Body('actualYieldKg') actualYieldKg?: number,
    @Body('steamKg') steamKg?: number,
    @Body('coolingWaterM3') coolingWaterM3?: number,
    @Body('powerKwh') powerKwh?: number,
  ) {
    return this.chemicalService.updateReactorStage(
      req.user,
      id,
      stage,
      actualYieldKg,
      steamKg,
      coolingWaterM3,
      powerKwh,
    );
  }

  // =========================================================================
  // 5. DANGEROUS GOODS LOGISTICS & TREMCARDS (HAZARDOUS_LOGISTICS_MANAGER)
  // =========================================================================

  @Post('dangerous-goods')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.HAZARDOUS_LOGISTICS_MANAGER,
    Role.INVENTORY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createDangerousGoods(@Request() req: any, @Body() dto: CreateDangerousGoodsDto) {
    return this.chemicalService.createDangerousGoods(req.user, dto);
  }

  @Get('dangerous-goods')
  @Roles(
    Role.HAZARDOUS_LOGISTICS_MANAGER,
    Role.INVENTORY_MANAGER,
    Role.INVENTORY_ASSISTANT_MANAGER,
    Role.INVENTORY_ASSOCIATE_MANAGER,
    Role.SECURITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getDangerousGoods(@Request() req: any) {
    return this.chemicalService.getDangerousGoods(req.user);
  }
}
