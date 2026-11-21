'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  Layers,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Download,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Users,
  Sun,
  Moon,
  Award,
  ShieldAlert,
  ClipboardList,
  Sliders,
  Send,
  Boxes,
  Truck,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Warehouse,
  FolderGit2,
  Landmark,
} from 'lucide-react';
import { UserPayload } from '../../../types/auth';

interface InventoryTaskItem {
  id: string;
  taskCode: string;
  title: string;
  description?: string | null;
  priority: string;
  status: string; // PENDING, IN_PROGRESS, COMPLETED, BLOCKED
  dueDate?: string | null;
  assignerName?: string;
  assigneeId: string;
  assigneeName?: string;
  createdAt: string;
}

interface WarehouseStorageItem {
  id: string;
  storageCode: string;
  type: 'RAW_MATERIAL' | 'FINISHED_GOODS';
  itemCode: string;
  itemName: string;
  location: string;
  quantity: number;
  unit: string;
  unitValue: number;
  totalValue: number;
  minLevel: number;
  maxLevel: number;
  status: string; // OPTIMAL, LOW_STOCK, OVERFLOW, CRITICAL
  updatedAt: string;
}

interface ProductionTransferItem {
  id: string;
  transferNumber: string;
  transferType: 'ISSUE_TO_PRODUCTION' | 'RECEIPT_FROM_PRODUCTION';
  lineId: string;
  itemCode: string;
  itemName: string;
  rawMaterialIssuedQty: number;
  finishedGoodsReceivedQty: number;
  unit: string;
  unitValue: number;
  totalValue: number;
  batchNumber?: string | null;
  handlerName?: string | null;
  timestamp: string;
  status: string;
}

interface InventoryReportItem {
  id: string;
  reportNumber: string;
  date: string;
  period: string;
  rawMaterialsIn: number;
  rawMaterialsUsed: number;
  finishedGoodsOut: number;
  scrapGenerated: number;
  totalInventoryValue: number;
  summary?: string | null;
}

interface InventoryLaborItem {
  id: string;
  laborCode: string;
  workerName: string;
  department: string;
  designation: string;
  shift: string;
  month: string;
  dailyWage: number;
  daysPresent: number;
  totalDays: number;
  overtimeHours: number;
  overtimeRate: number;
  allowances: number;
  deductions: number;
  netPayable: number;
  paymentStatus: string;
}

export default function InventoryDashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserPayload | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'tasks' | 'storage' | 'transfers' | 'reports' | 'labor'>('storage');

  // Hierarchy role view simulation: Main Manager vs Assistant vs Associate
  const [activeInventoryRole, setActiveInventoryRole] = useState<'MAIN_MANAGER' | 'ASSISTANT' | 'ASSOCIATE'>('MAIN_MANAGER');

  // Loading & Feedback
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Data collections
  const [tasks, setTasks] = useState<InventoryTaskItem[]>([]);
  const [storages, setStorages] = useState<WarehouseStorageItem[]>([]);
  const [transfers, setTransfers] = useState<ProductionTransferItem[]>([]);
  const [reports, setReports] = useState<InventoryReportItem[]>([]);
  const [labor, setLabor] = useState<InventoryLaborItem[]>([]);

  // Filters
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>('ALL');
  const [storageTypeFilter, setStorageTypeFilter] = useState<'ALL' | 'RAW_MATERIAL' | 'FINISHED_GOODS'>('ALL');
  const [transferTypeFilter, setTransferTypeFilter] = useState<'ALL' | 'ISSUE_TO_PRODUCTION' | 'RECEIPT_FROM_PRODUCTION'>('ALL');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLaborModalOpen, setIsLaborModalOpen] = useState(false);
  const [selectedLabor, setSelectedLabor] = useState<InventoryLaborItem | null>(null);

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState('HIGH');
  const [taskAssignee, setTaskAssignee] = useState('usr-iasst-02');
  const [taskDueDate, setTaskDueDate] = useState('');

  // Storage form state
  const [stgType, setStgType] = useState<'RAW_MATERIAL' | 'FINISHED_GOODS'>('RAW_MATERIAL');
  const [stgItemCode, setStgItemCode] = useState('RAW-STL-001');
  const [stgItemName, setStgItemName] = useState('Prime Steel Cold-Rolled Coils');
  const [stgLocation, setStgLocation] = useState('Warehouse Bay A-14');
  const [stgQty, setStgQty] = useState('150');
  const [stgUnit, setStgUnit] = useState('MT');
  const [stgUnitValue, setStgUnitValue] = useState('57500');
  const [stgMinLevel, setStgMinLevel] = useState('20');
  const [stgMaxLevel, setStgMaxLevel] = useState('500');

  // Transfer form state
  const [trfType, setTrfType] = useState<'ISSUE_TO_PRODUCTION' | 'RECEIPT_FROM_PRODUCTION'>('ISSUE_TO_PRODUCTION');
  const [trfLine, setTrfLine] = useState('Slitting Line #1');
  const [trfItemCode, setTrfItemCode] = useState('RAW-STL-001');
  const [trfItemName, setTrfItemName] = useState('Prime Steel Cold-Rolled Coils');
  const [trfQty, setTrfQty] = useState('25');
  const [trfUnit, setTrfUnit] = useState('MT');
  const [trfUnitValue, setTrfUnitValue] = useState('57500');
  const [trfBatch, setTrfBatch] = useState('LOT-STL-9021');
  const [trfHandler, setTrfHandler] = useState('Ramesh Patel (Forklift Operator)');

  // Report form state
  const [repPeriod, setRepPeriod] = useState('DAILY');
  const [repRmIn, setRepRmIn] = useState('140.0');
  const [repRmUsed, setRepRmUsed] = useState('125.0');
  const [repFgOut, setRepFgOut] = useState('350.0');
  const [repScrap, setRepScrap] = useState('2.4');
  const [repSummary, setRepSummary] = useState('Balanced daily material replenishment with zero line starved events.');

  // Labor edit state
  const [laborDaysPresent, setLaborDaysPresent] = useState('26');
  const [laborOvertime, setLaborOvertime] = useState('10');
  const [laborDailyWage, setLaborDailyWage] = useState('820');
  const [laborAllowances, setLaborAllowances] = useState('1400');
  const [laborDeductions, setLaborDeductions] = useState('0');
  const [laborPayStatus, setLaborPayStatus] = useState('PAID');

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

    loadInventoryData();
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

  const loadInventoryData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // 1. Tasks
      try {
        const res = await fetch(`${apiUrl}/inventory/tasks`, { headers });
        if (res.ok) setTasks(await res.json());
        else fallbackTasks();
      } catch {
        fallbackTasks();
      }

      // 2. Storage
      try {
        const res = await fetch(`${apiUrl}/inventory/storage`, { headers });
        if (res.ok) setStorages(await res.json());
        else fallbackStorages();
      } catch {
        fallbackStorages();
      }

      // 3. Transfers
      try {
        const res = await fetch(`${apiUrl}/inventory/transfers`, { headers });
        if (res.ok) setTransfers(await res.json());
        else fallbackTransfers();
      } catch {
        fallbackTransfers();
      }

      // 4. Reports
      try {
        const res = await fetch(`${apiUrl}/inventory/reports`, { headers });
        if (res.ok) setReports(await res.json());
        else fallbackReports();
      } catch {
        fallbackReports();
      }

      // 5. Labor
      try {
        const res = await fetch(`${apiUrl}/inventory/labor`, { headers });
        if (res.ok) setLabor(await res.json());
        else fallbackLabor();
      } catch {
        fallbackLabor();
      }
    } catch {
      fallbackAll();
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackTasks = () => {
    setTasks([]);
  };

  const fallbackStorages = () => {
    setStorages([]);
  };

  const fallbackTransfers = () => {
    setTransfers([]);
  };

  const fallbackReports = () => {
    setReports([]);
  };

  const fallbackLabor = () => {
    setLabor([]);
  };

  const fallbackAll = () => {
    setTasks([]);
    setStorages([]);
    setTransfers([]);
    setReports([]);
    setLabor([]);
  };

  // =========================================================================
  // ACTIONS: TASK MANAGEMENT
  // =========================================================================

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setFeedbackError('Task title is required.');
      return;
    }

    const payload = {
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      priority: taskPriority,
      assigneeId: taskAssignee,
      dueDate: taskDueDate || undefined,
    };

    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/inventory/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to create inventory task');
      const created = await res.json();
      setTasks((prev) => [created, ...prev]);
    } catch {
      const newTask: InventoryTaskItem = {
        id: `tsk-${Date.now()}`,
        taskCode: `TSK-INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        title: taskTitle.trim(),
        description: taskDesc.trim(),
        priority: taskPriority,
        status: 'PENDING',
        dueDate: taskDueDate ? new Date(taskDueDate).toISOString() : null,
        assignerName: currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() + ' (Inventory Manager)' : 'Lead Inventory Manager',
        assigneeId: taskAssignee,
        assigneeName: taskAssignee.includes('asst')
          ? 'Deepak Verma (Assistant Manager)'
          : 'Kavita Rao (Associate Manager)',
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
    }

    setFeedbackSuccess(`Inventory task "${taskTitle}" assigned successfully.`);
    setIsTaskModalOpen(false);
    setTaskTitle('');
    setTaskDesc('');
  };

  const handleUpdateTaskStatus = async (taskId: string, nextStatus: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await fetch(`${apiUrl}/inventory/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch {
      // fallback
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t)),
    );
    setFeedbackSuccess(`Task marked as ${nextStatus}.`);
  };

  // =========================================================================
  // ACTIONS: WAREHOUSE STORAGE CREATION
  // =========================================================================

  const handleCreateStorage = async (e: React.FormEvent) => {
    e.preventDefault();

    const qty = parseFloat(stgQty) || 0;
    const val = parseFloat(stgUnitValue) || 0;

    const payload = {
      type: stgType,
      itemCode: stgItemCode,
      itemName: stgItemName,
      location: stgLocation,
      quantity: qty,
      unit: stgUnit,
      unitValue: val,
      minLevel: parseFloat(stgMinLevel) || 10,
      maxLevel: parseFloat(stgMaxLevel) || 1000,
    };

    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/inventory/storage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to register storage');
      const created = await res.json();
      setStorages((prev) => [created, ...prev]);
    } catch {
      const newStorage: WarehouseStorageItem = {
        id: `stg-${Date.now()}`,
        storageCode: `STG-${stgType === 'RAW_MATERIAL' ? 'RM' : 'FG'}-${Math.floor(100 + Math.random() * 900)}`,
        type: stgType,
        itemCode: stgItemCode,
        itemName: stgItemName,
        location: stgLocation,
        quantity: qty,
        unit: stgUnit,
        unitValue: val,
        totalValue: qty * val,
        minLevel: parseFloat(stgMinLevel) || 10,
        maxLevel: parseFloat(stgMaxLevel) || 1000,
        status: qty < (parseFloat(stgMinLevel) || 10) ? 'LOW_STOCK' : 'OPTIMAL',
        updatedAt: new Date().toISOString(),
      };
      setStorages((prev) => [newStorage, ...prev]);
    }

    setFeedbackSuccess(`Warehouse storage registered at ${stgLocation} for ${stgItemName}.`);
    setIsStorageModalOpen(false);
  };

  // =========================================================================
  // ACTIONS: PRODUCTION MATERIAL TRANSFERS WITH UNIT VALUES
  // =========================================================================

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    const qty = parseFloat(trfQty) || 0;
    const unitVal = parseFloat(trfUnitValue) || 0;

    const payload = {
      transferType: trfType,
      lineId: trfLine,
      itemCode: trfItemCode,
      itemName: trfItemName,
      rawMaterialIssuedQty: trfType === 'ISSUE_TO_PRODUCTION' ? qty : 0,
      finishedGoodsReceivedQty: trfType === 'RECEIPT_FROM_PRODUCTION' ? qty : 0,
      unit: trfUnit,
      unitValue: unitVal,
      batchNumber: trfBatch,
      handlerName: trfHandler,
    };

    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/inventory/transfers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Transfer log failed');
      const created = await res.json();
      setTransfers((prev) => [created, ...prev]);
    } catch {
      const newTransfer: ProductionTransferItem = {
        id: `trf-${Date.now()}`,
        transferNumber: `TRF-PRD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        transferType: trfType,
        lineId: trfLine,
        itemCode: trfItemCode,
        itemName: trfItemName,
        rawMaterialIssuedQty: trfType === 'ISSUE_TO_PRODUCTION' ? qty : 0,
        finishedGoodsReceivedQty: trfType === 'RECEIPT_FROM_PRODUCTION' ? qty : 0,
        unit: trfUnit,
        unitValue: unitVal,
        totalValue: qty * unitVal,
        batchNumber: trfBatch,
        handlerName: trfHandler,
        timestamp: new Date().toISOString(),
        status: 'COMPLETED',
      };
      setTransfers((prev) => [newTransfer, ...prev]);
    }

    // Adjust local storage level
    setStorages((prev) =>
      prev.map((s) => {
        if (s.itemCode === trfItemCode) {
          const nextQty =
            trfType === 'ISSUE_TO_PRODUCTION'
              ? Math.max(0, s.quantity - qty)
              : s.quantity + qty;
          return {
            ...s,
            quantity: nextQty,
            totalValue: nextQty * s.unitValue,
            status: nextQty < s.minLevel ? 'LOW_STOCK' : 'OPTIMAL',
            updatedAt: new Date().toISOString(),
          };
        }
        return s;
      }),
    );

    setFeedbackSuccess(
      `Production transfer ${trfType === 'ISSUE_TO_PRODUCTION' ? 'Issued' : 'Received'} (${qty} ${trfUnit}) with total financial valuation of ₹${(qty * unitVal).toLocaleString()}.`,
    );
    setIsTransferModalOpen(false);
  };

  // =========================================================================
  // ACTIONS: OPERATIONS REPORTS
  // =========================================================================

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      period: repPeriod,
      rawMaterialsIn: parseFloat(repRmIn) || 0,
      rawMaterialsUsed: parseFloat(repRmUsed) || 0,
      finishedGoodsOut: parseFloat(repFgOut) || 0,
      scrapGenerated: parseFloat(repScrap) || 0,
      summary: repSummary,
    };

    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/inventory/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Report submission failed');
      const created = await res.json();
      setReports((prev) => [created, ...prev]);
    } catch {
      const newReport: InventoryReportItem = {
        id: `inr-${Date.now()}`,
        reportNumber: `INR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
        date: new Date().toISOString(),
        period: repPeriod,
        rawMaterialsIn: parseFloat(repRmIn) || 0,
        rawMaterialsUsed: parseFloat(repRmUsed) || 0,
        finishedGoodsOut: parseFloat(repFgOut) || 0,
        scrapGenerated: parseFloat(repScrap) || 0,
        totalInventoryValue: storages.reduce((acc, s) => acc + s.totalValue, 0),
        summary: repSummary,
      };
      setReports((prev) => [newReport, ...prev]);
    }

    setFeedbackSuccess(`Inventory balance report for ${repPeriod} generated successfully.`);
    setIsReportModalOpen(false);
  };

  // =========================================================================
  // ACTIONS: LABOR ATTENDANCE & SALARY UPDATE
  // =========================================================================

  const openLaborEditModal = (lab: InventoryLaborItem) => {
    setSelectedLabor(lab);
    setLaborDaysPresent(String(lab.daysPresent));
    setLaborOvertime(String(lab.overtimeHours));
    setLaborDailyWage(String(lab.dailyWage));
    setLaborAllowances(String(lab.allowances));
    setLaborDeductions(String(lab.deductions));
    setLaborPayStatus(lab.paymentStatus);
    setIsLaborModalOpen(true);
  };

  const handleUpdateLabor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLabor) return;

    const days = parseInt(laborDaysPresent) || 0;
    const ot = parseFloat(laborOvertime) || 0;
    const wage = parseFloat(laborDailyWage) || 0;
    const allow = parseFloat(laborAllowances) || 0;
    const deduct = parseFloat(laborDeductions) || 0;
    const net = days * wage + ot * selectedLabor.overtimeRate + allow - deduct;

    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await fetch(`${apiUrl}/inventory/labor/${selectedLabor.id}/salary`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          dailyWage: wage,
          allowances: allow,
          deductions: deduct,
          paymentStatus: laborPayStatus,
        }),
      });
      await fetch(`${apiUrl}/inventory/labor/${selectedLabor.id}/attendance`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          daysPresent: days,
          overtimeHours: ot,
        }),
      });
    } catch {
      // fallback
    }

    setLabor((prev) =>
      prev.map((l) =>
        l.id === selectedLabor.id
          ? {
              ...l,
              daysPresent: days,
              overtimeHours: ot,
              dailyWage: wage,
              allowances: allow,
              deductions: deduct,
              netPayable: net,
              paymentStatus: laborPayStatus,
            }
          : l,
      ),
    );

    setFeedbackSuccess(`Updated attendance and wages for ${selectedLabor.workerName} (Net: ₹${net.toLocaleString()}).`);
    setIsLaborModalOpen(false);
  };

  // =========================================================================
  // ACTIONS: EXCEL EXPORT WITH PRECISE DATE-TIME STAMP
  // =========================================================================

  const handleExportInventoryExcel = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(
      now.getHours(),
    )}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
    const fileName = `Inventory_Department_Audit_${timeStamp}.xlsx`;

    const lines: string[] = [];
    lines.push(`MANUFACTURING ERP - INVENTORY DEPARTMENT ENTERPRISE AUDIT`);
    lines.push(`Exported At,${now.toISOString()}`);
    lines.push(`Exported By,"${currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : 'Inventory Manager'}" (${activeInventoryRole})`);
    lines.push(`Audit File Stamp,${fileName}`);
    lines.push(``);

    // Section 1: Storages with Valuations
    lines.push(`=== 1. DUAL WAREHOUSE STORAGE INVENTORY (RAW MATERIALS & FINISHED GOODS) ===`);
    lines.push(
      [
        'Storage Code',
        'Type',
        'Item Code',
        'Item Name',
        'Location',
        'Quantity',
        'Unit',
        'Unit Value (INR)',
        'Total Valuation (INR)',
        'Status',
      ].join(','),
    );
    storages.forEach((s) => {
      lines.push(
        [
          s.storageCode,
          s.type,
          s.itemCode,
          `"${s.itemName}"`,
          `"${s.location}"`,
          s.quantity,
          s.unit,
          s.unitValue,
          s.totalValue,
          s.status,
        ].join(','),
      );
    });
    lines.push(``);

    // Section 2: Production Transfers with Values
    lines.push(`=== 2. PRODUCTION MATERIAL TRANSFERS WITH UNIT VALUES ===`);
    lines.push(
      [
        'Transfer Code',
        'Type',
        'Line',
        'Item Code',
        'Item Name',
        'RM Issued Qty',
        'FG Received Qty',
        'Unit',
        'Unit Value (INR)',
        'Total Valuation (INR)',
        'Batch',
        'Handler',
        'Timestamp',
      ].join(','),
    );
    transfers.forEach((t) => {
      lines.push(
        [
          t.transferNumber,
          t.transferType,
          `"${t.lineId}"`,
          t.itemCode,
          `"${t.itemName}"`,
          t.rawMaterialIssuedQty,
          t.finishedGoodsReceivedQty,
          t.unit,
          t.unitValue,
          t.totalValue,
          t.batchNumber || 'N/A',
          `"${t.handlerName || 'Handler'}"`,
          t.timestamp,
        ].join(','),
      );
    });
    lines.push(``);

    // Section 3: Operations Reports
    lines.push(`=== 3. OPERATIONS REPORTS (RM IN/USED - FG OUT) ===`);
    lines.push(
      [
        'Report Code',
        'Date',
        'Period',
        'RM Inward',
        'RM Issued to Line',
        'FG Dispatched',
        'Scrap Generated',
        'Total Valuation (INR)',
        'Summary',
      ].join(','),
    );
    reports.forEach((r) => {
      lines.push(
        [
          r.reportNumber,
          new Date(r.date).toISOString().slice(0, 10),
          r.period,
          r.rawMaterialsIn,
          r.rawMaterialsUsed,
          r.finishedGoodsOut,
          r.scrapGenerated,
          r.totalInventoryValue,
          `"${(r.summary || '').replace(/"/g, '""')}"`,
        ].join(','),
      );
    });
    lines.push(``);

    // Section 4: Labor Register
    lines.push(`=== 4. INVENTORY LABOR ATTENDANCE & SALARY REGISTER ===`);
    lines.push(
      [
        'Labor Code',
        'Worker Name',
        'Designation',
        'Shift',
        'Month',
        'Daily Wage',
        'Days Present',
        'Total Days',
        'Overtime (Hrs)',
        'Allowances',
        'Deductions',
        'Net Payable',
        'Status',
      ].join(','),
    );
    labor.forEach((l) => {
      lines.push(
        [
          l.laborCode,
          `"${l.workerName}"`,
          l.designation,
          l.shift,
          l.month,
          l.dailyWage,
          l.daysPresent,
          l.totalDays,
          l.overtimeHours,
          l.allowances,
          l.deductions,
          l.netPayable,
          l.paymentStatus,
        ].join(','),
      );
    });

    const csvData = '\uFEFF' + lines.join('\r\n');
    const blob = new Blob([csvData], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);

    setFeedbackSuccess(`Exported date-time stamped inventory audit: "${fileName}".`);
  };

  // Filtered lists
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => taskStatusFilter === 'ALL' || t.status === taskStatusFilter);
  }, [tasks, taskStatusFilter]);

  const filteredStorages = useMemo(() => {
    return storages.filter((s) => storageTypeFilter === 'ALL' || s.type === storageTypeFilter);
  }, [storages, storageTypeFilter]);

  const filteredTransfers = useMemo(() => {
    return transfers.filter((t) => transferTypeFilter === 'ALL' || t.transferType === transferTypeFilter);
  }, [transfers, transferTypeFilter]);

  // Overall statistics
  const stats = useMemo(() => {
    const totalValuation = storages.reduce((acc, s) => acc + (s.totalValue || 0), 0);
    const lowStockCount = storages.filter((s) => s.status === 'LOW_STOCK').length;
    const pendingTasksCount = tasks.filter((t) => t.status !== 'COMPLETED').length;
    const activeLaborCount = labor.length;
    return { totalValuation, lowStockCount, pendingTasksCount, activeLaborCount };
  }, [storages, tasks, labor]);

  if (!mounted) return null;

  return (
    <div className={`flex-1 flex flex-col min-w-0 ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-20 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <Link
              href="/dashboard"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 text-base font-semibold whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-5 h-5 shrink-0" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
                <Warehouse className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                    Inventory &amp; Warehousing Department
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 whitespace-nowrap shrink-0">
                    INVENTORY CONTROL
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Dual Storage &bull; Production Transfers &bull; Material Reports &bull; Labor Attendance
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Hierarchical Role Switcher Indicator */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
              <button
                onClick={() => setActiveInventoryRole('MAIN_MANAGER')}
                className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeInventoryRole === 'MAIN_MANAGER'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Main Manager
              </button>
              <button
                onClick={() => setActiveInventoryRole('ASSISTANT')}
                className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeInventoryRole === 'ASSISTANT'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Assistant
              </button>
              <button
                onClick={() => setActiveInventoryRole('ASSOCIATE')}
                className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeInventoryRole === 'ASSOCIATE'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Associate
              </button>
            </div>

            {/* Date-Time Stamped Excel Export Button */}
            <button
              onClick={handleExportInventoryExcel}
              className="px-4 py-2.5 rounded-xl text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
              title="Download Excel spreadsheet with precise date-time stamps"
            >
              <Download className="w-5 h-5 shrink-0" />
              <span>Export Audit (.xlsx)</span>
            </button>

            {/* Quick Cross-Department Navigation */}
            <Link
              href="/dashboard/finance"
              className="hidden lg:flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-base font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition-all whitespace-nowrap shrink-0"
              title="Navigate to Finance Department"
            >
              <Landmark className="w-5 h-5 shrink-0" />
              <span>Finance</span>
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
        {/* Department Structure Banner */}
        <div className="rounded-2xl p-5 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-blue-950/20 border-2 border-indigo-200 dark:border-indigo-900/60 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Warehouse className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h3 className="text-lg font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
                <span>Inventory Hierarchy &amp; Multi-Tenant Material Control</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-100 font-extrabold uppercase">
                  Active Mode: {activeInventoryRole}
                </span>
              </h3>
              <span className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">
                Main Manager: <strong>{currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : 'Lead Inventory Manager'}</strong> &bull; Assistant: <strong>Deepak Verma (Raw Storage)</strong> &bull; Associate: <strong>Kavita Rao (FG Dispatch)</strong>
              </span>
            </div>
            <p className="mt-1.5 text-base text-indigo-900/90 dark:text-indigo-300/90 leading-relaxed font-medium">
              The Main Inventory Manager governs overall stock valuations and delegates warehouse transfers.
              Dual storage covers raw material yards and finished goods racks, with automated ledger deductions on line issuance.
            </p>
          </div>
        </div>

        {/* Feedback Messages */}
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

        {/* Top KPI Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Inventory Valuation
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                ₹{(stats.totalValuation / 100000).toFixed(2)} Lakhs
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                <TrendingUp className="w-4 h-4" />
                <span>Raw Materials &amp; Finished Goods</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active Warehouse Bays &amp; Silos
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                <Boxes className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {storages.length} Locations
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <span>Dual Storage Tracking Active</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Low Stock Threshold Alerts
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                {stats.lowStockCount} Items
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <span>Below buffer threshold</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Warehouse Workforce
              </span>
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                <Users className="w-5 h-5 shrink-0" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {stats.activeLaborCount} Staff
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <span>Forklift operators &amp; store clerks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('storage')}
            className={`px-5 py-3 rounded-xl font-bold text-base transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0 ${
              activeTab === 'storage'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Boxes className="w-5 h-5 shrink-0" />
            <span>Warehouse Storage (Raw &amp; FG)</span>
          </button>

          <button
            onClick={() => setActiveTab('transfers')}
            className={`px-5 py-3 rounded-xl font-bold text-base transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0 ${
              activeTab === 'transfers'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Truck className="w-5 h-5 shrink-0" />
            <span>Production Material Transfers</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-5 py-3 rounded-xl font-bold text-base transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0 ${
              activeTab === 'tasks'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ClipboardList className="w-5 h-5 shrink-0" />
            <span>Task Management &amp; Delegation</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-5 py-3 rounded-xl font-bold text-base transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0 ${
              activeTab === 'reports'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Package className="w-5 h-5 shrink-0" />
            <span>Operations Reports (In/Used/Out)</span>
          </button>

          <button
            onClick={() => setActiveTab('labor')}
            className={`px-5 py-3 rounded-xl font-bold text-base transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0 ${
              activeTab === 'labor'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-5 h-5 shrink-0" />
            <span>Department Labor &amp; Wages</span>
          </button>
        </div>

        {/* TAB 1: DUAL WAREHOUSE STORAGE (RAW & FG) */}
        {activeTab === 'storage' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Boxes className="w-5 h-5 text-indigo-600" />
                    <span>Dual Warehouse Storage Tracking with Financial Unit Valuations</span>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Real-time stock quantities across Heavy Yards, Chemical Silos, and Finished Goods Distribution Racks.
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold">
                    <button
                      onClick={() => setStorageTypeFilter('ALL')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        storageTypeFilter === 'ALL'
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      All Stocks
                    </button>
                    <button
                      onClick={() => setStorageTypeFilter('RAW_MATERIAL')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        storageTypeFilter === 'RAW_MATERIAL'
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Raw Materials
                    </button>
                    <button
                      onClick={() => setStorageTypeFilter('FINISHED_GOODS')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        storageTypeFilter === 'FINISHED_GOODS'
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Finished Goods
                    </button>
                  </div>

                  <button
                    onClick={() => setIsStorageModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl font-bold text-base bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Register Storage Location</span>
                  </button>
                </div>
              </div>

              {/* Storage Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                      <th className="py-3 px-4">Storage Code</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Item &amp; Location</th>
                      <th className="py-3 px-4">Current Stock</th>
                      <th className="py-3 px-4">Unit Value (INR)</th>
                      <th className="py-3 px-4">Total Financial Value</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-base">
                    {filteredStorages.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-xs text-slate-900 dark:text-white">
                          {s.storageCode}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-extrabold uppercase ${
                              s.type === 'RAW_MATERIAL'
                                ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            }`}
                          >
                            {s.type === 'RAW_MATERIAL' ? 'Raw Material' : 'Finished Goods'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{s.itemName}</div>
                          <div className="text-xs text-slate-400 font-medium">
                            {s.location} &bull; SKU: {s.itemCode}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {s.quantity.toLocaleString()} {s.unit}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-600 dark:text-slate-400">
                          ₹{s.unitValue.toLocaleString()} / {s.unit}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                          ₹{s.totalValue.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                              s.status === 'LOW_STOCK'
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300'
                                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                            }`}
                          >
                            {s.status}
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

        {/* TAB 2: PRODUCTION MATERIAL TRANSFERS WITH UNIT VALUES */}
        {activeTab === 'transfers' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Truck className="w-5 h-5 text-indigo-600" />
                    <span>Production Material Transfers with Unit Values</span>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Track Raw Materials issued to production stations and Finished Goods received into inventory with financial cost accounting.
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold">
                    <button
                      onClick={() => setTransferTypeFilter('ALL')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        transferTypeFilter === 'ALL'
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      All Transfers
                    </button>
                    <button
                      onClick={() => setTransferTypeFilter('ISSUE_TO_PRODUCTION')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        transferTypeFilter === 'ISSUE_TO_PRODUCTION'
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Issues to Lines
                    </button>
                    <button
                      onClick={() => setTransferTypeFilter('RECEIPT_FROM_PRODUCTION')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        transferTypeFilter === 'RECEIPT_FROM_PRODUCTION'
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Receipts from Lines
                    </button>
                  </div>

                  <button
                    onClick={() => setIsTransferModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl font-bold text-base bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Record Production Transfer</span>
                  </button>
                </div>
              </div>

              {/* Transfers Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                      <th className="py-3 px-4">Transfer Number</th>
                      <th className="py-3 px-4">Direction &amp; Line</th>
                      <th className="py-3 px-4">Item &amp; Batch</th>
                      <th className="py-3 px-4">Quantity</th>
                      <th className="py-3 px-4">Unit Value (INR)</th>
                      <th className="py-3 px-4">Total Financial Value</th>
                      <th className="py-3 px-4">Handler &amp; Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-base">
                    {filteredTransfers.map((trf) => (
                      <tr key={trf.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-xs text-slate-900 dark:text-white">
                          {trf.transferNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            {trf.transferType === 'ISSUE_TO_PRODUCTION' ? (
                              <span className="px-2.5 py-1 rounded-md text-xs font-extrabold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center gap-1">
                                <ArrowUpRight className="w-3.5 h-3.5" />
                                <span>Issue to Line</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-md text-xs font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                                <ArrowDownLeft className="w-3.5 h-3.5" />
                                <span>Receipt from Line</span>
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 font-semibold mt-1">
                            Line: {trf.lineId}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{trf.itemName}</div>
                          <div className="text-xs text-slate-400 font-mono">
                            Batch: {trf.batchNumber || 'N/A'} ({trf.itemCode})
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {trf.transferType === 'ISSUE_TO_PRODUCTION'
                            ? `${trf.rawMaterialIssuedQty} ${trf.unit}`
                            : `${trf.finishedGoodsReceivedQty} ${trf.unit}`}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400 font-semibold">
                          ₹{trf.unitValue.toLocaleString()} / {trf.unit}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                          ₹{trf.totalValue.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{trf.handlerName || 'Operator'}</div>
                          <div className="text-slate-400">{new Date(trf.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TASK DELEGATION */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-indigo-600" />
                    <span>Main Inventory Manager Task Delegation</span>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Main Inventory Manager delegates warehouse cycle counts and staging tasks to Assistant and Associate Managers.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold">
                    {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setTaskStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-lg transition-all ${
                          taskStatusFilter === st
                            ? 'bg-indigo-600 text-white shadow-sm font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl font-bold text-base bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Assign Inventory Task</span>
                  </button>
                </div>
              </div>

              {/* Task Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-4 hover:border-indigo-400/60 dark:hover:border-indigo-500/40 transition-all shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {t.taskCode}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase ${
                          t.priority === 'URGENT'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                            : t.priority === 'HIGH'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {t.title}
                      </h4>
                      {t.description && (
                        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 font-medium line-clamp-2">
                          {t.description}
                        </p>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Assigned To:</span>
                        <strong className="text-slate-800 dark:text-slate-200">{t.assigneeName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Delegated By:</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{t.assignerName}</span>
                      </div>
                      {t.dueDate && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Due Date:</span>
                          <span className="text-amber-600 dark:text-amber-400 font-bold">
                            {new Date(t.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span
                        className={`text-xs font-extrabold px-2.5 py-1 rounded-md uppercase ${
                          t.status === 'COMPLETED'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : t.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {t.status}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {t.status !== 'IN_PROGRESS' && t.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleUpdateTaskStatus(t.id, 'IN_PROGRESS')}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 hover:bg-blue-100"
                          >
                            Start
                          </button>
                        )}
                        {t.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleUpdateTaskStatus(t.id, 'COMPLETED')}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: OPERATIONS REPORTS (RM IN/USED, FG OUT) */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-indigo-600" />
                    <span>Daily &amp; Shift Inventory Operations Reports</span>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Reconciliation of Raw Materials Inward/Used, Finished Goods Dispatched Out, and Total Warehouse Valuations.
                  </p>
                </div>

                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl font-bold text-base bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Generate Inventory Report</span>
                </button>
              </div>

              {/* Reports List */}
              <div className="space-y-4">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {rep.reportNumber}
                        </span>
                        <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                          {rep.period}
                        </span>
                        <span className="text-sm text-slate-500">
                          Date: {new Date(rep.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="font-mono font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                        Total Stock Valuation: ₹{(rep.totalInventoryValue / 100000).toFixed(2)}L
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="text-xs font-bold uppercase text-slate-400 block">
                          1. Raw Materials Inward
                        </span>
                        <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                          {rep.rawMaterialsIn} MT / Units
                        </div>
                        <span className="text-xs text-slate-500">Supplier gate receipt</span>
                      </div>

                      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="text-xs font-bold uppercase text-slate-400 block">
                          2. Raw Materials Used (Lines)
                        </span>
                        <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                          {rep.rawMaterialsUsed} MT / Units
                        </div>
                        <span className="text-xs text-slate-500">Issued to shop floor lines</span>
                      </div>

                      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="text-xs font-bold uppercase text-slate-400 block">
                          3. Finished Goods Outward
                        </span>
                        <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                          {rep.finishedGoodsOut} Units
                        </div>
                        <span className="text-xs text-slate-500">Cleared for customer dispatch</span>
                      </div>
                    </div>

                    {rep.summary && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 italic bg-white/70 dark:bg-slate-900/70 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                        &quot;{rep.summary}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: INVENTORY LABOR & SALARY */}
        {activeTab === 'labor' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <span>Inventory Department Labor Attendance &amp; Wage Management</span>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Track warehouse supervisors, forklift operators, material handlers, attendance days, overtime hours, and monthly wage disbursements.
                  </p>
                </div>
              </div>

              {/* Labor Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                      <th className="py-3 px-4">Code / Worker</th>
                      <th className="py-3 px-4">Designation</th>
                      <th className="py-3 px-4">Shift</th>
                      <th className="py-3 px-4">Attendance</th>
                      <th className="py-3 px-4">Daily Wage</th>
                      <th className="py-3 px-4">Overtime (Hrs)</th>
                      <th className="py-3 px-4">Net Payable</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-base">
                    {labor.map((lab) => (
                      <tr key={lab.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{lab.workerName}</div>
                          <div className="text-xs text-slate-400 font-mono">{lab.laborCode}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                          {lab.designation}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          {lab.shift}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {lab.daysPresent} / {lab.totalDays} Days
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                          ₹{lab.dailyWage}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-purple-600 font-semibold">
                          +{lab.overtimeHours} hrs
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{lab.netPayable.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-extrabold uppercase ${
                              lab.paymentStatus === 'PAID'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                : lab.paymentStatus === 'PROCESSED'
                                ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            {lab.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => openLaborEditModal(lab)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                          >
                            Edit Wages
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
      </main>

      {/* MODAL 1: ASSIGN INVENTORY TASK */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ClipboardList className="w-6 h-6 text-indigo-600" />
                <span>Assign Inventory Protocol Task</span>
              </h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-base">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Task Title
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Physical Count Verification of Cold-Rolled Coils"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Task Description
                </label>
                <textarea
                  rows={3}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Specify location bays, safety gear, forklift requirement..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Assignee (Hierarchy)
                  </label>
                  <select
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-semibold"
                  >
                    <option value="usr-iasst-02">Deepak Verma (Assistant Manager - Raw Storage)</option>
                    <option value="usr-iassoc-03">Kavita Rao (Associate Manager - Finished Goods)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-semibold"
                  >
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent (Production Critical)</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Due Date
                </label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTER WAREHOUSE STORAGE */}
      {isStorageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Boxes className="w-6 h-6 text-indigo-600" />
                <span>Register Warehouse Storage Location</span>
              </h3>
              <button onClick={() => setIsStorageModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateStorage} className="space-y-4 text-base">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Storage Classification
                  </label>
                  <select
                    value={stgType}
                    onChange={(e) => setStgType(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-bold"
                  >
                    <option value="RAW_MATERIAL">Raw Material Storage</option>
                    <option value="FINISHED_GOODS">Finished Goods Storage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Storage Location / Bay
                  </label>
                  <input
                    type="text"
                    value={stgLocation}
                    onChange={(e) => setStgLocation(e.target.value)}
                    placeholder="e.g. Bay A-14, Silo 05"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Item SKU / Code
                  </label>
                  <input
                    type="text"
                    value={stgItemCode}
                    onChange={(e) => setStgItemCode(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={stgItemName}
                    onChange={(e) => setStgItemName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={stgQty}
                    onChange={(e) => setStgQty(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={stgUnit}
                    onChange={(e) => setStgUnit(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Unit Value (₹)
                  </label>
                  <input
                    type="number"
                    value={stgUnitValue}
                    onChange={(e) => setStgUnitValue(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-sm font-bold text-indigo-950 dark:text-indigo-200 flex justify-between">
                <span>Total Calculated Valuation:</span>
                <span className="font-mono text-base text-emerald-600 dark:text-emerald-400">
                  ₹{((parseFloat(stgQty) || 0) * (parseFloat(stgUnitValue) || 0)).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsStorageModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                >
                  Register Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PRODUCTION MATERIAL TRANSFER WITH UNIT VALUES */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-6 h-6 text-indigo-600" />
                <span>Record Production Material Transfer</span>
              </h3>
              <button onClick={() => setIsTransferModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateTransfer} className="space-y-4 text-base">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Transfer Direction
                  </label>
                  <select
                    value={trfType}
                    onChange={(e) => setTrfType(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-bold"
                  >
                    <option value="ISSUE_TO_PRODUCTION">Issue to Line (Raw Material)</option>
                    <option value="RECEIPT_FROM_PRODUCTION">Receipt from Line (Finished Good)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Production Line / Station
                  </label>
                  <input
                    type="text"
                    value={trfLine}
                    onChange={(e) => setTrfLine(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Item Code / SKU
                  </label>
                  <input
                    type="text"
                    value={trfItemCode}
                    onChange={(e) => setTrfItemCode(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={trfItemName}
                    onChange={(e) => setTrfItemName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Transfer Qty
                  </label>
                  <input
                    type="number"
                    value={trfQty}
                    onChange={(e) => setTrfQty(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={trfUnit}
                    onChange={(e) => setTrfUnit(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Unit Value (₹)
                  </label>
                  <input
                    type="number"
                    value={trfUnitValue}
                    onChange={(e) => setTrfUnitValue(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    value={trfBatch}
                    onChange={(e) => setTrfBatch(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Transfer Handler
                  </label>
                  <input
                    type="text"
                    value={trfHandler}
                    onChange={(e) => setTrfHandler(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-medium"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-sm font-bold text-indigo-950 dark:text-indigo-200 flex justify-between">
                <span>Total Financial Valuation:</span>
                <span className="font-mono text-base text-indigo-600 dark:text-indigo-400 font-extrabold">
                  ₹{((parseFloat(trfQty) || 0) * (parseFloat(trfUnitValue) || 0)).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                >
                  Commit Transfer Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: INVENTORY REPORT */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-6 h-6 text-indigo-600" />
                <span>Generate Inventory Operations Report</span>
              </h3>
              <button onClick={() => setIsReportModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4 text-base">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Reconciliation Period
                </label>
                <select
                  value={repPeriod}
                  onChange={(e) => setRepPeriod(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-bold"
                >
                  <option value="DAILY">Daily Reconciliation</option>
                  <option value="SHIFT_MORNING">Morning Shift</option>
                  <option value="SHIFT_AFTERNOON">Afternoon Shift</option>
                  <option value="SHIFT_NIGHT">Night Shift</option>
                  <option value="WEEKLY">Weekly Closing</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Raw Mat. In (MT)
                  </label>
                  <input
                    type="number"
                    value={repRmIn}
                    onChange={(e) => setRepRmIn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Raw Mat. Used (MT)
                  </label>
                  <input
                    type="number"
                    value={repRmUsed}
                    onChange={(e) => setRepRmUsed(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold text-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    FG Outward (Qty)
                  </label>
                  <input
                    type="number"
                    value={repFgOut}
                    onChange={(e) => setRepFgOut(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Summary / Warehouse Observations
                </label>
                <textarea
                  rows={2}
                  value={repSummary}
                  onChange={(e) => setRepSummary(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                >
                  Save Inventory Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: EDIT INVENTORY LABOR */}
      {isLaborModalOpen && selectedLabor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-indigo-600" />
                  <span>Edit Labor: {selectedLabor.workerName}</span>
                </h3>
                <p className="text-sm text-slate-500">{selectedLabor.laborCode} &bull; {selectedLabor.designation}</p>
              </div>
              <button onClick={() => setIsLaborModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateLabor} className="space-y-4 text-base">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Days Present (out of 26)
                  </label>
                  <input
                    type="number"
                    value={laborDaysPresent}
                    onChange={(e) => setLaborDaysPresent(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Overtime Hours
                  </label>
                  <input
                    type="number"
                    value={laborOvertime}
                    onChange={(e) => setLaborOvertime(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold text-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Daily Wage Rate (₹)
                  </label>
                  <input
                    type="number"
                    value={laborDailyWage}
                    onChange={(e) => setLaborDailyWage(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Payment Status
                  </label>
                  <select
                    value={laborPayStatus}
                    onChange={(e) => setLaborPayStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold"
                  >
                    <option value="PAID">PAID</option>
                    <option value="PROCESSED">PROCESSED</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Allowances (₹)
                  </label>
                  <input
                    type="number"
                    value={laborAllowances}
                    onChange={(e) => setLaborAllowances(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Deductions (₹)
                  </label>
                  <input
                    type="number"
                    value={laborDeductions}
                    onChange={(e) => setLaborDeductions(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono text-rose-600"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-sm font-bold text-indigo-950 dark:text-indigo-200 flex justify-between">
                <span>Calculated Net Payout:</span>
                <span className="font-mono text-base text-emerald-600 dark:text-emerald-400">
                  ₹{(
                    (parseInt(laborDaysPresent) || 0) * (parseFloat(laborDailyWage) || 0) +
                    (parseFloat(laborOvertime) || 0) * selectedLabor.overtimeRate +
                    (parseFloat(laborAllowances) || 0) -
                    (parseFloat(laborDeductions) || 0)
                  ).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLaborModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
