'use client';

import React, { useState, useEffect, useMemo, FormEvent } from 'react';
import Link from 'next/link';
import {
  Users,
  Factory,
  Package,
  ShieldCheck,
  Box,
  ShieldAlert,
  TrendingUp,
  Wrench,
  ShoppingCart,
  Crown,
  Search,
  Plus,
  Edit3,
  Trash2,
  Power,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle2,
  X,
  Lock,
  Mail,
  User,
  Building2,
  Loader2,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Shield,
  LogIn,
  Scale,
  FlaskConical,
  RefreshCw,
  Flame,
  FileText,
  ArrowRight,
  HardHat,
  Award,
  Layers,
  Sparkles,
  Recycle,
  Activity,
  Truck,
  AlertTriangle,
  FileCheck2,
  Palette,
  Paintbrush,
  Droplet,
} from 'lucide-react';
import {
  DepartmentKey,
  DesignationKey,
  DESIGNATION_LABELS,
  EmployeeRecord,
  MANUFACTURING_DEPARTMENTS,
  PAINT_SPECIALIZED_ROLES,
  STEEL_SPECIALIZED_ROLES,
  GLASS_SPECIALIZED_ROLES,
  CHEMICAL_SPECIALIZED_ROLES,
  ALL_SPECIALIZED_ROLES,
  SpecializedRole,
  resolveRoleLabel,
} from '../../../types/rbac';
import { UserPayload } from '../../../types/auth';

const DEPARTMENT_ICONS: Record<DepartmentKey, React.ComponentType<{ className?: string }>> = {
  EXECUTIVE: Crown,
  PRODUCTION: Factory,
  INVENTORY: Package,
  QUALITY: ShieldCheck,
  PACKING: Box,
  SECURITY: ShieldAlert,
  HR: Users,
  SALES: TrendingUp,
  MACHINE_MAINTENANCE: Wrench,
  PURCHASING_SOURCING: ShoppingCart,
};

const DEPARTMENT_BADGE_STYLES: Record<DepartmentKey, string> = {
  EXECUTIVE: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  PRODUCTION: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
  INVENTORY: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
  QUALITY: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  PACKING: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
  SECURITY: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
  HR: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
  SALES: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30',
  MACHINE_MAINTENANCE: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30',
  PURCHASING_SOURCING: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30',
};

const SPECIALIZED_ROLE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  // Process & Chemical - Paint Sub-category
  COLOR_LAB_SHADE_MANAGER: Palette,
  PIGMENT_RESIN_DISPERSION_MANAGER: RefreshCw,
  QUALITY_RHEOLOGY_MANAGER: FlaskConical,
  BASE_STOCK_TINTING_MANAGER: Droplet,
  FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER: Box,
  // Process & Chemical Industries
  RD_FORMULA_CHEMIST_MANAGER: FlaskConical,
  EHS_HAZMAT_MANAGER: AlertTriangle,
  QA_ANALYTICAL_LAB_MANAGER: FileCheck2,
  REACTOR_BATCH_PRODUCTION_MANAGER: Activity,
  HAZARDOUS_LOGISTICS_MANAGER: Truck,
  // Steel & Heavy Metals
  WEIGHBRIDGE_LOGISTICS_MANAGER: Scale,
  METALLURGY_LAB_INCHARGE: FlaskConical,
  SUBCONTRACTING_JOBWORK_MANAGER: RefreshCw,
  EHS_SAFETY_MANAGER: Flame,
  // Glass & Ceramic Production
  BATCH_HOUSE_MANAGER: Layers,
  KILN_FURNACE_MANAGER: Flame,
  MOULD_TOOLING_MANAGER: Wrench,
  THERMAL_QUALITY_INCHARGE: ShieldCheck,
  CULLET_RECOVERY_MANAGER: Recycle,
};

const SAMPLE_WORKFORCE_SEED: EmployeeRecord[] = [
  {
    id: 'demo-1',
    employeeCode: 'EXEC-001',
    firstName: 'Vikram',
    lastName: 'Mehta',
    email: 'ceo@apexmanufacturing.com',
    username: 'vikram_ceo',
    department: 'EXECUTIVE',
    designation: 'CEO',
    role: 'CEO',
    isActive: true,
    lastLoginAt: new Date().toISOString(),
  },
  // Paint & Coatings Specialized Roles
  {
    id: 'demo-paint-cls',
    employeeCode: 'PNT-CLS-001',
    firstName: 'Aditya',
    lastName: 'Verma',
    email: 'color.lab@apexmanufacturing.com',
    username: 'aditya_shade',
    department: 'QUALITY',
    designation: 'COLOR_LAB_SHADE_MANAGER',
    role: 'COLOR_LAB_SHADE_MANAGER',
    isActive: true,
    specializedSector: 'Paint & Coatings',
  },
  {
    id: 'demo-paint-prd',
    employeeCode: 'PNT-PRD-001',
    firstName: 'Rohan',
    lastName: 'Deshmukh',
    email: 'dispersion@apexmanufacturing.com',
    username: 'rohan_grind',
    department: 'PRODUCTION',
    designation: 'PIGMENT_RESIN_DISPERSION_MANAGER',
    role: 'PIGMENT_RESIN_DISPERSION_MANAGER',
    isActive: true,
    specializedSector: 'Paint & Coatings',
  },
  {
    id: 'demo-paint-qrm',
    employeeCode: 'PNT-QRM-001',
    firstName: 'Sneha',
    lastName: 'Pillai',
    email: 'rheology.qc@apexmanufacturing.com',
    username: 'sneha_rheology',
    department: 'QUALITY',
    designation: 'QUALITY_RHEOLOGY_MANAGER',
    role: 'QUALITY_RHEOLOGY_MANAGER',
    isActive: true,
    specializedSector: 'Paint & Coatings',
  },
  {
    id: 'demo-paint-bst',
    employeeCode: 'PNT-BST-001',
    firstName: 'Karthik',
    lastName: 'Sundaram',
    email: 'base.tinting@apexmanufacturing.com',
    username: 'karthik_dispenser',
    department: 'INVENTORY',
    designation: 'BASE_STOCK_TINTING_MANAGER',
    role: 'BASE_STOCK_TINTING_MANAGER',
    isActive: true,
    specializedSector: 'Paint & Coatings',
  },
  {
    id: 'demo-paint-fpc',
    employeeCode: 'PNT-FPC-001',
    firstName: 'Manoj',
    lastName: 'Tiwari',
    email: 'paint.packaging@apexmanufacturing.com',
    username: 'manoj_packaging',
    department: 'PACKING',
    designation: 'FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER',
    role: 'FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER',
    isActive: true,
    specializedSector: 'Paint & Coatings',
  },
  // Process & Chemical Industries Specialized Roles
  {
    id: 'demo-chem-rd',
    employeeCode: 'CHEM-RD-001',
    firstName: 'Dr. Rajesh',
    lastName: 'Varma',
    email: 'rd.chemist@apexmanufacturing.com',
    username: 'rajesh_formula',
    department: 'PRODUCTION',
    designation: 'RD_FORMULA_CHEMIST_MANAGER',
    role: 'RD_FORMULA_CHEMIST_MANAGER',
    isActive: true,
    specializedSector: 'Process & Chemical Industries',
  },
  {
    id: 'demo-chem-ehs',
    employeeCode: 'CHEM-EHS-001',
    firstName: 'Anita',
    lastName: 'Desai',
    email: 'ehs.hazmat@apexmanufacturing.com',
    username: 'anita_hazmat',
    department: 'SECURITY',
    designation: 'EHS_HAZMAT_MANAGER',
    role: 'EHS_HAZMAT_MANAGER',
    isActive: true,
    specializedSector: 'Process & Chemical Industries',
  },
  {
    id: 'demo-chem-qa',
    employeeCode: 'CHEM-QA-001',
    firstName: 'Dr. Sandeep',
    lastName: 'Kulkarni',
    email: 'qa.lab@apexmanufacturing.com',
    username: 'sandeep_qalab',
    department: 'QUALITY',
    designation: 'QA_ANALYTICAL_LAB_MANAGER',
    role: 'QA_ANALYTICAL_LAB_MANAGER',
    isActive: true,
    specializedSector: 'Process & Chemical Industries',
  },
  {
    id: 'demo-chem-rb',
    employeeCode: 'CHEM-RB-001',
    firstName: 'Manoj',
    lastName: 'Tiwari',
    email: 'reactor.batch@apexmanufacturing.com',
    username: 'manoj_reactor',
    department: 'PRODUCTION',
    designation: 'REACTOR_BATCH_PRODUCTION_MANAGER',
    role: 'REACTOR_BATCH_PRODUCTION_MANAGER',
    isActive: true,
    specializedSector: 'Process & Chemical Industries',
  },
  {
    id: 'demo-chem-dg',
    employeeCode: 'CHEM-DG-001',
    firstName: 'Gurpreet',
    lastName: 'Singh',
    email: 'hazmat.logistics@apexmanufacturing.com',
    username: 'gurpreet_hazmat',
    department: 'INVENTORY',
    designation: 'HAZARDOUS_LOGISTICS_MANAGER',
    role: 'HAZARDOUS_LOGISTICS_MANAGER',
    isActive: true,
    specializedSector: 'Process & Chemical Industries',
  },
  // Glass & Ceramic Specialized Roles
  {
    id: 'demo-glass-bh',
    employeeCode: 'GLAS-BH-001',
    firstName: 'Dr. Alok',
    lastName: 'Verma',
    email: 'batch.house@apexmanufacturing.com',
    username: 'alok_batch',
    department: 'PRODUCTION',
    designation: 'BATCH_HOUSE_MANAGER',
    role: 'BATCH_HOUSE_MANAGER',
    isActive: true,
    specializedSector: 'Glass & Ceramic Production',
  },
  {
    id: 'demo-glass-kf',
    employeeCode: 'GLAS-KF-001',
    firstName: 'Kavita',
    lastName: 'Sen',
    email: 'kiln.furnace@apexmanufacturing.com',
    username: 'kavita_kiln',
    department: 'PRODUCTION',
    designation: 'KILN_FURNACE_MANAGER',
    role: 'KILN_FURNACE_MANAGER',
    isActive: true,
    specializedSector: 'Glass & Ceramic Production',
  },
  {
    id: 'demo-glass-mt',
    employeeCode: 'GLAS-MT-001',
    firstName: 'Mahesh',
    lastName: 'Kulkarni',
    email: 'mould.tooling@apexmanufacturing.com',
    username: 'mahesh_mould',
    department: 'MACHINE_MAINTENANCE',
    designation: 'MOULD_TOOLING_MANAGER',
    role: 'MOULD_TOOLING_MANAGER',
    isActive: true,
    specializedSector: 'Glass & Ceramic Production',
  },
  {
    id: 'demo-glass-tq',
    employeeCode: 'GLAS-TQ-001',
    firstName: 'Sunita',
    lastName: 'Rao',
    email: 'thermal.qc@apexmanufacturing.com',
    username: 'sunita_thermal',
    department: 'QUALITY',
    designation: 'THERMAL_QUALITY_INCHARGE',
    role: 'THERMAL_QUALITY_INCHARGE',
    isActive: true,
    specializedSector: 'Glass & Ceramic Production',
  },
  {
    id: 'demo-glass-cr',
    employeeCode: 'GLAS-CR-001',
    firstName: 'Devendra',
    lastName: 'Joshi',
    email: 'cullet.recovery@apexmanufacturing.com',
    username: 'devendra_cullet',
    department: 'PRODUCTION',
    designation: 'CULLET_RECOVERY_MANAGER',
    role: 'CULLET_RECOVERY_MANAGER',
    isActive: true,
    specializedSector: 'Glass & Ceramic Production',
  },
  // Steel & Heavy Metals Specialized Roles
  {
    id: 'demo-steel-wb',
    employeeCode: 'STEE-WB-001',
    firstName: 'Ramesh',
    lastName: 'Kulkarni',
    email: 'weighbridge@apexmanufacturing.com',
    username: 'ramesh_weighbridge',
    department: 'INVENTORY',
    designation: 'WEIGHBRIDGE_LOGISTICS_MANAGER',
    role: 'WEIGHBRIDGE_LOGISTICS_MANAGER',
    isActive: true,
    specializedSector: 'Steel & Heavy metals',
  },
  {
    id: 'demo-steel-qc',
    employeeCode: 'STEE-QC-001',
    firstName: 'Dr. Bannerjee',
    lastName: 'Metallurgist',
    email: 'metallurgy.lab@apexmanufacturing.com',
    username: 'alok_metallurgy',
    department: 'QUALITY',
    designation: 'METALLURGY_LAB_INCHARGE',
    role: 'METALLURGY_LAB_INCHARGE',
    isActive: true,
    specializedSector: 'Steel & Heavy metals',
  },
  {
    id: 'demo-steel-jw',
    employeeCode: 'STEE-JW-001',
    firstName: 'Arvind',
    lastName: 'Deshmukh',
    email: 'jobwork@apexmanufacturing.com',
    username: 'arvind_jobwork',
    department: 'PRODUCTION',
    designation: 'SUBCONTRACTING_JOBWORK_MANAGER',
    role: 'SUBCONTRACTING_JOBWORK_MANAGER',
    isActive: true,
    specializedSector: 'Steel & Heavy metals',
  },
  {
    id: 'demo-steel-ehs',
    employeeCode: 'STEE-EHS-001',
    firstName: 'Balwinder',
    lastName: 'Singh',
    email: 'ehs.safety@apexmanufacturing.com',
    username: 'balwinder_ehs',
    department: 'SECURITY',
    designation: 'EHS_SAFETY_MANAGER',
    role: 'EHS_SAFETY_MANAGER',
    isActive: true,
    specializedSector: 'Steel & Heavy metals',
  },
  // Core Department Managers
  {
    id: 'demo-2',
    employeeCode: 'PROD-001',
    firstName: 'Rajesh',
    lastName: 'Sharma',
    email: 'prod.mgr@apexmanufacturing.com',
    username: 'rajesh_prod',
    department: 'PRODUCTION',
    designation: 'MANAGER',
    role: 'PRODUCTION_MANAGER',
    isActive: true,
  },
  {
    id: 'demo-3',
    employeeCode: 'HR-001',
    firstName: 'Priya',
    lastName: 'Nair',
    email: 'hr.mgr@apexmanufacturing.com',
    username: 'priya_hr',
    department: 'HR',
    designation: 'MANAGER',
    role: 'HR_MANAGER',
    isActive: true,
  },
];

export default function UserManagementPage() {
  // Theme state (strictly defaults to Light)
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Auth & API state
  const [currentUser, setCurrentUser] = useState<UserPayload | null>(null);
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Filters & Navigation
  const [activeTab, setActiveTab] = useState<'directory' | 'matrix' | 'paint_roles' | 'chemical_roles' | 'glass_roles' | 'steel_roles'>('directory');
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentKey | 'ALL' | 'PAINT_SPECIALIZED' | 'CHEMICAL_SPECIALIZED' | 'STEEL_SPECIALIZED' | 'GLASS_SPECIALIZED'>('ALL');
  const [selectedDesignation, setSelectedDesignation] = useState<DesignationKey | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Alerts
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [bannerSuccess, setBannerSuccess] = useState<string | null>(null);

  // Modal State (Add or Edit Role)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Modal Form Fields
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');

  // Modal Specialized Role Picker: 'NONE' | 'PAINT' | 'CHEMICAL' | 'GLASS' | 'STEEL'
  const [formSpecializedCategory, setFormSpecializedCategory] = useState<'NONE' | 'PAINT' | 'CHEMICAL' | 'GLASS' | 'STEEL'>('PAINT');
  const [formSpecializedRole, setFormSpecializedRole] = useState<string>('COLOR_LAB_SHADE_MANAGER');
  const [formDepartment, setFormDepartment] = useState<DepartmentKey>('QUALITY');
  const [formDesignation, setFormDesignation] = useState<DesignationKey>('COLOR_LAB_SHADE_MANAGER');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Strictly default to Light mode unless explicitly saved as 'dark'
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

    fetchEmployees();
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

  const fetchEmployees = async () => {
    setIsLoading(true);
    setBannerError(null);
    const token = localStorage.getItem('access_token');

    if (!token) {
      setIsPreviewMode(true);
      setEmployees(SAMPLE_WORKFORCE_SEED);
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      const userList = Array.isArray(data) ? data : (data.users || []);
      if (Array.isArray(userList) && userList.length > 0) {
        setEmployees(userList);
        setIsPreviewMode(false);
      } else if (data.users && Array.isArray(data.users)) {
        setEmployees(data.users);
        setIsPreviewMode(false);
      } else {
        setEmployees(SAMPLE_WORKFORCE_SEED);
        setIsPreviewMode(true);
      }
    } catch {
      setIsPreviewMode(true);
      setEmployees(SAMPLE_WORKFORCE_SEED);
    } finally {
      setIsLoading(false);
    }
  };

  // Department counts
  const departmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    let paintCount = 0;
    let chemicalCount = 0;
    let steelCount = 0;
    let glassCount = 0;

    employees.forEach((e) => {
      counts[e.department] = (counts[e.department] || 0) + 1;
      if (
        e.specializedSector === 'Paint' ||
        e.specializedSector === 'Paint & Coatings' ||
        PAINT_SPECIALIZED_ROLES.some((pr) => pr.role === e.role || pr.designationKey === e.designation)
      ) {
        paintCount += 1;
      }
      if (
        e.specializedSector === 'Chemicals' ||
        e.specializedSector === 'Chemical Industries' ||
        e.specializedSector === 'Process & Chemical Industries' ||
        CHEMICAL_SPECIALIZED_ROLES.some((cr) => cr.role === e.role || cr.designationKey === e.designation)
      ) {
        chemicalCount += 1;
      }
      if (
        e.specializedSector === 'Steel and Heavy Metals' ||
        e.specializedSector === 'Steel & Heavy metals' ||
        STEEL_SPECIALIZED_ROLES.some((sr) => sr.role === e.role || sr.designationKey === e.designation)
      ) {
        steelCount += 1;
      }
      if (
        e.specializedSector === 'Glass and Ceramic' ||
        e.specializedSector === 'Glass & Ceramic Production' ||
        GLASS_SPECIALIZED_ROLES.some((gr) => gr.role === e.role || gr.designationKey === e.designation)
      ) {
        glassCount += 1;
      }
    });

    counts['PAINT_SPECIALIZED'] = paintCount;
    counts['CHEMICAL_SPECIALIZED'] = chemicalCount;
    counts['STEEL_SPECIALIZED'] = steelCount;
    counts['GLASS_SPECIALIZED'] = glassCount;
    return counts;
  }, [employees]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (selectedDepartment === 'PAINT_SPECIALIZED') {
        const isPaint =
          emp.specializedSector === 'Paint' ||
          emp.specializedSector === 'Paint & Coatings' ||
          PAINT_SPECIALIZED_ROLES.some((pr) => pr.role === emp.role || pr.designationKey === emp.designation);
        if (!isPaint) return false;
      } else if (selectedDepartment === 'CHEMICAL_SPECIALIZED') {
        const isChemical =
          emp.specializedSector === 'Chemicals' ||
          emp.specializedSector === 'Chemical Industries' ||
          emp.specializedSector === 'Process & Chemical Industries' ||
          CHEMICAL_SPECIALIZED_ROLES.some((cr) => cr.role === emp.role || cr.designationKey === emp.designation);
        if (!isChemical) return false;
      } else if (selectedDepartment === 'STEEL_SPECIALIZED') {
        const isSteel =
          emp.specializedSector === 'Steel and Heavy Metals' ||
          emp.specializedSector === 'Steel & Heavy metals' ||
          STEEL_SPECIALIZED_ROLES.some((sr) => sr.role === emp.role || sr.designationKey === emp.designation);
        if (!isSteel) return false;
      } else if (selectedDepartment === 'GLASS_SPECIALIZED') {
        const isGlass =
          emp.specializedSector === 'Glass and Ceramic' ||
          emp.specializedSector === 'Glass & Ceramic Production' ||
          GLASS_SPECIALIZED_ROLES.some((gr) => gr.role === emp.role || gr.designationKey === emp.designation);
        if (!isGlass) return false;
      } else if (selectedDepartment !== 'ALL') {
        if (emp.department !== selectedDepartment) return false;
      }

      if (selectedDesignation !== 'ALL' && emp.designation !== selectedDesignation) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase();
        const matches =
          fullName.includes(q) ||
          emp.email.toLowerCase().includes(q) ||
          (emp.username && emp.username.toLowerCase().includes(q)) ||
          (emp.employeeCode && emp.employeeCode.toLowerCase().includes(q)) ||
          (emp.role && emp.role.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [employees, selectedDepartment, selectedDesignation, searchQuery]);

  // Active specialized role details
  const activeSpecializedRoleMeta = useMemo(() => {
    return (
      ALL_SPECIALIZED_ROLES.find((r) => r.role === formSpecializedRole) ||
      PAINT_SPECIALIZED_ROLES[0]
    );
  }, [formSpecializedRole]);

  const handleSelectSpecializedRole = (roleKey: string) => {
    setFormSpecializedRole(roleKey);
    const found = ALL_SPECIALIZED_ROLES.find((r) => r.role === roleKey);
    if (found) {
      setFormDepartment(found.associatedDepartment);
      setFormDesignation(found.designationKey);
    }
  };

  const handleSelectSpecializedCategory = (cat: 'NONE' | 'PAINT' | 'CHEMICAL' | 'GLASS' | 'STEEL') => {
    setFormSpecializedCategory(cat);
    if (cat === 'PAINT') {
      handleSelectSpecializedRole('COLOR_LAB_SHADE_MANAGER');
    } else if (cat === 'CHEMICAL') {
      handleSelectSpecializedRole('RD_FORMULA_CHEMIST_MANAGER');
    } else if (cat === 'GLASS') {
      handleSelectSpecializedRole('BATCH_HOUSE_MANAGER');
    } else if (cat === 'STEEL') {
      handleSelectSpecializedRole('WEIGHBRIDGE_LOGISTICS_MANAGER');
    } else {
      setFormDepartment('PRODUCTION');
      setFormDesignation('MANAGER');
    }
  };

  const openCreateModal = () => {
    setEditingEmployee(null);
    setFormFirstName('');
    setFormLastName('');
    setFormEmail('');
    setFormUsername('');
    setFormPassword('');
    setFormSpecializedCategory('PAINT');
    setFormSpecializedRole('COLOR_LAB_SHADE_MANAGER');
    setFormDepartment('QUALITY');
    setFormDesignation('COLOR_LAB_SHADE_MANAGER');
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (emp: EmployeeRecord) => {
    setEditingEmployee(emp);
    setFormFirstName(emp.firstName || '');
    setFormLastName(emp.lastName || '');
    setFormEmail(emp.email);
    setFormUsername(emp.username || '');
    setFormPassword('');

    const isPaint = PAINT_SPECIALIZED_ROLES.some(
      (pr) => pr.role === emp.role || pr.designationKey === emp.designation,
    );
    const isChemical = CHEMICAL_SPECIALIZED_ROLES.some(
      (cr) => cr.role === emp.role || cr.designationKey === emp.designation,
    );
    const isGlass = GLASS_SPECIALIZED_ROLES.some(
      (gr) => gr.role === emp.role || gr.designationKey === emp.designation,
    );
    const isSteel = STEEL_SPECIALIZED_ROLES.some(
      (sr) => sr.role === emp.role || sr.designationKey === emp.designation,
    );

    if (isPaint) {
      setFormSpecializedCategory('PAINT');
      setFormSpecializedRole(emp.role);
    } else if (isChemical) {
      setFormSpecializedCategory('CHEMICAL');
      setFormSpecializedRole(emp.role);
    } else if (isGlass) {
      setFormSpecializedCategory('GLASS');
      setFormSpecializedRole(emp.role);
    } else if (isSteel) {
      setFormSpecializedCategory('STEEL');
      setFormSpecializedRole(emp.role);
    } else {
      setFormSpecializedCategory('NONE');
    }

    setFormDepartment(emp.department);
    setFormDesignation(emp.designation);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateModalForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formFirstName.trim()) errs.firstName = 'First name is required';

    if (!editingEmployee) {
      if (!formEmail.trim()) {
        errs.email = 'Corporate email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail.trim())) {
        errs.email = 'Enter a valid email address';
      }
      if (!formPassword || formPassword.length < 6) {
        errs.password = 'Password must be at least 6 characters';
      }
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleModalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateModalForm()) return;

    setIsSubmitting(true);
    setBannerError(null);
    setBannerSuccess(null);

    const token = localStorage.getItem('access_token');
    const isSpecialized = formSpecializedCategory !== 'NONE';

    if (isPreviewMode || !token) {
      if (editingEmployee) {
        setEmployees((prev) =>
          prev.map((item) =>
            item.id === editingEmployee.id
              ? {
                  ...item,
                  firstName: formFirstName.trim(),
                  lastName: formLastName.trim() || null,
                  department: formDepartment,
                  designation: formDesignation,
                  role: isSpecialized ? formSpecializedRole : `${formDepartment}_${formDesignation}`,
                  specializedSector:
                    formSpecializedCategory === 'PAINT'
                      ? 'Paint'
                      : formSpecializedCategory === 'CHEMICAL'
                      ? 'Chemicals'
                      : formSpecializedCategory === 'GLASS'
                      ? 'Glass and Ceramic'
                      : formSpecializedCategory === 'STEEL'
                      ? 'Steel and Heavy Metals'
                      : undefined,
                }
              : item,
          ),
        );
        setBannerSuccess(`Updated employee ${formFirstName} in preview directory.`);
      } else {
        const prefix = formDepartment.substring(0, 4).toUpperCase();
        const resolvedRole = isSpecialized ? formSpecializedRole : `${formDepartment}_${formDesignation}`;

        const newEmp: EmployeeRecord = {
          id: `demo-${Date.now()}`,
          employeeCode: `${prefix}-${String(employees.length + 1).padStart(3, '0')}`,
          firstName: formFirstName.trim(),
          lastName: formLastName.trim(),
          email: formEmail.trim().toLowerCase(),
          username: formUsername.trim() || formEmail.split('@')[0],
          department: formDepartment,
          designation: formDesignation,
          role: resolvedRole,
          isActive: true,
          specializedSector:
            formSpecializedCategory === 'PAINT'
              ? 'Paint'
              : formSpecializedCategory === 'CHEMICAL'
              ? 'Chemicals'
              : formSpecializedCategory === 'GLASS'
              ? 'Glass and Ceramic'
              : formSpecializedCategory === 'STEEL'
              ? 'Steel and Heavy Metals'
              : undefined,
        };
        setEmployees((prev) => [newEmp, ...prev]);
        setBannerSuccess(
          `Onboarded ${newEmp.firstName} as ${
            isSpecialized ? activeSpecializedRoleMeta.title : resolveRoleLabel(formDepartment, formDesignation)
          } (Preview Mode).`,
        );
      }
      setIsSubmitting(false);
      setIsModalOpen(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      if (editingEmployee) {
        const res = await fetch(`${apiUrl}/users/${editingEmployee.id}/role`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: formFirstName.trim(),
            lastName: formLastName.trim() || undefined,
            department: formDepartment,
            designation: formDesignation,
            specializedRole: isSpecialized ? formSpecializedRole : undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(Array.isArray(data.message) ? data.message.join(', ') : data.message);
        }

        setEmployees((prev) =>
          prev.map((item) => (item.id === editingEmployee.id ? data.user : item)),
        );
        setBannerSuccess(data.message || 'Employee role updated successfully.');
      } else {
        const res = await fetch(`${apiUrl}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: formFirstName.trim(),
            lastName: formLastName.trim() || undefined,
            email: formEmail.trim().toLowerCase(),
            username: formUsername.trim() || undefined,
            password: formPassword,
            department: formDepartment,
            designation: formDesignation,
            specializedRole: isSpecialized ? formSpecializedRole : undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(Array.isArray(data.message) ? data.message.join(', ') : data.message);
        }

        setEmployees((prev) => [data.user, ...prev]);
        setBannerSuccess(data.message || 'Employee added and role assigned.');
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setFormErrors({ submit: err.message || 'Failed to save employee role.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (emp: EmployeeRecord) => {
    setBannerError(null);
    const token = localStorage.getItem('access_token');

    if (isPreviewMode || !token) {
      setEmployees((prev) =>
        prev.map((item) => (item.id === emp.id ? { ...item, isActive: !item.isActive } : item)),
      );
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/users/${emp.id}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(Array.isArray(data.message) ? data.message.join(', ') : data.message);
      }

      setEmployees((prev) =>
        prev.map((item) => (item.id === emp.id ? { ...item, isActive: data.user.isActive } : item)),
      );
      setBannerSuccess(data.message);
    } catch (err: any) {
      setBannerError(err.message || 'Unable to change employee status.');
    }
  };

  const handleDeleteEmployee = async (emp: EmployeeRecord) => {
    setBannerError(null);
    const token = localStorage.getItem('access_token');

    if (isPreviewMode || !token) {
      setEmployees((prev) => prev.filter((item) => item.id !== emp.id));
      setBannerSuccess(`Removed ${emp.firstName || emp.email} from preview directory.`);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/users/${emp.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(Array.isArray(data.message) ? data.message.join(', ') : data.message);
      }

      setEmployees((prev) => prev.filter((item) => item.id !== emp.id));
      setBannerSuccess(data.message || 'Employee removed.');
    } catch (err: any) {
      setBannerError(err.message || 'Unable to delete employee.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md">
              <Factory className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400">
                  APEX MANUFACTURING
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                  RBAC Hierarchy
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Process &amp; Chemical: Paint &amp; Chemical, Heavy &amp; Raw Materials: Steel &amp; Glass Operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/roles"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-sm sm:text-base font-bold transition-all shadow-sm"
              title="Launch Specialized Operations Workflow Hub"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Operations Hub</span>
            </Link>

            {currentUser ? (
              <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {currentUser.firstName} ({currentUser.role})
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {currentUser.email}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm sm:text-base font-semibold transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}

            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Heading + Primary CTA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-purple-500/10 text-purple-800 dark:text-purple-300 border border-purple-500/20 mb-2">
              <Palette className="w-3.5 h-3.5 text-purple-600" />
              <span>Paint, Chemical, Glass &amp; Steel Operations Active</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Workforce &amp; Specialized Role Governance
            </h2>
            <p className="mt-1 text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Govern permissions across 10 core departments, 5 Paint roles, 5 Chemical roles, 5 Glass &amp; Ceramic roles, and 4 Steel &amp; Heavy Metals roles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('directory')}
                className={`px-4 py-2 rounded-lg text-sm sm:text-base font-bold transition-all ${
                  activeTab === 'directory'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Directory
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('paint_roles')}
                className={`px-4 py-2 rounded-lg text-sm sm:text-base font-bold transition-all ${
                  activeTab === 'paint_roles'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Paint Roles (5)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('chemical_roles')}
                className={`px-4 py-2 rounded-lg text-sm sm:text-base font-bold transition-all ${
                  activeTab === 'chemical_roles'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Chemical Roles (5)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('glass_roles')}
                className={`px-4 py-2 rounded-lg text-sm sm:text-base font-bold transition-all ${
                  activeTab === 'glass_roles'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Glass Roles (5)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('steel_roles')}
                className={`px-4 py-2 rounded-lg text-sm sm:text-base font-bold transition-all ${
                  activeTab === 'steel_roles'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Steel Roles (4)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('matrix')}
                className={`px-4 py-2 rounded-lg text-sm sm:text-base font-bold transition-all ${
                  activeTab === 'matrix'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                10-Dept Matrix
              </button>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base font-bold shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-5 h-5" />
              <span>Add Employee / Specialist</span>
            </button>
          </div>
        </div>

        {/* Feedback Banners */}
        {bannerSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-3 text-base">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span className="font-semibold">{bannerSuccess}</span>
            </div>
            <button type="button" onClick={() => setBannerSuccess(null)}>
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {bannerError && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 flex items-center justify-between gap-3 text-base">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-semibold">{bannerError}</span>
            </div>
            <button type="button" onClick={() => setBannerError(null)}>
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Quick Filter Department Cards */}
        <section className="space-y-3">
          <div className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Workforce Filter by Sector &amp; Department
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedDepartment('ALL');
                setSelectedDesignation('ALL');
              }}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedDepartment === 'ALL' && selectedDesignation === 'ALL'
                  ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {employees.length}
                </span>
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                All Roles
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Full Workforce
              </div>
            </button>

            {/* Paint Specialists Filter Card */}
            <button
              type="button"
              onClick={() => setSelectedDepartment('PAINT_SPECIALIZED')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedDepartment === 'PAINT_SPECIALIZED'
                  ? 'border-purple-600 bg-purple-50/80 dark:bg-purple-950/40 ring-2 ring-purple-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300">
                  {departmentCounts['PAINT_SPECIALIZED'] || 0}
                </span>
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Paint Specialists
              </div>
              <div className="text-xs text-purple-700 dark:text-purple-400 mt-0.5 font-semibold">
                5 Key Roles
              </div>
            </button>

            {/* Chemical Specialists Filter Card */}
            <button
              type="button"
              onClick={() => setSelectedDepartment('CHEMICAL_SPECIALIZED')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedDepartment === 'CHEMICAL_SPECIALIZED'
                  ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <FlaskConical className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                  {departmentCounts['CHEMICAL_SPECIALIZED'] || 0}
                </span>
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Chemical Specialists
              </div>
              <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5 font-semibold">
                5 Key Roles
              </div>
            </button>

            {/* Glass Specialists Filter Card */}
            <button
              type="button"
              onClick={() => setSelectedDepartment('GLASS_SPECIALIZED')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedDepartment === 'GLASS_SPECIALIZED'
                  ? 'border-cyan-600 bg-cyan-50/80 dark:bg-cyan-950/40 ring-2 ring-cyan-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Sparkles className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300">
                  {departmentCounts['GLASS_SPECIALIZED'] || 0}
                </span>
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Glass Specialists
              </div>
              <div className="text-xs text-cyan-700 dark:text-cyan-400 mt-0.5 font-semibold">
                5 Key Roles
              </div>
            </button>

            {/* Steel Specialists Filter Card */}
            <button
              type="button"
              onClick={() => setSelectedDepartment('STEEL_SPECIALIZED')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedDepartment === 'STEEL_SPECIALIZED'
                  ? 'border-amber-600 bg-amber-50/80 dark:bg-amber-950/40 ring-2 ring-amber-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                  {departmentCounts['STEEL_SPECIALIZED'] || 0}
                </span>
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Steel Specialists
              </div>
              <div className="text-xs text-amber-700 dark:text-amber-400 mt-0.5 font-semibold">
                4 Key Roles
              </div>
            </button>

            {MANUFACTURING_DEPARTMENTS.slice(0, 4).map((dept) => {
              const Icon = DEPARTMENT_ICONS[dept.key];
              const isSelected = selectedDepartment === dept.key;
              return (
                <button
                  key={dept.key}
                  type="button"
                  onClick={() =>
                    setSelectedDepartment(isSelected ? 'ALL' : dept.key)
                  }
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {departmentCounts[dept.key] || 0}
                    </span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    {dept.shortLabel}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {dept.codePrefix}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* VIEW 1: EMPLOYEE DIRECTORY */}
        {activeTab === 'directory' ? (
          <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
            {/* Search & Filter Toolbar */}
            <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, specialized role or code..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Showing {filteredEmployees.length} personnel</span>
                </div>
              </div>
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-base font-semibold">Loading workforce directory...</p>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="p-16 text-center text-slate-500 space-y-2">
                <Users className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-lg font-bold">No employees match this filter</p>
                <p className="text-sm">Try clearing your search query or department selection</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 text-sm uppercase tracking-wider font-extrabold">
                      <th className="py-4 px-6">Employee</th>
                      <th className="py-4 px-6">Department</th>
                      <th className="py-4 px-6">Position &amp; Role</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredEmployees.map((emp) => {
                      const DeptIcon = DEPARTMENT_ICONS[emp.department] || Building2;
                      const deptStyle =
                        DEPARTMENT_BADGE_STYLES[emp.department] ||
                        'bg-slate-100 text-slate-700 border-slate-200';

                      const specializedRoleMatch = ALL_SPECIALIZED_ROLES.find(
                        (sr) => sr.role === emp.role || sr.designationKey === emp.designation,
                      );

                      const SpecIcon = specializedRoleMatch
                        ? SPECIALIZED_ROLE_ICONS[specializedRoleMatch.role] || Scale
                        : null;

                      return (
                        <tr
                          key={emp.id}
                          className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-black text-base flex items-center justify-center flex-shrink-0">
                                {emp.firstName?.charAt(0) || 'E'}
                              </div>
                              <div>
                                <div className="text-base font-extrabold text-slate-900 dark:text-white">
                                  {emp.firstName} {emp.lastName || ''}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                  {emp.email}
                                </div>
                                {emp.employeeCode && (
                                  <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                                    {emp.employeeCode}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${deptStyle}`}
                            >
                              <DeptIcon className="w-3.5 h-3.5" />
                              <span>{emp.department}</span>
                            </span>
                          </td>

                          <td className="py-4 px-6">
                            {specializedRoleMatch ? (
                              <div className="space-y-1">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${specializedRoleMatch.badgeStyle}`}
                                >
                                  {SpecIcon && <SpecIcon className="w-3.5 h-3.5" />}
                                  <span>{specializedRoleMatch.shortBadge}</span>
                                </span>
                                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                  {specializedRoleMatch.title}
                                </div>
                                <div className="text-xs text-slate-400 italic">
                                  {specializedRoleMatch.subCategory}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="text-base font-bold text-slate-900 dark:text-white">
                                  {DESIGNATION_LABELS[emp.designation] || emp.designation}
                                </div>
                                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                                  {resolveRoleLabel(emp.department, emp.designation)}
                                </div>
                              </div>
                            )}
                          </td>

                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${
                                emp.isActive
                                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  emp.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                                }`}
                              />
                              {emp.isActive ? 'Active' : 'Suspended'}
                            </span>
                          </td>

                          <td className="py-4 px-6 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openEditModal(emp)}
                                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                title="Edit Role & Department"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleStatus(emp)}
                                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-300 hover:text-amber-600 transition-colors"
                                title={emp.isActive ? 'Suspend Account' : 'Activate Account'}
                              >
                                <Power className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteEmployee(emp)}
                                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-300 hover:text-red-600 transition-colors"
                                title="Remove Employee"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : activeTab === 'paint_roles' ? (
          /* VIEW: PAINT & COATINGS SPECIALIZED ROLES */
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PAINT_SPECIALIZED_ROLES.map((pRole) => {
              const RoleIcon = SPECIALIZED_ROLE_ICONS[pRole.role] || Palette;
              return (
                <div
                  key={pRole.role}
                  className="rounded-3xl border border-purple-300/80 dark:border-purple-800/70 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-lg space-y-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-2xl bg-purple-500/15 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
                        <RoleIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                          {pRole.subCategory}
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          {pRole.title}
                        </h3>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          Assigned Dept: {pRole.associatedDepartment}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {pRole.description}
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Guarded Core Functions:
                    </div>
                    {pRole.functions.map((fn, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-start gap-2.5 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{fn}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/dashboard/roles"
                      className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      <span>Simulate live {pRole.title} workflow</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        ) : activeTab === 'chemical_roles' ? (
          /* VIEW 2: PROCESS & CHEMICAL PRODUCTION SPECIALIZED ROLES */
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CHEMICAL_SPECIALIZED_ROLES.map((cRole) => {
              const RoleIcon = SPECIALIZED_ROLE_ICONS[cRole.role] || FlaskConical;
              return (
                <div
                  key={cRole.role}
                  className="rounded-3xl border border-emerald-300/80 dark:border-emerald-800/70 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-lg space-y-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        <RoleIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          {cRole.subCategory}
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          {cRole.title}
                        </h3>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          Assigned Dept: {cRole.associatedDepartment}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {cRole.description}
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Guarded Core Functions:
                    </div>
                    {cRole.functions.map((fn, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-start gap-2.5 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{fn}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/dashboard/roles"
                      className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      <span>Simulate live {cRole.title} workflow</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        ) : activeTab === 'glass_roles' ? (
          /* VIEW 2: GLASS & CERAMIC PRODUCTION SPECIALIZED ROLES */
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GLASS_SPECIALIZED_ROLES.map((gRole) => {
              const RoleIcon = SPECIALIZED_ROLE_ICONS[gRole.role] || Sparkles;
              return (
                <div
                  key={gRole.role}
                  className="rounded-3xl border border-cyan-300/80 dark:border-cyan-800/70 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-lg space-y-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-2xl bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                        <RoleIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                          {gRole.subCategory}
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          {gRole.title}
                        </h3>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          Assigned Dept: {gRole.associatedDepartment}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {gRole.description}
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Guarded Core Functions:
                    </div>
                    {gRole.functions.map((fn, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-start gap-2.5 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{fn}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/dashboard/roles"
                      className="inline-flex items-center gap-2 text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                    >
                      <span>Simulate {gRole.title} operations</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        ) : activeTab === 'steel_roles' ? (
          /* VIEW 3: STEEL & HEAVY METALS SPECIALIZED ROLES */
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STEEL_SPECIALIZED_ROLES.map((sRole) => {
              const RoleIcon = SPECIALIZED_ROLE_ICONS[sRole.role] || Scale;
              return (
                <div
                  key={sRole.role}
                  className="rounded-3xl border border-amber-300/80 dark:border-amber-800/70 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-lg space-y-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-2xl bg-amber-500/15 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
                        <RoleIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          {sRole.subCategory}
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          {sRole.title}
                        </h3>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          Assigned Dept: {sRole.associatedDepartment}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {sRole.description}
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Guarded Core Functions:
                    </div>
                    {sRole.functions.map((fn, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-start gap-2.5 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{fn}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/dashboard/roles"
                      className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      <span>Simulate live {sRole.title} workflow</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        ) : (
          /* VIEW 4: 10-DEPARTMENT MATRIX */
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MANUFACTURING_DEPARTMENTS.map((dept) => {
              const Icon = DEPARTMENT_ICONS[dept.key];
              return (
                <div
                  key={dept.key}
                  className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-lg space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                          {dept.label}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {dept.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    {dept.allowedDesignations.map((lvl) => (
                      <div
                        key={lvl}
                        className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40"
                      >
                        <div className="text-sm font-bold text-blue-700 dark:text-blue-400">
                          {DESIGNATION_LABELS[lvl] || lvl}
                        </div>
                        <div className="text-sm text-slate-700 dark:text-slate-300 mt-0.5">
                          {dept.permissionsByLevel[lvl]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </main>

      {/* Add / Edit Employee & Specialized Role Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {editingEmployee ? 'Update Department & Specialized Role' : 'Onboard Employee & Assign Role'}
                </h3>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure department hierarchy, Paint &amp; Coatings, Chemical, Glass &amp; Ceramic roles, or Steel operations
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {formErrors.submit && (
              <div className="mt-5 p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 flex items-center gap-3 text-base">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{formErrors.submit}</span>
              </div>
            )}

            <form onSubmit={handleModalSubmit} className="mt-6 space-y-5">
              {/* Sector Position Category Selector */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Select Role Governance Sector:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectSpecializedCategory('PAINT')}
                    className={`py-2.5 px-3 rounded-xl text-sm font-extrabold border transition-all ${
                      formSpecializedCategory === 'PAINT'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Paint (5)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectSpecializedCategory('CHEMICAL')}
                    className={`py-2.5 px-3 rounded-xl text-sm font-extrabold border transition-all ${
                      formSpecializedCategory === 'CHEMICAL'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Chemical (5)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectSpecializedCategory('GLASS')}
                    className={`py-2.5 px-3 rounded-xl text-sm font-extrabold border transition-all ${
                      formSpecializedCategory === 'GLASS'
                        ? 'border-cyan-600 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 ring-2 ring-cyan-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Glass &amp; Ceramic (5)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectSpecializedCategory('STEEL')}
                    className={`py-2.5 px-3 rounded-xl text-sm font-extrabold border transition-all ${
                      formSpecializedCategory === 'STEEL'
                        ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Steel &amp; Metals (4)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectSpecializedCategory('NONE')}
                    className={`py-2.5 px-3 rounded-xl text-sm font-extrabold border transition-all ${
                      formSpecializedCategory === 'NONE'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Standard 10 Depts
                  </button>
                </div>
              </div>

              {/* Basic Employee Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    <User className="w-5 h-5 text-slate-400 ml-3.5" />
                    <input
                      type="text"
                      value={formFirstName}
                      onChange={(e) => setFormFirstName(e.target.value)}
                      placeholder="First name"
                      className="w-full px-3 py-3 text-base bg-transparent focus:outline-none"
                    />
                  </div>
                  {formErrors.firstName && (
                    <p className="mt-1 text-sm text-red-500 font-medium">{formErrors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-base font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formLastName}
                    onChange={(e) => setFormLastName(e.target.value)}
                    placeholder="Last name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-base focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>

              {!editingEmployee && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                      Corporate Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                      <Mail className="w-5 h-5 text-slate-400 ml-3.5" />
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="employee@apexmanufacturing.com"
                        className="w-full px-3 py-3 text-base bg-transparent focus:outline-none"
                      />
                    </div>
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-500 font-medium">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                      Initial Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                      <Lock className="w-5 h-5 text-slate-400 ml-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        placeholder="Min 6 chars"
                        className="w-full px-3 py-3 text-base bg-transparent focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="pr-3 text-slate-400 hover:text-slate-600"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="mt-1 text-sm text-red-500 font-medium">{formErrors.password}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Conditional Specialized Selection: PAINT */}
              {formSpecializedCategory === 'PAINT' && (
                <div className="space-y-3">
                  <label className="block text-base font-semibold text-slate-800 dark:text-slate-200">
                    Select Paint &amp; Coatings Specialized Position <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PAINT_SPECIALIZED_ROLES.map((pRole) => {
                      const RoleIcon = SPECIALIZED_ROLE_ICONS[pRole.role] || Palette;
                      const isSelected = formSpecializedRole === pRole.role;
                      return (
                        <button
                          key={pRole.role}
                          type="button"
                          onClick={() => handleSelectSpecializedRole(pRole.role)}
                          className={`p-3.5 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'border-purple-600 bg-purple-50/80 dark:bg-purple-950/50 ring-2 ring-purple-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 mb-1.5">
                            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-600">
                              <RoleIcon className="w-4 h-4" />
                            </div>
                            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                              {pRole.title}
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2">{pRole.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Conditional Specialized Selection: CHEMICAL */}
              {formSpecializedCategory === 'CHEMICAL' && (
                <div className="space-y-3">
                  <label className="block text-base font-semibold text-slate-800 dark:text-slate-200">
                    Select Process &amp; Chemical Specialized Position <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CHEMICAL_SPECIALIZED_ROLES.map((cRole) => {
                      const RoleIcon = SPECIALIZED_ROLE_ICONS[cRole.role] || FlaskConical;
                      const isSelected = formSpecializedRole === cRole.role;
                      return (
                        <button
                          key={cRole.role}
                          type="button"
                          onClick={() => handleSelectSpecializedRole(cRole.role)}
                          className={`p-3.5 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/50 ring-2 ring-emerald-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 mb-1.5">
                            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600">
                              <RoleIcon className="w-4 h-4" />
                            </div>
                            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                              {cRole.title}
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2">{cRole.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Conditional Specialized Selection: GLASS */}
              {formSpecializedCategory === 'GLASS' && (
                <div className="space-y-3">
                  <label className="block text-base font-semibold text-slate-800 dark:text-slate-200">
                    Select Glass &amp; Ceramic Specialized Position <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {GLASS_SPECIALIZED_ROLES.map((gRole) => {
                      const RoleIcon = SPECIALIZED_ROLE_ICONS[gRole.role] || Sparkles;
                      const isSelected = formSpecializedRole === gRole.role;
                      return (
                        <button
                          key={gRole.role}
                          type="button"
                          onClick={() => handleSelectSpecializedRole(gRole.role)}
                          className={`p-3.5 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'border-cyan-600 bg-cyan-50/80 dark:bg-cyan-950/50 ring-2 ring-cyan-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 mb-1.5">
                            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-600">
                              <RoleIcon className="w-4 h-4" />
                            </div>
                            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                              {gRole.title}
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2">{gRole.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Conditional Specialized Selection: STEEL */}
              {formSpecializedCategory === 'STEEL' && (
                <div className="space-y-3">
                  <label className="block text-base font-semibold text-slate-800 dark:text-slate-200">
                    Select Steel &amp; Heavy Metals Specialized Position <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {STEEL_SPECIALIZED_ROLES.map((sRole) => {
                      const RoleIcon = SPECIALIZED_ROLE_ICONS[sRole.role] || Scale;
                      const isSelected = formSpecializedRole === sRole.role;
                      return (
                        <button
                          key={sRole.role}
                          type="button"
                          onClick={() => handleSelectSpecializedRole(sRole.role)}
                          className={`p-3.5 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'border-amber-600 bg-amber-50/80 dark:bg-amber-950/50 ring-2 ring-amber-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 mb-1.5">
                            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600">
                              <RoleIcon className="w-4 h-4" />
                            </div>
                            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                              {sRole.title}
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2">{sRole.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Standard Department & Designation Picker */}
              {formSpecializedCategory === 'NONE' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formDepartment}
                      onChange={(e) => setFormDepartment(e.target.value as DepartmentKey)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-base focus:outline-none"
                    >
                      {MANUFACTURING_DEPARTMENTS.map((d) => (
                        <option key={d.key} value={d.key}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                      Management Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formDesignation}
                      onChange={(e) => setFormDesignation(e.target.value as DesignationKey)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-base focus:outline-none"
                    >
                      <option value="MANAGER">Manager</option>
                      <option value="ASSISTANT_MANAGER">Assistant Manager</option>
                      <option value="ASSOCIATE_MANAGER">Associate Manager</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-base font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                  <span>{editingEmployee ? 'Save Changes' : 'Confirm Onboarding'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
