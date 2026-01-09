import { BuildingType, TechType, ShipType } from '@/lib/db';
import type { BuildingCost, ResearchCost, ShipCost, Resources } from '@/types/game';
import {
  BUILDING_BASE_COSTS,
  MINE_BUILDINGS,
  FACILITY_BUILDINGS,
  STORAGE_BUILDINGS,
  MINE_COST_MULTIPLIER,
  FACILITY_COST_MULTIPLIER,
  STORAGE_COST_MULTIPLIER,
  RESEARCH_BASE_COSTS,
  RESEARCH_COST_MULTIPLIER,
  SHIP_COSTS,
} from './constants';

/**
 * Calculate building upgrade cost for next level
 * Mines/Solar: base * 1.5^(level-1)
 * Facilities: base * 2^(level-1)
 * Storage: base * 2^level
 */
export function calculateBuildingCost(
  buildingType: BuildingType,
  targetLevel: number
): BuildingCost {
  if (targetLevel < 1) {
    throw new Error('Target level must be at least 1');
  }

  const baseCosts = BUILDING_BASE_COSTS[buildingType];

  let multiplier: number;

  if (MINE_BUILDINGS.includes(buildingType)) {
    // Mines and Solar Plant: base * 1.5^(level-1)
    multiplier = Math.pow(MINE_COST_MULTIPLIER, targetLevel - 1);
  } else if (FACILITY_BUILDINGS.includes(buildingType)) {
    // Facilities: base * 2^(level-1)
    multiplier = Math.pow(FACILITY_COST_MULTIPLIER, targetLevel - 1);
  } else if (STORAGE_BUILDINGS.includes(buildingType)) {
    // Storage: base * 2^level (note: NOT level-1)
    multiplier = Math.pow(STORAGE_COST_MULTIPLIER, targetLevel);
  } else {
    // Default to facility multiplier
    multiplier = Math.pow(FACILITY_COST_MULTIPLIER, targetLevel - 1);
  }

  return {
    metal: Math.floor(baseCosts.metal * multiplier),
    crystal: Math.floor(baseCosts.crystal * multiplier),
    deuterium: Math.floor(baseCosts.deuterium * multiplier),
  };
}

/**
 * Calculate research cost for next level
 * Formula: base * 2^(level-1)
 */
export function calculateResearchCost(techType: TechType, targetLevel: number): ResearchCost {
  if (targetLevel < 1) {
    throw new Error('Target level must be at least 1');
  }

  const baseCosts = RESEARCH_BASE_COSTS[techType];
  const multiplier = Math.pow(RESEARCH_COST_MULTIPLIER, targetLevel - 1);

  return {
    metal: Math.floor(baseCosts.metal * multiplier),
    crystal: Math.floor(baseCosts.crystal * multiplier),
    deuterium: Math.floor(baseCosts.deuterium * multiplier),
  };
}

/**
 * Calculate ship cost (static, not level-dependent)
 */
export function calculateShipCost(shipType: ShipType): ShipCost {
  const costs = SHIP_COSTS[shipType];
  return {
    metal: costs.metal,
    crystal: costs.crystal,
    deuterium: costs.deuterium,
  };
}

/**
 * Calculate total cost for building a batch of ships
 */
export function calculateShipBatchCost(shipType: ShipType, quantity: number): ShipCost {
  if (quantity < 1) {
    throw new Error('Quantity must be at least 1');
  }

  const unitCost = calculateShipCost(shipType);

  return {
    metal: unitCost.metal * quantity,
    crystal: unitCost.crystal * quantity,
    deuterium: unitCost.deuterium * quantity,
  };
}

/**
 * Check if resources are sufficient for a cost
 */
export function hasEnoughResources(available: Resources, required: Resources): boolean {
  return (
    available.metal >= required.metal &&
    available.crystal >= required.crystal &&
    available.deuterium >= required.deuterium
  );
}

/**
 * Subtract cost from available resources
 * Returns negative values if insufficient resources
 */
export function subtractResources(available: Resources, cost: Resources): Resources {
  return {
    metal: available.metal - cost.metal,
    crystal: available.crystal - cost.crystal,
    deuterium: available.deuterium - cost.deuterium,
  };
}
