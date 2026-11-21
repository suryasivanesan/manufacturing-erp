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
import { PaintOperationsService } from './paint-operations.service';
import { CreateShadeMasterDto } from './dto/create-shade-master.dto';
import { CreateDispersionBatchDto } from './dto/create-dispersion-batch.dto';
import { CreateRheologyTestDto } from './dto/create-rheology-test.dto';
import { CreateBaseDispenseDto } from './dto/create-base-dispense.dto';
import { CreatePackagingComplianceDto } from './dto/create-packaging-compliance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('paint-operations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaintOperationsController {
  constructor(private readonly paintService: PaintOperationsService) {}

  // =========================================================================
  // 1. COLOR LAB, SHADE CARDS & SPECTROPHOTOMETER (COLOR_LAB_SHADE_MANAGER)
  // =========================================================================

  @Post('shades')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.COLOR_LAB_SHADE_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createShadeMaster(@Request() req: any, @Body() dto: CreateShadeMasterDto) {
    return this.paintService.createShadeMaster(req.user, dto);
  }

  @Get('shades')
  @Roles(
    Role.COLOR_LAB_SHADE_MANAGER,
    Role.QUALITY_MANAGER,
    Role.QUALITY_ASSISTANT_MANAGER,
    Role.BASE_STOCK_TINTING_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getShadeMasters(@Request() req: any) {
    return this.paintService.getShadeMasters(req.user);
  }

  @Post('shades/:id/evaluate-delta-e')
  @HttpCode(HttpStatus.OK)
  @Roles(
    Role.COLOR_LAB_SHADE_MANAGER,
    Role.QUALITY_MANAGER,
    Role.BASE_STOCK_TINTING_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  evaluateShadeDeltaE(
    @Request() req: any,
    @Param('id') shadeId: string,
    @Body() body: { sampleL: number; sampleA: number; sampleB: number },
  ) {
    return this.paintService.evaluateShadeDeltaE(
      req.user,
      shadeId,
      Number(body.sampleL),
      Number(body.sampleA),
      Number(body.sampleB),
    );
  }

  // =========================================================================
  // 2. PIGMENT & RESIN DISPERSION GRINDING (PIGMENT_RESIN_DISPERSION_MANAGER)
  // =========================================================================

  @Post('dispersion-batches')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.PIGMENT_RESIN_DISPERSION_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createDispersionBatch(
    @Request() req: any,
    @Body() dto: CreateDispersionBatchDto,
  ) {
    return this.paintService.createDispersionBatch(req.user, dto);
  }

  @Get('dispersion-batches')
  @Roles(
    Role.PIGMENT_RESIN_DISPERSION_MANAGER,
    Role.PRODUCTION_MANAGER,
    Role.PRODUCTION_ASSISTANT_MANAGER,
    Role.QUALITY_RHEOLOGY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getDispersionBatches(@Request() req: any) {
    return this.paintService.getDispersionBatches(req.user);
  }

  // =========================================================================
  // 3. QUALITY RHEOLOGY & PACKAGING GATE (QUALITY_RHEOLOGY_MANAGER)
  // =========================================================================

  @Post('rheology-tests')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.QUALITY_RHEOLOGY_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createRheologyTest(@Request() req: any, @Body() dto: CreateRheologyTestDto) {
    return this.paintService.createRheologyTest(req.user, dto);
  }

  @Get('rheology-tests')
  @Roles(
    Role.QUALITY_RHEOLOGY_MANAGER,
    Role.QUALITY_MANAGER,
    Role.QUALITY_ASSISTANT_MANAGER,
    Role.FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getRheologyTests(@Request() req: any) {
    return this.paintService.getRheologyTests(req.user);
  }

  @Post('rheology-tests/:id/generate-coa')
  @HttpCode(HttpStatus.OK)
  @Roles(
    Role.QUALITY_RHEOLOGY_MANAGER,
    Role.QUALITY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  generateCoA(@Request() req: any, @Param('id') testId: string) {
    return this.paintService.generateCoA(req.user, testId);
  }

  // =========================================================================
  // 4. BULK BASE STOCK & AUTOMATIC TINTING (BASE_STOCK_TINTING_MANAGER)
  // =========================================================================

  @Post('base-dispenses')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.BASE_STOCK_TINTING_MANAGER,
    Role.INVENTORY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createBaseStockDispense(
    @Request() req: any,
    @Body() dto: CreateBaseDispenseDto,
  ) {
    return this.paintService.createBaseStockDispense(req.user, dto);
  }

  @Get('base-dispenses')
  @Roles(
    Role.BASE_STOCK_TINTING_MANAGER,
    Role.INVENTORY_MANAGER,
    Role.INVENTORY_ASSISTANT_MANAGER,
    Role.COLOR_LAB_SHADE_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getBaseStockDispenses(@Request() req: any) {
    return this.paintService.getBaseStockDispenses(req.user);
  }

  // =========================================================================
  // 5. FLAMMABLE PACKAGING & SAFETY COMPLIANCE (FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER)
  // =========================================================================

  @Post('packaging-compliances')
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER,
    Role.PACKING_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createPackagingCompliance(
    @Request() req: any,
    @Body() dto: CreatePackagingComplianceDto,
  ) {
    return this.paintService.createPackagingCompliance(req.user, dto);
  }

  @Get('packaging-compliances')
  @Roles(
    Role.FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER,
    Role.PACKING_MANAGER,
    Role.PACKING_ASSISTANT_MANAGER,
    Role.SECURITY_MANAGER,
    Role.QUALITY_RHEOLOGY_MANAGER,
    Role.CEO,
    Role.MD,
    Role.OWNER,
  )
  getPackagingCompliances(@Request() req: any) {
    return this.paintService.getPackagingCompliances(req.user);
  }
}
