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
  Award,
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
  Gauge,
  Disc,
  Car,
  Cpu,
  Zap,
} from 'lucide-react';
import {
  DepartmentKey,
  DesignationKey,
  DESIGNATION_LABELS,
  EmployeeRecord,
  MANUFACTURING_DEPARTMENTS,
  PAINT_SPECIALIZED_ROLES,
  RUBBER_SPECIALIZED_ROLES,
  PIPES_SPECIALIZED_ROLES,
  AUTOMOBILE_SPECIALIZED_ROLES,
  ELECTRONICAL_SPECIALIZED_ROLES,
  ELECTRIC_EQUIPMENT_SPECIALIZED_ROLES,
  CABLE_WIRE_SPECIALIZED_ROLES,
  STEEL_SPECIALIZED_ROLES,
  GLASS_SPECIALIZED_ROLES,
  CHEMICAL_SPECIALIZED_ROLES,
  TEXTILES_SPECIALIZED_ROLES,
  JEWELLERY_SPECIALIZED_ROLES,
  LEATHER_SPECIALIZED_ROLES,
  FURNITURE_SPECIALIZED_ROLES,
  DAIRY_SPECIALIZED_ROLES,
  ALL_SPECIALIZED_ROLES,
  SpecializedRole,
  resolveRoleLabel,
  getSpecializedRolesForSubCategory,
  getSectorCodeFromSubCategory,
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
  // Process & Chemical - Rubber & Tyre Sub-category
  RUBBER_COMPOUNDING_MANAGER: RefreshCw,
  EXTRUSION_CALENDERING_MANAGER: Gauge,
  TYRE_BUILDING_MANAGER: Disc,
  CURING_VULCANIZATION_MANAGER: Flame,
  TYRE_TESTING_UNIFORMITY_MANAGER: ShieldCheck,
  // Engineering, Machinery and Electronics - Automobiles Sub-category
  JIT_JIS_SUPPLY_CHAIN_MANAGER: Activity,
  PRESS_SHOP_BIW_MANAGER: Layers,
  VEHICLE_ASSEMBLY_MANAGER: Car,
  PAINT_SHOP_ANTI_CORROSION_MANAGER: Droplet,
  EOL_TESTING_VIN_MANAGER: ShieldCheck,
  // Engineering, Machinery and Electronics - Electronical Sub-category
  SMT_PCB_ASSEMBLY_MANAGER: Cpu,
  ELECTRICAL_TESTING_CALIBRATION_MANAGER: Gauge,
  FIRMWARE_FLASHING_MANAGER: SlidersHorizontal,
  COMPONENT_OBSOLESCENCE_EBOM_MANAGER: Box,
  ESD_CLEANROOM_COMPLIANCE_MANAGER: ShieldCheck,
  // Engineering, Machinery and Electronics - Electric Equipment Sub-category
  WINDING_COIL_FABRICATION_MANAGER: RefreshCw,
  CORE_ASSEMBLY_LAMINATION_MANAGER: Layers,
  VPI_INSULATION_MANAGER: Flame,
  HV_ROUTINE_TESTING_MANAGER: Zap,
  BUSBAR_FABRICATION_ENCLOSURE_MANAGER: Box,
  // Engineering, Machinery and Electronics - Cable Wire Sub-category
  WIRE_DRAWING_ANNEALING_MANAGER: RefreshCw,
  BUNCHING_STRANDING_MANAGER: Layers,
  INSULATION_SHEATHING_MANAGER: Activity,
  ARMOURING_BEDDING_MANAGER: Shield,
  HV_SPARK_TESTING_QA_MANAGER: Zap,
  // Chemical Industries - Pipes Sub-category
  EXTRUSION_LINE_OPERATIONS_MANAGER: Activity,
  WALL_THICKNESS_QUALITY_INCHARGE: ShieldCheck,
  HYDROSTATIC_BURST_TESTING_MANAGER: Flame,
  SOCKETING_BELLING_JOINTING_MANAGER: RefreshCw,
  PVC_DRY_BLEND_REGRIND_MANAGER: Layers,
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
  // Consumer Goods - Textiles Sub-category
  SPINNING_YARN_MANAGER: Activity,
  WEAVING_KNITTING_MANAGER: Layers,
  DYEING_PROCESS_MANAGER: Droplet,
  GARMENTING_FINISHING_MANAGER: Box,
  FABRIC_QUALITY_INSPECTION_MANAGER: ShieldCheck,
  // Consumer Goods - Jewellery Sub-category
  BULLION_VAULT_SECURITY_MANAGER: ShieldCheck,
  CAD_CAM_PROTOTYPING_MANAGER: Cpu,
  CASTING_MELTING_MANAGER: Flame,
  GOLDSMITH_KARIGAR_MANAGER: Sparkles,
  GEMSTONE_HALLMARKING_QC_MANAGER: Award,
  // Consumer Goods - Leather Sub-category
  HIDE_WETBLUE_MANAGER: Droplet,
  RETANNING_DYEING_CRUST_MANAGER: Palette,
  SPLITTING_SHAVING_CALIBRATION_MANAGER: Scale,
  FINISHING_BUFFING_EMBOSSING_MANAGER: Sparkles,
  LEATHER_QC_AREA_MEASUREMENT_MANAGER: Award,
  // Consumer Goods - Furniture Sub-category
  TIMBER_SEASONING_KILN_MANAGER: Flame,
  DIMENSION_MILL_CNC_MANAGER: Cpu,
  UPHOLSTERY_FOAM_CUTTING_MANAGER: Layers,
  SANDING_FINISHING_POLISHING_MANAGER: Sparkles,
  KD_PACKAGING_HARDWARE_KITTING_MANAGER: Box,
  // Food Manufacturing - Dairy Products Sub-category
  MILK_COLLECTION_RECEPTION_MANAGER: Droplet,
  PASTEURIZATION_PROCESSING_MANAGER: Flame,
  FERMENTATION_CULTURE_MANAGER: RefreshCw,
  QA_MBRT_ANTIBIOTIC_INCHARGE: ShieldCheck,
  COLD_CHAIN_EXPIRY_MANAGER: Truck,
};

const SAMPLE_WORKFORCE_SEED: EmployeeRecord[] = [];

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
  const [activeTab, setActiveTab] = useState<'directory' | 'matrix' | 'dairy_roles' | 'automobile_roles' | 'electronical_roles' | 'electric_equipment_roles' | 'cable_wire_roles' | 'textiles_roles' | 'jewellery_roles' | 'leather_roles' | 'furniture_roles' | 'pipes_roles' | 'rubber_roles' | 'paint_roles' | 'chemical_roles' | 'glass_roles' | 'steel_roles'>('directory');
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentKey | 'ALL' | 'DAIRY_SPECIALIZED' | 'AUTOMOBILE_SPECIALIZED' | 'ELECTRONICAL_SPECIALIZED' | 'ELECTRIC_EQUIPMENT_SPECIALIZED' | 'CABLE_WIRE_SPECIALIZED' | 'TEXTILES_SPECIALIZED' | 'JEWELLERY_SPECIALIZED' | 'LEATHER_SPECIALIZED' | 'FURNITURE_SPECIALIZED' | 'PIPES_SPECIALIZED' | 'RUBBER_SPECIALIZED' | 'PAINT_SPECIALIZED' | 'CHEMICAL_SPECIALIZED' | 'STEEL_SPECIALIZED' | 'GLASS_SPECIALIZED'>('ALL');
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

  // Modal Specialized Role Picker: 'NONE' | 'DAIRY' | 'AUTOMOBILE' | 'ELECTRONICAL' | 'ELECTRIC_EQUIPMENT' | 'CABLE_WIRE' | 'TEXTILES' | 'JEWELLERY' | 'LEATHER' | 'FURNITURE' | 'PIPES' | 'RUBBER' | 'PAINT' | 'CHEMICAL' | 'GLASS' | 'STEEL'
  const [formSpecializedCategory, setFormSpecializedCategory] = useState<'NONE' | 'DAIRY' | 'AUTOMOBILE' | 'ELECTRONICAL' | 'ELECTRIC_EQUIPMENT' | 'CABLE_WIRE' | 'TEXTILES' | 'JEWELLERY' | 'LEATHER' | 'FURNITURE' | 'PIPES' | 'RUBBER' | 'PAINT' | 'CHEMICAL' | 'GLASS' | 'STEEL'>('DAIRY');
  const [formSpecializedRole, setFormSpecializedRole] = useState<string>('MILK_COLLECTION_RECEPTION_MANAGER');
  const [formDepartment, setFormDepartment] = useState<DepartmentKey>('INVENTORY');
  const [formDesignation, setFormDesignation] = useState<DesignationKey>('MILK_COLLECTION_RECEPTION_MANAGER');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Active tenant industry classification & sub-category scoping
  const companySubCategory = useMemo(() => {
    return currentUser?.company?.subCategory || currentUser?.subCategory || 'Dairy Products';
  }, [currentUser]);

  const companyCategory = useMemo(() => {
    return currentUser?.company?.industryCategory || currentUser?.industryCategory || 'Food Manufacturing';
  }, [currentUser]);

  const activeSectorCode = useMemo(() => {
    return getSectorCodeFromSubCategory(companySubCategory);
  }, [companySubCategory]);

  const allowedSpecializedRoles = useMemo(() => {
    return getSpecializedRolesForSubCategory(companySubCategory);
  }, [companySubCategory]);

  const activeSpecializedTabKey = useMemo<'dairy_roles' | 'automobile_roles' | 'electronical_roles' | 'electric_equipment_roles' | 'cable_wire_roles' | 'textiles_roles' | 'jewellery_roles' | 'leather_roles' | 'furniture_roles' | 'pipes_roles' | 'rubber_roles' | 'paint_roles' | 'chemical_roles' | 'glass_roles' | 'steel_roles'>(() => {
    if (activeSectorCode === 'DAIRY') return 'dairy_roles';
    if (activeSectorCode === 'ELECTRONICAL') return 'electronical_roles';
    if (activeSectorCode === 'ELECTRIC_EQUIPMENT') return 'electric_equipment_roles';
    if (activeSectorCode === 'CABLE_WIRE') return 'cable_wire_roles';
    if (activeSectorCode === 'TEXTILES') return 'textiles_roles';
    if (activeSectorCode === 'JEWELLERY') return 'jewellery_roles';
    if (activeSectorCode === 'LEATHER') return 'leather_roles';
    if (activeSectorCode === 'FURNITURE') return 'furniture_roles';
    if (activeSectorCode === 'PIPES') return 'pipes_roles';
    if (activeSectorCode === 'RUBBER') return 'rubber_roles';
    if (activeSectorCode === 'PAINT') return 'paint_roles';
    if (activeSectorCode === 'CHEMICAL') return 'chemical_roles';
    if (activeSectorCode === 'GLASS') return 'glass_roles';
    if (activeSectorCode === 'STEEL') return 'steel_roles';
    return 'dairy_roles';
  }, [activeSectorCode]);

  const activeSpecializedTabLabel = useMemo(() => {
    if (activeSectorCode === 'DAIRY') return 'Dairy Products Roles (5)';
    if (activeSectorCode === 'ELECTRONICAL') return 'Electronical Roles (5)';
    if (activeSectorCode === 'ELECTRIC_EQUIPMENT') return 'Electric Equipment Roles (5)';
    if (activeSectorCode === 'CABLE_WIRE') return 'Cable & Wire Roles (5)';
    if (activeSectorCode === 'TEXTILES') return 'Textiles Roles (5)';
    if (activeSectorCode === 'JEWELLERY') return 'Jewellery Roles (5)';
    if (activeSectorCode === 'LEATHER') return 'Leather Roles (5)';
    if (activeSectorCode === 'FURNITURE') return 'Furniture Roles (5)';
    if (activeSectorCode === 'PIPES') return 'Pipes Roles (5)';
    if (activeSectorCode === 'RUBBER') return 'Rubber & Tyre Roles (5)';
    if (activeSectorCode === 'PAINT') return 'Paint Roles (5)';
    if (activeSectorCode === 'CHEMICAL') return 'Chemical Roles (5)';
    if (activeSectorCode === 'GLASS') return 'Glass & Ceramic Roles (5)';
    if (activeSectorCode === 'STEEL') return 'Steel Roles (4)';
    return 'Dairy Products Roles (5)';
  }, [activeSectorCode]);

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
      setEmployees([]);
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      // Synchronize latest authenticated profile to guarantee up-to-date tenant subCategory
      try {
        const profileRes = await fetch(`${apiUrl}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData) {
            setCurrentUser(profileData);
            localStorage.setItem('auth_user', JSON.stringify(profileData));
          }
        }
      } catch (profileErr) {
        console.warn('Could not refresh profile from server, using cached session:', profileErr);
      }

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
        setEmployees([]);
        setIsPreviewMode(true);
      }
    } catch {
      setIsPreviewMode(true);
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Department counts
  const departmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    let dairyCount = 0;
    let autoCount = 0;
    let electronicalCount = 0;
    let electricEquipmentCount = 0;
    let cableWireCount = 0;
    let textilesCount = 0;
    let jewelleryCount = 0;
    let leatherCount = 0;
    let furnitureCount = 0;
    let pipesCount = 0;
    let rubberCount = 0;
    let paintCount = 0;
    let chemicalCount = 0;
    let steelCount = 0;
    let glassCount = 0;

    employees.forEach((e) => {
      counts[e.department] = (counts[e.department] || 0) + 1;
      if (
        e.specializedSector === 'Dairy Products' ||
        e.specializedSector === 'Dairy' ||
        DAIRY_SPECIALIZED_ROLES.some((dr) => dr.role === e.role || dr.designationKey === e.designation)
      ) {
        dairyCount += 1;
      }
      if (
        e.specializedSector === 'Automobiles' ||
        e.specializedSector === 'Automobile' ||
        AUTOMOBILE_SPECIALIZED_ROLES.some((ar) => ar.role === e.role || ar.designationKey === e.designation)
      ) {
        autoCount += 1;
      }
      if (
        e.specializedSector === 'Electronical' ||
        e.specializedSector === 'Electrical' ||
        ELECTRONICAL_SPECIALIZED_ROLES.some((elr) => elr.role === e.role || elr.designationKey === e.designation)
      ) {
        electronicalCount += 1;
      }
      if (
        e.specializedSector === 'Electric Equipment' ||
        e.specializedSector === 'Electrical Equipment' ||
        ELECTRIC_EQUIPMENT_SPECIALIZED_ROLES.some((eqr) => eqr.role === e.role || eqr.designationKey === e.designation)
      ) {
        electricEquipmentCount += 1;
      }
      if (
        e.specializedSector === 'Cable Wire' ||
        e.specializedSector === 'Cable & Wire' ||
        CABLE_WIRE_SPECIALIZED_ROLES.some((cwr) => cwr.role === e.role || cwr.designationKey === e.designation)
      ) {
        cableWireCount += 1;
      }
      if (
        e.specializedSector === 'Textiles' ||
        e.specializedSector === 'Textile' ||
        TEXTILES_SPECIALIZED_ROLES.some((tr) => tr.role === e.role || tr.designationKey === e.designation)
      ) {
        textilesCount += 1;
      }
      if (
        e.specializedSector === 'Jewellery' ||
        e.specializedSector === 'Jewelry' ||
        JEWELLERY_SPECIALIZED_ROLES.some((jr) => jr.role === e.role || jr.designationKey === e.designation)
      ) {
        jewelleryCount += 1;
      }
      if (
        e.specializedSector === 'Leather' ||
        e.specializedSector === 'Tannery' ||
        LEATHER_SPECIALIZED_ROLES.some((lr) => lr.role === e.role || lr.designationKey === e.designation)
      ) {
        leatherCount += 1;
      }
      if (
        e.specializedSector === 'Furniture' ||
        e.specializedSector === 'Wood & Furniture' ||
        FURNITURE_SPECIALIZED_ROLES.some((fr) => fr.role === e.role || fr.designationKey === e.designation)
      ) {
        furnitureCount += 1;
      }
      if (
        e.specializedSector === 'Pipes' ||
        e.specializedSector === 'Pipes & Polymer Tubes' ||
        PIPES_SPECIALIZED_ROLES.some((pir) => pir.role === e.role || pir.designationKey === e.designation)
      ) {
        pipesCount += 1;
      }
      if (
        e.specializedSector === 'Rubber & Tyre' ||
        e.specializedSector === 'Rubber and Tyre' ||
        RUBBER_SPECIALIZED_ROLES.some((rr) => rr.role === e.role || rr.designationKey === e.designation)
      ) {
        rubberCount += 1;
      }
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

    counts['DAIRY_SPECIALIZED'] = dairyCount;
    counts['AUTOMOBILE_SPECIALIZED'] = autoCount;
    counts['ELECTRONICAL_SPECIALIZED'] = electronicalCount;
    counts['ELECTRIC_EQUIPMENT_SPECIALIZED'] = electricEquipmentCount;
    counts['CABLE_WIRE_SPECIALIZED'] = cableWireCount;
    counts['TEXTILES_SPECIALIZED'] = textilesCount;
    counts['JEWELLERY_SPECIALIZED'] = jewelleryCount;
    counts['LEATHER_SPECIALIZED'] = leatherCount;
    counts['FURNITURE_SPECIALIZED'] = furnitureCount;
    counts['PIPES_SPECIALIZED'] = pipesCount;
    counts['RUBBER_SPECIALIZED'] = rubberCount;
    counts['PAINT_SPECIALIZED'] = paintCount;
    counts['CHEMICAL_SPECIALIZED'] = chemicalCount;
    counts['STEEL_SPECIALIZED'] = steelCount;
    counts['GLASS_SPECIALIZED'] = glassCount;
    return counts;
  }, [employees]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (selectedDepartment === 'DAIRY_SPECIALIZED') {
        const isDairy =
          emp.specializedSector === 'Dairy Products' ||
          emp.specializedSector === 'Dairy' ||
          DAIRY_SPECIALIZED_ROLES.some((dr) => dr.role === emp.role || dr.designationKey === emp.designation);
        if (!isDairy) return false;
      } else if (selectedDepartment === 'AUTOMOBILE_SPECIALIZED') {
        const isAuto =
          emp.specializedSector === 'Automobiles' ||
          emp.specializedSector === 'Automobile' ||
          AUTOMOBILE_SPECIALIZED_ROLES.some((ar) => ar.role === emp.role || ar.designationKey === emp.designation);
        if (!isAuto) return false;
      } else if (selectedDepartment === 'ELECTRONICAL_SPECIALIZED') {
        const isElec =
          emp.specializedSector === 'Electronical' ||
          emp.specializedSector === 'Electrical' ||
          ELECTRONICAL_SPECIALIZED_ROLES.some((elr) => elr.role === emp.role || elr.designationKey === emp.designation);
        if (!isElec) return false;
      } else if (selectedDepartment === 'ELECTRIC_EQUIPMENT_SPECIALIZED') {
        const isElecEq =
          emp.specializedSector === 'Electric Equipment' ||
          emp.specializedSector === 'Electrical Equipment' ||
          ELECTRIC_EQUIPMENT_SPECIALIZED_ROLES.some((eqr) => eqr.role === emp.role || eqr.designationKey === emp.designation);
        if (!isElecEq) return false;
      } else if (selectedDepartment === 'CABLE_WIRE_SPECIALIZED') {
        const isCableWire =
          emp.specializedSector === 'Cable Wire' ||
          emp.specializedSector === 'Cable & Wire' ||
          CABLE_WIRE_SPECIALIZED_ROLES.some((cwr) => cwr.role === emp.role || cwr.designationKey === emp.designation);
        if (!isCableWire) return false;
      } else if (selectedDepartment === 'TEXTILES_SPECIALIZED') {
        const isTextiles =
          emp.specializedSector === 'Textiles' ||
          emp.specializedSector === 'Textile' ||
          TEXTILES_SPECIALIZED_ROLES.some((tr) => tr.role === emp.role || tr.designationKey === emp.designation);
        if (!isTextiles) return false;
      } else if (selectedDepartment === 'JEWELLERY_SPECIALIZED') {
        const isJewellery =
          emp.specializedSector === 'Jewellery' ||
          emp.specializedSector === 'Jewelry' ||
          JEWELLERY_SPECIALIZED_ROLES.some((jr) => jr.role === emp.role || jr.designationKey === emp.designation);
        if (!isJewellery) return false;
      } else if (selectedDepartment === 'LEATHER_SPECIALIZED') {
        const isLeather =
          emp.specializedSector === 'Leather' ||
          emp.specializedSector === 'Tannery' ||
          LEATHER_SPECIALIZED_ROLES.some((lr) => lr.role === emp.role || lr.designationKey === emp.designation);
        if (!isLeather) return false;
      } else if (selectedDepartment === 'FURNITURE_SPECIALIZED') {
        const isFurniture =
          emp.specializedSector === 'Furniture' ||
          emp.specializedSector === 'Wood & Furniture' ||
          FURNITURE_SPECIALIZED_ROLES.some((fr) => fr.role === emp.role || fr.designationKey === emp.designation);
        if (!isFurniture) return false;
      } else if (selectedDepartment === 'PIPES_SPECIALIZED') {
        const isPipes =
          emp.specializedSector === 'Pipes' ||
          emp.specializedSector === 'Pipes & Polymer Tubes' ||
          PIPES_SPECIALIZED_ROLES.some((pir) => pir.role === emp.role || pir.designationKey === emp.designation);
        if (!isPipes) return false;
      } else if (selectedDepartment === 'RUBBER_SPECIALIZED') {
        const isRubber =
          emp.specializedSector === 'Rubber & Tyre' ||
          emp.specializedSector === 'Rubber and Tyre' ||
          RUBBER_SPECIALIZED_ROLES.some((rr) => rr.role === emp.role || rr.designationKey === emp.designation);
        if (!isRubber) return false;
      } else if (selectedDepartment === 'PAINT_SPECIALIZED') {
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
      allowedSpecializedRoles[0] ||
      ALL_SPECIALIZED_ROLES[0]
    );
  }, [formSpecializedRole, allowedSpecializedRoles]);

  const handleSelectSpecializedRole = (roleKey: string) => {
    setFormSpecializedRole(roleKey);
    const found = ALL_SPECIALIZED_ROLES.find((r) => r.role === roleKey);
    if (found) {
      setFormDepartment(found.associatedDepartment);
      setFormDesignation(found.designationKey);
    }
  };

  const handleSelectSpecializedCategory = (cat: 'NONE' | 'DAIRY' | 'AUTOMOBILE' | 'ELECTRONICAL' | 'ELECTRIC_EQUIPMENT' | 'CABLE_WIRE' | 'TEXTILES' | 'JEWELLERY' | 'LEATHER' | 'FURNITURE' | 'PIPES' | 'RUBBER' | 'PAINT' | 'CHEMICAL' | 'GLASS' | 'STEEL') => {
    setFormSpecializedCategory(cat);
    if (cat === 'DAIRY') {
      handleSelectSpecializedRole('MILK_COLLECTION_RECEPTION_MANAGER');
    } else if (cat === 'AUTOMOBILE') {
      handleSelectSpecializedRole('JIT_JIS_SUPPLY_CHAIN_MANAGER');
    } else if (cat === 'ELECTRONICAL') {
      handleSelectSpecializedRole('SMT_PCB_ASSEMBLY_MANAGER');
    } else if (cat === 'ELECTRIC_EQUIPMENT') {
      handleSelectSpecializedRole('WINDING_COIL_FABRICATION_MANAGER');
    } else if (cat === 'CABLE_WIRE') {
      handleSelectSpecializedRole('WIRE_DRAWING_ANNEALING_MANAGER');
    } else if (cat === 'TEXTILES') {
      handleSelectSpecializedRole('SPINNING_YARN_MANAGER');
    } else if (cat === 'JEWELLERY') {
      handleSelectSpecializedRole('BULLION_VAULT_SECURITY_MANAGER');
    } else if (cat === 'LEATHER') {
      handleSelectSpecializedRole('HIDE_WETBLUE_MANAGER');
    } else if (cat === 'FURNITURE') {
      handleSelectSpecializedRole('TIMBER_SEASONING_KILN_MANAGER');
    } else if (cat === 'PIPES') {
      handleSelectSpecializedRole('EXTRUSION_LINE_OPERATIONS_MANAGER');
    } else if (cat === 'RUBBER') {
      handleSelectSpecializedRole('RUBBER_COMPOUNDING_MANAGER');
    } else if (cat === 'PAINT') {
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
    const targetCategory = activeSectorCode !== 'NONE' ? activeSectorCode : 'NONE';
    setFormSpecializedCategory(targetCategory);
    if (allowedSpecializedRoles.length > 0) {
      const defaultRole = allowedSpecializedRoles[0];
      setFormSpecializedRole(defaultRole.role);
      setFormDepartment(defaultRole.associatedDepartment);
      setFormDesignation(defaultRole.designationKey);
    } else {
      setFormDepartment('PRODUCTION');
      setFormDesignation('MANAGER');
    }
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

    // Check if employee's role belongs to this company's permitted specialized roles
    const matchingRole = allowedSpecializedRoles.find(
      (r) => r.role === emp.role || r.designationKey === emp.designation,
    );

    if (matchingRole) {
      setFormSpecializedCategory(activeSectorCode);
      setFormSpecializedRole(matchingRole.role);
      setFormDepartment(matchingRole.associatedDepartment);
      setFormDesignation(matchingRole.designationKey);
    } else {
      setFormSpecializedCategory('NONE');
      setFormDepartment(emp.department);
      setFormDesignation(emp.designation);
      if (allowedSpecializedRoles.length > 0) {
        setFormSpecializedRole(allowedSpecializedRoles[0].role);
      }
    }

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
                    formSpecializedCategory === 'AUTOMOBILE'
                      ? 'Automobiles'
                      : formSpecializedCategory === 'ELECTRONICAL'
                      ? 'Electronical'
                      : formSpecializedCategory === 'ELECTRIC_EQUIPMENT'
                      ? 'Electric Equipment'
                      : formSpecializedCategory === 'PIPES'
                      ? 'Pipes'
                      : formSpecializedCategory === 'RUBBER'
                      ? 'Rubber & Tyre'
                      : formSpecializedCategory === 'PAINT'
                      ? 'Paint'
                      : formSpecializedCategory === 'CHEMICAL'
                      ? 'Chemicals'
                      : formSpecializedCategory === 'GLASS'
                      ? 'Glass and Ceramic'
                      : formSpecializedCategory === 'STEEL'
                      ? 'Steel and Heavy Metals'
                      : formSpecializedCategory === 'TEXTILES'
                      ? 'Textiles'
                      : formSpecializedCategory === 'JEWELLERY'
                      ? 'Jewellery'
                      : formSpecializedCategory === 'LEATHER'
                      ? 'Leather'
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
            formSpecializedCategory === 'AUTOMOBILE'
              ? 'Automobiles'
              : formSpecializedCategory === 'ELECTRONICAL'
              ? 'Electronical'
              : formSpecializedCategory === 'ELECTRIC_EQUIPMENT'
              ? 'Electric Equipment'
              : formSpecializedCategory === 'PIPES'
              ? 'Pipes'
              : formSpecializedCategory === 'RUBBER'
              ? 'Rubber & Tyre'
              : formSpecializedCategory === 'PAINT'
              ? 'Paint'
              : formSpecializedCategory === 'CHEMICAL'
              ? 'Chemicals'
              : formSpecializedCategory === 'GLASS'
              ? 'Glass and Ceramic'
              : formSpecializedCategory === 'STEEL'
              ? 'Steel and Heavy Metals'
              : formSpecializedCategory === 'TEXTILES'
              ? 'Textiles'
              : formSpecializedCategory === 'JEWELLERY'
              ? 'Jewellery'
              : formSpecializedCategory === 'LEATHER'
              ? 'Leather'
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
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-20 py-3 flex flex-wrap items-center justify-between gap-3">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity flex-wrap min-w-0">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md shrink-0">
              <Factory className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400 whitespace-nowrap">
                  {currentUser?.company?.name || 'Manufacturing Enterprise'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 whitespace-nowrap shrink-0">
                  {companySubCategory}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {companyCategory} &bull; Multi-Tenant Role Isolation Active
              </p>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm sm:text-base font-bold transition-all shadow-sm whitespace-nowrap shrink-0"
              title="Return to Plant Overview Dashboard"
            >
              <Factory className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/dashboard/roles"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-sm sm:text-base font-bold transition-all shadow-sm whitespace-nowrap shrink-0"
              title="Launch Specialized Operations Workflow Hub"
            >
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Operations Hub</span>
            </Link>

            <Link
              href="/dashboard/super-admin"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-sm sm:text-base font-bold transition-all shadow-sm whitespace-nowrap shrink-0"
              title="Super Admin Executive Control"
            >
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Super Admin</span>
            </Link>

            <Link
              href="/dashboard/executive"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-sm sm:text-base font-bold transition-all shadow-sm whitespace-nowrap shrink-0"
              title="Executive Leadership Portal"
            >
              <Award className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Executive</span>
            </Link>

            {currentUser ? (
              <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800 whitespace-nowrap shrink-0">
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {currentUser.firstName} ({currentUser.role})
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {currentUser.email} &bull; {currentUser.company?.code || 'TENANT-001'}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm sm:text-base font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                <LogIn className="w-4 h-4 shrink-0" />
                <span>Sign In</span>
              </Link>
            )}

            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 whitespace-nowrap shrink-0"
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-800 dark:text-blue-300 border border-blue-500/20 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Tenant Scope: {companyCategory} &bull; {companySubCategory}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Workforce &amp; Role Governance
            </h2>
            <p className="mt-1 text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Govern permissions across 10 core departments and specialized roles strictly pertinent to your registered {companySubCategory} facility.
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
              {allowedSpecializedRoles.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeSpecializedTabKey)}
                  className={`px-4 py-2 rounded-lg text-sm sm:text-base font-bold transition-all ${
                    activeTab === activeSpecializedTabKey
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {activeSpecializedTabLabel}
                </button>
              )}
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

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-10 gap-3">
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

            {/* Sector-Specific Specialists Filter Card (Strictly Scoped to Tenant Sub-Category) */}
            {activeSectorCode === 'DAIRY' && (
              <button
                type="button"
                onClick={() => setSelectedDepartment('DAIRY_SPECIALIZED')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedDepartment === 'DAIRY_SPECIALIZED'
                    ? 'border-sky-600 bg-sky-50/80 dark:bg-sky-950/40 ring-2 ring-sky-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Droplet className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300">
                    {departmentCounts['DAIRY_SPECIALIZED'] || 0}
                  </span>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Dairy Specialists
                </div>
                <div className="text-xs text-sky-700 dark:text-sky-400 mt-0.5 font-semibold">
                  5 Key Roles
                </div>
              </button>
            )}

            {activeSectorCode === 'AUTOMOBILE' && (
              <button
                type="button"
                onClick={() => setSelectedDepartment('AUTOMOBILE_SPECIALIZED')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedDepartment === 'AUTOMOBILE_SPECIALIZED'
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Car className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                    {departmentCounts['AUTOMOBILE_SPECIALIZED'] || 0}
                  </span>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Automobile Specialists
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-400 mt-0.5 font-semibold">
                  5 Key Roles
                </div>
              </button>
            )}

            {activeSectorCode === 'ELECTRONICAL' && (
              <button
                type="button"
                onClick={() => setSelectedDepartment('ELECTRONICAL_SPECIALIZED')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedDepartment === 'ELECTRONICAL_SPECIALIZED'
                    ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300">
                    {departmentCounts['ELECTRONICAL_SPECIALIZED'] || 0}
                  </span>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Electronical Specialists
                </div>
                <div className="text-xs text-indigo-700 dark:text-indigo-400 mt-0.5 font-semibold">
                  5 Key Roles
                </div>
              </button>
            )}

            {activeSectorCode === 'ELECTRIC_EQUIPMENT' && (
              <button
                type="button"
                onClick={() => setSelectedDepartment('ELECTRIC_EQUIPMENT_SPECIALIZED')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedDepartment === 'ELECTRIC_EQUIPMENT_SPECIALIZED'
                    ? 'border-amber-600 bg-amber-50/80 dark:bg-amber-950/40 ring-2 ring-amber-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                    {departmentCounts['ELECTRIC_EQUIPMENT_SPECIALIZED'] || 0}
                  </span>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Electric Equipment
                </div>
                <div className="text-xs text-amber-700 dark:text-amber-400 mt-0.5 font-semibold">
                  5 Key Roles
                </div>
              </button>
            )}

            {activeSectorCode === 'CABLE_WIRE' && (
              <button
                type="button"
                onClick={() => setSelectedDepartment('CABLE_WIRE_SPECIALIZED')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedDepartment === 'CABLE_WIRE_SPECIALIZED'
                    ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300">
                    {departmentCounts['CABLE_WIRE_SPECIALIZED'] || 0}
                  </span>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Cable Wire Specialists
                </div>
                <div className="text-xs text-indigo-700 dark:text-indigo-400 mt-0.5 font-semibold">
                  5 Key Roles
                </div>
              </button>
            )}

            {activeSectorCode === 'TEXTILES' && (
              <button
                type="button"
                onClick={() => setSelectedDepartment('TEXTILES_SPECIALIZED')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedDepartment === 'TEXTILES_SPECIALIZED'
                    ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300">
                    {departmentCounts['TEXTILES_SPECIALIZED'] || 0}
                  </span>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Textiles Specialists
                </div>
                <div className="text-xs text-indigo-700 dark:text-indigo-400 mt-0.5 font-semibold">
                  5 Key Roles
                </div>
              </button>
            )}

            {activeSectorCode === 'JEWELLERY' && (
              <button
                type="button"
                onClick={() => setSelectedDepartment('JEWELLERY_SPECIALIZED')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedDepartment === 'JEWELLERY_SPECIALIZED'
                    ? 'border-amber-600 bg-amber-50/80 dark:bg-amber-950/40 ring-2 ring-amber-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                    {departmentCounts['JEWELLERY_SPECIALIZED'] || 0}
                  </span>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Jewellery Specialists
                </div>
                <div className="text-xs text-amber-700 dark:text-amber-400 mt-0.5 font-semibold">
                  5 Key Roles
                </div>
              </button>
            )}

            {activeSectorCode === 'LEATHER' && (
              <button
                type="button"
                onClick={() => setSelectedDepartment('LEATHER_SPECIALIZED')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedDepartment === 'LEATHER_SPECIALIZED'
                    ? 'border-amber-700 bg-amber-50/80 dark:bg-amber-950/40 ring-2 ring-amber-600/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                    {departmentCounts['LEATHER_SPECIALIZED'] || 0}
                  </span>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Leather Specialists
                </div>
                <div className="text-xs text-amber-800 dark:text-amber-400 mt-0.5 font-semibold">
                  5 Key Roles
                </div>
              </button>
            )}

            {activeSectorCode === 'FURNITURE' && (
              <button
                type="button"
                onClick={() => setSelectedDepartment('FURNITURE_SPECIALIZED')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedDepartment === 'FURNITURE_SPECIALIZED'
                    ? 'border-amber-800 bg-amber-50/80 dark:bg-amber-950/40 ring-2 ring-amber-700/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Flame className="w-5 h-5 text-amber-800 dark:text-amber-400" />
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300">
                    {departmentCounts['FURNITURE_SPECIALIZED'] || 0}
                  </span>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Furniture Specialists
                </div>
                <div className="text-xs text-amber-800 dark:text-amber-400 mt-0.5 font-semibold">
                  5 Key Roles
                </div>
              </button>
            )}

            {activeSectorCode === 'PIPES' && (
              <button
                type="button"
                onClick={() => setSelectedDepartment('PIPES_SPECIALIZED')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedDepartment === 'PIPES_SPECIALIZED'
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                    {departmentCounts['PIPES_SPECIALIZED'] || 0}
                  </span>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Pipes Specialists
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-400 mt-0.5 font-semibold">
                  5 Key Roles
                </div>
              </button>
            )}

            {activeSectorCode === 'RUBBER' && (
              <button
                type="button"
                onClick={() => setSelectedDepartment('RUBBER_SPECIALIZED')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedDepartment === 'RUBBER_SPECIALIZED'
                    ? 'border-orange-600 bg-orange-50/80 dark:bg-orange-950/40 ring-2 ring-orange-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Disc className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-900/60 text-orange-800 dark:text-orange-300">
                    {departmentCounts['RUBBER_SPECIALIZED'] || 0}
                  </span>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Rubber Specialists
                </div>
                <div className="text-xs text-orange-700 dark:text-orange-400 mt-0.5 font-semibold">
                  5 Key Roles
                </div>
              </button>
            )}

            {activeSectorCode === 'PAINT' && (
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
            )}

            {activeSectorCode === 'CHEMICAL' && (
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
            )}

            {activeSectorCode === 'GLASS' && (
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
            )}

            {activeSectorCode === 'STEEL' && (
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
            )}

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
        ) : activeTab === 'dairy_roles' ? (
          /* VIEW: FOOD MANUFACTURING / DAIRY PRODUCTS SPECIALIZED ROLES */
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DAIRY_SPECIALIZED_ROLES.map((dairyRole) => {
              const RoleIcon = SPECIALIZED_ROLE_ICONS[dairyRole.role] || Droplet;
              return (
                <div
                  key={dairyRole.role}
                  className="rounded-3xl border border-sky-300/80 dark:border-sky-800/70 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-lg space-y-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-2xl bg-sky-500/15 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400">
                        <RoleIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                          {dairyRole.subCategory}
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          {dairyRole.title}
                        </h3>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          Assigned Dept: {dairyRole.associatedDepartment}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {dairyRole.description}
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Guarded Core Functions:
                    </div>
                    {dairyRole.functions.map((fn, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-start gap-2.5 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{fn}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        openCreateModal();
                        handleSelectSpecializedCategory('DAIRY');
                        handleSelectSpecializedRole(dairyRole.role);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-bold hover:bg-sky-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Provision Role</span>
                    </button>
                    <Link
                      href="/dashboard/roles"
                      className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
                    >
                      <span>Operations Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        ) : activeTab === 'automobile_roles' ? (
          /* VIEW: ENGINEERING, MACHINERY AND ELECTRONICS / AUTOMOBILES SPECIALIZED ROLES */
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AUTOMOBILE_SPECIALIZED_ROLES.map((autoRole) => {
              const RoleIcon = SPECIALIZED_ROLE_ICONS[autoRole.role] || Car;
              return (
                <div
                  key={autoRole.role}
                  className="rounded-3xl border border-blue-300/80 dark:border-blue-800/70 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-lg space-y-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-2xl bg-blue-500/15 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                        <RoleIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          {autoRole.subCategory}
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          {autoRole.title}
                        </h3>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          Assigned Dept: {autoRole.associatedDepartment}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {autoRole.description}
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Guarded Core Functions:
                    </div>
                    {autoRole.functions.map((fn, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-start gap-2.5 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{fn}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        openCreateModal();
                        handleSelectSpecializedCategory('AUTOMOBILE');
                        handleSelectSpecializedRole(autoRole.role);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Provision Role</span>
                    </button>
                    <Link
                      href="/dashboard/roles"
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <span>Operations Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        ) : activeTab === 'electronical_roles' ? (
          /* VIEW: ENGINEERING, MACHINERY AND ELECTRONICS / ELECTRONICAL SPECIALIZED ROLES */
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ELECTRONICAL_SPECIALIZED_ROLES.map((elecRole) => {
              const RoleIcon = SPECIALIZED_ROLE_ICONS[elecRole.role] || Cpu;
              return (
                <div
                  key={elecRole.role}
                  className="rounded-3xl border border-indigo-300/80 dark:border-indigo-800/70 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-lg space-y-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-2xl bg-indigo-500/15 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                        <RoleIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {elecRole.subCategory}
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          {elecRole.title}
                        </h3>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          Assigned Dept: {elecRole.associatedDepartment}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {elecRole.description}
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Guarded Core Functions:
                    </div>
                    {elecRole.functions.map((fn, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-start gap-2.5 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{fn}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        openCreateModal();
                        handleSelectSpecializedCategory('ELECTRONICAL');
                        handleSelectSpecializedRole(elecRole.role);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Provision Role</span>
                    </button>
                    <Link
                      href="/dashboard/roles"
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <span>Operations Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        ) : activeTab === 'electric_equipment_roles' ? (
          /* VIEW: ENGINEERING, MACHINERY AND ELECTRONICS / ELECTRIC EQUIPMENT SPECIALIZED ROLES */
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ELECTRIC_EQUIPMENT_SPECIALIZED_ROLES.map((eqRole) => {
              const RoleIcon = SPECIALIZED_ROLE_ICONS[eqRole.role] || Zap;
              return (
                <div
                  key={eqRole.role}
                  className="rounded-3xl border border-amber-300/80 dark:border-amber-800/70 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-lg space-y-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-2xl bg-amber-500/15 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
                        <RoleIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          {eqRole.subCategory}
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          {eqRole.title}
                        </h3>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          Assigned Dept: {eqRole.associatedDepartment}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {eqRole.description}
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Guarded Core Functions:
                    </div>
                    {eqRole.functions.map((fn, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-start gap-2.5 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{fn}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        openCreateModal();
                        handleSelectSpecializedCategory('ELECTRIC_EQUIPMENT');
                        handleSelectSpecializedRole(eqRole.role);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Provision Role</span>
                    </button>
                    <Link
                      href="/dashboard/roles"
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      <span>Operations Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        ) : activeTab === 'cable_wire_roles' ? (
          /* VIEW: ENGINEERING, MACHINERY AND ELECTRONICS / CABLE WIRE SPECIALIZED ROLES */
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CABLE_WIRE_SPECIALIZED_ROLES.map((cwRole) => {
              const RoleIcon = SPECIALIZED_ROLE_ICONS[cwRole.role] || Zap;
              return (
                <div
                  key={cwRole.role}
                  className="rounded-3xl border border-indigo-300/80 dark:border-indigo-800/70 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-lg space-y-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-2xl bg-indigo-500/15 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                        <RoleIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {cwRole.subCategory}
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          {cwRole.title}
                        </h3>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          Assigned Dept: {cwRole.associatedDepartment}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {cwRole.description}
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Guarded Core Functions:
                    </div>
                    {cwRole.functions.map((fn, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-start gap-2.5 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{fn}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        openCreateModal();
                        handleSelectSpecializedCategory('CABLE_WIRE');
                        handleSelectSpecializedRole(cwRole.role);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Provision Role</span>
                    </button>
                    <Link
                      href="/dashboard/roles"
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <span>Operations Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        ) : activeTab === 'textiles_roles' ? (
          /* VIEW: CONSUMER GOODS / TEXTILES SPECIALIZED ROLES */
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEXTILES_SPECIALIZED_ROLES.map((txtRole) => {
              const RoleIcon = SPECIALIZED_ROLE_ICONS[txtRole.role] || Layers;
              return (
                <div
                  key={txtRole.role}
                  className="rounded-3xl border border-indigo-300/80 dark:border-indigo-800/70 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-lg space-y-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-2xl bg-indigo-500/15 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                        <RoleIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {txtRole.subCategory}
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          {txtRole.title}
                        </h3>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          Assigned Dept: {txtRole.associatedDepartment}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {txtRole.description}
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Guarded Core Functions:
                    </div>
                    {txtRole.functions.map((fn, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-start gap-2.5 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{fn}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        openCreateModal();
                        handleSelectSpecializedCategory('TEXTILES');
                        handleSelectSpecializedRole(txtRole.role);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Provision Role</span>
                    </button>
                    <Link
                      href="/dashboard/roles"
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <span>Operations Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        ) : activeTab === 'jewellery_roles' ? (
          /* VIEW: CONSUMER GOODS / JEWELLERY SPECIALIZED ROLES */
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {JEWELLERY_SPECIALIZED_ROLES.map((jwlRole) => {
              const RoleIcon = SPECIALIZED_ROLE_ICONS[jwlRole.role] || Sparkles;
              return (
                <div
                  key={jwlRole.role}
                  className="rounded-3xl border border-amber-300/80 dark:border-amber-800/70 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-lg space-y-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-2xl bg-amber-500/15 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
                        <RoleIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          {jwlRole.subCategory}
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          {jwlRole.title}
                        </h3>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          Assigned Dept: {jwlRole.associatedDepartment}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {jwlRole.description}
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Guarded Core Functions:
                    </div>
                    {jwlRole.functions.map((fn, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-start gap-2.5 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{fn}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        openCreateModal();
                        handleSelectSpecializedCategory('JEWELLERY');
                        handleSelectSpecializedRole(jwlRole.role);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Provision Role</span>
                    </button>
                    <Link
                      href="/dashboard/roles"
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      <span>Operations Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        ) : activeTab === 'leather_roles' ? (
          /* VIEW: CONSUMER GOODS / LEATHER SPECIALIZED ROLES */
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LEATHER_SPECIALIZED_ROLES.map((lthRole) => {
              const RoleIcon = SPECIALIZED_ROLE_ICONS[lthRole.role] || Award;
              return (
                <div
                  key={lthRole.role}
                  className="rounded-3xl border border-amber-400/80 dark:border-amber-700/70 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-lg space-y-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-2xl bg-amber-600/15 dark:bg-amber-600/20 text-amber-700 dark:text-amber-400">
                        <RoleIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                          {lthRole.subCategory}
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          {lthRole.title}
                        </h3>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          Assigned Dept: {lthRole.associatedDepartment}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {lthRole.description}
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Guarded Core Functions:
                    </div>
                    {lthRole.functions.map((fn, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-start gap-2.5 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{fn}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        openCreateModal();
                        handleSelectSpecializedCategory('LEATHER');
                        handleSelectSpecializedRole(lthRole.role);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Provision Role</span>
                    </button>
                    <Link
                      href="/dashboard/roles"
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
                    >
                      <span>Operations Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        ) : activeTab === 'furniture_roles' ? (
          /* VIEW: CONSUMER GOODS / FURNITURE SPECIALIZED ROLES */
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FURNITURE_SPECIALIZED_ROLES.map((furnRole) => {
              const RoleIcon = SPECIALIZED_ROLE_ICONS[furnRole.role] || Flame;
              return (
                <div
                  key={furnRole.role}
                  className="rounded-3xl border border-amber-300/80 dark:border-amber-800/70 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-lg space-y-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-2xl bg-amber-600/15 dark:bg-amber-600/20 text-amber-800 dark:text-amber-400">
                        <RoleIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                          {furnRole.subCategory}
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          {furnRole.title}
                        </h3>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          Assigned Dept: {furnRole.associatedDepartment}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {furnRole.description}
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Guarded Core Functions:
                    </div>
                    {furnRole.functions.map((fn, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-start gap-2.5 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{fn}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        openCreateModal();
                        handleSelectSpecializedCategory('FURNITURE');
                        handleSelectSpecializedRole(furnRole.role);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Provision Role</span>
                    </button>
                    <Link
                      href="/dashboard/roles"
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 dark:text-amber-400 hover:underline"
                    >
                      <span>Operations Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        ) : activeTab === 'pipes_roles' ? (
          /* VIEW: CHEMICAL INDUSTRIES / PIPES SPECIALIZED ROLES */
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PIPES_SPECIALIZED_ROLES.map((pirRole) => {
              const RoleIcon = SPECIALIZED_ROLE_ICONS[pirRole.role] || Activity;
              return (
                <div
                  key={pirRole.role}
                  className="rounded-3xl border border-blue-300/80 dark:border-blue-800/70 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-lg space-y-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-2xl bg-blue-500/15 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                        <RoleIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          {pirRole.subCategory}
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          {pirRole.title}
                        </h3>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          Assigned Dept: {pirRole.associatedDepartment}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {pirRole.description}
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Guarded Core Functions:
                    </div>
                    {pirRole.functions.map((fn, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-start gap-2.5 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{fn}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        openCreateModal();
                        handleSelectSpecializedCategory('PIPES');
                        handleSelectSpecializedRole(pirRole.role);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Provision Role</span>
                    </button>
                    <Link
                      href="/dashboard/roles"
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <span>Simulate live workflow</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        ) : activeTab === 'rubber_roles' ? (
          /* VIEW: RUBBER & TYRE SPECIALIZED ROLES */
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RUBBER_SPECIALIZED_ROLES.map((rRole) => {
              const RoleIcon = SPECIALIZED_ROLE_ICONS[rRole.role] || Disc;
              return (
                <div
                  key={rRole.role}
                  className="rounded-3xl border border-orange-300/80 dark:border-orange-800/70 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-lg space-y-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-2xl bg-orange-500/15 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400">
                        <RoleIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                          {rRole.subCategory}
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          {rRole.title}
                        </h3>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          Assigned Dept: {rRole.associatedDepartment}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {rRole.description}
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Guarded Core Functions:
                    </div>
                    {rRole.functions.map((fn, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-start gap-2.5 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{fn}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        openCreateModal();
                        handleSelectSpecializedCategory('RUBBER');
                        handleSelectSpecializedRole(rRole.role);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 text-xs font-bold hover:bg-orange-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Provision Role</span>
                    </button>
                    <Link
                      href="/dashboard/roles"
                      className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
                    >
                      <span>Simulate live workflow</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
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
                          {dept.permissionsByLevel[lvl] || 'Departmental operational execution and management authority'}
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
              {/* Sector Position Category Selector (Strictly Scoped to Tenant Sub-Category) */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Role Governance Scope:
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Tenant Sub-Category: {companySubCategory}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allowedSpecializedRoles.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleSelectSpecializedCategory(activeSectorCode)}
                      className={`py-2.5 px-4 rounded-xl text-sm font-extrabold border transition-all flex items-center justify-center gap-2 ${
                        formSpecializedCategory === activeSectorCode
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>{companySubCategory} ({allowedSpecializedRoles.length} Roles)</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleSelectSpecializedCategory('NONE')}
                    className={`py-2.5 px-4 rounded-xl text-sm font-extrabold border transition-all flex items-center justify-center gap-2 ${
                      formSpecializedCategory === 'NONE'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span>Standard 10 Depts (General)</span>
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
                        placeholder="employee@plant-enterprise.com"
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

              {/* Conditional Specialized Selection (Strictly Filtered to Registered Company Sub-Category) */}
              {formSpecializedCategory !== 'NONE' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-base font-semibold text-slate-800 dark:text-slate-200">
                      Select {companySubCategory} Specialized Position <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {allowedSpecializedRoles.length} Roles Registered
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {allowedSpecializedRoles.map((roleMeta) => {
                      const RoleIcon = SPECIALIZED_ROLE_ICONS[roleMeta.role] || Sparkles;
                      const isSelected = formSpecializedRole === roleMeta.role;
                      return (
                        <button
                          key={roleMeta.role}
                          type="button"
                          onClick={() => handleSelectSpecializedRole(roleMeta.role)}
                          className={`p-3.5 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 ring-2 ring-blue-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 mb-1.5">
                            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-600">
                              <RoleIcon className="w-4 h-4" />
                            </div>
                            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                              {roleMeta.title}
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2">{roleMeta.description}</p>
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
                      onChange={(e) => {
                        const newDept = e.target.value as DepartmentKey;
                        setFormDepartment(newDept);
                        if (newDept === 'EXECUTIVE') {
                          setFormDesignation('SUPER_ADMIN');
                        } else if (['SUPER_ADMIN', 'CEO', 'MD', 'OWNER', 'EXECUTIVE'].includes(formDesignation)) {
                          setFormDesignation('MANAGER');
                        }
                      }}
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
                      {formDepartment === 'EXECUTIVE' ? (
                        <>
                          <option value="SUPER_ADMIN">Super Administrator</option>
                          <option value="CEO">Chief Executive Officer (CEO)</option>
                          <option value="MD">Managing Director (MD)</option>
                          <option value="OWNER">Owner</option>
                        </>
                      ) : (
                        <>
                          <option value="MANAGER">Manager</option>
                          <option value="ASSISTANT_MANAGER">Assistant Manager</option>
                          <option value="ASSOCIATE_MANAGER">Associate Manager</option>
                        </>
                      )}
                      {allowedSpecializedRoles
                        .filter((sr) => sr.associatedDepartment === formDepartment)
                        .map((sr) => (
                          <option key={sr.designationKey} value={sr.designationKey}>
                            {sr.title} ({companySubCategory})
                          </option>
                        ))}
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
