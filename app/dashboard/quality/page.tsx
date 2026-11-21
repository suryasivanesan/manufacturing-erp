'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  ShieldAlert,
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
  Download,
  UserCheck,
  Users,
  Calendar,
  AlertOctagon,
  CheckSquare,
  ClipboardList,
  Wrench,
  Flame,
  Landmark,
} from 'lucide-react';
import { UserPayload } from '../../../types/auth';

interface QualityTaskItem {
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

interface QualityCheckItem {
  id: string;
  checkNumber: string;
  type: 'RAW_MATERIAL' | 'FINISHED_PRODUCT';
  itemCode: string;
  itemName: string;
  batchNumber: string;
  lotSize: number;
  sampleSize: number;
  unit: string;
  status: 'PASS' | 'FAIL' | 'REWORK';
  defectCategory?: string | null;
  inspectionData: string;
  remarks?: string | null;
  inspectorName?: string;
  createdAt: string;
}

interface QualityReportItem {
  id: string;
  reportNumber: string;
  date: string;
  shift: string;
  rawMaterialsIn: number;
  rawMaterialsUsed: number;
  rawMaterialsRejected: number;
  finishedGoodsInspected: number;
  finishedGoodsOut: number;
  finishedGoodsRejected: number;
  reworkIn: number;
  reworkOut: number;
  summary?: string | null;
}

interface DepartmentLaborItem {
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
  paymentStatus: string; // PENDING, PAID, PROCESSED
}

export default function QualityDashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserPayload | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'tasks' | 'inspections' | 'reports' | 'labor'>('tasks');

  // Hierarchy role view simulation: Main Manager vs Assistant vs Associate
  const [activeQualityRole, setActiveQualityRole] = useState<'MAIN_MANAGER' | 'ASSISTANT' | 'ASSOCIATE'>('MAIN_MANAGER');

  // Loading & Feedback
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Data collections
  const [tasks, setTasks] = useState<QualityTaskItem[]>([]);
  const [checks, setChecks] = useState<QualityCheckItem[]>([]);
  const [reports, setReports] = useState<QualityReportItem[]>([]);
  const [labor, setLabor] = useState<DepartmentLaborItem[]>([]);

  // Filters
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>('ALL');
  const [checkTypeFilter, setCheckTypeFilter] = useState<'ALL' | 'RAW_MATERIAL' | 'FINISHED_PRODUCT'>('ALL');
  const [checkStatusFilter, setCheckStatusFilter] = useState<string>('ALL');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLaborModalOpen, setIsLaborModalOpen] = useState(false);
  const [selectedLabor, setSelectedLabor] = useState<DepartmentLaborItem | null>(null);

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState('HIGH');
  const [taskAssignee, setTaskAssignee] = useState('usr-qasst-02');
  const [taskDueDate, setTaskDueDate] = useState('');

  // Check form state
  const [checkType, setCheckType] = useState<'RAW_MATERIAL' | 'FINISHED_PRODUCT'>('RAW_MATERIAL');
  const [checkItemCode, setCheckItemCode] = useState('RAW-STL-001');
  const [checkItemName, setCheckItemName] = useState('Prime Steel Cold-Rolled Coils');
  const [checkBatch, setCheckBatch] = useState('LOT-2026-X81');
  const [checkLotSize, setCheckLotSize] = useState('50');
  const [checkSampleSize, setCheckSampleSize] = useState('5');
  const [checkUnit, setCheckUnit] = useState('MT');
  const [checkStatus, setCheckStatus] = useState<'PASS' | 'FAIL' | 'REWORK'>('PASS');
  const [checkDefect, setCheckDefect] = useState('NONE');
  const [checkRemarks, setCheckRemarks] = useState('Standard metallurgical tolerance confirmed.');
  const [param1Name, setParam1Name] = useState('Hardness / Tensile');
  const [param1Val, setParam1Val] = useState('345 MPa');
  const [param2Name, setParam2Name] = useState('Dimensional Thickness');
  const [param2Val, setParam2Val] = useState('2.50 mm');

  // Report form state
  const [reportShift, setReportShift] = useState('MORNING');
  const [repRmIn, setRepRmIn] = useState('120.0');
  const [repRmUsed, setRepRmUsed] = useState('115.0');
  const [repRmRej, setRepRmRej] = useState('5.0');
  const [repFgInspected, setRepFgInspected] = useState('750.0');
  const [repFgOut, setRepFgOut] = useState('730.0');
  const [repFgRej, setRepFgRej] = useState('20.0');
  const [repReworkIn, setRepReworkIn] = useState('25.0');
  const [repReworkOut, setRepReworkOut] = useState('22.0');
  const [repSummary, setRepSummary] = useState('Shift performance aligned with 97%+ quality targets.');

  // Labor edit state
  const [laborDaysPresent, setLaborDaysPresent] = useState('26');
  const [laborOvertime, setLaborOvertime] = useState('10');
  const [laborDailyWage, setLaborDailyWage] = useState('850');
  const [laborAllowances, setLaborAllowances] = useState('1500');
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

    loadQualityData();
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

  const loadQualityData = async () => {
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
        const res = await fetch(`${apiUrl}/quality/tasks`, { headers });
        if (res.ok) setTasks(await res.json());
        else fallbackTasks();
      } catch {
        fallbackTasks();
      }

      // 2. Checks
      try {
        const res = await fetch(`${apiUrl}/quality/checks`, { headers });
        if (res.ok) setChecks(await res.json());
        else fallbackChecks();
      } catch {
        fallbackChecks();
      }

      // 3. Reports
      try {
        const res = await fetch(`${apiUrl}/quality/reports`, { headers });
        if (res.ok) setReports(await res.json());
        else fallbackReports();
      } catch {
        fallbackReports();
      }

      // 4. Labor
      try {
        const res = await fetch(`${apiUrl}/quality/labor`, { headers });
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

  const fallbackChecks = () => {
    setChecks([]);
  };

  const fallbackReports = () => {
    setReports([]);
  };

  const fallbackLabor = () => {
    setLabor([]);
  };

  const fallbackAll = () => {
    setTasks([]);
    setChecks([]);
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
      const res = await fetch(`${apiUrl}/quality/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to create task on server');
      const created = await res.json();
      setTasks((prev) => [created, ...prev]);
    } catch {
      // Local fallback
      const newTask: QualityTaskItem = {
        id: `tsk-${Date.now()}`,
        taskCode: `TSK-QC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        title: taskTitle.trim(),
        description: taskDesc.trim(),
        priority: taskPriority,
        status: 'PENDING',
        dueDate: taskDueDate ? new Date(taskDueDate).toISOString() : null,
        assignerName: currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() + ' (Quality Manager)' : 'Lead Quality Manager',
        assigneeId: taskAssignee,
        assigneeName: taskAssignee.includes('asst')
          ? 'Priya Nair (Assistant Manager)'
          : 'Anand Patel (Associate Manager)',
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
    }

    setFeedbackSuccess(`Task "${taskTitle}" assigned successfully to ${taskAssignee.includes('asst') ? 'Assistant Manager' : 'Associate Manager'}.`);
    setIsTaskModalOpen(false);
    setTaskTitle('');
    setTaskDesc('');
  };

  const handleUpdateTaskStatus = async (taskId: string, nextStatus: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await fetch(`${apiUrl}/quality/tasks/${taskId}/status`, {
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
  // ACTIONS: QUALITY CHECKS (RAW MATERIALS & FINISHED PRODUCTS)
  // =========================================================================

  const handleCreateCheck = async (e: React.FormEvent) => {
    e.preventDefault();

    const inspectionDataObj: Record<string, string> = {
      [param1Name]: param1Val,
      [param2Name]: param2Val,
    };

    const payload = {
      type: checkType,
      itemCode: checkItemCode,
      itemName: checkItemName,
      batchNumber: checkBatch,
      lotSize: parseFloat(checkLotSize) || 1,
      sampleSize: parseFloat(checkSampleSize) || 1,
      unit: checkUnit,
      status: checkStatus,
      defectCategory: checkDefect,
      inspectionData: inspectionDataObj,
      remarks: checkRemarks,
    };

    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/quality/checks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to record check');
      const created = await res.json();
      setChecks((prev) => [created, ...prev]);
    } catch {
      const newCheck: QualityCheckItem = {
        id: `chk-${Date.now()}`,
        checkNumber: `QC-CHK-${checkType === 'RAW_MATERIAL' ? 'RM' : 'FP'}-${Math.floor(100 + Math.random() * 900)}`,
        type: checkType,
        itemCode: checkItemCode,
        itemName: checkItemName,
        batchNumber: checkBatch,
        lotSize: parseFloat(checkLotSize) || 1,
        sampleSize: parseFloat(checkSampleSize) || 1,
        unit: checkUnit,
        status: checkStatus,
        defectCategory: checkDefect,
        inspectionData: JSON.stringify(inspectionDataObj),
        remarks: checkRemarks,
        inspectorName: activeQualityRole === 'MAIN_MANAGER' ? 'Dr. Ramesh Sharma (Main Manager)' : activeQualityRole === 'ASSISTANT' ? 'Priya Nair (Assistant Manager)' : 'Anand Patel (Associate Manager)',
        createdAt: new Date().toISOString(),
      };
      setChecks((prev) => [newCheck, ...prev]);
    }

    setFeedbackSuccess(`Quality inspection recorded for ${checkItemName} with outcome ${checkStatus}.`);
    setIsCheckModalOpen(false);
  };

  // =========================================================================
  // ACTIONS: OPERATIONS REPORTS (RM IN/USED, FG OUT, REWORK)
  // =========================================================================

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      shift: reportShift,
      rawMaterialsIn: parseFloat(repRmIn) || 0,
      rawMaterialsUsed: parseFloat(repRmUsed) || 0,
      rawMaterialsRejected: parseFloat(repRmRej) || 0,
      finishedGoodsInspected: parseFloat(repFgInspected) || 0,
      finishedGoodsOut: parseFloat(repFgOut) || 0,
      finishedGoodsRejected: parseFloat(repFgRej) || 0,
      reworkIn: parseFloat(repReworkIn) || 0,
      reworkOut: parseFloat(repReworkOut) || 0,
      summary: repSummary,
    };

    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/quality/reports`, {
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
      const newReport: QualityReportItem = {
        id: `qcr-${Date.now()}`,
        reportNumber: `QCR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
        date: new Date().toISOString(),
        shift: reportShift,
        rawMaterialsIn: parseFloat(repRmIn) || 0,
        rawMaterialsUsed: parseFloat(repRmUsed) || 0,
        rawMaterialsRejected: parseFloat(repRmRej) || 0,
        finishedGoodsInspected: parseFloat(repFgInspected) || 0,
        finishedGoodsOut: parseFloat(repFgOut) || 0,
        finishedGoodsRejected: parseFloat(repFgRej) || 0,
        reworkIn: parseFloat(repReworkIn) || 0,
        reworkOut: parseFloat(repReworkOut) || 0,
        summary: repSummary,
      };
      setReports((prev) => [newReport, ...prev]);
    }

    setFeedbackSuccess(`Operations report for ${reportShift} shift generated successfully.`);
    setIsReportModalOpen(false);
  };

  // =========================================================================
  // ACTIONS: LABOR ATTENDANCE & SALARY UPDATE
  // =========================================================================

  const openLaborEditModal = (lab: DepartmentLaborItem) => {
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
      await fetch(`${apiUrl}/quality/labor/${selectedLabor.id}/salary`, {
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
      await fetch(`${apiUrl}/quality/labor/${selectedLabor.id}/attendance`, {
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

  const handleExportQualityExcel = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(
      now.getHours(),
    )}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
    const fileName = `Quality_Department_Audit_${timeStamp}.xlsx`;

    const lines: string[] = [];
    lines.push(`MANUFACTURING ERP - QUALITY DEPARTMENT ENTERPRISE AUDIT`);
    lines.push(`Exported At,${now.toISOString()}`);
    lines.push(`Exported By,"${currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : 'Quality Manager'}" (${activeQualityRole})`);
    lines.push(`Audit File Stamp,${fileName}`);
    lines.push(``);

    // Section 1: Quality Checks
    lines.push(`=== 1. QUALITY INSPECTION AUDIT LOGS (RAW MATERIAL & FINISHED GOODS) ===`);
    lines.push(
      [
        'Check ID',
        'Type',
        'Item Code',
        'Item Name',
        'Batch Number',
        'Lot Size',
        'Sample Size',
        'Unit',
        'Outcome',
        'Defect Category',
        'Inspector',
        'Remarks',
        'Inspection Timestamp',
      ].join(','),
    );
    checks.forEach((c) => {
      lines.push(
        [
          c.checkNumber,
          c.type,
          c.itemCode,
          `"${c.itemName}"`,
          c.batchNumber,
          c.lotSize,
          c.sampleSize,
          c.unit,
          c.status,
          c.defectCategory || 'NONE',
          `"${c.inspectorName || 'Inspector'}"`,
          `"${(c.remarks || '').replace(/"/g, '""')}"`,
          c.createdAt,
        ].join(','),
      );
    });

    lines.push(``);

    // Section 2: Operations Reports
    lines.push(`=== 2. OPERATIONS REPORTS (RM IN/USED - FG OUT - REWORK IN/OUT) ===`);
    lines.push(
      [
        'Report Code',
        'Date',
        'Shift',
        'RM Inward (MT/kg)',
        'RM Used (MT/kg)',
        'RM Rejection',
        'FG Inspected',
        'FG Cleared Out',
        'FG Rejected',
        'Rework In',
        'Rework Out',
        'Shift Summary',
      ].join(','),
    );
    reports.forEach((r) => {
      lines.push(
        [
          r.reportNumber,
          new Date(r.date).toISOString().slice(0, 10),
          r.shift,
          r.rawMaterialsIn,
          r.rawMaterialsUsed,
          r.rawMaterialsRejected,
          r.finishedGoodsInspected,
          r.finishedGoodsOut,
          r.finishedGoodsRejected,
          r.reworkIn,
          r.reworkOut,
          `"${(r.summary || '').replace(/"/g, '""')}"`,
        ].join(','),
      );
    });

    lines.push(``);

    // Section 3: Department Labor Register
    lines.push(`=== 3. QUALITY LABOR ATTENDANCE & SALARY REGISTER ===`);
    lines.push(
      [
        'Labor Code',
        'Worker Name',
        'Designation',
        'Shift',
        'Month',
        'Daily Wage (INR)',
        'Days Present',
        'Total Days',
        'Overtime (Hrs)',
        'Allowances (INR)',
        'Deductions (INR)',
        'Net Payable (INR)',
        'Payment Status',
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

    setFeedbackSuccess(`Exported date-time stamped spreadsheet: "${fileName}".`);
  };

  // Filtered lists
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => taskStatusFilter === 'ALL' || t.status === taskStatusFilter);
  }, [tasks, taskStatusFilter]);

  const filteredChecks = useMemo(() => {
    return checks.filter((c) => {
      const matchType = checkTypeFilter === 'ALL' || c.type === checkTypeFilter;
      const matchStatus = checkStatusFilter === 'ALL' || c.status === checkStatusFilter;
      return matchType && matchStatus;
    });
  }, [checks, checkTypeFilter, checkStatusFilter]);

  // Overall statistics
  const stats = useMemo(() => {
    const totalChecks = checks.length;
    const passedChecks = checks.filter((c) => c.status === 'PASS').length;
    const passRate = totalChecks > 0 ? ((passedChecks / totalChecks) * 100).toFixed(1) : '0.0';
    const pendingTasksCount = tasks.filter((t) => t.status !== 'COMPLETED').length;
    const activeLaborCount = labor.length;
    return { passRate, totalChecks, pendingTasksCount, activeLaborCount };
  }, [checks, tasks, labor]);

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
              <div className="w-12 h-12 rounded-2xl bg-cyan-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                    Quality Assurance &amp; Control Department
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-100 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 whitespace-nowrap shrink-0">
                    QA / QC CORE
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Hierarchical Delegation &bull; Dual Inspections &bull; Shift Reports &bull; Labor &amp; Wages
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Hierarchical Role Switcher Indicator */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
              <button
                onClick={() => setActiveQualityRole('MAIN_MANAGER')}
                className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeQualityRole === 'MAIN_MANAGER'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Main Manager
              </button>
              <button
                onClick={() => setActiveQualityRole('ASSISTANT')}
                className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeQualityRole === 'ASSISTANT'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Assistant
              </button>
              <button
                onClick={() => setActiveQualityRole('ASSOCIATE')}
                className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeQualityRole === 'ASSOCIATE'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Associate
              </button>
            </div>

            {/* Date-Time Stamped Excel Export Button */}
            <button
              onClick={handleExportQualityExcel}
              className="px-4 py-2.5 rounded-xl text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
              title="Download Excel spreadsheet with precise date-time stamps"
            >
              <Download className="w-5 h-5 shrink-0" />
              <span>Export Audit (.xlsx)</span>
            </button>

            {/* Quick Cross-Department Navigation */}
            <Link
              href="/dashboard/inventory"
              className="hidden lg:flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-base font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 transition-all whitespace-nowrap shrink-0"
              title="Navigate to Inventory Department"
            >
              <Package className="w-5 h-5 shrink-0" />
              <span>Inventory</span>
            </Link>

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
        <div className="rounded-2xl p-5 bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-50 dark:from-cyan-950/40 dark:via-sky-950/30 dark:to-blue-950/20 border-2 border-cyan-200 dark:border-cyan-900/60 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h3 className="text-lg font-bold text-cyan-950 dark:text-cyan-200 flex items-center gap-2">
                <span>Department Hierarchy: Quality Governance</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-200 dark:bg-cyan-800 text-cyan-900 dark:text-cyan-100 font-extrabold uppercase">
                  Active Mode: {activeQualityRole}
                </span>
              </h3>
              <span className="text-sm font-semibold text-cyan-800 dark:text-cyan-300">
                Main Manager: <strong>{currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : 'Lead Quality Manager'}</strong> &bull; Assistant: <strong>Priya Nair</strong> &bull; Associate: <strong>Anand Patel</strong>
              </span>
            </div>
            <p className="mt-1.5 text-base text-cyan-900/90 dark:text-cyan-300/90 leading-relaxed font-medium">
              The Main Quality Manager assigns critical verification protocols down to the Assistant and Associate Managers.
              Raw materials and finished products are independently audited with multi-parameter data logs, operations reports, and departmental labor attendance.
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
                First-Pass Yield
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {stats.passRate}%
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <span>Across RM &amp; Finished Goods</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Dual Checks Completed
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {stats.totalChecks} Lots
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <span>Raw Materials &amp; Finished Products</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Pending Manager Tasks
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                {stats.pendingTasksCount}
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <span>Delegated to Assistant / Associate</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Quality Labor On-Shift
              </span>
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {stats.activeLaborCount} Inspectors
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <span>Attendance &amp; wage register active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-5 py-3 rounded-xl font-bold text-base transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0 ${
              activeTab === 'tasks'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ClipboardList className="w-5 h-5 shrink-0" />
            <span>Task Management &amp; Delegation</span>
          </button>

          <button
            onClick={() => setActiveTab('inspections')}
            className={`px-5 py-3 rounded-xl font-bold text-base transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0 ${
              activeTab === 'inspections'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>Dual Quality Inspections (RM &amp; FP)</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-5 py-3 rounded-xl font-bold text-base transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0 ${
              activeTab === 'reports'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Activity className="w-5 h-5 shrink-0" />
            <span>Operations Reports (In/Used/Out/Rework)</span>
          </button>

          <button
            onClick={() => setActiveTab('labor')}
            className={`px-5 py-3 rounded-xl font-bold text-base transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0 ${
              activeTab === 'labor'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-5 h-5 shrink-0" />
            <span>Department Labor &amp; Wages</span>
          </button>
        </div>

        {/* TAB 1: TASK MANAGEMENT & HIERARCHY */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-cyan-600" />
                    <span>Main Manager Task Delegation &amp; Tracking</span>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Main Quality Manager assigns targeted QA protocols to Assistant (Priya Nair) and Associate (Anand Patel) Managers.
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
                            ? 'bg-cyan-600 text-white shadow-sm font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl font-bold text-base bg-cyan-600 hover:bg-cyan-700 text-white shadow-md shadow-cyan-600/20 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Assign New Task</span>
                  </button>
                </div>
              </div>

              {/* Task Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-4 hover:border-cyan-400/60 dark:hover:border-cyan-500/40 transition-all shadow-sm"
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

        {/* TAB 2: DUAL QUALITY INSPECTIONS (RAW MATERIALS & FINISHED PRODUCTS) */}
        {activeTab === 'inspections' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-cyan-600" />
                    <span>Dual Quality Check Logs (Raw Materials &amp; Finished Goods)</span>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Capture laboratory test parameters, mechanical stress tests, and defect categorization.
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Type Filter */}
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold">
                    <button
                      onClick={() => setCheckTypeFilter('ALL')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        checkTypeFilter === 'ALL'
                          ? 'bg-cyan-600 text-white font-bold'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      All Types
                    </button>
                    <button
                      onClick={() => setCheckTypeFilter('RAW_MATERIAL')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        checkTypeFilter === 'RAW_MATERIAL'
                          ? 'bg-cyan-600 text-white font-bold'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Raw Materials
                    </button>
                    <button
                      onClick={() => setCheckTypeFilter('FINISHED_PRODUCT')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        checkTypeFilter === 'FINISHED_PRODUCT'
                          ? 'bg-cyan-600 text-white font-bold'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Finished Products
                    </button>
                  </div>

                  {/* Outcome Filter */}
                  <select
                    value={checkStatusFilter}
                    onChange={(e) => setCheckStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                  >
                    <option value="ALL">All Outcomes</option>
                    <option value="PASS">PASS</option>
                    <option value="FAIL">FAIL</option>
                    <option value="REWORK">REWORK</option>
                  </select>

                  <button
                    onClick={() => setIsCheckModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl font-bold text-base bg-cyan-600 hover:bg-cyan-700 text-white shadow-md shadow-cyan-600/20 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Log Quality Inspection</span>
                  </button>
                </div>
              </div>

              {/* Table of Checks */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                      <th className="py-3 px-4">Check ID</th>
                      <th className="py-3 px-4">Inspection Type</th>
                      <th className="py-3 px-4">Item &amp; Batch</th>
                      <th className="py-3 px-4">Lot / Sample</th>
                      <th className="py-3 px-4">Outcome</th>
                      <th className="py-3 px-4">Test Parameters / Data</th>
                      <th className="py-3 px-4">Inspector</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-base">
                    {filteredChecks.map((chk) => {
                      let parsedParams: any = {};
                      try {
                        parsedParams = JSON.parse(chk.inspectionData);
                      } catch {
                        parsedParams = chk.inspectionData;
                      }

                      return (
                        <tr key={chk.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-xs text-slate-900 dark:text-white">
                            {chk.checkNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-md text-xs font-extrabold uppercase ${
                                chk.type === 'RAW_MATERIAL'
                                  ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                                  : 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300'
                              }`}
                            >
                              {chk.type === 'RAW_MATERIAL' ? 'Raw Material' : 'Finished Goods'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 dark:text-white">{chk.itemName}</div>
                            <div className="text-xs text-slate-400 font-mono">
                              Batch: {chk.batchNumber} ({chk.itemCode})
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                            {chk.sampleSize} / {chk.lotSize} {chk.unit}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 w-fit ${
                                chk.status === 'PASS'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                  : chk.status === 'FAIL'
                                  ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                                  : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                              }`}
                            >
                              {chk.status === 'PASS' && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {chk.status === 'FAIL' && <XCircle className="w-3.5 h-3.5" />}
                              {chk.status === 'REWORK' && <RefreshCw className="w-3.5 h-3.5" />}
                              <span>{chk.status}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-xs font-mono space-y-0.5 text-slate-600 dark:text-slate-400 max-w-xs">
                              {typeof parsedParams === 'object' && parsedParams !== null ? (
                                Object.entries(parsedParams).map(([k, v]) => (
                                  <div key={k} className="truncate">
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{k}:</span>{' '}
                                    {String(v)}
                                  </div>
                                ))
                              ) : (
                                <span>{String(parsedParams)}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                            {chk.inspectorName || 'Inspector'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OPERATIONS REPORTS (RM IN/USED, FG OUT, REWORK IN/OUT) */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-600" />
                    <span>Daily &amp; Shift Quality Operations Reports</span>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Balance sheet of Raw Materials Inward/Used, Finished Goods Cleared/Rejected, and Rework In/Out flows.
                  </p>
                </div>

                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl font-bold text-base bg-cyan-600 hover:bg-cyan-700 text-white shadow-md shadow-cyan-600/20 transition-all flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Generate Shift Report</span>
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
                        <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {rep.shift} SHIFT
                        </span>
                        <span className="text-sm text-slate-500">
                          Date: {new Date(rep.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Operational Flow Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Flow 1: Raw Materials In vs Used */}
                      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                          <span>1. Raw Materials Flow</span>
                          <Package className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div className="text-base font-bold text-slate-900 dark:text-white">
                          Inward: {rep.rawMaterialsIn} MT &bull; Cleared: {rep.rawMaterialsUsed} MT
                        </div>
                        <div className="text-xs text-rose-600 font-semibold">
                          Inward Rejections: {rep.rawMaterialsRejected} MT
                        </div>
                      </div>

                      {/* Flow 2: Finished Goods Inspected vs Cleared */}
                      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                          <span>2. Finished Goods Clearance</span>
                          <Layers className="w-4 h-4 text-cyan-500" />
                        </div>
                        <div className="text-base font-bold text-slate-900 dark:text-white">
                          Inspected: {rep.finishedGoodsInspected} &bull; Cleared Out: {rep.finishedGoodsOut}
                        </div>
                        <div className="text-xs text-rose-600 font-semibold">
                          Defective/Scrapped: {rep.finishedGoodsRejected} Units
                        </div>
                      </div>

                      {/* Flow 3: Rework In vs Out */}
                      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                          <span>3. Rework Loop</span>
                          <RefreshCw className="w-4 h-4 text-amber-500" />
                        </div>
                        <div className="text-base font-bold text-slate-900 dark:text-white">
                          Rework Received: {rep.reworkIn} &bull; Cleared Out: {rep.reworkOut}
                        </div>
                        <div className="text-xs text-emerald-600 font-semibold">
                          Rework Clearance Rate: {((rep.reworkOut / (rep.reworkIn || 1)) * 100).toFixed(0)}%
                        </div>
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

        {/* TAB 4: DEPARTMENT LABOR & SALARY */}
        {activeTab === 'labor' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-600" />
                    <span>Quality Department Labor Attendance &amp; Wage Management</span>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Track quality inspectors, lab technicians, attendance days, overtime hours, and monthly wage disbursements.
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

      {/* MODAL 1: ASSIGN NEW TASK */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ClipboardList className="w-6 h-6 text-cyan-600" />
                <span>Assign Quality Protocol Task</span>
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
                  placeholder="e.g. Inward Slitting Coil Tensile Elongation Audit"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Detailed Protocol Description
                </label>
                <textarea
                  rows={3}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Specify sampling standard, instrument calibration code, tolerance limits..."
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
                    <option value="usr-qasst-02">Priya Nair (Assistant Manager - Inward/Raw QA)</option>
                    <option value="usr-qassoc-03">Anand Patel (Associate Manager - Finished Goods QA)</option>
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
                    <option value="URGENT">Urgent (Line Blocking)</option>
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
                  className="px-5 py-2.5 rounded-xl font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-700 text-white shadow-md shadow-cyan-600/20"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: LOG QUALITY INSPECTION (DUAL) */}
      {isCheckModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-cyan-600" />
                <span>Log Dual Quality Inspection</span>
              </h3>
              <button onClick={() => setIsCheckModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateCheck} className="space-y-4 text-base">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Inspection Target
                  </label>
                  <select
                    value={checkType}
                    onChange={(e) => setCheckType(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-bold"
                  >
                    <option value="RAW_MATERIAL">Raw Material (Inward Gate / Storage)</option>
                    <option value="FINISHED_PRODUCT">Finished Product (Post-Line / Dispatch)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Outcome Status
                  </label>
                  <select
                    value={checkStatus}
                    onChange={(e) => setCheckStatus(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-extrabold text-slate-900 dark:text-white"
                  >
                    <option value="PASS">PASS (Green Flag)</option>
                    <option value="FAIL">FAIL (Block &amp; Scrap)</option>
                    <option value="REWORK">REWORK (Send to Correction Station)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={checkItemName}
                    onChange={(e) => setCheckItemName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Batch Number / Lot
                  </label>
                  <input
                    type="text"
                    value={checkBatch}
                    onChange={(e) => setCheckBatch(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Lot Size
                  </label>
                  <input
                    type="number"
                    value={checkLotSize}
                    onChange={(e) => setCheckLotSize(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Sample Size
                  </label>
                  <input
                    type="number"
                    value={checkSampleSize}
                    onChange={(e) => setCheckSampleSize(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={checkUnit}
                    onChange={(e) => setCheckUnit(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-bold"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase text-slate-400 block">
                  Measured Lab Parameters &amp; Tolerances
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      value={param1Name}
                      onChange={(e) => setParam1Name(e.target.value)}
                      placeholder="Parameter 1 Name"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={param1Val}
                      onChange={(e) => setParam1Val(e.target.value)}
                      placeholder="Value / Reading"
                      className="w-full mt-1.5 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={param2Name}
                      onChange={(e) => setParam2Name(e.target.value)}
                      placeholder="Parameter 2 Name"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={param2Val}
                      onChange={(e) => setParam2Val(e.target.value)}
                      placeholder="Value / Reading"
                      className="w-full mt-1.5 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Inspector Remarks
                </label>
                <textarea
                  rows={2}
                  value={checkRemarks}
                  onChange={(e) => setCheckRemarks(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCheckModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-700 text-white shadow-md shadow-cyan-600/20"
                >
                  Record Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: OPERATIONS REPORT */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-cyan-600" />
                <span>Generate Shift Quality Operations Report</span>
              </h3>
              <button onClick={() => setIsReportModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4 text-base">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Operating Shift
                </label>
                <select
                  value={reportShift}
                  onChange={(e) => setReportShift(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-bold"
                >
                  <option value="MORNING">Morning Shift (06:00 - 14:00)</option>
                  <option value="AFTERNOON">Afternoon Shift (14:00 - 22:00)</option>
                  <option value="NIGHT">Night Shift (22:00 - 06:00)</option>
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
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Raw Mat. Rej (MT)
                  </label>
                  <input
                    type="number"
                    value={repRmRej}
                    onChange={(e) => setRepRmRej(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-mono text-rose-600 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    FG Inspected (Qty)
                  </label>
                  <input
                    type="number"
                    value={repFgInspected}
                    onChange={(e) => setRepFgInspected(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    FG Cleared Out (Qty)
                  </label>
                  <input
                    type="number"
                    value={repFgOut}
                    onChange={(e) => setRepFgOut(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-mono text-emerald-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    FG Rejected (Qty)
                  </label>
                  <input
                    type="number"
                    value={repFgRej}
                    onChange={(e) => setRepFgRej(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-mono text-rose-600 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Rework Inward (Qty)
                  </label>
                  <input
                    type="number"
                    value={repReworkIn}
                    onChange={(e) => setRepReworkIn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold text-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Rework Cleared Out (Qty)
                  </label>
                  <input
                    type="number"
                    value={repReworkOut}
                    onChange={(e) => setRepReworkOut(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Shift Operations Summary
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
                  className="px-6 py-2.5 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-700 text-white shadow-md shadow-cyan-600/20"
                >
                  Save Shift Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT LABOR ATTENDANCE & SALARY */}
      {isLaborModalOpen && selectedLabor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-cyan-600" />
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

              <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-sm font-bold text-cyan-950 dark:text-cyan-200 flex justify-between">
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
                  className="px-6 py-2.5 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-700 text-white shadow-md shadow-cyan-600/20"
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
