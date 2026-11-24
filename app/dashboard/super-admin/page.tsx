'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Factory,
  Users,
  Package,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  Building2,
  UserX,
  UserCheck,
  RefreshCw,
  BarChart3,
  Layers,
  ArrowLeft,
  Sun,
  Moon,
  Clock,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  DollarSign,
  Activity,
  Award,
  Landmark,
  Bell,
  XCircle,
  AlertTriangle,
  Edit3,
  Check,
} from 'lucide-react';
import { UserPayload } from '../../../types/auth';

interface RawMaterialItem {
  id: string;
  materialCode: string;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  rate?: number;
  unitPrice?: number;
  unit: string;
  currentStock: number;
  reorderLevel: number;
  supplierName?: string;
  storageLocation?: string;
}

interface ProductItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  unit: string;
  currentStock: number;
  minStockLevel: number;
  status: string;
  profitMarginAmount?: number;
  profitMarginPercentage?: number;
  bomComponents?: Array<{
    id: string;
    rawMaterialId: string;
    name: string;
    materialCode: string;
    rate: number;
    unit: string;
    quantity: number;
    scrapFactor: number;
    lineCost: number;
  }>;
}

interface NotificationItem {
  id: string;
  companyId: string;
  recipientRole: string;
  title: string;
  message: string;
  type: string;
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
}

interface RateRequestItem {
  id: string;
  companyId: string;
  rawMaterialId: string;
  rawMaterial?: {
    id: string;
    name: string;
    materialCode: string;
    unit: string;
    rate?: number;
    unitPrice?: number;
    costPrice?: number;
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

interface PayrollItem {
  id: string;
  userId: string;
  employeeCode?: string;
  employeeName?: string;
  department?: string;
  designation?: string;
  month: string;
  baseSalary: number;
  increments: number;
  deductions: number;
  netSalary: number;
  attendanceDays: number;
  totalWorkingDays: number;
  status: string; // ACTIVE, HIRE, TERMINATED
  isActiveUser?: boolean;
}

interface AuditLogItem {
  id: string;
  action: string;
  module: string;
  details: string;
  movementType?: string;
  performedByRole: string;
  createdAt: string;
}

export default function SuperAdminDashboardPage() {
  const router = useRouter();

  // Dark / Light Mode (strictly default to Light)
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Active Tab: 'analytics' | 'rate_approvals' | 'raw_materials' | 'products' | 'payroll' | 'export' | 'rbac' | 'audit'
  const [activeTab, setActiveTab] = useState<
    'analytics' | 'rate_approvals' | 'raw_materials' | 'products' | 'payroll' | 'export' | 'rbac' | 'audit'
  >('analytics');

  // Authenticated Tenant State
  const [currentUser, setCurrentUser] = useState<UserPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Data States
  const [rawMaterials, setRawMaterials] = useState<RawMaterialItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [payrolls, setPayrolls] = useState<PayrollItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  // Rate Change Requests & Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);
  const [rateRequests, setRateRequests] = useState<RateRequestItem[]>([]);
  const [pricingOverview, setPricingOverview] = useState<ProductItem[]>([]);

  // Approval / Rejection Modal States
  const [selectedRateRequest, setSelectedRateRequest] = useState<RateRequestItem | null>(null);
  const [customApprovedRate, setCustomApprovedRate] = useState<string>('');
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>('');
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState<boolean>(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);

  // Direct Raw Material Rate Override Modal
  const [selectedRmForRateEdit, setSelectedRmForRateEdit] = useState<RawMaterialItem | null>(null);
  const [directRateInput, setDirectRateInput] = useState<string>('');
  const [directRateReason, setDirectRateReason] = useState<string>('');
  const [isDirectRateModalOpen, setIsDirectRateModalOpen] = useState<boolean>(false);

  // Inline Raw Material Rate Quick-Edit State
  const [editingRmId, setEditingRmId] = useState<string | null>(null);
  const [editingRmRate, setEditingRmRate] = useState<string>('');
  const [isSavingRmRate, setIsSavingRmRate] = useState<boolean>(false);

  // Selling Price Quick Edit State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingSellingPrice, setEditingSellingPrice] = useState<string>('');
  const [isUpdatingPrice, setIsUpdatingPrice] = useState<boolean>(false);
  const [expandedBomProductId, setExpandedBomProductId] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [exportDepartment, setExportDepartment] = useState('ALL');

  // Modals
  const [isRawMaterialModalOpen, setIsRawMaterialModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [selectedPayrollUser, setSelectedPayrollUser] = useState<PayrollItem | null>(null);

  // Form states
  const [rmName, setRmName] = useState('');
  const [rmCategory, setRmCategory] = useState('Metals & Scrap');
  const [rmCost, setRmCost] = useState('32000');
  const [rmSelling, setRmSelling] = useState('38500');
  const [rmUnit, setRmUnit] = useState('MT');
  const [rmStock, setRmStock] = useState('250');

  const [prdName, setPrdName] = useState('');
  const [prdCategory, setPrdCategory] = useState('Finished Goods');
  const [prdCost, setPrdCost] = useState('42000');
  const [prdSelling, setPrdSelling] = useState('51000');
  const [prdUnit, setPrdUnit] = useState('MT');
  const [prdStock, setPrdStock] = useState('120');

  const [adjIncrement, setAdjIncrement] = useState('5000');
  const [adjDeduction, setAdjDeduction] = useState('0');
  const [adjAttendance, setAdjAttendance] = useState('26');
  const [adjRemarks, setAdjRemarks] = useState('Super Admin Performance Bonus');

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

    loadInitialData();
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

  const loadInitialData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('access_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
      if (token) {
        // Fetch Raw Materials
        const rmRes = await fetch(`${apiUrl}/super-admin/raw-materials`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (rmRes.ok) {
          const rmData = await rmRes.json();
          setRawMaterials(Array.isArray(rmData) ? rmData : []);
        }

        // Fetch Products with Pricing Overview & BOM
        const pricingRes = await fetch(`${apiUrl}/super-admin/products/pricing-overview`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (pricingRes.ok) {
          const pricingData = await pricingRes.json();
          const pList = Array.isArray(pricingData) ? pricingData : [];
          setPricingOverview(pList);
          setProducts(pList);
        } else {
          // Fallback fetch products
          const prdRes = await fetch(`${apiUrl}/super-admin/products`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (prdRes.ok) {
            const prdData = await prdRes.json();
            setProducts(Array.isArray(prdData) ? prdData : []);
          }
        }

        // Fetch Notifications
        const notifRes = await fetch(`${apiUrl}/super-admin/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (notifRes.ok) {
          const notifData = await notifRes.json();
          setNotifications(Array.isArray(notifData?.notifications) ? notifData.notifications : []);
          setUnreadNotifCount(typeof notifData?.unreadCount === 'number' ? notifData.unreadCount : 0);
        }

        // Fetch Rate Requests
        const reqRes = await fetch(`${apiUrl}/super-admin/rate-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (reqRes.ok) {
          const reqData = await reqRes.json();
          setRateRequests(Array.isArray(reqData) ? reqData : []);
        }

        // Fetch Payrolls
        const payRes = await fetch(`${apiUrl}/super-admin/payroll`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (payRes.ok) {
          const payData = await payRes.json();
          setPayrolls(Array.isArray(payData) ? payData : []);
        }

        // Fetch Audit Logs
        const auditRes = await fetch(`${apiUrl}/super-admin/audit-logs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (auditRes.ok) {
          const auditData = await auditRes.json();
          setAuditLogs(Array.isArray(auditData) ? auditData : []);
        }

        // Fetch Users for RBAC
        const usersRes = await fetch(`${apiUrl}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          const uList = Array.isArray(usersData) ? usersData : usersData.users || [];
          setEmployees(uList);
        }
      } else {
        seedLocalState();
      }
    } catch {
      seedLocalState();
    } finally {
      setIsLoading(false);
    }
  };

  const seedLocalState = () => {
    setRawMaterials([]);
    setProducts([]);
    setPayrolls([]);
    setAuditLogs([]);
    setEmployees([]);
    setNotifications([]);
    setUnreadNotifCount(0);
    setRateRequests([]);
    setPricingOverview([]);
  };

  // =========================================================================
  // ACTIONS: RATE CHANGE REQUESTS & APPROVALS WORKFLOW
  // =========================================================================

  const handleApproveRateRequest = async (request: RateRequestItem, customRate?: number) => {
    const token = localStorage.getItem('access_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const rateToApprove = customRate !== undefined ? customRate : request.proposedRate;

    try {
      const res = await fetch(`${apiUrl}/super-admin/rate-requests/${request.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approvedRate: rateToApprove }),
      });

      if (res.ok) {
        const data = await res.json();
        setFeedbackSuccess(
          `Approved rate request for ${request.rawMaterial?.name || 'Raw Material'} at ₹${rateToApprove}. Recalculated cost prices for ${data.affectedProductsCount} products!`,
        );
        setIsApprovalModalOpen(false);
        setSelectedRateRequest(null);
        loadInitialData();
      } else {
        const err = await res.json().catch(() => ({}));
        setFeedbackError(err.message || 'Failed to approve rate change request.');
      }
    } catch {
      setFeedbackError('Network error approving rate change request.');
    }
  };

  const handleRejectRateRequest = async (request: RateRequestItem, reason?: string) => {
    const token = localStorage.getItem('access_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
      const res = await fetch(`${apiUrl}/super-admin/rate-requests/${request.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rejectionReason: reason || rejectionReasonInput }),
      });

      if (res.ok) {
        setFeedbackSuccess(`Rate change request for ${request.rawMaterial?.name || 'Raw Material'} rejected.`);
        setIsRejectModalOpen(false);
        setSelectedRateRequest(null);
        setRejectionReasonInput('');
        loadInitialData();
      } else {
        const err = await res.json().catch(() => ({}));
        setFeedbackError(err.message || 'Failed to reject rate change request.');
      }
    } catch {
      setFeedbackError('Network error rejecting rate change request.');
    }
  };

  const handleDirectRateOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRmForRateEdit) return;
    const newRate = parseFloat(directRateInput);
    if (isNaN(newRate) || newRate < 0) {
      setFeedbackError('Please enter a valid non-negative rate.');
      return;
    }

    const token = localStorage.getItem('access_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
      const res = await fetch(`${apiUrl}/super-admin/raw-materials/${selectedRmForRateEdit.id}/rate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rate: newRate,
          reason: directRateReason || 'Super Admin direct rate override',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setFeedbackSuccess(
          `Raw material ${selectedRmForRateEdit.name} rate updated to ₹${newRate}. Recalculated cost prices for ${data.affectedProductsCount} products.`,
        );
        setIsDirectRateModalOpen(false);
        setSelectedRmForRateEdit(null);
        setDirectRateInput('');
        setDirectRateReason('');
        loadInitialData();
      } else {
        const err = await res.json().catch(() => ({}));
        setFeedbackError(err.message || 'Failed to override raw material rate.');
      }
    } catch {
      setFeedbackError('Network error overriding rate.');
    }
  };

  const handleSaveDirectRate = async (rmId: string, rateVal?: number, reason?: string) => {
    const val = rateVal !== undefined ? rateVal : parseFloat(editingRmRate);
    if (isNaN(val) || val < 0) {
      setFeedbackError('Please enter a valid non-negative rate.');
      return;
    }

    setIsSavingRmRate(true);
    const token = localStorage.getItem('access_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const targetRm = rawMaterials.find((r) => r.id === rmId);

    try {
      const res = await fetch(`${apiUrl}/super-admin/raw-materials/${rmId}/rate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rate: val,
          reason: reason || 'Super Admin direct rate update',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setFeedbackSuccess(
          `Rate for ${targetRm?.name || 'Raw Material'} fixed to ₹${val.toFixed(2)}. Recalculated cost prices for ${data.affectedProductsCount} linked products!`,
        );
        setEditingRmId(null);
        setEditingRmRate('');
        loadInitialData();
      } else {
        const err = await res.json().catch(() => ({}));
        setFeedbackError(err.message || 'Failed to update raw material rate.');
      }
    } catch {
      setFeedbackError('Network error updating raw material rate.');
    } finally {
      setIsSavingRmRate(false);
    }
  };

  const handleSaveProductSellingPrice = async (productId: string) => {
    const newPrice = parseFloat(editingSellingPrice);
    if (isNaN(newPrice) || newPrice < 0) {
      setFeedbackError('Please enter a valid non-negative selling price.');
      return;
    }

    setIsUpdatingPrice(true);
    const token = localStorage.getItem('access_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
      const res = await fetch(`${apiUrl}/super-admin/products/${productId}/pricing`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sellingPrice: newPrice }),
      });

      if (res.ok) {
        const data = await res.json();
        setFeedbackSuccess(
          `Selling price for ${data.name} updated to ₹${data.sellingPrice.toLocaleString()}. Margin: ${data.profitMarginPercentage}% (₹${data.profitMarginAmount.toLocaleString()}).`,
        );
        setEditingProductId(null);
        setEditingSellingPrice('');
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  sellingPrice: data.sellingPrice,
                  costPrice: data.costPrice,
                  profitMarginAmount: data.profitMarginAmount,
                  profitMarginPercentage: data.profitMarginPercentage,
                }
              : p,
          ),
        );
        setPricingOverview((prev) =>
          prev.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  sellingPrice: data.sellingPrice,
                  costPrice: data.costPrice,
                  profitMarginAmount: data.profitMarginAmount,
                  profitMarginPercentage: data.profitMarginPercentage,
                }
              : p,
          ),
        );
      } else {
        const err = await res.json().catch(() => ({}));
        setFeedbackError(err.message || 'Failed to update selling price.');
      }
    } catch {
      setFeedbackError('Network error updating product price.');
    } finally {
      setIsUpdatingPrice(false);
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    const token = localStorage.getItem('access_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    try {
      await fetch(`${apiUrl}/super-admin/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      setUnreadNotifCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const handleMarkAllNotificationsRead = async () => {
    const token = localStorage.getItem('access_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    try {
      await fetch(`${apiUrl}/super-admin/notifications/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadNotifCount(0);
      setFeedbackSuccess('All notifications marked as read.');
    } catch {}
  };

  // Facility Info
  const companyName = currentUser?.company?.name || 'Manufacturing Enterprise';
  const companySubCategory = currentUser?.company?.subCategory || 'Steel and Heavy Metals';
  const defaultUnit = currentUser?.company?.defaultUnit || 'MT';
  const tenantId = currentUser?.companyId || 'company_isolated_01';

  // Financial Summary from live data
  const monthlyData = useMemo(() => {
    const totalProd = products.reduce((acc, p) => acc + (p.currentStock || 0), 0);
    const totalRev = products.reduce((acc, p) => acc + (p.currentStock * p.sellingPrice || 0), 0) / 100000;
    const totalCost = products.reduce((acc, p) => acc + (p.currentStock * p.costPrice || 0), 0) / 100000;
    const totalProfit = Math.max(0, totalRev - totalCost);
    return [
      { month: 'Jun', turnover: 0, cost: 0, profit: 0, production: 0 },
      { month: 'Jul', turnover: 0, cost: 0, profit: 0, production: 0 },
      { month: 'Aug', turnover: 0, cost: 0, profit: 0, production: 0 },
      { month: 'Sep', turnover: 0, cost: 0, profit: 0, production: 0 },
      { month: 'Oct', turnover: 0, cost: 0, profit: 0, production: 0 },
      { month: 'Nov', turnover: Math.round(totalRev), cost: Math.round(totalCost), profit: Math.round(totalProfit), production: Math.round(totalProd) },
    ];
  }, [products]);

  // =========================================================================
  // ACTIONS: RAW MATERIAL
  // =========================================================================

  const handleCreateRawMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const payload = {
      name: rmName,
      category: rmCategory,
      costPrice: parseFloat(rmCost),
      sellingPrice: parseFloat(rmSelling),
      unit: rmUnit,
      currentStock: parseFloat(rmStock),
    };

    try {
      if (token) {
        const res = await fetch(`${apiUrl}/super-admin/raw-materials`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          setRawMaterials((prev) => [created, ...prev]);
        }
      } else {
        const newRm: RawMaterialItem = {
          id: `rm-${Date.now()}`,
          materialCode: `RM-${rmCategory.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
          name: rmName,
          category: rmCategory,
          costPrice: parseFloat(rmCost),
          sellingPrice: parseFloat(rmSelling),
          unit: rmUnit,
          currentStock: parseFloat(rmStock),
          reorderLevel: 25,
        };
        setRawMaterials((prev) => [newRm, ...prev]);
      }
      setFeedbackSuccess(`Added raw material "${rmName}" with stock ${rmStock} ${rmUnit}.`);
      setIsRawMaterialModalOpen(false);
      setRmName('');
    } catch {
      setFeedbackError('Could not save raw material.');
    }
  };

  const handleDeleteRawMaterial = async (id: string) => {
    const token = localStorage.getItem('access_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    try {
      if (token) {
        await fetch(`${apiUrl}/super-admin/raw-materials/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setRawMaterials((prev) => prev.filter((r) => r.id !== id));
      setFeedbackSuccess('Raw material removed from tenant ledger.');
    } catch {
      setFeedbackError('Failed to delete raw material.');
    }
  };

  // =========================================================================
  // ACTIONS: PRODUCTS
  // =========================================================================

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const payload = {
      name: prdName,
      category: prdCategory,
      costPrice: parseFloat(prdCost),
      sellingPrice: parseFloat(prdSelling),
      unit: prdUnit,
      currentStock: parseFloat(prdStock),
    };

    try {
      if (token) {
        const res = await fetch(`${apiUrl}/super-admin/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          setProducts((prev) => [created, ...prev]);
        }
      } else {
        const newPrd: ProductItem = {
          id: `prd-${Date.now()}`,
          sku: `SKU-${prdCategory.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
          name: prdName,
          category: prdCategory,
          costPrice: parseFloat(prdCost),
          sellingPrice: parseFloat(prdSelling),
          unit: prdUnit,
          currentStock: parseFloat(prdStock),
          minStockLevel: 10,
          status: 'ACTIVE',
        };
        setProducts((prev) => [newPrd, ...prev]);
      }
      setFeedbackSuccess(`Product "${prdName}" registered in enterprise catalog.`);
      setIsProductModalOpen(false);
      setPrdName('');
    } catch {
      setFeedbackError('Failed to register product.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const token = localStorage.getItem('access_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    try {
      if (token) {
        await fetch(`${apiUrl}/super-admin/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setFeedbackSuccess('Product removed from catalog.');
    } catch {
      setFeedbackError('Failed to delete product.');
    }
  };

  // =========================================================================
  // ACTIONS: PAYROLL (Attendance, Increments, Hire/Terminate)
  // =========================================================================

  const handleToggleHireTerminate = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'TERMINATED' ? 'HIRE' : 'TERMINATED';
    const token = localStorage.getItem('access_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
      if (token) {
        await fetch(`${apiUrl}/super-admin/payroll/employee-status/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: nextStatus }),
        });
      }

      setPayrolls((prev) =>
        prev.map((p) => (p.userId === userId ? { ...p, status: nextStatus } : p)),
      );

      setEmployees((prev) =>
        prev.map((e) => (e.id === userId ? { ...e, isActive: nextStatus === 'HIRE' } : e)),
      );

      setFeedbackSuccess(
        `Employee status updated to ${nextStatus}. Portal access ${
          nextStatus === 'HIRE' ? 'enabled' : 'locked'
        }.`,
      );
    } catch {
      setFeedbackError('Failed to update employee employment status.');
    }
  };

  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayrollUser) return;

    const token = localStorage.getItem('access_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const inc = parseFloat(adjIncrement) || 0;
    const ded = parseFloat(adjDeduction) || 0;
    const att = parseInt(adjAttendance, 10) || 26;
    const newNet = selectedPayrollUser.baseSalary + inc - ded;

    try {
      if (token) {
        await fetch(`${apiUrl}/super-admin/payroll/adjust`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: selectedPayrollUser.userId,
            increments: inc,
            deductions: ded,
            attendanceDays: att,
            remarks: adjRemarks,
          }),
        });
      }

      setPayrolls((prev) =>
        prev.map((p) =>
          p.userId === selectedPayrollUser.userId
            ? {
                ...p,
                increments: inc,
                deductions: ded,
                attendanceDays: att,
                netSalary: newNet,
              }
            : p,
        ),
      );

      setFeedbackSuccess(
        `Payroll adjusted for ${selectedPayrollUser.employeeName}: Net Salary ₹${newNet.toLocaleString()}.`,
      );
      setIsAdjustmentModalOpen(false);
    } catch {
      setFeedbackError('Failed to apply payroll adjustment.');
    }
  };

  // =========================================================================
  // ACTIONS: DEPARTMENT EXCEL EXPORT (Real Download with Date-Time Stamp)
  // =========================================================================

  const handleDownloadExcel = async () => {
    const token = localStorage.getItem('access_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `Workforce_Export_${exportDepartment}_${timestamp}.csv`;

    try {
      if (token) {
        const res = await fetch(
          `${apiUrl}/super-admin/export/department-employees?department=${exportDepartment}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            const decoded = atob(json.data);
            const blob = new Blob([decoded], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = json.fileName || fileName;
            link.click();
            URL.revokeObjectURL(url);
            setFeedbackSuccess(`Downloaded department spreadsheet "${json.fileName || fileName}".`);
            return;
          }
        }
      }

      // Client-side fallback download
      const filtered =
        exportDepartment === 'ALL'
          ? employees
          : employees.filter((e) => e.department === exportDepartment);

      const headers = [
        'Sl No',
        'Employee Code',
        'Full Name',
        'Email',
        'Department',
        'Designation',
        'Role',
        'Portal Access',
        'Tenant ID',
        'Export Date Time',
      ];

      const rows = filtered.map((e, idx) => [
        idx + 1,
        e.employeeCode || `EMP-${idx + 1}`,
        `"${e.firstName} ${e.lastName || ''}"`.trim(),
        e.email,
        e.department,
        e.designation,
        e.role,
        e.isActive ? 'ACTIVE' : 'REVOKED',
        tenantId,
        new Date().toISOString(),
      ]);

      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      setFeedbackSuccess(`Downloaded department spreadsheet "${fileName}".`);
    } catch {
      setFeedbackError('Could not generate Excel spreadsheet.');
    }
  };

  // =========================================================================
  // ACTIONS: RBAC PERMISSION TOGGLE (Grant / Revoke Portal Access)
  // =========================================================================

  const handleTogglePortalAccess = async (targetUser: any) => {
    const nextAccess = !targetUser.isActive;
    const token = localStorage.getItem('access_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
      if (token) {
        await fetch(`${apiUrl}/super-admin/rbac/toggle-access/${targetUser.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isPortalAccessGranted: nextAccess,
            reason: `Super Admin toggled access to ${nextAccess ? 'GRANTED' : 'REVOKED'}`,
          }),
        });
      }

      setEmployees((prev) =>
        prev.map((e) => (e.id === targetUser.id ? { ...e, isActive: nextAccess } : e)),
      );

      // Log movement locally
      const auditEntry: AuditLogItem = {
        id: `aud-${Date.now()}`,
        action: nextAccess ? 'PORTAL_ACCESS_GRANTED' : 'PORTAL_ACCESS_REVOKED',
        module: 'RBAC',
        details: `Super Admin ${nextAccess ? 'granted' : 'revoked'} access for ${targetUser.email}`,
        movementType: 'RBAC_CHANGE',
        performedByRole: 'SUPER_ADMIN',
        createdAt: new Date().toISOString(),
      };
      setAuditLogs((prev) => [auditEntry, ...prev]);

      setFeedbackSuccess(
        `Portal access for ${targetUser.firstName} ${nextAccess ? 'granted' : 'revoked'}.`,
      );
    } catch {
      setFeedbackError('Failed to toggle portal access.');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Super Admin Top Header */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-20 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard"
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                title="Return to Main Dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </Link>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Super Admin Portal
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/25 whitespace-nowrap shrink-0">
                    EXECUTIVE CONTROL
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                  <span>{companyName}</span>
                  <span>&bull;</span>
                  <span>{companySubCategory}</span>
                  <span>&bull;</span>
                  <span className="text-emerald-600 font-semibold whitespace-nowrap">Tenant #{tenantId}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-sm font-bold shadow-sm whitespace-nowrap shrink-0"
              >
                <Factory className="w-4 h-4 text-blue-600" />
                <span>Dashboard</span>
              </Link>

              <button
                type="button"
                onClick={() => setActiveTab('rate_approvals')}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-bold shadow-sm whitespace-nowrap shrink-0 transition-all ${
                  activeTab === 'rate_approvals'
                    ? 'border-amber-500 bg-amber-600 text-white'
                    : 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Rate Master &amp; Approvals</span>
                {unreadNotifCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-rose-500 text-white font-extrabold animate-pulse">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              <Link
                href="/dashboard/executive"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-sm font-bold shadow-sm whitespace-nowrap shrink-0"
              >
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Executive</span>
              </Link>

              <Link
                href="/dashboard/quality"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-cyan-200 dark:border-cyan-800 bg-cyan-50/70 dark:bg-cyan-950/40 hover:bg-cyan-100 text-sm font-bold text-cyan-800 dark:text-cyan-300 shadow-sm whitespace-nowrap shrink-0"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-600" />
                <span>Quality</span>
              </Link>

              <Link
                href="/dashboard/inventory"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100 text-sm font-bold text-indigo-800 dark:text-indigo-300 shadow-sm whitespace-nowrap shrink-0"
              >
                <Package className="w-4 h-4 text-indigo-600" />
                <span>Inventory</span>
              </Link>

              <Link
                href="/dashboard/finance"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100 text-sm font-bold text-emerald-800 dark:text-emerald-300 shadow-sm whitespace-nowrap shrink-0"
              >
                <Landmark className="w-4 h-4 text-emerald-600" />
                <span>Finance</span>
              </Link>

              <Link
                href="/dashboard/users"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-sm font-bold shadow-sm whitespace-nowrap shrink-0"
              >
                <Users className="w-4 h-4 text-purple-600" />
                <span>Directory</span>
              </Link>

              {mounted && (
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
                  title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Feedback Messages */}
        <div className="max-w-7xl mx-auto px-6 pt-6 w-full space-y-4">
          {feedbackSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-between text-base">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="font-semibold">{feedbackSuccess}</span>
              </div>
              <button type="button" onClick={() => setFeedbackSuccess(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {feedbackError && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 flex items-center justify-between text-base">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-semibold">{feedbackError}</span>
              </div>
              <button type="button" onClick={() => setFeedbackError(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Module Navigation Tabs */}
          <div className="flex items-center gap-2 sm:gap-3 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Turnover &amp; P&amp;L Charts</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rate_approvals')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'rate_approvals'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Rate Master &amp; Approvals</span>
              {unreadNotifCount > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-rose-500 text-white font-black animate-pulse">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('raw_materials')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'raw_materials'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Raw Materials ({rawMaterials.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Factory className="w-4 h-4" />
              <span>Finished Products ({products.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('payroll')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'payroll'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Payroll &amp; Attendance</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('export')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'export'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Department Excel Export</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rbac')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'rbac'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>RBAC Portal Access</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'audit'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Company Movements</span>
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* TAB 1: FINANCIAL & PRODUCTION ANALYTICS (CHARTS)                    */}
        {/* =================================================================== */}
        {activeTab === 'analytics' && (
          <main className="max-w-7xl mx-auto px-6 py-6 space-y-6 w-full">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <span className="text-base font-bold text-slate-500">Monthly Revenue / Turnover</span>
                <div className="text-3xl font-black mt-2 text-slate-900 dark:text-white">
                  ₹{products.reduce((acc, p) => acc + (p.currentStock * p.sellingPrice || 0), 0).toLocaleString()}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-slate-500 text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  <span>Live Catalogue Valuation</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <span className="text-base font-bold text-slate-500">Manufacturing Costs</span>
                <div className="text-3xl font-black mt-2 text-slate-900 dark:text-white">
                  ₹{products.reduce((acc, p) => acc + (p.currentStock * p.costPrice || 0), 0).toLocaleString()}
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  Total Finished Goods Baseline Cost
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <span className="text-base font-bold text-slate-500">Net Gross Profit</span>
                <div className="text-3xl font-black mt-2 text-emerald-600">
                  ₹{Math.max(0, products.reduce((acc, p) => acc + (p.currentStock * (p.sellingPrice - p.costPrice) || 0), 0)).toLocaleString()}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-slate-500 text-sm font-semibold">
                  <span>Live Inventory Spread</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <span className="text-base font-bold text-slate-500">Production Output</span>
                <div className="text-3xl font-black mt-2 text-blue-600">
                  {products.reduce((acc, p) => acc + (p.currentStock || 0), 0).toLocaleString()} <span className="text-lg text-slate-400">{defaultUnit}</span>
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  {products.length} Active Catalogue SKUs
                </div>
              </div>
            </div>

            {/* Visual Interactive Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Profit & Loss Monthly Turnover */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Monthly Turnover &amp; Profit Comparison (₹ Lakhs)
                    </h3>
                    <p className="text-sm text-slate-500">Revenue vs Manufacturing Cost &amp; Gross Margin</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                    H2 2026
                  </span>
                </div>

                {/* SVG Visual Bar Chart */}
                <div className="pt-6 pb-2">
                  <div className="h-64 flex items-end justify-between gap-3 px-2 border-b border-slate-200 dark:border-slate-800">
                    {monthlyData.map((d) => (
                      <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        {/* Bars container */}
                        <div className="w-full flex items-end justify-center gap-1.5 h-full">
                          {/* Turnover Bar */}
                          <div
                            className="w-4 sm:w-6 bg-blue-600 rounded-t-lg transition-all group-hover:bg-blue-500 relative"
                            style={{ height: `${(d.turnover / 230) * 100}%` }}
                          >
                            <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-0.5 px-1.5 rounded font-mono z-10 transition-opacity">
                              ₹{d.turnover}L
                            </span>
                          </div>

                          {/* Cost Bar */}
                          <div
                            className="w-4 sm:w-6 bg-slate-300 dark:bg-slate-700 rounded-t-lg transition-all group-hover:bg-slate-400"
                            style={{ height: `${(d.cost / 230) * 100}%` }}
                          />

                          {/* Profit Bar */}
                          <div
                            className="w-4 sm:w-6 bg-emerald-500 rounded-t-lg transition-all group-hover:bg-emerald-400"
                            style={{ height: `${(d.profit / 230) * 100}%` }}
                          />
                        </div>
                        {/* Month label */}
                        <span className="text-xs font-bold text-slate-500">{d.month}</span>
                      </div>
                    ))}
                  </div>

                  {/* Chart Legend */}
                  <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-sm bg-blue-600" />
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Turnover</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-sm bg-slate-300 dark:bg-slate-700" />
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Cost</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-sm bg-emerald-500" />
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Profit</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart 2: Production Volume vs Sales */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Production Output Throughput ({defaultUnit})
                    </h3>
                    <p className="text-sm text-slate-500">Plant floor volume vs shift targets</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                    OEE 88.6%
                  </span>
                </div>

                {/* SVG Visual Area / Progress Chart */}
                <div className="pt-6 pb-2">
                  <div className="h-64 flex items-end justify-between gap-3 px-2 border-b border-slate-200 dark:border-slate-800">
                    {monthlyData.map((d) => (
                      <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <div
                          className="w-10 sm:w-14 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-xl transition-all group-hover:brightness-110 relative"
                          style={{ height: `${(d.production / 6000) * 100}%` }}
                        >
                          <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-0.5 px-1.5 rounded font-mono z-10 transition-opacity whitespace-nowrap">
                            {d.production} {defaultUnit}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-500">{d.month}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                    <span>Average Daily Volume: <strong>183 {defaultUnit}/day</strong></span>
                    <span className="text-emerald-600 font-bold">&uarr; 33.2% 6-Month Increase</span>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* =================================================================== */}
        {/* TAB: RATE APPROVALS & DUAL-CONTROL PRICING GOVERNANCE                 */}
        {/* =================================================================== */}
        {activeTab === 'rate_approvals' && (
          <main className="max-w-7xl mx-auto px-6 py-6 space-y-8 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-3 py-0.5 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    DUAL-CONTROL COST GOVERNANCE
                  </span>
                  {unreadNotifCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white animate-pulse">
                      {unreadNotifCount} Unread Alerts
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Rate Master &amp; Pricing Governance
                </h2>
                <p className="text-base text-slate-500">
                  Dual-track control: Direct Super Admin Rate Overrides alongside Procurement Rate Requests. Any rate adjustment instantly re-evaluates all downstream BOM Cost Prices for {companyName}.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (rawMaterials.length > 0) {
                      setSelectedRmForRateEdit(rawMaterials[0]);
                      setDirectRateInput(String(rawMaterials[0].rate ?? rawMaterials[0].costPrice ?? 0));
                    }
                    setDirectRateReason('');
                    setIsDirectRateModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-sm transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Direct Rate Override</span>
                </button>
              </div>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-500">Pending Requests</span>
                  <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black mt-2 text-amber-600">
                  {rateRequests.filter((r) => r.status === 'PENDING').length}
                </div>
                <div className="text-xs text-slate-400 mt-1">Awaiting Super Admin review</div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-500">Unread Alerts</span>
                  <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600">
                    <Bell className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black mt-2 text-rose-600">{unreadNotifCount}</div>
                <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                  <span>New notifications</span>
                  {unreadNotifCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllNotificationsRead}
                      className="text-blue-600 hover:underline font-bold text-xs"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-500">Raw Materials Master</span>
                  <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black mt-2 text-purple-600">{rawMaterials.length}</div>
                <div className="text-xs text-slate-400 mt-1">Direct rate editable materials</div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-500">Products Recalculated</span>
                  <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600">
                    <Factory className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black mt-2 text-blue-600">{products.length}</div>
                <div className="text-xs text-slate-400 mt-1">Auto-BOM cost pricing active</div>
              </div>
            </div>

            {/* SECTION 1: RAW MATERIALS RATE MASTER (SUPER ADMIN DIRECT OVERRIDE) */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Raw Materials Rate Master
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                      Direct Fix &amp; Recalculate
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Super Admin can directly edit any rate at any time. Saving automatically recalculates the Cost Price for all linked finished products.
                  </p>
                </div>
                <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 whitespace-nowrap self-start sm:self-auto">
                  {rawMaterials.length} Materials
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="p-4">Material Code</th>
                      <th className="p-4">Material Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 text-right">Approved Rate (₹)</th>
                      <th className="p-4">Unit</th>
                      <th className="p-4 text-right">Current Stock</th>
                      <th className="p-4 text-right">Fix / Update Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {rawMaterials.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">
                          No raw materials registered yet.
                        </td>
                      </tr>
                    ) : (
                      rawMaterials.map((rm) => {
                        const currentRate = Number(rm.rate ?? rm.unitPrice ?? rm.costPrice ?? 0);
                        const isEditingThis = editingRmId === rm.id;

                        return (
                          <tr key={`rm-rate-${rm.id}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                            <td className="p-4 font-mono font-bold text-blue-600">{rm.materialCode}</td>
                            <td className="p-4 font-bold text-slate-900 dark:text-white">{rm.name}</td>
                            <td className="p-4 text-slate-500">{rm.category}</td>
                            <td className="p-4 text-right font-mono">
                              {isEditingThis ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <span className="text-xs font-bold text-slate-400">₹</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={editingRmRate}
                                    onChange={(e) => setEditingRmRate(e.target.value)}
                                    className="w-28 p-1.5 rounded-lg border border-amber-500 bg-white dark:bg-slate-800 font-mono text-sm text-right font-bold"
                                    autoFocus
                                  />
                                </div>
                              ) : (
                                <span className="font-bold text-slate-900 dark:text-white">
                                  ₹{currentRate.toFixed(2)}
                                </span>
                              )}
                            </td>
                            <td className="p-4 font-bold text-slate-600 dark:text-slate-400">{rm.unit}</td>
                            <td className="p-4 text-right font-mono text-slate-600 dark:text-slate-400">
                              {rm.currentStock.toLocaleString()}
                            </td>
                            <td className="p-4 text-right">
                              {isEditingThis ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    disabled={isSavingRmRate}
                                    onClick={() => handleSaveDirectRate(rm.id)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                                    title="Save rate and recalculate product costs"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>{isSavingRmRate ? 'Saving...' : 'Save & Recalc'}</span>
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isSavingRmRate}
                                    onClick={() => {
                                      setEditingRmId(null);
                                      setEditingRmRate('');
                                    }}
                                    className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    title="Cancel"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingRmId(rm.id);
                                      setEditingRmRate(String(currentRate));
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-800 dark:text-amber-300 font-bold text-xs transition-all"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Fix / Update Rate</span>
                                  </button>
                                </div>
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

            {/* SECTION 2: PROCUREMENT RATE REQUESTS REVIEW PANEL & NOTIFICATIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Rate Change Requests Table (2 cols) */}
              <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Procurement Rate Requests Review Panel
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Approving triggers automatic recalculation of affected product cost prices.
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {rateRequests.length} Total
                  </span>
                </div>

                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="p-4">Raw Material</th>
                        <th className="p-4 text-right">Active</th>
                        <th className="p-4 text-right">Proposed</th>
                        <th className="p-4 text-right">Variance</th>
                        <th className="p-4">Reason</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {rateRequests.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-500">
                            No rate change requests submitted yet.
                          </td>
                        </tr>
                      ) : (
                        rateRequests.map((req) => {
                          const cur = Number(req.currentRate || 0);
                          const prop = Number(req.proposedRate || 0);
                          const diff = prop - cur;
                          const pct = cur > 0 ? (diff / cur) * 100 : 0;
                          const isIncrease = diff > 0;

                          return (
                            <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                              <td className="p-4">
                                <div className="font-bold text-slate-900 dark:text-white">
                                  {req.rawMaterial?.name || 'Raw Material'}
                                </div>
                                <div className="text-xs font-mono text-slate-400">
                                  {req.rawMaterial?.materialCode || req.rawMaterialId}
                                </div>
                              </td>
                              <td className="p-4 text-right font-mono text-slate-600 dark:text-slate-400">
                                ₹{cur.toFixed(2)}
                              </td>
                              <td className="p-4 text-right font-mono font-black text-slate-900 dark:text-white">
                                ₹{prop.toFixed(2)}
                              </td>
                              <td className="p-4 text-right font-mono">
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
                              <td className="p-4 max-w-xs text-xs text-slate-600 dark:text-slate-300">
                                <p className="line-clamp-2">{req.reason || 'Procurement rate change'}</p>
                                {req.rejectionReason && (
                                  <p className="text-xs text-red-600 font-bold mt-1">
                                    Rejected: {req.rejectionReason}
                                  </p>
                                )}
                              </td>
                              <td className="p-4 text-center">
                                {req.status === 'PENDING' && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 whitespace-nowrap">
                                    <Clock className="w-3 h-3" />
                                    Pending
                                  </span>
                                )}
                                {req.status === 'APPROVED' && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 whitespace-nowrap">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Approved
                                  </span>
                                )}
                                {req.status === 'REJECTED' && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800 whitespace-nowrap">
                                    <XCircle className="w-3 h-3" />
                                    Rejected
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-right">
                                {req.status === 'PENDING' ? (
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedRateRequest(req);
                                        setCustomApprovedRate(String(req.proposedRate));
                                        setIsApprovalModalOpen(true);
                                      }}
                                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedRateRequest(req);
                                        setRejectionReasonInput('');
                                        setIsRejectModalOpen(true);
                                      }}
                                      className="px-2.5 py-1.5 rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 text-red-700 dark:text-red-300 font-bold text-xs transition-all"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-400 font-semibold">Processed</span>
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

              {/* Notifications Feed (1 col) */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-600" />
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Notifications
                    </h3>
                  </div>
                  {unreadNotifCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllNotificationsRead}
                      className="text-xs text-blue-600 hover:underline font-bold"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto max-h-[380px]">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-sm">
                      No notifications recorded for this facility yet.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3.5 flex items-start justify-between gap-3 transition-colors ${
                          !n.isRead ? 'bg-amber-50/60 dark:bg-amber-950/20' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              !n.isRead ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                          />
                          <div>
                            <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{n.title}</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {n.type}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-0.5 block">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        {!n.isRead && (
                          <button
                            type="button"
                            onClick={() => handleMarkNotificationRead(n.id)}
                            className="px-2 py-0.5 rounded text-[11px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 3: PRODUCT COST PRICE (AUTO-BOM) & SELLING PRICE GOVERNANCE */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Product Cost Price (Auto-BOM) &amp; Selling Price Governance
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                      Live Margin Visibility
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Cost Prices automatically reflect current raw material rates. Super Admin can edit Selling Prices to lock in target profit margins.
                  </p>
                </div>
                <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 whitespace-nowrap self-start sm:self-auto">
                  {products.length} Products
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="p-4">SKU Code</th>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 text-right">Cost Price (Auto-BOM)</th>
                      <th className="p-4 text-right">Selling Price</th>
                      <th className="p-4 text-right">Profit Margin</th>
                      <th className="p-4">Unit &amp; Stock</th>
                      <th className="p-4 text-right">Quick Price Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500">
                          No finished products registered.
                        </td>
                      </tr>
                    ) : (
                      products.map((p) => {
                        const cost = Number(p.costPrice || 0);
                        const selling = Number(p.sellingPrice || 0);
                        const marginAmt = p.profitMarginAmount !== undefined ? p.profitMarginAmount : Number((selling - cost).toFixed(2));
                        const marginPct =
                          p.profitMarginPercentage !== undefined
                            ? p.profitMarginPercentage
                            : cost > 0
                            ? Number((((selling - cost) / cost) * 100).toFixed(1))
                            : 0;
                        const isProfitable = marginAmt >= 0;
                        const isEditingThis = editingProductId === p.id;
                        const isExpanded = expandedBomProductId === p.id;
                        const hasBom = Array.isArray(p.bomComponents) && p.bomComponents.length > 0;

                        return (
                          <React.Fragment key={`pricing-gov-${p.id}`}>
                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="p-4 font-mono font-bold text-blue-600">{p.sku}</td>
                              <td className="p-4">
                                <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
                                {hasBom && (
                                  <button
                                    type="button"
                                    onClick={() => setExpandedBomProductId(isExpanded ? null : p.id)}
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
                                  >
                                    <Layers className="w-3 h-3" />
                                    <span>{isExpanded ? 'Hide BOM Details' : `View BOM (${p.bomComponents?.length} items)`}</span>
                                  </button>
                                )}
                              </td>
                              <td className="p-4 text-slate-500">{p.category}</td>
                              <td className="p-4 text-right font-mono">
                                <div className="font-bold text-slate-900 dark:text-white">
                                  ₹{cost.toFixed(2)}
                                </div>
                                <span className="inline-block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                  Auto-Calculated
                                </span>
                              </td>
                              <td className="p-4 text-right font-mono">
                                {isEditingThis ? (
                                  <div className="flex items-center justify-end gap-1.5">
                                    <span className="text-xs font-bold text-slate-400">₹</span>
                                    <input
                                      type="number"
                                      step="0.01"
                                      value={editingSellingPrice}
                                      onChange={(e) => setEditingSellingPrice(e.target.value)}
                                      className="w-28 p-1.5 rounded-lg border border-blue-500 bg-white dark:bg-slate-800 font-mono text-sm text-right font-bold"
                                      autoFocus
                                    />
                                  </div>
                                ) : (
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                    ₹{selling.toFixed(2)}
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-right font-mono">
                                <div
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                    isProfitable
                                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                      : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300'
                                  }`}
                                >
                                  {isProfitable ? (
                                    <TrendingUp className="w-3 h-3" />
                                  ) : (
                                    <TrendingDown className="w-3 h-3" />
                                  )}
                                  <span>
                                    {isProfitable ? '+' : ''}
                                    {marginPct.toFixed(1)}% (₹{marginAmt.toFixed(2)})
                                  </span>
                                </div>
                              </td>
                              <td className="p-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                                <div>{p.unit}</div>
                                <div className="font-mono">{p.currentStock.toLocaleString()} in stock</div>
                              </td>
                              <td className="p-4 text-right">
                                {isEditingThis ? (
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      disabled={isUpdatingPrice}
                                      onClick={() => handleSaveProductSellingPrice(p.id)}
                                      className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                                      title="Save Selling Price"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={isUpdatingPrice}
                                      onClick={() => {
                                        setEditingProductId(null);
                                        setEditingSellingPrice('');
                                      }}
                                      className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                                      title="Cancel"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingProductId(p.id);
                                      setEditingSellingPrice(String(p.sellingPrice || 0));
                                    }}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm transition-all"
                                    title="Edit Selling Price"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Set Selling Price</span>
                                  </button>
                                )}
                              </td>
                            </tr>
                            {isExpanded && hasBom && (
                              <tr className="bg-slate-50/70 dark:bg-slate-800/30">
                                <td colSpan={8} className="p-4 pl-12 border-t border-slate-100 dark:border-slate-800">
                                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 space-y-3">
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                                      <div className="flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-blue-600" />
                                        <span>Bill of Materials (BOM) Breakdown for {p.name}</span>
                                      </div>
                                      <span className="font-mono text-emerald-600">
                                        Total Auto Cost: ₹{cost.toFixed(2)} / {p.unit}
                                      </span>
                                    </div>
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-left text-xs border-collapse">
                                        <thead className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                                          <tr>
                                            <th className="pb-2 font-bold">Material</th>
                                            <th className="pb-2 font-bold">Code</th>
                                            <th className="pb-2 text-right font-bold">Qty Required</th>
                                            <th className="pb-2 text-right font-bold">Scrap %</th>
                                            <th className="pb-2 text-right font-bold">RM Rate (₹)</th>
                                            <th className="pb-2 text-right font-bold">Cost Contribution (₹)</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                                          {p.bomComponents?.map((b) => (
                                            <tr key={b.id}>
                                              <td className="py-2 font-sans font-semibold text-slate-900 dark:text-white">
                                                {b.name}
                                              </td>
                                              <td className="py-2 text-slate-500">{b.materialCode}</td>
                                              <td className="py-2 text-right">
                                                {b.quantity} {b.unit}
                                              </td>
                                              <td className="py-2 text-right text-slate-500">
                                                {((b.scrapFactor - 1) * 100).toFixed(1)}%
                                              </td>
                                              <td className="py-2 text-right text-slate-700 dark:text-slate-300">
                                                ₹{b.rate.toFixed(2)}
                                              </td>
                                              <td className="py-2 text-right font-bold text-slate-900 dark:text-white">
                                                ₹{b.lineCost.toFixed(2)}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* =================================================================== */}
        {/* TAB 2: RAW MATERIALS MANAGEMENT                                     */}
        {/* =================================================================== */}
        {activeTab === 'raw_materials' && (
          <main className="max-w-7xl mx-auto px-6 py-6 space-y-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Raw Materials Master Inventory
                </h2>
                <p className="text-base text-slate-500">
                  Manage unit purchase costs, standard resale valuations, and reorder levels strictly for {companyName}.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsRawMaterialModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-sm"
              >
                <Plus className="w-5 h-5" />
                <span>Add Raw Material</span>
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <table className="w-full text-left text-base border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="p-4">Material Code</th>
                    <th className="p-4">Material Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Approved Rate (₹)</th>
                    <th className="p-4">Valuation Price</th>
                    <th className="p-4">Unit</th>
                    <th className="p-4">Current Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {rawMaterials.map((rm) => {
                    const activeRate = rm.rate ?? rm.unitPrice ?? rm.costPrice ?? 0;
                    return (
                      <tr key={rm.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-4 font-mono font-bold text-blue-600">{rm.materialCode}</td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white">{rm.name}</td>
                        <td className="p-4 text-slate-500">{rm.category}</td>
                        <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                          ₹{Number(activeRate).toFixed(2)}
                        </td>
                        <td className="p-4 font-mono font-semibold text-emerald-600">
                          ₹{rm.sellingPrice ? rm.sellingPrice.toLocaleString() : Number(activeRate).toFixed(2)}
                        </td>
                        <td className="p-4 font-bold">{rm.unit}</td>
                        <td className="p-4 font-mono font-bold">{rm.currentStock.toLocaleString()}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              rm.currentStock >= rm.reorderLevel
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                            }`}
                          >
                            {rm.currentStock >= rm.reorderLevel ? 'IN_STOCK' : 'REORDER_ALERT'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRmForRateEdit(rm);
                                setDirectRateInput(String(rm.rate ?? rm.costPrice ?? 0));
                                setDirectRateReason('');
                                setIsDirectRateModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-800 dark:text-amber-300 text-xs font-bold transition-all"
                              title="Direct Rate Override (Auto-recalculates products)"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Rate</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRawMaterial(rm.id)}
                              className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Remove Material"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </main>
        )}

        {/* =================================================================== */}
        {/* TAB 3: FINISHED PRODUCTS & PROFIT MARGIN CONFIGURATION              */}
        {/* =================================================================== */}
        {activeTab === 'products' && (
          <main className="max-w-7xl mx-auto px-6 py-6 space-y-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Finished Products &amp; Profit Margin Architecture
                </h2>
                <p className="text-base text-slate-500">
                  Dual-governance pricing: Cost Price is automatically derived from procurement raw material BOM rates. Super Admin configures Selling Price to lock in target margins.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsProductModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-sm"
              >
                <Plus className="w-5 h-5" />
                <span>Register Product SKU</span>
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <table className="w-full text-left text-base border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="p-4">SKU Code</th>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4 text-right">Cost Price (Auto-BOM)</th>
                    <th className="p-4 text-right">Selling Price (Configurable)</th>
                    <th className="p-4 text-right">Profit Margin</th>
                    <th className="p-4">Unit &amp; Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500">
                        No finished products registered. Click "Register Product SKU" to add products to your catalog.
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => {
                      const cost = Number(p.costPrice || 0);
                      const selling = Number(p.sellingPrice || 0);
                      const marginAmt = p.profitMarginAmount !== undefined ? p.profitMarginAmount : Number((selling - cost).toFixed(2));
                      const marginPct =
                        p.profitMarginPercentage !== undefined
                          ? p.profitMarginPercentage
                          : cost > 0
                          ? Number((((selling - cost) / cost) * 100).toFixed(1))
                          : 0;
                      const isProfitable = marginAmt >= 0;
                      const isEditingThis = editingProductId === p.id;
                      const isExpanded = expandedBomProductId === p.id;
                      const hasBom = Array.isArray(p.bomComponents) && p.bomComponents.length > 0;

                      return (
                        <React.Fragment key={p.id}>
                          <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="p-4 font-mono font-bold text-blue-600">{p.sku}</td>
                            <td className="p-4">
                              <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
                              {hasBom && (
                                <button
                                  type="button"
                                  onClick={() => setExpandedBomProductId(isExpanded ? null : p.id)}
                                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
                                >
                                  <Layers className="w-3 h-3" />
                                  <span>{isExpanded ? 'Hide BOM Details' : `View BOM (${p.bomComponents?.length} items)`}</span>
                                </button>
                              )}
                            </td>
                            <td className="p-4 text-slate-500">{p.category}</td>
                            <td className="p-4 text-right font-mono">
                              <div className="font-bold text-slate-900 dark:text-white">
                                ₹{cost.toFixed(2)}
                              </div>
                              <span className="inline-block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                Auto-Calculated
                              </span>
                            </td>
                            <td className="p-4 text-right font-mono">
                              {isEditingThis ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={editingSellingPrice}
                                    onChange={(e) => setEditingSellingPrice(e.target.value)}
                                    className="w-28 p-1.5 rounded-lg border border-blue-500 bg-white dark:bg-slate-800 font-mono text-sm text-right"
                                    autoFocus
                                  />
                                  <button
                                    type="button"
                                    disabled={isUpdatingPrice}
                                    onClick={() => handleSaveProductSellingPrice(p.id)}
                                    className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                                    title="Save Selling Price"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingProductId(null)}
                                    className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                    title="Cancel"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end gap-1.5 group">
                                  <span className="font-black text-emerald-600 text-base">
                                    ₹{selling.toFixed(2)}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingProductId(p.id);
                                      setEditingSellingPrice(String(p.sellingPrice || 0));
                                    }}
                                    className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    title="Edit Selling Price"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </td>
                            <td className="p-4 text-right font-mono">
                              <div className={`font-bold ${isProfitable ? 'text-emerald-600' : 'text-red-500'}`}>
                                {isProfitable ? '+' : ''}₹{marginAmt.toFixed(2)}
                              </div>
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                                  isProfitable
                                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                                }`}
                              >
                                {isProfitable ? '+' : ''}
                                {marginPct}%
                              </span>
                            </td>
                            <td className="p-4 text-sm font-semibold">
                              <div>{p.currentStock.toLocaleString()} {p.unit}</div>
                              <span className="text-xs text-slate-400 font-normal">Catalog Stock</span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingProductId(p.id);
                                    setEditingSellingPrice(String(p.sellingPrice || 0));
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                                >
                                  Configure Price
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                  title="Remove Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expandable Bill-of-Materials Breakdown */}
                          {isExpanded && hasBom && (
                            <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-700">
                              <td colSpan={8} className="p-5">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                      <Layers className="w-4 h-4 text-blue-600" />
                                      <span>BOM Component Breakdown for {p.name} (Cost: ₹{cost.toFixed(2)})</span>
                                    </h4>
                                    <span className="text-xs text-slate-500">
                                      Formula: Quantity &times; (1 + Scrap Factor) &times; Approved Raw Material Rate
                                    </span>
                                  </div>

                                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                                    <table className="w-full text-xs text-left">
                                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                                        <tr>
                                          <th className="p-3">Raw Material</th>
                                          <th className="p-3">Material SKU</th>
                                          <th className="p-3 text-right">Required Qty</th>
                                          <th className="p-3 text-right">Scrap Factor</th>
                                          <th className="p-3 text-right">Active Approved Rate</th>
                                          <th className="p-3 text-right">Effective Line Cost</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                                        {p.bomComponents?.map((comp) => (
                                          <tr key={comp.id || comp.rawMaterialId}>
                                            <td className="p-3 font-sans font-bold text-slate-900 dark:text-white">
                                              {comp.name || 'Raw Material'}
                                            </td>
                                            <td className="p-3 text-slate-500">{comp.materialCode}</td>
                                            <td className="p-3 text-right">{comp.quantity} {comp.unit}</td>
                                            <td className="p-3 text-right">{(comp.scrapFactor * 100).toFixed(0)}%</td>
                                            <td className="p-3 text-right font-bold text-amber-600">
                                              ₹{Number(comp.rate).toFixed(2)}
                                            </td>
                                            <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                                              ₹{Number(comp.lineCost).toFixed(2)}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </main>
        )}

        {/* =================================================================== */}
        {/* TAB 4: PAYROLL & ATTENDANCE MANAGEMENT                              */}
        {/* =================================================================== */}
        {activeTab === 'payroll' && (
          <main className="max-w-7xl mx-auto px-6 py-6 space-y-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Employee Attendance &amp; Payroll Governance
                </h2>
                <p className="text-base text-slate-500">
                  Track monthly attendance, authorize increments/deductions, and enforce <strong>Hire / Terminate</strong> status flags.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-bold">
                  Period: November 2026
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <table className="w-full text-left text-base border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="p-4">Employee</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Attendance</th>
                    <th className="p-4">Base Salary</th>
                    <th className="p-4">Increments</th>
                    <th className="p-4">Deductions</th>
                    <th className="p-4">Net Payout</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Super Admin Governance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {payrolls.map((p) => {
                    const isTerminated = p.status === 'TERMINATED';
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-4">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {p.employeeName || 'Plant Personnel'}
                          </div>
                          <div className="text-xs font-mono text-slate-400">
                            {p.employeeCode || p.userId}
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-300">
                          {p.department || 'OPERATIONS'}
                        </td>
                        <td className="p-4">
                          <span className="font-bold">{p.attendanceDays}</span> / {p.totalWorkingDays} days
                        </td>
                        <td className="p-4 font-mono">₹{p.baseSalary.toLocaleString()}</td>
                        <td className="p-4 font-mono text-emerald-600 font-bold">+₹{p.increments.toLocaleString()}</td>
                        <td className="p-4 font-mono text-red-500 font-bold">-₹{p.deductions.toLocaleString()}</td>
                        <td className="p-4 font-mono font-black text-slate-900 dark:text-white">
                          ₹{p.netSalary.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-black ${
                              isTerminated
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {/* Adjust Increment / Salary button */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPayrollUser(p);
                              setAdjIncrement(String(p.increments));
                              setAdjDeduction(String(p.deductions));
                              setAdjAttendance(String(p.attendanceDays));
                              setIsAdjustmentModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-xs font-bold transition-all"
                          >
                            Adjust
                          </button>

                          {/* Hire / Terminate Toggle Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleHireTerminate(p.userId, p.status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                              isTerminated
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                          >
                            {isTerminated ? 'Re-Hire' : 'Terminate'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </main>
        )}

        {/* =================================================================== */}
        {/* TAB 5: DEPARTMENT EXCEL EXPORT                                      */}
        {/* =================================================================== */}
        {activeTab === 'export' && (
          <main className="max-w-7xl mx-auto px-6 py-6 space-y-6 w-full">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Department-wise Excel Spreadsheet Export
              </h2>
              <p className="text-base text-slate-500">
                Generate and download comprehensive personnel records formatted for Microsoft Excel with verified timestamps and tenant isolation checks.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm max-w-2xl space-y-6">
              <div>
                <label className="block text-base font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Select Target Department
                </label>
                <select
                  value={exportDepartment}
                  onChange={(e) => setExportDepartment(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Departments (Plant-Wide Workforce)</option>
                  <option value="PRODUCTION">Production Line Personnel</option>
                  <option value="QUALITY">Quality &amp; Lab QA/QC</option>
                  <option value="INVENTORY">Inventory &amp; Stores</option>
                  <option value="PACKING">Packing &amp; Dispatch</option>
                  <option value="LOGISTICS">Logistics &amp; Weighbridge</option>
                  <option value="MACHINE_MAINTENANCE">Machine Maintenance</option>
                  <option value="HR">Human Resources</option>
                  <option value="SALES">Sales &amp; Distribution</option>
                  <option value="FINANCE">Finance &amp; Accounts</option>
                  <option value="SECURITY">Security &amp; EHS Safety</option>
                </select>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 text-sm text-slate-600 dark:text-slate-300 space-y-1">
                <div className="font-bold text-blue-700 dark:text-blue-300">
                  Export Format Specification:
                </div>
                <div>&bull; Output: Excel CSV / Spreadsheet XML formatted</div>
                <div>&bull; Includes: Employee Code, Name, Email, Department, Designation, Role, Salary, Status</div>
                <div>&bull; Security: Watermarked with Company ID #{tenantId} and exact timestamp</div>
              </div>

              <button
                type="button"
                onClick={handleDownloadExcel}
                className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01]"
              >
                <Download className="w-6 h-6" />
                <span>Download Department Excel Spreadsheet</span>
              </button>
            </div>
          </main>
        )}

        {/* =================================================================== */}
        {/* TAB 6: RBAC PORTAL ACCESS GOVERNANCE                                */}
        {/* =================================================================== */}
        {activeTab === 'rbac' && (
          <main className="max-w-7xl mx-auto px-6 py-6 space-y-6 w-full">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                RBAC Permission &amp; Portal Access Rights
              </h2>
              <p className="text-base text-slate-500">
                Grant or revoke system portal access for managers and shop-floor operators with immediate session enforcement.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <table className="w-full text-left text-base border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="p-4">Employee</th>
                    <th className="p-4">Corporate Email</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Designation</th>
                    <th className="p-4">RBAC Role</th>
                    <th className="p-4">Portal Status</th>
                    <th className="p-4 text-right">Access Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {emp.firstName} {emp.lastName || ''}
                        </div>
                        <div className="text-xs font-mono text-slate-400">
                          {emp.employeeCode || emp.id}
                        </div>
                      </td>
                      <td className="p-4 font-mono text-slate-600 dark:text-slate-300">{emp.email}</td>
                      <td className="p-4 font-bold">{emp.department}</td>
                      <td className="p-4">{emp.designation}</td>
                      <td className="p-4 font-mono font-bold text-blue-600">{emp.role}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black ${
                            emp.isActive
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                          }`}
                        >
                          {emp.isActive ? 'ACCESS_GRANTED' : 'REVOKED_LOCKED'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleTogglePortalAccess(emp)}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                            emp.isActive
                              ? 'bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {emp.isActive ? 'Revoke Access' : 'Grant Access'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        )}

        {/* =================================================================== */}
        {/* TAB 7: COMPANY MOVEMENTS & AUDIT LOG                                */}
        {/* =================================================================== */}
        {activeTab === 'audit' && (
          <main className="max-w-7xl mx-auto px-6 py-6 space-y-6 w-full">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Company Movement &amp; Audit Logs
              </h2>
              <p className="text-base text-slate-500">
                Cryptographically logged movement trail of raw materials, personnel status changes, and RBAC security modifications.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-5 flex items-start justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold text-xs mt-0.5">
                        {log.movementType?.substring(0, 3) || 'AUD'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-slate-900 dark:text-white">
                            {log.action.replace(/_/g, ' ')}
                          </span>
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600">
                            {log.module}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                          {log.details}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-bold text-slate-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                      <div className="text-xs font-bold text-amber-600 mt-1">
                        By {log.performedByRole}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}
      </div>

      {/* =================================================================== */}
      {/* MODAL 1: ADD RAW MATERIAL                                           */}
      {/* =================================================================== */}
      {isRawMaterialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-xl font-bold">Add Raw Material</h3>
              <button type="button" onClick={() => setIsRawMaterialModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateRawMaterial} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Material Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DRI Iron Sponge Ore"
                  value={rmName}
                  onChange={(e) => setRmName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-base font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={rmCost}
                    onChange={(e) => setRmCost(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-base font-semibold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Valuation Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={rmSelling}
                    onChange={(e) => setRmSelling(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-base font-semibold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={rmUnit}
                    onChange={(e) => setRmUnit(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-base font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={rmStock}
                    onChange={(e) => setRmStock(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-base font-semibold font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRawMaterialModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold shadow"
                >
                  Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: REGISTER FINISHED PRODUCT                                  */}
      {/* =================================================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-xl font-bold">Register Finished Product</h3>
              <button type="button" onClick={() => setIsProductModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 110mm PVC Pressure Pipe PN10"
                  value={prdName}
                  onChange={(e) => setPrdName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-base font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold mb-1">Mfg Cost (₹)</label>
                  <input
                    type="number"
                    required
                    value={prdCost}
                    onChange={(e) => setPrdCost(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-base font-semibold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Catalog Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={prdSelling}
                    onChange={(e) => setPrdSelling(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-base font-semibold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={prdUnit}
                    onChange={(e) => setPrdUnit(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-base font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={prdStock}
                    onChange={(e) => setPrdStock(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-base font-semibold font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold shadow"
                >
                  Register SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 4: APPROVE RATE CHANGE REQUEST                                */}
      {/* =================================================================== */}
      {isApprovalModalOpen && selectedRateRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-xl font-bold">Approve Procurement Rate Request</h3>
              </div>
              <button type="button" onClick={() => setIsApprovalModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Raw Material:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedRateRequest.rawMaterial?.name} ({selectedRateRequest.rawMaterial?.materialCode})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Active Rate:</span>
                <span className="font-mono font-semibold">₹{Number(selectedRateRequest.currentRate || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Proposed by Procurement:</span>
                <span className="font-mono font-bold text-emerald-600">₹{Number(selectedRateRequest.proposedRate || 0).toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block text-xs mb-0.5">Procurement Reason:</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic">"{selectedRateRequest.reason || 'None provided'}"</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Approved Final Rate (₹ per unit)</label>
              <input
                type="number"
                step="0.01"
                required
                value={customApprovedRate}
                onChange={(e) => setCustomApprovedRate(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-lg font-mono font-bold text-emerald-600"
              />
              <span className="text-xs text-slate-400 mt-1 block">
                You can accept the proposed rate or specify a negotiated final rate.
              </span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200">
              <strong>Automatic Recalculation Notice:</strong> Approving will instantly update the raw material active rate and trigger automatic recalculation of the Cost Price across all finished products in your catalog using this material.
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsApprovalModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleApproveRateRequest(selectedRateRequest, parseFloat(customApprovedRate))}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow transition-all"
              >
                Confirm Approval &amp; Recalculate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 5: REJECT RATE CHANGE REQUEST                                 */}
      {/* =================================================================== */}
      {isRejectModalOpen && selectedRateRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <h3 className="text-xl font-bold">Reject Procurement Rate Request</h3>
              </div>
              <button type="button" onClick={() => setIsRejectModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 text-sm">
              <div className="font-bold text-slate-900 dark:text-white">
                {selectedRateRequest.rawMaterial?.name} ({selectedRateRequest.rawMaterial?.materialCode})
              </div>
              <div className="text-xs text-slate-500">
                Proposed: ₹{Number(selectedRateRequest.proposedRate || 0).toFixed(2)} (Current: ₹{Number(selectedRateRequest.currentRate || 0).toFixed(2)})
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 italic pt-1">
                Reason: "{selectedRateRequest.reason || 'None provided'}"
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Rejection Reason / Executive Feedback *</label>
              <textarea
                required
                rows={3}
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="State reason e.g. 'Rate exceeds approved supplier contract parameters; renegotiate with secondary vendor.'"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border text-sm font-bold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleRejectRateRequest(selectedRateRequest, rejectionReasonInput)}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow transition-all"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 6: DIRECT RAW MATERIAL RATE OVERRIDE                          */}
      {/* =================================================================== */}
      {isDirectRateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-600" />
                <h3 className="text-xl font-bold">Direct Raw Material Rate Override</h3>
              </div>
              <button type="button" onClick={() => setIsDirectRateModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleDirectRateOverride} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Select Raw Material *</label>
                <select
                  value={selectedRmForRateEdit?.id || ''}
                  onChange={(e) => {
                    const found = rawMaterials.find((rm) => rm.id === e.target.value);
                    if (found) {
                      setSelectedRmForRateEdit(found);
                      setDirectRateInput(String(found.rate ?? found.costPrice ?? 0));
                    }
                  }}
                  required
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm font-semibold"
                >
                  {rawMaterials.map((rm) => (
                    <option key={rm.id} value={rm.id}>
                      {rm.name} ({rm.materialCode}) - Current: ₹{rm.rate ?? rm.costPrice ?? 0}/{rm.unit}
                    </option>
                  ))}
                </select>
              </div>

              {selectedRmForRateEdit && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex justify-between">
                  <span className="text-slate-500">Current Rate:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    ₹{Number(selectedRmForRateEdit.rate ?? selectedRmForRateEdit.costPrice ?? 0).toFixed(2)} / {selectedRmForRateEdit.unit}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold mb-1">New Active Rate (₹ per unit) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={directRateInput}
                  onChange={(e) => setDirectRateInput(e.target.value)}
                  placeholder="e.g. 34500.00"
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-base font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Adjustment Reason / Audit Note</label>
                <input
                  type="text"
                  value={directRateReason}
                  onChange={(e) => setDirectRateReason(e.target.value)}
                  placeholder="e.g. Q4 Executive contract adjustment / Bulk index revision"
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-200">
                Direct rate updates will immediately trigger automated recalculation of BOM Cost Prices across all products in {companyName}.
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDirectRateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border text-sm font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow"
                >
                  Override &amp; Recalculate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
