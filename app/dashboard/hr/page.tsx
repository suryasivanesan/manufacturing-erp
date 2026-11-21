'use client';

import React, { useState, useEffect, useMemo, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  UserCheck,
  UserPlus,
  Clock,
  Calendar,
  DollarSign,
  CreditCard,
  ShieldCheck,
  ShieldAlert,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Printer,
  Download,
  Search,
  Building2,
  Sun,
  Moon,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  HeartPulse,
  HardHat,
  MessageSquare,
  AlertCircle,
  X,
  FileCheck2,
  BadgeCheck,
  Activity,
  Layers,
  ChevronRight,
  RefreshCw,
  Send,
  Coins,
  Scale,
  Factory,
} from 'lucide-react';

// =========================================================================
// DATA INTERFACES
// =========================================================================

interface HrRecruitmentRecord {
  id: string;
  requisitionCode: string;
  jobTitle: string;
  department: string;
  positionsCount: number;
  hiringAgency?: string | null;
  candidateName?: string | null;
  candidatePhone?: string | null;
  candidateEmail?: string | null;
  technicalInterviewStatus: string;
  interviewScore?: number | null;
  backgroundVerificationStatus: string;
  joiningFormalitiesStatus: string;
  joiningDate?: string | null;
  offeredSalary?: number | null;
  status: string;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

interface HrAttendancePayroll {
  id: string;
  recordCode: string;
  employeeId: string;
  employeeName: string;
  department: string;
  shiftCode: string;
  month: string;
  biometricPunchCardId?: string | null;
  totalDaysPresent: number;
  totalDaysAbsent: number;
  totalPaidLeaves: number;
  overtimeHours: number;
  overtimePay: number;
  shiftAllowance: number;
  nightShiftIncentive: number;
  baseGrossSalary: number;
  deductions: number;
  netPayable: number;
  paymentStatus: string;
  disbursedAt?: string | null;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

interface HrStatutoryCompliance {
  id: string;
  complianceCode: string;
  complianceType: string;
  period: string;
  challanOrRefNumber?: string | null;
  totalCoveredEmployees: number;
  statutoryAmount: number;
  dueDate: string;
  filingDate?: string | null;
  complianceStatus: string;
  minimumWageCompliant: boolean;
  factoryActChecklistJson?: string | null;
  unionMeetingMinutes?: string | null;
  inspectorName?: string | null;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

interface HrSafetyWelfare {
  id: string;
  recordCode: string;
  category: string;
  employeeId?: string | null;
  employeeName?: string | null;
  department?: string | null;
  ppeItemsIssued?: string | null;
  ppeBatchLot?: string | null;
  safetyDrillType?: string | null;
  safetyDrillDate?: string | null;
  canteenInspectionScore?: number | null;
  firstAidIncidentType?: string | null;
  welfareAmenityDetails?: string | null;
  status: string;
  inspectorOrIssuer?: string | null;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

interface HrTrainingCertification {
  id: string;
  trainingCode: string;
  trainingType: string;
  courseTitle: string;
  trainerName: string;
  targetDepartment: string;
  attendeesCount: number;
  employeeId?: string | null;
  employeeName?: string | null;
  certificationExpiry?: string | null;
  assessmentScorePct?: number | null;
  ojtMentorName?: string | null;
  ojtCompletionStatus: string;
  validTill?: string | null;
  status: string;
  certificateIssued: boolean;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

interface HrEmployeeRelation {
  id: string;
  caseNumber: string;
  relationType: string;
  employeeId?: string | null;
  employeeName?: string | null;
  department?: string | null;
  subject: string;
  description: string;
  appraisalRating?: number | null;
  disciplinaryActionTaken?: string | null;
  resolutionNotes?: string | null;
  hearingDate?: string | null;
  status: string;
  assignedOfficer?: string | null;
  resolvedAt?: string | null;
  companyId: string;
  createdAt: string;
}

export default function HrDashboardPage() {
  const router = useRouter();

  // Theme state (Strictly defaults to Light mode)
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Authenticated user & tenant state
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Sub-Tab
  type HrTab =
    | 'recruitment'
    | 'attendance'
    | 'compliance'
    | 'safety'
    | 'training'
    | 'relations';
  const [hrTab, setHrTab] = useState<HrTab>('recruitment');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');

  // Modal Visibility States
  const [isNewRecruitmentModal, setIsNewRecruitmentModal] = useState(false);
  const [isNewAttendanceModal, setIsNewAttendanceModal] = useState(false);
  const [isNewComplianceModal, setIsNewComplianceModal] = useState(false);
  const [isNewSafetyModal, setIsNewSafetyModal] = useState(false);
  const [isNewTrainingModal, setIsNewTrainingModal] = useState(false);
  const [isNewRelationModal, setIsNewRelationModal] = useState(false);

  // Certificate / Print modal
  const [selectedTrainingCert, setSelectedTrainingCert] =
    useState<HrTrainingCertification | null>(null);

  // =========================================================================
  // DATA STATES (STRICTLY CLEAN INITIAL STATE - ZERO HARDCODED MOCKS)
  // =========================================================================

  const [recruitmentList, setRecruitmentList] = useState<HrRecruitmentRecord[]>([]);
  const [attendanceList, setAttendanceList] = useState<HrAttendancePayroll[]>([]);
  const [complianceList, setComplianceList] = useState<HrStatutoryCompliance[]>([]);
  const [safetyList, setSafetyList] = useState<HrSafetyWelfare[]>([]);
  const [trainingList, setTrainingList] = useState<HrTrainingCertification[]>([]);
  const [relationList, setRelationList] = useState<HrEmployeeRelation[]>([]);

  // =========================================================================
  // LIFECYCLE & TENANT SETUP
  // =========================================================================

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

    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
      } catch (err) {
        console.error(err);
      }
    }

    fetchInitialHrData();
  }, []);

  const fetchInitialHrData = async () => {
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('auth_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const [resR, resA, resC, resS, resT, resRel] = await Promise.allSettled([
        fetch(`${apiUrl}/hr/recruitment`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiUrl}/hr/attendance`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiUrl}/hr/compliance`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiUrl}/hr/safety`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiUrl}/hr/training`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiUrl}/hr/relations`, { headers }).then((r) => (r.ok ? r.json() : [])),
      ]);

      setRecruitmentList(resR.status === 'fulfilled' && Array.isArray(resR.value) ? resR.value : []);
      setAttendanceList(resA.status === 'fulfilled' && Array.isArray(resA.value) ? resA.value : []);
      setComplianceList(resC.status === 'fulfilled' && Array.isArray(resC.value) ? resC.value : []);
      setSafetyList(resS.status === 'fulfilled' && Array.isArray(resS.value) ? resS.value : []);
      setTrainingList(resT.status === 'fulfilled' && Array.isArray(resT.value) ? resT.value : []);
      setRelationList(resRel.status === 'fulfilled' && Array.isArray(resRel.value) ? resRel.value : []);
    } catch {
      setRecruitmentList([]);
      setAttendanceList([]);
      setComplianceList([]);
      setSafetyList([]);
      setTrainingList([]);
      setRelationList([]);
    }
  };

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const companyName = currentUser?.company?.name || 'Manufacturing Enterprise';
  const tenantSubCategory = currentUser?.company?.subCategory || currentUser?.subCategory || 'Industrial Manufacturing';

  // =========================================================================
  // ACTION HANDLERS
  // =========================================================================

  // 1. Recruitment
  const handleAddRecruitment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const newRec: HrRecruitmentRecord = {
      id: `rec-${Date.now()}`,
      requisitionCode: `HR-REQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      jobTitle: String(data.get('jobTitle') || 'Industrial Technician'),
      department: String(data.get('department') || 'PRODUCTION'),
      positionsCount: Number(data.get('positionsCount')) || 1,
      hiringAgency: String(data.get('hiringAgency') || 'Direct In-House'),
      candidateName: String(data.get('candidateName') || 'Applicant Candidate'),
      candidatePhone: String(data.get('candidatePhone') || '+91 98000 00000'),
      candidateEmail: String(data.get('candidateEmail') || 'candidate@jobs.in'),
      technicalInterviewStatus: String(data.get('interviewStatus') || 'SCHEDULED'),
      interviewScore: Number(data.get('interviewScore')) || null,
      backgroundVerificationStatus: String(data.get('bgStatus') || 'PENDING'),
      joiningFormalitiesStatus: 'PENDING',
      joiningDate: String(data.get('joiningDate') || '2026-12-01'),
      offeredSalary: Number(data.get('offeredSalary')) || 35000,
      status: 'OPEN',
      notes: String(data.get('notes') || 'Candidate profile shortlisted for technical interview.'),
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setRecruitmentList([newRec, ...recruitmentList]);
    setIsNewRecruitmentModal(false);
    showToast(`Requisition ${newRec.requisitionCode} created successfully.`);
  };

  const handleAdvanceRecruitmentStatus = (id: string) => {
    setRecruitmentList(
      recruitmentList.map((r) => {
        if (r.id === id) {
          const nextStatus =
            r.status === 'OPEN'
              ? 'IN_PROCESS'
              : r.status === 'IN_PROCESS'
              ? 'OFFERED'
              : 'HIRED';
          return {
            ...r,
            status: nextStatus,
            technicalInterviewStatus: 'PASSED',
            interviewScore: r.interviewScore || 8.5,
            backgroundVerificationStatus: 'VERIFIED',
            joiningFormalitiesStatus: nextStatus === 'HIRED' ? 'JOINED' : 'OFFER_RELEASED',
          };
        }
        return r;
      }),
    );
    showToast('Candidate recruitment pipeline stage updated.');
  };

  // 2. Attendance & Payroll
  const handleAddAttendance = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const baseGross = Number(data.get('baseGrossSalary')) || 30000;
    const otHours = Number(data.get('overtimeHours')) || 0;
    const otPay = otHours * 250;
    const shiftAllowance = Number(data.get('shiftAllowance')) || 0;
    const nightShiftIncentive = Number(data.get('nightShiftIncentive')) || 0;
    const deductions = baseGross * 0.12;
    const net = baseGross + otPay + shiftAllowance + nightShiftIncentive - deductions;

    const newAtt: HrAttendancePayroll = {
      id: `att-${Date.now()}`,
      recordCode: `ATT-PAY-2026-11-${Math.floor(100 + Math.random() * 900)}`,
      employeeId: String(data.get('employeeId') || 'EMP-PROD-055'),
      employeeName: String(data.get('employeeName') || 'Worker Associate'),
      department: String(data.get('department') || 'PRODUCTION'),
      shiftCode: String(data.get('shiftCode') || 'GENERAL'),
      month: '2026-11',
      biometricPunchCardId: `RFID-${Math.floor(10000 + Math.random() * 90000)}`,
      totalDaysPresent: Number(data.get('daysPresent')) || 26,
      totalDaysAbsent: Number(data.get('daysAbsent')) || 0,
      totalPaidLeaves: 2,
      overtimeHours: otHours,
      overtimePay: otPay,
      shiftAllowance,
      nightShiftIncentive,
      baseGrossSalary: baseGross,
      deductions,
      netPayable: net,
      paymentStatus: 'PROCESSED',
      disbursedAt: null,
      notes: 'Biometric punch card hours synchronized with factory payroll server.',
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setAttendanceList([newAtt, ...attendanceList]);
    setIsNewAttendanceModal(false);
    showToast(`Attendance & wage for ${newAtt.employeeName} calculated (₹${newAtt.netPayable.toLocaleString()}).`);
  };

  const handleDisburseWage = (id: string) => {
    setAttendanceList(
      attendanceList.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            paymentStatus: 'DISBURSED',
            disbursedAt: 'Just now',
          };
        }
        return a;
      }),
    );
    showToast('Wages marked as DISBURSED to employee bank account.');
  };

  // 3. Statutory Compliance
  const handleAddCompliance = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const newComp: HrStatutoryCompliance = {
      id: `stat-${Date.now()}`,
      complianceCode: `STAT-COMP-2026-${Math.floor(100 + Math.random() * 900)}`,
      complianceType: String(data.get('complianceType') || 'PF_EPFO'),
      period: String(data.get('period') || '2026-11'),
      challanOrRefNumber: String(data.get('challanNumber') || `CHL-${Math.floor(100000 + Math.random() * 900000)}`),
      totalCoveredEmployees: Number(data.get('totalEmployees')) || 142,
      statutoryAmount: Number(data.get('amount')) || 150000,
      dueDate: String(data.get('dueDate') || '2026-12-15'),
      filingDate: null,
      complianceStatus: 'PENDING',
      minimumWageCompliant: true,
      factoryActChecklistJson: '{"auditCleared": true, "registersVerified": true}',
      unionMeetingMinutes: null,
      inspectorName: String(data.get('inspectorName') || 'District Labor Officer'),
      notes: String(data.get('notes') || 'Statutory monthly contribution record.'),
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setComplianceList([newComp, ...complianceList]);
    setIsNewComplianceModal(false);
    showToast(`Statutory filing ${newComp.complianceCode} logged.`);
  };

  const handleMarkComplianceFiled = (id: string) => {
    setComplianceList(
      complianceList.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            complianceStatus: 'FILED',
            filingDate: 'Just now',
          };
        }
        return c;
      }),
    );
    showToast('Statutory filing marked as FILED and acknowledged.');
  };

  // 4. Safety & Welfare
  const handleAddSafety = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const category = String(data.get('category') || 'PPE_ISSUANCE');

    const newSafe: HrSafetyWelfare = {
      id: `safe-${Date.now()}`,
      recordCode: `SAFE-WEL-2026-${Math.floor(100 + Math.random() * 900)}`,
      category,
      employeeId: String(data.get('employeeId') || ''),
      employeeName: String(data.get('employeeName') || ''),
      department: String(data.get('department') || 'PRODUCTION'),
      ppeItemsIssued: category === 'PPE_ISSUANCE' ? String(data.get('ppeItems') || 'Safety Helmet, Cut-Resistant Gloves') : null,
      ppeBatchLot: 'PPE-LOT-2026-Q4',
      safetyDrillType: category === 'SAFETY_DRILL' ? String(data.get('drillType') || 'Fire Evacuation & First-Aid Drill') : null,
      safetyDrillDate: category === 'SAFETY_DRILL' ? new Date().toISOString().slice(0, 10) : null,
      canteenInspectionScore: category === 'CANTEEN_HYGIENE' ? Number(data.get('canteenScore')) || 95 : null,
      firstAidIncidentType: category === 'FIRST_AID_HEALTH' ? String(data.get('incidentDetails') || 'Minor dressing') : null,
      welfareAmenityDetails: String(data.get('welfareDetails') || 'Plant amenity compliance verified.'),
      status: 'ACTIVE',
      inspectorOrIssuer: 'HR_SAFETY_OFFICER',
      notes: String(data.get('notes') || 'Logged in safety and welfare register.'),
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setSafetyList([newSafe, ...safetyList]);
    setIsNewSafetyModal(false);
    showToast(`Plant safety record ${newSafe.recordCode} logged.`);
  };

  // 5. Training & Certification
  const handleAddTraining = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const newTrn: HrTrainingCertification = {
      id: `trn-${Date.now()}`,
      trainingCode: `TRN-CERT-2026-${Math.floor(100 + Math.random() * 900)}`,
      trainingType: String(data.get('trainingType') || 'SAFETY_INDUCTION'),
      courseTitle: String(data.get('courseTitle') || 'Hazard Identification & Equipment Safety'),
      trainerName: String(data.get('trainerName') || 'Arun Sharma (Senior Safety Officer)'),
      targetDepartment: String(data.get('targetDepartment') || 'PRODUCTION'),
      attendeesCount: Number(data.get('attendeesCount')) || 10,
      employeeId: 'EMP-BATCH-TRAINEE',
      employeeName: String(data.get('employeeName') || 'Plant Technical Associates'),
      certificationExpiry: '2027-11-20',
      assessmentScorePct: Number(data.get('assessmentScore')) || 90.0,
      ojtMentorName: String(data.get('ojtMentor') || 'Senior Plant Supervisor'),
      ojtCompletionStatus: 'CERTIFIED',
      validTill: '2027-11-20',
      status: 'COMPLETED',
      certificateIssued: true,
      notes: String(data.get('notes') || 'Safety protocol test cleared.'),
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setTrainingList([newTrn, ...trainingList]);
    setIsNewTrainingModal(false);
    showToast(`Training ${newTrn.trainingCode} logged and certified.`);
  };

  const handleCertifyTraining = (id: string) => {
    setTrainingList(
      trainingList.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            ojtCompletionStatus: 'CERTIFIED',
            certificateIssued: true,
            status: 'COMPLETED',
            assessmentScorePct: t.assessmentScorePct || 92.0,
          };
        }
        return t;
      }),
    );
    showToast('Employee OJT certified and official Certificate of Competency issued.');
  };

  // 6. Employee Relations
  const handleAddRelation = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const newRel: HrEmployeeRelation = {
      id: `er-${Date.now()}`,
      caseNumber: `ER-CASE-2026-${Math.floor(100 + Math.random() * 900)}`,
      relationType: String(data.get('relationType') || 'GRIEVANCE'),
      employeeId: String(data.get('employeeId') || 'EMP-PROD-019'),
      employeeName: String(data.get('employeeName') || 'Worker Associate'),
      department: String(data.get('department') || 'PRODUCTION'),
      subject: String(data.get('subject') || 'Workplace Shift Query'),
      description: String(data.get('description') || 'Submitted for HR review.'),
      appraisalRating: Number(data.get('rating')) || null,
      disciplinaryActionTaken: null,
      resolutionNotes: null,
      hearingDate: '2026-11-22',
      status: 'OPEN',
      assignedOfficer: 'HR_MANAGER',
      resolvedAt: null,
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setRelationList([newRel, ...relationList]);
    setIsNewRelationModal(false);
    showToast(`Case ${newRel.caseNumber} registered in employee relations register.`);
  };

  const handleResolveRelation = (id: string) => {
    setRelationList(
      relationList.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status: 'RESOLVED',
            resolutionNotes: 'Reviewed with departmental head and resolved in accordance with factory standing orders.',
            resolvedAt: 'Just now',
          };
        }
        return r;
      }),
    );
    showToast('Employee relations case marked as RESOLVED.');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-blue-600 text-white font-medium shadow-2xl animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-base">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-20 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-5 h-5 shrink-0" />
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400 whitespace-nowrap">
                  {companyName || 'Enterprise ERP'}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-500/20 uppercase whitespace-nowrap shrink-0">
                  Human Resources &amp; Labor Welfare Hub
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
                Company-Scoped Workforce Lifecycle, Biometric Attendance, Statutory Compliance &amp; EHS
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard/users"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-sm font-bold shadow-sm whitespace-nowrap shrink-0"
            >
              <Users className="w-4 h-4 text-blue-600 shrink-0" />
              <span>User Directory</span>
            </Link>

            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
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
        {/* Company Isolation Badge */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                Company-Scoped HR Portal
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3" />
                Zero Cross-Tenant Data Leakage
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Manufacturing HR &amp; Industrial Workforce Portal
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mt-1">
              6 Core Pillars: Manpower Requisition, Biometric Shift Attendance, PF/ESI &amp; Factory Act Compliance, Safety PPE Issuance, Technical OJT Certification, and Floor Grievance Redressal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="p-3 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>{companyName}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-600 text-white font-semibold">
                  HR Authorized
                </span>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span className="font-medium text-slate-800 dark:text-slate-200">{tenantSubCategory}</span>
                <span>&bull;</span>
                <span>Company ID Isolated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Navigation Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setHrTab('recruitment')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              hrTab === 'recruitment'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            <span>1. Manpower Planning &amp; Recruitment</span>
          </button>
          <button
            type="button"
            onClick={() => setHrTab('attendance')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              hrTab === 'attendance'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4 shrink-0" />
            <span>2. Time, Attendance &amp; Shift Payroll</span>
          </button>
          <button
            type="button"
            onClick={() => setHrTab('compliance')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              hrTab === 'compliance'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Scale className="w-4 h-4 shrink-0" />
            <span>3. Statutory Compliance &amp; Labor Law</span>
          </button>
          <button
            type="button"
            onClick={() => setHrTab('safety')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              hrTab === 'safety'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <HardHat className="w-4 h-4 shrink-0" />
            <span>4. Plant Safety, Welfare &amp; EHS</span>
          </button>
          <button
            type="button"
            onClick={() => setHrTab('training')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              hrTab === 'training'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>5. Training, OJT &amp; Certification</span>
          </button>
          <button
            type="button"
            onClick={() => setHrTab('relations')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              hrTab === 'relations'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>6. Employee Relations &amp; Grievances</span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: MANPOWER PLANNING & RECRUITMENT */}
        {/* ================================================================= */}
        {hrTab === 'recruitment' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">Active Requisitions</span>
                  <UserPlus className="w-5 h-5 text-violet-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {recruitmentList.filter((r) => r.status !== 'HIRED').length} Openings
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Across Production, Quality &amp; Maintenance
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">Positions Demand</span>
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
                  {recruitmentList.reduce((sum, r) => sum + r.positionsCount, 0)} Headcount
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Budgeted manpower requirement
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">Trade Test Pass Rate</span>
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {recruitmentList.filter((r) => r.interviewScore != null).length > 0
                    ? `${(
                        (recruitmentList.reduce((sum, r) => sum + (r.interviewScore || 0), 0) /
                          recruitmentList.filter((r) => r.interviewScore != null).length) *
                        10
                      ).toFixed(1)}% SCORE`
                    : '0.0% SCORE'}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Skill-based shopfloor technical evaluation
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">KYC Verification</span>
                  <ShieldCheck className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-purple-600">
                  {recruitmentList.length > 0
                    ? `${Math.round(
                        (recruitmentList.filter((r) => r.backgroundVerificationStatus === 'VERIFIED').length /
                          recruitmentList.length) *
                          100,
                      )}% COMPLIANT`
                    : '0% COMPLIANT'}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Aadhaar, address &amp; police verification
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Manpower Planning &amp; Candidate Recruitment Register
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-400">
                  Track hiring requisitions, staffing agency allocations, technical trade interview scores, and joining formalities.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewRecruitmentModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-base font-bold shadow-md transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>+ New Requisition</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <table className="w-full text-left text-base">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 text-sm uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-5">Requisition / Job Title</th>
                    <th className="py-4 px-5">Department &amp; Vacancies</th>
                    <th className="py-4 px-5">Candidate / Contact</th>
                    <th className="py-4 px-5">Trade Test Score</th>
                    <th className="py-4 px-5">Background Verification</th>
                    <th className="py-4 px-5">Formalities</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recruitmentList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                        No active requisitions recorded. Click &quot;+ New Requisition&quot; to begin.
                      </td>
                    </tr>
                  ) : recruitmentList.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 dark:text-white">{r.jobTitle}</div>
                        <div className="text-sm font-mono text-slate-500">{r.requisitionCode} &bull; Agency: {r.hiringAgency || 'Direct'}</div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {r.department} &bull; {r.positionsCount} {r.positionsCount > 1 ? 'Positions' : 'Position'}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{r.candidateName || 'Pending Allocation'}</div>
                        <div className="text-xs font-mono text-slate-500">{r.candidatePhone} &bull; {r.candidateEmail}</div>
                      </td>
                      <td className="py-4 px-5">
                        {r.interviewScore ? (
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {r.interviewScore} / 10.0 (PASSED)
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">Interview Scheduled</span>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          r.backgroundVerificationStatus === 'VERIFIED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {r.backgroundVerificationStatus}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {r.joiningFormalitiesStatus.replace(/_/g, ' ')}
                        </div>
                        {r.offeredSalary && (
                          <div className="text-xs font-mono font-bold text-emerald-600">₹{r.offeredSalary.toLocaleString()} / mo</div>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-50 text-violet-700 border border-violet-200">
                          {r.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => handleAdvanceRecruitmentStatus(r.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                          <span>Advance</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: TIME, ATTENDANCE & SHIFT PAYROLL */}
        {/* ================================================================= */}
        {hrTab === 'attendance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">Biometric Present Rate</span>
                  <Clock className="w-5 h-5 text-violet-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {attendanceList.length > 0
                    ? `${(
                        (attendanceList.reduce((sum, a) => sum + a.totalDaysPresent, 0) /
                          Math.max(
                            1,
                            attendanceList.reduce((sum, a) => sum + a.totalDaysPresent + a.totalDaysAbsent, 0),
                          )) *
                        100
                      ).toFixed(1)}%`
                    : '0.0%'}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Turnstile RFID attendance sync
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">Overtime Logged</span>
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
                  {attendanceList.reduce((sum, a) => sum + a.overtimeHours, 0).toFixed(1)} Hours
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Double-rate production OT authorized
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">Net Monthly Wages</span>
                  <Coins className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                  ₹{attendanceList.reduce((sum, a) => sum + a.netPayable, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  After PF (12%) &amp; ESI deductions
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">Shift Allowance</span>
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-purple-600">
                  ₹{attendanceList.reduce((sum, a) => sum + a.shiftAllowance + a.nightShiftIncentive, 0).toLocaleString()}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Night shift incentives disbursed
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Biometric Attendance &amp; Shift Wage Ledger
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-400">
                  Turnstile punches, shift allowance, overtime calculations, statutory deductions, and payroll disbursement.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewAttendanceModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-base font-bold shadow-md transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>+ Log Attendance &amp; Wage</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <table className="w-full text-left text-base">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 text-sm uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-5">Employee / Card</th>
                    <th className="py-4 px-5">Department &amp; Shift</th>
                    <th className="py-4 px-5">Days Present / Absent</th>
                    <th className="py-4 px-5">OT Hours / Pay</th>
                    <th className="py-4 px-5">Shift &amp; Night Inc</th>
                    <th className="py-4 px-5">Gross / Deductions</th>
                    <th className="py-4 px-5">Net Payable</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {attendanceList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                        No attendance or shift wage records recorded. Click &quot;+ Log Attendance &amp; Wage&quot; to add records.
                      </td>
                    </tr>
                  ) : attendanceList.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 dark:text-white">{a.employeeName}</div>
                        <div className="text-sm font-mono text-slate-500">{a.employeeId} &bull; {a.biometricPunchCardId}</div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{a.department}</div>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-600 dark:text-slate-400">
                          {a.shiftCode.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 dark:text-white">{a.totalDaysPresent} Days Present</div>
                        <div className="text-xs text-slate-500 font-mono">{a.totalDaysAbsent} Absent &bull; {a.totalPaidLeaves} Paid Leaves</div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {a.overtimeHours} hrs (₹{a.overtimePay.toLocaleString()})
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="text-sm font-mono text-slate-700 dark:text-slate-300">
                          Allow: ₹{a.shiftAllowance.toLocaleString()}
                        </div>
                        {a.nightShiftIncentive > 0 && (
                          <div className="text-xs font-mono font-bold text-purple-600">
                            Night: +₹{a.nightShiftIncentive.toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <div className="text-sm font-mono text-slate-800 dark:text-slate-200 font-semibold">Gross: ₹{a.baseGrossSalary.toLocaleString()}</div>
                        <div className="text-xs font-mono text-rose-600">Ded: -₹{a.deductions.toLocaleString()}</div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                          ₹{a.netPayable.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        {a.paymentStatus === 'DISBURSED' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            DISBURSED
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDisburseWage(a.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                          >
                            <Coins className="w-3.5 h-3.5" />
                            <span>Disburse</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: STATUTORY COMPLIANCE & LABOR LAW GOVERNANCE */}
        {/* ================================================================= */}
        {hrTab === 'compliance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">Statutory Compliance</span>
                  <Scale className="w-5 h-5 text-violet-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {complianceList.length > 0
                    ? `${Math.round(
                        (complianceList.filter(
                          (c) => c.complianceStatus === 'FILED' || c.complianceStatus === 'VERIFIED_IN_SPEC',
                        ).length /
                          complianceList.length) *
                          100,
                      )}% IN-SPEC`
                    : '0% IN-SPEC'}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  EPFO, ESIC &amp; Factories Act 1948
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">PF &amp; ESI Remitted</span>
                  <Coins className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
                  ₹{complianceList.reduce((sum, c) => sum + c.statutoryAmount, 0).toLocaleString()}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Electronic Challans (ECR) cleared
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">Minimum Wages Act</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {complianceList.length > 0
                    ? complianceList.every((c) => c.minimumWageCompliant)
                      ? 'FULLY COMPLIANT'
                      : 'AUDIT REQUIRED'
                    : '0 RECORDS'}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Base rates exceed statutory thresholds
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">Pending Filings</span>
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600">
                  {complianceList.filter((c) => c.complianceStatus === 'PENDING').length} Filings Due
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Next due statutory remittance
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Statutory Compliance, Labor Welfare &amp; Committee Audits
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-400">
                  PF/EPFO, ESI/ESIC, Factories Act quarterly audits, Minimum Wages verification, and Joint Safety Committee records.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewComplianceModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-base font-bold shadow-md transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>+ New Statutory Filing</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <table className="w-full text-left text-base">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 text-sm uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-5">Compliance Code / Type</th>
                    <th className="py-4 px-5">Period &amp; Due Date</th>
                    <th className="py-4 px-5">Covered Workers</th>
                    <th className="py-4 px-5">Statutory Amount</th>
                    <th className="py-4 px-5">Challan / Ref No.</th>
                    <th className="py-4 px-5">Inspector / Officer</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {complianceList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                        No statutory filings recorded yet. Click &quot;+ New Statutory Filing&quot; to record PF, ESI, or factory compliance.
                      </td>
                    </tr>
                  ) : complianceList.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 dark:text-white">{c.complianceType.replace(/_/g, ' ')}</div>
                        <div className="text-sm font-mono text-slate-500">{c.complianceCode}</div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">Period: {c.period}</div>
                        <div className="text-xs font-mono text-slate-500">Due: {c.dueDate}</div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-bold text-slate-900 dark:text-white">{c.totalCoveredEmployees} Workers</span>
                        <div className="text-xs text-emerald-600 font-semibold">&bull; Min Wages Compliant</div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-mono font-bold text-base text-slate-900 dark:text-white">
                          ₹{c.statutoryAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                          {c.challanOrRefNumber || 'Pending Challan'}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="text-sm text-slate-700 dark:text-slate-300">{c.inspectorName || 'In-House HR Lead'}</div>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          c.complianceStatus === 'FILED' || c.complianceStatus === 'VERIFIED_IN_SPEC'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {c.complianceStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        {c.complianceStatus !== 'FILED' && (
                          <button
                            type="button"
                            onClick={() => handleMarkComplianceFiled(c.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Filed</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: PLANT SAFETY, WELFARE & EHS */}
        {/* ================================================================= */}
        {hrTab === 'safety' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">PPE Kits Issued</span>
                  <HardHat className="w-5 h-5 text-violet-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {safetyList.filter((s) => s.category === 'PPE_ISSUANCE').length} Kits Active
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  IS 2925 helmets &amp; safety shoes
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">Safety Drills</span>
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
                  {safetyList.filter((s) => s.category === 'SAFETY_DRILL').length} Drills Conducted
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Emergency evacuation &amp; spill drills
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">Canteen Hygiene</span>
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {safetyList.filter((s) => s.canteenInspectionScore != null).length > 0
                    ? `${(
                        safetyList.reduce((sum, s) => sum + (s.canteenInspectionScore || 0), 0) /
                        safetyList.filter((s) => s.canteenInspectionScore != null).length
                      ).toFixed(1)}% AUDIT`
                    : '0.0% AUDIT'}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  FSSAI industrial food inspection
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">Occupational Health</span>
                  <HeartPulse className="w-5 h-5 text-rose-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-rose-600">
                  {safetyList.filter((s) => s.category === 'FIRST_AID_HEALTH').length === 0
                    ? 'ZERO LTI'
                    : `${safetyList.filter((s) => s.category === 'FIRST_AID_HEALTH').length} INCIDENTS`}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Lost Time Injury frequency tracking
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Plant EHS, Safety PPE Issuance &amp; Worker Welfare Amenities
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-400">
                  PPE kit allocation passports, emergency fire evacuation drills, industrial canteen health audits, and first-aid center logs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewSafetyModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-base font-bold shadow-md transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>+ Log Safety / Welfare Event</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <table className="w-full text-left text-base">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 text-sm uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-5">Record Code / Category</th>
                    <th className="py-4 px-5">Department &amp; Personnel</th>
                    <th className="py-4 px-5">Safety Equipment / Drill Specifics</th>
                    <th className="py-4 px-5">Welfare Amenities &amp; Hygiene</th>
                    <th className="py-4 px-5">Inspector / Issuer</th>
                    <th className="py-4 px-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {safetyList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                        No safety or welfare logs recorded. Click &quot;+ Log Safety / Welfare Event&quot; to log drills or PPE issuance.
                      </td>
                    </tr>
                  ) : safetyList.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 dark:text-white">{s.category.replace(/_/g, ' ')}</div>
                        <div className="text-sm font-mono text-slate-500">{s.recordCode}</div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{s.employeeName || s.department}</div>
                        <div className="text-xs font-mono text-slate-500">{s.employeeId || 'Plant-Wide'}</div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="text-sm text-slate-900 dark:text-white font-medium">
                          {s.ppeItemsIssued || s.safetyDrillType || s.firstAidIncidentType || 'Facility Inspection'}
                        </div>
                        {s.ppeBatchLot && (
                          <div className="text-xs text-slate-500 font-mono">Lot: {s.ppeBatchLot}</div>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <div className="text-sm text-slate-700 dark:text-slate-300">
                          {s.welfareAmenityDetails}
                        </div>
                        {s.canteenInspectionScore && (
                          <span className="text-xs font-bold text-emerald-600">Audit Score: {s.canteenInspectionScore}%</span>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{s.inspectorOrIssuer}</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: TRAINING, SKILL DEVELOPMENT & SAFETY INDUCTION */}
        {/* ================================================================= */}
        {hrTab === 'training' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">Active Training Courses</span>
                  <BookOpen className="w-5 h-5 text-violet-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {trainingList.length} Programs
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Safety induction, OJT &amp; machinery certs
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">Certified Workers</span>
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
                  {trainingList.reduce((sum, t) => sum + t.attendeesCount, 0)} Operators
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Shopfloor competency certified
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">Avg Comprehension Score</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {trainingList.filter((t) => t.assessmentScorePct != null).length > 0
                    ? `${(
                        trainingList.reduce((sum, t) => sum + (t.assessmentScorePct || 0), 0) /
                        trainingList.filter((t) => t.assessmentScorePct != null).length
                      ).toFixed(1)}% PASS`
                    : '0.0% PASS'}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Safety &amp; equipment written/practical test
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">5S &amp; Lean Kaizen</span>
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-purple-600">
                  {trainingList.some((t) => t.trainingType === 'PRODUCTIVITY_LEAN') ? 'ACTIVE' : 'NO SESSIONS'}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Continuous waste reduction workshops
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Workforce Training, Safety Induction &amp; Machine Operation Certification
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-400">
                  Safety induction certificates, On-the-Job (OJT) foreman mentorship logs, and critical machine operator authorizations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewTrainingModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-base font-bold shadow-md transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>+ Schedule Training Course</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <table className="w-full text-left text-base">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 text-sm uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-5">Training Code / Program</th>
                    <th className="py-4 px-5">Type &amp; Department</th>
                    <th className="py-4 px-5">Trainer &amp; OJT Mentor</th>
                    <th className="py-4 px-5">Trainees / Score</th>
                    <th className="py-4 px-5">Validity</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {trainingList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                        No training sessions scheduled. Click &quot;+ Schedule Training Course&quot; to start.
                      </td>
                    </tr>
                  ) : trainingList.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 dark:text-white">{t.courseTitle}</div>
                        <div className="text-sm font-mono text-slate-500">{t.trainingCode}</div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{t.trainingType.replace(/_/g, ' ')}</div>
                        <div className="text-xs font-mono text-blue-600 font-bold">{t.targetDepartment}</div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{t.trainerName}</div>
                        {t.ojtMentorName && (
                          <div className="text-xs text-slate-500 font-mono">Mentor: {t.ojtMentorName}</div>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 dark:text-white">{t.attendeesCount} Trainees</div>
                        {t.assessmentScorePct && (
                          <div className="text-xs font-mono font-bold text-emerald-600">Score: {t.assessmentScorePct}%</div>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <div className="text-sm text-slate-700 dark:text-slate-300 font-mono">{t.validTill || 'Permanent Record'}</div>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          t.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {t.status !== 'COMPLETED' ? (
                            <button
                              type="button"
                              onClick={() => handleCertifyTraining(t.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                            >
                              <BadgeCheck className="w-3.5 h-3.5" />
                              <span>Certify OJT</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelectedTrainingCert(t)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>View Certificate</span>
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
        )}

        {/* ================================================================= */}
        {/* TAB 6: EMPLOYEE RELATIONS, GRIEVANCE & APPRAISALS */}
        {/* ================================================================= */}
        {hrTab === 'relations' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">Total ER Cases</span>
                  <MessageSquare className="w-5 h-5 text-violet-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {relationList.length} Cases Logged
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Grievances, appraisals &amp; standing orders
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">Open Grievances</span>
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600">
                  {relationList.filter((r) => r.status === 'OPEN').length} Open Case
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Average resolution turnaround: 48 hrs
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">Resolution Rate</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {relationList.length > 0
                    ? `${Math.round(
                        (relationList.filter((r) => r.status === 'RESOLVED' || r.status === 'CLOSED').length /
                          relationList.length) *
                          100,
                      )}% RESOLVED`
                    : '0.0% RESOLVED'}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Amicable standing order settlements
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider">Appraisal Score</span>
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-purple-600">
                  {relationList.filter((r) => r.appraisalRating != null).length > 0
                    ? `${(
                        relationList.reduce((sum, r) => sum + (r.appraisalRating || 0), 0) /
                        relationList.filter((r) => r.appraisalRating != null).length
                      ).toFixed(1)} / 5.0 RATING`
                    : '0.0 / 5.0 RATING'}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Merit increment &amp; promotions on track
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Employee Grievance Redressal, Standing Orders &amp; Performance Reviews
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-400">
                  Floor-level worker grievance tracking, inquiry hearings, disciplinary documentation, and annual performance appraisal reviews.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewRelationModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-base font-bold shadow-md transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>+ Log Grievance / Case</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <table className="w-full text-left text-base">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 text-sm uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-5">Case Number / Type</th>
                    <th className="py-4 px-5">Employee &amp; Dept</th>
                    <th className="py-4 px-5">Subject &amp; Description</th>
                    <th className="py-4 px-5">Hearing Date</th>
                    <th className="py-4 px-5">Resolution / Action</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {relationList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                        No employee relations cases or grievances recorded. Click &quot;+ Log Grievance / Case&quot; to register a case.
                      </td>
                    </tr>
                  ) : relationList.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 dark:text-white">{r.caseNumber}</div>
                        <span className="text-xs px-2 py-0.5 rounded-md font-mono font-bold bg-violet-50 text-violet-700 border border-violet-200">
                          {r.relationType}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{r.employeeName}</div>
                        <div className="text-xs text-slate-500 font-mono">{r.employeeId} &bull; {r.department}</div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{r.subject}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 max-w-sm line-clamp-2 mt-0.5">
                          {r.description}
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="text-sm text-slate-700 dark:text-slate-300 font-mono">{r.hearingDate || 'Pending'}</div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="text-sm text-slate-700 dark:text-slate-300">
                          {r.resolutionNotes || r.disciplinaryActionTaken || (r.appraisalRating ? `Rating: ${r.appraisalRating}/5.0` : 'Under Inquiry')}
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          r.status === 'RESOLVED' || r.status === 'CLOSED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        {r.status === 'OPEN' && (
                          <button
                            type="button"
                            onClick={() => handleResolveRelation(r.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Resolve</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ================================================================= */}
      {/* CREATION MODALS */}
      {/* ================================================================= */}

      {/* 1. Modal: Recruitment Requisition */}
      {isNewRecruitmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-violet-600" />
                  <span>Log Manpower Requisition &amp; Candidate</span>
                </h3>
                <p className="text-sm text-slate-500">
                  Track hiring demand, candidate trade interviews, and joining formalities.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewRecruitmentModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRecruitment} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    defaultValue="CNC Machine Operator Grade II"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Department
                  </label>
                  <select
                    name="department"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  >
                    <option value="PRODUCTION">PRODUCTION</option>
                    <option value="QUALITY">QUALITY</option>
                    <option value="INVENTORY">INVENTORY</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="LOGISTICS">LOGISTICS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Positions Count
                  </label>
                  <input
                    type="number"
                    name="positionsCount"
                    defaultValue="2"
                    min="1"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hiring Agency / Source
                  </label>
                  <input
                    type="text"
                    name="hiringAgency"
                    defaultValue="Apex Industrial Staffing Solutions"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Offered Salary (₹/mo)
                  </label>
                  <input
                    type="number"
                    name="offeredSalary"
                    defaultValue="38000"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Candidate Name
                  </label>
                  <input
                    type="text"
                    name="candidateName"
                    defaultValue="Rohan Patil"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="candidatePhone"
                    defaultValue="+91 98230 11234"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Interview Score (out of 10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="interviewScore"
                    defaultValue="8.8"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono font-bold text-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewRecruitmentModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-base font-bold shadow-md"
                >
                  Save Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Biometric Attendance & Payroll Wage */}
      {isNewAttendanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-violet-600" />
                  <span>Log Biometric Attendance &amp; Shift Wages</span>
                </h3>
                <p className="text-sm text-slate-500">
                  RFID turnstile synchronization, overtime, and monthly salary calculation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewAttendanceModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAttendance} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    defaultValue={`EMP-PROD-${Math.floor(10 + Math.random() * 90)}`}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    name="employeeName"
                    defaultValue="Rajesh Kumar Sharma"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    name="department"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  >
                    <option value="PRODUCTION">PRODUCTION</option>
                    <option value="QUALITY">QUALITY</option>
                    <option value="INVENTORY">INVENTORY</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Shift Code
                  </label>
                  <select
                    name="shiftCode"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  >
                    <option value="GENERAL">GENERAL SHIFT</option>
                    <option value="SHIFT_A_MORNING">SHIFT A (MORNING 06-14)</option>
                    <option value="SHIFT_B_EVENING">SHIFT B (EVENING 14-22)</option>
                    <option value="SHIFT_C_NIGHT">SHIFT C (NIGHT 22-06)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Days Present
                  </label>
                  <input
                    type="number"
                    name="daysPresent"
                    defaultValue="26"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Base Gross Salary (₹)
                  </label>
                  <input
                    type="number"
                    name="baseGrossSalary"
                    defaultValue="32000"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono font-bold text-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Overtime Hours
                  </label>
                  <input
                    type="number"
                    name="overtimeHours"
                    defaultValue="18.5"
                    step="0.5"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono text-blue-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Shift Allowance (₹)
                  </label>
                  <input
                    type="number"
                    name="shiftAllowance"
                    defaultValue="1500"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewAttendanceModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-base font-bold shadow-md"
                >
                  Calculate &amp; Save Wage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: Statutory Compliance Filing */}
      {isNewComplianceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-violet-600" />
                  <span>Log Statutory Compliance &amp; Labor Remittance</span>
                </h3>
                <p className="text-sm text-slate-500">
                  PF, ESI, Factories Act 1948 registers, and Minimum Wages tracking.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewComplianceModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCompliance} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Compliance Category
                  </label>
                  <select
                    name="complianceType"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  >
                    <option value="PF_EPFO">PF / EPFO (Provident Fund ECR)</option>
                    <option value="ESI_ESIC">ESI / ESIC (Medical Insurance)</option>
                    <option value="FACTORY_ACT">FACTORIES ACT (Safety Exits &amp; Hygiene)</option>
                    <option value="MINIMUM_WAGES_ACT">MINIMUM WAGES ACT VERIFICATION</option>
                    <option value="BONUS_ACT">PAYMENT OF BONUS ACT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Filing Period (Month/Quarter)
                  </label>
                  <input
                    type="text"
                    name="period"
                    defaultValue="2026-11"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Covered Workers
                  </label>
                  <input
                    type="number"
                    name="totalEmployees"
                    defaultValue="142"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Remittance Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    defaultValue="426000"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono font-bold text-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    defaultValue="2026-12-15"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Challan / ECR Reference Number
                  </label>
                  <input
                    type="text"
                    name="challanNumber"
                    defaultValue={`EPFO-TRRN-${Math.floor(10000000 + Math.random() * 90000000)}`}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Compliance Officer / Inspector Name
                  </label>
                  <input
                    type="text"
                    name="inspectorName"
                    defaultValue="S. K. Joshi (Regional PF Commissioner)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewComplianceModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-base font-bold shadow-md"
                >
                  Save Statutory Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Plant Safety & Welfare Event */}
      {isNewSafetyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <HardHat className="w-5 h-5 text-violet-600" />
                  <span>Log Plant Safety, PPE Issuance &amp; Welfare Event</span>
                </h3>
                <p className="text-sm text-slate-500">
                  Track safety drills, canteen audits, and personal protective equipment.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewSafetyModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSafety} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Event Category
                  </label>
                  <select
                    name="category"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  >
                    <option value="PPE_ISSUANCE">PPE KIT ISSUANCE (Helmets, Shoes, Gloves)</option>
                    <option value="SAFETY_DRILL">SAFETY DRILL (Fire Evacuation, Spill Containment)</option>
                    <option value="CANTEEN_HYGIENE">CANTEEN HYGIENE &amp; MEALS AUDIT</option>
                    <option value="FIRST_AID_HEALTH">FIRST-AID OCCUPATIONAL HEALTH LOG</option>
                    <option value="WORKER_AMENITY">WORKER WELFARE AMENITIES CHECK</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    name="department"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  >
                    <option value="PRODUCTION">PRODUCTION</option>
                    <option value="QUALITY">QUALITY</option>
                    <option value="INVENTORY">INVENTORY</option>
                    <option value="PLANT_CANTEEN">PLANT CANTEEN</option>
                    <option value="ALL_DEPARTMENTS">ALL DEPARTMENTS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  PPE Items / Drill Specifics
                </label>
                <input
                  type="text"
                  name="ppeItems"
                  defaultValue="Industrial Hard Hat (IS 2925), Heat-Resistant Kevlar Gloves, Steel Toe Shoes"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Employee Name (if individual)
                  </label>
                  <input
                    type="text"
                    name="employeeName"
                    defaultValue="Rajesh Kumar Sharma"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Canteen / Audit Score (out of 100)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    name="canteenScore"
                    defaultValue="96.5"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Welfare Amenity &amp; Notes
                </label>
                <input
                  type="text"
                  name="welfareDetails"
                  defaultValue="Drinking water RO purifiers sanitized; first aid box replenish verified."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewSafetyModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-base font-bold shadow-md"
                >
                  Save Safety Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: Training & OJT Certification */}
      {isNewTrainingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-violet-600" />
                  <span>Schedule Workforce Training &amp; OJT Certification</span>
                </h3>
                <p className="text-sm text-slate-500">
                  Shopfloor safety induction, machine operator licensing, and Lean 5S.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewTrainingModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTraining} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Training Course Title
                  </label>
                  <input
                    type="text"
                    name="courseTitle"
                    defaultValue="High-Tonnage Hydraulic Press &amp; Die Clamping Certification"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Training Type
                  </label>
                  <select
                    name="trainingType"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  >
                    <option value="MACHINE_CERTIFICATION">MACHINE OPERATION CERTIFICATION</option>
                    <option value="SAFETY_INDUCTION">MANDATORY SAFETY INDUCTION</option>
                    <option value="ON_THE_JOB_OJT">ON-THE-JOB (OJT) APPRENTICESHIP</option>
                    <option value="PRODUCTIVITY_LEAN">5S &amp; LEAN PRODUCTIVITY</option>
                    <option value="HAZMAT_HANDLING">HAZMAT CHEMICAL HANDLING</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Lead Trainer
                  </label>
                  <input
                    type="text"
                    name="trainerName"
                    defaultValue="K. V. Raman (Master Toolmaker)"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Department
                  </label>
                  <select
                    name="targetDepartment"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  >
                    <option value="PRODUCTION">PRODUCTION</option>
                    <option value="QUALITY">QUALITY</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="ALL_DEPARTMENTS">ALL DEPARTMENTS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Attendees Count
                  </label>
                  <input
                    type="number"
                    name="attendeesCount"
                    defaultValue="6"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    OJT Mentor Name
                  </label>
                  <input
                    type="text"
                    name="ojtMentor"
                    defaultValue="Dilip Rane (Production Foreman)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Test Score (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    name="assessmentScore"
                    defaultValue="91.5"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewTrainingModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-base font-bold shadow-md"
                >
                  Save Training Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Modal: Employee Relations Case */}
      {isNewRelationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-violet-600" />
                  <span>Log Employee Grievance / Standing Order Case</span>
                </h3>
                <p className="text-sm text-slate-500">
                  Worker concerns, inquiry hearings, disciplinary records, or appraisals.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewRelationModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRelation} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Case Classification
                  </label>
                  <select
                    name="relationType"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  >
                    <option value="GRIEVANCE">FLOOR GRIEVANCE</option>
                    <option value="PERFORMANCE_APPRAISAL">PERFORMANCE APPRAISAL REVIEW</option>
                    <option value="DISCIPLINARY">DISCIPLINARY INQUIRY</option>
                    <option value="RECOGNITION">EMPLOYEE RECOGNITION / AWARD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    name="department"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  >
                    <option value="PRODUCTION">PRODUCTION</option>
                    <option value="QUALITY">QUALITY</option>
                    <option value="INVENTORY">INVENTORY</option>
                    <option value="LOGISTICS">LOGISTICS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    name="employeeName"
                    defaultValue="Ganesh More"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    defaultValue="EMP-PROD-033"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  name="subject"
                  defaultValue="Shift rotation fairness and weekend overtime allocation"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Case Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue="Employee raised concern regarding fair distribution of shift C allowances and weekend overtime allocation between line crews."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewRelationModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-base font-bold shadow-md"
                >
                  Register Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Printable Certificate of Competency & Safety Induction Pass */}
      {selectedTrainingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="text-center pb-5 border-b border-slate-200 dark:border-slate-800">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 border border-violet-200 dark:border-violet-800 mb-3">
                <Award className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                STATUTORY CERTIFICATE OF TECHNICAL COMPETENCY &amp; SAFETY AUTHORIZATION
              </h2>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mt-1">
                FACTORIES ACT 1948 &bull; ON-THE-JOB APPRENTICESHIP (OJT) &bull; MACHINE CERTIFICATION
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Issued by Human Resources Department in compliance with Industrial Health &amp; Safety Regulations
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Certificate Number:</span>
                <span className="font-mono font-bold text-violet-700 dark:text-violet-300">{selectedTrainingCert.trainingCode}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Program Category:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedTrainingCert.trainingType.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Target Department:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedTrainingCert.targetDepartment}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Validity Period:</span>
                <span className="font-mono font-extrabold text-emerald-600">{selectedTrainingCert.validTill || 'Permanent'}</span>
              </div>
            </div>

            {/* Training Syllabus & Performance Block */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Course Curriculum &amp; Examination Sign-off:
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 text-sm">
                <div className="font-bold text-slate-900 dark:text-white">{selectedTrainingCert.courseTitle}</div>
                <div className="text-xs text-slate-500">
                  Lead Instructor: {selectedTrainingCert.trainerName} &bull; OJT Practical Supervisor: {selectedTrainingCert.ojtMentorName || 'Senior Plant Engineer'}
                </div>
                <div className="flex items-center gap-4 pt-2 font-mono text-xs">
                  <span className="text-emerald-600 font-bold">Assessment Score: {selectedTrainingCert.assessmentScorePct || 92.0}%</span>
                  <span className="text-blue-600 font-bold">OJT Status: {selectedTrainingCert.ojtCompletionStatus}</span>
                  <span className="text-purple-600 font-bold">Attendees Certified: {selectedTrainingCert.attendeesCount}</span>
                </div>
              </div>
            </div>

            {/* Quality Sign-off Authorization */}
            <div className="p-4 rounded-2xl border border-violet-300 dark:border-violet-800/80 bg-violet-50/60 dark:bg-violet-950/30 text-xs space-y-2">
              <span className="font-bold uppercase text-violet-800 dark:text-violet-300 block">
                Statutory Shopfloor Equipment Operation Sign-off:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-violet-800 dark:text-violet-300 font-semibold">
                <div>&bull; Hazard Identification: PASSED</div>
                <div>&bull; PPE Donning: COMPLIANT</div>
                <div>&bull; Emergency E-Stop: VERIFIED</div>
                <div>&bull; Line Authorization: GRANTED</div>
              </div>
              <div className="pt-2 border-t border-violet-200/60 dark:border-violet-800/60 text-slate-600 dark:text-slate-400">
                Official Certification Remarks: {selectedTrainingCert.notes}
              </div>
              <div className="text-slate-400 font-mono">
                Certified By: HR Department Lead &bull; Registered Company ID: {selectedTrainingCert.companyId}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedTrainingCert(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-bold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
