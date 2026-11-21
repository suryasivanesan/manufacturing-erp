'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Zap,
  Activity,
  TrendingDown,
  TrendingUp,
  Gauge,
  DollarSign,
  Flame,
  Sun,
  Cpu,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Layers,
  RefreshCw,
  Sliders,
  Download,
  Plus,
  Search,
  Building2,
  Sparkles,
  Filter,
  ArrowUpRight,
  PieChart,
  Info,
  BatteryCharging,
  Wind,
  X,
  FileCheck2,
  SlidersHorizontal,
} from 'lucide-react';
import { LineChart, DonutChart } from '@/components/charts';

interface FeederUnit {
  id: string;
  tag: string;
  name: string;
  category: 'TRANSFORMER' | 'CLEANROOM' | 'SOLAR' | 'GENSET' | 'COMPRESSOR';
  voltage: string;
  currentLoadKw: number;
  capacityKw: number;
  powerFactor: number;
  temperatureC: number;
  status: 'OPTIMAL' | 'NORMAL' | 'HIGH_LOAD' | 'STANDBY';
  location: string;
}

interface CostCenterRecord {
  id: string;
  name: string;
  meterCode: string;
  utilityType: 'ELECTRICITY_GRID' | 'DIESEL_BACKUP' | 'NITROGEN_GAS' | 'COMPRESSED_AIR' | 'CHILLED_WATER';
  monthlyConsumption: number;
  unitMeasurement: string;
  unitRate: number;
  totalMonthlyCost: number;
  sharePct: number;
  budgetStatus: 'WITHIN_BUDGET' | 'WARNING_HIGH' | 'EXCEEDED';
  costCenterCode: string;
}

export default function FactoryElectricityPage() {
  const [timeRange, setTimeRange] = useState<'TODAY' | 'SHIFT_1' | 'SHIFT_2' | 'THIS_MONTH' | 'CYCLE'>('THIS_MONTH');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('18:45 PM Today');

  // Modals
  const [showLogBillModal, setShowLogBillModal] = useState(false);
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);

  // Bill Logger Form State
  const [billForm, setBillForm] = useState({
    billingMonth: 'October 2026',
    discomProvider: 'State Electricity Distribution Co. (MSEDCL 33kV HT-1)',
    contractDemandKva: '1800',
    recordedPeakKva: '1420',
    unitsKwh: '284520',
    billedAmount: '2389968',
    powerFactor: '0.992',
    pfRebateAmount: '83648',
  });
  const [billLoggedSuccess, setBillLoggedSuccess] = useState(false);

  // Simulator State
  const [targetPeakDemand, setTargetPeakDemand] = useState(1350);

  // Mock Electricity Feeders & Transformers
  const [feeders, setFeeders] = useState<FeederUnit[]>([
    {
      id: 'fdr-1',
      tag: 'TR-01',
      name: 'Main Substation Transformer 1 (SMT & PCB Lines)',
      category: 'TRANSFORMER',
      voltage: '33kV / 415V',
      currentLoadKw: 720,
      capacityKw: 1000,
      powerFactor: 0.994,
      temperatureC: 64,
      status: 'NORMAL',
      location: 'Substation Yard East',
    },
    {
      id: 'fdr-2',
      tag: 'TR-02',
      name: 'Cleanroom ISO-6 & Chiller Plant Transformer 2',
      category: 'CLEANROOM',
      voltage: '33kV / 415V',
      currentLoadKw: 610,
      capacityKw: 750,
      powerFactor: 0.991,
      temperatureC: 69,
      status: 'HIGH_LOAD',
      location: 'HVAC Plant Bay 1',
    },
    {
      id: 'fdr-3',
      tag: 'SLR-01',
      name: 'Rooftop Solar PV Array (500 kWp Tier-1 Bifacial)',
      category: 'SOLAR',
      voltage: '415V Grid-Tied',
      currentLoadKw: 342,
      capacityKw: 500,
      powerFactor: 0.999,
      temperatureC: 48,
      status: 'OPTIMAL',
      location: 'Assembly Hall Roof',
    },
    {
      id: 'fdr-4',
      tag: 'AMF-01',
      name: 'Emergency Backup Diesel Genset 1 (Cummins 1,000 kVA)',
      category: 'GENSET',
      voltage: '415V 3-Phase',
      currentLoadKw: 0,
      capacityKw: 800,
      powerFactor: 0.985,
      temperatureC: 32,
      status: 'STANDBY',
      location: 'DG Room Annex',
    },
    {
      id: 'fdr-5',
      tag: 'CMP-01',
      name: 'Central 7-Bar Screw Compressors & Nitrogen Buffer',
      category: 'COMPRESSOR',
      voltage: '415V',
      currentLoadKw: 185,
      capacityKw: 250,
      powerFactor: 0.988,
      temperatureC: 58,
      status: 'NORMAL',
      location: 'Utility Service Room',
    },
  ]);

  // Cost Centers Data Table
  const costCenters: CostCenterRecord[] = useMemo(
    () => [
      {
        id: 'cc-1',
        name: 'Line 1: High-Speed SMT Surface Mount & Reflow Ovens',
        meterCode: 'EM-SMT-01A',
        utilityType: 'ELECTRICITY_GRID',
        monthlyConsumption: 81088,
        unitMeasurement: 'kWh',
        unitRate: 8.4,
        totalMonthlyCost: 681140,
        sharePct: 28.5,
        budgetStatus: 'WITHIN_BUDGET',
        costCenterCode: 'CC-PROD-101',
      },
      {
        id: 'cc-2',
        name: 'Line 2: Dust-Free Screen Fitting & Laminator Cleanroom',
        meterCode: 'EM-CLN-02B',
        utilityType: 'ELECTRICITY_GRID',
        monthlyConsumption: 74544,
        unitMeasurement: 'kWh',
        unitRate: 8.4,
        totalMonthlyCost: 626170,
        sharePct: 26.2,
        budgetStatus: 'WARNING_HIGH',
        costCenterCode: 'CC-HVAC-202',
      },
      {
        id: 'cc-3',
        name: 'Lines 3 & 4: Camera Alignment, 5G RF Chamber & Testing',
        meterCode: 'EM-TST-03C',
        utilityType: 'ELECTRICITY_GRID',
        monthlyConsumption: 52351,
        unitMeasurement: 'kWh',
        unitRate: 8.4,
        totalMonthlyCost: 439750,
        sharePct: 18.4,
        budgetStatus: 'WITHIN_BUDGET',
        costCenterCode: 'CC-QUAL-303',
      },
      {
        id: 'cc-4',
        name: 'Cryogenic Nitrogen Gas Generator (SMT Wave Soldering)',
        meterCode: 'GM-N2-04D',
        utilityType: 'NITROGEN_GAS',
        monthlyConsumption: 24500,
        unitMeasurement: 'Nm³',
        unitRate: 12.5,
        totalMonthlyCost: 306250,
        sharePct: 12.8,
        budgetStatus: 'WITHIN_BUDGET',
        costCenterCode: 'CC-UTIL-404',
      },
      {
        id: 'cc-5',
        name: 'Backup High-Speed Diesel (HSD) Genset Fuel Settlement',
        meterCode: 'FM-DG-05E',
        utilityType: 'DIESEL_BACKUP',
        monthlyConsumption: 2320,
        unitMeasurement: 'Litres',
        unitRate: 92.5,
        totalMonthlyCost: 214600,
        sharePct: 9.0,
        budgetStatus: 'WARNING_HIGH',
        costCenterCode: 'CC-GENS-505',
      },
      {
        id: 'cc-6',
        name: 'Line 6: Conveyor Automation, Packing & Palletizing Cell',
        meterCode: 'EM-PCK-06F',
        utilityType: 'ELECTRICITY_GRID',
        monthlyConsumption: 14850,
        unitMeasurement: 'kWh',
        unitRate: 8.4,
        totalMonthlyCost: 124740,
        sharePct: 5.2,
        budgetStatus: 'WITHIN_BUDGET',
        costCenterCode: 'CC-DISP-606',
      },
      {
        id: 'cc-7',
        name: 'Executive R&D Lab, Server Room UPS & Admin Facilities',
        meterCode: 'EM-ADM-07G',
        utilityType: 'ELECTRICITY_GRID',
        monthlyConsumption: 12420,
        unitMeasurement: 'kWh',
        unitRate: 8.4,
        totalMonthlyCost: 104328,
        sharePct: 4.4,
        budgetStatus: 'WITHIN_BUDGET',
        costCenterCode: 'CC-CORP-707',
      },
    ],
    [],
  );

  // Hourly Power Demand Curve for LineChart (24h)
  const hourlyDemandTrend = useMemo(
    () => [
      { label: '00:00', gridDemand: 820, solarPower: 0, budgetCap: 1500 },
      { label: '02:00', gridDemand: 790, solarPower: 0, budgetCap: 1500 },
      { label: '04:00', gridDemand: 840, solarPower: 0, budgetCap: 1500 },
      { label: '06:00', gridDemand: 1120, solarPower: 45, budgetCap: 1500 },
      { label: '08:00', gridDemand: 1380, solarPower: 180, budgetCap: 1500 },
      { label: '10:00', gridDemand: 1420, solarPower: 340, budgetCap: 1500 },
      { label: '12:00', gridDemand: 1460, solarPower: 420, budgetCap: 1500 },
      { label: '14:00', gridDemand: 1410, solarPower: 390, budgetCap: 1500 },
      { label: '16:00', gridDemand: 1350, solarPower: 210, budgetCap: 1500 },
      { label: '18:00', gridDemand: 1480, solarPower: 30, budgetCap: 1500 },
      { label: '20:00', gridDemand: 1290, solarPower: 0, budgetCap: 1500 },
      { label: '22:00', gridDemand: 940, solarPower: 0, budgetCap: 1500 },
    ],
    [],
  );

  // Departmental Cost Breakdown for Donut Chart
  const departmentBreakdown = useMemo(
    () => [
      {
        name: 'SMT Circuit Lines (28.5%)',
        value: 681140,
        color: '#3b82f6',
        description: 'Lead-free reflow ovens & high-speed chip placers',
      },
      {
        name: 'Cleanroom & HVAC (26.2%)',
        value: 626170,
        color: '#06b6d4',
        description: 'ISO-6 HEPA positive-pressure climate & chillers',
      },
      {
        name: 'Testing & RF Chambers (18.4%)',
        value: 439750,
        color: '#8b5cf6',
        description: '5G anechoic chambers & camera light tunnels',
      },
      {
        name: 'Nitrogen & Air Utility (12.8%)',
        value: 306250,
        color: '#f59e0b',
        description: 'Pressure swing adsorption (PSA) gas units',
      },
      {
        name: 'DG Fuel & Backup (9.0%)',
        value: 214600,
        color: '#ef4444',
        description: 'Grid-outage emergency generation fuel',
      },
      {
        name: 'Packing & Admin (5.1%)',
        value: 229068,
        color: '#10b981',
        description: 'Warehouse conveyors, lighting & server room',
      },
    ],
    [],
  );

  // Filtered Cost Centers
  const filteredCostCenters = useMemo(() => {
    return costCenters.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meterCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.costCenterCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategoryFilter === 'ALL' || item.utilityType === activeCategoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [costCenters, searchQuery, activeCategoryFilter]);

  // Refresh Telemetry Handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Just now');
    }, 600);
  };

  // Submit Bill Logger Handler
  const handleLogBill = (e: React.FormEvent) => {
    e.preventDefault();
    setBillLoggedSuccess(true);
    setTimeout(() => {
      setBillLoggedSuccess(false);
      setShowLogBillModal(false);
    }, 1200);
  };

  // Simulator Calculation
  const estimatedDemandReductionKw = Math.max(0, 1420 - targetPeakDemand);
  const estimatedMonthlySavings = estimatedDemandReductionKw * 350; // ₹350 per kVA demand tariff saving

  return (
    <div className="space-y-6">
      {/* 1. Top Executive Banner & Live Substation Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-sm">
              <Zap className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                Factory Electricity &amp; Running Costs
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  Substation Feed: 33kV HT
                </span>
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Real-time power telemetry, transformer load factors, cleanroom HVAC energy budgets, rooftop solar offsets, and monthly DISCOM utility settlement.
          </p>
        </div>

        {/* Action Controls & Telemetry Status */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Telemetry: {lastRefreshed}</span>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-lg transition-all"
            title="Refresh Live Power Telemetry"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-amber-500' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setShowSimulatorModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold transition-all shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4 text-amber-500" />
            <span>Peak Load Simulator</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLogBillModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-amber-500/20 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Log Monthly Bill</span>
          </button>
        </div>
      </div>

      {/* 2. Top-Level Executive KPI Scorecard */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* KPI 1: Total Consumption */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/40 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Grid Energy
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            284,520 <span className="text-xs font-normal text-slate-500">kWh</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingDown className="h-3 w-3" />
            <span>-3.4% MoM (Optimized)</span>
          </div>
        </div>

        {/* KPI 2: Monthly Electricity Bill */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Monthly Power Bill
            </span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            ₹23.90 <span className="text-xs font-normal text-slate-500">Lakh</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Blended Rate: </span>
            <strong className="text-slate-700 dark:text-slate-300 font-mono">₹8.40/kWh</strong>
          </div>
        </div>

        {/* KPI 3: Real-Time Active Demand */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/40 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Peak Active Demand
            </span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Gauge className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            1,420 <span className="text-xs font-normal text-slate-500">kW</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-purple-600 dark:text-purple-400 font-semibold">78.8% Load</span>
            <span>of 1,800 kVA cap</span>
          </div>
        </div>

        {/* KPI 4: Power Factor & Grid Rebate */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Power Factor (PF)
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
            0.992 <span className="text-xs font-normal text-slate-500">Lag</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <ArrowUpRight className="h-3 w-3" />
            <span>₹83,648 Grid Rebate</span>
          </div>
        </div>

        {/* KPI 5: Cleanroom HVAC Energy Share */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 hover:border-cyan-500/40 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Cleanroom &amp; HVAC
            </span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Wind className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            118,400 <span className="text-xs font-normal text-slate-500">kWh</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">41.6% Plant Total</span>
          </div>
        </div>

        {/* KPI 6: Rooftop Solar Generation */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/40 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Solar Green Offset
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sun className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tracking-tight">
            48,600 <span className="text-xs font-normal text-slate-500">kWh</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Saved: </span>
            <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">₹4,08,240</strong>
          </div>
        </div>
      </div>

      {/* 3. Time-of-Day (ToD) Tariff Optimization Advisory Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-50 to-blue-500/10 dark:from-amber-950/30 dark:via-slate-900/40 dark:to-blue-950/30 border border-amber-500/20 dark:border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-md shadow-amber-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              State Grid Time-of-Day (ToD) Tariff Window Active
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
              Current slot: <strong className="text-slate-900 dark:text-white font-semibold">Normal Working Tariff (₹8.40/unit)</strong>. Evening peak surcharge (+20% or ₹10.08/unit) begins at 18:00. Night off-peak discount (-15% or ₹7.14/unit) applies from 22:00 to 06:00.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Suggested Action</span>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Shift N2 Tank Filling to 22:00
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSimulatorModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            Simulate Load Shift
          </button>
        </div>
      </div>

      {/* 4. Interactive Power Load Trends & Departmental Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 24h Hourly Load & Solar Generation Trend (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Activity className="h-4 w-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  24-Hour Active Power Demand vs. Rooftop Solar Generation
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Live kW load profile across shifts 1, 2, and 3 with contracted limit threshold (1,500 kW).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Grid Load (kW)
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Solar (kW)
              </span>
            </div>
          </div>

          <div className="pt-2">
            <LineChart
              data={hourlyDemandTrend}
              series={[
                { key: 'gridDemand', name: 'Grid Demand (kW)', color: '#3b82f6', strokeWidth: 2.5 },
                { key: 'solarPower', name: 'Solar PV (kW)', color: '#f59e0b', strokeWidth: 2 },
              ]}
              xAxisKey="label"
              height={260}
              yAxisFormatter={(val) => `${val} kW`}
              tooltipFormatter={(val, key) => `${val.toLocaleString()} kW`}
            />
          </div>

          {/* Quick Tariff Band Legend */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40">
              <div className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Night Off-Peak (22-06)</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">₹7.14 / unit (-15%)</div>
            </div>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/40">
              <div className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-400">Normal Shift (06-18)</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">₹8.40 / unit (Standard)</div>
            </div>
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-800/40">
              <div className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-400">Evening Peak (18-22)</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">₹10.08 / unit (+20%)</div>
            </div>
          </div>
        </div>

        {/* Right: Departmental Cost Distribution (Donut Chart) */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <PieChart className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Electricity Cost by Department
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Total Monthly Utility Budget: ₹23.90 Lakh
                </p>
              </div>
            </div>

            <div className="py-2">
              <DonutChart
                data={departmentBreakdown}
                height={220}
                innerRadius={55}
                outerRadius={85}
                valueFormatter={(val) => `₹${(val / 100000).toFixed(2)}L`}
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Top Consumer:</span>
              <span className="font-semibold text-slate-900 dark:text-white">SMT Surface Mount Cell (28.5%)</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Cleanroom Chiller Share:</span>
              <span className="font-semibold text-cyan-600 dark:text-cyan-400">26.2% of Total Bill</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Substation Feeders, Transformers & Generators Live Monitor */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Gauge className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Main Substation Transformers &amp; Auxiliary Generator Status
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live transformer temperatures, voltage harmonics, load capacity, and automatic mains failure (AMF) status.
            </p>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            5 Feeders Operational
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 pt-1">
          {feeders.map((fdr) => {
            const loadPct = Math.round((fdr.currentLoadKw / fdr.capacityKw) * 100);
            return (
              <div
                key={fdr.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {fdr.tag}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        fdr.status === 'OPTIMAL'
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : fdr.status === 'HIGH_LOAD'
                          ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          : fdr.status === 'STANDBY'
                          ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                          : 'bg-slate-500/10 text-slate-600 border-slate-500/20'
                      }`}
                    >
                      {fdr.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{fdr.location}</span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{fdr.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Rating: {fdr.voltage}</p>
                </div>

                {/* Load Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Current Load Factor:</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {fdr.currentLoadKw} / {fdr.capacityKw} kW ({loadPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        loadPct > 80 ? 'bg-amber-500' : loadPct > 50 ? 'bg-blue-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(loadPct, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Secondary Telemetry */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Power Factor:</span>{' '}
                    <strong className="text-slate-800 dark:text-slate-200 font-mono">{fdr.powerFactor}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 dark:text-slate-400">Winding Temp:</span>{' '}
                    <strong className={`font-mono ${fdr.temperatureC > 65 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {fdr.temperatureC}°C
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Running Costs & Departmental Utility Breakdown Table */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Detailed Running Cost Centers &amp; Utility Meters
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Specific cost allocation per manufacturing station, cleanroom bay, nitrogen generation, and backup diesel consumption.
            </p>
          </div>

          {/* Table Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search meter or cost center..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 w-56 transition-colors"
              />
            </div>

            <select
              value={activeCategoryFilter}
              onChange={(e) => setActiveCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="ALL">All Utilities</option>
              <option value="ELECTRICITY_GRID">HT Grid Power</option>
              <option value="NITROGEN_GAS">Nitrogen Bulk Gas</option>
              <option value="DIESEL_BACKUP">Diesel Fuel (DG)</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/30">
                <th className="py-2.5 px-3 font-semibold">Cost Center &amp; Station</th>
                <th className="py-2.5 px-3 font-semibold">Meter Code</th>
                <th className="py-2.5 px-3 font-semibold">Monthly Usage</th>
                <th className="py-2.5 px-3 font-semibold">Unit Tariff</th>
                <th className="py-2.5 px-3 font-semibold">Total Cost (₹)</th>
                <th className="py-2.5 px-3 font-semibold">Share of Bill</th>
                <th className="py-2.5 px-3 font-semibold text-right">Budget Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredCostCenters.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{item.costCenterCode}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                    {item.meterCode}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-800 dark:text-slate-200">
                    {item.monthlyConsumption.toLocaleString()} {item.unitMeasurement}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                    ₹{item.unitRate.toFixed(2)} / {item.unitMeasurement}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                    ₹{item.totalMonthlyCost.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full" style={{ width: `${item.sharePct * 2}%` }} />
                      </div>
                      <span className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        {item.sharePct}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.budgetStatus === 'WITHIN_BUDGET'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {item.budgetStatus === 'WITHIN_BUDGET' ? 'Within Target' : 'Review Usage'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Modal: Log Electricity Bill & Meter Reading */}
      {showLogBillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Zap className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Log Official Electricity Bill
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Record monthly state DISCOM invoice and audit demand charges
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLogBillModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {billLoggedSuccess ? (
              <div className="p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Electricity Bill Successfully Logged!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Energy ledger, power factor incentive credit, and P&amp;L overhead accounts have been updated.
                </p>
              </div>
            ) : (
              <form onSubmit={handleLogBill} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Billing Cycle
                    </label>
                    <input
                      type="text"
                      value={billForm.billingMonth}
                      onChange={(e) => setBillForm({ ...billForm, billingMonth: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Total Energy (kWh)
                    </label>
                    <input
                      type="number"
                      value={billForm.unitsKwh}
                      onChange={(e) => setBillForm({ ...billForm, unitsKwh: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Contract Demand (kVA)
                    </label>
                    <input
                      type="number"
                      value={billForm.contractDemandKva}
                      onChange={(e) => setBillForm({ ...billForm, contractDemandKva: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Recorded Peak (kVA)
                    </label>
                    <input
                      type="number"
                      value={billForm.recordedPeakKva}
                      onChange={(e) => setBillForm({ ...billForm, recordedPeakKva: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Billed Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={billForm.billedAmount}
                      onChange={(e) => setBillForm({ ...billForm, billedAmount: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Average Power Factor
                    </label>
                    <input
                      type="text"
                      value={billForm.powerFactor}
                      onChange={(e) => setBillForm({ ...billForm, powerFactor: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Utility / DISCOM Provider
                  </label>
                  <input
                    type="text"
                    value={billForm.discomProvider}
                    onChange={(e) => setBillForm({ ...billForm, discomProvider: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowLogBillModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 transition-all"
                  >
                    Confirm &amp; Post to Accounts
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 8. Modal: Peak Demand Shedding & Shift Simulator */}
      {showSimulatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <SlidersHorizontal className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Peak Demand Shedding &amp; Shift Simulator
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Estimate cost savings from shifting heavy utility loads to off-peak night hours
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSimulatorModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Target Peak Demand Ceiling:
                  </span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                    {targetPeakDemand} kW
                  </span>
                </div>
                <input
                  type="range"
                  min="1200"
                  max="1600"
                  step="10"
                  value={targetPeakDemand}
                  onChange={(e) => setTargetPeakDemand(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1,200 kW (Aggressive Shedding)</span>
                  <span>1,600 kW (Current Cap)</span>
                </div>
              </div>

              {/* Simulation Result Callout */}
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Projected Peak kW Shaved:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{estimatedDemandReductionKw} kW</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Demand Tariff Penalty Avoidance:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{estimatedMonthlySavings.toLocaleString()} / month
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-blue-200/40 dark:border-blue-800/40 pt-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Total Projected Annual Savings:</span>
                  <span className="font-mono font-bold text-base text-emerald-600 dark:text-emerald-400">
                    ₹{((estimatedMonthlySavings * 12) / 100000).toFixed(2)} Lakh
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <p className="font-semibold text-slate-700 dark:text-slate-300">Recommended Actions to achieve target:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  <li>Run liquid nitrogen storage tank repressurization during 22:00 - 05:00 window.</li>
                  <li>Pre-cool Cleanroom Bay 1 &amp; 2 chilled water storage tanks prior to 08:00 morning shift.</li>
                  <li>Stagger high-power reflow oven heating start-up across 20-minute intervals.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowSimulatorModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
              >
                Apply Thresholds to Monitoring
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
