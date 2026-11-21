'use client';

import React, { useState, useEffect, useMemo, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  ShieldCheck,
  Truck,
  Users,
  Search,
  Building2,
  Sun,
  Moon,
  ArrowLeft,
  X,
  Plus,
  Scale,
  Printer,
  FileCheck2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  QrCode,
  Flame,
  Radio,
  Eye,
  Camera,
  Car,
  Key,
  Compass,
  PhoneCall,
  BellRing,
  Lock,
  Unlock,
  AlertOctagon,
  HardHat,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

// =========================================================================
// DATA INTERFACES
// =========================================================================

interface GateVehicleEntry {
  id: string;
  gatePassNumber: string;
  vehicleNumber: string;
  vehicleType: string;
  driverName: string;
  driverPhone?: string | null;
  driverLicenseNumber?: string | null;
  transporterAgency?: string | null;
  entryPurpose: string;
  ewayBillNumber?: string | null;
  taxInvoiceRef?: string | null;
  deliveryChallanRef?: string | null;
  inwardTimestamp: string;
  outwardTimestamp?: string | null;
  grossWeightKg?: number | null;
  tareWeightKg?: number | null;
  netWeightKg?: number | null;
  gateEntryStatus: string;
  securityOfficerName: string;
  sealNumberVerified: boolean;
  securityCheckNotes?: string | null;
  companyId: string;
  createdAt: string;
}

interface GateVisitorAccess {
  id: string;
  visitorPassNumber: string;
  visitorName: string;
  visitorPhone: string;
  visitorOrganization: string;
  idProofType: string;
  idProofNumber: string;
  hostPersonToMeet: string;
  hostDepartment: string;
  visitPurpose: string;
  departmentApprovalStatus: string;
  approvingManagerName?: string | null;
  rfidCardBadgeNumber?: string | null;
  safetyPpeHelmetIssued: boolean;
  safetyPpeVestIssued: boolean;
  safetyPpeShoesVerified: boolean;
  safetyBriefingAcknowledged: boolean;
  checkInTime: string;
  checkOutTime?: string | null;
  accessStatus: string;
  securityNotes?: string | null;
  companyId: string;
  createdAt: string;
}

interface GateMaterialInspection {
  id: string;
  inspectionRecordCode: string;
  vehicleNumber: string;
  gatePassRef?: string | null;
  challanInvoiceRef?: string | null;
  materialType: string;
  containerInspectionStatus: string;
  containerSealNumber?: string | null;
  physicalVsChallanMatch: string;
  contractLaborFriskingDone: boolean;
  metalDetectorCleared: boolean;
  unauthorizedMaterialFound: boolean;
  smugglingAlertFlag: boolean;
  discrepancyRemarks?: string | null;
  inspectingOfficerName: string;
  inspectionStatus: string;
  companyId: string;
  createdAt: string;
}

interface GateTrafficParking {
  id: string;
  trafficSlotCode: string;
  vehicleCategory: string;
  vehicleRegistrationNumber: string;
  allocatedSlotOrBay: string;
  driverOrOwnerName: string;
  driverContactPhone?: string | null;
  entryTime: string;
  exitTime?: string | null;
  fireExitClearanceVerified: boolean;
  parkingViolationStatus: string;
  trafficGuardName: string;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

interface GateEmergencyControl {
  id: string;
  incidentLogCode: string;
  incidentType: string;
  gateOperationsMode: string;
  emergencyAgencyNotified: string;
  emergencyContactPhone?: string | null;
  cctvSurveillanceStatus: string;
  gateStationNumber: string;
  incidentSeverity: string;
  incidentStartTime: string;
  incidentResolvedTime?: string | null;
  resolutionSummary?: string | null;
  commandingOfficerName: string;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

interface GateNightPatrol {
  id: string;
  patrolLogCode: string;
  patrolShift: string;
  leadPatrolGuardName: string;
  accompanyingGuards?: string | null;
  patrolCheckpointZone: string;
  checkpointScanTime: string;
  physicalLockSecure: boolean;
  lockConditionDetails?: string | null;
  perimeterLightingStatus: string;
  suspiciousActivityDetected: boolean;
  suspiciousDetails?: string | null;
  escalatedToSecurityManager: boolean;
  securityManagerActionNotes?: string | null;
  companyId: string;
  createdAt: string;
}

export default function GateSecurityDashboardPage() {
  const router = useRouter();

  // Dark / Light Theme state (Default Light Theme)
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Active Sub-Tab
  const [activeTab, setActiveTab] = useState<
    'vehicles' | 'visitors' | 'inspections' | 'traffic' | 'emergency' | 'patrol'
  >('vehicles');

  // Search and status filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Multi-Tenant Company state
  const [companyInfo, setCompanyInfo] = useState({
    id: 'company_isolated_01',
    companyName: 'Apex Industrial Steel & Machinery Corp',
    code: 'MFG-APEX-01',
    gstNumber: '27AABCA1234F1Z8',
    subCategory: 'Steel and Heavy Metals',
    industryCategory: 'Heavy and Raw Materials',
  });

  // Data collections (Isolated per company)
  const [vehicles, setVehicles] = useState<GateVehicleEntry[]>([]);
  const [visitors, setVisitors] = useState<GateVisitorAccess[]>([]);
  const [inspections, setInspections] = useState<GateMaterialInspection[]>([]);
  const [traffic, setTraffic] = useState<GateTrafficParking[]>([]);
  const [emergencies, setEmergencies] = useState<GateEmergencyControl[]>([]);
  const [patrols, setPatrols] = useState<GateNightPatrol[]>([]);

  // Modals
  const [modalOpen, setModalOpen] = useState<string | null>(null);
  const [selectedVehicleForPrint, setSelectedVehicleForPrint] = useState<GateVehicleEntry | null>(null);

  // New Record Form States
  const [newVehicle, setNewVehicle] = useState({
    vehicleNumber: '',
    vehicleType: 'HEAVY_LORRY',
    driverName: '',
    driverPhone: '',
    driverLicenseNumber: '',
    transporterAgency: '',
    entryPurpose: 'RAW_MATERIAL_INWARD',
    ewayBillNumber: '',
    taxInvoiceRef: '',
    deliveryChallanRef: '',
    grossWeightKg: '',
    tareWeightKg: '',
    securityOfficerName: 'Subedar Rajendra Patil',
    sealNumberVerified: true,
    securityCheckNotes: '',
  });

  const [newVisitor, setNewVisitor] = useState({
    visitorName: '',
    visitorPhone: '',
    visitorOrganization: '',
    idProofType: 'AADHAAR',
    idProofNumber: '',
    hostPersonToMeet: '',
    hostDepartment: 'PRODUCTION',
    visitPurpose: 'VENDOR_MEETING',
    rfidCardBadgeNumber: '',
    safetyPpeHelmetIssued: true,
    safetyPpeVestIssued: true,
    safetyPpeShoesVerified: true,
    safetyBriefingAcknowledged: true,
    securityNotes: '',
  });

  const [newInspection, setNewInspection] = useState({
    vehicleNumber: '',
    gatePassRef: '',
    challanInvoiceRef: '',
    materialType: 'RAW_MATERIAL',
    containerInspectionStatus: 'SEAL_INTACT_VERIFIED',
    containerSealNumber: '',
    physicalVsChallanMatch: 'MATCHED_VERIFIED',
    contractLaborFriskingDone: true,
    metalDetectorCleared: true,
    unauthorizedMaterialFound: false,
    smugglingAlertFlag: false,
    discrepancyRemarks: '',
    inspectingOfficerName: 'Subedar Rajendra Patil',
  });

  const [newTraffic, setNewTraffic] = useState({
    vehicleCategory: 'HEAVY_TRUCK_LORRY',
    vehicleRegistrationNumber: '',
    allocatedSlotOrBay: 'BAY-01-UNLOAD',
    driverOrOwnerName: '',
    driverContactPhone: '',
    fireExitClearanceVerified: true,
    trafficGuardName: 'Guard Dnyaneshwar More',
    notes: '',
  });

  const [newEmergency, setNewEmergency] = useState({
    incidentType: 'SAFETY_MOCK_DRILL',
    gateOperationsMode: 'EMERGENCY_ALL_GATES_OPEN',
    emergencyAgencyNotified: 'INTERNAL_EHS_TEAM',
    emergencyContactPhone: '+91 20 2710 4400',
    cctvSurveillanceStatus: 'ALL_CAMERAS_OPERATIONAL',
    gateStationNumber: 'GATE-01-MAIN',
    incidentSeverity: 'LOW_MOCK_DRILL',
    commandingOfficerName: 'Col. Arvind Saxena',
    notes: '',
  });

  const [newPatrol, setNewPatrol] = useState({
    patrolShift: 'NIGHT_SHIFT_FIRST_HALF',
    leadPatrolGuardName: 'Head Guard Somnath Kadam',
    accompanyingGuards: 'Guard Anil Yadav',
    patrolCheckpointZone: 'PERIMETER_NORTH_FENCE',
    physicalLockSecure: true,
    lockConditionDetails: 'Padlocks and sensors secure',
    perimeterLightingStatus: 'ADEQUATE_FLOODLIGHTS',
    suspiciousActivityDetected: false,
    suspiciousDetails: '',
    escalatedToSecurityManager: false,
    securityManagerActionNotes: '',
  });

  // Handle Theme
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    const savedCompany = localStorage.getItem('selected_company');
    if (savedCompany) {
      try {
        const parsed = JSON.parse(savedCompany);
        setCompanyInfo((prev) => ({
          ...prev,
          id: parsed.id || prev.id,
          companyName: parsed.companyName || parsed.name || prev.companyName,
          gstNumber: parsed.gstNumber || prev.gstNumber,
          subCategory: parsed.subCategory || prev.subCategory,
          industryCategory: parsed.industryCategory || prev.industryCategory,
        }));
      } catch (e) {
        console.error('Error parsing company profile', e);
      }
    }

    // Seed mock data
    seedInitialData();
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const seedInitialData = () => {
    const now = new Date();
    const cId = companyInfo.id;

    setVehicles([
      {
        id: 'veh-01',
        gatePassNumber: 'GATE-VEH-2026-101',
        vehicleNumber: 'MH-12-RN-9921',
        vehicleType: 'HEAVY_LORRY',
        driverName: 'Sukhdev Singh',
        driverPhone: '+91 98231 44512',
        driverLicenseNumber: 'DL-MH-2015-883921',
        transporterAgency: 'VRL Logistics Heavy Freight Fleet',
        entryPurpose: 'RAW_MATERIAL_INWARD',
        ewayBillNumber: 'EWB-291049182740',
        taxInvoiceRef: 'INV-TATA-2026-901',
        deliveryChallanRef: 'DC-2026-8812',
        inwardTimestamp: new Date(now.getTime() - 90 * 60 * 1000).toISOString(),
        outwardTimestamp: null,
        grossWeightKg: 35420,
        tareWeightKg: 10200,
        netWeightKg: 25220,
        gateEntryStatus: 'UNLOADING_LOADING_AT_BAY',
        securityOfficerName: 'Subedar Rajendra Patil',
        sealNumberVerified: true,
        securityCheckNotes: 'Physical seal checked against tax invoice, weight verified at Weighbridge Pit 1.',
        companyId: cId,
        createdAt: new Date(now.getTime() - 90 * 60 * 1000).toISOString(),
      },
      {
        id: 'veh-02',
        gatePassNumber: 'GATE-VEH-2026-102',
        vehicleNumber: 'KA-01-AK-4412',
        vehicleType: 'CONTAINER_TRAILER',
        driverName: 'Manjunath Gowda',
        driverPhone: '+91 99002 11983',
        driverLicenseNumber: 'DL-KA-2018-091823',
        transporterAgency: 'Gati KWE Intercity',
        entryPurpose: 'FINISHED_GOODS_OUTWARD',
        ewayBillNumber: 'EWB-338192019482',
        taxInvoiceRef: 'TXI-PLANT-2026-114',
        deliveryChallanRef: 'DC-2026-8815',
        inwardTimestamp: new Date(now.getTime() - 180 * 60 * 1000).toISOString(),
        outwardTimestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
        grossWeightKg: 28150,
        tareWeightKg: 11300,
        netWeightKg: 16850,
        gateEntryStatus: 'EXIT_CLEARED',
        securityOfficerName: 'Havildar Sunil Shinde',
        sealNumberVerified: true,
        securityCheckNotes: 'Outward gate pass signed, customs container seal applied & stamped.',
        companyId: cId,
        createdAt: new Date(now.getTime() - 180 * 60 * 1000).toISOString(),
      },
      {
        id: 'veh-03',
        gatePassNumber: 'GATE-VEH-2026-103',
        vehicleNumber: 'GJ-06-TT-5120',
        vehicleType: 'TANKER',
        driverName: 'Bhanupratap Solanki',
        driverPhone: '+91 97241 88392',
        driverLicenseNumber: 'DL-GJ-2016-772190',
        transporterAgency: 'Gujarat Liquid Bulk Carriers',
        entryPurpose: 'RAW_MATERIAL_INWARD',
        ewayBillNumber: 'EWB-481920481729',
        taxInvoiceRef: 'INV-IOCL-2026-302',
        deliveryChallanRef: 'DC-2026-8819',
        inwardTimestamp: new Date(now.getTime() - 25 * 60 * 1000).toISOString(),
        outwardTimestamp: null,
        grossWeightKg: 32400,
        tareWeightKg: null,
        netWeightKg: null,
        gateEntryStatus: 'WEIGHBRIDGE_IN_PROGRESS',
        securityOfficerName: 'Subedar Rajendra Patil',
        sealNumberVerified: true,
        securityCheckNotes: 'Chemical tanker dip-rod calibration & earthing wire grounded before weighbridge gross reading.',
        companyId: cId,
        createdAt: new Date(now.getTime() - 25 * 60 * 1000).toISOString(),
      },
    ]);

    setVisitors([
      {
        id: 'vis-01',
        visitorPassNumber: 'VIS-PASS-2026-201',
        visitorName: 'Vikramaditya Rao',
        visitorPhone: '+91 98450 12839',
        visitorOrganization: 'Siemens Industrial Automation Ltd',
        idProofType: 'AADHAAR',
        idProofNumber: 'XXXX-XXXX-8921',
        hostPersonToMeet: 'Praveen Kulkarni',
        hostDepartment: 'MAINTENANCE',
        visitPurpose: 'MACHINE_SERVICING',
        departmentApprovalStatus: 'APPROVED_BY_MANAGER',
        approvingManagerName: 'Praveen Kulkarni (Chief Maintenance Eng.)',
        rfidCardBadgeNumber: 'RFID-VIS-042',
        safetyPpeHelmetIssued: true,
        safetyPpeVestIssued: true,
        safetyPpeShoesVerified: true,
        safetyBriefingAcknowledged: true,
        checkInTime: new Date(now.getTime() - 110 * 60 * 1000).toISOString(),
        checkOutTime: null,
        accessStatus: 'ACTIVE_IN_PLANT',
        securityNotes: 'PLC drive commissioning in Bay 3 electrical substation. Tool bag inspected.',
        companyId: cId,
        createdAt: new Date(now.getTime() - 110 * 60 * 1000).toISOString(),
      },
      {
        id: 'vis-02',
        visitorPassNumber: 'VIS-PASS-2026-202',
        visitorName: 'Ananya Deshmukh',
        visitorPhone: '+91 97654 32109',
        visitorOrganization: 'TUV Rheinland India (ISO 9001 Audit)',
        idProofType: 'DRIVING_LICENSE',
        idProofNumber: 'DL-MH-14-2019-3321',
        hostPersonToMeet: 'Dr. Alok Verma',
        hostDepartment: 'QUALITY',
        visitPurpose: 'AUDIT_INSPECTION',
        departmentApprovalStatus: 'APPROVED_BY_MANAGER',
        approvingManagerName: 'Dr. Alok Verma (VP QA/QC)',
        rfidCardBadgeNumber: 'RFID-VIS-015',
        safetyPpeHelmetIssued: true,
        safetyPpeVestIssued: true,
        safetyPpeShoesVerified: true,
        safetyBriefingAcknowledged: true,
        checkInTime: new Date(now.getTime() - 240 * 60 * 1000).toISOString(),
        checkOutTime: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
        accessStatus: 'CHECKED_OUT',
        securityNotes: 'Lead ISO auditor. RFID card returned, visitor gate pass surrendered at Main Gate.',
        companyId: cId,
        createdAt: new Date(now.getTime() - 240 * 60 * 1000).toISOString(),
      },
      {
        id: 'vis-03',
        visitorPassNumber: 'VIS-PASS-2026-203',
        visitorName: 'Kishore Jha',
        visitorPhone: '+91 91234 56780',
        visitorOrganization: 'Apex Engineering Candidates',
        idProofType: 'PAN_CARD',
        idProofNumber: 'ABCDE1234F',
        hostPersonToMeet: 'Meera Nambiar',
        hostDepartment: 'HR',
        visitPurpose: 'CANDIDATE_INTERVIEW',
        departmentApprovalStatus: 'PENDING',
        approvingManagerName: null,
        rfidCardBadgeNumber: null,
        safetyPpeHelmetIssued: false,
        safetyPpeVestIssued: false,
        safetyPpeShoesVerified: true,
        safetyBriefingAcknowledged: true,
        checkInTime: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
        checkOutTime: null,
        accessStatus: 'ACTIVE_IN_PLANT',
        securityNotes: 'Waiting at Security Reception lobby for HR interview escort pass.',
        companyId: cId,
        createdAt: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
      },
    ]);

    setInspections([
      {
        id: 'insp-01',
        inspectionRecordCode: 'MAT-INSP-2026-301',
        vehicleNumber: 'MH-12-RN-9921',
        gatePassRef: 'GATE-VEH-2026-101',
        challanInvoiceRef: 'DC-2026-8812',
        materialType: 'RAW_MATERIAL',
        containerInspectionStatus: 'SEAL_INTACT_VERIFIED',
        containerSealNumber: 'SEAL-TATA-99812',
        physicalVsChallanMatch: 'MATCHED_VERIFIED',
        contractLaborFriskingDone: true,
        metalDetectorCleared: true,
        unauthorizedMaterialFound: false,
        smugglingAlertFlag: false,
        discrepancyRemarks: 'Steel billets bundled with certified lot tags. Dimensions and physical counts match DC exactly.',
        inspectingOfficerName: 'Subedar Rajendra Patil',
        inspectionStatus: 'PASSED_CLEARED',
        companyId: cId,
        createdAt: new Date(now.getTime() - 80 * 60 * 1000).toISOString(),
      },
      {
        id: 'insp-02',
        inspectionRecordCode: 'MAT-INSP-2026-302',
        vehicleNumber: 'KA-01-AK-4412',
        gatePassRef: 'GATE-VEH-2026-102',
        challanInvoiceRef: 'DC-2026-8815',
        materialType: 'FINISHED_GOODS',
        containerInspectionStatus: 'SEAL_INTACT_VERIFIED',
        containerSealNumber: 'SEAL-CUST-44109',
        physicalVsChallanMatch: 'MATCHED_VERIFIED',
        contractLaborFriskingDone: true,
        metalDetectorCleared: true,
        unauthorizedMaterialFound: false,
        smugglingAlertFlag: false,
        discrepancyRemarks: 'Outward cartons palletized and heat-shrink wrapped. High-security tamper seal intact.',
        inspectingOfficerName: 'Havildar Sunil Shinde',
        inspectionStatus: 'PASSED_CLEARED',
        companyId: cId,
        createdAt: new Date(now.getTime() - 40 * 60 * 1000).toISOString(),
      },
      {
        id: 'insp-03',
        inspectionRecordCode: 'MAT-INSP-2026-303',
        vehicleNumber: 'MH-14-CP-8841',
        gatePassRef: 'GATE-VEH-2026-098',
        challanInvoiceRef: 'DC-2026-8799',
        materialType: 'SCRAP_METAL',
        containerInspectionStatus: 'OPEN_BODY_CHECKED',
        containerSealNumber: null,
        physicalVsChallanMatch: 'QUANTITY_SHORTAGE',
        contractLaborFriskingDone: true,
        metalDetectorCleared: true,
        unauthorizedMaterialFound: false,
        smugglingAlertFlag: false,
        discrepancyRemarks: 'Found 120 kg difference between vendor declaration vs actual weighbridge scrap tare.',
        inspectingOfficerName: 'Subedar Rajendra Patil',
        inspectionStatus: 'DETAINED_FOR_AUDIT',
        companyId: cId,
        createdAt: new Date(now.getTime() - 200 * 60 * 1000).toISOString(),
      },
    ]);

    setTraffic([
      {
        id: 'trf-01',
        trafficSlotCode: 'TRF-PRK-2026-401',
        vehicleCategory: 'HEAVY_TRUCK_LORRY',
        vehicleRegistrationNumber: 'MH-12-RN-9921',
        allocatedSlotOrBay: 'BAY-03-UNLOAD',
        driverOrOwnerName: 'Sukhdev Singh',
        driverContactPhone: '+91 98231 44512',
        entryTime: new Date(now.getTime() - 85 * 60 * 1000).toISOString(),
        exitTime: null,
        fireExitClearanceVerified: true,
        parkingViolationStatus: 'NO_VIOLATION',
        trafficGuardName: 'Guard Dnyaneshwar More',
        notes: 'Chocks positioned beneath rear dual wheels on Bay 3 loading dock ramp.',
        companyId: cId,
        createdAt: new Date(now.getTime() - 85 * 60 * 1000).toISOString(),
      },
      {
        id: 'trf-02',
        trafficSlotCode: 'TRF-PRK-2026-402',
        vehicleCategory: 'STAFF_FOUR_WHEELER',
        vehicleRegistrationNumber: 'MH-12-PQ-1200',
        allocatedSlotOrBay: 'STAFF-P1-24',
        driverOrOwnerName: 'Meera Nambiar (HR Head)',
        driverContactPhone: '+91 98220 99887',
        entryTime: new Date(now.getTime() - 300 * 60 * 1000).toISOString(),
        exitTime: null,
        fireExitClearanceVerified: true,
        parkingViolationStatus: 'NO_VIOLATION',
        trafficGuardName: 'Guard Anil Yadav',
        notes: 'Plant executive shaded parking slot.',
        companyId: cId,
        createdAt: new Date(now.getTime() - 300 * 60 * 1000).toISOString(),
      },
      {
        id: 'trf-03',
        trafficSlotCode: 'TRF-PRK-2026-403',
        vehicleCategory: 'VISITOR_VEHICLE',
        vehicleRegistrationNumber: 'KA-05-MH-7711',
        allocatedSlotOrBay: 'VISITOR-V05',
        driverOrOwnerName: 'Vikramaditya Rao (Siemens)',
        driverContactPhone: '+91 98450 12839',
        entryTime: new Date(now.getTime() - 105 * 60 * 1000).toISOString(),
        exitTime: null,
        fireExitClearanceVerified: true,
        parkingViolationStatus: 'NO_VIOLATION',
        trafficGuardName: 'Guard Anil Yadav',
        notes: 'Clear pass displayed on dashboard.',
        companyId: cId,
        createdAt: new Date(now.getTime() - 105 * 60 * 1000).toISOString(),
      },
      {
        id: 'trf-04',
        trafficSlotCode: 'TRF-PRK-2026-404',
        vehicleCategory: 'CONTAINER_TRAILER',
        vehicleRegistrationNumber: 'NL-01-L-3392',
        allocatedSlotOrBay: 'YARD-BUFFER-HOLD',
        driverOrOwnerName: 'Gurmukh Gurung',
        driverContactPhone: '+91 97120 44881',
        entryTime: new Date(now.getTime() - 150 * 60 * 1000).toISOString(),
        exitTime: null,
        fireExitClearanceVerified: false,
        parkingViolationStatus: 'OBSTRUCTING_FIRE_LANE',
        trafficGuardName: 'Guard Dnyaneshwar More',
        notes: 'Truck stopped near Gate 2 fire hydrant. Driver instructed to reposition immediately to Staging Yard T12.',
        companyId: cId,
        createdAt: new Date(now.getTime() - 150 * 60 * 1000).toISOString(),
      },
    ]);

    setEmergencies([
      {
        id: 'emg-01',
        incidentLogCode: 'EMG-GATE-2026-501',
        incidentType: 'SAFETY_MOCK_DRILL',
        gateOperationsMode: 'EMERGENCY_ALL_GATES_OPEN',
        emergencyAgencyNotified: 'INTERNAL_EHS_TEAM',
        emergencyContactPhone: '+91 20 2710 4400',
        cctvSurveillanceStatus: 'ALL_CAMERAS_OPERATIONAL',
        gateStationNumber: 'GATE-01-MAIN',
        incidentSeverity: 'LOW_MOCK_DRILL',
        incidentStartTime: new Date(now.getTime() - 360 * 60 * 1000).toISOString(),
        incidentResolvedTime: new Date(now.getTime() - 325 * 60 * 1000).toISOString(),
        resolutionSummary: 'Bi-annual fire evacuation drill successfully completed. All automated boom barriers dropped, 450 plant workers assembled at Assembly Point A in 4 mins 12 secs.',
        commandingOfficerName: 'Col. Arvind Saxena',
        notes: 'Mock drill conducted under supervision of EHS Safety Manager.',
        companyId: cId,
        createdAt: new Date(now.getTime() - 360 * 60 * 1000).toISOString(),
      },
      {
        id: 'emg-02',
        incidentLogCode: 'EMG-GATE-2026-502',
        incidentType: 'MEDICAL_AMBULANCE_CALL',
        gateOperationsMode: 'NORMAL_SECURITY_CHECK',
        emergencyAgencyNotified: 'AMBULANCE_DISPATCH_108',
        emergencyContactPhone: '108',
        cctvSurveillanceStatus: 'ALL_CAMERAS_OPERATIONAL',
        gateStationNumber: 'GATE-02-LOGISTICS',
        incidentSeverity: 'MEDIUM_CONTROLLED',
        incidentStartTime: new Date(now.getTime() - 600 * 60 * 1000).toISOString(),
        incidentResolvedTime: new Date(now.getTime() - 565 * 60 * 1000).toISOString(),
        resolutionSummary: 'Contract technician suffered heat dehydration in foundry section. Green corridor cleared at Gate 2, ambulance safely admitted and exited to Lifeline Hospital.',
        commandingOfficerName: 'Subedar Rajendra Patil',
        notes: 'Patient stable, medical expenses covered under ESI protocol.',
        companyId: cId,
        createdAt: new Date(now.getTime() - 600 * 60 * 1000).toISOString(),
      },
    ]);

    setPatrols([
      {
        id: 'pat-01',
        patrolLogCode: 'PAT-NGT-2026-601',
        patrolShift: 'NIGHT_SHIFT_FIRST_HALF',
        leadPatrolGuardName: 'Head Guard Somnath Kadam',
        accompanyingGuards: 'Guard Anil Yadav, Guard Ramesh Shinde',
        patrolCheckpointZone: 'PERIMETER_NORTH_FENCE',
        checkpointScanTime: new Date(now.getTime() - 420 * 60 * 1000).toISOString(),
        physicalLockSecure: true,
        lockConditionDetails: 'Barbed wire fence integrity intact, boundary wall motion sensors armed.',
        perimeterLightingStatus: 'ADEQUATE_FLOODLIGHTS',
        suspiciousActivityDetected: false,
        suspiciousDetails: null,
        escalatedToSecurityManager: false,
        securityManagerActionNotes: 'Regular hourly RFID scan at North Checkpoint #4.',
        companyId: cId,
        createdAt: new Date(now.getTime() - 420 * 60 * 1000).toISOString(),
      },
      {
        id: 'pat-02',
        patrolLogCode: 'PAT-NGT-2026-602',
        patrolShift: 'GRAVEYARD_PATROL_02AM',
        leadPatrolGuardName: 'Head Guard Somnath Kadam',
        accompanyingGuards: 'Guard Anil Yadav',
        patrolCheckpointZone: 'RAW_SCRAP_YARD',
        checkpointScanTime: new Date(now.getTime() - 280 * 60 * 1000).toISOString(),
        physicalLockSecure: true,
        lockConditionDetails: 'Heavy brass godrej padlocks inspected on copper scrap compound gate.',
        perimeterLightingStatus: 'FLOODLIGHT_FUSED_ALERT',
        suspiciousActivityDetected: true,
        suspiciousDetails: 'Flickering illumination noticed near transformer yard boundary. Patrol discovered a tree branch touching floodlight pole wiring.',
        escalatedToSecurityManager: true,
        securityManagerActionNotes: 'Electrical maintenance ticket #ELEC-881 raised for daylight tree trimming and ballast replacement.',
        companyId: cId,
        createdAt: new Date(now.getTime() - 280 * 60 * 1000).toISOString(),
      },
      {
        id: 'pat-03',
        patrolLogCode: 'PAT-NGT-2026-603',
        patrolShift: 'NIGHT_SHIFT_SECOND_HALF',
        leadPatrolGuardName: 'Head Guard Somnath Kadam',
        accompanyingGuards: 'Guard Ramesh Shinde',
        patrolCheckpointZone: 'FINISHED_GOODS_YARD',
        checkpointScanTime: new Date(now.getTime() - 150 * 60 * 1000).toISOString(),
        physicalLockSecure: true,
        lockConditionDetails: 'Warehouse roller shutters padlocked and laser perimeter curtains online.',
        perimeterLightingStatus: 'ADEQUATE_FLOODLIGHTS',
        suspiciousActivityDetected: false,
        suspiciousDetails: null,
        escalatedToSecurityManager: false,
        securityManagerActionNotes: 'Zone completely clear, all high-bay mercury lamps illuminated.',
        companyId: cId,
        createdAt: new Date(now.getTime() - 150 * 60 * 1000).toISOString(),
      },
    ]);
  };

  // KPIs
  const activeVehiclesCount = useMemo(
    () => vehicles.filter((v) => v.gateEntryStatus !== 'EXIT_CLEARED').length,
    [vehicles],
  );
  const activeVisitorsCount = useMemo(
    () => visitors.filter((v) => v.accessStatus === 'ACTIVE_IN_PLANT').length,
    [visitors],
  );
  const detainedInspectionsCount = useMemo(
    () => inspections.filter((i) => i.inspectionStatus === 'DETAINED_FOR_AUDIT' || i.smugglingAlertFlag).length,
    [inspections],
  );
  const parkingViolationsCount = useMemo(
    () => traffic.filter((t) => t.parkingViolationStatus === 'OBSTRUCTING_FIRE_LANE').length,
    [traffic],
  );

  // Status transitions
  const markVehicleExitCleared = (id: string) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              gateEntryStatus: 'EXIT_CLEARED',
              outwardTimestamp: new Date().toISOString(),
            }
          : v,
      ),
    );
  };

  const markVisitorCheckout = (id: string) => {
    setVisitors((prev) =>
      prev.map((vis) =>
        vis.id === id
          ? {
              ...vis,
              accessStatus: 'CHECKED_OUT',
              checkOutTime: new Date().toISOString(),
            }
          : vis,
      ),
    );
  };

  const updateInspectionStatus = (id: string, status: string) => {
    setInspections((prev) =>
      prev.map((ins) => (ins.id === id ? { ...ins, inspectionStatus: status } : ins)),
    );
  };

  const resolveParkingViolation = (id: string) => {
    setTraffic((prev) =>
      prev.map((trf) =>
        trf.id === id
          ? {
              ...trf,
              parkingViolationStatus: 'RESOLVED',
              fireExitClearanceVerified: true,
            }
          : trf,
      ),
    );
  };

  const resolveEmergency = (id: string) => {
    setEmergencies((prev) =>
      prev.map((emg) =>
        emg.id === id
          ? {
              ...emg,
              gateOperationsMode: 'NORMAL_SECURITY_CHECK',
              incidentResolvedTime: new Date().toISOString(),
              resolutionSummary: 'Incident cleared and verified by Security Incharge. All gate operations restored.',
            }
          : emg,
      ),
    );
  };

  // Create Handlers
  const handleCreateVehicle = (e: FormEvent) => {
    e.preventDefault();
    const gross = parseFloat(newVehicle.grossWeightKg) || 0;
    const tare = parseFloat(newVehicle.tareWeightKg) || 0;
    const net = gross && tare ? gross - tare : 0;

    const item: GateVehicleEntry = {
      id: `veh-${Date.now()}`,
      gatePassNumber: `GATE-VEH-2026-${Math.floor(100 + Math.random() * 900)}`,
      vehicleNumber: newVehicle.vehicleNumber.toUpperCase(),
      vehicleType: newVehicle.vehicleType,
      driverName: newVehicle.driverName,
      driverPhone: newVehicle.driverPhone || null,
      driverLicenseNumber: newVehicle.driverLicenseNumber || null,
      transporterAgency: newVehicle.transporterAgency || null,
      entryPurpose: newVehicle.entryPurpose,
      ewayBillNumber: newVehicle.ewayBillNumber || null,
      taxInvoiceRef: newVehicle.taxInvoiceRef || null,
      deliveryChallanRef: newVehicle.deliveryChallanRef || null,
      inwardTimestamp: new Date().toISOString(),
      outwardTimestamp: null,
      grossWeightKg: gross || null,
      tareWeightKg: tare || null,
      netWeightKg: net || null,
      gateEntryStatus: 'ENTRY_LOGGED',
      securityOfficerName: newVehicle.securityOfficerName,
      sealNumberVerified: newVehicle.sealNumberVerified,
      securityCheckNotes: newVehicle.securityCheckNotes || null,
      companyId: companyInfo.id,
      createdAt: new Date().toISOString(),
    };

    setVehicles([item, ...vehicles]);
    setModalOpen(null);
    setNewVehicle({
      vehicleNumber: '',
      vehicleType: 'HEAVY_LORRY',
      driverName: '',
      driverPhone: '',
      driverLicenseNumber: '',
      transporterAgency: '',
      entryPurpose: 'RAW_MATERIAL_INWARD',
      ewayBillNumber: '',
      taxInvoiceRef: '',
      deliveryChallanRef: '',
      grossWeightKg: '',
      tareWeightKg: '',
      securityOfficerName: 'Subedar Rajendra Patil',
      sealNumberVerified: true,
      securityCheckNotes: '',
    });
  };

  const handleCreateVisitor = (e: FormEvent) => {
    e.preventDefault();
    const item: GateVisitorAccess = {
      id: `vis-${Date.now()}`,
      visitorPassNumber: `VIS-PASS-2026-${Math.floor(200 + Math.random() * 800)}`,
      visitorName: newVisitor.visitorName,
      visitorPhone: newVisitor.visitorPhone,
      visitorOrganization: newVisitor.visitorOrganization,
      idProofType: newVisitor.idProofType,
      idProofNumber: newVisitor.idProofNumber,
      hostPersonToMeet: newVisitor.hostPersonToMeet,
      hostDepartment: newVisitor.hostDepartment,
      visitPurpose: newVisitor.visitPurpose,
      departmentApprovalStatus: 'APPROVED_BY_MANAGER',
      approvingManagerName: newVisitor.hostPersonToMeet,
      rfidCardBadgeNumber: newVisitor.rfidCardBadgeNumber || `RFID-${Math.floor(10 + Math.random() * 90)}`,
      safetyPpeHelmetIssued: newVisitor.safetyPpeHelmetIssued,
      safetyPpeVestIssued: newVisitor.safetyPpeVestIssued,
      safetyPpeShoesVerified: newVisitor.safetyPpeShoesVerified,
      safetyBriefingAcknowledged: newVisitor.safetyBriefingAcknowledged,
      checkInTime: new Date().toISOString(),
      checkOutTime: null,
      accessStatus: 'ACTIVE_IN_PLANT',
      securityNotes: newVisitor.securityNotes || null,
      companyId: companyInfo.id,
      createdAt: new Date().toISOString(),
    };

    setVisitors([item, ...visitors]);
    setModalOpen(null);
    setNewVisitor({
      visitorName: '',
      visitorPhone: '',
      visitorOrganization: '',
      idProofType: 'AADHAAR',
      idProofNumber: '',
      hostPersonToMeet: '',
      hostDepartment: 'PRODUCTION',
      visitPurpose: 'VENDOR_MEETING',
      rfidCardBadgeNumber: '',
      safetyPpeHelmetIssued: true,
      safetyPpeVestIssued: true,
      safetyPpeShoesVerified: true,
      safetyBriefingAcknowledged: true,
      securityNotes: '',
    });
  };

  const handleCreateInspection = (e: FormEvent) => {
    e.preventDefault();
    const item: GateMaterialInspection = {
      id: `insp-${Date.now()}`,
      inspectionRecordCode: `MAT-INSP-2026-${Math.floor(300 + Math.random() * 700)}`,
      vehicleNumber: newInspection.vehicleNumber.toUpperCase(),
      gatePassRef: newInspection.gatePassRef || null,
      challanInvoiceRef: newInspection.challanInvoiceRef || null,
      materialType: newInspection.materialType,
      containerInspectionStatus: newInspection.containerInspectionStatus,
      containerSealNumber: newInspection.containerSealNumber || null,
      physicalVsChallanMatch: newInspection.physicalVsChallanMatch,
      contractLaborFriskingDone: newInspection.contractLaborFriskingDone,
      metalDetectorCleared: newInspection.metalDetectorCleared,
      unauthorizedMaterialFound: newInspection.unauthorizedMaterialFound,
      smugglingAlertFlag: newInspection.smugglingAlertFlag,
      discrepancyRemarks: newInspection.discrepancyRemarks || null,
      inspectingOfficerName: newInspection.inspectingOfficerName,
      inspectionStatus: newInspection.smugglingAlertFlag ? 'DETAINED_FOR_AUDIT' : 'PASSED_CLEARED',
      companyId: companyInfo.id,
      createdAt: new Date().toISOString(),
    };

    setInspections([item, ...inspections]);
    setModalOpen(null);
    setNewInspection({
      vehicleNumber: '',
      gatePassRef: '',
      challanInvoiceRef: '',
      materialType: 'RAW_MATERIAL',
      containerInspectionStatus: 'SEAL_INTACT_VERIFIED',
      containerSealNumber: '',
      physicalVsChallanMatch: 'MATCHED_VERIFIED',
      contractLaborFriskingDone: true,
      metalDetectorCleared: true,
      unauthorizedMaterialFound: false,
      smugglingAlertFlag: false,
      discrepancyRemarks: '',
      inspectingOfficerName: 'Subedar Rajendra Patil',
    });
  };

  const handleCreateTraffic = (e: FormEvent) => {
    e.preventDefault();
    const item: GateTrafficParking = {
      id: `trf-${Date.now()}`,
      trafficSlotCode: `TRF-PRK-2026-${Math.floor(400 + Math.random() * 600)}`,
      vehicleCategory: newTraffic.vehicleCategory,
      vehicleRegistrationNumber: newTraffic.vehicleRegistrationNumber.toUpperCase(),
      allocatedSlotOrBay: newTraffic.allocatedSlotOrBay,
      driverOrOwnerName: newTraffic.driverOrOwnerName,
      driverContactPhone: newTraffic.driverContactPhone || null,
      entryTime: new Date().toISOString(),
      exitTime: null,
      fireExitClearanceVerified: newTraffic.fireExitClearanceVerified,
      parkingViolationStatus: newTraffic.fireExitClearanceVerified ? 'NO_VIOLATION' : 'OBSTRUCTING_FIRE_LANE',
      trafficGuardName: newTraffic.trafficGuardName,
      notes: newTraffic.notes || null,
      companyId: companyInfo.id,
      createdAt: new Date().toISOString(),
    };

    setTraffic([item, ...traffic]);
    setModalOpen(null);
    setNewTraffic({
      vehicleCategory: 'HEAVY_TRUCK_LORRY',
      vehicleRegistrationNumber: '',
      allocatedSlotOrBay: 'BAY-01-UNLOAD',
      driverOrOwnerName: '',
      driverContactPhone: '',
      fireExitClearanceVerified: true,
      trafficGuardName: 'Guard Dnyaneshwar More',
      notes: '',
    });
  };

  const handleCreateEmergency = (e: FormEvent) => {
    e.preventDefault();
    const item: GateEmergencyControl = {
      id: `emg-${Date.now()}`,
      incidentLogCode: `EMG-GATE-2026-${Math.floor(500 + Math.random() * 500)}`,
      incidentType: newEmergency.incidentType,
      gateOperationsMode: newEmergency.gateOperationsMode,
      emergencyAgencyNotified: newEmergency.emergencyAgencyNotified,
      emergencyContactPhone: newEmergency.emergencyContactPhone || null,
      cctvSurveillanceStatus: newEmergency.cctvSurveillanceStatus,
      gateStationNumber: newEmergency.gateStationNumber,
      incidentSeverity: newEmergency.incidentSeverity,
      incidentStartTime: new Date().toISOString(),
      incidentResolvedTime: null,
      resolutionSummary: null,
      commandingOfficerName: newEmergency.commandingOfficerName,
      notes: newEmergency.notes || null,
      companyId: companyInfo.id,
      createdAt: new Date().toISOString(),
    };

    setEmergencies([item, ...emergencies]);
    setModalOpen(null);
    setNewEmergency({
      incidentType: 'SAFETY_MOCK_DRILL',
      gateOperationsMode: 'EMERGENCY_ALL_GATES_OPEN',
      emergencyAgencyNotified: 'INTERNAL_EHS_TEAM',
      emergencyContactPhone: '+91 20 2710 4400',
      cctvSurveillanceStatus: 'ALL_CAMERAS_OPERATIONAL',
      gateStationNumber: 'GATE-01-MAIN',
      incidentSeverity: 'LOW_MOCK_DRILL',
      commandingOfficerName: 'Col. Arvind Saxena',
      notes: '',
    });
  };

  const handleCreatePatrol = (e: FormEvent) => {
    e.preventDefault();
    const item: GateNightPatrol = {
      id: `pat-${Date.now()}`,
      patrolLogCode: `PAT-NGT-2026-${Math.floor(600 + Math.random() * 400)}`,
      patrolShift: newPatrol.patrolShift,
      leadPatrolGuardName: newPatrol.leadPatrolGuardName,
      accompanyingGuards: newPatrol.accompanyingGuards || null,
      patrolCheckpointZone: newPatrol.patrolCheckpointZone,
      checkpointScanTime: new Date().toISOString(),
      physicalLockSecure: newPatrol.physicalLockSecure,
      lockConditionDetails: newPatrol.lockConditionDetails,
      perimeterLightingStatus: newPatrol.perimeterLightingStatus,
      suspiciousActivityDetected: newPatrol.suspiciousActivityDetected,
      suspiciousDetails: newPatrol.suspiciousDetails || null,
      escalatedToSecurityManager: newPatrol.escalatedToSecurityManager,
      securityManagerActionNotes: newPatrol.securityManagerActionNotes || null,
      companyId: companyInfo.id,
      createdAt: new Date().toISOString(),
    };

    setPatrols([item, ...patrols]);
    setModalOpen(null);
    setNewPatrol({
      patrolShift: 'NIGHT_SHIFT_FIRST_HALF',
      leadPatrolGuardName: 'Head Guard Somnath Kadam',
      accompanyingGuards: 'Guard Anil Yadav',
      patrolCheckpointZone: 'PERIMETER_NORTH_FENCE',
      physicalLockSecure: true,
      lockConditionDetails: 'Padlocks and sensors secure',
      perimeterLightingStatus: 'ADEQUATE_FLOODLIGHTS',
      suspiciousActivityDetected: false,
      suspiciousDetails: '',
      escalatedToSecurityManager: false,
      securityManagerActionNotes: '',
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Banner & Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto min-h-20 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <Link
              href="/dashboard"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm whitespace-nowrap shrink-0"
              title="Return to Main Dashboard"
            >
              <ArrowLeft className="w-5 h-5 shrink-0" />
            </Link>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="p-2 rounded-xl bg-red-600 text-white shadow-md shadow-red-500/20 shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2 flex-wrap whitespace-nowrap">
                    Gate Security &amp; Asset Protection
                    <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50 whitespace-nowrap shrink-0">
                      Company Isolated
                    </span>
                  </h1>
                  <p className="text-base text-slate-500 dark:text-slate-400 font-medium">
                    Plant Perimeter, Weighbridge Fast-Pass, Visitor RFID &amp; Emergency Gate Ops
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Header: Theme Toggle & Company Context */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center justify-end gap-1.5 whitespace-nowrap">
                <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>{companyInfo.companyName}</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                GSTIN: <span className="font-mono font-semibold">{companyInfo.gstNumber}</span> • {companyInfo.subCategory}
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm transition-all whitespace-nowrap shrink-0"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Company Isolation Alert & Verification Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500/10 via-amber-500/5 to-transparent border border-red-200 dark:border-red-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                Multi-Tenant Gate Security Enforced
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                All visitor passes, vehicle weighbridge fast-passes, frisking audits, and night patrols are strictly scoped to{' '}
                <span className="font-bold text-slate-900 dark:text-slate-100">{companyInfo.companyName}</span> ({companyInfo.id}). Cross-tenant leakage is strictly blocked.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              CCTV Surveillance 100%
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
              Fire Lanes Clear
            </span>
          </div>
        </div>

        {/* Global Key Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Vehicles in Plant</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{activeVehiclesCount}</h3>
              <p className="text-xs font-semibold text-emerald-600 mt-0.5">Weighbridge active</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400">
              <Truck className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Active Visitors</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{activeVisitorsCount}</h3>
              <p className="text-xs font-semibold text-blue-600 mt-0.5">RFID badge verified</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Detained Cargo</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{detainedInspectionsCount}</h3>
              <p className="text-xs font-semibold text-rose-600 mt-0.5">Discrepancy / Audit</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Parking Violations</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{parkingViolationsCount}</h3>
              <p className="text-xs font-semibold text-amber-600 mt-0.5">Emergency lane checks</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <AlertOctagon className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800">
          <nav className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-3">
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-base transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'vehicles'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Truck className="w-5 h-5 shrink-0" />
              <span>1. Vehicle Gate Entry &amp; Weighbridge</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-black/20 text-white shrink-0">
                {vehicles.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('visitors')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-base transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'visitors'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-5 h-5 shrink-0" />
              <span>2. Visitor &amp; Contractor RFID</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-black/20 text-white shrink-0">
                {visitors.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('inspections')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-base transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'inspections'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileCheck2 className="w-5 h-5 shrink-0" />
              <span>3. Physical Cargo Inspection</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-black/20 text-white shrink-0">
                {inspections.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('traffic')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-base transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'traffic'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Car className="w-5 h-5 shrink-0" />
              <span>4. Parking &amp; Traffic Bay</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-black/20 text-white shrink-0">
                {traffic.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('emergency')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-base transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'emergency'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Flame className="w-5 h-5 shrink-0" />
              <span>5. Fire &amp; Emergency Gate Ops</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-black/20 text-white shrink-0">
                {emergencies.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('patrol')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-base transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'patrol'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Lock className="w-5 h-5 shrink-0" />
              <span>6. Night Shift Patrol</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-black/20 text-white shrink-0">
                {patrols.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Tab 1: Vehicle Gate Entry & Weighbridge */}
        {activeTab === 'vehicles' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Inward &amp; Outward Vehicle Gate Entries
                </h2>
                <p className="text-base text-slate-500 dark:text-slate-400">
                  FASTag / ANPR vehicle gate passes, weighbridge tonnage, driver credentials &amp; e-Way bills.
                </p>
              </div>
              <button
                onClick={() => setModalOpen('vehicle')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Log Vehicle Inward Entry</span>
              </button>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-sm uppercase font-extrabold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-4">Gate Pass #</th>
                      <th className="px-5 py-4">Vehicle &amp; Transporter</th>
                      <th className="px-5 py-4">Driver &amp; License</th>
                      <th className="px-5 py-4">Purpose &amp; Documents</th>
                      <th className="px-5 py-4">Weighbridge (Kg)</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {vehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-red-600 dark:text-red-400">
                          {v.gatePassNumber}
                          <div className="text-xs text-slate-400 font-sans">
                            {new Date(v.inwardTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-slate-400" />
                            {v.vehicleNumber}
                          </div>
                          <div className="text-xs text-slate-500 font-medium">{v.vehicleType} • {v.transporterAgency}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{v.driverName}</div>
                          <div className="text-xs text-slate-500">{v.driverPhone} • {v.driverLicenseNumber}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-semibold text-sm px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {v.entryPurpose.replace(/_/g, ' ')}
                          </span>
                          <div className="text-xs text-slate-500 mt-1">
                            EWB: {v.ewayBillNumber || 'N/A'} • DC: {v.deliveryChallanRef || 'N/A'}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {v.netWeightKg ? (
                            <div>
                              <span className="font-black text-emerald-600">Net: {v.netWeightKg.toLocaleString()} kg</span>
                              <div className="text-xs text-slate-400">Gross: {v.grossWeightKg?.toLocaleString()} | Tare: {v.tareWeightKg?.toLocaleString()}</div>
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-md">
                              Weighbridge Pending
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              v.gateEntryStatus === 'EXIT_CLEARED'
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                : v.gateEntryStatus === 'UNLOADING_LOADING_AT_BAY'
                                ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            {v.gateEntryStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedVehicleForPrint(v)}
                            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                            title="Print Official Gate Pass"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          {v.gateEntryStatus !== 'EXIT_CLEARED' && (
                            <button
                              onClick={() => markVehicleExitCleared(v.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                            >
                              Authorize Exit
                            </button>
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

        {/* Tab 2: Visitor & Contractor Access Control */}
        {activeTab === 'visitors' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Visitor Management &amp; Contractor RFID Passes
                </h2>
                <p className="text-base text-slate-500 dark:text-slate-400">
                  Government photo ID verification, department host clearance, and mandatory safety PPE kit checks.
                </p>
              </div>
              <button
                onClick={() => setModalOpen('visitor')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Issue Visitor Pass</span>
              </button>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-sm uppercase font-extrabold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-4">Visitor Pass #</th>
                      <th className="px-5 py-4">Visitor &amp; Org</th>
                      <th className="px-5 py-4">Govt ID Proof</th>
                      <th className="px-5 py-4">Host &amp; Department</th>
                      <th className="px-5 py-4">PPE Compliance</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {visitors.map((vis) => (
                      <tr key={vis.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-red-600 dark:text-red-400">
                          {vis.visitorPassNumber}
                          <div className="text-xs text-slate-400 font-sans">
                            In: {new Date(vis.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-white">{vis.visitorName}</div>
                          <div className="text-xs text-slate-500">{vis.visitorOrganization} • {vis.visitorPhone}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-semibold text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                            {vis.idProofType}
                          </span>
                          <div className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-0.5">{vis.idProofNumber}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{vis.hostPersonToMeet}</div>
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-bold">{vis.hostDepartment} • {vis.visitPurpose.replace(/_/g, ' ')}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            {vis.safetyPpeHelmetIssued && (
                              <span title="Safety Helmet Issued" className="inline-flex">
                                <HardHat className="w-4 h-4 text-amber-500" />
                              </span>
                            )}
                            {vis.safetyPpeVestIssued && <span className="text-xs font-bold text-emerald-600">Vest OK</span>}
                            {vis.safetyPpeShoesVerified && <span className="text-xs font-bold text-emerald-600">• Shoes OK</span>}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">RFID: {vis.rfidCardBadgeNumber || 'Pending'}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              vis.accessStatus === 'ACTIVE_IN_PLANT'
                                ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {vis.accessStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {vis.accessStatus === 'ACTIVE_IN_PLANT' && (
                            <button
                              onClick={() => markVisitorCheckout(vis.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                            >
                              Check-Out Pass
                            </button>
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

        {/* Tab 3: Physical Cargo Inspection & Frisking */}
        {activeTab === 'inspections' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Physical Cargo Seal Inspection &amp; Labor Frisking
                </h2>
                <p className="text-base text-slate-500 dark:text-slate-400">
                  Container bolt seal integrity, challan vs physical SKU verification, metal detection &amp; pilferage control.
                </p>
              </div>
              <button
                onClick={() => setModalOpen('inspection')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>New Cargo Audit Log</span>
              </button>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-sm uppercase font-extrabold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-4">Audit Code</th>
                      <th className="px-5 py-4">Vehicle &amp; Cargo</th>
                      <th className="px-5 py-4">Container &amp; Seal</th>
                      <th className="px-5 py-4">Physical vs Challan</th>
                      <th className="px-5 py-4">Labor Frisking</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {inspections.map((ins) => (
                      <tr key={ins.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-red-600 dark:text-red-400">
                          {ins.inspectionRecordCode}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-white">{ins.vehicleNumber}</div>
                          <div className="text-xs text-slate-500">{ins.materialType.replace(/_/g, ' ')} • Ref: {ins.gatePassRef}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              ins.containerInspectionStatus === 'SEAL_INTACT_VERIFIED'
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                            }`}
                          >
                            {ins.containerInspectionStatus.replace(/_/g, ' ')}
                          </span>
                          {ins.containerSealNumber && (
                            <div className="text-xs font-mono text-slate-400 mt-1">Seal: {ins.containerSealNumber}</div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                            {ins.physicalVsChallanMatch.replace(/_/g, ' ')}
                          </div>
                          <div className="text-xs text-slate-500 truncate max-w-xs">{ins.discrepancyRemarks || 'No issues reported'}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Frisking &amp; DFMD Cleared</span>
                          </div>
                          <div className="text-xs text-slate-400">Officer: {ins.inspectingOfficerName}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              ins.inspectionStatus === 'PASSED_CLEARED'
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                            }`}
                          >
                            {ins.inspectionStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {ins.inspectionStatus === 'DETAINED_FOR_AUDIT' ? (
                            <button
                              onClick={() => updateInspectionStatus(ins.id, 'PASSED_CLEARED')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                            >
                              Release Cargo
                            </button>
                          ) : (
                            <button
                              onClick={() => updateInspectionStatus(ins.id, 'DETAINED_FOR_AUDIT')}
                              className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold"
                            >
                              Detain
                            </button>
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

        {/* Tab 4: Traffic & Parking Bay Management */}
        {activeTab === 'traffic' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Industrial Yard Traffic &amp; Fire Lane Parking Control
                </h2>
                <p className="text-base text-slate-500 dark:text-slate-400">
                  Unloading bay assignment, staff parking bays, and non-negotiable emergency fire exit lane clearance.
                </p>
              </div>
              <button
                onClick={() => setModalOpen('traffic')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Allocate Parking / Bay</span>
              </button>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-sm uppercase font-extrabold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-4">Slot Code</th>
                      <th className="px-5 py-4">Vehicle Category &amp; Reg</th>
                      <th className="px-5 py-4">Allocated Bay / Slot</th>
                      <th className="px-5 py-4">Driver / Owner</th>
                      <th className="px-5 py-4">Fire Lane Clearance</th>
                      <th className="px-5 py-4">Violation Status</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {traffic.map((trf) => (
                      <tr key={trf.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-red-600 dark:text-red-400">
                          {trf.trafficSlotCode}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-white">{trf.vehicleRegistrationNumber}</div>
                          <div className="text-xs text-slate-500">{trf.vehicleCategory.replace(/_/g, ' ')}</div>
                        </td>
                        <td className="px-5 py-4 font-black text-blue-600 dark:text-blue-400">
                          {trf.allocatedSlotOrBay}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{trf.driverOrOwnerName}</div>
                          <div className="text-xs text-slate-500">{trf.driverContactPhone || 'N/A'}</div>
                        </td>
                        <td className="px-5 py-4">
                          {trf.fireExitClearanceVerified ? (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                              <CheckCircle2 className="w-4 h-4" /> Fire Hydrant Clear
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
                              <AlertTriangle className="w-4 h-4" /> OBSTRUCTION DETECTED
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              trf.parkingViolationStatus === 'NO_VIOLATION' || trf.parkingViolationStatus === 'RESOLVED'
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                            }`}
                          >
                            {trf.parkingViolationStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {trf.parkingViolationStatus === 'OBSTRUCTING_FIRE_LANE' && (
                            <button
                              onClick={() => resolveParkingViolation(trf.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                            >
                              Reposition &amp; Clear
                            </button>
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

        {/* Tab 5: Safety, Fire & Emergency Gate Control */}
        {activeTab === 'emergency' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Plant Emergency, Fire Alarm &amp; Evacuation Clearance
                </h2>
                <p className="text-base text-slate-500 dark:text-slate-400">
                  Instant boom-barrier override, SOS dialer integration (Fire 101 / Police 100 / Ambulance 108), &amp; CCTV gateway health.
                </p>
              </div>
              <button
                onClick={() => setModalOpen('emergency')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Flame className="w-5 h-5" />
                <span>Trigger Gate Alarm / Drill</span>
              </button>
            </div>

            {/* Quick Contacts Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40">
              <div className="flex items-center gap-3">
                <PhoneCall className="w-5 h-5 text-red-600" />
                <div>
                  <div className="text-xs font-bold text-slate-500">Fire Brigade SOS</div>
                  <div className="text-base font-black text-red-600">Dial: 101</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <PhoneCall className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-xs font-bold text-slate-500">Police Control</div>
                  <div className="text-base font-black text-blue-600">Dial: 100</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <PhoneCall className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-xs font-bold text-slate-500">Ambulance Rapid</div>
                  <div className="text-base font-black text-emerald-600">Dial: 108</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <div>
                  <div className="text-xs font-bold text-slate-500">Plant EHS Hospital</div>
                  <div className="text-base font-black text-indigo-600">Ext: 4400</div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-sm uppercase font-extrabold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-4">Incident Code</th>
                      <th className="px-5 py-4">Type &amp; Severity</th>
                      <th className="px-5 py-4">Gate Station &amp; Mode</th>
                      <th className="px-5 py-4">Agencies Dispatched</th>
                      <th className="px-5 py-4">CCTV Surveillance</th>
                      <th className="px-5 py-4">Resolution Summary</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {emergencies.map((emg) => (
                      <tr key={emg.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-red-600 dark:text-red-400">
                          {emg.incidentLogCode}
                          <div className="text-xs text-slate-400 font-sans">
                            {new Date(emg.incidentStartTime).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-white">{emg.incidentType.replace(/_/g, ' ')}</div>
                          <span className="text-xs font-bold text-amber-600">{emg.incidentSeverity}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{emg.gateStationNumber}</div>
                          <span className="text-xs font-mono font-bold text-red-600 bg-red-100 dark:bg-red-950/60 px-2 py-0.5 rounded">
                            {emg.gateOperationsMode.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-medium text-sm">
                          {emg.emergencyAgencyNotified.replace(/_/g, ' ')}
                          <div className="text-xs text-slate-400">{emg.emergencyContactPhone}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <Camera className="w-3.5 h-3.5" />
                            {emg.cctvSurveillanceStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300 max-w-xs">
                          {emg.resolutionSummary || 'Active incident in progress'}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {!emg.incidentResolvedTime && (
                            <button
                              onClick={() => resolveEmergency(emg.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                            >
                              Resolve &amp; Reset Barrier
                            </button>
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

        {/* Tab 6: Night Shift Patrol & Asset Protection */}
        {activeTab === 'patrol' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Night Shift Patrol &amp; Restricted Storage Yard Security
                </h2>
                <p className="text-base text-slate-500 dark:text-slate-400">
                  Perimeter boundary scans, scrap yard godrej locks inspection, floodlight bulb audits &amp; suspicious incident alerts.
                </p>
              </div>
              <button
                onClick={() => setModalOpen('patrol')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Log Night Patrol Checkpoint</span>
              </button>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-sm uppercase font-extrabold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-4">Patrol Code</th>
                      <th className="px-5 py-4">Shift &amp; Guards</th>
                      <th className="px-5 py-4">Checkpoint Zone</th>
                      <th className="px-5 py-4">Padlocks Integrity</th>
                      <th className="px-5 py-4">Perimeter Floodlights</th>
                      <th className="px-5 py-4">Suspicious Alert</th>
                      <th className="px-5 py-4 text-right">Escalation Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {patrols.map((pat) => (
                      <tr key={pat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-red-600 dark:text-red-400">
                          {pat.patrolLogCode}
                          <div className="text-xs text-slate-400 font-sans">
                            {new Date(pat.checkpointScanTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-white">{pat.leadPatrolGuardName}</div>
                          <div className="text-xs text-slate-500">{pat.patrolShift.replace(/_/g, ' ')}</div>
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-800 dark:text-slate-200">
                          {pat.patrolCheckpointZone.replace(/_/g, ' ')}
                        </td>
                        <td className="px-5 py-4">
                          {pat.physicalLockSecure ? (
                            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                              <Lock className="w-3.5 h-3.5" /> Padlocks Sealed
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs font-bold text-rose-600">
                              <Unlock className="w-3.5 h-3.5" /> LOCK BREACH
                            </span>
                          )}
                          <div className="text-xs text-slate-400">{pat.lockConditionDetails}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded ${
                              pat.perimeterLightingStatus === 'ADEQUATE_FLOODLIGHTS'
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            {pat.perimeterLightingStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {pat.suspiciousActivityDetected ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-700 border border-rose-300">
                              ALERT FLAGGED
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                              Perimeter Clear
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right text-xs text-slate-500 max-w-xs truncate">
                          {pat.securityManagerActionNotes || 'Normal patrol cycle completed'}
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
      {/* CREATION MODALS */}
      {/* ========================================================================= */}

      {/* Modal 1: Vehicle Entry */}
      {modalOpen === 'vehicle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-red-600" />
                New Vehicle Inward Gate Pass Entry
              </h3>
              <button
                onClick={() => setModalOpen(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} className="mt-4 space-y-4 text-base">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Vehicle Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MH-12-RN-9921"
                    value={newVehicle.vehicleNumber}
                    onChange={(e) => setNewVehicle({ ...newVehicle, vehicleNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Vehicle Type *</label>
                  <select
                    value={newVehicle.vehicleType}
                    onChange={(e) => setNewVehicle({ ...newVehicle, vehicleType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="HEAVY_LORRY">Heavy Lorry (Multi-Axle)</option>
                    <option value="CONTAINER_TRAILER">Container Trailer</option>
                    <option value="TANKER">Liquid Bulk Tanker</option>
                    <option value="LCV_MINI_TRUCK">LCV Mini Truck</option>
                    <option value="VISITOR_CAR">Visitor / Executive Car</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Driver Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Driver Full Name"
                    value={newVehicle.driverName}
                    onChange={(e) => setNewVehicle({ ...newVehicle, driverName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Driver Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98XXX XXXXX"
                    value={newVehicle.driverPhone}
                    onChange={(e) => setNewVehicle({ ...newVehicle, driverPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Entry Purpose *</label>
                  <select
                    value={newVehicle.entryPurpose}
                    onChange={(e) => setNewVehicle({ ...newVehicle, entryPurpose: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  >
                    <option value="RAW_MATERIAL_INWARD">Raw Material Inward</option>
                    <option value="FINISHED_GOODS_OUTWARD">Finished Goods Outward</option>
                    <option value="SPARES_CONSUMABLES">Spares &amp; Consumables</option>
                    <option value="SCRAP_OUTWARD">Scrap Outward</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">e-Way Bill Ref</label>
                  <input
                    type="text"
                    placeholder="EWB-XXXXXXXX"
                    value={newVehicle.ewayBillNumber}
                    onChange={(e) => setNewVehicle({ ...newVehicle, ewayBillNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Delivery Challan</label>
                  <input
                    type="text"
                    placeholder="DC-2026-XXXX"
                    value={newVehicle.deliveryChallanRef}
                    onChange={(e) => setNewVehicle({ ...newVehicle, deliveryChallanRef: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Weighbridge Gross Weight (Kg)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 35420"
                    value={newVehicle.grossWeightKg}
                    onChange={(e) => setNewVehicle({ ...newVehicle, grossWeightKg: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Weighbridge Tare Weight (Kg)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 10200"
                    value={newVehicle.tareWeightKg}
                    onChange={(e) => setNewVehicle({ ...newVehicle, tareWeightKg: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-500/20"
                >
                  Create Vehicle Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Visitor Pass */}
      {modalOpen === 'visitor' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-red-600" />
                Issue Temporary Visitor / Contractor RFID Pass
              </h3>
              <button
                onClick={() => setModalOpen(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVisitor} className="mt-4 space-y-4 text-base">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Visitor Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya Rao"
                    value={newVisitor.visitorName}
                    onChange={(e) => setNewVisitor({ ...newVisitor, visitorName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98XXX XXXXX"
                    value={newVisitor.visitorPhone}
                    onChange={(e) => setNewVisitor({ ...newVisitor, visitorPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Siemens Automation"
                    value={newVisitor.visitorOrganization}
                    onChange={(e) => setNewVisitor({ ...newVisitor, visitorOrganization: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Govt ID Proof Type *</label>
                  <select
                    value={newVisitor.idProofType}
                    onChange={(e) => setNewVisitor({ ...newVisitor, idProofType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="AADHAAR">Aadhaar Card</option>
                    <option value="DRIVING_LICENSE">Driving License</option>
                    <option value="PAN_CARD">PAN Card</option>
                    <option value="PASSPORT">Passport</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">ID Proof Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. XXXX-XXXX-8921"
                    value={newVisitor.idProofNumber}
                    onChange={(e) => setNewVisitor({ ...newVisitor, idProofNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Host Person to Meet *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Praveen Kulkarni"
                    value={newVisitor.hostPersonToMeet}
                    onChange={(e) => setNewVisitor({ ...newVisitor, hostPersonToMeet: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Host Department *</label>
                  <select
                    value={newVisitor.hostDepartment}
                    onChange={(e) => setNewVisitor({ ...newVisitor, hostDepartment: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  >
                    <option value="PRODUCTION">Production</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="QUALITY">Quality</option>
                    <option value="HR">HR &amp; Admin</option>
                    <option value="EXECUTIVE">Executive / MD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Purpose *</label>
                  <select
                    value={newVisitor.visitPurpose}
                    onChange={(e) => setNewVisitor({ ...newVisitor, visitPurpose: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  >
                    <option value="MACHINE_SERVICING">Machine Servicing</option>
                    <option value="AUDIT_INSPECTION">Audit / Inspection</option>
                    <option value="VENDOR_MEETING">Vendor Meeting</option>
                    <option value="CANDIDATE_INTERVIEW">Candidate Interview</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">RFID Badge #</label>
                  <input
                    type="text"
                    placeholder="e.g. RFID-VIS-042"
                    value={newVisitor.rfidCardBadgeNumber}
                    onChange={(e) => setNewVisitor({ ...newVisitor, rfidCardBadgeNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-500/20"
                >
                  Issue Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Material Inspection */}
      {modalOpen === 'inspection' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-red-600" />
                New Cargo Seal &amp; Frisking Audit Record
              </h3>
              <button
                onClick={() => setModalOpen(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInspection} className="mt-4 space-y-4 text-base">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Vehicle Registration # *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MH-12-RN-9921"
                    value={newInspection.vehicleNumber}
                    onChange={(e) => setNewInspection({ ...newInspection, vehicleNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Material Type *</label>
                  <select
                    value={newInspection.materialType}
                    onChange={(e) => setNewInspection({ ...newInspection, materialType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="RAW_MATERIAL">Raw Material (Billets / Chemicals / Ingot)</option>
                    <option value="FINISHED_GOODS">Finished Goods (Palletized)</option>
                    <option value="SPARE_PARTS">Spare Parts &amp; Tooling</option>
                    <option value="SCRAP_METAL">Scrap Metal Inward/Outward</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Container Seal Status *</label>
                  <select
                    value={newInspection.containerInspectionStatus}
                    onChange={(e) => setNewInspection({ ...newInspection, containerInspectionStatus: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="SEAL_INTACT_VERIFIED">Seal Intact Verified</option>
                    <option value="SEAL_BROKEN_ALERT">SEAL BROKEN (Alert)</option>
                    <option value="OPEN_BODY_CHECKED">Open Body Physical Inspection</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Container Seal #</label>
                  <input
                    type="text"
                    placeholder="SEAL-XXXXX"
                    value={newInspection.containerSealNumber}
                    onChange={(e) => setNewInspection({ ...newInspection, containerSealNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Physical vs Challan Match *</label>
                  <select
                    value={newInspection.physicalVsChallanMatch}
                    onChange={(e) => setNewInspection({ ...newInspection, physicalVsChallanMatch: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="MATCHED_VERIFIED">Matched &amp; Verified</option>
                    <option value="QUANTITY_SHORTAGE">Quantity Shortage</option>
                    <option value="EXCESS_UNAUTHORIZED_CARGO">Excess / Unauthorized Cargo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Inspecting Officer *</label>
                  <input
                    type="text"
                    required
                    value={newInspection.inspectingOfficerName}
                    onChange={(e) => setNewInspection({ ...newInspection, inspectingOfficerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="smugglingAlert"
                  checked={newInspection.smugglingAlertFlag}
                  onChange={(e) => setNewInspection({ ...newInspection, smugglingAlertFlag: e.target.checked })}
                  className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="smugglingAlert" className="text-sm font-bold text-rose-600">
                  Raise Smuggling / Pilferage Alert (Detains cargo immediately)
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-500/20"
                >
                  Submit Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Traffic Parking */}
      {modalOpen === 'traffic' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-red-600" />
                Allocate Bay / Parking Slot
              </h3>
              <button
                onClick={() => setModalOpen(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTraffic} className="mt-4 space-y-4 text-base">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Vehicle Registration # *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MH-12-RN-9921"
                  value={newTraffic.vehicleRegistrationNumber}
                  onChange={(e) => setNewTraffic({ ...newTraffic, vehicleRegistrationNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Vehicle Category *</label>
                  <select
                    value={newTraffic.vehicleCategory}
                    onChange={(e) => setNewTraffic({ ...newTraffic, vehicleCategory: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="HEAVY_TRUCK_LORRY">Heavy Truck Lorry</option>
                    <option value="CONTAINER_TRAILER">Container Trailer</option>
                    <option value="STAFF_FOUR_WHEELER">Staff 4-Wheeler</option>
                    <option value="TWO_WHEELER">Two Wheeler</option>
                    <option value="VISITOR_VEHICLE">Visitor Vehicle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Allocated Bay / Slot *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BAY-03-UNLOAD"
                    value={newTraffic.allocatedSlotOrBay}
                    onChange={(e) => setNewTraffic({ ...newTraffic, allocatedSlotOrBay: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Driver / Owner Name *</label>
                <input
                  type="text"
                  required
                  value={newTraffic.driverOrOwnerName}
                  onChange={(e) => setNewTraffic({ ...newTraffic, driverOrOwnerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="fireClear"
                  checked={newTraffic.fireExitClearanceVerified}
                  onChange={(e) => setNewTraffic({ ...newTraffic, fireExitClearanceVerified: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="fireClear" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Fire Exit Lane Verified Clear (No hydrant obstruction)
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-500/20"
                >
                  Assign Bay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Emergency Alert */}
      {modalOpen === 'emergency' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-red-300 dark:border-red-900/60 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-black text-red-600 flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-600" />
                Trigger Emergency Gate Operation / Fire Drill
              </h3>
              <button
                onClick={() => setModalOpen(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmergency} className="mt-4 space-y-4 text-base">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Incident Type *</label>
                <select
                  value={newEmergency.incidentType}
                  onChange={(e) => setNewEmergency({ ...newEmergency, incidentType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="SAFETY_MOCK_DRILL">Safety Mock Evacuation Drill</option>
                  <option value="FIRE_ALARM_EVACUATION">FIRE ALARM - EVACUATION</option>
                  <option value="CHEMICAL_LEAK_HAZMAT">Chemical Leak / HazMat Alert</option>
                  <option value="MEDICAL_AMBULANCE_CALL">Medical Emergency / Ambulance Dispatch</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Gate Operation Mode *</label>
                <select
                  value={newEmergency.gateOperationsMode}
                  onChange={(e) => setNewEmergency({ ...newEmergency, gateOperationsMode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-red-600"
                >
                  <option value="EMERGENCY_ALL_GATES_OPEN">EMERGENCY ALL GATES OPEN (Drop Barriers)</option>
                  <option value="RESTRICTED_LOCKDOWN">RESTRICTED LOCKDOWN</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Emergency Agency Notified *</label>
                <select
                  value={newEmergency.emergencyAgencyNotified}
                  onChange={(e) => setNewEmergency({ ...newEmergency, emergencyAgencyNotified: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="INTERNAL_EHS_TEAM">Internal EHS Safety Squad</option>
                  <option value="FIRE_BRIGADE_101">Fire Brigade (Dial 101)</option>
                  <option value="AMBULANCE_DISPATCH_108">Ambulance Rapid Service (108)</option>
                  <option value="POLICE_CONTROL_100">Police Control Room (100)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-500/20"
                >
                  Confirm Emergency Mode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 6: Night Patrol */}
      {modalOpen === 'patrol' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-600" />
                Log Night Shift Perimeter Patrol Checkpoint
              </h3>
              <button
                onClick={() => setModalOpen(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePatrol} className="mt-4 space-y-4 text-base">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Patrol Shift *</label>
                <select
                  value={newPatrol.patrolShift}
                  onChange={(e) => setNewPatrol({ ...newPatrol, patrolShift: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="NIGHT_SHIFT_FIRST_HALF">Night Shift 1st Half (20:00 - 00:00)</option>
                  <option value="GRAVEYARD_PATROL_02AM">Graveyard Patrol (00:00 - 04:00)</option>
                  <option value="NIGHT_SHIFT_SECOND_HALF">Night Shift 2nd Half (04:00 - 08:00)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Checkpoint Zone *</label>
                <select
                  value={newPatrol.patrolCheckpointZone}
                  onChange={(e) => setNewPatrol({ ...newPatrol, patrolCheckpointZone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                >
                  <option value="PERIMETER_NORTH_FENCE">Perimeter North Fence &amp; Boundary Wall</option>
                  <option value="FINISHED_GOODS_YARD">Finished Goods Yard &amp; Warehouse Shutters</option>
                  <option value="RAW_SCRAP_YARD">Raw Scrap Yard &amp; Non-Ferrous Lockers</option>
                  <option value="HAZMAT_STORAGE">HazMat &amp; Chemical Storage Bunker</option>
                  <option value="SUBSTATION_TRANSFORMER">Electrical Transformer Substation</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Lead Patrol Guard *</label>
                  <input
                    type="text"
                    required
                    value={newPatrol.leadPatrolGuardName}
                    onChange={(e) => setNewPatrol({ ...newPatrol, leadPatrolGuardName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Perimeter Lighting Status *</label>
                  <select
                    value={newPatrol.perimeterLightingStatus}
                    onChange={(e) => setNewPatrol({ ...newPatrol, perimeterLightingStatus: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="ADEQUATE_FLOODLIGHTS">Adequate Floodlights</option>
                    <option value="FLOODLIGHT_FUSED_ALERT">Floodlight Bulb Fused (Alert)</option>
                    <option value="PARTIAL_DARKNESS">Partial Darkness Reported</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-500/20"
                >
                  Save Patrol Scan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRINTABLE GATE PASS MODAL */}
      {/* ========================================================================= */}
      {selectedVehicleForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Printer className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Official Industrial Vehicle Gate Pass &amp; Security Clearance
                </h3>
              </div>
              <button
                onClick={() => setSelectedVehicleForPrint(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Body */}
            <div className="mt-6 p-6 border-2 border-slate-800 dark:border-slate-200 rounded-2xl bg-white text-slate-900 space-y-6">
              {/* Header Letterhead */}
              <div className="text-center border-b-2 border-slate-800 pb-4">
                <h2 className="text-2xl font-black uppercase tracking-wider">{companyInfo.companyName}</h2>
                <p className="text-sm font-semibold text-slate-600">
                  Manufacturing Facility Gate Pass &amp; Weighbridge FastPass Slip
                </p>
                <div className="text-xs text-slate-500 mt-1">
                  GSTIN: {companyInfo.gstNumber} • Plant Gate #1 &bull; Tenant ID: {companyInfo.id}
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-bold text-slate-500">GATE PASS NUMBER:</span>
                  <div className="font-mono font-black text-lg text-red-600">{selectedVehicleForPrint.gatePassNumber}</div>
                </div>
                <div>
                  <span className="font-bold text-slate-500">DATE &amp; INWARD TIME:</span>
                  <div className="font-semibold">{new Date(selectedVehicleForPrint.inwardTimestamp).toLocaleString()}</div>
                </div>
                <div>
                  <span className="font-bold text-slate-500">VEHICLE NUMBER:</span>
                  <div className="font-mono font-black text-lg">{selectedVehicleForPrint.vehicleNumber}</div>
                </div>
                <div>
                  <span className="font-bold text-slate-500">TRANSPORTER / FLEET:</span>
                  <div className="font-semibold">{selectedVehicleForPrint.transporterAgency || 'Dedicated Fleet'}</div>
                </div>
                <div>
                  <span className="font-bold text-slate-500">DRIVER NAME:</span>
                  <div className="font-semibold">{selectedVehicleForPrint.driverName} ({selectedVehicleForPrint.driverPhone})</div>
                </div>
                <div>
                  <span className="font-bold text-slate-500">LICENSE NUMBER:</span>
                  <div className="font-mono font-semibold">{selectedVehicleForPrint.driverLicenseNumber || 'Verified on Gate'}</div>
                </div>
              </div>

              {/* Weighbridge Details Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-300">
                <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                  Integrated Weighbridge Measurements
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xs text-slate-400">Gross Weight</div>
                    <div className="font-mono font-black text-base">
                      {selectedVehicleForPrint.grossWeightKg ? `${selectedVehicleForPrint.grossWeightKg.toLocaleString()} kg` : 'Pending'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Tare Weight</div>
                    <div className="font-mono font-black text-base">
                      {selectedVehicleForPrint.tareWeightKg ? `${selectedVehicleForPrint.tareWeightKg.toLocaleString()} kg` : 'Pending'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Net Weight</div>
                    <div className="font-mono font-black text-base text-emerald-600">
                      {selectedVehicleForPrint.netWeightKg ? `${selectedVehicleForPrint.netWeightKg.toLocaleString()} kg` : 'Pending'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-8 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-xs">
                <div>
                  <div className="h-12 border-b border-dashed border-slate-400 flex items-end justify-center pb-1 text-slate-400">
                    [Digitally Signed via ERP Auth]
                  </div>
                  <div className="font-bold mt-1">Gate Security Officer</div>
                  <div className="text-slate-500">{selectedVehicleForPrint.securityOfficerName}</div>
                </div>
                <div>
                  <div className="h-12 border-b border-dashed border-slate-400 flex items-end justify-center pb-1 text-slate-400">
                    [FastPass QR Stamp]
                  </div>
                  <div className="font-bold mt-1">Weighbridge Pit Incharge</div>
                  <div className="text-slate-500">FastTag FAST-PASS-OK</div>
                </div>
                <div>
                  <div className="h-12 border-b border-dashed border-slate-400 flex items-end justify-center pb-1 text-slate-400">
                    [Carrier Driver Signature]
                  </div>
                  <div className="font-bold mt-1">Transporter Driver</div>
                  <div className="text-slate-500">{selectedVehicleForPrint.driverName}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedVehicleForPrint(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 shadow-md"
              >
                <Printer className="w-5 h-5" />
                <span>Print Official Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
