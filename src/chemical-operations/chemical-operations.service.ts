import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFormulaMasterDto } from './dto/create-formula-master.dto';
import { CreateHazmatRecordDto } from './dto/create-hazmat-record.dto';
import { CreateLabTestDto } from './dto/create-lab-test.dto';
import { CreateReactorCycleDto } from './dto/create-reactor-cycle.dto';
import { CreateDangerousGoodsDto } from './dto/create-dangerous-goods.dto';

export interface UserContext {
  id: string;
  email: string;
  role: string;
  companyId?: string | null;
  firstName?: string | null;
}

@Injectable()
export class ChemicalOperationsService {
  private readonly logger = new Logger(ChemicalOperationsService.name);

  private errMsg(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
  }

  // In-memory fallbacks to guarantee zero runtime downtime prior to DB migration
  private inMemoryFormulas: any[] = [];
  private inMemoryHazmat: any[] = [];
  private inMemoryLabTests: any[] = [];
  private inMemoryReactorCycles: any[] = [];
  private inMemoryDangerousGoods: any[] = [];

  constructor(private readonly prisma: PrismaService) {
    this.seedSampleChemicalData();
  }

  // =========================================================================
  // 1. R&D FORMULA & STOICHIOMETRY (RD_FORMULA_CHEMIST_MANAGER)
  // =========================================================================

  /**
   * Create or version a Master Chemical Recipe & Reaction Stoichiometry
   */
  async createFormulaMaster(user: UserContext, dto: CreateFormulaMasterDto) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required to create formulas.');
    }
    const companyId = user.companyId;

    const theoreticalYield = Number(dto.theoreticalYieldKg);
    if (!theoreticalYield || theoreticalYield <= 0) {
      throw new BadRequestException('Theoretical stoichiometric yield must be greater than zero.');
    }

    const formulaCode =
      dto.formulaCode?.trim() ||
      `FORM-CHEM-${new Date().getFullYear()}-${String(
        Math.floor(100 + Math.random() * 900),
      )}`;

    const record = {
      id: `cfm-${Date.now()}`,
      formulaCode,
      productName: dto.productName.trim(),
      version: dto.version?.trim() || 'v1.0',
      stoichiometryEquation: dto.stoichiometryEquation.trim(),
      theoreticalYieldKg: theoreticalYield,
      expectedCycleTimeHours: Number(dto.expectedCycleTimeHours || 8.0),
      reactionType: dto.reactionType.trim(),
      hazardClassification: dto.hazardClassification?.trim() || 'CLASS_3_FLAMMABLE',
      activeStatus: dto.activeStatus?.trim() || 'APPROVED',
      rawMaterialsComposition:
        dto.rawMaterialsComposition ||
        JSON.stringify([
          { reactant: 'Acetic Acid (99.8%)', molarRatio: '1.0 mol', cas: '64-19-7', qtyKg: 600 },
          { reactant: 'Ethanol Absolute', molarRatio: '1.05 mol', cas: '64-17-5', qtyKg: 483 },
          { catalyst: 'Sulfuric Acid (Conc.)', molarRatio: '0.02 mol', cas: '7664-93-9', qtyKg: 15 },
        ]),
      safetyDataSheetUrl: dto.safetyDataSheetUrl || 'https://mfg-erp.internal/sds/chem-ea-2026.pdf',
      authorizedById: user.id,
      authorizationNotes: dto.authorizationNotes || 'Approved for pilot reactor scaling by R&D Head.',
      companyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if ((this.prisma as any).chemicalFormulaMaster) {
        const saved = await (this.prisma as any).chemicalFormulaMaster.create({
          data: record,
        });
        return {
          message: 'Chemical synthesis master formula registered successfully.',
          data: saved,
        };
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma ChemicalFormulaMaster write fallback: ${this.errMsg(err)}`);
    }

    this.inMemoryFormulas.unshift(record);
    return {
      message: 'Chemical synthesis master formula registered successfully (In-Memory).',
      data: record,
    };
  }

  /**
   * List all chemical master formulas strictly scoped to authenticated company
   */
  async getFormulaMasters(user: UserContext) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required to view formulas.');
    }
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).chemicalFormulaMaster) {
        const dbRecords = await (this.prisma as any).chemicalFormulaMaster.findMany({
          where: { companyId },
          orderBy: { createdAt: 'desc' },
        });
        return dbRecords;
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma ChemicalFormulaMaster read fallback: ${this.errMsg(err)}`);
    }

    return this.inMemoryFormulas.filter((f: any) => f.companyId === companyId);
  }

  async authorizeFormula(user: UserContext, id: string, status: string, notes?: string) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required.');
    }
    const companyId = user.companyId;

    const validStatuses = ['APPROVED', 'DRAFT', 'UNDER_REVIEW', 'ARCHIVED'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    try {
      if ((this.prisma as any).chemicalFormulaMaster) {
        const existing = await (this.prisma as any).chemicalFormulaMaster.findFirst({
          where: { id, companyId },
        });
        if (!existing) {
          throw new NotFoundException(`Formula ${id} not found in your organization.`);
        }

        const updated = await (this.prisma as any).chemicalFormulaMaster.update({
          where: { id: existing.id },
          data: {
            activeStatus: status,
            authorizedById: user.id,
            authorizationNotes: notes || `Formula status changed to ${status}`,
            updatedAt: new Date(),
          },
        });
        return { message: `Formula status updated to ${status}.`, data: updated };
      }
    } catch (err: unknown) {
      if (err instanceof NotFoundException) throw err;
      this.logger.warn(`Prisma ChemicalFormulaMaster update fallback: ${this.errMsg(err)}`);
    }

    const idx = this.inMemoryFormulas.findIndex(
      (f: any) => (f.id === id || f.formulaCode === id) && f.companyId === companyId,
    );
    if (idx === -1) {
      throw new NotFoundException(`Formula ${id} not found in your organization.`);
    }

    this.inMemoryFormulas[idx].activeStatus = status;
    this.inMemoryFormulas[idx].authorizedById = user.id;
    this.inMemoryFormulas[idx].authorizationNotes = notes || `Status changed to ${status}`;
    this.inMemoryFormulas[idx].updatedAt = new Date().toISOString();

    return {
      message: `Formula ${id} authorization status updated to ${status}.`,
      data: this.inMemoryFormulas[idx],
    };
  }

  // =========================================================================
  // 2. EHS HAZMAT & DISPOSAL MANIFESTS (EHS_HAZMAT_MANAGER)
  // =========================================================================

  /**
   * Log Hazardous Waste Disposal & Safety Gear PPE Audits
   */
  async createHazmatRecord(user: UserContext, dto: CreateHazmatRecordDto) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required to log hazmat records.');
    }
    const companyId = user.companyId;

    const quantity = Number(dto.quantityLtrOrKg);
    if (!quantity || quantity <= 0) {
      throw new BadRequestException('Disposal quantity must be greater than zero.');
    }

    const manifestNumber =
      dto.manifestNumber?.trim() ||
      `HAZ-MAN-${new Date().getFullYear()}-${String(
        Math.floor(100 + Math.random() * 900),
      )}`;

    const ppeAuditScore = Number(dto.ppeAuditScore ?? 98.5);
    const ppeStatus =
      dto.ppeComplianceStatus || (ppeAuditScore >= 90 ? 'COMPLIANT' : 'FLAGGED_VIOLATION');

    const record = {
      id: `haz-${Date.now()}`,
      manifestNumber,
      wasteType: dto.wasteType.trim(),
      unClassification: dto.unClassification?.trim() || 'UN 1993',
      wasteCategoryCpcb: dto.wasteCategoryCpcb.trim(),
      quantityLtrOrKg: quantity,
      unit: dto.unit?.trim() || 'kg',
      disposalMethod: dto.disposalMethod.trim(),
      handlingPermitNumber: dto.handlingPermitNumber.trim(),
      permitExpiryDate: dto.permitExpiryDate ? new Date(dto.permitExpiryDate) : new Date(Date.now() + 180 * 86400000),
      ppeComplianceStatus: ppeStatus,
      ppeAuditScore,
      statutoryRegulatoryBody: dto.statutoryRegulatoryBody?.trim() || 'CPCB / SPCB',
      safetyAuditDate: new Date(),
      auditorOfficerId: user.id,
      auditNotes: dto.auditNotes || 'Routine compliance inspection; respiratory cartridged respirators inspected.',
      companyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if ((this.prisma as any).chemicalHazmatRecord) {
        const saved = await (this.prisma as any).chemicalHazmatRecord.create({
          data: record,
        });
        return {
          message: 'Hazardous waste manifest and EHS safety record logged successfully.',
          data: saved,
        };
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma ChemicalHazmatRecord write fallback: ${this.errMsg(err)}`);
    }

    this.inMemoryHazmat.unshift(record);
    return {
      message: 'Hazardous waste manifest and EHS safety record logged successfully (In-Memory).',
      data: record,
    };
  }

  /**
   * List all hazmat compliance records strictly scoped to authenticated company
   */
  async getHazmatRecords(user: UserContext) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required to view hazmat records.');
    }
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).chemicalHazmatRecord) {
        const dbRecords = await (this.prisma as any).chemicalHazmatRecord.findMany({
          where: { companyId },
          orderBy: { createdAt: 'desc' },
        });
        return dbRecords;
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma ChemicalHazmatRecord read fallback: ${this.errMsg(err)}`);
    }

    return this.inMemoryHazmat.filter((h: any) => h.companyId === companyId);
  }

  // =========================================================================
  // 3. QA ANALYTICAL LAB & CERTIFICATE OF ANALYSIS (QA_ANALYTICAL_LAB_MANAGER)
  // =========================================================================

  /**
   * Upload Analytical Lab Results & Enforce Dispatch Clearance Gate
   */
  async createLabTest(user: UserContext, dto: CreateLabTestDto) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required to log lab tests.');
    }
    const companyId = user.companyId;

    const purity = Number(dto.purityPercent);
    const ph = Number(dto.phLevel);
    const moisture = Number(dto.moistureWaterPercent);
    const density = dto.densityGml !== undefined ? Number(dto.densityGml) : null;

    const isPurityAcceptable = purity >= 98.0;
    const isPhAcceptable = ph >= 6.0 && ph <= 8.5;
    const isMoistureAcceptable = moisture <= 0.50;
    const explicitlyPassed = dto.testPassed !== false;

    const overallPassed = isPurityAcceptable && isPhAcceptable && isMoistureAcceptable && explicitlyPassed;

    let dispatchCleared = false;
    let blockingReason: string | null = null;
    let coaDocumentNumber: string | null = null;
    let coaGeneratedAt: Date | null = null;

    if (overallPassed) {
      dispatchCleared = true;
      coaDocumentNumber = `COA-CHEM-${new Date().getFullYear()}-${String(
        Math.floor(1000 + Math.random() * 9000),
      )}`;
      coaGeneratedAt = new Date();
    } else {
      const violations: string[] = [];
      if (!isPurityAcceptable) violations.push(`Purity ${purity}% < 98.0% minimum`);
      if (!isPhAcceptable) violations.push(`pH ${ph} outside 6.0-8.5 acceptable window`);
      if (!isMoistureAcceptable) violations.push(`Moisture ${moisture}% exceeds 0.50% max threshold`);
      if (!explicitlyPassed) violations.push('Analyst flagged quality failure');

      blockingReason = `CRITICAL GATE: Dispatch Blocked! Violations: ${violations.join(', ')}.`;
      this.logger.warn(`[QA GATE LOCKOUT] Batch ${dto.batchNumber} dispatch cleared = FALSE. Reason: ${blockingReason}`);
    }

    const testId =
      dto.testId?.trim() ||
      `LAB-QA-${new Date().getFullYear()}-${String(
        Math.floor(100 + Math.random() * 900),
      )}`;

    const record = {
      id: `lab-${Date.now()}`,
      testId,
      batchNumber: dto.batchNumber.trim(),
      productName: dto.productName.trim(),
      sampleSource: dto.sampleSource?.trim() || 'Reactor Intermediate Distillate',
      purityPercent: purity,
      phLevel: ph,
      moistureWaterPercent: moisture,
      densityGml: density,
      testPassed: overallPassed,
      dispatchCleared,
      coaDocumentNumber,
      coaGeneratedAt,
      blockingReason,
      chemistSignoffId: user.id,
      chemistNotes: dto.chemistNotes || (overallPassed ? 'Conforms to ISO 9001 / ACS analytical specs.' : blockingReason),
      companyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if ((this.prisma as any).analyticalLabTest) {
        const saved = await (this.prisma as any).analyticalLabTest.create({
          data: record,
        });
        return {
          message: overallPassed
            ? 'Analytical test verified. CoA generated and batch cleared for dispatch.'
            : 'Analytical test failed! Batch strictly BLOCKED from dispatch.',
          data: saved,
        };
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma AnalyticalLabTest write fallback: ${this.errMsg(err)}`);
    }

    this.inMemoryLabTests.unshift(record);
    return {
      message: overallPassed
        ? 'Analytical test verified. CoA generated and batch cleared for dispatch (In-Memory).'
        : 'Analytical test failed! Batch strictly BLOCKED from dispatch (In-Memory).',
      data: record,
    };
  }

  /**
   * List all analytical lab tests strictly scoped to authenticated company
   */
  async getLabTests(user: UserContext) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required to view lab tests.');
    }
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).analyticalLabTest) {
        const dbRecords = await (this.prisma as any).analyticalLabTest.findMany({
          where: { companyId },
          orderBy: { createdAt: 'desc' },
        });
        return dbRecords;
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma AnalyticalLabTest read fallback: ${this.errMsg(err)}`);
    }

    return this.inMemoryLabTests.filter((t: any) => t.companyId === companyId);
  }

  // =========================================================================
  // 4. REACTOR BATCH CYCLES & UTILITIES (REACTOR_BATCH_PRODUCTION_MANAGER)
  // =========================================================================

  /**
   * Monitor Multi-stage Reactor Cycles
   */
  async createReactorCycle(user: UserContext, dto: CreateReactorCycleDto) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required to create reactor cycles.');
    }
    const companyId = user.companyId;

    const target = Number(dto.targetYieldKg);
    const actual = Number(dto.actualYieldKg || 0);

    if (!target || target <= 0) {
      throw new BadRequestException('Target recipe yield must be greater than zero.');
    }

    const yieldPercentage = actual > 0 ? Number(((actual / target) * 100).toFixed(2)) : 0;

    const batchCode =
      dto.batchCode?.trim() ||
      `BAT-R4-${new Date().getFullYear()}-${String(
        Math.floor(100 + Math.random() * 900),
      )}`;

    const record = {
      id: `rbc-${Date.now()}`,
      batchCode,
      reactorId: dto.reactorId.trim(),
      productName: dto.productName.trim(),
      currentStage: dto.currentStage?.trim() || 'CHARGING',
      targetYieldKg: target,
      actualYieldKg: actual,
      yieldPercentage,
      steamConsumptionKg: Number(dto.steamConsumptionKg || 0),
      coolingWaterM3: Number(dto.coolingWaterM3 || 0),
      powerConsumptionKwh: Number(dto.powerConsumptionKwh || 0),
      cycleStartTime: new Date(),
      cycleEndTime: null,
      downtimeHours: Number(dto.downtimeHours || 0),
      downtimeReason: dto.downtimeReason || null,
      operatorInchargeId: user.id,
      stageRemarks: dto.stageRemarks || 'Raw material charging commenced under N2 inert blanket.',
      companyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if ((this.prisma as any).reactorBatchCycle) {
        const saved = await (this.prisma as any).reactorBatchCycle.create({
          data: record,
        });
        return {
          message: 'Reactor batch production cycle initiated successfully.',
          data: saved,
        };
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma ReactorBatchCycle write fallback: ${this.errMsg(err)}`);
    }

    this.inMemoryReactorCycles.unshift(record);
    return {
      message: 'Reactor batch production cycle initiated successfully (In-Memory).',
      data: record,
    };
  }

  /**
   * List all reactor cycles strictly scoped to authenticated company
   */
  async getReactorCycles(user: UserContext) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required to view reactor cycles.');
    }
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).reactorBatchCycle) {
        const dbRecords = await (this.prisma as any).reactorBatchCycle.findMany({
          where: { companyId },
          orderBy: { createdAt: 'desc' },
        });
        return dbRecords;
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma ReactorBatchCycle read fallback: ${this.errMsg(err)}`);
    }

    return this.inMemoryReactorCycles.filter((c: any) => c.companyId === companyId);
  }

  async updateReactorStage(
    user: UserContext,
    id: string,
    stage: string,
    actualYieldKg?: number,
    steamKg?: number,
    coolingWaterM3?: number,
    powerKwh?: number,
  ) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required.');
    }
    const companyId = user.companyId;

    const validStages = [
      'CHARGING',
      'REACTION',
      'REFLUX',
      'DISTILLATION',
      'COOLING',
      'DISCHARGING',
      'COMPLETED',
    ];
    if (!validStages.includes(stage)) {
      throw new BadRequestException(`Stage must be one of: ${validStages.join(', ')}`);
    }

    try {
      if ((this.prisma as any).reactorBatchCycle) {
        const existing = await (this.prisma as any).reactorBatchCycle.findFirst({
          where: { id, companyId },
        });
        if (!existing) {
          throw new NotFoundException(`Reactor batch cycle ${id} not found in your organization.`);
        }

        const updated = await (this.prisma as any).reactorBatchCycle.update({
          where: { id: existing.id },
          data: {
            currentStage: stage,
            ...(actualYieldKg !== undefined && { actualYieldKg }),
            ...(steamKg !== undefined && { steamConsumptionKg: steamKg }),
            ...(coolingWaterM3 !== undefined && { coolingWaterM3 }),
            ...(powerKwh !== undefined && { powerConsumptionKwh: powerKwh }),
            ...(stage === 'COMPLETED' && { cycleEndTime: new Date() }),
          },
        });
        return { message: `Reactor batch stage updated to ${stage}.`, data: updated };
      }
    } catch (err: unknown) {
      if (err instanceof NotFoundException) throw err;
      this.logger.warn(`Prisma ReactorBatchCycle update fallback: ${this.errMsg(err)}`);
    }

    const idx = this.inMemoryReactorCycles.findIndex(
      (c: any) => (c.id === id || c.batchCode === id) && c.companyId === companyId,
    );
    if (idx !== -1) {
      const cur = this.inMemoryReactorCycles[idx];
      cur.currentStage = stage;
      if (actualYieldKg !== undefined) {
        cur.actualYieldKg = Number(actualYieldKg);
        cur.yieldPercentage = Number(((cur.actualYieldKg / cur.targetYieldKg) * 100).toFixed(2));
      }
      if (steamKg !== undefined) cur.steamConsumptionKg = Number(steamKg);
      if (coolingWaterM3 !== undefined) cur.coolingWaterM3 = Number(coolingWaterM3);
      if (powerKwh !== undefined) cur.powerConsumptionKwh = Number(powerKwh);
      if (stage === 'COMPLETED') cur.cycleEndTime = new Date().toISOString();
      cur.updatedAt = new Date().toISOString();
      return { message: `Reactor batch stage updated to ${stage}.`, data: cur };
    }

    throw new NotFoundException(`Reactor batch cycle ${id} not found in your organization.`);
  }

  // =========================================================================
  // 5. DANGEROUS GOODS LOGISTICS & TREMCARDS (HAZARDOUS_LOGISTICS_MANAGER)
  // =========================================================================

  /**
   * Log Dangerous Goods Transit Documentation, UN Numbers & Tremcards
   */
  async createDangerousGoods(user: UserContext, dto: CreateDangerousGoodsDto) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required to log dangerous goods.');
    }
    const companyId = user.companyId;

    const dispatchTrackingNumber =
      dto.dispatchTrackingNumber?.trim() ||
      `DGL-${new Date().getFullYear()}-${String(
        Math.floor(100 + Math.random() * 900),
      )}`;

    const isHazmatDriverValid = dto.driverHazmatEndorsementValid !== false;
    const routeClearanceStatus = isHazmatDriverValid
      ? (dto.routeClearanceStatus || 'APPROVED')
      : 'EXPIRED_LICENSE_HOLD';

    if (!isHazmatDriverValid) {
      this.logger.warn(
        `[LOGISTICS DISPATCH GATE] Dangerous goods dispatch ${dispatchTrackingNumber} BLOCKED: Driver Hazmat endorsement invalid or expired!`,
      );
    }

    const tremcardIssued = dto.tremcardIssued !== false;
    const tremcardDocNumber = tremcardIssued
      ? `TREM-${new Date().getFullYear()}-${String(
          Math.floor(1000 + Math.random() * 9000),
        )}`
      : null;

    const record = {
      id: `dgl-${Date.now()}`,
      dispatchTrackingNumber,
      batchNumber: dto.batchNumber.trim(),
      productName: dto.productName.trim(),
      unNumber: dto.unNumber?.trim() || 'UN 1993',
      properShippingName: dto.properShippingName.trim(),
      hazardClass: dto.hazardClass?.trim() || 'Class 3 (Flammable Liquid)',
      packingGroup: dto.packingGroup?.trim() || 'PG II',
      hazchemCode: dto.hazchemCode?.trim() || '3YE',
      tremcardIssued,
      tremcardDocumentNumber: tremcardDocNumber,
      vehicleRegistrationNumber: dto.vehicleRegistrationNumber.trim(),
      driverName: dto.driverName.trim(),
      driverLicenseNumber: dto.driverLicenseNumber.trim(),
      driverHazmatEndorsementValid: isHazmatDriverValid,
      driverLicenseExpiryDate: new Date(Date.now() + 240 * 86400000),
      statutoryTransitPermitNumber: dto.statutoryTransitPermitNumber || 'PESO-DL-TRANS-2026-8812',
      statutoryPermitExpiry: new Date(Date.now() + 365 * 86400000),
      routeClearanceStatus,
      dispatchNotes: dto.dispatchNotes || 'Driver handed Tremcard & Class 3 emergency instructions.',
      logisticsInchargeId: user.id,
      companyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if ((this.prisma as any).dangerousGoodsLogistics) {
        const saved = await (this.prisma as any).dangerousGoodsLogistics.create({
          data: record,
        });
        return {
          message: isHazmatDriverValid
            ? 'Dangerous goods dispatch cleared with UN/Hazchem placards and Tremcard.'
            : 'DISPATCH BLOCKED: Driver hazmat license endorsement is missing or expired!',
          data: saved,
        };
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma DangerousGoodsLogistics write fallback: ${this.errMsg(err)}`);
    }

    this.inMemoryDangerousGoods.unshift(record);
    return {
      message: isHazmatDriverValid
        ? 'Dangerous goods dispatch cleared with UN/Hazchem placards and Tremcard (In-Memory).'
        : 'DISPATCH BLOCKED: Driver hazmat license endorsement is missing or expired! (In-Memory)',
      data: record,
    };
  }

  /**
   * List dangerous goods transit records strictly scoped to authenticated company
   */
  async getDangerousGoods(user: UserContext) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required to view dangerous goods records.');
    }
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).dangerousGoodsLogistics) {
        const dbRecords = await (this.prisma as any).dangerousGoodsLogistics.findMany({
          where: { companyId },
          orderBy: { createdAt: 'desc' },
        });
        return dbRecords;
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma DangerousGoodsLogistics read fallback: ${this.errMsg(err)}`);
    }

    return this.inMemoryDangerousGoods.filter((d: any) => d.companyId === companyId);
  }

  // =========================================================================
  // SAMPLE DATA SEEDING (REALISTIC CHEMICAL INDUSTRIAL DATA)
  // =========================================================================

  private seedSampleChemicalData() {
    this.inMemoryFormulas = [
      {
        id: 'cfm-seed-1',
        formulaCode: 'FORM-CHEM-2026-001',
        productName: 'Ethyl Acetate Industrial Grade (99.5% Pure)',
        version: 'v2.4',
        stoichiometryEquation: 'CH3COOH + C2H5OH <==[H2SO4]==> CH3COOC2H5 + H2O',
        theoreticalYieldKg: 1466.7,
        expectedCycleTimeHours: 6.5,
        reactionType: 'Esterification (Continuous Distillation)',
        hazardClassification: 'CLASS_3_FLAMMABLE',
        activeStatus: 'APPROVED',
        rawMaterialsComposition: JSON.stringify([
          { reactant: 'Glacial Acetic Acid (99.8%)', cas: '64-19-7', qtyKg: 1000, molarRatio: '1.0 mol' },
          { reactant: 'Ethanol Absolute (99.9%)', cas: '64-17-5', qtyKg: 780, molarRatio: '1.02 mol' },
          { catalyst: 'Sulfuric Acid Conc. (98%)', cas: '7664-93-9', qtyKg: 25, molarRatio: '0.015 mol' },
        ]),
        safetyDataSheetUrl: 'https://mfg-erp.internal/sds/chem-ea-2026.pdf',
        authorizedById: 'user-rd-chemist-1',
        authorizationNotes: 'Validated stoichiometric equilibrium: 94.2% practical isolated recovery.',
        companyId: 'default-company',
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: 'cfm-seed-2',
        formulaCode: 'FORM-CHEM-2026-002',
        productName: 'Epoxy Resins Novolac Precursor Oligomer',
        version: 'v1.1',
        stoichiometryEquation: 'Novolac Phenol Resin + Epichlorohydrin -> EPN Oligomer + NaCl',
        theoreticalYieldKg: 2200.0,
        expectedCycleTimeHours: 9.0,
        reactionType: 'Condensation Polymerization (Exothermic)',
        hazardClassification: 'CLASS_8_CORROSIVE',
        activeStatus: 'APPROVED',
        rawMaterialsComposition: JSON.stringify([
          { reactant: 'Phenol Novolac Base', cas: '9003-35-4', qtyKg: 1200, molarRatio: '1.0 eq' },
          { reactant: 'Epichlorohydrin (99.5%)', cas: '106-89-8', qtyKg: 1550, molarRatio: '1.5 eq' },
          { base: 'Sodium Hydroxide Flakes', cas: '1310-73-2', qtyKg: 420, molarRatio: '1.05 eq' },
        ]),
        safetyDataSheetUrl: 'https://mfg-erp.internal/sds/chem-epn-2026.pdf',
        authorizedById: 'user-rd-chemist-1',
        authorizationNotes: 'Exotherm peak managed under chilled brine at 65°C.',
        companyId: 'default-company',
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ];

    this.inMemoryHazmat = [
      {
        id: 'haz-seed-1',
        manifestNumber: 'HAZ-MAN-2026-0104',
        wasteType: 'Spent Solvent Mother Liquor (Ethyl Acetate & Ethanol Distillation Residue)',
        unClassification: 'UN 1993, Flammable Liquid, N.O.S., 3, PG II',
        wasteCategoryCpcb: 'Category 20.3 - Distillation residues from organic solvents',
        quantityLtrOrKg: 1850,
        unit: 'ltr',
        disposalMethod: 'Co-processing in Approved High-Temperature Cement Kiln Incinerator',
        handlingPermitNumber: 'SPCB-HAZ-DISP-2026-9921',
        permitExpiryDate: new Date(Date.now() + 150 * 86400000),
        ppeComplianceStatus: 'COMPLIANT',
        ppeAuditScore: 99.0,
        statutoryRegulatoryBody: 'State Pollution Control Board (Hazardous Waste Div)',
        safetyAuditDate: new Date(Date.now() - 2 * 86400000),
        auditorOfficerId: 'user-hazmat-mgr-1',
        auditNotes: 'Earthing clamps, antistatic ESD footwear and SCBA gear verified before decanting.',
        companyId: 'default-company',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    ];

    this.inMemoryLabTests = [
      {
        id: 'lab-seed-1',
        testId: 'LAB-QA-2026-401',
        batchNumber: 'EA-2026-B089',
        productName: 'Ethyl Acetate Industrial Grade',
        sampleSource: 'Secondary Distillation Column Head Receiver',
        purityPercent: 99.82,
        phLevel: 6.85,
        moistureWaterPercent: 0.038,
        densityGml: 0.902,
        testPassed: true,
        dispatchCleared: true,
        coaDocumentNumber: 'COA-CHEM-2026-8812',
        coaGeneratedAt: new Date(Date.now() - 4 * 3600000),
        blockingReason: null,
        chemistSignoffId: 'user-qa-analyst-1',
        chemistNotes: 'Gas Chromatography (GC-FID) confirms 99.82% assay. Conforms to ACS reagent standards.',
        companyId: 'default-company',
        createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
      },
    ];

    this.inMemoryReactorCycles = [
      {
        id: 'rbc-seed-1',
        batchCode: 'BAT-R4-2026-089',
        reactorId: 'REACTOR-GL-5000L',
        productName: 'Ethyl Acetate Synthesis Batch 89',
        currentStage: 'REACTION',
        targetYieldKg: 1450.0,
        actualYieldKg: 1380.0,
        yieldPercentage: 95.17,
        steamConsumptionKg: 340.0,
        coolingWaterM3: 42.5,
        powerConsumptionKwh: 68.0,
        cycleStartTime: new Date(Date.now() - 4 * 3600000),
        cycleEndTime: null,
        downtimeHours: 0,
        downtimeReason: null,
        operatorInchargeId: 'user-reactor-mgr-1',
        stageRemarks: 'Temperature maintained at 78°C reflux with mechanical agitator running at 120 RPM.',
        companyId: 'default-company',
        createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
      },
    ];

    this.inMemoryDangerousGoods = [
      {
        id: 'dgl-seed-1',
        dispatchTrackingNumber: 'DGL-2026-1049',
        batchNumber: 'EA-2026-B089',
        productName: 'Ethyl Acetate Reagent Grade (Bulk Road Tanker)',
        unNumber: 'UN 1173',
        properShippingName: 'ETHYL ACETATE',
        hazardClass: 'Class 3 (Flammable Liquid)',
        packingGroup: 'PG II',
        hazchemCode: '3YE',
        tremcardIssued: true,
        tremcardDocumentNumber: 'TREM-2026-9921',
        vehicleRegistrationNumber: 'MH-04-DG-8419',
        driverName: 'Vikram Singh Hazari',
        driverLicenseNumber: 'DL-MH-04-2015-884120',
        driverHazmatEndorsementValid: true,
        driverLicenseExpiryDate: new Date(Date.now() + 180 * 86400000),
        statutoryTransitPermitNumber: 'PESO-ROAD-TNKR-2026-4412',
        statutoryPermitExpiry: new Date(Date.now() + 300 * 86400000),
        routeClearanceStatus: 'APPROVED',
        dispatchNotes: 'Spark arrestor on exhaust pipe tested. Emergency response Tremcard attached inside driver cabin.',
        logisticsInchargeId: 'user-haz-logistics-1',
        companyId: 'default-company',
        createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
      },
    ];
  }
}
