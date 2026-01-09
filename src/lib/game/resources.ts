import type { Resources, PlanetState } from '@/types/game';
import { calculateAllStorageCapacities, clampToStorage } from './formulas/storage';

const HOURS_PER_MS = 1 / (1000 * 60 * 60);

/**
 * Calculate current resources using lazy calculation
 * resources = stored + (rate * hoursSinceUpdate)
 * Capped at storage limits
 */
export function calculateCurrentResources(planet: PlanetState, now: Date = new Date()): Resources {
  const timeDeltaMs = now.getTime() - planet.lastResourceUpdate.getTime();
  const hours = timeDeltaMs * HOURS_PER_MS;

  // Calculate uncapped resources
  const uncappedResources: Resources = {
    metal: planet.metal + planet.metalPerHour * hours,
    crystal: planet.crystal + planet.crystalPerHour * hours,
    deuterium: planet.deuterium + planet.deuteriumPerHour * hours,
  };

  // Get storage capacities
  const capacities = calculateAllStorageCapacities(
    planet.metalStorageLevel,
    planet.crystalStorageLevel,
    planet.deuteriumStorageLevel
  );

  // Clamp to storage limits
  return clampToStorage(uncappedResources, capacities);
}

/**
 * Calculate resources at a specific future time
 * Useful for UI predictions
 */
export function calculateResourcesAt(planet: PlanetState, targetTime: Date): Resources {
  return calculateCurrentResources(planet, targetTime);
}

/**
 * Calculate time until storage is full for each resource (in seconds)
 * Returns null if already full, negative production, or zero production
 */
export function calculateTimeToFull(
  planet: PlanetState,
  now: Date = new Date()
): {
  metal: number | null;
  crystal: number | null;
  deuterium: number | null;
} {
  const current = calculateCurrentResources(planet, now);
  const capacities = calculateAllStorageCapacities(
    planet.metalStorageLevel,
    planet.crystalStorageLevel,
    planet.deuteriumStorageLevel
  );

  const calculateTime = (
    currentAmount: number,
    capacity: number,
    ratePerHour: number
  ): number | null => {
    if (ratePerHour <= 0) return null;
    if (currentAmount >= capacity) return null;

    const remaining = capacity - currentAmount;
    const hoursToFull = remaining / ratePerHour;
    return hoursToFull * 3600; // Convert to seconds
  };

  return {
    metal: calculateTime(current.metal, capacities.metal, planet.metalPerHour),
    crystal: calculateTime(current.crystal, capacities.crystal, planet.crystalPerHour),
    deuterium: calculateTime(current.deuterium, capacities.deuterium, planet.deuteriumPerHour),
  };
}

/**
 * Deduct resources from planet state
 * Returns new state with updated values and timestamp
 * Does NOT validate if resources are sufficient - caller must check first
 */
export function deductResources(
  planet: PlanetState,
  cost: Resources,
  now: Date = new Date()
): PlanetState {
  // First calculate current resources
  const current = calculateCurrentResources(planet, now);

  // Deduct costs
  return {
    ...planet,
    metal: current.metal - cost.metal,
    crystal: current.crystal - cost.crystal,
    deuterium: current.deuterium - cost.deuterium,
    lastResourceUpdate: now,
  };
}

/**
 * Add resources to planet state (e.g., for refunds)
 * Returns new state with updated values and timestamp
 */
export function addResources(
  planet: PlanetState,
  amount: Resources,
  now: Date = new Date()
): PlanetState {
  // First calculate current resources
  const current = calculateCurrentResources(planet, now);

  // Get storage capacities for capping
  const capacities = calculateAllStorageCapacities(
    planet.metalStorageLevel,
    planet.crystalStorageLevel,
    planet.deuteriumStorageLevel
  );

  // Add resources, capped at storage limits
  const newResources = clampToStorage(
    {
      metal: current.metal + amount.metal,
      crystal: current.crystal + amount.crystal,
      deuterium: current.deuterium + amount.deuterium,
    },
    capacities
  );

  return {
    ...planet,
    metal: newResources.metal,
    crystal: newResources.crystal,
    deuterium: newResources.deuterium,
    lastResourceUpdate: now,
  };
}
