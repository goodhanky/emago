import { BuildingType, TechType } from '@/lib/db';
import type {
  Resources,
  PlanetState,
  BuildingLevelsMap,
  ResearchLevelsMap,
} from '@/types/game';
import {
  calculateBuildingCost,
  hasEnoughResources,
  BUILDING_PREREQUISITES,
} from '@/lib/game/formulas';

// ============================================
// VALIDATION TYPES
// ============================================

export interface ValidationContext {
  buildingType: BuildingType;
  currentBuildingLevels: Partial<BuildingLevelsMap>;
  currentResearchLevels: Partial<ResearchLevelsMap>;
  currentResources: Resources;
  hasActiveQueue: boolean;
}

export type ValidationErrorCode =
  | 'QUEUE_ACTIVE'
  | 'PREREQUISITES_NOT_MET'
  | 'INSUFFICIENT_RESOURCES'
  | 'INVALID_BUILDING';

export interface MissingPrerequisite {
  type: 'building' | 'research';
  name: string;
  requiredLevel: number;
  currentLevel: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  errorCode?: ValidationErrorCode;
  details?: {
    required?: Resources;
    available?: Resources;
    missingPrerequisites?: MissingPrerequisite[];
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Convert database building array to levels map
 */
export function buildingArrayToMap(
  buildings: Array<{ type: BuildingType; level: number }>
): Partial<BuildingLevelsMap> {
  return buildings.reduce(
    (acc, b) => {
      acc[b.type] = b.level;
      return acc;
    },
    {} as Partial<BuildingLevelsMap>
  );
}

/**
 * Convert database research array to levels map
 */
export function researchArrayToMap(
  researches: Array<{ type: TechType; level: number }>
): Partial<ResearchLevelsMap> {
  return researches.reduce(
    (acc, r) => {
      acc[r.type] = r.level;
      return acc;
    },
    {} as Partial<ResearchLevelsMap>
  );
}

/**
 * Convert Planet database record to PlanetState for resource calculation
 */
export function planetToPlanetState(planet: {
  metal: number;
  crystal: number;
  deuterium: number;
  metalPerHour: number;
  crystalPerHour: number;
  deuteriumPerHour: number;
  lastResourceUpdate: Date;
  buildings: Array<{ type: BuildingType; level: number }>;
}): PlanetState {
  const buildingLevels = buildingArrayToMap(planet.buildings);
  return {
    metal: planet.metal,
    crystal: planet.crystal,
    deuterium: planet.deuterium,
    metalPerHour: planet.metalPerHour,
    crystalPerHour: planet.crystalPerHour,
    deuteriumPerHour: planet.deuteriumPerHour,
    lastResourceUpdate: planet.lastResourceUpdate,
    metalStorageLevel: buildingLevels.METAL_STORAGE ?? 0,
    crystalStorageLevel: buildingLevels.CRYSTAL_STORAGE ?? 0,
    deuteriumStorageLevel: buildingLevels.DEUTERIUM_TANK ?? 0,
  };
}

// ============================================
// VALIDATION FUNCTION
// ============================================

/**
 * Validate if a building can be upgraded
 * Checks: queue availability, prerequisites, resources
 */
export function validateBuildingUpgrade(
  context: ValidationContext
): ValidationResult {
  const {
    buildingType,
    currentBuildingLevels,
    currentResearchLevels,
    currentResources,
    hasActiveQueue,
  } = context;

  // 1. Check for active queue
  if (hasActiveQueue) {
    return {
      valid: false,
      error: 'A building is already being constructed on this planet',
      errorCode: 'QUEUE_ACTIVE',
    };
  }

  // 2. Check prerequisites
  const prerequisites = BUILDING_PREREQUISITES[buildingType];
  const missingPrereqs: MissingPrerequisite[] = [];

  // Check building prerequisites
  if (prerequisites.building) {
    for (const [reqBuilding, reqLevel] of Object.entries(prerequisites.building)) {
      const currentLevel = currentBuildingLevels[reqBuilding as BuildingType] ?? 0;
      if (currentLevel < reqLevel) {
        missingPrereqs.push({
          type: 'building',
          name: reqBuilding,
          requiredLevel: reqLevel,
          currentLevel,
        });
      }
    }
  }

  // Check research prerequisites
  if (prerequisites.research) {
    for (const [reqTech, reqLevel] of Object.entries(prerequisites.research)) {
      const currentLevel = currentResearchLevels[reqTech as TechType] ?? 0;
      if (currentLevel < reqLevel) {
        missingPrereqs.push({
          type: 'research',
          name: reqTech,
          requiredLevel: reqLevel,
          currentLevel,
        });
      }
    }
  }

  if (missingPrereqs.length > 0) {
    return {
      valid: false,
      error: 'Prerequisites not met',
      errorCode: 'PREREQUISITES_NOT_MET',
      details: { missingPrerequisites: missingPrereqs },
    };
  }

  // 3. Check resources
  const currentLevel = currentBuildingLevels[buildingType] ?? 0;
  const targetLevel = currentLevel + 1;
  const cost = calculateBuildingCost(buildingType, targetLevel);

  if (!hasEnoughResources(currentResources, cost)) {
    return {
      valid: false,
      error: 'Insufficient resources',
      errorCode: 'INSUFFICIENT_RESOURCES',
      details: {
        required: cost,
        available: currentResources,
      },
    };
  }

  return { valid: true };
}

/**
 * Check if a building can be upgraded (simplified boolean check)
 * Returns { canUpgrade: boolean, reason?: string }
 */
export function canUpgradeBuilding(
  buildingType: BuildingType,
  buildingLevels: Partial<BuildingLevelsMap>,
  researchLevels: Partial<ResearchLevelsMap>,
  resources: Resources,
  hasActiveQueue: boolean
): { canUpgrade: boolean; reason?: string } {
  if (hasActiveQueue) {
    return { canUpgrade: false, reason: 'queue_active' };
  }

  // Check building prerequisites
  const prerequisites = BUILDING_PREREQUISITES[buildingType];
  if (prerequisites.building) {
    for (const [req, level] of Object.entries(prerequisites.building)) {
      if ((buildingLevels[req as BuildingType] ?? 0) < level) {
        return { canUpgrade: false, reason: 'prerequisites' };
      }
    }
  }

  // Check research prerequisites
  if (prerequisites.research) {
    for (const [req, level] of Object.entries(prerequisites.research)) {
      if ((researchLevels[req as TechType] ?? 0) < level) {
        return { canUpgrade: false, reason: 'prerequisites' };
      }
    }
  }

  // Check resources
  const currentLevel = buildingLevels[buildingType] ?? 0;
  const cost = calculateBuildingCost(buildingType, currentLevel + 1);
  if (!hasEnoughResources(resources, cost)) {
    return { canUpgrade: false, reason: 'resources' };
  }

  return { canUpgrade: true };
}
