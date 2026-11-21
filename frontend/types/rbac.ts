export type DepartmentKey =
  | 'EXECUTIVE'
  | 'PRODUCTION'
  | 'INVENTORY'
  | 'QUALITY'
  | 'PACKING'
  | 'SECURITY'
  | 'HR'
  | 'SALES'
  | 'MACHINE_MAINTENANCE'
  | 'PURCHASING_SOURCING';

export type DesignationKey =
  | 'CEO'
  | 'MD'
  | 'OWNER'
  | 'MANAGER'
  | 'ASSISTANT_MANAGER'
  | 'ASSOCIATE_MANAGER'
  // Steel & Heavy Metals
  | 'WEIGHBRIDGE_LOGISTICS_MANAGER'
  | 'METALLURGY_LAB_INCHARGE'
  | 'SUBCONTRACTING_JOBWORK_MANAGER'
  | 'EHS_SAFETY_MANAGER'
  // Glass & Ceramic Production
  | 'BATCH_HOUSE_MANAGER'
  | 'KILN_FURNACE_MANAGER'
  | 'MOULD_TOOLING_MANAGER'
  | 'THERMAL_QUALITY_INCHARGE'
  | 'CULLET_RECOVERY_MANAGER'
  // Process & Chemical Industries / Chemical
  | 'RD_FORMULA_CHEMIST_MANAGER'
  | 'EHS_HAZMAT_MANAGER'
  | 'QA_ANALYTICAL_LAB_MANAGER'
  | 'REACTOR_BATCH_PRODUCTION_MANAGER'
  | 'HAZARDOUS_LOGISTICS_MANAGER'
  // Process & Chemical Industries / Paint
  | 'COLOR_LAB_SHADE_MANAGER'
  | 'PIGMENT_RESIN_DISPERSION_MANAGER'
  | 'QUALITY_RHEOLOGY_MANAGER'
  | 'BASE_STOCK_TINTING_MANAGER'
  | 'FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER';

export interface EmployeeRecord {
  id: string;
  employeeCode?: string | null;
  email: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  department: DepartmentKey;
  designation: DesignationKey;
  role: string;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt?: string;
  specializedSector?: string;
}

export interface DepartmentMeta {
  key: DepartmentKey;
  label: string;
  shortLabel: string;
  codePrefix: string;
  allowedDesignations: DesignationKey[];
  description: string;
  permissionsByLevel: Record<string, string>;
}

export interface SpecializedRole {
  role: string;
  designationKey: DesignationKey;
  title: string;
  subCategory: string; // "Steel & Heavy metals" or "Glass & Ceramic Production"
  associatedDepartment: DepartmentKey;
  shortBadge: string;
  functions: string[];
  description: string;
  badgeStyle: string;
}

export const DESIGNATION_LABELS: Record<DesignationKey, string> = {
  CEO: 'CEO',
  MD: 'Managing Director (MD)',
  OWNER: 'Owner',
  MANAGER: 'Manager',
  ASSISTANT_MANAGER: 'Assistant Manager',
  ASSOCIATE_MANAGER: 'Associate Manager',
  // Steel & Heavy metals
  WEIGHBRIDGE_LOGISTICS_MANAGER: 'Weighbridge & Logistics Manager',
  METALLURGY_LAB_INCHARGE: 'Metallurgy & Lab In-Charge',
  SUBCONTRACTING_JOBWORK_MANAGER: 'Subcontracting & Job Work Manager',
  EHS_SAFETY_MANAGER: 'EHS & Industrial Safety Manager',
  // Glass & Ceramic
  BATCH_HOUSE_MANAGER: 'Batch House Manager',
  KILN_FURNACE_MANAGER: 'Kiln & Furnace Manager',
  MOULD_TOOLING_MANAGER: 'Mould & Tooling Manager',
  THERMAL_QUALITY_INCHARGE: 'Thermal Quality In-Charge',
  CULLET_RECOVERY_MANAGER: 'Cullet Recovery Manager',
  // Process & Chemical Industries / Chemical
  RD_FORMULA_CHEMIST_MANAGER: 'R&D Formula & Chemist Manager',
  EHS_HAZMAT_MANAGER: 'EHS & Hazmat Safety Manager',
  QA_ANALYTICAL_LAB_MANAGER: 'QA Analytical Lab Manager',
  REACTOR_BATCH_PRODUCTION_MANAGER: 'Reactor Batch Production Manager',
  HAZARDOUS_LOGISTICS_MANAGER: 'Hazardous Logistics & Dangerous Goods Manager',
  // Process & Chemical Industries / Paint
  COLOR_LAB_SHADE_MANAGER: 'Color Lab & Shade Manager',
  PIGMENT_RESIN_DISPERSION_MANAGER: 'Pigment & Resin Dispersion Manager',
  QUALITY_RHEOLOGY_MANAGER: 'Quality & Rheology Manager',
  BASE_STOCK_TINTING_MANAGER: 'Base Stock & Tinting Manager',
  FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER: 'Flammable Packaging & Compliance Manager',
};

export const STEEL_SPECIALIZED_ROLES: SpecializedRole[] = [
  {
    role: 'WEIGHBRIDGE_LOGISTICS_MANAGER',
    designationKey: 'WEIGHBRIDGE_LOGISTICS_MANAGER',
    title: 'Weighbridge & Logistics Manager',
    subCategory: 'Steel and Heavy Metals',
    associatedDepartment: 'INVENTORY',
    shortBadge: 'Weighbridge & Logistics',
    functions: [
      'Tare & Gross weight digital approvals for incoming scrap, billets, TMT coils',
      'PO & Supplier Invoice linkage with weight tolerance threshold checks',
      'Truck queue dispatch orchestration & inward/outward weighment slip generation',
    ],
    description:
      'Supervises heavy vehicle weighbridge platforms, verifies gross/tare measurements, matches weighment slips with PO numbers, and clears truck turnaround.',
    badgeStyle: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  {
    role: 'METALLURGY_LAB_INCHARGE',
    designationKey: 'METALLURGY_LAB_INCHARGE',
    title: 'Metallurgy & Lab Quality In-Charge',
    subCategory: 'Steel and Heavy Metals',
    associatedDepartment: 'QUALITY',
    shortBadge: 'Metallurgy & MTC',
    functions: [
      'Optical emission spectrometry lab test uploads (C, Mn, Si, S, P, Cr composition)',
      'Furnace metal heat approvals & mechanical property verification (Yield, Tensile, Elongation)',
      'Automated generation and cryptographic sign-off of Material Test Certificates (MTC)',
    ],
    description:
      'Authorizes steel melt heat releases, verifies physical and chemical properties to IS/ASTM standards, and issues customer Material Test Certificates (MTC).',
    badgeStyle: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  },
  {
    role: 'SUBCONTRACTING_JOBWORK_MANAGER',
    designationKey: 'SUBCONTRACTING_JOBWORK_MANAGER',
    title: 'Subcontracting & Job Work Manager',
    subCategory: 'Steel and Heavy Metals',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Subcontracting & Jobwork',
    functions: [
      'Material challan issuance for external processing (Galvanizing, Pickling, Slitting, Annealing)',
      'Tracking sent input weight vs received output weight with process loss/gain ratio computation',
      'Scrap return reconciliation, burning loss auditing & subcontractor invoice settlement',
    ],
    description:
      'Manages external conversion vendors, generates 57F4 delivery challans, tracks burning and machining loss, and reconciles scrap returns.',
    badgeStyle: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
  },
  {
    role: 'EHS_SAFETY_MANAGER',
    designationKey: 'EHS_SAFETY_MANAGER',
    title: 'EHS & Industrial Safety Manager',
    subCategory: 'Steel and Heavy Metals',
    associatedDepartment: 'SECURITY',
    shortBadge: 'EHS & Plant Safety',
    functions: [
      'Shop-floor incident & near-miss reporting with severity assessment and CAPA logging',
      'Electronic Hot Work Permit approvals for high-temperature areas (Furnaces, Tapping, Welding)',
      'Personal Protective Equipment (PPE) audits, toxic gas monitoring & environmental compliance',
    ],
    description:
      'Enforces heavy industry safety protocols, inspects furnace and ladle crane work zones, issues electronic hot work permits, and audits environmental standards.',
    badgeStyle: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
  },
];

export const GLASS_SPECIALIZED_ROLES: SpecializedRole[] = [
  {
    role: 'BATCH_HOUSE_MANAGER',
    designationKey: 'BATCH_HOUSE_MANAGER',
    title: 'Batch House Manager',
    subCategory: 'Glass and Ceramic',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Batch House & Formulas',
    functions: [
      'Recipe & formula master data maintenance (Silica sand, Soda ash, Limestone, Feldspar, Dolomite)',
      'Batch raw material precision weighing & automated hopper dispensing validation',
      'Cullet recycled ratio tracking (% of internal + external cullet vs virgin batch)',
      'Silo & day-bin real-time raw material inventory monitoring & reorder triggers',
    ],
    description:
      'Controls batch formulation recipes, oversees scale accuracy, monitors cullet addition ratios, and ensures continuous raw material feed to melting furnaces.',
    badgeStyle: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
  },
  {
    role: 'KILN_FURNACE_MANAGER',
    designationKey: 'KILN_FURNACE_MANAGER',
    title: 'Kiln & Furnace Manager',
    subCategory: 'Glass and Ceramic',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Kiln & Furnace Melter',
    functions: [
      'Melter, refining, and annealing lehr multi-zone temperature telemetry logging (°C)',
      'Fuel & natural gas consumption calculation per metric ton of melted glass/ceramic',
      'Burner nozzle firing maintenance, reversal cycles & refractory crown health logs',
      'Thermal shock gradient parameters & furnace pressure stabilization',
    ],
    description:
      'Supervises glass melting furnaces and ceramic kilns, regulates temperature gradients, minimizes specific fuel consumption, and coordinates burner reversals.',
    badgeStyle: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30',
  },
  {
    role: 'MOULD_TOOLING_MANAGER',
    designationKey: 'MOULD_TOOLING_MANAGER',
    title: 'Mould & Tooling Manager',
    subCategory: 'Glass and Ceramic',
    associatedDepartment: 'MACHINE_MAINTENANCE',
    shortBadge: 'Moulds & Tooling Life',
    functions: [
      'Mould and die life cycle tracking with automated shot counts & machine run-hours',
      'Tooling allocation across IS machines, press blow lines & ceramic tile presses',
      'Precision CNC machining, cavity polishing & dry lubricant refurbishment schedules',
      'Mould cavity wear measurements & pre-emptive replacement clearance',
    ],
    description:
      'Maintains blow/blank moulds and ceramic dies, monitors cumulative shot cycles against rated lifespans, and operates the tooling refurbishment shop.',
    badgeStyle: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
  },
  {
    role: 'THERMAL_QUALITY_INCHARGE',
    designationKey: 'THERMAL_QUALITY_INCHARGE',
    title: 'Thermal Quality In-Charge',
    subCategory: 'Glass and Ceramic',
    associatedDepartment: 'QUALITY',
    shortBadge: 'Thermal QC & Inspection',
    functions: [
      'Surface & optical defect inspection (seeds, bubbles, stones, cord lines, pinholes, warping)',
      'Destructive thermal shock bath quench tests (hot/cold water differential delta T)',
      'Polarimeter residual stress evaluation (ASTM C148 / Annealing Lehr stress grades)',
      'Lot-wise quality clearance, defect PPM tracking & compliance release certification',
    ],
    description:
      'Directs optical and physical quality assurance, executes thermal shock stress testing, verifies dimensional flatness, and authorizes batch releases.',
    badgeStyle: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  },
  {
    role: 'CULLET_RECOVERY_MANAGER',
    designationKey: 'CULLET_RECOVERY_MANAGER',
    title: 'Cullet Recovery Manager',
    subCategory: 'Glass and Ceramic',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Cullet Scrap Recovery',
    functions: [
      'Stage-wise scrap and rejection logging (Hot End shears, Lehr exit, Cold End packing reject)',
      'Scrap cullet recovery percentage calculation across automated production lines',
      'Raw material input vs finished packaged output mass balance reconciliation',
      'Crushed cullet re-introduction scheduling to minimize virgin melting energy',
    ],
    description:
      'Oversees closed-loop plant recycling, measures hot and cold end rejection rates, reconciles mass balance yields, and returns clean cullet to batch houses.',
    badgeStyle: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30',
  },
];

export const CHEMICAL_SPECIALIZED_ROLES: SpecializedRole[] = [
  {
    role: 'RD_FORMULA_CHEMIST_MANAGER',
    designationKey: 'RD_FORMULA_CHEMIST_MANAGER',
    title: 'R&D Formula & Chemist Manager',
    subCategory: 'Chemicals',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'R&D Formula & Yield',
    functions: [
      'Master formula versioning, stoichiometry & reaction kinetics',
      'Stoichiometric theoretical yield vs actual isolated product calculations',
      'New formulation authorizations, synthesis route sign-off & hazard classification',
      'Safety Data Sheet (SDS) verification & reactant molar ratio calibrations',
    ],
    description:
      'Governs chemical synthesis master recipes, calculates stoichiometric theoretical yields, and authorizes new scale-up formulations.',
    badgeStyle: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  },
  {
    role: 'EHS_HAZMAT_MANAGER',
    designationKey: 'EHS_HAZMAT_MANAGER',
    title: 'EHS & Hazmat Safety Manager',
    subCategory: 'Chemicals',
    associatedDepartment: 'SECURITY',
    shortBadge: 'EHS Hazmat & Disposal',
    functions: [
      'Hazardous waste disposal manifests, UN classifications & SPCB/CPCB regulatory reporting',
      'Personal Protective Equipment (PPE) compliance audits, respiratory filters & eyewash logs',
      'Chemical handling permits, toxic vapor containment protocols & MSDS emergency readiness',
    ],
    description:
      'Enforces hazardous material safety, maintains chemical waste manifests, verifies PPE compliance scores, and oversees statutory environmental permits.',
    badgeStyle: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
  },
  {
    role: 'QA_ANALYTICAL_LAB_MANAGER',
    designationKey: 'QA_ANALYTICAL_LAB_MANAGER',
    title: 'QA Analytical Lab Manager',
    subCategory: 'Chemicals',
    associatedDepartment: 'QUALITY',
    shortBadge: 'QA Analytical Lab & CoA',
    functions: [
      'Analytical test uploads (Assay Purity %, pH, Karl Fischer moisture, Density g/mL)',
      'Strict unapproved batch dispatch blocking gate (blocks non-compliant batches from gate out)',
      'Automated Certificate of Analysis (CoA) generation with cryptographic test certification',
    ],
    description:
      'Directs the analytical testing laboratory, executes dispatch clearance checks, blocks out-of-spec batches, and auto-generates customer Certificates of Analysis (CoA).',
    badgeStyle: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
  },
  {
    role: 'REACTOR_BATCH_PRODUCTION_MANAGER',
    designationKey: 'REACTOR_BATCH_PRODUCTION_MANAGER',
    title: 'Reactor Batch Production Manager',
    subCategory: 'Chemicals',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Reactor Cycles & Utilities',
    functions: [
      'Seven-stage batch progression tracking (Charging, Reaction, Reflux, Distillation, Cooling, Discharging)',
      'Reactor utility consumption monitoring (Steam boiler duty kg, Chilled water m³, Electrical kWh)',
      'Equipment downtime tracking, condenser fouling alerts & batch yield variance reconciliation',
    ],
    description:
      'Supervises glass-lined and stainless steel reactors, orchestrates batch synthesis phases, monitors utility consumption, and tracks downtime.',
    badgeStyle: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  {
    role: 'HAZARDOUS_LOGISTICS_MANAGER',
    designationKey: 'HAZARDOUS_LOGISTICS_MANAGER',
    title: 'Hazardous Logistics & Dangerous Goods Manager',
    subCategory: 'Chemicals',
    associatedDepartment: 'INVENTORY',
    shortBadge: 'Dangerous Goods & Tremcards',
    functions: [
      'Dangerous goods transport documentation (UN Numbers, Hazchem emergency codes, Hazmat placards)',
      'Transport Emergency Card (Tremcard) issuance & driver emergency instruction sheets',
      'Hazmat-certified commercial driver license verification & statutory transit permit renewals',
    ],
    description:
      'Controls outbound dangerous goods shipments, assigns UN numbers and Hazchem codes, issues Tremcards, and verifies vehicle/driver compliance before exit.',
    badgeStyle: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
  },
];

export const PAINT_SPECIALIZED_ROLES: SpecializedRole[] = [
  {
    role: 'COLOR_LAB_SHADE_MANAGER',
    designationKey: 'COLOR_LAB_SHADE_MANAGER',
    title: 'Color Lab & Shade Manager',
    subCategory: 'Paint',
    associatedDepartment: 'QUALITY',
    shortBadge: 'Color Lab & Shade Cards',
    functions: [
      'Master shade cards management (RAL, Pantone, IS shade standards)',
      'Spectrophotometer CIELAB integration (L*, a*, b*) & Delta E tolerance limit validation (ΔE ≤ 0.50)',
      'Custom color tinting formula approvals & shade drift adjustment authorization',
      'Target color reflectance curve verification & digital shade library archives',
    ],
    description:
      'Directs industrial color formulation, calibrates spectrophotometer CIELAB colorimeters, maintains shade master standards, and signs off tinting formulas.',
    badgeStyle: 'bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/30',
  },
  {
    role: 'PIGMENT_RESIN_DISPERSION_MANAGER',
    designationKey: 'PIGMENT_RESIN_DISPERSION_MANAGER',
    title: 'Pigment & Resin Dispersion Manager',
    subCategory: 'Paint',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Pigment & Resin Dispersion',
    functions: [
      'Grinding batch cycle tracking across sand mills, bead mills & high-speed dispersers (HSD)',
      'Mill base viscosity monitoring, cooling jacket temperature logs & bead charge wear records',
      'Raw material loading sequence management (Resin -> Solvents -> Wetting Additives -> Pigments -> Extenders)',
      'Equipment run-hour telemetry, impeller tip speed verification & dispersion energy logging',
    ],
    description:
      'Oversees high-speed dispersion and bead milling operations, enforces premix loading sequences, monitors mill base viscosity, and tracks grinding cycle run hours.',
    badgeStyle: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
  },
  {
    role: 'QUALITY_RHEOLOGY_MANAGER',
    designationKey: 'QUALITY_RHEOLOGY_MANAGER',
    title: 'Quality & Rheology Manager',
    subCategory: 'Paint',
    associatedDepartment: 'QUALITY',
    shortBadge: 'Rheology QC & CoA Lock',
    functions: [
      'Lab test parameter recording (Stormer Krebs Viscosity 85–115 KU, Density 1.25–1.40 g/mL, Hegman Fineness ≤ 25 µm)',
      'Drying time verification (Surface Dry, Hard Dry, Tack-Free) & gloss level specular reflection tests (20°, 60°, 85°)',
      'Strict unapproved batch dispatch blocking gate preventing uncertified paint from proceeding to packaging lines',
      'Automated Certificate of Analysis (CoA) generation with cryptographic test certification & batch clearance',
    ],
    description:
      'Governs rheological and physical quality assurance, tests Krebs viscosity and Hegman grind fineness, strictly blocks sub-spec batches from canning, and issues CoAs.',
    badgeStyle: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
  },
  {
    role: 'BASE_STOCK_TINTING_MANAGER',
    designationKey: 'BASE_STOCK_TINTING_MANAGER',
    title: 'Base Stock & Tinting Manager',
    subCategory: 'Paint',
    associatedDepartment: 'INVENTORY',
    shortBadge: 'Base Stocks & Tinting',
    functions: [
      'Bulk base paint inventory tracking (Base White, Deep Base, Clear Base, Transparent Tinting Base)',
      'Automated tinting machine dispenser integration (canister fluid levels, circuit purging, nozzle calibration)',
      'Colorant stock consumption reconciliation (VOC-free liquid pigment colorants & tinting paste)',
      'Base stock batch allocation & point-of-sale tinting formulation dispatch matching',
    ],
    description:
      'Controls bulk base paint stock reserves, integrates automatic colorant dispensers, tracks fluid levels in canisters, and reconciles colorant consumption.',
    badgeStyle: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  {
    role: 'FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER',
    designationKey: 'FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER',
    title: 'Flammable Packaging & Compliance Manager',
    subCategory: 'Paint',
    associatedDepartment: 'PACKING',
    shortBadge: 'Flammable Packaging & VOC',
    functions: [
      'Finished container inventory tracking across standardized volumes (1L, 4L, 10L, 20L tin cans, epoxy-lined pails)',
      'Batch numbering, manufacturing date (MFD), expiry date & statutory MRP inkjet printing verification',
      'Solvent warehouse safety compliance, anti-static grounding bonding continuity & vapor flare ventilation checks',
      'VOC regulatory compliance reporting (g/L volatile organic compounds vs national statutory thresholds)',
    ],
    description:
      'Manages automated canning and lid-crimping lines, verifies anti-static grounding bonding in solvent environments, validates container labeling, and monitors statutory VOC limits.',
    badgeStyle: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
  },
];

export const ALL_SPECIALIZED_ROLES: SpecializedRole[] = [
  ...STEEL_SPECIALIZED_ROLES,
  ...GLASS_SPECIALIZED_ROLES,
  ...CHEMICAL_SPECIALIZED_ROLES,
  ...PAINT_SPECIALIZED_ROLES,
];

export const MANUFACTURING_DEPARTMENTS: DepartmentMeta[] = [
  {
    key: 'EXECUTIVE',
    label: 'CEO / MD / Owner',
    shortLabel: 'Executive',
    codePrefix: 'EXEC',
    allowedDesignations: ['CEO', 'MD', 'OWNER'],
    description: 'Top-level enterprise authority across all 10 plant departments & financial approvals',
    permissionsByLevel: {
      OWNER: 'Full root ownership, company settings, executive onboarding & plant-wide sign-off',
      CEO: 'Full enterprise governance, production order sign-off, HR & purchasing approval',
      MD: 'Plant-wide operational control, cross-department approvals & executive reporting',
    },
  },
  {
    key: 'PRODUCTION',
    label: 'Production',
    shortLabel: 'Production',
    codePrefix: 'PROD',
    allowedDesignations: [
      'MANAGER',
      'SUBCONTRACTING_JOBWORK_MANAGER',
      'BATCH_HOUSE_MANAGER',
      'KILN_FURNACE_MANAGER',
      'CULLET_RECOVERY_MANAGER',
      'RD_FORMULA_CHEMIST_MANAGER',
      'REACTOR_BATCH_PRODUCTION_MANAGER',
      'PIGMENT_RESIN_DISPERSION_MANAGER',
      'ASSISTANT_MANAGER',
      'ASSOCIATE_MANAGER',
    ],
    description: 'Work orders, shop-floor scheduling, chemical batch reactors, formulas, bead mills & subcontracting job work tracking',
    permissionsByLevel: {
      MANAGER: 'Approve production orders, authorize batch releases & manage plant shift capacity',
      RD_FORMULA_CHEMIST_MANAGER:
        'Authorize master formulas, stoichiometry reaction routes & calculate theoretical yields',
      REACTOR_BATCH_PRODUCTION_MANAGER:
        'Oversee multi-stage batch reactor cycles, monitor utility duties & log equipment downtime',
      PIGMENT_RESIN_DISPERSION_MANAGER:
        'Supervise bead mill grinding cycles, verify mill base viscosity, premix loading sequence & equipment telemetry',
      SUBCONTRACTING_JOBWORK_MANAGER:
        'Issue external processing challans, calculate process loss/gain % & reconcile scrap returns',
      BATCH_HOUSE_MANAGER:
        'Maintain batch formulas, monitor weighing scales & cullet recycle ratios',
      KILN_FURNACE_MANAGER:
        'Regulate melter and annealing temperatures, burner maintenance & gas fuel metrics',
      CULLET_RECOVERY_MANAGER:
        'Track stage-wise rejections, mass balance loss & recycled cullet replenishment',
      ASSISTANT_MANAGER: 'Schedule daily production runs, monitor line OEE & escalate bottlenecks',
      ASSOCIATE_MANAGER: 'Log shift output, record material consumption & update machine run sheets',
    },
  },
  {
    key: 'INVENTORY',
    label: 'Inventory',
    shortLabel: 'Inventory',
    codePrefix: 'INV',
    allowedDesignations: [
      'MANAGER',
      'WEIGHBRIDGE_LOGISTICS_MANAGER',
      'HAZARDOUS_LOGISTICS_MANAGER',
      'BASE_STOCK_TINTING_MANAGER',
      'BATCH_HOUSE_MANAGER',
      'CULLET_RECOVERY_MANAGER',
      'ASSISTANT_MANAGER',
      'ASSOCIATE_MANAGER',
    ],
    description: 'Raw material stock control, bulk base stock tinting, dangerous goods transport (Tremcards), weighbridge slips & silos',
    permissionsByLevel: {
      MANAGER: 'Approve stock adjustments, write-offs, multi-warehouse transfers & valuation audits',
      BASE_STOCK_TINTING_MANAGER:
        'Manage bulk base white/deep tanks, colorant dispenser canister levels & stage-wise consumption reconciliation',
      HAZARDOUS_LOGISTICS_MANAGER:
        'Issue Tremcards, verify UN & Hazchem codes, validate hazmat driver licenses & dispatch road clearances',
      WEIGHBRIDGE_LOGISTICS_MANAGER:
        'Approve Tare/Gross weighbridge weights, match truck slips to POs & manage entry queue',
      BATCH_HOUSE_MANAGER:
        'Monitor raw silica, soda ash, and dolomite silo bins & automated reorder points',
      CULLET_RECOVERY_MANAGER:
        'Maintain cullet storage bays and manage internal scrap inventory',
      ASSISTANT_MANAGER: 'Manage GRN receipts, issue raw materials to production & track min-stock alerts',
      ASSOCIATE_MANAGER: 'Update bin locations, perform cycle counts & log daily stock inward/outward',
    },
  },
  {
    key: 'QUALITY',
    label: 'Quality (QA/QC)',
    shortLabel: 'Quality',
    codePrefix: 'QC',
    allowedDesignations: [
      'MANAGER',
      'METALLURGY_LAB_INCHARGE',
      'THERMAL_QUALITY_INCHARGE',
      'QA_ANALYTICAL_LAB_MANAGER',
      'COLOR_LAB_SHADE_MANAGER',
      'QUALITY_RHEOLOGY_MANAGER',
      'ASSISTANT_MANAGER',
      'ASSOCIATE_MANAGER',
    ],
    description: 'Analytical assay testing, spectrophotometer delta E matching, rheology viscosity clearance, CoA generation & dispatch gate locks',
    permissionsByLevel: {
      MANAGER: 'Final batch QC release/hold authority, CAPA sign-off & compliance certification',
      COLOR_LAB_SHADE_MANAGER:
        'Calibrate spectrophotometer CIELAB Delta E tolerances, approve shade cards & tinting formulas',
      QUALITY_RHEOLOGY_MANAGER:
        'Conduct Krebs viscosity and Hegman fineness tests, enforce strict canning dispatch locks & issue CoAs',
      QA_ANALYTICAL_LAB_MANAGER:
        'Upload assay & moisture test results, enforce strict dispatch locks on non-compliant batches & auto-issue CoAs',
      METALLURGY_LAB_INCHARGE:
        'Upload spectrometer heat tests, approve metal heats & auto-generate Material Test Certificates (MTC)',
      THERMAL_QUALITY_INCHARGE:
        'Conduct thermal shock bath tests, inspect bubbles/pinholes/warping, and clear lot releases',
      ASSISTANT_MANAGER: 'Review incoming raw material lab reports & supervise inline QC checks',
      ASSOCIATE_MANAGER: 'Execute sample inspections, log dimensional tolerances & record defect codes',
    },
  },
  {
    key: 'PACKING',
    label: 'Packing',
    shortLabel: 'Packing',
    codePrefix: 'PKG',
    allowedDesignations: [
      'MANAGER',
      'FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER',
      'ASSISTANT_MANAGER',
      'ASSOCIATE_MANAGER',
    ],
    description: 'Finished goods packaging, flammable container anti-static grounding, VOC compliance, barcode labeling & dispatch staging',
    permissionsByLevel: {
      MANAGER: 'Approve dispatch packing lists, export crate compliance & packaging material budgets',
      FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER:
        'Verify tin can inventory (1L-20L), MFD/batch inkjet printing, anti-static grounding continuity & VOC compliance',
      ASSISTANT_MANAGER: 'Assign packing line targets, verify batch labels & coordinate with Sales dispatch',
      ASSOCIATE_MANAGER: 'Scan finished goods barcodes, generate pallet labels & record packed quantities',
    },
  },
  {
    key: 'SECURITY',
    label: 'Security & Safety',
    shortLabel: 'Security',
    codePrefix: 'SEC',
    allowedDesignations: [
      'MANAGER',
      'EHS_SAFETY_MANAGER',
      'EHS_HAZMAT_MANAGER',
      'ASSISTANT_MANAGER',
      'ASSOCIATE_MANAGER',
    ],
    description: 'Plant gate entry/exit logs, hazardous waste manifests, EHS incident reporting, hot work permits & safety gear audits',
    permissionsByLevel: {
      MANAGER: 'Authorize outward material gate-passes, emergency overrides & contractor clearance',
      EHS_HAZMAT_MANAGER:
        'Audit chemical handling PPE compliance, log hazardous waste disposal manifests & maintain regulatory board records',
      EHS_SAFETY_MANAGER:
        'Log workplace incidents, audit safety PPE compliance & authorize electronic Hot Work Permits',
      ASSISTANT_MANAGER: 'Audit daily vehicle weighbridge slips, shift guard rosters & visitor permits',
      ASSOCIATE_MANAGER: 'Log truck arrivals/departures, verify seal numbers & issue visitor badges',
    },
  },
  {
    key: 'HR',
    label: 'Human Resources (HR)',
    shortLabel: 'HR',
    codePrefix: 'HR',
    allowedDesignations: ['MANAGER', 'ASSISTANT_MANAGER', 'ASSOCIATE_MANAGER'],
    description: 'Employee onboarding, RBAC department & role assignments, attendance & payroll',
    permissionsByLevel: {
      MANAGER: 'Full employee lifecycle management, assign/modify department roles & approve payroll',
      ASSISTANT_MANAGER: 'Onboard new staff, manage shift attendance rosters & leave approvals',
      ASSOCIATE_MANAGER: 'View employee directory, update attendance logs & maintain training records',
    },
  },
  {
    key: 'SALES',
    label: 'Sales',
    shortLabel: 'Sales',
    codePrefix: 'SLS',
    allowedDesignations: ['MANAGER', 'ASSISTANT_MANAGER', 'ASSOCIATE_MANAGER'],
    description: 'Customer quotations, sales order confirmations, pricing & dispatch coordination',
    permissionsByLevel: {
      MANAGER: 'Approve enterprise sales contracts, credit limits, discounts & dispatch priorities',
      ASSISTANT_MANAGER: 'Convert quotations to sales orders, track receivables & manage key accounts',
      ASSOCIATE_MANAGER: 'Create customer quotes, log inquiries & track shipment delivery status',
    },
  },
  {
    key: 'MACHINE_MAINTENANCE',
    label: 'Machine Maintenance',
    codePrefix: 'MNT',
    allowedDesignations: [
      'MANAGER',
      'MOULD_TOOLING_MANAGER',
      'ASSISTANT_MANAGER',
      'ASSOCIATE_MANAGER',
    ],
    description: 'Preventive maintenance, mould shot count tracking, cavity refurbishment, spare parts & equipment calibration',
    permissionsByLevel: {
      MANAGER: 'Approve major equipment overhauls, capital spares & shutdown maintenance windows',
      MOULD_TOOLING_MANAGER:
        'Track mould/die shot counts, precision CNC polishing & tooling refurbishment lines',
      ASSISTANT_MANAGER: 'Assign breakdown tickets, schedule preventive checks & monitor MTBF/MTTR',
      ASSOCIATE_MANAGER: 'Log daily machine checklists, record lubrication/calibration & spares usage',
    },
  },
  {
    key: 'PURCHASING_SOURCING',
    label: 'Purchasing & Sourcing',
    codePrefix: 'PUR',
    allowedDesignations: ['MANAGER', 'ASSISTANT_MANAGER', 'ASSOCIATE_MANAGER'],
    description: 'Vendor selection, RFQs, purchase order approvals & raw material procurement',
    permissionsByLevel: {
      MANAGER: 'Approve Purchase Orders (PO), finalize vendor rate contracts & supplier audits',
      ASSISTANT_MANAGER: 'Issue RFQs, compare vendor quotes & track inbound raw material ETAs',
      ASSOCIATE_MANAGER: 'Raise purchase requisitions, update vendor catalogs & match supplier invoices',
    },
  },
];

export function resolveRoleLabel(department: DepartmentKey, designation: DesignationKey): string {
  if (designation in DESIGNATION_LABELS && designation.includes('MANAGER') && designation !== 'MANAGER') {
    return DESIGNATION_LABELS[designation];
  }
  if (designation === 'THERMAL_QUALITY_INCHARGE' || designation === 'METALLURGY_LAB_INCHARGE') {
    return DESIGNATION_LABELS[designation];
  }
  if (department === 'EXECUTIVE') {
    return DESIGNATION_LABELS[designation] || designation;
  }
  const dept = MANUFACTURING_DEPARTMENTS.find((d) => d.key === department);
  const deptName = dept ? dept.shortLabel : department;
  return `${deptName} ${DESIGNATION_LABELS[designation] || designation}`;
}
