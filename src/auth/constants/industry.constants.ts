/**
 * Strict Manufacturing Industry Categories & Sub-Categories Specification
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

export const CATEGORY_SUBCATEGORY_MAP: Record<IndustryCategory, SubCategory[]> = {
  [IndustryCategory.HEAVY_AND_RAW_MATERIALS]: [
    SubCategory.STEEL_AND_HEAVY_METALS,
    SubCategory.GLASS_AND_CERAMIC,
  ],
  [IndustryCategory.CHEMICAL_INDUSTRIES]: [
    SubCategory.CHEMICALS,
    SubCategory.PAINT,
    SubCategory.RUBBER_AND_TYRE,
    SubCategory.PLASTIC_AND_POLYMER,
    SubCategory.PIPES,
  ],
  [IndustryCategory.ENGINEERING_MACHINERY_AND_ELECTRONICS]: [
    SubCategory.AUTOMOBILES,
    SubCategory.ELECTRONICAL,
    SubCategory.CABLE_WIRES,
  ],
  [IndustryCategory.CONSUMER_GOODS]: [
    SubCategory.TEXTILES,
    SubCategory.JEWELLERY,
    SubCategory.LEATHER,
    SubCategory.FURNITURE,
  ],
  [IndustryCategory.FOOD]: [
    SubCategory.DAIRY_PRODUCT,
  ],
};

export const SUBCATEGORY_DEFAULT_UNIT_MAP: Record<SubCategory, string> = {
  [SubCategory.STEEL_AND_HEAVY_METALS]: 'MT',
  [SubCategory.GLASS_AND_CERAMIC]: 'm2',
  [SubCategory.CHEMICALS]: 'ltr',
  [SubCategory.PAINT]: 'ltr',
  [SubCategory.RUBBER_AND_TYRE]: 'kg',
  [SubCategory.PLASTIC_AND_POLYMER]: 'kg',
  [SubCategory.PIPES]: 'm',
  [SubCategory.AUTOMOBILES]: 'Pcs',
  [SubCategory.ELECTRONICAL]: 'Pcs',
  [SubCategory.CABLE_WIRES]: 'm',
  [SubCategory.TEXTILES]: 'm',
  [SubCategory.JEWELLERY]: 'gm',
  [SubCategory.LEATHER]: 'm2',
  [SubCategory.FURNITURE]: 'Pcs',
  [SubCategory.DAIRY_PRODUCT]: 'ltr',
};

export const ALL_INDUSTRY_CATEGORIES = Object.values(IndustryCategory);
export const ALL_SUB_CATEGORIES = Object.values(SubCategory);
