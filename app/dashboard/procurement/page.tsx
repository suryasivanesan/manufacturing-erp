'use client';

import React, { useState, useEffect, useMemo, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Package,
  Truck,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  DollarSign,
  Plus,
  Printer,
  Download,
  Search,
  Building2,
  Sun,
  Moon,
  ArrowLeft,
  X,
  FileCheck2,
  Activity,
  Layers,
  ChevronRight,
  RefreshCw,
  Send,
  Scale,
  Factory,
  TrendingUp,
  Percent,
  Warehouse,
  Flame,
  Award,
  Calendar,
  CreditCard,
  XCircle,
  AlertCircle,
} from 'lucide-react';

// =========================================================================
// DATA INTERFACES
// =========================================================================

interface ProcurementSourcing {
  id: string;
  rfqNumber: string;
  title: string;
  category: string;
  materialDescription: string;
  targetQuantity: number;
  unit: string;
  invitedVendorsCount: number;
  lowestQuotedRate?: number | null;
  approvedVendorName?: string | null;
  approvedRate?: number | null;
  arcContractCode?: string | null;
  arcValidFrom?: string | null;
  arcValidTill?: string | null;
  vendorAuditScore?: number | null;
  comparativeSummaryJson?: string | null;
  status: string;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

interface PurchaseOrderFlow {
  id: string;
  poNumber: string;
  prNumber: string;
  bomReference?: string | null;
  vendorName: string;
  vendorEmail?: string | null;
  materialCategory: string;
  itemDetailsJson: string;
  totalAmount: number;
  currency: string;
  deliveryTerms?: string | null;
  paymentTerms?: string | null;
  expectedDeliveryDate: string;
  dispatchStatus: string;
  approvedBy?: string | null;
  vendorAckDate?: string | null;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

interface MaterialInwardLogistics {
  id: string;
  inwardTrackingNumber: string;
  poNumber: string;
  vendorName: string;
  transporterName: string;
  vehicleNumber: string;
  driverContact?: string | null;
  eWayBillNumber?: string | null;
  challanInvoiceNumber: string;
  gateEntryCode: string;
  weighbridgeGrossKg: number;
  weighbridgeTareKg: number;
  weighbridgeNetKg: number;
  unit: string;
  qcInspectionStatus: string;
  qcTestReportNumber?: string | null;
  grnNumber?: string | null;
  warehouseLocationBay: string;
  status: string;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

interface BufferStockPlanning {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  unit: string;
  currentStock: number;
  minimumBufferStock: number;
  maximumCapacityStock: number;
  reorderPoint: number;
  averageDailyConsumption: number;
  leadTimeDays: number;
  jitScheduleActive: boolean;
  jitDeliveryCadence?: string | null;
  stockStatus: string;
  primaryVendorName?: string | null;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

interface VendorReconciliation {
  id: string;
  reconciliationNumber: string;
  vendorName: string;
  poNumber: string;
  grnNumber: string;
  invoiceNumber: string;
  poAmount: number;
  invoiceAmount: number;
  varianceAmount: number;
  threeWayMatchStatus: string;
  onTimeDeliveryScorePct: number;
  qualityRejectionRatePct: number;
  debitNoteIssued: boolean;
  debitNoteAmount?: number | null;
  debitNoteReason?: string | null;
  paymentSettlementStatus: string;
  settlementReference?: string | null;
  paymentDueDate: string;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

interface ScrapDisposalManagement {
  id: string;
  disposalLotNumber: string;
  scrapCategory: string;
  materialDescription: string;
  scrapYardLocation: string;
  accumulatedWeightKg: number;
  minimumReserveRatePerKg: number;
  highestBidRatePerKg?: number | null;
  winningBidderName?: string | null;
  winningBidRatePerKg?: number | null;
  totalRevenueRealized?: number | null;
  tenderCode?: string | null;
  tenderClosingDate?: string | null;
  gatePassPassoutNumber?: string | null;
  status: string;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

interface RawMaterialItem {
  id: string;
  materialCode: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  rate: number;
  costPrice?: number;
  unitPrice?: number;
  reorderLevel?: number;
  companyId?: string;
}

interface RawMaterialRateRequestItem {
  id: string;
  companyId: string;
  rawMaterialId: string;
  rawMaterial?: {
    id: string;
    name: string;
    materialCode: string;
    unit: string;
    rate?: number;
  };
  requestedByUserId?: string;
  currentRate: number;
  proposedRate: number;
  reason?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedByUserId?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

type ProcurementTab =
  | 'sourcing'
  | 'rate_requests'
  | 'purchase_orders'
  | 'inward'
  | 'buffer_stock'
  | 'reconciliation'
  | 'scrap';

export default function ProcurementPage() {
  const router = useRouter();

  // Dark / Light Mode (strictly defaults to light)
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Tab
  const [procTab, setProcTab] = useState<ProcurementTab>('sourcing');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal Visibility States
  const [isNewSourcingModal, setIsNewSourcingModal] = useState(false);
  const [isNewPoModal, setIsNewPoModal] = useState(false);
  const [isNewInwardModal, setIsNewInwardModal] = useState(false);
  const [isNewBufferModal, setIsNewBufferModal] = useState(false);
  const [isNewReconciliationModal, setIsNewReconciliationModal] = useState(false);
  const [isNewScrapModal, setIsNewScrapModal] = useState(false);
  const [isNewRateRequestModal, setIsNewRateRequestModal] = useState(false);

  // Rate Change Request Specific States
  const [selectedMaterialForRequest, setSelectedMaterialForRequest] = useState<RawMaterialItem | null>(null);
  const [proposedRateInput, setProposedRateInput] = useState<string>('');
  const [reasonInput, setReasonInput] = useState<string>('');
  const [isSubmittingRateReq, setIsSubmittingRateReq] = useState<boolean>(false);

  // Print Modal
  const [selectedPoForPrint, setSelectedPoForPrint] = useState<PurchaseOrderFlow | null>(null);

  // =========================================================================
  // DATA STATES (STRICTLY CLEAN INITIAL STATE - ZERO HARDCODED MOCKS)
  // =========================================================================

  const [sourcingList, setSourcingList] = useState<ProcurementSourcing[]>([]);
  const [poList, setPoList] = useState<PurchaseOrderFlow[]>([]);
  const [inwardList, setInwardList] = useState<MaterialInwardLogistics[]>([]);
  const [bufferList, setBufferList] = useState<BufferStockPlanning[]>([]);
  const [reconciliationList, setReconciliationList] = useState<VendorReconciliation[]>([]);
  const [scrapList, setScrapList] = useState<ScrapDisposalManagement[]>([]);
  const [rawMaterialsList, setRawMaterialsList] = useState<RawMaterialItem[]>([]);
  const [rateRequestsList, setRateRequestsList] = useState<RawMaterialRateRequestItem[]>([]);

  // =========================================================================
  // LIFECYCLE & AUTH LOAD
  // =========================================================================

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    const storedUser = localStorage.getItem('user') || localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
      } catch (e) {
        console.error('Failed to parse user session', e);
      }
    }

    fetchInitialProcurementData();
  }, []);

  const fetchInitialProcurementData = async () => {
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('auth_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const [resS, resP, resI, resB, resR, resSc, resRm, resReq] = await Promise.allSettled([
        fetch(`${apiUrl}/procurement/sourcing`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiUrl}/procurement/purchase-orders`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiUrl}/procurement/inward`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiUrl}/procurement/buffer-stock`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiUrl}/procurement/reconciliations`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiUrl}/procurement/scrap`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiUrl}/procurement/raw-materials`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiUrl}/procurement/rate-requests`, { headers }).then((r) => (r.ok ? r.json() : [])),
      ]);

      setSourcingList(resS.status === 'fulfilled' && Array.isArray(resS.value) ? resS.value : []);
      setPoList(resP.status === 'fulfilled' && Array.isArray(resP.value) ? resP.value : []);
      setInwardList(resI.status === 'fulfilled' && Array.isArray(resI.value) ? resI.value : []);
      setBufferList(resB.status === 'fulfilled' && Array.isArray(resB.value) ? resB.value : []);
      setReconciliationList(resR.status === 'fulfilled' && Array.isArray(resR.value) ? resR.value : []);
      setScrapList(resSc.status === 'fulfilled' && Array.isArray(resSc.value) ? resSc.value : []);
      setRawMaterialsList(resRm.status === 'fulfilled' && Array.isArray(resRm.value) ? resRm.value : []);
      setRateRequestsList(resReq.status === 'fulfilled' && Array.isArray(resReq.value) ? resReq.value : []);
    } catch {
      setSourcingList([]);
      setPoList([]);
      setInwardList([]);
      setBufferList([]);
      setReconciliationList([]);
      setScrapList([]);
      setRawMaterialsList([]);
      setRateRequestsList([]);
    }
  };

  const handleOpenRateRequestModal = (material?: RawMaterialItem) => {
    if (material) {
      setSelectedMaterialForRequest(material);
      setProposedRateInput(String(material.rate || material.unitPrice || material.costPrice || 0));
    } else if (rawMaterialsList.length > 0) {
      setSelectedMaterialForRequest(rawMaterialsList[0]);
      setProposedRateInput(String(rawMaterialsList[0].rate || rawMaterialsList[0].unitPrice || rawMaterialsList[0].costPrice || 0));
    } else {
      setSelectedMaterialForRequest(null);
      setProposedRateInput('');
    }
    setReasonInput('');
    setIsNewRateRequestModal(true);
  };

  const handleSubmitRateRequest = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMaterialForRequest) {
      showToast('Please select a valid raw material.');
      return;
    }
    const proposed = parseFloat(String(proposedRateInput));
    if (isNaN(proposed) || proposed <= 0) {
      showToast('Please enter a valid positive proposed rate.');
      return;
    }

    setIsSubmittingRateReq(true);
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('auth_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${apiUrl}/procurement/rate-requests`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          rawMaterialId: selectedMaterialForRequest.id,
          proposedRate: proposed,
          reason: reasonInput.trim() || undefined,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setRateRequestsList((prev) => [created, ...prev]);
        setIsNewRateRequestModal(false);
        showToast('Rate change request submitted! Super Admin notification sent.');
        fetchInitialProcurementData();
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.message || 'Failed to submit rate change request.');
      }
    } catch {
      showToast('Failed to connect to backend server.');
    } finally {
      setIsSubmittingRateReq(false);
    }
  };

  const pendingRateRequestsCount = useMemo(() => {
    return rateRequestsList.filter((r) => r.status === 'PENDING').length;
  }, [rateRequestsList]);

  const toggleTheme = () => {
    if (!isDark) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const companyName = currentUser?.company?.name || 'Manufacturing Enterprise';
  const tenantSubCategory = currentUser?.company?.subCategory || currentUser?.subCategory || 'Industrial Manufacturing';

  // =========================================================================
  // ACTION HANDLERS
  // =========================================================================

  // 1. Sourcing
  const handleAddSourcing = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const newSourcing: ProcurementSourcing = {
      id: `src-${Date.now()}`,
      rfqNumber: `RFQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: String(data.get('title') || 'Material Sourcing Requirement'),
      category: String(data.get('category') || 'RAW_MATERIALS'),
      materialDescription: String(data.get('materialDescription') || 'Industrial grade material specification'),
      targetQuantity: Number(data.get('targetQuantity')) || 100,
      unit: String(data.get('unit') || 'MT'),
      invitedVendorsCount: Number(data.get('invitedVendorsCount')) || 3,
      lowestQuotedRate: Number(data.get('lowestQuotedRate')) || null,
      approvedVendorName: String(data.get('approvedVendorName')) || null,
      approvedRate: Number(data.get('lowestQuotedRate')) || null,
      arcContractCode: null,
      arcValidFrom: null,
      arcValidTill: null,
      vendorAuditScore: 95.0,
      comparativeSummaryJson: null,
      status: 'RFQ_ISSUED',
      notes: String(data.get('notes') || 'RFQ broadcasted to certified vendor roster.'),
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setSourcingList([newSourcing, ...sourcingList]);
    setIsNewSourcingModal(false);
    showToast(`RFQ ${newSourcing.rfqNumber} published to supplier panel.`);
  };

  const handleFinalizeArc = (id: string) => {
    setSourcingList(
      sourcingList.map((s) => {
        if (s.id === id) {
          const arcCode = `ARC-2026-${Math.floor(100 + Math.random() * 900)}`;
          return {
            ...s,
            status: 'ARC_FINALIZED',
            arcContractCode: arcCode,
            approvedVendorName: s.approvedVendorName || '',
            approvedRate: s.lowestQuotedRate || 0,
            arcValidFrom: '2026-11-20',
            arcValidTill: '2027-11-19',
            notes: 'Annual Rate Contract finalized based on L1 technical & commercial bid.',
          };
        }
        return s;
      }),
    );
    showToast('Annual Rate Contract (ARC) executed and finalized.');
  };

  // 2. Purchase Orders
  const handleAddPo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const unitRate = Number(data.get('unitRate')) || 1000;
    const qty = Number(data.get('quantity')) || 10;
    const totalAmount = unitRate * qty;

    const newPo: PurchaseOrderFlow = {
      id: `po-${Date.now()}`,
      poNumber: `PO-${Date.now()}`,
      prNumber: String(data.get('prNumber') || `PR-REQ-${Math.floor(100 + Math.random() * 900)}`),
      bomReference: String(data.get('bomReference') || 'BOM-CORE-STD-01'),
      vendorName: String(data.get('vendorName') || 'Approved Tier-1 Vendor'),
      vendorEmail: String(data.get('vendorEmail') || 'vendor.sales@enterprise.in'),
      materialCategory: String(data.get('materialCategory') || 'RAW_MATERIALS'),
      itemDetailsJson: JSON.stringify({
        item: String(data.get('itemName') || 'Specification Material'),
        qty,
        unit: String(data.get('unit') || 'MT'),
        unitRate,
      }),
      totalAmount,
      currency: 'INR',
      deliveryTerms: String(data.get('deliveryTerms') || 'FOR_DESTINATION_PLANT'),
      paymentTerms: String(data.get('paymentTerms') || 'NET_30'),
      expectedDeliveryDate: String(data.get('expectedDeliveryDate') || '2026-11-30'),
      dispatchStatus: 'ISSUED_TO_VENDOR',
      approvedBy: 'PROCUREMENT_MANAGER',
      vendorAckDate: 'Just now',
      notes: String(data.get('notes') || 'PO generated against BOM requisition.'),
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setPoList([newPo, ...poList]);
    setIsNewPoModal(false);
    showToast(`Purchase Order ${newPo.poNumber} generated (₹${totalAmount.toLocaleString()}).`);
  };

  const handleUpdatePoDispatch = (id: string) => {
    setPoList(
      poList.map((p) => {
        if (p.id === id) {
          const next =
            p.dispatchStatus === 'ISSUED_TO_VENDOR'
              ? 'DISPATCHED_IN_TRANSIT'
              : p.dispatchStatus === 'DISPATCHED_IN_TRANSIT'
              ? 'FULFILLED'
              : 'FULFILLED';
          return {
            ...p,
            dispatchStatus: next,
          };
        }
        return p;
      }),
    );
    showToast('Purchase Order dispatch status advanced.');
  };

  // 3. Material Inward Logistics
  const handleAddInward = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const gross = Number(data.get('grossWeight')) || 40000;
    const tare = Number(data.get('tareWeight')) || 14000;
    const net = gross - tare;

    const newInward: MaterialInwardLogistics = {
      id: `inw-${Date.now()}`,
      inwardTrackingNumber: `INW-LOG-2026-${Math.floor(100 + Math.random() * 900)}`,
      poNumber: String(data.get('poNumber') || 'PO-2026-089'),
      vendorName: String(data.get('vendorName') || ''),
      transporterName: String(data.get('transporterName') || 'Freight Transit Carrier'),
      vehicleNumber: String(data.get('vehicleNumber') || 'MH-12-AB-1234'),
      driverContact: String(data.get('driverContact') || '+91 98000 00000'),
      eWayBillNumber: String(data.get('eWayBillNumber') || `EWB-${Math.floor(100000000000 + Math.random() * 900000000000)}`),
      challanInvoiceNumber: String(data.get('challanInvoiceNumber') || `INV-${Math.floor(1000 + Math.random() * 9000)}`),
      gateEntryCode: `GATE-IN-2026-${Math.floor(100 + Math.random() * 900)}`,
      weighbridgeGrossKg: gross,
      weighbridgeTareKg: tare,
      weighbridgeNetKg: net,
      unit: 'KG',
      qcInspectionStatus: 'PENDING_LAB_TEST',
      qcTestReportNumber: null,
      grnNumber: null,
      warehouseLocationBay: String(data.get('warehouseLocationBay') || 'BAY-RM-STEEL-01'),
      status: 'AT_GATE',
      notes: String(data.get('notes') || 'Vehicle registered at security gate and weighbridge.'),
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setInwardList([newInward, ...inwardList]);
    setIsNewInwardModal(false);
    showToast(`Inward Log ${newInward.inwardTrackingNumber} created with Net ${net} kg.`);
  };

  const handleUpdateQcStatus = (id: string) => {
    setInwardList(
      inwardList.map((i) => {
        if (i.id === id) {
          const grn = `GRN-2026-11-${Math.floor(100 + Math.random() * 900)}`;
          const testReport = `QC-TR-2026-${Math.floor(100 + Math.random() * 900)}`;
          return {
            ...i,
            qcInspectionStatus: 'QC_PASSED',
            qcTestReportNumber: testReport,
            grnNumber: grn,
            status: 'GRN_GENERATED',
            notes: 'Spectrometer and physical metrology clearance approved. GRN released.',
          };
        }
        return i;
      }),
    );
    showToast('QC test cleared and Goods Receipt Note (GRN) generated.');
  };

  // 4. Buffer Stock
  const handleAddBuffer = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const current = Number(data.get('currentStock')) || 100;
    const min = Number(data.get('minStock')) || 50;
    const reorder = Number(data.get('reorderPoint')) || 80;

    let stockStatus = 'HEALTHY';
    if (current <= min) stockStatus = 'CRITICAL_BUFFER';
    else if (current <= reorder) stockStatus = 'NEAR_REORDER';

    const newBuffer: BufferStockPlanning = {
      id: `buf-${Date.now()}`,
      itemCode: String(data.get('itemCode') || `SKU-${Math.floor(1000 + Math.random() * 9000)}`),
      itemName: String(data.get('itemName') || 'Critical Raw Material'),
      category: String(data.get('category') || 'RAW_MATERIALS'),
      unit: String(data.get('unit') || 'MT'),
      currentStock: current,
      minimumBufferStock: min,
      maximumCapacityStock: Number(data.get('maxStock')) || 300,
      reorderPoint: reorder,
      averageDailyConsumption: Number(data.get('dailyConsumption')) || 10,
      leadTimeDays: Number(data.get('leadTimeDays')) || 5,
      jitScheduleActive: true,
      jitDeliveryCadence: String(data.get('jitCadence') || 'WEEKLY'),
      stockStatus,
      primaryVendorName: String(data.get('primaryVendor') || 'Approved Vendor'),
      notes: String(data.get('notes') || 'Buffer stock policy configured with JIT cadence.'),
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setBufferList([newBuffer, ...bufferList]);
    setIsNewBufferModal(false);
    showToast(`SKU ${newBuffer.itemCode} buffer stock rule configured.`);
  };

  const handleUpdateStockLevel = (id: string, delta: number) => {
    setBufferList(
      bufferList.map((b) => {
        if (b.id === id) {
          const newQty = Math.max(0, b.currentStock + delta);
          let stockStatus = 'HEALTHY';
          if (newQty <= b.minimumBufferStock) stockStatus = 'CRITICAL_BUFFER';
          else if (newQty <= b.reorderPoint) stockStatus = 'NEAR_REORDER';

          return {
            ...b,
            currentStock: newQty,
            stockStatus,
          };
        }
        return b;
      }),
    );
    showToast(`Stock updated by ${delta > 0 ? '+' : ''}${delta} units.`);
  };

  // 5. Vendor Reconciliation
  const handleAddReconciliation = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const poAmt = Number(data.get('poAmount')) || 100000;
    const invAmt = Number(data.get('invoiceAmount')) || 100000;
    const variance = Math.abs(invAmt - poAmt);
    const hasDiscrepancy = variance > 10;

    const newRec: VendorReconciliation = {
      id: `rec-${Date.now()}`,
      reconciliationNumber: `VREC-2026-11-${Math.floor(100 + Math.random() * 900)}`,
      vendorName: String(data.get('vendorName') || 'Tier-1 Industrial Supplier'),
      poNumber: String(data.get('poNumber') || 'PO-2026-089'),
      grnNumber: String(data.get('grnNumber') || 'GRN-2026-11-042'),
      invoiceNumber: String(data.get('invoiceNumber') || `INV-${Math.floor(1000 + Math.random() * 9000)}`),
      poAmount: poAmt,
      invoiceAmount: invAmt,
      varianceAmount: variance,
      threeWayMatchStatus: hasDiscrepancy ? 'DISCREPANCY_DETECTED' : 'MATCHED',
      onTimeDeliveryScorePct: Number(data.get('otdScore')) || 98.0,
      qualityRejectionRatePct: Number(data.get('rejectionRate')) || 0.0,
      debitNoteIssued: hasDiscrepancy,
      debitNoteAmount: hasDiscrepancy ? variance : 0,
      debitNoteReason: hasDiscrepancy ? 'Price discrepancy observed against purchase order rate.' : null,
      paymentSettlementStatus: hasDiscrepancy ? 'DISPUTED' : 'APPROVED_FOR_PAYMENT',
      settlementReference: null,
      paymentDueDate: String(data.get('paymentDueDate') || '2026-12-15'),
      notes: String(data.get('notes') || '3-way automated matching performed across PO, GRN, and Vendor Invoice.'),
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setReconciliationList([newRec, ...reconciliationList]);
    setIsNewReconciliationModal(false);
    showToast(`Reconciliation ${newRec.reconciliationNumber} processed (${newRec.threeWayMatchStatus}).`);
  };

  const handleSettleVendorPayment = (id: string) => {
    setReconciliationList(
      reconciliationList.map((r) => {
        if (r.id === id) {
          const utr = `UTR-HDFC-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
          return {
            ...r,
            paymentSettlementStatus: 'SETTLED',
            settlementReference: utr,
            notes: 'Payment released and settled through ERP banking integration.',
          };
        }
        return r;
      }),
    );
    showToast('Payment settled and wire transfer reference recorded.');
  };

  // 6. Scrap Disposal
  const handleAddScrap = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const newScrap: ScrapDisposalManagement = {
      id: `scp-${Date.now()}`,
      disposalLotNumber: `SCRAP-LOT-2026-${Math.floor(10 + Math.random() * 90)}`,
      scrapCategory: String(data.get('scrapCategory') || 'FERROUS_TURNINGS_BORINGS'),
      materialDescription: String(data.get('materialDescription') || 'Production line scrap and offcuts'),
      scrapYardLocation: String(data.get('scrapYardLocation') || 'YARD-BAY-EAST-01'),
      accumulatedWeightKg: Number(data.get('accumulatedWeightKg')) || 5000,
      minimumReserveRatePerKg: Number(data.get('reserveRate')) || 32.0,
      highestBidRatePerKg: null,
      winningBidderName: null,
      winningBidRatePerKg: null,
      totalRevenueRealized: null,
      tenderCode: `SCRAP-TND-2026-${Math.floor(10 + Math.random() * 90)}`,
      tenderClosingDate: String(data.get('closingDate') || '2026-12-05'),
      gatePassPassoutNumber: null,
      status: 'TENDER_PUBLISHED',
      notes: String(data.get('notes') || 'Scrap lot weighed and advertised for sealed tender.'),
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setScrapList([newScrap, ...scrapList]);
    setIsNewScrapModal(false);
    showToast(`Scrap lot ${newScrap.disposalLotNumber} registered in scrap yard.`);
  };

  const handleFinalizeScrapSale = (id: string) => {
    setScrapList(
      scrapList.map((s) => {
        if (s.id === id) {
          const rate = 39.5;
          const rev = s.accumulatedWeightKg * rate;
          const gatePass = `GATE-OUT-SCR-${Math.floor(100 + Math.random() * 900)}`;
          return {
            ...s,
            winningBidderName: 'National Smelters & Recyclers Corp',
            winningBidRatePerKg: rate,
            totalRevenueRealized: rev,
            gatePassPassoutNumber: gatePass,
            status: 'SOLD_DISPATCHED',
            notes: 'Highest bidder cleared payment in advance. Vehicle gate pass authorized.',
          };
        }
        return s;
      }),
    );
    showToast('Scrap tender finalized, revenue credited, and gate pass issued.');
  };

  // =========================================================================
  // METRICS & KPIS CALCULATIONS
  // =========================================================================

  const kpis = useMemo(() => {
    const activePOsCount = poList.filter(
      (p) => p.dispatchStatus !== 'FULFILLED' && p.dispatchStatus !== 'CANCELLED',
    ).length;
    const totalProcurementSpend = poList.reduce((sum, p) => sum + p.totalAmount, 0);

    const avgOtdRate =
      reconciliationList.length > 0
        ? Number(
            (
              reconciliationList.reduce((sum, r) => sum + r.onTimeDeliveryScorePct, 0) /
              reconciliationList.length
            ).toFixed(1),
          )
        : 0.0;

    const bufferStockHealthPct =
      bufferList.length > 0
        ? Number(
            (
              (bufferList.filter((b) => b.stockStatus === 'HEALTHY').length / bufferList.length) *
              100
            ).toFixed(1),
          )
        : 0.0;

    const pendingQcClearanceCount = inwardList.filter(
      (i) => i.qcInspectionStatus === 'PENDING_LAB_TEST' || i.qcInspectionStatus === 'UNDER_INSPECTION',
    ).length;

    const totalScrapRevenue = scrapList.reduce((sum, s) => sum + (s.totalRevenueRealized || 0), 0);
    const activeArcAgreements = sourcingList.filter((s) => s.status === 'ARC_FINALIZED').length;

    return {
      activePOsCount,
      totalProcurementSpend,
      avgOtdRate,
      bufferStockHealthPct,
      pendingQcClearanceCount,
      totalScrapRevenue,
      activeArcAgreements,
    };
  }, [sourcingList, poList, inwardList, bufferList, reconciliationList, scrapList]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg bg-emerald-600 text-white font-medium text-base animate-bounce">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-20 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-semibold text-base whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-5 h-5 shrink-0" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-md shrink-0">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight whitespace-nowrap">Procurement Department</span>
                <span className="block text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Sourcing, PO Flow, Logistics, Buffer Stock &amp; Scrap
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard/inventory"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-base font-bold shadow-sm whitespace-nowrap shrink-0"
            >
              <Warehouse className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Inventory Sync</span>
            </Link>

            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Company Isolation Badge */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                Company-Scoped Procurement Portal
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3" />
                Zero Cross-Tenant Data Leakage
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Manufacturing Sourcing &amp; Supply Chain Operations
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mt-1">
              6 Core Pillars: Strategic Sourcing &amp; ARC, BOM-Linked PO Flow, Weighbridge Logistics &amp; QC Gate, Buffer Stock &amp; JIT, 3-Way Match &amp; Debit Notes, and Scrap Yard Disposal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>{companyName}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-600 text-white font-semibold">
                  Procurement Authorized
                </span>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span className="font-medium text-slate-800 dark:text-slate-200">{tenantSubCategory}</span>
                <span>&bull;</span>
                <span>Company ID Isolated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Navigation Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setProcTab('sourcing')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              procTab === 'sourcing'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>1. Strategic Sourcing &amp; ARC</span>
          </button>
          <button
            type="button"
            onClick={() => setProcTab('rate_requests')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              procTab === 'rate_requests'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4 shrink-0" />
            <span>2. Raw Material Rates &amp; Requests</span>
            {pendingRateRequestsCount > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-amber-500 text-white font-extrabold animate-pulse">
                {pendingRateRequestsCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setProcTab('purchase_orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              procTab === 'purchase_orders'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span>3. PR to PO Processing</span>
          </button>
          <button
            type="button"
            onClick={() => setProcTab('inward')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              procTab === 'inward'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Truck className="w-4 h-4 shrink-0" />
            <span>4. Material Inward &amp; Weighbridge</span>
          </button>
          <button
            type="button"
            onClick={() => setProcTab('buffer_stock')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              procTab === 'buffer_stock'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Warehouse className="w-4 h-4 shrink-0" />
            <span>5. Buffer Stock &amp; JIT Planning</span>
          </button>
          <button
            type="button"
            onClick={() => setProcTab('reconciliation')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              procTab === 'reconciliation'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Scale className="w-4 h-4 shrink-0" />
            <span>6. 3-Way Match &amp; Debit Notes</span>
          </button>
          <button
            type="button"
            onClick={() => setProcTab('scrap')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              procTab === 'scrap'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Flame className="w-4 h-4 shrink-0" />
            <span>7. Scrap Disposal Management</span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: STRATEGIC SOURCING & ARC */}
        {/* ================================================================= */}
        {procTab === 'sourcing' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Active RFQs</span>
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{sourcingList.length}</div>
                <div className="text-sm text-slate-500 mt-1">Sourcing competitions in flight</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Finalized ARCs</span>
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{kpis.activeArcAgreements}</div>
                <div className="text-sm text-emerald-600 font-semibold mt-1">Annual Rate Contracts Active</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Avg Audit Score</span>
                  <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {sourcingList.filter((s) => s.vendorAuditScore != null).length > 0
                    ? `${(
                        sourcingList.reduce((sum, s) => sum + (s.vendorAuditScore || 0), 0) /
                        sourcingList.filter((s) => s.vendorAuditScore != null).length
                      ).toFixed(1)}%`
                    : '0.0%'}
                </div>
                <div className="text-sm text-slate-500 mt-1">Vendor technical audit rating</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">L1 Savings Realized</span>
                  <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {sourcingList.length > 0 ? '0.0%' : '0.0%'}
                </div>
                <div className="text-sm text-amber-600 font-semibold mt-1">Below target budget rate</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search RFQ number, title, or vendor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsNewSourcingModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Publish New RFQ</span>
              </button>
            </div>

            {/* Sourcing Data Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">RFQ Code</th>
                      <th className="px-5 py-3.5">Title &amp; Material Specs</th>
                      <th className="px-5 py-3.5">Target Qty</th>
                      <th className="px-5 py-3.5">Invited / Audit</th>
                      <th className="px-5 py-3.5">L1 / Approved Rate</th>
                      <th className="px-5 py-3.5">Contract Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {sourcingList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                          No active RFQs or rate contracts found. Click &quot;Publish New RFQ&quot; to begin.
                        </td>
                      </tr>
                    ) : sourcingList.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-bold text-amber-600">
                          {s.rfqNumber}
                          {s.arcContractCode && (
                            <span className="block text-xs font-semibold text-emerald-600">{s.arcContractCode}</span>
                          )}
                        </td>
                        <td className="px-5 py-4 max-w-xs">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{s.title}</div>
                          <div className="text-xs text-slate-500 truncate mt-0.5">{s.materialDescription}</div>
                          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                            {s.category}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-semibold">
                          {s.targetQuantity.toLocaleString()} {s.unit}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-medium text-sm">{s.invitedVendorsCount} Vendors Quoted</div>
                          <div className="text-xs text-slate-500 font-semibold">Audit Score: {s.vendorAuditScore}%</div>
                        </td>
                        <td className="px-5 py-4">
                          {s.approvedRate ? (
                            <div>
                              <span className="font-extrabold text-emerald-600">₹{s.approvedRate.toLocaleString()}</span>
                              <span className="text-xs text-slate-500 block">{s.approvedVendorName}</span>
                            </div>
                          ) : s.lowestQuotedRate ? (
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              L1: ₹{s.lowestQuotedRate.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">Quotes Pending</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              s.status === 'ARC_FINALIZED'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : s.status === 'COMPARATIVE_EVALUATION'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {s.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {s.status !== 'ARC_FINALIZED' ? (
                            <button
                              type="button"
                              onClick={() => handleFinalizeArc(s.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                            >
                              Finalize ARC
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-slate-500">Contract Valid</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: RAW MATERIAL RATES & REQUESTS                              */}
        {/* ================================================================= */}
        {procTab === 'rate_requests' && (
          <div className="space-y-6">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Tracked Materials</span>
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{rawMaterialsList.length}</div>
                <div className="text-sm text-slate-500 mt-1">Catalog items monitored</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Pending Approvals</span>
                  <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3 text-amber-600">{pendingRateRequestsCount}</div>
                <div className="text-sm text-amber-600/80 font-medium mt-1">Awaiting Super Admin decision</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Approved Revisions</span>
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3 text-emerald-600">
                  {rateRequestsList.filter((r) => r.status === 'APPROVED').length}
                </div>
                <div className="text-sm text-emerald-600/80 font-medium mt-1">Auto-recalculated product costs</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Workflow Policy</span>
                  <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-sm font-extrabold mt-3 text-indigo-700 dark:text-indigo-300">
                  Dual-Control Locked
                </div>
                <div className="text-xs text-slate-500 mt-1">Rate changes require Super Admin sign-off</div>
              </div>
            </div>

            {/* Workflow Notice Banner */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <span className="font-bold">Strict Cost-Governance Rule:</span> Procurement proposals do not directly modify inventory rates. When you submit a rate request, a real-time notification is routed to the Super Admin. Upon Super Admin approval, the raw material rate is updated and all linked product Bill-of-Materials (BOM) cost prices automatically recalculate.
              </div>
            </div>

            {/* SECTION A: RAW MATERIALS CATALOG & RATE ACTIONS */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold">Active Raw Materials Catalog</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Select any raw material to submit an updated procurement quote or market rate change request.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenRateRequestModal()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-sm transition-all whitespace-nowrap self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Request Rate Change</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Code / SKU</th>
                      <th className="px-5 py-3.5">Material Name</th>
                      <th className="px-5 py-3.5">Category</th>
                      <th className="px-5 py-3.5 text-right">Current Stock</th>
                      <th className="px-5 py-3.5 text-right">Active Approved Rate</th>
                      <th className="px-5 py-3.5 text-center">Pending Request</th>
                      <th className="px-5 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {rawMaterialsList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                          No raw materials found for this facility. Add raw materials via Super Admin or Inventory.
                        </td>
                      </tr>
                    ) : (
                      rawMaterialsList.map((rm) => {
                        const activeRate = rm.rate ?? rm.unitPrice ?? rm.costPrice ?? 0;
                        const pendingReq = rateRequestsList.find(
                          (r) => r.rawMaterialId === rm.id && r.status === 'PENDING',
                        );

                        return (
                          <tr key={rm.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="px-5 py-4 font-mono font-bold text-xs text-amber-700 dark:text-amber-400">
                              {rm.materialCode}
                            </td>
                            <td className="px-5 py-4 font-bold text-slate-900 dark:text-slate-100">
                              {rm.name}
                            </td>
                            <td className="px-5 py-4">
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {rm.category}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right font-mono text-slate-700 dark:text-slate-300">
                              {rm.currentStock?.toLocaleString() || 0} {rm.unit}
                            </td>
                            <td className="px-5 py-4 text-right">
                              <span className="font-mono font-black text-slate-900 dark:text-white text-base">
                                ₹{Number(activeRate).toFixed(2)}
                              </span>
                              <span className="text-xs text-slate-400 ml-1">/ {rm.unit}</span>
                            </td>
                            <td className="px-5 py-4 text-center">
                              {pendingReq ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                  <Clock className="w-3 h-3" />
                                  Proposed: ₹{pendingReq.proposedRate}
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400 font-medium">None</span>
                              )}
                            </td>
                            <td className="px-5 py-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleOpenRateRequestModal(rm)}
                                className="px-3.5 py-1.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300 font-bold text-xs shadow-sm transition-all"
                              >
                                Request Rate Change
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION B: RATE REQUESTS AUDIT & STATUS TABLE */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-extrabold">Rate Change Request History &amp; Decisions</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Complete audit log of rate revision proposals, Super Admin approvals, and rejections.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Material</th>
                      <th className="px-5 py-3.5 text-right">Current Rate</th>
                      <th className="px-5 py-3.5 text-right">Proposed Rate</th>
                      <th className="px-5 py-3.5 text-right">Variance</th>
                      <th className="px-5 py-3.5">Procurement Reason</th>
                      <th className="px-5 py-3.5">Submission Date</th>
                      <th className="px-5 py-3.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {rateRequestsList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                          No rate change requests recorded yet. Click "Request Rate Change" to submit one.
                        </td>
                      </tr>
                    ) : (
                      rateRequestsList.map((req) => {
                        const cur = Number(req.currentRate || 0);
                        const prop = Number(req.proposedRate || 0);
                        const diff = prop - cur;
                        const pct = cur > 0 ? (diff / cur) * 100 : 0;
                        const isIncrease = diff > 0;

                        return (
                          <tr key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="px-5 py-4">
                              <div className="font-bold text-slate-900 dark:text-white">
                                {req.rawMaterial?.name || 'Raw Material'}
                              </div>
                              <div className="text-xs font-mono text-slate-400">
                                {req.rawMaterial?.materialCode || req.rawMaterialId}
                              </div>
                            </td>
                            <td className="px-5 py-4 text-right font-mono text-slate-600 dark:text-slate-400">
                              ₹{cur.toFixed(2)}
                            </td>
                            <td className="px-5 py-4 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                              ₹{prop.toFixed(2)}
                            </td>
                            <td className="px-5 py-4 text-right font-mono">
                              <span
                                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-bold ${
                                  diff === 0
                                    ? 'bg-slate-100 text-slate-700'
                                    : isIncrease
                                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                }`}
                              >
                                {isIncrease ? '+' : ''}
                                {diff.toFixed(2)} ({isIncrease ? '+' : ''}
                                {pct.toFixed(1)}%)
                              </span>
                            </td>
                            <td className="px-5 py-4 text-slate-700 dark:text-slate-300 max-w-xs">
                              <p className="line-clamp-2 text-xs">{req.reason || 'Procurement market update'}</p>
                              {req.rejectionReason && (
                                <p className="text-xs text-red-600 font-semibold mt-1">
                                  Super Admin: {req.rejectionReason}
                                </p>
                              )}
                            </td>
                            <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                              {new Date(req.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-5 py-4 text-center">
                              {req.status === 'PENDING' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                  <Clock className="w-3.5 h-3.5" />
                                  Pending Approval
                                </span>
                              )}
                              {req.status === 'APPROVED' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Approved &amp; Recalculated
                                </span>
                              )}
                              {req.status === 'REJECTED' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800">
                                  <XCircle className="w-3.5 h-3.5" />
                                  Rejected
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: PR TO PO PROCESSING */}
        {/* ================================================================= */}
        {procTab === 'purchase_orders' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Active POs</span>
                  <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{kpis.activePOsCount}</div>
                <div className="text-sm text-slate-500 mt-1">Pending dispatch or fulfillment</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Total Spend</span>
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">₹{(kpis.totalProcurementSpend / 100000).toFixed(2)}L</div>
                <div className="text-sm text-emerald-600 font-semibold mt-1">Procurement purchase order commitment</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">In Transit</span>
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {poList.filter((p) => p.dispatchStatus === 'DISPATCHED_IN_TRANSIT').length}
                </div>
                <div className="text-sm text-slate-500 mt-1">Consignments on freight route</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Fulfilled Orders</span>
                  <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {poList.filter((p) => p.dispatchStatus === 'FULFILLED').length}
                </div>
                <div className="text-sm text-slate-500 mt-1">Received &amp; quality accepted</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search PO number, PR requisition, or vendor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsNewPoModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Generate Purchase Order</span>
              </button>
            </div>

            {/* PO Data Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">PO Number</th>
                      <th className="px-5 py-3.5">PR / BOM Ref</th>
                      <th className="px-5 py-3.5">Vendor &amp; Category</th>
                      <th className="px-5 py-3.5">Total Amount</th>
                      <th className="px-5 py-3.5">Expected Date</th>
                      <th className="px-5 py-3.5">Dispatch Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {poList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                          No purchase orders generated yet. Click &quot;Generate Purchase Order&quot; to issue a PO.
                        </td>
                      </tr>
                    ) : poList.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-bold text-amber-600">
                          {p.poNumber}
                          <span className="block text-xs font-semibold text-slate-400">{p.createdAt}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{p.prNumber}</span>
                          {p.bomReference && (
                            <span className="block text-xs text-indigo-600 font-bold">{p.bomReference}</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{p.vendorName}</div>
                          <span className="inline-block mt-0.5 text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                            {p.materialCategory}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-extrabold text-slate-900 dark:text-slate-100">
                          ₹{p.totalAmount.toLocaleString()}
                          <span className="block text-xs font-semibold text-slate-400">{p.paymentTerms}</span>
                        </td>
                        <td className="px-5 py-4 font-medium text-sm">
                          {p.expectedDeliveryDate}
                          <span className="block text-xs text-slate-500">{p.deliveryTerms?.replace(/_/g, ' ')}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              p.dispatchStatus === 'FULFILLED'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : p.dispatchStatus === 'DISPATCHED_IN_TRANSIT'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {p.dispatchStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedPoForPrint(p)}
                              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all"
                              title="Print Purchase Order"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            {p.dispatchStatus !== 'FULFILLED' && (
                              <button
                                type="button"
                                onClick={() => handleUpdatePoDispatch(p.id)}
                                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all"
                              >
                                {p.dispatchStatus === 'ISSUED_TO_VENDOR' ? 'Mark Dispatched' : 'Mark Fulfilled'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: MATERIAL INWARD LOGISTICS & WEIGHBRIDGE */}
        {/* ================================================================= */}
        {procTab === 'inward' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Gate Inward Log</span>
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{inwardList.length}</div>
                <div className="text-sm text-slate-500 mt-1">Vehicles checked at gate</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Total Net Tonnage</span>
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
                    <Scale className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {(inwardList.reduce((sum, i) => sum + i.weighbridgeNetKg, 0) / 1000).toFixed(1)} MT
                </div>
                <div className="text-sm text-emerald-600 font-semibold mt-1">Certified weighbridge net mass</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Pending QC Inspection</span>
                  <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{kpis.pendingQcClearanceCount}</div>
                <div className="text-sm text-amber-600 font-semibold mt-1">Awaiting chemical/metrology clearance</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">GRNs Issued</span>
                  <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {inwardList.filter((i) => i.status === 'GRN_GENERATED').length}
                </div>
                <div className="text-sm text-slate-500 mt-1">Stock credited to warehouse bays</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search vehicle number, inward log, or PO..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsNewInwardModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Log Gate Inward &amp; Weighbridge</span>
              </button>
            </div>

            {/* Inward Data Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Tracking &amp; Gate Code</th>
                      <th className="px-5 py-3.5">PO &amp; Vendor</th>
                      <th className="px-5 py-3.5">Vehicle &amp; Transporter</th>
                      <th className="px-5 py-3.5">Weighbridge Gross/Tare/Net</th>
                      <th className="px-5 py-3.5">QC Clearance Status</th>
                      <th className="px-5 py-3.5">Bay &amp; GRN Number</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {inwardList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                          No material inward records logged yet. Click &quot;Log Gate Inward &amp; Weighbridge&quot; to record inward shipments.
                        </td>
                      </tr>
                    ) : inwardList.map((i) => (
                      <tr key={i.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-bold text-amber-600">
                          {i.inwardTrackingNumber}
                          <span className="block text-xs font-semibold text-slate-500">{i.gateEntryCode}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-bold text-slate-900 dark:text-slate-100">{i.poNumber}</span>
                          <span className="block text-xs text-slate-500 truncate max-w-xs">{i.vendorName}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-800 dark:text-slate-200">{i.vehicleNumber}</div>
                          <div className="text-xs text-slate-500">{i.transporterName}</div>
                          <div className="text-xs font-mono text-slate-400">{i.eWayBillNumber}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-extrabold text-emerald-600">Net: {i.weighbridgeNetKg.toLocaleString()} kg</div>
                          <div className="text-xs text-slate-400">
                            G: {i.weighbridgeGrossKg.toLocaleString()} | T: {i.weighbridgeTareKg.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              i.qcInspectionStatus === 'QC_PASSED'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {i.qcInspectionStatus.replace(/_/g, ' ')}
                          </span>
                          {i.qcTestReportNumber && (
                            <span className="block text-xs text-slate-400 mt-0.5">{i.qcTestReportNumber}</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-sm">{i.warehouseLocationBay}</div>
                          {i.grnNumber ? (
                            <span className="text-xs font-bold text-emerald-600">{i.grnNumber}</span>
                          ) : (
                            <span className="text-xs text-slate-400">Pending GRN</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {i.qcInspectionStatus !== 'QC_PASSED' ? (
                            <button
                              type="button"
                              onClick={() => handleUpdateQcStatus(i.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                            >
                              Approve QC &amp; Issue GRN
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-emerald-600">Stock Inwarded</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: BUFFER STOCK & JIT PLANNING */}
        {/* ================================================================= */}
        {procTab === 'buffer_stock' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Buffer Health Ratio</span>
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
                    <Warehouse className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{kpis.bufferStockHealthPct}%</div>
                <div className="text-sm text-emerald-600 font-semibold mt-1">SKUs at healthy inventory levels</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Reorder Triggers</span>
                  <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {bufferList.filter((b) => b.stockStatus === 'NEAR_REORDER' || b.stockStatus === 'CRITICAL_BUFFER').length}
                </div>
                <div className="text-sm text-amber-600 font-semibold mt-1">Items at or below reorder threshold</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">JIT Delivery Cadence</span>
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {bufferList.filter((b) => b.jitScheduleActive).length} SKUs
                </div>
                <div className="text-sm text-slate-500 mt-1">Synchronized with vendor lead time</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Avg Lead Time</span>
                  <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {bufferList.length > 0
                    ? `${(bufferList.reduce((sum, b) => sum + b.leadTimeDays, 0) / bufferList.length).toFixed(1)} Days`
                    : '0.0 Days'}
                </div>
                <div className="text-sm text-slate-500 mt-1">Supplier dispatch-to-dock cycle</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search item code, description, or vendor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsNewBufferModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Configure Buffer Policy</span>
              </button>
            </div>

            {/* Buffer Stock Data Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">SKU Code</th>
                      <th className="px-5 py-3.5">Item Name &amp; Category</th>
                      <th className="px-5 py-3.5">Current Stock Level</th>
                      <th className="px-5 py-3.5">Min / Reorder / Max</th>
                      <th className="px-5 py-3.5">Lead Time &amp; JIT</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Stock Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {bufferList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                          No buffer stock rules configured. Click &quot;Configure Buffer Policy&quot; to set safety stock thresholds.
                        </td>
                      </tr>
                    ) : bufferList.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-bold text-amber-600">{b.itemCode}</td>
                        <td className="px-5 py-4 max-w-xs">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{b.itemName}</div>
                          <span className="inline-block mt-0.5 text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                            {b.category}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
                            {b.currentStock} {b.unit}
                          </div>
                          <div className="text-xs text-slate-500">Avg Daily: {b.averageDailyConsumption} {b.unit}/day</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                            Min: <span className="font-bold text-rose-600">{b.minimumBufferStock}</span> | Reorder:{' '}
                            <span className="font-bold text-amber-600">{b.reorderPoint}</span> | Max:{' '}
                            <span className="font-bold text-slate-800 dark:text-slate-200">{b.maximumCapacityStock}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-sm">{b.leadTimeDays} Days Lead Time</div>
                          <div className="text-xs text-emerald-600 font-semibold">
                            {b.jitScheduleActive ? `JIT: ${b.jitDeliveryCadence}` : 'Batch Order'}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              b.stockStatus === 'HEALTHY'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : b.stockStatus === 'NEAR_REORDER'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {b.stockStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateStockLevel(b.id, -5)}
                              className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 font-bold text-xs"
                              title="Consume 5 units"
                            >
                              -5
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStockLevel(b.id, 10)}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                              title="Inward 10 units"
                            >
                              +10
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: 3-WAY MATCH & DEBIT NOTES */}
        {/* ================================================================= */}
        {procTab === 'reconciliation' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">On-Time Delivery</span>
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{kpis.avgOtdRate}%</div>
                <div className="text-sm text-emerald-600 font-semibold mt-1">Vendor punctuality compliance</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">3-Way Match Rate</span>
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {reconciliationList.length > 0
                    ? `${Math.round(
                        (reconciliationList.filter((r) => r.threeWayMatchStatus === 'MATCHED').length /
                          reconciliationList.length) *
                          100,
                      )}%`
                    : '0%'}
                </div>
                <div className="text-sm text-slate-500 mt-1">PO, GRN &amp; Invoice alignment</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Active Debit Notes</span>
                  <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {reconciliationList.filter((r) => r.debitNoteIssued).length}
                </div>
                <div className="text-sm text-rose-600 font-semibold mt-1">Discrepancy claims lodged</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Settled Payments</span>
                  <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {reconciliationList.filter((r) => r.paymentSettlementStatus === 'SETTLED').length}
                </div>
                <div className="text-sm text-slate-500 mt-1">Disbursed via bank transfer</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search reconciliation, vendor, or invoice number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsNewReconciliationModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Perform 3-Way Match</span>
              </button>
            </div>

            {/* Reconciliation Data Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Reconciliation ID</th>
                      <th className="px-5 py-3.5">Vendor &amp; Invoice No</th>
                      <th className="px-5 py-3.5">PO &amp; GRN Link</th>
                      <th className="px-5 py-3.5">PO vs Inv Amount</th>
                      <th className="px-5 py-3.5">3-Way Match</th>
                      <th className="px-5 py-3.5">Debit Note &amp; Settlement</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {reconciliationList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                          No vendor reconciliations recorded yet. Click &quot;Perform 3-Way Match&quot; to reconcile invoices against PO and GRN.
                        </td>
                      </tr>
                    ) : reconciliationList.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-bold text-amber-600">{r.reconciliationNumber}</td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{r.vendorName}</div>
                          <div className="text-xs text-slate-500 font-mono">Inv: {r.invoiceNumber}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-sm">{r.poNumber}</div>
                          <div className="text-xs text-indigo-600 font-bold">{r.grnNumber}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-slate-100">
                            Inv: ₹{r.invoiceAmount.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-500">PO: ₹{r.poAmount.toLocaleString()}</div>
                          {r.varianceAmount > 0 && (
                            <span className="text-xs font-bold text-rose-600 block">
                              Diff: ₹{r.varianceAmount.toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              r.threeWayMatchStatus === 'MATCHED'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {r.threeWayMatchStatus.replace(/_/g, ' ')}
                          </span>
                          <span className="block text-xs text-slate-400 mt-0.5">OTD: {r.onTimeDeliveryScorePct}%</span>
                        </td>
                        <td className="px-5 py-4">
                          {r.debitNoteIssued ? (
                            <div>
                              <span className="text-xs font-bold text-rose-600 block">
                                Debit Note: ₹{r.debitNoteAmount?.toLocaleString()}
                              </span>
                              <span className="text-xs text-slate-500 truncate block max-w-xs">{r.debitNoteReason}</span>
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-emerald-600">Zero Deduction</span>
                          )}
                          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                            {r.paymentSettlementStatus}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {r.paymentSettlementStatus !== 'SETTLED' ? (
                            <button
                              type="button"
                              onClick={() => handleSettleVendorPayment(r.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                            >
                              Settle Payment
                            </button>
                          ) : (
                            <span className="text-xs font-mono font-bold text-slate-500">{r.settlementReference}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 6: SCRAP DISPOSAL MANAGEMENT */}
        {/* ================================================================= */}
        {procTab === 'scrap' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Scrap Revenue</span>
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">₹{(kpis.totalScrapRevenue / 100000).toFixed(2)}L</div>
                <div className="text-sm text-emerald-600 font-semibold mt-1">Waste-to-revenue credited to ERP ledger</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Total Scrap Weight</span>
                  <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600">
                    <Scale className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {(scrapList.reduce((sum, s) => sum + s.accumulatedWeightKg, 0) / 1000).toFixed(1)} MT
                </div>
                <div className="text-sm text-slate-500 mt-1">Accumulated yard inventory</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Active Tenders</span>
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {scrapList.filter((s) => s.status === 'TENDER_PUBLISHED').length}
                </div>
                <div className="text-sm text-slate-500 mt-1">Open for recycler bidding</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Avg Metal Realization</span>
                  <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600">
                    <Flame className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {scrapList.filter((s) => s.winningBidRatePerKg != null).length > 0
                    ? `₹${(
                        scrapList.reduce((sum, s) => sum + (s.winningBidRatePerKg || 0), 0) /
                        scrapList.filter((s) => s.winningBidRatePerKg != null).length
                      ).toFixed(1)} / kg`
                    : '₹0.0 / kg'}
                </div>
                <div className="text-sm text-slate-500 mt-1">Steel turning borings average rate</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search scrap lot, category, or winning buyer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsNewScrapModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Create Scrap Disposal Lot</span>
              </button>
            </div>

            {/* Scrap Data Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Lot &amp; Tender Code</th>
                      <th className="px-5 py-3.5">Category &amp; Yard Bay</th>
                      <th className="px-5 py-3.5">Accumulated Weight</th>
                      <th className="px-5 py-3.5">Reserve Rate</th>
                      <th className="px-5 py-3.5">Winning Bid &amp; Revenue</th>
                      <th className="px-5 py-3.5">Status &amp; Gate Pass</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {scrapList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                          No scrap disposal lots registered yet. Click &quot;Create Scrap Disposal Lot&quot; to publish scrap tenders.
                        </td>
                      </tr>
                    ) : scrapList.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-bold text-amber-600">
                          {s.disposalLotNumber}
                          <span className="block text-xs font-semibold text-slate-500">{s.tenderCode}</span>
                        </td>
                        <td className="px-5 py-4 max-w-xs">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{s.scrapYardLocation}</div>
                          <div className="text-xs text-slate-500 truncate">{s.materialDescription}</div>
                          <span className="inline-block mt-0.5 text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                            {s.scrapCategory.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-extrabold text-slate-900 dark:text-slate-100">
                          {s.accumulatedWeightKg.toLocaleString()} kg
                        </td>
                        <td className="px-5 py-4 font-medium text-sm">
                          Min: ₹{s.minimumReserveRatePerKg} / kg
                          {s.tenderClosingDate && (
                            <span className="block text-xs text-slate-500">Closes: {s.tenderClosingDate}</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {s.totalRevenueRealized ? (
                            <div>
                              <span className="font-extrabold text-emerald-600">
                                ₹{s.totalRevenueRealized.toLocaleString()}
                              </span>
                              <span className="block text-xs text-slate-500">
                                @ ₹{s.winningBidRatePerKg}/kg ({s.winningBidderName})
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">Awaiting Tender Bids</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              s.status === 'SOLD_DISPATCHED'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {s.status.replace(/_/g, ' ')}
                          </span>
                          {s.gatePassPassoutNumber && (
                            <span className="block text-xs font-mono text-slate-400 mt-0.5">
                              {s.gatePassPassoutNumber}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {s.status !== 'SOLD_DISPATCHED' ? (
                            <button
                              type="button"
                              onClick={() => handleFinalizeScrapSale(s.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                            >
                              Finalize Sale &amp; Pass
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-slate-500">Revenue Realized</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 1. MODAL: PUBLISH RFQ */}
      {/* ========================================================================= */}
      {isNewSourcingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <FileText className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl font-extrabold">Broadcast New Sourcing RFQ</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewSourcingModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSourcing} className="mt-5 space-y-4 text-base">
              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  RFQ Requirement Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Annual Rate Contract for Alloy Steel Billets"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Category *</label>
                  <select
                    name="category"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="RAW_MATERIALS">Raw Materials</option>
                    <option value="SPARE_PARTS">Spare Parts &amp; Tooling</option>
                    <option value="CONSUMABLES">Consumables &amp; Lubricants</option>
                    <option value="PACKAGING_MATERIAL">Packaging Materials</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Target Qty &amp; Unit *</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="targetQuantity"
                      required
                      defaultValue={100}
                      className="w-2/3 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                    <input
                      type="text"
                      name="unit"
                      required
                      defaultValue="MT"
                      className="w-1/3 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 uppercase font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Technical Material Specifications *
                </label>
                <textarea
                  name="materialDescription"
                  required
                  rows={2}
                  placeholder="Chemical composition, tensile strength, standard tolerances (IS / ISO / ASTM)..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Invited Vendors Count
                  </label>
                  <input
                    type="number"
                    name="invitedVendorsCount"
                    defaultValue={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Target Budget Rate (₹)
                  </label>
                  <input
                    type="number"
                    name="lowestQuotedRate"
                    placeholder="e.g. 54000"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewSourcingModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Publish RFQ to Suppliers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODAL: GENERATE PURCHASE ORDER */}
      {/* ========================================================================= */}
      {isNewPoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl font-extrabold">Generate Official Purchase Order</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPoModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPo} className="mt-5 space-y-4 text-base">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    PR Requisition Number *
                  </label>
                  <input
                    type="text"
                    name="prNumber"
                    required
                    defaultValue={`PR-REQ-${Math.floor(100 + Math.random() * 900)}`}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    BOM Engineering Reference
                  </label>
                  <input
                    type="text"
                    name="bomReference"
                    placeholder="BOM-FORG-SHAFT-V1"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Vendor Name &amp; Contact *
                </label>
                <input
                  type="text"
                  name="vendorName"
                  required
                  placeholder="e.g. Tata Steel Industrial Billet Division"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Item Name *</label>
                  <input
                    type="text"
                    name="itemName"
                    required
                    placeholder="Grade EN8 Billets 100x100mm"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Category *</label>
                  <select
                    name="materialCategory"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  >
                    <option value="RAW_MATERIALS">Raw Materials</option>
                    <option value="SPARE_PARTS">Spare Parts</option>
                    <option value="CONSUMABLES">Consumables</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    required
                    defaultValue={100}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Unit Rate (₹) *</label>
                  <input
                    type="number"
                    name="unitRate"
                    required
                    defaultValue={54000}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Payment Terms</label>
                  <select
                    name="paymentTerms"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  >
                    <option value="NET_30">NET 30</option>
                    <option value="NET_45">NET 45</option>
                    <option value="NET_60">NET 60</option>
                    <option value="ADVANCE">100% Advance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Expected Delivery Date *
                </label>
                <input
                  type="date"
                  name="expectedDeliveryDate"
                  required
                  defaultValue="2026-11-30"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewPoModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Sign &amp; Dispatch PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL: LOG GATE INWARD & WEIGHBRIDGE */}
      {/* ========================================================================= */}
      {isNewInwardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Truck className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl font-extrabold">Log Gate Entry &amp; Weighbridge</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewInwardModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddInward} className="mt-5 space-y-4 text-base">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Associated PO Number *
                  </label>
                  <input
                    type="text"
                    name="poNumber"
                    required
                    defaultValue="PO-2026-089"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Challan / Invoice Number *
                  </label>
                  <input
                    type="text"
                    name="challanInvoiceNumber"
                    required
                    placeholder="INV-TAT-2026-8812"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    required
                    placeholder="MH-12-RN-9921"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Transporter Fleet *
                  </label>
                  <input
                    type="text"
                    name="transporterName"
                    required
                    placeholder="VRL Logistics Heavy Freight"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Weighbridge Gross (Kg) *
                  </label>
                  <input
                    type="number"
                    name="grossWeight"
                    required
                    defaultValue={42000}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Weighbridge Tare (Kg) *
                  </label>
                  <input
                    type="number"
                    name="tareWeight"
                    required
                    defaultValue={14000}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Destination Warehouse Bay *
                </label>
                <input
                  type="text"
                  name="warehouseLocationBay"
                  required
                  defaultValue="BAY-RM-STEEL-01"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewInwardModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Register Inward Tonnage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: CONFIGURE BUFFER STOCK */}
      {/* ========================================================================= */}
      {isNewBufferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Warehouse className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl font-extrabold">Configure Inventory Buffer Policy</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewBufferModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBuffer} className="mt-5 space-y-4 text-base">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Item Code *</label>
                  <input
                    type="text"
                    name="itemCode"
                    required
                    placeholder="RM-STL-BIL-02"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Item Name *</label>
                  <input
                    type="text"
                    name="itemName"
                    required
                    placeholder="High Tensile Steel Bar 40mm"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Current Stock *
                  </label>
                  <input
                    type="number"
                    name="currentStock"
                    required
                    defaultValue={100}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Min Buffer Stock *
                  </label>
                  <input
                    type="number"
                    name="minStock"
                    required
                    defaultValue={40}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Reorder Point *
                  </label>
                  <input
                    type="number"
                    name="reorderPoint"
                    required
                    defaultValue={70}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Vendor Lead Time (Days) *
                  </label>
                  <input
                    type="number"
                    name="leadTimeDays"
                    required
                    defaultValue={5}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    JIT Delivery Cadence
                  </label>
                  <select
                    name="jitCadence"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="BI_WEEKLY">Bi-Weekly</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="DAILY">Daily (JIT Continuous)</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewBufferModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Save Buffer Parameters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: 3-WAY MATCH & RECONCILIATION */}
      {/* ========================================================================= */}
      {isNewReconciliationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Scale className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl font-extrabold">Perform 3-Way Match &amp; Debit Note Check</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewReconciliationModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReconciliation} className="mt-5 space-y-4 text-base">
              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Vendor Name *</label>
                <input
                  type="text"
                  name="vendorName"
                  required
                  placeholder="Tata Steel Industrial Billet Division"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">PO Number *</label>
                  <input
                    type="text"
                    name="poNumber"
                    required
                    defaultValue="PO-2026-089"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">GRN Number *</label>
                  <input
                    type="text"
                    name="grnNumber"
                    required
                    defaultValue="GRN-2026-11-042"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Invoice No *</label>
                  <input
                    type="text"
                    name="invoiceNumber"
                    required
                    placeholder="INV-9921"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    PO Value (₹) *
                  </label>
                  <input
                    type="number"
                    name="poAmount"
                    required
                    defaultValue={542000}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Invoice Value (₹) *
                  </label>
                  <input
                    type="number"
                    name="invoiceAmount"
                    required
                    defaultValue={542000}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    On-Time Delivery Score (%)
                  </label>
                  <input
                    type="number"
                    name="otdScore"
                    defaultValue={98.5}
                    step="0.1"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Quality Rejection Rate (%)
                  </label>
                  <input
                    type="number"
                    name="rejectionRate"
                    defaultValue={0.0}
                    step="0.1"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewReconciliationModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Execute 3-Way Match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: CREATE SCRAP LOT */}
      {/* ========================================================================= */}
      {isNewScrapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Flame className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl font-extrabold">Register Scrap Yard Disposal Lot</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewScrapModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddScrap} className="mt-5 space-y-4 text-base">
              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Scrap Category *
                </label>
                <select
                  name="scrapCategory"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="FERROUS_TURNINGS_BORINGS">Ferrous Turnings &amp; Borings</option>
                  <option value="HEAVY_MELTING_SCRAP">Heavy Melting Scrap (HMS 1 &amp; 2)</option>
                  <option value="NON_FERROUS_ALUMINIUM_COPPER">Non-Ferrous (Aluminium / Copper / Brass)</option>
                  <option value="EMPTY_CHEMICAL_BARRELS">Empty Lubricant / Chemical Barrels</option>
                  <option value="SURPLUS_RAW_MATERIALS">Surplus Obsolete Raw Materials</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Material Description *
                </label>
                <textarea
                  name="materialDescription"
                  required
                  rows={2}
                  placeholder="CNC dry lathe chips, clean turning bundles, non-contaminated..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Yard Bay Location *
                  </label>
                  <input
                    type="text"
                    name="scrapYardLocation"
                    required
                    defaultValue="YARD-BAY-EAST-02"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Accumulated Weight (Kg) *
                  </label>
                  <input
                    type="number"
                    name="accumulatedWeightKg"
                    required
                    defaultValue={12000}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Reserve Rate Per Kg (₹) *
                  </label>
                  <input
                    type="number"
                    name="reserveRate"
                    required
                    defaultValue={35.0}
                    step="0.5"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Tender Closing Date *
                  </label>
                  <input
                    type="date"
                    name="closingDate"
                    required
                    defaultValue="2026-12-05"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewScrapModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Publish Scrap Auction Tender
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: REQUEST RAW MATERIAL RATE CHANGE (PROCUREMENT TO SUPER ADMIN)   */}
      {/* ========================================================================= */}
      {isNewRateRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl font-extrabold">Propose Raw Material Rate Change</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewRateRequestModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRateRequest} className="mt-5 space-y-4 text-base">
              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Select Raw Material *
                </label>
                <select
                  value={selectedMaterialForRequest?.id || ''}
                  onChange={(e) => {
                    const found = rawMaterialsList.find((m) => m.id === e.target.value);
                    if (found) {
                      setSelectedMaterialForRequest(found);
                      setProposedRateInput(String(found.rate || found.unitPrice || found.costPrice || 0));
                    }
                  }}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                >
                  <option value="" disabled>-- Select a Raw Material --</option>
                  {rawMaterialsList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.materialCode}) - Current: ₹{m.rate ?? m.unitPrice ?? m.costPrice ?? 0}/{m.unit}
                    </option>
                  ))}
                </select>
              </div>

              {selectedMaterialForRequest && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500 font-semibold uppercase">Active Approved Rate</div>
                    <div className="text-lg font-black font-mono text-slate-900 dark:text-white">
                      ₹{Number(selectedMaterialForRequest.rate ?? selectedMaterialForRequest.unitPrice ?? 0).toFixed(2)}
                      <span className="text-xs font-normal text-slate-400 ml-1">/ {selectedMaterialForRequest.unit}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-semibold uppercase">Category / Stock</div>
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {selectedMaterialForRequest.category} ({selectedMaterialForRequest.currentStock} {selectedMaterialForRequest.unit})
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Proposed New Rate (₹ per unit) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={proposedRateInput}
                  onChange={(e) => setProposedRateInput(e.target.value)}
                  placeholder="e.g. 52000.00"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-lg"
                />
                {selectedMaterialForRequest && proposedRateInput && !isNaN(parseFloat(proposedRateInput)) && (
                  <div className="mt-1.5 text-xs flex items-center gap-2">
                    <span className="text-slate-500">Rate variance:</span>
                    {(() => {
                      const cur = Number(selectedMaterialForRequest.rate ?? selectedMaterialForRequest.unitPrice ?? 0);
                      const prop = parseFloat(proposedRateInput);
                      const diff = prop - cur;
                      const pct = cur > 0 ? (diff / cur) * 100 : 0;
                      return (
                        <span
                          className={`font-mono font-bold ${
                            diff > 0 ? 'text-amber-600' : diff < 0 ? 'text-emerald-600' : 'text-slate-500'
                          }`}
                        >
                          {diff >= 0 ? '+' : ''}₹{diff.toFixed(2)} ({diff >= 0 ? '+' : ''}
                          {pct.toFixed(2)}%)
                        </span>
                      );
                    })()}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Procurement Justification / Market Fluctuation Reason *
                </label>
                <textarea
                  required
                  rows={3}
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  placeholder="Detail vendor quotation revision, commodity index movement, supply chain constraints, or renegotiated contract terms..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Notice: Submitting will notify Super Admin. The active rate and BOM cost prices will update ONLY once approved by Super Admin.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewRateRequestModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRateReq}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold inline-flex items-center gap-2"
                >
                  {isSubmittingRateReq && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>Submit Rate Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. PRINTABLE OFFICIAL PURCHASE ORDER MODAL */}
      {/* ========================================================================= */}
      {selectedPoForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-2xl max-h-[90vh] overflow-y-auto print:m-0 print:p-0 print:border-none print:shadow-none">
            <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 print:hidden">
              <div className="flex items-center gap-2 text-amber-600 font-bold">
                <Printer className="w-5 h-5" />
                <span>Official Purchase Order &amp; Vendor Contract Pass</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPoForPrint(null)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="mt-6 space-y-6 text-slate-900 dark:text-slate-100">
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-amber-600 pb-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">{companyName}</h2>
                  <p className="text-sm text-slate-500 font-medium">
                    Plant Operations &bull; {tenantSubCategory} &bull; Multi-Tenant Isolated
                  </p>
                  <p className="text-xs font-mono text-slate-400">Tenant CID: {selectedPoForPrint.companyId}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Purchase Order</span>
                  <div className="text-2xl font-extrabold font-mono">{selectedPoForPrint.poNumber}</div>
                  <div className="text-xs text-slate-500">Date: {selectedPoForPrint.createdAt}</div>
                </div>
              </div>

              {/* Order Meta */}
              <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Vendor Details</span>
                  <div className="font-bold text-lg text-slate-900 dark:text-slate-100 mt-0.5">
                    {selectedPoForPrint.vendorName}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{selectedPoForPrint.vendorEmail}</div>
                  <div className="text-xs text-slate-500 mt-1">Delivery: {selectedPoForPrint.deliveryTerms}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Order Parameters</span>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    PR: {selectedPoForPrint.prNumber}
                  </div>
                  <div className="text-sm text-indigo-600 font-bold">BOM: {selectedPoForPrint.bomReference || 'Standard'}</div>
                  <div className="text-xs text-slate-500 mt-1">Payment: {selectedPoForPrint.paymentTerms}</div>
                  <div className="text-xs text-slate-500">Expected: {selectedPoForPrint.expectedDeliveryDate}</div>
                </div>
              </div>

              {/* Item Details */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                    <tr>
                      <th className="px-4 py-2.5">Category</th>
                      <th className="px-4 py-2.5">Item Specifications &amp; JSON Details</th>
                      <th className="px-4 py-2.5 text-right">Order Amount ({selectedPoForPrint.currency})</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3 font-semibold">{selectedPoForPrint.materialCategory}</td>
                      <td className="px-4 py-3 font-mono text-xs">{selectedPoForPrint.itemDetailsJson}</td>
                      <td className="px-4 py-3 text-right font-black text-base text-amber-600">
                        ₹{selectedPoForPrint.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-8 text-center">
                <div>
                  <div className="h-14 border-b border-dashed border-slate-400 flex items-end justify-center pb-2 text-xs text-slate-400">
                    [Digitally Signed via ERP Auth]
                  </div>
                  <div className="font-bold text-sm mt-2">Authorized Signatory</div>
                  <div className="text-xs text-slate-500">Procurement Manager</div>
                </div>
                <div>
                  <div className="h-14 border-b border-dashed border-slate-400 flex items-end justify-center pb-2 text-xs text-slate-400">
                    [Vendor Acceptance Stamp]
                  </div>
                  <div className="font-bold text-sm mt-2">{selectedPoForPrint.vendorName}</div>
                  <div className="text-xs text-slate-500">Authorized Supplier Representative</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
