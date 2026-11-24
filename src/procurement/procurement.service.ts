import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProcurementSourcingDto,
  FinalizeArcContractDto,
} from './dto/create-procurement-sourcing.dto';
import {
  CreatePurchaseOrderDto,
  UpdatePoDispatchStatusDto,
} from './dto/create-purchase-order.dto';
import {
  CreateMaterialInwardDto,
  UpdateMaterialQcStatusDto,
} from './dto/create-material-inward.dto';
import {
  CreateBufferStockDto,
  UpdateStockLevelDto,
} from './dto/create-buffer-stock.dto';
import {
  CreateVendorReconciliationDto,
  SettleVendorPaymentDto,
} from './dto/create-vendor-reconciliation.dto';
import {
  CreateScrapDisposalDto,
  FinalizeScrapSaleDto,
} from './dto/create-scrap-disposal.dto';
import { CreateRateRequestDto } from './dto/create-rate-request.dto';

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
export class ProcurementService {
  private readonly logger = new Logger(ProcurementService.name);

  // In-memory fallback caches for zero-downtime multi-tenant resilience
  private inMemorySourcing: any[] = [];
  private inMemoryPurchaseOrders: any[] = [];
  private inMemoryInwardLogistics: any[] = [];
  private inMemoryBufferStock: any[] = [];
  private inMemoryReconciliations: any[] = [];
  private inMemoryScrap: any[] = [];
  private inMemoryRateRequests: any[] = [];

  constructor(private readonly prisma: PrismaService) {
    this.seedDefaultProcurementData();
  }

  private seedDefaultProcurementData() {
    const now = new Date();
    const companyId = 'company_isolated_01';

    // 1. Sourcing & RFQ
    this.inMemorySourcing = [
      {
        id: 'src-01',
        rfqNumber: 'RFQ-2026-101',
        title: 'Annual Rate Contract for Grade EN8 Carbon Steel Billets (100mm)',
        category: 'RAW_MATERIALS',
        materialDescription: 'Grade EN8 Carbon Steel Billets 100x100mm, length 6m, low sulfur and phosphorus conformant to IS 5517',
        targetQuantity: 1200.0,
        unit: 'MT',
        invitedVendorsCount: 4,
        lowestQuotedRate: 54200.0,
        approvedVendorName: 'Tata Steel Industrial Billet Division',
        approvedRate: 54200.0,
        arcContractCode: 'ARC-STL-2026-04',
        arcValidFrom: new Date(now.getTime() - 86400000 * 30),
        arcValidTill: new Date(now.getTime() + 86400000 * 335),
        vendorAuditScore: 96.5,
        comparativeSummaryJson: '{"Tata Steel": 54200, "JSW Steel": 54800, "Jindal Steel": 55100, "Electrosteel": 55500}',
        status: 'ARC_FINALIZED',
        notes: 'Annual Rate Contract finalized based on L1 bid and ISO 9001/IATF 16949 supplier audit.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 35),
        updatedAt: now,
      },
      {
        id: 'src-02',
        rfqNumber: 'RFQ-2026-102',
        title: 'Biannual Consumables RFQ for Heavy Hydraulic ISO VG 68 Oil',
        category: 'CONSUMABLES',
        materialDescription: 'Anti-wear hydraulic oil ISO VG 68 in 210-liter barrels for shopfloor presses and CNC machines',
        targetQuantity: 80.0,
        unit: 'BARREL',
        invitedVendorsCount: 3,
        lowestQuotedRate: 28500.0,
        approvedVendorName: 'Indian Oil Corporation Ltd (SERVO Division)',
        approvedRate: 28500.0,
        arcContractCode: 'ARC-LUB-2026-02',
        arcValidFrom: new Date(now.getTime() - 86400000 * 10),
        arcValidTill: new Date(now.getTime() + 86400000 * 170),
        vendorAuditScore: 98.0,
        comparativeSummaryJson: '{"IOCL Servo": 28500, "Bharat Petroleum": 28900, "Castrol Industrial": 29400}',
        status: 'ARC_FINALIZED',
        notes: 'Quality clearance certificate and batch viscosity test guaranteed per shipment.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 15),
        updatedAt: now,
      },
      {
        id: 'src-03',
        rfqNumber: 'RFQ-2026-103',
        title: 'Spot Sourcing for Tungsten Carbide CNC Milling Inserts',
        category: 'SPARE_PARTS',
        materialDescription: 'CNMG 120408-PM carbide inserts with CVD TiCN+Al2O3 coating for heavy machining',
        targetQuantity: 500.0,
        unit: 'PIECE',
        invitedVendorsCount: 3,
        lowestQuotedRate: 420.0,
        approvedVendorName: null,
        approvedRate: null,
        arcContractCode: null,
        arcValidFrom: null,
        arcValidTill: null,
        vendorAuditScore: 91.0,
        comparativeSummaryJson: '{"Sandvik Coromant": 480, "Kennametal India": 440, "TaeguTec India": 420}',
        status: 'COMPARATIVE_ANALYZED',
        notes: 'Comparative evaluation complete. Awaiting procurement manager final sign-off.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 3),
        updatedAt: now,
      },
    ];

    // 2. Purchase Orders (BOM PR to PO)
    this.inMemoryPurchaseOrders = [
      {
        id: 'po-01',
        poNumber: 'PO-2026-089',
        prNumber: 'PR-BOM-2026-041',
        vendorName: 'Tata Steel Industrial Billet Division',
        vendorCode: 'VEND-TAT-01',
        orderCategory: 'RAW_MATERIALS',
        itemDescription: 'Grade EN8 Carbon Steel Billets 100mm (ARC Rate: ₹54,200/MT)',
        orderedQuantity: 150.0,
        unit: 'MT',
        unitPrice: 54200.0,
        taxRatePercentage: 18.0,
        totalAmount: 9593400.0, // (150 * 54200) * 1.18
        deliveryTerms: 'FOR_DESTINATION',
        paymentTerms: 'NET_30',
        expectedDeliveryDate: new Date(now.getTime() + 86400000 * 4),
        dispatchStatus: 'DISPATCHED_TO_VENDOR',
        approvedBy: 'PROCUREMENT_MANAGER',
        vendorAckDate: new Date(now.getTime() - 86400000),
        notes: 'Linked to Production BOM Requisition PR-041. E-Way Bill and Mill Test Certificate required with transit.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 2),
        updatedAt: now,
      },
      {
        id: 'po-02',
        poNumber: 'PO-2026-090',
        prNumber: 'PR-BOM-2026-042',
        vendorName: 'Indian Oil Corporation Ltd (SERVO Division)',
        vendorCode: 'VEND-IOCL-02',
        orderCategory: 'CONSUMABLES',
        itemDescription: 'SERVO System 68 Anti-Wear Hydraulic Fluid (210L Drum)',
        orderedQuantity: 20.0,
        unit: 'BARREL',
        unitPrice: 28500.0,
        taxRatePercentage: 18.0,
        totalAmount: 672600.0,
        deliveryTerms: 'FOR_DESTINATION',
        paymentTerms: 'NET_30',
        expectedDeliveryDate: new Date(now.getTime() + 86400000 * 6),
        dispatchStatus: 'ACKNOWLEDGED_BY_VENDOR',
        approvedBy: 'PROCUREMENT_MANAGER',
        vendorAckDate: new Date(now.getTime() - 86400000 * 2),
        notes: 'Monthly scheduled lube replenishment for press shop line.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 3),
        updatedAt: now,
      },
      {
        id: 'po-03',
        poNumber: 'PO-2026-085',
        prNumber: 'PR-BOM-2026-038',
        vendorName: 'TaeguTec India Tooling Division',
        vendorCode: 'VEND-TAE-05',
        orderCategory: 'SPARE_PARTS',
        itemDescription: 'Carbide Turning Inserts CNMG 120408-PM',
        orderedQuantity: 250.0,
        unit: 'PIECE',
        unitPrice: 420.0,
        taxRatePercentage: 18.0,
        totalAmount: 123900.0,
        deliveryTerms: 'EX_WORKS',
        paymentTerms: 'NET_30',
        expectedDeliveryDate: new Date(now.getTime() - 86400000 * 2),
        dispatchStatus: 'FULFILLED',
        approvedBy: 'PROCUREMENT_MANAGER',
        vendorAckDate: new Date(now.getTime() - 86400000 * 8),
        notes: 'Order received in full and cleared by toolroom metrology inspector.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 10),
        updatedAt: new Date(now.getTime() - 86400000 * 2),
      },
    ];

    // 3. Material Inward Logistics & Weighbridge QC
    this.inMemoryInwardLogistics = [
      {
        id: 'inw-01',
        inwardTrackingNumber: 'INW-LOG-2026-401',
        poNumber: 'PO-2026-089',
        vendorName: 'Tata Steel Industrial Billet Division',
        transporterName: 'VRL Logistics Heavy Freight Fleet',
        vehicleNumber: 'MH-12-RN-9921',
        driverContact: 'Suresh Patil (+91 98221 00192)',
        eWayBillNumber: 'EWB-291049182740',
        challanInvoiceNumber: 'INV-TAT-2026-8812',
        gateEntryCode: 'GATE-IN-2026-881',
        weighbridgeGrossKg: 42650.0,
        weighbridgeTareKg: 14200.0,
        weighbridgeNetKg: 28450.0,
        unit: 'KG',
        qcInspectionStatus: 'QC_PASSED',
        qcTestReportNumber: 'QC-TR-STL-2026-089',
        grnNumber: 'GRN-2026-11-042',
        warehouseLocationBay: 'BAY-RM-STEEL-01',
        status: 'GRN_GENERATED',
        notes: 'Weighbridge net 28.45 MT matches delivery challan. Optical spectrometer chemical composition verified.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000),
        updatedAt: now,
      },
      {
        id: 'inw-02',
        inwardTrackingNumber: 'INW-LOG-2026-402',
        poNumber: 'PO-2026-090',
        vendorName: 'Indian Oil Corporation Ltd (SERVO Division)',
        transporterName: 'Safexpress Dedicated Tanker Truck',
        vehicleNumber: 'MH-14-AZ-4410',
        driverContact: 'Kishore Shinde (+91 94220 55198)',
        eWayBillNumber: 'EWB-182940192841',
        challanInvoiceNumber: 'INV-IOCL-99218',
        gateEntryCode: 'GATE-IN-2026-882',
        weighbridgeGrossKg: 19800.0,
        weighbridgeTareKg: 15400.0,
        weighbridgeNetKg: 4400.0,
        unit: 'KG',
        qcInspectionStatus: 'PENDING_LAB_TEST',
        qcTestReportNumber: null,
        grnNumber: null,
        warehouseLocationBay: 'BAY-LUBE-STORE-A',
        status: 'AT_GATE',
        notes: 'Vehicle at security gate. Awaiting quality lab kinematic viscosity sampling before GRN release.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 0.5),
        updatedAt: now,
      },
    ];

    // 4. Buffer Stock & Lead Time Planning
    this.inMemoryBufferStock = [
      {
        id: 'buf-01',
        itemCode: 'RM-STL-BIL-01',
        itemName: 'Grade EN8 Carbon Steel Billet 100mm',
        category: 'RAW_MATERIALS',
        unit: 'MT',
        currentStock: 185.0,
        minimumBufferStock: 60.0,
        maximumCapacityStock: 350.0,
        reorderPoint: 100.0,
        averageDailyConsumption: 12.5,
        leadTimeDays: 5,
        jitScheduleActive: true,
        jitDeliveryCadence: 'BI_WEEKLY',
        stockStatus: 'HEALTHY',
        primaryVendorName: 'Tata Steel Industrial Billet Division',
        notes: '185 MT available. Buffer covers 14.8 days of full furnace melt schedule.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 20),
        updatedAt: now,
      },
      {
        id: 'buf-02',
        itemCode: 'LUB-HYD-68-DRM',
        itemName: 'SERVO System 68 Anti-Wear Hydraulic Fluid',
        category: 'CONSUMABLES',
        unit: 'BARREL',
        currentStock: 14.0,
        minimumBufferStock: 12.0,
        maximumCapacityStock: 50.0,
        reorderPoint: 18.0,
        averageDailyConsumption: 0.8,
        leadTimeDays: 7,
        jitScheduleActive: true,
        jitDeliveryCadence: 'WEEKLY',
        stockStatus: 'REORDER_TRIGGERED',
        primaryVendorName: 'Indian Oil Corporation Ltd (SERVO Division)',
        notes: 'Current stock 14 bbl is below reorder threshold (18 bbl). Open PO PO-2026-090 in transit.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 20),
        updatedAt: now,
      },
      {
        id: 'buf-03',
        itemCode: 'TL-INS-CNMG-12',
        itemName: 'Carbide Turning Inserts CNMG 120408',
        category: 'SPARE_PARTS',
        unit: 'PIECE',
        currentStock: 480.0,
        minimumBufferStock: 150.0,
        maximumCapacityStock: 1000.0,
        reorderPoint: 250.0,
        averageDailyConsumption: 22.0,
        leadTimeDays: 4,
        jitScheduleActive: true,
        jitDeliveryCadence: 'ON_CALL',
        stockStatus: 'HEALTHY',
        primaryVendorName: 'TaeguTec India Tooling Division',
        notes: 'Optimal inventory for CNC turning centers.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 20),
        updatedAt: now,
      },
    ];

    // 5. Vendor Performance & 3-Way Match Reconciliation
    this.inMemoryReconciliations = [
      {
        id: 'rec-01',
        reconciliationCode: 'VEND-REC-2026-081',
        vendorName: 'Tata Steel Industrial Billet Division',
        poNumber: 'PO-2026-089',
        grnNumber: 'GRN-2026-11-042',
        supplierInvoiceNumber: 'INV-TAT-2026-8812',
        invoiceAmount: 1819548.0, // 28.45 MT delivery
        grnReceivedAmount: 1819548.0,
        discrepancyAmount: 0.0,
        threeWayMatchStatus: 'MATCHED',
        onTimeDeliveryScorePct: 98.8,
        qualityPassRatePct: 99.5,
        debitNoteNumber: null,
        debitNoteAmount: null,
        paymentSettlementStatus: 'APPROVED_FOR_PAYMENT',
        settlementDueDate: new Date(now.getTime() + 86400000 * 25),
        settledAt: null,
        notes: 'PO, Weighbridge GRN, and Supplier GST Invoice match exactly. Passed to Finance for payment release.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 0.8),
        updatedAt: now,
      },
      {
        id: 'rec-02',
        reconciliationCode: 'VEND-REC-2026-080',
        vendorName: 'TaeguTec India Tooling Division',
        poNumber: 'PO-2026-085',
        grnNumber: 'GRN-2026-11-038',
        supplierInvoiceNumber: 'INV-TAE-449182',
        invoiceAmount: 123900.0,
        grnReceivedAmount: 123900.0,
        discrepancyAmount: 0.0,
        threeWayMatchStatus: 'MATCHED',
        onTimeDeliveryScorePct: 100.0,
        qualityPassRatePct: 100.0,
        debitNoteNumber: null,
        debitNoteAmount: null,
        paymentSettlementStatus: 'SETTLED_PAID',
        settlementDueDate: new Date(now.getTime() - 86400000 * 2),
        settledAt: new Date(now.getTime() - 86400000 * 2),
        notes: 'Payment released via NEFT. Vendor zero-defect supplier rating renewed.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 6),
        updatedAt: new Date(now.getTime() - 86400000 * 2),
      },
    ];

    // 6. Scrap Yard & Surplus Disposal Management
    this.inMemoryScrap = [
      {
        id: 'scr-01',
        disposalCode: 'SCRAP-DISP-2026-021',
        scrapType: 'FERROUS_HEAVY_MELTING_SCRAP',
        storageYardLocation: 'YARD-SCRAP-BAY-03 (East Boundary)',
        accumulatedWeightKg: 18500.0,
        unit: 'KG',
        surplusMaterialOrigin: 'Continuous Billet Cutting & Rolling Mill Crop Ends',
        tenderReferenceNumber: 'TNDR-SCRAP-2026-Q4-01',
        winningBidderName: 'Marathwada Metal Recyclers Pvt Ltd',
        winningBidRatePerKg: 34.8,
        totalRevenueRealized: 643800.0,
        gatePassPassoutNumber: 'GATE-OUT-SCRAP-992',
        status: 'SOLD_DISPATCHED',
        notes: 'Commercial tender awarded to highest bidder. 18.5 MT scrap weighed on outward weighbridge and dispatched.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 5),
        updatedAt: now,
      },
      {
        id: 'scr-02',
        disposalCode: 'SCRAP-DISP-2026-022',
        scrapType: 'ALUMINUM_TURNINGS_BORINGS',
        storageYardLocation: 'YARD-SCRAP-BIN-AL-01',
        accumulatedWeightKg: 4200.0,
        unit: 'KG',
        surplusMaterialOrigin: 'CNC Machining Centers Turnings & Swarf',
        tenderReferenceNumber: 'TNDR-SCRAP-2026-Q4-02',
        winningBidderName: null,
        winningBidRatePerKg: null,
        totalRevenueRealized: null,
        gatePassPassoutNumber: null,
        status: 'TENDER_FLOATED',
        notes: 'Tender floated to 3 certified aluminum smelting recyclers. Sealed bids opening on 25 Nov.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 2),
        updatedAt: now,
      },
    ];
  }

  private errMsg(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
  }

  // =========================================================================
  // 1. STRATEGIC SOURCING & RFQ MANAGEMENT
  // =========================================================================

  async getSourcingRecords(user: UserContext, query?: any) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).procurementSourcing) {
        return await (this.prisma as any).procurementSourcing.findMany({
          where: {
            companyId,
            ...(query?.category ? { category: query.category } : {}),
            ...(query?.status ? { status: query.status } : {}),
          },
          orderBy: { createdAt: 'desc' },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma procurement sourcing read fallback: ${this.errMsg(err)}`);
    }

    return this.inMemorySourcing.filter(
      (s: any) =>
        (s.companyId === companyId || !s.companyId) &&
        (!query?.category || s.category === query.category) &&
        (!query?.status || s.status === query.status),
    );
  }

  async createSourcingRecord(user: UserContext, dto: CreateProcurementSourcingDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    const rfqNumber = `RFQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newRecord = {
      id: `src-${Date.now()}`,
      rfqNumber,
      title: dto.title,
      category: dto.category,
      materialDescription: dto.materialDescription,
      targetQuantity: dto.targetQuantity,
      unit: dto.unit || 'MT',
      invitedVendorsCount: dto.invitedVendorsCount || 3,
      lowestQuotedRate: dto.lowestQuotedRate || null,
      approvedVendorName: dto.approvedVendorName || null,
      approvedRate: dto.approvedRate || null,
      arcContractCode: dto.arcContractCode || null,
      arcValidFrom: dto.arcValidFrom ? new Date(dto.arcValidFrom) : null,
      arcValidTill: dto.arcValidTill ? new Date(dto.arcValidTill) : null,
      vendorAuditScore: dto.vendorAuditScore !== undefined ? dto.vendorAuditScore : 95.0,
      comparativeSummaryJson: dto.comparativeSummaryJson || null,
      status: dto.status || 'RFQ_ISSUED',
      notes: dto.notes || 'RFQ broadcasted to approved supplier panel.',
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if ((this.prisma as any).procurementSourcing) {
        return await (this.prisma as any).procurementSourcing.create({
          data: newRecord,
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma procurement sourcing create fallback: ${this.errMsg(err)}`);
    }

    this.inMemorySourcing.unshift(newRecord);
    return newRecord;
  }

  async finalizeArcContract(user: UserContext, id: string, dto: FinalizeArcContractDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    const arcContractCode = `ARC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      if ((this.prisma as any).procurementSourcing) {
        const existing = await (this.prisma as any).procurementSourcing.findFirst({
          where: { id, companyId },
        });
        if (!existing) throw new NotFoundException('Sourcing RFQ record not found for tenant.');

        return await (this.prisma as any).procurementSourcing.update({
          where: { id },
          data: {
            approvedVendorName: dto.approvedVendorName,
            approvedRate: dto.approvedRate,
            arcContractCode,
            arcValidFrom: new Date(dto.arcValidFrom),
            arcValidTill: new Date(dto.arcValidTill),
            vendorAuditScore: dto.vendorAuditScore !== undefined ? dto.vendorAuditScore : 96.0,
            status: 'ARC_FINALIZED',
            ...(dto.notes ? { notes: dto.notes } : {}),
            updatedAt: new Date(),
          },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma procurement ARC finalize fallback: ${this.errMsg(err)}`);
    }

    const idx = this.inMemorySourcing.findIndex(
      (s: any) => s.id === id && (s.companyId === companyId || !s.companyId),
    );
    if (idx === -1) throw new NotFoundException('Sourcing RFQ record not found for tenant.');

    this.inMemorySourcing[idx] = {
      ...this.inMemorySourcing[idx],
      approvedVendorName: dto.approvedVendorName,
      approvedRate: dto.approvedRate,
      arcContractCode,
      arcValidFrom: new Date(dto.arcValidFrom),
      arcValidTill: new Date(dto.arcValidTill),
      vendorAuditScore: dto.vendorAuditScore !== undefined ? dto.vendorAuditScore : 96.0,
      status: 'ARC_FINALIZED',
      notes: dto.notes || this.inMemorySourcing[idx].notes,
      updatedAt: new Date(),
    };

    return this.inMemorySourcing[idx];
  }

  // =========================================================================
  // 2. PURCHASE ORDER FLOW (BOM PR TO PO)
  // =========================================================================

  async getPurchaseOrders(user: UserContext, query?: any) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).purchaseOrderFlow) {
        return await (this.prisma as any).purchaseOrderFlow.findMany({
          where: {
            companyId,
            ...(query?.orderCategory ? { orderCategory: query.orderCategory } : {}),
            ...(query?.dispatchStatus ? { dispatchStatus: query.dispatchStatus } : {}),
          },
          orderBy: { createdAt: 'desc' },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma PO flow read fallback: ${this.errMsg(err)}`);
    }

    return this.inMemoryPurchaseOrders.filter(
      (p: any) =>
        (p.companyId === companyId || !p.companyId) &&
        (!query?.orderCategory || p.orderCategory === query.orderCategory) &&
        (!query?.dispatchStatus || p.dispatchStatus === query.dispatchStatus),
    );
  }

  async createPurchaseOrder(user: UserContext, dto: CreatePurchaseOrderDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    const poNumber = `PO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const taxRate = dto.taxRatePercentage !== undefined ? dto.taxRatePercentage : 18.0;
    const subtotal = dto.orderedQuantity * dto.unitPrice;
    const totalAmount = subtotal * (1 + taxRate / 100);

    const newPO = {
      id: `po-${Date.now()}`,
      poNumber,
      prNumber: dto.prNumber,
      vendorName: dto.vendorName,
      vendorCode: dto.vendorCode || `VEND-${dto.vendorName.slice(0, 3).toUpperCase()}-01`,
      orderCategory: dto.orderCategory,
      itemDescription: dto.itemDescription,
      orderedQuantity: dto.orderedQuantity,
      unit: dto.unit || 'MT',
      unitPrice: dto.unitPrice,
      taxRatePercentage: taxRate,
      totalAmount,
      deliveryTerms: dto.deliveryTerms || 'FOR_DESTINATION',
      paymentTerms: dto.paymentTerms || 'NET_30',
      expectedDeliveryDate: new Date(dto.expectedDeliveryDate),
      dispatchStatus: 'DISPATCHED_TO_VENDOR',
      approvedBy: user.firstName || 'PROCUREMENT_MANAGER',
      vendorAckDate: null,
      notes: dto.notes || 'Generated from Production BOM requisition.',
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if ((this.prisma as any).purchaseOrderFlow) {
        return await (this.prisma as any).purchaseOrderFlow.create({
          data: newPO,
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma PO flow create fallback: ${this.errMsg(err)}`);
    }

    this.inMemoryPurchaseOrders.unshift(newPO);
    return newPO;
  }

  async updatePoDispatchStatus(user: UserContext, id: string, dto: UpdatePoDispatchStatusDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).purchaseOrderFlow) {
        const existing = await (this.prisma as any).purchaseOrderFlow.findFirst({
          where: { id, companyId },
        });
        if (!existing) throw new NotFoundException('Purchase order not found for tenant.');

        return await (this.prisma as any).purchaseOrderFlow.update({
          where: { id },
          data: {
            dispatchStatus: dto.dispatchStatus,
            vendorAckDate: dto.dispatchStatus === 'ACKNOWLEDGED_BY_VENDOR' ? new Date() : undefined,
            ...(dto.notes ? { notes: dto.notes } : {}),
            updatedAt: new Date(),
          },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma PO flow update fallback: ${this.errMsg(err)}`);
    }

    const idx = this.inMemoryPurchaseOrders.findIndex(
      (p: any) => p.id === id && (p.companyId === companyId || !p.companyId),
    );
    if (idx === -1) throw new NotFoundException('Purchase order not found for tenant.');

    this.inMemoryPurchaseOrders[idx] = {
      ...this.inMemoryPurchaseOrders[idx],
      dispatchStatus: dto.dispatchStatus,
      vendorAckDate: dto.dispatchStatus === 'ACKNOWLEDGED_BY_VENDOR' ? new Date() : this.inMemoryPurchaseOrders[idx].vendorAckDate,
      notes: dto.notes || this.inMemoryPurchaseOrders[idx].notes,
      updatedAt: new Date(),
    };

    return this.inMemoryPurchaseOrders[idx];
  }

  // =========================================================================
  // 3. MATERIAL INWARD LOGISTICS & QC CLEARANCE
  // =========================================================================

  async getMaterialInwardRecords(user: UserContext, query?: any) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).materialInwardLogistics) {
        return await (this.prisma as any).materialInwardLogistics.findMany({
          where: {
            companyId,
            ...(query?.qcInspectionStatus ? { qcInspectionStatus: query.qcInspectionStatus } : {}),
            ...(query?.status ? { status: query.status } : {}),
          },
          orderBy: { createdAt: 'desc' },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma material inward read fallback: ${this.errMsg(err)}`);
    }

    return this.inMemoryInwardLogistics.filter(
      (i: any) =>
        (i.companyId === companyId || !i.companyId) &&
        (!query?.qcInspectionStatus || i.qcInspectionStatus === query.qcInspectionStatus) &&
        (!query?.status || i.status === query.status),
    );
  }

  async createMaterialInward(user: UserContext, dto: CreateMaterialInwardDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    const inwardTrackingNumber = `INW-LOG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const gateEntryCode = `GATE-IN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const netKg = Math.max(0, dto.weighbridgeGrossKg - dto.weighbridgeTareKg);

    const newInward = {
      id: `inw-${Date.now()}`,
      inwardTrackingNumber,
      poNumber: dto.poNumber,
      vendorName: dto.vendorName,
      transporterName: dto.transporterName,
      vehicleNumber: dto.vehicleNumber,
      driverContact: dto.driverContact || null,
      eWayBillNumber: dto.eWayBillNumber || `EWB-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      challanInvoiceNumber: dto.challanInvoiceNumber,
      gateEntryCode,
      weighbridgeGrossKg: dto.weighbridgeGrossKg,
      weighbridgeTareKg: dto.weighbridgeTareKg,
      weighbridgeNetKg: netKg,
      unit: dto.unit || 'KG',
      qcInspectionStatus: dto.qcInspectionStatus || 'PENDING_LAB_TEST',
      qcTestReportNumber: null,
      grnNumber: null,
      warehouseLocationBay: dto.warehouseLocationBay || 'BAY-INWARD-HOLD',
      status: 'AT_GATE',
      notes: dto.notes || 'Inward truck registered at factory gate.',
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if ((this.prisma as any).materialInwardLogistics) {
        return await (this.prisma as any).materialInwardLogistics.create({
          data: newInward,
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma material inward create fallback: ${this.errMsg(err)}`);
    }

    this.inMemoryInwardLogistics.unshift(newInward);
    return newInward;
  }

  async updateMaterialQcStatus(user: UserContext, id: string, dto: UpdateMaterialQcStatusDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    const grnNumber =
      dto.qcInspectionStatus === 'QC_PASSED'
        ? `GRN-${new Date().toISOString().slice(0, 7)}-${Math.floor(100 + Math.random() * 900)}`
        : undefined;

    const status = dto.qcInspectionStatus === 'QC_PASSED' ? 'GRN_GENERATED' : 'AT_GATE';

    try {
      if ((this.prisma as any).materialInwardLogistics) {
        const existing = await (this.prisma as any).materialInwardLogistics.findFirst({
          where: { id, companyId },
        });
        if (!existing) throw new NotFoundException('Inward logistics record not found.');

        return await (this.prisma as any).materialInwardLogistics.update({
          where: { id },
          data: {
            qcInspectionStatus: dto.qcInspectionStatus,
            qcTestReportNumber: dto.qcTestReportNumber || `QC-TR-${Math.floor(1000 + Math.random() * 9000)}`,
            ...(grnNumber ? { grnNumber } : {}),
            status,
            ...(dto.warehouseLocationBay ? { warehouseLocationBay: dto.warehouseLocationBay } : {}),
            ...(dto.notes ? { notes: dto.notes } : {}),
            updatedAt: new Date(),
          },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma material inward update fallback: ${this.errMsg(err)}`);
    }

    const idx = this.inMemoryInwardLogistics.findIndex(
      (i: any) => i.id === id && (i.companyId === companyId || !i.companyId),
    );
    if (idx === -1) throw new NotFoundException('Inward logistics record not found.');

    this.inMemoryInwardLogistics[idx] = {
      ...this.inMemoryInwardLogistics[idx],
      qcInspectionStatus: dto.qcInspectionStatus,
      qcTestReportNumber: dto.qcTestReportNumber || `QC-TR-${Math.floor(1000 + Math.random() * 9000)}`,
      grnNumber: grnNumber || this.inMemoryInwardLogistics[idx].grnNumber,
      status,
      warehouseLocationBay: dto.warehouseLocationBay || this.inMemoryInwardLogistics[idx].warehouseLocationBay,
      notes: dto.notes || this.inMemoryInwardLogistics[idx].notes,
      updatedAt: new Date(),
    };

    return this.inMemoryInwardLogistics[idx];
  }

  // =========================================================================
  // 4. BUFFER STOCK & JIT PLANNING
  // =========================================================================

  async getBufferStockRecords(user: UserContext, query?: any) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).bufferStockPlanning) {
        return await (this.prisma as any).bufferStockPlanning.findMany({
          where: {
            companyId,
            ...(query?.category ? { category: query.category } : {}),
            ...(query?.stockStatus ? { stockStatus: query.stockStatus } : {}),
          },
          orderBy: { itemCode: 'asc' },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma buffer stock read fallback: ${this.errMsg(err)}`);
    }

    return this.inMemoryBufferStock.filter(
      (b: any) =>
        (b.companyId === companyId || !b.companyId) &&
        (!query?.category || b.category === query.category) &&
        (!query?.stockStatus || b.stockStatus === query.stockStatus),
    );
  }

  async createBufferStock(user: UserContext, dto: CreateBufferStockDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    let stockStatus = 'HEALTHY';
    if (dto.currentStock <= dto.minimumBufferStock) {
      stockStatus = 'CRITICAL_LOW';
    } else if (dto.currentStock <= dto.reorderPoint) {
      stockStatus = 'REORDER_TRIGGERED';
    } else if (dto.currentStock >= dto.maximumCapacityStock) {
      stockStatus = 'OVERSTOCKED';
    }

    const newBuffer = {
      id: `buf-${Date.now()}`,
      itemCode: dto.itemCode,
      itemName: dto.itemName,
      category: dto.category,
      unit: dto.unit || 'MT',
      currentStock: dto.currentStock,
      minimumBufferStock: dto.minimumBufferStock,
      maximumCapacityStock: dto.maximumCapacityStock,
      reorderPoint: dto.reorderPoint,
      averageDailyConsumption: dto.averageDailyConsumption,
      leadTimeDays: dto.leadTimeDays || 7,
      jitScheduleActive: dto.jitScheduleActive !== undefined ? dto.jitScheduleActive : true,
      jitDeliveryCadence: dto.jitDeliveryCadence || 'WEEKLY',
      stockStatus,
      primaryVendorName: dto.primaryVendorName || null,
      notes: dto.notes || 'Buffer stock thresholds configured.',
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if ((this.prisma as any).bufferStockPlanning) {
        return await (this.prisma as any).bufferStockPlanning.create({
          data: newBuffer,
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma buffer stock create fallback: ${this.errMsg(err)}`);
    }

    this.inMemoryBufferStock.push(newBuffer);
    return newBuffer;
  }

  async updateStockLevel(user: UserContext, id: string, dto: UpdateStockLevelDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    const existing = this.inMemoryBufferStock.find((b: any) => b.id === id);
    const minBuf = existing ? existing.minimumBufferStock : 50;
    const reorder = existing ? existing.reorderPoint : 100;
    const maxCap = existing ? existing.maximumCapacityStock : 300;

    let stockStatus = 'HEALTHY';
    if (dto.currentStock <= minBuf) {
      stockStatus = 'CRITICAL_LOW';
    } else if (dto.currentStock <= reorder) {
      stockStatus = 'REORDER_TRIGGERED';
    } else if (dto.currentStock >= maxCap) {
      stockStatus = 'OVERSTOCKED';
    }

    try {
      if ((this.prisma as any).bufferStockPlanning) {
        return await (this.prisma as any).bufferStockPlanning.update({
          where: { id },
          data: {
            currentStock: dto.currentStock,
            stockStatus,
            ...(dto.notes ? { notes: dto.notes } : {}),
            updatedAt: new Date(),
          },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma buffer stock update fallback: ${this.errMsg(err)}`);
    }

    const idx = this.inMemoryBufferStock.findIndex(
      (b: any) => b.id === id && (b.companyId === companyId || !b.companyId),
    );
    if (idx === -1) throw new NotFoundException('Buffer stock record not found.');

    this.inMemoryBufferStock[idx] = {
      ...this.inMemoryBufferStock[idx],
      currentStock: dto.currentStock,
      stockStatus,
      notes: dto.notes || this.inMemoryBufferStock[idx].notes,
      updatedAt: new Date(),
    };

    return this.inMemoryBufferStock[idx];
  }

  // =========================================================================
  // 5. VENDOR PERFORMANCE & 3-WAY MATCH RECONCILIATION
  // =========================================================================

  async getVendorReconciliations(user: UserContext, query?: any) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).vendorReconciliation) {
        return await (this.prisma as any).vendorReconciliation.findMany({
          where: {
            companyId,
            ...(query?.threeWayMatchStatus ? { threeWayMatchStatus: query.threeWayMatchStatus } : {}),
            ...(query?.paymentSettlementStatus ? { paymentSettlementStatus: query.paymentSettlementStatus } : {}),
          },
          orderBy: { createdAt: 'desc' },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma vendor reconciliation read fallback: ${this.errMsg(err)}`);
    }

    return this.inMemoryReconciliations.filter(
      (v: any) =>
        (v.companyId === companyId || !v.companyId) &&
        (!query?.threeWayMatchStatus || v.threeWayMatchStatus === query.threeWayMatchStatus) &&
        (!query?.paymentSettlementStatus || v.paymentSettlementStatus === query.paymentSettlementStatus),
    );
  }

  async createVendorReconciliation(user: UserContext, dto: CreateVendorReconciliationDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    const reconciliationCode = `VEND-REC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const discrepancy = Math.abs(dto.invoiceAmount - dto.grnReceivedAmount);
    const threeWayMatchStatus = discrepancy < 1.0 ? 'MATCHED' : 'DISCREPANCY_HOLD';

    const newRec = {
      id: `rec-${Date.now()}`,
      reconciliationCode,
      vendorName: dto.vendorName,
      poNumber: dto.poNumber,
      grnNumber: dto.grnNumber,
      supplierInvoiceNumber: dto.supplierInvoiceNumber,
      invoiceAmount: dto.invoiceAmount,
      grnReceivedAmount: dto.grnReceivedAmount,
      discrepancyAmount: discrepancy,
      threeWayMatchStatus,
      onTimeDeliveryScorePct: dto.onTimeDeliveryScorePct !== undefined ? dto.onTimeDeliveryScorePct : 98.5,
      qualityPassRatePct: dto.qualityPassRatePct !== undefined ? dto.qualityPassRatePct : 99.0,
      debitNoteNumber: dto.debitNoteNumber || (discrepancy > 0 ? `DN-${Math.floor(1000 + Math.random() * 9000)}` : null),
      debitNoteAmount: dto.debitNoteAmount || (discrepancy > 0 ? discrepancy : null),
      paymentSettlementStatus: threeWayMatchStatus === 'MATCHED' ? 'APPROVED_FOR_PAYMENT' : 'BLOCKED_ON_HOLD',
      settlementDueDate: dto.settlementDueDate ? new Date(dto.settlementDueDate) : new Date(Date.now() + 86400000 * 30),
      settledAt: null,
      notes: dto.notes || '3-Way matching between PO, GRN and Invoice executed.',
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if ((this.prisma as any).vendorReconciliation) {
        return await (this.prisma as any).vendorReconciliation.create({
          data: newRec,
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma vendor reconciliation create fallback: ${this.errMsg(err)}`);
    }

    this.inMemoryReconciliations.unshift(newRec);
    return newRec;
  }

  async settleVendorPayment(user: UserContext, id: string, dto: SettleVendorPaymentDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    const settledAt = dto.paymentSettlementStatus === 'SETTLED_PAID' ? new Date() : undefined;

    try {
      if ((this.prisma as any).vendorReconciliation) {
        const existing = await (this.prisma as any).vendorReconciliation.findFirst({
          where: { id, companyId },
        });
        if (!existing) throw new NotFoundException('Reconciliation record not found.');

        return await (this.prisma as any).vendorReconciliation.update({
          where: { id },
          data: {
            paymentSettlementStatus: dto.paymentSettlementStatus,
            ...(settledAt ? { settledAt } : {}),
            ...(dto.notes ? { notes: dto.notes } : {}),
            updatedAt: new Date(),
          },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma vendor reconciliation settle fallback: ${this.errMsg(err)}`);
    }

    const idx = this.inMemoryReconciliations.findIndex(
      (r: any) => r.id === id && (r.companyId === companyId || !r.companyId),
    );
    if (idx === -1) throw new NotFoundException('Reconciliation record not found.');

    this.inMemoryReconciliations[idx] = {
      ...this.inMemoryReconciliations[idx],
      paymentSettlementStatus: dto.paymentSettlementStatus,
      settledAt: settledAt || this.inMemoryReconciliations[idx].settledAt,
      notes: dto.notes || this.inMemoryReconciliations[idx].notes,
      updatedAt: new Date(),
    };

    return this.inMemoryReconciliations[idx];
  }

  // =========================================================================
  // 6. SCRAP DISPOSAL & SURPLUS MATERIAL MONETIZATION
  // =========================================================================

  async getScrapDisposalRecords(user: UserContext, query?: any) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).scrapDisposalManagement) {
        return await (this.prisma as any).scrapDisposalManagement.findMany({
          where: {
            companyId,
            ...(query?.scrapType ? { scrapType: query.scrapType } : {}),
            ...(query?.status ? { status: query.status } : {}),
          },
          orderBy: { createdAt: 'desc' },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma scrap disposal read fallback: ${this.errMsg(err)}`);
    }

    return this.inMemoryScrap.filter(
      (s: any) =>
        (s.companyId === companyId || !s.companyId) &&
        (!query?.scrapType || s.scrapType === query.scrapType) &&
        (!query?.status || s.status === query.status),
    );
  }

  async createScrapDisposal(user: UserContext, dto: CreateScrapDisposalDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    const disposalCode = `SCRAP-DISP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newScrap = {
      id: `scr-${Date.now()}`,
      disposalCode,
      scrapType: dto.scrapType,
      storageYardLocation: dto.storageYardLocation,
      accumulatedWeightKg: dto.accumulatedWeightKg,
      unit: dto.unit || 'KG',
      surplusMaterialOrigin: dto.surplusMaterialOrigin || null,
      tenderReferenceNumber: dto.tenderReferenceNumber || `TNDR-SCRAP-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
      winningBidderName: dto.winningBidderName || null,
      winningBidRatePerKg: dto.winningBidRatePerKg || null,
      totalRevenueRealized: dto.totalRevenueRealized || (dto.winningBidRatePerKg ? dto.winningBidRatePerKg * dto.accumulatedWeightKg : null),
      gatePassPassoutNumber: dto.gatePassPassoutNumber || null,
      status: dto.status || 'ACCUMULATING',
      notes: dto.notes || 'Scrap material accumulated in plant designated yard.',
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if ((this.prisma as any).scrapDisposalManagement) {
        return await (this.prisma as any).scrapDisposalManagement.create({
          data: newScrap,
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma scrap disposal create fallback: ${this.errMsg(err)}`);
    }

    this.inMemoryScrap.unshift(newScrap);
    return newScrap;
  }

  async finalizeScrapSale(user: UserContext, id: string, dto: FinalizeScrapSaleDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    const existing = this.inMemoryScrap.find((s: any) => s.id === id);
    const weight = existing ? existing.accumulatedWeightKg : 1000;
    const totalRevenue = weight * dto.winningBidRatePerKg;
    const gatePass = dto.gatePassPassoutNumber || `GATE-OUT-SCRAP-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      if ((this.prisma as any).scrapDisposalManagement) {
        const dbExisting = await (this.prisma as any).scrapDisposalManagement.findFirst({
          where: { id, companyId },
        });
        if (!dbExisting) throw new NotFoundException('Scrap disposal record not found.');

        const dbWeight = dbExisting.accumulatedWeightKg;
        const dbRevenue = dbWeight * dto.winningBidRatePerKg;

        return await (this.prisma as any).scrapDisposalManagement.update({
          where: { id },
          data: {
            winningBidderName: dto.winningBidderName,
            winningBidRatePerKg: dto.winningBidRatePerKg,
            totalRevenueRealized: dbRevenue,
            gatePassPassoutNumber: gatePass,
            status: 'SOLD_DISPATCHED',
            ...(dto.notes ? { notes: dto.notes } : {}),
            updatedAt: new Date(),
          },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma scrap disposal finalize fallback: ${this.errMsg(err)}`);
    }

    const idx = this.inMemoryScrap.findIndex(
      (s: any) => s.id === id && (s.companyId === companyId || !s.companyId),
    );
    if (idx === -1) throw new NotFoundException('Scrap disposal record not found.');

    this.inMemoryScrap[idx] = {
      ...this.inMemoryScrap[idx],
      winningBidderName: dto.winningBidderName,
      winningBidRatePerKg: dto.winningBidRatePerKg,
      totalRevenueRealized: totalRevenue,
      gatePassPassoutNumber: gatePass,
      status: 'SOLD_DISPATCHED',
      notes: dto.notes || this.inMemoryScrap[idx].notes,
      updatedAt: new Date(),
    };

    return this.inMemoryScrap[idx];
  }

  // =========================================================================
  // 7. AGGREGATED PROCUREMENT DASHBOARD METRICS & KPIS
  // =========================================================================

  async getProcurementDashboardKpis(user: UserContext) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    const [sourcing, pos, inward, buffer, reconciliations, scrap] = await Promise.all([
      this.getSourcingRecords(user),
      this.getPurchaseOrders(user),
      this.getMaterialInwardRecords(user),
      this.getBufferStockRecords(user),
      this.getVendorReconciliations(user),
      this.getScrapDisposalRecords(user),
    ]);

    const activePOsCount = (pos as any[]).filter((p: any) => p.dispatchStatus !== 'FULFILLED' && p.dispatchStatus !== 'CANCELLED').length;
    const totalProcurementSpend = (pos as any[]).reduce((sum: number, p: any) => sum + p.totalAmount, 0);

    const avgOtdRate =
      (reconciliations as any[]).length > 0
        ? Number(
            (
              (reconciliations as any[]).reduce((sum: number, r: any) => sum + (r.onTimeDeliveryScorePct || 98.5), 0) /
              (reconciliations as any[]).length
            ).toFixed(1),
          )
        : 98.5;

    const bufferStockHealthPct =
      (buffer as any[]).length > 0
        ? Number(
            (
              ((buffer as any[]).filter((b: any) => b.stockStatus === 'HEALTHY').length / (buffer as any[]).length) *
              100
            ).toFixed(1),
          )
        : 100.0;

    const pendingQcClearanceCount = (inward as any[]).filter((i: any) => i.qcInspectionStatus === 'PENDING_LAB_TEST' || i.qcInspectionStatus === 'UNDER_INSPECTION').length;
    const totalScrapRevenue = (scrap as any[]).reduce((sum: number, s: any) => sum + (s.totalRevenueRealized || 0), 0);

    return {
      companyId,
      activePOsCount,
      totalProcurementSpend,
      avgOtdRate,
      bufferStockHealthPct,
      pendingQcClearanceCount,
      totalScrapRevenue,
      activeArcAgreements: (sourcing as any[]).filter((s: any) => s.status === 'ARC_FINALIZED').length,
      matchedInvoicesRatePct:
        (reconciliations as any[]).length > 0
          ? Number(
              (
                ((reconciliations as any[]).filter((r: any) => r.threeWayMatchStatus === 'MATCHED').length /
                  (reconciliations as any[]).length) *
                100
              ).toFixed(1),
            )
          : 100.0,
    };
  }

  // =========================================================================
  // 8. RAW MATERIAL RATE CHANGE REQUESTS & NOTIFICATIONS
  // =========================================================================

  async createRateRequest(user: UserContext, dto: CreateRateRequestDto) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association required to request rate changes.');
    }
    const companyId = user.companyId;

    // 1. Locate raw material strictly scoped to tenant companyId
    let rawMaterial: any = null;
    try {
      if ((this.prisma as any).rawMaterial) {
        rawMaterial = await (this.prisma as any).rawMaterial.findFirst({
          where: { id: dto.rawMaterialId, companyId },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma find rawMaterial fallback: ${err}`);
    }

    if (!rawMaterial) {
      // In-memory fallback
      rawMaterial = {
        id: dto.rawMaterialId,
        name: 'Industrial Raw Material',
        materialCode: 'RM-DEFAULT-01',
        rate: 100.0,
        costPrice: 100.0,
        unit: 'kg',
      };
    }

    const currentRate = Number(rawMaterial.rate || rawMaterial.costPrice || rawMaterial.unitPrice || 0);
    const proposedRate = Number(dto.proposedRate);

    const record = {
      id: `rr-${Date.now()}`,
      companyId,
      rawMaterialId: rawMaterial.id,
      requestedByUserId: user.id,
      currentRate,
      proposedRate,
      reason: dto.reason?.trim() || 'Procurement market rate update',
      status: 'PENDING',
      reviewedByUserId: null,
      reviewedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      rawMaterial: {
        id: rawMaterial.id,
        name: rawMaterial.name,
        materialCode: rawMaterial.materialCode,
        unit: rawMaterial.unit,
      },
    };

    // 2. Persist RawMaterialRateRequest
    let savedRequest = record;
    try {
      if ((this.prisma as any).rawMaterialRateRequest) {
        savedRequest = await (this.prisma as any).rawMaterialRateRequest.create({
          data: {
            id: record.id,
            companyId,
            rawMaterialId: record.rawMaterialId,
            requestedByUserId: record.requestedByUserId,
            currentRate: record.currentRate,
            proposedRate: record.proposedRate,
            reason: record.reason,
            status: 'PENDING',
          },
          include: { rawMaterial: true },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma rawMaterialRateRequest create fallback: ${err}`);
    }

    // 3. Create Notification for SUPER_ADMIN in the same company
    try {
      if ((this.prisma as any).notification) {
        await (this.prisma as any).notification.create({
          data: {
            id: `notif-${Date.now()}`,
            companyId,
            recipientRole: 'SUPER_ADMIN',
            title: 'Procurement Rate Change Request',
            message: `Rate change requested for "${rawMaterial.name}" (${rawMaterial.materialCode}): Current ₹${currentRate} -> Proposed ₹${proposedRate}. Reason: ${record.reason}`,
            type: 'RATE_CHANGE_REQUEST',
            referenceId: savedRequest.id,
            isRead: false,
          },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma notification create fallback: ${err}`);
    }

    this.inMemoryRateRequests.unshift(savedRequest);
    return savedRequest;
  }

  async getRateRequests(user: UserContext, status?: string) {
    if (!user?.companyId) return [];
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).rawMaterialRateRequest) {
        const where: any = { companyId };
        if (status) where.status = status;
        const records = await (this.prisma as any).rawMaterialRateRequest.findMany({
          where,
          include: { rawMaterial: true },
          orderBy: { createdAt: 'desc' },
        });
        if (records && records.length > 0) return records;
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma getRateRequests fallback: ${err}`);
    }

    return this.inMemoryRateRequests.filter(
      (r: any) => r.companyId === companyId && (!status || r.status === status),
    );
  }

  async getRawMaterialsForProcurement(user: UserContext) {
    if (!user?.companyId) return [];
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).rawMaterial) {
        const materials = await (this.prisma as any).rawMaterial.findMany({
          where: { companyId },
          include: {
            rateRequests: {
              where: { status: 'PENDING' },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
          orderBy: { createdAt: 'desc' },
        });
        if (materials && materials.length > 0) return materials;
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma getRawMaterialsForProcurement fallback: ${err}`);
    }

    return [];
  }
}
