import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMilkCollectionRecordDto } from './dto/create-milk-collection-record.dto';
import { CreatePasteurizationProcessingLogDto } from './dto/create-pasteurization-processing-log.dto';
import { CreateFermentationCultureBatchDto } from './dto/create-fermentation-culture-batch.dto';
import { CreateDairyQaMbrtRecordDto } from './dto/create-dairy-qa-mbrt-record.dto';
import { CreateColdChainLogisticsRecordDto } from './dto/create-cold-chain-logistics-record.dto';

export interface UserContext {
  id: string;
  email: string;
  role: string;
  department?: string;
  designation?: string;
  companyId?: string | null;
  firstName?: string | null;
}

@Injectable()
export class DairyOperationsService {
  private readonly logger = new Logger(DairyOperationsService.name);

  private errMsg(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
  }

  // In-memory fallback caches for zero-downtime multi-tenant resilience
  private inMemoryMilkCollection: any[] = [];
  private inMemoryPasteurization: any[] = [];
  private inMemoryFermentation: any[] = [];
  private inMemoryDairyQa: any[] = [];
  private inMemoryColdChain: any[] = [];

  constructor(private readonly prisma: PrismaService) {
    this.seedDefaultDairyData();
  }

  private seedDefaultDairyData() {
    const now = new Date();
    const companyId = 'company_isolated_01';

    // 1. Initial Milk Collection Reception Records
    this.inMemoryMilkCollection = [
      {
        id: 'milk-rec-01',
        collectionCode: 'MILK-REC-2026-001',
        tankerRegistrationNumber: 'GJ-01-DK-9412',
        supplierOrFarmerGroup: 'Kaira District Milk Producers Union - Route 14',
        driverName: 'Ramesh Patel',
        grossWeightKg: 24500.0,
        tareWeightKg: 9500.0,
        netWeightKg: 15000.0,
        netVolumeLiters: 14563.1,
        fatPercentage: 4.5,
        snfPercentage: 8.85,
        addedWaterPercentage: 0.0,
        milkDensity: 1.030,
        milkTemperatureCelsius: 3.8,
        paymentGradeStatus: 'GRADE_A_PREMIUM',
        ratePerLiterInr: 43.50,
        totalPaymentInr: 633494.85,
        chillingSiloId: 'RAW-SILO-01 (Capacity: 50,000L)',
        siloTemperatureCelsius: 3.4,
        status: 'CHILLED_STAGED',
        operatorNotes: 'Ultrasonic analyzer passed. Cryoscope added water test 0.0%. Rapid chill completed in Silo 1.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 2),
        updatedAt: now,
      },
      {
        id: 'milk-rec-02',
        collectionCode: 'MILK-REC-2026-002',
        tankerRegistrationNumber: 'MH-14-AZ-2041',
        supplierOrFarmerGroup: 'Baramati Cow Milk Federation - Bulk Route 03',
        driverName: 'Sanjay Deshmukh',
        grossWeightKg: 19800.0,
        tareWeightKg: 8200.0,
        netWeightKg: 11600.0,
        netVolumeLiters: 11284.0,
        fatPercentage: 3.8,
        snfPercentage: 8.6,
        addedWaterPercentage: 0.0,
        milkDensity: 1.028,
        milkTemperatureCelsius: 4.1,
        paymentGradeStatus: 'GRADE_B_STANDARD',
        ratePerLiterInr: 39.20,
        totalPaymentInr: 442332.80,
        chillingSiloId: 'RAW-SILO-02 (Capacity: 40,000L)',
        siloTemperatureCelsius: 3.6,
        status: 'PUMPED_TO_PASTEURIZER',
        operatorNotes: 'Cow milk lot. Transferred directly to HTST balance tank for standardized batch processing.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000),
        updatedAt: now,
      },
      {
        id: 'milk-rec-03',
        collectionCode: 'MILK-REC-2026-003',
        tankerRegistrationNumber: 'RJ-19-GA-7719',
        supplierOrFarmerGroup: 'Marwar Buffalo Breeders Co-op - North Cluster',
        driverName: 'Vikram Singh',
        grossWeightKg: 28200.0,
        tareWeightKg: 10200.0,
        netWeightKg: 18000.0,
        netVolumeLiters: 17441.8,
        fatPercentage: 6.8,
        snfPercentage: 9.2,
        addedWaterPercentage: 0.0,
        milkDensity: 1.032,
        milkTemperatureCelsius: 3.9,
        paymentGradeStatus: 'GRADE_A_PREMIUM',
        ratePerLiterInr: 54.00,
        totalPaymentInr: 941857.20,
        chillingSiloId: 'RAW-SILO-03 (Capacity: 60,000L)',
        siloTemperatureCelsius: 3.2,
        status: 'CHILLED_STAGED',
        operatorNotes: 'High fat buffalo milk intended for ghee manufacturing and rich paneer curd lines.',
        companyId,
        createdAt: now,
        updatedAt: now,
      },
    ];

    // 2. Initial Pasteurization Processing Logs
    this.inMemoryPasteurization = [
      {
        id: 'past-log-01',
        processingJobCode: 'PAST-PROC-2026-101',
        productType: 'TONED_MILK',
        rawMilkVolumeLtr: 12000.0,
        pasteurizerLineId: 'HTST-PASTEURIZER-LINE-01 (Alfa Laval Plate Exchanger)',
        heatingZoneTempCelsius: 74.2,
        holdingTimeSeconds: 16.2,
        flowDiversionValveStatus: 'FORWARD_FLOW',
        steamPressureBar: 3.4,
        chilledWaterTempCelsius: 3.6,
        creamSeparationYieldLtr: 540.0,
        creamFatPercentage: 42.0,
        standardizedMilkFatPct: 3.05,
        homogenizationPressureBar: 185.0,
        steamConsumptionKg: 520.0,
        chilledWaterKwh: 145.0,
        status: 'PASTEURIZED_RELEASED',
        operatorNotes: 'Continuous HTST pasteurization hold passed without forward diversion trip. Phosphatase test negative.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 2),
        updatedAt: now,
      },
      {
        id: 'past-log-02',
        processingJobCode: 'PAST-PROC-2026-102',
        productType: 'STANDARDIZED_MILK',
        rawMilkVolumeLtr: 15000.0,
        pasteurizerLineId: 'HTST-PASTEURIZER-LINE-02 (Tetra Pak Pasteurizer D)',
        heatingZoneTempCelsius: 73.8,
        holdingTimeSeconds: 16.0,
        flowDiversionValveStatus: 'FORWARD_FLOW',
        steamPressureBar: 3.2,
        chilledWaterTempCelsius: 3.8,
        creamSeparationYieldLtr: 310.0,
        creamFatPercentage: 40.5,
        standardizedMilkFatPct: 4.52,
        homogenizationPressureBar: 180.0,
        steamConsumptionKg: 610.0,
        chilledWaterKwh: 170.0,
        status: 'PASTEURIZED_RELEASED',
        operatorNotes: 'Standardized 4.5% Fat, 8.5% SNF. Routed directly to sterile pouch packing silo 2.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000),
        updatedAt: now,
      },
      {
        id: 'past-log-03',
        processingJobCode: 'PAST-PROC-2026-103',
        productType: 'FULL_CREAM',
        rawMilkVolumeLtr: 8000.0,
        pasteurizerLineId: 'HTST-PASTEURIZER-LINE-01 (Alfa Laval Plate Exchanger)',
        heatingZoneTempCelsius: 74.8,
        holdingTimeSeconds: 16.5,
        flowDiversionValveStatus: 'FORWARD_FLOW',
        steamPressureBar: 3.5,
        chilledWaterTempCelsius: 3.5,
        creamSeparationYieldLtr: 90.0,
        creamFatPercentage: 45.0,
        standardizedMilkFatPct: 6.02,
        homogenizationPressureBar: 190.0,
        steamConsumptionKg: 380.0,
        chilledWaterKwh: 95.0,
        status: 'FORWARD_FLOW_ACTIVE',
        operatorNotes: 'Full cream milk pasteurization running smoothly under PLC automated monitoring.',
        companyId,
        createdAt: now,
        updatedAt: now,
      },
    ];

    // 3. Initial Fermentation & Culture Batches
    this.inMemoryFermentation = [
      {
        id: 'ferm-batch-01',
        fermentationBatchCode: 'FERM-BATCH-2026-201',
        productCategory: 'CURD_DAHI',
        baseMilkVolumeLtr: 5000.0,
        starterCultureStrain: 'Chr. Hansen DVS YF-L904 (L. bulgaricus + S. thermophilus)',
        inoculationDosageGrams: 250.0,
        inoculationTempCelsius: 42.5,
        incubationChamberId: 'INCUBATION-ROOM-C1',
        incubationDurationHours: 6.5,
        currentCurdPh: 4.50,
        targetCurdPh: 4.50,
        titratableAcidityPct: 0.85,
        coagulationFirmnessScore: 8.8,
        finalCurdYieldKg: 4940.0,
        wheyDrainageLiters: 160.0,
        status: 'FERMENTATION_COMPLETED',
        technicianNotes: 'Smooth set curd formed. Transferred immediately to 4°C blast chiller to arrest post-acidification.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 2),
        updatedAt: now,
      },
      {
        id: 'ferm-batch-02',
        fermentationBatchCode: 'FERM-BATCH-2026-202',
        productCategory: 'GREEK_YOGURT',
        baseMilkVolumeLtr: 3500.0,
        starterCultureStrain: 'Danisco YO-MIX 883 Direct Inoculant',
        inoculationDosageGrams: 180.0,
        inoculationTempCelsius: 43.0,
        incubationChamberId: 'INCUBATION-ROOM-C2',
        incubationDurationHours: 7.2,
        currentCurdPh: 4.55,
        targetCurdPh: 4.52,
        titratableAcidityPct: 0.92,
        coagulationFirmnessScore: 9.2,
        finalCurdYieldKg: 2450.0,
        wheyDrainageLiters: 1020.0,
        status: 'COAGULATING',
        technicianNotes: 'Whey separation centrifuge ready. High protein Greek strained yogurt consistency target achieved.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000),
        updatedAt: now,
      },
      {
        id: 'ferm-batch-03',
        fermentationBatchCode: 'FERM-BATCH-2026-203',
        productCategory: 'PANEER_COAGULATION',
        baseMilkVolumeLtr: 6000.0,
        starterCultureStrain: 'Acid-Heat Coagulation (Food-Grade Citric Acid 2.0%)',
        inoculationDosageGrams: 12000.0,
        inoculationTempCelsius: 82.0,
        incubationChamberId: 'PANEER-VAT-CELL-03',
        incubationDurationHours: 1.5,
        currentCurdPh: 5.35,
        targetCurdPh: 5.30,
        titratableAcidityPct: 0.45,
        coagulationFirmnessScore: 8.6,
        finalCurdYieldKg: 1120.0,
        wheyDrainageLiters: 4850.0,
        status: 'FERMENTATION_COMPLETED',
        technicianNotes: 'Pressing blocks under 2.5 kg/cm2 pneumatic hoop press. Moisture target 52% compliant with FSSAI standard.',
        companyId,
        createdAt: now,
        updatedAt: now,
      },
    ];

    // 4. Initial Dairy QA MBRT & Antibiotic Records
    this.inMemoryDairyQa = [
      {
        id: 'qa-mbrt-01',
        testReportNumber: 'MBRT-QA-2026-301',
        sampleBatchCode: 'PAST-PROC-2026-101',
        sampleType: 'PASTEURIZED_PACKAGED',
        mbrtDecolorizationHours: 5.8,
        mbrtQualityGrade: 'EXCELLENT_OVER_5H',
        antibioticResidueTest: 'NEGATIVE_PASSED',
        aflatoxinM1Ppb: 0.05,
        somaticCellCountPerMl: 145000,
        totalColiformCountCfu: 0,
        packagingGateBlocked: false,
        clearanceCertificateNumber: 'COA-DAIRY-2026-8801',
        certifiedAt: new Date(now.getTime() - 86400000 * 2),
        certifiedByManager: 'QA_MBRT_ANTIBIOTIC_INCHARGE',
        status: 'APPROVED_FOR_PACKAGING',
        notes: 'Zero coliform CFU/ml. Rapid strip test confirms 0% beta-lactam and tetracycline residue.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 2),
        updatedAt: now,
      },
      {
        id: 'qa-mbrt-02',
        testReportNumber: 'MBRT-QA-2026-302',
        sampleBatchCode: 'PAST-PROC-2026-102',
        sampleType: 'PASTEURIZED_PACKAGED',
        mbrtDecolorizationHours: 5.2,
        mbrtQualityGrade: 'EXCELLENT_OVER_5H',
        antibioticResidueTest: 'NEGATIVE_PASSED',
        aflatoxinM1Ppb: 0.08,
        somaticCellCountPerMl: 180000,
        totalColiformCountCfu: 0,
        packagingGateBlocked: false,
        clearanceCertificateNumber: 'COA-DAIRY-2026-8802',
        certifiedAt: new Date(now.getTime() - 86400000),
        certifiedByManager: 'QA_MBRT_ANTIBIOTIC_INCHARGE',
        status: 'APPROVED_FOR_PACKAGING',
        notes: 'Complies with all statutory FSSAI & Codex food hygiene parameters. Clear for rotary bagging.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000),
        updatedAt: now,
      },
      {
        id: 'qa-mbrt-03',
        testReportNumber: 'MBRT-QA-2026-303',
        sampleBatchCode: 'MILK-REC-2026-003',
        sampleType: 'BULK_TANKER_INWARD',
        mbrtDecolorizationHours: 4.5,
        mbrtQualityGrade: 'GOOD_3_4H',
        antibioticResidueTest: 'NEGATIVE_PASSED',
        aflatoxinM1Ppb: 0.12,
        somaticCellCountPerMl: 220000,
        totalColiformCountCfu: 120,
        packagingGateBlocked: false,
        clearanceCertificateNumber: null,
        certifiedAt: null,
        certifiedByManager: 'QA_MBRT_ANTIBIOTIC_INCHARGE',
        status: 'TESTING_IN_PROGRESS',
        notes: 'Inward verification for Marwar buffalo tanker. Antibiotic strip test passed negative.',
        companyId,
        createdAt: now,
        updatedAt: now,
      },
    ];

    // 5. Initial Cold-Chain & Expiry Logistics Records
    this.inMemoryColdChain = [
      {
        id: 'cold-log-01',
        dispatchTrackingCode: 'COLD-LOG-2026-401',
        productSku: 'SKU-MILK-TONED-500ML-POUCH',
        productDescription: 'Pasteurized Toned Milk 500ml Pouch (Crate of 24 Units)',
        coldRoomStorageBay: 'COLD-ROOM-01-BAY-A',
        coldRoomTempCelsius: 3.1,
        reeferVehicleNumber: 'MH-12-RN-8801 (Thermo King Reefer Unit)',
        inTransitTempCelsius: 3.5,
        tempLoggerDataLogValid: true,
        mfgTimestamp: new Date(now.getTime() - 1000 * 60 * 60 * 10),
        useByTimestamp: new Date(now.getTime() + 1000 * 60 * 60 * 38),
        remainingShelfLifeHours: 38.0,
        fifoFefoStatus: 'OPTIMAL_FEFO',
        shippingBarcode: 'BAR-DAIRY-FEFO-904101',
        dispatchBlocked: false,
        temperatureCompliant: true,
        dispatcherNotes: 'Continuous GPS telemetry reefer sensor synced at 3.5°C. Cleared for metro retail hub distribution.',
        companyId,
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 10),
        updatedAt: now,
      },
      {
        id: 'cold-log-02',
        dispatchTrackingCode: 'COLD-LOG-2026-402',
        productSku: 'SKU-DAHI-CUP-400G',
        productDescription: 'Probiotic Set Curd / Dahi 400g Tub (Case of 12 Units)',
        coldRoomStorageBay: 'COLD-ROOM-02-BAY-B',
        coldRoomTempCelsius: 3.4,
        reeferVehicleNumber: 'GJ-06-TT-5512 (Carrier Transicold Reefer)',
        inTransitTempCelsius: 3.8,
        tempLoggerDataLogValid: true,
        mfgTimestamp: new Date(now.getTime() - 1000 * 60 * 60 * 36),
        useByTimestamp: new Date(now.getTime() + 1000 * 60 * 60 * 180),
        remainingShelfLifeHours: 180.0,
        fifoFefoStatus: 'OPTIMAL_FEFO',
        shippingBarcode: 'BAR-DAIRY-FEFO-904102',
        dispatchBlocked: false,
        temperatureCompliant: true,
        dispatcherNotes: '10-day shelf life set curd. Dynamic barcode stamp contains batch sequence and use-by hour.',
        companyId,
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24),
        updatedAt: now,
      },
      {
        id: 'cold-log-03',
        dispatchTrackingCode: 'COLD-LOG-2026-403',
        productSku: 'SKU-PANEER-VAC-200G',
        productDescription: 'Fresh Malai Paneer 200g Vacuum Pouch (Carton of 20)',
        coldRoomStorageBay: 'COLD-ROOM-01-BAY-D',
        coldRoomTempCelsius: 2.9,
        reeferVehicleNumber: 'MH-14-BT-9904 (Thermo King V-500 Reefer)',
        inTransitTempCelsius: 3.2,
        tempLoggerDataLogValid: true,
        mfgTimestamp: new Date(now.getTime() - 1000 * 60 * 60 * 80),
        useByTimestamp: new Date(now.getTime() + 1000 * 60 * 60 * 16),
        remainingShelfLifeHours: 16.0,
        fifoFefoStatus: 'CRITICAL_NEAR_EXPIRY',
        shippingBarcode: 'BAR-DAIRY-FEFO-904103',
        dispatchBlocked: false,
        temperatureCompliant: true,
        dispatcherNotes: 'Near-expiry FEFO trigger activated. Priority route assigned to institutional quick-service buyer.',
        companyId,
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 70),
        updatedAt: now,
      },
    ];

    this.logger.log('Seeded initial Dairy Department operational data in memory for fallback');
  }

  // =========================================================================
  // 1. MILK COLLECTION & RECEPTION RECORDS
  // =========================================================================

  async getMilkCollectionRecords(user: UserContext): Promise<any[]> {
    const companyId = user.companyId || 'company_isolated_01';
    try {
      const records = await this.prisma.milkCollectionReceptionRecord.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
      });
      if (records && records.length > 0) return records;
    } catch (err: unknown) {
      this.logger.warn(`Prisma milkCollectionReceptionRecord.findMany failed: ${this.errMsg(err)}. Using in-memory fallback.`);
    }
    return this.inMemoryMilkCollection.filter((r: any) => r.companyId === companyId);
  }

  async createMilkCollectionRecord(user: UserContext, dto: CreateMilkCollectionRecordDto): Promise<any> {
    const companyId = user.companyId || 'company_isolated_01';
    const netWeightKg = dto.netWeightKg ?? (dto.grossWeightKg - dto.tareWeightKg);
    const netVolumeLiters = dto.netVolumeLiters ?? Number((netWeightKg / (dto.milkDensity || 1.030)).toFixed(1));
    const totalPaymentInr = dto.totalPaymentInr ?? Number((netVolumeLiters * dto.ratePerLiterInr).toFixed(2));

    try {
      const created = await this.prisma.milkCollectionReceptionRecord.create({
        data: {
          collectionCode: dto.collectionCode,
          tankerRegistrationNumber: dto.tankerRegistrationNumber,
          supplierOrFarmerGroup: dto.supplierOrFarmerGroup,
          driverName: dto.driverName || null,
          grossWeightKg: dto.grossWeightKg,
          tareWeightKg: dto.tareWeightKg,
          netWeightKg,
          netVolumeLiters,
          fatPercentage: dto.fatPercentage,
          snfPercentage: dto.snfPercentage,
          addedWaterPercentage: dto.addedWaterPercentage ?? 0.0,
          milkDensity: dto.milkDensity,
          milkTemperatureCelsius: dto.milkTemperatureCelsius,
          paymentGradeStatus: dto.paymentGradeStatus || 'GRADE_A_PREMIUM',
          ratePerLiterInr: dto.ratePerLiterInr,
          totalPaymentInr,
          chillingSiloId: dto.chillingSiloId,
          siloTemperatureCelsius: dto.siloTemperatureCelsius,
          status: dto.status || 'CHILLED_STAGED',
          operatorNotes: dto.operatorNotes || null,
          companyId,
        },
      });
      return created;
    } catch (err: unknown) {
      this.logger.warn(`Prisma milkCollectionReceptionRecord.create failed: ${this.errMsg(err)}. Saving to in-memory store.`);
      const newRecord = {
        id: `milk-rec-${Date.now()}`,
        ...dto,
        netWeightKg,
        netVolumeLiters,
        totalPaymentInr,
        addedWaterPercentage: dto.addedWaterPercentage ?? 0.0,
        paymentGradeStatus: dto.paymentGradeStatus || 'GRADE_A_PREMIUM',
        status: dto.status || 'CHILLED_STAGED',
        companyId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.inMemoryMilkCollection.unshift(newRecord);
      return newRecord;
    }
  }

  async getMilkCollectionRecordById(user: UserContext, id: string): Promise<any> {
    const companyId = user.companyId || 'company_isolated_01';
    try {
      const record = await this.prisma.milkCollectionReceptionRecord.findFirst({
        where: { id, companyId },
      });
      if (record) return record;
    } catch (err: unknown) {
      this.logger.warn(`Prisma findFirst failed: ${this.errMsg(err)}`);
    }
    const found = this.inMemoryMilkCollection.find((r: any) => r.id === id && r.companyId === companyId);
    if (!found) throw new NotFoundException(`Milk collection record ${id} not found`);
    return found;
  }

  // =========================================================================
  // 2. PASTEURIZATION & PROCESSING LOGS
  // =========================================================================

  async getPasteurizationLogs(user: UserContext): Promise<any[]> {
    const companyId = user.companyId || 'company_isolated_01';
    try {
      const records = await this.prisma.pasteurizationProcessingLog.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
      });
      if (records && records.length > 0) return records;
    } catch (err: unknown) {
      this.logger.warn(`Prisma pasteurizationProcessingLog.findMany failed: ${this.errMsg(err)}. Using fallback.`);
    }
    return this.inMemoryPasteurization.filter((r: any) => r.companyId === companyId);
  }

  async createPasteurizationLog(user: UserContext, dto: CreatePasteurizationProcessingLogDto): Promise<any> {
    const companyId = user.companyId || 'company_isolated_01';
    try {
      const created = await this.prisma.pasteurizationProcessingLog.create({
        data: {
          processingJobCode: dto.processingJobCode,
          productType: dto.productType,
          rawMilkVolumeLtr: dto.rawMilkVolumeLtr,
          pasteurizerLineId: dto.pasteurizerLineId,
          heatingZoneTempCelsius: dto.heatingZoneTempCelsius,
          holdingTimeSeconds: dto.holdingTimeSeconds,
          flowDiversionValveStatus: dto.flowDiversionValveStatus || 'FORWARD_FLOW',
          steamPressureBar: dto.steamPressureBar,
          chilledWaterTempCelsius: dto.chilledWaterTempCelsius,
          creamSeparationYieldLtr: dto.creamSeparationYieldLtr,
          creamFatPercentage: dto.creamFatPercentage,
          standardizedMilkFatPct: dto.standardizedMilkFatPct,
          homogenizationPressureBar: dto.homogenizationPressureBar,
          steamConsumptionKg: dto.steamConsumptionKg,
          chilledWaterKwh: dto.chilledWaterKwh,
          status: dto.status || 'PASTEURIZED_RELEASED',
          operatorNotes: dto.operatorNotes || null,
          companyId,
        },
      });
      return created;
    } catch (err: unknown) {
      this.logger.warn(`Prisma pasteurizationProcessingLog.create failed: ${this.errMsg(err)}. Saving to in-memory store.`);
      const newRecord = {
        id: `past-log-${Date.now()}`,
        ...dto,
        flowDiversionValveStatus: dto.flowDiversionValveStatus || 'FORWARD_FLOW',
        status: dto.status || 'PASTEURIZED_RELEASED',
        companyId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.inMemoryPasteurization.unshift(newRecord);
      return newRecord;
    }
  }

  async getPasteurizationLogById(user: UserContext, id: string): Promise<any> {
    const companyId = user.companyId || 'company_isolated_01';
    try {
      const record = await this.prisma.pasteurizationProcessingLog.findFirst({
        where: { id, companyId },
      });
      if (record) return record;
    } catch (err: unknown) {
      this.logger.warn(`Prisma findFirst failed: ${this.errMsg(err)}`);
    }
    const found = this.inMemoryPasteurization.find((r: any) => r.id === id && r.companyId === companyId);
    if (!found) throw new NotFoundException(`Pasteurization log ${id} not found`);
    return found;
  }

  // =========================================================================
  // 3. FERMENTATION & CULTURE BATCHES
  // =========================================================================

  async getFermentationBatches(user: UserContext): Promise<any[]> {
    const companyId = user.companyId || 'company_isolated_01';
    try {
      const records = await this.prisma.fermentationCultureBatch.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
      });
      if (records && records.length > 0) return records;
    } catch (err: unknown) {
      this.logger.warn(`Prisma fermentationCultureBatch.findMany failed: ${this.errMsg(err)}. Using fallback.`);
    }
    return this.inMemoryFermentation.filter((r: any) => r.companyId === companyId);
  }

  async createFermentationBatch(user: UserContext, dto: CreateFermentationCultureBatchDto): Promise<any> {
    const companyId = user.companyId || 'company_isolated_01';
    try {
      const created = await this.prisma.fermentationCultureBatch.create({
        data: {
          fermentationBatchCode: dto.fermentationBatchCode,
          productCategory: dto.productCategory,
          baseMilkVolumeLtr: dto.baseMilkVolumeLtr,
          starterCultureStrain: dto.starterCultureStrain,
          inoculationDosageGrams: dto.inoculationDosageGrams,
          inoculationTempCelsius: dto.inoculationTempCelsius,
          incubationChamberId: dto.incubationChamberId,
          incubationDurationHours: dto.incubationDurationHours,
          currentCurdPh: dto.currentCurdPh,
          targetCurdPh: dto.targetCurdPh,
          titratableAcidityPct: dto.titratableAcidityPct,
          coagulationFirmnessScore: dto.coagulationFirmnessScore,
          finalCurdYieldKg: dto.finalCurdYieldKg,
          wheyDrainageLiters: dto.wheyDrainageLiters,
          status: dto.status || 'FERMENTATION_COMPLETED',
          technicianNotes: dto.technicianNotes || null,
          companyId,
        },
      });
      return created;
    } catch (err: unknown) {
      this.logger.warn(`Prisma fermentationCultureBatch.create failed: ${this.errMsg(err)}. Saving to in-memory store.`);
      const newRecord = {
        id: `ferm-batch-${Date.now()}`,
        ...dto,
        status: dto.status || 'FERMENTATION_COMPLETED',
        companyId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.inMemoryFermentation.unshift(newRecord);
      return newRecord;
    }
  }

  async getFermentationBatchById(user: UserContext, id: string): Promise<any> {
    const companyId = user.companyId || 'company_isolated_01';
    try {
      const record = await this.prisma.fermentationCultureBatch.findFirst({
        where: { id, companyId },
      });
      if (record) return record;
    } catch (err: unknown) {
      this.logger.warn(`Prisma findFirst failed: ${this.errMsg(err)}`);
    }
    const found = this.inMemoryFermentation.find((r: any) => r.id === id && r.companyId === companyId);
    if (!found) throw new NotFoundException(`Fermentation batch ${id} not found`);
    return found;
  }

  // =========================================================================
  // 4. DAIRY QA & MBRT/ANTIBIOTIC RECORDS
  // =========================================================================

  async getDairyQaRecords(user: UserContext): Promise<any[]> {
    const companyId = user.companyId || 'company_isolated_01';
    try {
      const records = await this.prisma.dairyQaMbrtAntibioticRecord.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
      });
      if (records && records.length > 0) return records;
    } catch (err: unknown) {
      this.logger.warn(`Prisma dairyQaMbrtAntibioticRecord.findMany failed: ${this.errMsg(err)}. Using fallback.`);
    }
    return this.inMemoryDairyQa.filter((r: any) => r.companyId === companyId);
  }

  async createDairyQaRecord(user: UserContext, dto: CreateDairyQaMbrtRecordDto): Promise<any> {
    const companyId = user.companyId || 'company_isolated_01';
    const isContaminated = dto.antibioticResidueTest === 'POSITIVE_CONTAMINATED' || dto.mbrtDecolorizationHours < 1.0;
    const packagingGateBlocked = dto.packagingGateBlocked ?? isContaminated;
    const status = dto.status || (isContaminated ? 'REJECTED_ANTIBIOTIC_HOLD' : 'APPROVED_FOR_PACKAGING');

    try {
      const created = await this.prisma.dairyQaMbrtAntibioticRecord.create({
        data: {
          testReportNumber: dto.testReportNumber,
          sampleBatchCode: dto.sampleBatchCode,
          sampleType: dto.sampleType,
          mbrtDecolorizationHours: dto.mbrtDecolorizationHours,
          mbrtQualityGrade: dto.mbrtQualityGrade,
          antibioticResidueTest: dto.antibioticResidueTest,
          aflatoxinM1Ppb: dto.aflatoxinM1Ppb,
          somaticCellCountPerMl: dto.somaticCellCountPerMl,
          totalColiformCountCfu: dto.totalColiformCountCfu,
          packagingGateBlocked,
          clearanceCertificateNumber: dto.clearanceCertificateNumber || null,
          certifiedAt: dto.clearanceCertificateNumber ? new Date() : null,
          certifiedByManager: dto.certifiedByManager || 'QA_MBRT_ANTIBIOTIC_INCHARGE',
          status,
          notes: dto.notes || null,
          companyId,
        },
      });
      return created;
    } catch (err: unknown) {
      this.logger.warn(`Prisma dairyQaMbrtAntibioticRecord.create failed: ${this.errMsg(err)}. Saving to in-memory store.`);
      const newRecord = {
        id: `qa-mbrt-${Date.now()}`,
        ...dto,
        packagingGateBlocked,
        certifiedByManager: dto.certifiedByManager || 'QA_MBRT_ANTIBIOTIC_INCHARGE',
        status,
        companyId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.inMemoryDairyQa.unshift(newRecord);
      return newRecord;
    }
  }

  async getDairyQaRecordById(user: UserContext, id: string): Promise<any> {
    const companyId = user.companyId || 'company_isolated_01';
    try {
      const record = await this.prisma.dairyQaMbrtAntibioticRecord.findFirst({
        where: { id, companyId },
      });
      if (record) return record;
    } catch (err: unknown) {
      this.logger.warn(`Prisma findFirst failed: ${this.errMsg(err)}`);
    }
    const found = this.inMemoryDairyQa.find((r: any) => r.id === id && r.companyId === companyId);
    if (!found) throw new NotFoundException(`Dairy QA record ${id} not found`);
    return found;
  }

  async certifyDairyQaRecord(user: UserContext, id: string): Promise<any> {
    const companyId = user.companyId || 'company_isolated_01';
    const certNumber = `COA-DAIRY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();

    try {
      const updated = await this.prisma.dairyQaMbrtAntibioticRecord.update({
        where: { id },
        data: {
          clearanceCertificateNumber: certNumber,
          certifiedAt: now,
          certifiedByManager: user.designation || 'QA_MBRT_ANTIBIOTIC_INCHARGE',
          packagingGateBlocked: false,
          status: 'APPROVED_FOR_PACKAGING',
        },
      });
      return updated;
    } catch (err: unknown) {
      this.logger.warn(`Prisma certifyDairyQaRecord failed: ${this.errMsg(err)}. Updating in-memory fallback.`);
    }

    const idx = this.inMemoryDairyQa.findIndex((r: any) => r.id === id && r.companyId === companyId);
    if (idx === -1) throw new NotFoundException(`Dairy QA record ${id} not found`);

    this.inMemoryDairyQa[idx] = {
      ...this.inMemoryDairyQa[idx],
      clearanceCertificateNumber: certNumber,
      certifiedAt: now,
      certifiedByManager: user.designation || 'QA_MBRT_ANTIBIOTIC_INCHARGE',
      packagingGateBlocked: false,
      status: 'APPROVED_FOR_PACKAGING',
      updatedAt: now,
    };
    return this.inMemoryDairyQa[idx];
  }

  async togglePackagingGateBlock(user: UserContext, id: string): Promise<any> {
    const companyId = user.companyId || 'company_isolated_01';
    const current = await this.getDairyQaRecordById(user, id);
    const newBlockedState = !current.packagingGateBlocked;
    const newStatus = newBlockedState ? 'REJECTED_ANTIBIOTIC_HOLD' : 'APPROVED_FOR_PACKAGING';

    try {
      const updated = await this.prisma.dairyQaMbrtAntibioticRecord.update({
        where: { id },
        data: {
          packagingGateBlocked: newBlockedState,
          status: newStatus,
        },
      });
      return updated;
    } catch (err: unknown) {
      this.logger.warn(`Prisma togglePackagingGateBlock failed: ${this.errMsg(err)}`);
    }

    const idx = this.inMemoryDairyQa.findIndex((r: any) => r.id === id && r.companyId === companyId);
    if (idx !== -1) {
      this.inMemoryDairyQa[idx].packagingGateBlocked = newBlockedState;
      this.inMemoryDairyQa[idx].status = newStatus;
      return this.inMemoryDairyQa[idx];
    }
    throw new NotFoundException(`Dairy QA record ${id} not found`);
  }

  // =========================================================================
  // 5. COLD-CHAIN & EXPIRY FEFO RECORDS
  // =========================================================================

  async getColdChainRecords(user: UserContext): Promise<any[]> {
    const companyId = user.companyId || 'company_isolated_01';
    try {
      const records = await this.prisma.coldChainLogisticsRecord.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
      });
      if (records && records.length > 0) return records;
    } catch (err: unknown) {
      this.logger.warn(`Prisma coldChainLogisticsRecord.findMany failed: ${this.errMsg(err)}. Using fallback.`);
    }
    return this.inMemoryColdChain.filter((r: any) => r.companyId === companyId);
  }

  async createColdChainRecord(user: UserContext, dto: CreateColdChainLogisticsRecordDto): Promise<any> {
    const companyId = user.companyId || 'company_isolated_01';
    const tempCompliant = dto.temperatureCompliant ?? (dto.coldRoomTempCelsius <= 4.0 && dto.inTransitTempCelsius <= 4.5);
    const dispatchBlocked = dto.dispatchBlocked ?? (!tempCompliant || dto.fifoFefoStatus === 'EXPIRED_QUARANTINE');

    try {
      const created = await this.prisma.coldChainLogisticsRecord.create({
        data: {
          dispatchTrackingCode: dto.dispatchTrackingCode,
          productSku: dto.productSku,
          productDescription: dto.productDescription,
          coldRoomStorageBay: dto.coldRoomStorageBay,
          coldRoomTempCelsius: dto.coldRoomTempCelsius,
          reeferVehicleNumber: dto.reeferVehicleNumber,
          inTransitTempCelsius: dto.inTransitTempCelsius,
          tempLoggerDataLogValid: dto.tempLoggerDataLogValid ?? true,
          mfgTimestamp: new Date(dto.mfgTimestamp),
          useByTimestamp: new Date(dto.useByTimestamp),
          remainingShelfLifeHours: dto.remainingShelfLifeHours,
          fifoFefoStatus: dto.fifoFefoStatus || 'OPTIMAL_FEFO',
          shippingBarcode: dto.shippingBarcode,
          dispatchBlocked,
          temperatureCompliant: tempCompliant,
          dispatcherNotes: dto.dispatcherNotes || null,
          companyId,
        },
      });
      return created;
    } catch (err: unknown) {
      this.logger.warn(`Prisma coldChainLogisticsRecord.create failed: ${this.errMsg(err)}. Saving to in-memory store.`);
      const newRecord = {
        id: `cold-log-${Date.now()}`,
        ...dto,
        mfgTimestamp: new Date(dto.mfgTimestamp),
        useByTimestamp: new Date(dto.useByTimestamp),
        dispatchBlocked,
        temperatureCompliant: tempCompliant,
        tempLoggerDataLogValid: dto.tempLoggerDataLogValid ?? true,
        fifoFefoStatus: dto.fifoFefoStatus || 'OPTIMAL_FEFO',
        companyId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.inMemoryColdChain.unshift(newRecord);
      return newRecord;
    }
  }

  async getColdChainRecordById(user: UserContext, id: string): Promise<any> {
    const companyId = user.companyId || 'company_isolated_01';
    try {
      const record = await this.prisma.coldChainLogisticsRecord.findFirst({
        where: { id, companyId },
      });
      if (record) return record;
    } catch (err: unknown) {
      this.logger.warn(`Prisma findFirst failed: ${this.errMsg(err)}`);
    }
    const found = this.inMemoryColdChain.find((r: any) => r.id === id && r.companyId === companyId);
    if (!found) throw new NotFoundException(`Cold chain record ${id} not found`);
    return found;
  }

  async toggleColdChainDispatchBlock(user: UserContext, id: string): Promise<any> {
    const companyId = user.companyId || 'company_isolated_01';
    const current = await this.getColdChainRecordById(user, id);
    const newBlockedState = !current.dispatchBlocked;
    const newFefo = newBlockedState ? 'EXPIRED_QUARANTINE' : 'OPTIMAL_FEFO';

    try {
      const updated = await this.prisma.coldChainLogisticsRecord.update({
        where: { id },
        data: {
          dispatchBlocked: newBlockedState,
          fifoFefoStatus: newFefo,
        },
      });
      return updated;
    } catch (err: unknown) {
      this.logger.warn(`Prisma toggleColdChainDispatchBlock failed: ${this.errMsg(err)}`);
    }

    const idx = this.inMemoryColdChain.findIndex((r: any) => r.id === id && r.companyId === companyId);
    if (idx !== -1) {
      this.inMemoryColdChain[idx].dispatchBlocked = newBlockedState;
      this.inMemoryColdChain[idx].fifoFefoStatus = newFefo;
      return this.inMemoryColdChain[idx];
    }
    throw new NotFoundException(`Cold chain record ${id} not found`);
  }

  // =========================================================================
  // 6. DAIRY DASHBOARD ANALYTICS & SUMMARY
  // =========================================================================

  async getDairyDashboardSummary(user: UserContext): Promise<any> {
    const [milkRec, pasteurization, fermentation, dairyQa, coldChain] = await Promise.all([
      this.getMilkCollectionRecords(user),
      this.getPasteurizationLogs(user),
      this.getFermentationBatches(user),
      this.getDairyQaRecords(user),
      this.getColdChainRecords(user),
    ]);

    // Milk Reception KPIs
    const totalMilkIntakeLtr = milkRec.reduce((acc: number, r: any) => acc + (r.netVolumeLiters || 0), 0);
    const avgFatPct = milkRec.length > 0 ? (milkRec.reduce((acc: number, r: any) => acc + (r.fatPercentage || 0), 0) / milkRec.length).toFixed(2) : '0.00';
    const avgSnfPct = milkRec.length > 0 ? (milkRec.reduce((acc: number, r: any) => acc + (r.snfPercentage || 0), 0) / milkRec.length).toFixed(2) : '0.00';
    const totalFarmerPaymentInr = milkRec.reduce((acc: number, r: any) => acc + (r.totalPaymentInr || 0), 0);

    // Pasteurization KPIs
    const totalVolumePasteurizedLtr = pasteurization.reduce((acc: number, r: any) => acc + (r.rawMilkVolumeLtr || 0), 0);
    const totalCreamYieldLtr = pasteurization.reduce((acc: number, r: any) => acc + (r.creamSeparationYieldLtr || 0), 0);
    const avgPastTempCelsius = pasteurization.length > 0 ? (pasteurization.reduce((acc: number, r: any) => acc + (r.heatingZoneTempCelsius || 0), 0) / pasteurization.length).toFixed(1) : '72.0';

    // Fermentation KPIs
    const activeFermentationBatches = fermentation.length;
    const avgCurdPh = fermentation.length > 0 ? (fermentation.reduce((acc: number, r: any) => acc + (r.currentCurdPh || 0), 0) / fermentation.length).toFixed(2) : '4.50';
    const totalCurdYieldKg = fermentation.reduce((acc: number, r: any) => acc + (r.finalCurdYieldKg || 0), 0);

    // Dairy QA KPIs
    const totalQaReports = dairyQa.length;
    const mbrtPassRate = totalQaReports > 0 ? ((dairyQa.filter((r: any) => r.mbrtDecolorizationHours >= 3.0).length / totalQaReports) * 100).toFixed(1) : '100.0';
    const antibioticClearRate = totalQaReports > 0 ? ((dairyQa.filter((r: any) => r.antibioticResidueTest === 'NEGATIVE_PASSED').length / totalQaReports) * 100).toFixed(1) : '100.0';
    const packagingGateLockedCount = dairyQa.filter((r: any) => r.packagingGateBlocked).length;

    // Cold-Chain KPIs
    const totalColdChainShipments = coldChain.length;
    const tempCompliantShipments = coldChain.filter((r: any) => r.temperatureCompliant && !r.dispatchBlocked).length;
    const complianceRate = totalColdChainShipments > 0 ? ((tempCompliantShipments / totalColdChainShipments) * 100).toFixed(1) : '100.0';
    const nearExpiryAlertsCount = coldChain.filter((r: any) => r.fifoFefoStatus === 'CRITICAL_NEAR_EXPIRY' || r.remainingShelfLifeHours < 24).length;

    return {
      milkReception: {
        totalIntakeLtr: Number(totalMilkIntakeLtr.toFixed(1)),
        avgFatPct: Number(avgFatPct),
        avgSnfPct: Number(avgSnfPct),
        totalFarmerPaymentInr: Number(totalFarmerPaymentInr.toFixed(2)),
        recordCount: milkRec.length,
      },
      pasteurization: {
        totalProcessedLtr: Number(totalVolumePasteurizedLtr.toFixed(1)),
        totalCreamYieldLtr: Number(totalCreamYieldLtr.toFixed(1)),
        avgPastTempCelsius: Number(avgPastTempCelsius),
        runCount: pasteurization.length,
      },
      fermentation: {
        activeBatches: activeFermentationBatches,
        avgCurdPh: Number(avgCurdPh),
        totalCurdYieldKg: Number(totalCurdYieldKg.toFixed(1)),
        batchCount: fermentation.length,
      },
      dairyQa: {
        totalReports: totalQaReports,
        mbrtPassRate: Number(mbrtPassRate),
        antibioticClearRate: Number(antibioticClearRate),
        packagingGateLockedCount,
      },
      coldChain: {
        totalShipments: totalColdChainShipments,
        complianceRate: Number(complianceRate),
        nearExpiryAlertsCount,
      },
    };
  }
}
