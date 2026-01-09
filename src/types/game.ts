import type { BuildingType, TechType } from '@/lib/db';

// ============================================
// RESOURCE TYPES
// ============================================

export interface Resources {
  metal: number;
  crystal: number;
  deuterium: number;
}

export interface ResourceRates {
  metalPerHour: number;
  crystalPerHour: number;
  deuteriumPerHour: number;
}

export interface EnergyBalance {
  production: number;
  consumption: number;
  factor: number; // 0.0 to 1.0
}

// ============================================
// COST TYPES
// ============================================

export type BuildingCost = Resources;

export type ResearchCost = Resources;

export type ShipCost = Resources;

// ============================================
// BUILDING TYPES
// ============================================

export type BuildingLevelsMap = Record<BuildingType, number>;

export interface BuildingInfo {
  type: BuildingType;
  level: number;
}

// ============================================
// RESEARCH TYPES
// ============================================

export type ResearchLevelsMap = Record<TechType, number>;

// ============================================
// SHIP TYPES
// ============================================

export interface ShipStats {
  hull: number;
  shield: number;
  weapon: number;
  cargo: number;
  speed: number;
  fuelPerUnit: number;
}

// ============================================
// PRODUCTION INPUT TYPES
// ============================================

export interface ProductionInput {
  mineLevel: number;
  energyFactor: number;
}

export interface DeuteriumProductionInput extends ProductionInput {
  planetTemperature: number;
}

// ============================================
// TIME CALCULATION TYPES
// ============================================

export interface ConstructionTimeInput {
  metalCost: number;
  crystalCost: number;
  robotFactoryLevel: number;
  naniteFactoryLevel: number;
}

export interface ResearchTimeInput {
  metalCost: number;
  crystalCost: number;
  deuteriumCost: number;
  labLevel: number;
}

export interface ShipBuildTimeInput {
  metalCost: number;
  crystalCost: number;
  shipyardLevel: number;
  naniteFactoryLevel: number;
}

// ============================================
// PLANET STATE TYPE (for lazy calculation)
// ============================================

export interface PlanetState {
  metal: number;
  crystal: number;
  deuterium: number;
  metalPerHour: number;
  crystalPerHour: number;
  deuteriumPerHour: number;
  lastResourceUpdate: Date;
  metalStorageLevel: number;
  crystalStorageLevel: number;
  deuteriumStorageLevel: number;
}

// ============================================
// PREREQUISITE TYPES
// ============================================

export interface BuildingPrerequisite {
  building?: Partial<Record<BuildingType, number>>;
  research?: Partial<Record<TechType, number>>;
}

export interface ResearchPrerequisite {
  labLevel: number;
  research?: Partial<Record<TechType, number>>;
}

export interface ShipPrerequisite {
  shipyardLevel: number;
  research?: Partial<Record<TechType, number>>;
}
