'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Users,
  ShieldAlert,
  Cpu,
  Activity,
  RefreshCw,
  LogOut,
  KeyRound,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Terminal,
  Server,
  Database,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Trash2,
  Sun,
  Moon,
  ExternalLink,
  Layers,
  MapPin,
  Clock,
  Lock,
} from 'lucide-react';

interface CapturedError {
  id: string;
  timestamp: string;
  endpoint: string;
  method: string;
  statusCode: number;
  message: string;
  stack?: string;
  companyId?: string | null;
  userEmail?: string | null;
  source: 'backend' | 'frontend';
}

interface DeveloperOverviewData {
  health: {
    database: {
      connected: boolean;
      provider: string;
      status: string;
      latencyMs: number;
      error?: string | null;
    };
    server: {
      uptimeSeconds: number;
      uptimeFormatted: string;
      memory: {
        rssMB: number;
        heapTotalMB: number;
        heapUsedMB: number;
        externalMB: number;
      };
      nodeVersion: string;
      platform: string;
      timestamp: string;
    };
    counts: {
      totalCompanies: number;
      totalUsers: number;
      activeCompanies: number;
      activeUsers: number;
      capturedErrors: number;
    };
  };
  companies: Array<{
    id: string;
    companyName: string;
    code: string | null;
    gstNumber: string;
    email: string;
    industryCategory: string;
    subCategory: string;
    defaultUnit: string;
    city: string | null;
    phone: string | null;
    isActive: boolean;
    createdAt: string;
    userCount: number;
    users: Array<{
      id: string;
      email: string;
      username: string | null;
      employeeCode: string | null;
      name: string;
      role: string;
      department: string;
      designation: string;
      isActive: boolean;
      lastLoginAt: string | null;
      createdAt: string;
      passwordHashPreview: string;
    }>;
  }>;
  errors: CapturedError[];
}

export default function DeveloperDashboardPage() {
  const router = useRouter();

  // State
  const [data, setData] = useState<DeveloperOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'companies' | 'errors' | 'health'>('companies');

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [errorFilter, setErrorFilter] = useState<'ALL' | '500' | '4xx' | 'frontend'>('ALL');
  const [expandedCompanies, setExpandedCompanies] = useState<Record<string, boolean>>({});
  const [expandedErrors, setExpandedErrors] = useState<Record<string, boolean>>({});

  // Password Reset Modal / Dialog State
  const [resetModalUser, setResetModalUser] = useState<{
    id: string;
    email: string;
    companyName: string;
  } | null>(null);
  const [customPassword, setCustomPassword] = useState<string>('');
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Theme Management
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Load and apply theme
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

  // Copy to clipboard helper
  const handleCopy = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Fetch Overview Data from Developer API
  const fetchOverview = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    else setIsRefreshing(true);
    setErrorBanner(null);

    const token =
      localStorage.getItem('developer_token') ||
      localStorage.getItem('access_token');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/developer/overview`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('developer_token');
          router.push('/auth/login');
          return;
        }
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || 'Failed to fetch developer metrics');
      }

      const overviewData: DeveloperOverviewData = await response.json();
      setData(overviewData);

      // Auto-expand all companies by default for easy viewing
      const defaultExpanded: Record<string, boolean> = {};
      overviewData.companies.forEach((comp) => {
        defaultExpanded[comp.id] = true;
      });
      setExpandedCompanies(defaultExpanded);
    } catch (err: any) {
      setErrorBanner(err.message || 'Unable to communicate with Developer API');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [router]);

  // Initial load & automatic polling every 15 seconds
  useEffect(() => {
    fetchOverview();
    const interval = setInterval(() => {
      fetchOverview(true);
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchOverview]);

  // Capture client-side unhandled errors & rejections
  useEffect(() => {
    const handleWindowError = (event: ErrorEvent) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      fetch(`${apiUrl}/developer/report-frontend-error`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: event.message,
          stack: event.error?.stack,
          endpoint: window.location.pathname,
          statusCode: 500,
          userEmail: 'erp@devel.com',
        }),
      }).catch(() => {});
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const reason = event.reason;
      fetch(`${apiUrl}/developer/report-frontend-error`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message:
            typeof reason === 'string'
              ? reason
              : reason?.message || 'Unhandled Promise Rejection',
          stack: reason?.stack,
          endpoint: window.location.pathname,
          statusCode: 500,
          userEmail: 'erp@devel.com',
        }),
      }).catch(() => {});
    };

    window.addEventListener('error', handleWindowError);
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('error', handleWindowError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  // Clear Error Logs
  const handleClearErrors = async () => {
    const token =
      localStorage.getItem('developer_token') ||
      localStorage.getItem('access_token');
    if (!token) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/developer/clear-errors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        if (data) {
          setData({
            ...data,
            errors: [],
            health: {
              ...data.health,
              counts: { ...data.health.counts, capturedErrors: 0 },
            },
          });
        }
      }
    } catch {
      // Ignored
    }
  };

  // Perform Password Reset
  const handleExecutePasswordReset = async () => {
    if (!resetModalUser) return;
    setIsResetting(true);
    setResetSuccessMessage(null);

    const token =
      localStorage.getItem('developer_token') ||
      localStorage.getItem('access_token');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/developer/reset-user-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: resetModalUser.id,
          newPassword: customPassword.trim() || undefined,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to reset password');
      }

      setResetSuccessMessage(
        `Password successfully set to: ${result.newPassword}`,
      );
      // Refresh data in background
      fetchOverview(true);
    } catch (err: any) {
      alert(err.message || 'Failed to reset user password');
    } finally {
      setIsResetting(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('developer_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth_user');
    router.push('/auth/login');
  };

  // Filtered Companies
  const filteredCompanies = useMemo(() => {
    if (!data?.companies) return [];
    const query = searchQuery.trim().toLowerCase();

    return data.companies.filter((company) => {
      // Sector filter
      if (selectedSector !== 'ALL' && company.industryCategory !== selectedSector) {
        return false;
      }
      if (!query) return true;

      const matchCompany =
        company.companyName.toLowerCase().includes(query) ||
        (company.code && company.code.toLowerCase().includes(query)) ||
        company.gstNumber.toLowerCase().includes(query) ||
        company.email.toLowerCase().includes(query) ||
        company.subCategory.toLowerCase().includes(query) ||
        (company.city && company.city.toLowerCase().includes(query));

      const matchUser = company.users.some(
        (u) =>
          u.email.toLowerCase().includes(query) ||
          (u.username && u.username.toLowerCase().includes(query)) ||
          u.role.toLowerCase().includes(query) ||
          u.name.toLowerCase().includes(query),
      );

      return matchCompany || matchUser;
    });
  }, [data?.companies, searchQuery, selectedSector]);

  // Filtered Errors
  const filteredErrors = useMemo(() => {
    if (!data?.errors) return [];
    return data.errors.filter((err) => {
      if (errorFilter === '500') return err.statusCode >= 500;
      if (errorFilter === '4xx') return err.statusCode >= 400 && err.statusCode < 500;
      if (errorFilter === 'frontend') return err.source === 'frontend';
      return true;
    });
  }, [data?.errors, errorFilter]);

  // Unique Industry Categories for filter selector
  const availableCategories = useMemo(() => {
    if (!data?.companies) return [];
    const set = new Set(data.companies.map((c) => c.industryCategory));
    return Array.from(set);
  }, [data?.companies]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Developer View &amp; System Health
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                Super Dev Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Authenticated as <span className="font-semibold text-blue-600 dark:text-blue-400">erp@devel.com</span> &bull; Global Multi-Tenant Observability
            </p>
          </div>
        </div>

        {/* Header Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* Refresh button */}
          <button
            type="button"
            onClick={() => fetchOverview(true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all disabled:opacity-60"
            title="Refresh developer metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Theme toggle */}
          {mounted && (
            <button
              type="button"
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          )}

          {/* Regular Portal link */}
          <Link
            href="/dashboard"
            className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
          >
            <span>ERP App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Logout button */}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit Dev</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Error Banner if any */}
        {errorBanner && (
          <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{errorBanner}</span>
            </div>
            <button
              onClick={() => setErrorBanner(null)}
              className="text-xs font-bold text-red-500 hover:text-red-700"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 1. Live System Health Telemetry Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Database Connectivity */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Database Engine
              </span>
              <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {data?.health.database.status || (isLoading ? 'Checking...' : 'Disconnected')}
              </span>
              {data?.health.database.connected && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  {data.health.database.latencyMs} ms
                </span>
              )}
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {data?.health.database.provider || 'PostgreSQL Connection'}
            </p>
          </div>

          {/* Card 2: Registered Companies */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Tenant Companies
              </span>
              <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {data?.health.counts.totalCompanies ?? (isLoading ? '...' : 0)}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                ({data?.health.counts.activeCompanies ?? 0} active)
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Isolated multi-tenant operational facilities
            </p>
          </div>

          {/* Card 3: Enterprise Users */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Workforce Credentials
              </span>
              <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {data?.health.counts.totalUsers ?? (isLoading ? '...' : 0)}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                ({data?.health.counts.activeUsers ?? 0} active)
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              RBAC users &amp; super admins across plants
            </p>
          </div>

          {/* Card 4: Runtime Errors & Uptime */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Errors &amp; Uptime
              </span>
              <div
                className={`p-1.5 rounded-md ${
                  (data?.health.counts.capturedErrors || 0) > 0
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {data?.health.counts.capturedErrors ?? 0} errors
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {data?.health.server.uptimeFormatted || '0s'}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Heap: {data?.health.server.memory.heapUsedMB ?? 0} / {data?.health.server.memory.heapTotalMB ?? 0} MB
            </p>
          </div>
        </section>

        {/* 2. Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('companies')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'companies'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Registered Companies &amp; Credentials ({data?.companies.length ?? 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('errors')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'errors'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>Live Error Monitor</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  (data?.errors.length || 0) > 0
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {data?.errors.length ?? 0}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('health')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'health'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Server Telemetry
            </button>
          </div>
        </div>

        {/* Tab 1: Companies & Credentials Directory */}
        {activeTab === 'companies' && (
          <div className="space-y-4">
            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search company, GST, sector, email or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-medium text-slate-500">Category:</span>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="ALL">All Categories</option>
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Companies List */}
            {isLoading ? (
              <div className="p-12 text-center text-slate-400 text-xs sm:text-sm flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                <span>Loading registered tenant companies &amp; credentials...</span>
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="p-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-slate-400 text-xs sm:text-sm">
                No registered companies match the current search filters.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCompanies.map((company) => {
                  const isExpanded = !!expandedCompanies[company.id];

                  return (
                    <div
                      key={company.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all"
                    >
                      {/* Company Header Row */}
                      <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedCompanies((prev) => ({
                                ...prev,
                                [company.id]: !isExpanded,
                              }))
                            }
                            className="mt-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                {company.companyName}
                              </h3>
                              {company.code && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                  {company.code}
                                </span>
                              )}
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  company.isActive
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                    : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                                }`}
                              >
                                {company.isActive ? 'Active Tenant' : 'Suspended'}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                              <span className="font-mono">GST: {company.gstNumber}</span>
                              <span>&bull;</span>
                              <span>{company.email}</span>
                              {company.city && (
                                <>
                                  <span>&bull;</span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {company.city}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Sector Badges & Meta */}
                        <div className="flex items-center gap-2 flex-wrap md:self-center">
                          <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {company.subCategory} ({company.defaultUnit})
                          </span>
                          <span className="px-2 py-1 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
                            {company.users.length} {company.users.length === 1 ? 'User' : 'Users'}
                          </span>
                        </div>
                      </div>

                      {/* Expandable Users Table */}
                      {isExpanded && (
                        <div className="p-4 overflow-x-auto">
                          {company.users.length === 0 ? (
                            <p className="text-xs text-slate-400 italic py-2">
                              No user accounts registered under this enterprise tenant yet.
                            </p>
                          ) : (
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                  <th className="pb-2">User / Email</th>
                                  <th className="pb-2">Role &amp; Department</th>
                                  <th className="pb-2">Password Hash Preview</th>
                                  <th className="pb-2">Last Login</th>
                                  <th className="pb-2 text-right">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {company.users.map((user) => (
                                  <tr
                                    key={user.id}
                                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                                  >
                                    <td className="py-2.5 pr-3">
                                      <div className="font-semibold text-slate-900 dark:text-white">
                                        {user.name}
                                      </div>
                                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                        <span>{user.email}</span>
                                        {user.username && (
                                          <span className="text-slate-400">(@{user.username})</span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="py-2.5 pr-3">
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                                        {user.role}
                                      </span>
                                      <div className="text-[10px] text-slate-400 mt-0.5">
                                        {user.department} &bull; {user.designation}
                                      </div>
                                    </td>
                                    <td className="py-2.5 pr-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                                      <div className="flex items-center gap-1.5">
                                        <span>{user.passwordHashPreview}</span>
                                        <button
                                          type="button"
                                          onClick={() => handleCopy(user.passwordHashPreview, `hash-${user.id}`)}
                                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                          title="Copy hash snippet"
                                        >
                                          {copiedKey === `hash-${user.id}` ? (
                                            <Check className="w-3 h-3 text-emerald-500" />
                                          ) : (
                                            <Copy className="w-3 h-3" />
                                          )}
                                        </button>
                                      </div>
                                    </td>
                                    <td className="py-2.5 pr-3 text-[11px] text-slate-500 dark:text-slate-400">
                                      {user.lastLoginAt ? (
                                        new Date(user.lastLoginAt).toLocaleString('en-IN', {
                                          dateStyle: 'short',
                                          timeStyle: 'short',
                                        })
                                      ) : (
                                        <span className="italic text-slate-400">Never</span>
                                      )}
                                    </td>
                                    <td className="py-2.5 text-right">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setResetModalUser({
                                            id: user.id,
                                            email: user.email,
                                            companyName: company.companyName,
                                          });
                                          setCustomPassword('');
                                          setResetSuccessMessage(null);
                                        }}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 transition-all"
                                      >
                                        <KeyRound className="w-3 h-3" />
                                        <span>Reset Password</span>
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Live Website & API Error Monitor */}
        {activeTab === 'errors' && (
          <div className="space-y-4">
            {/* Error Monitor Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Filter Errors:
                </span>
                {(['ALL', '500', '4xx', 'frontend'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setErrorFilter(mode)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      errorFilter === mode
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {mode === 'ALL'
                      ? 'All Errors'
                      : mode === '500'
                      ? '500 Server Errors'
                      : mode === '4xx'
                      ? '4xx Client Errors'
                      : 'Client UI Errors'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearErrors}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Error Logs</span>
                </button>
              </div>
            </div>

            {/* Error Log Entries */}
            {filteredErrors.length === 0 ? (
              <div className="p-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Zero Errors Recorded
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  No active runtime exceptions or HTTP failures have occurred. System operational metrics are optimal.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredErrors.map((err) => {
                  const isExpanded = !!expandedErrors[err.id];
                  const is500 = err.statusCode >= 500;

                  return (
                    <div
                      key={err.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
                    >
                      <div className="p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                              is500
                                ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {err.statusCode}
                          </span>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                                {err.method} {err.endpoint}
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[10px] uppercase font-bold tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {err.source}
                              </span>
                              {err.companyId && (
                                <span className="text-[10px] text-slate-400 font-mono">
                                  Tenant: {err.companyId}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-1">
                              {err.message}
                            </p>
                          </div>
                        </div>

                        {/* Timestamp & Expand Stack */}
                        <div className="flex items-center gap-3 self-end md:self-center">
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            {new Date(err.timestamp).toLocaleTimeString('en-IN')}
                          </span>

                          {err.stack && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedErrors((prev) => ({
                                  ...prev,
                                  [err.id]: !isExpanded,
                                }))
                              }
                              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                            >
                              <span>{isExpanded ? 'Hide Stack' : 'View Stack'}</span>
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform ${
                                  isExpanded ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Stack Trace Dropdown */}
                      {isExpanded && err.stack && (
                        <div className="p-3 bg-slate-900 border-t border-slate-800 text-slate-200 text-xs font-mono overflow-x-auto max-h-60 leading-relaxed">
                          <pre>{err.stack}</pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Server Telemetry & Architecture */}
        {activeTab === 'health' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Database & Multi-Tenant Specs */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Database &amp; Multi-Tenancy Engine
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500">Provider</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    PostgreSQL (Prisma ORM)
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500">Active Connection Status</span>
                  <span
                    className={`font-semibold ${
                      data?.health.database.connected
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-500'
                    }`}
                  >
                    {data?.health.database.status} ({data?.health.database.latencyMs}ms ping)
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500">Tenant Isolation Level</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    Strict companyId Foreign Key Scoping
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500">Total Registered Enterprises</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {data?.health.counts.totalCompanies}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Total Workforce Users</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {data?.health.counts.totalUsers}
                  </span>
                </div>
              </div>
            </div>

            {/* Server Process & V8 Memory */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Server Process &amp; Memory Allocation
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500">Server Uptime</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {data?.health.server.uptimeFormatted} ({data?.health.server.uptimeSeconds}s)
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500">V8 Heap Memory Used</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                    {data?.health.server.memory.heapUsedMB} MB / {data?.health.server.memory.heapTotalMB} MB
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500">Resident Set Size (RSS)</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                    {data?.health.server.memory.rssMB} MB
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500">Node Runtime</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {data?.health.server.nodeVersion} ({data?.health.server.platform})
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Developer Root Identity</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    erp@devel.com (Signed JWT Validated)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. Password Reset Modal Dialog */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Reset User Password
                </h3>
                <p className="text-xs text-slate-500 truncate max-w-xs">
                  {resetModalUser.email} &bull; {resetModalUser.companyName}
                </p>
              </div>
            </div>

            {resetSuccessMessage ? (
              <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Password Reset Completed!</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 font-mono text-xs">
                  <span>{customPassword || resetSuccessMessage.split(': ')[1]}</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        customPassword || resetSuccessMessage.split(': ')[1],
                        'modal-pass',
                      )
                    }
                    className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    {copiedKey === 'modal-pass' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="w-full mt-2 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    New Password (Optional, leave blank for random secure password)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Erp@839201"
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Will be encrypted using bcrypt and stored safely in the database.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    disabled={isResetting}
                    onClick={() => setResetModalUser(null)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isResetting}
                    onClick={handleExecutePasswordReset}
                    className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm transition-colors disabled:opacity-60"
                  >
                    {isResetting ? 'Resetting...' : 'Confirm Reset'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
