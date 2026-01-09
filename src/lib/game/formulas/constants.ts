import { BuildingType, TechType, ShipType } from '@/lib/db';
import type {
  BuildingPrerequisite,
  ResearchPrerequisite,
  ShipPrerequisite,
  ShipStats,
} from '@/types/game';

// ============================================
// PRODUCTION CONSTANTS
// ============================================

export const PRODUCTION_CONSTANTS = {
  METAL_BASE: 30,
  CRYSTAL_BASE: 20,
  DEUTERIUM_BASE: 10,
  SOLAR_BASE: 20,
  MULTIPLIER: 1.1,
} as const;

export const ENERGY_CONSTANTS = {
  METAL_MINE_CONSUMPTION_BASE: 10,
  CRYSTAL_MINE_CONSUMPTION_BASE: 10,
  DEUTERIUM_SYNTHESIZER_CONSUMPTION_BASE: 20,
} as const;

export const DEUTERIUM_TEMPERATURE = {
  BASE_FACTOR: 1.36,
  TEMPERATURE_COEFFICIENT: 0.004,
} as const;

// ============================================
// BUILDING COST CONSTANTS
// ============================================

export const BUILDING_BASE_COSTS: Record<
  BuildingType,
  { metal: number; crystal: number; deuterium: number }
> = {
  METAL_MINE: { metal: 80, crystal: 20, deuterium: 0 },
  CRYSTAL_MINE: { metal: 64, crystal: 32, deuterium: 0 },
  DEUTERIUM_SYNTHESIZER: { metal: 340, crystal: 100, deuterium: 0 },
  SOLAR_PLANT: { metal: 100, crystal: 40, deuterium: 0 },
  METAL_STORAGE: { metal: 10000, crystal: 0, deuterium: 0 },
  CRYSTAL_STORAGE: { metal: 10000, crystal: 5000, deuterium: 0 },
  DEUTERIUM_TANK: { metal: 10000, crystal: 10000, deuterium: 0 },
  RESEARCH_LAB: { metal: 200, crystal: 400, deuterium: 200 },
  SHIPYARD: { metal: 400, crystal: 200, deuterium: 100 },
  ROBOT_FACTORY: { metal: 400, crystal: 120, deuterium: 200 },
  NANITE_FACTORY: { metal: 1000000, crystal: 500000, deuterium: 100000 },
};

export const MINE_COST_MULTIPLIER = 1.5;
export const FACILITY_COST_MULTIPLIER = 2;
export const STORAGE_COST_MULTIPLIER = 2;

// Buildings that use mine multiplier (1.5)
export const MINE_BUILDINGS: BuildingType[] = [
  'METAL_MINE',
  'CRYSTAL_MINE',
  'DEUTERIUM_SYNTHESIZER',
  'SOLAR_PLANT',
];

// Buildings that use facility multiplier (2)
export const FACILITY_BUILDINGS: BuildingType[] = [
  'RESEARCH_LAB',
  'SHIPYARD',
  'ROBOT_FACTORY',
  'NANITE_FACTORY',
];

// Buildings that use storage formula (2^level)
export const STORAGE_BUILDINGS: BuildingType[] = [
  'METAL_STORAGE',
  'CRYSTAL_STORAGE',
  'DEUTERIUM_TANK',
];

// ============================================
// RESEARCH COST CONSTANTS
// ============================================

export const RESEARCH_BASE_COSTS: Record<
  TechType,
  { metal: number; crystal: number; deuterium: number }
> = {
  ENERGY: { metal: 0, crystal: 800, deuterium: 400 },
  COMPUTER: { metal: 0, crystal: 400, deuterium: 600 },
  WEAPONS: { metal: 800, crystal: 200, deuterium: 0 },
  SHIELDING: { metal: 200, crystal: 600, deuterium: 0 },
  ARMOR: { metal: 1000, crystal: 0, deuterium: 0 },
  COMBUSTION_DRIVE: { metal: 400, crystal: 0, deuterium: 600 },
  IMPULSE_DRIVE: { metal: 2000, crystal: 4000, deuterium: 600 },
  HYPERSPACE_DRIVE: { metal: 10000, crystal: 20000, deuterium: 6000 },
  ESPIONAGE: { metal: 200, crystal: 1000, deuterium: 200 },
};

export const RESEARCH_COST_MULTIPLIER = 2;

// ============================================
// SHIP COST CONSTANTS
// ============================================

export const SHIP_COSTS: Record<
  ShipType,
  { metal: number; crystal: number; deuterium: number }
> = {
  SMALL_CARGO: { metal: 2000, crystal: 2000, deuterium: 0 },
  LARGE_CARGO: { metal: 6000, crystal: 6000, deuterium: 0 },
  LIGHT_FIGHTER: { metal: 3000, crystal: 1000, deuterium: 0 },
  HEAVY_FIGHTER: { metal: 6000, crystal: 4000, deuterium: 0 },
  CRUISER: { metal: 20000, crystal: 7000, deuterium: 2000 },
};

export const SHIP_STATS: Record<ShipType, ShipStats> = {
  SMALL_CARGO: {
    hull: 4000,
    shield: 10,
    weapon: 5,
    cargo: 5000,
    speed: 5000,
    fuelPerUnit: 10,
  },
  LARGE_CARGO: {
    hull: 12000,
    shield: 25,
    weapon: 5,
    cargo: 25000,
    speed: 7500,
    fuelPerUnit: 50,
  },
  LIGHT_FIGHTER: {
    hull: 4000,
    shield: 10,
    weapon: 50,
    cargo: 50,
    speed: 12500,
    fuelPerUnit: 20,
  },
  HEAVY_FIGHTER: {
    hull: 10000,
    shield: 25,
    weapon: 150,
    cargo: 100,
    speed: 10000,
    fuelPerUnit: 75,
  },
  CRUISER: {
    hull: 27000,
    shield: 50,
    weapon: 400,
    cargo: 800,
    speed: 15000,
    fuelPerUnit: 300,
  },
};

// ============================================
// TIME CALCULATION CONSTANTS
// ============================================

export const TIME_CONSTANTS = {
  CONSTRUCTION_BASE: 2500,
  RESEARCH_BASE: 1000,
  SECONDS_PER_HOUR: 3600,
  MINIMUM_SECONDS: 1,
} as const;

// ============================================
// STORAGE CONSTANTS
// ============================================

export const STORAGE_CONSTANTS = {
  BASE_CAPACITY: 5000,
  CAPACITY_MULTIPLIER: 2.5,
  EXPONENT_DIVISOR: 33,
  EXPONENT_MULTIPLIER: 20,
} as const;

// ============================================
// BUILDING PREREQUISITES
// ============================================

export const BUILDING_PREREQUISITES: Record<BuildingType, BuildingPrerequisite> = {
  METAL_MINE: {},
  CRYSTAL_MINE: {},
  DEUTERIUM_SYNTHESIZER: {},
  SOLAR_PLANT: {},
  METAL_STORAGE: {},
  CRYSTAL_STORAGE: {},
  DEUTERIUM_TANK: {},
  RESEARCH_LAB: {},
  ROBOT_FACTORY: {},
  SHIPYARD: { building: { ROBOT_FACTORY: 2 } },
  NANITE_FACTORY: { building: { ROBOT_FACTORY: 10 }, research: { COMPUTER: 10 } },
};

// ============================================
// RESEARCH PREREQUISITES
// ============================================

export const RESEARCH_PREREQUISITES: Record<TechType, ResearchPrerequisite> = {
  ENERGY: { labLevel: 1 },
  COMPUTER: { labLevel: 1 },
  WEAPONS: { labLevel: 4 },
  SHIELDING: { labLevel: 6, research: { ENERGY: 3 } },
  ARMOR: { labLevel: 2 },
  COMBUSTION_DRIVE: { labLevel: 1, research: { ENERGY: 1 } },
  IMPULSE_DRIVE: { labLevel: 2, research: { ENERGY: 1 } },
  HYPERSPACE_DRIVE: { labLevel: 7 },
  ESPIONAGE: { labLevel: 3 },
};

// ============================================
// SHIP PREREQUISITES
// ============================================

export const SHIP_PREREQUISITES: Record<ShipType, ShipPrerequisite> = {
  SMALL_CARGO: { shipyardLevel: 2, research: { COMBUSTION_DRIVE: 2 } },
  LARGE_CARGO: { shipyardLevel: 4, research: { COMBUSTION_DRIVE: 6 } },
  LIGHT_FIGHTER: { shipyardLevel: 1, research: { COMBUSTION_DRIVE: 1 } },
  HEAVY_FIGHTER: { shipyardLevel: 3, research: { ARMOR: 2, IMPULSE_DRIVE: 2 } },
  CRUISER: { shipyardLevel: 5, research: { IMPULSE_DRIVE: 4, WEAPONS: 2 } },
};
