'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  ShieldAlert,
  ShieldCheck,
  Award,
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Layers,
  Package,
  TrendingUp,
  DollarSign,
  Activity,
  Sparkles,
  Filter,
  Plus,
  ChevronRight,
  Sun,
  Moon,
  Info,
  Sliders,
  Send,
  X,
  Eye,
} from 'lucide-react';
import { UserPayload } from '../../../types/auth';

interface RawMaterialItem {
  id: string;
  materialCode?: string;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  unit: string;
  currentStock: number;
  minStockLevel: number;
}

interface ProductItem {
  id: string;
  sku?: string;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  unit: string;
  currentStock: number;
  minStockLevel: number;
  status: string;
}

interface ApprovalRequestItem {
  id: string;
  requestNumber: string;
  entityType: string;
  entityId?: string | null;
  actionType: string;
  title: string;
  description?: string | null;
  proposedChangesJson: string;
  previousStateJson?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requesterRole: string;
  requesterName?: string;
  reviewerName?: string;
  rejectionReason?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
}

export default function ExecutivePortalPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserPayload | null>(null);
  const [activeTab, setActiveTab] = useState<'movements' | 'catalogues' | 'my-approvals'>('movements');

  // Loading & Feedback
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Data states
  const [overviewData, setOverviewData] = useState<any>(null);
  const [rawMaterials, setRawMaterials] = useState<RawMaterialItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [draftRequests, setDraftRequests] = useState<ApprovalRequestItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals for Draft Edits
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'RAW_MATERIAL' | 'PRODUCT';
    item: any;
  } | null>(null);

  // Form states for draft edit
  const [draftCostPrice, setDraftCostPrice] = useState('');
  const [draftSellingPrice, setDraftSellingPrice] = useState('');
  const [draftMinStock, setDraftMinStock] = useState('');
  const [draftReason, setDraftReason] = useState('');
  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      if (!savedTheme) localStorage.setItem('theme', 'light');
    }

    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch {
        setCurrentUser(null);
      }
    }

    loadExecutiveData();
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

  const loadExecutiveData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // 1. Fetch Executive Overview
      try {
        const res = await fetch(`${apiUrl}/executive/overview`, { headers });
        if (res.ok) {
          const data = await res.json();
          setOverviewData(data);
        }
      } catch (e) {
        console.warn('Overview API fallback', e);
      }

      // 2. Fetch Raw Materials
      try {
        const res = await fetch(`${apiUrl}/super-admin/raw-materials`, { headers });
        if (res.ok) {
          const data = await res.json();
          setRawMaterials(data);
        } else {
          fallbackRawMaterials();
        }
      } catch {
        fallbackRawMaterials();
      }

      // 3. Fetch Products
      try {
        const res = await fetch(`${apiUrl}/super-admin/products`, { headers });
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        } else {
          fallbackProducts();
        }
      } catch {
        fallbackProducts();
      }

      // 4. Fetch Drafts / Approvals
      try {
        const res = await fetch(`${apiUrl}/approvals`, { headers });
        if (res.ok) {
          const data = await res.json();
          setDraftRequests(data);
        } else {
          fallbackDrafts();
        }
      } catch {
        fallbackDrafts();
      }
    } catch (err: any) {
      setFeedbackError('Could not sync live executive server data. Operating with tenant cache.');
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackRawMaterials = () => {
    setRawMaterials([]);
  };

  const fallbackProducts = () => {
    setProducts([]);
  };

  const fallbackDrafts = () => {
    setDraftRequests([]);
  };

  const openDraftModal = (type: 'RAW_MATERIAL' | 'PRODUCT', item: any) => {
    setSelectedEntity({ type, item });
    setDraftCostPrice(item.costPrice ? item.costPrice.toString() : '');
    setDraftSellingPrice(item.sellingPrice ? item.sellingPrice.toString() : '');
    setDraftMinStock(item.minStockLevel ? item.minStockLevel.toString() : '');
    setDraftReason('');
    setIsDraftModalOpen(true);
    setFeedbackSuccess(null);
    setFeedbackError(null);
  };

  const handleSubmitDraftEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntity) return;

    if (!draftReason.trim()) {
      setFeedbackError('A clear justification reason is mandatory for executive change requests.');
      return;
    }

    setIsSubmittingDraft(true);
    setFeedbackError(null);
    setFeedbackSuccess(null);

    const token = localStorage.getItem('access_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const endpoint =
      selectedEntity.type === 'RAW_MATERIAL'
        ? `${apiUrl}/executive/draft/raw-material/${selectedEntity.item.id}`
        : `${apiUrl}/executive/draft/product/${selectedEntity.item.id}`;

    const payload = {
      costPrice: Number(draftCostPrice),
      sellingPrice: Number(draftSellingPrice),
      minStockLevel: Number(draftMinStock),
      reason: draftReason.trim(),
    };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Draft submission failed');
      }

      const resData = await res.json();
      setFeedbackSuccess(
        `Draft request submitted successfully! Assigned request ID: ${
          resData?.approvalRequest?.requestNumber || 'REQ-APPV-NEW'
        }. Live records remain intact until Super Admin signs off.`,
      );

      // Add to local draft requests state
      const newDraft: ApprovalRequestItem = resData.approvalRequest || {
        id: `appv-${Date.now()}`,
        requestNumber: `REQ-APPV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        entityType: selectedEntity.type,
        entityId: selectedEntity.item.id,
        actionType: 'UPDATE',
        title: `Draft Revision: ${selectedEntity.item.name} (${selectedEntity.item.id})`,
        description: draftReason.trim(),
        proposedChangesJson: JSON.stringify({
          costPrice: Number(draftCostPrice),
          sellingPrice: Number(draftSellingPrice),
          minStockLevel: Number(draftMinStock),
        }),
        previousStateJson: JSON.stringify({
          costPrice: selectedEntity.item.costPrice,
          sellingPrice: selectedEntity.item.sellingPrice,
          minStockLevel: selectedEntity.item.minStockLevel,
        }),
        status: 'PENDING',
        requesterRole: 'EXECUTIVE',
        requesterName: currentUser?.firstName || 'Chief Executive',
        createdAt: new Date().toISOString(),
      };

      setDraftRequests((prev) => [newDraft, ...prev]);
      setIsDraftModalOpen(false);
      setActiveTab('my-approvals');
    } catch (err: any) {
      setFeedbackError(err.message || 'Submission failed. Please check network/authorization.');
    } finally {
      setIsSubmittingDraft(false);
    }
  };

  const filteredDrafts = useMemo(() => {
    if (statusFilter === 'ALL') return draftRequests;
    return draftRequests.filter((d) => d.status === statusFilter);
  }, [draftRequests, statusFilter]);

  const companyCategory =
    overviewData?.company?.industryCategory ||
    currentUser?.company?.industryCategory ||
    'Heavy and Raw Materials';
  const companySubCategory =
    overviewData?.company?.subCategory ||
    currentUser?.company?.subCategory ||
    'Steel and Heavy Metals';
  const companyName =
    overviewData?.company?.companyName ||
    currentUser?.company?.name ||
    'Enterprise Manufacturing';
  const defaultUnit = overviewData?.company?.defaultUnit || 'MT';

  if (!mounted) return null;

  return (
    <div className={`flex-1 flex flex-col min-w-0 ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-20 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 text-base font-semibold whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Executive Leadership Portal
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 whitespace-nowrap shrink-0">
                    EXECUTIVE ROLE
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {companyName} • {companySubCategory} ({companyCategory})
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/quality"
              className="px-4 py-2.5 rounded-xl text-base font-semibold border border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 transition-all flex items-center gap-2 shadow-sm whitespace-nowrap shrink-0"
            >
              <ShieldCheck className="w-5 h-5 text-cyan-600" />
              <span>Quality Dept</span>
            </Link>

            <Link
              href="/dashboard/super-admin/approvals"
              className="px-4 py-2.5 rounded-xl text-base font-semibold border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all flex items-center gap-2 shadow-sm whitespace-nowrap shrink-0"
            >
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>Super Admin Queue</span>
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all whitespace-nowrap shrink-0"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* MANDATORY PERSISTENT EXECUTIVE GOVERNANCE BANNER */}
        <div className="rounded-2xl p-5 border-2 border-amber-400/80 bg-gradient-to-r from-amber-50 via-amber-100/40 to-yellow-50 dark:from-amber-950/50 dark:via-amber-900/30 dark:to-yellow-950/20 shadow-md">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <span>Executive Governance &amp; Multi-Tenant Movement Visibility</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-extrabold uppercase tracking-wide">
                    Strict Approval Pipeline Active
                  </span>
                </h3>
                <span className="text-sm font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  {draftRequests.filter((d) => d.status === 'PENDING').length} Drafts Awaiting Sign-off
                </span>
              </div>
              <p className="mt-1.5 text-base text-amber-800/90 dark:text-amber-300/90 leading-relaxed font-medium">
                As an Executive, you possess full visibility across factory shop floors, turnover metrics, and dispatch
                movements. To maintain absolute enterprise integrity and audit compliance, <strong>all catalogue edits,
                price modifications, and stock adjustments submit as draft proposals</strong> requiring formal sign-off
                from the <strong>Super Admin</strong> before committing to the live database.
              </p>
            </div>
          </div>
        </div>

        {/* Feedback alerts */}
        {feedbackSuccess && (
          <div className="rounded-xl p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between text-base font-semibold animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
              <span>{feedbackSuccess}</span>
            </div>
            <button onClick={() => setFeedbackSuccess(null)} className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {feedbackError && (
          <div className="rounded-xl p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center justify-between text-base font-semibold animate-fadeIn">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-500 flex-shrink-0" />
              <span>{feedbackError}</span>
            </div>
            <button onClick={() => setFeedbackError(null)} className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* High-Level Plant KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Monthly Turnover
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                ₹{((overviewData?.plantKpis?.monthlyRevenue || 0) / 100000).toFixed(2)}L
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-500">
                <TrendingUp className="w-4 h-4" />
                <span>Monthly live billing</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Gross Margin
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {overviewData?.plantKpis?.grossMarginPct || 0}%
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <span>Enterprise spread</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Shop Floor Lines Active
              </span>
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {overviewData?.plantKpis?.activeShopFloorLines || 0} Lines
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-500">
                <span>OEE Efficiency: {overviewData?.plantKpis?.plantEfficiencyOee || 0}%</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Draft Approvals Pending
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                {draftRequests.filter((d) => d.status === 'PENDING').length}
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <span>In Super Admin review queue</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('movements')}
            className={`px-5 py-3 rounded-xl font-bold text-base transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0 ${
              activeTab === 'movements'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span>Company Movements &amp; Dispatches</span>
          </button>

          <button
            onClick={() => setActiveTab('catalogues')}
            className={`px-5 py-3 rounded-xl font-bold text-base transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0 ${
              activeTab === 'catalogues'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-5 h-5" />
            <span>Master Catalogues (Draft Revisions)</span>
          </button>

          <button
            onClick={() => setActiveTab('my-approvals')}
            className={`px-5 py-3 rounded-xl font-bold text-base transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0 ${
              activeTab === 'my-approvals'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileCheck className="w-5 h-5" />
            <span>Approval Tracking ({draftRequests.length})</span>
          </button>
        </div>

        {/* TAB 1: MOVEMENTS & LIVE LOGS */}
        {activeTab === 'movements' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Live Plant Material Movement &amp; Consignment Feed
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Real-time visibility across raw material receipts, furnace batches, and outbound dispatches.
                  </p>
                </div>
                <button
                  onClick={loadExecutiveData}
                  className="px-3.5 py-2 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh Feed</span>
                </button>
              </div>

              <div className="space-y-3.5">
                {(overviewData?.recentMovements || [
                  {
                    id: 'mov-1',
                    timestamp: new Date().toISOString(),
                    type: 'DISPATCH_OUTWARD',
                    item: 'Forged Alloy Steel Flanges (Batch #BF-2026-90)',
                    quantity: '34 MT',
                    destination: 'Siemens Energy Ltd., Pune',
                    status: 'IN_TRANSIT',
                  },
                ]).map((mov: any) => (
                  <div
                    key={mov.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-4 flex-wrap"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                          mov.type.includes('OUTWARD')
                            ? 'bg-blue-100 dark:bg-blue-950/70 text-blue-600'
                            : mov.type.includes('INWARD')
                            ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600'
                            : 'bg-purple-100 dark:bg-purple-950/70 text-purple-600'
                        }`}
                      >
                        {mov.type.includes('OUTWARD') ? (
                          <ArrowRight className="w-5 h-5" />
                        ) : mov.type.includes('INWARD') ? (
                          <Package className="w-5 h-5" />
                        ) : (
                          <Activity className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="text-base font-bold text-slate-900 dark:text-white">
                          {mov.item}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          Qty: <strong className="text-slate-700 dark:text-slate-300">{mov.quantity}</strong> • {mov.destination ? `To: ${mov.destination}` : mov.supplier ? `From: ${mov.supplier}` : mov.line}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {mov.status}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(mov.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MASTER CATALOGUES WITH DRAFT EDIT TRIGGER */}
        {activeTab === 'catalogues' && (
          <div className="space-y-8">
            {/* Raw Materials Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-indigo-500" />
                    <span>Raw Materials Inventory &amp; Cost Baselines</span>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Click &quot;Draft Revision&quot; to propose pricing or buffer stock changes. Live records will not change until Super Admin signs off.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                      <th className="py-3 px-4">Code / Item</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Current Stock</th>
                      <th className="py-3 px-4">Cost Price</th>
                      <th className="py-3 px-4">Valuation Price</th>
                      <th className="py-3 px-4 text-right">Executive Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-base">
                    {rawMaterials.map((rm) => (
                      <tr key={rm.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{rm.name}</div>
                          <div className="text-xs text-slate-400 font-mono">{rm.materialCode || rm.id}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                          {rm.category}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          {rm.currentStock.toLocaleString()} {rm.unit}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                          ₹{rm.costPrice.toLocaleString()} / {rm.unit}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{rm.sellingPrice.toLocaleString()} / {rm.unit}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => openDraftModal('RAW_MATERIAL', rm)}
                            className="px-3.5 py-2 rounded-xl text-sm font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all flex items-center gap-1.5 ml-auto"
                          >
                            <Sliders className="w-4 h-4 text-amber-600" />
                            <span>Draft Revision</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Finished Products Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-500" />
                    <span>Finished Goods &amp; Commercial Pricing</span>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Propose commercial selling price revisions and minimum buffer stock triggers.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                      <th className="py-3 px-4">SKU / Product</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Available Inventory</th>
                      <th className="py-3 px-4">Mfg Cost</th>
                      <th className="py-3 px-4">Commercial Price</th>
                      <th className="py-3 px-4 text-right">Executive Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-base">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
                          <div className="text-xs text-slate-400 font-mono">{p.sku || p.id}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                          {p.category}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          {p.currentStock.toLocaleString()} {p.unit}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                          ₹{p.costPrice.toLocaleString()} / {p.unit}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          ₹{p.sellingPrice.toLocaleString()} / {p.unit}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => openDraftModal('PRODUCT', p)}
                            className="px-3.5 py-2 rounded-xl text-sm font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all flex items-center gap-1.5 ml-auto"
                          >
                            <Sliders className="w-4 h-4 text-amber-600" />
                            <span>Draft Revision</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MY SUBMITTED DRAFT REQUESTS TRACKER */}
        {activeTab === 'my-approvals' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-indigo-500" />
                  <span>Executive Modification Approval Status</span>
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Track the sign-off pipeline for revisions submitted to Super Admin.
                </p>
              </div>

              {/* Status filter tabs */}
              <div className="flex items-center gap-2">
                {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                      statusFilter === st
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredDrafts.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  <Clock className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                  <p className="text-base font-semibold">No approval requests found in this status.</p>
                </div>
              ) : (
                filteredDrafts.map((req) => {
                  let proposed: any = {};
                  let previous: any = {};
                  try {
                    proposed = JSON.parse(req.proposedChangesJson);
                  } catch {
                    proposed = req.proposedChangesJson;
                  }
                  try {
                    if (req.previousStateJson) previous = JSON.parse(req.previousStateJson);
                  } catch {
                    previous = req.previousStateJson;
                  }

                  return (
                    <div
                      key={req.id}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-4"
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {req.requestNumber}
                            </span>
                            <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                              {req.entityType}
                            </span>
                            <h4 className="text-base font-bold text-slate-900 dark:text-white">
                              {req.title}
                            </h4>
                          </div>
                          {req.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                              <strong>Justification:</strong> {req.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                              req.status === 'PENDING'
                                ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                                : req.status === 'APPROVED'
                                ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                : 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                            }`}
                          >
                            {req.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                            {req.status === 'APPROVED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {req.status === 'REJECTED' && <XCircle className="w-3.5 h-3.5" />}
                            <span>{req.status}</span>
                          </span>
                        </div>
                      </div>

                      {/* Side by side diff preview */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium">
                        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-xs font-bold uppercase text-slate-400 block mb-1.5">
                            Previous Baseline Values
                          </span>
                          <div className="font-mono text-xs space-y-1 text-slate-600 dark:text-slate-400">
                            {typeof previous === 'object' && previous !== null ? (
                              Object.entries(previous).map(([k, v]) => (
                                <div key={k} className="flex justify-between">
                                  <span className="capitalize">{k}:</span>
                                  <span className="font-bold">{String(v)}</span>
                                </div>
                              ))
                            ) : (
                              <span>N/A</span>
                            )}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50">
                          <span className="text-xs font-bold uppercase text-indigo-700 dark:text-indigo-400 block mb-1.5">
                            Proposed Executive Changes
                          </span>
                          <div className="font-mono text-xs space-y-1 text-indigo-950 dark:text-indigo-200">
                            {typeof proposed === 'object' && proposed !== null ? (
                              Object.entries(proposed).map(([k, v]) => (
                                <div key={k} className="flex justify-between">
                                  <span className="capitalize font-semibold">{k}:</span>
                                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                                    {String(v)}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <span>{String(proposed)}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Footer remarks */}
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <span>Submitted on {new Date(req.createdAt).toLocaleString()}</span>
                        {req.status === 'APPROVED' && (
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            Signed off &amp; Committed to Live Database
                          </span>
                        )}
                        {req.status === 'REJECTED' && (
                          <span className="font-bold text-rose-600 dark:text-rose-400">
                            Rejection Reason: {req.rejectionReason || 'Declined by Super Admin'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </main>

      {/* DRAFT EDIT MODAL */}
      {isDraftModalOpen && selectedEntity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-6 h-6 text-amber-500" />
                  <span>Propose Revision: {selectedEntity.item.name}</span>
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Target Entity: {selectedEntity.type} ({selectedEntity.item.id})
                </p>
              </div>
              <button
                onClick={() => setIsDraftModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-sm font-semibold text-amber-900 dark:text-amber-200 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Approval Requirement Notice:</strong> This modification will not update live pricing or inventory
                immediately. A formal change ticket will be submitted to Super Admin for sign-off.
              </span>
            </div>

            <form onSubmit={handleSubmitDraftEdit} className="space-y-4 text-base">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Proposed Cost Price (₹)
                  </label>
                  <input
                    type="number"
                    value={draftCostPrice}
                    onChange={(e) => setDraftCostPrice(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="text-xs text-slate-400 mt-1 block">
                    Current: ₹{selectedEntity.item.costPrice}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Proposed Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    value={draftSellingPrice}
                    onChange={(e) => setDraftSellingPrice(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="text-xs text-slate-400 mt-1 block">
                    Current: ₹{selectedEntity.item.sellingPrice}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Proposed Minimum Buffer Stock
                </label>
                <input
                  type="number"
                  value={draftMinStock}
                  onChange={(e) => setDraftMinStock(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <span className="text-xs text-slate-400 mt-1 block">
                  Current: {selectedEntity.item.minStockLevel || 10} {selectedEntity.item.unit}
                </span>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Executive Justification &amp; Rationale <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={draftReason}
                  onChange={(e) => setDraftReason(e.target.value)}
                  placeholder="e.g. Q4 vendor contract price renegotiation due to rising scrap energy tariffs..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDraftModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDraft}
                  className="px-6 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                  <span>{isSubmittingDraft ? 'Submitting Request...' : 'Submit for Super Admin Sign-off'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
