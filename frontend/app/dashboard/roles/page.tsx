'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import {
  Scale,
  FlaskConical,
  RefreshCw,
  Flame,
  CheckCircle2,
  AlertCircle,
  Truck,
  FileText,
  FileCheck2,
  HardHat,
  ShieldCheck,
  Building2,
  ArrowLeft,
  Sun,
  Moon,
  Plus,
  Loader2,
  Printer,
  X,
  AlertTriangle,
  BadgeCheck,
  Clock,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Layers,
  Thermometer,
  Wrench,
  Sparkles,
  Recycle,
  Gauge,
  Activity,
  Zap,
  Palette,
  Paintbrush,
  Droplet,
  Box,
} from 'lucide-react';

// =========================================================================
// STEEL DATA INTERFACES
// =========================================================================

interface WeighbridgeSlip {
  id: string;
  slipNumber: string;
  truckNumber: string;
  driverName: string;
  supplierOrBuyer: string;
  materialName: string;
  poNumber: string;
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
  unit: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  approvalNotes?: string;
}

interface HeatTest {
  id: string;
  heatNumber: string;
  grade: string;
  batchNumber?: string;
  carbon: number;
  manganese: number;
  silicon: number;
  sulphur: number;
  phosphorus: number;
  chromium: number;
  yieldStrength: number;
  tensileStrength: number;
  elongation: number;
  testPassed: boolean;
  mtcNumber: string;
  approvalStatus: string;
  createdAt: string;
}

interface JobworkChallan {
  id: string;
  challanNumber: string;
  vendorName: string;
  processType: string;
  materialSent: string;
  sentWeight: number;
  receivedWeight?: number | null;
  scrapReturnedWeight?: number | null;
  weightLossGain?: number | null;
  lossGainPercentage?: number | null;
  status: 'ISSUED' | 'IN_PROCESS' | 'RECONCILED' | 'DISPUTED';
  createdAt: string;
  reconciliationNotes?: string;
}

interface EhsRecord {
  id: string;
  recordNumber: string;
  incidentType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  plantLocation: string;
  description: string;
  hotWorkPermitRequired: boolean;
  hotWorkPermitApproved: boolean;
  permitValidUntil?: string | null;
  complianceStatus: string;
  createdAt: string;
}

// =========================================================================
// GLASS & CERAMIC DATA INTERFACES
// =========================================================================

interface BatchFormula {
  id: string;
  formulaCode: string;
  batchName: string;
  glassType: string;
  silicaSandWeight: number;
  sodaAshWeight: number;
  limestoneWeight: number;
  feldsparWeight?: number;
  dolomiteWeight?: number;
  culletWeight: number;
  totalBatchWeight: number;
  culletRatioPercent: number;
  siloHopperLevels: {
    siloSilica: number;
    siloSodaAsh: number;
    siloLimestone: number;
    siloCullet: number;
  };
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  createdAt: string;
}

interface KilnFurnaceLog {
  id: string;
  furnaceId: string;
  meltingZoneTemp: number;
  refiningZoneTemp: number;
  annealingLehrTemp: number;
  gasConsumptionCubicMtr: number;
  fuelPerTonGlass: number;
  burnerMaintenanceDue: boolean;
  crownPressureMmWg: number;
  thermalShockDeltaT: number;
  operatorNotes?: string;
  createdAt: string;
}

interface MouldToolingRecord {
  id: string;
  mouldCode: string;
  mouldType: string;
  materialType: string;
  cavityCount: number;
  currentShotCount: number;
  maxShotLife: number;
  remainingLifePercent: number;
  lastPolishedAt: string;
  nextMaintenanceDue: string;
  status: 'ACTIVE' | 'REFURBISHMENT_DUE' | 'SCRAPPED';
  allocatedLine: string;
  notes?: string;
}

interface ThermalQualityInspection {
  id: string;
  lotNumber: string;
  productType: string;
  inspectedSampleCount: number;
  defectBubblesSeeds: number;
  defectPinholesStones: number;
  defectWarpingMm: number;
  thermalShockTestPassed: boolean;
  thermalShockDeltaT: number;
  impactStrengthJoules: number;
  lotStatus: 'APPROVED' | 'HOLD' | 'REJECTED';
  inspectorNotes?: string;
  createdAt: string;
}

interface CulletRecoveryRecord {
  id: string;
  recordNumber: string;
  shiftDate: string;
  productionLine: string;
  hotEndRejectionWeight: number;
  coldEndRejectionWeight: number;
  totalRejectionWeight: number;
  recoveredCulletWeight: number;
  recoveryPercentage: number;
  massBalanceLossPercent: number;
  reconciliationNotes?: string;
  createdAt: string;
}

// =========================================================================
// CHEMICAL & PROCESS DATA INTERFACES
// =========================================================================

interface ChemicalFormulaMaster {
  id: string;
  formulaCode: string;
  productName: string;
  version: string;
  stoichiometryEquation: string;
  theoreticalYieldKg: number;
  expectedCycleTimeHours: number;
  reactionType: string;
  hazardClassification: string;
  activeStatus: 'APPROVED' | 'DRAFT' | 'UNDER_REVIEW' | 'ARCHIVED';
  rawMaterialsComposition: string;
  safetyDataSheetUrl?: string;
  authorizationNotes?: string;
  createdAt: string;
}

interface ChemicalHazmatRecord {
  id: string;
  manifestNumber: string;
  wasteType: string;
  unClassification: string;
  wasteCategoryCpcb: string;
  quantityLtrOrKg: number;
  unit: string;
  disposalMethod: string;
  handlingPermitNumber: string;
  permitExpiryDate?: string;
  ppeComplianceStatus: 'COMPLIANT' | 'WARNING' | 'FLAGGED_VIOLATION';
  ppeAuditScore: number;
  statutoryRegulatoryBody: string;
  safetyAuditDate: string;
  auditNotes?: string;
}

interface AnalyticalLabTest {
  id: string;
  testId: string;
  batchNumber: string;
  productName: string;
  sampleSource: string;
  purityPercent: number;
  phLevel: number;
  moistureWaterPercent: number;
  densityGml?: number;
  testPassed: boolean;
  dispatchCleared: boolean;
  coaDocumentNumber?: string | null;
  coaGeneratedAt?: string | null;
  blockingReason?: string | null;
  chemistNotes?: string;
  createdAt: string;
}

interface ReactorBatchCycle {
  id: string;
  batchCode: string;
  reactorId: string;
  productName: string;
  currentStage: 'CHARGING' | 'REACTION' | 'REFLUX' | 'DISTILLATION' | 'COOLING' | 'DISCHARGING' | 'COMPLETED';
  targetYieldKg: number;
  actualYieldKg: number;
  yieldPercentage: number;
  steamConsumptionKg: number;
  coolingWaterM3: number;
  powerConsumptionKwh: number;
  cycleStartTime: string;
  cycleEndTime?: string | null;
  downtimeHours: number;
  downtimeReason?: string | null;
  stageRemarks?: string;
}

interface DangerousGoodsLogistics {
  id: string;
  dispatchTrackingNumber: string;
  batchNumber: string;
  productName: string;
  unNumber: string;
  properShippingName: string;
  hazardClass: string;
  packingGroup: string;
  hazchemCode: string;
  tremcardIssued: boolean;
  tremcardDocumentNumber?: string | null;
  vehicleRegistrationNumber: string;
  driverName: string;
  driverLicenseNumber: string;
  driverHazmatEndorsementValid: boolean;
  statutoryTransitPermitNumber?: string;
  routeClearanceStatus: 'APPROVED' | 'PENDING_AUDIT' | 'EXPIRED_LICENSE_HOLD';
  dispatchNotes?: string;
}

// =========================================================================
// PAINT & COATINGS DATA INTERFACES
// =========================================================================

interface PaintShadeMasterRecord {
  id: string;
  shadeCode: string;
  shadeName: string;
  colorFamily: string;
  baseTypeRequired: string;
  spectroL: number;
  spectroA: number;
  spectroB: number;
  targetDeltaETolerance: number;
  customTintingFormulaJson: string;
  formulaApproved: boolean;
  approvedBy: string;
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'OBSOLETE';
  createdAt: string;
}

interface PaintDispersionBatchRecord {
  id: string;
  batchCode: string;
  millId: string;
  productName: string;
  resinType: string;
  pigmentType: string;
  targetViscosityKu: number;
  currentViscosityKu: number;
  loadingSequenceCompleted: boolean;
  grindingDurationMinutes: number;
  beadMillRunHours: number;
  coolingWaterTempCelsius: number;
  dispersionStatus: 'PRE_MIXING' | 'MILLING' | 'VISCOSITY_CHECK' | 'COMPLETED';
  operatorNotes?: string;
  createdAt: string;
}

interface PaintRheologyTestRecord {
  id: string;
  testId: string;
  batchNumber: string;
  productName: string;
  krebsViscosityKu: number;
  densityGml: number;
  hegmanFinenessMicrons: number;
  touchDryMinutes: number;
  hardDryMinutes: number;
  glossLevel60Deg?: number;
  packagingCleared: boolean;
  coaDocumentNumber?: string | null;
  coaGeneratedAt?: string | null;
  rejectionReason?: string | null;
  qaChemistNotes?: string;
  createdAt: string;
}

interface PaintBaseStockTintingRecord {
  id: string;
  dispenseTrackingNumber: string;
  baseTankId: string;
  baseType: string;
  dispenserMachineId: string;
  targetVolumeLtr: number;
  colorantWhiteMl: number;
  colorantBlackMl: number;
  colorantYellowOxideMl: number;
  colorantRedOxideMl: number;
  colorantPhthaloBlueMl: number;
  colorantPhthaloGreenMl: number;
  reconciliationStatus: 'RECONCILED' | 'DISCREPANCY_FLAGGED' | 'PENDING_AUDIT';
  variancePercentage: number;
  operatorNotes?: string;
  createdAt: string;
}

interface PaintPackagingComplianceRecord {
  id: string;
  packLotNumber: string;
  batchNumber: string;
  productName: string;
  containerSize: string;
  containerType: string;
  quantityContainers: number;
  mfgDate: string;
  expDate: string;
  shelfLifeMonths: number;
  batchCodePrinted: string;
  vocContentGramsPerLiter: number;
  antiStaticBondingVerified: boolean;
  flammableSolventPermitValid: boolean;
  warehouseLocationBay: string;
  complianceSignOff: 'COMPLIANT' | 'NON_COMPLIANT_HOLD';
  createdAt: string;
}

export default function SpecializedOperationsHubPage() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Sub-Category Sector Switcher
  const [activeSector, setActiveSector] = useState<'STEEL' | 'GLASS' | 'CHEMICAL' | 'PAINT'>('PAINT');

  // Paint Active Tab
  const [paintTab, setPaintTab] = useState<'color_shade' | 'dispersion_mill' | 'rheology_qc' | 'base_tinting' | 'packaging_voc'>('color_shade');

  // Chemical Active Tab
  const [chemicalTab, setChemicalTab] = useState<'rd_formula' | 'ehs_hazmat' | 'qa_lab' | 'reactor_batch' | 'dangerous_goods'>('rd_formula');

  // Steel Active Tab
  const [steelTab, setSteelTab] = useState<'weighbridge' | 'metallurgy' | 'jobwork' | 'ehs'>('weighbridge');

  // Glass Active Tab
  const [glassTab, setGlassTab] = useState<'batch_house' | 'kiln_furnace' | 'mould_tooling' | 'thermal_quality' | 'cullet_recovery'>('batch_house');

  // =========================================================================
  // STEEL STATES
  // =========================================================================
  const [slips, setSlips] = useState<WeighbridgeSlip[]>([
    {
      id: 'wb-1',
      slipNumber: 'WB-2026-1042',
      truckNumber: 'MH-12-QZ-4590',
      driverName: 'Sanjay Yadav',
      supplierOrBuyer: 'Tata Metaliks Sourcing Ltd',
      materialName: 'Pig Iron / Heavy Melting Scrap Grade 1',
      poNumber: 'PO-STL-2026-089',
      grossWeight: 42.85,
      tareWeight: 14.2,
      netWeight: 28.65,
      unit: 'MT',
      approvalStatus: 'APPROVED',
      createdAt: 'Today, 10:30 AM',
      approvalNotes: 'Gross/Tare verified on electronic pitless scale. Tolerance variance 0.12% OK.',
    },
    {
      id: 'wb-2',
      slipNumber: 'WB-2026-1043',
      truckNumber: 'GJ-06-XX-8812',
      driverName: 'Ramesh Patel',
      supplierOrBuyer: 'Essar Steels Gujarat',
      materialName: 'Continuous Cast Billets 150x150mm Grade Fe500D',
      poNumber: 'PO-STL-2026-092',
      grossWeight: 54.1,
      tareWeight: 16.3,
      netWeight: 37.8,
      unit: 'MT',
      approvalStatus: 'PENDING',
      createdAt: 'Today, 01:15 PM',
    },
  ]);

  const [heatTests, setHeatTests] = useState<HeatTest[]>([
    {
      id: 'ht-1',
      heatNumber: 'HEAT-ST-7842',
      grade: 'Fe500D (IS 1786:2008)',
      batchNumber: 'BOM-2026-041',
      carbon: 0.21,
      manganese: 0.78,
      silicon: 0.25,
      sulphur: 0.032,
      phosphorus: 0.035,
      chromium: 0.12,
      yieldStrength: 535,
      tensileStrength: 625,
      elongation: 19.2,
      testPassed: true,
      mtcNumber: 'MTC-2026-HEAT7842-891',
      approvalStatus: 'APPROVED',
      createdAt: 'Today, 09:45 AM',
    },
  ]);

  const [jobworkChallans, setJobworkChallans] = useState<JobworkChallan[]>([
    {
      id: 'jw-1',
      challanNumber: 'JW-CH-2026-081',
      vendorName: 'Apex Heat Treaters & Galvanizers',
      processType: 'Hot Dip Galvanizing (80 Micron Coating)',
      materialSent: 'MS Structural Channels 100x50mm',
      sentWeight: 18.5,
      receivedWeight: 19.2,
      scrapReturnedWeight: 0.15,
      weightLossGain: 0.7,
      lossGainPercentage: 3.78,
      status: 'RECONCILED',
      createdAt: 'Yesterday, 04:15 PM',
      reconciliationNotes: 'Zinc pickup +0.70 MT matches 85-micron heavy galvanizing specification.',
    },
  ]);

  const [ehsRecords, setEhsRecords] = useState<EhsRecord[]>([
    {
      id: 'ehs-1',
      recordNumber: 'EHS-2026-0041',
      incidentType: 'HOT_WORK_PERMIT',
      severity: 'HIGH',
      plantLocation: 'Blast Furnace Induction Bay No. 2',
      description: 'Oxygen lance gas cutting of slag runner and ladle lip build-up.',
      hotWorkPermitRequired: true,
      hotWorkPermitApproved: true,
      permitValidUntil: 'Shift 1 (Valid until 06:00 PM)',
      complianceStatus: 'COMPLIANT',
      createdAt: 'Today, 07:45 AM',
    },
  ]);

  // =========================================================================
  // GLASS & CERAMIC STATES
  // =========================================================================
  const [batchFormulas, setBatchFormulas] = useState<BatchFormula[]>([
    {
      id: 'bf-1',
      formulaCode: 'FORM-FLT-2026-01',
      batchName: 'Clear Soda-Lime Float Glass 4mm',
      glassType: 'Float Glass',
      silicaSandWeight: 1000.0,
      sodaAshWeight: 320.0,
      limestoneWeight: 220.0,
      feldsparWeight: 60.0,
      dolomiteWeight: 180.0,
      culletWeight: 600.0,
      totalBatchWeight: 2380.0,
      culletRatioPercent: 25.21,
      siloHopperLevels: { siloSilica: 88, siloSodaAsh: 74, siloLimestone: 92, siloCullet: 65 },
      status: 'ACTIVE',
      createdAt: 'Today, 08:00 AM',
    },
    {
      id: 'bf-2',
      formulaCode: 'FORM-CNT-2026-05',
      batchName: 'Amber Container Bottle Glass 650ml',
      glassType: 'Container Glass',
      silicaSandWeight: 800.0,
      sodaAshWeight: 260.0,
      limestoneWeight: 180.0,
      feldsparWeight: 40.0,
      dolomiteWeight: 120.0,
      culletWeight: 850.0,
      totalBatchWeight: 2250.0,
      culletRatioPercent: 37.78,
      siloHopperLevels: { siloSilica: 76, siloSodaAsh: 82, siloLimestone: 89, siloCullet: 78 },
      status: 'ACTIVE',
      createdAt: 'Yesterday, 02:30 PM',
    },
    {
      id: 'bf-3',
      formulaCode: 'FORM-CRM-2026-12',
      batchName: 'Vitrified Ceramic Porcelain Floor Tile',
      glassType: 'Ceramic Porcelain',
      silicaSandWeight: 650.0,
      sodaAshWeight: 150.0,
      limestoneWeight: 120.0,
      feldsparWeight: 450.0,
      dolomiteWeight: 80.0,
      culletWeight: 350.0,
      totalBatchWeight: 1800.0,
      culletRatioPercent: 19.44,
      siloHopperLevels: { siloSilica: 95, siloSodaAsh: 88, siloLimestone: 91, siloCullet: 70 },
      status: 'ACTIVE',
      createdAt: 'Nov 11, 2026',
    },
  ]);

  const [kilnLogs, setKilnLogs] = useState<KilnFurnaceLog[]>([
    {
      id: 'kfl-1',
      furnaceId: 'MELTER-LINE-01',
      meltingZoneTemp: 1585.0,
      refiningZoneTemp: 1425.0,
      annealingLehrTemp: 560.0,
      gasConsumptionCubicMtr: 3450.0,
      fuelPerTonGlass: 28.75,
      burnerMaintenanceDue: false,
      crownPressureMmWg: 1.85,
      thermalShockDeltaT: 45.0,
      operatorNotes: 'Regenerative burner firing profile stable. Oxygen lambda sensor at 1.05.',
      createdAt: 'Today, 09:30 AM',
    },
    {
      id: 'kfl-2',
      furnaceId: 'KILN-TUNNEL-02',
      meltingZoneTemp: 1220.0,
      refiningZoneTemp: 1100.0,
      annealingLehrTemp: 420.0,
      gasConsumptionCubicMtr: 1820.0,
      fuelPerTonGlass: 22.4,
      burnerMaintenanceDue: true,
      crownPressureMmWg: 2.3,
      thermalShockDeltaT: 38.0,
      operatorNotes: 'Burner #4 flame flicker observed. Scheduled nozzle cleaning on next shift pause.',
      createdAt: 'Today, 07:15 AM',
    },
  ]);

  const [mouldRecords, setMouldRecords] = useState<MouldToolingRecord[]>([
    {
      id: 'mld-1',
      mouldCode: 'MLD-BTL-750-A',
      mouldType: 'Blow Mould (750ml Wine Bottle)',
      materialType: 'Bronze Alloy / Cast Iron',
      cavityCount: 6,
      currentShotCount: 142500,
      maxShotLife: 250000,
      remainingLifePercent: 43.0,
      lastPolishedAt: '2026-11-01',
      nextMaintenanceDue: '2026-11-20',
      status: 'ACTIVE',
      allocatedLine: 'IS Machine Line 2',
      notes: 'Dry graphite lubricant applied. Cavity dimensions within ±0.03mm tolerance.',
    },
    {
      id: 'mld-2',
      mouldCode: 'MLD-FLT-RLLR-04',
      mouldType: 'Float Lehr Annealing Roller',
      materialType: 'Heat Resistant High-Nickel Alloy',
      cavityCount: 1,
      currentShotCount: 215000,
      maxShotLife: 220000,
      remainingLifePercent: 2.3,
      lastPolishedAt: '2026-10-20',
      nextMaintenanceDue: '2026-11-14',
      status: 'REFURBISHMENT_DUE',
      allocatedLine: 'Float Line 1',
      notes: 'Surface micro-scratches detected on roller shoulder. Refurbishment required immediately.',
    },
    {
      id: 'mld-3',
      mouldCode: 'DIE-TILE-600X600',
      mouldType: 'Ceramic Press Die (600x600mm Tile)',
      materialType: 'Tungsten Carbide Hardened Steel',
      cavityCount: 4,
      currentShotCount: 48000,
      maxShotLife: 150000,
      remainingLifePercent: 68.0,
      lastPolishedAt: '2026-11-05',
      nextMaintenanceDue: '2026-11-28',
      status: 'ACTIVE',
      allocatedLine: 'Sacmi Hydraulic Press 1',
      notes: 'Mirror polish finish on decorative tile relief punch.',
    },
  ]);

  const [thermalInspections, setThermalInspections] = useState<ThermalQualityInspection[]>([
    {
      id: 'tqi-1',
      lotNumber: 'LOT-GLAS-2026-089',
      productType: 'Architectural Float Glass 4mm',
      inspectedSampleCount: 150,
      defectBubblesSeeds: 1,
      defectPinholesStones: 0,
      defectWarpingMm: 0.12,
      thermalShockTestPassed: true,
      thermalShockDeltaT: 50.0,
      impactStrengthJoules: 14.2,
      lotStatus: 'APPROVED',
      inspectorNotes: 'High optical clarity. 50°C thermal quench passed with zero cracking. Certified for architectural facades.',
      createdAt: 'Today, 08:45 AM',
    },
    {
      id: 'tqi-2',
      lotNumber: 'LOT-GLAS-2026-090',
      productType: 'Beer Bottle 650ml Amber',
      inspectedSampleCount: 200,
      defectBubblesSeeds: 12,
      defectPinholesStones: 4,
      defectWarpingMm: 0.72,
      thermalShockTestPassed: false,
      thermalShockDeltaT: 45.0,
      impactStrengthJoules: 8.5,
      lotStatus: 'REJECTED',
      inspectorNotes: 'Exceeded bubble tolerance limit and failed 45°C quench test (2 bottles shattered). Lot diverted to cullet recovery.',
      createdAt: 'Today, 10:15 AM',
    },
  ]);

  const [culletRecords, setCulletRecords] = useState<CulletRecoveryRecord[]>([
    {
      id: 'cul-1',
      recordNumber: 'REC-CUL-2026-042',
      shiftDate: 'Today, Shift 1',
      productionLine: 'Float Glass Line 1',
      hotEndRejectionWeight: 14.5,
      coldEndRejectionWeight: 9.2,
      totalRejectionWeight: 23.7,
      recoveredCulletWeight: 22.8,
      recoveryPercentage: 96.2,
      massBalanceLossPercent: 3.8,
      reconciliationNotes: 'Cold end optical rejection cullet crushed and blended. 0.9 MT volatile loss during furnace batching.',
      createdAt: 'Today, 06:30 AM',
    },
    {
      id: 'cul-2',
      recordNumber: 'REC-CUL-2026-043',
      shiftDate: 'Yesterday, Shift 2',
      productionLine: 'Container Bottle Line 2',
      hotEndRejectionWeight: 8.2,
      coldEndRejectionWeight: 4.8,
      totalRejectionWeight: 13.0,
      recoveredCulletWeight: 12.5,
      recoveryPercentage: 96.15,
      massBalanceLossPercent: 3.85,
      reconciliationNotes: 'High cullet recovery efficiency. Return to Amber Batch Silo 3 completed.',
      createdAt: 'Yesterday, 06:45 PM',
    },
  ]);

  // =========================================================================
  // CHEMICAL STATES & SEED DATA
  // =========================================================================
  const [chemFormulas, setChemFormulas] = useState<ChemicalFormulaMaster[]>([
    {
      id: 'cfm-1',
      formulaCode: 'FORM-CHEM-2026-001',
      productName: 'Ethyl Acetate Industrial Grade (99.5% Pure)',
      version: 'v2.4',
      stoichiometryEquation: 'CH3COOH + C2H5OH <==[H2SO4]==> CH3COOC2H5 + H2O',
      theoreticalYieldKg: 1466.7,
      expectedCycleTimeHours: 6.5,
      reactionType: 'Esterification (Continuous Distillation)',
      hazardClassification: 'CLASS_3_FLAMMABLE',
      activeStatus: 'APPROVED',
      rawMaterialsComposition: JSON.stringify([
        { reactant: 'Glacial Acetic Acid (99.8%)', cas: '64-19-7', qtyKg: 1000, molarRatio: '1.0 mol' },
        { reactant: 'Ethanol Absolute (99.9%)', cas: '64-17-5', qtyKg: 780, molarRatio: '1.02 mol' },
        { catalyst: 'Sulfuric Acid Conc. (98%)', cas: '7664-93-9', qtyKg: 25, molarRatio: '0.015 mol' },
      ]),
      safetyDataSheetUrl: 'https://mfg-erp.internal/sds/chem-ea-2026.pdf',
      authorizationNotes: 'Validated stoichiometric equilibrium: 94.2% practical isolated recovery.',
      createdAt: '3 days ago',
    },
    {
      id: 'cfm-2',
      formulaCode: 'FORM-CHEM-2026-002',
      productName: 'Epoxy Resins Novolac Precursor Oligomer',
      version: 'v1.1',
      stoichiometryEquation: 'Novolac Phenol Resin + Epichlorohydrin -> EPN Oligomer + NaCl',
      theoreticalYieldKg: 2800.0,
      expectedCycleTimeHours: 12.0,
      reactionType: 'Exothermic Addition & Etherification',
      hazardClassification: 'CLASS_8_CORROSIVE_TOXIC',
      activeStatus: 'APPROVED',
      rawMaterialsComposition: JSON.stringify([
        { reactant: 'Phenolic Novolac Base', cas: '9003-35-4', qtyKg: 1200, molarRatio: '1.0 mol' },
        { reactant: 'Epichlorohydrin Excess', cas: '106-89-8', qtyKg: 2200, molarRatio: '3.5 mol' },
        { base: 'Sodium Hydroxide (50% Aq)', cas: '1310-73-2', qtyKg: 500, molarRatio: '1.05 mol' },
      ]),
      safetyDataSheetUrl: 'https://mfg-erp.internal/sds/epn-novolac-2026.pdf',
      authorizationNotes: 'Requires closed loop chiller jacket control to prevent exothermic runaway.',
      createdAt: 'Yesterday',
    },
  ]);

  const [hazmatRecords, setHazmatRecords] = useState<ChemicalHazmatRecord[]>([
    {
      id: 'haz-1',
      manifestNumber: 'HAZ-MAN-2026-118',
      wasteType: 'Spent Mixed Solvent (Toluene, Acetone, Hexane mixture)',
      unClassification: 'UN 1993 (Flammable Liquid, N.O.S.)',
      wasteCategoryCpcb: 'Category 20.2 (Spent Solvents & Organic Sludge)',
      quantityLtrOrKg: 4200,
      unit: 'ltr',
      disposalMethod: 'Authorized TSDF High-Temperature Incineration',
      handlingPermitNumber: 'PCB-HAZ-AUTH-2026-9021',
      permitExpiryDate: '2027-05-10',
      ppeComplianceStatus: 'COMPLIANT',
      ppeAuditScore: 98.5,
      statutoryRegulatoryBody: 'CPCB / SPCB Hazardous Waste Cell',
      safetyAuditDate: '2 days ago',
      auditNotes: 'TSDF manifest Form 10 signed; hazardous transport GPS vehicle tracking attached.',
    },
    {
      id: 'haz-2',
      manifestNumber: 'HAZ-MAN-2026-119',
      wasteType: 'Distillation Bottom Pitch Residue & Spent Filter Clay',
      unClassification: 'UN 3082 (Environmentally Hazardous Substance)',
      wasteCategoryCpcb: 'Category 28.1 (Process Residues & Wastes)',
      quantityLtrOrKg: 1850,
      unit: 'kg',
      disposalMethod: 'Secured Engineered Landfill (SLF) at Authorized TSDF',
      handlingPermitNumber: 'PCB-HAZ-AUTH-2026-9021',
      permitExpiryDate: '2027-05-10',
      ppeComplianceStatus: 'COMPLIANT',
      ppeAuditScore: 95.0,
      statutoryRegulatoryBody: 'SPCB Hazardous Waste Cell',
      safetyAuditDate: '4 days ago',
      auditNotes: 'Double-bagged sealed HDPE drums with statutory Hazchem warning placards.',
    },
  ]);

  const [labTests, setLabTests] = useState<AnalyticalLabTest[]>([
    {
      id: 'lab-1',
      testId: 'LAB-QA-2026-554',
      batchNumber: 'BATCH-CHEM-2026-081',
      productName: 'Ethyl Acetate Industrial Grade',
      sampleSource: 'Final Bulk Storage Tank TK-401',
      purityPercent: 99.6,
      phLevel: 7.1,
      moistureWaterPercent: 0.04,
      densityGml: 0.902,
      testPassed: true,
      dispatchCleared: true,
      coaDocumentNumber: 'COA-CHEM-2026-9921',
      coaGeneratedAt: 'Yesterday, 04:30 PM',
      blockingReason: null,
      chemistNotes: 'Gas Chromatography (GC) assay 99.62% area. Moisture below 0.05% KF. Certified for dispatch.',
      createdAt: 'Yesterday',
    },
    {
      id: 'lab-2',
      testId: 'LAB-QA-2026-555',
      batchNumber: 'BATCH-CHEM-2026-082',
      productName: 'Ethyl Acetate Premium Solvent Cut',
      sampleSource: 'Reactor Distillate Receiver DR-102',
      purityPercent: 96.8,
      phLevel: 5.4,
      moistureWaterPercent: 0.72,
      densityGml: 0.915,
      testPassed: false,
      dispatchCleared: false,
      coaDocumentNumber: null,
      coaGeneratedAt: null,
      blockingReason: 'CRITICAL GATE: Dispatch Blocked! Purity 96.8% < 98.0% minimum, pH 5.4 outside 6.0-8.5 acceptable window, Moisture 0.72% exceeds 0.50% max threshold.',
      chemistNotes: 'Re-distillation required. Excessive water carry-over from condenser reflux split. Physical gate pass withheld.',
      createdAt: 'Today, 09:15 AM',
    },
  ]);

  const [reactorCycles, setReactorCycles] = useState<ReactorBatchCycle[]>([
    {
      id: 'rbc-1',
      batchCode: 'BAT-R4-2026-092',
      reactorId: 'GLR-101 (Glass Lined Reactor 5000L)',
      productName: 'Ethyl Acetate Industrial Grade',
      currentStage: 'DISTILLATION',
      targetYieldKg: 1450.0,
      actualYieldKg: 1385.0,
      yieldPercentage: 95.52,
      steamConsumptionKg: 820.0,
      coolingWaterM3: 45.0,
      powerConsumptionKwh: 165.0,
      cycleStartTime: 'Today, 05:00 AM',
      cycleEndTime: null,
      downtimeHours: 0.0,
      downtimeReason: null,
      stageRemarks: 'Azeotropic distillation in progress at 77.1°C vapor temperature; reflux ratio set to 3:1.',
    },
    {
      id: 'rbc-2',
      batchCode: 'BAT-SS2-2026-044',
      reactorId: 'SS-202 (Stainless Steel 316L Reactor 8000L)',
      productName: 'Epoxy Resins Novolac Precursor',
      currentStage: 'REACTION',
      targetYieldKg: 2800.0,
      actualYieldKg: 0.0,
      yieldPercentage: 0.0,
      steamConsumptionKg: 350.0,
      coolingWaterM3: 62.0,
      powerConsumptionKwh: 240.0,
      cycleStartTime: 'Today, 07:30 AM',
      cycleEndTime: null,
      downtimeHours: 0.75,
      downtimeReason: 'Secondary condenser chilled brine pump trip (auto-switched to backup pump B).',
      stageRemarks: 'Exothermic addition controlled at 65°C under continuous cooling jacket circulation.',
    },
  ]);

  const [dangerousGoods, setDangerousGoods] = useState<DangerousGoodsLogistics[]>([
    {
      id: 'dgl-1',
      dispatchTrackingNumber: 'DGL-2026-339',
      batchNumber: 'BATCH-CHEM-2026-081',
      productName: 'Ethyl Acetate Industrial Grade',
      unNumber: 'UN 1173',
      properShippingName: 'ETHYL ACETATE (Flammable Liquid, Class 3, PG II)',
      hazardClass: 'Class 3 (Flammable Liquid)',
      packingGroup: 'PG II (Medium Danger)',
      hazchemCode: '3YE',
      tremcardIssued: true,
      tremcardDocumentNumber: 'TREM-2026-8812',
      vehicleRegistrationNumber: 'GJ-06-AX-4412 (ADR Road Tanker)',
      driverName: 'Vikramjit Singh',
      driverLicenseNumber: 'DL-GJ-HAZ-2021-9941',
      driverHazmatEndorsementValid: true,
      statutoryTransitPermitNumber: 'PESO-WR-TANKER-2026-4410',
      routeClearanceStatus: 'APPROVED',
      dispatchNotes: 'Spark arrestor fitted, Tremcard handed to driver, emergency isolation valves sealed.',
    },
    {
      id: 'dgl-2',
      dispatchTrackingNumber: 'DGL-2026-340',
      batchNumber: 'BATCH-CHEM-2026-079',
      productName: 'Spent Solvent Stripped Wash Residue',
      unNumber: 'UN 1993',
      properShippingName: 'FLAMMABLE LIQUID, N.O.S. (Spent Solvent Mixture)',
      hazardClass: 'Class 3 (Flammable Liquid)',
      packingGroup: 'PG II',
      hazchemCode: '3YE',
      tremcardIssued: true,
      tremcardDocumentNumber: 'TREM-2026-8815',
      vehicleRegistrationNumber: 'MH-12-RN-8842',
      driverName: 'Rameshwar Patil',
      driverLicenseNumber: 'DL-MH-COM-2018-0042',
      driverHazmatEndorsementValid: false,
      statutoryTransitPermitNumber: 'PCB-TRANS-AUTH-2026-1188',
      routeClearanceStatus: 'EXPIRED_LICENSE_HOLD',
      dispatchNotes: 'DISPATCH BLOCKED AT MAIN GATE: Commercial driver dangerous goods certification expired. Replacement driver required.',
    },
  ]);

  // =========================================================================
  // PAINT & COATINGS STATES
  // =========================================================================
  const [paintShades, setPaintShades] = useState<PaintShadeMasterRecord[]>([
    {
      id: 'psm-1',
      shadeCode: 'SHADE-PNT-2026-104',
      shadeName: 'Royal Venetian Blue 202',
      colorFamily: 'Blue',
      baseTypeRequired: 'WHITE_BASE',
      spectroL: 42.50,
      spectroA: -8.20,
      spectroB: -32.40,
      targetDeltaETolerance: 0.50,
      customTintingFormulaJson: '{"Phthalo Blue": "45.0 mL/L", "Lamp Black": "12.5 mL/L", "Titanium White": "18.0 mL/L"}',
      formulaApproved: true,
      approvedBy: 'COLOR_LAB_SHADE_MANAGER',
      status: 'ACTIVE',
      createdAt: 'Today, 09:30 AM',
    },
    {
      id: 'psm-2',
      shadeCode: 'SHADE-PNT-2026-105',
      shadeName: 'Warm Sandstone Gold 118',
      colorFamily: 'Yellow / Earth',
      baseTypeRequired: 'DEEP_BASE',
      spectroL: 74.80,
      spectroA: 12.40,
      spectroB: 48.60,
      targetDeltaETolerance: 0.50,
      customTintingFormulaJson: '{"Yellow Iron Oxide": "64.0 mL/L", "Red Oxide": "14.5 mL/L", "Raw Umber": "5.2 mL/L"}',
      formulaApproved: true,
      approvedBy: 'COLOR_LAB_SHADE_MANAGER',
      status: 'ACTIVE',
      createdAt: 'Yesterday, 03:15 PM',
    },
    {
      id: 'psm-3',
      shadeCode: 'SHADE-PNT-2026-106',
      shadeName: 'Signal Red Gloss (RAL 3001)',
      colorFamily: 'Red',
      baseTypeRequired: 'CLEAR_BASE',
      spectroL: 45.20,
      spectroA: 55.40,
      spectroB: 32.10,
      targetDeltaETolerance: 0.50,
      customTintingFormulaJson: '{"Toluidine Red": "85.0 mL/L", "Scarlet Chrome": "22.0 mL/L", "Organic Orange": "12.0 mL/L"}',
      formulaApproved: true,
      approvedBy: 'COLOR_LAB_SHADE_MANAGER',
      status: 'ACTIVE',
      createdAt: '2 days ago',
    },
  ]);

  const [dispersionBatches, setDispersionBatches] = useState<PaintDispersionBatchRecord[]>([
    {
      id: 'pdb-1',
      batchCode: 'DISP-BM4-2026-081',
      millId: 'Horizontal Bead Mill BM-04 (50L)',
      productName: 'High Gloss Synthetic Alkyd Enamel Mill Base',
      resinType: 'Medium Oil Alkyd (60% NV)',
      pigmentType: 'Rutile Titanium Dioxide (Ti-Pure R-902+)',
      targetViscosityKu: 95.0,
      currentViscosityKu: 96.5,
      loadingSequenceCompleted: true,
      grindingDurationMinutes: 135,
      beadMillRunHours: 4.8,
      coolingWaterTempCelsius: 21.5,
      dispersionStatus: 'COMPLETED',
      operatorNotes: '5-Stage sequence completed: Resin -> Solvent -> Wetting Agent -> TiO2 -> Extender Barytes. Viscosity stabilized.',
      createdAt: 'Today, 10:15 AM',
    },
    {
      id: 'pdb-2',
      batchCode: 'DISP-BM2-2026-082',
      millId: 'High Speed Disperser HSD-02 (1500 RPM)',
      productName: 'Exterior Acrylic Weather-Shield Base',
      resinType: 'Pure Acrylic Emulsion (50% Solids)',
      pigmentType: 'Phthalocyanine Green + Micronized Silica',
      targetViscosityKu: 102.0,
      currentViscosityKu: 104.0,
      loadingSequenceCompleted: true,
      grindingDurationMinutes: 90,
      beadMillRunHours: 3.2,
      coolingWaterTempCelsius: 23.0,
      dispersionStatus: 'MILLING',
      operatorNotes: 'Impeller tip speed at 22 m/s. Cooling jacket inlet temp maintained at 23°C.',
      createdAt: 'Today, 01:45 PM',
    },
  ]);

  const [rheologyTests, setRheologyTests] = useState<PaintRheologyTestRecord[]>([
    {
      id: 'prt-1',
      testId: 'RHEO-2026-401',
      batchNumber: 'BATCH-PNT-2026-092',
      productName: 'Premium High Gloss Architectural Enamel',
      krebsViscosityKu: 98.0,
      densityGml: 1.32,
      hegmanFinenessMicrons: 18.0,
      touchDryMinutes: 35,
      hardDryMinutes: 180,
      glossLevel60Deg: 89.4,
      packagingCleared: true,
      coaDocumentNumber: 'COA-PNT-2026-1044',
      coaGeneratedAt: 'Today, 11:30 AM',
      rejectionReason: null,
      qaChemistNotes: 'Viscosity 98 KU (spec 85-115), Fineness 18 µm (spec ≤25), Touch dry 35 min. Approved for canning line.',
      createdAt: 'Today, 11:30 AM',
    },
    {
      id: 'prt-2',
      testId: 'RHEO-2026-402',
      batchNumber: 'BATCH-PNT-2026-093',
      productName: 'Water-Based Interior Luxury Emulsion',
      krebsViscosityKu: 106.0,
      densityGml: 1.38,
      hegmanFinenessMicrons: 22.0,
      touchDryMinutes: 25,
      hardDryMinutes: 120,
      glossLevel60Deg: 24.5,
      packagingCleared: true,
      coaDocumentNumber: 'COA-PNT-2026-1045',
      coaGeneratedAt: 'Today, 02:00 PM',
      rejectionReason: null,
      qaChemistNotes: 'Passes IS 15489 Class A requirements. Cleared for 20L HDPE pail packaging line.',
      createdAt: 'Today, 02:00 PM',
    },
    {
      id: 'prt-3',
      testId: 'RHEO-2026-403',
      batchNumber: 'BATCH-PNT-2026-094',
      productName: 'Heavy Duty Epoxy Floor Coating',
      krebsViscosityKu: 122.5,
      densityGml: 1.45,
      hegmanFinenessMicrons: 32.0,
      touchDryMinutes: 75,
      hardDryMinutes: 360,
      glossLevel60Deg: 78.0,
      packagingCleared: false,
      coaDocumentNumber: null,
      coaGeneratedAt: null,
      rejectionReason: 'Viscosity 122.5 KU exceeds 115 KU ceiling; Fineness 32 µm exceeds 25 µm threshold; Touch dry 75 min exceeds 60 min gate limit.',
      qaChemistNotes: 'DISPATCH GATE LOCKED: Lot held from canning. Return to bead mill for viscosity adjustment and additional grinding pass.',
      createdAt: 'Today, 03:10 PM',
    },
  ]);

  const [baseTintings, setBaseTintings] = useState<PaintBaseStockTintingRecord[]>([
    {
      id: 'pbt-1',
      dispenseTrackingNumber: 'TNT-2026-883',
      baseTankId: 'Bulk Storage Tank BT-101 (Base White 15,000L)',
      baseType: 'BASE_WHITE',
      dispenserMachineId: 'Fast & Fluid Auto-Tint Dispenser AT-02',
      targetVolumeLtr: 500.0,
      colorantWhiteMl: 450.0,
      colorantBlackMl: 125.0,
      colorantYellowOxideMl: 0.0,
      colorantRedOxideMl: 0.0,
      colorantPhthaloBlueMl: 850.0,
      colorantPhthaloGreenMl: 0.0,
      reconciliationStatus: 'RECONCILED',
      variancePercentage: 0.08,
      operatorNotes: 'Automated 16-canister dispenser load cells calibrated. Stock balance synchronized with inventory ledger.',
      createdAt: 'Today, 10:45 AM',
    },
    {
      id: 'pbt-2',
      dispenseTrackingNumber: 'TNT-2026-884',
      baseTankId: 'Bulk Storage Tank BT-103 (Deep Base 10,000L)',
      baseType: 'DEEP_BASE',
      dispenserMachineId: 'Corob D600 Auto-Tint Dispenser AT-01',
      targetVolumeLtr: 300.0,
      colorantWhiteMl: 0.0,
      colorantBlackMl: 65.0,
      colorantYellowOxideMl: 1240.0,
      colorantRedOxideMl: 380.0,
      colorantPhthaloBlueMl: 0.0,
      colorantPhthaloGreenMl: 0.0,
      reconciliationStatus: 'RECONCILED',
      variancePercentage: 0.11,
      operatorNotes: 'Canister circuits purged. Nozzle anti-drying mechanism verified active.',
      createdAt: 'Today, 01:20 PM',
    },
  ]);

  const [packagingCompliances, setPackagingCompliances] = useState<PaintPackagingComplianceRecord[]>([
    {
      id: 'ppc-1',
      packLotNumber: 'LOT-PKG-2026-772',
      batchNumber: 'BATCH-PNT-2026-092',
      productName: 'Synthetic High Gloss Enamel',
      containerSize: '4L',
      containerType: 'TIN_CAN',
      quantityContainers: 450,
      mfgDate: '11/2026',
      expDate: '11/2029',
      shelfLifeMonths: 36,
      batchCodePrinted: 'B.No: BATCH-092 | MFD: 11/26 | USE BY: 11/29 | MRP: Rs. 1,650/-',
      vocContentGramsPerLiter: 42.5,
      antiStaticBondingVerified: true,
      flammableSolventPermitValid: true,
      warehouseLocationBay: 'Bay-Solvent-FL-02',
      complianceSignOff: 'COMPLIANT',
      createdAt: 'Today, 12:15 PM',
    },
    {
      id: 'ppc-2',
      packLotNumber: 'LOT-PKG-2026-773',
      batchNumber: 'BATCH-PNT-2026-093',
      productName: 'Interior Luxury Emulsion',
      containerSize: '20L',
      containerType: 'HDPE_BUCKET',
      quantityContainers: 180,
      mfgDate: '11/2026',
      expDate: '11/2029',
      shelfLifeMonths: 36,
      batchCodePrinted: 'B.No: BATCH-093 | MFD: 11/26 | USE BY: 11/29 | MRP: Rs. 6,800/-',
      vocContentGramsPerLiter: 18.2,
      antiStaticBondingVerified: true,
      flammableSolventPermitValid: true,
      warehouseLocationBay: 'Bay-Waterbase-WB-01',
      complianceSignOff: 'COMPLIANT',
      createdAt: 'Today, 02:40 PM',
    },
  ]);

  // Interactive Spectrophotometer CIELAB State
  const [selectedShadeForDeltaE, setSelectedShadeForDeltaE] = useState<string>('SHADE-PNT-2026-104');
  const [sampleSpectroL, setSampleSpectroL] = useState<number>(42.75);
  const [sampleSpectroA, setSampleSpectroA] = useState<number>(-8.05);
  const [sampleSpectroB, setSampleSpectroB] = useState<number>(-32.20);

  // Paint Modals State
  const [isNewPaintShadeModal, setIsNewPaintShadeModal] = useState(false);
  const [isNewDispersionModal, setIsNewDispersionModal] = useState(false);
  const [isNewRheologyModal, setIsNewRheologyModal] = useState(false);
  const [isNewBaseTintingModal, setIsNewBaseTintingModal] = useState(false);
  const [isNewPackagingModal, setIsNewPackagingModal] = useState(false);
  const [selectedPaintCoa, setSelectedPaintCoa] = useState<PaintRheologyTestRecord | null>(null);

  // Stoichiometry calculator interactive state
  const [calcTheoYield, setCalcTheoYield] = useState<number>(1466.7);
  const [calcActualYield, setCalcActualYield] = useState<number>(1385.0);

  // Chemical Modals State
  const [selectedCoaTest, setSelectedCoaTest] = useState<AnalyticalLabTest | null>(null);
  const [selectedTremcard, setSelectedTremcard] = useState<DangerousGoodsLogistics | null>(null);
  const [isNewChemFormulaModal, setIsNewChemFormulaModal] = useState(false);
  const [isNewHazmatModal, setIsNewHazmatModal] = useState(false);
  const [isNewLabTestModal, setIsNewLabTestModal] = useState(false);
  const [isNewReactorModal, setIsNewReactorModal] = useState(false);
  const [isNewDangerousGoodsModal, setIsNewDangerousGoodsModal] = useState(false);

  // Modal Dialogs State
  const [selectedMtcHeat, setSelectedMtcHeat] = useState<HeatTest | null>(null);
  const [isNewSlipModal, setIsNewSlipModal] = useState(false);
  const [isNewHeatModal, setIsNewHeatModal] = useState(false);
  const [isReconcileModal, setIsReconcileModal] = useState(false);

  // Glass Modals
  const [isNewFormulaModal, setIsNewFormulaModal] = useState(false);
  const [isNewKilnLogModal, setIsNewKilnLogModal] = useState(false);
  const [isNewMouldModal, setIsNewMouldModal] = useState(false);
  const [isNewInspectionModal, setIsNewInspectionModal] = useState(false);
  const [isNewCulletModal, setIsNewCulletModal] = useState(false);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Glass Actions
  const handleAddBatchFormula = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const silica = Number(formData.get('silica')) || 0;
    const soda = Number(formData.get('soda')) || 0;
    const lime = Number(formData.get('lime')) || 0;
    const feldspar = Number(formData.get('feldspar')) || 0;
    const dolomite = Number(formData.get('dolomite')) || 0;
    const cullet = Number(formData.get('cullet')) || 0;

    const total = silica + soda + lime + feldspar + dolomite + cullet;
    const culletRatio = total > 0 ? Number(((cullet / total) * 100).toFixed(2)) : 0;

    const newFormula: BatchFormula = {
      id: `bf-${Date.now()}`,
      formulaCode: `FORM-GLAS-${Math.floor(100 + Math.random() * 900)}`,
      batchName: String(formData.get('batchName') || 'New Glass Formulation'),
      glassType: String(formData.get('glassType') || 'Soda-Lime Glass'),
      silicaSandWeight: silica,
      sodaAshWeight: soda,
      limestoneWeight: lime,
      feldsparWeight: feldspar,
      dolomiteWeight: dolomite,
      culletWeight: cullet,
      totalBatchWeight: total,
      culletRatioPercent: culletRatio,
      siloHopperLevels: { siloSilica: 85, siloSodaAsh: 80, siloLimestone: 90, siloCullet: 75 },
      status: 'ACTIVE',
      createdAt: 'Just now',
    };

    setBatchFormulas([newFormula, ...batchFormulas]);
    setIsNewFormulaModal(false);
    showToast(`Batch formula ${newFormula.formulaCode} registered with ${culletRatio}% cullet ratio.`);
  };

  const handleAddKilnLog = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const gas = Number(formData.get('gas')) || 0;
    const meltedTons = Number(formData.get('meltedTons')) || 100;
    const fuelPerTon = meltedTons > 0 ? Number((gas / meltedTons).toFixed(2)) : 25;

    const newLog: KilnFurnaceLog = {
      id: `kfl-${Date.now()}`,
      furnaceId: String(formData.get('furnaceId') || 'MELTER-LINE-01'),
      meltingZoneTemp: Number(formData.get('meltingTemp')) || 1580,
      refiningZoneTemp: Number(formData.get('refiningTemp')) || 1420,
      annealingLehrTemp: Number(formData.get('lehrTemp')) || 550,
      gasConsumptionCubicMtr: gas,
      fuelPerTonGlass: fuelPerTon,
      burnerMaintenanceDue: formData.get('burnerMaintenance') === 'on',
      crownPressureMmWg: Number(formData.get('crownPressure')) || 1.8,
      thermalShockDeltaT: 45.0,
      operatorNotes: String(formData.get('notes') || 'Standard operational shift log.'),
      createdAt: 'Just now',
    };

    setKilnLogs([newLog, ...kilnLogs]);
    setIsNewKilnLogModal(false);
    showToast(`Furnace telemetry for ${newLog.furnaceId} logged successfully.`);
  };

  const handleAddMould = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const maxLife = Number(formData.get('maxLife')) || 250000;
    const current = Number(formData.get('currentShots')) || 0;
    const remainingPercent = Number(Math.max(0, 100 - (current / maxLife) * 100).toFixed(1));

    const newMould: MouldToolingRecord = {
      id: `mld-${Date.now()}`,
      mouldCode: String(formData.get('mouldCode') || 'MLD-NEW-01').toUpperCase(),
      mouldType: String(formData.get('mouldType') || 'Blow Mould'),
      materialType: String(formData.get('materialType') || 'Cast Iron / Bronze Alloy'),
      cavityCount: Number(formData.get('cavities')) || 4,
      currentShotCount: current,
      maxShotLife: maxLife,
      remainingLifePercent: remainingPercent,
      lastPolishedAt: new Date().toISOString().split('T')[0],
      nextMaintenanceDue: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: remainingPercent <= 15 ? 'REFURBISHMENT_DUE' : 'ACTIVE',
      allocatedLine: String(formData.get('line') || 'IS Machine Line 1'),
      notes: String(formData.get('notes') || ''),
    };

    setMouldRecords([newMould, ...mouldRecords]);
    setIsNewMouldModal(false);
    showToast(`Mould tooling ${newMould.mouldCode} tracked in lifecycle database.`);
  };

  const handleAddInspection = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const bubbles = Number(formData.get('bubbles')) || 0;
    const stones = Number(formData.get('stones')) || 0;
    const warping = Number(formData.get('warping')) || 0;
    const shockPassed = formData.get('shockPassed') === 'yes';

    let lotStatus: 'APPROVED' | 'HOLD' | 'REJECTED' = 'APPROVED';
    if (!shockPassed || bubbles > 8 || stones > 4 || warping > 0.6) {
      lotStatus = 'REJECTED';
    } else if (bubbles > 3 || warping > 0.3) {
      lotStatus = 'HOLD';
    }

    const newInspection: ThermalQualityInspection = {
      id: `tqi-${Date.now()}`,
      lotNumber: String(formData.get('lotNumber') || 'LOT-GLAS-NEW').toUpperCase(),
      productType: String(formData.get('productType') || 'Float Glass 4mm'),
      inspectedSampleCount: Number(formData.get('samples')) || 100,
      defectBubblesSeeds: bubbles,
      defectPinholesStones: stones,
      defectWarpingMm: warping,
      thermalShockTestPassed: shockPassed,
      thermalShockDeltaT: Number(formData.get('deltaT')) || 45.0,
      impactStrengthJoules: 14.0,
      lotStatus,
      inspectorNotes: String(formData.get('notes') || 'Thermal shock & optical test clearance.'),
      createdAt: 'Just now',
    };

    setThermalInspections([newInspection, ...thermalInspections]);
    setIsNewInspectionModal(false);
    showToast(`Lot ${newInspection.lotNumber} inspection logged. Status: ${lotStatus}`);
  };

  const handleAddCullet = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const hotEnd = Number(formData.get('hotEnd')) || 0;
    const coldEnd = Number(formData.get('coldEnd')) || 0;
    const totalRejection = hotEnd + coldEnd;
    const recovered = Number(formData.get('recovered')) || 0;
    const recoveryPct = totalRejection > 0 ? Number(((recovered / totalRejection) * 100).toFixed(2)) : 100;
    const lossPct = Number(Math.max(0, 100 - recoveryPct).toFixed(2));

    const newCullet: CulletRecoveryRecord = {
      id: `cul-${Date.now()}`,
      recordNumber: `REC-CUL-${Math.floor(100 + Math.random() * 900)}`,
      shiftDate: 'Current Shift',
      productionLine: String(formData.get('line') || 'Float Glass Line 1'),
      hotEndRejectionWeight: hotEnd,
      coldEndRejectionWeight: coldEnd,
      totalRejectionWeight: totalRejection,
      recoveredCulletWeight: recovered,
      recoveryPercentage: recoveryPct,
      massBalanceLossPercent: lossPct,
      reconciliationNotes: String(formData.get('notes') || 'Cullet crushed and returned to batch house.'),
      createdAt: 'Just now',
    };

    setCulletRecords([newCullet, ...culletRecords]);
    setIsNewCulletModal(false);
    showToast(`Cullet recovery rate of ${recoveryPct}% reconciled for ${newCullet.productionLine}.`);
  };

  const handleRefurbishMould = (id: string) => {
    setMouldRecords((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: 'ACTIVE',
              lastPolishedAt: new Date().toISOString().split('T')[0],
              nextMaintenanceDue: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
              notes: 'Cavity cleaned, polished & dry graphite lubricant applied.',
            }
          : m,
      ),
    );
    showToast('Mould cavity polished and returned to active tooling rotation.');
  };

  const handleIncrementShots = (id: string) => {
    setMouldRecords((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const newShots = m.currentShotCount + 5000;
          const remaining = Number(Math.max(0, 100 - (newShots / m.maxShotLife) * 100).toFixed(1));
          return {
            ...m,
            currentShotCount: newShots,
            remainingLifePercent: remaining,
            status: remaining <= 15 ? 'REFURBISHMENT_DUE' : m.status,
          };
        }
        return m;
      }),
    );
    showToast('Logged +5,000 production shots to mould counter.');
  };

  // =========================================================================
  // CHEMICAL HANDLERS
  // =========================================================================

  const handleAddChemFormula = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const theo = Number(formData.get('theoreticalYield')) || 1000;

    const newFormula: ChemicalFormulaMaster = {
      id: `cfm-${Date.now()}`,
      formulaCode: `FORM-CHEM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      productName: String(formData.get('productName') || 'Organic Specialty Intermediate'),
      version: String(formData.get('version') || 'v1.0'),
      stoichiometryEquation: String(formData.get('stoichiometry') || 'A + B -> C + H2O'),
      theoreticalYieldKg: theo,
      expectedCycleTimeHours: Number(formData.get('cycleHours')) || 8.0,
      reactionType: String(formData.get('reactionType') || 'Synthesis'),
      hazardClassification: String(formData.get('hazardClass') || 'CLASS_3_FLAMMABLE'),
      activeStatus: 'APPROVED',
      rawMaterialsComposition: JSON.stringify([
        { reactant: 'Primary Reactant', qtyKg: Number(theo * 0.7) },
        { reactant: 'Core Reagent', qtyKg: Number(theo * 0.45) },
      ]),
      authorizationNotes: String(formData.get('notes') || 'Formula approved for reactor pilot scale-up.'),
      createdAt: 'Just now',
    };

    setChemFormulas([newFormula, ...chemFormulas]);
    setIsNewChemFormulaModal(false);
    showToast(`Master chemical formula ${newFormula.formulaCode} approved and registered.`);
  };

  const handleAuthorizeFormula = (id: string, newStatus: 'APPROVED' | 'DRAFT' | 'UNDER_REVIEW' | 'ARCHIVED') => {
    setChemFormulas((prev) =>
      prev.map((f) => (f.id === id ? { ...f, activeStatus: newStatus } : f)),
    );
    showToast(`Formula authorization status updated to ${newStatus}.`);
  };

  const handleAddHazmat = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const score = Number(formData.get('ppeScore')) || 98.0;

    const newHazmat: ChemicalHazmatRecord = {
      id: `haz-${Date.now()}`,
      manifestNumber: `HAZ-MAN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      wasteType: String(formData.get('wasteType') || 'Spent Organic Solvent Blend'),
      unClassification: String(formData.get('unClass') || 'UN 1993'),
      wasteCategoryCpcb: String(formData.get('categoryCpcb') || 'Category 20.2 (Spent Solvents)'),
      quantityLtrOrKg: Number(formData.get('quantity')) || 1000,
      unit: String(formData.get('unit') || 'ltr'),
      disposalMethod: String(formData.get('disposalMethod') || 'Authorized TSDF High-Temperature Incineration'),
      handlingPermitNumber: String(formData.get('permitNumber') || 'PCB-HAZ-AUTH-2026-9021'),
      permitExpiryDate: '2027-06-30',
      ppeComplianceStatus: score >= 90 ? 'COMPLIANT' : 'FLAGGED_VIOLATION',
      ppeAuditScore: score,
      statutoryRegulatoryBody: 'CPCB / SPCB Hazardous Waste Cell',
      safetyAuditDate: 'Today, Just now',
      auditNotes: String(formData.get('notes') || 'Full PPE audit completed prior to tanker transfer.'),
    };

    setHazmatRecords([newHazmat, ...hazmatRecords]);
    setIsNewHazmatModal(false);
    showToast(`Hazardous manifest ${newHazmat.manifestNumber} logged with CPCB compliance record.`);
  };

  const handleAddLabTest = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const purity = Number(formData.get('purity')) || 99.0;
    const ph = Number(formData.get('ph')) || 7.0;
    const moisture = Number(formData.get('moisture')) || 0.05;
    const density = Number(formData.get('density')) || 0.902;

    const isPass = purity >= 98.0 && ph >= 6.0 && ph <= 8.5 && moisture <= 0.50;
    const coaDoc = isPass ? `COA-CHEM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}` : null;

    const newTest: AnalyticalLabTest = {
      id: `lab-${Date.now()}`,
      testId: `LAB-QA-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      batchNumber: String(formData.get('batchNumber') || 'BATCH-CHEM-NEW').toUpperCase(),
      productName: String(formData.get('productName') || 'Ethyl Acetate Industrial Grade'),
      sampleSource: String(formData.get('sampleSource') || 'Reactor Distillate Receiver'),
      purityPercent: purity,
      phLevel: ph,
      moistureWaterPercent: moisture,
      densityGml: density,
      testPassed: isPass,
      dispatchCleared: isPass,
      coaDocumentNumber: coaDoc,
      coaGeneratedAt: isPass ? 'Just now' : null,
      blockingReason: isPass
        ? null
        : `CRITICAL GATE: Dispatch Blocked! Purity ${purity}% (min 98%), pH ${ph} (6.0-8.5), Moisture ${moisture}% (max 0.50%).`,
      chemistNotes: String(formData.get('notes') || (isPass ? 'All parameters within USP/ACS specs.' : 'Sub-spec lot; re-distillation required.')),
      createdAt: 'Just now',
    };

    setLabTests([newTest, ...labTests]);
    setIsNewLabTestModal(false);
    if (isPass) {
      showToast(`Analytical test verified. CoA ${coaDoc} issued; batch CLEARED for dispatch.`);
    } else {
      showToast(`TEST FAILED! Batch ${newTest.batchNumber} strictly BLOCKED from dispatch.`);
    }
  };

  const handleAddReactorCycle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const target = Number(formData.get('targetYield')) || 1500;
    const actual = Number(formData.get('actualYield')) || 0;
    const yieldPct = actual > 0 ? Number(((actual / target) * 100).toFixed(2)) : 0;

    const newCycle: ReactorBatchCycle = {
      id: `rbc-${Date.now()}`,
      batchCode: `BAT-R4-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      reactorId: String(formData.get('reactorId') || 'GLR-101 (Glass Lined Reactor 5000L)'),
      productName: String(formData.get('productName') || 'Ethyl Acetate Industrial Grade'),
      currentStage: (formData.get('stage') as any) || 'CHARGING',
      targetYieldKg: target,
      actualYieldKg: actual,
      yieldPercentage: yieldPct,
      steamConsumptionKg: Number(formData.get('steam')) || 250,
      coolingWaterM3: Number(formData.get('coolingWater')) || 30,
      powerConsumptionKwh: Number(formData.get('power')) || 120,
      cycleStartTime: 'Just started',
      cycleEndTime: null,
      downtimeHours: 0.0,
      downtimeReason: null,
      stageRemarks: String(formData.get('remarks') || 'Batch initiated under nitrogen purge.'),
    };

    setReactorCycles([newCycle, ...reactorCycles]);
    setIsNewReactorModal(false);
    showToast(`Reactor cycle ${newCycle.batchCode} initialized on ${newCycle.reactorId}.`);
  };

  const handleAdvanceReactorStage = (id: string, curStage: string) => {
    const stages: ReactorBatchCycle['currentStage'][] = [
      'CHARGING',
      'REACTION',
      'REFLUX',
      'DISTILLATION',
      'COOLING',
      'DISCHARGING',
      'COMPLETED',
    ];
    const curIdx = stages.indexOf(curStage as any);
    const nextStage = curIdx < stages.length - 1 ? stages[curIdx + 1] : 'COMPLETED';

    setReactorCycles((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const isFinished = nextStage === 'COMPLETED';
          const updatedActual = isFinished && c.actualYieldKg === 0 ? Number((c.targetYieldKg * 0.955).toFixed(1)) : c.actualYieldKg;
          const updatedYieldPct = updatedActual > 0 ? Number(((updatedActual / c.targetYieldKg) * 100).toFixed(2)) : c.yieldPercentage;
          return {
            ...c,
            currentStage: nextStage,
            actualYieldKg: updatedActual,
            yieldPercentage: updatedYieldPct,
            cycleEndTime: isFinished ? 'Just now' : c.cycleEndTime,
          };
        }
        return c;
      }),
    );
    showToast(`Reactor batch advanced to ${nextStage}.`);
  };

  const handleLogDowntime = (id: string) => {
    const reason = prompt('Enter reactor equipment downtime reason:', 'Condenser mechanical seal inspection & flush');
    if (!reason) return;
    const hours = Number(prompt('Enter downtime duration in hours:', '0.5')) || 0.5;

    setReactorCycles((prev) =>
      prev.map((c) => (c.id === id ? { ...c, downtimeHours: Number((c.downtimeHours + hours).toFixed(2)), downtimeReason: reason } : c)),
    );
    showToast(`Logged ${hours}h downtime on reactor cycle.`);
  };

  const handleAddDangerousGoods = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const isHazmatValid = formData.get('driverHazmatValid') === 'yes';

    const newDg: DangerousGoodsLogistics = {
      id: `dgl-${Date.now()}`,
      dispatchTrackingNumber: `DGL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      batchNumber: String(formData.get('batchNumber') || 'BATCH-CHEM-081').toUpperCase(),
      productName: String(formData.get('productName') || 'Ethyl Acetate Industrial Grade'),
      unNumber: String(formData.get('unNumber') || 'UN 1173'),
      properShippingName: String(formData.get('properShippingName') || 'ETHYL ACETATE (Class 3, PG II)'),
      hazardClass: 'Class 3 (Flammable Liquid)',
      packingGroup: 'PG II',
      hazchemCode: String(formData.get('hazchemCode') || '3YE'),
      tremcardIssued: true,
      tremcardDocumentNumber: `TREM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      vehicleRegistrationNumber: String(formData.get('vehicleNumber') || 'MH-12-RN-9000'),
      driverName: String(formData.get('driverName') || 'Harpreet Singh'),
      driverLicenseNumber: String(formData.get('driverLicense') || 'DL-COM-HAZ-2023'),
      driverHazmatEndorsementValid: isHazmatValid,
      statutoryTransitPermitNumber: 'PESO-WR-TANKER-2026-9901',
      routeClearanceStatus: isHazmatValid ? 'APPROVED' : 'EXPIRED_LICENSE_HOLD',
      dispatchNotes: String(formData.get('notes') || 'Tremcard handed to driver; flame arrestors certified.'),
    };

    setDangerousGoods([newDg, ...dangerousGoods]);
    setIsNewDangerousGoodsModal(false);
    if (isHazmatValid) {
      showToast(`Dangerous goods dispatch ${newDg.dispatchTrackingNumber} CLEARED with Tremcard.`);
    } else {
      showToast(`DISPATCH BLOCKED: Driver Hazmat endorsement missing or expired!`);
    }
  };

  // =========================================================================
  // PAINT ACTION HANDLERS
  // =========================================================================

  const handleAddPaintShade = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newShade: PaintShadeMasterRecord = {
      id: `psm-${Date.now()}`,
      shadeCode: `SHADE-PNT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      shadeName: String(formData.get('shadeName') || 'New Color Formulation'),
      colorFamily: String(formData.get('colorFamily') || 'Custom'),
      baseTypeRequired: String(formData.get('baseType') || 'WHITE_BASE'),
      spectroL: Number(formData.get('spectroL')) || 50.0,
      spectroA: Number(formData.get('spectroA')) || 0.0,
      spectroB: Number(formData.get('spectroB')) || 0.0,
      targetDeltaETolerance: Number(formData.get('deltaETolerance')) || 0.50,
      customTintingFormulaJson: String(formData.get('tintingFormula') || '{"Standard": "Direct Blend"}'),
      formulaApproved: true,
      approvedBy: 'COLOR_LAB_SHADE_MANAGER',
      status: 'ACTIVE',
      createdAt: 'Just now',
    };

    setPaintShades([newShade, ...paintShades]);
    setIsNewPaintShadeModal(false);
    showToast(`Master shade card ${newShade.shadeCode} (${newShade.shadeName}) registered with ΔE ≤ 0.50 tolerance.`);
  };

  const handleAddDispersionBatch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newBatch: PaintDispersionBatchRecord = {
      id: `pdb-${Date.now()}`,
      batchCode: `DISP-BM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      millId: String(formData.get('millId') || 'Horizontal Bead Mill BM-04'),
      productName: String(formData.get('productName') || 'Mill Base Enamel'),
      resinType: String(formData.get('resinType') || 'Medium Oil Alkyd (60% NV)'),
      pigmentType: String(formData.get('pigmentType') || 'Titanium Dioxide (TiO2)'),
      targetViscosityKu: Number(formData.get('targetViscosity')) || 95.0,
      currentViscosityKu: Number(formData.get('currentViscosity')) || 95.0,
      loadingSequenceCompleted: formData.get('sequenceCompleted') === 'on',
      grindingDurationMinutes: Number(formData.get('durationMinutes')) || 120,
      beadMillRunHours: Number(formData.get('runHours')) || 4.5,
      coolingWaterTempCelsius: Number(formData.get('coolingTemp')) || 22.0,
      dispersionStatus: 'COMPLETED',
      operatorNotes: String(formData.get('notes') || '5-Stage raw material loading sequence executed.'),
      createdAt: 'Just now',
    };

    setDispersionBatches([newBatch, ...dispersionBatches]);
    setIsNewDispersionModal(false);
    showToast(`Bead mill grinding batch ${newBatch.batchCode} logged at ${newBatch.currentViscosityKu} KU.`);
  };

  const handleAddRheologyTest = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const krebs = Number(formData.get('krebs')) || 95.0;
    const density = Number(formData.get('density')) || 1.30;
    const fineness = Number(formData.get('fineness')) || 18.0;
    const touchDry = Number(formData.get('touchDry')) || 30;
    const hardDry = Number(formData.get('hardDry')) || 180;
    const gloss = Number(formData.get('gloss')) || 85.0;

    // Strict Packaging Gate: Krebs 85-115 KU, Fineness <= 25um, Touch Dry <= 60 min
    const isViscosityOk = krebs >= 85.0 && krebs <= 115.0;
    const isFinenessOk = fineness <= 25.0;
    const isTouchDryOk = touchDry <= 60;
    const isCleared = isViscosityOk && isFinenessOk && isTouchDryOk;

    let rejectionReason: string | null = null;
    if (!isCleared) {
      const issues = [];
      if (!isViscosityOk) issues.push(`Viscosity ${krebs} KU out of spec (85-115 KU)`);
      if (!isFinenessOk) issues.push(`Fineness ${fineness} µm exceeds 25 µm ceiling`);
      if (!isTouchDryOk) issues.push(`Touch dry ${touchDry} min exceeds 60 min gate`);
      rejectionReason = issues.join('; ');
    }

    const coaDoc = isCleared ? `COA-PNT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}` : null;

    const newTest: PaintRheologyTestRecord = {
      id: `prt-${Date.now()}`,
      testId: `RHEO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      batchNumber: String(formData.get('batchNumber') || 'BATCH-PNT-NEW').toUpperCase(),
      productName: String(formData.get('productName') || 'Architectural Coating'),
      krebsViscosityKu: krebs,
      densityGml: density,
      hegmanFinenessMicrons: fineness,
      touchDryMinutes: touchDry,
      hardDryMinutes: hardDry,
      glossLevel60Deg: gloss,
      packagingCleared: isCleared,
      coaDocumentNumber: coaDoc,
      coaGeneratedAt: isCleared ? 'Just now' : null,
      rejectionReason,
      qaChemistNotes: String(formData.get('notes') || (isCleared ? 'Cleared for automated canning lines.' : rejectionReason)),
      createdAt: 'Just now',
    };

    setRheologyTests([newTest, ...rheologyTests]);
    setIsNewRheologyModal(false);
    if (isCleared) {
      showToast(`Rheology test passed! CoA ${coaDoc} generated; batch CLEARED for canning.`);
    } else {
      showToast(`DISPATCH GATE LOCKED: Batch ${newTest.batchNumber} failed rheology specifications!`);
    }
  };

  const handleAddBaseTinting = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newTinting: PaintBaseStockTintingRecord = {
      id: `pbt-${Date.now()}`,
      dispenseTrackingNumber: `TNT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      baseTankId: String(formData.get('tankId') || 'BT-101 (Base White 15,000L)'),
      baseType: String(formData.get('baseType') || 'BASE_WHITE'),
      dispenserMachineId: String(formData.get('dispenserId') || 'Auto-Tint Dispenser AT-02'),
      targetVolumeLtr: Number(formData.get('volumeLtr')) || 200,
      colorantWhiteMl: Number(formData.get('whiteMl')) || 0,
      colorantBlackMl: Number(formData.get('blackMl')) || 0,
      colorantYellowOxideMl: Number(formData.get('yellowMl')) || 0,
      colorantRedOxideMl: Number(formData.get('redMl')) || 0,
      colorantPhthaloBlueMl: Number(formData.get('blueMl')) || 0,
      colorantPhthaloGreenMl: Number(formData.get('greenMl')) || 0,
      reconciliationStatus: 'RECONCILED',
      variancePercentage: 0.08,
      operatorNotes: String(formData.get('notes') || 'Automatic colorant dispense shot recorded.'),
      createdAt: 'Just now',
    };

    setBaseTintings([newTinting, ...baseTintings]);
    setIsNewBaseTintingModal(false);
    showToast(`Base tinting shot ${newTinting.dispenseTrackingNumber} recorded & stock reconciled.`);
  };

  const handleAddPackagingCompliance = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const voc = Number(formData.get('voc')) || 42.0;
    const antiStatic = formData.get('antiStatic') === 'on';
    const permit = formData.get('permitValid') === 'on';
    const isCompliant = voc <= 50.0 && antiStatic && permit;

    const newPack: PaintPackagingComplianceRecord = {
      id: `ppc-${Date.now()}`,
      packLotNumber: `LOT-PKG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      batchNumber: String(formData.get('batchNumber') || 'BATCH-PNT-092').toUpperCase(),
      productName: String(formData.get('productName') || 'Synthetic High Gloss Enamel'),
      containerSize: String(formData.get('containerSize') || '4L'),
      containerType: String(formData.get('containerType') || 'TIN_CAN'),
      quantityContainers: Number(formData.get('quantity')) || 250,
      mfgDate: '11/2026',
      expDate: '11/2029',
      shelfLifeMonths: 36,
      batchCodePrinted: String(formData.get('printedCode') || 'B.No: BATCH-092 | MFD: 11/26 | USE BY: 11/29'),
      vocContentGramsPerLiter: voc,
      antiStaticBondingVerified: antiStatic,
      flammableSolventPermitValid: permit,
      warehouseLocationBay: String(formData.get('locationBay') || 'Bay-Solvent-FL-02'),
      complianceSignOff: isCompliant ? 'COMPLIANT' : 'NON_COMPLIANT_HOLD',
      createdAt: 'Just now',
    };

    setPackagingCompliances([newPack, ...packagingCompliances]);
    setIsNewPackagingModal(false);
    if (isCompliant) {
      showToast(`Container packaging run ${newPack.packLotNumber} signed off as COMPLIANT.`);
    } else {
      showToast(`PACKAGING COMPLIANCE HOLD: VOC > 50 g/L or anti-static bonding missing!`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-blue-600 text-white font-medium shadow-2xl animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-base">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/users"
              className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Return to User Directory"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400">
                  APEX INDUSTRIAL ERP
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 uppercase">
                  Specialized Operations Hub
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
                Heavy &amp; Raw Materials Sector Automation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
        {/* Sub-Category Sector Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {activeSector === 'CHEMICAL'
                ? 'Process & Chemical Industries Operations Hub'
                : activeSector === 'GLASS'
                ? 'Glass & Ceramic Production Hub'
                : 'Steel & Heavy Metals Operations Hub'}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mt-1">
              {activeSector === 'CHEMICAL'
                ? '5 Specialized Roles: R&D Formula Chemist, EHS Hazmat Safety, QA Analytical Lab, Reactor Batch Cycles & Hazardous Logistics'
                : activeSector === 'GLASS'
                ? '5 Specialized Roles: Batch House, Kiln/Furnace, Mould Tooling, Thermal QC, & Cullet Scrap Recovery'
                : '4 Specialized Roles: Weighbridge, Metallurgy Lab MTC, Subcontracting Job Work, & EHS Safety'}
            </p>
          </div>

          <div className="inline-flex flex-wrap rounded-xl bg-slate-100 dark:bg-slate-800 p-1.5 border border-slate-200 dark:border-slate-700 gap-1">
            <button
              type="button"
              onClick={() => setActiveSector('PAINT')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-base font-bold transition-all ${
                activeSector === 'PAINT'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Paint &amp; Coatings (5 Roles)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSector('CHEMICAL')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-base font-bold transition-all ${
                activeSector === 'CHEMICAL'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              <span>Chemical (5 Roles)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSector('GLASS')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-base font-bold transition-all ${
                activeSector === 'GLASS'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Glass &amp; Ceramic (5 Roles)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSector('STEEL')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-base font-bold transition-all ${
                activeSector === 'STEEL'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <HardHat className="w-4 h-4" />
              <span>Steel &amp; Heavy Metals (4 Roles)</span>
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* GLASS & CERAMIC SUB-CATEGORY CONTENT */}
        {/* ================================================================= */}
        {activeSector === 'GLASS' && (
          <div className="space-y-6">
            {/* Glass Operational Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => setGlassTab('batch_house')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                  glassTab === 'batch_house'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>1. Batch House &amp; Formulas</span>
              </button>
              <button
                type="button"
                onClick={() => setGlassTab('kiln_furnace')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                  glassTab === 'kiln_furnace'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>2. Kiln &amp; Furnace Melter</span>
              </button>
              <button
                type="button"
                onClick={() => setGlassTab('mould_tooling')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                  glassTab === 'mould_tooling'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>3. Mould &amp; Tooling Life</span>
              </button>
              <button
                type="button"
                onClick={() => setGlassTab('thermal_quality')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                  glassTab === 'thermal_quality'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>4. Thermal QC &amp; Defect Check</span>
              </button>
              <button
                type="button"
                onClick={() => setGlassTab('cullet_recovery')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                  glassTab === 'cullet_recovery'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <Recycle className="w-4 h-4" />
                <span>5. Cullet Scrap Recovery</span>
              </button>
            </div>

            {/* TAB 1: BATCH HOUSE MANAGER */}
            {glassTab === 'batch_house' && (
              <div className="space-y-6">
                {/* Silo Levels Live Storage Banner */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-1">
                      <span>Silica Sand Silo 1</span>
                      <span className="font-bold text-cyan-600">88%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5">
                      <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                    <div className="mt-2 text-xs text-slate-400">Available: 440 MT / 500 MT</div>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-1">
                      <span>Soda Ash Hopper 2</span>
                      <span className="font-bold text-blue-600">74%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '74%' }}></div>
                    </div>
                    <div className="mt-2 text-xs text-slate-400">Available: 148 MT / 200 MT</div>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-1">
                      <span>Limestone Bin 3</span>
                      <span className="font-bold text-emerald-600">92%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5">
                      <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <div className="mt-2 text-xs text-slate-400">Available: 184 MT / 200 MT</div>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-1">
                      <span>Recycled Cullet Hopper</span>
                      <span className="font-bold text-teal-600">65%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5">
                      <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <div className="mt-2 text-xs text-slate-400">Available: 260 MT / 400 MT</div>
                  </div>
                </div>

                {/* Batch Formulas Table */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-extrabold">Batch Formula Master Data &amp; Cullet Ratios</h3>
                      <p className="text-base text-slate-500">
                        Administered by BATCH_HOUSE_MANAGER: recipe weighing accuracy &amp; cullet recycling %.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsNewFormulaModal(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-base transition-colors shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Create Batch Recipe</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-base">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="py-3.5 px-4">Formula Code</th>
                          <th className="py-3.5 px-4">Recipe Name &amp; Type</th>
                          <th className="py-3.5 px-4">Raw Materials (kg)</th>
                          <th className="py-3.5 px-4">Recycled Cullet</th>
                          <th className="py-3.5 px-4">Total Weight</th>
                          <th className="py-3.5 px-4">Cullet Ratio %</th>
                          <th className="py-3.5 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {batchFormulas.map((f) => (
                          <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="py-4 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                              {f.formulaCode}
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-extrabold">{f.batchName}</div>
                              <div className="text-xs text-slate-500">{f.glassType}</div>
                            </td>
                            <td className="py-4 px-4 text-sm">
                              <div>Sand: {f.silicaSandWeight} kg | Soda: {f.sodaAshWeight} kg</div>
                              <div className="text-slate-500">Lime: {f.limestoneWeight} kg | Feldspar: {f.feldsparWeight || 0} kg</div>
                            </td>
                            <td className="py-4 px-4 font-bold text-teal-600">
                              {f.culletWeight} kg
                            </td>
                            <td className="py-4 px-4 font-bold">
                              {f.totalBatchWeight} kg
                            </td>
                            <td className="py-4 px-4">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                                {f.culletRatioPercent}% Cullet
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                {f.status}
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

            {/* TAB 2: KILN & FURNACE MANAGER */}
            {glassTab === 'kiln_furnace' && (
              <div className="space-y-6">
                {/* Furnace Telemetry Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="text-sm font-bold text-slate-500">Average Melting Temp</div>
                    <div className="text-3xl font-black text-orange-600 mt-2">1,585.0 °C</div>
                    <div className="text-xs text-slate-400 mt-1">Target range: 1,570°C – 1,600°C</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="text-sm font-bold text-slate-500">Refining Zone Gradient</div>
                    <div className="text-3xl font-black text-amber-500 mt-2">1,425.0 °C</div>
                    <div className="text-xs text-slate-400 mt-1">Delta-T to Lehr: -865°C controlled</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="text-sm font-bold text-slate-500">Specific Energy Consumption</div>
                    <div className="text-3xl font-black text-blue-600 mt-2">28.75 Nm³/MT</div>
                    <div className="text-xs text-emerald-500 font-bold mt-1">↓ 3.2% vs Benchmark</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="text-sm font-bold text-slate-500">Crown Pressure &amp; Firing</div>
                    <div className="text-3xl font-black text-emerald-600 mt-2">1.85 mmWG</div>
                    <div className="text-xs text-slate-400 mt-1">Reversal: Every 20 mins OK</div>
                  </div>
                </div>

                {/* Kiln Logs Table */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-extrabold">Kiln &amp; Melter Telemetry Logs</h3>
                      <p className="text-base text-slate-500">
                        Administered by KILN_FURNACE_MANAGER: temperature profiles, fuel/gas monitoring, and burner maintenance.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsNewKilnLogModal(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-base transition-colors shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Log Telemetry Reading</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-base">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="py-3.5 px-4">Furnace / Kiln ID</th>
                          <th className="py-3.5 px-4">Melting Zone</th>
                          <th className="py-3.5 px-4">Refining Zone</th>
                          <th className="py-3.5 px-4">Annealing Lehr</th>
                          <th className="py-3.5 px-4">Gas Consumed</th>
                          <th className="py-3.5 px-4">Fuel Efficiency</th>
                          <th className="py-3.5 px-4">Burner Maintenance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {kilnLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="py-4 px-4 font-mono font-bold text-orange-600">
                              {log.furnaceId}
                            </td>
                            <td className="py-4 px-4 font-extrabold text-red-500">
                              {log.meltingZoneTemp} °C
                            </td>
                            <td className="py-4 px-4 font-bold text-amber-500">
                              {log.refiningZoneTemp} °C
                            </td>
                            <td className="py-4 px-4 font-medium text-blue-500">
                              {log.annealingLehrTemp} °C
                            </td>
                            <td className="py-4 px-4 font-bold">
                              {log.gasConsumptionCubicMtr} Nm³
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-bold text-cyan-600">{log.fuelPerTonGlass} Nm³/MT</span>
                            </td>
                            <td className="py-4 px-4">
                              {log.burnerMaintenanceDue ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-rose-500/10 text-rose-600 border border-rose-500/30">
                                  <AlertCircle className="w-3.5 h-3.5" /> Maintenance Due
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Operational
                                </span>
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

            {/* TAB 3: MOULD & TOOLING MANAGER */}
            {glassTab === 'mould_tooling' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-extrabold">Mould &amp; Tooling Lifecycle Management</h3>
                      <p className="text-base text-slate-500">
                        Administered by MOULD_TOOLING_MANAGER: shot counts, cavity wear monitoring, and polishing schedules.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsNewMouldModal(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-base transition-colors shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Register Tooling/Die</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {mouldRecords.map((m) => (
                      <div
                        key={m.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          m.status === 'REFURBISHMENT_DUE'
                            ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                        } shadow-sm space-y-4`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-mono text-sm font-bold text-purple-600 dark:text-purple-400">
                              {m.mouldCode}
                            </span>
                            <h4 className="text-lg font-black mt-0.5">{m.mouldType}</h4>
                            <p className="text-xs text-slate-500">{m.allocatedLine} • {m.cavityCount} Cavities</p>
                          </div>
                          {m.status === 'REFURBISHMENT_DUE' ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-500/10 text-rose-600 border border-rose-500/30">
                              Refurbish Due
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              Active In-Line
                            </span>
                          )}
                        </div>

                        {/* Progress Bar of Shot Counts */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Shot Life Cycles</span>
                            <span className="font-bold">
                              {m.currentShotCount.toLocaleString()} / {m.maxShotLife.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full ${
                                m.remainingLifePercent <= 15
                                  ? 'bg-rose-500'
                                  : m.remainingLifePercent <= 30
                                  ? 'bg-amber-500'
                                  : 'bg-purple-600'
                              }`}
                              style={{ width: `${Math.min(100, 100 - m.remainingLifePercent)}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>Remaining Tool Life: {m.remainingLifePercent}%</span>
                            <span>Next Maint: {m.nextMaintenanceDue}</span>
                          </div>
                        </div>

                        <div className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700">
                          {m.notes || 'Cavity within dimensional micro-tolerance.'}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => handleIncrementShots(m.id)}
                            className="flex-1 py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-sm font-bold text-center transition-colors"
                          >
                            +5k Shots
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRefurbishMould(m.id)}
                            className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold text-center transition-colors"
                          >
                            Polish Cavity
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: THERMAL QUALITY IN-CHARGE */}
            {glassTab === 'thermal_quality' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-extrabold">Thermal Shock &amp; Optical Defect Inspection</h3>
                      <p className="text-base text-slate-500">
                        Administered by THERMAL_QUALITY_INCHARGE: bubbles, stones, warping flatness &amp; destructive quench stress tests.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsNewInspectionModal(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-colors shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Record Lot Inspection</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-base">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="py-3.5 px-4">Lot Number</th>
                          <th className="py-3.5 px-4">Product Type</th>
                          <th className="py-3.5 px-4">Bubbles / Seeds</th>
                          <th className="py-3.5 px-4">Warping Deviation</th>
                          <th className="py-3.5 px-4">Thermal Shock Test</th>
                          <th className="py-3.5 px-4">Lot Status</th>
                          <th className="py-3.5 px-4">Inspector Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {thermalInspections.map((insp) => (
                          <tr key={insp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="py-4 px-4 font-mono font-bold text-emerald-600">
                              {insp.lotNumber}
                            </td>
                            <td className="py-4 px-4 font-bold">
                              {insp.productType}
                              <div className="text-xs text-slate-400 font-normal">{insp.inspectedSampleCount} samples tested</div>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`font-extrabold ${insp.defectBubblesSeeds > 5 ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
                                {insp.defectBubblesSeeds} PPM
                              </span>
                            </td>
                            <td className="py-4 px-4 font-mono font-bold">
                              {insp.defectWarpingMm} mm
                            </td>
                            <td className="py-4 px-4">
                              {insp.thermalShockTestPassed ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> PASSED (ΔT {insp.thermalShockDeltaT}°C)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/10 text-rose-600 border border-rose-500/30">
                                  <AlertCircle className="w-3.5 h-3.5" /> FAILED (Quench Breakage)
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                                  insp.lotStatus === 'APPROVED'
                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                                    : insp.lotStatus === 'HOLD'
                                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                                    : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                                }`}
                              >
                                {insp.lotStatus}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-xs text-slate-500 max-w-xs truncate">
                              {insp.inspectorNotes}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: CULLET RECOVERY MANAGER */}
            {glassTab === 'cullet_recovery' && (
              <div className="space-y-6">
                {/* Environmental Savings Widget */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-cyan-500/10 border border-teal-500/20 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-extrabold text-sm uppercase tracking-wider">
                      <Recycle className="w-4 h-4" />
                      <span>Average Cullet Recovery Rate</span>
                    </div>
                    <div className="text-4xl font-black text-teal-600 dark:text-teal-400">96.18%</div>
                    <p className="text-xs text-slate-500">
                      Total scrap collected across Hot &amp; Cold ends returned into remelting feed.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span>Virgin Minerals Preserved</span>
                    </div>
                    <div className="text-4xl font-black text-blue-600">42.36 MT</div>
                    <p className="text-xs text-slate-400">
                      1 MT cullet replaces 1.2 MT silica sand, soda ash &amp; limestone mined.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>Furnace Energy Conserved</span>
                    </div>
                    <div className="text-4xl font-black text-amber-500">8,825 kWh</div>
                    <p className="text-xs text-slate-400">
                      Cullet melts at lower thermal energy vs batch virgin chemicals.
                    </p>
                  </div>
                </div>

                {/* Cullet Records Table */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-extrabold">Stage-Wise Rejection &amp; Mass Balance Reconciliation</h3>
                      <p className="text-base text-slate-500">
                        Administered by CULLET_RECOVERY_MANAGER: hot end shear rejects, cold end pack rejects &amp; mass balance loss.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsNewCulletModal(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-base transition-colors shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Log Shift Rejection &amp; Cullet</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-base">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="py-3.5 px-4">Record ID</th>
                          <th className="py-3.5 px-4">Line &amp; Shift</th>
                          <th className="py-3.5 px-4">Hot End Reject</th>
                          <th className="py-3.5 px-4">Cold End Reject</th>
                          <th className="py-3.5 px-4">Total Scrap</th>
                          <th className="py-3.5 px-4">Recovered Cullet</th>
                          <th className="py-3.5 px-4">Recovery %</th>
                          <th className="py-3.5 px-4">Mass Loss %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {culletRecords.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="py-4 px-4 font-mono font-bold text-teal-600">
                              {c.recordNumber}
                            </td>
                            <td className="py-4 px-4 font-bold">
                              {c.productionLine}
                              <div className="text-xs text-slate-400 font-normal">{c.shiftDate}</div>
                            </td>
                            <td className="py-4 px-4 text-orange-600 font-bold">
                              {c.hotEndRejectionWeight} MT
                            </td>
                            <td className="py-4 px-4 text-blue-600 font-bold">
                              {c.coldEndRejectionWeight} MT
                            </td>
                            <td className="py-4 px-4 font-black">
                              {c.totalRejectionWeight} MT
                            </td>
                            <td className="py-4 px-4 font-black text-emerald-600">
                              {c.recoveredCulletWeight} MT
                            </td>
                            <td className="py-4 px-4 font-black text-teal-600">
                              {c.recoveryPercentage}%
                            </td>
                            <td className="py-4 px-4 font-mono text-sm text-slate-500">
                              {c.massBalanceLossPercent}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* STEEL & HEAVY METALS SUB-CATEGORY CONTENT */}
        {/* ================================================================= */}
        {activeSector === 'STEEL' && (
          <div className="space-y-6">
            {/* Steel Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => setSteelTab('weighbridge')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                  steelTab === 'weighbridge'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>1. Weighbridge &amp; Logistics</span>
              </button>
              <button
                type="button"
                onClick={() => setSteelTab('metallurgy')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                  steelTab === 'metallurgy'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <FlaskConical className="w-4 h-4" />
                <span>2. Metallurgy Lab &amp; MTC</span>
              </button>
              <button
                type="button"
                onClick={() => setSteelTab('jobwork')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                  steelTab === 'jobwork'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>3. Subcontracting Job Work</span>
              </button>
              <button
                type="button"
                onClick={() => setSteelTab('ehs')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                  steelTab === 'ehs'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>4. EHS &amp; Hot Work Safety</span>
              </button>
            </div>

            {/* STEEL WEIGHBRIDGE */}
            {steelTab === 'weighbridge' && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-extrabold">Inbound &amp; Outbound Weighment Slips</h3>
                    <p className="text-base text-slate-500">
                      Tare &amp; Gross weight digital verification by WEIGHBRIDGE_LOGISTICS_MANAGER
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('New weighment slip modal opened.')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>New Weighbridge Slip</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-base">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-3.5 px-4">Slip #</th>
                        <th className="py-3.5 px-4">Truck &amp; Driver</th>
                        <th className="py-3.5 px-4">Supplier / Material</th>
                        <th className="py-3.5 px-4">Gross Weight</th>
                        <th className="py-3.5 px-4">Tare Weight</th>
                        <th className="py-3.5 px-4">Net Weight</th>
                        <th className="py-3.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {slips.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="py-4 px-4 font-mono font-bold text-blue-600">{s.slipNumber}</td>
                          <td className="py-4 px-4 font-extrabold">{s.truckNumber}</td>
                          <td className="py-4 px-4">{s.materialName}</td>
                          <td className="py-4 px-4 font-mono">{s.grossWeight} MT</td>
                          <td className="py-4 px-4 font-mono">{s.tareWeight} MT</td>
                          <td className="py-4 px-4 font-mono font-black text-emerald-600">{s.netWeight} MT</td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              {s.approvalStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* STEEL METALLURGY */}
            {steelTab === 'metallurgy' && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-extrabold">Spectrometer Chemistry &amp; MTC Generation</h3>
                    <p className="text-base text-slate-500">
                      Heat chemistry, tensile tests &amp; automated Material Test Certificates
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-base">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-3.5 px-4">Heat Number</th>
                        <th className="py-3.5 px-4">Grade</th>
                        <th className="py-3.5 px-4">Carbon (C%)</th>
                        <th className="py-3.5 px-4">Manganese (Mn%)</th>
                        <th className="py-3.5 px-4">Yield Strength</th>
                        <th className="py-3.5 px-4">Tensile Strength</th>
                        <th className="py-3.5 px-4">MTC Certificate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {heatTests.map((ht) => (
                        <tr key={ht.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="py-4 px-4 font-mono font-bold text-blue-600">{ht.heatNumber}</td>
                          <td className="py-4 px-4 font-bold">{ht.grade}</td>
                          <td className="py-4 px-4 font-mono">{ht.carbon}%</td>
                          <td className="py-4 px-4 font-mono">{ht.manganese}%</td>
                          <td className="py-4 px-4 font-mono font-bold text-emerald-600">{ht.yieldStrength} N/mm²</td>
                          <td className="py-4 px-4 font-mono font-bold">{ht.tensileStrength} N/mm²</td>
                          <td className="py-4 px-4">
                            <button
                              type="button"
                              onClick={() => setSelectedMtcHeat(ht)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-100"
                            >
                              <FileCheck2 className="w-4 h-4" />
                              <span>View MTC</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* STEEL JOBWORK */}
            {steelTab === 'jobwork' && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-xl font-extrabold">Subcontracting Challans &amp; Conversion Reconciliation</h3>
                <p className="text-base text-slate-500">
                  Input sent vs output received weight reconciliation and scrap tracking.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-base">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-3.5 px-4">Challan #</th>
                        <th className="py-3.5 px-4">Vendor</th>
                        <th className="py-3.5 px-4">Process</th>
                        <th className="py-3.5 px-4">Sent Weight</th>
                        <th className="py-3.5 px-4">Received Weight</th>
                        <th className="py-3.5 px-4">Loss/Gain %</th>
                        <th className="py-3.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {jobworkChallans.map((jw) => (
                        <tr key={jw.id}>
                          <td className="py-4 px-4 font-mono font-bold text-blue-600">{jw.challanNumber}</td>
                          <td className="py-4 px-4 font-bold">{jw.vendorName}</td>
                          <td className="py-4 px-4 text-sm">{jw.processType}</td>
                          <td className="py-4 px-4 font-mono">{jw.sentWeight} MT</td>
                          <td className="py-4 px-4 font-mono font-bold text-emerald-600">{jw.receivedWeight} MT</td>
                          <td className="py-4 px-4 font-mono font-bold text-blue-600">+{jw.lossGainPercentage}%</td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              {jw.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* STEEL EHS */}
            {steelTab === 'ehs' && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-xl font-extrabold">EHS Workplace Safety &amp; Electronic Hot Work Permits</h3>
                <p className="text-base text-slate-500">
                  Shop-floor hazard audits, induction bay hot work authorization, and statutory safety records.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-base">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-3.5 px-4">Record #</th>
                        <th className="py-3.5 px-4">Type</th>
                        <th className="py-3.5 px-4">Severity</th>
                        <th className="py-3.5 px-4">Plant Bay Location</th>
                        <th className="py-3.5 px-4">Hot Work Permit</th>
                        <th className="py-3.5 px-4">Compliance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {ehsRecords.map((ehs) => (
                        <tr key={ehs.id}>
                          <td className="py-4 px-4 font-mono font-bold text-rose-600">{ehs.recordNumber}</td>
                          <td className="py-4 px-4 font-bold">{ehs.incidentType}</td>
                          <td className="py-4 px-4">
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                              {ehs.severity}
                            </span>
                          </td>
                          <td className="py-4 px-4">{ehs.plantLocation}</td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-600">
                              <ShieldCheck className="w-4 h-4" /> APPROVED
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              {ehs.complianceStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* PROCESS & CHEMICAL SUB-CATEGORY CONTENT */}
        {/* ================================================================= */}
        {activeSector === 'CHEMICAL' && (
          <div className="space-y-6">
            {/* Chemical Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => setChemicalTab('rd_formula')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                  chemicalTab === 'rd_formula'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <FlaskConical className="w-4 h-4" />
                <span>1. R&amp;D Formula &amp; Stoichiometry</span>
              </button>
              <button
                type="button"
                onClick={() => setChemicalTab('ehs_hazmat')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                  chemicalTab === 'ehs_hazmat'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>2. EHS Hazmat &amp; Disposal</span>
              </button>
              <button
                type="button"
                onClick={() => setChemicalTab('qa_lab')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                  chemicalTab === 'qa_lab'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <FileCheck2 className="w-4 h-4" />
                <span>3. QA Analytical Lab &amp; CoA</span>
              </button>
              <button
                type="button"
                onClick={() => setChemicalTab('reactor_batch')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                  chemicalTab === 'reactor_batch'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>4. Reactor Cycles &amp; Utilities</span>
              </button>
              <button
                type="button"
                onClick={() => setChemicalTab('dangerous_goods')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                  chemicalTab === 'dangerous_goods'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>5. Dangerous Goods Logistics</span>
              </button>
            </div>

            {/* TAB 1: R&D FORMULA CHEMIST & STOICHIOMETRY */}
            {chemicalTab === 'rd_formula' && (
              <div className="space-y-6">
                {/* Header & New Formula Trigger */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-extrabold flex items-center gap-2">
                        <FlaskConical className="w-6 h-6 text-emerald-600" />
                        Master Synthesis Formulas &amp; Reaction Stoichiometry
                      </h3>
                      <p className="text-base text-slate-500">
                        Governed by RD_FORMULA_CHEMIST_MANAGER: Master formula versioning, stoichiometry equations, reactant molar ratios &amp; isolated yield calculations.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsNewChemFormulaModal(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-colors shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                      <span>New Formula Master</span>
                    </button>
                  </div>

                  {/* Stoichiometry & Theoretical Yield Interactive Calculator Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gauge className="w-5 h-5 text-emerald-600" />
                        <h4 className="text-base font-extrabold text-emerald-800 dark:text-emerald-300">
                          Stoichiometric Yield Calculator &amp; Mass Balance Equation
                        </h4>
                      </div>
                      <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                        Formula: (Actual Yield / Theoretical Yield) × 100
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Theoretical Maximum Yield (kg)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={calcTheoYield}
                          onChange={(e) => setCalcTheoYield(Number(e.target.value) || 1)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Actual Isolated Product Yield (kg)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={calcActualYield}
                          onChange={(e) => setCalcActualYield(Number(e.target.value) || 0)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold"
                        />
                      </div>
                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                        <span className="text-xs text-slate-400 font-bold block">Stoichiometric Isolated Yield %</span>
                        <div className="text-2xl font-black mt-0.5">
                          {calcTheoYield > 0 ? (
                            <span
                              className={
                                (calcActualYield / calcTheoYield) * 100 >= 90
                                  ? 'text-emerald-600'
                                  : (calcActualYield / calcTheoYield) * 100 >= 75
                                  ? 'text-amber-500'
                                  : 'text-rose-600'
                              }
                            >
                              {((calcActualYield / calcTheoYield) * 100).toFixed(2)}%
                            </span>
                          ) : (
                            '0%'
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-500">
                          {(calcActualYield / calcTheoYield) * 100 >= 90
                            ? 'Optimal Process Equilibrium'
                            : (calcActualYield / calcTheoYield) * 100 >= 75
                            ? 'Sub-Optimal Conversion'
                            : 'Reaction Loss Flagged'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Formula Masters Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                    {chemFormulas.map((f) => (
                      <div
                        key={f.id}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-emerald-500/50 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                                {f.formulaCode}
                              </span>
                              <span className="text-xs font-bold text-slate-500">{f.version}</span>
                            </div>
                            <h4 className="text-lg font-extrabold mt-1">{f.productName}</h4>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-black border ${
                              f.activeStatus === 'APPROVED'
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                                : 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                            }`}
                          >
                            {f.activeStatus}
                          </span>
                        </div>

                        {/* Stoichiometry Equation */}
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-sm text-emerald-800 dark:text-emerald-300 font-bold overflow-x-auto">
                          {f.stoichiometryEquation}
                        </div>

                        {/* Metrics Bar */}
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60">
                            <span className="text-xs text-slate-400 block">Theoretical Yield</span>
                            <span className="font-extrabold text-slate-800 dark:text-slate-200">{f.theoreticalYieldKg} kg</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60">
                            <span className="text-xs text-slate-400 block">Cycle Time</span>
                            <span className="font-extrabold text-slate-800 dark:text-slate-200">{f.expectedCycleTimeHours} hrs</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60">
                            <span className="text-xs text-slate-400 block">Hazard Class</span>
                            <span className="font-mono text-xs font-bold text-rose-600">{f.hazardClassification}</span>
                          </div>
                        </div>

                        {/* Reactants composition breakdown */}
                        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                          <span className="font-bold text-slate-700 dark:text-slate-300">Reaction Chemistry Notes:</span>
                          <p className="italic">{f.authorizationNotes}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          {f.activeStatus !== 'APPROVED' ? (
                            <button
                              type="button"
                              onClick={() => handleAuthorizeFormula(f.id, 'APPROVED')}
                              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold text-center transition-colors"
                            >
                              Authorize Formulation
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAuthorizeFormula(f.id, 'UNDER_REVIEW')}
                              className="flex-1 py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-sm font-bold text-center transition-colors"
                            >
                              Mark Under Review
                            </button>
                          )}
                          <a
                            href={f.safetyDataSheetUrl || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="py-2 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-sm font-bold text-slate-700 dark:text-slate-300 text-center transition-colors"
                          >
                            View SDS / MSDS
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: EHS HAZMAT & DISPOSAL MANIFESTS */}
            {chemicalTab === 'ehs_hazmat' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-extrabold flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6 text-rose-600" />
                        Hazardous Waste Disposal Manifests &amp; Safety Compliance
                      </h3>
                      <p className="text-base text-slate-500">
                        Governed by EHS_HAZMAT_MANAGER: UN waste classifications, CPCB Form 10 manifests, TSDF disposal records &amp; chemical handling PPE audits.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsNewHazmatModal(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-base transition-colors shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Log Waste Manifest</span>
                    </button>
                  </div>

                  {/* PPE Audit Scorecard Banner */}
                  <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3.5 rounded-2xl bg-rose-500/20 text-rose-700 dark:text-rose-300">
                        <ShieldCheck className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="text-xs uppercase font-extrabold tracking-wider text-rose-600">
                          Chemical Plant PPE Compliance Audit Score
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                          98.5% Compliant (Certified Safe)
                        </div>
                        <div className="text-xs text-slate-500">
                          Full-face organic vapor respirators, nitrile gloves, and chemical eyewash showers inspected today.
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                        SPCB Permit Active
                      </span>
                    </div>
                  </div>

                  {/* Hazmat Records Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-base">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="py-3.5 px-4">Manifest #</th>
                          <th className="py-3.5 px-4">Waste Type</th>
                          <th className="py-3.5 px-4">UN Class</th>
                          <th className="py-3.5 px-4">CPCB Category</th>
                          <th className="py-3.5 px-4">Quantity</th>
                          <th className="py-3.5 px-4">Disposal Method</th>
                          <th className="py-3.5 px-4">Permit Number</th>
                          <th className="py-3.5 px-4">PPE Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {hazmatRecords.map((hz) => (
                          <tr key={hz.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="py-4 px-4 font-mono font-bold text-rose-600">
                              {hz.manifestNumber}
                            </td>
                            <td className="py-4 px-4 font-bold">{hz.wasteType}</td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                {hz.unClassification}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm font-medium">{hz.wasteCategoryCpcb}</td>
                            <td className="py-4 px-4 font-black">
                              {hz.quantityLtrOrKg} {hz.unit}
                            </td>
                            <td className="py-4 px-4 text-sm">{hz.disposalMethod}</td>
                            <td className="py-4 px-4 font-mono text-xs text-slate-500">{hz.handlingPermitNumber}</td>
                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                                  hz.ppeComplianceStatus === 'COMPLIANT'
                                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                                    : 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                                }`}
                              >
                                {hz.ppeComplianceStatus === 'COMPLIANT' ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                  <AlertCircle className="w-3.5 h-3.5" />
                                )}
                                {hz.ppeComplianceStatus} ({hz.ppeAuditScore}%)
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

            {/* TAB 3: QA ANALYTICAL LAB & CERTIFICATE OF ANALYSIS */}
            {chemicalTab === 'qa_lab' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-extrabold flex items-center gap-2">
                        <FileCheck2 className="w-6 h-6 text-blue-600" />
                        QA Analytical Lab Assays &amp; Certificate of Analysis (CoA)
                      </h3>
                      <p className="text-base text-slate-500">
                        Governed by QA_ANALYTICAL_LAB_MANAGER: Gas Chromatography purity assay, pH, Karl Fischer moisture titration &amp; automated dispatch clearance gate.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsNewLabTestModal(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition-colors shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Upload Lab Assay</span>
                    </button>
                  </div>

                  {/* CRITICAL GATE LOCKOUT CALLOUT */}
                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-sm space-y-1">
                    <div className="flex items-center gap-2 font-black text-blue-800 dark:text-blue-300">
                      <ShieldCheck className="w-5 h-5" />
                      Automated Quality Dispatch Gate Policy:
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      Batches failing Purity (min 98.0%), pH (6.0 - 8.5), or Moisture (max 0.50% Karl Fischer) are strictly blocked from dispatch. No vehicle gate pass or Certificate of Analysis (CoA) will be issued until re-processed.
                    </p>
                  </div>

                  {/* Lab Tests Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-base">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="py-3.5 px-4">Test ID / Batch</th>
                          <th className="py-3.5 px-4">Product Name</th>
                          <th className="py-3.5 px-4">Purity Assay (%)</th>
                          <th className="py-3.5 px-4">pH Level</th>
                          <th className="py-3.5 px-4">Moisture (KF %)</th>
                          <th className="py-3.5 px-4">Density (g/mL)</th>
                          <th className="py-3.5 px-4">Dispatch Clearance</th>
                          <th className="py-3.5 px-4">Official Certificate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {labTests.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="py-4 px-4 font-mono font-bold text-blue-600">
                              {t.testId}
                              <div className="text-xs text-slate-500">{t.batchNumber}</div>
                            </td>
                            <td className="py-4 px-4 font-bold">
                              {t.productName}
                              <div className="text-xs text-slate-400 font-normal">{t.sampleSource}</div>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`font-black ${t.purityPercent >= 98.0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {t.purityPercent}%
                              </span>
                              <div className="text-xs text-slate-400 font-normal">Spec: ≥ 98.0%</div>
                            </td>
                            <td className="py-4 px-4 font-bold">
                              <span className={t.phLevel >= 6.0 && t.phLevel <= 8.5 ? 'text-slate-800 dark:text-slate-200' : 'text-rose-600'}>
                                {t.phLevel}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-bold">
                              <span className={t.moistureWaterPercent <= 0.50 ? 'text-emerald-600' : 'text-rose-600'}>
                                {t.moistureWaterPercent}%
                              </span>
                              <div className="text-xs text-slate-400 font-normal">Spec: ≤ 0.50%</div>
                            </td>
                            <td className="py-4 px-4 font-mono">{t.densityGml || '0.902'}</td>
                            <td className="py-4 px-4">
                              {t.dispatchCleared ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> CLEARED
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/10 text-rose-600 border border-rose-500/30 animate-pulse">
                                  <AlertTriangle className="w-3.5 h-3.5" /> BLOCKED
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              {t.dispatchCleared && t.coaDocumentNumber ? (
                                <button
                                  type="button"
                                  onClick={() => setSelectedCoaTest(t)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 text-xs font-bold transition-colors border border-blue-500/30"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                  <span>View CoA</span>
                                </button>
                              ) : (
                                <span className="text-xs text-rose-500 font-bold">Gate Pass Withheld</span>
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

            {/* TAB 4: REACTOR BATCH CYCLES & UTILITIES */}
            {chemicalTab === 'reactor_batch' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-extrabold flex items-center gap-2">
                        <Activity className="w-6 h-6 text-amber-600" />
                        Reactor Batch Cycles &amp; Utility Duty Monitoring
                      </h3>
                      <p className="text-base text-slate-500">
                        Governed by REACTOR_BATCH_PRODUCTION_MANAGER: Multi-stage reaction progression, steam consumption, cooling water circulation &amp; downtime tracking.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsNewReactorModal(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base transition-colors shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                      <span>New Reactor Cycle</span>
                    </button>
                  </div>

                  {/* 7-Stage Progression Legend */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                      Standard 7-Stage Batch Chemical Reactor Cycle
                    </span>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                      {['CHARGING', 'REACTION', 'REFLUX', 'DISTILLATION', 'COOLING', 'DISCHARGING', 'COMPLETED'].map((stg, i) => (
                        <span key={stg} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border">
                          <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">
                            {i + 1}
                          </span>
                          {stg}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Reactor Cards Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                    {reactorCycles.map((rc) => (
                      <div
                        key={rc.id}
                        className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 hover:border-amber-500/50 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                                {rc.batchCode}
                              </span>
                              <span className="text-xs text-slate-400">{rc.cycleStartTime}</span>
                            </div>
                            <h4 className="text-lg font-extrabold mt-1">{rc.productName}</h4>
                            <p className="text-sm font-semibold text-slate-500">{rc.reactorId}</p>
                          </div>
                          <span className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                            STAGE: {rc.currentStage}
                          </span>
                        </div>

                        {/* Yield Performance Bar */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm font-bold">
                            <span>Isolated Yield Progress</span>
                            <span className="text-amber-600 font-extrabold">
                              {rc.actualYieldKg} kg / {rc.targetYieldKg} kg ({rc.yieldPercentage}%)
                            </span>
                          </div>
                          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-amber-500 transition-all duration-500 rounded-full"
                              style={{ width: `${Math.min(100, rc.yieldPercentage)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Real-Time Utility Duties */}
                        <div className="grid grid-cols-3 gap-2.5 text-center text-sm">
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60">
                            <span className="text-xs text-slate-400 block">Steam Duty</span>
                            <span className="font-extrabold text-slate-800 dark:text-slate-200">{rc.steamConsumptionKg} kg</span>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60">
                            <span className="text-xs text-slate-400 block">Chilled Water</span>
                            <span className="font-extrabold text-slate-800 dark:text-slate-200">{rc.coolingWaterM3} m³</span>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60">
                            <span className="text-xs text-slate-400 block">Power Duty</span>
                            <span className="font-extrabold text-slate-800 dark:text-slate-200">{rc.powerConsumptionKwh} kWh</span>
                          </div>
                        </div>

                        {/* Downtime Alert */}
                        {rc.downtimeHours > 0 && (
                          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-700 dark:text-rose-300 font-medium flex items-center justify-between">
                            <span>Equipment Downtime: {rc.downtimeHours}h</span>
                            <span className="italic">{rc.downtimeReason}</span>
                          </div>
                        )}

                        <div className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700">
                          {rc.stageRemarks}
                        </div>

                        {/* Stage Controls */}
                        <div className="flex items-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => handleAdvanceReactorStage(rc.id, rc.currentStage)}
                            disabled={rc.currentStage === 'COMPLETED'}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-sm font-bold text-center transition-colors shadow-sm"
                          >
                            {rc.currentStage === 'COMPLETED' ? 'Cycle Completed' : 'Advance to Next Stage'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLogDowntime(rc.id)}
                            className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors"
                          >
                            Log Downtime
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: DANGEROUS GOODS LOGISTICS & TREMCARDS */}
            {chemicalTab === 'dangerous_goods' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-extrabold flex items-center gap-2">
                        <Truck className="w-6 h-6 text-purple-600" />
                        Dangerous Goods Logistics &amp; Transport Emergency Cards (Tremcard)
                      </h3>
                      <p className="text-base text-slate-500">
                        Governed by HAZARDOUS_LOGISTICS_MANAGER: UN classification numbering, Hazchem emergency codes, ADR tanker fitness &amp; commercial driver Hazmat endorsement verification.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsNewDangerousGoodsModal(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-base transition-colors shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                      <span>New Dangerous Goods Dispatch</span>
                    </button>
                  </div>

                  {/* Driver Endorsement Compliance Gate Callout */}
                  <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-sm space-y-1">
                    <div className="flex items-center gap-2 font-black text-purple-800 dark:text-purple-300">
                      <ShieldCheck className="w-5 h-5" />
                      PESO &amp; Statutory Motor Transport Compliance Gate:
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      All hazardous chemical dispatches require commercial drivers with valid dangerous goods endorsements and a physical Tremcard. Tankers driven by uncertified drivers are automatically held at the factory security gate.
                    </p>
                  </div>

                  {/* Dangerous Goods Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-base">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="py-3.5 px-4">Tracking # / Batch</th>
                          <th className="py-3.5 px-4">Shipping Description</th>
                          <th className="py-3.5 px-4">UN Number</th>
                          <th className="py-3.5 px-4">Hazchem Code</th>
                          <th className="py-3.5 px-4">Tanker / Vehicle</th>
                          <th className="py-3.5 px-4">Driver &amp; License</th>
                          <th className="py-3.5 px-4">Gate Clearance</th>
                          <th className="py-3.5 px-4">Tremcard</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {dangerousGoods.map((dg) => (
                          <tr key={dg.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="py-4 px-4 font-mono font-bold text-purple-600">
                              {dg.dispatchTrackingNumber}
                              <div className="text-xs text-slate-500">{dg.batchNumber}</div>
                            </td>
                            <td className="py-4 px-4 font-bold">
                              {dg.productName}
                              <div className="text-xs text-slate-400 font-normal">{dg.properShippingName}</div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-black bg-amber-500/10 text-amber-600 border border-amber-500/30">
                                {dg.unNumber}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-mono font-bold">
                              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border">
                                {dg.hazchemCode}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm font-semibold">{dg.vehicleRegistrationNumber}</td>
                            <td className="py-4 px-4">
                              <div className="font-bold">{dg.driverName}</div>
                              <div className="text-xs font-mono text-slate-400">{dg.driverLicenseNumber}</div>
                            </td>
                            <td className="py-4 px-4">
                              {dg.routeClearanceStatus === 'APPROVED' ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> APPROVED
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/10 text-rose-600 border border-rose-500/30 animate-pulse">
                                  <AlertTriangle className="w-3.5 h-3.5" /> EXPIRED_HOLD
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              {dg.tremcardIssued && dg.tremcardDocumentNumber ? (
                                <button
                                  type="button"
                                  onClick={() => setSelectedTremcard(dg)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 text-xs font-bold transition-colors border border-purple-500/30"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>View Card</span>
                                </button>
                              ) : (
                                <span className="text-xs text-slate-400">Not Issued</span>
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
          </div>
        )}

        {/* ================================================================= */}
        {/* PAINT & COATINGS SUB-CATEGORY CONTENT */}
        {/* ================================================================= */}
        {activeSector === 'PAINT' && (
          <div className="space-y-6">
            {/* Paint Operational Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => setPaintTab('color_shade')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                  paintTab === 'color_shade'
                    ? 'bg-fuchsia-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>1. Color Lab &amp; Shade Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setPaintTab('dispersion_mill')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                  paintTab === 'dispersion_mill'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>2. Pigment &amp; Resin Dispersion</span>
              </button>
              <button
                type="button"
                onClick={() => setPaintTab('rheology_qc')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                  paintTab === 'rheology_qc'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <FlaskConical className="w-4 h-4" />
                <span>3. Rheology QC &amp; CoA Lock</span>
              </button>
              <button
                type="button"
                onClick={() => setPaintTab('base_tinting')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                  paintTab === 'base_tinting'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <Droplet className="w-4 h-4" />
                <span>4. Base Stocks &amp; Auto-Tinting</span>
              </button>
              <button
                type="button"
                onClick={() => setPaintTab('packaging_voc')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                  paintTab === 'packaging_voc'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <Box className="w-4 h-4" />
                <span>5. Flammable Packaging &amp; VOC Safety</span>
              </button>
            </div>

            {/* TAB 1: COLOR LAB & SHADE CARDS (COLOR_LAB_SHADE_MANAGER) */}
            {paintTab === 'color_shade' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-extrabold flex items-center gap-2">
                        <Palette className="w-6 h-6 text-fuchsia-600" />
                        Master Shade Cards &amp; Spectrophotometer CIELAB Delta E Matching
                      </h3>
                      <p className="text-base text-slate-500">
                        Governed by COLOR_LAB_SHADE_MANAGER: Master shade cards, spectrophotometer CIELAB colorimeters, custom color tinting formula sign-off &amp; ΔE ≤ 0.50 tolerance enforcement.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsNewPaintShadeModal(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-base transition-colors shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                      <span>New Shade Master</span>
                    </button>
                  </div>

                  {/* Interactive Spectrophotometer CIELAB Delta E Calculator Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-fuchsia-500/10 via-purple-500/10 to-indigo-500/10 border border-fuchsia-500/30 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Gauge className="w-5 h-5 text-fuchsia-600" />
                        <h4 className="text-base font-extrabold text-fuchsia-900 dark:text-fuchsia-300">
                          Spectrophotometer CIELAB (L*, a*, b*) Delta E Color Difference Engine
                        </h4>
                      </div>
                      <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-300">
                        Formula: ΔE = √[(ΔL*)² + (Δa*)² + (Δb*)²] ≤ 0.50
                      </span>
                    </div>

                    {(() => {
                      const curTarget = paintShades.find(
                        (s) => s.shadeCode === selectedShadeForDeltaE || s.id === selectedShadeForDeltaE
                      ) || paintShades[0];
                      const dL = sampleSpectroL - curTarget.spectroL;
                      const da = sampleSpectroA - curTarget.spectroA;
                      const db = sampleSpectroB - curTarget.spectroB;
                      const totalDeltaE = Math.sqrt(dL * dL + da * da + db * db);
                      const isWithinSpec = totalDeltaE <= curTarget.targetDeltaETolerance;

                      return (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                                Target Master Shade
                              </label>
                              <select
                                value={selectedShadeForDeltaE}
                                onChange={(e) => setSelectedShadeForDeltaE(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold"
                              >
                                {paintShades.map((s) => (
                                  <option key={s.id} value={s.shadeCode}>
                                    {s.shadeCode} - {s.shadeName}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                                Sample Lightness L* (Target: {curTarget.spectroL})
                              </label>
                              <input
                                type="number"
                                step="0.05"
                                value={sampleSpectroL}
                                onChange={(e) => setSampleSpectroL(Number(e.target.value) || 0)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                                Sample a* Red/Green (Target: {curTarget.spectroA})
                              </label>
                              <input
                                type="number"
                                step="0.05"
                                value={sampleSpectroA}
                                onChange={(e) => setSampleSpectroA(Number(e.target.value) || 0)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                                Sample b* Blue/Yellow (Target: {curTarget.spectroB})
                              </label>
                              <input
                                type="number"
                                step="0.05"
                                value={sampleSpectroB}
                                onChange={(e) => setSampleSpectroB(Number(e.target.value) || 0)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold font-mono"
                              />
                            </div>
                          </div>

                          {/* Delta E Result Display Banner */}
                          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="space-y-0.5">
                                <span className="text-xs text-slate-400 font-bold block">Delta Coordinate Shifts</span>
                                <div className="text-sm font-mono text-slate-700 dark:text-slate-300 font-bold">
                                  ΔL*: {dL > 0 ? `+${dL.toFixed(2)}` : dL.toFixed(2)} | Δa*: {da > 0 ? `+${da.toFixed(2)}` : da.toFixed(2)} | Δb*: {db > 0 ? `+${db.toFixed(2)}` : db.toFixed(2)}
                                </div>
                              </div>
                              <div className="border-l border-slate-200 dark:border-slate-700 pl-4">
                                <span className="text-xs text-slate-400 font-bold block">Total Color Difference (ΔE)</span>
                                <div className="text-2xl font-black font-mono">
                                  <span className={isWithinSpec ? 'text-emerald-600' : 'text-rose-600'}>
                                    ΔE = {totalDeltaE.toFixed(3)}
                                  </span>
                                  <span className="text-xs text-slate-400 font-normal ml-2">
                                    (Tolerance: ≤ {curTarget.targetDeltaETolerance.toFixed(2)})
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              {isWithinSpec ? (
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                                  <CheckCircle2 className="w-4 h-4" /> SHADE WITHIN TOLERANCE (PASS)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-rose-500/10 text-rose-600 border border-rose-500/30 animate-pulse">
                                  <AlertTriangle className="w-4 h-4" /> EXCEEDS TOLERANCE - TINTING RE-SHOT REQUIRED
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Registered Master Shade Cards Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-base">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="py-3.5 px-4">Shade Code</th>
                          <th className="py-3.5 px-4">Shade Name &amp; Family</th>
                          <th className="py-3.5 px-4">Required Base</th>
                          <th className="py-3.5 px-4">Target CIELAB (L*, a*, b*)</th>
                          <th className="py-3.5 px-4">ΔE Limit</th>
                          <th className="py-3.5 px-4">Tinting Formula Shots</th>
                          <th className="py-3.5 px-4">Lab Approval</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {paintShades.map((s) => (
                          <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="py-4 px-4 font-mono font-bold text-fuchsia-600">{s.shadeCode}</td>
                            <td className="py-4 px-4">
                              <div className="font-extrabold">{s.shadeName}</div>
                              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">
                                {s.colorFamily}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-mono text-sm font-bold text-slate-700 dark:text-slate-300">
                              {s.baseTypeRequired}
                            </td>
                            <td className="py-4 px-4 font-mono text-sm">
                              L*: {s.spectroL} | a*: {s.spectroA} | b*: {s.spectroB}
                            </td>
                            <td className="py-4 px-4 font-mono font-bold text-emerald-600">
                              ≤ {s.targetDeltaETolerance.toFixed(2)}
                            </td>
                            <td className="py-4 px-4 font-mono text-xs text-slate-600 dark:text-slate-400 max-w-xs truncate" title={s.customTintingFormulaJson}>
                              {s.customTintingFormulaJson}
                            </td>
                            <td className="py-4 px-4">
                              {s.formulaApproved ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/30">
                                  Under Review
                                </span>
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

            {/* TAB 2: PIGMENT & RESIN DISPERSION GRINDING (PIGMENT_RESIN_DISPERSION_MANAGER) */}
            {paintTab === 'dispersion_mill' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-extrabold flex items-center gap-2">
                        <RefreshCw className="w-6 h-6 text-indigo-600" />
                        Sand &amp; Bead Mill Dispersion Grinding Batches
                      </h3>
                      <p className="text-base text-slate-500">
                        Governed by PIGMENT_RESIN_DISPERSION_MANAGER: Bead mill grinding cycle run-hours, 5-stage loading sequence (Resin → Solvent → Wetting Additive → Pigment → Extender), mill base KU viscosity &amp; cooling jacket temperature.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsNewDispersionModal(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base transition-colors shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                      <span>New Dispersion Batch</span>
                    </button>
                  </div>

                  {/* 5-Stage Raw Material Loading Sequence Indicator Card */}
                  <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block">
                      Enforced 5-Stage Premix Loading Sequence Protocol
                    </span>
                    <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold">
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-indigo-500/30 text-indigo-600">
                        1. Resins &amp; Varnishes
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-indigo-500/30 text-indigo-600">
                        2. Solvents &amp; Thinners
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-indigo-500/30 text-indigo-600">
                        3. Wetting &amp; Dispersing Agents
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-indigo-500/30 text-indigo-600">
                        4. Prime Pigments (TiO2)
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-indigo-500/30 text-indigo-600">
                        5. Extenders (Barytes/Calcite)
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-base">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="py-3.5 px-4">Batch Code</th>
                          <th className="py-3.5 px-4">Equipment &amp; Mill ID</th>
                          <th className="py-3.5 px-4">Product &amp; Resin System</th>
                          <th className="py-3.5 px-4">Viscosity (Target vs Act)</th>
                          <th className="py-3.5 px-4">5-Stage Sequence</th>
                          <th className="py-3.5 px-4">Mill Run-Hours</th>
                          <th className="py-3.5 px-4">Cooling Jacket</th>
                          <th className="py-3.5 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {dispersionBatches.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="py-4 px-4 font-mono font-bold text-indigo-600">{b.batchCode}</td>
                            <td className="py-4 px-4">
                              <div className="font-extrabold">{b.millId}</div>
                              <span className="text-xs text-slate-500">{b.grindingDurationMinutes} min grinding cycle</span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-bold">{b.productName}</div>
                              <div className="text-xs text-slate-500">{b.resinType} | {b.pigmentType}</div>
                            </td>
                            <td className="py-4 px-4 font-mono font-bold">
                              <span>{b.currentViscosityKu} KU</span>
                              <span className="text-xs text-slate-400 block font-normal">Target: {b.targetViscosityKu} KU</span>
                            </td>
                            <td className="py-4 px-4">
                              {b.loadingSequenceCompleted ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> 5-Stages Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/30">
                                  Sequence Pending
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4 font-mono text-sm font-bold">{b.beadMillRunHours} hrs</td>
                            <td className="py-4 px-4 font-mono text-sm text-cyan-600 font-bold">{b.coolingWaterTempCelsius}°C</td>
                            <td className="py-4 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                b.dispersionStatus === 'COMPLETED'
                                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                                  : 'bg-blue-500/10 text-blue-600 border border-blue-500/30'
                              }`}>
                                {b.dispersionStatus}
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

            {/* TAB 3: QUALITY RHEOLOGY & STRICT PACKAGING GATE (QUALITY_RHEOLOGY_MANAGER) */}
            {paintTab === 'rheology_qc' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-extrabold flex items-center gap-2">
                        <FlaskConical className="w-6 h-6 text-cyan-600" />
                        Rheology Lab Parameters &amp; Automated Packaging Gate
                      </h3>
                      <p className="text-base text-slate-500">
                        Governed by QUALITY_RHEOLOGY_MANAGER: Stormer Krebs Viscosity (85–115 KU), Density, Hegman Grind Fineness (≤25 µm), Drying Times &amp; Strict Canning Gate Locks.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsNewRheologyModal(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-base transition-colors shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Upload Rheology Test</span>
                    </button>
                  </div>

                  {/* Strict Quality Gate Callout Card */}
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-amber-900 dark:text-amber-300 block">
                        Strict QC Packaging Gate Rules (IS 15489 &amp; ASTM D562)
                      </span>
                      <span>
                        Batches with Krebs Viscosity &lt; 85 KU or &gt; 115 KU, Hegman Fineness &gt; 25.0 µm, or Touch Dry &gt; 60 min are automatically blocked from canning lines. Certificate of Analysis (CoA) generation is locked until full clearance.
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-base">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="py-3.5 px-4">Test ID &amp; Batch #</th>
                          <th className="py-3.5 px-4">Product Name</th>
                          <th className="py-3.5 px-4">Krebs Viscosity</th>
                          <th className="py-3.5 px-4">Density (g/mL)</th>
                          <th className="py-3.5 px-4">Hegman Fineness</th>
                          <th className="py-3.5 px-4">Touch / Hard Dry</th>
                          <th className="py-3.5 px-4">Gloss 60°</th>
                          <th className="py-3.5 px-4">Packaging Gate</th>
                          <th className="py-3.5 px-4">Certificate of Analysis</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {rheologyTests.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="py-4 px-4 font-mono font-bold text-cyan-600">
                              <div>{t.testId}</div>
                              <span className="text-xs text-slate-500">{t.batchNumber}</span>
                            </td>
                            <td className="py-4 px-4 font-bold">{t.productName}</td>
                            <td className="py-4 px-4 font-mono font-bold">
                              <span className={t.krebsViscosityKu >= 85 && t.krebsViscosityKu <= 115 ? 'text-emerald-600' : 'text-rose-600'}>
                                {t.krebsViscosityKu} KU
                              </span>
                            </td>
                            <td className="py-4 px-4 font-mono text-sm">{t.densityGml}</td>
                            <td className="py-4 px-4 font-mono font-bold">
                              <span className={t.hegmanFinenessMicrons <= 25 ? 'text-emerald-600' : 'text-rose-600'}>
                                {t.hegmanFinenessMicrons} µm
                              </span>
                            </td>
                            <td className="py-4 px-4 font-mono text-xs">
                              {t.touchDryMinutes}m / {t.hardDryMinutes}m
                            </td>
                            <td className="py-4 px-4 font-mono text-sm">{t.glossLevel60Deg ?? 88.5} GU</td>
                            <td className="py-4 px-4">
                              {t.packagingCleared ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> CLEARED
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/10 text-rose-600 border border-rose-500/30 animate-pulse">
                                  <AlertTriangle className="w-3.5 h-3.5" /> GATE LOCKED
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              {t.packagingCleared && t.coaDocumentNumber ? (
                                <button
                                  type="button"
                                  onClick={() => setSelectedPaintCoa(t)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20 text-xs font-bold transition-colors border border-cyan-500/30"
                                >
                                  <FileCheck2 className="w-3.5 h-3.5" />
                                  <span>View CoA</span>
                                </button>
                              ) : (
                                <span className="text-xs text-rose-500 font-bold">Blocked</span>
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

            {/* TAB 4: BULK BASE STOCK & AUTOMATIC TINTING (BASE_STOCK_TINTING_MANAGER) */}
            {paintTab === 'base_tinting' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-extrabold flex items-center gap-2">
                        <Droplet className="w-6 h-6 text-amber-600" />
                        Bulk Base Stock Tanks &amp; Automatic Dispenser Tinting
                      </h3>
                      <p className="text-base text-slate-500">
                        Governed by BASE_STOCK_TINTING_MANAGER: Bulk base paint inventory (Base White, Deep Base, Clear Base), automatic colorant dispenser shots &amp; consumption reconciliation.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsNewBaseTintingModal(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base transition-colors shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Log Base Dispense</span>
                    </button>
                  </div>

                  {/* Bulk Tank Inventory Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="text-xs text-slate-400 font-bold block">Base White Tank (BT-101)</span>
                      <div className="text-xl font-black mt-1">12,450 L / 15,000 L</div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: '83%' }}></div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="text-xs text-slate-400 font-bold block">Deep Base Tank (BT-102)</span>
                      <div className="text-xl font-black mt-1">6,800 L / 10,000 L</div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="text-xs text-slate-400 font-bold block">Clear Base Tank (BT-103)</span>
                      <div className="text-xl font-black mt-1">6,240 L / 8,000 L</div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="text-xs text-slate-400 font-bold block">Auto-Dispenser Canister Rig</span>
                      <div className="text-xl font-black text-emerald-600 mt-1">16 Circuits Calibrated</div>
                      <span className="text-xs text-slate-500 mt-2 block font-medium">Load-cell variance: ±0.08% OK</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-base">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="py-3.5 px-4">Tracking #</th>
                          <th className="py-3.5 px-4">Base Tank &amp; Type</th>
                          <th className="py-3.5 px-4">Dispenser ID</th>
                          <th className="py-3.5 px-4">Volume</th>
                          <th className="py-3.5 px-4">Colorant Shots (mL)</th>
                          <th className="py-3.5 px-4">Reconciliation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {baseTintings.map((bt) => (
                          <tr key={bt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="py-4 px-4 font-mono font-bold text-amber-600">{bt.dispenseTrackingNumber}</td>
                            <td className="py-4 px-4">
                              <div className="font-extrabold">{bt.baseTankId}</div>
                              <span className="text-xs font-bold text-slate-500">{bt.baseType}</span>
                            </td>
                            <td className="py-4 px-4 font-bold text-sm">{bt.dispenserMachineId}</td>
                            <td className="py-4 px-4 font-mono font-bold">{bt.targetVolumeLtr} L</td>
                            <td className="py-4 px-4 font-mono text-xs">
                              W: {bt.colorantWhiteMl}ml | K: {bt.colorantBlackMl}ml | B: {bt.colorantPhthaloBlueMl}ml | Y: {bt.colorantYellowOxideMl}ml
                            </td>
                            <td className="py-4 px-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                                <CheckCircle2 className="w-3.5 h-3.5" /> RECONCILED (±{bt.variancePercentage}%)
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

            {/* TAB 5: FLAMMABLE PACKAGING & VOC SAFETY (FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER) */}
            {paintTab === 'packaging_voc' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-extrabold flex items-center gap-2">
                        <Box className="w-6 h-6 text-rose-600" />
                        Flammable Solvent Packaging &amp; VOC Compliance Gate
                      </h3>
                      <p className="text-base text-slate-500">
                        Governed by FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER: Standard containers (1L, 4L, 10L, 20L), batch inkjet code printing, anti-static bonding verification &amp; statutory VOC limits (≤50 g/L).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsNewPackagingModal(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-base transition-colors shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Log Packaging Run</span>
                    </button>
                  </div>

                  {/* Safety & Compliance Metrics Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                      <ShieldCheck className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-slate-500 block">Anti-Static Grounding Continuity</span>
                        <div className="text-lg font-black text-emerald-700 dark:text-emerald-300">100% Earthing Verified</div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center gap-3">
                      <Gauge className="w-8 h-8 text-blue-600 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-slate-500 block">VOC Regulatory Compliance</span>
                        <div className="text-lg font-black text-blue-700 dark:text-blue-300">≤ 50 g/L (Green Spec)</div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-3">
                      <Box className="w-8 h-8 text-purple-600 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-slate-500 block">Standard Sizes Packaged</span>
                        <div className="text-lg font-black text-purple-700 dark:text-purple-300">1L, 4L, 10L, 20L Cans</div>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-base">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="py-3.5 px-4">Lot # &amp; Batch #</th>
                          <th className="py-3.5 px-4">Product Name</th>
                          <th className="py-3.5 px-4">Size &amp; Container</th>
                          <th className="py-3.5 px-4">Quantity</th>
                          <th className="py-3.5 px-4">Batch Code Inkjet Imprint</th>
                          <th className="py-3.5 px-4">VOC Content</th>
                          <th className="py-3.5 px-4">Anti-Static</th>
                          <th className="py-3.5 px-4">Compliance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {packagingCompliances.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="py-4 px-4 font-mono font-bold text-rose-600">
                              <div>{p.packLotNumber}</div>
                              <span className="text-xs text-slate-500">{p.batchNumber}</span>
                            </td>
                            <td className="py-4 px-4 font-bold">{p.productName}</td>
                            <td className="py-4 px-4 font-mono font-bold">
                              <span>{p.containerSize}</span>
                              <span className="text-xs text-slate-400 block font-normal">{p.containerType}</span>
                            </td>
                            <td className="py-4 px-4 font-mono font-bold">{p.quantityContainers} units</td>
                            <td className="py-4 px-4 font-mono text-xs text-slate-600 dark:text-slate-400 max-w-xs truncate" title={p.batchCodePrinted}>
                              {p.batchCodePrinted}
                            </td>
                            <td className="py-4 px-4 font-mono font-bold">
                              <span className={p.vocContentGramsPerLiter <= 50 ? 'text-emerald-600' : 'text-rose-600'}>
                                {p.vocContentGramsPerLiter} g/L
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              {p.antiStaticBondingVerified ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Grounded
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                                  <AlertTriangle className="w-3.5 h-3.5" /> Hazard
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                p.complianceSignOff === 'COMPLIANT'
                                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                                  : 'bg-rose-500/10 text-rose-600 border border-rose-500/30'
                              }`}>
                                {p.complianceSignOff}
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
          </div>
        )}
      </main>

      {/* ================================================================= */}
      {/* MODAL: CREATE BATCH FORMULA */}
      {/* ================================================================= */}
      {isNewFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">New Batch Formulation</h3>
                  <p className="text-sm text-slate-500">Calculate weights and recycled cullet ratio</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewFormulaModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddBatchFormula} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Recipe Name</label>
                  <input
                    name="batchName"
                    required
                    placeholder="e.g. Clear Float Glass 5mm"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Glass/Ceramic Type</label>
                  <select
                    name="glassType"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  >
                    <option value="Float Glass">Float Glass</option>
                    <option value="Container Glass">Container Glass</option>
                    <option value="Borosilicate">Borosilicate</option>
                    <option value="Ceramic Porcelain">Ceramic Porcelain Tile</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Silica Sand (kg)</label>
                  <input
                    name="silica"
                    type="number"
                    defaultValue="1000"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Soda Ash (kg)</label>
                  <input
                    name="soda"
                    type="number"
                    defaultValue="320"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Limestone (kg)</label>
                  <input
                    name="lime"
                    type="number"
                    defaultValue="220"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Feldspar (kg)</label>
                  <input
                    name="feldspar"
                    type="number"
                    defaultValue="60"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Dolomite (kg)</label>
                  <input
                    name="dolomite"
                    type="number"
                    defaultValue="180"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cyan-600 mb-1">Recycled Cullet (kg)</label>
                  <input
                    name="cullet"
                    type="number"
                    defaultValue="650"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-cyan-400 dark:border-cyan-600 bg-cyan-500/10 font-bold text-base"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewFormulaModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-base font-bold transition-colors shadow-sm"
                >
                  Save Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: LOG KILN TELEMETRY */}
      {/* ================================================================= */}
      {isNewKilnLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">Log Furnace Telemetry</h3>
                  <p className="text-sm text-slate-500">Record temperatures, crown pressure, and gas burn</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewKilnLogModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddKilnLog} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Furnace ID</label>
                  <input
                    name="furnaceId"
                    defaultValue="MELTER-LINE-01"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Crown Pressure (mmWG)</label>
                  <input
                    name="crownPressure"
                    type="number"
                    step="0.1"
                    defaultValue="1.8"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-red-500 mb-1">Melting Zone (°C)</label>
                  <input
                    name="meltingTemp"
                    type="number"
                    defaultValue="1585"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-500 mb-1">Refining Zone (°C)</label>
                  <input
                    name="refiningTemp"
                    type="number"
                    defaultValue="1420"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-blue-500 mb-1">Annealing Lehr (°C)</label>
                  <input
                    name="lehrTemp"
                    type="number"
                    defaultValue="550"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Natural Gas Consumed (Nm³)</label>
                  <input
                    name="gas"
                    type="number"
                    defaultValue="3400"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Melted Glass (MT)</label>
                  <input
                    name="meltedTons"
                    type="number"
                    defaultValue="120"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="burnerMaintenance"
                  id="burnerMaint"
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="burnerMaint" className="text-sm font-medium">
                  Flag burner nozzle cleaning or reversal cycle maintenance
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewKilnLogModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-base font-bold transition-colors shadow-sm"
                >
                  Record Telemetry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: REGISTER MOULD / DIE */}
      {/* ================================================================= */}
      {isNewMouldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">Register Mould / Die Tooling</h3>
                  <p className="text-sm text-slate-500">Track cumulative shot counts and rated lifespan</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewMouldModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddMould} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Mould Code</label>
                  <input
                    name="mouldCode"
                    required
                    placeholder="e.g. MLD-BTL-1000-B"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Tooling Type</label>
                  <input
                    name="mouldType"
                    required
                    placeholder="e.g. Blow Mould 1000ml Jar"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Max Rated Shots</label>
                  <input
                    name="maxLife"
                    type="number"
                    defaultValue="250000"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Current Shots</label>
                  <input
                    name="currentShots"
                    type="number"
                    defaultValue="0"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Cavity Count</label>
                  <input
                    name="cavities"
                    type="number"
                    defaultValue="6"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Allocated Production Machine / Line</label>
                <input
                  name="line"
                  defaultValue="IS Machine Line 3"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewMouldModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-base font-bold transition-colors shadow-sm"
                >
                  Save Tooling Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: RECORD THERMAL INSPECTION */}
      {/* ================================================================= */}
      {isNewInspectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">Thermal Quality &amp; Defect Inspection</h3>
                  <p className="text-sm text-slate-500">Record bubble counts, warping, and cold quench shock tests</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewInspectionModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddInspection} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Lot Number</label>
                  <input
                    name="lotNumber"
                    required
                    placeholder="e.g. LOT-GLAS-2026-091"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Product Description</label>
                  <input
                    name="productType"
                    required
                    placeholder="e.g. Architectural Float 6mm"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Bubbles / Seeds</label>
                  <input
                    name="bubbles"
                    type="number"
                    defaultValue="1"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Pinholes / Stones</label>
                  <input
                    name="stones"
                    type="number"
                    defaultValue="0"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Warping (mm)</label>
                  <input
                    name="warping"
                    type="number"
                    step="0.01"
                    defaultValue="0.15"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Thermal Shock Quench Test</label>
                  <select
                    name="shockPassed"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold text-emerald-600"
                  >
                    <option value="yes">PASSED (No thermal stress fractures)</option>
                    <option value="no">FAILED (Cracking or rupture observed)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Delta-T Gradient (°C)</label>
                  <input
                    name="deltaT"
                    type="number"
                    defaultValue="50"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewInspectionModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold transition-colors shadow-sm"
                >
                  Authorize Lot Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: LOG CULLET RECOVERY */}
      {/* ================================================================= */}
      {isNewCulletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600">
                  <Recycle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">Log Cullet Scrap Recovery</h3>
                  <p className="text-sm text-slate-500">Record Hot &amp; Cold end rejects and calculate recovery %</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewCulletModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddCullet} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Production Line</label>
                <input
                  name="line"
                  defaultValue="Float Glass Line 1"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-orange-600 mb-1">Hot End Molten Scrap (MT)</label>
                  <input
                    name="hotEnd"
                    type="number"
                    step="0.1"
                    defaultValue="12.0"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blue-600 mb-1">Cold End Pack Reject (MT)</label>
                  <input
                    name="coldEnd"
                    type="number"
                    step="0.1"
                    defaultValue="8.0"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-emerald-600 mb-1">Recovered Cullet Crushed (MT)</label>
                <input
                  name="recovered"
                  type="number"
                  step="0.1"
                  defaultValue="19.2"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-400 bg-emerald-500/10 font-black text-emerald-700 dark:text-emerald-300 text-base"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewCulletModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-base font-bold transition-colors shadow-sm"
                >
                  Reconcile Mass Balance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: MTC CERTIFICATE PREVIEW (STEEL) */}
      {/* ================================================================= */}
      {selectedMtcHeat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">Material Test Certificate (MTC)</h3>
                  <p className="text-sm font-mono text-slate-500">{selectedMtcHeat.mtcNumber}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMtcHeat(null)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 text-xs">Heat Number:</span>
                  <div className="font-mono font-bold text-base">{selectedMtcHeat.heatNumber}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Grade Specification:</span>
                  <div className="font-bold text-base">{selectedMtcHeat.grade}</div>
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Chemical Analysis (%):</span>
                <div className="grid grid-cols-6 gap-2 mt-1 text-center">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border">
                    <span className="text-xs text-slate-400">C</span>
                    <div className="font-bold">{selectedMtcHeat.carbon}%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border">
                    <span className="text-xs text-slate-400">Mn</span>
                    <div className="font-bold">{selectedMtcHeat.manganese}%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border">
                    <span className="text-xs text-slate-400">Si</span>
                    <div className="font-bold">{selectedMtcHeat.silicon}%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border">
                    <span className="text-xs text-slate-400">S</span>
                    <div className="font-bold">{selectedMtcHeat.sulphur}%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border">
                    <span className="text-xs text-slate-400">P</span>
                    <div className="font-bold">{selectedMtcHeat.phosphorus}%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border">
                    <span className="text-xs text-slate-400">Cr</span>
                    <div className="font-bold">{selectedMtcHeat.chromium}%</div>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Mechanical Properties:</span>
                <div className="grid grid-cols-3 gap-3 mt-1">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border">
                    <span className="text-xs text-slate-400">Yield Strength</span>
                    <div className="font-bold text-base text-emerald-600">{selectedMtcHeat.yieldStrength} N/mm²</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border">
                    <span className="text-xs text-slate-400">Tensile Strength</span>
                    <div className="font-bold text-base text-blue-600">{selectedMtcHeat.tensileStrength} N/mm²</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border">
                    <span className="text-xs text-slate-400">Elongation</span>
                    <div className="font-bold text-base">{selectedMtcHeat.elongation}%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedMtcHeat(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Cryptographic MTC certificate sent to customer invoice portal.');
                  setSelectedMtcHeat(null);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base font-bold transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official MTC</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* CHEMICAL MODAL 1: NEW SYNTHESIS FORMULA MASTER */}
      {/* ================================================================= */}
      {isNewChemFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">New Master Chemical Formula</h3>
                  <p className="text-sm text-slate-500">Stoichiometry, molar ratios &amp; theoretical yield</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewChemFormulaModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddChemFormula} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Product Chemical Name</label>
                  <input
                    name="productName"
                    required
                    placeholder="e.g. Butyl Acetate Pure"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Formula Version</label>
                  <input
                    name="version"
                    defaultValue="v1.0"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Stoichiometric Reaction Equation</label>
                <input
                  name="stoichiometry"
                  required
                  placeholder="e.g. C4H9OH + CH3COOH <==[H+]==> CH3COOC4H9 + H2O"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Theoretical Yield (kg)</label>
                  <input
                    name="theoreticalYield"
                    type="number"
                    defaultValue="1500"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Cycle Time (Hours)</label>
                  <input
                    name="cycleHours"
                    type="number"
                    step="0.5"
                    defaultValue="8.0"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Reaction Type</label>
                  <select
                    name="reactionType"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  >
                    <option value="Esterification">Esterification</option>
                    <option value="Exothermic Addition">Exothermic</option>
                    <option value="Polymerization">Polymerization</option>
                    <option value="Distillation Cut">Distillation Cut</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Hazard Classification</label>
                <select
                  name="hazardClass"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                >
                  <option value="CLASS_3_FLAMMABLE">Class 3 (Flammable Liquid)</option>
                  <option value="CLASS_8_CORROSIVE_TOXIC">Class 8 (Corrosive Liquid)</option>
                  <option value="CLASS_6.1_TOXIC">Class 6.1 (Toxic / Poisonous)</option>
                  <option value="CLASS_9_MISC">Class 9 (Environmentally Hazardous)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewChemFormulaModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold transition-colors shadow-sm"
                >
                  Register Formula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* CHEMICAL MODAL 2: LOG HAZMAT DISPOSAL MANIFEST */}
      {/* ================================================================= */}
      {isNewHazmatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">Hazardous Waste Disposal Manifest</h3>
                  <p className="text-sm text-slate-500">CPCB Form 10 &amp; TSDF statutory transfer</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewHazmatModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddHazmat} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Waste Description</label>
                <input
                  name="wasteType"
                  required
                  placeholder="e.g. Spent Mixed Solvents (Ethanol / Acetone blend)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">UN Number</label>
                  <input
                    name="unClass"
                    defaultValue="UN 1993"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-base font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">CPCB Waste Category</label>
                  <select
                    name="categoryCpcb"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  >
                    <option value="Category 20.2 (Spent Solvents)">Category 20.2 (Spent Solvents)</option>
                    <option value="Category 28.1 (Process Residues)">Category 28.1 (Process Residues)</option>
                    <option value="Category 34.3 (ETP Chemical Sludge)">Category 34.3 (ETP Sludge)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Disposal Quantity</label>
                  <input
                    name="quantity"
                    type="number"
                    defaultValue="3000"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Unit</label>
                  <select
                    name="unit"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  >
                    <option value="ltr">Liters (ltr)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="MT">Metric Tons (MT)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Disposal Method</label>
                  <select
                    name="disposalMethod"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  >
                    <option value="Authorized TSDF Incineration">Authorized TSDF Incineration</option>
                    <option value="Secured Engineered Landfill (SLF)">Secured Landfill (SLF)</option>
                    <option value="In-house Solvent Recovery">In-house Solvent Recovery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">PPE Audit Score (%)</label>
                  <input
                    name="ppeScore"
                    type="number"
                    step="0.5"
                    defaultValue="98.5"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewHazmatModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-base font-bold transition-colors shadow-sm"
                >
                  Log Manifest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* CHEMICAL MODAL 3: UPLOAD QA ANALYTICAL LAB ASSAY */}
      {/* ================================================================= */}
      {isNewLabTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">Upload Analytical Lab Assay</h3>
                  <p className="text-sm text-slate-500">Automated dispatch clearance gate verification</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewLabTestModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddLabTest} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Batch Code</label>
                  <input
                    name="batchNumber"
                    required
                    placeholder="e.g. BATCH-CHEM-2026-083"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-base font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Product Name</label>
                  <input
                    name="productName"
                    defaultValue="Ethyl Acetate Industrial Grade"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Sample Source Point</label>
                <input
                  name="sampleSource"
                  defaultValue="Reactor Distillate Receiver DR-101"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-emerald-600 mb-1">Purity Assay (%)</label>
                  <input
                    name="purity"
                    type="number"
                    step="0.01"
                    defaultValue="99.4"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold text-emerald-600"
                  />
                  <span className="text-[10px] text-slate-400">Spec: ≥ 98.0%</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-blue-600 mb-1">pH Level</label>
                  <input
                    name="ph"
                    type="number"
                    step="0.1"
                    defaultValue="7.2"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold"
                  />
                  <span className="text-[10px] text-slate-400">Spec: 6.0 - 8.5</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-600 mb-1">Moisture (KF %)</label>
                  <input
                    name="moisture"
                    type="number"
                    step="0.01"
                    defaultValue="0.06"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold"
                  />
                  <span className="text-[10px] text-slate-400">Spec: ≤ 0.50%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Specific Gravity / Density (g/mL)</label>
                <input
                  name="density"
                  type="number"
                  step="0.001"
                  defaultValue="0.902"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewLabTestModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base font-bold transition-colors shadow-sm"
                >
                  Validate &amp; Issue CoA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* CHEMICAL MODAL 4: NEW REACTOR BATCH CYCLE */}
      {/* ================================================================= */}
      {isNewReactorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">Initialize Reactor Batch Cycle</h3>
                  <p className="text-sm text-slate-500">Stage routing, yield targets &amp; utility monitoring</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewReactorModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddReactorCycle} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Reactor Identifier</label>
                  <select
                    name="reactorId"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-semibold"
                  >
                    <option value="GLR-101 (Glass Lined Reactor 5000L)">GLR-101 (Glass Lined 5000L)</option>
                    <option value="SS-202 (Stainless Steel 316L 8000L)">SS-202 (SS-316L 8000L)</option>
                    <option value="GLR-103 (Acid Resistant 3000L)">GLR-103 (Acid Resistant 3000L)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Product Name</label>
                  <input
                    name="productName"
                    defaultValue="Ethyl Acetate Industrial Grade"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Target Yield (kg)</label>
                  <input
                    name="targetYield"
                    type="number"
                    defaultValue="1450"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Initial Stage</label>
                  <select
                    name="stage"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-semibold"
                  >
                    <option value="CHARGING">1. CHARGING (Under N2)</option>
                    <option value="REACTION">2. REACTION (Exothermic)</option>
                    <option value="REFLUX">3. REFLUX</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Est. Steam (kg)</label>
                  <input
                    name="steam"
                    type="number"
                    defaultValue="800"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Cooling Water (m³)</label>
                  <input
                    name="coolingWater"
                    type="number"
                    defaultValue="45"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Power (kWh)</label>
                  <input
                    name="power"
                    type="number"
                    defaultValue="160"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewReactorModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-base font-bold transition-colors shadow-sm"
                >
                  Start Reaction Cycle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* CHEMICAL MODAL 5: NEW DANGEROUS GOODS DISPATCH */}
      {/* ================================================================= */}
      {isNewDangerousGoodsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">New Dangerous Goods Dispatch</h3>
                  <p className="text-sm text-slate-500">UN codes, Hazchem placards &amp; driver endorsement</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewDangerousGoodsModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddDangerousGoods} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Batch Code</label>
                  <input
                    name="batchNumber"
                    required
                    placeholder="e.g. BATCH-CHEM-2026-081"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-base font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Proper Shipping Name</label>
                  <input
                    name="properShippingName"
                    defaultValue="ETHYL ACETATE (Class 3, PG II)"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">UN Number</label>
                  <input
                    name="unNumber"
                    defaultValue="UN 1173"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-base font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Hazchem Emergency Code</label>
                  <input
                    name="hazchemCode"
                    defaultValue="3YE"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-base font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Vehicle Registration #</label>
                  <input
                    name="vehicleNumber"
                    defaultValue="GJ-06-AX-4412 (ADR Tanker)"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Driver Name</label>
                  <input
                    name="driverName"
                    defaultValue="Sukhvinder Singh"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Driver License #</label>
                  <input
                    name="driverLicense"
                    defaultValue="DL-GJ-HAZ-2024-8841"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Hazmat Endorsement Valid?</label>
                  <select
                    name="driverHazmatValid"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold text-emerald-600"
                  >
                    <option value="yes">YES - Valid Commercial Hazchem Endorsement</option>
                    <option value="no">NO - Expired / Missing (Triggers Gate Block)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewDangerousGoodsModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-base font-bold transition-colors shadow-sm"
                >
                  Generate Tremcard &amp; Clear Gate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* CHEMICAL MODAL 6: OFFICIAL CERTIFICATE OF ANALYSIS (CoA) */}
      {/* ================================================================= */}
      {selectedCoaTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">Certificate of Analysis (CoA)</h3>
                  <p className="text-sm font-mono text-slate-500">{selectedCoaTest.coaDocumentNumber}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCoaTest(null)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 text-xs">Batch Identification:</span>
                  <div className="font-mono font-bold text-base text-blue-600">{selectedCoaTest.batchNumber}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Product Description:</span>
                  <div className="font-bold text-base">{selectedCoaTest.productName}</div>
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Analytical Quality Parameters:</span>
                <div className="grid grid-cols-4 gap-3 mt-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border text-center">
                    <span className="text-xs text-slate-400 block">GC Purity Assay</span>
                    <span className="text-lg font-black text-emerald-600">{selectedCoaTest.purityPercent}%</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Spec ≥ 98.0%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border text-center">
                    <span className="text-xs text-slate-400 block">pH Value</span>
                    <span className="text-lg font-black text-blue-600">{selectedCoaTest.phLevel}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Spec 6.0 - 8.5</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border text-center">
                    <span className="text-xs text-slate-400 block">Moisture (KF)</span>
                    <span className="text-lg font-black text-emerald-600">{selectedCoaTest.moistureWaterPercent}%</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Spec ≤ 0.50%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border text-center">
                    <span className="text-xs text-slate-400 block">Density (g/mL)</span>
                    <span className="text-lg font-mono font-black">{selectedCoaTest.densityGml || '0.902'}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Spec 0.898-0.905</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border space-y-1">
                <span className="text-xs font-bold text-slate-500 block">QA Head Chemist Certification Sign-off:</span>
                <p className="text-xs italic text-slate-700 dark:text-slate-300">{selectedCoaTest.chemistNotes}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Certification Standard: ISO 9001 / ACS Chemical Reagent Grade</span>
                <span>Generated: {selectedCoaTest.coaGeneratedAt || 'Verified Today'}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedCoaTest(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Official Certificate of Analysis (CoA) printed & linked to dispatch gate-pass.');
                  setSelectedCoaTest(null);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base font-bold transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official CoA</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* CHEMICAL MODAL 7: OFFICIAL TRANSPORT EMERGENCY CARD (TREMCARD) */}
      {/* ================================================================= */}
      {selectedTremcard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">Transport Emergency Card (TREMCARD)</h3>
                  <p className="text-sm font-mono text-slate-500">{selectedTremcard.tremcardDocumentNumber}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTremcard(null)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border">
                  <span className="text-xs text-slate-400 block">UN Number</span>
                  <span className="text-lg font-mono font-black text-purple-600">{selectedTremcard.unNumber}</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border">
                  <span className="text-xs text-slate-400 block">Hazchem Code</span>
                  <span className="text-lg font-mono font-black text-amber-600">{selectedTremcard.hazchemCode}</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border">
                  <span className="text-xs text-slate-400 block">Hazard Class</span>
                  <span className="text-sm font-black">{selectedTremcard.hazardClass}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 text-xs">Proper Shipping Name:</span>
                  <div className="font-bold text-base">{selectedTremcard.properShippingName}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Tanker Vehicle Registration:</span>
                  <div className="font-mono font-bold text-base">{selectedTremcard.vehicleRegistrationNumber}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 text-xs">Authorized Driver:</span>
                  <div className="font-bold text-base">{selectedTremcard.driverName}</div>
                  <div className="text-xs font-mono text-slate-400">{selectedTremcard.driverLicenseNumber}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Hazmat Driver Status:</span>
                  <div>
                    {selectedTremcard.driverHazmatEndorsementValid ? (
                      <span className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Endorsement Valid &amp; Verified
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-rose-600 inline-flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Endorsement Expired / Detained
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                <span className="font-bold text-amber-800 dark:text-amber-300 block">Emergency Response Instructions for Driver:</span>
                <p className="text-slate-700 dark:text-slate-300">
                  In case of spill, isolate 50m. Eliminate all ignition sources. Use Dry Powder, CO2 or Alcohol-Resistant Foam extinguisher. Do not inhale toxic vapors. Call Emergency Plant Response: 1800-CHEM-ERP.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedTremcard(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Official Tremcard document printed for driver transport folder.');
                  setSelectedTremcard(null);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-base font-bold transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print Driver Tremcard</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* PAINT MODAL 1: NEW MASTER SHADE CARD */}
      {/* ================================================================= */}
      {isNewPaintShadeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-fuchsia-500/10 text-fuchsia-600">
                  <Palette className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">New Master Shade Card</h3>
                  <p className="text-sm text-slate-500">Governed by COLOR_LAB_SHADE_MANAGER</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPaintShadeModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddPaintShade} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Shade Name</label>
                  <input
                    name="shadeName"
                    required
                    placeholder="e.g. Royal Oxford Navy"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Color Family</label>
                  <select
                    name="colorFamily"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
                  >
                    <option value="Blues">Blues</option>
                    <option value="Off-White & Creams">Off-White &amp; Creams</option>
                    <option value="Greens">Greens</option>
                    <option value="Reds & Corals">Reds &amp; Corals</option>
                    <option value="Yellows & Ochers">Yellows &amp; Ochers</option>
                    <option value="Grays & Monochromes">Grays &amp; Monochromes</option>
                    <option value="Earth & Browns">Earth &amp; Browns</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Required Base Stock</label>
                  <select
                    name="baseType"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
                  >
                    <option value="WHITE_BASE">White Base (TiO2 high-opacity)</option>
                    <option value="DEEP_BASE">Deep Base (mid-saturation tones)</option>
                    <option value="CLEAR_BASE">Clear / Neutral Base (dark/intense)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">ΔE Tolerance Limit</label>
                  <input
                    name="deltaETolerance"
                    type="number"
                    step="0.05"
                    defaultValue="0.50"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Target CIELAB Colorimeter Coordinates (L*, a*, b*)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <input
                      name="spectroL"
                      type="number"
                      step="0.05"
                      defaultValue="50.0"
                      placeholder="L* (Lightness)"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                    />
                  </div>
                  <div>
                    <input
                      name="spectroA"
                      type="number"
                      step="0.05"
                      defaultValue="0.0"
                      placeholder="a* (Red/Green)"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                    />
                  </div>
                  <div>
                    <input
                      name="spectroB"
                      type="number"
                      step="0.05"
                      defaultValue="0.0"
                      placeholder="b* (Blue/Yellow)"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Custom Tinting Formula Recipe (JSON or Dispenser Code)
                </label>
                <textarea
                  name="tintingFormula"
                  rows={2}
                  defaultValue='{"White": 0, "Black": 22.5, "PhthaloBlue": 88.0, "YellowOxide": 5.0}'
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewPaintShadeModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-base font-bold transition-colors shadow-sm"
                >
                  Register Master Shade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* PAINT MODAL 2: LOG BEAD MILL DISPERSION BATCH */}
      {/* ================================================================= */}
      {isNewDispersionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">Log Dispersion Grinding Batch</h3>
                  <p className="text-sm text-slate-500">Governed by PIGMENT_RESIN_DISPERSION_MANAGER</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewDispersionModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddDispersionBatch} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Equipment / Mill ID</label>
                  <select
                    name="millId"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Horizontal Bead Mill BM-01">Horizontal Bead Mill BM-01</option>
                    <option value="Horizontal Bead Mill BM-02">Horizontal Bead Mill BM-02</option>
                    <option value="Dyno-Mill KD-20 Pilot">Dyno-Mill KD-20 Pilot</option>
                    <option value="High-Speed Disperser HSD-03">High-Speed Disperser HSD-03</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
                  <input
                    name="productName"
                    required
                    placeholder="e.g. Premium Enamel White"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Resin Vehicle System</label>
                  <input
                    name="resinType"
                    required
                    defaultValue="Long Oil Alkyd (65% NV)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Prime Pigment / Extender</label>
                  <input
                    name="pigmentType"
                    required
                    defaultValue="Rutile TiO2 (94% Purity)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Target Viscosity (KU)</label>
                  <input
                    name="targetViscosity"
                    type="number"
                    step="0.5"
                    defaultValue="95.0"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Current Mill Viscosity (KU)</label>
                  <input
                    name="currentViscosity"
                    type="number"
                    step="0.5"
                    defaultValue="94.5"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Duration (Minutes)</label>
                  <input
                    name="durationMinutes"
                    type="number"
                    defaultValue="120"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Cumulative Run-Hours (hrs)</label>
                  <input
                    name="runHours"
                    type="number"
                    step="0.1"
                    defaultValue="4.5"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Cooling Water Temp (°C)</label>
                  <input
                    name="coolingTemp"
                    type="number"
                    step="0.5"
                    defaultValue="22.5"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="sequenceCompleted"
                    defaultChecked
                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
                    5-Stage Raw Material Loading Sequence Verified (Resin → Solvents → Wetting → Pigments → Extenders)
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewDispersionModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-base font-bold transition-colors shadow-sm"
                >
                  Log Dispersion Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* PAINT MODAL 3: LOG RHEOLOGY LAB QUALITY ASSAY */}
      {/* ================================================================= */}
      {isNewRheologyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">Log Rheology Lab QC Assay</h3>
                  <p className="text-sm text-slate-500">Governed by QUALITY_RHEOLOGY_MANAGER</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewRheologyModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddRheologyTest} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Batch Number</label>
                  <input
                    name="batchNumber"
                    required
                    placeholder="e.g. BATCH-PNT-2026-095"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
                  <input
                    name="productName"
                    required
                    placeholder="e.g. Exterior Weatherproof Emulsion"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Krebs Viscosity (KU)</label>
                  <input
                    name="krebs"
                    type="number"
                    step="0.5"
                    defaultValue="98.0"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Spec: 85 - 115 KU</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Density (g/mL)</label>
                  <input
                    name="density"
                    type="number"
                    step="0.01"
                    defaultValue="1.32"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Spec: 1.25 - 1.45</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Hegman Fineness (µm)</label>
                  <input
                    name="fineness"
                    type="number"
                    step="0.5"
                    defaultValue="18.0"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Spec: ≤ 25 µm</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Touch Dry (min)</label>
                  <input
                    name="touchDry"
                    type="number"
                    defaultValue="30"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Spec: ≤ 60 min</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Hard Dry (min)</label>
                  <input
                    name="hardDry"
                    type="number"
                    defaultValue="180"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Gloss Level 60° (GU)</label>
                  <input
                    name="gloss"
                    type="number"
                    step="0.5"
                    defaultValue="85.0"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-300">
                <strong>Strict Automated Packaging Gate:</strong> Batches meeting Krebs 85–115 KU, Hegman ≤ 25 µm, and Touch Dry ≤ 60 min are automatically cleared for packaging with a generated Certificate of Analysis (CoA). Out-of-spec batches are locked from canning lines.
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Chemist Notes</label>
                <input
                  name="notes"
                  placeholder="e.g. Passes IS 15489. Approved for 4L and 20L filling."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewRheologyModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-base font-bold transition-colors shadow-sm"
                >
                  Record QC Assay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* PAINT MODAL 4: LOG BASE STOCK AUTO-DISPENSER TINTING */}
      {/* ================================================================= */}
      {isNewBaseTintingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
                  <Droplet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">Log Base Dispenser Shot</h3>
                  <p className="text-sm text-slate-500">Governed by BASE_STOCK_TINTING_MANAGER</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewBaseTintingModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddBaseTinting} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Base Tank ID</label>
                  <select
                    name="tankId"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="BT-101 (Base White 15,000L)">BT-101 (Base White 15,000L)</option>
                    <option value="BT-102 (Deep Base 10,000L)">BT-102 (Deep Base 10,000L)</option>
                    <option value="BT-103 (Clear Base 8,000L)">BT-103 (Clear Base 8,000L)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Base Type</label>
                  <select
                    name="baseType"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="BASE_WHITE">BASE_WHITE</option>
                    <option value="DEEP_BASE">DEEP_BASE</option>
                    <option value="CLEAR_BASE">CLEAR_BASE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Dispenser Machine ID</label>
                  <select
                    name="dispenserId"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Fast & Fluid Auto-Tint Dispenser AT-01">Fast &amp; Fluid Auto-Tint Dispenser AT-01</option>
                    <option value="Fast & Fluid Auto-Tint Dispenser AT-02">Fast &amp; Fluid Auto-Tint Dispenser AT-02</option>
                    <option value="Manual Tinting Rig MR-01">Manual Tinting Rig MR-01</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Dispense Volume (L)</label>
                  <input
                    name="volumeLtr"
                    type="number"
                    defaultValue="250"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Colorant Shots Injected (mL)</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400">White (W)</label>
                    <input
                      name="whiteMl"
                      type="number"
                      defaultValue="0"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400">Black (K)</label>
                    <input
                      name="blackMl"
                      type="number"
                      defaultValue="45"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400">Phthalo Blue (B)</label>
                    <input
                      name="blueMl"
                      type="number"
                      defaultValue="320"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400">Yellow Oxide (Y)</label>
                    <input
                      name="yellowMl"
                      type="number"
                      defaultValue="15"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400">Red Oxide (R)</label>
                    <input
                      name="redMl"
                      type="number"
                      defaultValue="0"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400">Phthalo Green (G)</label>
                    <input
                      name="greenMl"
                      type="number"
                      defaultValue="0"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Operator Notes</label>
                <input
                  name="notes"
                  placeholder="e.g. Canister load cells balanced within ±0.08%."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewBaseTintingModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-base font-bold transition-colors shadow-sm"
                >
                  Record Tinting Dispense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* PAINT MODAL 5: LOG FLAMMABLE PACKAGING & VOC RUN */}
      {/* ================================================================= */}
      {isNewPackagingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600">
                  <Box className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">Log Packaging &amp; VOC Compliance Run</h3>
                  <p className="text-sm text-slate-500">Governed by FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPackagingModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddPackagingCompliance} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Batch Number</label>
                  <input
                    name="batchNumber"
                    required
                    defaultValue="BATCH-PNT-2026-092"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
                  <input
                    name="productName"
                    required
                    defaultValue="Synthetic High Gloss Enamel"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Container Size</label>
                  <select
                    name="containerSize"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  >
                    <option value="1L">1 Liter</option>
                    <option value="4L">4 Liters</option>
                    <option value="10L">10 Liters</option>
                    <option value="20L">20 Liters</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Container Type</label>
                  <select
                    name="containerType"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  >
                    <option value="TIN_CAN">Tin Can (Litho)</option>
                    <option value="HDPE_BUCKET">HDPE Bucket</option>
                    <option value="STEEL_DRUM">Steel Drum 200L</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Units Packaged</label>
                  <input
                    name="quantity"
                    type="number"
                    defaultValue="300"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">VOC Content (g/L)</label>
                  <input
                    name="voc"
                    type="number"
                    step="0.1"
                    defaultValue="41.5"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                  <span className="text-xs text-slate-400">Statutory Limit: ≤ 50.0 g/L</span>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Warehouse Bay Location</label>
                  <input
                    name="locationBay"
                    defaultValue="Bay-Solvent-FL-02"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Inkjet Imprint Code (Batch / MFD / EXP / MRP)
                </label>
                <input
                  name="printedCode"
                  defaultValue="B.No: BATCH-092 | MFD: 11/26 | USE BY: 11/29 | MRP: Rs. 1,650/-"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                />
              </div>

              <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="antiStatic"
                    defaultChecked
                    className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Anti-Static Bonding &amp; Earth Grounding Continuity Verified
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="permitValid"
                    defaultChecked
                    className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Flammable Solvent Hazardous Filling Area Permit Valid
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewPackagingModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-base font-bold transition-colors shadow-sm"
                >
                  Authorize Packaging Run
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* PAINT MODAL 6: CERTIFICATE OF ANALYSIS (COA) VIEWER */}
      {/* ================================================================= */}
      {selectedPaintCoa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">Certificate of Analysis (CoA)</h3>
                  <p className="text-sm font-mono text-cyan-600 font-bold">{selectedPaintCoa.coaDocumentNumber}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPaintCoa(null)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-xs text-slate-400 block font-bold">Product Name</span>
                  <span className="text-base font-black">{selectedPaintCoa.productName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-bold">Batch Identification Number</span>
                  <span className="text-base font-mono font-black text-blue-600">{selectedPaintCoa.batchNumber}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-bold">Test Reference ID</span>
                  <span className="font-mono font-bold">{selectedPaintCoa.testId}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-bold">Certification Date</span>
                  <span className="font-bold">{selectedPaintCoa.coaGeneratedAt || 'Today'}</span>
                </div>
              </div>

              {/* Parameters Table */}
              <div>
                <span className="text-xs uppercase font-extrabold text-slate-500 block mb-2 tracking-wider">
                  Standard Quality Parameter Assays (IS 15489 &amp; ASTM Standards)
                </span>
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-slate-200 dark:bg-slate-700/60 font-bold">
                    <tr>
                      <th className="p-2.5 rounded-l-lg">Parameter</th>
                      <th className="p-2.5">Specified Limits</th>
                      <th className="p-2.5">Measured Value</th>
                      <th className="p-2.5 rounded-r-lg">Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700 font-mono">
                    <tr>
                      <td className="p-2.5 font-sans font-bold">Stormer Krebs Viscosity</td>
                      <td className="p-2.5">85.0 – 115.0 KU</td>
                      <td className="p-2.5 font-black text-cyan-600">{selectedPaintCoa.krebsViscosityKu} KU</td>
                      <td className="p-2.5 font-sans">
                        <span className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-bold">Specific Gravity / Density</td>
                      <td className="p-2.5">1.25 – 1.45 g/mL</td>
                      <td className="p-2.5 font-bold">{selectedPaintCoa.densityGml} g/mL</td>
                      <td className="p-2.5 font-sans">
                        <span className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-bold">Hegman Grind Fineness</td>
                      <td className="p-2.5">≤ 25.0 µm</td>
                      <td className="p-2.5 font-bold text-emerald-600">{selectedPaintCoa.hegmanFinenessMicrons} µm</td>
                      <td className="p-2.5 font-sans">
                        <span className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-bold">Touch Dry Time</td>
                      <td className="p-2.5">≤ 60 min</td>
                      <td className="p-2.5 font-bold">{selectedPaintCoa.touchDryMinutes} min</td>
                      <td className="p-2.5 font-sans">
                        <span className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-bold">Hard Dry Time</td>
                      <td className="p-2.5">≤ 240 min</td>
                      <td className="p-2.5 font-bold">{selectedPaintCoa.hardDryMinutes} min</td>
                      <td className="p-2.5 font-sans">
                        <span className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-bold">Specular Gloss (60°)</td>
                      <td className="p-2.5">Report / ≥ 80 GU</td>
                      <td className="p-2.5 font-bold">{selectedPaintCoa.glossLevel60Deg ?? 85.0} GU</td>
                      <td className="p-2.5 font-sans">
                        <span className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Digital Signature & Certification Box */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase font-extrabold text-emerald-800 dark:text-emerald-300">
                    Quality Gate Certification
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                    Batch complies with specifications and is CLEARED for high-speed canning and dispatch.
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                    QUALITY_RHEOLOGY_MANAGER
                  </div>
                  <div className="text-[10px] text-slate-400">Digitally Signed &amp; Timestamped</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedPaintCoa(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`Official Certificate of Analysis ${selectedPaintCoa.coaDocumentNumber} printed.`);
                  setSelectedPaintCoa(null);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-base font-bold transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official CoA</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
