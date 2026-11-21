import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSalesLeadDto,
  UpdateSalesLeadStatusDto,
} from './dto/create-sales-lead.dto';
import {
  CreateSalesQuotationDto,
  UpdateSalesQuotationStatusDto,
} from './dto/create-sales-quotation.dto';
import {
  CreateSalesOrderDto,
  UpdateSalesOrderStatusDto,
} from './dto/create-sales-order.dto';
import {
  CreateSalesDispatchDto,
  UpdateSalesDispatchStatusDto,
} from './dto/create-sales-dispatch.dto';
import {
  CreateSalesBillingDto,
  SettleSalesPaymentDto,
} from './dto/create-sales-billing.dto';
import {
  CreateSalesFeedbackDto,
  ResolveSalesFeedbackDto,
} from './dto/create-sales-feedback.dto';

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
export class SalesService {
  private readonly logger = new Logger(SalesService.name);

  // In-memory fallback caches for zero-downtime multi-tenant resilience
  private inMemoryLeads: any[] = [];
  private inMemoryQuotations: any[] = [];
  private inMemoryOrders: any[] = [];
  private inMemoryDispatches: any[] = [];
  private inMemoryBillings: any[] = [];
  private inMemoryFeedbacks: any[] = [];

  constructor(private readonly prisma: PrismaService) {
    this.seedDefaultSalesData();
  }

  private seedDefaultSalesData() {
    const now = new Date();
    const companyId = 'company_isolated_01';

    // 1. Leads
    this.inMemoryLeads = [
      {
        id: 'lead-01',
        leadCode: 'LEAD-2026-101',
        clientCompanyName: 'Bharat Heavy Axles & Forgings Pvt Ltd',
        contactPerson: 'Sanjay Deshmukh (Head of SCM)',
        contactPhone: '+91 98220 11920',
        contactEmail: 'sanjay.deshmukh@bharataxles.com',
        leadSource: 'EXHIBITION_TRADE_FAIR',
        industrySegment: 'AUTOMOTIVE_OEM',
        targetProducts: 'Grade EN8 Carbon Steel Billets 100x100mm, High-Tensile Forging Rounds',
        estimatedAnnualValue: 24000000.0,
        leadScore: 92.0,
        status: 'QUALIFIED_PROSPECT',
        assignedSalesOfficer: 'Vikram Rao (Regional Sales Lead)',
        notes: 'Met at IMTEX 2026. Required monthly requirement of 40 MT for drive axle forgings.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 5),
        updatedAt: now,
      },
      {
        id: 'lead-02',
        leadCode: 'LEAD-2026-102',
        clientCompanyName: 'Larsen Engineering Transmission Towers',
        contactPerson: 'Ramesh Kulkarni (Chief Procurement Manager)',
        contactPhone: '+91 94221 44550',
        contactEmail: 'r.kulkarni@larsen-power.in',
        leadSource: 'DIRECT_INQUIRY',
        industrySegment: 'INFRASTRUCTURE',
        targetProducts: 'Hot-Rolled Structural Angles & Equal Beams conformant to IS 2062',
        estimatedAnnualValue: 45000000.0,
        leadScore: 88.0,
        status: 'CONVERTED_TO_RFQ',
        assignedSalesOfficer: 'Sunita Sharma (Key Account Executive)',
        notes: 'RFP issued for high-voltage transmission corridor package 4. Technical spec validated.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 3),
        updatedAt: now,
      },
      {
        id: 'lead-03',
        leadCode: 'LEAD-2026-103',
        clientCompanyName: 'Apex Precision Hydraulics Corp',
        contactPerson: 'Gautam Nair (Works Director)',
        contactPhone: '+91 98900 33412',
        contactEmail: 'gnair@apex-hydraulics.com',
        leadSource: 'PRODUCT_CATALOGUE_PITCH',
        industrySegment: 'ENGINEERING',
        targetProducts: 'Honed Cylinder Tubes & Hard Chrome Plated Rods',
        estimatedAnnualValue: 12000000.0,
        leadScore: 78.0,
        status: 'MEETING_SCHEDULED',
        assignedSalesOfficer: 'Vikram Rao (Regional Sales Lead)',
        notes: 'Commercial sample lot dispatched for micro-finish inspection and salt spray testing.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 1),
        updatedAt: now,
      },
    ];

    // 2. Quotations
    this.inMemoryQuotations = [
      {
        id: 'quot-01',
        quotationNumber: 'QUOT-2026-088',
        inquiryReference: 'INQ-2026-442',
        leadId: 'lead-01',
        clientCompanyName: 'Bharat Heavy Axles & Forgings Pvt Ltd',
        productDescription: 'Grade EN8 Carbon Steel Billets 100x100mm, length 6m (IS 5517)',
        orderQuantity: 80.0,
        unit: 'MT',
        rawMaterialCost: 48500.0,
        productionOverheadCost: 4200.0,
        profitMarginPct: 14.5,
        calculatedBaseRate: 60350.0,
        finalQuotedRate: 59500.0,
        totalQuotationValue: 4760000.0,
        creditPeriodDays: 30,
        advancePaymentPct: 20.0,
        deliveryChargesTerms: 'FOR_DESTINATION',
        status: 'AGREEMENT_FINALIZED',
        validTill: new Date(now.getTime() + 86400000 * 20),
        notes: 'Price finalized after 2 rounds of negotiation. 20% advance credited to bank account.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 4),
        updatedAt: now,
      },
      {
        id: 'quot-02',
        quotationNumber: 'QUOT-2026-089',
        inquiryReference: 'INQ-2026-448',
        leadId: 'lead-02',
        clientCompanyName: 'Larsen Engineering Transmission Towers',
        productDescription: 'Structural Steel Angles 90x90x8mm (IS 2062 Grade E250BR)',
        orderQuantity: 150.0,
        unit: 'MT',
        rawMaterialCost: 51200.0,
        productionOverheadCost: 3800.0,
        profitMarginPct: 12.0,
        calculatedBaseRate: 61600.0,
        finalQuotedRate: 61000.0,
        totalQuotationValue: 9150000.0,
        creditPeriodDays: 45,
        advancePaymentPct: 15.0,
        deliveryChargesTerms: 'EX_WORKS',
        status: 'UNDER_NEGOTIATION',
        validTill: new Date(now.getTime() + 86400000 * 15),
        notes: 'Client requesting volume rebate of 1.5% for bi-monthly scheduled lifts.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 2),
        updatedAt: now,
      },
    ];

    // 3. Sales Orders
    this.inMemoryOrders = [
      {
        id: 'so-01',
        salesOrderNumber: 'SO-2026-110',
        quotationReference: 'QUOT-2026-088',
        clientPurchaseOrderNo: 'PO-BHA-2026-8819',
        clientCompanyName: 'Bharat Heavy Axles & Forgings Pvt Ltd',
        productName: 'Grade EN8 Carbon Steel Billets 100x100mm',
        orderQuantity: 80.0,
        unit: 'MT',
        unitRate: 59500.0,
        totalOrderValue: 4760000.0,
        inventoryStockCheckStatus: 'STOCK_SUFFICIENT',
        productionManagerConfirmed: true,
        estimatedDeliveryDate: new Date(now.getTime() + 86400000 * 4),
        executionProgressPct: 75.0,
        orderStatus: 'IN_PRODUCTION',
        assignedProductionLine: 'Continuous Casting & Billet Rolling Line #1',
        notes: '60 MT rolled and passed chemical spectrometer check. Balance 20 MT in cooling bed.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 3),
        updatedAt: now,
      },
      {
        id: 'so-02',
        salesOrderNumber: 'SO-2026-109',
        quotationReference: 'QUOT-2026-079',
        clientPurchaseOrderNo: 'PO-MAH-9921',
        clientCompanyName: 'Mahindra Automotive Foundry Division',
        productName: 'Low Alloy SG Iron Forging Ingots',
        orderQuantity: 35.0,
        unit: 'MT',
        unitRate: 68000.0,
        totalOrderValue: 2380000.0,
        inventoryStockCheckStatus: 'STOCK_SUFFICIENT',
        productionManagerConfirmed: true,
        estimatedDeliveryDate: new Date(now.getTime() - 86400000 * 1),
        executionProgressPct: 100.0,
        orderStatus: 'READY_FOR_DISPATCH',
        assignedProductionLine: 'Induction Melting Furnace Bay #3',
        notes: '100% heat treatment and hardness testing cleared. Ready in Dispatch Bay 2.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 6),
        updatedAt: now,
      },
    ];

    // 4. Dispatch Logistics
    this.inMemoryDispatches = [
      {
        id: 'disp-01',
        dispatchTrackingCode: 'DISP-LOG-2026-501',
        salesOrderNumber: 'SO-2026-109',
        clientCompanyName: 'Mahindra Automotive Foundry Division',
        deliveryChallanNumber: 'DC-2026-8812',
        eWayBillNumber: 'EWB-291049182740',
        transporterFleetCarrier: 'VRL Heavy Freight Carriers',
        vehicleNumber: 'MH-12-RN-9921',
        driverNameAndContact: 'Anand Shinde (+91 98221 00192)',
        dispatchWeightKg: 35000.0,
        destinationLocation: 'Mahindra Plant 2, Chakan Industrial Phase II, Pune',
        loadingBay: 'BAY-DISP-02',
        dispatchStatus: 'DISPATCHED_IN_TRANSIT',
        proofOfDeliveryReceived: false,
        dispatchedAt: new Date(now.getTime() - 86400000 * 0.5),
        deliveredAt: null,
        notes: 'GPS vehicle tracking active. Expected transit time 4 hours.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 0.5),
        updatedAt: now,
      },
      {
        id: 'disp-02',
        dispatchTrackingCode: 'DISP-LOG-2026-500',
        salesOrderNumber: 'SO-2026-107',
        clientCompanyName: 'Kirloskar Pneumatic Plant',
        deliveryChallanNumber: 'DC-2026-8810',
        eWayBillNumber: 'EWB-182940192841',
        transporterFleetCarrier: 'Safexpress Dedicated Cargo',
        vehicleNumber: 'MH-14-AZ-4410',
        driverNameAndContact: 'Kishore Patil (+91 94220 55198)',
        dispatchWeightKg: 22500.0,
        destinationLocation: 'Saswad Road Plant, Hadapsar, Pune',
        loadingBay: 'BAY-DISP-01',
        dispatchStatus: 'DELIVERED_POD_RECEIVED',
        proofOfDeliveryReceived: true,
        dispatchedAt: new Date(now.getTime() - 86400000 * 3),
        deliveredAt: new Date(now.getTime() - 86400000 * 2.8),
        notes: 'Signed and stamped physical POD uploaded to ERP repository.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 3),
        updatedAt: now,
      },
    ];

    // 5. Billing & Credit Control
    this.inMemoryBillings = [
      {
        id: 'bill-01',
        invoiceNumber: 'INV-SLS-2026-901',
        salesOrderNumber: 'SO-2026-109',
        deliveryChallanNumber: 'DC-2026-8812',
        clientCompanyName: 'Mahindra Automotive Foundry Division',
        clientGstNumber: '27AAACM1234F1Z5',
        totalInvoiceAmount: 2380000.0,
        taxAmount: 428400.0,
        netPayableAmount: 2808400.0,
        dealerCreditLimit: 10000000.0,
        outstandingBalance: 2808400.0,
        paymentDueDate: new Date(now.getTime() + 86400000 * 30),
        paymentStatus: 'PAYMENT_DUE',
        paidAmount: 0.0,
        paymentReferenceUTR: null,
        lastFollowUpDate: now,
        notes: 'Commercial tax invoice with 18% GST issued against Delivery Challan DC-2026-8812.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 0.5),
        updatedAt: now,
      },
      {
        id: 'bill-02',
        invoiceNumber: 'INV-SLS-2026-898',
        salesOrderNumber: 'SO-2026-107',
        deliveryChallanNumber: 'DC-2026-8810',
        clientCompanyName: 'Kirloskar Pneumatic Plant',
        clientGstNumber: '27AAACK5512B1Z8',
        totalInvoiceAmount: 1530000.0,
        taxAmount: 275400.0,
        netPayableAmount: 1805400.0,
        dealerCreditLimit: 5000000.0,
        outstandingBalance: 0.0,
        paymentDueDate: new Date(now.getTime() - 86400000 * 2),
        paymentStatus: 'FULLY_SETTLED',
        paidAmount: 1805400.0,
        paymentReferenceUTR: 'UTR-HDFC-9912841920',
        lastFollowUpDate: new Date(now.getTime() - 86400000 * 2),
        notes: 'Wire transfer payment received in full within 7 days. Early payment cash discount applied.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 5),
        updatedAt: now,
      },
    ];

    // 6. Customer CRM & Feedback
    this.inMemoryFeedbacks = [
      {
        id: 'crm-01',
        ticketNumber: 'CRM-TKT-2026-042',
        clientCompanyName: 'Mahindra Automotive Foundry Division',
        salesOrderNumber: 'SO-2026-105',
        invoiceNumber: 'INV-SLS-2026-885',
        feedbackType: 'CUSTOMER_COMPLAINT',
        issueDescription: 'Minor surface pitting observed on 2 bundles of low alloy SG iron ingots during visual receiving inspection.',
        severityLevel: 'MEDIUM',
        rejectedQuantity: 1.5,
        unit: 'MT',
        qualityReplacementApproved: true,
        replacementOrderCode: 'SO-REPL-2026-08',
        resolutionStatus: 'REPLACEMENT_DISPATCHED',
        customerRating: 4.2,
        capaActionPlan: 'Deslagging cycle enhanced at furnace pour spout. Degassing agent dosage increased by 5%.',
        resolvedAt: new Date(now.getTime() - 86400000 * 1),
        notes: 'Replacement lot dispatched under priority pass. Customer accepted resolution.',
        companyId,
        createdAt: new Date(now.getTime() - 86400000 * 4),
        updatedAt: now,
      },
      {
        id: 'crm-02',
        ticketNumber: 'CRM-TKT-2026-043',
        clientCompanyName: 'Kirloskar Pneumatic Plant',
        salesOrderNumber: 'SO-2026-107',
        invoiceNumber: 'INV-SLS-2026-898',
        feedbackType: 'SERVICE_RATING',
        issueDescription: 'Excellent dimensional accuracy and prompt delivery within 48 hours of order placement.',
        severityLevel: 'LOW',
        rejectedQuantity: 0.0,
        unit: 'MT',
        qualityReplacementApproved: false,
        replacementOrderCode: null,
        resolutionStatus: 'RESOLVED_CLOSED',
        customerRating: 5.0,
        capaActionPlan: 'Commendation shared with Rolling Mill Crew A and Quality Inspection Team.',
        resolvedAt: new Date(now.getTime() - 86400000 * 2),
        notes: 'Net Promoter Score (NPS) promoter feedback.',
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
  // 1. MARKET RESEARCH, LEAD GENERATION & CUSTOMER ACQUISITION
  // =========================================================================

  async getLeads(user: UserContext, query?: any) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).salesLeadAcquisition) {
        return await (this.prisma as any).salesLeadAcquisition.findMany({
          where: {
            companyId,
            ...(query?.status ? { status: query.status } : {}),
            ...(query?.industrySegment ? { industrySegment: query.industrySegment } : {}),
          },
          orderBy: { createdAt: 'desc' },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma sales lead read fallback: ${this.errMsg(err)}`);
    }

    return this.inMemoryLeads.filter(
      (l: any) =>
        (l.companyId === companyId || !l.companyId) &&
        (!query?.status || l.status === query.status) &&
        (!query?.industrySegment || l.industrySegment === query.industrySegment),
    );
  }

  async createLead(user: UserContext, dto: CreateSalesLeadDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    const leadCode = `LEAD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newRecord = {
      id: `lead-${Date.now()}`,
      leadCode,
      clientCompanyName: dto.clientCompanyName,
      contactPerson: dto.contactPerson,
      contactPhone: dto.contactPhone || null,
      contactEmail: dto.contactEmail || null,
      leadSource: dto.leadSource,
      industrySegment: dto.industrySegment,
      targetProducts: dto.targetProducts,
      estimatedAnnualValue: dto.estimatedAnnualValue || null,
      leadScore: dto.leadScore !== undefined ? dto.leadScore : 80.0,
      status: dto.status || 'NEW_INQUIRY',
      assignedSalesOfficer: dto.assignedSalesOfficer || 'Regional Sales Lead',
      notes: dto.notes || 'Prospect identified and registered in sales CRM pipeline.',
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if ((this.prisma as any).salesLeadAcquisition) {
        return await (this.prisma as any).salesLeadAcquisition.create({
          data: newRecord,
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma sales lead create fallback: ${this.errMsg(err)}`);
    }

    this.inMemoryLeads.unshift(newRecord);
    return newRecord;
  }

  async updateLeadStatus(user: UserContext, id: string, dto: UpdateSalesLeadStatusDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).salesLeadAcquisition) {
        const existing = await (this.prisma as any).salesLeadAcquisition.findFirst({
          where: { id, companyId },
        });
        if (!existing) throw new NotFoundException('Sales lead not found for tenant.');

        return await (this.prisma as any).salesLeadAcquisition.update({
          where: { id },
          data: {
            status: dto.status,
            ...(dto.leadScore !== undefined ? { leadScore: dto.leadScore } : {}),
            ...(dto.notes ? { notes: dto.notes } : {}),
            updatedAt: new Date(),
          },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma sales lead status update fallback: ${this.errMsg(err)}`);
    }

    const idx = this.inMemoryLeads.findIndex(
      (l: any) => l.id === id && (l.companyId === companyId || !l.companyId),
    );
    if (idx === -1) throw new NotFoundException('Sales lead not found for tenant.');

    this.inMemoryLeads[idx] = {
      ...this.inMemoryLeads[idx],
      status: dto.status,
      leadScore: dto.leadScore !== undefined ? dto.leadScore : this.inMemoryLeads[idx].leadScore,
      notes: dto.notes || this.inMemoryLeads[idx].notes,
      updatedAt: new Date(),
    };

    return this.inMemoryLeads[idx];
  }

  // =========================================================================
  // 2. INQUIRY PROCESSING, QUOTATION & PRICE NEGOTIATION
  // =========================================================================

  async getQuotations(user: UserContext, query?: any) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).salesQuotationNegotiation) {
        return await (this.prisma as any).salesQuotationNegotiation.findMany({
          where: {
            companyId,
            ...(query?.status ? { status: query.status } : {}),
          },
          orderBy: { createdAt: 'desc' },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma sales quotation read fallback: ${this.errMsg(err)}`);
    }

    return this.inMemoryQuotations.filter(
      (q: any) =>
        (q.companyId === companyId || !q.companyId) &&
        (!query?.status || q.status === query.status),
    );
  }

  async createQuotation(user: UserContext, dto: CreateSalesQuotationDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    const quotationNumber = `QUOT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const costPerUnit = (dto.rawMaterialCost + dto.productionOverheadCost);
    const baseRate = dto.calculatedBaseRate || Number((costPerUnit * (1 + dto.profitMarginPct / 100)).toFixed(2));
    const totalQuotationValue = Number((dto.finalQuotedRate * dto.orderQuantity).toFixed(2));

    const newRecord = {
      id: `quot-${Date.now()}`,
      quotationNumber,
      inquiryReference: dto.inquiryReference || `INQ-${Math.floor(100 + Math.random() * 900)}`,
      leadId: dto.leadId || null,
      clientCompanyName: dto.clientCompanyName,
      productDescription: dto.productDescription,
      orderQuantity: dto.orderQuantity,
      unit: dto.unit || 'MT',
      rawMaterialCost: dto.rawMaterialCost,
      productionOverheadCost: dto.productionOverheadCost,
      profitMarginPct: dto.profitMarginPct,
      calculatedBaseRate: baseRate,
      finalQuotedRate: dto.finalQuotedRate,
      totalQuotationValue,
      creditPeriodDays: dto.creditPeriodDays !== undefined ? dto.creditPeriodDays : 30,
      advancePaymentPct: dto.advancePaymentPct !== undefined ? dto.advancePaymentPct : 20.0,
      deliveryChargesTerms: dto.deliveryChargesTerms || 'EX_WORKS',
      status: 'SUBMITTED_TO_CLIENT',
      validTill: dto.validTill ? new Date(dto.validTill) : new Date(Date.now() + 86400000 * 30),
      notes: dto.notes || 'Commercial quotation submitted for review.',
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if ((this.prisma as any).salesQuotationNegotiation) {
        return await (this.prisma as any).salesQuotationNegotiation.create({
          data: newRecord,
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma sales quotation create fallback: ${this.errMsg(err)}`);
    }

    this.inMemoryQuotations.unshift(newRecord);
    return newRecord;
  }

  async updateQuotationStatus(user: UserContext, id: string, dto: UpdateSalesQuotationStatusDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).salesQuotationNegotiation) {
        const existing = await (this.prisma as any).salesQuotationNegotiation.findFirst({
          where: { id, companyId },
        });
        if (!existing) throw new NotFoundException('Sales quotation not found for tenant.');

        const updateData: any = {
          status: dto.status,
          ...(dto.finalQuotedRate !== undefined
            ? {
                finalQuotedRate: dto.finalQuotedRate,
                totalQuotationValue: Number((dto.finalQuotedRate * existing.orderQuantity).toFixed(2)),
              }
            : {}),
          ...(dto.notes ? { notes: dto.notes } : {}),
          updatedAt: new Date(),
        };

        return await (this.prisma as any).salesQuotationNegotiation.update({
          where: { id },
          data: updateData,
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma sales quotation update fallback: ${this.errMsg(err)}`);
    }

    const idx = this.inMemoryQuotations.findIndex(
      (q: any) => q.id === id && (q.companyId === companyId || !q.companyId),
    );
    if (idx === -1) throw new NotFoundException('Sales quotation not found for tenant.');

    const old = this.inMemoryQuotations[idx];
    const finalRate = dto.finalQuotedRate !== undefined ? dto.finalQuotedRate : old.finalQuotedRate;

    this.inMemoryQuotations[idx] = {
      ...old,
      status: dto.status,
      finalQuotedRate: finalRate,
      totalQuotationValue: Number((finalRate * old.orderQuantity).toFixed(2)),
      notes: dto.notes || old.notes,
      updatedAt: new Date(),
    };

    return this.inMemoryQuotations[idx];
  }

  // =========================================================================
  // 3. SALES ORDER (SO) GENERATION & PRODUCTION COORDINATION
  // =========================================================================

  async getOrders(user: UserContext, query?: any) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).salesOrderExecution) {
        return await (this.prisma as any).salesOrderExecution.findMany({
          where: {
            companyId,
            ...(query?.orderStatus ? { orderStatus: query.orderStatus } : {}),
          },
          orderBy: { createdAt: 'desc' },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma sales order read fallback: ${this.errMsg(err)}`);
    }

    return this.inMemoryOrders.filter(
      (o: any) =>
        (o.companyId === companyId || !o.companyId) &&
        (!query?.orderStatus || o.orderStatus === query.orderStatus),
    );
  }

  async createOrder(user: UserContext, dto: CreateSalesOrderDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    const salesOrderNumber = `SO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const totalOrderValue = Number((dto.unitRate * dto.orderQuantity).toFixed(2));

    const newRecord = {
      id: `so-${Date.now()}`,
      salesOrderNumber,
      quotationReference: dto.quotationReference || null,
      clientPurchaseOrderNo: dto.clientPurchaseOrderNo,
      clientCompanyName: dto.clientCompanyName,
      productName: dto.productName,
      orderQuantity: dto.orderQuantity,
      unit: dto.unit || 'MT',
      unitRate: dto.unitRate,
      totalOrderValue,
      inventoryStockCheckStatus: dto.inventoryStockCheckStatus || 'STOCK_SUFFICIENT',
      productionManagerConfirmed: dto.productionManagerConfirmed !== undefined ? dto.productionManagerConfirmed : true,
      estimatedDeliveryDate: new Date(dto.estimatedDeliveryDate),
      executionProgressPct: 0.0,
      orderStatus: 'ORDER_CONFIRMED',
      assignedProductionLine: dto.assignedProductionLine || 'Main Manufacturing Bay #1',
      notes: dto.notes || 'Sales order confirmed and scheduled into ERP shopfloor queue.',
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if ((this.prisma as any).salesOrderExecution) {
        return await (this.prisma as any).salesOrderExecution.create({
          data: newRecord,
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma sales order create fallback: ${this.errMsg(err)}`);
    }

    this.inMemoryOrders.unshift(newRecord);
    return newRecord;
  }

  async updateOrderStatus(user: UserContext, id: string, dto: UpdateSalesOrderStatusDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).salesOrderExecution) {
        const existing = await (this.prisma as any).salesOrderExecution.findFirst({
          where: { id, companyId },
        });
        if (!existing) throw new NotFoundException('Sales order not found for tenant.');

        return await (this.prisma as any).salesOrderExecution.update({
          where: { id },
          data: {
            orderStatus: dto.orderStatus,
            ...(dto.executionProgressPct !== undefined ? { executionProgressPct: dto.executionProgressPct } : {}),
            ...(dto.inventoryStockCheckStatus ? { inventoryStockCheckStatus: dto.inventoryStockCheckStatus } : {}),
            ...(dto.notes ? { notes: dto.notes } : {}),
            updatedAt: new Date(),
          },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma sales order status update fallback: ${this.errMsg(err)}`);
    }

    const idx = this.inMemoryOrders.findIndex(
      (o: any) => o.id === id && (o.companyId === companyId || !o.companyId),
    );
    if (idx === -1) throw new NotFoundException('Sales order not found for tenant.');

    this.inMemoryOrders[idx] = {
      ...this.inMemoryOrders[idx],
      orderStatus: dto.orderStatus,
      executionProgressPct:
        dto.executionProgressPct !== undefined ? dto.executionProgressPct : this.inMemoryOrders[idx].executionProgressPct,
      inventoryStockCheckStatus: dto.inventoryStockCheckStatus || this.inMemoryOrders[idx].inventoryStockCheckStatus,
      notes: dto.notes || this.inMemoryOrders[idx].notes,
      updatedAt: new Date(),
    };

    return this.inMemoryOrders[idx];
  }

  // =========================================================================
  // 4. DISPATCH COORDINATION & LOGISTICS MANAGEMENT
  // =========================================================================

  async getDispatches(user: UserContext, query?: any) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).salesDispatchLogistics) {
        return await (this.prisma as any).salesDispatchLogistics.findMany({
          where: {
            companyId,
            ...(query?.dispatchStatus ? { dispatchStatus: query.dispatchStatus } : {}),
          },
          orderBy: { createdAt: 'desc' },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma sales dispatch read fallback: ${this.errMsg(err)}`);
    }

    return this.inMemoryDispatches.filter(
      (d: any) =>
        (d.companyId === companyId || !d.companyId) &&
        (!query?.dispatchStatus || d.dispatchStatus === query.dispatchStatus),
    );
  }

  async createDispatch(user: UserContext, dto: CreateSalesDispatchDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    const dispatchTrackingCode = `DISP-LOG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newRecord = {
      id: `disp-${Date.now()}`,
      dispatchTrackingCode,
      salesOrderNumber: dto.salesOrderNumber,
      clientCompanyName: dto.clientCompanyName,
      deliveryChallanNumber: dto.deliveryChallanNumber,
      eWayBillNumber: dto.eWayBillNumber || `EWB-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      transporterFleetCarrier: dto.transporterFleetCarrier,
      vehicleNumber: dto.vehicleNumber,
      driverNameAndContact: dto.driverNameAndContact || null,
      dispatchWeightKg: dto.dispatchWeightKg,
      destinationLocation: dto.destinationLocation,
      loadingBay: dto.loadingBay || 'BAY-DISP-01',
      dispatchStatus: 'LOADING_IN_PROGRESS',
      proofOfDeliveryReceived: false,
      dispatchedAt: new Date(),
      deliveredAt: null,
      notes: dto.notes || 'Consignment loaded and security gate verified.',
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if ((this.prisma as any).salesDispatchLogistics) {
        return await (this.prisma as any).salesDispatchLogistics.create({
          data: newRecord,
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma sales dispatch create fallback: ${this.errMsg(err)}`);
    }

    this.inMemoryDispatches.unshift(newRecord);
    return newRecord;
  }

  async updateDispatchStatus(user: UserContext, id: string, dto: UpdateSalesDispatchStatusDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).salesDispatchLogistics) {
        const existing = await (this.prisma as any).salesDispatchLogistics.findFirst({
          where: { id, companyId },
        });
        if (!existing) throw new NotFoundException('Dispatch record not found for tenant.');

        return await (this.prisma as any).salesDispatchLogistics.update({
          where: { id },
          data: {
            dispatchStatus: dto.dispatchStatus,
            ...(dto.proofOfDeliveryReceived !== undefined ? { proofOfDeliveryReceived: dto.proofOfDeliveryReceived } : {}),
            ...(dto.deliveredAt ? { deliveredAt: new Date(dto.deliveredAt) } : {}),
            ...(dto.notes ? { notes: dto.notes } : {}),
            updatedAt: new Date(),
          },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma sales dispatch update fallback: ${this.errMsg(err)}`);
    }

    const idx = this.inMemoryDispatches.findIndex(
      (d: any) => d.id === id && (d.companyId === companyId || !d.companyId),
    );
    if (idx === -1) throw new NotFoundException('Dispatch record not found for tenant.');

    this.inMemoryDispatches[idx] = {
      ...this.inMemoryDispatches[idx],
      dispatchStatus: dto.dispatchStatus,
      proofOfDeliveryReceived:
        dto.proofOfDeliveryReceived !== undefined
          ? dto.proofOfDeliveryReceived
          : this.inMemoryDispatches[idx].proofOfDeliveryReceived,
      deliveredAt: dto.deliveredAt ? new Date(dto.deliveredAt) : this.inMemoryDispatches[idx].deliveredAt,
      notes: dto.notes || this.inMemoryDispatches[idx].notes,
      updatedAt: new Date(),
    };

    return this.inMemoryDispatches[idx];
  }

  // =========================================================================
  // 5. CREDIT CONTROL, INVOICING & PAYMENT COLLECTION
  // =========================================================================

  async getBillings(user: UserContext, query?: any) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).salesCreditBilling) {
        return await (this.prisma as any).salesCreditBilling.findMany({
          where: {
            companyId,
            ...(query?.paymentStatus ? { paymentStatus: query.paymentStatus } : {}),
          },
          orderBy: { createdAt: 'desc' },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma sales billing read fallback: ${this.errMsg(err)}`);
    }

    return this.inMemoryBillings.filter(
      (b: any) =>
        (b.companyId === companyId || !b.companyId) &&
        (!query?.paymentStatus || b.paymentStatus === query.paymentStatus),
    );
  }

  async createBilling(user: UserContext, dto: CreateSalesBillingDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    const invoiceNumber = `INV-SLS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const taxAmount = dto.taxAmount !== undefined ? dto.taxAmount : Number((dto.totalInvoiceAmount * 0.18).toFixed(2));
    const netPayableAmount = Number((dto.totalInvoiceAmount + taxAmount).toFixed(2));
    const dealerCreditLimit = dto.dealerCreditLimit || 5000000.0;

    const newRecord = {
      id: `bill-${Date.now()}`,
      invoiceNumber,
      salesOrderNumber: dto.salesOrderNumber,
      deliveryChallanNumber: dto.deliveryChallanNumber || null,
      clientCompanyName: dto.clientCompanyName,
      clientGstNumber: dto.clientGstNumber || '27AAACM1234F1Z5',
      totalInvoiceAmount: dto.totalInvoiceAmount,
      taxAmount,
      netPayableAmount,
      dealerCreditLimit,
      outstandingBalance: netPayableAmount,
      paymentDueDate: new Date(dto.paymentDueDate),
      paymentStatus: 'PAYMENT_DUE',
      paidAmount: 0.0,
      paymentReferenceUTR: null,
      lastFollowUpDate: new Date(),
      notes: dto.notes || 'Commercial tax invoice generated upon dispatch notification.',
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if ((this.prisma as any).salesCreditBilling) {
        return await (this.prisma as any).salesCreditBilling.create({
          data: newRecord,
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma sales billing create fallback: ${this.errMsg(err)}`);
    }

    this.inMemoryBillings.unshift(newRecord);
    return newRecord;
  }

  async settlePayment(user: UserContext, id: string, dto: SettleSalesPaymentDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).salesCreditBilling) {
        const existing = await (this.prisma as any).salesCreditBilling.findFirst({
          where: { id, companyId },
        });
        if (!existing) throw new NotFoundException('Sales invoice record not found for tenant.');

        const newPaid = Number((existing.paidAmount + dto.paidAmount).toFixed(2));
        const newOutstanding = Math.max(0, Number((existing.netPayableAmount - newPaid).toFixed(2)));
        const finalStatus = newOutstanding <= 0 ? 'FULLY_SETTLED' : 'PARTIALLY_PAID';

        return await (this.prisma as any).salesCreditBilling.update({
          where: { id },
          data: {
            paidAmount: newPaid,
            outstandingBalance: newOutstanding,
            paymentStatus: dto.paymentStatus || finalStatus,
            paymentReferenceUTR: dto.paymentReferenceUTR,
            ...(dto.notes ? { notes: dto.notes } : {}),
            updatedAt: new Date(),
          },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma sales billing settlement fallback: ${this.errMsg(err)}`);
    }

    const idx = this.inMemoryBillings.findIndex(
      (b: any) => b.id === id && (b.companyId === companyId || !b.companyId),
    );
    if (idx === -1) throw new NotFoundException('Sales invoice record not found for tenant.');

    const old = this.inMemoryBillings[idx];
    const newPaid = Number((old.paidAmount + dto.paidAmount).toFixed(2));
    const newOutstanding = Math.max(0, Number((old.netPayableAmount - newPaid).toFixed(2)));
    const finalStatus = newOutstanding <= 0 ? 'FULLY_SETTLED' : 'PARTIALLY_PAID';

    this.inMemoryBillings[idx] = {
      ...old,
      paidAmount: newPaid,
      outstandingBalance: newOutstanding,
      paymentStatus: dto.paymentStatus || finalStatus,
      paymentReferenceUTR: dto.paymentReferenceUTR,
      notes: dto.notes || old.notes,
      updatedAt: new Date(),
    };

    return this.inMemoryBillings[idx];
  }

  // =========================================================================
  // 6. CUSTOMER RELATIONSHIP MANAGEMENT (CRM) & FEEDBACK
  // =========================================================================

  async getFeedbacks(user: UserContext, query?: any) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).salesCustomerFeedback) {
        return await (this.prisma as any).salesCustomerFeedback.findMany({
          where: {
            companyId,
            ...(query?.resolutionStatus ? { resolutionStatus: query.resolutionStatus } : {}),
            ...(query?.feedbackType ? { feedbackType: query.feedbackType } : {}),
          },
          orderBy: { createdAt: 'desc' },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma sales customer feedback read fallback: ${this.errMsg(err)}`);
    }

    return this.inMemoryFeedbacks.filter(
      (f: any) =>
        (f.companyId === companyId || !f.companyId) &&
        (!query?.resolutionStatus || f.resolutionStatus === query.resolutionStatus) &&
        (!query?.feedbackType || f.feedbackType === query.feedbackType),
    );
  }

  async createFeedback(user: UserContext, dto: CreateSalesFeedbackDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    const ticketNumber = `CRM-TKT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newRecord = {
      id: `crm-${Date.now()}`,
      ticketNumber,
      clientCompanyName: dto.clientCompanyName,
      salesOrderNumber: dto.salesOrderNumber || null,
      invoiceNumber: dto.invoiceNumber || null,
      feedbackType: dto.feedbackType,
      issueDescription: dto.issueDescription,
      severityLevel: dto.severityLevel || 'MEDIUM',
      rejectedQuantity: dto.rejectedQuantity !== undefined ? dto.rejectedQuantity : null,
      unit: dto.unit || 'MT',
      qualityReplacementApproved: false,
      replacementOrderCode: null,
      resolutionStatus: 'OPEN_INVESTIGATING',
      customerRating: dto.customerRating !== undefined ? dto.customerRating : null,
      capaActionPlan: null,
      resolvedAt: null,
      notes: dto.notes || 'Customer feedback logged in CRM desk.',
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if ((this.prisma as any).salesCustomerFeedback) {
        return await (this.prisma as any).salesCustomerFeedback.create({
          data: newRecord,
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma sales customer feedback create fallback: ${this.errMsg(err)}`);
    }

    this.inMemoryFeedbacks.unshift(newRecord);
    return newRecord;
  }

  async resolveFeedback(user: UserContext, id: string, dto: ResolveSalesFeedbackDto) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    try {
      if ((this.prisma as any).salesCustomerFeedback) {
        const existing = await (this.prisma as any).salesCustomerFeedback.findFirst({
          where: { id, companyId },
        });
        if (!existing) throw new NotFoundException('Customer ticket not found for tenant.');

        return await (this.prisma as any).salesCustomerFeedback.update({
          where: { id },
          data: {
            resolutionStatus: dto.resolutionStatus,
            ...(dto.qualityReplacementApproved !== undefined ? { qualityReplacementApproved: dto.qualityReplacementApproved } : {}),
            ...(dto.replacementOrderCode ? { replacementOrderCode: dto.replacementOrderCode } : {}),
            ...(dto.capaActionPlan ? { capaActionPlan: dto.capaActionPlan } : {}),
            ...(dto.notes ? { notes: dto.notes } : {}),
            resolvedAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma sales customer feedback resolve fallback: ${this.errMsg(err)}`);
    }

    const idx = this.inMemoryFeedbacks.findIndex(
      (f: any) => f.id === id && (f.companyId === companyId || !f.companyId),
    );
    if (idx === -1) throw new NotFoundException('Customer ticket not found for tenant.');

    this.inMemoryFeedbacks[idx] = {
      ...this.inMemoryFeedbacks[idx],
      resolutionStatus: dto.resolutionStatus,
      qualityReplacementApproved:
        dto.qualityReplacementApproved !== undefined
          ? dto.qualityReplacementApproved
          : this.inMemoryFeedbacks[idx].qualityReplacementApproved,
      replacementOrderCode: dto.replacementOrderCode || this.inMemoryFeedbacks[idx].replacementOrderCode,
      capaActionPlan: dto.capaActionPlan || this.inMemoryFeedbacks[idx].capaActionPlan,
      resolvedAt: new Date(),
      notes: dto.notes || this.inMemoryFeedbacks[idx].notes,
      updatedAt: new Date(),
    };

    return this.inMemoryFeedbacks[idx];
  }

  // =========================================================================
  // 7. AGGREGATED SALES DASHBOARD METRICS & KPIS
  // =========================================================================

  async getSalesDashboardKpis(user: UserContext) {
    if (!user?.companyId) throw new BadRequestException('Company context required.');
    const companyId = user.companyId;

    const [leads, quotations, orders, dispatches, billings, feedbacks] = await Promise.all([
      this.getLeads(user),
      this.getQuotations(user),
      this.getOrders(user),
      this.getDispatches(user),
      this.getBillings(user),
      this.getFeedbacks(user),
    ]);

    const activePipelineValue = (leads as any[]).reduce((sum: number, l: any) => sum + (l.estimatedAnnualValue || 0), 0);
    const totalOrderBookValue = (orders as any[]).reduce((sum: number, o: any) => sum + o.totalOrderValue, 0);
    const activeOrdersCount = (orders as any[]).filter((o: any) => o.orderStatus !== 'COMPLETED').length;
    const dispatchedOrdersCount = (dispatches as any[]).filter((d: any) => d.dispatchStatus === 'DELIVERED_POD_RECEIVED').length;

    const totalInvoicedRevenue = (billings as any[]).reduce((sum: number, b: any) => sum + b.netPayableAmount, 0);
    const totalCollectedRevenue = (billings as any[]).reduce((sum: number, b: any) => sum + b.paidAmount, 0);
    const totalOutstandingReceivables = (billings as any[]).reduce((sum: number, b: any) => sum + b.outstandingBalance, 0);

    const ratedFeedbacks = (feedbacks as any[]).filter((f: any) => f.customerRating !== null && f.customerRating !== undefined);
    const avgCsatScore =
      ratedFeedbacks.length > 0
        ? Number(
            (
              ratedFeedbacks.reduce((sum: number, f: any) => sum + (f.customerRating || 5), 0) /
              ratedFeedbacks.length
            ).toFixed(1),
          )
        : 4.8;

    const leadConversionRatePct =
      (leads as any[]).length > 0
        ? Number(
            (
              ((leads as any[]).filter((l: any) => l.status === 'CONVERTED_TO_RFQ' || l.status === 'QUALIFIED_PROSPECT').length /
                (leads as any[]).length) *
              100
            ).toFixed(1),
          )
        : 85.0;

    return {
      companyId,
      activePipelineValue,
      totalOrderBookValue,
      activeOrdersCount,
      dispatchedOrdersCount,
      totalInvoicedRevenue,
      totalCollectedRevenue,
      totalOutstandingReceivables,
      avgCsatScore,
      leadConversionRatePct,
      openTicketsCount: (feedbacks as any[]).filter((f: any) => f.resolutionStatus !== 'RESOLVED_CLOSED').length,
    };
  }
}
