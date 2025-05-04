// Type definitions

// Main data handling object with callable functions from script
export interface Data {
  addArrayEntry(data: any, path: (string|number)[], value: string|null): void;
  deleteArrayEntry(data: any, path: (string|number)[], id: number): void;
  fromJSON(obj: any, ...args: any): AllSolutions;
  toJSON(data: AllSolutions): string;
  setExampleData(data: AllSolutions): AllSolutions;
  updateData(data: any, path: any[], value: any): void;
  updateSolutionResults(data: AllSolutions): Results[]|null
}

// Interface for all Solutions and current selected Solution
export interface AllSolutions {
  selected: number;
  solutions: Solution[];
}

// Interface for Solutions
export interface Solution {
  id : number;
  name : string;
  nutrients : Nutrient[];
  products : Product[];
}

// Interface for Nutrients
export interface Nutrient {
  id : number;
  name : string;
  amount : number;
  unit : string;
}

// Interface for Products
export interface Product {
  id : number;
  name : string;
  form : string;
  totalAmount : number;
  totalUnits: string
  serveSize : number;
  serveUnits : string;
  price: number;
  ingredients : Ingredient[];
}

// Interface for Ingredients
export interface Ingredient {
  id : number;
  name : string;
  amountPerServe : number;
  unit : string;
}

// Interface for the matrix created for optimizing the Product ratios
export interface ProductMatrix {
  name: string;
  nutrient: number[];
  price: number;
}

// Interface for results obtained from optimization of Product ratios
export interface ProductResult {
  name: string;
  amount: number;
  serve: string|number;
  totalServe: number;
  unit: string;
}

// Interface for results obtained from optimization of Nutrient ratios
export interface NutrientResult {
  name: string;
  requirement: boolean;
  amount: number;
  unit: string;
  targetDifference: number|null;
  targetUnit: string
}

// Interface for final results obtained from optimization
export interface Results {
  bounded : boolean;
  feasible : boolean;
  price: number;
  products: ProductResult[];
  nutrients: NutrientResult[];
}


// Generic object type for each row to create objects for storing input error and value states
export type InputFieldProperties = {
  [key: string]: number|string|undefined
}

// Interface for unit values
export interface UnitConversions {
  [key: string]: number;
  'g' : number;
  'mg' : number;
  'μg / mcg' : number;
  'L' : number;
  'mL' : number;
}

// Weight units
export const wUnits : string[] = [
  'g',
  'mg',
  'μg / mcg'
];

// Volume units
export const lUnits : string[] = [
  'L',
  'mL'
];

// Form states
export const forms : string[] = [
  'capsule',
  'liquid',
  'powder',
  'tablet'
];

// Unit values
export const unitConv: UnitConversions = {
  'g': 1,
  'mg': 1e-3,
  'μg / mcg': 1e-6,
  'L': 1,
  'mL': 1e-3
}