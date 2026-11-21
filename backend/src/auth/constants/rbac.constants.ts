export enum Department {
  EXECUTIVE = 'EXECUTIVE',
  PRODUCTION = 'PRODUCTION',
  INVENTORY = 'INVENTORY',
  QUALITY = 'QUALITY',
  PACKING = 'PACKING',
  SECURITY = 'SECURITY',
  HR = 'HR',
  SALES = 'SALES',
  MACHINE_MAINTENANCE = 'MACHINE_MAINTENANCE',
  PURCHASING_SOURCING = 'PURCHASING_SOURCING',
}

export enum Designation {
  CEO = 'CEO',
  MD = 'MD',
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  ASSISTANT_MANAGER = 'ASSISTANT_MANAGER',
  ASSOCIATE_MANAGER = 'ASSOCIATE_MANAGER',

  // Specialized Designations for Steel & Heavy Metals
  WEIGHBRIDGE_LOGISTICS_MANAGER = 'WEIGHBRIDGE_LOGISTICS_MANAGER',
  METALLURGY_LAB_INCHARGE = 'METALLURGY_LAB_INCHARGE',
  SUBCONTRACTING_JOBWORK_MANAGER = 'SUBCONTRACTING_JOBWORK_MANAGER',
  EHS_SAFETY_MANAGER = 'EHS_SAFETY_MANAGER',

  // Specialized Designations for Glass & Ceramic Production
  BATCH_HOUSE_MANAGER = 'BATCH_HOUSE_MANAGER',
  KILN_FURNACE_MANAGER = 'KILN_FURNACE_MANAGER',
  MOULD_TOOLING_MANAGER = 'MOULD_TOOLING_MANAGER',
  THERMAL_QUALITY_INCHARGE = 'THERMAL_QUALITY_INCHARGE',
  CULLET_RECOVERY_MANAGER = 'CULLET_RECOVERY_MANAGER',

  // Specialized Designations for Chemical Industries
  RD_FORMULA_CHEMIST_MANAGER = 'RD_FORMULA_CHEMIST_MANAGER',
  EHS_HAZMAT_MANAGER = 'EHS_HAZMAT_MANAGER',
  QA_ANALYTICAL_LAB_MANAGER = 'QA_ANALYTICAL_LAB_MANAGER',
  REACTOR_BATCH_PRODUCTION_MANAGER = 'REACTOR_BATCH_PRODUCTION_MANAGER',
  HAZARDOUS_LOGISTICS_MANAGER = 'HAZARDOUS_LOGISTICS_MANAGER',

  // Specialized Designations for Paint & Coatings
  COLOR_LAB_SHADE_MANAGER = 'COLOR_LAB_SHADE_MANAGER',
  PIGMENT_RESIN_DISPERSION_MANAGER = 'PIGMENT_RESIN_DISPERSION_MANAGER',
  QUALITY_RHEOLOGY_MANAGER = 'QUALITY_RHEOLOGY_MANAGER',
  BASE_STOCK_TINTING_MANAGER = 'BASE_STOCK_TINTING_MANAGER',
  FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER = 'FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER',
}

export enum Role {
  // Executive Leadership
  CEO = 'CEO',
  MD = 'MD',
  OWNER = 'OWNER',

  // Production
  PRODUCTION_MANAGER = 'PRODUCTION_MANAGER',
  PRODUCTION_ASSISTANT_MANAGER = 'PRODUCTION_ASSISTANT_MANAGER',
  PRODUCTION_ASSOCIATE_MANAGER = 'PRODUCTION_ASSOCIATE_MANAGER',

  // Inventory
  INVENTORY_MANAGER = 'INVENTORY_MANAGER',
  INVENTORY_ASSISTANT_MANAGER = 'INVENTORY_ASSISTANT_MANAGER',
  INVENTORY_ASSOCIATE_MANAGER = 'INVENTORY_ASSOCIATE_MANAGER',

  // Quality
  QUALITY_MANAGER = 'QUALITY_MANAGER',
  QUALITY_ASSISTANT_MANAGER = 'QUALITY_ASSISTANT_MANAGER',
  QUALITY_ASSOCIATE_MANAGER = 'QUALITY_ASSOCIATE_MANAGER',

  // Packing
  PACKING_MANAGER = 'PACKING_MANAGER',
  PACKING_ASSISTANT_MANAGER = 'PACKING_ASSISTANT_MANAGER',
  PACKING_ASSOCIATE_MANAGER = 'PACKING_ASSOCIATE_MANAGER',

  // Security
  SECURITY_MANAGER = 'SECURITY_MANAGER',
  SECURITY_ASSISTANT_MANAGER = 'SECURITY_ASSISTANT_MANAGER',
  SECURITY_ASSOCIATE_MANAGER = 'SECURITY_ASSOCIATE_MANAGER',

  // HR
  HR_MANAGER = 'HR_MANAGER',
  HR_ASSISTANT_MANAGER = 'HR_ASSISTANT_MANAGER',
  HR_ASSOCIATE_MANAGER = 'HR_ASSOCIATE_MANAGER',

  // Sales
  SALES_MANAGER = 'SALES_MANAGER',
  SALES_ASSISTANT_MANAGER = 'SALES_ASSISTANT_MANAGER',
  SALES_ASSOCIATE_MANAGER = 'SALES_ASSOCIATE_MANAGER',

  // Machine Maintenance
  MACHINE_MAINTENANCE_MANAGER = 'MACHINE_MAINTENANCE_MANAGER',
  MACHINE_MAINTENANCE_ASSISTANT_MANAGER = 'MACHINE_MAINTENANCE_ASSISTANT_MANAGER',
  MACHINE_MAINTENANCE_ASSOCIATE_MANAGER = 'MACHINE_MAINTENANCE_ASSOCIATE_MANAGER',

  // Purchasing & Sourcing
  PURCHASING_SOURCING_MANAGER = 'PURCHASING_SOURCING_MANAGER',
  PURCHASING_SOURCING_ASSISTANT_MANAGER = 'PURCHASING_SOURCING_ASSISTANT_MANAGER',
  PURCHASING_SOURCING_ASSOCIATE_MANAGER = 'PURCHASING_SOURCING_ASSOCIATE_MANAGER',

  // Specialized Roles (Heavy & Raw Materials - Steel & Heavy Metals Sub-Category)
  WEIGHBRIDGE_LOGISTICS_MANAGER = 'WEIGHBRIDGE_LOGISTICS_MANAGER',
  METALLURGY_LAB_INCHARGE = 'METALLURGY_LAB_INCHARGE',
  SUBCONTRACTING_JOBWORK_MANAGER = 'SUBCONTRACTING_JOBWORK_MANAGER',
  EHS_SAFETY_MANAGER = 'EHS_SAFETY_MANAGER',

  // Specialized Roles (Heavy & Raw Materials - Glass & Ceramic Production Sub-Category)
  BATCH_HOUSE_MANAGER = 'BATCH_HOUSE_MANAGER',
  KILN_FURNACE_MANAGER = 'KILN_FURNACE_MANAGER',
  MOULD_TOOLING_MANAGER = 'MOULD_TOOLING_MANAGER',
  THERMAL_QUALITY_INCHARGE = 'THERMAL_QUALITY_INCHARGE',
  CULLET_RECOVERY_MANAGER = 'CULLET_RECOVERY_MANAGER',

  // Specialized Roles (Process & Chemical Industries - Chemical Sub-Category)
  RD_FORMULA_CHEMIST_MANAGER = 'RD_FORMULA_CHEMIST_MANAGER',
  EHS_HAZMAT_MANAGER = 'EHS_HAZMAT_MANAGER',
  QA_ANALYTICAL_LAB_MANAGER = 'QA_ANALYTICAL_LAB_MANAGER',
  REACTOR_BATCH_PRODUCTION_MANAGER = 'REACTOR_BATCH_PRODUCTION_MANAGER',
  HAZARDOUS_LOGISTICS_MANAGER = 'HAZARDOUS_LOGISTICS_MANAGER',

  // Specialized Roles (Process & Chemical Industries - Paint Sub-Category)
  COLOR_LAB_SHADE_MANAGER = 'COLOR_LAB_SHADE_MANAGER',
  PIGMENT_RESIN_DISPERSION_MANAGER = 'PIGMENT_RESIN_DISPERSION_MANAGER',
  QUALITY_RHEOLOGY_MANAGER = 'QUALITY_RHEOLOGY_MANAGER',
  BASE_STOCK_TINTING_MANAGER = 'BASE_STOCK_TINTING_MANAGER',
  FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER = 'FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER',
}

export const EXECUTIVE_ROLES: Role[] = [Role.CEO, Role.MD, Role.OWNER];

export const STEEL_SPECIALIZED_ROLES: Role[] = [
  Role.WEIGHBRIDGE_LOGISTICS_MANAGER,
  Role.METALLURGY_LAB_INCHARGE,
  Role.SUBCONTRACTING_JOBWORK_MANAGER,
  Role.EHS_SAFETY_MANAGER,
];

export const GLASS_SPECIALIZED_ROLES: Role[] = [
  Role.BATCH_HOUSE_MANAGER,
  Role.KILN_FURNACE_MANAGER,
  Role.MOULD_TOOLING_MANAGER,
  Role.THERMAL_QUALITY_INCHARGE,
  Role.CULLET_RECOVERY_MANAGER,
];

export const CHEMICAL_SPECIALIZED_ROLES: Role[] = [
  Role.RD_FORMULA_CHEMIST_MANAGER,
  Role.EHS_HAZMAT_MANAGER,
  Role.QA_ANALYTICAL_LAB_MANAGER,
  Role.REACTOR_BATCH_PRODUCTION_MANAGER,
  Role.HAZARDOUS_LOGISTICS_MANAGER,
];

export const PAINT_SPECIALIZED_ROLES: Role[] = [
  Role.COLOR_LAB_SHADE_MANAGER,
  Role.PIGMENT_RESIN_DISPERSION_MANAGER,
  Role.QUALITY_RHEOLOGY_MANAGER,
  Role.BASE_STOCK_TINTING_MANAGER,
  Role.FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER,
];

export const ALL_SPECIALIZED_ROLES: Role[] = [
  ...STEEL_SPECIALIZED_ROLES,
  ...GLASS_SPECIALIZED_ROLES,
  ...CHEMICAL_SPECIALIZED_ROLES,
  ...PAINT_SPECIALIZED_ROLES,
];

export interface SpecializedRoleMeta {
  role: Role;
  designationKey: Designation;
  label: string;
  subCategory: string;
  associatedDepartment: Department;
  functions: string[];
  description: string;
}

export const STEEL_SPECIALIZED_ROLES_METADATA: SpecializedRoleMeta[] = [
  {
    role: Role.WEIGHBRIDGE_LOGISTICS_MANAGER,
    designationKey: Designation.WEIGHBRIDGE_LOGISTICS_MANAGER,
    label: 'Weighbridge & Logistics Manager',
    subCategory: 'Steel and Heavy Metals',
    associatedDepartment: Department.INVENTORY,
    functions: [
      'Tare & Gross weight digital approvals for incoming raw materials (scrap, billets, coils)',
      'Purchase Order (PO) and Supplier Invoice linkage with weight tolerance thresholds',
      'Truck queue orchestration, inward weighment slips & gate pass verification',
    ],
    description:
      'Governs electronic weighbridge gross/tare scales, approves inbound metal deliveries, and checks tolerance variance against purchase orders.',
  },
  {
    role: Role.METALLURGY_LAB_INCHARGE,
    designationKey: Designation.METALLURGY_LAB_INCHARGE,
    label: 'Metallurgy & Lab In-Charge',
    subCategory: 'Steel and Heavy Metals',
    associatedDepartment: Department.QUALITY,
    functions: [
      'Spectrometer lab test result uploads & chemical composition analysis (C, Mn, Si, S, P, Cr)',
      'Metal heat approvals and mechanical properties verification (Yield, Tensile, Elongation)',
      'Auto-generation and cryptographic sign-off of Material Test Certificates (MTC / Mill Test Report)',
    ],
    description:
      'Analyzes furnace heat chemistries, approves heats conforming to ASTM/IS standards, and generates customer Material Test Certificates (MTC).',
  },
  {
    role: Role.SUBCONTRACTING_JOBWORK_MANAGER,
    designationKey: Designation.SUBCONTRACTING_JOBWORK_MANAGER,
    label: 'Subcontracting & Job Work Manager',
    subCategory: 'Steel and Heavy Metals',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Material challan issuance for external processing (Heat Treatment, Galvanizing, Slitting, Pickling)',
      'Input dispatched weight vs output received weight reconciliation and loss/gain calculation',
      'Scrap return reconciliation, burning loss tracking & subcontractor debit note authorizations',
    ],
    description:
      'Administers outside processing conversion cycles, monitors weight differences, and balances scrap metal returns with contractors.',
  },
  {
    role: Role.EHS_SAFETY_MANAGER,
    designationKey: Designation.EHS_SAFETY_MANAGER,
    label: 'EHS & Safety Manager',
    subCategory: 'Steel and Heavy Metals',
    associatedDepartment: Department.SECURITY,
    functions: [
      'Shop-floor incident logging, hazardous condition reports & root cause investigation',
      'Electronic Hot Work Permit approvals for high-temperature zones (Furnace, Torch Cutting, Welding)',
      'Safety gear (PPE) audits, hazardous gas detection logs & statutory environmental compliance',
    ],
    description:
      'Oversees heavy industrial plant safety, enforces molten metal protective gear protocols, and authorizes electronic hot work permits.',
  },
];

export const GLASS_SPECIALIZED_ROLES_METADATA: SpecializedRoleMeta[] = [
  {
    role: Role.BATCH_HOUSE_MANAGER,
    designationKey: Designation.BATCH_HOUSE_MANAGER,
    label: 'Batch House Manager',
    subCategory: 'Glass and Ceramic',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Recipe & formula master data maintenance (Silica sand, Soda ash, Limestone, Feldspar, Dolomite)',
      'Batch raw material weighing & automated hopper dispensing validation',
      'Cullet recycled ratio tracking (% of internal + external cullet vs virgin batch)',
      'Silo & day-bin real-time inventory level monitoring & reorder triggers',
    ],
    description:
      'Controls batch formulation recipes, oversees scale accuracy, monitors cullet addition ratios, and ensures continuous raw material feed to melting furnaces.',
  },
  {
    role: Role.KILN_FURNACE_MANAGER,
    designationKey: Designation.KILN_FURNACE_MANAGER,
    label: 'Kiln & Furnace Manager',
    subCategory: 'Glass and Ceramic',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Melter, refining, and annealing lehr multi-zone temperature telemetry logging (°C)',
      'Fuel & natural gas consumption calculation per metric ton of melted glass/ceramic',
      'Burner nozzle firing maintenance, reversal cycles & refractory crown health logs',
      'Thermal shock gradient parameters & furnace pressure stabilization',
    ],
    description:
      'Supervises glass melting furnaces and ceramic kilns, regulates temperature gradients, minimizes specific fuel consumption, and coordinates burner reversals.',
  },
  {
    role: Role.MOULD_TOOLING_MANAGER,
    designationKey: Designation.MOULD_TOOLING_MANAGER,
    label: 'Mould & Tooling Manager',
    subCategory: 'Glass and Ceramic',
    associatedDepartment: Department.MACHINE_MAINTENANCE,
    functions: [
      'Mould and die life cycle tracking with automated shot counts & machine run-hours',
      'Tooling allocation across IS machines, press blow lines & ceramic tile presses',
      'Precision CNC machining, cavity polishing & dry lubricant refurbishment schedules',
      'Mould cavity wear measurements & pre-emptive replacement clearance',
    ],
    description:
      'Maintains blow/blank moulds and ceramic dies, monitors cumulative shot cycles against rated lifespans, and operates the tooling refurbishment shop.',
  },
  {
    role: Role.THERMAL_QUALITY_INCHARGE,
    designationKey: Designation.THERMAL_QUALITY_INCHARGE,
    label: 'Thermal Quality In-Charge',
    subCategory: 'Glass and Ceramic',
    associatedDepartment: Department.QUALITY,
    functions: [
      'Surface & optical defect inspection (seeds, bubbles, stones, cord lines, pinholes, warping)',
      'Destructive thermal shock bath quench tests (hot/cold water differential delta T)',
      'Polarimeter residual stress evaluation (ASTM C148 / Annealing Lehr stress grades)',
      'Lot-wise quality clearance, defect PPM tracking & compliance release certification',
    ],
    description:
      'Directs optical and physical quality assurance, executes thermal shock stress testing, verifies dimensional flatness, and authorizes batch releases.',
  },
  {
    role: Role.CULLET_RECOVERY_MANAGER,
    designationKey: Designation.CULLET_RECOVERY_MANAGER,
    label: 'Cullet Recovery Manager',
    subCategory: 'Glass and Ceramic',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Stage-wise scrap and rejection logging (Hot End shears, Lehr exit, Cold End packing reject)',
      'Scrap cullet recovery percentage calculation across automated production lines',
      'Raw material input vs finished packaged output mass balance reconciliation',
      'Crushed cullet re-introduction scheduling to minimize virgin melting energy',
    ],
    description:
      'Oversees closed-loop plant recycling, measures hot and cold end rejection rates, reconciles mass balance yields, and returns clean cullet to batch houses.',
  },
];

export const CHEMICAL_SPECIALIZED_ROLES_METADATA: SpecializedRoleMeta[] = [
  {
    role: Role.RD_FORMULA_CHEMIST_MANAGER,
    designationKey: Designation.RD_FORMULA_CHEMIST_MANAGER,
    label: 'R&D Formula & Chemist Manager',
    subCategory: 'Chemicals',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Master formula versioning, stoichiometry & chemical reaction kinetics',
      'Stoichiometric theoretical yield vs actual isolated product calculations',
      'New product formulation authorizations, synthesis route approvals & hazard classification',
      'Safety Data Sheet (SDS / MSDS) compliance & raw material chemical specifications',
    ],
    description:
      'Governs master chemical synthesis formulations, manages reaction stoichiometry, calculates stoichiometric theoretical yields, and signs off new molecule/compound authorizations.',
  },
  {
    role: Role.EHS_HAZMAT_MANAGER,
    designationKey: Designation.EHS_HAZMAT_MANAGER,
    label: 'EHS & Hazmat Safety Manager',
    subCategory: 'Chemicals',
    associatedDepartment: Department.SECURITY,
    functions: [
      'Hazardous waste disposal manifests, spent solvent tracking & CPCB/SPCB regulatory logs',
      'Personal Protective Equipment (PPE) compliance audits, respiratory gear & chemical eyewash checks',
      'Chemical handling permits, toxic vapor containment protocols & MSDS emergency readiness',
      'State Pollution Control Board statutory authorizations & TSDF disposal certificates',
    ],
    description:
      'Supervises chemical plant environmental health and safety, maintains hazardous waste manifests, tracks solvent recovery, and enforces personal protective protocols.',
  },
  {
    role: Role.QA_ANALYTICAL_LAB_MANAGER,
    designationKey: Designation.QA_ANALYTICAL_LAB_MANAGER,
    label: 'QA Analytical Lab Manager',
    subCategory: 'Chemicals',
    associatedDepartment: Department.QUALITY,
    functions: [
      'Analytical lab test result uploads (Assay Purity %, pH, Karl Fischer moisture, Specific gravity)',
      'Strict unapproved batch dispatch blocking gate (blocks sub-spec lots from shipment)',
      'Automated Certificate of Analysis (CoA) generation with cryptographic test certification',
      'Spectrophotometry, HPLC/GC chromatography data verification & lot re-test workflows',
    ],
    description:
      'Manages analytical quality assurance, blocks sub-standard chemical lots from dispatch, and authorizes automated Certificates of Analysis (CoA).',
  },
  {
    role: Role.REACTOR_BATCH_PRODUCTION_MANAGER,
    designationKey: Designation.REACTOR_BATCH_PRODUCTION_MANAGER,
    label: 'Reactor Batch Production Manager',
    subCategory: 'Chemicals',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Batch processing stage tracking (Charging, Reaction, Reflux, Distillation, Cooling, Discharging)',
      'Reactor utility consumption monitoring (steam boiler duty, chilled water m³, electrical power)',
      'Equipment downtime tracking, condenser fouling alerts & batch yield variance reconciliation',
      'Jacket temperature, pressure vessel telemetry & exothermic run-away safety interlocks',
    ],
    description:
      'Directs chemical batch reactors, tracks seven-stage reaction progression, logs utility duty per kilogram of output, and records downtime reasons.',
  },
  {
    role: Role.HAZARDOUS_LOGISTICS_MANAGER,
    designationKey: Designation.HAZARDOUS_LOGISTICS_MANAGER,
    label: 'Hazardous Logistics & Dangerous Goods Manager',
    subCategory: 'Chemicals',
    associatedDepartment: Department.INVENTORY,
    functions: [
      'Dangerous goods transport documentation (UN Numbers, Hazchem emergency codes, Hazmat placards)',
      'Transport Emergency Card (Tremcard) issuance & emergency response driver instructions',
      'Hazmat-endorsed commercial driver license validation & vehicle PESO explosive fitness checks',
      'Statutory transit permits, explosive road clearances & route departure dispatch authorization',
    ],
    description:
      'Coordinates hazardous goods dispatches, validates Hazchem codes and UN numbers, generates Tremcards, and verifies driver hazmat endorsements before gate exit.',
  },
];

export const PAINT_SPECIALIZED_ROLES_METADATA: SpecializedRoleMeta[] = [
  {
    role: Role.COLOR_LAB_SHADE_MANAGER,
    designationKey: Designation.COLOR_LAB_SHADE_MANAGER,
    label: 'Color Lab & Shade Manager',
    subCategory: 'Paint',
    associatedDepartment: Department.QUALITY,
    functions: [
      'Master shade cards management (RAL, Pantone, IS shade standards)',
      'Spectrophotometer CIELAB integration (L*, a*, b*) and Delta E tolerance limit validation (ΔE ≤ 0.50)',
      'Custom color tinting formula approvals and shade drift adjustment authorization',
      'Target color reflectance curve verification and digital shade library archives',
    ],
    description:
      'Directs industrial color formulation, calibrates spectrophotometer CIELAB colorimeters, maintains shade master standards, and signs off tinting formulas.',
  },
  {
    role: Role.PIGMENT_RESIN_DISPERSION_MANAGER,
    designationKey: Designation.PIGMENT_RESIN_DISPERSION_MANAGER,
    label: 'Pigment & Resin Dispersion Manager',
    subCategory: 'Paint',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Grinding batch cycle tracking across sand mills, bead mills, and high-speed dispersers (HSD)',
      'Mill base viscosity monitoring, cooling jacket temperature logs, and bead charge wear records',
      'Raw material loading sequence management (Resin -> Solvents -> Wetting Additives -> Pigments -> Extenders)',
      'Equipment run-hour telemetry, impeller tip speed verification, and dispersion energy logging',
    ],
    description:
      'Oversees high-speed dispersion and bead milling operations, enforces premix loading sequences, monitors mill base viscosity, and tracks grinding cycle run hours.',
  },
  {
    role: Role.QUALITY_RHEOLOGY_MANAGER,
    designationKey: Designation.QUALITY_RHEOLOGY_MANAGER,
    label: 'Quality & Rheology Manager',
    subCategory: 'Paint',
    associatedDepartment: Department.QUALITY,
    functions: [
      'Lab test parameter recording (Stormer Krebs Viscosity 85–115 KU, Density 1.25–1.40 g/mL, Hegman Fineness ≤ 25 µm)',
      'Drying time verification (Surface Dry, Hard Dry, Tack-Free) and gloss level specular reflection tests (20°, 60°, 85°)',
      'Strict unapproved batch dispatch blocking gate preventing uncertified paint from proceeding to packaging lines',
      'Automated Certificate of Analysis (CoA) generation with cryptographic test certification and batch clearance',
    ],
    description:
      'Governs rheological and physical quality assurance, tests Krebs viscosity and Hegman grind fineness, strictly blocks sub-spec batches from canning, and issues CoAs.',
  },
  {
    role: Role.BASE_STOCK_TINTING_MANAGER,
    designationKey: Designation.BASE_STOCK_TINTING_MANAGER,
    label: 'Base Stock & Tinting Manager',
    subCategory: 'Paint',
    associatedDepartment: Department.INVENTORY,
    functions: [
      'Bulk base paint inventory tracking (Base White, Deep Base, Clear Base, Transparent Tinting Base)',
      'Automated tinting machine dispenser integration (canister fluid levels, circuit purging, nozzle calibration)',
      'Colorant stock consumption reconciliation (VOC-free liquid pigment colorants & tinting paste)',
      'Base stock batch allocation and point-of-sale tinting formulation dispatch matching',
    ],
    description:
      'Controls bulk base paint stock reserves, integrates automatic colorant dispensers, tracks fluid levels in canisters, and reconciles colorant consumption.',
  },
  {
    role: Role.FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER,
    designationKey: Designation.FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER,
    label: 'Flammable Packaging & Compliance Manager',
    subCategory: 'Paint',
    associatedDepartment: Department.PACKING,
    functions: [
      'Finished container inventory tracking across standardized volumes (1L, 4L, 10L, 20L tin cans, epoxy-lined pails)',
      'Batch numbering, manufacturing date (MFD), expiry date, and statutory MRP inkjet printing verification',
      'Solvent warehouse safety compliance, anti-static grounding bonding continuity, and vapor flare ventilation checks',
      'VOC regulatory compliance reporting (g/L volatile organic compounds vs national statutory thresholds)',
    ],
    description:
      'Manages automated canning and lid-crimping lines, verifies anti-static grounding bonding in solvent environments, validates container labeling, and monitors statutory VOC limits.',
  },
];

export const ALL_SPECIALIZED_ROLES_METADATA: SpecializedRoleMeta[] = [
  ...STEEL_SPECIALIZED_ROLES_METADATA,
  ...GLASS_SPECIALIZED_ROLES_METADATA,
  ...CHEMICAL_SPECIALIZED_ROLES_METADATA,
  ...PAINT_SPECIALIZED_ROLES_METADATA,
];

export const DESIGNATION_HIERARCHY_WEIGHT: Record<string, number> = {
  [Designation.OWNER]: 100,
  [Designation.CEO]: 100,
  [Designation.MD]: 95,
  [Designation.MANAGER]: 70,

  // Steel Roles
  [Designation.WEIGHBRIDGE_LOGISTICS_MANAGER]: 70,
  [Designation.METALLURGY_LAB_INCHARGE]: 70,
  [Designation.SUBCONTRACTING_JOBWORK_MANAGER]: 70,
  [Designation.EHS_SAFETY_MANAGER]: 70,

  // Glass & Ceramic Roles
  [Designation.BATCH_HOUSE_MANAGER]: 70,
  [Designation.KILN_FURNACE_MANAGER]: 70,
  [Designation.MOULD_TOOLING_MANAGER]: 70,
  [Designation.THERMAL_QUALITY_INCHARGE]: 70,
  [Designation.CULLET_RECOVERY_MANAGER]: 70,

  // Chemical Roles
  [Designation.RD_FORMULA_CHEMIST_MANAGER]: 70,
  [Designation.EHS_HAZMAT_MANAGER]: 70,
  [Designation.QA_ANALYTICAL_LAB_MANAGER]: 70,
  [Designation.REACTOR_BATCH_PRODUCTION_MANAGER]: 70,
  [Designation.HAZARDOUS_LOGISTICS_MANAGER]: 70,

  // Paint Roles
  [Designation.COLOR_LAB_SHADE_MANAGER]: 70,
  [Designation.PIGMENT_RESIN_DISPERSION_MANAGER]: 70,
  [Designation.QUALITY_RHEOLOGY_MANAGER]: 70,
  [Designation.BASE_STOCK_TINTING_MANAGER]: 70,
  [Designation.FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER]: 70,

  [Designation.ASSISTANT_MANAGER]: 50,
  [Designation.ASSOCIATE_MANAGER]: 30,
};

export interface DepartmentDefinition {
  key: Department;
  label: string;
  codePrefix: string;
  allowedDesignations: Designation[];
  permissionsSummary: string;
}

export const MANUFACTURING_DEPARTMENTS: DepartmentDefinition[] = [
  {
    key: Department.EXECUTIVE,
    label: 'CEO / MD / Owner (Executive)',
    codePrefix: 'EXEC',
    allowedDesignations: [Designation.CEO, Designation.MD, Designation.OWNER],
    permissionsSummary: 'Full enterprise governance, financial sign-off, plant-wide approvals & RBAC control',
  },
  {
    key: Department.PRODUCTION,
    label: 'Production',
    codePrefix: 'PROD',
    allowedDesignations: [
      Designation.MANAGER,
      Designation.SUBCONTRACTING_JOBWORK_MANAGER,
      Designation.BATCH_HOUSE_MANAGER,
      Designation.KILN_FURNACE_MANAGER,
      Designation.CULLET_RECOVERY_MANAGER,
      Designation.RD_FORMULA_CHEMIST_MANAGER,
      Designation.REACTOR_BATCH_PRODUCTION_MANAGER,
      Designation.PIGMENT_RESIN_DISPERSION_MANAGER,
      Designation.ASSISTANT_MANAGER,
      Designation.ASSOCIATE_MANAGER,
    ],
    permissionsSummary:
      'Approve production orders, reactor batch cycles, master formulas, kiln telemetry, pigment dispersion milling, subcontracting challans & recovery balances',
  },
  {
    key: Department.INVENTORY,
    label: 'Inventory',
    codePrefix: 'INV',
    allowedDesignations: [
      Designation.MANAGER,
      Designation.WEIGHBRIDGE_LOGISTICS_MANAGER,
      Designation.HAZARDOUS_LOGISTICS_MANAGER,
      Designation.BASE_STOCK_TINTING_MANAGER,
      Designation.BATCH_HOUSE_MANAGER,
      Designation.CULLET_RECOVERY_MANAGER,
      Designation.ASSISTANT_MANAGER,
      Designation.ASSOCIATE_MANAGER,
    ],
    permissionsSummary:
      'Raw material inward/outward control, dangerous goods transport (Tremcards), bulk base stock tinting, weighbridge slips, raw batch silos & stock levels',
  },
  {
    key: Department.QUALITY,
    label: 'Quality (QA/QC)',
    codePrefix: 'QC',
    allowedDesignations: [
      Designation.MANAGER,
      Designation.METALLURGY_LAB_INCHARGE,
      Designation.THERMAL_QUALITY_INCHARGE,
      Designation.QA_ANALYTICAL_LAB_MANAGER,
      Designation.COLOR_LAB_SHADE_MANAGER,
      Designation.QUALITY_RHEOLOGY_MANAGER,
      Designation.ASSISTANT_MANAGER,
      Designation.ASSOCIATE_MANAGER,
    ],
    permissionsSummary:
      'Batch analytical testing, spectrophotometer delta E matching, rheology viscosity clearance, CoA generation, dispatch gate locking, metallurgy heat approvals & thermal shock clearance',
  },
  {
    key: Department.PACKING,
    label: 'Packing',
    codePrefix: 'PKG',
    allowedDesignations: [
      Designation.MANAGER,
      Designation.FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER,
      Designation.ASSISTANT_MANAGER,
      Designation.ASSOCIATE_MANAGER,
    ],
    permissionsSummary:
      'Finished goods packaging, flammable container anti-static grounding, VOC compliance, barcode/pallet labeling & dispatch readiness clearance',
  },
  {
    key: Department.SECURITY,
    label: 'Security & Safety',
    codePrefix: 'SEC',
    allowedDesignations: [
      Designation.MANAGER,
      Designation.EHS_SAFETY_MANAGER,
      Designation.EHS_HAZMAT_MANAGER,
      Designation.ASSISTANT_MANAGER,
      Designation.ASSOCIATE_MANAGER,
    ],
    permissionsSummary: 'Gate entry/exit logs, hazardous waste manifests, EHS incidents, hot work permits & chemical plant safety',
  },
  {
    key: Department.HR,
    label: 'Human Resources (HR)',
    codePrefix: 'HR',
    allowedDesignations: [Designation.MANAGER, Designation.ASSISTANT_MANAGER, Designation.ASSOCIATE_MANAGER],
    permissionsSummary: 'Employee onboarding, department & role assignment, shift attendance & payroll records',
  },
  {
    key: Department.SALES,
    label: 'Sales',
    codePrefix: 'SLS',
    allowedDesignations: [Designation.MANAGER, Designation.ASSISTANT_MANAGER, Designation.ASSOCIATE_MANAGER],
    permissionsSummary: 'Customer quotations, sales orders, dispatch scheduling & dealer account management',
  },
  {
    key: Department.MACHINE_MAINTENANCE,
    label: 'Machine Maintenance',
    codePrefix: 'MNT',
    allowedDesignations: [
      Designation.MANAGER,
      Designation.MOULD_TOOLING_MANAGER,
      Designation.ASSISTANT_MANAGER,
      Designation.ASSOCIATE_MANAGER,
    ],
    permissionsSummary:
      'Preventive maintenance, mould shot count tracking, cavity refurbishment, spare parts & equipment calibration',
  },
  {
    key: Department.PURCHASING_SOURCING,
    label: 'Purchasing & Sourcing',
    codePrefix: 'PUR',
    allowedDesignations: [Designation.MANAGER, Designation.ASSISTANT_MANAGER, Designation.ASSOCIATE_MANAGER],
    permissionsSummary: 'Vendor onboarding, RFQs, purchase order approvals & raw material procurement',
  },
];

/**
 * Resolves a (Department, Designation) or specialized role pair into the strict RBAC Role enum.
 */
export function resolveRoleFromHierarchy(
  department: Department | string,
  designation: Designation | string,
  specializedRole?: Role | string,
): Role {
  if (specializedRole && Object.values(Role).includes(specializedRole as Role)) {
    return specializedRole as Role;
  }

  // Steel Specialized Roles
  if (
    designation === Designation.WEIGHBRIDGE_LOGISTICS_MANAGER ||
    (designation as unknown as string) === Role.WEIGHBRIDGE_LOGISTICS_MANAGER
  ) {
    return Role.WEIGHBRIDGE_LOGISTICS_MANAGER;
  }
  if (
    designation === Designation.METALLURGY_LAB_INCHARGE ||
    (designation as unknown as string) === Role.METALLURGY_LAB_INCHARGE
  ) {
    return Role.METALLURGY_LAB_INCHARGE;
  }
  if (
    designation === Designation.SUBCONTRACTING_JOBWORK_MANAGER ||
    (designation as unknown as string) === Role.SUBCONTRACTING_JOBWORK_MANAGER
  ) {
    return Role.SUBCONTRACTING_JOBWORK_MANAGER;
  }
  if (
    designation === Designation.EHS_SAFETY_MANAGER ||
    (designation as unknown as string) === Role.EHS_SAFETY_MANAGER
  ) {
    return Role.EHS_SAFETY_MANAGER;
  }

  // Glass & Ceramic Specialized Roles
  if (
    designation === Designation.BATCH_HOUSE_MANAGER ||
    (designation as unknown as string) === Role.BATCH_HOUSE_MANAGER
  ) {
    return Role.BATCH_HOUSE_MANAGER;
  }
  if (
    designation === Designation.KILN_FURNACE_MANAGER ||
    (designation as unknown as string) === Role.KILN_FURNACE_MANAGER
  ) {
    return Role.KILN_FURNACE_MANAGER;
  }
  if (
    designation === Designation.MOULD_TOOLING_MANAGER ||
    (designation as unknown as string) === Role.MOULD_TOOLING_MANAGER
  ) {
    return Role.MOULD_TOOLING_MANAGER;
  }
  if (
    designation === Designation.THERMAL_QUALITY_INCHARGE ||
    (designation as unknown as string) === Role.THERMAL_QUALITY_INCHARGE
  ) {
    return Role.THERMAL_QUALITY_INCHARGE;
  }
  if (
    designation === Designation.CULLET_RECOVERY_MANAGER ||
    (designation as unknown as string) === Role.CULLET_RECOVERY_MANAGER
  ) {
    return Role.CULLET_RECOVERY_MANAGER;
  }

  // Chemical Specialized Roles
  if (
    designation === Designation.RD_FORMULA_CHEMIST_MANAGER ||
    (designation as unknown as string) === Role.RD_FORMULA_CHEMIST_MANAGER
  ) {
    return Role.RD_FORMULA_CHEMIST_MANAGER;
  }
  if (
    designation === Designation.EHS_HAZMAT_MANAGER ||
    (designation as unknown as string) === Role.EHS_HAZMAT_MANAGER
  ) {
    return Role.EHS_HAZMAT_MANAGER;
  }
  if (
    designation === Designation.QA_ANALYTICAL_LAB_MANAGER ||
    (designation as unknown as string) === Role.QA_ANALYTICAL_LAB_MANAGER
  ) {
    return Role.QA_ANALYTICAL_LAB_MANAGER;
  }
  if (
    designation === Designation.REACTOR_BATCH_PRODUCTION_MANAGER ||
    (designation as unknown as string) === Role.REACTOR_BATCH_PRODUCTION_MANAGER
  ) {
    return Role.REACTOR_BATCH_PRODUCTION_MANAGER;
  }
  if (
    designation === Designation.HAZARDOUS_LOGISTICS_MANAGER ||
    (designation as unknown as string) === Role.HAZARDOUS_LOGISTICS_MANAGER
  ) {
    return Role.HAZARDOUS_LOGISTICS_MANAGER;
  }

  // Paint Specialized Roles
  if (
    designation === Designation.COLOR_LAB_SHADE_MANAGER ||
    (designation as unknown as string) === Role.COLOR_LAB_SHADE_MANAGER
  ) {
    return Role.COLOR_LAB_SHADE_MANAGER;
  }
  if (
    designation === Designation.PIGMENT_RESIN_DISPERSION_MANAGER ||
    (designation as unknown as string) === Role.PIGMENT_RESIN_DISPERSION_MANAGER
  ) {
    return Role.PIGMENT_RESIN_DISPERSION_MANAGER;
  }
  if (
    designation === Designation.QUALITY_RHEOLOGY_MANAGER ||
    (designation as unknown as string) === Role.QUALITY_RHEOLOGY_MANAGER
  ) {
    return Role.QUALITY_RHEOLOGY_MANAGER;
  }
  if (
    designation === Designation.BASE_STOCK_TINTING_MANAGER ||
    (designation as unknown as string) === Role.BASE_STOCK_TINTING_MANAGER
  ) {
    return Role.BASE_STOCK_TINTING_MANAGER;
  }
  if (
    designation === Designation.FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER ||
    (designation as unknown as string) === Role.FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER
  ) {
    return Role.FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER;
  }

  if (department === Department.EXECUTIVE) {
    if (
      designation === Designation.CEO ||
      designation === Designation.MD ||
      designation === Designation.OWNER
    ) {
      return designation as unknown as Role;
    }
    throw new Error('Executive department only permits CEO, MD, or OWNER designations.');
  }

  const resolvedKey = `${department}_${designation}`;
  if (resolvedKey in Role) {
    return Role[resolvedKey as keyof typeof Role];
  }

  if ((designation as string) in Role) {
    return Role[designation as keyof typeof Role];
  }

  throw new Error(`Invalid role combination: Department ${department}, Designation ${designation}`);
}
