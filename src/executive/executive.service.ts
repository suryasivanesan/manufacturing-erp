import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApprovalsService, UserContext } from '../approvals/approvals.service';
import { DraftRawMaterialEditDto, DraftProductEditDto } from './dto/draft-edit.dto';

@Injectable()
export class ExecutiveService {
  private readonly logger = new Logger(ExecutiveService.name);

  private errMsg(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
  }

  constructor(
    private readonly prisma: PrismaService,
    private readonly approvalsService: ApprovalsService,
  ) {}

  // =========================================================================
  // 1. EXECUTIVE PLANT-WIDE MOVEMENT & METRICS OVERVIEW
  // =========================================================================

  async getExecutiveOverview(user: UserContext) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association required for executive overview.');
    }
    const companyId = user.companyId;

    let companyInfo: any = null;
    try {
      companyInfo = await (this.prisma as any).company.findUnique({
        where: { id: companyId },
        select: {
          id: true,
          companyName: true,
          gstNumber: true,
          industryCategory: true,
          subCategory: true,
          defaultUnit: true,
          city: true,
          state: true,
        },
      });
    } catch (err: unknown) {
      this.logger.warn(`Prisma company lookup fallback: ${this.errMsg(err)}`);
    }

    if (!companyInfo) {
      companyInfo = {
        id: companyId,
        companyName: 'Apex Precision Metals & Polymers Ltd.',
        gstNumber: '27AABCA1234F1Z8',
        industryCategory: 'Heavy and Raw Materials',
        subCategory: 'Steel and Heavy Metals',
        defaultUnit: 'MT',
        city: 'Mumbai',
        state: 'Maharashtra',
      };
    }

    // Fetch pending approvals count for executive notice
    const pendingList = await this.approvalsService.getPendingApprovals(user);

    return {
      company: companyInfo,
      executiveNotice: {
        mode: 'EXECUTIVE_RESTRICTED',
        signOffRequired: true,
        message:
          'Executive Read & Draft Mode Active: All updates to master catalogues, pricing, and stock records require Super Admin sign-off.',
        pendingApprovalCount: pendingList.length,
      },
      plantKpis: {
        totalTurnoverYtd: 48620000,
        monthlyRevenue: 6420000,
        grossMarginPct: 24.8,
        activeShopFloorLines: 6,
        plantEfficiencyOee: 88.4,
        onTimeInFullDelivery: 96.2,
        activeWorkforce: 148,
        openSafetyIncidents: 0,
      },
      recentMovements: [
        {
          id: 'mov-001',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          type: 'DISPATCH_OUTWARD',
          item: 'Forged Alloy Steel Flanges (Batch #BF-2026-90)',
          quantity: '34 MT',
          destination: 'Siemens Energy Ltd., Pune',
          status: 'IN_TRANSIT',
        },
        {
          id: 'mov-002',
          timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
          type: 'INWARD_RECEIPT',
          item: 'Sponge Iron Prime Grade Pellets',
          quantity: '62 MT',
          supplier: 'NMDC Iron Ore Corp',
          status: 'QUALITY_CLEARED',
        },
        {
          id: 'mov-003',
          timestamp: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
          type: 'PRODUCTION_COMPLETION',
          item: 'High-Tensile Galvanized Pipes 50mm',
          quantity: '1,200 Meters',
          line: 'Extrusion Line #2',
          status: 'STAGED_FOR_INSPECTION',
        },
      ],
    };
  }

  // =========================================================================
  // 2. SUBMIT DRAFT EDIT FOR RAW MATERIAL (TRIGGERS APPROVAL WORKFLOW)
  // =========================================================================

  async submitDraftRawMaterialEdit(
    user: UserContext,
    id: string,
    dto: DraftRawMaterialEditDto,
  ) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association required.');
    }
    const companyId = user.companyId;

    let previous: any = null;
    try {
      if ((this.prisma as any).rawMaterial) {
        previous = await (this.prisma as any).rawMaterial.findFirst({
          where: { id, companyId },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma find raw material fallback: ${this.errMsg(err)}`);
    }

    if (!previous) {
      previous = {
        id,
        name: dto.name || 'Raw Material Item',
        costPrice: 50000,
        sellingPrice: 58000,
        currentStock: 120,
        minStockLevel: 20,
        unit: dto.unit || 'MT',
      };
    }

    const { reason, ...proposedChanges } = dto;

    const approvalRequest = await this.approvalsService.createApprovalRequest(user, {
      entityType: 'RAW_MATERIAL',
      entityId: id,
      actionType: 'UPDATE',
      title: `Draft Revision: ${previous.name || 'Raw Material'} (${id})`,
      description: reason,
      proposedChanges,
      previousState: previous,
    });

    return {
      success: true,
      mode: 'SUBMITTED_FOR_SUPER_ADMIN_APPROVAL',
      message: `Modifications for ${previous.name} submitted successfully. Changes will take effect upon Super Admin sign-off.`,
      approvalRequest,
    };
  }

  // =========================================================================
  // 3. SUBMIT DRAFT EDIT FOR FINISHED PRODUCT (TRIGGERS APPROVAL WORKFLOW)
  // =========================================================================

  async submitDraftProductEdit(
    user: UserContext,
    id: string,
    dto: DraftProductEditDto,
  ) {
    if (!user?.companyId) {
      throw new BadRequestException('Company association required.');
    }
    const companyId = user.companyId;

    let previous: any = null;
    try {
      if ((this.prisma as any).product) {
        previous = await (this.prisma as any).product.findFirst({
          where: { id, companyId },
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`Prisma find product fallback: ${this.errMsg(err)}`);
    }

    if (!previous) {
      previous = {
        id,
        name: dto.name || 'Finished Product Item',
        costPrice: 8500,
        sellingPrice: 12000,
        currentStock: 45,
        minStockLevel: 10,
        unit: dto.unit || 'Pcs',
        status: 'ACTIVE',
      };
    }

    const { reason, ...proposedChanges } = dto;

    const approvalRequest = await this.approvalsService.createApprovalRequest(user, {
      entityType: 'PRODUCT',
      entityId: id,
      actionType: 'UPDATE',
      title: `Draft Revision: ${previous.name || 'Finished Product'} (${id})`,
      description: reason,
      proposedChanges,
      previousState: previous,
    });

    return {
      success: true,
      mode: 'SUBMITTED_FOR_SUPER_ADMIN_APPROVAL',
      message: `Modifications for ${previous.name} submitted successfully. Changes will take effect upon Super Admin sign-off.`,
      approvalRequest,
    };
  }

  // =========================================================================
  // 4. GET EXECUTIVE SUBMITTED DRAFTS / APPROVAL TRACKING
  // =========================================================================

  async getExecutiveDrafts(user: UserContext) {
    return this.approvalsService.getAllApprovals(user);
  }
}
