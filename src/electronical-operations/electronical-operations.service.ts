import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSmtPcbAssemblyLogDto } from './dto/create-smt-log.dto';
import { CreateElectricalTestingRecordDto } from './dto/create-testing-record.dto';
import { CreateFirmwareFlashingLogDto } from './dto/create-flashing-log.dto';
import { CreateComponentEbomRecordDto } from './dto/create-ebom-record.dto';
import { CreateEsdCleanroomAuditLogDto } from './dto/create-esd-audit.dto';

export interface UserContext {
  id: string;
  email: string;
  role: string;
  companyId?: string | null;
  firstName?: string | null;
}

@Injectable()
export class ElectronicalOperationsService {
  private readonly logger = new Logger(ElectronicalOperationsService.name);

  private errMsg(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
  }

  // In-memory fallbacks to guarantee zero runtime downtime prior to DB migration
  private inMemorySmtLogs: any[] = [];
  private inMemoryTestingRecords: any[] = [];
  private inMemoryFlashingLogs: any[] = [];
  private inMemoryEbomRecords: any[] = [];
  private inMemoryEsdAudits: any[] = [];

  constructor(private readonly prisma: PrismaService) {
    this.seedSampleElectronicalData();
  }

  // =========================================================================
  // 1. SMT & PCB ASSEMBLY OPERATIONS (SMT_PCB_ASSEMBLY_MANAGER)
  // =========================================================================

  async createSmtLog(user: UserContext, dto: CreateSmtPcbAssemblyLogDto) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association is required to record SMT assembly log.');
    }
    const companyId = user.companyId;

    const logCode =
      dto.logCode?.trim() ||
      `SMT-LOG-${new Date().getFullYear()}-${String(
        Math.floor(100 + Math.random() * 900),
      )}`;

    const record = {
      id: `smt-${Date.now()}`,
      logCode,
      lineId: dto.lineId.trim(),
      pcbBatchNumber: dto.pcbBatchNumber.trim(),
      feederPlacementListNumber: dto.feederPlacementListNumber.trim(),
      componentReelLotNumbers: dto.componentReelLotNumbers.trim(),
      reflowZone1TempCelsius: Number(dto.reflowZone1TempCelsius),
      reflowZone2TempCelsius: Number(dto.reflowZone2TempCelsius),
      reflowPeakTempCelsius: Number(dto.reflowPeakTempCelsius),
      conveyorSpeedMpm: Number(dto.conveyorSpeedMpm),
      dailyPcbOutputQty: Number(dto.dailyPcbOutputQty),
      passQty: Number(dto.passQty),
      reworkQty: Number(dto.reworkQty),
      solderPasteType: dto.solderPasteType?.trim() || 'SAC305_LEAD_FREE',
      status: dto.status?.trim() || 'REFLOW_OPTIMAL',
      notes: dto.notes || 'SMT high-speed placement run with calibrated 10-zone reflow profile.',
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      return await (this.prisma as any).smtPcbAssemblyLog.create({
        data: record,
      });
    } catch (error: unknown) {
      this.logger.warn(`Database insert failed, using fallback in-memory cache: ${this.errMsg(error)}`);
      this.inMemorySmtLogs.unshift(record);
      return record;
    }
  }

  async getSmtLogs(user: UserContext, limit = 50) {
    if (!user?.companyId) return [];
    try {
      const records = await (this.prisma as any).smtPcbAssemblyLog.findMany({
        where: { companyId: user.companyId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return records;
    } catch (error: unknown) {
      this.logger.warn(`Prisma fetch failed, returning in-memory records: ${this.errMsg(error)}`);
      return this.inMemorySmtLogs
        .filter((r: any) => r.companyId === user.companyId || !r.companyId)
        .slice(0, limit);
    }
  }

  async updateSmtStatus(
    user: UserContext,
    id: string,
    status: 'RUNNING' | 'REFLOW_OPTIMAL' | 'REFLOW_ALERT' | 'COMPLETED',
    notes?: string,
  ) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association required.');
    }

    try {
      return await (this.prisma as any).smtPcbAssemblyLog.update({
        where: { id },
        data: {
          status,
          ...(notes ? { notes } : {}),
          updatedAt: new Date(),
        },
      });
    } catch (error: unknown) {
      const found = this.inMemorySmtLogs.find(
        (r: any) => r.id === id && (r.companyId === user.companyId || !r.companyId),
      );
      if (!found) throw new NotFoundException('SMT Assembly log not found');
      found.status = status;
      if (notes) found.notes = notes;
      found.updatedAt = new Date();
      return found;
    }
  }

  // =========================================================================
  // 2. ELECTRICAL TESTING & CALIBRATION (ELECTRICAL_TESTING_CALIBRATION_MANAGER)
  // =========================================================================

  async createTestingRecord(user: UserContext, dto: CreateElectricalTestingRecordDto) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association required.');
    }
    const companyId = user.companyId;

    // Strict validation: instrument calibration lock
    const calibrationValidDate = new Date(dto.calibrationCertValidUntil);
    const isCalibrated =
      dto.isInstrumentCalibrated !== false && calibrationValidDate.getTime() > Date.now();

    const testResult = !isCalibrated
      ? 'BLOCKED_UNCALIBRATED'
      : dto.testResult?.trim() || 'PASSED';

    const testReportNumber =
      dto.testReportNumber?.trim() ||
      `ETR-${new Date().getFullYear()}-${String(
        Math.floor(1000 + Math.random() * 9000),
      )}`;

    const clearanceCertificateNumber =
      testResult === 'PASSED'
        ? dto.clearanceCertificateNumber?.trim() ||
          `COA-ELEC-${new Date().getFullYear()}-${String(
            Math.floor(1000 + Math.random() * 9000),
          )}`
        : null;

    const record = {
      id: `etr-${Date.now()}`,
      testReportNumber,
      pcbOrDeviceSerial: dto.pcbOrDeviceSerial.trim(),
      testRigId: dto.testRigId.trim(),
      voltageRangeVolts: Number(dto.voltageRangeVolts),
      currentConsumptionMilliAmps: Number(dto.currentConsumptionMilliAmps),
      frequencyMhz: dto.frequencyMhz ? Number(dto.frequencyMhz) : 48.0,
      instrumentCalibrationCertId: dto.instrumentCalibrationCertId.trim(),
      calibrationCertValidUntil: calibrationValidDate,
      isInstrumentCalibrated: isCalibrated,
      testResult,
      defectLog: testResult !== 'PASSED' ? dto.defectLog || 'Signal out of spec' : null,
      clearanceCertificateNumber,
      certifiedAt: testResult === 'PASSED' ? new Date() : null,
      notes: dto.notes || 'Automated ICT/FCT station continuity, resistance & functional clock validation.',
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      return await (this.prisma as any).electricalTestingRecord.create({
        data: record,
      });
    } catch (error: unknown) {
      this.logger.warn(`Database insert failed, using fallback in-memory cache: ${this.errMsg(error)}`);
      this.inMemoryTestingRecords.unshift(record);
      return record;
    }
  }

  async getTestingRecords(user: UserContext, limit = 50) {
    if (!user?.companyId) return [];
    try {
      const records = await (this.prisma as any).electricalTestingRecord.findMany({
        where: { companyId: user.companyId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return records;
    } catch (error: unknown) {
      this.logger.warn(`Prisma fetch failed, returning in-memory records: ${this.errMsg(error)}`);
      return this.inMemoryTestingRecords
        .filter((r: any) => r.companyId === user.companyId || !r.companyId)
        .slice(0, limit);
    }
  }

  async certifyElectricalRecord(user: UserContext, id: string) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association required.');
    }

    const coaNumber = `COA-ELEC-${new Date().getFullYear()}-${String(
      Math.floor(1000 + Math.random() * 9000),
    )}`;

    try {
      return await (this.prisma as any).electricalTestingRecord.update({
        where: { id },
        data: {
          testResult: 'PASSED',
          isInstrumentCalibrated: true,
          clearanceCertificateNumber: coaNumber,
          certifiedAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } catch (error: unknown) {
      const found = this.inMemoryTestingRecords.find(
        (r: any) => r.id === id && (r.companyId === user.companyId || !r.companyId),
      );
      if (!found) throw new NotFoundException('Electrical testing record not found');
      found.testResult = 'PASSED';
      found.isInstrumentCalibrated = true;
      found.clearanceCertificateNumber = coaNumber;
      found.certifiedAt = new Date();
      found.updatedAt = new Date();
      return found;
    }
  }

  // =========================================================================
  // 3. FIRMWARE FLASHING & SERIAL MAPPING (FIRMWARE_FLASHING_MANAGER)
  // =========================================================================

  async createFlashingLog(user: UserContext, dto: CreateFirmwareFlashingLogDto) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association required.');
    }
    const companyId = user.companyId;

    const flashLogCode =
      dto.flashLogCode?.trim() ||
      `FWL-${new Date().getFullYear()}-${String(
        Math.floor(1000 + Math.random() * 9000),
      )}`;

    const record = {
      id: `fwl-${Date.now()}`,
      flashLogCode,
      deviceSerialNumber: dto.deviceSerialNumber.trim(),
      macAddress: dto.macAddress?.trim() || null,
      workOrderNumber: dto.workOrderNumber.trim(),
      firmwareName: dto.firmwareName.trim(),
      firmwareVersion: dto.firmwareVersion.trim(),
      checksumSha256: dto.checksumSha256.trim(),
      flashStatus: dto.flashStatus?.trim() || 'SUCCESS',
      flashingStationId: dto.flashingStationId.trim(),
      flashedAt: new Date(),
      operatorUsername: dto.operatorUsername?.trim() || user.email,
      notes: dto.notes || '1-to-1 Device serialization with locked secure-boot bootloader keys.',
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      return await (this.prisma as any).firmwareFlashingLog.create({
        data: record,
      });
    } catch (error: unknown) {
      this.logger.warn(`Database insert failed, using fallback in-memory cache: ${this.errMsg(error)}`);
      this.inMemoryFlashingLogs.unshift(record);
      return record;
    }
  }

  async getFlashingLogs(user: UserContext, limit = 50) {
    if (!user?.companyId) return [];
    try {
      const records = await (this.prisma as any).firmwareFlashingLog.findMany({
        where: { companyId: user.companyId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return records;
    } catch (error: unknown) {
      this.logger.warn(`Prisma fetch failed, returning in-memory records: ${this.errMsg(error)}`);
      return this.inMemoryFlashingLogs
        .filter((r: any) => r.companyId === user.companyId || !r.companyId)
        .slice(0, limit);
    }
  }

  async verifyFirmwareMapping(user: UserContext, deviceSerialNumber: string) {
    if (!user?.companyId) return null;
    try {
      const record = await (this.prisma as any).firmwareFlashingLog.findFirst({
        where: {
          companyId: user.companyId,
          deviceSerialNumber: deviceSerialNumber.trim(),
        },
      });
      return record;
    } catch (error: unknown) {
      return (
        this.inMemoryFlashingLogs.find(
          (r: any) =>
            (r.companyId === user.companyId || !r.companyId) &&
            r.deviceSerialNumber === deviceSerialNumber.trim(),
        ) || null
      );
    }
  }

  // =========================================================================
  // 4. COMPONENT OBSOLESCENCE & EBOM LIFECYCLE (COMPONENT_OBSOLESCENCE_EBOM_MANAGER)
  // =========================================================================

  async createEbomRecord(user: UserContext, dto: CreateComponentEbomRecordDto) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association required.');
    }
    const companyId = user.companyId;

    const ebomCode =
      dto.ebomCode?.trim() ||
      `EBOM-${new Date().getFullYear()}-${dto.componentPartNumber.trim().replace(/[^a-zA-Z0-9]/g, '')}`;

    const record = {
      id: `ebom-${Date.now()}`,
      ebomCode,
      assemblyPartNumber: dto.assemblyPartNumber.trim(),
      componentPartNumber: dto.componentPartNumber.trim(),
      componentCategory: dto.componentCategory.trim(),
      lifecycleStatus: dto.lifecycleStatus?.trim() || 'ACTIVE',
      substitutePartNumber: dto.substitutePartNumber?.trim() || null,
      substituteApproved: dto.substituteApproved ?? false,
      ecoNumber: dto.ecoNumber?.trim() || null,
      ecoApprovedAt: dto.substituteApproved ? new Date() : null,
      vendorName: dto.vendorName.trim(),
      leadTimeWeeks: Number(dto.leadTimeWeeks),
      unitCostInr: Number(dto.unitCostInr),
      notes: dto.notes || 'Engineering BOM component lifecycle tracking with approved manufacturer list (AML).',
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      return await (this.prisma as any).componentEbomRecord.create({
        data: record,
      });
    } catch (error: unknown) {
      this.logger.warn(`Database insert failed, using fallback in-memory cache: ${this.errMsg(error)}`);
      this.inMemoryEbomRecords.unshift(record);
      return record;
    }
  }

  async getEbomRecords(user: UserContext, limit = 50) {
    if (!user?.companyId) return [];
    try {
      const records = await (this.prisma as any).componentEbomRecord.findMany({
        where: { companyId: user.companyId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return records;
    } catch (error: unknown) {
      this.logger.warn(`Prisma fetch failed, returning in-memory records: ${this.errMsg(error)}`);
      return this.inMemoryEbomRecords
        .filter((r: any) => r.companyId === user.companyId || !r.companyId)
        .slice(0, limit);
    }
  }

  async approveSubstitutePart(
    user: UserContext,
    id: string,
    substitutePartNumber: string,
    ecoNumber?: string,
  ) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association required.');
    }

    const assignedEco =
      ecoNumber?.trim() ||
      `ECO-${new Date().getFullYear()}-${String(
        Math.floor(100 + Math.random() * 900),
      )}`;

    try {
      return await (this.prisma as any).componentEbomRecord.update({
        where: { id },
        data: {
          substitutePartNumber: substitutePartNumber.trim(),
          substituteApproved: true,
          ecoNumber: assignedEco,
          ecoApprovedAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } catch (error: unknown) {
      const found = this.inMemoryEbomRecords.find(
        (r: any) => r.id === id && (r.companyId === user.companyId || !r.companyId),
      );
      if (!found) throw new NotFoundException('Component EBOM record not found');
      found.substitutePartNumber = substitutePartNumber.trim();
      found.substituteApproved = true;
      found.ecoNumber = assignedEco;
      found.ecoApprovedAt = new Date();
      found.updatedAt = new Date();
      return found;
    }
  }

  // =========================================================================
  // 5. ESD & CLEANROOM COMPLIANCE (ESD_CLEANROOM_COMPLIANCE_MANAGER)
  // =========================================================================

  async createEsdAudit(user: UserContext, dto: CreateEsdCleanroomAuditLogDto) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association required.');
    }
    const companyId = user.companyId;

    const auditCode =
      dto.auditCode?.trim() ||
      `ESD-AUDIT-${new Date().getFullYear()}-${String(
        Math.floor(100 + Math.random() * 900),
      )}`;

    // ANSI/ESD S20.20 Threshold evaluation:
    // Wrist strap resistance: 750k (7.5e5) to 10M (1.0e7) Ohms
    // Mat ground resistance: 1M (1.0e6) to 100M (1.0e8) Ohms
    const wristOhms = Number(dto.wristStrapResistanceOhms);
    const matOhms = Number(dto.matGroundResistanceOhms);

    let auditStatus = dto.auditStatus?.trim() || 'COMPLIANT';
    if (wristOhms < 750000 || wristOhms > 10000000 || matOhms < 1000000 || matOhms > 100000000) {
      auditStatus = 'NON_COMPLIANT';
    }

    const record = {
      id: `esd-${Date.now()}`,
      auditCode,
      auditDate: new Date(),
      cleanroomZone: dto.cleanroomZone.trim(),
      workstationNumber: dto.workstationNumber.trim(),
      wristStrapResistanceOhms: wristOhms,
      matGroundResistanceOhms: matOhms,
      relativeHumidityPct: Number(dto.relativeHumidityPct),
      temperatureCelsius: Number(dto.temperatureCelsius),
      particleCountIsoClass: dto.particleCountIsoClass?.trim() || 'ISO_CLASS_7',
      esdPackagingVerified: dto.esdPackagingVerified ?? true,
      auditStatus,
      auditedByRole: dto.auditedByRole?.trim() || 'ESD_CLEANROOM_COMPLIANCE_MANAGER',
      notes: dto.notes || 'Daily ANSI/ESD S20.20 static dissipative compliance and cleanroom environment telemetry.',
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      return await (this.prisma as any).esdCleanroomAuditLog.create({
        data: record,
      });
    } catch (error: unknown) {
      this.logger.warn(`Database insert failed, using fallback in-memory cache: ${this.errMsg(error)}`);
      this.inMemoryEsdAudits.unshift(record);
      return record;
    }
  }

  async getEsdAudits(user: UserContext, limit = 50) {
    if (!user?.companyId) return [];
    try {
      const records = await (this.prisma as any).esdCleanroomAuditLog.findMany({
        where: { companyId: user.companyId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return records;
    } catch (error: unknown) {
      this.logger.warn(`Prisma fetch failed, returning in-memory records: ${this.errMsg(error)}`);
      return this.inMemoryEsdAudits
        .filter((r: any) => r.companyId === user.companyId || !r.companyId)
        .slice(0, limit);
    }
  }

  async updateEsdStatus(
    user: UserContext,
    id: string,
    status: 'COMPLIANT' | 'WARNING' | 'NON_COMPLIANT',
    notes?: string,
  ) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association required.');
    }

    try {
      return await (this.prisma as any).esdCleanroomAuditLog.update({
        where: { id },
        data: {
          auditStatus: status,
          ...(notes ? { notes } : {}),
          updatedAt: new Date(),
        },
      });
    } catch (error: unknown) {
      const found = this.inMemoryEsdAudits.find(
        (r: any) => r.id === id && (r.companyId === user.companyId || !r.companyId),
      );
      if (!found) throw new NotFoundException('ESD audit record not found');
      found.auditStatus = status;
      if (notes) found.notes = notes;
      found.updatedAt = new Date();
      return found;
    }
  }

  // =========================================================================
  // SEED SAMPLE ELECTRONICAL DATA
  // =========================================================================

  private seedSampleElectronicalData() {
    this.inMemorySmtLogs = [
      {
        id: 'smt-seed-1',
        logCode: 'SMT-LOG-2026-101',
        lineId: 'SMT-LINE-ALPHA',
        pcbBatchNumber: 'PCB-BATCH-2026-88',
        feederPlacementListNumber: 'FPL-V2-REV-04',
        componentReelLotNumbers: 'REEL-CAP-0402-9981, REEL-RES-0603-4412, REEL-IC-QFN-7731',
        reflowZone1TempCelsius: 152.0,
        reflowZone2TempCelsius: 191.5,
        reflowPeakTempCelsius: 246.0,
        conveyorSpeedMpm: 0.85,
        dailyPcbOutputQty: 1200,
        passQty: 1188,
        reworkQty: 12,
        solderPasteType: 'SAC305_LEAD_FREE',
        status: 'REFLOW_OPTIMAL',
        notes: 'Preheat ramp rate 1.8°C/s, zero bridging detected on 0.4mm pitch ICs.',
        companyId: null,
        createdAt: new Date(Date.now() - 3600000 * 4),
        updatedAt: new Date(Date.now() - 3600000 * 4),
      },
      {
        id: 'smt-seed-2',
        logCode: 'SMT-LOG-2026-102',
        lineId: 'SMT-LINE-BETA',
        pcbBatchNumber: 'PCB-BATCH-2026-89',
        feederPlacementListNumber: 'FPL-V3-REV-01',
        componentReelLotNumbers: 'REEL-CAP-0805-1102, REEL-BGA-SOC-5521',
        reflowZone1TempCelsius: 148.0,
        reflowZone2TempCelsius: 188.0,
        reflowPeakTempCelsius: 244.2,
        conveyorSpeedMpm: 0.9,
        dailyPcbOutputQty: 850,
        passQty: 846,
        reworkQty: 4,
        solderPasteType: 'SAC305_LEAD_FREE',
        status: 'RUNNING',
        notes: 'High-speed automated optical inspection (AOI) connected with real-time feedback.',
        companyId: null,
        createdAt: new Date(Date.now() - 3600000 * 2),
        updatedAt: new Date(Date.now() - 3600000 * 2),
      },
    ];

    this.inMemoryTestingRecords = [
      {
        id: 'etr-seed-1',
        testReportNumber: 'ETR-2026-9041',
        pcbOrDeviceSerial: 'SN-HW-2026-00491',
        testRigId: 'RIG-ICT-FCT-03',
        voltageRangeVolts: 3.32,
        currentConsumptionMilliAmps: 142.5,
        frequencyMhz: 48.0,
        instrumentCalibrationCertId: 'CAL-NABL-2026-8812',
        calibrationCertValidUntil: new Date(Date.now() + 86400000 * 180),
        isInstrumentCalibrated: true,
        testResult: 'PASSED',
        defectLog: null,
        clearanceCertificateNumber: 'COA-ELEC-2026-9041',
        certifiedAt: new Date(Date.now() - 3600000 * 3),
        notes: 'ICT bed-of-nails and RF power calibration verified. 100% test vectors executed.',
        companyId: null,
        createdAt: new Date(Date.now() - 3600000 * 3),
        updatedAt: new Date(Date.now() - 3600000 * 3),
      },
      {
        id: 'etr-seed-2',
        testReportNumber: 'ETR-2026-9042',
        pcbOrDeviceSerial: 'SN-HW-2026-00492',
        testRigId: 'RIG-ICT-FCT-01',
        voltageRangeVolts: 3.28,
        currentConsumptionMilliAmps: 265.0,
        frequencyMhz: 47.95,
        instrumentCalibrationCertId: 'CAL-NABL-2026-8812',
        calibrationCertValidUntil: new Date(Date.now() + 86400000 * 180),
        isInstrumentCalibrated: true,
        testResult: 'FAILED',
        defectLog: 'High quiescent current 265mA exceeds 180mA ceiling. Pin 12 short detected.',
        clearanceCertificateNumber: null,
        certifiedAt: null,
        notes: 'Routed to rework bench for precision desoldering and inspection.',
        companyId: null,
        createdAt: new Date(Date.now() - 3600000 * 1),
        updatedAt: new Date(Date.now() - 3600000 * 1),
      },
    ];

    this.inMemoryFlashingLogs = [
      {
        id: 'fwl-seed-1',
        flashLogCode: 'FWL-2026-4401',
        deviceSerialNumber: 'DEV-IOT-2026-78210',
        macAddress: 'AA:BB:CC:11:22:33',
        workOrderNumber: 'WO-ELEC-2026-081',
        firmwareName: 'Industrial-Gateway-Core',
        firmwareVersion: 'v2.4.12-secure-boot',
        checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        flashStatus: 'SUCCESS',
        flashingStationId: 'STN-PROG-BAY-02',
        flashedAt: new Date(Date.now() - 3600000 * 5),
        operatorUsername: 'flash.station.alpha@plant.internal',
        notes: 'Hardware cryptographic key burned into eFuse block. Bootloader verified.',
        companyId: null,
        createdAt: new Date(Date.now() - 3600000 * 5),
        updatedAt: new Date(Date.now() - 3600000 * 5),
      },
      {
        id: 'fwl-seed-2',
        flashLogCode: 'FWL-2026-4402',
        deviceSerialNumber: 'DEV-IOT-2026-78211',
        macAddress: 'AA:BB:CC:11:22:34',
        workOrderNumber: 'WO-ELEC-2026-081',
        firmwareName: 'Industrial-Gateway-Core',
        firmwareVersion: 'v2.4.12-secure-boot',
        checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        flashStatus: 'SUCCESS',
        flashingStationId: 'STN-PROG-BAY-02',
        flashedAt: new Date(Date.now() - 3600000 * 2),
        operatorUsername: 'flash.station.alpha@plant.internal',
        notes: 'Hardware secure-boot signature valid. Cloud device provisioning key injected.',
        companyId: null,
        createdAt: new Date(Date.now() - 3600000 * 2),
        updatedAt: new Date(Date.now() - 3600000 * 2),
      },
    ];

    this.inMemoryEbomRecords = [
      {
        id: 'ebom-seed-1',
        ebomCode: 'EBOM-2026-MCU-STM32',
        assemblyPartNumber: 'ASSY-MAINBOARD-REV-C',
        componentPartNumber: 'STM32F407VGT6',
        componentCategory: 'Microcontroller / IC',
        lifecycleStatus: 'ACTIVE',
        substitutePartNumber: 'GD32F407VGT6',
        substituteApproved: true,
        ecoNumber: 'ECO-2026-019',
        ecoApprovedAt: new Date(Date.now() - 86400000 * 14),
        vendorName: 'STMicroelectronics / Arrow Electronics',
        leadTimeWeeks: 18,
        unitCostInr: 640.0,
        notes: 'Pin-compatible drop-in alternative qualified under ECO-2026-019.',
        companyId: null,
        createdAt: new Date(Date.now() - 86400000 * 14),
        updatedAt: new Date(Date.now() - 86400000 * 14),
      },
      {
        id: 'ebom-seed-2',
        ebomCode: 'EBOM-2026-REG-LM317',
        assemblyPartNumber: 'ASSY-POWER-SUPPLY-REV-B',
        componentPartNumber: 'LM317T/NOPB',
        componentCategory: 'Power Management IC',
        lifecycleStatus: 'NRND_NOT_RECOMMENDED_FOR_NEW_DESIGNS',
        substitutePartNumber: 'TPS7A4700RGWR',
        substituteApproved: false,
        ecoNumber: null,
        ecoApprovedAt: null,
        vendorName: 'Texas Instruments',
        leadTimeWeeks: 26,
        unitCostInr: 125.0,
        notes: 'Candidate LDO under qualification to improve power efficiency and ripple rejection.',
        companyId: null,
        createdAt: new Date(Date.now() - 86400000 * 5),
        updatedAt: new Date(Date.now() - 86400000 * 5),
      },
    ];

    this.inMemoryEsdAudits = [
      {
        id: 'esd-seed-1',
        auditCode: 'ESD-AUDIT-2026-301',
        auditDate: new Date(Date.now() - 86400000 * 1),
        cleanroomZone: 'Zone-A-SMT-Cleanroom-Class-10000',
        workstationNumber: 'WS-SMT-04',
        wristStrapResistanceOhms: 850000.0,
        matGroundResistanceOhms: 2400000.0,
        relativeHumidityPct: 48.5,
        temperatureCelsius: 22.1,
        particleCountIsoClass: 'ISO_CLASS_7',
        esdPackagingVerified: true,
        auditStatus: 'COMPLIANT',
        auditedByRole: 'ESD_CLEANROOM_COMPLIANCE_MANAGER',
        notes: 'Workstation mat earth-bonding resistance well within ANSI/ESD S20.20 thresholds.',
        companyId: null,
        createdAt: new Date(Date.now() - 86400000 * 1),
        updatedAt: new Date(Date.now() - 86400000 * 1),
      },
      {
        id: 'esd-seed-2',
        auditCode: 'ESD-AUDIT-2026-302',
        auditDate: new Date(),
        cleanroomZone: 'Zone-B-Through-Hole-Cleanroom',
        workstationNumber: 'WS-TH-02',
        wristStrapResistanceOhms: 920000.0,
        matGroundResistanceOhms: 3100000.0,
        relativeHumidityPct: 51.0,
        temperatureCelsius: 21.8,
        particleCountIsoClass: 'ISO_CLASS_7',
        esdPackagingVerified: true,
        auditStatus: 'COMPLIANT',
        auditedByRole: 'ESD_CLEANROOM_COMPLIANCE_MANAGER',
        notes: 'Ionizer blower decay time under 1.5 seconds. Anti-static shielding bags checked.',
        companyId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }
}
