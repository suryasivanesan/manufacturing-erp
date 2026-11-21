/**
 * Strict Manufacturing Industry Categories & Sub-Categories Specification
 * Defined strictly according to ERP standard classification:
 * 1. Heavy and Raw Materials: Steel and Heavy Metals, Glass and Ceramic
 * 2. Chemical Industries: Chemicals, Paint, Rubber & Tyre, Plastic and Polymer, Pipes
 * 3. Engineering, Machinery and Electronics: Automobiles, Electronical, Cable Wires
 * 4. Consumer Goods: Textiles, Jewellery, Leather, Furniture
 * 5. Food: Dairy Product
 */

export enum IndustryCategory {
  HEAVY_AND_RAW_MATERIALS = 'Heavy and Raw Materials',
  CHEMICAL_INDUSTRIES = 'Chemical Industries',
  ENGINEERING_MACHINERY_AND_ELECTRONICS = 'Engineering, Machinery and Electronics',
  CONSUMER_GOODS = 'Consumer Goods',
  FOOD = 'Food',
}

export enum SubCategory {
  // 1. Heavy and Raw Materials
  STEEL_AND_HEAVY_METALS = 'Steel and Heavy Metals',
  GLASS_AND_CERAMIC = 'Glass and Ceramic',

  // 2. Chemical Industries
  CHEMICALS = 'Chemicals',
  PAINT = 'Paint',
  RUBBER_AND_TYRE = 'Rubber & Tyre',
  PLASTIC_AND_POLYMER = 'Plastic and Polymer',
  PIPES = 'Pipes',

  // 3. Engineering, Machinery and Electronics
  AUTOMOBILES = 'Automobiles',
  ELECTRONICAL = 'Electronical',
  CABLE_WIRES = 'Cable Wires',

  // 4. Consumer Goods
  TEXTILES = 'Textiles',
  JEWELLERY = 'Jewellery',
  LEATHER = 'Leather',
  FURNITURE = 'Furniture',

  // 5. Food
  DAIRY_PRODUCT = 'Dairy Product',
}

export interface IndustrySectorMeta {
  name: string;
  defaultUnit: string;
  unitLabel: string;
  examples: string;
}

export interface IndustryClassification {
  id: string;
  name: string;
  sectors: IndustrySectorMeta[];
}

export const INDUSTRY_CLASSIFICATIONS: IndustryClassification[] = [
  {
    id: 'heavy-raw',
    name: IndustryCategory.HEAVY_AND_RAW_MATERIALS,
    sectors: [
      {
        name: SubCategory.STEEL_AND_HEAVY_METALS,
        defaultUnit: 'MT',
        unitLabel: 'MT (Metric Tons)',
        examples: 'Structural steel, TMT rebars, billets, coils',
      },
      {
        name: SubCategory.GLASS_AND_CERAMIC,
        defaultUnit: 'm2',
        unitLabel: 'm² (Square Meters)',
        examples: 'Float glass, vitrified ceramic tiles, containers',
      },
    ],
  },
  {
    id: 'chemical-industries',
    name: IndustryCategory.CHEMICAL_INDUSTRIES,
    sectors: [
      {
        name: SubCategory.CHEMICALS,
        defaultUnit: 'ltr',
        unitLabel: 'ltr (Liters)',
        examples: 'Industrial chemicals, specialty solvents, reagents',
      },
      {
        name: SubCategory.PAINT,
        defaultUnit: 'ltr',
        unitLabel: 'ltr (Liters)',
        examples: 'Emulsions, enamels, primers, industrial coatings',
      },
      {
        name: SubCategory.RUBBER_AND_TYRE,
        defaultUnit: 'kg',
        unitLabel: 'kg (Kilograms)',
        examples: 'Natural rubber, automotive tyres, vulcanized goods',
      },
      {
        name: SubCategory.PLASTIC_AND_POLYMER,
        defaultUnit: 'kg',
        unitLabel: 'kg (Kilograms)',
        examples: 'HDPE/PP granules, masterbatches, polymers',
      },
      {
        name: SubCategory.PIPES,
        defaultUnit: 'm',
        unitLabel: 'm (Meters)',
        examples: 'PVC/CPVC pipes, HDPE conduits, seamless conduits',
      },
    ],
  },
  {
    id: 'engineering-machinery-electronics',
    name: IndustryCategory.ENGINEERING_MACHINERY_AND_ELECTRONICS,
    sectors: [
      {
        name: SubCategory.AUTOMOBILES,
        defaultUnit: 'Pcs',
        unitLabel: 'Pcs (Pieces)',
        examples: 'Vehicle assemblies, transmissions, chassis components',
      },
      {
        name: SubCategory.ELECTRONICAL,
        defaultUnit: 'Pcs',
        unitLabel: 'Pcs (Pieces)',
        examples: 'Transformers, switchgears, industrial panels, motors',
      },
      {
        name: SubCategory.CABLE_WIRES,
        defaultUnit: 'm',
        unitLabel: 'm (Meters)',
        examples: 'Copper insulated wires, power cables, armored lines',
      },
    ],
  },
  {
    id: 'consumer-goods',
    name: IndustryCategory.CONSUMER_GOODS,
    sectors: [
      {
        name: SubCategory.TEXTILES,
        defaultUnit: 'm',
        unitLabel: 'm (Meters)',
        examples: 'Woven fabrics, synthetic yarns, apparel bolts',
      },
      {
        name: SubCategory.JEWELLERY,
        defaultUnit: 'gm',
        unitLabel: 'gm (Grams)',
        examples: 'Precious metal alloys, gold/silver ornaments, gems',
      },
      {
        name: SubCategory.LEATHER,
        defaultUnit: 'm2',
        unitLabel: 'm² (Square Meters)',
        examples: 'Finished hides, leather goods, footwear uppers',
      },
      {
        name: SubCategory.FURNITURE,
        defaultUnit: 'Pcs',
        unitLabel: 'Pcs (Pieces)',
        examples: 'Modular workstations, desks, wooden & metal seating',
      },
    ],
  },
  {
    id: 'food',
    name: IndustryCategory.FOOD,
    sectors: [
      {
        name: SubCategory.DAIRY_PRODUCT,
        defaultUnit: 'ltr',
        unitLabel: 'ltr (Liters)',
        examples: 'Pasteurized milk, cream, liquid dairy commodities',
      },
    ],
  },
];

export const ALL_INDUSTRY_CATEGORIES = Object.values(IndustryCategory);
export const ALL_SUB_CATEGORIES = Object.values(SubCategory);

export function getSectorsForCategory(categoryName: string): IndustrySectorMeta[] {
  const match = INDUSTRY_CLASSIFICATIONS.find((c) => c.name === categoryName);
  return match ? match.sectors : INDUSTRY_CLASSIFICATIONS[0].sectors;
}

export function getDefaultUnitForSector(subCategoryName: string): string {
  for (const cat of INDUSTRY_CLASSIFICATIONS) {
    const sector = cat.sectors.find((s) => s.name === subCategoryName);
    if (sector) return sector.defaultUnit;
  }
  return 'MT';
}
