import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DairyOperationsService, UserContext } from './dairy-operations.service';
import { CreateMilkCollectionRecordDto } from './dto/create-milk-collection-record.dto';
import { CreatePasteurizationProcessingLogDto } from './dto/create-pasteurization-processing-log.dto';
import { CreateFermentationCultureBatchDto } from './dto/create-fermentation-culture-batch.dto';
import { CreateDairyQaMbrtRecordDto } from './dto/create-dairy-qa-mbrt-record.dto';
import { CreateColdChainLogisticsRecordDto } from './dto/create-cold-chain-logistics-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('dairy')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DairyOperationsController {
  constructor(private readonly dairyService: DairyOperationsService) {}

  private extractUser(req: any): UserContext {
    return {
      id: req?.user?.id || 'usr-dairy-mgr-01',
      email: req?.user?.email || 'dairy.manager@plant-enterprise.com',
      role: req?.user?.role || 'MILK_COLLECTION_RECEPTION_MANAGER',
      department: req?.user?.department || 'PRODUCTION',
      designation: req?.user?.designation || 'MANAGER',
      companyId: req?.user?.companyId || 'company_isolated_01',
      firstName: req?.user?.firstName || 'Vikram Kurien',
    };
  }

  // =========================================================================
  // DASHBOARD SUMMARY & KPIS
  // =========================================================================

  @Get('summary')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.MILK_COLLECTION_RECEPTION_MANAGER,
    Role.PASTEURIZATION_PROCESSING_MANAGER,
    Role.FERMENTATION_CULTURE_MANAGER,
    Role.QA_MBRT_ANTIBIOTIC_INCHARGE,
    Role.COLD_CHAIN_EXPIRY_MANAGER,
  )
  async getSummary(@Request() req: any) {
    const user = this.extractUser(req);
    return this.dairyService.getDairyDashboardSummary(user);
  }

  // =========================================================================
  // 1. MILK COLLECTION & RECEPTION RECORDS
  // =========================================================================

  @Get('milk-collection')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.MILK_COLLECTION_RECEPTION_MANAGER,
  )
  async getMilkCollectionRecords(@Request() req: any) {
    const user = this.extractUser(req);
    return this.dairyService.getMilkCollectionRecords(user);
  }

  @Post('milk-collection')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.MILK_COLLECTION_RECEPTION_MANAGER,
  )
  async createMilkCollectionRecord(@Request() req: any, @Body() dto: CreateMilkCollectionRecordDto) {
    const user = this.extractUser(req);
    return this.dairyService.createMilkCollectionRecord(user, dto);
  }

  @Get('milk-collection/:id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.MILK_COLLECTION_RECEPTION_MANAGER,
  )
  async getMilkCollectionRecordById(@Request() req: any, @Param('id') id: string) {
    const user = this.extractUser(req);
    return this.dairyService.getMilkCollectionRecordById(user, id);
  }

  // =========================================================================
  // 2. PASTEURIZATION & PROCESSING LOGS
  // =========================================================================

  @Get('pasteurization')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.PASTEURIZATION_PROCESSING_MANAGER,
  )
  async getPasteurizationLogs(@Request() req: any) {
    const user = this.extractUser(req);
    return this.dairyService.getPasteurizationLogs(user);
  }

  @Post('pasteurization')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.PASTEURIZATION_PROCESSING_MANAGER,
  )
  async createPasteurizationLog(@Request() req: any, @Body() dto: CreatePasteurizationProcessingLogDto) {
    const user = this.extractUser(req);
    return this.dairyService.createPasteurizationLog(user, dto);
  }

  @Get('pasteurization/:id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.PASTEURIZATION_PROCESSING_MANAGER,
  )
  async getPasteurizationLogById(@Request() req: any, @Param('id') id: string) {
    const user = this.extractUser(req);
    return this.dairyService.getPasteurizationLogById(user, id);
  }

  // =========================================================================
  // 3. FERMENTATION & CULTURE BATCHES
  // =========================================================================

  @Get('fermentation')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.FERMENTATION_CULTURE_MANAGER,
  )
  async getFermentationBatches(@Request() req: any) {
    const user = this.extractUser(req);
    return this.dairyService.getFermentationBatches(user);
  }

  @Post('fermentation')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.FERMENTATION_CULTURE_MANAGER,
  )
  async createFermentationBatch(@Request() req: any, @Body() dto: CreateFermentationCultureBatchDto) {
    const user = this.extractUser(req);
    return this.dairyService.createFermentationBatch(user, dto);
  }

  @Get('fermentation/:id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.PRODUCTION,
    Role.PRODUCTION_MANAGER,
    Role.FERMENTATION_CULTURE_MANAGER,
  )
  async getFermentationBatchById(@Request() req: any, @Param('id') id: string) {
    const user = this.extractUser(req);
    return this.dairyService.getFermentationBatchById(user, id);
  }

  // =========================================================================
  // 4. DAIRY QA & MBRT/ANTIBIOTIC RECORDS
  // =========================================================================

  @Get('qa-mbrt')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.QA_MBRT_ANTIBIOTIC_INCHARGE,
  )
  async getDairyQaRecords(@Request() req: any) {
    const user = this.extractUser(req);
    return this.dairyService.getDairyQaRecords(user);
  }

  @Post('qa-mbrt')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.QA_MBRT_ANTIBIOTIC_INCHARGE,
  )
  async createDairyQaRecord(@Request() req: any, @Body() dto: CreateDairyQaMbrtRecordDto) {
    const user = this.extractUser(req);
    return this.dairyService.createDairyQaRecord(user, dto);
  }

  @Get('qa-mbrt/:id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.QA_MBRT_ANTIBIOTIC_INCHARGE,
  )
  async getDairyQaRecordById(@Request() req: any, @Param('id') id: string) {
    const user = this.extractUser(req);
    return this.dairyService.getDairyQaRecordById(user, id);
  }

  @Post('qa-mbrt/:id/certify')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.QA_MBRT_ANTIBIOTIC_INCHARGE,
  )
  async certifyDairyQaRecord(@Request() req: any, @Param('id') id: string) {
    const user = this.extractUser(req);
    return this.dairyService.certifyDairyQaRecord(user, id);
  }

  @Post('qa-mbrt/:id/toggle-packaging-gate')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.QUALITY,
    Role.QUALITY_MANAGER,
    Role.QA_MBRT_ANTIBIOTIC_INCHARGE,
  )
  async togglePackagingGateBlock(@Request() req: any, @Param('id') id: string) {
    const user = this.extractUser(req);
    return this.dairyService.togglePackagingGateBlock(user, id);
  }

  // =========================================================================
  // 5. COLD-CHAIN & EXPIRY FEFO RECORDS
  // =========================================================================

  @Get('cold-chain')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.COLD_CHAIN_EXPIRY_MANAGER,
  )
  async getColdChainRecords(@Request() req: any) {
    const user = this.extractUser(req);
    return this.dairyService.getColdChainRecords(user);
  }

  @Post('cold-chain')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.COLD_CHAIN_EXPIRY_MANAGER,
  )
  async createColdChainRecord(@Request() req: any, @Body() dto: CreateColdChainLogisticsRecordDto) {
    const user = this.extractUser(req);
    return this.dairyService.createColdChainRecord(user, dto);
  }

  @Get('cold-chain/:id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.COLD_CHAIN_EXPIRY_MANAGER,
  )
  async getColdChainRecordById(@Request() req: any, @Param('id') id: string) {
    const user = this.extractUser(req);
    return this.dairyService.getColdChainRecordById(user, id);
  }

  @Post('cold-chain/:id/toggle-dispatch-block')
  @Roles(
    Role.SUPER_ADMIN,
    Role.EXECUTIVE,
    Role.INVENTORY,
    Role.INVENTORY_MANAGER,
    Role.COLD_CHAIN_EXPIRY_MANAGER,
  )
  async toggleColdChainDispatchBlock(@Request() req: any, @Param('id') id: string) {
    const user = this.extractUser(req);
    return this.dairyService.toggleColdChainDispatchBlock(user, id);
  }
}
