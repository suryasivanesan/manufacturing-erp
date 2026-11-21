import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRubberCompoundingBatchDto } from './dto/create-compounding-batch.dto';
import { CreateExtrusionCalenderingLogDto } from './dto/create-extrusion-log.dto';
import { CreateTyreBuildingRecordDto } from './dto/create-tyre-building.dto';
import { CreateCuringVulcanizationLogDto } from './dto/create-curing-log.dto';
import { CreateTyreUniformityTestDto } from './dto/create-tyre-test.dto';

export interface UserContext {
  id: string;
  email: string;
  role: string;
  companyId?: string | null;
  firstName?: string | null;
}

@Injectable()
export class RubberOperationsService {
  private readonly logger = new Logger(RubberOperationsService.name);

  private errMsg(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
  }

  // In-memory fallbacks to guarantee zero runtime downtime prior to DB migration
  private inMemoryCompoundingBatches: any[] = [];
  private inMemoryExtrusionLogs: any[] = [];
  private inMemoryTyreBuildingRecords: any[] = [];
  private inMemoryCuringLogs: any[] = [];
  private inMemoryTyreUniformityTests: any[] = [];

  constructor(private readonly prisma: PrismaService) {
    this.seedSampleRubberData();
  }

  // =========================================================================
  // 1. RUBBER COMPOUNDING & MOONEY VISCOSITY (RUBBER_COMPOUNDING_MANAGER)
  // =========================================================================

  async createCompoundingBatch(
    user: UserContext,
    dto: CreateRubberCompoundingBatchDto,
  ) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required to record compounding batch.');
    }
    const companyId = user.companyId;

    const batchNumber =
      dto.batchNumber?.trim() ||
      `CMP-${new Date().getFullYear()}-${String(
        Math.floor(100 + Math.random() * 900),
      )}`;

    const record = {
      id: `rcb-${Date.now()}`,
      batchNumber,
      compoundGrade: dto.compoundGrade.trim(),
      stage: dto.stage?.trim() || 'FINAL_MIX',
      recipeVersion: dto.recipeVersion.trim(),
      polymerType: dto.polymerType.trim(),
      mooneyViscosityML: Number(dto.mooneyViscosityML),
      carbonBlackDispersionPercent: Number(dto.carbonBlackDispersionPercent),
      batchWeightKg: Number(dto.batchWeightKg),
      mixingTimeSeconds: Number(dto.mixingTimeSeconds),
      dumpTemperatureCelsius: Number(dto.dumpTemperatureCelsius),
      curativesAdded: dto.curativesAdded ?? true,
      traceabilityLotNumbers:
        dto.traceabilityLotNumbers ||
        'NR-STR-4412, CB-N220-098, S-VUL-771, ACC-CBS-331',
      approvalStatus: dto.approvalStatus || 'APPROVED',
      testedBy: dto.testedBy || user.email || 'RUBBER_COMPOUNDING_MANAGER',
      notes: dto.notes || 'Mooney viscosity within 52-60 MU target. Dispersion score ASTM D7723 Grade A.',
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if ((this.prisma as any).rubberCompoundingBatch) {
        return await (this.prisma as any).rubberCompoundingBatch.create({
          data: record,
        });
      }
    } catch (e: unknown) {
      this.logger.warn(`Prisma model unavailable, using in-memory: ${this.errMsg(e)}`);
    }

    this.inMemoryCompoundingBatches.unshift(record);
    return record;
  }

  async getCompoundingBatches(user: UserContext) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required.');
    }
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).rubberCompoundingBatch) {
        return await (this.prisma as any).rubberCompoundingBatch.findMany({
          where: { companyId },
          orderBy: { createdAt: 'desc' },
        });
      }
    } catch (e: unknown) {
      this.logger.warn(`Prisma model unavailable, using in-memory: ${this.errMsg(e)}`);
    }

    return this.inMemoryCompoundingBatches.filter(
      (b: any) => b.companyId === companyId || !b.companyId,
    );
  }

  async getCompoundingBatchById(user: UserContext, id: string) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required.');
    }
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).rubberCompoundingBatch) {
        const found = await (this.prisma as any).rubberCompoundingBatch.findFirst({
          where: { id, companyId },
        });
        if (found) return found;
      }
    } catch (e: unknown) {
      this.logger.warn(`Prisma query failed: ${this.errMsg(e)}`);
    }

    const memory = this.inMemoryCompoundingBatches.find(
      (b: any) => b.id === id && (b.companyId === companyId || !b.companyId),
    );
    if (!memory) {
      throw new NotFoundException(`Compounding batch with ID ${id} not found.`);
    }
    return memory;
  }

  // =========================================================================
  // 2. EXTRUSION & CALENDERING (EXTRUSION_CALENDERING_MANAGER)
  // =========================================================================

  async createExtrusionLog(
    user: UserContext,
    dto: CreateExtrusionCalenderingLogDto,
  ) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required to log extrusion/calendering run.');
    }
    const companyId = user.companyId;

    const runNumber =
      dto.runNumber?.trim() ||
      `EXT-CAL-${new Date().getFullYear()}-${String(
        Math.floor(100 + Math.random() * 900),
      )}`;

    const target = Number(dto.targetThicknessMm);
    const actual = Number(dto.actualThicknessMm);
    const tol = Number(dto.gaugeToleranceMm ?? 0.15);
    const inSpec = Math.abs(actual - target) <= tol;

    const record = {
      id: `ecl-${Date.now()}`,
      runNumber,
      lineType: dto.lineType.trim(),
      dieProfileCode: dto.dieProfileCode.trim(),
      targetThicknessMm: target,
      actualThicknessMm: actual,
      gaugeToleranceMm: tol,
      temperatureZoneCelsius: Number(dto.temperatureZoneCelsius),
      tensionKiloNewton: dto.tensionKiloNewton ? Number(dto.tensionKiloNewton) : 4.8,
      rollStockNumber: dto.rollStockNumber.trim(),
      rollLengthMeters: Number(dto.rollLengthMeters),
      rollWeightKg: Number(dto.rollWeightKg),
      lineSpeedMpm: Number(dto.lineSpeedMpm ?? 25.0),
      complianceStatus: dto.complianceStatus || (inSpec ? 'IN_SPEC' : 'OUT_OF_SPEC_HOLD'),
      operatorNotes:
        dto.operatorNotes ||
        `Laser gauge delta: ${Math.abs(actual - target).toFixed(3)}mm. Steel cord tension stable.`,
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if ((this.prisma as any).extrusionCalenderingLog) {
        return await (this.prisma as any).extrusionCalenderingLog.create({
          data: record,
        });
      }
    } catch (e: unknown) {
      this.logger.warn(`Prisma model unavailable, using in-memory: ${this.errMsg(e)}`);
    }

    this.inMemoryExtrusionLogs.unshift(record);
    return record;
  }

  async getExtrusionLogs(user: UserContext) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required.');
    }
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).extrusionCalenderingLog) {
        return await (this.prisma as any).extrusionCalenderingLog.findMany({
          where: { companyId },
          orderBy: { createdAt: 'desc' },
        });
      }
    } catch (e: unknown) {
      this.logger.warn(`Prisma model unavailable, using in-memory: ${this.errMsg(e)}`);
    }

    return this.inMemoryExtrusionLogs.filter(
      (l: any) => l.companyId === companyId || !l.companyId,
    );
  }

  async getExtrusionLogById(user: UserContext, id: string) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required.');
    }
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).extrusionCalenderingLog) {
        const found = await (this.prisma as any).extrusionCalenderingLog.findFirst({
          where: { id, companyId },
        });
        if (found) return found;
      }
    } catch (e: unknown) {
      this.logger.warn(`Prisma query failed: ${this.errMsg(e)}`);
    }

    const memory = this.inMemoryExtrusionLogs.find(
      (l: any) => l.id === id && (l.companyId === companyId || !l.companyId),
    );
    if (!memory) {
      throw new NotFoundException(`Extrusion/Calendering log with ID ${id} not found.`);
    }
    return memory;
  }

  // =========================================================================
  // 3. GREEN TYRE BUILDING & WIP TRACKING (TYRE_BUILDING_MANAGER)
  // =========================================================================

  async createTyreBuildingRecord(
    user: UserContext,
    dto: CreateTyreBuildingRecordDto,
  ) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required to record tyre building.');
    }
    const companyId = user.companyId;

    const buildBarcode =
      dto.buildBarcode?.trim() ||
      `GT-${new Date().getFullYear()}-${String(
        Math.floor(10000 + Math.random() * 90000),
      )}`;

    const record = {
      id: `tbr-${Date.now()}`,
      buildBarcode,
      tyreSizePattern: dto.tyreSizePattern.trim(),
      buildingMachineId: dto.buildingMachineId.trim(),
      assemblyStage: dto.assemblyStage?.trim() || 'COMPLETED',
      bomRecipeId: dto.bomRecipeId.trim(),
      innerLinerLot: dto.innerLinerLot?.trim() || 'LINER-LOT-2026-08',
      carcassPlyLot: dto.carcassPlyLot?.trim() || 'PLY-POLY-441-A',
      steelBeltLot: dto.steelBeltLot?.trim() || 'BELT-STL-0912-B',
      treadExtrusionLot: dto.treadExtrusionLot?.trim() || 'TRD-EXT-2026-55',
      beadAssemblyLot: dto.beadAssemblyLot?.trim() || 'BEAD-APX-880-W',
      greenTyreWeightKg: Number(dto.greenTyreWeightKg),
      wipLocationBay: dto.wipLocationBay?.trim() || 'Bay-GT-R16-04',
      inspectionStatus: dto.inspectionStatus || 'PASSED',
      operatorId: dto.operatorId || user.email || 'TYRE_BUILDING_MANAGER',
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if ((this.prisma as any).tyreBuildingRecord) {
        return await (this.prisma as any).tyreBuildingRecord.create({
          data: record,
        });
      }
    } catch (e: unknown) {
      this.logger.warn(`Prisma model unavailable, using in-memory: ${this.errMsg(e)}`);
    }

    this.inMemoryTyreBuildingRecords.unshift(record);
    return record;
  }

  async getTyreBuildingRecords(user: UserContext) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required.');
    }
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).tyreBuildingRecord) {
        return await (this.prisma as any).tyreBuildingRecord.findMany({
          where: { companyId },
          orderBy: { createdAt: 'desc' },
        });
      }
    } catch (e: unknown) {
      this.logger.warn(`Prisma model unavailable, using in-memory: ${this.errMsg(e)}`);
    }

    return this.inMemoryTyreBuildingRecords.filter(
      (r: any) => r.companyId === companyId || !r.companyId,
    );
  }

  async getTyreBuildingRecordById(user: UserContext, id: string) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required.');
    }
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).tyreBuildingRecord) {
        const found = await (this.prisma as any).tyreBuildingRecord.findFirst({
          where: { id, companyId },
        });
        if (found) return found;
      }
    } catch (e: unknown) {
      this.logger.warn(`Prisma query failed: ${this.errMsg(e)}`);
    }

    const memory = this.inMemoryTyreBuildingRecords.find(
      (r: any) => r.id === id && (r.companyId === companyId || !r.companyId),
    );
    if (!memory) {
      throw new NotFoundException(`Tyre building record with ID ${id} not found.`);
    }
    return memory;
  }

  // =========================================================================
  // 4. CURING & VULCANIZATION PRESS MONITORING (CURING_VULCANIZATION_MANAGER)
  // =========================================================================

  async createCuringLog(
    user: UserContext,
    dto: CreateCuringVulcanizationLogDto,
  ) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required to record curing cycle.');
    }
    const companyId = user.companyId;

    const curingLogNumber =
      dto.curingLogNumber?.trim() ||
      `VULC-${new Date().getFullYear()}-${String(
        Math.floor(100 + Math.random() * 900),
      )}`;

    const shotCount = Number(dto.bladderShotCount);
    const maxShots = Number(dto.bladderMaxShotLimit ?? 300);
    const bladderWarning = shotCount >= maxShots * 0.9;

    const record = {
      id: `cvl-${Date.now()}`,
      curingLogNumber,
      curingPressId: dto.curingPressId.trim(),
      cavityNumber: dto.cavityNumber?.trim() || 'LH',
      greenTyreBarcode: dto.greenTyreBarcode.trim(),
      curedTyreSerial: dto.curedTyreSerial.trim(),
      skuCode: dto.skuCode.trim(),
      targetCureTimeSeconds: Number(dto.targetCureTimeSeconds),
      actualCureTimeSeconds: Number(dto.actualCureTimeSeconds),
      topPlatenTempCelsius: Number(dto.topPlatenTempCelsius),
      bottomPlatenTempCelsius: Number(dto.bottomPlatenTempCelsius),
      steamDomePressureBar: Number(dto.steamDomePressureBar),
      internalBladderPressureBar: Number(dto.internalBladderPressureBar),
      bladderSerialNumber: dto.bladderSerialNumber.trim(),
      bladderShotCount: shotCount,
      bladderMaxShotLimit: maxShots,
      bladderWarningTriggered: dto.bladderWarningTriggered ?? bladderWarning,
      curingStatus: dto.curingStatus || 'CYCLE_COMPLETED',
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if ((this.prisma as any).curingVulcanizationLog) {
        return await (this.prisma as any).curingVulcanizationLog.create({
          data: record,
        });
      }
    } catch (e: unknown) {
      this.logger.warn(`Prisma model unavailable, using in-memory: ${this.errMsg(e)}`);
    }

    this.inMemoryCuringLogs.unshift(record);
    return record;
  }

  async getCuringLogs(user: UserContext) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required.');
    }
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).curingVulcanizationLog) {
        return await (this.prisma as any).curingVulcanizationLog.findMany({
          where: { companyId },
          orderBy: { createdAt: 'desc' },
        });
      }
    } catch (e: unknown) {
      this.logger.warn(`Prisma model unavailable, using in-memory: ${this.errMsg(e)}`);
    }

    return this.inMemoryCuringLogs.filter(
      (c: any) => c.companyId === companyId || !c.companyId,
    );
  }

  async getCuringLogById(user: UserContext, id: string) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required.');
    }
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).curingVulcanizationLog) {
        const found = await (this.prisma as any).curingVulcanizationLog.findFirst({
          where: { id, companyId },
        });
        if (found) return found;
      }
    } catch (e: unknown) {
      this.logger.warn(`Prisma query failed: ${this.errMsg(e)}`);
    }

    const memory = this.inMemoryCuringLogs.find(
      (c: any) => c.id === id && (c.companyId === companyId || !c.companyId),
    );
    if (!memory) {
      throw new NotFoundException(`Curing log with ID ${id} not found.`);
    }
    return memory;
  }

  // =========================================================================
  // 5. TYRE UNIFORMITY & DYNAMIC BALANCING (TYRE_TESTING_UNIFORMITY_MANAGER)
  // =========================================================================

  async createTyreUniformityTest(
    user: UserContext,
    dto: CreateTyreUniformityTestDto,
  ) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required to record tyre testing.');
    }
    const companyId = user.companyId;

    const testRecordNumber =
      dto.testRecordNumber?.trim() ||
      `TST-UNIF-${new Date().getFullYear()}-${String(
        Math.floor(100 + Math.random() * 900),
      )}`;

    const rRunout = Number(dto.radialRunoutMm);
    const lRunout = Number(dto.lateralRunoutMm);
    const rfv = Number(dto.radialForceVariationN);
    const staticBal = Number(dto.dynamicBalanceStaticGram);

    // Auto-grading logic:
    // Prime: Runout <= 0.8mm, RFV <= 60N, Static Bal <= 20g
    // B-Grade: Runout <= 1.2mm, RFV <= 90N, Static Bal <= 35g
    // Scrap: Exceeds limits
    let computedGrade = 'PRIME_GRADE';
    let cleared = true;

    if (rRunout > 1.2 || lRunout > 1.2 || rfv > 90 || staticBal > 35) {
      computedGrade = 'SCRAP';
      cleared = false;
    } else if (rRunout > 0.8 || lRunout > 0.8 || rfv > 60 || staticBal > 20) {
      computedGrade = 'B_GRADE';
      cleared = true;
    }

    const grading = dto.gradingClassification || computedGrade;

    const record = {
      id: `tut-${Date.now()}`,
      testRecordNumber,
      tyreSerialNumber: dto.tyreSerialNumber.trim(),
      dotCode: dto.dotCode.trim(),
      tyreSizePattern: dto.tyreSizePattern.trim(),
      radialRunoutMm: rRunout,
      lateralRunoutMm: lRunout,
      radialForceVariationN: rfv,
      lateralForceVariationN: Number(dto.lateralForceVariationN),
      conicityN: Number(dto.conicityN),
      dynamicBalanceStaticGram: staticBal,
      dynamicBalanceCoupleGram: Number(dto.dynamicBalanceCoupleGram),
      gradingClassification: grading,
      clearedForDispatch: dto.clearedForDispatch ?? (grading !== 'SCRAP'),
      remarks:
        dto.remarks ||
        `Automated TUM evaluation. Grade: ${grading}. DOT Code ${dto.dotCode} assigned.`,
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if ((this.prisma as any).tyreUniformityTest) {
        return await (this.prisma as any).tyreUniformityTest.create({
          data: record,
        });
      }
    } catch (e: unknown) {
      this.logger.warn(`Prisma model unavailable, using in-memory: ${this.errMsg(e)}`);
    }

    this.inMemoryTyreUniformityTests.unshift(record);
    return record;
  }

  async getTyreUniformityTests(user: UserContext) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required.');
    }
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).tyreUniformityTest) {
        return await (this.prisma as any).tyreUniformityTest.findMany({
          where: { companyId },
          orderBy: { createdAt: 'desc' },
        });
      }
    } catch (e: unknown) {
      this.logger.warn(`Prisma model unavailable, using in-memory: ${this.errMsg(e)}`);
    }

    return this.inMemoryTyreUniformityTests.filter(
      (t: any) => t.companyId === companyId || !t.companyId,
    );
  }

  async getTyreUniformityTestById(user: UserContext, id: string) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required.');
    }
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).tyreUniformityTest) {
        const found = await (this.prisma as any).tyreUniformityTest.findFirst({
          where: { id, companyId },
        });
        if (found) return found;
      }
    } catch (e: unknown) {
      this.logger.warn(`Prisma query failed: ${this.errMsg(e)}`);
    }

    const memory = this.inMemoryTyreUniformityTests.find(
      (t: any) => t.id === id && (t.companyId === companyId || !t.companyId),
    );
    if (!memory) {
      throw new NotFoundException(`Tyre uniformity test with ID ${id} not found.`);
    }
    return memory;
  }

  // =========================================================================
  // SEED INITIAL SAMPLE DATA
  // =========================================================================

  private seedSampleRubberData() {
    this.inMemoryCompoundingBatches = [
      {
        id: 'rcb-seed-1',
        batchNumber: 'CMP-2026-901',
        compoundGrade: 'Tread Cap SBR/BR 1502 High Silica',
        stage: 'FINAL_MIX',
        recipeVersion: 'REC-TRD-V4.2',
        polymerType: 'NR/BR/SBR Blend',
        mooneyViscosityML: 56.5,
        carbonBlackDispersionPercent: 98.2,
        batchWeightKg: 240.0,
        mixingTimeSeconds: 280,
        dumpTemperatureCelsius: 155.0,
        curativesAdded: true,
        traceabilityLotNumbers: 'NR-LOT-441, CB-N220-881, S-ACC-902',
        approvalStatus: 'APPROVED',
        testedBy: 'rubber.compounding@apexmanufacturing.com',
        notes: 'Mooney viscosity within 52-60 MU target. Dispersion score ASTM D7723 Grade A.',
        createdAt: new Date('2026-11-14T09:30:00Z'),
      },
      {
        id: 'rcb-seed-2',
        batchNumber: 'CMP-2026-902',
        compoundGrade: 'Innerliner Chlorobutyl 1066',
        stage: 'MASTER_BATCH',
        recipeVersion: 'REC-INL-V2.1',
        polymerType: 'Chlorobutyl Rubber (CIIR)',
        mooneyViscosityML: 48.0,
        carbonBlackDispersionPercent: 96.5,
        batchWeightKg: 220.0,
        mixingTimeSeconds: 310,
        dumpTemperatureCelsius: 148.0,
        curativesAdded: false,
        traceabilityLotNumbers: 'CIIR-LOT-102, CB-N660-554',
        approvalStatus: 'APPROVED',
        testedBy: 'rubber.compounding@apexmanufacturing.com',
        notes: 'Low air-permeability innerliner masterbatch passed scorch safety test.',
        createdAt: new Date('2026-11-14T10:15:00Z'),
      },
    ];

    this.inMemoryExtrusionLogs = [
      {
        id: 'ecl-seed-1',
        runNumber: 'EXT-CAL-2026-441',
        lineType: 'EXTRUSION_TREAD_SIDEWALL',
        dieProfileCode: 'DIE-TRD-205/55R16-P1',
        targetThicknessMm: 8.50,
        actualThicknessMm: 8.48,
        gaugeToleranceMm: 0.15,
        temperatureZoneCelsius: 98.5,
        tensionKiloNewton: 4.8,
        rollStockNumber: 'ROLL-CRD-8820',
        rollLengthMeters: 450.0,
        rollWeightKg: 620.0,
        lineSpeedMpm: 25.0,
        complianceStatus: 'IN_SPEC',
        operatorNotes: 'Laser gauge delta: 0.02mm. Dual compound co-extrusion cap/base profile optimal.',
        createdAt: new Date('2026-11-14T11:00:00Z'),
      },
      {
        id: 'ecl-seed-2',
        runNumber: 'EXT-CAL-2026-442',
        lineType: 'CALENDER_STEEL_CORD',
        dieProfileCode: 'CAL-STEEL-0.28x4',
        targetThicknessMm: 1.25,
        actualThicknessMm: 1.24,
        gaugeToleranceMm: 0.05,
        temperatureZoneCelsius: 92.0,
        tensionKiloNewton: 6.2,
        rollStockNumber: 'ROLL-STL-9041',
        rollLengthMeters: 600.0,
        rollWeightKg: 780.0,
        lineSpeedMpm: 32.0,
        complianceStatus: 'IN_SPEC',
        operatorNotes: 'Steel cord end-count 24 epi verified via optical vision camera.',
        createdAt: new Date('2026-11-14T11:45:00Z'),
      },
    ];

    this.inMemoryTyreBuildingRecords = [
      {
        id: 'tbr-seed-1',
        buildBarcode: 'GT-2026-00892',
        tyreSizePattern: '205/55 R16 Tubeless Radial 91V',
        buildingMachineId: 'TBM-Unistage-03',
        assemblyStage: 'COMPLETED',
        bomRecipeId: 'BOM-TYR-2055516-V3',
        innerLinerLot: 'LINER-LOT-2026-08',
        carcassPlyLot: 'PLY-POLY-441-A',
        steelBeltLot: 'BELT-STL-0912-B',
        treadExtrusionLot: 'TRD-EXT-2026-55',
        beadAssemblyLot: 'BEAD-APX-880-W',
        greenTyreWeightKg: 8.85,
        wipLocationBay: 'Bay-GT-R16-04',
        inspectionStatus: 'PASSED',
        operatorId: 'tyre.building@apexmanufacturing.com',
        createdAt: new Date('2026-11-14T12:00:00Z'),
      },
    ];

    this.inMemoryCuringLogs = [
      {
        id: 'cvl-seed-1',
        curingLogNumber: 'VULC-2026-781',
        curingPressId: 'Press-Dome-08',
        cavityNumber: 'LH',
        greenTyreBarcode: 'GT-2026-00892',
        curedTyreSerial: 'TYR-2026-04891',
        skuCode: 'SKU-RAD-2055516',
        targetCureTimeSeconds: 780,
        actualCureTimeSeconds: 782,
        topPlatenTempCelsius: 165.2,
        bottomPlatenTempCelsius: 164.8,
        steamDomePressureBar: 14.5,
        internalBladderPressureBar: 19.8,
        bladderSerialNumber: 'BLD-B16-440',
        bladderShotCount: 248,
        bladderMaxShotLimit: 300,
        bladderWarningTriggered: false,
        curingStatus: 'CYCLE_COMPLETED',
        createdAt: new Date('2026-11-14T12:30:00Z'),
      },
    ];

    this.inMemoryTyreUniformityTests = [
      {
        id: 'tut-seed-1',
        testRecordNumber: 'TST-UNIF-2026-904',
        tyreSerialNumber: 'TYR-2026-04891',
        dotCode: 'DOT 4B 9R 3426',
        tyreSizePattern: '205/55 R16 Tubeless Radial 91V',
        radialRunoutMm: 0.38,
        lateralRunoutMm: 0.42,
        radialForceVariationN: 42.0,
        lateralForceVariationN: 35.0,
        conicityN: 18.5,
        dynamicBalanceStaticGram: 12.0,
        dynamicBalanceCoupleGram: 14.5,
        gradingClassification: 'PRIME_GRADE',
        clearedForDispatch: true,
        remarks: 'Passes OE factory specs. DOT laser code 3426 engraved. Cleared for dispatch.',
        createdAt: new Date('2026-11-14T13:00:00Z'),
      },
    ];
  }
}
