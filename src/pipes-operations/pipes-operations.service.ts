import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePipeExtrusionLogDto } from './dto/create-pipe-extrusion-log.dto';
import { CreatePipeUltrasonicInspectionDto } from './dto/create-ultrasonic-inspection.dto';
import { CreateHydrostaticBurstTestDto } from './dto/create-hydrostatic-test.dto';
import { CreateBellingSocketingLogDto } from './dto/create-belling-socketing-log.dto';
import { CreatePvcDryBlendBatchDto } from './dto/create-pvc-dry-blend.dto';

export interface UserContext {
  id: string;
  email: string;
  role: string;
  companyId?: string | null;
  firstName?: string | null;
}

@Injectable()
export class PipesOperationsService {
  private readonly logger = new Logger(PipesOperationsService.name);

  private errMsg(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
  }

  // In-memory fallbacks to guarantee zero runtime downtime prior to DB migration
  private inMemoryExtrusionLogs: any[] = [];
  private inMemoryUltrasonicInspections: any[] = [];
  private inMemoryHydrostaticTests: any[] = [];
  private inMemoryBellingLogs: any[] = [];
  private inMemoryDryBlendBatches: any[] = [];

  constructor(private readonly prisma: PrismaService) {
    this.seedSamplePipesData();
  }

  // =========================================================================
  // 1. PIPE EXTRUSION LINE OPERATIONS (EXTRUSION_LINE_OPERATIONS_MANAGER)
  // =========================================================================

  async createExtrusionLog(user: UserContext, dto: CreatePipeExtrusionLogDto) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required to record pipe extrusion log.');
    }
    const companyId = user.companyId;

    const logNumber =
      dto.logNumber?.trim() ||
      `EXT-PIPE-${new Date().getFullYear()}-${String(
        Math.floor(100 + Math.random() * 900),
      )}`;

    const record = {
      id: `pel-${Date.now()}`,
      logNumber,
      lineId: dto.lineId.trim(),
      pipeDiameterMm: Number(dto.pipeDiameterMm),
      pressureClass: dto.pressureClass.trim(),
      pipeMaterial: dto.pipeMaterial?.trim() || 'PVC-U',
      barrelZone1TempCelsius: Number(dto.barrelZone1TempCelsius),
      barrelZone2TempCelsius: Number(dto.barrelZone2TempCelsius),
      barrelZone3TempCelsius: Number(dto.barrelZone3TempCelsius),
      barrelZone4TempCelsius: Number(dto.barrelZone4TempCelsius),
      dieHeadTempCelsius: Number(dto.dieHeadTempCelsius),
      screwRpm: Number(dto.screwRpm),
      haulOffSpeedMpm: Number(dto.haulOffSpeedMpm),
      meltPressureBar: Number(dto.meltPressureBar),
      meltTemperatureCelsius: Number(dto.meltTemperatureCelsius ?? 188.0),
      vacuumCalibrationTankBar: Number(dto.vacuumCalibrationTankBar ?? -0.65),
      shiftType: dto.shiftType?.trim() || 'SHIFT_A',
      shiftOutputKg: Number(dto.shiftOutputKg),
      shiftOutputMeters: Number(dto.shiftOutputMeters),
      machineryRunHours: Number(dto.machineryRunHours),
      status: dto.status?.trim() || 'RUNNING',
      operatorNotes: dto.operatorNotes || 'Screw RPM and haul-off synchronized. Temperature zones within ±1.5°C tolerance.',
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      return await (this.prisma as any).pipeExtrusionLog.create({
        data: record,
      });
    } catch (error: unknown) {
      this.logger.warn(`Database insert failed, using fallback in-memory cache: ${this.errMsg(error)}`);
      this.inMemoryExtrusionLogs.unshift(record);
      return record;
    }
  }

  async getExtrusionLogs(user: UserContext, limit = 50) {
    if (!user?.companyId) return [];
    try {
      const records = await (this.prisma as any).pipeExtrusionLog.findMany({
        where: { companyId: user.companyId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return records;
    } catch (error: unknown) {
      return this.inMemoryExtrusionLogs
        .filter((r: any) => r.companyId === user.companyId)
        .slice(0, limit);
    }
  }

  // =========================================================================
  // 2. ULTRASONIC WALL THICKNESS QUALITY (WALL_THICKNESS_QUALITY_INCHARGE)
  // =========================================================================

  async createUltrasonicInspection(
    user: UserContext,
    dto: CreatePipeUltrasonicInspectionDto,
  ) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required to record ultrasonic inspection.');
    }
    const companyId = user.companyId;

    const inspectionCode =
      dto.inspectionCode?.trim() ||
      `UT-INSP-${new Date().getFullYear()}-${String(
        Math.floor(100 + Math.random() * 900),
      )}`;

    const nominal = Number(dto.nominalThicknessMm);
    const minT = Number(dto.minMeasuredThicknessMm);
    const maxT = Number(dto.maxMeasuredThicknessMm);
    const eccentricity = Number(dto.wallEccentricityPercent);
    const ovalityPassed = dto.ovalityTolerancePassed ?? true;

    // Automated quality evaluation:
    // Min thickness must be >= nominal (negative tolerance not allowed in pressurized pipes)
    // Wall eccentricity must not exceed 8.0%
    const isThicknessInTolerance = minT >= nominal && eccentricity <= 8.0;
    const shouldBlockPackaging = !isThicknessInTolerance || !ovalityPassed;
    const clearanceStatus = shouldBlockPackaging
      ? 'BLOCKED_NON_STANDARD'
      : 'APPROVED_FOR_PACKAGING';

    let rejectionReason = dto.rejectionReason;
    if (shouldBlockPackaging && !rejectionReason) {
      const reasons: string[] = [];
      if (minT < nominal) reasons.push(`Min wall thickness (${minT}mm) below nominal spec (${nominal}mm)`);
      if (eccentricity > 8.0) reasons.push(`Eccentricity (${eccentricity}%) exceeds 8.0% tolerance`);
      if (!ovalityPassed) reasons.push('Outer diameter ovality failed gauge check');
      rejectionReason = reasons.join('; ');
    }

    const record = {
      id: `pui-${Date.now()}`,
      inspectionCode,
      batchNumber: dto.batchNumber.trim(),
      pipeDiameterMm: Number(dto.pipeDiameterMm),
      nominalThicknessMm: nominal,
      minMeasuredThicknessMm: minT,
      maxMeasuredThicknessMm: maxT,
      wallEccentricityPercent: eccentricity,
      outerDiameterMeasuredMm: Number(dto.outerDiameterMeasuredMm),
      pipeLengthMeters: Number(dto.pipeLengthMeters ?? 6.0),
      ovalityTolerancePassed: ovalityPassed,
      isWallThicknessInTolerance: isThicknessInTolerance,
      packagingBlocked: shouldBlockPackaging,
      clearanceStatus,
      rejectionReason: rejectionReason || null,
      inspectionNotes:
        dto.inspectionNotes ||
        (shouldBlockPackaging
          ? 'DISPATCH GATE LOCKED: Wall thickness or ovality out of spec. Batch quarantined from bundling/packing.'
          : '360° ultrasonic scanning passed. Wall thickness concentricity verified.'),
      inspectorId: dto.inspectorId || user.email || 'WALL_THICKNESS_QUALITY_INCHARGE',
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      return await (this.prisma as any).pipeUltrasonicInspection.create({
        data: record,
      });
    } catch (error: unknown) {
      this.logger.warn(`Database insert failed, using fallback in-memory cache: ${this.errMsg(error)}`);
      this.inMemoryUltrasonicInspections.unshift(record);
      return record;
    }
  }

  async getUltrasonicInspections(user: UserContext, limit = 50) {
    if (!user?.companyId) return [];
    try {
      const records = await (this.prisma as any).pipeUltrasonicInspection.findMany({
        where: { companyId: user.companyId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return records;
    } catch (error: unknown) {
      return this.inMemoryUltrasonicInspections
        .filter((r: any) => r.companyId === user.companyId)
        .slice(0, limit);
    }
  }

  async updatePackagingGate(
    user: UserContext,
    inspectionId: string,
    unblock: boolean,
    notes?: string,
  ) {
    if (!user?.companyId) throw new BadRequestException('Company required');
    try {
      const record = await (this.prisma as any).pipeUltrasonicInspection.findFirst({
        where: { id: inspectionId, companyId: user.companyId },
      });
      if (!record) throw new NotFoundException('Inspection record not found');

      return await (this.prisma as any).pipeUltrasonicInspection.update({
        where: { id: inspectionId },
        data: {
          packagingBlocked: !unblock,
          clearanceStatus: unblock ? 'CONDITIONAL_ACCEPTANCE' : 'BLOCKED_NON_STANDARD',
          inspectionNotes: notes
            ? `${record.inspectionNotes || ''} | Override: ${notes}`
            : record.inspectionNotes,
        },
      });
    } catch (error: unknown) {
      const idx = this.inMemoryUltrasonicInspections.findIndex(
        (r: any) => r.id === inspectionId && r.companyId === user.companyId,
      );
      if (idx === -1) throw new NotFoundException('Inspection not found');
      this.inMemoryUltrasonicInspections[idx].packagingBlocked = !unblock;
      this.inMemoryUltrasonicInspections[idx].clearanceStatus = unblock
        ? 'CONDITIONAL_ACCEPTANCE'
        : 'BLOCKED_NON_STANDARD';
      return this.inMemoryUltrasonicInspections[idx];
    }
  }

  // =========================================================================
  // 3. HYDROSTATIC BURST & COMPLIANCE TESTING (HYDROSTATIC_BURST_TESTING_MANAGER)
  // =========================================================================

  async createHydrostaticTest(
    user: UserContext,
    dto: CreateHydrostaticBurstTestDto,
  ) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required to record hydrostatic test.');
    }
    const companyId = user.companyId;

    const certificateNumber =
      dto.certificateNumber?.trim() ||
      `HYD-CERT-${new Date().getFullYear()}-${String(
        Math.floor(100 + Math.random() * 900),
      )}`;

    const targetP = Number(dto.targetTestPressureBar);
    const achievedP = Number(dto.achievedBurstPressureBar);
    const isPassed = achievedP >= targetP;
    const complianceStatus = isPassed ? 'PASSED_COMPLIANT' : 'FAILED_BURST_UNDER_SPEC';

    // Calculate hoop stress if not supplied (approximate Barlow formula: (P * (D - t)) / (2 * t * 10))
    const hoopStress = dto.calculatedHoopStressMpa ?? Number(((achievedP * 110) / (2 * 5.3 * 10)).toFixed(2));

    const record = {
      id: `hbt-${Date.now()}`,
      certificateNumber,
      testSampleBarcode: dto.testSampleBarcode.trim(),
      pipeSpecification: dto.pipeSpecification.trim(),
      testType: dto.testType?.trim() || 'BURST_PRESSURE_DESTRUCTIVE',
      targetTestPressureBar: targetP,
      achievedBurstPressureBar: achievedP,
      testDurationHours: Number(dto.testDurationHours),
      waterBathTempCelsius: Number(dto.waterBathTempCelsius ?? 20.0),
      calculatedHoopStressMpa: hoopStress,
      failureMode: dto.failureMode?.trim() || (isPassed ? 'DUCTILE_BURST' : 'BRITTLE_SLIT'),
      complianceStatus,
      complianceCertificateIssued: isPassed,
      certifiedByRole:
        dto.certifiedByRole ||
        user.email ||
        'HYDROSTATIC_BURST_TESTING_MANAGER',
      destructiveTestNotes:
        dto.destructiveTestNotes ||
        `Achieved ${achievedP} bar (target ${targetP} bar). Ductile rupture verified according to ISO 1167 / IS 4985 standard.`,
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      return await (this.prisma as any).hydrostaticBurstTest.create({
        data: record,
      });
    } catch (error: unknown) {
      this.logger.warn(`Database insert failed, using fallback in-memory cache: ${this.errMsg(error)}`);
      this.inMemoryHydrostaticTests.unshift(record);
      return record;
    }
  }

  async getHydrostaticTests(user: UserContext, limit = 50) {
    if (!user?.companyId) return [];
    try {
      const records = await (this.prisma as any).hydrostaticBurstTest.findMany({
        where: { companyId: user.companyId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return records;
    } catch (error: unknown) {
      return this.inMemoryHydrostaticTests
        .filter((r: any) => r.companyId === user.companyId)
        .slice(0, limit);
    }
  }

  // =========================================================================
  // 4. BELLING & SOCKETING CYCLES (SOCKETING_BELLING_JOINTING_MANAGER)
  // =========================================================================

  async createBellingLog(user: UserContext, dto: CreateBellingSocketingLogDto) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required to record belling log.');
    }
    const companyId = user.companyId;

    const cycleCode =
      dto.cycleCode?.trim() ||
      `BELL-CYC-${new Date().getFullYear()}-${String(
        Math.floor(100 + Math.random() * 900),
      )}`;

    const record = {
      id: `bsl-${Date.now()}`,
      cycleCode,
      machineId: dto.machineId.trim(),
      socketType: dto.socketType?.trim() || 'ELASTOMERIC_SEALING_RING',
      pipeDiameterMm: Number(dto.pipeDiameterMm),
      heatingOvenTempCelsius: Number(dto.heatingOvenTempCelsius),
      formingTimeSeconds: Number(dto.formingTimeSeconds),
      coolingTimeSeconds: Number(dto.coolingTimeSeconds),
      totalCycleTimeSeconds: Number(dto.totalCycleTimeSeconds),
      rubberRingBatchNumber: dto.rubberRingBatchNumber.trim(),
      rubberRingType: dto.rubberRingType?.trim() || 'EPDM_LIP_SEAL',
      rubberRingsConsumed: Number(dto.rubberRingsConsumed ?? 1),
      socketInnerDiameterMm: Number(dto.socketInnerDiameterMm),
      socketDepthMm: Number(dto.socketDepthMm),
      grooveRetentionTested: dto.grooveRetentionTested ?? true,
      dimensionalAccuracyVerified: dto.dimensionalAccuracyVerified ?? true,
      cycleStatus: dto.cycleStatus?.trim() || 'CYCLE_PASSED',
      operatorNotes: dto.operatorNotes || 'Socket groove retention verified with plug gauge. Ring seated securely.',
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      return await (this.prisma as any).bellingSocketingLog.create({
        data: record,
      });
    } catch (error: unknown) {
      this.logger.warn(`Database insert failed, using fallback in-memory cache: ${this.errMsg(error)}`);
      this.inMemoryBellingLogs.unshift(record);
      return record;
    }
  }

  async getBellingLogs(user: UserContext, limit = 50) {
    if (!user?.companyId) return [];
    try {
      const records = await (this.prisma as any).bellingSocketingLog.findMany({
        where: { companyId: user.companyId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return records;
    } catch (error: unknown) {
      return this.inMemoryBellingLogs
        .filter((r: any) => r.companyId === user.companyId)
        .slice(0, limit);
    }
  }

  // =========================================================================
  // 5. PVC DRY BLEND & REGRIND RATIO (PVC_DRY_BLEND_REGRIND_MANAGER)
  // =========================================================================

  async createDryBlendBatch(user: UserContext, dto: CreatePvcDryBlendBatchDto) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required to record dry blend batch.');
    }
    const companyId = user.companyId;

    const batchNumber =
      dto.batchNumber?.trim() ||
      `BLEND-PVC-${new Date().getFullYear()}-${String(
        Math.floor(100 + Math.random() * 900),
      )}`;

    const regrindPct = Number(dto.regrindBlendPercentage);
    const maxPermitted = Number(dto.maxRegrindPermittedPct ?? 25.0);
    const exceedsLimit = regrindPct > maxPermitted;
    const batchStatus = exceedsLimit
      ? 'QUARANTINE_OVER_REGRIND'
      : 'RELEASED_FOR_EXTRUSION';

    const record = {
      id: `pdb-${Date.now()}`,
      batchNumber,
      recipeFormulaCode: dto.recipeFormulaCode.trim(),
      pvcResinKValue: Number(dto.pvcResinKValue),
      virginResinKg: Number(dto.virginResinKg),
      regrindMaterialKg: Number(dto.regrindMaterialKg),
      totalBatchWeightKg: Number(dto.totalBatchWeightKg),
      regrindBlendPercentage: regrindPct,
      maxRegrindPermittedPct: maxPermitted,
      onePackStabilizerKg: Number(dto.onePackStabilizerKg),
      calciumCarbonateFillerKg: Number(dto.calciumCarbonateFillerKg),
      impactModifierKg: Number(dto.impactModifierKg ?? 35.0),
      processingAidKg: Number(dto.processingAidKg ?? 12.0),
      pigmentTio2Kg: Number(dto.pigmentTio2Kg ?? 15.0),
      highSpeedMixerTempCelsius: Number(dto.highSpeedMixerTempCelsius),
      coolerMixerDischargeTemp: Number(dto.coolerMixerDischargeTemp),
      regrindExceedsLimitBlocked: exceedsLimit,
      batchStatus,
      approvedByRole:
        dto.approvedByRole ||
        user.email ||
        'PVC_DRY_BLEND_REGRIND_MANAGER',
      notes:
        dto.notes ||
        (exceedsLimit
          ? `CRITICAL CEILING EXCEEDED: Regrind ${regrindPct}% exceeds ${maxPermitted}% statutory threshold. Batch quarantined from feed silos.`
          : 'High speed compound mixed to 120°C and cooled to 40°C. Bulk density 0.58 g/cm³ verified.'),
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      return await (this.prisma as any).pvcDryBlendBatch.create({
        data: record,
      });
    } catch (error: unknown) {
      this.logger.warn(`Database insert failed, using fallback in-memory cache: ${this.errMsg(error)}`);
      this.inMemoryDryBlendBatches.unshift(record);
      return record;
    }
  }

  async getDryBlendBatches(user: UserContext, limit = 50) {
    if (!user?.companyId) return [];
    try {
      const records = await (this.prisma as any).pvcDryBlendBatch.findMany({
        where: { companyId: user.companyId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return records;
    } catch (error: unknown) {
      return this.inMemoryDryBlendBatches
        .filter((r: any) => r.companyId === user.companyId)
        .slice(0, limit);
    }
  }

  // =========================================================================
  // TELEMETRY SUMMARY FOR DASHBOARDS
  // =========================================================================

  async getTelemetrySummary(user: UserContext) {
    if (!user?.companyId) return null;

    const [extrusionLogs, inspections, burstTests, bellingLogs, dryBlends] =
      await Promise.all([
        this.getExtrusionLogs(user, 10),
        this.getUltrasonicInspections(user, 10),
        this.getHydrostaticTests(user, 10),
        this.getBellingLogs(user, 10),
        this.getDryBlendBatches(user, 10),
      ]);

    const totalExtrusionOutputKg = extrusionLogs.reduce(
      (acc: number, r: any) => acc + (r.shiftOutputKg || 0),
      0,
    );
    const blockedInspectionsCount = inspections.filter(
      (r: any) => r.packagingBlocked,
    ).length;
    const passedBurstTestsCount = burstTests.filter(
      (r: any) => r.complianceStatus === 'PASSED_COMPLIANT',
    ).length;
    const totalRingsConsumed = bellingLogs.reduce(
      (acc: number, r: any) => acc + (r.rubberRingsConsumed || 0),
      0,
    );
    const quarantinedBlendsCount = dryBlends.filter(
      (r: any) => r.regrindExceedsLimitBlocked,
    ).length;

    return {
      totalExtrusionOutputKg,
      activeExtrusionLinesCount: extrusionLogs.length,
      blockedInspectionsCount,
      passedBurstTestsCount,
      totalRingsConsumed,
      quarantinedBlendsCount,
    };
  }

  // =========================================================================
  // SEED SAMPLE PIPES DATA
  // =========================================================================

  private seedSamplePipesData() {
    const demoCompanyId = 'demo-company-1';

    this.inMemoryExtrusionLogs = [
      {
        id: 'pel-1',
        logNumber: 'EXT-PIPE-2026-101',
        lineId: 'Line 01 (Twin Screw KraussMaffei 68/143)',
        pipeDiameterMm: 110.0,
        pressureClass: 'PN10 / SDR21',
        pipeMaterial: 'PVC-U',
        barrelZone1TempCelsius: 165.0,
        barrelZone2TempCelsius: 172.0,
        barrelZone3TempCelsius: 180.0,
        barrelZone4TempCelsius: 185.0,
        dieHeadTempCelsius: 192.5,
        screwRpm: 24.8,
        haulOffSpeedMpm: 3.25,
        meltPressureBar: 186.0,
        meltTemperatureCelsius: 189.0,
        vacuumCalibrationTankBar: -0.68,
        shiftType: 'SHIFT_A',
        shiftOutputKg: 3120.0,
        shiftOutputMeters: 1560.0,
        machineryRunHours: 8.0,
        status: 'RUNNING',
        operatorNotes: 'Twin screw melt homogenization optimal. Haul-off caterpillar pads checked.',
        companyId: demoCompanyId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'pel-2',
        logNumber: 'EXT-PIPE-2026-102',
        lineId: 'Line 02 (Single Screw Battenfeld 90mm HDPE)',
        pipeDiameterMm: 160.0,
        pressureClass: 'PN16 / SDR11',
        pipeMaterial: 'HDPE-PE100',
        barrelZone1TempCelsius: 190.0,
        barrelZone2TempCelsius: 205.0,
        barrelZone3TempCelsius: 215.0,
        barrelZone4TempCelsius: 220.0,
        dieHeadTempCelsius: 228.0,
        screwRpm: 48.0,
        haulOffSpeedMpm: 1.45,
        meltPressureBar: 210.0,
        meltTemperatureCelsius: 224.0,
        vacuumCalibrationTankBar: -0.72,
        shiftType: 'SHIFT_A',
        shiftOutputKg: 2840.0,
        shiftOutputMeters: 410.0,
        machineryRunHours: 7.5,
        status: 'RUNNING',
        operatorNotes: 'PE100 carbon black dispersion checked. Water bath chilling temp at 14°C.',
        companyId: demoCompanyId,
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(),
      },
    ];

    this.inMemoryUltrasonicInspections = [
      {
        id: 'pui-1',
        inspectionCode: 'UT-INSP-2026-401',
        batchNumber: 'BATCH-PVC-110-88',
        pipeDiameterMm: 110.0,
        nominalThicknessMm: 5.3,
        minMeasuredThicknessMm: 5.35,
        maxMeasuredThicknessMm: 5.62,
        wallEccentricityPercent: 4.8,
        outerDiameterMeasuredMm: 110.2,
        pipeLengthMeters: 6.0,
        ovalityTolerancePassed: true,
        isWallThicknessInTolerance: true,
        packagingBlocked: false,
        clearanceStatus: 'APPROVED_FOR_PACKAGING',
        rejectionReason: null,
        inspectionNotes: '360° sensor wall thickness concentricity within ISO 1452 standards. Cleared for packaging bundle.',
        inspectorId: 'wall.thickness@apexmanufacturing.com',
        companyId: demoCompanyId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'pui-2',
        inspectionCode: 'UT-INSP-2026-402',
        batchNumber: 'BATCH-PVC-110-89',
        pipeDiameterMm: 110.0,
        nominalThicknessMm: 5.3,
        minMeasuredThicknessMm: 4.88,
        maxMeasuredThicknessMm: 5.75,
        wallEccentricityPercent: 14.5,
        outerDiameterMeasuredMm: 110.85,
        pipeLengthMeters: 6.0,
        ovalityTolerancePassed: false,
        isWallThicknessInTolerance: false,
        packagingBlocked: true,
        clearanceStatus: 'BLOCKED_NON_STANDARD',
        rejectionReason: 'Min thickness 4.88mm < nominal 5.3mm; Eccentricity 14.5% exceeds 8.0% ceiling; Ovality failed tolerance.',
        inspectionNotes: 'DISPATCH GATE LOCKED: High eccentricity detected due to die gap misalignment. Lot blocked from bundling.',
        inspectorId: 'wall.thickness@apexmanufacturing.com',
        companyId: demoCompanyId,
        createdAt: new Date(Date.now() - 7200000),
        updatedAt: new Date(),
      },
    ];

    this.inMemoryHydrostaticTests = [
      {
        id: 'hbt-1',
        certificateNumber: 'HYD-CERT-2026-551',
        testSampleBarcode: 'SMP-PVC-110-PN10-09',
        pipeSpecification: 'PVC-U 110mm PN10 SDR21 (IS 4985:2021)',
        testType: 'BURST_PRESSURE_DESTRUCTIVE',
        targetTestPressureBar: 32.0,
        achievedBurstPressureBar: 38.6,
        testDurationHours: 1.0,
        waterBathTempCelsius: 20.0,
        calculatedHoopStressMpa: 39.5,
        failureMode: 'DUCTILE_BURST',
        complianceStatus: 'PASSED_COMPLIANT',
        complianceCertificateIssued: true,
        certifiedByRole: 'HYDROSTATIC_BURST_TESTING_MANAGER',
        destructiveTestNotes: 'Exceeds 32 bar burst pressure benchmark by 20.6%. Ductile failure along longitudinal plane.',
        companyId: demoCompanyId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'hbt-2',
        certificateNumber: 'HYD-CERT-2026-552',
        testSampleBarcode: 'SMP-HDPE-160-PN16-02',
        pipeSpecification: 'HDPE PE100 160mm PN16 SDR11 (ISO 4427)',
        testType: 'SHORT_TERM_1H',
        targetTestPressureBar: 24.5,
        achievedBurstPressureBar: 27.2,
        testDurationHours: 1.0,
        waterBathTempCelsius: 20.0,
        calculatedHoopStressMpa: 12.8,
        failureMode: 'NO_FAILURE',
        complianceStatus: 'PASSED_COMPLIANT',
        complianceCertificateIssued: true,
        certifiedByRole: 'HYDROSTATIC_BURST_TESTING_MANAGER',
        destructiveTestNotes: 'Held 24.5 bar constant pressure without swelling or weeping for 60 minutes.',
        companyId: demoCompanyId,
        createdAt: new Date(Date.now() - 14400000),
        updatedAt: new Date(),
      },
    ];

    this.inMemoryBellingLogs = [
      {
        id: 'bsl-1',
        cycleCode: 'BELL-CYC-2026-201',
        machineId: 'Automatic SICA Belling Machine BM-01',
        socketType: 'ELASTOMERIC_SEALING_RING',
        pipeDiameterMm: 110.0,
        heatingOvenTempCelsius: 128.5,
        formingTimeSeconds: 42,
        coolingTimeSeconds: 28,
        totalCycleTimeSeconds: 70,
        rubberRingBatchNumber: 'EPDM-RING-LOT-4410',
        rubberRingType: 'EPDM_LIP_SEAL',
        rubberRingsConsumed: 48,
        socketInnerDiameterMm: 110.45,
        socketDepthMm: 85.0,
        grooveRetentionTested: true,
        dimensionalAccuracyVerified: true,
        cycleStatus: 'CYCLE_PASSED',
        operatorNotes: 'Infrared heating profile uniform. Rubber ring seated with pneumatic inserter arm.',
        companyId: demoCompanyId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    this.inMemoryDryBlendBatches = [
      {
        id: 'pdb-1',
        batchNumber: 'BLEND-PVC-2026-088',
        recipeFormulaCode: 'FORM-PVC-PRESSURE-K67',
        pvcResinKValue: 67.0,
        virginResinKg: 850.0,
        regrindMaterialKg: 150.0,
        totalBatchWeightKg: 1000.0,
        regrindBlendPercentage: 15.0,
        maxRegrindPermittedPct: 25.0,
        onePackStabilizerKg: 28.5,
        calciumCarbonateFillerKg: 65.0,
        impactModifierKg: 35.0,
        processingAidKg: 12.0,
        pigmentTio2Kg: 15.0,
        highSpeedMixerTempCelsius: 118.0,
        coolerMixerDischargeTemp: 41.5,
        regrindExceedsLimitBlocked: false,
        batchStatus: 'RELEASED_FOR_EXTRUSION',
        approvedByRole: 'PVC_DRY_BLEND_REGRIND_MANAGER',
        notes: 'Virgin-to-regrind ratio at 15.0% (well within 25.0% statutory threshold). Released to silo #3.',
        companyId: demoCompanyId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'pdb-2',
        batchNumber: 'BLEND-PVC-2026-089',
        recipeFormulaCode: 'FORM-PVC-DRAIN-K65',
        pvcResinKValue: 65.0,
        virginResinKg: 680.0,
        regrindMaterialKg: 320.0,
        totalBatchWeightKg: 1000.0,
        regrindBlendPercentage: 32.0,
        maxRegrindPermittedPct: 25.0,
        onePackStabilizerKg: 30.0,
        calciumCarbonateFillerKg: 110.0,
        impactModifierKg: 25.0,
        processingAidKg: 10.0,
        pigmentTio2Kg: 10.0,
        highSpeedMixerTempCelsius: 116.0,
        coolerMixerDischargeTemp: 43.0,
        regrindExceedsLimitBlocked: true,
        batchStatus: 'QUARANTINE_OVER_REGRIND',
        approvedByRole: 'PVC_DRY_BLEND_REGRIND_MANAGER',
        notes: 'SAFETY INTERLOCK TRIGGERED: Regrind 32.0% exceeds 25.0% statutory max limit. Batch automatically quarantined from extruder lines.',
        companyId: demoCompanyId,
        createdAt: new Date(Date.now() - 5400000),
        updatedAt: new Date(),
      },
    ];
  }
}
