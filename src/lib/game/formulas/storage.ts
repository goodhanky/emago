import type { Resources } from '@/types/game';
import { STORAGE_CONSTANTS } from './constants';

/**
 * Calculate storage capacity for a given storage level
 * Formula: 5000 * floor(2.5 * e^(20 * level / 33))
 */
export function calculateStorageCapacity(level: number): number {
  const exponent =
    (STORAGE_CONSTANTS.EXPONENT_MULTIPLIER * level) / STORAGE_CONSTANTS.EXPONENT_DIVISOR;

  return (
    STORAGE_CONSTANTS.BASE_CAPACITY *
    Math.floor(STORAGE_CONSTANTS.CAPACITY_MULTIPLIER * Math.exp(exponent))
  );
}

/**
 * Get storage capacities for all resource types
 */
export function calculateAllStorageCapacities(
  metalStorageLevel: number,
  crystalStorageLevel: number,
  deuteriumTankLevel: number
): Resources {
  return {
    metal: calculateStorageCapacity(metalStorageLevel),
    crystal: calculateStorageCapacity(crystalStorageLevel),
    deuterium: calculateStorageCapacity(deuteriumTankLevel),
  };
}

/**
 * Clamp resources to storage limits
 */
export function clampToStorage(resources: Resources, capacities: Resources): Resources {
  return {
    metal: Math.min(resources.metal, capacities.metal),
    crystal: Math.min(resources.crystal, capacities.crystal),
    deuterium: Math.min(resources.deuterium, capacities.deuterium),
  };
}
