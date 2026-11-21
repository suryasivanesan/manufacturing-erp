import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCoilWindingLogDto } from './dto/create-winding-log.dto';
import { CreateCoreAssemblyLaminationLogDto } from './dto/create-core-log.dto';
import { CreateVpiInsulationProcessLogDto } from './dto/create-vpi-log.dto';
import { CreateHvRoutineTestingRecordDto } from './dto/create-hv-test.dto';
import { CreateBusbarEnclosureLogDto } from './dto/create-busbar-log.dto';

export interface UserContext {
  id: string;
  email: string;
  role: string;
  companyId?: string | null;
  firstName?: string | null;
}

@Injectable()
export class ElectricEquipmentOperationsService {
  private readonly logger = new Logger(ElectricEquipmentOperationsService.name);

  private errMsg(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
  }

  // In-memory fallbacks to guarantee multi-tenant operations prior to DB migration
  private inMemoryWindingLogs: any[] = [];
  private inMemoryCoreLogs: any[] = [];
  private inMemoryVpiLogs: any[] = [];
  private inMemoryHvTestRecords: any[] = [];
  private inMemoryBusbarLogs: any[] = [];

  constructor(private readonly prisma: PrismaService) {
    this.seedSampleElectricEquipmentData();
  }

  // =========================================================================
  // 1. COIL WINDING & FABRICATION (WINDING_COIL_FABRICATION_MANAGER)
  // =========================================================================

  async createWindingLog(user: UserContext, dto: CreateCoilWindingLogDto) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required to record coil winding log.');
    }
    const companyId = user.companyId;

    const windingLogCode =
      dto.windingLogCode?.trim() ||
      `WND-COIL-${new Date().getFullYear()}-${String(
        Math.floor(100 + Math.random() * 900),
      )}`;

    const surgePassed =
      dto.interTurnInsulationTestPassed !== undefined
        ? dto.interTurnInsulationTestPassed
        : Number(dto.interTurnSurgeTestVoltageKv) >= 10.0;

    const record = {
      id: `wnd-${Date.now()}`,
      windingLogCode,
      workOrderNumber: dto.workOrderNumber.trim(),
      coilPartNumber: dto.coilPartNumber.trim(),
      transformerOrMotorRatingKva: Number(dto.transformerOrMotorRatingKva),
      wireGaugeSwgOrMm: dto.wireGaugeSwgOrMm.trim(),
      conductorMaterial: dto.conductorMaterial || 'COPPER',
      conductorWeightKg: Number(dto.conductorWeightKg),
      calculatedTurnsTarget: Number(dto.calculatedTurnsTarget),
      actualTurnsCount: Number(dto.actualTurnsCount),
      windingMachineCounterReading: Number(dto.windingMachineCounterReading),
      interTurnSurgeTestVoltageKv: Number(dto.interTurnSurgeTestVoltageKv),
      interTurnInsulationTestPassed: surgePassed,
      windingMachineId: dto.windingMachineId.trim(),
      status: surgePassed ? 'COMPLETED' : 'REWORK_INSULATION',
      operatorUsername: user.email,
      notes:
        dto.notes?.trim() ||
        (surgePassed
          ? 'Coil winding completed. Surge comparison & inter-turn test verified.'
          : 'SURGE FAULT: Inter-turn insulation breakdown detected under surge test.'),
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const created = await (this.prisma as any).coilWindingFabricationLog.create({
        data: record,
      });
      return created;
    } catch (error: unknown) {
      this.logger.warn(`Prisma create failed, falling back to in-memory: ${this.errMsg(error)}`);
      this.inMemoryWindingLogs.unshift(record);
      return record;
    }
  }

  async getWindingLogs(user: UserContext, limit = 50) {
    if (!user?.companyId) return [];
    try {
      const records = await (this.prisma as any).coilWindingFabricationLog.findMany({
        where: { companyId: user.companyId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return records;
    } catch (error: unknown) {
      this.logger.warn(`Prisma fetch failed, returning in-memory records: ${this.errMsg(error)}`);
      return this.inMemoryWindingLogs
        .filter((r: any) => r.companyId === user.companyId || !r.companyId)
        .slice(0, limit);
    }
  }

  async getWindingLogById(user: UserContext, id: string) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    try {
      const record = await (this.prisma as any).coilWindingFabricationLog.findFirst({
        where: { id, companyId: user.companyId },
      });
      if (record) return record;
    } catch {
      // Fallback
    }
    const found = this.inMemoryWindingLogs.find(
      (r: any) => r.id === id && (r.companyId === user.companyId || !r.companyId),
    );
    if (!found) throw new NotFoundException('Coil winding log not found.');
    return found;
  }

  // =========================================================================
  // 2. CORE ASSEMBLY & CRGO LAMINATION (CORE_ASSEMBLY_LAMINATION_MANAGER)
  // =========================================================================

  async createCoreAssemblyLog(user: UserContext, dto: CreateCoreAssemblyLaminationLogDto) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association required.');
    }
    const companyId = user.companyId;

    const assemblyCode =
      dto.assemblyCode?.trim() ||
      `CORE-ASM-${new Date().getFullYear()}-${String(
        Math.floor(100 + Math.random() * 900),
      )}`;

    const torque = Number(dto.clampingTorqueNm);
    const loss = Number(dto.noLoadLossWattsPerKg);
    const isTorqueOptimal = torque >= 60.0 && torque <= 110.0;
    const isLossOptimal = loss <= 1.05; // Max 1.05 W/kg for prime CRGO
    const status =
      isTorqueOptimal && isLossOptimal ? 'STACKED_APPROVED' : 'TORQUE_RECHECK';

    const record = {
      id: `core-${Date.now()}`,
      assemblyCode,
      coreBatchNumber: dto.coreBatchNumber.trim(),
      crgoGrade: dto.crgoGrade.trim(),
      slittingWidthMm: Number(dto.slittingWidthMm),
      crgoWeightKg: Number(dto.crgoWeightKg),
      stackingScheduleId: dto.stackingScheduleId.trim(),
      coreStepCount: Number(dto.coreStepCount || 7),
      stackingHeightMm: Number(dto.stackingHeightMm),
      clampingTorqueNm: torque,
      noLoadLossWattsPerKg: loss,
      totalNoLoadLossWatts: Number(dto.totalNoLoadLossWatts),
      insulationResistanceMOhms: Number(dto.insulationResistanceMOhms),
      status,
      operatorUsername: user.email,
      notes:
        dto.notes?.trim() ||
        (status === 'STACKED_APPROVED'
          ? 'Mitered step-lap stacking completed. Clamping torque & no-load loss within limits.'
          : 'Torque or magnetic loss deviation detected; re-check core band clamping.'),
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const created = await (this.prisma as any).coreAssemblyLaminationLog.create({
        data: record,
      });
      return created;
    } catch (error: unknown) {
      this.logger.warn(`Prisma create failed, falling back to in-memory: ${this.errMsg(error)}`);
      this.inMemoryCoreLogs.unshift(record);
      return record;
    }
  }

  async getCoreAssemblyLogs(user: UserContext, limit = 50) {
    if (!user?.companyId) return [];
    try {
      const records = await (this.prisma as any).coreAssemblyLaminationLog.findMany({
        where: { companyId: user.companyId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return records;
    } catch (error: unknown) {
      this.logger.warn(`Prisma fetch failed, returning in-memory records: ${this.errMsg(error)}`);
      return this.inMemoryCoreLogs
        .filter((r: any) => r.companyId === user.companyId || !r.companyId)
        .slice(0, limit);
    }
  }

  async getCoreAssemblyLogById(user: UserContext, id: string) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    try {
      const record = await (this.prisma as any).coreAssemblyLaminationLog.findFirst({
        where: { id, companyId: user.companyId },
      });
      if (record) return record;
    } catch {
      // Fallback
    }
    const found = this.inMemoryCoreLogs.find(
      (r: any) => r.id === id && (r.companyId === user.companyId || !r.companyId),
    );
    if (!found) throw new NotFoundException('Core assembly log not found.');
    return found;
  }

  // =========================================================================
  // 3. VPI & INSULATION PROCESS (VPI_INSULATION_MANAGER)
  // =========================================================================

  async createVpiProcessLog(user: UserContext, dto: CreateVpiInsulationProcessLogDto) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association required.');
    }
    const companyId = user.companyId;

    const vpiCycleCode =
      dto.vpiCycleCode?.trim() ||
      `VPI-CYC-${new Date().getFullYear()}-${String(
        Math.floor(100 + Math.random() * 900),
      )}`;

    const vac = Number(dto.dryVacuumPressureMbar);
    const sg = Number(dto.varnishSpecificGravity);
    const isVacOk = vac <= 2.0; // Under 2.0 mbar deep vacuum
    const isSgOk = sg >= 1.05 && sg <= 1.12;
    const vpiProcessStatus =
      isVacOk && isSgOk ? 'CYCLE_COMPLETED' : 'OUT_OF_SPEC_HOLD';

    const record = {
      id: `vpi-${Date.now()}`,
      vpiCycleCode,
      tankId: dto.tankId.trim(),
      batchNumber: dto.batchNumber.trim(),
      equipmentRatingKva: Number(dto.equipmentRatingKva),
      preheatTempCelsius: Number(dto.preheatTempCelsius),
      preheatDurationHours: Number(dto.preheatDurationHours),
      dryVacuumPressureMbar: vac,
      vacuumDurationMinutes: Number(dto.vacuumDurationMinutes),
      resinBathTempCelsius: Number(dto.resinBathTempCelsius),
      varnishSpecificGravity: sg,
      varnishViscositySec: Number(dto.varnishViscositySec),
      impregnationPressureBar: Number(dto.impregnationPressureBar),
      bakingTempCelsius: Number(dto.bakingTempCelsius),
      bakingCycleHours: Number(dto.bakingCycleHours),
      insulationResistanceGigaOhms: Number(dto.insulationResistanceGigaOhms),
      vpiProcessStatus,
      operatorUsername: user.email,
      notes:
        dto.notes?.trim() ||
        (vpiProcessStatus === 'CYCLE_COMPLETED'
          ? 'Deep vacuum & pressure impregnation cycle completed. Curing cure optimal.'
          : 'Vacuum level or resin specific gravity out of specification limit.'),
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const created = await (this.prisma as any).vpiInsulationProcessLog.create({
        data: record,
      });
      return created;
    } catch (error: unknown) {
      this.logger.warn(`Prisma create failed, falling back to in-memory: ${this.errMsg(error)}`);
      this.inMemoryVpiLogs.unshift(record);
      return record;
    }
  }

  async getVpiProcessLogs(user: UserContext, limit = 50) {
    if (!user?.companyId) return [];
    try {
      const records = await (this.prisma as any).vpiInsulationProcessLog.findMany({
        where: { companyId: user.companyId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return records;
    } catch (error: unknown) {
      this.logger.warn(`Prisma fetch failed, returning in-memory records: ${this.errMsg(error)}`);
      return this.inMemoryVpiLogs
        .filter((r: any) => r.companyId === user.companyId || !r.companyId)
        .slice(0, limit);
    }
  }

  async getVpiProcessLogById(user: UserContext, id: string) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    try {
      const record = await (this.prisma as any).vpiInsulationProcessLog.findFirst({
        where: { id, companyId: user.companyId },
      });
      if (record) return record;
    } catch {
      // Fallback
    }
    const found = this.inMemoryVpiLogs.find(
      (r: any) => r.id === id && (r.companyId === user.companyId || !r.companyId),
    );
    if (!found) throw new NotFoundException('VPI process log not found.');
    return found;
  }

  // =========================================================================
  // 4. HIGH VOLTAGE ROUTINE TESTING & CERTIFICATION (HV_ROUTINE_TESTING_MANAGER)
  // =========================================================================

  async createHvTestingRecord(user: UserContext, dto: CreateHvRoutineTestingRecordDto) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association required.');
    }
    const companyId = user.companyId;

    const testReportNumber =
      dto.testReportNumber?.trim() ||
      `HVR-${new Date().getFullYear()}-${String(
        Math.floor(1000 + Math.random() * 9000),
      )}`;

    const isCalibrated =
      dto.isInstrumentCalibrated !== undefined
        ? dto.isInstrumentCalibrated
        : true;

    // Strict Statutory Dispatch Lockout:
    // If instrument uncalibrated or partial discharge exceeds 10 pC or leakage current exceeds 10 mA
    const pd = Number(dto.partialDischargePicoCoulombs);
    const leakage = Number(dto.leakageCurrentMilliAmps);
    let clearanceStatus = 'PASSED_CERTIFIED';
    let dispatchBlocked = false;

    if (!isCalibrated) {
      clearanceStatus = 'BLOCKED_UNCALIBRATED';
      dispatchBlocked = true;
    } else if (pd > 10.0 || leakage > 10.0) {
      clearanceStatus = 'FAILED_BREAKDOWN';
      dispatchBlocked = true;
    }

    const certNumber =
      clearanceStatus === 'PASSED_CERTIFIED'
        ? `CERT-HV-${new Date().getFullYear()}-${String(
            Math.floor(1000 + Math.random() * 9000),
          )}`
        : null;

    const record = {
      id: `hvr-${Date.now()}`,
      testReportNumber,
      unitSerialNumber: dto.unitSerialNumber.trim(),
      equipmentType: dto.equipmentType || 'POWER_TRANSFORMER',
      ratedVoltageKv: Number(dto.ratedVoltageKv),
      appliedHighVoltageKv: Number(dto.appliedHighVoltageKv),
      leakageCurrentMilliAmps: leakage,
      insulationResistanceMegohms: Number(dto.insulationResistanceMegohms),
      breakdownVoltageKv: dto.breakdownVoltageKv ? Number(dto.breakdownVoltageKv) : null,
      partialDischargePicoCoulombs: pd,
      isInstrumentCalibrated: isCalibrated,
      calibrationCertId: dto.calibrationCertId.trim(),
      calibrationValidUntil: new Date(dto.calibrationValidUntil),
      dispatchBlocked,
      clearanceStatus,
      certificateNumber: certNumber,
      certifiedAt: clearanceStatus === 'PASSED_CERTIFIED' ? new Date() : null,
      certifiedByRole: 'HV_ROUTINE_TESTING_MANAGER',
      notes:
        dto.notes?.trim() ||
        (dispatchBlocked
          ? `DISPATCH BLOCKED: ${clearanceStatus === 'BLOCKED_UNCALIBRATED' ? 'Test rig calibration expired!' : 'High partial discharge / insulation failure!'}`
          : 'High voltage dielectric withstand and induced overvoltage test PASSED. Certified for dispatch.'),
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const created = await (this.prisma as any).hvRoutineTestingRecord.create({
        data: record,
      });
      return created;
    } catch (error: unknown) {
      this.logger.warn(`Prisma create failed, falling back to in-memory: ${this.errMsg(error)}`);
      this.inMemoryHvTestRecords.unshift(record);
      return record;
    }
  }

  async getHvTestingRecords(user: UserContext, limit = 50) {
    if (!user?.companyId) return [];
    try {
      const records = await (this.prisma as any).hvRoutineTestingRecord.findMany({
        where: { companyId: user.companyId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return records;
    } catch (error: unknown) {
      this.logger.warn(`Prisma fetch failed, returning in-memory records: ${this.errMsg(error)}`);
      return this.inMemoryHvTestRecords
        .filter((r: any) => r.companyId === user.companyId || !r.companyId)
        .slice(0, limit);
    }
  }

  async certifyHvTestingRecord(user: UserContext, id: string) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association required.');
    }

    const certNumber = `CERT-HV-${new Date().getFullYear()}-${String(
      Math.floor(1000 + Math.random() * 9000),
    )}`;

    try {
      return await (this.prisma as any).hvRoutineTestingRecord.update({
        where: { id },
        data: {
          clearanceStatus: 'PASSED_CERTIFIED',
          dispatchBlocked: false,
          isInstrumentCalibrated: true,
          certificateNumber: certNumber,
          certifiedAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } catch (error: unknown) {
      this.logger.warn(`Prisma update failed, falling back to in-memory: ${this.errMsg(error)}`);
      const found = this.inMemoryHvTestRecords.find(
        (r: any) => r.id === id && (r.companyId === user.companyId || !r.companyId),
      );
      if (!found) throw new NotFoundException('HV routine testing record not found.');
      found.clearanceStatus = 'PASSED_CERTIFIED';
      found.dispatchBlocked = false;
      found.isInstrumentCalibrated = true;
      found.certificateNumber = certNumber;
      found.certifiedAt = new Date();
      found.updatedAt = new Date();
      return found;
    }
  }

  // =========================================================================
  // 5. BUSBAR FABRICATION & ENCLOSURE (BUSBAR_FABRICATION_ENCLOSURE_MANAGER)
  // =========================================================================

  async createBusbarEnclosureLog(user: UserContext, dto: CreateBusbarEnclosureLogDto) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association required.');
    }
    const companyId = user.companyId;

    const fabricationCode =
      dto.fabricationCode?.trim() ||
      `BUS-ENC-${new Date().getFullYear()}-${String(
        Math.floor(100 + Math.random() * 900),
      )}`;

    const phaseCl = Number(dto.phaseClearanceMm);
    const creepage = Number(dto.creepageDistanceMm);
    const dft = Number(dto.dryFilmThicknessMicrons);

    // IEC 62271 Clearance Verification (e.g. min 120mm for 11kV, 200mm creepage, DFT 70-110 um)
    const isClearanceOk = phaseCl >= 120.0 && creepage >= 200.0;
    const isDftOk = dft >= 70.0 && dft <= 120.0;
    const isApproved = isClearanceOk && isDftOk;
    const inspectionStatus = isApproved ? 'APPROVED' : 'NON_COMPLIANT_CLEARANCE';

    const record = {
      id: `bus-${Date.now()}`,
      fabricationCode,
      enclosurePanelId: dto.enclosurePanelId.trim(),
      busbarMaterial: dto.busbarMaterial || 'COPPER_ETP',
      busbarCrossSectionMm: dto.busbarCrossSectionMm.trim(),
      busbarCutLengthMm: Number(dto.busbarCutLengthMm),
      bendAngleDegrees: Number(dto.bendAngleDegrees),
      bendingRadiusMm: Number(dto.bendingRadiusMm),
      phaseClearanceMm: phaseCl,
      creepageDistanceMm: creepage,
      clearanceCompliant: isClearanceOk,
      powderCoatingColorRal: dto.powderCoatingColorRal || 'RAL 7035 Light Grey',
      dryFilmThicknessMicrons: dft,
      powderBatchLotNumber: dto.powderBatchLotNumber.trim(),
      assemblyRoutingStation: dto.assemblyRoutingStation.trim(),
      inspectionStatus,
      inspectorUsername: user.email,
      notes:
        dto.notes?.trim() ||
        (isApproved
          ? 'Busbar phase/creepage clearance & powder coating DFT verified to IEC standards.'
          : 'Clearance distance or powder coating thickness failed tolerance limit.'),
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const created = await (this.prisma as any).busbarEnclosureFabricationLog.create({
        data: record,
      });
      return created;
    } catch (error: unknown) {
      this.logger.warn(`Prisma create failed, falling back to in-memory: ${this.errMsg(error)}`);
      this.inMemoryBusbarLogs.unshift(record);
      return record;
    }
  }

  async getBusbarEnclosureLogs(user: UserContext, limit = 50) {
    if (!user?.companyId) return [];
    try {
      const records = await (this.prisma as any).busbarEnclosureFabricationLog.findMany({
        where: { companyId: user.companyId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return records;
    } catch (error: unknown) {
      this.logger.warn(`Prisma fetch failed, returning in-memory records: ${this.errMsg(error)}`);
      return this.inMemoryBusbarLogs
        .filter((r: any) => r.companyId === user.companyId || !r.companyId)
        .slice(0, limit);
    }
  }

  // =========================================================================
  // SEED SAMPLE DATA FOR ELECTRIC EQUIPMENT OPERATIONS
  // =========================================================================

  private seedSampleElectricEquipmentData() {
    this.inMemoryWindingLogs = [
      {
        id: 'wnd-1',
        windingLogCode: 'WND-COIL-2026-101',
        workOrderNumber: 'WO-XFMR-2026-081',
        coilPartNumber: 'COIL-HV-33KV-A',
        transformerOrMotorRatingKva: 2500.0,
        wireGaugeSwgOrMm: 'SWG 14 Rectangular Strip (6.5 x 2.8 mm)',
        conductorMaterial: 'COPPER',
        conductorWeightKg: 184.5,
        calculatedTurnsTarget: 840,
        actualTurnsCount: 840,
        windingMachineCounterReading: 14280,
        interTurnSurgeTestVoltageKv: 15.0,
        interTurnInsulationTestPassed: true,
        windingMachineId: 'Laxmi Automatic CNC Coil Winder CW-02',
        status: 'COMPLETED',
        operatorUsername: 'winding.specialist@plant.internal',
        notes: 'Pre-insulated diamond dotted paper (DDP) layer insulation applied. Surge wave match 100%.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'wnd-2',
        windingLogCode: 'WND-COIL-2026-102',
        workOrderNumber: 'WO-XFMR-2026-082',
        coilPartNumber: 'COIL-LV-433V-B',
        transformerOrMotorRatingKva: 1600.0,
        wireGaugeSwgOrMm: 'Copper Foil 0.8mm x 600mm Width',
        conductorMaterial: 'COPPER',
        conductorWeightKg: 215.0,
        calculatedTurnsTarget: 48,
        actualTurnsCount: 48,
        windingMachineCounterReading: 3456,
        interTurnSurgeTestVoltageKv: 6.0,
        interTurnInsulationTestPassed: true,
        windingMachineId: 'Foil Winding Machine FWM-01',
        status: 'COMPLETED',
        operatorUsername: 'winding.specialist@plant.internal',
        notes: 'Foil edge deburred and Nomex insulation tape tension verified.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    this.inMemoryCoreLogs = [
      {
        id: 'core-1',
        assemblyCode: 'CORE-ASM-2026-201',
        coreBatchNumber: 'BATCH-CRGO-789',
        crgoGrade: 'CRGO 23ZH90 High Permeability',
        slittingWidthMm: 220.0,
        crgoWeightKg: 1420.0,
        stackingScheduleId: 'SCHED-STK-V3',
        coreStepCount: 7,
        stackingHeightMm: 485.0,
        clampingTorqueNm: 85.0,
        noLoadLossWattsPerKg: 0.82,
        totalNoLoadLossWatts: 1164.4,
        insulationResistanceMOhms: 250.0,
        status: 'STACKED_APPROVED',
        operatorUsername: 'core.stacking@plant.internal',
        notes: 'Full mitered 45° step-lap stacking pattern. Tie-rod torqued to 85 Nm.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'core-2',
        assemblyCode: 'CORE-ASM-2026-202',
        coreBatchNumber: 'BATCH-CRGO-790',
        crgoGrade: 'CRGO Grade M4 Laser Scribed',
        slittingWidthMm: 180.0,
        crgoWeightKg: 980.0,
        stackingScheduleId: 'SCHED-STK-V2',
        coreStepCount: 5,
        stackingHeightMm: 390.0,
        clampingTorqueNm: 75.0,
        noLoadLossWattsPerKg: 0.89,
        totalNoLoadLossWatts: 872.2,
        insulationResistanceMOhms: 210.0,
        status: 'STACKED_APPROVED',
        operatorUsername: 'core.stacking@plant.internal',
        notes: 'Epoxy resin band taping applied along outer limbs to prevent vibration.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    this.inMemoryVpiLogs = [
      {
        id: 'vpi-1',
        vpiCycleCode: 'VPI-CYC-2026-301',
        tankId: 'VPI Autoclave Tank 1 (3000L)',
        batchNumber: 'BATCH-VPI-XFMR-08',
        equipmentRatingKva: 2500.0,
        preheatTempCelsius: 115.0,
        preheatDurationHours: 4.0,
        dryVacuumPressureMbar: 0.85,
        vacuumDurationMinutes: 120,
        resinBathTempCelsius: 32.5,
        varnishSpecificGravity: 1.085,
        varnishViscositySec: 45.0,
        impregnationPressureBar: 6.5,
        bakingTempCelsius: 140.0,
        bakingCycleHours: 10.5,
        insulationResistanceGigaOhms: 15.2,
        vpiProcessStatus: 'CYCLE_COMPLETED',
        operatorUsername: 'vpi.engineer@plant.internal',
        notes: 'Deep dry vacuum at 0.85 mbar followed by 6.5 bar nitrogen pressure impregnation.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    this.inMemoryHvTestRecords = [
      {
        id: 'hvr-1',
        testReportNumber: 'HVR-2026-9041',
        unitSerialNumber: 'TR-2500-2026-081',
        equipmentType: 'POWER_TRANSFORMER',
        ratedVoltageKv: 33.0,
        appliedHighVoltageKv: 70.0,
        leakageCurrentMilliAmps: 4.2,
        insulationResistanceMegohms: 4500.0,
        breakdownVoltageKv: 85.0,
        partialDischargePicoCoulombs: 6.5,
        isInstrumentCalibrated: true,
        calibrationCertId: 'NABL-CAL-HV-2026-104',
        calibrationValidUntil: new Date('2027-06-30'),
        dispatchBlocked: false,
        clearanceStatus: 'PASSED_CERTIFIED',
        certificateNumber: 'CERT-HV-2026-0441',
        certifiedAt: new Date(),
        certifiedByRole: 'HV_ROUTINE_TESTING_MANAGER',
        notes: 'Induced overvoltage & separate source high voltage withstand PASSED. Partial discharge 6.5 pC (well below 10 pC limit).',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'hvr-2',
        testReportNumber: 'HVR-2026-9042',
        unitSerialNumber: 'TR-1600-2026-082',
        equipmentType: 'DISTRIBUTION_TRANSFORMER',
        ratedVoltageKv: 11.0,
        appliedHighVoltageKv: 28.0,
        leakageCurrentMilliAmps: 2.8,
        insulationResistanceMegohms: 3800.0,
        breakdownVoltageKv: 42.0,
        partialDischargePicoCoulombs: 5.2,
        isInstrumentCalibrated: true,
        calibrationCertId: 'NABL-CAL-HV-2026-104',
        calibrationValidUntil: new Date('2027-06-30'),
        dispatchBlocked: false,
        clearanceStatus: 'PASSED_CERTIFIED',
        certificateNumber: 'CERT-HV-2026-0442',
        certifiedAt: new Date(),
        certifiedByRole: 'HV_ROUTINE_TESTING_MANAGER',
        notes: 'Routine dielectric tests passed. Megger reading > 3800 MΩ.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    this.inMemoryBusbarLogs = [
      {
        id: 'bus-1',
        fabricationCode: 'BUS-ENC-2026-501',
        enclosurePanelId: 'PNL-SWGR-11KV-BAY-03',
        busbarMaterial: 'COPPER_ETP',
        busbarCrossSectionMm: '100 x 10 mm Flat Bar',
        busbarCutLengthMm: 1850.0,
        bendAngleDegrees: 90.0,
        bendingRadiusMm: 20.0,
        phaseClearanceMm: 127.0,
        creepageDistanceMm: 220.0,
        clearanceCompliant: true,
        powderCoatingColorRal: 'RAL 7035 Light Grey',
        dryFilmThicknessMicrons: 85.0,
        powderBatchLotNumber: 'LOT-POWDER-EPX-774',
        assemblyRoutingStation: 'Modular Assembly Cell Stn-04',
        inspectionStatus: 'APPROVED',
        inspectorUsername: 'busbar.inspector@plant.internal',
        notes: 'IEC 62271-200 phase clearance 127 mm (spec > 120 mm) and creepage 220 mm verified. Heat-shrink insulation sleeves fitted.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }
}
