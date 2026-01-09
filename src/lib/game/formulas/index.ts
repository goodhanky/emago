// Barrel export for all formula functions

// Constants
export {
  PRODUCTION_CONSTANTS,
  ENERGY_CONSTANTS,
  DEUTERIUM_TEMPERATURE,
  BUILDING_BASE_COSTS,
  MINE_COST_MULTIPLIER,
  FACILITY_COST_MULTIPLIER,
  STORAGE_COST_MULTIPLIER,
  MINE_BUILDINGS,
  FACILITY_BUILDINGS,
  STORAGE_BUILDINGS,
  RESEARCH_BASE_COSTS,
  RESEARCH_COST_MULTIPLIER,
  SHIP_COSTS,
  SHIP_STATS,
  TIME_CONSTANTS,
  STORAGE_CONSTANTS,
  BUILDING_PREREQUISITES,
  RESEARCH_PREREQUISITES,
  SHIP_PREREQUISITES,
} from './constants';

// Energy formulas
export {
  calculateMetalMineEnergyConsumption,
  calculateCrystalMineEnergyConsumption,
  calculateDeuteriumSynthesizerEnergyConsumption,
  calculateTotalEnergyConsumption,
  calculateEnergyFactor,
  calculateSolarPlantEnergy,
  calculateEnergyBalance,
} from './energy';

// Production formulas
export {
  calculateMetalProduction,
  calculateCrystalProduction,
  calculateDeuteriumProduction,
  calculateSolarEnergy,
  calculateAllProductionRates,
} from './production';

// Storage formulas
export {
  calculateStorageCapacity,
  calculateAllStorageCapacities,
  clampToStorage,
} from './storage';

// Cost formulas
export {
  calculateBuildingCost,
  calculateResearchCost,
  calculateShipCost,
  calculateShipBatchCost,
  hasEnoughResources,
  subtractResources,
} from './costs';

// Time formulas
export {
  calculateConstructionTime,
  calculateBuildingTime,
  calculateResearchTime,
  calculateTechResearchTime,
  calculateShipBuildTime,
  calculateShipTime,
  calculateShipBatchTime,
  formatDuration,
} from './time';
