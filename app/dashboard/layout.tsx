'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Factory,
  LayoutDashboard,
  Users,
  Sparkles,
  ShieldAlert,
  Award,
  Package,
  ShieldCheck,
  Landmark,
  UserCheck,
  ShoppingCart,
  TrendingUp,
  Truck,
  Sun,
  Moon,
  LogOut,
  Building2,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { UserPayload } from '../../types/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserPayload | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);

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

    // Refresh profile in background if token exists
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

      // Fetch pending rate change notifications for Super Admin
      fetch(`${apiUrl}/super-admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && typeof data.unreadCount === 'number') {
            setUnreadNotifCount(data.unreadCount);
          }
        })
        .catch(() => {});
    }
  }, []);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
    'Industrial Manufacturing';
  const defaultUnit = currentUser?.company?.defaultUnit || 'MT';
  const tenantId = currentUser?.companyId || 'company_isolated_01';

  // Navigation Links
  const navSections = [
    {
      title: 'Core Administration',
      items: [
        {
          name: 'Plant Dashboard',
          href: '/dashboard',
          icon: LayoutDashboard,
          exact: true,
        },
        {
          name: 'Workforce & Roles',
          href: '/dashboard/users',
          icon: Users,
          badge: '10 Depts',
          badgeColor: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
        },
        {
          name: 'Specialized Operations',
          href: '/dashboard/roles',
          icon: Sparkles,
          badge: 'Operations Hub',
          badgeColor: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
        },
        {
          name: 'Super Admin Portal',
          href: '/dashboard/super-admin',
          icon: ShieldAlert,
          badge: unreadNotifCount > 0 ? `${unreadNotifCount} Alerts` : 'Control',
          badgeColor:
            unreadNotifCount > 0
              ? 'bg-rose-500 text-white font-extrabold animate-pulse'
              : 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
          exact: true,
        },

        {
          name: 'Executive Portal',
          href: '/dashboard/executive',
          icon: Award,
          badge: 'Leadership',
          badgeColor: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300',
        },
      ],
    },
    {
      title: 'Department Operations',
      items: [
        {
          name: 'Quality Department',
          href: '/dashboard/quality',
          icon: ShieldCheck,
          badge: 'QA / QC',
          badgeColor: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300',
        },
        {
          name: 'Inventory Department',
          href: '/dashboard/inventory',
          icon: Package,
          badge: 'Storage',
          badgeColor: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300',
        },
        {
          name: 'Finance Department',
          href: '/dashboard/finance',
          icon: Landmark,
          badge: 'Ledgers',
          badgeColor: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
        },
        {
          name: 'HR Department',
          href: '/dashboard/hr',
          icon: UserCheck,
          badge: 'Personnel',
          badgeColor: 'bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300',
        },
        {
          name: 'Procurement Dept',
          href: '/dashboard/procurement',
          icon: ShoppingCart,
          badge: 'Sourcing',
          badgeColor: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
        },
        {
          name: 'Sales Department',
          href: '/dashboard/sales',
          icon: TrendingUp,
          badge: 'Revenue',
          badgeColor: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
        },
        {
          name: 'Logistics Department',
          href: '/dashboard/logistics',
          icon: Truck,
          badge: 'Fleet',
          badgeColor: 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300',
        },
        {
          name: 'Gate Security',
          href: '/dashboard/gate-security',
          icon: ShieldAlert,
          badge: 'Access',
          badgeColor: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300',
        },
      ],
    },
  ];

  const isLinkActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname === href || (pathname.startsWith(href) && href !== '/dashboard');
  };

  const renderSidebarContent = () => (
    <>
      {/* Sidebar Brand Header */}
      <div className="h-20 px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3.5 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform shrink-0">
            <Factory className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Manufacturing ERP
            </div>
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              Plant Operations Suite
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 no-scrollbar">
        {navSections.map((section) => (
          <div key={section.title}>
            <div className="px-3 mb-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
              {section.title}
            </div>
            <nav className="space-y-1">
              {section.items.map((item) => {
                const active = isLinkActive(item.href, item.exact);
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      active
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-900/50'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <IconComponent
                        className={`w-4 h-4 shrink-0 ${
                          active
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 ${
                          item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}

        {/* Tenant Organization Metadata Box */}
        <div>
          <div className="px-3 mb-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Tenant Organization
          </div>
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
              <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">{companyName}</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Sector:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                {companySubCategory}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Tenant ID:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                {tenantId}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Default Unit:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {defaultUnit}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Footer: User Profile, Theme & Sign Out */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm shrink-0">
            {currentUser?.firstName?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {currentUser?.firstName || 'Enterprise User'}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {currentUser?.role || 'EXECUTIVE'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {mounted && (
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* ==================================================================== */}
      {/* 1. PERSISTENT DESKTOP LEFT SIDEBAR                                  */}
      {/* ==================================================================== */}
      <aside className="w-72 hidden md:flex flex-col flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors z-30 sticky top-0 h-screen">
        {renderSidebarContent()}
      </aside>

      {/* ==================================================================== */}
      {/* 2. MOBILE TOP BAR & SLIDE-OVER DRAWER                                */}
      {/* ==================================================================== */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            aria-label="Toggle Navigation Drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Factory className="w-5 h-5 text-blue-600" />
            <span className="font-black text-sm text-slate-900 dark:text-white truncate">
              {companyName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mounted && (
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            className="p-2 rounded-lg text-slate-400 hover:text-red-600"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop & Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-80 max-w-[85%] bg-white dark:bg-slate-900 h-full flex flex-col z-10 shadow-2xl">
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. DYNAMIC CONTENT AREA                                              */}
      {/* ==================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 max-w-full overflow-x-hidden pt-16 md:pt-0">
        {children}
      </div>
    </div>
  );
}
