import { ShipType, TechType } from '@/lib/db';
import type { Resources, ResearchLevelsMap } from '@/types/game';
import {
  calculateShipBatchCost,
  hasEnoughResources,
  SHIP_PREREQUISITES,
} from '@/lib/game/formulas';

// ============================================
// VALIDATION TYPES
// ============================================

export interface ShipValidationContext {
  shipType: ShipType;
  quantity: number;
  shipyardLevel: number;
  currentResearchLevels: Partial<ResearchLevelsMap>;
  currentResources: Resources;
  hasActiveQueue: boolean;
}

export type ShipValidationErrorCode =
  | 'QUEUE_ACTIVE'
  | 'SHIPYARD_LEVEL_INSUFFICIENT'
  | 'PREREQUISITES_NOT_MET'
  | 'INSUFFICIENT_RESOURCES'
  | 'INVALID_SHIP'
  | 'INVALID_QUANTITY';

export interface MissingShipPrerequisite {
  type: 'shipyard' | 'research';
  name: string;
  requiredLevel: number;
  currentLevel: number;
}

export interface ShipValidationResult {
  valid: boolean;
  error?: string;
  errorCode?: ShipValidationErrorCode;
  details?: {
    required?: Resources;
    available?: Resources;
    missingPrerequisites?: MissingShipPrerequisite[];
  };
}

// ============================================
// VALIDATION FUNCTION
// ============================================

/**
 * Validate if ships can be built
 * Checks: quantity, queue availability, shipyard level, research prerequisites, resources
 */
export function validateShipBuild(
  context: ShipValidationContext
): ShipValidationResult {
  const {
    shipType,
    quantity,
    shipyardLevel,
    currentResearchLevels,
    currentResources,
    hasActiveQueue,
  } = context;

  // 1. Validate quantity (1-999)
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) {
    return {
      valid: false,
      error: 'Quantity must be between 1 and 999',
      errorCode: 'INVALID_QUANTITY',
    };
  }

  // 2. Check for active queue (only one ship build at a time per planet)
  if (hasActiveQueue) {
    return {
      valid: false,
      error: 'Ship construction is already in progress on this planet',
      errorCode: 'QUEUE_ACTIVE',
    };
  }

  // 3. Check prerequisites
  const prerequisites = SHIP_PREREQUISITES[shipType];
  if (!prerequisites) {
    return {
      valid: false,
      error: 'Invalid ship type',
      errorCode: 'INVALID_SHIP',
    };
  }

  const missingPrereqs: MissingShipPrerequisite[] = [];

  // Check shipyard level requirement
  if (shipyardLevel < prerequisites.shipyardLevel) {
    missingPrereqs.push({
      type: 'shipyard',
      name: 'SHIPYARD',
      requiredLevel: prerequisites.shipyardLevel,
      currentLevel: shipyardLevel,
    });
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
    const hasShipyardIssue = missingPrereqs.some((p) => p.type === 'shipyard');
    return {
      valid: false,
      error: hasShipyardIssue
        ? 'Shipyard level insufficient'
        : 'Research prerequisites not met',
      errorCode: hasShipyardIssue ? 'SHIPYARD_LEVEL_INSUFFICIENT' : 'PREREQUISITES_NOT_MET',
      details: { missingPrerequisites: missingPrereqs },
    };
  }

  // 4. Check resources for BATCH cost
  const batchCost = calculateShipBatchCost(shipType, quantity);

  if (!hasEnoughResources(currentResources, batchCost)) {
    return {
      valid: false,
      error: 'Insufficient resources',
      errorCode: 'INSUFFICIENT_RESOURCES',
      details: {
        required: batchCost,
        available: currentResources,
      },
    };
  }

  return { valid: true };
}

// ============================================
// SIMPLIFIED CHECK FUNCTION
// ============================================

/**
 * Check if ships can be built (simplified boolean check)
 * Returns { canBuild: boolean, reason?: string }
 */
export function canBuildShip(
  shipType: ShipType,
  quantity: number,
  shipyardLevel: number,
  researchLevels: Partial<ResearchLevelsMap>,
  resources: Resources,
  hasActiveQueue: boolean
): { canBuild: boolean; reason?: string } {
  // Validate quantity
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) {
    return { canBuild: false, reason: 'invalid_quantity' };
  }

  if (hasActiveQueue) {
    return { canBuild: false, reason: 'queue_active' };
  }

  const prerequisites = SHIP_PREREQUISITES[shipType];
  if (!prerequisites) {
    return { canBuild: false, reason: 'invalid_ship' };
  }

  // Check shipyard level
  if (shipyardLevel < prerequisites.shipyardLevel) {
    return { canBuild: false, reason: 'shipyard_level' };
  }

  // Check research prerequisites
  if (prerequisites.research) {
    for (const [req, level] of Object.entries(prerequisites.research)) {
      if ((researchLevels[req as TechType] ?? 0) < level) {
        return { canBuild: false, reason: 'prerequisites' };
      }
    }
  }

  // Check resources for batch
  const batchCost = calculateShipBatchCost(shipType, quantity);
  if (!hasEnoughResources(resources, batchCost)) {
    return { canBuild: false, reason: 'resources' };
  }

  return { canBuild: true };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Convert database ship array to counts map
 */
export function shipArrayToMap(
  ships: Array<{ type: ShipType; count: number }>
): Partial<Record<ShipType, number>> {
  return ships.reduce(
    (acc, s) => {
      acc[s.type] = s.count;
      return acc;
    },
    {} as Partial<Record<ShipType, number>>
  );
}
