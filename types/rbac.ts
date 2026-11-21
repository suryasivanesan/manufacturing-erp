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
  | 'SUPER_ADMIN'
  | 'CEO'
  | 'MD'
  | 'OWNER'
  | 'EXECUTIVE'
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
  | 'FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER'
  // Process & Chemical Industries / Rubber & Tyre
  | 'RUBBER_COMPOUNDING_MANAGER'
  | 'EXTRUSION_CALENDERING_MANAGER'
  | 'TYRE_BUILDING_MANAGER'
  | 'CURING_VULCANIZATION_MANAGER'
  | 'TYRE_TESTING_UNIFORMITY_MANAGER'
  // Chemical Industries / Pipes
  | 'EXTRUSION_LINE_OPERATIONS_MANAGER'
  | 'WALL_THICKNESS_QUALITY_INCHARGE'
  | 'HYDROSTATIC_BURST_TESTING_MANAGER'
  | 'SOCKETING_BELLING_JOINTING_MANAGER'
  | 'PVC_DRY_BLEND_REGRIND_MANAGER'
  // Engineering, Machinery and Electronics / Automobiles
  | 'JIT_JIS_SUPPLY_CHAIN_MANAGER'
  | 'PRESS_SHOP_BIW_MANAGER'
  | 'VEHICLE_ASSEMBLY_MANAGER'
  | 'PAINT_SHOP_ANTI_CORROSION_MANAGER'
  | 'EOL_TESTING_VIN_MANAGER'
  // Engineering, Machinery and Electronics / Electronical
  | 'SMT_PCB_ASSEMBLY_MANAGER'
  | 'ELECTRICAL_TESTING_CALIBRATION_MANAGER'
  | 'FIRMWARE_FLASHING_MANAGER'
  | 'COMPONENT_OBSOLESCENCE_EBOM_MANAGER'
  | 'ESD_CLEANROOM_COMPLIANCE_MANAGER'
  // Engineering, Machinery and Electronics / Electric Equipment
  | 'WINDING_COIL_FABRICATION_MANAGER'
  | 'CORE_ASSEMBLY_LAMINATION_MANAGER'
  | 'VPI_INSULATION_MANAGER'
  | 'HV_ROUTINE_TESTING_MANAGER'
  | 'BUSBAR_FABRICATION_ENCLOSURE_MANAGER'
  // Engineering, Machinery and Electronics / Cable Wire
  | 'WIRE_DRAWING_ANNEALING_MANAGER'
  | 'BUNCHING_STRANDING_MANAGER'
  | 'INSULATION_SHEATHING_MANAGER'
  | 'ARMOURING_BEDDING_MANAGER'
  | 'HV_SPARK_TESTING_QA_MANAGER'
  // Consumer Goods / Textiles
  | 'SPINNING_YARN_MANAGER'
  | 'WEAVING_KNITTING_MANAGER'
  | 'DYEING_PROCESS_MANAGER'
  | 'GARMENTING_FINISHING_MANAGER'
  | 'FABRIC_QUALITY_INSPECTION_MANAGER'
  // Consumer Goods / Jewellery
  | 'BULLION_VAULT_SECURITY_MANAGER'
  | 'CAD_CAM_PROTOTYPING_MANAGER'
  | 'CASTING_MELTING_MANAGER'
  | 'GOLDSMITH_KARIGAR_MANAGER'
  | 'GEMSTONE_HALLMARKING_QC_MANAGER'
  // Consumer Goods / Leather
  | 'HIDE_WETBLUE_MANAGER'
  | 'RETANNING_DYEING_CRUST_MANAGER'
  | 'SPLITTING_SHAVING_CALIBRATION_MANAGER'
  | 'FINISHING_BUFFING_EMBOSSING_MANAGER'
  | 'LEATHER_QC_AREA_MEASUREMENT_MANAGER'
  // Consumer Goods / Furniture
  | 'TIMBER_SEASONING_KILN_MANAGER'
  | 'DIMENSION_MILL_CNC_MANAGER'
  | 'UPHOLSTERY_FOAM_CUTTING_MANAGER'
  | 'SANDING_FINISHING_POLISHING_MANAGER'
  | 'KD_PACKAGING_HARDWARE_KITTING_MANAGER'
  // Food Manufacturing / Dairy Products
  | 'MILK_COLLECTION_RECEPTION_MANAGER'
  | 'PASTEURIZATION_PROCESSING_MANAGER'
  | 'FERMENTATION_CULTURE_MANAGER'
  | 'QA_MBRT_ANTIBIOTIC_INCHARGE'
  | 'COLD_CHAIN_EXPIRY_MANAGER';

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
  SUPER_ADMIN: 'Super Administrator',
  CEO: 'CEO',
  MD: 'Managing Director (MD)',
  OWNER: 'Owner',
  EXECUTIVE: 'Executive Leadership',
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
  // Process & Chemical Industries / Rubber & Tyre
  RUBBER_COMPOUNDING_MANAGER: 'Rubber Compounding Manager',
  EXTRUSION_CALENDERING_MANAGER: 'Extrusion & Calendering Manager',
  TYRE_BUILDING_MANAGER: 'Tyre Building Manager',
  CURING_VULCANIZATION_MANAGER: 'Curing & Vulcanization Manager',
  TYRE_TESTING_UNIFORMITY_MANAGER: 'Tyre Testing & Uniformity Manager',
  // Chemical Industries / Pipes
  EXTRUSION_LINE_OPERATIONS_MANAGER: 'Extrusion Line Operations Manager',
  WALL_THICKNESS_QUALITY_INCHARGE: 'Wall Thickness & Quality In-Charge',
  HYDROSTATIC_BURST_TESTING_MANAGER: 'Hydrostatic & Burst Testing Manager',
  SOCKETING_BELLING_JOINTING_MANAGER: 'Socketing, Belling & Jointing Manager',
  PVC_DRY_BLEND_REGRIND_MANAGER: 'PVC Dry Blend & Regrind Manager',
  // Engineering, Machinery and Electronics / Automobiles
  JIT_JIS_SUPPLY_CHAIN_MANAGER: 'JIT / JIS Supply Chain Manager',
  PRESS_SHOP_BIW_MANAGER: 'Press Shop & BIW Manager',
  VEHICLE_ASSEMBLY_MANAGER: 'Vehicle Assembly (TCF) Manager',
  PAINT_SHOP_ANTI_CORROSION_MANAGER: 'Paint Shop & Anti-Corrosion Manager',
  EOL_TESTING_VIN_MANAGER: 'EOL Testing & VIN Manager',
  // Engineering, Machinery and Electronics / Electronical
  SMT_PCB_ASSEMBLY_MANAGER: 'SMT & PCB Assembly Manager',
  ELECTRICAL_TESTING_CALIBRATION_MANAGER: 'Electrical Testing & Calibration Manager',
  FIRMWARE_FLASHING_MANAGER: 'Firmware Flashing Manager',
  COMPONENT_OBSOLESCENCE_EBOM_MANAGER: 'Component Obsolescence & EBOM Manager',
  ESD_CLEANROOM_COMPLIANCE_MANAGER: 'ESD & Cleanroom Compliance Manager',
  // Engineering, Machinery and Electronics / Electric Equipment
  WINDING_COIL_FABRICATION_MANAGER: 'Winding & Coil Fabrication Manager',
  CORE_ASSEMBLY_LAMINATION_MANAGER: 'Core Assembly & Lamination Manager',
  VPI_INSULATION_MANAGER: 'VPI & Insulation Process Manager',
  HV_ROUTINE_TESTING_MANAGER: 'HV Routine Testing & Certification Manager',
  BUSBAR_FABRICATION_ENCLOSURE_MANAGER: 'Busbar Fabrication & Enclosure Manager',
  // Engineering, Machinery and Electronics / Cable Wire
  WIRE_DRAWING_ANNEALING_MANAGER: 'Wire Drawing & Annealing Manager',
  BUNCHING_STRANDING_MANAGER: 'Bunching & Stranding Manager',
  INSULATION_SHEATHING_MANAGER: 'Insulation & Sheathing Manager',
  ARMOURING_BEDDING_MANAGER: 'Armouring & Bedding Manager',
  HV_SPARK_TESTING_QA_MANAGER: 'HV Spark Testing & QA Manager',
  // Consumer Goods / Textiles
  SPINNING_YARN_MANAGER: 'Spinning & Yarn Production Manager',
  WEAVING_KNITTING_MANAGER: 'Weaving & Knitting Operations Manager',
  DYEING_PROCESS_MANAGER: 'Dyeing & Wet Processing Manager',
  GARMENTING_FINISHING_MANAGER: 'Garmenting & Finishing Manager',
  FABRIC_QUALITY_INSPECTION_MANAGER: 'Fabric Quality & QA Manager',
  // Consumer Goods / Jewellery
  BULLION_VAULT_SECURITY_MANAGER: 'Bullion Vault & Security Manager',
  CAD_CAM_PROTOTYPING_MANAGER: 'CAD/CAM & Prototyping Manager',
  CASTING_MELTING_MANAGER: 'Casting & Melting Operations Manager',
  GOLDSMITH_KARIGAR_MANAGER: 'Goldsmith & Karigar Job-Work Manager',
  GEMSTONE_HALLMARKING_QC_MANAGER: 'Gemstone & Hallmarking QC Manager',
  // Consumer Goods / Leather
  HIDE_WETBLUE_MANAGER: 'Raw Hide & Wet-Blue Operations Manager',
  RETANNING_DYEING_CRUST_MANAGER: 'Retanning, Dyeing & Crust Manager',
  SPLITTING_SHAVING_CALIBRATION_MANAGER: 'Splitting, Shaving & Calibration Manager',
  FINISHING_BUFFING_EMBOSSING_MANAGER: 'Finishing, Buffing & Embossing Manager',
  LEATHER_QC_AREA_MEASUREMENT_MANAGER: 'Leather QC & Area Measurement Manager',
  // Consumer Goods / Furniture
  TIMBER_SEASONING_KILN_MANAGER: 'Timber Seasoning & Kiln Manager',
  DIMENSION_MILL_CNC_MANAGER: 'Dimension Mill & CNC Operations Manager',
  UPHOLSTERY_FOAM_CUTTING_MANAGER: 'Upholstery & Foam Cutting Manager',
  SANDING_FINISHING_POLISHING_MANAGER: 'Sanding, Finishing & Polishing Manager',
  KD_PACKAGING_HARDWARE_KITTING_MANAGER: 'KD Packaging & Hardware Kitting Manager',
  // Food Manufacturing / Dairy Products
  MILK_COLLECTION_RECEPTION_MANAGER: 'Milk Collection & Reception Manager',
  PASTEURIZATION_PROCESSING_MANAGER: 'Pasteurization & Processing Manager',
  FERMENTATION_CULTURE_MANAGER: 'Fermentation & Culture Operations Manager',
  QA_MBRT_ANTIBIOTIC_INCHARGE: 'Dairy QA & MBRT/Antibiotic In-Charge',
  COLD_CHAIN_EXPIRY_MANAGER: 'Cold-Chain & Expiry FEFO Manager',
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

export const RUBBER_SPECIALIZED_ROLES: SpecializedRole[] = [
  {
    role: 'RUBBER_COMPOUNDING_MANAGER',
    designationKey: 'RUBBER_COMPOUNDING_MANAGER',
    title: 'Rubber Compounding Manager',
    subCategory: 'Rubber & Tyre',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Compounding & Mooney Viscosity',
    functions: [
      'Multi-stage compounding recipe management (Masterbatch, Remix, Final Mix)',
      'Mooney viscosity tracking (ML 1+4 @ 100°C) & cure rheometer rheology curves',
      'Carbon black dispersion parameter logs (ASTM D7723 / Phillips rating ≥ 95%)',
      'Batch-wise raw material ingredient traceability (Natural Rubber, Synthetic Polymers, Carbon Black, Curatives)',
    ],
    description:
      'Governs Banbury internal mixing lines, validates Mooney viscosity parameters, logs carbon black dispersion scores, and maintains complete ingredient traceability.',
    badgeStyle: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  {
    role: 'EXTRUSION_CALENDERING_MANAGER',
    designationKey: 'EXTRUSION_CALENDERING_MANAGER',
    title: 'Extrusion & Calendering Manager',
    subCategory: 'Rubber & Tyre',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Extrusion & Calendering',
    functions: [
      'Extrusion die profile & multi-zone barrel temperature monitoring',
      'Steel cord & fabric tension tracking (kN) with laser gauge thickness verification (mm)',
      'Roll stock inventory management, roll weight tracking & shelf-life cooling control',
      'Continuous line speed (mpm) and shrinkage compensation calibration',
    ],
    description:
      'Controls tread/sidewall extrusion lines and 4-roll calender trains, monitors steel cord tension, laser thickness gauges, and roll stock storage.',
    badgeStyle: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30',
  },
  {
    role: 'TYRE_BUILDING_MANAGER',
    designationKey: 'TYRE_BUILDING_MANAGER',
    title: 'Tyre Building Manager',
    subCategory: 'Rubber & Tyre',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Green Tyre Building & WIP',
    functions: [
      'Green tire assembly sequence tracking across carcass, belt package, and tread application',
      'Component bill of materials (BOM) management and automated component lot linkage',
      'Green tire work-in-progress (WIP) stock monitoring and dimensional concentricity checks',
      'Building machine recipe synchronization and barcode serialization',
    ],
    description:
      'Supervises unistage and two-stage tyre building machines, enforces component BOM recipes, tracks sub-assembly lots, and monitors green tyre WIP inventory.',
    badgeStyle: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  },
  {
    role: 'CURING_VULCANIZATION_MANAGER',
    designationKey: 'CURING_VULCANIZATION_MANAGER',
    title: 'Curing & Vulcanization Manager',
    subCategory: 'Rubber & Tyre',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Curing Press & Bladder Life',
    functions: [
      'Press temperature & pressure PLC log monitoring (Platen temperature, steam dome pressure, internal bladder pressure)',
      'SKU-wise curing time cycle tracking (Seconds) and thermal heat dose calculation',
      'Curing bladder lifecycle management with automated shot counts and failure warnings',
      'Mould segment cleaning intervals and venting pin maintenance schedules',
    ],
    description:
      'Directs curing presses, regulates platen temperatures and bladder pressure curves, tracks curing time cycles, and manages bladder lifecycle replacement thresholds.',
    badgeStyle: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30',
  },
  {
    role: 'TYRE_TESTING_UNIFORMITY_MANAGER',
    designationKey: 'TYRE_TESTING_UNIFORMITY_MANAGER',
    title: 'Tyre Testing & Uniformity Manager',
    subCategory: 'Rubber & Tyre',
    associatedDepartment: 'QUALITY',
    shortBadge: 'Tyre Uniformity & DOT Code',
    functions: [
      'Dynamic balancing and uniformity test data recording (Radial/Lateral Runout, RFV, LFV, Conicity)',
      'Unique serial number and DOT code assignment for lifetime product traceability',
      'Tyre grading classification (Prime Grade, B-Grade, Scrap)',
      'Strict unapproved dispatch blocking and automated electronic quality clearance',
    ],
    description:
      'Oversees high-speed dynamic balancing and tyre uniformity machines (TUM), assigns statutory DOT codes, grades tyres into Prime/B-Grade/Scrap, and authorizes warehouse dispatch.',
    badgeStyle: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
  },
];

export const PIPES_SPECIALIZED_ROLES: SpecializedRole[] = [
  {
    role: 'EXTRUSION_LINE_OPERATIONS_MANAGER',
    designationKey: 'EXTRUSION_LINE_OPERATIONS_MANAGER',
    title: 'Extrusion Line Operations Manager',
    subCategory: 'Pipes',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Pipe Extrusion & Line Output',
    functions: [
      'Barrel multi-zone temperature monitoring (Zone 1-4, Die head)',
      'Screw RPM & caterpillar haul-off speed synchronization',
      'Per-shift line output tracking (Kg and Meters) & scrap reduction',
      'Machinery run-hour telemetry, melt pressure & vacuum calibration logs',
    ],
    description:
      'Directs continuous plastic pipe extrusion lines, regulates barrel temperature profiles, synchronizes screw RPM with haul-off speeds, and tracks shift production output.',
    badgeStyle: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
  },
  {
    role: 'WALL_THICKNESS_QUALITY_INCHARGE',
    designationKey: 'WALL_THICKNESS_QUALITY_INCHARGE',
    title: 'Wall Thickness & Quality In-Charge',
    subCategory: 'Pipes',
    associatedDepartment: 'QUALITY',
    shortBadge: 'Ultrasonic QC & Batch Lock',
    functions: [
      'Ultrasonic 360° sensor wall thickness data recording (Min, Max, Eccentricity %)',
      'Outer diameter, length tolerance and ovality inspection',
      'Strict non-standard pipe lot blocking gate preventing sub-spec pipes from packaging',
      'In-line scanning calibration and dimensional conformance certification',
    ],
    description:
      'Supervises ultrasonic wall thickness monitoring sensors, checks pipe ovality and eccentricity, and strictly blocks non-conforming pipe batches from proceeding to packaging.',
    badgeStyle: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  {
    role: 'HYDROSTATIC_BURST_TESTING_MANAGER',
    designationKey: 'HYDROSTATIC_BURST_TESTING_MANAGER',
    title: 'Hydrostatic & Burst Testing Manager',
    subCategory: 'Pipes',
    associatedDepartment: 'QUALITY',
    shortBadge: 'Hydrostatic Burst & MTC',
    functions: [
      'Burst pressure & short/long-term hydrostatic pressure test logging',
      'Water bath temperature control (20°C and 80°C endurance testing)',
      'Destructive test log management, hoop stress calculation & failure mode analysis',
      'Pressure rating compliance certificate issuance (PN6, PN10, PN16, SDR compliance)',
    ],
    description:
      'Directs hydrostatic burst and long-term endurance test stations, records hoop stress resistance, issues pressure compliance certificates, and documents failure modes.',
    badgeStyle: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  },
  {
    role: 'SOCKETING_BELLING_JOINTING_MANAGER',
    designationKey: 'SOCKETING_BELLING_JOINTING_MANAGER',
    title: 'Socketing, Belling & Jointing Manager',
    subCategory: 'Pipes',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Belling Cycle & Seal Rings',
    functions: [
      'Belling & socketing machine heating/forming/cooling cycle tracking',
      'Rubber sealing ring inventory management (EPDM, SBR, NBR lip seals)',
      'Socket inner diameter, depth and seal ring groove retention verification',
      'Thermal re-heat defect monitoring and socket trim optimization',
    ],
    description:
      'Manages automated pipe belling and socket forming machines, controls heating/cooling cycle times, validates elastomeric ring groove dimensions, and manages rubber seal stock.',
    badgeStyle: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
  },
  {
    role: 'PVC_DRY_BLEND_REGRIND_MANAGER',
    designationKey: 'PVC_DRY_BLEND_REGRIND_MANAGER',
    title: 'PVC Dry Blend & Regrind Manager',
    subCategory: 'Pipes',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Dry Blend & Regrind %',
    functions: [
      'Dry blend weighing recipe formulation (PVC resin, One-pack stabilizers, CaCO3, Impact modifiers)',
      'Stabilizer and additive dosing ratio tracking with temperature rise verification',
      'Production BOM virgin-to-regrind blending percentage regulation',
      'Automated safety interlock blocking batches exceeding max permitted regrind ceiling (25%)',
    ],
    description:
      'Oversees high-speed and cooler dry blend mixing, manages chemical stabilizer recipes, and strictly enforces BOM virgin-to-regrind blend ratios to guarantee pipe tensile strength.',
    badgeStyle: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
  },
];

export const AUTOMOBILE_SPECIALIZED_ROLES: SpecializedRole[] = [
  {
    role: 'JIT_JIS_SUPPLY_CHAIN_MANAGER',
    designationKey: 'JIT_JIS_SUPPLY_CHAIN_MANAGER',
    title: 'JIT / JIS Supply Chain Manager',
    subCategory: 'Automobiles',
    associatedDepartment: 'INVENTORY',
    shortBadge: 'Electronic Kanban & JIS',
    functions: [
      'Electronic Kanban signal management & line-side buffer stock replenishment',
      'Direct-to-line vendor delivery schedule coordination & dock appointment handling',
      'Just-in-Sequence (JIS) delivery sequence accuracy tracking for cockpit & chassis parts',
      'Vehicle build order pull-signal trigger handling synchronized with conveyer cycle',
    ],
    description:
      'Coordinates Just-in-Time and Just-in-Sequence replenishment signals, monitors supplier direct-to-line delivery punctuality, and handles vehicle build order pull triggers.',
    badgeStyle: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
  },
  {
    role: 'PRESS_SHOP_BIW_MANAGER',
    designationKey: 'PRESS_SHOP_BIW_MANAGER',
    title: 'Press Shop & BIW Manager',
    subCategory: 'Automobiles',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Press Stamping & BIW Weld',
    functions: [
      'Stamping die changeover monitoring & SMED duration optimization',
      'Press stroke count tracking and cumulative die lifecycle management',
      'Sheet metal coil/blank inventory management (DP600, CR4, aluminum alloys)',
      'Weld quality inspection log recording (spot weld ultrasonic test, destructive tear-down, surface dent checks)',
    ],
    description:
      'Oversees tandem stamping lines and Body-in-White (BIW) robotic welding cells, tracks die stroke counts, ensures blank sheet traceability, and audits weld spot integrity.',
    badgeStyle: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  {
    role: 'VEHICLE_ASSEMBLY_MANAGER',
    designationKey: 'VEHICLE_ASSEMBLY_MANAGER',
    title: 'Vehicle Assembly (TCF) Manager',
    subCategory: 'Automobiles',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'TCF Assembly & Takt Time',
    functions: [
      'Work-in-progress (WIP) tracking across assembly stations (Trim, Chassis, Final - TCF lines)',
      'Station-wise cycle time and takt time variance management (72-second line takt target)',
      'Sub-assembly sequencing (engine, transmission, high-voltage battery pack, front/rear axles)',
      'Daily shift vehicle output target monitoring and line bottleneck resolution',
    ],
    description:
      'Directs the vehicle Trim, Chassis, and Final (TCF) assembly line, synchronizes powertrain and chassis marriage, tracks takt time adherence, and balances assembly station cycle times.',
    badgeStyle: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  },
  {
    role: 'PAINT_SHOP_ANTI_CORROSION_MANAGER',
    designationKey: 'PAINT_SHOP_ANTI_CORROSION_MANAGER',
    title: 'Paint Shop & Anti-Corrosion Manager',
    subCategory: 'Automobiles',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'ED Bath & Anti-Corrosion',
    functions: [
      'Electrodeposition (ED / CED) dip-tank chemical concentration monitoring (solids %, pH, conductivity, bath voltage)',
      'Automated paint booth temperature (°C) and relative humidity (%) regulation',
      'Color-change sequencing management and paint purge solvent waste reduction',
      'Oven curing zone temperature telemetry logging and anti-corrosion warranty certification',
    ],
    description:
      'Supervises cathodic electrodeposition dip tanks, primer, basecoat and clearcoat robotic booths, logs bake oven temperature curves, and certifies anti-corrosion film specs.',
    badgeStyle: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
  },
  {
    role: 'EOL_TESTING_VIN_MANAGER',
    designationKey: 'EOL_TESTING_VIN_MANAGER',
    title: 'EOL Testing & VIN Manager',
    subCategory: 'Automobiles',
    associatedDepartment: 'QUALITY',
    shortBadge: 'EOL Dynamic Test & VIN Gate Pass',
    functions: [
      'End-of-Line (EOL) dynamic test data recording (wheel alignment, dyno roll speed, brake deceleration, ADAS sensor calibration, monsoon water shower)',
      'Unique 17-character VIN (Vehicle Identification Number) assignment and ECU firmware flashing validation',
      'Critical component serial tracking (engine/motor, traction battery, gearbox, axles) for statutory traceability',
      'Electronic Gate-Pass clearance issuance for finished vehicle rollout to transit yards',
    ],
    description:
      'Governs end-of-line vehicle quality sign-off, assigns tamper-proof 17-character VINs, validates statutory serial component traceability, and authorizes vehicle Gate Passes.',
    badgeStyle: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
  },
];

export const ELECTRONICAL_SPECIALIZED_ROLES: SpecializedRole[] = [
  {
    role: 'SMT_PCB_ASSEMBLY_MANAGER',
    designationKey: 'SMT_PCB_ASSEMBLY_MANAGER',
    title: 'SMT & PCB Assembly Manager',
    subCategory: 'Electronical',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'SMT Feeder & Reflow Oven',
    functions: [
      'SMT feeder placement list management & feeder slot verification',
      'Component reel lot number tracking & barcode traceability',
      'Reflow oven multi-zone temperature profile log monitoring (°C)',
      'Daily PCB production output control & pick-and-place yield tracking',
    ],
    description:
      'Governs high-speed SMT pick-and-place lines, monitors feeder setup sheets, verifies component reels, tracks reflow solder profiles, and directs daily PCB assembly throughput.',
    badgeStyle: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
  },
  {
    role: 'ELECTRICAL_TESTING_CALIBRATION_MANAGER',
    designationKey: 'ELECTRICAL_TESTING_CALIBRATION_MANAGER',
    title: 'Electrical Testing & Calibration Manager',
    subCategory: 'Electronical',
    associatedDepartment: 'QUALITY',
    shortBadge: 'ICT/FCT & Calibration Lock',
    functions: [
      'Automated test rig result recording (in-circuit test ICT & functional test FCT)',
      'Uncalibrated test instrument blocking & statutory calibration expiry locks',
      'Pass/fail defect log management & component failure root-cause logging',
      'Electronic test clearance certificate issuance & batch dispatch clearance',
    ],
    description:
      'Supervises ICT/FCT automated test rigs, prevents usage of out-of-calibration equipment, verifies RF/signal parameters, and issues electronic compliance certificates.',
    badgeStyle: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
  },
  {
    role: 'FIRMWARE_FLASHING_MANAGER',
    designationKey: 'FIRMWARE_FLASHING_MANAGER',
    title: 'Firmware Flashing Manager',
    subCategory: 'Electronical',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Firmware & Device Serial',
    functions: [
      'Firmware version master data management & secure binary checksum hashing',
      'Programming station API integration with ERP manufacturing work orders',
      'Strict 1-to-1 device serial number to flashed firmware version mapping',
      'Secure boot key provisioning & flashed firmware integrity verification',
    ],
    description:
      'Manages embedded software binary releases, integrates gang-programmer stations with ERP orders, and secures 1-to-1 device serialization.',
    badgeStyle: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  },
  {
    role: 'COMPONENT_OBSOLESCENCE_EBOM_MANAGER',
    designationKey: 'COMPONENT_OBSOLESCENCE_EBOM_MANAGER',
    title: 'Component Obsolescence & EBOM Manager',
    subCategory: 'Electronical',
    associatedDepartment: 'INVENTORY',
    shortBadge: 'EBOM & Silicon Lifecycle',
    functions: [
      'Electronic component lifecycle status monitoring (Active, NRND, EOL, Obsolete)',
      'Substitute component master list updates & pin-to-pin alternative approvals',
      'Engineering Change Orders (ECO) handling & EBOM version revisions',
      'Vendor component lead time management & semiconductor shortage forecasting',
    ],
    description:
      'Monitors silicon lifecycle stages, maintains approved manufacturer lists (AML), administers ECO changes on EBOMs, and mitigates component shortages.',
    badgeStyle: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  {
    role: 'ESD_CLEANROOM_COMPLIANCE_MANAGER',
    designationKey: 'ESD_CLEANROOM_COMPLIANCE_MANAGER',
    title: 'ESD & Cleanroom Compliance Manager',
    subCategory: 'Electronical',
    associatedDepartment: 'SECURITY',
    shortBadge: 'ESD ANSI/S20.20 & Cleanroom',
    functions: [
      'Daily ESD workstation compliance audit logging (wrist straps, continuous monitors)',
      'Grounding resistance test result tracking (ANSI/ESD S20.20 thresholds)',
      'Cleanroom environment sensor log monitoring (ISO 14644 particles, temp, humidity)',
      'ESD-safe packaging material inventory oversight & shielding bag integrity',
    ],
    description:
      'Enforces electrostatic discharge (ESD) standards across assembly bays, verifies cleanroom air classification, and certifies anti-static packaging.',
    badgeStyle: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
  },
];

export const ELECTRIC_EQUIPMENT_SPECIALIZED_ROLES: SpecializedRole[] = [
  {
    role: 'WINDING_COIL_FABRICATION_MANAGER',
    designationKey: 'WINDING_COIL_FABRICATION_MANAGER',
    title: 'Winding & Coil Fabrication Manager',
    subCategory: 'Electric Equipment',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Coil Winding & Surge Test',
    functions: [
      'Coil winding BOM management (HV & LV coil design specifications)',
      'Conductor weight consumption tracking (copper/aluminum magnet wire & rectangular strips)',
      'Winding machine counter log monitoring & turns ratio verification',
      'Inter-turn insulation test data recording & high-frequency surge comparison testing',
    ],
    description:
      'Directs coil winding bays for transformers and motors, monitors CNC turns counters, tracks copper/aluminum conductor weights, and verifies inter-turn surge insulation integrity.',
    badgeStyle: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
  },
  {
    role: 'CORE_ASSEMBLY_LAMINATION_MANAGER',
    designationKey: 'CORE_ASSEMBLY_LAMINATION_MANAGER',
    title: 'Core Assembly & Lamination Manager',
    subCategory: 'Electric Equipment',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'CRGO Core Stacking & Loss',
    functions: [
      'CRGO electrical sheet inventory & slitting dimension precision tracking',
      'Core stacking schedule management & multi-step mitered lap joint assembly',
      'Core assembly weight & tie-rod clamping torque recording (Nm)',
      'No-load loss test metric logging & core excitation watt/kg verification',
    ],
    description:
      'Supervises cold-rolled grain-oriented (CRGO) steel slitting, mitered core stacking patterns, clamping torque verification, and magnetic no-load core loss metrics.',
    badgeStyle: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
  },
  {
    role: 'VPI_INSULATION_MANAGER',
    designationKey: 'VPI_INSULATION_MANAGER',
    title: 'VPI & Insulation Process Manager',
    subCategory: 'Electric Equipment',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'VPI Autoclave & Resin Cure',
    functions: [
      'Vacuum Pressure Impregnation (VPI) oven temperature profile & vacuum pressure log monitoring',
      'Resin/varnish bath specific gravity tracking, viscosity checks & solids percentage tests',
      'Drying & polymerization cycle time management per transformer/stator insulation class',
      'Cured winding insulation resistance testing (GigaOhms) & moisture elimination verification',
    ],
    description:
      'Controls autoclave vacuum pressure impregnation chambers, tracks epoxy resin bath specific gravity, regulates curing oven heat curves, and validates insulation resistance.',
    badgeStyle: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  },
  {
    role: 'HV_ROUTINE_TESTING_MANAGER',
    designationKey: 'HV_ROUTINE_TESTING_MANAGER',
    title: 'HV Routine Testing & Certification Manager',
    subCategory: 'Electric Equipment',
    associatedDepartment: 'QUALITY',
    shortBadge: 'HV Routine Test & NABL Cert',
    functions: [
      'Automated high-voltage test rig data recording (power frequency withstand, induced overvoltage)',
      'Testing instrument NABL calibration status verification & statutory expiry lockouts',
      'Uncertified unit blocking from dispatch (interlocked quality gate lockout)',
      'Test & Calibration Certificate auto-generation with partial discharge (pC) metrics',
    ],
    description:
      'Administers high-voltage routine test bays, enforces statutory test instrument calibration locks, strictly blocks non-compliant equipment from dispatch, and issues certified Test Reports.',
    badgeStyle: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  {
    role: 'BUSBAR_FABRICATION_ENCLOSURE_MANAGER',
    designationKey: 'BUSBAR_FABRICATION_ENCLOSURE_MANAGER',
    title: 'Busbar Fabrication & Enclosure Manager',
    subCategory: 'Electric Equipment',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Busbar Bending & Clearances',
    functions: [
      'Busbar cut length, punching & CNC bending angle specification tracking',
      'Powder coating inventory management (epoxy-polyester hybrid powder & DFT microns check)',
      'Modular enclosure sub-assembly routing oversight (switchgear cubicles & transformer tanks)',
      'Electrical phase clearance & surface creepage distance verification per IEC standards',
    ],
    description:
      'Oversees busbar bending, modular enclosure fabrication, powder coating dry film thickness (DFT), and verifies statutory phase-to-phase and phase-to-earth electrical clearances.',
    badgeStyle: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
  },
];

export const CABLE_WIRE_SPECIALIZED_ROLES: SpecializedRole[] = [
  {
    role: 'WIRE_DRAWING_ANNEALING_MANAGER',
    designationKey: 'WIRE_DRAWING_ANNEALING_MANAGER',
    title: 'Wire Drawing & Annealing Manager',
    subCategory: 'Cable Wire',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Drawing Dies & Annealing',
    functions: [
      'Wire elongation ratio tracking',
      'Drawing die inventory & wear monitoring',
      'Weight reduction yield recording',
      'Continuous annealing temperature profile logging',
    ],
    description:
      'Governs rod breakdown and multi-wire drawing lines, monitors PCD drawing die wear, tracks wire elongation percentages, records weight reduction yields, and logs continuous annealing temperatures.',
    badgeStyle: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  {
    role: 'BUNCHING_STRANDING_MANAGER',
    designationKey: 'BUNCHING_STRANDING_MANAGER',
    title: 'Bunching & Stranding Manager',
    subCategory: 'Cable Wire',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Bunching & Lay Pitch',
    functions: [
      'Conductor strand combination management',
      'Machine RPM and lay-length parameter tracking',
      'Bobbin/spool allocation scheduling',
      'Copper/aluminium scrap loss monitoring',
    ],
    description:
      'Directs double-twist bunchers and rigid stranders, coordinates strand combinations (7/19/37/61 wire cores), regulates machine RPM and lay pitch ratios, schedules pay-off bobbins, and monitors conductor scrap losses.',
    badgeStyle: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
  },
  {
    role: 'INSULATION_SHEATHING_MANAGER',
    designationKey: 'INSULATION_SHEATHING_MANAGER',
    title: 'Insulation & Sheathing Manager',
    subCategory: 'Cable Wire',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Extruder Line & OD Laser Gauge',
    functions: [
      'Multi-zone barrel temperature monitoring',
      'Compound consumption tracking - PVC/XLPE pellets',
      'Caterpillar haul-off speed control',
      'Online outer diameter - OD laser gauge oversight',
    ],
    description:
      'Controls high-speed extrusion lines for insulation and outer sheathing, monitors multi-zone heating profiles, tracks PVC/XLPE polymer pellet consumption, synchronizes haul-off caterpillars, and oversees online laser diameter gauges.',
    badgeStyle: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
  },
  {
    role: 'ARMOURING_BEDDING_MANAGER',
    designationKey: 'ARMOURING_BEDDING_MANAGER',
    title: 'Armouring & Bedding Manager',
    subCategory: 'Cable Wire',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Steel Armouring & Pitch Tension',
    functions: [
      'Steel wire/strip reel inventory management',
      'Armouring pitch and tension monitoring',
      'Coverage uniformity inspection',
      'Sub-assembly WIP staging tracking',
    ],
    description:
      'Supervises cage armouring machines, manages round steel wire and galvanized flat strip reel inventories, verifies pitch and pay-off tensions, inspects statutory coverage uniformity (IS 1554 / 7098), and stages sub-assemblies.',
    badgeStyle: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
  },
  {
    role: 'HV_SPARK_TESTING_QA_MANAGER',
    designationKey: 'HV_SPARK_TESTING_QA_MANAGER',
    title: 'HV Spark Testing & QA Manager',
    subCategory: 'Cable Wire',
    associatedDepartment: 'QUALITY',
    shortBadge: 'HV Spark QA & DC Resistance',
    functions: [
      'Spark test fault count recording',
      'Conductor DC resistance value logging',
      'Quality clearance certificate issuance',
      'Meter-marking calibration record management',
    ],
    description:
      'Administers high-voltage spark testing QA gates, records fault puncture counts and meter coordinates, verifies conductor DC electrical resistance (IS 8130), certifies meter-marking encoder calibration, and issues final Quality Clearance Certificates.',
    badgeStyle: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  },
];

export const TEXTILES_SPECIALIZED_ROLES: SpecializedRole[] = [
  {
    role: 'SPINNING_YARN_MANAGER',
    designationKey: 'SPINNING_YARN_MANAGER',
    title: 'Spinning & Yarn Production Manager',
    subCategory: 'Textiles',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Fiber Blend & Spindle RPM',
    functions: [
      'Fiber blending recipe management',
      'Spindle utilization tracking',
      'Yarn count & lea strength test data logging',
      'Raw material waste - comber noil control',
    ],
    description:
      'Oversees blowroom, carding, combing and ring frame spinning units, manages fiber blend ratios, tracks spindle efficiency, tests yarn count (Ne) & CSP lea strength, and minimizes comber noil waste.',
    badgeStyle: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  {
    role: 'WEAVING_KNITTING_MANAGER',
    designationKey: 'WEAVING_KNITTING_MANAGER',
    title: 'Weaving & Knitting Operations Manager',
    subCategory: 'Textiles',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Loom Speed & Greige Rolls',
    functions: [
      'Beam allocation & warp/weft yarn consumption tracking',
      'Loom speed & stop-time/breakage log monitoring',
      'Greige fabric roll inventory management',
      'Reed space & pick density (EPI/PPI) verification',
    ],
    description:
      'Controls air-jet/rapier weaving looms and circular knitting machinery, balances warp/weft yarn consumption, monitors stop-time & breakage causes, and manages greige roll stock.',
    badgeStyle: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
  },
  {
    role: 'DYEING_PROCESS_MANAGER',
    designationKey: 'DYEING_PROCESS_MANAGER',
    title: 'Dyeing & Wet Processing Manager',
    subCategory: 'Textiles',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Dye Recipe & Shade Delta E',
    functions: [
      'Dye recipe formulation management',
      'Chemical/dyestuff inventory tracking',
      'Dyeing machine temperature/pressure profile monitoring',
      'Batch shade approval control',
    ],
    description:
      'Formulates reactive/disperse dye recipes, manages dyestuff auxiliary chemicals, regulates high-temperature jet dyeing cycles, and approves batch shade matching under standard D65 illuminants.',
    badgeStyle: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30',
  },
  {
    role: 'GARMENTING_FINISHING_MANAGER',
    designationKey: 'GARMENTING_FINISHING_MANAGER',
    title: 'Garmenting & Finishing Manager',
    subCategory: 'Textiles',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'CAD Nesting & Sewing WIP',
    functions: [
      'Marker efficiency & fabric nesting management',
      'Line-wise sewing output & WIP tracking',
      'Bundle ticket allocation',
      'Carton packing & barcode labeling oversight',
    ],
    description:
      'Optimizes CAD marker nesting to minimize cutting fabric waste, manages line sewing piece-rate WIP, oversees bundle ticketing, and ensures barcode carton packing compliance for export.',
    badgeStyle: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
  },
  {
    role: 'FABRIC_QUALITY_INSPECTION_MANAGER',
    designationKey: 'FABRIC_QUALITY_INSPECTION_MANAGER',
    title: 'Fabric Quality & QA Manager',
    subCategory: 'Textiles',
    associatedDepartment: 'QUALITY',
    shortBadge: '4-Point System & GSM QA',
    functions: [
      '4-point fabric inspection system defect grading (ASTM D5430)',
      'GSM, tensile tear strength & shrinkage test recording',
      'Color fastness to washing & rub testing verification',
      'Textile quality clearance certificate (CoA) issuance & dispatch gate control',
    ],
    description:
      'Enforces ASTM D5430 4-point inspection standards, validates dimensional shrinkage and GSM specifications, checks wash fastness, and issues official Textile Quality Clearance Certificates.',
    badgeStyle: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
  },
];

export const JEWELLERY_SPECIALIZED_ROLES: SpecializedRole[] = [
  {
    role: 'BULLION_VAULT_SECURITY_MANAGER',
    designationKey: 'BULLION_VAULT_SECURITY_MANAGER',
    title: 'Bullion Vault & Security Manager',
    subCategory: 'Jewellery',
    associatedDepartment: 'SECURITY',
    shortBadge: 'Bullion Vault & Valuation',
    functions: [
      'Secure vault inventory management',
      'Inward/outward bullion weight tracking - grams/milligrams',
      'Daily metal balance reconciliation',
      'Live metal market rate updates for ERP costing',
    ],
    description:
      'Oversees high-security bullion vaults, logs dual-custody access, records inward gold bars/silver granules with milligram precision, reconciles daily balances, and maintains live metal market rates.',
    badgeStyle: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  {
    role: 'CAD_CAM_PROTOTYPING_MANAGER',
    designationKey: 'CAD_CAM_PROTOTYPING_MANAGER',
    title: 'CAD/CAM & Prototyping Manager',
    subCategory: 'Jewellery',
    associatedDepartment: 'PRODUCTION',
    shortBadge: '3D CAD & Resin Wax Print',
    functions: [
      'Digital design library & versioning management',
      '3D printer resin and wax consumption tracking',
      'CAD file allocation to manufacturing orders',
      'Master rubber mold inventory oversight',
    ],
    description:
      'Governs 3D jewelry CAD designs (.3dm/.stl), manages precision SLA/DLP wax & castable resin 3D printing, monitors vulcanized rubber master molds, and links digital designs to production orders.',
    badgeStyle: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
  },
  {
    role: 'CASTING_MELTING_MANAGER',
    designationKey: 'CASTING_MELTING_MANAGER',
    title: 'Casting & Melting Operations Manager',
    subCategory: 'Jewellery',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Induction Cast & Gold Yield',
    functions: [
      'Karatage conversion recipe management - stoichiometry',
      'Melting furnace cycle tracking',
      'Metal input vs output casting weight calculation',
      'Sweepings/scrap dust recovery',
    ],
    description:
      'Controls vacuum pressure induction casting furnaces, formulates 24K to 22K/18K alloy recipes, monitors temperature/pressure curves, calculates casting yields, and audits gold scrap dust recovery.',
    badgeStyle: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30',
  },
  {
    role: 'GOLDSMITH_KARIGAR_MANAGER',
    designationKey: 'GOLDSMITH_KARIGAR_MANAGER',
    title: 'Goldsmith & Karigar Job-Work Manager',
    subCategory: 'Jewellery',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Karigar Challan & Ghath Loss',
    functions: [
      'Raw metal and stone issuance to internal/external karigars',
      'Job work challan tracking',
      'Net wastage - Ghath/Touch loss reconciliation',
      'Artisan wage accounting',
    ],
    description:
      'Issues precious metals and gemstones to karigars via job-work challans, oversees handcrafting (Filigree, Meenakari, Jadau, Setting), monitors permissible vs actual Ghath wastage, and computes artisan piece wages.',
    badgeStyle: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
  },
  {
    role: 'GEMSTONE_HALLMARKING_QC_MANAGER',
    designationKey: 'GEMSTONE_HALLMARKING_QC_MANAGER',
    title: 'Gemstone & Hallmarking QC Manager',
    subCategory: 'Jewellery',
    associatedDepartment: 'QUALITY',
    shortBadge: 'BIS HUID & Diamond CoA',
    functions: [
      'Diamond/gemstone grading certificate recording',
      'BIS hallmark laser engraving log tracking - HUID',
      'Final product weight and purity verification',
      'Certificate of Authenticity - CoA auto-generation',
    ],
    description:
      'Conducts XRF precious metal spectrometer tests, grades 4C diamond specifications with lab certificates (GIA/IGI), tracks 6-digit BIS Hallmark Unique Identifications (HUID), and auto-generates Certificates of Authenticity.',
    badgeStyle: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  },
];

export const LEATHER_SPECIALIZED_ROLES: SpecializedRole[] = [
  {
    role: 'HIDE_WETBLUE_MANAGER',
    designationKey: 'HIDE_WETBLUE_MANAGER',
    title: 'Raw Hide & Wet-Blue Operations Manager',
    subCategory: 'Leather',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Wet-Blue Drum & Tanning Recipe',
    functions: [
      'Raw hide grading by weight and size',
      'Chemical recipe dosing in tanning drums',
      'pH level and drum rotation cycle monitoring',
      'Wet-blue lot inventory logging',
    ],
    description:
      'Oversees beamhouse operations, raw hide grading (Cow, Buffalo, Goat, Sheep), chemical dosing in tanning drums, pickling/chrome basification cycles, shrinkage boil testing, and wet-blue lot inventory.',
    badgeStyle: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  {
    role: 'RETANNING_DYEING_CRUST_MANAGER',
    designationKey: 'RETANNING_DYEING_CRUST_MANAGER',
    title: 'Retanning, Dyeing & Crust Manager',
    subCategory: 'Leather',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Retanning, Dyeing & Temper',
    functions: [
      'Leather dye formulation management',
      'Moisture content and soft/firm temper tracking',
      'Drying chamber temperature monitoring',
      'Crust leather batch classification',
    ],
    description:
      'Governs post-tanning retanning and dyeing drums, manages vegetable syntans and fatliquor dosing for target temper, monitors vacuum/toggle drying tunnels, and grades crust leather batches.',
    badgeStyle: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30',
  },
  {
    role: 'SPLITTING_SHAVING_CALIBRATION_MANAGER',
    designationKey: 'SPLITTING_SHAVING_CALIBRATION_MANAGER',
    title: 'Splitting, Shaving & Calibration Manager',
    subCategory: 'Leather',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Splitting Blade & Thickness Gauge',
    functions: [
      'Splitting and shaving machine blade calibration',
      'Thickness gauge measurement recording across sampling points',
      'Leather shaving waste tracking',
      'Lot segregation by thickness range',
    ],
    description:
      'Controls precision bandknife splitting and shaving machines, calibrates thickness gauge sensors, audits 5-point hide thickness uniformity, tracks shaving waste, and segregates drop splits.',
    badgeStyle: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
  },
  {
    role: 'FINISHING_BUFFING_EMBOSSING_MANAGER',
    designationKey: 'FINISHING_BUFFING_EMBOSSING_MANAGER',
    title: 'Finishing, Buffing & Embossing Manager',
    subCategory: 'Leather',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Spray Booth & Grain Embossing',
    functions: [
      'Finishing chemical formulation management',
      'Spray booth parameter tracking',
      'Plate embossing schedules - Croco, Nappa, Pebble grain patterns',
      'Gloss/luster consistency monitoring',
    ],
    description:
      'Manages automated rotary spray finishing carousels, hydraulic embossing presses with heated plates, buffing lines, surface gloss/adhesion testing, and Veslic rub fastness compliance.',
    badgeStyle: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
  },
  {
    role: 'LEATHER_QC_AREA_MEASUREMENT_MANAGER',
    designationKey: 'LEATHER_QC_AREA_MEASUREMENT_MANAGER',
    title: 'Leather QC & Area Measurement Manager',
    subCategory: 'Leather',
    associatedDepartment: 'QUALITY',
    shortBadge: 'Sq Ft Measurement & Defect QC',
    functions: [
      'Pin-wheel or optical area measurement machine operation',
      'Individual leather hide tagging with exact square footage barcodes',
      'Grain defect classification recording',
      'Quality inspection clearance issuance',
    ],
    description:
      'Operates electronic optical hide area scanning machines, generates square footage barcode labels, grades surface cuttable yields, verifies Bally flex resistance, and issues Leather Quality Clearance Certificates.',
    badgeStyle: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  },
];

export const FURNITURE_SPECIALIZED_ROLES: SpecializedRole[] = [
  {
    role: 'TIMBER_SEASONING_KILN_MANAGER',
    designationKey: 'TIMBER_SEASONING_KILN_MANAGER',
    title: 'Timber Seasoning & Kiln Manager',
    subCategory: 'Furniture',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Kiln Drying & Moisture EMC',
    functions: [
      'Kiln drying chamber temperature and humidity profile monitoring',
      'Moisture meter reading tracking - green to equilibrium moisture content',
      'Wood shrinkage percentage calculation - tangential, radial, volumetric',
      'Timber stack inventory and case hardening stress test management',
    ],
    description:
      'Supervises timber seasoning kilns, monitors temperature and humidity drying curves, tracks moisture meter readings down to 6-8% EMC, calculates anisotropic shrinkage, and audits case-hardening stress relief prong tests.',
    badgeStyle: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  {
    role: 'DIMENSION_MILL_CNC_MANAGER',
    designationKey: 'DIMENSION_MILL_CNC_MANAGER',
    title: 'Dimension Mill & CNC Operations Manager',
    subCategory: 'Furniture',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'CNC Nesting & Edge Banding',
    functions: [
      'Panel optimization nesting layout management',
      'CNC machining program file tracking - G-code NC programs',
      'Edge banding glue temperature and feed rate monitoring',
      'Sub-component routing oversight & machining tolerance verification',
    ],
    description:
      'Controls multi-axis CNC routers and panel sizing saws, optimizes 2D/3D nesting layouts to minimize offcut waste, monitors edge-banding PUR/EVA glue temperatures, and verifies precision dowel/minifix machining tolerances.',
    badgeStyle: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
  },
  {
    role: 'UPHOLSTERY_FOAM_CUTTING_MANAGER',
    designationKey: 'UPHOLSTERY_FOAM_CUTTING_MANAGER',
    title: 'Upholstery & Foam Cutting Manager',
    subCategory: 'Furniture',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Foam Density & Sewing Line',
    functions: [
      'Fabric marker layout management to minimize wastage',
      'Foam density grade tracking - PU foam, memory foam, bonded foam',
      'Industrial sewing line output oversight and seam pull strength testing',
      'Upholstery material inventory and flammability TB117 compliance',
    ],
    description:
      'Directs upholstery cutting and sewing lines, optimizes fabric and leather marker layouts, tracks PU and memory foam block density grades, oversees CNC oscillating wire cutters, and ensures California TB117 flammability compliance.',
    badgeStyle: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
  },
  {
    role: 'SANDING_FINISHING_POLISHING_MANAGER',
    designationKey: 'SANDING_FINISHING_POLISHING_MANAGER',
    title: 'Sanding, Finishing & Polishing Manager',
    subCategory: 'Furniture',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Sanding Grits & PU Topcoat',
    functions: [
      'Sanding grit progression schedule tracking - P80 to P320 orbital',
      'Finishing chemical formulation management - stains, sealers, PU topcoats',
      'Spray booth dust extraction and relative humidity monitoring',
      'Gloss consistency inspection - 60° Gardner GU & cross-hatch adhesion',
    ],
    description:
      'Manages wide-belt sanders and spray finishing booths, enforces multi-stage grit sanding schedules, formulates stains and polyurethane lacquers, checks spray booth dust PPM, and tests 60° gloss levels and cross-hatch adhesion.',
    badgeStyle: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
  },
  {
    role: 'KD_PACKAGING_HARDWARE_KITTING_MANAGER',
    designationKey: 'KD_PACKAGING_HARDWARE_KITTING_MANAGER',
    title: 'KD Packaging & Hardware Kitting Manager',
    subCategory: 'Furniture',
    associatedDepartment: 'PACKING',
    shortBadge: 'Hardware Kitting & Drop Test',
    functions: [
      'Hardware blister-pack kitting list management - bolts, dowels, allen keys',
      'Corrugated box cutting and bubble-wrap padding standard oversight',
      'Carton drop-test compliance checking - ISTA 1A/3A standards',
      'Barcoded shipping label verification and assembly clearance pass issuance',
    ],
    description:
      'Oversees Knock-Down (KD) flat-pack packaging, audits hardware blister-pack kitting completeness, verifies corrugated box bursting strength and edge protection, conducts ISTA 1A/3A drop tests, and issues Assembly Clearance Passes.',
    badgeStyle: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  },
];

export const DAIRY_SPECIALIZED_ROLES: SpecializedRole[] = [
  {
    role: 'MILK_COLLECTION_RECEPTION_MANAGER',
    designationKey: 'MILK_COLLECTION_RECEPTION_MANAGER',
    title: 'Milk Collection & Reception Manager',
    subCategory: 'Dairy Products',
    associatedDepartment: 'INVENTORY',
    shortBadge: 'Milk Inward & SNF Analyzer',
    functions: [
      'Weighbridge tanker inward data logging',
      'Ultrasonic milk analyzer test result integration - Fat/SNF/Density',
      'Farmer/supplier payment grading ledger management',
      'Raw chilling silo inventory tracking (2-4°C)',
    ],
    description:
      'Directs raw milk reception docks, logs weighbridge tanker tare/gross weights, integrates ultrasonic Fat/SNF analyzer data, executes supplier payment formulas based on total solids, and manages chilled raw milk storage silos.',
    badgeStyle: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30',
  },
  {
    role: 'PASTEURIZATION_PROCESSING_MANAGER',
    designationKey: 'PASTEURIZATION_PROCESSING_MANAGER',
    title: 'Pasteurization & Processing Manager',
    subCategory: 'Dairy Products',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'HTST Hold & Cream Separation',
    functions: [
      'Pasteurizer temperature-time hold chart monitoring - PLC logs (72-75°C)',
      'Steam and chilled water utility consumption tracking',
      'Cream separation ratio management',
      'Daily processing schedule oversight and homogenization pressure control',
    ],
    description:
      'Governs HTST plate pasteurizers, verifies automated flow diversion valve (FDV) safety hold records, tracks steam and glycol chilled water utilities, standardizes milk fat/SNF ratios via centrifugal cream separators, and supervises two-stage homogenization.',
    badgeStyle: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
  },
  {
    role: 'FERMENTATION_CULTURE_MANAGER',
    designationKey: 'FERMENTATION_CULTURE_MANAGER',
    title: 'Fermentation & Culture Operations Manager',
    subCategory: 'Dairy Products',
    associatedDepartment: 'PRODUCTION',
    shortBadge: 'Starter Culture & Curd pH',
    functions: [
      'Starter culture inventory and inoculation recipe management',
      'Incubation chamber temperature log tracking',
      'Curd pH and coagulation firmness monitoring (pH 6.6 -> 4.5)',
      'Batch yield control and syneresis whey drainage tracking',
    ],
    description:
      'Supervises probiotic curd, yogurt, paneer, and cheese fermentation lines, manages DVS freeze-dried starter culture inoculations, monitors incubation room thermal profiles, logs pH drop curves and titratable acidity, and balances curd yields.',
    badgeStyle: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  {
    role: 'QA_MBRT_ANTIBIOTIC_INCHARGE',
    designationKey: 'QA_MBRT_ANTIBIOTIC_INCHARGE',
    title: 'Dairy QA & MBRT/Antibiotic In-Charge',
    subCategory: 'Dairy Products',
    associatedDepartment: 'QUALITY',
    shortBadge: 'MBRT, Antibiotic & CoA Gate',
    functions: [
      'Daily microbiological and chemical test result recording (MBRT, Antibiotic residue)',
      'Aflatoxin M1 and somatic cell count (SCC) statutory threshold verification',
      'Blocking unapproved milk batches from packaging lines',
      'Certificate of Analysis - CoA auto-generation & packaging gate clearance',
    ],
    description:
      'Administers quality release protocols, performs dye reduction MBRT decolorization tests, screens for beta-lactam/tetracycline antibiotic residues, audits aflatoxin M1 and somatic cell counts, enforces strict packaging line lockouts, and generates statutory food safety Certificates of Analysis (CoA).',
    badgeStyle: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  },
  {
    role: 'COLD_CHAIN_EXPIRY_MANAGER',
    designationKey: 'COLD_CHAIN_EXPIRY_MANAGER',
    title: 'Cold-Chain & Expiry FEFO Manager',
    subCategory: 'Dairy Products',
    associatedDepartment: 'INVENTORY',
    shortBadge: 'Cold-Chain (2-4°C) & FEFO Expiry',
    functions: [
      'Cold room temperature logger monitoring (2-4°C)',
      'Cold-chain logistics vehicle temperature compliance management',
      'Barcode label printing with strict use-by timestamps',
      'Near-expiry FIFO/FEFO stock rotation and quarantine gate control',
    ],
    description:
      'Monitors blast chilling and finished product cold storage rooms, tracks refrigerated reefer truck dataloggers, enforces First-Expired, First-Out (FEFO) warehouse rotation, prints dynamic use-by barcode labels, and prevents shipping of temperature-compromised dairy inventory.',
    badgeStyle: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
  },
];

export const ALL_SPECIALIZED_ROLES: SpecializedRole[] = [
  ...STEEL_SPECIALIZED_ROLES,
  ...GLASS_SPECIALIZED_ROLES,
  ...CHEMICAL_SPECIALIZED_ROLES,
  ...PAINT_SPECIALIZED_ROLES,
  ...RUBBER_SPECIALIZED_ROLES,
  ...PIPES_SPECIALIZED_ROLES,
  ...AUTOMOBILE_SPECIALIZED_ROLES,
  ...ELECTRONICAL_SPECIALIZED_ROLES,
  ...ELECTRIC_EQUIPMENT_SPECIALIZED_ROLES,
  ...CABLE_WIRE_SPECIALIZED_ROLES,
  ...TEXTILES_SPECIALIZED_ROLES,
  ...JEWELLERY_SPECIALIZED_ROLES,
  ...LEATHER_SPECIALIZED_ROLES,
  ...FURNITURE_SPECIALIZED_ROLES,
  ...DAIRY_SPECIALIZED_ROLES,
];

/**
 * Normalizes sub-category string for matching
 */
export function normalizeSubCategory(subCategory?: string | null): string {
  if (!subCategory) return '';
  return subCategory.trim().toLowerCase();
}

/**
 * Returns specialized roles matching the logged-in company's subCategory
 */
export function getSpecializedRolesForSubCategory(subCategory?: string | null): SpecializedRole[] {
  if (!subCategory) return [];
  const normalized = normalizeSubCategory(subCategory);

  if (normalized.includes('auto') || normalized.includes('vehicle')) {
    return AUTOMOBILE_SPECIALIZED_ROLES;
  }
  if (normalized.includes('electron')) {
    return ELECTRONICAL_SPECIALIZED_ROLES;
  }
  if (normalized.includes('cable') || normalized.includes('wire')) {
    return CABLE_WIRE_SPECIALIZED_ROLES;
  }
  if (normalized.includes('electric') || normalized.includes('equipment') || normalized.includes('transformer') || normalized.includes('switchgear')) {
    return ELECTRIC_EQUIPMENT_SPECIALIZED_ROLES;
  }
  if (
    normalized.includes('textile') ||
    normalized.includes('garment') ||
    normalized.includes('apparel') ||
    normalized.includes('fabric') ||
    normalized.includes('yarn')
  ) {
    return TEXTILES_SPECIALIZED_ROLES;
  }
  if (
    normalized.includes('jewel') ||
    normalized.includes('jewelry') ||
    normalized.includes('jewellery') ||
    normalized.includes('gold') ||
    normalized.includes('diamond') ||
    normalized.includes('bullion')
  ) {
    return JEWELLERY_SPECIALIZED_ROLES;
  }
  if (
    normalized.includes('leather') ||
    normalized.includes('tannery') ||
    normalized.includes('tanning') ||
    normalized.includes('hide') ||
    normalized.includes('skin')
  ) {
    return LEATHER_SPECIALIZED_ROLES;
  }
  if (
    normalized.includes('furniture') ||
    normalized.includes('wood') ||
    normalized.includes('timber') ||
    normalized.includes('carpentry') ||
    normalized.includes('cabinet')
  ) {
    return FURNITURE_SPECIALIZED_ROLES;
  }
  if (
    normalized.includes('dairy') ||
    normalized.includes('milk') ||
    normalized.includes('cheese') ||
    normalized.includes('butter') ||
    normalized.includes('curd') ||
    normalized.includes('yogurt') ||
    normalized.includes('ice cream')
  ) {
    return DAIRY_SPECIALIZED_ROLES;
  }
  if (normalized === 'pipes' || normalized.includes('pipe')) {
    return PIPES_SPECIALIZED_ROLES;
  }
  if (normalized.includes('rubber') || normalized.includes('tyre') || normalized.includes('tire')) {
    return RUBBER_SPECIALIZED_ROLES;
  }
  if (normalized === 'paint' || normalized.includes('paint') || normalized.includes('coating')) {
    return PAINT_SPECIALIZED_ROLES;
  }
  if (normalized === 'chemicals' || normalized.includes('chemical')) {
    return CHEMICAL_SPECIALIZED_ROLES;
  }
  if (normalized.includes('glass') || normalized.includes('ceramic')) {
    return GLASS_SPECIALIZED_ROLES;
  }
  if (normalized.includes('steel') || normalized.includes('heavy metal')) {
    return STEEL_SPECIALIZED_ROLES;
  }

  return ALL_SPECIALIZED_ROLES.filter(
    (role) => normalizeSubCategory(role.subCategory) === normalized,
  );
}

/**
 * Returns the sector code identifier
 */
export function getSectorCodeFromSubCategory(
  subCategory?: string | null,
): 'DAIRY' | 'FURNITURE' | 'LEATHER' | 'JEWELLERY' | 'TEXTILES' | 'CABLE_WIRE' | 'ELECTRIC_EQUIPMENT' | 'ELECTRONICAL' | 'AUTOMOBILE' | 'PIPES' | 'RUBBER' | 'PAINT' | 'CHEMICAL' | 'GLASS' | 'STEEL' | 'NONE' {
  if (!subCategory) return 'NONE';
  const normalized = normalizeSubCategory(subCategory);

  if (
    normalized.includes('dairy') ||
    normalized.includes('milk') ||
    normalized.includes('cheese') ||
    normalized.includes('butter') ||
    normalized.includes('curd') ||
    normalized.includes('yogurt') ||
    normalized.includes('ice cream')
  ) {
    return 'DAIRY';
  }
  if (
    normalized.includes('furniture') ||
    normalized.includes('wood') ||
    normalized.includes('timber') ||
    normalized.includes('carpentry') ||
    normalized.includes('cabinet')
  ) {
    return 'FURNITURE';
  }
  if (
    normalized.includes('leather') ||
    normalized.includes('tannery') ||
    normalized.includes('tanning') ||
    normalized.includes('hide') ||
    normalized.includes('skin')
  ) {
    return 'LEATHER';
  }
  if (
    normalized.includes('jewel') ||
    normalized.includes('jewelry') ||
    normalized.includes('jewellery') ||
    normalized.includes('gold') ||
    normalized.includes('diamond') ||
    normalized.includes('bullion')
  ) {
    return 'JEWELLERY';
  }
  if (
    normalized.includes('textile') ||
    normalized.includes('garment') ||
    normalized.includes('apparel') ||
    normalized.includes('fabric') ||
    normalized.includes('yarn')
  ) {
    return 'TEXTILES';
  }
  if (normalized.includes('cable') || normalized.includes('wire')) return 'CABLE_WIRE';
  if (normalized.includes('electric') || normalized.includes('equipment') || normalized.includes('transformer') || normalized.includes('switchgear')) return 'ELECTRIC_EQUIPMENT';
  if (normalized.includes('auto') || normalized.includes('vehicle')) return 'AUTOMOBILE';
  if (normalized.includes('electron')) return 'ELECTRONICAL';
  if (normalized === 'pipes' || normalized.includes('pipe')) return 'PIPES';
  if (normalized.includes('rubber') || normalized.includes('tyre') || normalized.includes('tire')) return 'RUBBER';
  if (normalized === 'paint' || normalized.includes('paint') || normalized.includes('coating')) return 'PAINT';
  if (normalized === 'chemicals' || normalized.includes('chemical')) return 'CHEMICAL';
  if (normalized.includes('glass') || normalized.includes('ceramic')) return 'GLASS';
  if (normalized.includes('steel') || normalized.includes('heavy metal')) return 'STEEL';
  return 'NONE';
}

export const MANUFACTURING_DEPARTMENTS: DepartmentMeta[] = [
  {
    key: 'EXECUTIVE',
    label: 'CEO / MD / Owner / Super Admin',
    shortLabel: 'Executive',
    codePrefix: 'EXEC',
    allowedDesignations: ['SUPER_ADMIN', 'CEO', 'MD', 'OWNER', 'EXECUTIVE'],
    description: 'Top-level enterprise authority across all plant departments & multi-tenant administration',
    permissionsByLevel: {
      SUPER_ADMIN: 'Full root tenant ownership, company-level multi-tenant administration, user provisioning & enterprise sign-off',
      OWNER: 'Full root ownership, company settings, executive onboarding & plant-wide sign-off',
      CEO: 'Full enterprise governance, production order sign-off, HR & purchasing approval',
      MD: 'Plant-wide operational control, cross-department approvals & executive reporting',
      EXECUTIVE: 'Executive operational control & cross-department governance',
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
      'RUBBER_COMPOUNDING_MANAGER',
      'EXTRUSION_CALENDERING_MANAGER',
      'TYRE_BUILDING_MANAGER',
      'CURING_VULCANIZATION_MANAGER',
      'EXTRUSION_LINE_OPERATIONS_MANAGER',
      'SOCKETING_BELLING_JOINTING_MANAGER',
      'PVC_DRY_BLEND_REGRIND_MANAGER',
      'PRESS_SHOP_BIW_MANAGER',
      'VEHICLE_ASSEMBLY_MANAGER',
      'PAINT_SHOP_ANTI_CORROSION_MANAGER',
      'SMT_PCB_ASSEMBLY_MANAGER',
      'FIRMWARE_FLASHING_MANAGER',
      'WINDING_COIL_FABRICATION_MANAGER',
      'CORE_ASSEMBLY_LAMINATION_MANAGER',
      'VPI_INSULATION_MANAGER',
      'BUSBAR_FABRICATION_ENCLOSURE_MANAGER',
      'WIRE_DRAWING_ANNEALING_MANAGER',
      'BUNCHING_STRANDING_MANAGER',
      'INSULATION_SHEATHING_MANAGER',
      'ARMOURING_BEDDING_MANAGER',
      'SPINNING_YARN_MANAGER',
      'WEAVING_KNITTING_MANAGER',
      'DYEING_PROCESS_MANAGER',
      'GARMENTING_FINISHING_MANAGER',
      'CAD_CAM_PROTOTYPING_MANAGER',
      'CASTING_MELTING_MANAGER',
      'GOLDSMITH_KARIGAR_MANAGER',
      'HIDE_WETBLUE_MANAGER',
      'RETANNING_DYEING_CRUST_MANAGER',
      'SPLITTING_SHAVING_CALIBRATION_MANAGER',
      'FINISHING_BUFFING_EMBOSSING_MANAGER',
      'TIMBER_SEASONING_KILN_MANAGER',
      'DIMENSION_MILL_CNC_MANAGER',
      'UPHOLSTERY_FOAM_CUTTING_MANAGER',
      'SANDING_FINISHING_POLISHING_MANAGER',
      'PASTEURIZATION_PROCESSING_MANAGER',
      'FERMENTATION_CULTURE_MANAGER',
      'ASSISTANT_MANAGER',
      'ASSOCIATE_MANAGER',
    ],
    description: 'Kiln drying chamber temperature & humidity profile monitoring, wood moisture & shrinkage calculation, panel optimization nesting layouts, CNC machining programs, edge banding glue temps, fabric marker wastage minimization, foam density grades, sanding grit progression schedules, finishing chemical formulations, work orders, HTST pasteurization hold logs & cream separation, probiotic fermentation & curd pH trajectory tracking, tannery drum chemical dosing & wet-blue yield, retanning/dyeing shade matching & fatliquor temper, bandknife splitting thickness calibration, rotary spray booth finishing & grain embossing, jewelry 3D CAD prototyping & resin printing, vacuum induction casting cycles & karatage stoichiometry, karigar metal issuance & Ghath loss reconciliation, coil winding & turns count, CRGO core stacking & torque, VPI autoclave impregnation & baking, busbar bending & enclosure routing, wire drawing reduction & dies, strand bunching, extrusion line sheathing, armouring pitch, SMT setups, reflow oven profiles, firmware flashing, vehicle assembly takt time, press shop stamping, ED paint bath curing, pipe extrusion lines, belling cycles, PVC dry blends, compounding banbury mixers, extrusion calenders, tyre building, curing presses & subcontracting job work tracking',
    permissionsByLevel: {
      MANAGER: 'Approve production orders, authorize batch releases & manage plant shift capacity',
      PASTEURIZATION_PROCESSING_MANAGER:
        'Govern HTST pasteurizers, verify FDV divert safety hold records, monitor steam/glycol utility telemetry, calibrate cream separator fat ratios & oversee homogenization pressure',
      FERMENTATION_CULTURE_MANAGER:
        'Direct probiotic curd & yogurt culture inoculations, track incubation chamber thermal profiles, log pH drop trajectories (6.65 to 4.5) & verify curd coagulation yield',
      TIMBER_SEASONING_KILN_MANAGER:
        'Monitor kiln chamber temperature and relative humidity schedules, track moisture meter readings down to 6-8% EMC, calculate anisotropic wood shrinkage & audit case-hardening prong tests',
      DIMENSION_MILL_CNC_MANAGER:
        'Manage panel optimization nesting layouts to minimize offcut waste, oversee multi-axis CNC G-code program files, regulate edge-banding glue pot temperatures & verify ±0.15mm machining tolerances',
      UPHOLSTERY_FOAM_CUTTING_MANAGER:
        'Direct fabric/leather marker cutting layouts, track PU and memory foam block density grades (32D/40D), monitor CNC wire contour cutters & enforce TB117 flammability compliance',
      SANDING_FINISHING_POLISHING_MANAGER:
        'Enforce multi-stage sanding grit progression (P80-P320), formulate wood stains and polyurethane/UV topcoats, regulate spray booth dust extraction & test 60° Gardner specular gloss consistency',
      HIDE_WETBLUE_MANAGER:
        'Oversee raw hide grading, tanning drum recipe chemical dosing (chrome/basification), monitor drum cycle RPM & pH, and record boil test shrinkage',
      RETANNING_DYEING_CRUST_MANAGER:
        'Formulate leather dye recipes & fatliquors, monitor vacuum/toggle drying tunnels, regulate moisture % & classify crust leather batches',
      SPLITTING_SHAVING_CALIBRATION_MANAGER:
        'Calibrate bandknife splitting blades, record 5-point thickness gauge measurements, track leather shaving waste & sort thickness lots',
      FINISHING_BUFFING_EMBOSSING_MANAGER:
        'Manage rotary spray booth finishing lines, heated plate embossing schedules (Croco/Nappa/Pebble), gloss/luster meter telemetry & Veslic rub testing',
      CAD_CAM_PROTOTYPING_MANAGER:
        'Manage 3D jewelry CAD designs, monitor 3D printer castable resin & wax consumption, oversee master rubber molds & assign designs to manufacturing orders',
      CASTING_MELTING_MANAGER:
        'Formulate alloy karatage stoichiometric conversion recipes, monitor induction furnace casting curves, calculate tree yields & audit sweepings/dust scrap recovery',
      GOLDSMITH_KARIGAR_MANAGER:
        'Issue gold & gemstones to karigars via job-work challans, monitor craftsmanship stages, reconcile Ghath loss against benchmark tolerance & settle making wages',
      WIRE_DRAWING_ANNEALING_MANAGER:
        'Track wire elongation ratios, drawing die wear & inventory, weight reduction yields & continuous annealing temperature profiles',
      BUNCHING_STRANDING_MANAGER:
        'Manage conductor strand combinations, machine RPM & lay-length parameters, bobbin allocation & scrap loss monitoring',
      INSULATION_SHEATHING_MANAGER:
        'Regulate multi-zone barrel temperatures, PVC/XLPE compound consumption, caterpillar haul-off speed & online laser OD gauge telemetry',
      ARMOURING_BEDDING_MANAGER:
        'Oversee steel wire/strip reel inventories, armouring pitch & tension, coverage uniformity & WIP staging',
      WINDING_COIL_FABRICATION_MANAGER:
        'Manage coil winding BOMs, monitor turns counters, track conductor weights & verify inter-turn surge insulation integrity',
      CORE_ASSEMBLY_LAMINATION_MANAGER:
        'Supervise CRGO slitting, mitered core stacking patterns, clamping torque verification & magnetic no-load core loss metrics',
      VPI_INSULATION_MANAGER:
        'Control autoclave VPI impregnation chambers, track resin specific gravity, regulate curing oven heat curves & validate insulation resistance',
      BUSBAR_FABRICATION_ENCLOSURE_MANAGER:
        'Oversee busbar bending, modular enclosure fabrication, powder coating DFT & verify phase/creepage electrical clearances',
      SMT_PCB_ASSEMBLY_MANAGER:
        'Manage SMT feeder placement lists, track component reel lot barcodes, monitor reflow oven temperature profiles & direct daily PCB assembly output',
      FIRMWARE_FLASHING_MANAGER:
        'Manage firmware master binaries, API integration with work orders, enforce strict 1-to-1 device serial-to-firmware mapping & verify checksums',
      PRESS_SHOP_BIW_MANAGER:
        'Oversee tandem stamping lines, track SMED die changeover durations, cumulative stroke counts & inspect spot weld integrity',
      VEHICLE_ASSEMBLY_MANAGER:
        'Direct vehicle Trim, Chassis, Final (TCF) assembly, manage 72s line takt adherence & balance workstation cycle times',
      PAINT_SHOP_ANTI_CORROSION_MANAGER:
        'Regulate cathodic electrodeposition (CED) dip tanks, paint booth environmental parameters & oven curing temperature profiles',
      EXTRUSION_LINE_OPERATIONS_MANAGER:
        'Regulate barrel temperature zones, synchronize screw RPM with caterpillar haul-off & log shift output',
      SOCKETING_BELLING_JOINTING_MANAGER:
        'Manage belling machine heating/cooling cycles, verify socket dimensional accuracy & track rubber seal rings',
      PVC_DRY_BLEND_REGRIND_MANAGER:
        'Control dry blend weighing formulations, monitor stabilizer dosing & enforce virgin-to-regrind blending ratios',
      RUBBER_COMPOUNDING_MANAGER:
        'Oversee banbury compounding, calibrate Mooney viscosity ML (1+4) & track ASTM D7723 carbon black dispersion',
      EXTRUSION_CALENDERING_MANAGER:
        'Regulate extrusion die profiles, steel cord/fabric tension (kN), laser gauge thickness & roll stock inventory',
      TYRE_BUILDING_MANAGER:
        'Enforce green tyre assembly sequences, manage component BOM recipes & monitor WIP green tyre inventory',
      CURING_VULCANIZATION_MANAGER:
        'Monitor curing press platen temperatures, steam dome/bladder pressures & manage bladder lifecycle shot limits',
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
      'JIT_JIS_SUPPLY_CHAIN_MANAGER',
      'COMPONENT_OBSOLESCENCE_EBOM_MANAGER',
      'CORE_ASSEMBLY_LAMINATION_MANAGER',
      'WEAVING_KNITTING_MANAGER',
      'GARMENTING_FINISHING_MANAGER',
      'BULLION_VAULT_SECURITY_MANAGER',
      'GOLDSMITH_KARIGAR_MANAGER',
      'HIDE_WETBLUE_MANAGER',
      'RETANNING_DYEING_CRUST_MANAGER',
      'LEATHER_QC_AREA_MEASUREMENT_MANAGER',
      'TIMBER_SEASONING_KILN_MANAGER',
      'UPHOLSTERY_FOAM_CUTTING_MANAGER',
      'KD_PACKAGING_HARDWARE_KITTING_MANAGER',
      'MILK_COLLECTION_RECEPTION_MANAGER',
      'COLD_CHAIN_EXPIRY_MANAGER',
      'ASSISTANT_MANAGER',
      'ASSOCIATE_MANAGER',
    ],
    description: 'Raw milk reception weighbridge and chilled silo stock (2-4°C), reefer vehicle cold-chain and FEFO dynamic barcode expiry, green and seasoned timber stack inventory, upholstery fabric roll stock and foam block reserves, knock-down furniture hardware kitting blister packs, raw material stock control, wet-blue and crust leather stock reserves, square footage barcode inventory, bullion vault stock balance & live metal market rates, karigar metal & stone challan tracking, CRGO electrical steel sheets, electronic component obsolescence & EBOM lifecycle status, electronic Kanban signals, Just-in-Sequence (JIS) line delivery, bulk base stock tinting, dangerous goods transport (Tremcards), weighbridge slips & silos',
    permissionsByLevel: {
      MANAGER: 'Approve stock adjustments, write-offs, multi-warehouse transfers & valuation audits',
      MILK_COLLECTION_RECEPTION_MANAGER:
        'Direct raw milk weighbridge intake, integrate ultrasonic Fat/SNF/Density analyzer logs, administer farmer payment rates & monitor raw chilling silos (2-4°C)',
      COLD_CHAIN_EXPIRY_MANAGER:
        'Monitor cold room continuous data loggers (2-4°C), audit reefer transport vehicle temperatures, print dynamic use-by barcode labels & enforce FEFO expiry dispatch gates',
      TIMBER_SEASONING_KILN_MANAGER:
        'Manage green timber log yard inventory, seasoned timber stack bin locations, board-feet volumetric logging & moisture equilibrium quarantine',
      UPHOLSTERY_FOAM_CUTTING_MANAGER:
        'Control upholstery roll stock inventories, foam block density lots, leather hide yardage balances & trim offcut salvage',
      KD_PACKAGING_HARDWARE_KITTING_MANAGER:
        'Maintain hardware blister kitting inventories (bolts, dowels, minifix, allen keys), corrugated carton sheet stocks & corner protector balances',
      HIDE_WETBLUE_MANAGER:
        'Track raw salted hide inventory, wet-blue lot stocks, grading yields & chemical drum usage',
      RETANNING_DYEING_CRUST_MANAGER:
        'Manage crust leather batch inventories, square footage area logs & dye warehouse allocations',
      LEATHER_QC_AREA_MEASUREMENT_MANAGER:
        'Manage individual hide square footage barcode labels, warehouse dispatch staging & finished hide lots',
      BULLION_VAULT_SECURITY_MANAGER:
        'Manage high-security bullion vaults, inward pure gold bars & silver granules, maintain live market valuations & reconcile daily balances',
      GOLDSMITH_KARIGAR_MANAGER:
        'Audit karigar inventory balances, raw gold/gemstone issuance challans & returned scrap/Ghath gold reconciliation',
      CORE_ASSEMBLY_LAMINATION_MANAGER:
        'Track CRGO master coil inventory, slitting scrap reconciliation & core lamination sheet consumption',
      COMPONENT_OBSOLESCENCE_EBOM_MANAGER:
        'Monitor semiconductor lifecycle status (Active/NRND/EOL/Obsolete), qualify pin-to-pin substitute parts, administer ECO revisions & manage vendor lead times',
      JIT_JIS_SUPPLY_CHAIN_MANAGER:
        'Coordinate electronic Kanban pull signals, manage line-side parts delivery sequences & monitor supplier delivery punctuality',
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
      'TYRE_TESTING_UNIFORMITY_MANAGER',
      'WALL_THICKNESS_QUALITY_INCHARGE',
      'HYDROSTATIC_BURST_TESTING_MANAGER',
      'EOL_TESTING_VIN_MANAGER',
      'ELECTRICAL_TESTING_CALIBRATION_MANAGER',
      'HV_ROUTINE_TESTING_MANAGER',
      'HV_SPARK_TESTING_QA_MANAGER',
      'FABRIC_QUALITY_INSPECTION_MANAGER',
      'GEMSTONE_HALLMARKING_QC_MANAGER',
      'SPLITTING_SHAVING_CALIBRATION_MANAGER',
      'LEATHER_QC_AREA_MEASUREMENT_MANAGER',
      'SANDING_FINISHING_POLISHING_MANAGER',
      'KD_PACKAGING_HARDWARE_KITTING_MANAGER',
      'QA_MBRT_ANTIBIOTIC_INCHARGE',
      'ASSISTANT_MANAGER',
      'ASSOCIATE_MANAGER',
    ],
    description: 'Dairy MBRT dye reduction hours & beta-lactam/tetracycline antibiotic tests, somatic cell counts & packaging gate lockouts, wood finish 60° specular gloss meter testing & cross-hatch adhesion audits, ISTA 1A/3A carton drop-test compliance, assembly clearance pass certification, optical hide area measurement & barcode tagging, Bally flexometer cycles, Veslic rub fastness, split thickness 5-point gauge tolerance audit, BIS 6-digit HUID laser hallmarking & CoA certification, gemstone & diamond 4C grading, Fabric 4-point ASTM D5430 inspection & shrinkage tests, High voltage spark test faults & conductor DC resistance, high voltage routine test rig certification, statutory dispatch gate lockout, partial discharge metrics, automotive EOL testing, automated ICT/FCT electrical testing, uncalibrated instrument blocking, 17-character VIN assignment & Gate Pass clearance, analytical assay testing, ultrasonic wall thickness scanning, hydrostatic burst pressure testing, spectrophotometer delta E matching, rheology viscosity clearance, tyre dynamic balancing & uniformity testing, CoA generation & dispatch gate locks',
    permissionsByLevel: {
      MANAGER: 'Final batch QC release/hold authority, CAPA sign-off & compliance certification',
      QA_MBRT_ANTIBIOTIC_INCHARGE:
        'Log dye reduction MBRT decolorization times, test beta-lactam/tetracycline antibiotic residues, screen aflatoxin M1 & somatic cells, enforce packaging gate locks & auto-issue dairy CoAs',
      SANDING_FINISHING_POLISHING_MANAGER:
        'Conduct 60° Gardner gloss meter verification, cross-hatch adhesion testing (ASTM D3359), spray booth particulate extraction monitoring & topcoat curing validation',
      KD_PACKAGING_HARDWARE_KITTING_MANAGER:
        'Verify ISTA 1A/3A carton drop-test compliance, inspect hardware kit contents (minifix, dowels, bolts), barcode label scan matching & issue Furniture Assembly Clearance Pass (CoA)',
      SPLITTING_SHAVING_CALIBRATION_MANAGER:
        'Audit 5-point thickness gauge calibrations across hide sampling points, evaluate tolerance compliance & quarantine irregular lots',
      LEATHER_QC_AREA_MEASUREMENT_MANAGER:
        'Operate optical area scanners, generate square footage barcodes, grade surface cuttable yields, verify Bally flexometer resistance & issue Leather Quality Clearance Certificates (CoA)',
      GEMSTONE_HALLMARKING_QC_MANAGER:
        'Verify XRF spectrometer gold purity, log 6-digit BIS Hallmark Unique Identifications (HUID), verify diamond 4C certifications (GIA/IGI) & auto-issue Certificates of Authenticity (CoA)',
      FABRIC_QUALITY_INSPECTION_MANAGER:
        'Log ASTM D5430 4-point inspection defect points, verify fabric GSM & dimensional shrinkage, check washing color fastness & issue Quality Clearance Certificates (CoA)',
      HV_SPARK_TESTING_QA_MANAGER:
        'Log spark test fault puncture counts, verify conductor DC resistance, issue Quality Clearance Certificates & calibrate meter-marking encoders',
      HV_ROUTINE_TESTING_MANAGER:
        'Administer high-voltage routine test bays, enforce statutory test instrument calibration locks, block non-compliant equipment from dispatch & issue Test Certificates',
      ELECTRICAL_TESTING_CALIBRATION_MANAGER:
        'Supervise automated ICT/FCT test rigs, block out-of-calibration instruments, log pass/fail defect root-causes & issue electronic test clearance certificates',
      EOL_TESTING_VIN_MANAGER:
        'Record wheel alignment & dynamic dyno test results, assign unique 17-character VIN, verify statutory component serials & authorize Gate Passes',
      WALL_THICKNESS_QUALITY_INCHARGE:
        'Record 360° ultrasonic wall thickness, evaluate ovality/eccentricity & enforce packaging block gate on non-standard lots',
      HYDROSTATIC_BURST_TESTING_MANAGER:
        'Log burst pressure & hydrostatic endurance tests, compute hoop stress & issue pressure compliance certificates',
      TYRE_TESTING_UNIFORMITY_MANAGER:
        'Log dynamic balancing & tyre uniformity (RFV/LFV/Conicity), assign statutory DOT codes & classify tyre grades',
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
      'KD_PACKAGING_HARDWARE_KITTING_MANAGER',
      'ASSISTANT_MANAGER',
      'ASSOCIATE_MANAGER',
    ],
    description: 'Knock-down (KD) flat-pack hardware blister kitting, corrugated carton protective cushioning, ISTA drop-testing, finished goods packaging, flammable container anti-static grounding, VOC compliance, barcode labeling & dispatch staging',
    permissionsByLevel: {
      MANAGER: 'Approve dispatch packing lists, export crate compliance & packaging material budgets',
      KD_PACKAGING_HARDWARE_KITTING_MANAGER:
        'Oversee KD flat-pack assembly kits, automated blister-pack hardware counts (allen keys, minifix, screws), corrugated corner shock padding & ISTA drop-test compliance',
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
      'ESD_CLEANROOM_COMPLIANCE_MANAGER',
      'BULLION_VAULT_SECURITY_MANAGER',
      'ASSISTANT_MANAGER',
      'ASSOCIATE_MANAGER',
    ],
    description: 'Bullion vault high-security custody & biometric access, ESD workstation compliance audit logs, cleanroom environment sensor telemetry, plant gate entry/exit logs, hazardous waste manifests, EHS incident reporting, hot work permits & safety gear audits',
    permissionsByLevel: {
      MANAGER: 'Authorize outward material gate-passes, emergency overrides & contractor clearance',
      BULLION_VAULT_SECURITY_MANAGER:
        'Enforce dual-custody vault security protocols, audit milligram weight balances & oversee CCTV/biometric secure transfer logs',
      ESD_CLEANROOM_COMPLIANCE_MANAGER:
        'Log daily ESD workstation compliance (wrist straps, grounding mats), track ANSI/ESD S20.20 resistance thresholds, monitor ISO cleanroom particle counts & audit shielding packaging',
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
    shortLabel: 'Maintenance',
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
    shortLabel: 'Purchasing',
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
