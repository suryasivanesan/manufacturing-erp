'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Landmark,
  Building2,
  PieChart,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Download,
  Plus,
  RefreshCw,
  Users,
  ShieldCheck,
  ShieldAlert,
  Sun,
  Moon,
  ArrowLeft,
  ArrowRight,
  Sliders,
  Send,
  X,
  Wallet,
  Percent,
  Receipt,
  Calendar,
  Layers,
  Award,
  ChevronRight,
  Info,
} from 'lucide-react';
import { UserPayload } from '../../../types/auth';

interface FinanceTaskItem {
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

interface FinancialMetricItem {
  id: string;
  metricCode: string;
  period: string;
  fiscalMonth: string;
  productionVolume: number;
  salesVolume: number;
  revenue: number;
  rawMaterialCost: number;
  laborCost: number;
  expenses: number;
  ebitda: number;
  taxExpense: number;
  profitLoss: number;
  marginPercentage: number;
  notes?: string | null;
}

interface PayrollRequestItem {
  id: string;
  requestNumber: string;
  month: string;
  department: string;
  totalEmployees: number;
  totalGrossSalary: number;
  totalDeductions: number;
  calculatedSalaries: number;
  calculatedDetails?: any;
  status: string; // PENDING, APPROVED, REJECTED
  approvedBySuperAdmin: boolean;
  approvedByName?: string | null;
  approvedAt?: string | null;
  rejectionReason?: string | null;
  remarks?: string | null;
  fundDisbursed: boolean;
  disbursedAt?: string | null;
}

interface CashBankLedgerItem {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: string; // BANK, CASH, ESCROW
  bankName?: string | null;
  accountNumber?: string | null;
  ifscCode?: string | null;
  branchName?: string | null;
  currency: string;
  bankBalance: number;
  handCash: number;
  closingBalance: number;
  status: string;
  lastReconciledAt?: string | null;
}

interface TaxRecordItem {
  id: string;
  recordNumber: string;
  taxType: string; // GST, CORPORATE_TAX, TDS, ADVANCE_TAX, CUSTOMS_DUTY
  fiscalPeriod: string;
  taxableAmount: number;
  taxRatePercentage: number;
  taxAmount: number;
  taxDetails?: any;
  dueDate?: string | null;
  paymentStatus: string; // PENDING, PAID, OVERDUE
  approvalStatus: string; // PENDING, APPROVED, REJECTED
  approvedBySuperAdmin: boolean;
  approvedByName?: string | null;
  approvedAt?: string | null;
  paidAt?: string | null;
  challanReference?: string | null;
  notes?: string | null;
}

export default function FinanceDashboardPage() {
  const router = useRouter();

  // Authentication Context
  const [currentUser, setCurrentUser] = useState<UserPayload | null>(null);
  const [isSuperAdminSimulator, setIsSuperAdminSimulator] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'profit_loss' | 'payroll' | 'ledger' | 'tax' | 'tasks'>('profit_loss');
  const [activeFinanceRole, setActiveFinanceRole] = useState<'MAIN_MANAGER' | 'ASSISTANT' | 'ASSOCIATE'>('MAIN_MANAGER');

  // Data Collections
  const [tasks, setTasks] = useState<FinanceTaskItem[]>([]);
  const [metrics, setMetrics] = useState<FinancialMetricItem[]>([]);
  const [payrollRequests, setPayrollRequests] = useState<PayrollRequestItem[]>([]);
  const [ledgers, setLedgers] = useState<CashBankLedgerItem[]>([]);
  const [taxes, setTaxes] = useState<TaxRecordItem[]>([]);

  // Feedback notifications
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Modals
  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [isPayTaxModalOpen, setIsPayTaxModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Selected entities for action modals
  const [selectedLedger, setSelectedLedger] = useState<CashBankLedgerItem | null>(null);
  const [selectedTax, setSelectedTax] = useState<TaxRecordItem | null>(null);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRequestItem | null>(null);

  // Form States - Metric
  const [metricMonth, setMetricMonth] = useState('2026-11');
  const [metricProductionVol, setMetricProductionVol] = useState('14250');
  const [metricSalesVol, setMetricSalesVol] = useState('13800');
  const [metricRevenue, setMetricRevenue] = useState('18450000');
  const [metricRawCost, setMetricRawCost] = useState('10230000');
  const [metricLaborCost, setMetricLaborCost] = useState('2150000');
  const [metricExpenses, setMetricExpenses] = useState('1680000');
  const [metricTaxExpense, setMetricTaxExpense] = useState('790000');
  const [metricNotes, setMetricNotes] = useState('');

  // Form States - Payroll
  const [payrollMonth, setPayrollMonth] = useState('2026-11');
  const [payrollDept, setPayrollDept] = useState('ALL');
  const [payrollEmployees, setPayrollEmployees] = useState('142');
  const [payrollGross, setPayrollGross] = useState('3850000');
  const [payrollDeductions, setPayrollDeductions] = useState('280000');
  const [payrollCalculatedNet, setPayrollCalculatedNet] = useState('3570000');
  const [payrollRemarks, setPayrollRemarks] = useState('');

  // Form States - Ledger Account
  const [ledgerName, setLedgerName] = useState('');
  const [ledgerType, setLedgerType] = useState('BANK');
  const [ledgerBankName, setLedgerBankName] = useState('');
  const [ledgerAccNumber, setLedgerAccNumber] = useState('');
  const [ledgerIfsc, setLedgerIfsc] = useState('');
  const [ledgerInitialBalance, setLedgerInitialBalance] = useState('');

  // Form States - Transaction
  const [txnType, setTxnType] = useState('DEPOSIT');
  const [txnTarget, setTxnTarget] = useState('BANK');
  const [txnAmount, setTxnAmount] = useState('');
  const [txnReference, setTxnReference] = useState('');

  // Form States - Tax
  const [taxType, setTaxType] = useState('GST');
  const [taxPeriod, setTaxPeriod] = useState('2026-11');
  const [taxableTurnover, setTaxableTurnover] = useState('');
  const [taxRate, setTaxRate] = useState('18');
  const [taxAmount, setTaxAmount] = useState('');
  const [taxNotes, setTaxNotes] = useState('');

  // Form States - Pay Tax
  const [payChallanRef, setPayChallanRef] = useState('');
  const [payAccountCode, setPayAccountCode] = useState('LEDGER-HDFC-01');

  // Form States - Task Delegation
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('MEDIUM');
  const [taskAssignee, setTaskAssignee] = useState('usr-fin-ast-01');
  const [taskDueDate, setTaskDueDate] = useState('');

  // Load Auth User
  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        const u = JSON.parse(raw);
        setCurrentUser(u);
        if (u.role === 'SUPER_ADMIN') {
          setIsSuperAdminSimulator(true);
        }
      } catch (e) {
        console.error('Failed to parse current user', e);
      }
    }
  }, []);

  // Fetch or Seed Initial Data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const showNotice = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const [resM, resP, resL, resT, resK] = await Promise.allSettled([
        fetch(`${apiUrl}/finance/metrics`, { headers }).then((r) => r.ok ? r.json() : []),
        fetch(`${apiUrl}/finance/payroll`, { headers }).then((r) => r.ok ? r.json() : []),
        fetch(`${apiUrl}/finance/ledgers`, { headers }).then((r) => r.ok ? r.json() : []),
        fetch(`${apiUrl}/finance/taxes`, { headers }).then((r) => r.ok ? r.json() : []),
        fetch(`${apiUrl}/finance/tasks`, { headers }).then((r) => r.ok ? r.json() : []),
      ]);

      setMetrics(resM.status === 'fulfilled' && Array.isArray(resM.value) ? resM.value : []);
      setPayrollRequests(resP.status === 'fulfilled' && Array.isArray(resP.value) ? resP.value : []);
      setLedgers(resL.status === 'fulfilled' && Array.isArray(resL.value) ? resL.value : []);
      setTaxes(resT.status === 'fulfilled' && Array.isArray(resT.value) ? resT.value : []);
      setTasks(resK.status === 'fulfilled' && Array.isArray(resK.value) ? resK.value : []);
    } catch {
      setMetrics([]);
      setPayrollRequests([]);
      setLedgers([]);
      setTaxes([]);
      setTasks([]);
    }
  };

  // Top Aggregates
  const topMetrics = useMemo(() => {
    const activeStatement = metrics[0] || {
      profitLoss: 0,
      marginPercentage: 0,
      revenue: 0,
      rawMaterialCost: 0,
    };

    const totalLiquidity = ledgers.reduce((acc, l) => acc + (l.bankBalance + l.handCash), 0);
    const pendingPayroll = payrollRequests
      .filter((p) => p.status === 'PENDING')
      .reduce((acc, p) => acc + p.calculatedSalaries, 0);
    const pendingTaxes = taxes
      .filter((t) => t.paymentStatus === 'PENDING')
      .reduce((acc, t) => acc + t.taxAmount, 0);

    return {
      netProfit: activeStatement.profitLoss,
      margin: activeStatement.marginPercentage,
      revenue: activeStatement.revenue,
      rawMaterialCost: activeStatement.rawMaterialCost,
      totalLiquidity,
      pendingPayroll,
      pendingTaxes,
    };
  }, [metrics, ledgers, payrollRequests, taxes]);

  // Handlers - Financial Metric Form
  const handleCreateMetric = (e: React.FormEvent) => {
    e.preventDefault();
    const rev = parseFloat(metricRevenue) || 0;
    const rawCost = parseFloat(metricRawCost) || 0;
    const labCost = parseFloat(metricLaborCost) || 0;
    const exp = parseFloat(metricExpenses) || 0;
    const taxExp = parseFloat(metricTaxExpense) || 0;

    const ebitda = rev - (rawCost + labCost + exp);
    const profitLoss = ebitda - taxExp;
    const marginPercentage = rev > 0 ? (profitLoss / rev) * 100 : 0;

    const newMetric: FinancialMetricItem = {
      id: `fin-met-${Date.now()}`,
      metricCode: `FIN-MET-${metricMonth}-${String(metrics.length + 1).padStart(2, '0')}`,
      period: 'MONTHLY',
      fiscalMonth: metricMonth,
      productionVolume: parseFloat(metricProductionVol) || 0,
      salesVolume: parseFloat(metricSalesVol) || 0,
      revenue: rev,
      rawMaterialCost: rawCost,
      laborCost: labCost,
      expenses: exp,
      ebitda,
      taxExpense: taxExp,
      profitLoss,
      marginPercentage: parseFloat(marginPercentage.toFixed(2)),
      notes: metricNotes || 'Monthly operational performance log',
    };

    setMetrics([newMetric, ...metrics]);
    setIsMetricModalOpen(false);
    showNotice(`Financial performance log for ${metricMonth} registered successfully.`);
  };

  // Handlers - Payroll Request Form
  const handleCreatePayrollRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const netSalaries = parseFloat(payrollCalculatedNet) || 0;

    const newReq: PayrollRequestItem = {
      id: `pay-req-${Date.now()}`,
      requestNumber: `PAY-REQ-${payrollMonth}-${String(payrollRequests.length + 1).padStart(3, '0')}`,
      month: payrollMonth,
      department: payrollDept,
      totalEmployees: parseInt(payrollEmployees) || 1,
      totalGrossSalary: parseFloat(payrollGross) || 0,
      totalDeductions: parseFloat(payrollDeductions) || 0,
      calculatedSalaries: netSalaries,
      status: 'PENDING',
      approvedBySuperAdmin: false,
      remarks: payrollRemarks || 'Department salary release request awaiting Super Admin sign-off.',
      fundDisbursed: false,
    };

    setPayrollRequests([newReq, ...payrollRequests]);
    setIsPayrollModalOpen(false);
    showNotice(`Payroll request ${newReq.requestNumber} submitted for Super Admin fund release authorization.`);
  };

  // Super Admin Payroll Approval Action
  const handleSuperAdminPayrollDecision = (id: string, decision: 'APPROVED' | 'REJECTED') => {
    const updated = payrollRequests.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          status: decision,
          approvedBySuperAdmin: decision === 'APPROVED',
          approvedByName: 'Super Administrator',
          approvedAt: new Date().toISOString(),
          remarks: decision === 'APPROVED' ? 'Approved for direct bank disbursement.' : 'Rejected by Super Admin.',
        };
      }
      return p;
    });
    setPayrollRequests(updated);
    showNotice(`Payroll request ${decision.toLowerCase()} by Super Admin.`);
  };

  // Disburse Payroll
  const handleDisbursePayroll = (req: PayrollRequestItem) => {
    if (!req.approvedBySuperAdmin) {
      showNotice('Cannot disburse without prior Super Admin authorization.', 'error');
      return;
    }

    // Deduct from primary operating ledger
    const updatedLedgers = ledgers.map((l) => {
      if (l.accountCode === 'LEDGER-HDFC-01') {
        const newBalance = Math.max(0, l.bankBalance - req.calculatedSalaries);
        return { ...l, bankBalance: newBalance, closingBalance: newBalance };
      }
      return l;
    });
    setLedgers(updatedLedgers);

    const updatedRequests = payrollRequests.map((p) => {
      if (p.id === req.id) {
        return {
          ...p,
          fundDisbursed: true,
          disbursedAt: new Date().toISOString(),
          remarks: `${p.remarks || ''} | Disbursed via HDFC Corporate (Ref: TXN-AUTO-${Date.now()})`.trim(),
        };
      }
      return p;
    });
    setPayrollRequests(updatedRequests);
    showNotice(`Payroll funds of ₹${req.calculatedSalaries.toLocaleString()} disbursed via primary account.`);
  };

  // Handlers - Ledger Accounts
  const handleCreateLedger = (e: React.FormEvent) => {
    e.preventDefault();
    const balance = parseFloat(ledgerInitialBalance) || 0;
    const isBank = ledgerType === 'BANK';

    const newLedger: CashBankLedgerItem = {
      id: `ledger-${Date.now()}`,
      accountCode: `LEDGER-${ledgerType === 'BANK' ? 'BANK' : 'CASH'}-${String(ledgers.length + 1).padStart(2, '0')}`,
      accountName: ledgerName,
      accountType: ledgerType,
      bankName: isBank ? ledgerBankName : null,
      accountNumber: isBank ? ledgerAccNumber : null,
      ifscCode: isBank ? ledgerIfsc : null,
      currency: 'INR',
      bankBalance: isBank ? balance : 0,
      handCash: isBank ? 0 : balance,
      closingBalance: balance,
      status: 'ACTIVE',
      lastReconciledAt: new Date().toISOString(),
    };

    setLedgers([...ledgers, newLedger]);
    setIsLedgerModalOpen(false);
    setLedgerName('');
    setLedgerInitialBalance('');
    showNotice(`Account ledger ${newLedger.accountName} registered.`);
  };

  // Ledger Transaction (Deposit / Withdraw / Transfer)
  const handleExecuteTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLedger) return;

    const amt = parseFloat(txnAmount) || 0;
    if (amt <= 0) {
      showNotice('Transaction amount must be greater than zero.', 'error');
      return;
    }

    const updated = ledgers.map((l) => {
      if (l.id === selectedLedger.id) {
        let bBal = l.bankBalance;
        let cBal = l.handCash;

        if (txnType === 'DEPOSIT') {
          if (txnTarget === 'BANK') bBal += amt;
          else cBal += amt;
        } else if (txnType === 'WITHDRAWAL') {
          if (txnTarget === 'BANK') {
            if (bBal < amt) throw new Error('Insufficient bank balance.');
            bBal -= amt;
          } else {
            if (cBal < amt) throw new Error('Insufficient hand cash reserves.');
            cBal -= amt;
          }
        } else if (txnType === 'TRANSFER') {
          // Internal cash-to-bank or bank-to-cash
          if (txnTarget === 'BANK') {
            if (cBal < amt) throw new Error('Insufficient cash in vault to deposit to bank.');
            cBal -= amt;
            bBal += amt;
          } else {
            if (bBal < amt) throw new Error('Insufficient bank balance to withdraw to cash.');
            bBal -= amt;
            cBal += amt;
          }
        }
        return {
          ...l,
          bankBalance: bBal,
          handCash: cBal,
          closingBalance: bBal + cBal,
          lastReconciledAt: new Date().toISOString(),
        };
      }
      return l;
    });

    setLedgers(updated);
    setIsTransactionModalOpen(false);
    setTxnAmount('');
    setTxnReference('');
    showNotice(`${txnType} of ₹${amt.toLocaleString()} processed successfully.`);
  };

  // Handlers - Tax Configuration
  const handleCreateTaxRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const newTax: TaxRecordItem = {
      id: `tax-${Date.now()}`,
      recordNumber: `TAX-REC-${taxPeriod}-${String(taxes.length + 1).padStart(2, '0')}`,
      taxType,
      fiscalPeriod: taxPeriod,
      taxableAmount: parseFloat(taxableTurnover) || 0,
      taxRatePercentage: parseFloat(taxRate) || 18,
      taxAmount: parseFloat(taxAmount) || 0,
      paymentStatus: 'PENDING',
      approvalStatus: 'PENDING',
      approvedBySuperAdmin: false,
      notes: taxNotes || 'Configured tax record. Awaiting Super Admin payment approval.',
    };

    setTaxes([newTax, ...taxes]);
    setIsTaxModalOpen(false);
    showNotice(`Tax assessment ${newTax.recordNumber} submitted for Super Admin review.`);
  };

  // Super Admin Tax Payment Decision
  const handleSuperAdminTaxDecision = (id: string, decision: 'APPROVED' | 'REJECTED') => {
    const updated = taxes.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          approvalStatus: decision,
          approvedBySuperAdmin: decision === 'APPROVED',
          approvedByName: 'Super Administrator',
          approvedAt: new Date().toISOString(),
          notes: decision === 'APPROVED' ? 'Approved by Super Admin for statutory settlement.' : 'Tax payment rejected by Super Admin.',
        };
      }
      return t;
    });
    setTaxes(updated);
    showNotice(`Tax payment ${decision.toLowerCase()} by Super Admin.`);
  };

  // Execute Tax Payment (mark paid & deduct ledger)
  const handlePayTax = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTax) return;

    if (!selectedTax.approvedBySuperAdmin) {
      showNotice('Cannot execute tax payment without Super Admin approval.', 'error');
      return;
    }

    if (!payChallanRef.trim()) {
      showNotice('Government tax Challan reference / CIN is required.', 'error');
      return;
    }

    // Deduct from chosen ledger account
    const updatedLedgers = ledgers.map((l) => {
      if (l.accountCode === payAccountCode) {
        const newBal = Math.max(0, l.bankBalance - selectedTax.taxAmount);
        return { ...l, bankBalance: newBal, closingBalance: newBal };
      }
      return l;
    });
    setLedgers(updatedLedgers);

    const updatedTaxes = taxes.map((t) => {
      if (t.id === selectedTax.id) {
        return {
          ...t,
          paymentStatus: 'PAID',
          paidAt: new Date().toISOString(),
          challanReference: payChallanRef.trim(),
          notes: `${t.notes || ''} | Settled via ${payAccountCode} (Challan: ${payChallanRef.trim()})`.trim(),
        };
      }
      return t;
    });
    setTaxes(updatedTaxes);

    setIsPayTaxModalOpen(false);
    setPayChallanRef('');
    showNotice(`Tax liability ₹${selectedTax.taxAmount.toLocaleString()} paid successfully.`);
  };

  // Handlers - Tasks Delegation
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: FinanceTaskItem = {
      id: `fin-tsk-${Date.now()}`,
      taskCode: `FIN-TSK-2026-${String(tasks.length + 1).padStart(3, '0')}`,
      title: taskTitle.trim(),
      description: taskDescription.trim() || null,
      priority: taskPriority,
      status: 'PENDING',
      dueDate: taskDueDate || null,
      assignerName: 'Vikram Malhotra (Main Finance Manager)',
      assigneeId: taskAssignee,
      assigneeName: taskAssignee === 'usr-fin-ast-01' ? 'Anita Joshi (Assistant)' : 'Suresh Patel (Associate)',
      createdAt: new Date().toISOString(),
    };

    setTasks([newTask, ...tasks]);
    setIsTaskModalOpen(false);
    setTaskTitle('');
    setTaskDescription('');
    showNotice(`Task ${newTask.taskCode} assigned to ${newTask.assigneeName}.`);
  };

  const handleUpdateTaskStatus = (id: string, newStatus: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t));
    setTasks(updated);
    showNotice(`Task status updated to ${newStatus}.`);
  };

  // Date-Time Stamped Excel Audit Export
  const handleExportFinanceExcel = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(
      now.getHours(),
    )}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
    const fileName = `Finance_Department_Audit_${timeStamp}.xlsx`;

    const lines: string[] = [];
    lines.push(`MANUFACTURING ERP - FINANCE DEPARTMENT ENTERPRISE AUDIT`);
    lines.push(`Generated At,${now.toISOString()}`);
    lines.push(`Exported By,"${currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : 'Finance Manager'}" (${activeFinanceRole})`);
    lines.push(`Audit File Stamp,${fileName}`);
    lines.push(``);

    // 1. Profit & Loss Metrics
    lines.push(`=== 1. FINANCIAL PERFORMANCE & PROFIT / LOSS STATEMENTS ===`);
    lines.push('Metric Code,Fiscal Month,Production Vol (MT),Sales Vol (MT),Revenue (INR),Raw Material Cost (INR),Labor Cost (INR),Expenses (INR),EBITDA (INR),Tax Provision (INR),Net Profit/Loss (INR),Net Margin %');
    metrics.forEach((m) => {
      lines.push(
        [
          m.metricCode,
          m.fiscalMonth,
          m.productionVolume,
          m.salesVolume,
          m.revenue,
          m.rawMaterialCost,
          m.laborCost,
          m.expenses,
          m.ebitda,
          m.taxExpense,
          m.profitLoss,
          `${m.marginPercentage}%`,
        ].join(','),
      );
    });
    lines.push(``);

    // 2. Payroll Fund Release
    lines.push(`=== 2. PAYROLL & SUPER ADMIN FUND RELEASE APPROVAL REQUESTS ===`);
    lines.push('Request Number,Month,Department,Employees,Gross Salary (INR),Deductions (INR),Calculated Net Salaries (INR),Super Admin Approval,Fund Disbursed,Status');
    payrollRequests.forEach((p) => {
      lines.push(
        [
          p.requestNumber,
          p.month,
          p.department,
          p.totalEmployees,
          p.totalGrossSalary,
          p.totalDeductions,
          p.calculatedSalaries,
          p.approvedBySuperAdmin ? 'APPROVED' : 'PENDING',
          p.fundDisbursed ? 'YES' : 'NO',
          p.status,
        ].join(','),
      );
    });
    lines.push(``);

    // 3. Cash & Bank Ledgers
    lines.push(`=== 3. COMMERCIAL CASH & BANK LEDGER ACCOUNTS ===`);
    lines.push('Account Code,Account Name,Type,Bank Name,Account Number,Bank Balance (INR),Hand Cash Reserve (INR),Total Liquidity (INR),Status');
    ledgers.forEach((l) => {
      lines.push(
        [
          l.accountCode,
          `"${l.accountName}"`,
          l.accountType,
          `"${l.bankName || 'N/A'}"`,
          `"${l.accountNumber || 'N/A'}"`,
          l.bankBalance,
          l.handCash,
          l.bankBalance + l.handCash,
          l.status,
        ].join(','),
      );
    });
    lines.push(``);

    // 4. Tax Records
    lines.push(`=== 4. TAX RECORDS & STATUTORY PAYMENT CLEARANCES ===`);
    lines.push('Record Number,Tax Type,Fiscal Period,Taxable Amount (INR),Rate %,Net Liability (INR),Super Admin Approval,Payment Status,Challan Reference');
    taxes.forEach((t) => {
      lines.push(
        [
          t.recordNumber,
          t.taxType,
          t.fiscalPeriod,
          t.taxableAmount,
          `${t.taxRatePercentage}%`,
          t.taxAmount,
          t.approvalStatus,
          t.paymentStatus,
          `"${t.challanReference || 'N/A'}"`,
        ].join(','),
      );
    });
    lines.push(``);

    // 5. Tasks
    lines.push(`=== 5. FINANCE DEPARTMENT TASK DELEGATION REGISTER ===`);
    lines.push('Task Code,Title,Priority,Assignee,Status,Due Date');
    tasks.forEach((tsk) => {
      lines.push([tsk.taskCode, `"${tsk.title}"`, tsk.priority, `"${tsk.assigneeName}"`, tsk.status, tsk.dueDate || 'N/A'].join(','));
    });

    const csvContent = lines.join('\r\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotice(`Downloaded audit export: ${fileName}`);
  };

  return (
    <div className={`flex-1 flex flex-col min-w-0 ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Banner & Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-20 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/dashboard"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
              title="Return to Main Dashboard"
            >
              <ArrowLeft className="w-5 h-5 shrink-0" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20 shrink-0">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  Finance Department
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 whitespace-nowrap shrink-0">
                  Fiscal Governance
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                P&amp;L Statements, Super Admin Payroll Fund Release, Bank &amp; Cash Ledgers, and Tax Clearances
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Super Admin Simulator Switcher */}
            <button
              onClick={() => {
                setIsSuperAdminSimulator(!isSuperAdminSimulator);
                showNotice(
                  !isSuperAdminSimulator
                    ? 'Super Admin Mode Activated: You can now approve payroll fund releases and tax payment requests.'
                    : 'Switched back to Department Role view.',
                  'info',
                );
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                isSuperAdminSimulator
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
              }`}
              title="Toggle Super Admin Governance Privileges"
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{isSuperAdminSimulator ? 'Super Admin Mode (Active)' : 'Simulate Super Admin'}</span>
            </button>

            {/* Hierarchical Role Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setActiveFinanceRole('MAIN_MANAGER')}
                className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeFinanceRole === 'MAIN_MANAGER'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Main Manager
              </button>
              <button
                onClick={() => setActiveFinanceRole('ASSISTANT')}
                className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeFinanceRole === 'ASSISTANT'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Assistant
              </button>
              <button
                onClick={() => setActiveFinanceRole('ASSOCIATE')}
                className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeFinanceRole === 'ASSOCIATE'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Associate
              </button>
            </div>

            {/* Date-Time Stamped Excel Export */}
            <button
              onClick={handleExportFinanceExcel}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
              title="Export Full Date-Time Stamped Financial Audit (.xlsx)"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>Export Audit (.xlsx)</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all whitespace-nowrap shrink-0"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Notification Toast */}
        {notification && (
          <div
            className={`p-4 rounded-2xl border shadow-lg flex items-center justify-between text-base font-bold transition-all ${
              notification.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                : notification.type === 'info'
                ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-200'
                : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {notification.type === 'error' ? (
                <XCircle className="w-6 h-6 text-rose-600" />
              ) : notification.type === 'info' ? (
                <Info className="w-6 h-6 text-sky-600" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              )}
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="p-1 hover:opacity-75">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Super Admin Authorization Alert Banner */}
        {isSuperAdminSimulator && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-500/30 dark:border-amber-500/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-base font-bold text-amber-950 dark:text-amber-200">
                  Super Admin Governance Mode Enabled
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-400">
                  You hold executive authority to sign off on pending departmental payroll releases and approve statutory tax disbursements.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-white shadow-sm">
              EXECUTIVE PRIVILEGES
            </span>
          </div>
        )}

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Net Profit / Loss */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Monthly Net Profit
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                ₹{topMetrics.netProfit.toLocaleString()}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                +{topMetrics.margin}% Margin
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Revenue: ₹{(topMetrics.revenue / 10000000).toFixed(2)} Cr | Raw Mat: ₹{(topMetrics.rawMaterialCost / 10000000).toFixed(2)} Cr
            </p>
          </div>

          {/* KPI 2: Total Liquidity */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Bank &amp; Cash Liquidity
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                ₹{topMetrics.totalLiquidity.toLocaleString()}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                {ledgers.length} Accounts
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Operating Bank + Capex + Factory Petty Cash Vault
            </p>
          </div>

          {/* KPI 3: Pending Payroll Fund Release */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Pending Payroll Approval
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                ₹{topMetrics.pendingPayroll.toLocaleString()}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                Needs Admin Sign-off
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Department salaries awaiting Super Admin fund release
            </p>
          </div>

          {/* KPI 4: Pending Tax Clearances */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Pending Tax Clearance
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                ₹{topMetrics.pendingTaxes.toLocaleString()}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                Statutory Due
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              GST &amp; Advance Corporate Taxes awaiting approval
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('profit_loss')}
            className={`px-4 py-3 rounded-xl font-bold text-base transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'profit_loss'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-5 h-5 shrink-0" />
            <span>P&amp;L Statements &amp; Metrics</span>
          </button>

          <button
            onClick={() => setActiveTab('payroll')}
            className={`px-4 py-3 rounded-xl font-bold text-base transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'payroll'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-5 h-5 shrink-0" />
            <span>Payroll &amp; Fund Release</span>
            {topMetrics.pendingPayroll > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-3 rounded-xl font-bold text-base transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'ledger'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Landmark className="w-5 h-5 shrink-0" />
            <span>Bank &amp; Cash Ledgers</span>
          </button>

          <button
            onClick={() => setActiveTab('tax')}
            className={`px-4 py-3 rounded-xl font-bold text-base transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'tax'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Receipt className="w-5 h-5 shrink-0" />
            <span>Tax Settings &amp; Approvals</span>
            {topMetrics.pendingTaxes > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse shrink-0" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-3 rounded-xl font-bold text-base transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'tasks'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Clock className="w-5 h-5 shrink-0" />
            <span>Task Delegation</span>
          </button>
        </div>

        {/* TAB 1: P&L STATEMENTS & METRICS */}
        {activeTab === 'profit_loss' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Monthly Financial Statements &amp; Profit / Loss Performance
                </h2>
                <p className="text-base text-slate-500 dark:text-slate-400">
                  Comprehensive audit of manufacturing production volume, top-line sales, raw material costs, and net margin
                </p>
              </div>
              <button
                onClick={() => setIsMetricModalOpen(true)}
                className="px-4 py-2.5 rounded-xl font-bold text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Log Performance Statement</span>
              </button>
            </div>

            {/* Active Statement Breakdown Card */}
            {metrics.length > 0 && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                      Active Operational Period
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                      Fiscal Period: {metrics[0].fiscalMonth} Statement
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-slate-600 dark:text-slate-300">
                      Output: <strong className="text-slate-900 dark:text-white">{metrics[0].productionVolume.toLocaleString()} MT</strong>
                    </span>
                    <span className="text-base font-bold text-slate-600 dark:text-slate-300">
                      Dispatch: <strong className="text-slate-900 dark:text-white">{metrics[0].salesVolume.toLocaleString()} MT</strong>
                    </span>
                  </div>
                </div>

                {/* Waterfall Financial Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Revenue */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-500 uppercase">Gross Revenue (A)</span>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      ₹{metrics[0].revenue.toLocaleString()}
                    </p>
                    <span className="text-xs text-slate-500">100% Top-line Turnover</span>
                  </div>

                  {/* Raw Material Cost */}
                  <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50">
                    <span className="text-xs font-bold text-rose-600 uppercase">Raw Material Consumption (B)</span>
                    <p className="text-2xl font-black text-rose-700 dark:text-rose-400 mt-1">
                      -₹{metrics[0].rawMaterialCost.toLocaleString()}
                    </p>
                    <span className="text-xs text-rose-600">
                      {((metrics[0].rawMaterialCost / metrics[0].revenue) * 100).toFixed(1)}% of Revenue
                    </span>
                  </div>

                  {/* Labor & Overhead Expenses */}
                  <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
                    <span className="text-xs font-bold text-amber-600 uppercase">Labor &amp; Overheads (C)</span>
                    <p className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1">
                      -₹{(metrics[0].laborCost + metrics[0].expenses).toLocaleString()}
                    </p>
                    <span className="text-xs text-amber-600">
                      Labor: ₹{metrics[0].laborCost.toLocaleString()} | Ops: ₹{metrics[0].expenses.toLocaleString()}
                    </span>
                  </div>

                  {/* Net Profit */}
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase">Net Profit After Tax</span>
                    <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
                      ₹{metrics[0].profitLoss.toLocaleString()}
                    </p>
                    <span className="text-xs font-bold text-emerald-600">
                      Margin: {metrics[0].marginPercentage}% (EBITDA: ₹{metrics[0].ebitda.toLocaleString()})
                    </span>
                  </div>
                </div>

                {/* Progress Bar of Cost Composition */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Turnover Cost Allocation</span>
                    <span>100% Allocation</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 flex overflow-hidden">
                    <div
                      style={{ width: `${(metrics[0].rawMaterialCost / metrics[0].revenue) * 100}%` }}
                      className="bg-rose-500"
                      title="Raw Material Cost"
                    />
                    <div
                      style={{ width: `${(metrics[0].laborCost / metrics[0].revenue) * 100}%` }}
                      className="bg-amber-500"
                      title="Labor Cost"
                    />
                    <div
                      style={{ width: `${(metrics[0].expenses / metrics[0].revenue) * 100}%` }}
                      className="bg-sky-500"
                      title="Operating Expenses"
                    />
                    <div
                      style={{ width: `${(metrics[0].taxExpense / metrics[0].revenue) * 100}%` }}
                      className="bg-purple-500"
                      title="Tax Expense"
                    />
                    <div
                      style={{ width: `${metrics[0].marginPercentage}%` }}
                      className="bg-emerald-500"
                      title="Net Margin"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold pt-1">
                    <span className="flex items-center gap-1.5 text-rose-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      Raw Material ({((metrics[0].rawMaterialCost / metrics[0].revenue) * 100).toFixed(1)}%)
                    </span>
                    <span className="flex items-center gap-1.5 text-amber-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      Labor ({((metrics[0].laborCost / metrics[0].revenue) * 100).toFixed(1)}%)
                    </span>
                    <span className="flex items-center gap-1.5 text-sky-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                      Overheads ({((metrics[0].expenses / metrics[0].revenue) * 100).toFixed(1)}%)
                    </span>
                    <span className="flex items-center gap-1.5 text-purple-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                      Tax ({((metrics[0].taxExpense / metrics[0].revenue) * 100).toFixed(1)}%)
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Net Profit ({metrics[0].marginPercentage}%)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Historical Statements Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Audited Historical Performance Log
                </h3>
                <span className="text-xs font-bold text-slate-500">{metrics.length} Statements Archived</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-base">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs font-black uppercase text-slate-500">
                      <th className="py-3.5 px-4">Period</th>
                      <th className="py-3.5 px-4">Production / Sales</th>
                      <th className="py-3.5 px-4">Turnover (Revenue)</th>
                      <th className="py-3.5 px-4">Raw Material Cost</th>
                      <th className="py-3.5 px-4">Labor + Ops</th>
                      <th className="py-3.5 px-4">EBITDA</th>
                      <th className="py-3.5 px-4">Net Profit</th>
                      <th className="py-3.5 px-4">Margin %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {metrics.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          {m.fiscalMonth}
                          <span className="block text-xs font-normal text-slate-400">{m.metricCode}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                          {m.productionVolume.toLocaleString()} MT
                          <span className="block text-xs text-slate-400">Sales: {m.salesVolume.toLocaleString()} MT</span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          ₹{m.revenue.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-rose-600 font-mono">
                          ₹{m.rawMaterialCost.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-amber-600 font-mono">
                          ₹{(m.laborCost + m.expenses).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-indigo-600">
                          ₹{m.ebitda.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-600">
                          ₹{m.profitLoss.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                            {m.marginPercentage}%
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

        {/* TAB 2: PAYROLL & SUPER ADMIN FUND RELEASE APPROVAL */}
        {activeTab === 'payroll' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Departmental Payroll &amp; Super Admin Fund Release Workflow
                </h2>
                <p className="text-base text-slate-500 dark:text-slate-400">
                  Aggregates factory worker &amp; staff compensation; requires strict Super Admin authorization before disbursement
                </p>
              </div>
              <button
                onClick={() => setIsPayrollModalOpen(true)}
                className="px-4 py-2.5 rounded-xl font-bold text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Submit Payroll Release Request</span>
              </button>
            </div>

            {/* Payroll Requests Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Salary Disbursement Requests &amp; Approvals
                </h3>
                <span className="text-xs font-bold text-slate-500">{payrollRequests.length} Requests Total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-base">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs font-black uppercase text-slate-500">
                      <th className="py-3.5 px-4">Request Ref</th>
                      <th className="py-3.5 px-4">Period &amp; Dept</th>
                      <th className="py-3.5 px-4">Employees</th>
                      <th className="py-3.5 px-4">Gross Salaries</th>
                      <th className="py-3.5 px-4">Deductions</th>
                      <th className="py-3.5 px-4">Calculated Net Release</th>
                      <th className="py-3.5 px-4">Super Admin Status</th>
                      <th className="py-3.5 px-4">Disbursement</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {payrollRequests.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          {p.requestNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 dark:text-white">{p.month}</span>
                          <span className="block text-xs text-slate-400">Dept: {p.department}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                          {p.totalEmployees} Workers
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                          ₹{p.totalGrossSalary.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-rose-600">
                          -₹{p.totalDeductions.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-black font-mono text-emerald-600 text-lg">
                          ₹{p.calculatedSalaries.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          {p.approvedBySuperAdmin ? (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1 w-max">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approved by Admin
                            </span>
                          ) : p.status === 'REJECTED' ? (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center gap-1 w-max">
                              <XCircle className="w-3.5 h-3.5" />
                              Rejected by Admin
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center gap-1 w-max animate-pulse">
                              <Clock className="w-3.5 h-3.5" />
                              Pending Sign-off
                            </span>
                          )}
                          {p.approvedByName && (
                            <span className="block text-xs text-slate-400 mt-0.5">{p.approvedByName}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {p.fundDisbursed ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                              Disbursed
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 font-bold">Unreleased</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Super Admin Decision Controls (Accessible if Super Admin simulator active or currentUser is SUPER_ADMIN) */}
                            {p.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleSuperAdminPayrollDecision(p.id, 'APPROVED')}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
                                  title="Approve Fund Release (Super Admin Authorization)"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleSuperAdminPayrollDecision(p.id, 'REJECTED')}
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 transition-all"
                                  title="Reject Fund Release"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {/* Disbursement Action (Only available after Super Admin approval) */}
                            {p.approvedBySuperAdmin && !p.fundDisbursed && (
                              <button
                                onClick={() => handleDisbursePayroll(p)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all flex items-center gap-1"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Disburse Funds</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CASH & BANK LEDGER ACCOUNTS */}
        {activeTab === 'ledger' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Cash &amp; Bank Accounts Ledger Management
                </h2>
                <p className="text-base text-slate-500 dark:text-slate-400">
                  Real-time liquidity tracking across commercial banking operating accounts and factory petty cash vault
                </p>
              </div>
              <button
                onClick={() => setIsLedgerModalOpen(true)}
                className="px-4 py-2.5 rounded-xl font-bold text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Ledger Account</span>
              </button>
            </div>

            {/* Account Ledger Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ledgers.map((l) => (
                <div
                  key={l.id}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {l.accountCode}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        {l.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {l.accountName}
                    </h3>
                    {l.accountType === 'BANK' ? (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {l.bankName} • Acc: {l.accountNumber} • IFSC: {l.ifscCode}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Factory Floor Physical Vault &amp; Petty Cash Reserve
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {l.accountType === 'BANK' ? 'Bank Balance' : 'Hand Cash Balance'}
                    </span>
                    <p className="text-3xl font-black text-slate-900 dark:text-white mt-0.5">
                      ₹{(l.bankBalance + l.handCash).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedLedger(l);
                      setIsTransactionModalOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Deposit / Withdraw / Transfer</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TAX SETTINGS & APPROVALS */}
        {activeTab === 'tax' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Statutory Tax Configuration &amp; Super Admin Payment Approvals
                </h2>
                <p className="text-base text-slate-500 dark:text-slate-400">
                  GST (GSTR-3B), Advance Corporate Tax, and TDS filings with mandatory Super Admin authorization prior to treasury settlement
                </p>
              </div>
              <button
                onClick={() => setIsTaxModalOpen(true)}
                className="px-4 py-2.5 rounded-xl font-bold text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Configure Tax Filing</span>
              </button>
            </div>

            {/* Tax Records Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Tax Assessments &amp; Statutory Approvals
                </h3>
                <span className="text-xs font-bold text-slate-500">{taxes.length} Tax Records Configured</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-base">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs font-black uppercase text-slate-500">
                      <th className="py-3.5 px-4">Tax Type &amp; Ref</th>
                      <th className="py-3.5 px-4">Period</th>
                      <th className="py-3.5 px-4">Taxable Turnover</th>
                      <th className="py-3.5 px-4">Rate %</th>
                      <th className="py-3.5 px-4">Net Tax Liability</th>
                      <th className="py-3.5 px-4">Super Admin Approval</th>
                      <th className="py-3.5 px-4">Payment Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {taxes.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          <span className="px-2 py-0.5 rounded text-xs font-black bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 mr-2">
                            {t.taxType}
                          </span>
                          {t.recordNumber}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-bold">
                          {t.fiscalPeriod}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                          ₹{t.taxableAmount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                          {t.taxRatePercentage}%
                        </td>
                        <td className="py-3.5 px-4 font-black font-mono text-rose-600 text-lg">
                          ₹{t.taxAmount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          {t.approvedBySuperAdmin ? (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1 w-max">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approved by Admin
                            </span>
                          ) : t.approvalStatus === 'REJECTED' ? (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center gap-1 w-max">
                              <XCircle className="w-3.5 h-3.5" />
                              Rejected by Admin
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center gap-1 w-max animate-pulse">
                              <Clock className="w-3.5 h-3.5" />
                              Awaiting Sign-off
                            </span>
                          )}
                          {t.approvedByName && (
                            <span className="block text-xs text-slate-400 mt-0.5">{t.approvedByName}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {t.paymentStatus === 'PAID' ? (
                            <div>
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                                PAID
                              </span>
                              <span className="block text-xs text-slate-400 mt-0.5 font-mono">
                                Challan: {t.challanReference || 'CIN-OK'}
                              </span>
                            </div>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                              PENDING
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Super Admin Payment Approval Controls */}
                            {t.approvalStatus === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleSuperAdminTaxDecision(t.id, 'APPROVED')}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
                                  title="Approve Tax Payment (Super Admin Authorization)"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleSuperAdminTaxDecision(t.id, 'REJECTED')}
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950/50 transition-all"
                                  title="Reject Tax Payment"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {/* Execute Payment Modal Trigger */}
                            {t.approvedBySuperAdmin && t.paymentStatus !== 'PAID' && (
                              <button
                                onClick={() => {
                                  setSelectedTax(t);
                                  setIsPayTaxModalOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all flex items-center gap-1"
                              >
                                <Receipt className="w-3.5 h-3.5" />
                                <span>Execute Payment</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TASK DELEGATION */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Finance Department Hierarchical Task Assignment
                </h2>
                <p className="text-base text-slate-500 dark:text-slate-400">
                  Main Finance Manager delegates accounting, audit, and tax duties to Assistant and Associate managers
                </p>
              </div>
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="px-4 py-2.5 rounded-xl font-bold text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Delegate Finance Task</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {task.taskCode}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                          task.priority === 'URGENT'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            : task.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Assignee:</span>
                      <strong className="text-slate-900 dark:text-white">{task.assigneeName}</strong>
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Due Date:</span>
                        <strong className="text-slate-900 dark:text-white">{task.dueDate}</strong>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        task.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : task.status === 'IN_PROGRESS'
                          ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {task.status}
                    </span>

                    <select
                      value={task.status}
                      onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                      className="text-xs font-bold px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="BLOCKED">BLOCKED</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ================= MODALS ================= */}

      {/* 1. Modal: Log Financial Performance Statement */}
      {isMetricModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Log Monthly Financial Performance
              </h3>
              <button onClick={() => setIsMetricModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMetric} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fiscal Month (YYYY-MM) *
                  </label>
                  <input
                    type="text"
                    required
                    value={metricMonth}
                    onChange={(e) => setMetricMonth(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Production Vol (MT) *
                  </label>
                  <input
                    type="number"
                    required
                    value={metricProductionVol}
                    onChange={(e) => setMetricProductionVol(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sales Vol (MT) *
                  </label>
                  <input
                    type="number"
                    required
                    value={metricSalesVol}
                    onChange={(e) => setMetricSalesVol(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Gross Revenue (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={metricRevenue}
                    onChange={(e) => setMetricRevenue(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono text-emerald-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Raw Material Cost (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={metricRawCost}
                    onChange={(e) => setMetricRawCost(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono text-rose-600 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Labor Cost (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={metricLaborCost}
                    onChange={(e) => setMetricLaborCost(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Operating Expenses (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={metricExpenses}
                    onChange={(e) => setMetricExpenses(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tax Provision (₹)
                  </label>
                  <input
                    type="number"
                    value={metricTaxExpense}
                    onChange={(e) => setMetricTaxExpense(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Performance Notes / Highlights
                </label>
                <textarea
                  rows={2}
                  value={metricNotes}
                  onChange={(e) => setMetricNotes(e.target.value)}
                  placeholder="e.g. Completed plant expansion, scrap rate reduced to 1.8%"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsMetricModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                >
                  Save Performance Statement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Submit Payroll Fund Release Request */}
      {isPayrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Submit Payroll Fund Release Request
              </h3>
              <button onClick={() => setIsPayrollModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePayrollRequest} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Payroll Month (YYYY-MM) *
                  </label>
                  <input
                    type="text"
                    required
                    value={payrollMonth}
                    onChange={(e) => setPayrollMonth(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Department *
                  </label>
                  <select
                    value={payrollDept}
                    onChange={(e) => setPayrollDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold bg-white dark:bg-slate-800"
                  >
                    <option value="ALL">ALL DEPARTMENTS (Plant Wide)</option>
                    <option value="PRODUCTION">PRODUCTION</option>
                    <option value="QUALITY">QUALITY</option>
                    <option value="INVENTORY">INVENTORY &amp; WAREHOUSE</option>
                    <option value="MAINTENANCE">MACHINE MAINTENANCE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Employees Count *
                  </label>
                  <input
                    type="number"
                    required
                    value={payrollEmployees}
                    onChange={(e) => setPayrollEmployees(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Gross Salary (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={payrollGross}
                    onChange={(e) => setPayrollGross(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Deductions (₹)
                  </label>
                  <input
                    type="number"
                    value={payrollDeductions}
                    onChange={(e) => setPayrollDeductions(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono text-rose-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Calculated Net Release Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={payrollCalculatedNet}
                  onChange={(e) => setPayrollCalculatedNet(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-emerald-500 font-mono font-black text-xl text-emerald-600 dark:text-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Justification / Remarks for Super Admin
                </label>
                <textarea
                  rows={2}
                  value={payrollRemarks}
                  onChange={(e) => setPayrollRemarks(e.target.value)}
                  placeholder="e.g. Monthly salary release for 142 factory employees verified against biometric attendance logs."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPayrollModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                >
                  Submit for Super Admin Sign-off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: Add Ledger Account */}
      {isLedgerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Register Cash / Bank Ledger Account
              </h3>
              <button onClick={() => setIsLedgerModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLedger} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Account Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ICICI Vendor Escrow Account"
                  value={ledgerName}
                  onChange={(e) => setLedgerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Account Medium *
                  </label>
                  <select
                    value={ledgerType}
                    onChange={(e) => setLedgerType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold bg-white dark:bg-slate-800"
                  >
                    <option value="BANK">COMMERCIAL BANK</option>
                    <option value="CASH">PHYSICAL CASH VAULT</option>
                    <option value="ESCROW">ESCROW / Capex</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Opening Balance (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={ledgerInitialBalance}
                    onChange={(e) => setLedgerInitialBalance(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold"
                  />
                </div>
              </div>

              {ledgerType === 'BANK' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ICICI Bank"
                        value={ledgerBankName}
                        onChange={(e) => setLedgerBankName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        placeholder="001928374652"
                        value={ledgerAccNumber}
                        onChange={(e) => setLedgerAccNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      placeholder="ICIC0001092"
                      value={ledgerIfsc}
                      onChange={(e) => setLedgerIfsc(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono uppercase"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLedgerModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                >
                  Save Account Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Deposit / Withdraw / Transfer */}
      {isTransactionModalOpen && selectedLedger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Execute Ledger Transaction
                </h3>
                <span className="text-xs text-slate-500 font-bold">{selectedLedger.accountName}</span>
              </div>
              <button onClick={() => setIsTransactionModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Action *
                  </label>
                  <select
                    value={txnType}
                    onChange={(e) => setTxnType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold bg-white dark:bg-slate-800"
                  >
                    <option value="DEPOSIT">DEPOSIT (+)</option>
                    <option value="WITHDRAWAL">WITHDRAWAL (-)</option>
                    <option value="TRANSFER">INTERNAL TRANSFER</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Medium *
                  </label>
                  <select
                    value={txnTarget}
                    onChange={(e) => setTxnTarget(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold bg-white dark:bg-slate-800"
                  >
                    <option value="BANK">BANK BALANCE</option>
                    <option value="CASH">HAND CASH RESERVE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="50000"
                  value={txnAmount}
                  onChange={(e) => setTxnAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-emerald-500 font-mono font-black text-xl text-emerald-600 dark:text-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Reference / Voucher Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CHQ-992182 or PETTY-VOUCHER-01"
                  value={txnReference}
                  onChange={(e) => setTxnReference(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTransactionModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                >
                  Commit Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: Configure Tax Record */}
      {isTaxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Configure Statutory Tax Filing
              </h3>
              <button onClick={() => setIsTaxModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTaxRecord} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tax Category *
                  </label>
                  <select
                    value={taxType}
                    onChange={(e) => setTaxType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold bg-white dark:bg-slate-800"
                  >
                    <option value="GST">GST (GSTR-3B)</option>
                    <option value="ADVANCE_TAX">ADVANCE CORPORATE TAX</option>
                    <option value="TDS">TDS WITHHOLDING TAX</option>
                    <option value="CUSTOMS_DUTY">CUSTOMS / IMPORT DUTY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fiscal Period *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="2026-11 or 2026-Q3"
                    value={taxPeriod}
                    onChange={(e) => setTaxPeriod(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Taxable Turnover (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="18450000"
                    value={taxableTurnover}
                    onChange={(e) => setTaxableTurnover(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tax Rate (%) *
                  </label>
                  <input
                    type="number"
                    required
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Net Tax Liability to Remit (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="842000"
                  value={taxAmount}
                  onChange={(e) => setTaxAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-rose-500 font-mono font-black text-xl text-rose-600 dark:text-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tax Calculation Notes / Offsets
                </label>
                <textarea
                  rows={2}
                  value={taxNotes}
                  onChange={(e) => setTaxNotes(e.target.value)}
                  placeholder="e.g. Net payable after adjusting eligible Input Tax Credit of ₹24.79 Lakhs."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTaxModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                >
                  Submit for Super Admin Sign-off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Modal: Execute Tax Payment */}
      {isPayTaxModalOpen && selectedTax && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Execute Statutory Tax Settlement
                </h3>
                <span className="text-xs text-slate-500 font-bold">{selectedTax.recordNumber}</span>
              </div>
              <button onClick={() => setIsPayTaxModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePayTax} className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Statutory Liability</span>
                <p className="text-2xl font-black text-rose-600 font-mono">
                  ₹{selectedTax.taxAmount.toLocaleString()}
                </p>
                <span className="text-xs text-slate-400">
                  Category: {selectedTax.taxType} • Period: {selectedTax.fiscalPeriod}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Source Bank Account *
                </label>
                <select
                  value={payAccountCode}
                  onChange={(e) => setPayAccountCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold bg-white dark:bg-slate-800"
                >
                  {ledgers
                    .filter((l) => l.accountType === 'BANK')
                    .map((l) => (
                      <option key={l.id} value={l.accountCode}>
                        {l.accountName} (Bal: ₹{l.bankBalance.toLocaleString()})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Government Challan Reference / CIN *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CIN-HDFC-9928172635"
                  value={payChallanRef}
                  onChange={(e) => setPayChallanRef(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPayTaxModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                >
                  Confirm Tax Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Modal: Delegate Finance Task */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Delegate Finance Task
              </h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Conduct November Bank Reconciliation for SBI Account"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Detailed guidelines and delivery requirements..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Assignee *
                  </label>
                  <select
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold bg-white dark:bg-slate-800"
                  >
                    <option value="usr-fin-ast-01">Anita Joshi (Assistant - Ledgers)</option>
                    <option value="usr-fin-asc-01">Suresh Patel (Associate - Tax/Payroll)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Priority *
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold bg-white dark:bg-slate-800"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700"
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
                  className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
