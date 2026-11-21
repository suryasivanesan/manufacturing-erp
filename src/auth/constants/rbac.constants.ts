export enum Department {
  EXECUTIVE = 'EXECUTIVE',
  PRODUCTION = 'PRODUCTION',
  INVENTORY = 'INVENTORY',
  QUALITY = 'QUALITY',
  PACKING = 'PACKING',
  SECURITY = 'SECURITY',
  GATE_SECURITY = 'GATE_SECURITY',
  HR = 'HR',
  SALES = 'SALES',
  FINANCE = 'FINANCE',
  MACHINE_MAINTENANCE = 'MACHINE_MAINTENANCE',
  PURCHASING_SOURCING = 'PURCHASING_SOURCING',
  PROCUREMENT = 'PROCUREMENT',
  LOGISTICS = 'LOGISTICS',
}

export enum Designation {
  SUPER_ADMIN = 'SUPER_ADMIN',
  CEO = 'CEO',
  MD = 'MD',
  OWNER = 'OWNER',
  EXECUTIVE = 'EXECUTIVE',
  MANAGER = 'MANAGER',
  ASSISTANT_MANAGER = 'ASSISTANT_MANAGER',
  ASSOCIATE_MANAGER = 'ASSOCIATE_MANAGER',
  SUPERVISOR = 'SUPERVISOR',
  OPERATOR = 'OPERATOR',
  OFFICER = 'OFFICER',

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

  // Specialized Designations for Rubber & Tyre
  RUBBER_COMPOUNDING_MANAGER = 'RUBBER_COMPOUNDING_MANAGER',
  EXTRUSION_CALENDERING_MANAGER = 'EXTRUSION_CALENDERING_MANAGER',
  TYRE_BUILDING_MANAGER = 'TYRE_BUILDING_MANAGER',
  CURING_VULCANIZATION_MANAGER = 'CURING_VULCANIZATION_MANAGER',
  TYRE_TESTING_UNIFORMITY_MANAGER = 'TYRE_TESTING_UNIFORMITY_MANAGER',

  // Specialized Designations for Pipes
  EXTRUSION_LINE_OPERATIONS_MANAGER = 'EXTRUSION_LINE_OPERATIONS_MANAGER',
  WALL_THICKNESS_QUALITY_INCHARGE = 'WALL_THICKNESS_QUALITY_INCHARGE',
  HYDROSTATIC_BURST_TESTING_MANAGER = 'HYDROSTATIC_BURST_TESTING_MANAGER',
  SOCKETING_BELLING_JOINTING_MANAGER = 'SOCKETING_BELLING_JOINTING_MANAGER',
  PVC_DRY_BLEND_REGRIND_MANAGER = 'PVC_DRY_BLEND_REGRIND_MANAGER',

  // Specialized Designations for Automobiles (Engineering, Machinery and Electronics)
  JIT_JIS_SUPPLY_CHAIN_MANAGER = 'JIT_JIS_SUPPLY_CHAIN_MANAGER',
  PRESS_SHOP_BIW_MANAGER = 'PRESS_SHOP_BIW_MANAGER',
  VEHICLE_ASSEMBLY_MANAGER = 'VEHICLE_ASSEMBLY_MANAGER',
  PAINT_SHOP_ANTI_CORROSION_MANAGER = 'PAINT_SHOP_ANTI_CORROSION_MANAGER',
  EOL_TESTING_VIN_MANAGER = 'EOL_TESTING_VIN_MANAGER',

  // Specialized Designations for Electronical (Engineering, Machinery and Electronics)
  SMT_PCB_ASSEMBLY_MANAGER = 'SMT_PCB_ASSEMBLY_MANAGER',
  ELECTRICAL_TESTING_CALIBRATION_MANAGER = 'ELECTRICAL_TESTING_CALIBRATION_MANAGER',
  FIRMWARE_FLASHING_MANAGER = 'FIRMWARE_FLASHING_MANAGER',
  COMPONENT_OBSOLESCENCE_EBOM_MANAGER = 'COMPONENT_OBSOLESCENCE_EBOM_MANAGER',
  ESD_CLEANROOM_COMPLIANCE_MANAGER = 'ESD_CLEANROOM_COMPLIANCE_MANAGER',

  // Specialized Designations for Electric Equipment (Engineering, Machinery and Electronics)
  WINDING_COIL_FABRICATION_MANAGER = 'WINDING_COIL_FABRICATION_MANAGER',
  CORE_ASSEMBLY_LAMINATION_MANAGER = 'CORE_ASSEMBLY_LAMINATION_MANAGER',
  VPI_INSULATION_MANAGER = 'VPI_INSULATION_MANAGER',
  HV_ROUTINE_TESTING_MANAGER = 'HV_ROUTINE_TESTING_MANAGER',
  BUSBAR_FABRICATION_ENCLOSURE_MANAGER = 'BUSBAR_FABRICATION_ENCLOSURE_MANAGER',

  // Specialized Designations for Cable Wire (Engineering, Machinery and Electronics)
  WIRE_DRAWING_ANNEALING_MANAGER = 'WIRE_DRAWING_ANNEALING_MANAGER',
  BUNCHING_STRANDING_MANAGER = 'BUNCHING_STRANDING_MANAGER',
  INSULATION_SHEATHING_MANAGER = 'INSULATION_SHEATHING_MANAGER',
  ARMOURING_BEDDING_MANAGER = 'ARMOURING_BEDDING_MANAGER',
  HV_SPARK_TESTING_QA_MANAGER = 'HV_SPARK_TESTING_QA_MANAGER',

  // Specialized Designations for Textiles (Consumer Goods)
  SPINNING_YARN_MANAGER = 'SPINNING_YARN_MANAGER',
  WEAVING_KNITTING_MANAGER = 'WEAVING_KNITTING_MANAGER',
  DYEING_PROCESS_MANAGER = 'DYEING_PROCESS_MANAGER',
  GARMENTING_FINISHING_MANAGER = 'GARMENTING_FINISHING_MANAGER',
  FABRIC_QUALITY_INSPECTION_MANAGER = 'FABRIC_QUALITY_INSPECTION_MANAGER',

  // Specialized Designations for Jewellery (Consumer Goods)
  BULLION_VAULT_SECURITY_MANAGER = 'BULLION_VAULT_SECURITY_MANAGER',
  CAD_CAM_PROTOTYPING_MANAGER = 'CAD_CAM_PROTOTYPING_MANAGER',
  CASTING_MELTING_MANAGER = 'CASTING_MELTING_MANAGER',
  GOLDSMITH_KARIGAR_MANAGER = 'GOLDSMITH_KARIGAR_MANAGER',
  GEMSTONE_HALLMARKING_QC_MANAGER = 'GEMSTONE_HALLMARKING_QC_MANAGER',

  // Specialized Designations for Leather (Consumer Goods)
  HIDE_WETBLUE_MANAGER = 'HIDE_WETBLUE_MANAGER',
  RETANNING_DYEING_CRUST_MANAGER = 'RETANNING_DYEING_CRUST_MANAGER',
  SPLITTING_SHAVING_CALIBRATION_MANAGER = 'SPLITTING_SHAVING_CALIBRATION_MANAGER',
  FINISHING_BUFFING_EMBOSSING_MANAGER = 'FINISHING_BUFFING_EMBOSSING_MANAGER',
  LEATHER_QC_AREA_MEASUREMENT_MANAGER = 'LEATHER_QC_AREA_MEASUREMENT_MANAGER',

  // Specialized Designations for Furniture (Consumer Goods)
  TIMBER_SEASONING_KILN_MANAGER = 'TIMBER_SEASONING_KILN_MANAGER',
  DIMENSION_MILL_CNC_MANAGER = 'DIMENSION_MILL_CNC_MANAGER',
  UPHOLSTERY_FOAM_CUTTING_MANAGER = 'UPHOLSTERY_FOAM_CUTTING_MANAGER',
  SANDING_FINISHING_POLISHING_MANAGER = 'SANDING_FINISHING_POLISHING_MANAGER',
  KD_PACKAGING_HARDWARE_KITTING_MANAGER = 'KD_PACKAGING_HARDWARE_KITTING_MANAGER',

  // Specialized Designations for Dairy Products (Food Manufacturing)
  MILK_COLLECTION_RECEPTION_MANAGER = 'MILK_COLLECTION_RECEPTION_MANAGER',
  PASTEURIZATION_PROCESSING_MANAGER = 'PASTEURIZATION_PROCESSING_MANAGER',
  FERMENTATION_CULTURE_MANAGER = 'FERMENTATION_CULTURE_MANAGER',
  QA_MBRT_ANTIBIOTIC_INCHARGE = 'QA_MBRT_ANTIBIOTIC_INCHARGE',
  COLD_CHAIN_EXPIRY_MANAGER = 'COLD_CHAIN_EXPIRY_MANAGER',
}

export enum Role {
  // Executive Leadership (Strictly company-level multi-tenant scope)
  SUPER_ADMIN = 'SUPER_ADMIN',
  CEO = 'CEO',
  MD = 'MD',
  OWNER = 'OWNER',
  EXECUTIVE = 'EXECUTIVE',

  // Common Company Tenant Roles (Independent and isolated per company)
  PRODUCTION = 'PRODUCTION',
  QUALITY = 'QUALITY',
  INVENTORY = 'INVENTORY',
  PROCUREMENT = 'PROCUREMENT',
  SALES = 'SALES',
  FINANCE = 'FINANCE',
  HR = 'HR',
  MACHINE_MAINTENANCE = 'MACHINE_MAINTENANCE',
  LOGISTICS = 'LOGISTICS',
  GATE_SECURITY = 'GATE_SECURITY',
  SECURITY = 'SECURITY',
  PACKING = 'PACKING',

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

  // Gate Security
  GATE_SECURITY_MANAGER = 'GATE_SECURITY_MANAGER',
  GATE_SECURITY_ASSISTANT_MANAGER = 'GATE_SECURITY_ASSISTANT_MANAGER',
  GATE_SECURITY_ASSOCIATE_MANAGER = 'GATE_SECURITY_ASSOCIATE_MANAGER',

  // HR
  HR_MANAGER = 'HR_MANAGER',
  HR_ASSISTANT_MANAGER = 'HR_ASSISTANT_MANAGER',
  HR_ASSOCIATE_MANAGER = 'HR_ASSOCIATE_MANAGER',

  // Sales
  SALES_MANAGER = 'SALES_MANAGER',
  SALES_ASSISTANT_MANAGER = 'SALES_ASSISTANT_MANAGER',
  SALES_ASSOCIATE_MANAGER = 'SALES_ASSOCIATE_MANAGER',

  // Finance
  FINANCE_MANAGER = 'FINANCE_MANAGER',
  FINANCE_ASSISTANT_MANAGER = 'FINANCE_ASSISTANT_MANAGER',
  FINANCE_ASSOCIATE_MANAGER = 'FINANCE_ASSOCIATE_MANAGER',

  // Machine Maintenance
  MACHINE_MAINTENANCE_MANAGER = 'MACHINE_MAINTENANCE_MANAGER',
  MACHINE_MAINTENANCE_ASSISTANT_MANAGER = 'MACHINE_MAINTENANCE_ASSISTANT_MANAGER',
  MACHINE_MAINTENANCE_ASSOCIATE_MANAGER = 'MACHINE_MAINTENANCE_ASSOCIATE_MANAGER',

  // Purchasing & Sourcing
  PURCHASING_SOURCING_MANAGER = 'PURCHASING_SOURCING_MANAGER',
  PURCHASING_SOURCING_ASSISTANT_MANAGER = 'PURCHASING_SOURCING_ASSISTANT_MANAGER',
  PURCHASING_SOURCING_ASSOCIATE_MANAGER = 'PURCHASING_SOURCING_ASSOCIATE_MANAGER',

  // Procurement
  PROCUREMENT_MANAGER = 'PROCUREMENT_MANAGER',
  PROCUREMENT_ASSISTANT_MANAGER = 'PROCUREMENT_ASSISTANT_MANAGER',
  PROCUREMENT_ASSOCIATE_MANAGER = 'PROCUREMENT_ASSOCIATE_MANAGER',

  // Logistics
  LOGISTICS_MANAGER = 'LOGISTICS_MANAGER',
  LOGISTICS_ASSISTANT_MANAGER = 'LOGISTICS_ASSISTANT_MANAGER',
  LOGISTICS_ASSOCIATE_MANAGER = 'LOGISTICS_ASSOCIATE_MANAGER',

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

  // Specialized Roles (Process & Chemical Industries - Rubber & Tyre Sub-Category)
  RUBBER_COMPOUNDING_MANAGER = 'RUBBER_COMPOUNDING_MANAGER',
  EXTRUSION_CALENDERING_MANAGER = 'EXTRUSION_CALENDERING_MANAGER',
  TYRE_BUILDING_MANAGER = 'TYRE_BUILDING_MANAGER',
  CURING_VULCANIZATION_MANAGER = 'CURING_VULCANIZATION_MANAGER',
  TYRE_TESTING_UNIFORMITY_MANAGER = 'TYRE_TESTING_UNIFORMITY_MANAGER',

  // Specialized Roles (Chemical Industries - Pipes Sub-Category)
  EXTRUSION_LINE_OPERATIONS_MANAGER = 'EXTRUSION_LINE_OPERATIONS_MANAGER',
  WALL_THICKNESS_QUALITY_INCHARGE = 'WALL_THICKNESS_QUALITY_INCHARGE',
  HYDROSTATIC_BURST_TESTING_MANAGER = 'HYDROSTATIC_BURST_TESTING_MANAGER',
  SOCKETING_BELLING_JOINTING_MANAGER = 'SOCKETING_BELLING_JOINTING_MANAGER',
  PVC_DRY_BLEND_REGRIND_MANAGER = 'PVC_DRY_BLEND_REGRIND_MANAGER',

  // Specialized Roles (Engineering, Machinery and Electronics - Automobiles Sub-Category)
  JIT_JIS_SUPPLY_CHAIN_MANAGER = 'JIT_JIS_SUPPLY_CHAIN_MANAGER',
  PRESS_SHOP_BIW_MANAGER = 'PRESS_SHOP_BIW_MANAGER',
  VEHICLE_ASSEMBLY_MANAGER = 'VEHICLE_ASSEMBLY_MANAGER',
  PAINT_SHOP_ANTI_CORROSION_MANAGER = 'PAINT_SHOP_ANTI_CORROSION_MANAGER',
  EOL_TESTING_VIN_MANAGER = 'EOL_TESTING_VIN_MANAGER',

  // Specialized Roles (Engineering, Machinery and Electronics - Electronical Sub-Category)
  SMT_PCB_ASSEMBLY_MANAGER = 'SMT_PCB_ASSEMBLY_MANAGER',
  ELECTRICAL_TESTING_CALIBRATION_MANAGER = 'ELECTRICAL_TESTING_CALIBRATION_MANAGER',
  FIRMWARE_FLASHING_MANAGER = 'FIRMWARE_FLASHING_MANAGER',
  COMPONENT_OBSOLESCENCE_EBOM_MANAGER = 'COMPONENT_OBSOLESCENCE_EBOM_MANAGER',
  ESD_CLEANROOM_COMPLIANCE_MANAGER = 'ESD_CLEANROOM_COMPLIANCE_MANAGER',

  // Specialized Roles (Engineering, Machinery and Electronics - Electric Equipment Sub-Category)
  WINDING_COIL_FABRICATION_MANAGER = 'WINDING_COIL_FABRICATION_MANAGER',
  CORE_ASSEMBLY_LAMINATION_MANAGER = 'CORE_ASSEMBLY_LAMINATION_MANAGER',
  VPI_INSULATION_MANAGER = 'VPI_INSULATION_MANAGER',
  HV_ROUTINE_TESTING_MANAGER = 'HV_ROUTINE_TESTING_MANAGER',
  BUSBAR_FABRICATION_ENCLOSURE_MANAGER = 'BUSBAR_FABRICATION_ENCLOSURE_MANAGER',

  // Specialized Roles (Engineering, Machinery and Electronics - Cable Wire Sub-Category)
  WIRE_DRAWING_ANNEALING_MANAGER = 'WIRE_DRAWING_ANNEALING_MANAGER',
  BUNCHING_STRANDING_MANAGER = 'BUNCHING_STRANDING_MANAGER',
  INSULATION_SHEATHING_MANAGER = 'INSULATION_SHEATHING_MANAGER',
  ARMOURING_BEDDING_MANAGER = 'ARMOURING_BEDDING_MANAGER',
  HV_SPARK_TESTING_QA_MANAGER = 'HV_SPARK_TESTING_QA_MANAGER',

  // Specialized Roles (Consumer Goods - Textiles Sub-Category)
  SPINNING_YARN_MANAGER = 'SPINNING_YARN_MANAGER',
  WEAVING_KNITTING_MANAGER = 'WEAVING_KNITTING_MANAGER',
  DYEING_PROCESS_MANAGER = 'DYEING_PROCESS_MANAGER',
  GARMENTING_FINISHING_MANAGER = 'GARMENTING_FINISHING_MANAGER',
  FABRIC_QUALITY_INSPECTION_MANAGER = 'FABRIC_QUALITY_INSPECTION_MANAGER',

  // Specialized Roles (Consumer Goods - Jewellery Sub-Category)
  BULLION_VAULT_SECURITY_MANAGER = 'BULLION_VAULT_SECURITY_MANAGER',
  CAD_CAM_PROTOTYPING_MANAGER = 'CAD_CAM_PROTOTYPING_MANAGER',
  CASTING_MELTING_MANAGER = 'CASTING_MELTING_MANAGER',
  GOLDSMITH_KARIGAR_MANAGER = 'GOLDSMITH_KARIGAR_MANAGER',
  GEMSTONE_HALLMARKING_QC_MANAGER = 'GEMSTONE_HALLMARKING_QC_MANAGER',

  // Specialized Roles (Consumer Goods - Leather Sub-Category)
  HIDE_WETBLUE_MANAGER = 'HIDE_WETBLUE_MANAGER',
  RETANNING_DYEING_CRUST_MANAGER = 'RETANNING_DYEING_CRUST_MANAGER',
  SPLITTING_SHAVING_CALIBRATION_MANAGER = 'SPLITTING_SHAVING_CALIBRATION_MANAGER',
  FINISHING_BUFFING_EMBOSSING_MANAGER = 'FINISHING_BUFFING_EMBOSSING_MANAGER',
  LEATHER_QC_AREA_MEASUREMENT_MANAGER = 'LEATHER_QC_AREA_MEASUREMENT_MANAGER',

  // Specialized Roles (Consumer Goods - Furniture Sub-Category)
  TIMBER_SEASONING_KILN_MANAGER = 'TIMBER_SEASONING_KILN_MANAGER',
  DIMENSION_MILL_CNC_MANAGER = 'DIMENSION_MILL_CNC_MANAGER',
  UPHOLSTERY_FOAM_CUTTING_MANAGER = 'UPHOLSTERY_FOAM_CUTTING_MANAGER',
  SANDING_FINISHING_POLISHING_MANAGER = 'SANDING_FINISHING_POLISHING_MANAGER',
  KD_PACKAGING_HARDWARE_KITTING_MANAGER = 'KD_PACKAGING_HARDWARE_KITTING_MANAGER',

  // Specialized Roles (Food Manufacturing - Dairy Products Sub-Category)
  MILK_COLLECTION_RECEPTION_MANAGER = 'MILK_COLLECTION_RECEPTION_MANAGER',
  PASTEURIZATION_PROCESSING_MANAGER = 'PASTEURIZATION_PROCESSING_MANAGER',
  FERMENTATION_CULTURE_MANAGER = 'FERMENTATION_CULTURE_MANAGER',
  QA_MBRT_ANTIBIOTIC_INCHARGE = 'QA_MBRT_ANTIBIOTIC_INCHARGE',
  COLD_CHAIN_EXPIRY_MANAGER = 'COLD_CHAIN_EXPIRY_MANAGER',
}

export const EXECUTIVE_ROLES: Role[] = [
  Role.SUPER_ADMIN,
  Role.CEO,
  Role.MD,
  Role.OWNER,
  Role.EXECUTIVE,
];

/**
 * Common roles that exist independently per registered company.
 * Every company has its own isolated instance of these roles (Multi-Tenancy).
 */
export const COMMON_TENANT_ROLES: Role[] = [
  Role.SUPER_ADMIN,
  Role.EXECUTIVE,
  Role.CEO,
  Role.MD,
  Role.OWNER,
  Role.PRODUCTION,
  Role.PRODUCTION_MANAGER,
  Role.QUALITY,
  Role.QUALITY_MANAGER,
  Role.INVENTORY,
  Role.INVENTORY_MANAGER,
  Role.PROCUREMENT,
  Role.PROCUREMENT_MANAGER,
  Role.SALES,
  Role.SALES_MANAGER,
  Role.FINANCE,
  Role.FINANCE_MANAGER,
  Role.HR,
  Role.HR_MANAGER,
  Role.MACHINE_MAINTENANCE,
  Role.MACHINE_MAINTENANCE_MANAGER,
  Role.LOGISTICS,
  Role.LOGISTICS_MANAGER,
  Role.GATE_SECURITY,
  Role.GATE_SECURITY_MANAGER,
  Role.SECURITY,
  Role.SECURITY_MANAGER,
];

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

export const RUBBER_SPECIALIZED_ROLES: Role[] = [
  Role.RUBBER_COMPOUNDING_MANAGER,
  Role.EXTRUSION_CALENDERING_MANAGER,
  Role.TYRE_BUILDING_MANAGER,
  Role.CURING_VULCANIZATION_MANAGER,
  Role.TYRE_TESTING_UNIFORMITY_MANAGER,
];

export const PIPES_SPECIALIZED_ROLES: Role[] = [
  Role.EXTRUSION_LINE_OPERATIONS_MANAGER,
  Role.WALL_THICKNESS_QUALITY_INCHARGE,
  Role.HYDROSTATIC_BURST_TESTING_MANAGER,
  Role.SOCKETING_BELLING_JOINTING_MANAGER,
  Role.PVC_DRY_BLEND_REGRIND_MANAGER,
];

export const AUTOMOBILE_SPECIALIZED_ROLES: Role[] = [
  Role.JIT_JIS_SUPPLY_CHAIN_MANAGER,
  Role.PRESS_SHOP_BIW_MANAGER,
  Role.VEHICLE_ASSEMBLY_MANAGER,
  Role.PAINT_SHOP_ANTI_CORROSION_MANAGER,
  Role.EOL_TESTING_VIN_MANAGER,
];

export const ELECTRONICAL_SPECIALIZED_ROLES: Role[] = [
  Role.SMT_PCB_ASSEMBLY_MANAGER,
  Role.ELECTRICAL_TESTING_CALIBRATION_MANAGER,
  Role.FIRMWARE_FLASHING_MANAGER,
  Role.COMPONENT_OBSOLESCENCE_EBOM_MANAGER,
  Role.ESD_CLEANROOM_COMPLIANCE_MANAGER,
];

export const ELECTRIC_EQUIPMENT_SPECIALIZED_ROLES: Role[] = [
  Role.WINDING_COIL_FABRICATION_MANAGER,
  Role.CORE_ASSEMBLY_LAMINATION_MANAGER,
  Role.VPI_INSULATION_MANAGER,
  Role.HV_ROUTINE_TESTING_MANAGER,
  Role.BUSBAR_FABRICATION_ENCLOSURE_MANAGER,
];

export const CABLE_WIRE_SPECIALIZED_ROLES: Role[] = [
  Role.WIRE_DRAWING_ANNEALING_MANAGER,
  Role.BUNCHING_STRANDING_MANAGER,
  Role.INSULATION_SHEATHING_MANAGER,
  Role.ARMOURING_BEDDING_MANAGER,
  Role.HV_SPARK_TESTING_QA_MANAGER,
];

export const TEXTILES_SPECIALIZED_ROLES: Role[] = [
  Role.SPINNING_YARN_MANAGER,
  Role.WEAVING_KNITTING_MANAGER,
  Role.DYEING_PROCESS_MANAGER,
  Role.GARMENTING_FINISHING_MANAGER,
  Role.FABRIC_QUALITY_INSPECTION_MANAGER,
];

export const JEWELLERY_SPECIALIZED_ROLES: Role[] = [
  Role.BULLION_VAULT_SECURITY_MANAGER,
  Role.CAD_CAM_PROTOTYPING_MANAGER,
  Role.CASTING_MELTING_MANAGER,
  Role.GOLDSMITH_KARIGAR_MANAGER,
  Role.GEMSTONE_HALLMARKING_QC_MANAGER,
];

export const LEATHER_SPECIALIZED_ROLES: Role[] = [
  Role.HIDE_WETBLUE_MANAGER,
  Role.RETANNING_DYEING_CRUST_MANAGER,
  Role.SPLITTING_SHAVING_CALIBRATION_MANAGER,
  Role.FINISHING_BUFFING_EMBOSSING_MANAGER,
  Role.LEATHER_QC_AREA_MEASUREMENT_MANAGER,
];

export const FURNITURE_SPECIALIZED_ROLES: Role[] = [
  Role.TIMBER_SEASONING_KILN_MANAGER,
  Role.DIMENSION_MILL_CNC_MANAGER,
  Role.UPHOLSTERY_FOAM_CUTTING_MANAGER,
  Role.SANDING_FINISHING_POLISHING_MANAGER,
  Role.KD_PACKAGING_HARDWARE_KITTING_MANAGER,
];

export const DAIRY_SPECIALIZED_ROLES: Role[] = [
  Role.MILK_COLLECTION_RECEPTION_MANAGER,
  Role.PASTEURIZATION_PROCESSING_MANAGER,
  Role.FERMENTATION_CULTURE_MANAGER,
  Role.QA_MBRT_ANTIBIOTIC_INCHARGE,
  Role.COLD_CHAIN_EXPIRY_MANAGER,
];

export const ALL_SPECIALIZED_ROLES: Role[] = [
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

export const RUBBER_SPECIALIZED_ROLES_METADATA: SpecializedRoleMeta[] = [
  {
    role: Role.RUBBER_COMPOUNDING_MANAGER,
    designationKey: Designation.RUBBER_COMPOUNDING_MANAGER,
    label: 'Rubber Compounding Manager',
    subCategory: 'Rubber & Tyre',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Multi-stage compounding recipe management (Masterbatch, Remix, Final Mix)',
      'Mooney viscosity tracking (ML 1+4 @ 100°C) & cure rheometer rheology curves',
      'Carbon black dispersion parameter logs (ASTM D7723 / Phillips rating ≥ 95%)',
      'Batch-wise raw material ingredient traceability (Natural Rubber, Synthetic Polymers, Carbon Black, Curatives)',
    ],
    description:
      'Governs Banbury internal mixing lines, validates Mooney viscosity parameters, logs carbon black dispersion scores, and maintains complete ingredient traceability.',
  },
  {
    role: Role.EXTRUSION_CALENDERING_MANAGER,
    designationKey: Designation.EXTRUSION_CALENDERING_MANAGER,
    label: 'Extrusion & Calendering Manager',
    subCategory: 'Rubber & Tyre',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Extrusion die profile & multi-zone barrel temperature monitoring',
      'Steel cord & fabric tension tracking (kN) with laser gauge thickness verification (mm)',
      'Roll stock inventory management, roll weight tracking & shelf-life cooling control',
      'Continuous line speed (mpm) and shrinkage compensation calibration',
    ],
    description:
      'Controls tread/sidewall extrusion lines and 4-roll calender trains, monitors steel cord tension, laser thickness gauges, and roll stock storage.',
  },
  {
    role: Role.TYRE_BUILDING_MANAGER,
    designationKey: Designation.TYRE_BUILDING_MANAGER,
    label: 'Tyre Building Manager',
    subCategory: 'Rubber & Tyre',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Green tire assembly sequence tracking across carcass, belt package, and tread application',
      'Component bill of materials (BOM) management and automated component lot linkage',
      'Green tire work-in-progress (WIP) stock monitoring and dimensional concentricity checks',
      'Building machine recipe synchronization and barcode serialization',
    ],
    description:
      'Supervises unistage and two-stage tyre building machines, enforces component BOM recipes, tracks sub-assembly lots, and monitors green tyre WIP inventory.',
  },
  {
    role: Role.CURING_VULCANIZATION_MANAGER,
    designationKey: Designation.CURING_VULCANIZATION_MANAGER,
    label: 'Curing & Vulcanization Manager',
    subCategory: 'Rubber & Tyre',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Press temperature & pressure PLC log monitoring (Platen temperature, steam dome pressure, internal bladder pressure)',
      'SKU-wise curing time cycle tracking (Seconds) and thermal heat dose calculation',
      'Curing bladder lifecycle management with automated shot counts and failure warnings',
      'Mould segment cleaning intervals and venting pin maintenance schedules',
    ],
    description:
      'Directs curing presses, regulates platen temperatures and bladder pressure curves, tracks curing time cycles, and manages bladder lifecycle replacement thresholds.',
  },
  {
    role: Role.TYRE_TESTING_UNIFORMITY_MANAGER,
    designationKey: Designation.TYRE_TESTING_UNIFORMITY_MANAGER,
    label: 'Tyre Testing & Uniformity Manager',
    subCategory: 'Rubber & Tyre',
    associatedDepartment: Department.QUALITY,
    functions: [
      'Dynamic balancing and uniformity test data recording (Radial/Lateral Runout, RFV, LFV, Conicity)',
      'Unique serial number and DOT code assignment for lifetime product traceability',
      'Tyre grading classification (Prime Grade, B-Grade, Scrap)',
      'Strict unapproved dispatch blocking and automated electronic quality clearance',
    ],
    description:
      'Oversees high-speed dynamic balancing and tyre uniformity machines (TUM), assigns statutory DOT codes, grades tyres into Prime/B-Grade/Scrap, and authorizes warehouse dispatch.',
  },
];

export const PIPES_SPECIALIZED_ROLES_METADATA: SpecializedRoleMeta[] = [
  {
    role: Role.EXTRUSION_LINE_OPERATIONS_MANAGER,
    designationKey: Designation.EXTRUSION_LINE_OPERATIONS_MANAGER,
    label: 'Extrusion Line Operations Manager',
    subCategory: 'Pipes',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Barrel multi-zone temperature monitoring (Zone 1-4, Die head)',
      'Screw RPM & caterpillar haul-off speed synchronization',
      'Per-shift line output tracking (Kg and Meters) & scrap reduction',
      'Machinery run-hour telemetry, melt pressure & vacuum calibration logs',
    ],
    description:
      'Directs continuous plastic pipe extrusion lines, regulates barrel temperature profiles, synchronizes screw RPM with haul-off speeds, and tracks shift production output.',
  },
  {
    role: Role.WALL_THICKNESS_QUALITY_INCHARGE,
    designationKey: Designation.WALL_THICKNESS_QUALITY_INCHARGE,
    label: 'Wall Thickness & Quality In-Charge',
    subCategory: 'Pipes',
    associatedDepartment: Department.QUALITY,
    functions: [
      'Ultrasonic 360° sensor wall thickness data recording (Min, Max, Eccentricity %)',
      'Outer diameter, length tolerance and ovality inspection',
      'Strict non-standard pipe lot blocking gate preventing sub-spec pipes from packaging',
      'In-line scanning calibration and dimensional conformance certification',
    ],
    description:
      'Supervises ultrasonic wall thickness monitoring sensors, checks pipe ovality and eccentricity, and strictly blocks non-conforming pipe batches from proceeding to packaging.',
  },
  {
    role: Role.HYDROSTATIC_BURST_TESTING_MANAGER,
    designationKey: Designation.HYDROSTATIC_BURST_TESTING_MANAGER,
    label: 'Hydrostatic & Burst Testing Manager',
    subCategory: 'Pipes',
    associatedDepartment: Department.QUALITY,
    functions: [
      'Burst pressure & short/long-term hydrostatic pressure test logging',
      'Water bath temperature control (20°C and 80°C endurance testing)',
      'Destructive test log management, hoop stress calculation & failure mode analysis',
      'Pressure rating compliance certificate issuance (PN6, PN10, PN16, SDR compliance)',
    ],
    description:
      'Directs hydrostatic burst and long-term endurance test stations, records hoop stress resistance, issues pressure compliance certificates, and documents failure modes.',
  },
  {
    role: Role.SOCKETING_BELLING_JOINTING_MANAGER,
    designationKey: Designation.SOCKETING_BELLING_JOINTING_MANAGER,
    label: 'Socketing, Belling & Jointing Manager',
    subCategory: 'Pipes',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Belling & socketing machine heating/forming/cooling cycle tracking',
      'Rubber sealing ring inventory management (EPDM, SBR, NBR lip seals)',
      'Socket inner diameter, depth and seal ring groove retention verification',
      'Thermal re-heat defect monitoring and socket trim optimization',
    ],
    description:
      'Manages automated pipe belling and socket forming machines, controls heating/cooling cycle times, validates elastomeric ring groove dimensions, and manages rubber seal stock.',
  },
  {
    role: Role.PVC_DRY_BLEND_REGRIND_MANAGER,
    designationKey: Designation.PVC_DRY_BLEND_REGRIND_MANAGER,
    label: 'PVC Dry Blend & Regrind Manager',
    subCategory: 'Pipes',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Dry blend weighing recipe formulation (PVC resin, One-pack stabilizers, CaCO3, Impact modifiers)',
      'Stabilizer and additive dosing ratio tracking with temperature rise verification',
      'Production BOM virgin-to-regrind blending percentage regulation',
      'Automated safety interlock blocking batches exceeding max permitted regrind ceiling (25%)',
    ],
    description:
      'Oversees high-speed and cooler dry blend mixing, manages chemical stabilizer recipes, and strictly enforces BOM virgin-to-regrind blend ratios to guarantee pipe tensile strength.',
  },
];

export const AUTOMOBILE_SPECIALIZED_ROLES_METADATA: SpecializedRoleMeta[] = [
  {
    role: Role.JIT_JIS_SUPPLY_CHAIN_MANAGER,
    designationKey: Designation.JIT_JIS_SUPPLY_CHAIN_MANAGER,
    label: 'JIT / JIS Supply Chain Manager',
    subCategory: 'Automobiles',
    associatedDepartment: Department.INVENTORY,
    functions: [
      'Electronic Kanban signal management & line-side buffer inventory replenishment',
      'Direct-to-line vendor delivery schedule coordination with dock appointment orchestration',
      'Just-in-Sequence (JIS) delivery sequence accuracy tracking for chassis, cockpit & door modules',
      'Vehicle build order pull-signal trigger handling synchronized with main assembly conveyer',
    ],
    description:
      'Coordinates Just-in-Time and Just-in-Sequence replenishment signals, monitors supplier direct-to-line delivery punctuality, and handles vehicle build order pull triggers.',
  },
  {
    role: Role.PRESS_SHOP_BIW_MANAGER,
    designationKey: Designation.PRESS_SHOP_BIW_MANAGER,
    label: 'Press Shop & BIW Manager',
    subCategory: 'Automobiles',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Stamping die changeover monitoring & SMED changeover duration tracking',
      'Press stroke count tracking and cumulative die lifecycle management',
      'Sheet metal coil/blank inventory management (DP600, CR4, aluminum alloys)',
      'Weld quality inspection log recording (spot weld ultrasonic test, destructive tear-down, surface dent checks)',
    ],
    description:
      'Oversees tandem stamping lines and Body-in-White (BIW) robotic welding cells, tracks die stroke counts, ensures blank sheet traceability, and audits weld spot integrity.',
  },
  {
    role: Role.VEHICLE_ASSEMBLY_MANAGER,
    designationKey: Designation.VEHICLE_ASSEMBLY_MANAGER,
    label: 'Vehicle Assembly (TCF) Manager',
    subCategory: 'Automobiles',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Work-in-progress (WIP) tracking across assembly stations (Trim, Chassis, Final - TCF lines)',
      'Station-wise cycle time and takt time variance management (e.g. 72-second line takt)',
      'Sub-assembly sequencing (engine, transmission, high-voltage battery pack, front/rear axles)',
      'Daily shift vehicle output target monitoring and line bottleneck resolution',
    ],
    description:
      'Directs the vehicle Trim, Chassis, and Final (TCF) assembly line, synchronizes powertrain and chassis marriage, tracks takt time adherence, and balances assembly station cycle times.',
  },
  {
    role: Role.PAINT_SHOP_ANTI_CORROSION_MANAGER,
    designationKey: Designation.PAINT_SHOP_ANTI_CORROSION_MANAGER,
    label: 'Paint Shop & Anti-Corrosion Manager',
    subCategory: 'Automobiles',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Electrodeposition (ED / CED) dip-tank chemical concentration monitoring (solids %, pH, conductivity, bath temperature)',
      'Automated paint booth temperature (°C) and relative humidity (%) regulation',
      'Color-change sequencing management and paint purge solvent waste reduction',
      'Oven curing zone temperature telemetry logging and anti-corrosion warranty certification',
    ],
    description:
      'Supervises cathodic electrodeposition dip tanks, primer, basecoat and clearcoat robotic booths, logs bake oven temperature curves, and certifies anti-corrosion film specs.',
  },
  {
    role: Role.EOL_TESTING_VIN_MANAGER,
    designationKey: Designation.EOL_TESTING_VIN_MANAGER,
    label: 'EOL Testing & VIN Manager',
    subCategory: 'Automobiles',
    associatedDepartment: Department.QUALITY,
    functions: [
      'End-of-Line (EOL) dynamic test data recording (wheel alignment, dyno roll speed, brake deceleration, ADAS sensor calibration, monsoon water shower)',
      'Unique 17-character VIN (Vehicle Identification Number) assignment and ECU firmware flashing validation',
      'Critical component serial tracking (engine/motor, traction battery, gearbox, axles) for statutory traceability',
      'Electronic Gate-Pass clearance issuance for finished vehicle rollout to transit yards',
    ],
    description:
      'Governs end-of-line vehicle quality sign-off, assigns tamper-proof 17-character VINs, validates statutory serial component traceability, and authorizes vehicle Gate Passes.',
  },
];

export const ELECTRONICAL_SPECIALIZED_ROLES_METADATA: SpecializedRoleMeta[] = [
  {
    role: Role.SMT_PCB_ASSEMBLY_MANAGER,
    designationKey: Designation.SMT_PCB_ASSEMBLY_MANAGER,
    label: 'SMT & PCB Assembly Manager',
    subCategory: 'Electronical',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'SMT feeder placement list management & feeder slot verification',
      'Component reel lot number tracking & barcode traceability',
      'Reflow oven multi-zone temperature profile log monitoring (°C)',
      'Daily PCB production output control & pick-and-place yield tracking',
    ],
    description:
      'Governs high-speed SMT pick-and-place lines, monitors feeder setup sheets, verifies component reels, tracks reflow solder profiles, and directs daily PCB assembly throughput.',
  },
  {
    role: Role.ELECTRICAL_TESTING_CALIBRATION_MANAGER,
    designationKey: Designation.ELECTRICAL_TESTING_CALIBRATION_MANAGER,
    label: 'Electrical Testing & Calibration Manager',
    subCategory: 'Electronical',
    associatedDepartment: Department.QUALITY,
    functions: [
      'Automated test rig result recording (in-circuit test ICT & functional test FCT)',
      'Uncalibrated test instrument blocking & statutory calibration expiry locks',
      'Pass/fail defect log management & component failure root-cause logging',
      'Electronic test clearance certificate issuance & batch dispatch clearance',
    ],
    description:
      'Supervises ICT/FCT automated test rigs, prevents usage of out-of-calibration equipment, verifies RF/signal parameters, and issues electronic compliance certificates.',
  },
  {
    role: Role.FIRMWARE_FLASHING_MANAGER,
    designationKey: Designation.FIRMWARE_FLASHING_MANAGER,
    label: 'Firmware Flashing Manager',
    subCategory: 'Electronical',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Firmware version master data management & secure binary checksum hashing',
      'Programming station API integration with ERP manufacturing work orders',
      'Strict 1-to-1 device serial number to flashed firmware version mapping',
      'Secure boot key provisioning & flashed firmware integrity verification',
    ],
    description:
      'Manages embedded software binary releases, integrates gang-programmer stations with ERP orders, and secures 1-to-1 device serialization.',
  },
  {
    role: Role.COMPONENT_OBSOLESCENCE_EBOM_MANAGER,
    designationKey: Designation.COMPONENT_OBSOLESCENCE_EBOM_MANAGER,
    label: 'Component Obsolescence & EBOM Manager',
    subCategory: 'Electronical',
    associatedDepartment: Department.INVENTORY,
    functions: [
      'Electronic component lifecycle status monitoring (Active, NRND, EOL, Obsolete)',
      'Substitute component master list updates & pin-to-pin alternative approvals',
      'Engineering Change Orders (ECO) handling & EBOM version revisions',
      'Vendor component lead time management & semiconductor shortage forecasting',
    ],
    description:
      'Monitors silicon lifecycle stages, maintains approved manufacturer lists (AML), administers ECO changes on EBOMs, and mitigates component shortages.',
  },
  {
    role: Role.ESD_CLEANROOM_COMPLIANCE_MANAGER,
    designationKey: Designation.ESD_CLEANROOM_COMPLIANCE_MANAGER,
    label: 'ESD & Cleanroom Compliance Manager',
    subCategory: 'Electronical',
    associatedDepartment: Department.SECURITY,
    functions: [
      'Daily ESD workstation compliance audit logging (wrist straps, continuous monitors)',
      'Grounding resistance test result tracking (ANSI/ESD S20.20 thresholds)',
      'Cleanroom environment sensor log monitoring (ISO 14644 particles, temp, humidity)',
      'ESD-safe packaging material inventory oversight & shielding bag integrity',
    ],
    description:
      'Enforces electrostatic discharge (ESD) standards across assembly bays, verifies cleanroom air classification, and certifies anti-static packaging.',
  },
];

export const ELECTRIC_EQUIPMENT_SPECIALIZED_ROLES_METADATA: SpecializedRoleMeta[] = [
  {
    role: Role.WINDING_COIL_FABRICATION_MANAGER,
    designationKey: Designation.WINDING_COIL_FABRICATION_MANAGER,
    label: 'Winding & Coil Fabrication Manager',
    subCategory: 'Electric Equipment',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Coil winding BOM management (high-voltage & low-voltage coil design specifications)',
      'Conductor weight consumption tracking (copper/aluminum magnet wire & rectangular strips)',
      'Winding machine counter log monitoring & turns ratio verification',
      'Inter-turn insulation test data recording & high-frequency surge comparison testing',
    ],
    description:
      'Directs coil winding bays for transformers and motors, monitors CNC turns counters, tracks copper/aluminum conductor weights, and verifies inter-turn surge insulation integrity.',
  },
  {
    role: Role.CORE_ASSEMBLY_LAMINATION_MANAGER,
    designationKey: Designation.CORE_ASSEMBLY_LAMINATION_MANAGER,
    label: 'Core Assembly & Lamination Manager',
    subCategory: 'Electric Equipment',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'CRGO electrical sheet inventory & slitting dimension precision tracking',
      'Core stacking schedule management & multi-step mitered lap joint assembly',
      'Core assembly weight & tie-rod clamping torque recording (Nm)',
      'No-load loss test metric logging & core excitation watt/kg verification',
    ],
    description:
      'Supervises cold-rolled grain-oriented (CRGO) steel slitting, mitered core stacking patterns, clamping torque verification, and magnetic no-load core loss metrics.',
  },
  {
    role: Role.VPI_INSULATION_MANAGER,
    designationKey: Designation.VPI_INSULATION_MANAGER,
    label: 'VPI & Insulation Process Manager',
    subCategory: 'Electric Equipment',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Vacuum Pressure Impregnation (VPI) oven temperature profile & vacuum pressure log monitoring',
      'Resin/varnish bath specific gravity tracking, viscosity checks & solids percentage tests',
      'Drying & polymerization cycle time management per transformer/stator insulation class',
      'Cured winding insulation resistance testing (GigaOhms) & moisture elimination verification',
    ],
    description:
      'Controls autoclave vacuum pressure impregnation chambers, tracks epoxy resin bath specific gravity, regulates curing oven heat curves, and validates insulation resistance.',
  },
  {
    role: Role.HV_ROUTINE_TESTING_MANAGER,
    designationKey: Designation.HV_ROUTINE_TESTING_MANAGER,
    label: 'HV Routine Testing & Certification Manager',
    subCategory: 'Electric Equipment',
    associatedDepartment: Department.QUALITY,
    functions: [
      'Automated high-voltage test rig data recording (power frequency withstand, induced overvoltage)',
      'Testing instrument NABL calibration status verification & statutory expiry lockouts',
      'Uncertified unit blocking from dispatch (interlocked quality gate lockout)',
      'Test & Calibration Certificate auto-generation with partial discharge (pC) metrics',
    ],
    description:
      'Administers high-voltage routine test bays, enforces statutory test instrument calibration locks, strictly blocks non-compliant equipment from dispatch, and issues certified Test Reports.',
  },
  {
    role: Role.BUSBAR_FABRICATION_ENCLOSURE_MANAGER,
    designationKey: Designation.BUSBAR_FABRICATION_ENCLOSURE_MANAGER,
    label: 'Busbar Fabrication & Enclosure Manager',
    subCategory: 'Electric Equipment',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Busbar cut length, punching & CNC bending angle specification tracking',
      'Powder coating inventory management (epoxy-polyester hybrid powder & DFT microns check)',
      'Modular enclosure sub-assembly routing oversight (switchgear cubicles & transformer tanks)',
      'Electrical phase clearance & surface creepage distance verification per IEC standards',
    ],
    description:
      'Oversees busbar bending, modular enclosure fabrication, powder coating dry film thickness (DFT), and verifies statutory phase-to-phase and phase-to-earth electrical clearances.',
  },
];

export const CABLE_WIRE_SPECIALIZED_ROLES_METADATA: SpecializedRoleMeta[] = [
  {
    role: Role.WIRE_DRAWING_ANNEALING_MANAGER,
    designationKey: Designation.WIRE_DRAWING_ANNEALING_MANAGER,
    label: 'Wire Drawing & Annealing Manager',
    subCategory: 'Cable Wire',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Wire elongation ratio tracking',
      'Drawing die inventory & wear monitoring',
      'Weight reduction yield recording',
      'Continuous annealing temperature profile logging',
    ],
    description:
      'Governs rod breakdown and multi-wire drawing lines, monitors PCD drawing die orifice wear, tracks wire elongation percentages, records weight reduction yields, and logs continuous resistance annealing temperatures.',
  },
  {
    role: Role.BUNCHING_STRANDING_MANAGER,
    designationKey: Designation.BUNCHING_STRANDING_MANAGER,
    label: 'Bunching & Stranding Manager',
    subCategory: 'Cable Wire',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Conductor strand combination management',
      'Machine RPM and lay-length parameter tracking',
      'Bobbin/spool allocation scheduling',
      'Copper/aluminium scrap loss monitoring',
    ],
    description:
      'Directs double-twist bunchers and rigid stranders, coordinates strand combinations (7/19/37/61 wire cores), regulates machine RPM and lay pitch ratios, schedules pay-off bobbins, and monitors conductor scrap losses.',
  },
  {
    role: Role.INSULATION_SHEATHING_MANAGER,
    designationKey: Designation.INSULATION_SHEATHING_MANAGER,
    label: 'Insulation & Sheathing Manager',
    subCategory: 'Cable Wire',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Multi-zone barrel temperature monitoring',
      'Compound consumption tracking - PVC/XLPE pellets',
      'Caterpillar haul-off speed control',
      'Online outer diameter - OD laser gauge oversight',
    ],
    description:
      'Controls high-speed extrusion lines for insulation and outer sheathing, monitors multi-zone heating profiles, tracks PVC/XLPE polymer pellet consumption, synchronizes haul-off caterpillars, and oversees online laser diameter gauges.',
  },
  {
    role: Role.ARMOURING_BEDDING_MANAGER,
    designationKey: Designation.ARMOURING_BEDDING_MANAGER,
    label: 'Armouring & Bedding Manager',
    subCategory: 'Cable Wire',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Steel wire/strip reel inventory management',
      'Armouring pitch and tension monitoring',
      'Coverage uniformity inspection',
      'Sub-assembly WIP staging tracking',
    ],
    description:
      'Supervises cage armouring machines, manages round steel wire and galvanized flat strip reel inventories, verifies pitch and pay-off tensions, inspects statutory coverage uniformity (IS 1554 / 7098), and stages sub-assemblies.',
  },
  {
    role: Role.HV_SPARK_TESTING_QA_MANAGER,
    designationKey: Designation.HV_SPARK_TESTING_QA_MANAGER,
    label: 'HV Spark Testing & QA Manager',
    subCategory: 'Cable Wire',
    associatedDepartment: Department.QUALITY,
    functions: [
      'Spark test fault count recording',
      'Conductor DC resistance value logging',
      'Quality clearance certificate issuance',
      'Meter-marking calibration record management',
    ],
    description:
      'Administers high-voltage spark testing QA gates, records fault puncture counts and meter coordinates, verifies conductor DC electrical resistance (IS 8130), certifies meter-marking encoder calibration, and issues final Quality Clearance Certificates.',
  },
];

export const TEXTILES_SPECIALIZED_ROLES_METADATA: SpecializedRoleMeta[] = [
  {
    role: Role.SPINNING_YARN_MANAGER,
    designationKey: Designation.SPINNING_YARN_MANAGER,
    label: 'Spinning & Yarn Production Manager',
    subCategory: 'Textiles',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Fiber blending recipe management',
      'Spindle utilization tracking',
      'Yarn count & lea strength test data logging',
      'Raw material waste - comber noil control',
    ],
    description:
      'Oversees blowroom, carding, combing and ring frame spinning units, manages fiber blend ratios, tracks spindle efficiency, tests yarn count (Ne) & CSP lea strength, and minimizes comber noil waste.',
  },
  {
    role: Role.WEAVING_KNITTING_MANAGER,
    designationKey: Designation.WEAVING_KNITTING_MANAGER,
    label: 'Weaving & Knitting Operations Manager',
    subCategory: 'Textiles',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Beam allocation & warp/weft yarn consumption tracking',
      'Loom speed & stop-time/breakage log monitoring',
      'Greige fabric roll inventory management',
      'Reed space & pick density (EPI/PPI) verification',
    ],
    description:
      'Controls air-jet/rapier weaving looms and circular knitting machinery, balances warp/weft yarn consumption, monitors stop-time & breakage causes, and manages greige roll stock.',
  },
  {
    role: Role.DYEING_PROCESS_MANAGER,
    designationKey: Designation.DYEING_PROCESS_MANAGER,
    label: 'Dyeing & Wet Processing Manager',
    subCategory: 'Textiles',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Dye recipe formulation management',
      'Chemical/dyestuff inventory tracking',
      'Dyeing machine temperature/pressure profile monitoring',
      'Batch shade approval control',
    ],
    description:
      'Formulates reactive/disperse dye recipes, manages dyestuff auxiliary chemicals, regulates high-temperature jet dyeing cycles, and approves batch shade matching under standard D65 illuminants.',
  },
  {
    role: Role.GARMENTING_FINISHING_MANAGER,
    designationKey: Designation.GARMENTING_FINISHING_MANAGER,
    label: 'Garmenting & Finishing Manager',
    subCategory: 'Textiles',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Marker efficiency & fabric nesting management',
      'Line-wise sewing output & WIP tracking',
      'Bundle ticket allocation',
      'Carton packing & barcode labeling oversight',
    ],
    description:
      'Optimizes CAD marker nesting to minimize cutting fabric waste, manages line sewing piece-rate WIP, oversees bundle ticketing, and ensures barcode carton packing compliance for export.',
  },
  {
    role: Role.FABRIC_QUALITY_INSPECTION_MANAGER,
    designationKey: Designation.FABRIC_QUALITY_INSPECTION_MANAGER,
    label: 'Fabric Quality & QA Manager',
    subCategory: 'Textiles',
    associatedDepartment: Department.QUALITY,
    functions: [
      '4-point fabric inspection system defect grading (ASTM D5430)',
      'GSM, tensile tear strength & shrinkage test recording',
      'Color fastness to washing & rub testing verification',
      'Textile quality clearance certificate (CoA) issuance & dispatch gate control',
    ],
    description:
      'Enforces ASTM D5430 4-point inspection standards, validates dimensional shrinkage and GSM specifications, checks wash fastness, and issues official Textile Quality Clearance Certificates.',
  },
];

export const JEWELLERY_SPECIALIZED_ROLES_METADATA: SpecializedRoleMeta[] = [
  {
    role: Role.BULLION_VAULT_SECURITY_MANAGER,
    designationKey: Designation.BULLION_VAULT_SECURITY_MANAGER,
    label: 'Bullion Vault & Security Manager',
    subCategory: 'Jewellery',
    associatedDepartment: Department.SECURITY,
    functions: [
      'Secure vault inventory management',
      'Inward/outward bullion weight tracking - grams/milligrams',
      'Daily metal balance reconciliation',
      'Live metal market rate updates for ERP costing',
    ],
    description:
      'Oversees high-security bullion vaults, logs dual-custody access, records inward gold bars/silver granules with milligram precision, reconciles daily balances, and maintains live metal market rates.',
  },
  {
    role: Role.CAD_CAM_PROTOTYPING_MANAGER,
    designationKey: Designation.CAD_CAM_PROTOTYPING_MANAGER,
    label: 'CAD/CAM & Prototyping Manager',
    subCategory: 'Jewellery',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Digital design library & versioning management',
      '3D printer resin and wax consumption tracking',
      'CAD file allocation to manufacturing orders',
      'Master rubber mold inventory oversight',
    ],
    description:
      'Governs 3D jewelry CAD designs (.3dm/.stl), manages precision SLA/DLP wax & castable resin 3D printing, monitors vulcanized rubber master molds, and links digital designs to production orders.',
  },
  {
    role: Role.CASTING_MELTING_MANAGER,
    designationKey: Designation.CASTING_MELTING_MANAGER,
    label: 'Casting & Melting Operations Manager',
    subCategory: 'Jewellery',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Karatage conversion recipe management - stoichiometry',
      'Melting furnace cycle tracking',
      'Metal input vs output casting weight calculation',
      'Sweepings/scrap dust recovery',
    ],
    description:
      'Controls vacuum pressure induction casting furnaces, formulates 24K to 22K/18K alloy recipes, monitors temperature/pressure curves, calculates casting yields, and audits gold scrap dust recovery.',
  },
  {
    role: Role.GOLDSMITH_KARIGAR_MANAGER,
    designationKey: Designation.GOLDSMITH_KARIGAR_MANAGER,
    label: 'Goldsmith & Karigar Job-Work Manager',
    subCategory: 'Jewellery',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Raw metal and stone issuance to internal/external karigars',
      'Job work challan tracking',
      'Net wastage - Ghath/Touch loss reconciliation',
      'Artisan wage accounting',
    ],
    description:
      'Issues precious metals and gemstones to karigars via job-work challans, oversees handcrafting (Filigree, Meenakari, Jadau, Setting), monitors permissible vs actual Ghath wastage, and computes artisan piece wages.',
  },
  {
    role: Role.GEMSTONE_HALLMARKING_QC_MANAGER,
    designationKey: Designation.GEMSTONE_HALLMARKING_QC_MANAGER,
    label: 'Gemstone & Hallmarking QC Manager',
    subCategory: 'Jewellery',
    associatedDepartment: Department.QUALITY,
    functions: [
      'Diamond/gemstone grading certificate recording',
      'BIS hallmark laser engraving log tracking - HUID',
      'Final product weight and purity verification',
      'Certificate of Authenticity - CoA auto-generation',
    ],
    description:
      'Conducts XRF precious metal spectrometer tests, grades 4C diamond specifications with lab certificates (GIA/IGI), tracks 6-digit BIS Hallmark Unique Identifications (HUID), and auto-generates Certificates of Authenticity.',
  },
];

export const LEATHER_SPECIALIZED_ROLES_METADATA: SpecializedRoleMeta[] = [
  {
    role: Role.HIDE_WETBLUE_MANAGER,
    designationKey: Designation.HIDE_WETBLUE_MANAGER,
    label: 'Raw Hide & Wet-Blue Operations Manager',
    subCategory: 'Leather',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Raw hide grading by weight and size',
      'Chemical recipe dosing in tanning drums',
      'pH level and drum rotation cycle monitoring',
      'Wet-blue lot inventory logging',
    ],
    description:
      'Oversees beamhouse operations, raw hide grading (Cow, Buffalo, Goat, Sheep), chemical dosing in tanning drums, pickling/chrome basification cycles, shrinkage boil testing, and wet-blue lot inventory.',
  },
  {
    role: Role.RETANNING_DYEING_CRUST_MANAGER,
    designationKey: Designation.RETANNING_DYEING_CRUST_MANAGER,
    label: 'Retanning, Dyeing & Crust Manager',
    subCategory: 'Leather',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Leather dye formulation management',
      'Moisture content and soft/firm temper tracking',
      'Drying chamber temperature monitoring',
      'Crust leather batch classification',
    ],
    description:
      'Governs post-tanning retanning and dyeing drums, manages vegetable syntans and fatliquor dosing for target temper, monitors vacuum/toggle drying tunnels, and grades crust leather batches.',
  },
  {
    role: Role.SPLITTING_SHAVING_CALIBRATION_MANAGER,
    designationKey: Designation.SPLITTING_SHAVING_CALIBRATION_MANAGER,
    label: 'Splitting, Shaving & Calibration Manager',
    subCategory: 'Leather',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Splitting and shaving machine blade calibration',
      'Thickness gauge measurement recording across sampling points',
      'Leather shaving waste tracking',
      'Lot segregation by thickness range',
    ],
    description:
      'Controls precision bandknife splitting and shaving machines, calibrates thickness gauge sensors, audits 5-point hide thickness uniformity, tracks shaving waste, and segregates drop splits.',
  },
  {
    role: Role.FINISHING_BUFFING_EMBOSSING_MANAGER,
    designationKey: Designation.FINISHING_BUFFING_EMBOSSING_MANAGER,
    label: 'Finishing, Buffing & Embossing Manager',
    subCategory: 'Leather',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Finishing chemical formulation management',
      'Spray booth parameter tracking',
      'Plate embossing schedules - Croco, Nappa, Pebble grain patterns',
      'Gloss/luster consistency monitoring',
    ],
    description:
      'Manages automated rotary spray finishing carousels, hydraulic embossing presses with heated plates, buffing lines, surface gloss/adhesion testing, and Veslic rub fastness compliance.',
  },
  {
    role: Role.LEATHER_QC_AREA_MEASUREMENT_MANAGER,
    designationKey: Designation.LEATHER_QC_AREA_MEASUREMENT_MANAGER,
    label: 'Leather QC & Area Measurement Manager',
    subCategory: 'Leather',
    associatedDepartment: Department.QUALITY,
    functions: [
      'Pin-wheel or optical area measurement machine operation',
      'Individual leather hide tagging with exact square footage barcodes',
      'Grain defect classification recording',
      'Quality inspection clearance issuance',
    ],
    description:
      'Operates electronic optical hide area scanning machines, generates square footage barcode labels, grades surface cuttable yields, verifies Bally flex resistance, and issues Leather Quality Clearance Certificates.',
  },
];

export const FURNITURE_SPECIALIZED_ROLES_METADATA: SpecializedRoleMeta[] = [
  {
    role: Role.TIMBER_SEASONING_KILN_MANAGER,
    designationKey: Designation.TIMBER_SEASONING_KILN_MANAGER,
    label: 'Timber Seasoning & Kiln Manager',
    subCategory: 'Furniture',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Kiln drying chamber temperature and humidity profile monitoring',
      'Moisture meter reading tracking - green to equilibrium moisture content',
      'Wood shrinkage percentage calculation - tangential, radial, volumetric',
      'Timber stack inventory and case hardening stress test management',
    ],
    description:
      'Supervises timber seasoning kilns, monitors temperature and humidity drying curves, tracks moisture meter readings down to 6-8% EMC, calculates anisotropic shrinkage, and audits case-hardening stress relief prong tests.',
  },
  {
    role: Role.DIMENSION_MILL_CNC_MANAGER,
    designationKey: Designation.DIMENSION_MILL_CNC_MANAGER,
    label: 'Dimension Mill & CNC Operations Manager',
    subCategory: 'Furniture',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Panel optimization nesting layout management',
      'CNC machining program file tracking - G-code NC programs',
      'Edge banding glue temperature and feed rate monitoring',
      'Sub-component routing oversight & machining tolerance verification',
    ],
    description:
      'Controls multi-axis CNC routers and panel sizing saws, optimizes 2D/3D nesting layouts to minimize offcut waste, monitors edge-banding PUR/EVA glue temperatures, and verifies precision dowel/minifix machining tolerances.',
  },
  {
    role: Role.UPHOLSTERY_FOAM_CUTTING_MANAGER,
    designationKey: Designation.UPHOLSTERY_FOAM_CUTTING_MANAGER,
    label: 'Upholstery & Foam Cutting Manager',
    subCategory: 'Furniture',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Fabric marker layout management to minimize wastage',
      'Foam density grade tracking - PU foam, memory foam, bonded foam',
      'Industrial sewing line output oversight and seam pull strength testing',
      'Upholstery material inventory and flammability TB117 compliance',
    ],
    description:
      'Directs upholstery cutting and sewing lines, optimizes fabric and leather marker layouts, tracks PU and memory foam block density grades, oversees CNC oscillating wire cutters, and ensures California TB117 flammability compliance.',
  },
  {
    role: Role.SANDING_FINISHING_POLISHING_MANAGER,
    designationKey: Designation.SANDING_FINISHING_POLISHING_MANAGER,
    label: 'Sanding, Finishing & Polishing Manager',
    subCategory: 'Furniture',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Sanding grit progression schedule tracking - P80 to P320 orbital',
      'Finishing chemical formulation management - stains, sealers, PU topcoats',
      'Spray booth dust extraction and relative humidity monitoring',
      'Gloss consistency inspection - 60° Gardner GU & cross-hatch adhesion',
    ],
    description:
      'Manages wide-belt sanders and spray finishing booths, enforces multi-stage grit sanding schedules, formulates stains and polyurethane lacquers, checks spray booth dust PPM, and tests 60° gloss levels and cross-hatch adhesion.',
  },
  {
    role: Role.KD_PACKAGING_HARDWARE_KITTING_MANAGER,
    designationKey: Designation.KD_PACKAGING_HARDWARE_KITTING_MANAGER,
    label: 'KD Packaging & Hardware Kitting Manager',
    subCategory: 'Furniture',
    associatedDepartment: Department.PACKING,
    functions: [
      'Hardware blister-pack kitting list management - bolts, dowels, allen keys',
      'Corrugated box cutting and bubble-wrap padding standard oversight',
      'Carton drop-test compliance checking - ISTA 1A/3A standards',
      'Barcoded shipping label verification and assembly clearance pass issuance',
    ],
    description:
      'Oversees Knock-Down (KD) flat-pack packaging, audits hardware blister-pack kitting completeness, verifies corrugated box bursting strength and edge protection, conducts ISTA 1A/3A drop tests, and issues Assembly Clearance Passes.',
  },
];

export const DAIRY_SPECIALIZED_ROLES_METADATA: SpecializedRoleMeta[] = [
  {
    role: Role.MILK_COLLECTION_RECEPTION_MANAGER,
    designationKey: Designation.MILK_COLLECTION_RECEPTION_MANAGER,
    label: 'Milk Collection & Reception Manager',
    subCategory: 'Dairy Products',
    associatedDepartment: Department.INVENTORY,
    functions: [
      'Weighbridge tanker inward data logging',
      'Ultrasonic milk analyzer test result integration - Fat/SNF/Density',
      'Farmer/supplier payment grading ledger management',
      'Raw chilling silo inventory tracking (2-4°C)',
    ],
    description:
      'Directs raw milk reception docks, logs weighbridge tanker tare/gross weights, integrates ultrasonic Fat/SNF analyzer data, executes supplier payment formulas based on total solids, and manages chilled raw milk storage silos.',
  },
  {
    role: Role.PASTEURIZATION_PROCESSING_MANAGER,
    designationKey: Designation.PASTEURIZATION_PROCESSING_MANAGER,
    label: 'Pasteurization & Processing Manager',
    subCategory: 'Dairy Products',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Pasteurizer temperature-time hold chart monitoring - PLC logs (72-75°C)',
      'Steam and chilled water utility consumption tracking',
      'Cream separation ratio management',
      'Daily processing schedule oversight and homogenization pressure control',
    ],
    description:
      'Governs HTST plate pasteurizers, verifies automated flow diversion valve (FDV) safety hold records, tracks steam and glycol chilled water utilities, standardizes milk fat/SNF ratios via centrifugal cream separators, and supervises two-stage homogenization.',
  },
  {
    role: Role.FERMENTATION_CULTURE_MANAGER,
    designationKey: Designation.FERMENTATION_CULTURE_MANAGER,
    label: 'Fermentation & Culture Operations Manager',
    subCategory: 'Dairy Products',
    associatedDepartment: Department.PRODUCTION,
    functions: [
      'Starter culture inventory and inoculation recipe management',
      'Incubation chamber temperature log tracking',
      'Curd pH and coagulation firmness monitoring (pH 6.6 -> 4.5)',
      'Batch yield control and syneresis whey drainage tracking',
    ],
    description:
      'Supervises probiotic curd, yogurt, paneer, and cheese fermentation lines, manages DVS freeze-dried starter culture inoculations, monitors incubation room thermal profiles, logs pH drop curves and titratable acidity, and balances curd yields.',
  },
  {
    role: Role.QA_MBRT_ANTIBIOTIC_INCHARGE,
    designationKey: Designation.QA_MBRT_ANTIBIOTIC_INCHARGE,
    label: 'Dairy QA & MBRT/Antibiotic In-Charge',
    subCategory: 'Dairy Products',
    associatedDepartment: Department.QUALITY,
    functions: [
      'Daily microbiological and chemical test result recording (MBRT, Antibiotic residue)',
      'Aflatoxin M1 and somatic cell count (SCC) statutory threshold verification',
      'Blocking unapproved milk batches from packaging lines',
      'Certificate of Analysis - CoA auto-generation & packaging gate clearance',
    ],
    description:
      'Administers quality release protocols, performs dye reduction MBRT decolorization tests, screens for beta-lactam/tetracycline antibiotic residues, audits aflatoxin M1 and somatic cell counts, enforces strict packaging line lockouts, and generates statutory food safety Certificates of Analysis (CoA).',
  },
  {
    role: Role.COLD_CHAIN_EXPIRY_MANAGER,
    designationKey: Designation.COLD_CHAIN_EXPIRY_MANAGER,
    label: 'Cold-Chain & Expiry FEFO Manager',
    subCategory: 'Dairy Products',
    associatedDepartment: Department.INVENTORY,
    functions: [
      'Cold room temperature logger monitoring (2-4°C)',
      'Cold-chain logistics vehicle temperature compliance management',
      'Barcode label printing with strict use-by timestamps',
      'Near-expiry FIFO/FEFO stock rotation and quarantine gate control',
    ],
    description:
      'Monitors blast chilling and finished product cold storage rooms, tracks refrigerated reefer truck dataloggers, enforces First-Expired, First-Out (FEFO) warehouse rotation, prints dynamic use-by barcode labels, and prevents shipping of temperature-compromised dairy inventory.',
  },
];

export const ALL_SPECIALIZED_ROLES_METADATA: SpecializedRoleMeta[] = [
  ...STEEL_SPECIALIZED_ROLES_METADATA,
  ...GLASS_SPECIALIZED_ROLES_METADATA,
  ...CHEMICAL_SPECIALIZED_ROLES_METADATA,
  ...PAINT_SPECIALIZED_ROLES_METADATA,
  ...RUBBER_SPECIALIZED_ROLES_METADATA,
  ...PIPES_SPECIALIZED_ROLES_METADATA,
  ...AUTOMOBILE_SPECIALIZED_ROLES_METADATA,
  ...ELECTRONICAL_SPECIALIZED_ROLES_METADATA,
  ...ELECTRIC_EQUIPMENT_SPECIALIZED_ROLES_METADATA,
  ...CABLE_WIRE_SPECIALIZED_ROLES_METADATA,
  ...TEXTILES_SPECIALIZED_ROLES_METADATA,
  ...JEWELLERY_SPECIALIZED_ROLES_METADATA,
  ...LEATHER_SPECIALIZED_ROLES_METADATA,
  ...FURNITURE_SPECIALIZED_ROLES_METADATA,
  ...DAIRY_SPECIALIZED_ROLES_METADATA,
];

/**
 * Normalizes sub-category string for robust case-insensitive comparison
 */
export function normalizeSubCategory(subCategory?: string | null): string {
  if (!subCategory) return '';
  return subCategory.trim().toLowerCase();
}

/**
 * Returns ONLY the specialized roles pertinent to a registered sub-category
 */
export function getSpecializedRolesForSubCategory(subCategory?: string | null): SpecializedRoleMeta[] {
  if (!subCategory) return [];
  const normalized = normalizeSubCategory(subCategory);

  if (normalized.includes('steel') || normalized.includes('heavy metal')) {
    return STEEL_SPECIALIZED_ROLES_METADATA;
  }
  if (normalized.includes('glass') || normalized.includes('ceramic')) {
    return GLASS_SPECIALIZED_ROLES_METADATA;
  }
  if (normalized === 'chemicals' || normalized.includes('chemical')) {
    return CHEMICAL_SPECIALIZED_ROLES_METADATA;
  }
  if (normalized === 'paint' || normalized.includes('paint') || normalized.includes('coating')) {
    return PAINT_SPECIALIZED_ROLES_METADATA;
  }
  if (normalized.includes('rubber') || normalized.includes('tyre') || normalized.includes('tire')) {
    return RUBBER_SPECIALIZED_ROLES_METADATA;
  }
  if (normalized === 'pipes' || normalized.includes('pipe')) {
    return PIPES_SPECIALIZED_ROLES_METADATA;
  }
  if (normalized.includes('auto') || normalized.includes('vehicle')) {
    return AUTOMOBILE_SPECIALIZED_ROLES_METADATA;
  }
  if (normalized.includes('electron')) {
    return ELECTRONICAL_SPECIALIZED_ROLES_METADATA;
  }
  if (normalized.includes('cable') || normalized.includes('wire')) {
    return CABLE_WIRE_SPECIALIZED_ROLES_METADATA;
  }
  if (normalized.includes('electric') || normalized.includes('equipment') || normalized.includes('transformer') || normalized.includes('switchgear')) {
    return ELECTRIC_EQUIPMENT_SPECIALIZED_ROLES_METADATA;
  }
  if (
    normalized.includes('textile') ||
    normalized.includes('apparel') ||
    normalized.includes('garment') ||
    normalized.includes('fabric') ||
    normalized.includes('yarn')
  ) {
    return TEXTILES_SPECIALIZED_ROLES_METADATA;
  }
  if (
    normalized.includes('jewel') ||
    normalized.includes('jewelry') ||
    normalized.includes('jewellery') ||
    normalized.includes('gold') ||
    normalized.includes('diamond') ||
    normalized.includes('bullion')
  ) {
    return JEWELLERY_SPECIALIZED_ROLES_METADATA;
  }
  if (
    normalized.includes('leather') ||
    normalized.includes('tannery') ||
    normalized.includes('tanning') ||
    normalized.includes('hide') ||
    normalized.includes('skin')
  ) {
    return LEATHER_SPECIALIZED_ROLES_METADATA;
  }
  if (
    normalized.includes('furniture') ||
    normalized.includes('wood') ||
    normalized.includes('timber') ||
    normalized.includes('carpentry') ||
    normalized.includes('cabinet')
  ) {
    return FURNITURE_SPECIALIZED_ROLES_METADATA;
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
    return DAIRY_SPECIALIZED_ROLES_METADATA;
  }

  // Exact fallback matching from ALL_SPECIALIZED_ROLES_METADATA
  return ALL_SPECIALIZED_ROLES_METADATA.filter(
    (meta) => normalizeSubCategory(meta.subCategory) === normalized,
  );
}

/**
 * Validates whether a given role or designation is permitted for a specific sub-category.
 * Standard general roles (Owner, CEO, MD, Manager, etc.) are universally allowed.
 * Specialized roles are strictly limited to their own sub-category.
 */
export function isRoleAllowedForSubCategory(
  subCategory: string | null | undefined,
  roleOrDesignation: string,
): { allowed: boolean; reason?: string; requiredSubCategory?: string } {
  const specialized = ALL_SPECIALIZED_ROLES_METADATA.find(
    (m) => m.role === roleOrDesignation || m.designationKey === roleOrDesignation,
  );

  // Standard general organizational roles are universally allowed across all industries
  if (!specialized) {
    return { allowed: true };
  }

  if (!subCategory) {
    return {
      allowed: false,
      reason: `Specialized role "${roleOrDesignation}" requires a valid registered company sub-category.`,
      requiredSubCategory: specialized.subCategory,
    };
  }

  const allowedRoles = getSpecializedRolesForSubCategory(subCategory);
  const isMatch = allowedRoles.some(
    (m) => m.role === roleOrDesignation || m.designationKey === roleOrDesignation,
  );

  if (!isMatch) {
    return {
      allowed: false,
      reason: `Role "${roleOrDesignation}" belongs exclusively to "${specialized.subCategory}" and cannot be assigned to a company registered under "${subCategory}".`,
      requiredSubCategory: specialized.subCategory,
    };
  }

  return { allowed: true };
}

export const DESIGNATION_HIERARCHY_WEIGHT: Record<string, number> = {
  [Designation.SUPER_ADMIN]: 100,
  [Designation.OWNER]: 100,
  [Designation.CEO]: 100,
  [Designation.MD]: 95,
  [Designation.EXECUTIVE]: 95,
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

  // Rubber & Tyre Roles
  [Designation.RUBBER_COMPOUNDING_MANAGER]: 70,
  [Designation.EXTRUSION_CALENDERING_MANAGER]: 70,
  [Designation.TYRE_BUILDING_MANAGER]: 70,
  [Designation.CURING_VULCANIZATION_MANAGER]: 70,
  [Designation.TYRE_TESTING_UNIFORMITY_MANAGER]: 70,

  // Pipes Roles
  [Designation.EXTRUSION_LINE_OPERATIONS_MANAGER]: 70,
  [Designation.WALL_THICKNESS_QUALITY_INCHARGE]: 70,
  [Designation.HYDROSTATIC_BURST_TESTING_MANAGER]: 70,
  [Designation.SOCKETING_BELLING_JOINTING_MANAGER]: 70,
  [Designation.PVC_DRY_BLEND_REGRIND_MANAGER]: 70,

  // Automobiles Roles
  [Designation.JIT_JIS_SUPPLY_CHAIN_MANAGER]: 70,
  [Designation.PRESS_SHOP_BIW_MANAGER]: 70,
  [Designation.VEHICLE_ASSEMBLY_MANAGER]: 70,
  [Designation.PAINT_SHOP_ANTI_CORROSION_MANAGER]: 70,
  [Designation.EOL_TESTING_VIN_MANAGER]: 70,

  // Electronical Roles
  [Designation.SMT_PCB_ASSEMBLY_MANAGER]: 70,
  [Designation.ELECTRICAL_TESTING_CALIBRATION_MANAGER]: 70,
  [Designation.FIRMWARE_FLASHING_MANAGER]: 70,
  [Designation.COMPONENT_OBSOLESCENCE_EBOM_MANAGER]: 70,
  [Designation.ESD_CLEANROOM_COMPLIANCE_MANAGER]: 70,

  // Electric Equipment Roles
  [Designation.WINDING_COIL_FABRICATION_MANAGER]: 70,
  [Designation.CORE_ASSEMBLY_LAMINATION_MANAGER]: 70,
  [Designation.VPI_INSULATION_MANAGER]: 70,
  [Designation.HV_ROUTINE_TESTING_MANAGER]: 70,
  [Designation.BUSBAR_FABRICATION_ENCLOSURE_MANAGER]: 70,

  // Cable Wire Roles
  [Designation.WIRE_DRAWING_ANNEALING_MANAGER]: 70,
  [Designation.BUNCHING_STRANDING_MANAGER]: 70,
  [Designation.INSULATION_SHEATHING_MANAGER]: 70,
  [Designation.ARMOURING_BEDDING_MANAGER]: 70,
  [Designation.HV_SPARK_TESTING_QA_MANAGER]: 70,

  // Textiles Roles
  [Designation.SPINNING_YARN_MANAGER]: 70,
  [Designation.WEAVING_KNITTING_MANAGER]: 70,
  [Designation.DYEING_PROCESS_MANAGER]: 70,
  [Designation.GARMENTING_FINISHING_MANAGER]: 70,
  [Designation.FABRIC_QUALITY_INSPECTION_MANAGER]: 70,

  // Jewellery Roles
  [Designation.BULLION_VAULT_SECURITY_MANAGER]: 70,
  [Designation.CAD_CAM_PROTOTYPING_MANAGER]: 70,
  [Designation.CASTING_MELTING_MANAGER]: 70,
  [Designation.GOLDSMITH_KARIGAR_MANAGER]: 70,
  [Designation.GEMSTONE_HALLMARKING_QC_MANAGER]: 70,

  // Leather Roles
  [Designation.HIDE_WETBLUE_MANAGER]: 70,
  [Designation.RETANNING_DYEING_CRUST_MANAGER]: 70,
  [Designation.SPLITTING_SHAVING_CALIBRATION_MANAGER]: 70,
  [Designation.FINISHING_BUFFING_EMBOSSING_MANAGER]: 70,
  [Designation.LEATHER_QC_AREA_MEASUREMENT_MANAGER]: 70,

  // Furniture Roles
  [Designation.TIMBER_SEASONING_KILN_MANAGER]: 70,
  [Designation.DIMENSION_MILL_CNC_MANAGER]: 70,
  [Designation.UPHOLSTERY_FOAM_CUTTING_MANAGER]: 70,
  [Designation.SANDING_FINISHING_POLISHING_MANAGER]: 70,
  [Designation.KD_PACKAGING_HARDWARE_KITTING_MANAGER]: 70,

  // Dairy Roles
  [Designation.MILK_COLLECTION_RECEPTION_MANAGER]: 70,
  [Designation.PASTEURIZATION_PROCESSING_MANAGER]: 70,
  [Designation.FERMENTATION_CULTURE_MANAGER]: 70,
  [Designation.QA_MBRT_ANTIBIOTIC_INCHARGE]: 70,
  [Designation.COLD_CHAIN_EXPIRY_MANAGER]: 70,

  [Designation.ASSISTANT_MANAGER]: 50,
  [Designation.ASSOCIATE_MANAGER]: 30,
  [Designation.SUPERVISOR]: 40,
  [Designation.OFFICER]: 30,
  [Designation.OPERATOR]: 20,
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
    label: 'CEO / MD / Owner / Super Admin (Executive)',
    codePrefix: 'EXEC',
    allowedDesignations: [
      Designation.SUPER_ADMIN,
      Designation.CEO,
      Designation.MD,
      Designation.OWNER,
      Designation.EXECUTIVE,
    ],
    permissionsSummary:
      'Full enterprise governance, company-level multi-tenant administration, financial sign-off & plant-wide RBAC control',
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
      Designation.RUBBER_COMPOUNDING_MANAGER,
      Designation.EXTRUSION_CALENDERING_MANAGER,
      Designation.TYRE_BUILDING_MANAGER,
      Designation.CURING_VULCANIZATION_MANAGER,
      Designation.EXTRUSION_LINE_OPERATIONS_MANAGER,
      Designation.SOCKETING_BELLING_JOINTING_MANAGER,
      Designation.PVC_DRY_BLEND_REGRIND_MANAGER,
      Designation.PRESS_SHOP_BIW_MANAGER,
      Designation.VEHICLE_ASSEMBLY_MANAGER,
      Designation.PAINT_SHOP_ANTI_CORROSION_MANAGER,
      Designation.SMT_PCB_ASSEMBLY_MANAGER,
      Designation.FIRMWARE_FLASHING_MANAGER,
      Designation.WINDING_COIL_FABRICATION_MANAGER,
      Designation.CORE_ASSEMBLY_LAMINATION_MANAGER,
      Designation.VPI_INSULATION_MANAGER,
      Designation.BUSBAR_FABRICATION_ENCLOSURE_MANAGER,
      Designation.WIRE_DRAWING_ANNEALING_MANAGER,
      Designation.BUNCHING_STRANDING_MANAGER,
      Designation.INSULATION_SHEATHING_MANAGER,
      Designation.ARMOURING_BEDDING_MANAGER,
      Designation.SPINNING_YARN_MANAGER,
      Designation.WEAVING_KNITTING_MANAGER,
      Designation.DYEING_PROCESS_MANAGER,
      Designation.GARMENTING_FINISHING_MANAGER,
      Designation.CAD_CAM_PROTOTYPING_MANAGER,
      Designation.CASTING_MELTING_MANAGER,
      Designation.GOLDSMITH_KARIGAR_MANAGER,
      Designation.HIDE_WETBLUE_MANAGER,
      Designation.RETANNING_DYEING_CRUST_MANAGER,
      Designation.SPLITTING_SHAVING_CALIBRATION_MANAGER,
      Designation.FINISHING_BUFFING_EMBOSSING_MANAGER,
      Designation.TIMBER_SEASONING_KILN_MANAGER,
      Designation.DIMENSION_MILL_CNC_MANAGER,
      Designation.UPHOLSTERY_FOAM_CUTTING_MANAGER,
      Designation.SANDING_FINISHING_POLISHING_MANAGER,
      Designation.MILK_COLLECTION_RECEPTION_MANAGER,
      Designation.PASTEURIZATION_PROCESSING_MANAGER,
      Designation.FERMENTATION_CULTURE_MANAGER,
      Designation.ASSISTANT_MANAGER,
      Designation.ASSOCIATE_MANAGER,
    ],
    permissionsSummary:
      'Approve production orders, raw milk weighbridge intake & Fat/SNF analysis, HTST pasteurizer temperature-time hold & FDV flow diversion, cream separation & homogenization, probiotic curd/yogurt/paneer starter culture inoculation & pH drop tracking, tannery drum chemical dosing & wet-blue yield, retanning/dyeing shade matching & fatliquor temper, bandknife splitting thickness calibration, rotary spray booth finishing & grain embossing, jewelry 3D CAD prototyping & castable resin printing, vacuum induction melting & karatage stoichiometry, karigar metal issuance & Ghath loss reconciliation, textile fiber blending & spindle utilization, yarn count & lea strength, loom speeds & stop-time logs, dye formulations & shade approvals, garment line WIP & marker nesting, wire drawing elongation & continuous annealing profiles, conductor bunching RPM & lay-length, multi-zone polymer insulation/sheathing extrusion & laser gauge, armouring pitch & steel strip tension, coil winding turns & conductor weight, CRGO core stacking & torque, VPI autoclave impregnation & baking, busbar bending & enclosure routing, vehicle assembly takt time, SMT setups, reflow profiles, firmware flashing, press shop BIW, ED paint curing, pipe extrusion, belling cycles, PVC dry blend, rubber compounding, curing cycles, reactor batches, master formulas & subcontracting challans',
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
      Designation.JIT_JIS_SUPPLY_CHAIN_MANAGER,
      Designation.COMPONENT_OBSOLESCENCE_EBOM_MANAGER,
      Designation.CORE_ASSEMBLY_LAMINATION_MANAGER,
      Designation.ARMOURING_BEDDING_MANAGER,
      Designation.WEAVING_KNITTING_MANAGER,
      Designation.GARMENTING_FINISHING_MANAGER,
      Designation.BULLION_VAULT_SECURITY_MANAGER,
      Designation.GOLDSMITH_KARIGAR_MANAGER,
      Designation.HIDE_WETBLUE_MANAGER,
      Designation.RETANNING_DYEING_CRUST_MANAGER,
      Designation.LEATHER_QC_AREA_MEASUREMENT_MANAGER,
      Designation.TIMBER_SEASONING_KILN_MANAGER,
      Designation.UPHOLSTERY_FOAM_CUTTING_MANAGER,
      Designation.KD_PACKAGING_HARDWARE_KITTING_MANAGER,
      Designation.MILK_COLLECTION_RECEPTION_MANAGER,
      Designation.COLD_CHAIN_EXPIRY_MANAGER,
      Designation.ASSISTANT_MANAGER,
      Designation.ASSOCIATE_MANAGER,
    ],
    permissionsSummary:
      'Raw material inward/outward control, raw milk chilling silo inventory & cold storage FIFO/FEFO stock rotation, use-by date expiration monitoring, wet-blue and crust leather stock reserves, square footage barcode inventory, bullion vault stock balance & live metal valuation, karigar metal/gemstone challan inventory, greige fabric roll stock & yarn lot allocation, export carton box & bundle inventory, steel armouring reel stock & WIP sub-assembly staging, CRGO slitting sheet stock, component obsolescence & EBOM status, electronic Kanban pull signals, Just-in-Sequence (JIS) line-side delivery, dangerous goods transport (Tremcards), bulk base stock tinting, weighbridge slips, raw batch silos & stock levels',
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
      Designation.TYRE_TESTING_UNIFORMITY_MANAGER,
      Designation.WALL_THICKNESS_QUALITY_INCHARGE,
      Designation.HYDROSTATIC_BURST_TESTING_MANAGER,
      Designation.EOL_TESTING_VIN_MANAGER,
      Designation.ELECTRICAL_TESTING_CALIBRATION_MANAGER,
      Designation.HV_ROUTINE_TESTING_MANAGER,
      Designation.HV_SPARK_TESTING_QA_MANAGER,
      Designation.FABRIC_QUALITY_INSPECTION_MANAGER,
      Designation.GEMSTONE_HALLMARKING_QC_MANAGER,
      Designation.SPLITTING_SHAVING_CALIBRATION_MANAGER,
      Designation.LEATHER_QC_AREA_MEASUREMENT_MANAGER,
      Designation.SANDING_FINISHING_POLISHING_MANAGER,
      Designation.KD_PACKAGING_HARDWARE_KITTING_MANAGER,
      Designation.QA_MBRT_ANTIBIOTIC_INCHARGE,
      Designation.ASSISTANT_MANAGER,
      Designation.ASSOCIATE_MANAGER,
    ],
    permissionsSummary:
      'Dairy MBRT decolorization reduction hours, beta-lactam/tetracycline antibiotic residue screening, aflatoxin M1 statutory compliance, somatic cell count (SCC) scoring, dairy packaging line gate lockout, food safety Certificate of Analysis (CoA) auto-generation, optical hide area measurement & barcode tagging, Bally flexometer cycles, Veslic rub fastness, split thickness 5-point gauge tolerance audit, BIS 6-digit HUID laser hallmark tracking, XRF gold spectrometer purity testing, gemstone & diamond 4C lab certification (GIA/IGI), Certificate of Authenticity (CoA) generation, ASTM D5430 4-point fabric inspection defect scoring, fabric GSM verification, dimensional stability shrinkage tests, color fastness checks, high-voltage spark testing fault count recording, conductor DC resistance validation, meter-marking calibration, high-voltage routine test rig certification, uncalibrated instrument lockout, partial discharge metrics, automotive EOL testing, 17-character VIN assignment & Gate Pass clearance, automated ICT/FCT electrical testing, batch analytical testing, ultrasonic wall thickness scanning, hydrostatic burst pressure certification, spectrophotometer delta E matching, rheology viscosity clearance, tyre dynamic uniformity & DOT certification, CoA generation & dispatch gate locks',
  },
  {
    key: Department.PACKING,
    label: 'Packing',
    codePrefix: 'PKG',
    allowedDesignations: [
      Designation.MANAGER,
      Designation.FLAMMABLE_PACKAGING_COMPLIANCE_MANAGER,
      Designation.KD_PACKAGING_HARDWARE_KITTING_MANAGER,
      Designation.COLD_CHAIN_EXPIRY_MANAGER,
      Designation.ASSISTANT_MANAGER,
      Designation.ASSOCIATE_MANAGER,
    ],
    permissionsSummary:
      'Finished goods packaging, dynamic milk pouch/tub barcode labeling with use-by timestamps, flammable container anti-static grounding, VOC compliance, pallet labeling & dispatch readiness clearance',
  },
  {
    key: Department.LOGISTICS,
    label: 'Logistics',
    codePrefix: 'LOG',
    allowedDesignations: [
      Designation.MANAGER,
      Designation.WEIGHBRIDGE_LOGISTICS_MANAGER,
      Designation.HAZARDOUS_LOGISTICS_MANAGER,
      Designation.COLD_CHAIN_EXPIRY_MANAGER,
      Designation.ASSISTANT_MANAGER,
      Designation.ASSOCIATE_MANAGER,
    ],
    permissionsSummary:
      'Inbound/outbound freight management, refrigerated reefer truck temperature logger tracking (2-4°C), weighbridge validation, carrier tracking, hazardous logistics & dispatch routing',
  },
  {
    key: Department.SECURITY,
    label: 'Security & Safety',
    codePrefix: 'SEC',
    allowedDesignations: [
      Designation.MANAGER,
      Designation.EHS_SAFETY_MANAGER,
      Designation.EHS_HAZMAT_MANAGER,
      Designation.ESD_CLEANROOM_COMPLIANCE_MANAGER,
      Designation.BULLION_VAULT_SECURITY_MANAGER,
      Designation.ASSISTANT_MANAGER,
      Designation.ASSOCIATE_MANAGER,
    ],
    permissionsSummary:
      'High-security bullion vault custody, dual-key locker access logs, daily bullion weight balance audit, ESD cleanroom audit logs, ANSI/ESD S20.20 grounding compliance, cleanroom air particle monitoring, gate entry/exit logs, hazardous waste manifests, EHS incidents, hot work permits & chemical plant safety',
  },
  {
    key: Department.GATE_SECURITY,
    label: 'Gate Security',
    codePrefix: 'GSEC',
    allowedDesignations: [
      Designation.MANAGER,
      Designation.EHS_SAFETY_MANAGER,
      Designation.ASSISTANT_MANAGER,
      Designation.ASSOCIATE_MANAGER,
    ],
    permissionsSummary:
      'Plant perimeter access control, vehicle weight slip checks, visitor and employee gate pass verification',
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
    key: Department.FINANCE,
    label: 'Finance',
    codePrefix: 'FIN',
    allowedDesignations: [Designation.MANAGER, Designation.ASSISTANT_MANAGER, Designation.ASSOCIATE_MANAGER],
    permissionsSummary:
      'Invoicing, account reconciliations, vendor payments, ledger tracking & tax/GST compliance',
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
  {
    key: Department.PROCUREMENT,
    label: 'Procurement',
    codePrefix: 'PROC',
    allowedDesignations: [Designation.MANAGER, Designation.ASSISTANT_MANAGER, Designation.ASSOCIATE_MANAGER],
    permissionsSummary: 'Direct raw material procurement, purchase requisition approvals & vendor contracts',
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

  // Rubber & Tyre Specialized Roles
  if (
    designation === Designation.RUBBER_COMPOUNDING_MANAGER ||
    (designation as unknown as string) === Role.RUBBER_COMPOUNDING_MANAGER
  ) {
    return Role.RUBBER_COMPOUNDING_MANAGER;
  }
  if (
    designation === Designation.EXTRUSION_CALENDERING_MANAGER ||
    (designation as unknown as string) === Role.EXTRUSION_CALENDERING_MANAGER
  ) {
    return Role.EXTRUSION_CALENDERING_MANAGER;
  }
  if (
    designation === Designation.TYRE_BUILDING_MANAGER ||
    (designation as unknown as string) === Role.TYRE_BUILDING_MANAGER
  ) {
    return Role.TYRE_BUILDING_MANAGER;
  }
  if (
    designation === Designation.CURING_VULCANIZATION_MANAGER ||
    (designation as unknown as string) === Role.CURING_VULCANIZATION_MANAGER
  ) {
    return Role.CURING_VULCANIZATION_MANAGER;
  }
  if (
    designation === Designation.TYRE_TESTING_UNIFORMITY_MANAGER ||
    (designation as unknown as string) === Role.TYRE_TESTING_UNIFORMITY_MANAGER
  ) {
    return Role.TYRE_TESTING_UNIFORMITY_MANAGER;
  }

  // Pipes Specialized Roles
  if (
    designation === Designation.EXTRUSION_LINE_OPERATIONS_MANAGER ||
    (designation as unknown as string) === Role.EXTRUSION_LINE_OPERATIONS_MANAGER
  ) {
    return Role.EXTRUSION_LINE_OPERATIONS_MANAGER;
  }
  if (
    designation === Designation.WALL_THICKNESS_QUALITY_INCHARGE ||
    (designation as unknown as string) === Role.WALL_THICKNESS_QUALITY_INCHARGE
  ) {
    return Role.WALL_THICKNESS_QUALITY_INCHARGE;
  }
  if (
    designation === Designation.HYDROSTATIC_BURST_TESTING_MANAGER ||
    (designation as unknown as string) === Role.HYDROSTATIC_BURST_TESTING_MANAGER
  ) {
    return Role.HYDROSTATIC_BURST_TESTING_MANAGER;
  }
  if (
    designation === Designation.SOCKETING_BELLING_JOINTING_MANAGER ||
    (designation as unknown as string) === Role.SOCKETING_BELLING_JOINTING_MANAGER
  ) {
    return Role.SOCKETING_BELLING_JOINTING_MANAGER;
  }
  if (
    designation === Designation.PVC_DRY_BLEND_REGRIND_MANAGER ||
    (designation as unknown as string) === Role.PVC_DRY_BLEND_REGRIND_MANAGER
  ) {
    return Role.PVC_DRY_BLEND_REGRIND_MANAGER;
  }

  // Automobile Specialized Roles
  if (
    designation === Designation.JIT_JIS_SUPPLY_CHAIN_MANAGER ||
    (designation as unknown as string) === Role.JIT_JIS_SUPPLY_CHAIN_MANAGER
  ) {
    return Role.JIT_JIS_SUPPLY_CHAIN_MANAGER;
  }
  if (
    designation === Designation.PRESS_SHOP_BIW_MANAGER ||
    (designation as unknown as string) === Role.PRESS_SHOP_BIW_MANAGER
  ) {
    return Role.PRESS_SHOP_BIW_MANAGER;
  }
  if (
    designation === Designation.VEHICLE_ASSEMBLY_MANAGER ||
    (designation as unknown as string) === Role.VEHICLE_ASSEMBLY_MANAGER
  ) {
    return Role.VEHICLE_ASSEMBLY_MANAGER;
  }
  if (
    designation === Designation.PAINT_SHOP_ANTI_CORROSION_MANAGER ||
    (designation as unknown as string) === Role.PAINT_SHOP_ANTI_CORROSION_MANAGER
  ) {
    return Role.PAINT_SHOP_ANTI_CORROSION_MANAGER;
  }
  if (
    designation === Designation.EOL_TESTING_VIN_MANAGER ||
    (designation as unknown as string) === Role.EOL_TESTING_VIN_MANAGER
  ) {
    return Role.EOL_TESTING_VIN_MANAGER;
  }

  // Electronical Specialized Roles
  if (
    designation === Designation.SMT_PCB_ASSEMBLY_MANAGER ||
    (designation as unknown as string) === Role.SMT_PCB_ASSEMBLY_MANAGER
  ) {
    return Role.SMT_PCB_ASSEMBLY_MANAGER;
  }
  if (
    designation === Designation.ELECTRICAL_TESTING_CALIBRATION_MANAGER ||
    (designation as unknown as string) === Role.ELECTRICAL_TESTING_CALIBRATION_MANAGER
  ) {
    return Role.ELECTRICAL_TESTING_CALIBRATION_MANAGER;
  }
  if (
    designation === Designation.FIRMWARE_FLASHING_MANAGER ||
    (designation as unknown as string) === Role.FIRMWARE_FLASHING_MANAGER
  ) {
    return Role.FIRMWARE_FLASHING_MANAGER;
  }
  if (
    designation === Designation.COMPONENT_OBSOLESCENCE_EBOM_MANAGER ||
    (designation as unknown as string) === Role.COMPONENT_OBSOLESCENCE_EBOM_MANAGER
  ) {
    return Role.COMPONENT_OBSOLESCENCE_EBOM_MANAGER;
  }
  if (
    designation === Designation.ESD_CLEANROOM_COMPLIANCE_MANAGER ||
    (designation as unknown as string) === Role.ESD_CLEANROOM_COMPLIANCE_MANAGER
  ) {
    return Role.ESD_CLEANROOM_COMPLIANCE_MANAGER;
  }

  // Electric Equipment Specialized Roles
  if (
    designation === Designation.WINDING_COIL_FABRICATION_MANAGER ||
    (designation as unknown as string) === Role.WINDING_COIL_FABRICATION_MANAGER
  ) {
    return Role.WINDING_COIL_FABRICATION_MANAGER;
  }
  if (
    designation === Designation.CORE_ASSEMBLY_LAMINATION_MANAGER ||
    (designation as unknown as string) === Role.CORE_ASSEMBLY_LAMINATION_MANAGER
  ) {
    return Role.CORE_ASSEMBLY_LAMINATION_MANAGER;
  }
  if (
    designation === Designation.VPI_INSULATION_MANAGER ||
    (designation as unknown as string) === Role.VPI_INSULATION_MANAGER
  ) {
    return Role.VPI_INSULATION_MANAGER;
  }
  if (
    designation === Designation.HV_ROUTINE_TESTING_MANAGER ||
    (designation as unknown as string) === Role.HV_ROUTINE_TESTING_MANAGER
  ) {
    return Role.HV_ROUTINE_TESTING_MANAGER;
  }
  if (
    designation === Designation.BUSBAR_FABRICATION_ENCLOSURE_MANAGER ||
    (designation as unknown as string) === Role.BUSBAR_FABRICATION_ENCLOSURE_MANAGER
  ) {
    return Role.BUSBAR_FABRICATION_ENCLOSURE_MANAGER;
  }

  // Cable Wire Specialized Roles
  if (
    designation === Designation.WIRE_DRAWING_ANNEALING_MANAGER ||
    (designation as unknown as string) === Role.WIRE_DRAWING_ANNEALING_MANAGER
  ) {
    return Role.WIRE_DRAWING_ANNEALING_MANAGER;
  }
  if (
    designation === Designation.BUNCHING_STRANDING_MANAGER ||
    (designation as unknown as string) === Role.BUNCHING_STRANDING_MANAGER
  ) {
    return Role.BUNCHING_STRANDING_MANAGER;
  }
  if (
    designation === Designation.INSULATION_SHEATHING_MANAGER ||
    (designation as unknown as string) === Role.INSULATION_SHEATHING_MANAGER
  ) {
    return Role.INSULATION_SHEATHING_MANAGER;
  }
  if (
    designation === Designation.ARMOURING_BEDDING_MANAGER ||
    (designation as unknown as string) === Role.ARMOURING_BEDDING_MANAGER
  ) {
    return Role.ARMOURING_BEDDING_MANAGER;
  }
  if (
    designation === Designation.HV_SPARK_TESTING_QA_MANAGER ||
    (designation as unknown as string) === Role.HV_SPARK_TESTING_QA_MANAGER
  ) {
    return Role.HV_SPARK_TESTING_QA_MANAGER;
  }

  // Textiles Specialized Roles
  if (
    designation === Designation.SPINNING_YARN_MANAGER ||
    (designation as unknown as string) === Role.SPINNING_YARN_MANAGER
  ) {
    return Role.SPINNING_YARN_MANAGER;
  }
  if (
    designation === Designation.WEAVING_KNITTING_MANAGER ||
    (designation as unknown as string) === Role.WEAVING_KNITTING_MANAGER
  ) {
    return Role.WEAVING_KNITTING_MANAGER;
  }
  if (
    designation === Designation.DYEING_PROCESS_MANAGER ||
    (designation as unknown as string) === Role.DYEING_PROCESS_MANAGER
  ) {
    return Role.DYEING_PROCESS_MANAGER;
  }
  if (
    designation === Designation.GARMENTING_FINISHING_MANAGER ||
    (designation as unknown as string) === Role.GARMENTING_FINISHING_MANAGER
  ) {
    return Role.GARMENTING_FINISHING_MANAGER;
  }
  if (
    designation === Designation.FABRIC_QUALITY_INSPECTION_MANAGER ||
    (designation as unknown as string) === Role.FABRIC_QUALITY_INSPECTION_MANAGER
  ) {
    return Role.FABRIC_QUALITY_INSPECTION_MANAGER;
  }

  // Jewellery Specialized Roles
  if (
    designation === Designation.BULLION_VAULT_SECURITY_MANAGER ||
    (designation as unknown as string) === Role.BULLION_VAULT_SECURITY_MANAGER
  ) {
    return Role.BULLION_VAULT_SECURITY_MANAGER;
  }
  if (
    designation === Designation.CAD_CAM_PROTOTYPING_MANAGER ||
    (designation as unknown as string) === Role.CAD_CAM_PROTOTYPING_MANAGER
  ) {
    return Role.CAD_CAM_PROTOTYPING_MANAGER;
  }
  if (
    designation === Designation.CASTING_MELTING_MANAGER ||
    (designation as unknown as string) === Role.CASTING_MELTING_MANAGER
  ) {
    return Role.CASTING_MELTING_MANAGER;
  }
  if (
    designation === Designation.GOLDSMITH_KARIGAR_MANAGER ||
    (designation as unknown as string) === Role.GOLDSMITH_KARIGAR_MANAGER
  ) {
    return Role.GOLDSMITH_KARIGAR_MANAGER;
  }
  if (
    designation === Designation.GEMSTONE_HALLMARKING_QC_MANAGER ||
    (designation as unknown as string) === Role.GEMSTONE_HALLMARKING_QC_MANAGER
  ) {
    return Role.GEMSTONE_HALLMARKING_QC_MANAGER;
  }

  // Leather Specialized Roles
  if (
    designation === Designation.HIDE_WETBLUE_MANAGER ||
    (designation as unknown as string) === Role.HIDE_WETBLUE_MANAGER
  ) {
    return Role.HIDE_WETBLUE_MANAGER;
  }
  if (
    designation === Designation.RETANNING_DYEING_CRUST_MANAGER ||
    (designation as unknown as string) === Role.RETANNING_DYEING_CRUST_MANAGER
  ) {
    return Role.RETANNING_DYEING_CRUST_MANAGER;
  }
  if (
    designation === Designation.SPLITTING_SHAVING_CALIBRATION_MANAGER ||
    (designation as unknown as string) === Role.SPLITTING_SHAVING_CALIBRATION_MANAGER
  ) {
    return Role.SPLITTING_SHAVING_CALIBRATION_MANAGER;
  }
  if (
    designation === Designation.FINISHING_BUFFING_EMBOSSING_MANAGER ||
    (designation as unknown as string) === Role.FINISHING_BUFFING_EMBOSSING_MANAGER
  ) {
    return Role.FINISHING_BUFFING_EMBOSSING_MANAGER;
  }
  if (
    designation === Designation.LEATHER_QC_AREA_MEASUREMENT_MANAGER ||
    (designation as unknown as string) === Role.LEATHER_QC_AREA_MEASUREMENT_MANAGER
  ) {
    return Role.LEATHER_QC_AREA_MEASUREMENT_MANAGER;
  }

  // Furniture Specialized Roles
  if (
    designation === Designation.TIMBER_SEASONING_KILN_MANAGER ||
    (designation as unknown as string) === Role.TIMBER_SEASONING_KILN_MANAGER
  ) {
    return Role.TIMBER_SEASONING_KILN_MANAGER;
  }
  if (
    designation === Designation.DIMENSION_MILL_CNC_MANAGER ||
    (designation as unknown as string) === Role.DIMENSION_MILL_CNC_MANAGER
  ) {
    return Role.DIMENSION_MILL_CNC_MANAGER;
  }
  if (
    designation === Designation.UPHOLSTERY_FOAM_CUTTING_MANAGER ||
    (designation as unknown as string) === Role.UPHOLSTERY_FOAM_CUTTING_MANAGER
  ) {
    return Role.UPHOLSTERY_FOAM_CUTTING_MANAGER;
  }
  if (
    designation === Designation.SANDING_FINISHING_POLISHING_MANAGER ||
    (designation as unknown as string) === Role.SANDING_FINISHING_POLISHING_MANAGER
  ) {
    return Role.SANDING_FINISHING_POLISHING_MANAGER;
  }
  if (
    designation === Designation.KD_PACKAGING_HARDWARE_KITTING_MANAGER ||
    (designation as unknown as string) === Role.KD_PACKAGING_HARDWARE_KITTING_MANAGER
  ) {
    return Role.KD_PACKAGING_HARDWARE_KITTING_MANAGER;
  }

  // Dairy Specialized Roles
  if (
    designation === Designation.MILK_COLLECTION_RECEPTION_MANAGER ||
    (designation as unknown as string) === Role.MILK_COLLECTION_RECEPTION_MANAGER
  ) {
    return Role.MILK_COLLECTION_RECEPTION_MANAGER;
  }
  if (
    designation === Designation.PASTEURIZATION_PROCESSING_MANAGER ||
    (designation as unknown as string) === Role.PASTEURIZATION_PROCESSING_MANAGER
  ) {
    return Role.PASTEURIZATION_PROCESSING_MANAGER;
  }
  if (
    designation === Designation.FERMENTATION_CULTURE_MANAGER ||
    (designation as unknown as string) === Role.FERMENTATION_CULTURE_MANAGER
  ) {
    return Role.FERMENTATION_CULTURE_MANAGER;
  }
  if (
    designation === Designation.QA_MBRT_ANTIBIOTIC_INCHARGE ||
    (designation as unknown as string) === Role.QA_MBRT_ANTIBIOTIC_INCHARGE
  ) {
    return Role.QA_MBRT_ANTIBIOTIC_INCHARGE;
  }
  if (
    designation === Designation.COLD_CHAIN_EXPIRY_MANAGER ||
    (designation as unknown as string) === Role.COLD_CHAIN_EXPIRY_MANAGER
  ) {
    return Role.COLD_CHAIN_EXPIRY_MANAGER;
  }

  if (department === Department.EXECUTIVE || (department as string) === 'EXECUTIVE') {
    if (
      designation === Designation.SUPER_ADMIN ||
      (designation as string) === 'SUPER_ADMIN' ||
      designation === Designation.CEO ||
      (designation as string) === 'CEO' ||
      designation === Designation.MD ||
      (designation as string) === 'MD' ||
      designation === Designation.OWNER ||
      (designation as string) === 'OWNER' ||
      designation === Designation.EXECUTIVE ||
      (designation as string) === 'EXECUTIVE'
    ) {
      return (designation as unknown as Role) || Role.SUPER_ADMIN;
    }
    return Role.SUPER_ADMIN;
  }

  // Canonical Common Tenant Roles
  if ((designation as string) in Role) {
    return Role[designation as keyof typeof Role];
  }
  if ((department as string) in Role && designation === Designation.MANAGER) {
    const directRole = `${department}_MANAGER`;
    if (directRole in Role) {
      return Role[directRole as keyof typeof Role];
    }
    return Role[department as keyof typeof Role];
  }

  const resolvedKey = `${department}_${designation}`;
  if (resolvedKey in Role) {
    return Role[resolvedKey as keyof typeof Role];
  }

  if ((department as string) in Role) {
    return Role[department as keyof typeof Role];
  }

  throw new Error(`Invalid role combination: Department ${department}, Designation ${designation}`);
}
