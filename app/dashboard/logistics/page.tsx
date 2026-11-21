'use client';

import React, { useState, useEffect, useMemo, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Truck,
  Warehouse,
  FileCheck2,
  Wrench,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  Search,
  Building2,
  Sun,
  Moon,
  ArrowLeft,
  X,
  Plus,
  Scale,
  Navigation,
  Compass,
  Gauge,
  Thermometer,
  Droplets,
  Calendar,
  CreditCard,
  QrCode,
  MapPin,
  Flame,
  Layers,
  ChevronRight,
  TrendingUp,
  Package,
} from 'lucide-react';

// =========================================================================
// DATA INTERFACES
// =========================================================================

interface LogisticsInboundTransport {
  id: string;
  trackingCode: string;
  vendorSupplierName: string;
  purchaseOrderRef?: string | null;
  materialCategory: string;
  transporterFleet: string;
  vehicleNumber: string;
  driverNameAndContact?: string | null;
  inboundWeightKg: number;
  originLocation: string;
  scheduledArrivalDate: string;
  actualArrivalDate?: string | null;
  delayHours: number;
  transitStatus: string;
  dockUnloadBay?: string | null;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

interface LogisticsOutboundDispatch {
  id: string;
  dispatchPlanCode: string;
  salesOrderRef?: string | null;
  clientConsigneeName: string;
  destinationRoute: string;
  vehicleTypeAllocated: string;
  allocatedVehicleNumber: string;
  transporterAgency: string;
  freightRateNegotiated: number;
  freightRateType: string;
  multiDropLocationsJson?: string | null;
  totalWeightKg: number;
  scheduledDeparture: string;
  dispatchStatus: string;
  podReceived: boolean;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

interface LogisticsWarehouseHandling {
  id: string;
  handlingRecordCode: string;
  warehouseZone: string;
  binRackingLocation: string;
  storedItemDescription: string;
  handlingEquipmentUsed: string;
  equipmentOperatorName: string;
  loadWeightKg: number;
  ambientTemperatureC?: number | null;
  relativeHumidityPct?: number | null;
  storageConditionStatus: string;
  stackingSafetyClearance: boolean;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

interface LogisticsStatutoryDoc {
  id: string;
  documentCode: string;
  consignorOrConsignee: string;
  documentType: string;
  documentReferenceNumber: string;
  invoiceReferenceNumber?: string | null;
  weighbridgeSlipNumber?: string | null;
  vehicleNumber: string;
  validFrom: string;
  validTill: string;
  complianceVerificationStatus: string;
  interstatePermit: boolean;
  digitalQrcodeVerified: boolean;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

interface LogisticsFleetMaintenance {
  id: string;
  fleetVehicleCode: string;
  registrationNumber: string;
  vehicleModel: string;
  ownershipType: string;
  fitnessCertificateExpiry: string;
  insurancePolicyExpiry: string;
  pucEmissionExpiry: string;
  currentOdometerKm: number;
  fuelConsumptionLiters: number;
  fuelMileageKmpl?: number | null;
  lastServicingDate?: string | null;
  nextServicingDueKm?: number | null;
  gpsDeviceImei?: string | null;
  liveLocationCoordinates?: string | null;
  vehicleStatus: string;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

interface LogisticsFreightAudit {
  id: string;
  auditInvoiceCode: string;
  transporterAgencyName: string;
  billingPeriod: string;
  contractAgreementCode?: string | null;
  totalBilledAmount: number;
  verifiedApprovedAmount: number;
  discrepancyDeductionAmount: number;
  totalTripsAudited: number;
  emptyReturnTripCount: number;
  backhaulingConsolidationCount: number;
  costPerTonKmCalculated?: number | null;
  auditApprovalStatus: string;
  settlementReferenceUTR?: string | null;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

type LogisticsTab =
  | 'inbound'
  | 'outbound'
  | 'handling'
  | 'statutory'
  | 'fleet'
  | 'audit';

export default function LogisticsPage() {
  const router = useRouter();

  // Dark / Light Mode (strictly defaults to light)
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Tab
  const [logTab, setLogTab] = useState<LogisticsTab>('inbound');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');

  // Modal Visibility States
  const [isNewInboundModal, setIsNewInboundModal] = useState(false);
  const [isNewOutboundModal, setIsNewOutboundModal] = useState(false);
  const [isNewHandlingModal, setIsNewHandlingModal] = useState(false);
  const [isNewStatutoryModal, setIsNewStatutoryModal] = useState(false);
  const [isNewFleetModal, setIsNewFleetModal] = useState(false);
  const [isNewAuditModal, setIsNewAuditModal] = useState(false);

  // Printable Consignment Modal
  const [selectedConsignmentForPrint, setSelectedConsignmentForPrint] = useState<LogisticsOutboundDispatch | null>(null);

  // =========================================================================
  // DATA STATES (STRICTLY CLEAN INITIAL STATE - ZERO HARDCODED MOCKS)
  // =========================================================================

  const [inboundList, setInboundList] = useState<LogisticsInboundTransport[]>([]);
  const [outboundList, setOutboundList] = useState<LogisticsOutboundDispatch[]>([]);
  const [handlingList, setHandlingList] = useState<LogisticsWarehouseHandling[]>([]);
  const [statutoryList, setStatutoryList] = useState<LogisticsStatutoryDoc[]>([]);
  const [fleetList, setFleetList] = useState<LogisticsFleetMaintenance[]>([]);
  const [auditList, setAuditList] = useState<LogisticsFreightAudit[]>([]);

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

    fetchInitialLogisticsData();
  }, []);

  const fetchInitialLogisticsData = async () => {
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('auth_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const [resInb, resOut, resHnd, resStat, resFlt, resAud] = await Promise.allSettled([
        fetch(`${apiUrl}/logistics/inbound`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiUrl}/logistics/outbound`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiUrl}/logistics/handling`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiUrl}/logistics/statutory`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiUrl}/logistics/fleet`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiUrl}/logistics/audits`, { headers }).then((r) => (r.ok ? r.json() : [])),
      ]);

      setInboundList(resInb.status === 'fulfilled' && Array.isArray(resInb.value) ? resInb.value : []);
      setOutboundList(resOut.status === 'fulfilled' && Array.isArray(resOut.value) ? resOut.value : []);
      setHandlingList(resHnd.status === 'fulfilled' && Array.isArray(resHnd.value) ? resHnd.value : []);
      setStatutoryList(resStat.status === 'fulfilled' && Array.isArray(resStat.value) ? resStat.value : []);
      setFleetList(resFlt.status === 'fulfilled' && Array.isArray(resFlt.value) ? resFlt.value : []);
      setAuditList(resAud.status === 'fulfilled' && Array.isArray(resAud.value) ? resAud.value : []);
    } catch {
      setInboundList([]);
      setOutboundList([]);
      setHandlingList([]);
      setStatutoryList([]);
      setFleetList([]);
      setAuditList([]);
    }
  };

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

  // 1. Inbound Transport
  const handleAddInbound = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const newInbound: LogisticsInboundTransport = {
      id: `inb-${Date.now()}`,
      trackingCode: `INB-TRK-2026-${Math.floor(100 + Math.random() * 900)}`,
      vendorSupplierName: String(data.get('vendorSupplierName') || 'Tier-1 Raw Material Supplier'),
      purchaseOrderRef: String(data.get('purchaseOrderRef') || 'PO-2026-089'),
      materialCategory: String(data.get('materialCategory') || 'RAW_MATERIALS'),
      transporterFleet: String(data.get('transporterFleet') || 'VRL Logistics Heavy Fleet'),
      vehicleNumber: String(data.get('vehicleNumber') || 'MH-12-RN-9921'),
      driverNameAndContact: String(data.get('driverNameAndContact') || 'Driver (+91 98000 00000)'),
      inboundWeightKg: Number(data.get('inboundWeightKg')) || 25000,
      originLocation: String(data.get('originLocation') || 'Supplier Plant Works'),
      scheduledArrivalDate: String(data.get('scheduledArrivalDate') || '2026-11-21'),
      actualArrivalDate: null,
      delayHours: 0.0,
      transitStatus: 'IN_TRANSIT',
      dockUnloadBay: String(data.get('dockUnloadBay') || 'BAY-INB-DOCK-01'),
      notes: String(data.get('notes') || 'Inbound transport scheduled for dock delivery.'),
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setInboundList([newInbound, ...inboundList]);
    setIsNewInboundModal(false);
    showToast(`Inbound consignment ${newInbound.trackingCode} scheduled.`);
  };

  const handleAdvanceInboundStatus = (id: string) => {
    setInboundList(
      inboundList.map((i) => {
        if (i.id === id) {
          const next =
            i.transitStatus === 'IN_TRANSIT'
              ? 'ARRIVED_AT_GATE'
              : i.transitStatus === 'ARRIVED_AT_GATE'
              ? 'UNLOADED'
              : 'UNLOADED';
          return {
            ...i,
            transitStatus: next,
            actualArrivalDate: next === 'ARRIVED_AT_GATE' ? 'Just now' : i.actualArrivalDate,
          };
        }
        return i;
      }),
    );
    showToast('Inbound transit gate status updated.');
  };

  // 2. Outbound Dispatch
  const handleAddOutbound = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const newOutbound: LogisticsOutboundDispatch = {
      id: `out-${Date.now()}`,
      dispatchPlanCode: `OUT-DISP-2026-${Math.floor(100 + Math.random() * 900)}`,
      salesOrderRef: String(data.get('salesOrderRef') || 'SO-2026-110'),
      clientConsigneeName: String(data.get('clientConsigneeName') || 'Industrial Client Consignee'),
      destinationRoute: String(data.get('destinationRoute') || 'Pune - Chakan Industrial Corridor'),
      vehicleTypeAllocated: String(data.get('vehicleTypeAllocated') || 'HEAVY_LORRY_32_FT'),
      allocatedVehicleNumber: String(data.get('allocatedVehicleNumber') || 'MH-12-RN-9921'),
      transporterAgency: String(data.get('transporterAgency') || 'VRL Heavy Freight Carriers'),
      freightRateNegotiated: Number(data.get('freightRateNegotiated')) || 18000,
      freightRateType: 'PER_TRIP_FLAT',
      multiDropLocationsJson: null,
      totalWeightKg: Number(data.get('totalWeightKg')) || 30000,
      scheduledDeparture: String(data.get('scheduledDeparture') || '2026-11-21'),
      dispatchStatus: 'SCHEDULED',
      podReceived: false,
      notes: String(data.get('notes') || 'Outbound carrier scheduled for dispatch.'),
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setOutboundList([newOutbound, ...outboundList]);
    setIsNewOutboundModal(false);
    showToast(`Outbound dispatch ${newOutbound.dispatchPlanCode} planned.`);
  };

  const handleAdvanceOutboundStatus = (id: string) => {
    setOutboundList(
      outboundList.map((o) => {
        if (o.id === id) {
          const next =
            o.dispatchStatus === 'SCHEDULED'
              ? 'DISPATCHED_ON_ROUTE'
              : o.dispatchStatus === 'DISPATCHED_ON_ROUTE'
              ? 'DELIVERED_POD_RECEIVED'
              : 'DELIVERED_POD_RECEIVED';
          return {
            ...o,
            dispatchStatus: next,
            podReceived: next === 'DELIVERED_POD_RECEIVED',
          };
        }
        return o;
      }),
    );
    showToast('Outbound dispatch status advanced.');
  };

  // 3. Warehouse Handling & Racking
  const handleAddHandling = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const newHandling: LogisticsWarehouseHandling = {
      id: `hnd-${Date.now()}`,
      handlingRecordCode: `MHE-HND-2026-${Math.floor(100 + Math.random() * 900)}`,
      warehouseZone: String(data.get('warehouseZone') || 'ZONE-A-HEAVY-METALS'),
      binRackingLocation: String(data.get('binRackingLocation') || 'RACK-V4-BAY-03'),
      storedItemDescription: String(data.get('storedItemDescription') || 'Industrial Cast Material Bundles'),
      handlingEquipmentUsed: String(data.get('handlingEquipmentUsed') || 'OVERHEAD_EOT_CRANE_15T'),
      equipmentOperatorName: String(data.get('equipmentOperatorName') || 'Certified Equipment Operator'),
      loadWeightKg: Number(data.get('loadWeightKg')) || 10000,
      ambientTemperatureC: Number(data.get('ambientTemperatureC')) || 26.0,
      relativeHumidityPct: Number(data.get('relativeHumidityPct')) || 45.0,
      storageConditionStatus: 'OPTIMAL',
      stackingSafetyClearance: true,
      notes: String(data.get('notes') || 'Warehouse movement and vertical bin racking verified.'),
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setHandlingList([newHandling, ...handlingList]);
    setIsNewHandlingModal(false);
    showToast(`Material movement log ${newHandling.handlingRecordCode} recorded.`);
  };

  // 4. Statutory Docs
  const handleAddStatutory = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const newStatutory: LogisticsStatutoryDoc = {
      id: `stat-${Date.now()}`,
      documentCode: `STAT-DOC-2026-${Math.floor(100 + Math.random() * 900)}`,
      consignorOrConsignee: String(data.get('consignorOrConsignee') || 'Consignee Client'),
      documentType: String(data.get('documentType') || 'E_WAY_BILL'),
      documentReferenceNumber: String(data.get('documentReferenceNumber') || `EWB-${Math.floor(100000000000 + Math.random() * 900000000000)}`),
      invoiceReferenceNumber: String(data.get('invoiceReferenceNumber') || 'INV-SLS-2026-901'),
      weighbridgeSlipNumber: String(data.get('weighbridgeSlipNumber') || `WB-SLIP-${Math.floor(1000 + Math.random() * 9000)}`),
      vehicleNumber: String(data.get('vehicleNumber') || 'MH-12-RN-9921'),
      validFrom: String(data.get('validFrom') || '2026-11-20'),
      validTill: String(data.get('validTill') || '2026-11-23'),
      complianceVerificationStatus: 'VALID_VERIFIED',
      interstatePermit: false,
      digitalQrcodeVerified: true,
      notes: String(data.get('notes') || 'Statutory e-Way bill and transit pass verified.'),
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setStatutoryList([newStatutory, ...statutoryList]);
    setIsNewStatutoryModal(false);
    showToast(`Statutory document ${newStatutory.documentReferenceNumber} registered.`);
  };

  // 5. Fleet Maintenance
  const handleAddFleet = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const odo = Number(data.get('currentOdometerKm')) || 100000;

    const newFleet: LogisticsFleetMaintenance = {
      id: `flt-${Date.now()}`,
      fleetVehicleCode: `FLEET-TRK-${Math.floor(10 + Math.random() * 90)}`,
      registrationNumber: String(data.get('registrationNumber') || 'MH-12-RN-9921'),
      vehicleModel: String(data.get('vehicleModel') || 'Heavy Multi-Axle Hauler'),
      ownershipType: String(data.get('ownershipType') || 'COMPANY_OWNED'),
      fitnessCertificateExpiry: String(data.get('fitnessCertificateExpiry') || '2027-05-30'),
      insurancePolicyExpiry: String(data.get('insurancePolicyExpiry') || '2027-03-30'),
      pucEmissionExpiry: String(data.get('pucEmissionExpiry') || '2027-01-30'),
      currentOdometerKm: odo,
      fuelConsumptionLiters: 1200.0,
      fuelMileageKmpl: Number(data.get('fuelMileageKmpl')) || 3.5,
      lastServicingDate: '2026-11-01',
      nextServicingDueKm: odo + 10000,
      gpsDeviceImei: `8619${Math.floor(10000000000 + Math.random() * 90000000000)}`,
      liveLocationCoordinates: String(data.get('liveLocationCoordinates') || 'NH48 Industrial Corridor Staging Bay'),
      vehicleStatus: 'ACTIVE_ON_ROAD',
      notes: String(data.get('notes') || 'Commercial heavy vehicle onboarded to plant fleet.'),
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setFleetList([newFleet, ...fleetList]);
    setIsNewFleetModal(false);
    showToast(`Vehicle ${newFleet.registrationNumber} registered in fleet.`);
  };

  // 6. Freight Auditing
  const handleAddAudit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const billed = Number(data.get('totalBilledAmount')) || 350000;
    const deductions = Number(data.get('discrepancyDeductionAmount')) || 0;
    const approved = Math.max(0, billed - deductions);

    const newAudit: LogisticsFreightAudit = {
      id: `aud-${Date.now()}`,
      auditInvoiceCode: `FRT-AUD-2026-${Math.floor(100 + Math.random() * 900)}`,
      transporterAgencyName: String(data.get('transporterAgencyName') || 'VRL Logistics Heavy Freight Fleet'),
      billingPeriod: String(data.get('billingPeriod') || '2026-11'),
      contractAgreementCode: String(data.get('contractAgreementCode') || 'ARC-FRT-2026-02'),
      totalBilledAmount: billed,
      verifiedApprovedAmount: approved,
      discrepancyDeductionAmount: deductions,
      totalTripsAudited: Number(data.get('totalTripsAudited')) || 20,
      emptyReturnTripCount: Number(data.get('emptyReturnTripCount')) || 1,
      backhaulingConsolidationCount: Number(data.get('backhaulingConsolidationCount')) || 6,
      costPerTonKmCalculated: Number(data.get('costPerTonKmCalculated')) || 2.4,
      auditApprovalStatus: 'AUDIT_PASSED_APPROVED',
      settlementReferenceUTR: null,
      notes: String(data.get('notes') || 'Freight billing audited against POD delivery challans.'),
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setAuditList([newAudit, ...auditList]);
    setIsNewAuditModal(false);
    showToast(`Freight audit ${newAudit.auditInvoiceCode} approved for ₹${approved.toLocaleString()}.`);
  };

  const handleSettleAudit = (id: string) => {
    setAuditList(
      auditList.map((a) => {
        if (a.id === id) {
          const utr = `UTR-HDFC-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
          return {
            ...a,
            auditApprovalStatus: 'SETTLED_RELEASED',
            settlementReferenceUTR: utr,
            notes: 'Transporter freight payment settled via bank wire.',
          };
        }
        return a;
      }),
    );
    showToast('Transporter freight payment settled.');
  };

  // =========================================================================
  // METRICS & KPIS CALCULATIONS
  // =========================================================================

  const kpis = useMemo(() => {
    const totalInboundTonnage = Number((inboundList.reduce((sum, i) => sum + i.inboundWeightKg, 0) / 1000).toFixed(1));
    const totalOutboundTonnage = Number((outboundList.reduce((sum, o) => sum + o.totalWeightKg, 0) / 1000).toFixed(1));
    const activeFleetCount = fleetList.filter((f) => f.vehicleStatus === 'ACTIVE_ON_ROAD').length;
    const verifiedDocsCount = statutoryList.filter(
      (s) => s.complianceVerificationStatus === 'VALID_VERIFIED' || s.complianceVerificationStatus === 'GATE_CLEARED',
    ).length;
    const totalAuditedSpend = auditList.reduce((sum, a) => sum + a.verifiedApprovedAmount, 0);
    const totalBackhaulingSaved = auditList.reduce((sum, a) => sum + a.backhaulingConsolidationCount, 0);

    const onTimeDeliveryRatePct =
      outboundList.length > 0
        ? Number(
            (
              (outboundList.filter((o) => o.dispatchStatus === 'DELIVERED_POD_RECEIVED').length /
                outboundList.length) *
              100
            ).toFixed(1),
          )
        : 0.0;

    return {
      totalInboundTonnage,
      totalOutboundTonnage,
      activeFleetCount,
      verifiedDocsCount,
      totalAuditedSpend,
      totalBackhaulingSaved,
      onTimeDeliveryRatePct,
    };
  }, [inboundList, outboundList, handlingList, statutoryList, fleetList, auditList]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg bg-orange-600 text-white font-medium text-base animate-bounce">
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
              <div className="p-2.5 rounded-xl bg-orange-600 text-white shadow-md shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight whitespace-nowrap">Logistics Department</span>
                <span className="block text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                  Inbound/Outbound Freight, Warehousing, e-Way Compliance &amp; Fleet
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
              <span>Warehouse Inventory</span>
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                Company-Scoped Logistics Portal
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3" />
                Zero Cross-Tenant Data Leakage
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Manufacturing Logistics &amp; Transport Operations
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mt-1">
              6 Core Pillars: Inbound Freight, Outbound Dispatch, Warehouse MHE &amp; Racking, Statutory e-Way Bills, Fleet Maintenance, and Freight Cost Optimization.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>{companyName}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-600 text-white font-semibold">
                  Logistics Authorized
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
        {/* Operational Navigation Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setLogTab('inbound')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              logTab === 'inbound'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Truck className="w-4 h-4 shrink-0" />
            <span>1. Inbound Transport &amp; RM</span>
          </button>
          <button
            type="button"
            onClick={() => setLogTab('outbound')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              logTab === 'outbound'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Navigation className="w-4 h-4 shrink-0" />
            <span>2. Outbound Dispatch &amp; FG</span>
          </button>
          <button
            type="button"
            onClick={() => setLogTab('handling')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              logTab === 'handling'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Warehouse className="w-4 h-4 shrink-0" />
            <span>3. Warehousing &amp; MHE Racking</span>
          </button>
          <button
            type="button"
            onClick={() => setLogTab('statutory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              logTab === 'statutory'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileCheck2 className="w-4 h-4 shrink-0" />
            <span>4. Statutory e-Way Compliance</span>
          </button>
          <button
            type="button"
            onClick={() => setLogTab('fleet')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              logTab === 'fleet'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Wrench className="w-4 h-4 shrink-0" />
            <span>5. Fleet Management &amp; Service</span>
          </button>
          <button
            type="button"
            onClick={() => setLogTab('audit')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              logTab === 'audit'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4 shrink-0" />
            <span>6. Freight Auditing &amp; Costing</span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: INBOUND LOGISTICS & RM TRANSPORT */}
        {/* ================================================================= */}
        {logTab === 'inbound' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Inbound Tonnage</span>
                  <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600">
                    <Scale className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{kpis.totalInboundTonnage} MT</div>
                <div className="text-sm text-orange-600 font-semibold mt-1">Raw material intake mass</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Arrived at Gate</span>
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {inboundList.filter((i) => i.transitStatus === 'ARRIVED_AT_GATE').length}
                </div>
                <div className="text-sm text-emerald-600 font-semibold mt-1">Ready for weighbridge &amp; unload</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">In Transit Trips</span>
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {inboundList.filter((i) => i.transitStatus === 'IN_TRANSIT').length}
                </div>
                <div className="text-sm text-slate-500 mt-1">Heavy haulers on highway transit</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Delayed Alerts</span>
                  <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {inboundList.filter((i) => i.delayHours > 0).length}
                </div>
                <div className="text-sm text-rose-600 font-semibold mt-1">Weather / expressway congestion</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tracking code, supplier, or vehicle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsNewInboundModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Schedule Inbound Shipment</span>
              </button>
            </div>

            {/* Inbound Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Tracking Code</th>
                      <th className="px-5 py-3.5">Supplier &amp; Category</th>
                      <th className="px-5 py-3.5">Carrier Fleet &amp; Truck</th>
                      <th className="px-5 py-3.5">Weight (MT)</th>
                      <th className="px-5 py-3.5">Origin &amp; Dock Bay</th>
                      <th className="px-5 py-3.5">Transit Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {inboundList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                          <Truck className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
                          <p className="font-bold">No inbound shipments recorded</p>
                          <p className="text-sm text-slate-400">Click &ldquo;Schedule Inbound Shipment&rdquo; to log raw material freight and carrier tracking</p>
                        </td>
                      </tr>
                    ) : inboundList.map((i) => (
                      <tr key={i.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-bold text-orange-600">
                          {i.trackingCode}
                          <span className="block text-xs font-semibold text-slate-400">{i.purchaseOrderRef}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{i.vendorSupplierName}</div>
                          <span className="inline-block mt-0.5 text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                            {i.materialCategory}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-800 dark:text-slate-200">{i.vehicleNumber}</div>
                          <div className="text-xs text-slate-500">{i.transporterFleet}</div>
                          <div className="text-xs text-slate-400">{i.driverNameAndContact}</div>
                        </td>
                        <td className="px-5 py-4 font-extrabold text-slate-900 dark:text-slate-100">
                          {(i.inboundWeightKg / 1000).toFixed(1)} MT
                        </td>
                        <td className="px-5 py-4 text-sm font-medium">
                          <div>{i.originLocation}</div>
                          <div className="text-xs text-indigo-600 font-bold">{i.dockUnloadBay}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              i.transitStatus === 'ARRIVED_AT_GATE'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : i.transitStatus === 'DELAYED_WEATHER_ROUTE'
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {i.transitStatus.replace(/_/g, ' ')}
                          </span>
                          {i.delayHours > 0 && (
                            <span className="block text-xs font-bold text-rose-600 mt-1">+{i.delayHours} hrs delay</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {i.transitStatus !== 'UNLOADED' ? (
                            <button
                              type="button"
                              onClick={() => handleAdvanceInboundStatus(i.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-all"
                            >
                              {i.transitStatus === 'IN_TRANSIT' ? 'Gate Check-In' : 'Unload Bay'}
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-emerald-600">Unloaded</span>
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
        {/* TAB 2: OUTBOUND LOGISTICS & FG DISPATCH */}
        {/* ================================================================= */}
        {logTab === 'outbound' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Outbound Tonnage</span>
                  <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600">
                    <Scale className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{kpis.totalOutboundTonnage} MT</div>
                <div className="text-sm text-orange-600 font-semibold mt-1">Dispatched customer tonnage</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">On-Time Delivery</span>
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{kpis.onTimeDeliveryRatePct}%</div>
                <div className="text-sm text-emerald-600 font-semibold mt-1">SLA punctuality rate</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Dispatched On Route</span>
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600">
                    <Navigation className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {outboundList.filter((o) => o.dispatchStatus === 'DISPATCHED_ON_ROUTE').length}
                </div>
                <div className="text-sm text-blue-600 font-semibold mt-1">Vehicles in transit</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Signed PODs</span>
                  <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {outboundList.filter((o) => o.podReceived).length}
                </div>
                <div className="text-sm text-violet-600 font-semibold mt-1">Proof of Delivery confirmed</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search dispatch plan, consignee, or vehicle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsNewOutboundModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Create Outbound Plan</span>
              </button>
            </div>

            {/* Outbound Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Dispatch Code</th>
                      <th className="px-5 py-3.5">Client Consignee</th>
                      <th className="px-5 py-3.5">Destination Route</th>
                      <th className="px-5 py-3.5">Vehicle &amp; Transporter</th>
                      <th className="px-5 py-3.5">Weight (MT)</th>
                      <th className="px-5 py-3.5">Freight Rate</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {outboundList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                          <Navigation className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
                          <p className="font-bold">No outbound dispatches recorded</p>
                          <p className="text-sm text-slate-400">Click &ldquo;Create Outbound Plan&rdquo; to plan vehicle allocation, routes, and freight terms</p>
                        </td>
                      </tr>
                    ) : outboundList.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-bold text-orange-600">
                          {o.dispatchPlanCode}
                          <span className="block text-xs font-semibold text-slate-400">{o.salesOrderRef}</span>
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-900 dark:text-slate-100">
                          {o.clientConsigneeName}
                        </td>
                        <td className="px-5 py-4 max-w-xs text-sm font-medium">
                          {o.destinationRoute}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-800 dark:text-slate-200">{o.allocatedVehicleNumber}</div>
                          <div className="text-xs text-slate-500">{o.transporterAgency}</div>
                          <span className="inline-block mt-0.5 text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                            {o.vehicleTypeAllocated.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-extrabold text-slate-900 dark:text-slate-100">
                          {(o.totalWeightKg / 1000).toFixed(1)} MT
                        </td>
                        <td className="px-5 py-4 font-bold text-emerald-600">
                          ₹{o.freightRateNegotiated.toLocaleString()}
                          <span className="block text-xs text-slate-400 font-normal">{o.freightRateType}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              o.dispatchStatus === 'DELIVERED_POD_RECEIVED'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : o.dispatchStatus === 'DISPATCHED_ON_ROUTE'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {o.dispatchStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedConsignmentForPrint(o)}
                              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all"
                              title="Print Logistics Pass"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            {o.dispatchStatus !== 'DELIVERED_POD_RECEIVED' && (
                              <button
                                type="button"
                                onClick={() => handleAdvanceOutboundStatus(o.id)}
                                className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-all"
                              >
                                {o.dispatchStatus === 'SCHEDULED' ? 'Dispatch' : 'Confirm POD'}
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
        {/* TAB 3: WAREHOUSING & MHE RACKING */}
        {/* ================================================================= */}
        {logTab === 'handling' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Warehousing Zones</span>
                  <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600">
                    <Warehouse className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{handlingList.length} Zones</div>
                <div className="text-sm text-slate-500 mt-1">Vertical bin racking bays mapped</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Total Handled Mass</span>
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
                    <Scale className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {(handlingList.reduce((sum, h) => sum + h.loadWeightKg, 0) / 1000).toFixed(1)} MT
                </div>
                <div className="text-sm text-emerald-600 font-semibold mt-1">MHE heavy crane/forklift lifts</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Storage Telemetry</span>
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600">
                    <Thermometer className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {handlingList.length > 0
                    ? `${(
                        handlingList.reduce((sum, h) => sum + (h.ambientTemperatureC || 0), 0) /
                        handlingList.length
                      ).toFixed(1)} °C`
                    : '0.0 °C'}
                </div>
                <div className="text-sm text-blue-600 font-semibold mt-1">
                  {handlingList.length > 0
                    ? `${(
                        handlingList.reduce((sum, h) => sum + (h.relativeHumidityPct || 0), 0) /
                        handlingList.length
                      ).toFixed(1)}% RH optimal humidity`
                    : '0.0% RH optimal humidity'}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Stacking Safety</span>
                  <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{handlingList.length > 0 ? '100%' : '0%'}</div>
                <div className="text-sm text-violet-600 font-semibold mt-1">Racking weight safety cleared</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search zone, racking location, or equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsNewHandlingModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Log Material Movement</span>
              </button>
            </div>

            {/* Handling Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Handling Code</th>
                      <th className="px-5 py-3.5">Warehouse Zone &amp; Bin</th>
                      <th className="px-5 py-3.5">Stored Material</th>
                      <th className="px-5 py-3.5">Equipment &amp; Operator</th>
                      <th className="px-5 py-3.5">Load Weight</th>
                      <th className="px-5 py-3.5">Environment Telemetry</th>
                      <th className="px-5 py-3.5">Condition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {handlingList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                          <Warehouse className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
                          <p className="font-bold">No warehouse material handlings recorded</p>
                          <p className="text-sm text-slate-400">Click &ldquo;Log Material Movement&rdquo; to record racking, MHE equipment, and telemetry</p>
                        </td>
                      </tr>
                    ) : handlingList.map((h) => (
                      <tr key={h.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-bold text-orange-600">{h.handlingRecordCode}</td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{h.warehouseZone}</div>
                          <span className="text-xs font-mono font-bold text-indigo-600">{h.binRackingLocation}</span>
                        </td>
                        <td className="px-5 py-4 max-w-xs text-sm font-medium">
                          {h.storedItemDescription}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-sm">{h.equipmentOperatorName}</div>
                          <div className="text-xs text-slate-500">{h.handlingEquipmentUsed.replace(/_/g, ' ')}</div>
                        </td>
                        <td className="px-5 py-4 font-extrabold text-slate-900 dark:text-slate-100">
                          {(h.loadWeightKg / 1000).toFixed(1)} MT
                        </td>
                        <td className="px-5 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                          <div>Temp: {h.ambientTemperatureC}&deg;C</div>
                          <div>Humidity: {h.relativeHumidityPct}% RH</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {h.storageConditionStatus}
                          </span>
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
        {/* TAB 4: STATUTORY E-WAY COMPLIANCE */}
        {/* ================================================================= */}
        {logTab === 'statutory' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Total Statutory Passes</span>
                  <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{statutoryList.length}</div>
                <div className="text-sm text-slate-500 mt-1">E-Way bills &amp; challans active</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">QR Code Verified</span>
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
                    <QrCode className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {statutoryList.length > 0
                    ? `${Math.round((statutoryList.filter((s) => s.digitalQrcodeVerified).length / statutoryList.length) * 100)}%`
                    : '0%'}
                </div>
                <div className="text-sm text-emerald-600 font-semibold mt-1">NIC e-Way portal synchronized</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Gate Cleared</span>
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {statutoryList.filter((s) => s.complianceVerificationStatus === 'GATE_CLEARED' || s.complianceVerificationStatus === 'VALID_VERIFIED').length}
                </div>
                <div className="text-sm text-blue-600 font-semibold mt-1">Security checkpoint stamped</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Interstate Permits</span>
                  <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600">
                    <Navigation className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {statutoryList.filter((s) => s.interstatePermit).length}
                </div>
                <div className="text-sm text-violet-600 font-semibold mt-1">Cross-state transit authorized</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search e-Way bill number, challan, or vehicle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsNewStatutoryModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Verify &amp; Add Statutory Doc</span>
              </button>
            </div>

            {/* Statutory Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Document Code</th>
                      <th className="px-5 py-3.5">Type &amp; Reference No</th>
                      <th className="px-5 py-3.5">Party / Consignee</th>
                      <th className="px-5 py-3.5">Vehicle Number</th>
                      <th className="px-5 py-3.5">Validity Range</th>
                      <th className="px-5 py-3.5">Compliance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {statutoryList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                          <FileCheck2 className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
                          <p className="font-bold">No statutory e-Way passes recorded</p>
                          <p className="text-sm text-slate-400">Click &ldquo;Verify &amp; Add Statutory Doc&rdquo; to validate GST e-Way bills and delivery challans</p>
                        </td>
                      </tr>
                    ) : statutoryList.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-bold text-orange-600">{s.documentCode}</td>
                        <td className="px-5 py-4">
                          <span className="font-extrabold font-mono text-slate-900 dark:text-slate-100">
                            {s.documentReferenceNumber}
                          </span>
                          <span className="block text-xs font-semibold text-slate-500">
                            {s.documentType.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-800 dark:text-slate-200">
                          {s.consignorOrConsignee}
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                          {s.vehicleNumber}
                        </td>
                        <td className="px-5 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                          <div>From: {s.validFrom}</div>
                          <div>Till: {s.validTill}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {s.complianceVerificationStatus.replace(/_/g, ' ')}
                          </span>
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
        {/* TAB 5: FLEET MANAGEMENT & SERVICE */}
        {/* ================================================================= */}
        {logTab === 'fleet' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Registered Fleet</span>
                  <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{fleetList.length} Vehicles</div>
                <div className="text-sm text-slate-500 mt-1">Multi-axle &amp; container trucks</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Active On-Road</span>
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{kpis.activeFleetCount}</div>
                <div className="text-sm text-emerald-600 font-semibold mt-1">Live GPS connected</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Average Mileage</span>
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600">
                    <Gauge className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {fleetList.length > 0
                    ? `${(
                        fleetList.reduce((sum, f) => sum + (f.fuelMileageKmpl || 0), 0) /
                        fleetList.length
                      ).toFixed(1)} km/l`
                    : '0.0 km/l'}
                </div>
                <div className="text-sm text-blue-600 font-semibold mt-1">Heavy freight diesel fuel efficiency</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Fitness Renewals</span>
                  <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600">
                    <Wrench className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{fleetList.length > 0 ? '100%' : '0%'}</div>
                <div className="text-sm text-violet-600 font-semibold mt-1">RTO fitness &amp; insurance compliant</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search registration number, fleet code, or model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsNewFleetModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Onboard Commercial Vehicle</span>
              </button>
            </div>

            {/* Fleet Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Fleet Code</th>
                      <th className="px-5 py-3.5">Registration &amp; Model</th>
                      <th className="px-5 py-3.5">Odometer &amp; Mileage</th>
                      <th className="px-5 py-3.5">Certificates (Fitness/PUC)</th>
                      <th className="px-5 py-3.5">Live GPS Location</th>
                      <th className="px-5 py-3.5">Vehicle Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {fleetList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                          <Truck className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
                          <p className="font-bold">No commercial fleet vehicles registered</p>
                          <p className="text-sm text-slate-400">Click &ldquo;Onboard Commercial Vehicle&rdquo; to register transport trucks, GPS tracking, and fitness</p>
                        </td>
                      </tr>
                    ) : fleetList.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-bold text-orange-600">{f.fleetVehicleCode}</td>
                        <td className="px-5 py-4">
                          <div className="font-extrabold font-mono text-slate-900 dark:text-slate-100">
                            {f.registrationNumber}
                          </div>
                          <div className="text-xs text-slate-500">{f.vehicleModel}</div>
                          <span className="inline-block mt-0.5 text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                            {f.ownershipType.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-slate-100">
                            {f.currentOdometerKm.toLocaleString()} km
                          </div>
                          <div className="text-xs text-emerald-600 font-semibold">{f.fuelMileageKmpl} km/l avg</div>
                        </td>
                        <td className="px-5 py-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                          <div>Fit: {f.fitnessCertificateExpiry}</div>
                          <div>PUC: {f.pucEmissionExpiry}</div>
                        </td>
                        <td className="px-5 py-4 text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-xs">
                          <div className="flex items-center gap-1 text-orange-600">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>GPS Active</span>
                          </div>
                          <div className="truncate mt-0.5">{f.liveLocationCoordinates}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              f.vehicleStatus === 'ACTIVE_ON_ROAD'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {f.vehicleStatus.replace(/_/g, ' ')}
                          </span>
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
        {/* TAB 6: FREIGHT AUDITING & COSTING */}
        {/* ================================================================= */}
        {logTab === 'audit' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Total Freight Spend</span>
                  <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">₹{(kpis.totalAuditedSpend / 100000).toFixed(1)}L</div>
                <div className="text-sm text-orange-600 font-semibold mt-1">Verified transporter billings</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Backhauling Saved</span>
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{kpis.totalBackhaulingSaved} Trips</div>
                <div className="text-sm text-emerald-600 font-semibold mt-1">Empty return trips eliminated</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Discrepancies Deducted</span>
                  <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  ₹{auditList.reduce((sum, a) => sum + a.discrepancyDeductionAmount, 0).toLocaleString()}
                </div>
                <div className="text-sm text-rose-600 font-semibold mt-1">Unauthorized detentions clawed back</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Cost Per Ton-Km</span>
                  <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600">
                    <Scale className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {auditList.filter((a) => a.costPerTonKmCalculated !== null && a.costPerTonKmCalculated !== undefined).length > 0
                    ? `₹${(
                        auditList
                          .filter((a) => a.costPerTonKmCalculated !== null && a.costPerTonKmCalculated !== undefined)
                          .reduce((sum, a) => sum + (a.costPerTonKmCalculated || 0), 0) /
                        auditList.filter((a) => a.costPerTonKmCalculated !== null && a.costPerTonKmCalculated !== undefined).length
                      ).toFixed(2)}`
                    : '₹0.00'}
                </div>
                <div className="text-sm text-violet-600 font-semibold mt-1">Competitive freight efficiency</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search audit invoice, agency, or ARC contract..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsNewAuditModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Audit Transporter Freight Bill</span>
              </button>
            </div>

            {/* Audit Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Audit Code</th>
                      <th className="px-5 py-3.5">Transporter Agency</th>
                      <th className="px-5 py-3.5">Billed vs Approved</th>
                      <th className="px-5 py-3.5">Trips &amp; Backhauling</th>
                      <th className="px-5 py-3.5">Cost / Ton-Km</th>
                      <th className="px-5 py-3.5">Approval Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {auditList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                          <DollarSign className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
                          <p className="font-bold">No freight bill audits recorded</p>
                          <p className="text-sm text-slate-400">Click &ldquo;Audit Transporter Freight Bill&rdquo; to reconcile freight invoices and ARC contracts</p>
                        </td>
                      </tr>
                    ) : auditList.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-bold text-orange-600">
                          {a.auditInvoiceCode}
                          <span className="block text-xs font-semibold text-slate-400">{a.billingPeriod}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{a.transporterAgencyName}</div>
                          <span className="text-xs font-mono text-slate-500">{a.contractAgreementCode}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-extrabold text-emerald-600">
                            Approved: ₹{a.verifiedApprovedAmount.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-400">Billed: ₹{a.totalBilledAmount.toLocaleString()}</div>
                          {a.discrepancyDeductionAmount > 0 && (
                            <span className="text-xs font-bold text-rose-600 block">
                              Deducted: ₹{a.discrepancyDeductionAmount.toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-sm font-medium">
                          <div>{a.totalTripsAudited} Trips Audited</div>
                          <div className="text-xs text-emerald-600 font-semibold">
                            {a.backhaulingConsolidationCount} Backhauls Saved
                          </div>
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-900 dark:text-slate-100">
                          ₹{a.costPerTonKmCalculated} / T-Km
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              a.auditApprovalStatus === 'SETTLED_RELEASED'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {a.auditApprovalStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {a.auditApprovalStatus !== 'SETTLED_RELEASED' ? (
                            <button
                              type="button"
                              onClick={() => handleSettleAudit(a.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-all"
                            >
                              Settle Freight
                            </button>
                          ) : (
                            <span className="text-xs font-mono font-bold text-slate-500">{a.settlementReferenceUTR}</span>
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
      {/* 1. MODAL: INBOUND SHIPMENT */}
      {/* ========================================================================= */}
      {isNewInboundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Truck className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-extrabold">Schedule Inbound Raw Material</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewInboundModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddInbound} className="mt-5 space-y-4 text-base">
              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Vendor Supplier Name *
                </label>
                <input
                  type="text"
                  name="vendorSupplierName"
                  required
                  placeholder="Tata Steel Industrial Billet Division"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Purchase Order (PO) Ref
                  </label>
                  <input
                    type="text"
                    name="purchaseOrderRef"
                    defaultValue="PO-2026-089"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Material Category *
                  </label>
                  <select
                    name="materialCategory"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="RAW_MATERIALS">Raw Materials</option>
                    <option value="CONSUMABLES">Consumables &amp; Lubricants</option>
                    <option value="SPARE_PARTS">Spare Parts &amp; Tooling</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Transporter Fleet *
                  </label>
                  <input
                    type="text"
                    name="transporterFleet"
                    required
                    defaultValue="VRL Logistics Heavy Freight Fleet"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    required
                    defaultValue="MH-12-RN-9921"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Inbound Net Weight (Kg) *
                  </label>
                  <input
                    type="number"
                    name="inboundWeightKg"
                    required
                    defaultValue={28500}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Dock Unload Bay
                  </label>
                  <input
                    type="text"
                    name="dockUnloadBay"
                    defaultValue="BAY-INB-DOCK-01"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Origin Supplier Location *
                </label>
                <input
                  type="text"
                  name="originLocation"
                  required
                  defaultValue="Jamshedpur Steel Works, Jharkhand"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewInboundModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold"
                >
                  Schedule Inbound Transport
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODAL: OUTBOUND DISPATCH */}
      {/* ========================================================================= */}
      {isNewOutboundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Navigation className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-extrabold">Plan Outbound Finished Goods Dispatch</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewOutboundModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddOutbound} className="mt-5 space-y-4 text-base">
              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Client Consignee Name *
                </label>
                <input
                  type="text"
                  name="clientConsigneeName"
                  required
                  placeholder="Mahindra Automotive Foundry Division"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Sales Order (SO) Ref
                  </label>
                  <input
                    type="text"
                    name="salesOrderRef"
                    defaultValue="SO-2026-109"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Vehicle Type *
                  </label>
                  <select
                    name="vehicleTypeAllocated"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="HEAVY_LORRY_32_FT">Heavy Lorry 32 FT Multi-Axle</option>
                    <option value="CONTAINER_TRAILER">40 FT High-Cube Container Trailer</option>
                    <option value="MINI_TRUCK_EICHER">Eicher Pro 19T Cargo Container</option>
                    <option value="LIGHT_COMMERCIAL_VEHICLE">Light Commercial Carrier</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Allocated Vehicle No *
                  </label>
                  <input
                    type="text"
                    name="allocatedVehicleNumber"
                    required
                    defaultValue="MH-12-RN-9921"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Transporter Agency *
                  </label>
                  <input
                    type="text"
                    name="transporterAgency"
                    required
                    defaultValue="VRL Heavy Freight Carriers"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Total Load Weight (Kg) *
                  </label>
                  <input
                    type="number"
                    name="totalWeightKg"
                    required
                    defaultValue={35000}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Freight Rate (₹) *
                  </label>
                  <input
                    type="number"
                    name="freightRateNegotiated"
                    required
                    defaultValue={18500}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Destination Highway Corridor *
                </label>
                <input
                  type="text"
                  name="destinationRoute"
                  required
                  defaultValue="Pune - Chakan Industrial Corridor (Route 4)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewOutboundModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold"
                >
                  Confirm Outbound Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL: WAREHOUSE HANDLING & RACKING */}
      {/* ========================================================================= */}
      {isNewHandlingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Warehouse className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-extrabold">Log Material Handling &amp; Racking</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewHandlingModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddHandling} className="mt-5 space-y-4 text-base">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Warehouse Zone *
                  </label>
                  <select
                    name="warehouseZone"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="ZONE-A-HEAVY-METALS">Zone A - Heavy Metals &amp; Billets</option>
                    <option value="ZONE-B-RAW-MATERIALS">Zone B - General Raw Materials</option>
                    <option value="ZONE-C-FINISHED-GOODS">Zone C - Finished Goods Staging</option>
                    <option value="ZONE-D-LUBRICANTS">Zone D - Temperature-Controlled Stores</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Bin / Racking Location *
                  </label>
                  <input
                    type="text"
                    name="binRackingLocation"
                    required
                    placeholder="RACK-V4-BAY-03"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Stored Material Description *
                </label>
                <input
                  type="text"
                  name="storedItemDescription"
                  required
                  placeholder="High-Tensile EN8 Billets 100x100mm"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Equipment Used *
                  </label>
                  <select
                    name="handlingEquipmentUsed"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="OVERHEAD_EOT_CRANE_15T">Overhead EOT Crane (15 Ton)</option>
                    <option value="FORKLIFT_3_TON">Forklift (3 Ton Heavy Duty)</option>
                    <option value="REACH_TRUCK">Reach Truck (High Mast)</option>
                    <option value="PALLET_JACK_ELECTRIC">Electric Pallet Jack</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Certified Operator *
                  </label>
                  <input
                    type="text"
                    name="equipmentOperatorName"
                    required
                    placeholder="Dilip Sawant (Master Crane Operator)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Weight (Kg) *</label>
                  <input
                    type="number"
                    name="loadWeightKg"
                    required
                    defaultValue={14000}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Temp (&deg;C)</label>
                  <input
                    type="number"
                    name="ambientTemperatureC"
                    defaultValue={26.5}
                    step="0.5"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Humidity (%)</label>
                  <input
                    type="number"
                    name="relativeHumidityPct"
                    defaultValue={45.0}
                    step="0.5"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewHandlingModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold"
                >
                  Save Movement Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: STATUTORY DOCS & COMPLIANCE */}
      {/* ========================================================================= */}
      {isNewStatutoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-extrabold">Verify &amp; Register Statutory Transit Document</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewStatutoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStatutory} className="mt-5 space-y-4 text-base">
              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Consignor / Consignee Party *
                </label>
                <input
                  type="text"
                  name="consignorOrConsignee"
                  required
                  placeholder="Mahindra Automotive Foundry Division"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Document Type *
                  </label>
                  <select
                    name="documentType"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="E_WAY_BILL">Statutory e-Way Bill (NIC GST)</option>
                    <option value="DELIVERY_CHALLAN">Delivery Challan (DC)</option>
                    <option value="WEIGHBRIDGE_OUTWARD_SLIP">Weighbridge Outward Slip</option>
                    <option value="TRANSPORTER_CONSIGNMENT_NOTE">Transporter Consignment Note (Lorry Receipt)</option>
                    <option value="TAX_INVOICE_TRANSIT_PASS">Tax Invoice Transit Pass</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Reference / e-Way No *
                  </label>
                  <input
                    type="text"
                    name="documentReferenceNumber"
                    required
                    placeholder="EWB-291049182740"
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
                    defaultValue="MH-12-RN-9921"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Invoice Ref No
                  </label>
                  <input
                    type="text"
                    name="invoiceReferenceNumber"
                    defaultValue="INV-SLS-2026-901"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Valid From Date *
                  </label>
                  <input
                    type="date"
                    name="validFrom"
                    required
                    defaultValue="2026-11-20"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Valid Till Date *
                  </label>
                  <input
                    type="date"
                    name="validTill"
                    required
                    defaultValue="2026-11-23"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewStatutoryModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold"
                >
                  Verify QR &amp; Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: ONBOARD COMMERCIAL VEHICLE */}
      {/* ========================================================================= */}
      {isNewFleetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Wrench className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-extrabold">Onboard Commercial Fleet Vehicle</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewFleetModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFleet} className="mt-5 space-y-4 text-base">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    required
                    placeholder="MH-12-RN-9921"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Ownership Type *
                  </label>
                  <select
                    name="ownershipType"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="COMPANY_OWNED">Company Owned</option>
                    <option value="DEDICATED_CONTRACT_LEASE">Dedicated Contract Lease</option>
                    <option value="SPOT_MARKET_CARRIER">Spot Market Carrier</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Vehicle Model Specification *
                </label>
                <input
                  type="text"
                  name="vehicleModel"
                  required
                  placeholder="Tata Signa 3523.TK (Multi-Axle 35T Heavy Truck)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Odometer (Km) *</label>
                  <input
                    type="number"
                    name="currentOdometerKm"
                    required
                    defaultValue={120000}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Mileage (km/l)</label>
                  <input
                    type="number"
                    name="fuelMileageKmpl"
                    defaultValue={3.6}
                    step="0.1"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Fitness Expiry *</label>
                  <input
                    type="date"
                    name="fitnessCertificateExpiry"
                    required
                    defaultValue="2027-05-30"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Current Staging Location *
                </label>
                <input
                  type="text"
                  name="liveLocationCoordinates"
                  required
                  defaultValue="Factory Depot Staging Bay #2"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewFleetModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold"
                >
                  Onboard Fleet Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: AUDIT TRANSPORTER FREIGHT BILL */}
      {/* ========================================================================= */}
      {isNewAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-extrabold">Audit Transporter Freight Bill</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewAuditModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAudit} className="mt-5 space-y-4 text-base">
              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Transporter Agency Fleet *
                </label>
                <input
                  type="text"
                  name="transporterAgencyName"
                  required
                  placeholder="VRL Logistics Heavy Freight Fleet"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Billing Month / Period *
                  </label>
                  <input
                    type="text"
                    name="billingPeriod"
                    required
                    defaultValue="2026-11"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Contract ARC Code
                  </label>
                  <input
                    type="text"
                    name="contractAgreementCode"
                    defaultValue="ARC-FRT-2026-02"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Total Billed Amount (₹) *
                  </label>
                  <input
                    type="number"
                    name="totalBilledAmount"
                    required
                    defaultValue={450000}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Detention Deductions (₹)
                  </label>
                  <input
                    type="number"
                    name="discrepancyDeductionAmount"
                    defaultValue={10000}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Audited Trips *</label>
                  <input
                    type="number"
                    name="totalTripsAudited"
                    required
                    defaultValue={24}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Backhauls Saved</label>
                  <input
                    type="number"
                    name="backhaulingConsolidationCount"
                    defaultValue={7}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Cost / T-Km (₹)</label>
                  <input
                    type="number"
                    name="costPerTonKmCalculated"
                    defaultValue={2.35}
                    step="0.05"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewAuditModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold"
                >
                  Authorize Freight Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. PRINTABLE OFFICIAL CONSIGNMENT GATE PASS */}
      {/* ========================================================================= */}
      {selectedConsignmentForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-2xl max-h-[90vh] overflow-y-auto print:m-0 print:p-0 print:border-none print:shadow-none">
            <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 print:hidden">
              <div className="flex items-center gap-2 text-orange-600 font-bold">
                <Printer className="w-5 h-5" />
                <span>Official Logistics Consignment Gate Pass &amp; Waybill</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedConsignmentForPrint(null)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Body */}
            <div className="mt-6 space-y-6 text-slate-900 dark:text-slate-100">
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-orange-600 pb-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">{companyName}</h2>
                  <p className="text-sm text-slate-500 font-medium">
                    Plant Logistics &amp; Transport Division &bull; {tenantSubCategory} &bull; Multi-Tenant Isolated
                  </p>
                  <p className="text-xs font-mono text-slate-400">Tenant CID: {selectedConsignmentForPrint.companyId}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Consignment Gate Pass</span>
                  <div className="text-2xl font-extrabold font-mono">{selectedConsignmentForPrint.dispatchPlanCode}</div>
                  <div className="text-xs text-slate-500">Departure: {selectedConsignmentForPrint.scheduledDeparture}</div>
                </div>
              </div>

              {/* Transit Details */}
              <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Consignee Client</span>
                  <div className="font-bold text-lg text-slate-900 dark:text-slate-100 mt-0.5">
                    {selectedConsignmentForPrint.clientConsigneeName}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Route: {selectedConsignmentForPrint.destinationRoute}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">SO Ref: {selectedConsignmentForPrint.salesOrderRef || 'Contract Lift'}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Carrier &amp; Vehicle</span>
                  <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
                    {selectedConsignmentForPrint.allocatedVehicleNumber}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{selectedConsignmentForPrint.transporterAgency}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Type: {selectedConsignmentForPrint.vehicleTypeAllocated.replace(/_/g, ' ')}
                  </div>
                </div>
              </div>

              {/* Weight Details */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                    <tr>
                      <th className="px-4 py-2.5">Cargo Description</th>
                      <th className="px-4 py-2.5">Weighbridge Outward Net Tonnage</th>
                      <th className="px-4 py-2.5 text-right">Agreed Freight Charge</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3 font-semibold">
                        Finished Manufactured Components / Bundled Billets
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-base">
                        {(selectedConsignmentForPrint.totalWeightKg / 1000).toFixed(1)} Metric Tons ({selectedConsignmentForPrint.totalWeightKg.toLocaleString()} kg)
                      </td>
                      <td className="px-4 py-3 text-right font-black text-base text-orange-600">
                        ₹{selectedConsignmentForPrint.freightRateNegotiated.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="h-14 border-b border-dashed border-slate-400 flex items-end justify-center pb-2 text-xs text-slate-400">
                    [Digitally Signed via ERP Auth]
                  </div>
                  <div className="font-bold text-sm mt-2">Logistics Incharge</div>
                  <div className="text-xs text-slate-500">Plant Logistics Operations</div>
                </div>
                <div>
                  <div className="h-14 border-b border-dashed border-slate-400 flex items-end justify-center pb-2 text-xs text-slate-400">
                    [Weighbridge Slip Verified]
                  </div>
                  <div className="font-bold text-sm mt-2">Security Gate Officer</div>
                  <div className="text-xs text-slate-500">Outward FASTag Gateway</div>
                </div>
                <div>
                  <div className="h-14 border-b border-dashed border-slate-400 flex items-end justify-center pb-2 text-xs text-slate-400">
                    [Carrier Driver Signature]
                  </div>
                  <div className="font-bold text-sm mt-2">Transporter Driver</div>
                  <div className="text-xs text-slate-500">{selectedConsignmentForPrint.allocatedVehicleNumber}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
