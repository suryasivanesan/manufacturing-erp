'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Factory,
  LayoutDashboard,
  Activity,
  Package,
  ShieldCheck,
  ShieldAlert,
  Award,
  Users,
  Sparkles,
  Truck,
  Wrench,
  FileCheck2,
  Building2,
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Layers,
  ChevronRight,
  Plus,
  Gauge,
  Cpu,
  Zap,
  Scale,
  FlaskConical,
  RefreshCw,
  Landmark,
  UserCheck,
  ShoppingCart,
} from 'lucide-react';
import { UserPayload } from '../../types/auth';

export default function DashboardPage() {
  const router = useRouter();

  // Dark / Light Mode (strictly defaults to Light)
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Authenticated Tenant State
  const [currentUser, setCurrentUser] = useState<UserPayload | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState('overview');

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      if (!savedTheme) {
        localStorage.setItem('theme', 'light');
      }
    }

    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch {
        setCurrentUser(null);
      }
    }

    // Refresh profile in background
    const token = localStorage.getItem('access_token');
    if (token) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      fetch(`${apiUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setCurrentUser(data);
            localStorage.setItem('auth_user', JSON.stringify(data));
          }
        })
        .catch(() => {});
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

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth_user');
    router.push('/auth/login');
  };

  // Facility Metadata
  const companyName = currentUser?.company?.name || 'Manufacturing Enterprise';
  const companyCategory =
    currentUser?.company?.industryCategory ||
    currentUser?.industryCategory ||
    'Heavy and Raw Materials';
  const companySubCategory =
    currentUser?.company?.subCategory ||
    currentUser?.subCategory ||
    'Steel and Heavy Metals';
  const defaultUnit =
    currentUser?.company?.defaultUnit || 'MT';
  const tenantCode = currentUser?.company?.code || 'TENANT-001';

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Header */}
      <header className="min-h-20 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 px-6 lg:px-8 z-10 transition-colors">
        {/* Breadcrumb / Title */}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white whitespace-nowrap">
            Plant Operations Dashboard
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {companySubCategory} Facility
          </span>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* Quick Shift Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap shrink-0">
            <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Shift: Active Line</span>
          </div>

          {/* Operations Hub Button */}
          <Link
            href="/dashboard/roles"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-sm font-bold transition-all whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Specialized Hub</span>
          </Link>

          {/* Theme Toggle */}
          {mounted && (
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
          )}

          {/* Mobile Workforce Link */}
          <Link
            href="/dashboard/users"
            className="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold whitespace-nowrap shrink-0"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Workforce</span>
          </Link>
        </div>
      </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          {/* Welcome & Facility Banner */}
          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 sm:p-8 shadow-xl shadow-blue-600/10 overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/20 text-white backdrop-blur mb-3">
                <Building2 className="w-3.5 h-3.5" />
                <span>Tenant Isolation: {tenantCode} &bull; {companyCategory}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome to {companyName}
              </h2>
              <p className="mt-2 text-base text-blue-100 leading-relaxed">
                Your plant operations are active under the <strong>{companySubCategory}</strong> specialized sector.
                All production batches, inventory ledgers, and workforce roles are strictly isolated to your organization.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard/users"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-sm shadow hover:bg-blue-50 transition-all"
                >
                  <Users className="w-4 h-4" />
                  <span>Manage Workforce &amp; Roles</span>
                </Link>
                <Link
                  href="/dashboard/roles"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-800/80 hover:bg-blue-800 text-white font-bold text-sm border border-white/20 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch {companySubCategory} Operations</span>
                </Link>
              </div>
            </div>

            {/* Background Decorative Plant Graphic */}
            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
              <Factory className="w-64 h-64" />
            </div>
          </div>

          {/* ================================================================ */}
          {/* 3. OPERATIONAL METRIC CARDS (KPIs) - LIVE COMPANY METRICS        */}
          {/* ================================================================ */}
          <section className="space-y-4">
            <div className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Operational Key Performance Indicators
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: OEE */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-300">
                    Plant OEE Rate
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">
                  0.0%
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="px-2 py-0.5 rounded-full font-bold text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    No active runs
                  </span>
                  <span className="text-slate-400">Target ≥ 85%</span>
                </div>
              </div>

              {/* Card 2: Shift Throughput */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-300">
                    Daily Production Output
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
                    <Factory className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">
                  0 <span className="text-lg font-bold text-slate-400">{defaultUnit}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="px-2 py-0.5 rounded-full font-bold text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    0 Batches Completed
                  </span>
                  <span className="text-slate-400">Target: Pending</span>
                </div>
              </div>

              {/* Card 3: Quality First Pass Yield */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-300">
                    QA First-Pass Yield
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">
                  0.0%
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="px-2 py-0.5 rounded-full font-bold text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    No inspection lots
                  </span>
                  <span className="text-slate-400">0% Rework</span>
                </div>
              </div>

              {/* Card 4: Workforce & Governance */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-300">
                    Workforce On-Shift
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">
                  {currentUser ? '1 Personnel' : '0 Personnel'}
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="px-2 py-0.5 rounded-full font-bold text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                    Active Session
                  </span>
                  <span className="text-slate-400">Company Scoped</span>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================ */}
          {/* 4. SHOP FLOOR MONITOR & BATCH OPERATIONS                        */}
          {/* ================================================================ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Live Production Line Tracking */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Shop Floor Lines &amp; Active Runs
                </div>
                <span className="text-xs font-bold text-blue-600">
                  Telemetry Stream
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Activity className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    No Active Production Line Batches
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    No production runs or work orders are currently logged for {companyName}. Start a work order or log a batch in the Operations Hub to stream live telemetry.
                  </p>
                </div>
                <Link
                  href="/dashboard/roles"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch {companySubCategory} Operations</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Multi-Tenancy & Quality Gate Status */}
            <div className="space-y-4">
              <div className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Multi-Tenant Security Isolation
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-base text-slate-900 dark:text-white">
                      Zero Data Leak Guarantee
                    </div>
                    <div className="text-xs text-slate-400">
                      Company-scoped queries active
                    </div>
                  </div>
                </div>

                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Company ID:</span>
                    <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {currentUser?.companyId || 'company_isolated_01'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Industry:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {companyCategory}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sub-Category:</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {companySubCategory}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Default Unit:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {defaultUnit}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href="/dashboard/users"
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-sm font-bold hover:bg-blue-100 transition-colors"
                  >
                    <span>View Authorized Personnel</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Quick Launch Card */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-tr from-slate-900 to-slate-800 text-white space-y-3 shadow-md">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Specialized Operational Workflows</span>
                </div>
                <div className="text-base font-bold">
                  {companySubCategory} Operations
                </div>
                <p className="text-xs text-slate-300">
                  Access digital approvals, sensor logs, and statutory testing modules configured strictly for {companySubCategory}.
                </p>
                <Link
                  href="/dashboard/roles"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all"
                >
                  <span>Launch Operations Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}
