import { TechType } from '@/lib/db';
import type { Resources, ResearchLevelsMap } from '@/types/game';
import {
  calculateResearchCost,
  hasEnoughResources,
  RESEARCH_PREREQUISITES,
} from '@/lib/game/formulas';

// ============================================
// VALIDATION TYPES
// ============================================

export interface ResearchValidationContext {
  techType: TechType;
  labLevel: number;
  currentResearchLevels: Partial<ResearchLevelsMap>;
  currentResources: Resources;
  hasActiveQueue: boolean;
}

export type ResearchValidationErrorCode =
  | 'QUEUE_ACTIVE'
  | 'LAB_LEVEL_INSUFFICIENT'
  | 'PREREQUISITES_NOT_MET'
  | 'INSUFFICIENT_RESOURCES'
  | 'INVALID_TECH';

export interface MissingResearchPrerequisite {
  type: 'research' | 'lab';
  name: string;
  requiredLevel: number;
  currentLevel: number;
}

export interface ResearchValidationResult {
  valid: boolean;
  error?: string;
  errorCode?: ResearchValidationErrorCode;
  details?: {
    required?: Resources;
    available?: Resources;
    missingPrerequisites?: MissingResearchPrerequisite[];
  };
}

// ============================================
// VALIDATION FUNCTION
// ============================================

/**
 * Validate if a research can be started
 * Checks: queue availability, lab level, research prerequisites, resources
 */
export function validateResearch(
  context: ResearchValidationContext
): ResearchValidationResult {
  const {
    techType,
    labLevel,
    currentResearchLevels,
    currentResources,
    hasActiveQueue,
  } = context;

  // 1. Check for active queue (only one research at a time per player)
  if (hasActiveQueue) {
    return {
      valid: false,
      error: 'Research is already in progress',
      errorCode: 'QUEUE_ACTIVE',
    };
  }

  // 2. Check prerequisites
  const prerequisites = RESEARCH_PREREQUISITES[techType];
  if (!prerequisites) {
    return {
      valid: false,
      error: 'Invalid technology type',
      errorCode: 'INVALID_TECH',
    };
  }

  const missingPrereqs: MissingResearchPrerequisite[] = [];

  // Check lab level requirement
  if (labLevel < prerequisites.labLevel) {
    missingPrereqs.push({
      type: 'lab',
      name: 'RESEARCH_LAB',
      requiredLevel: prerequisites.labLevel,
      currentLevel: labLevel,
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
    // Use specific error code for lab level vs research prerequisites
    const hasLabIssue = missingPrereqs.some((p) => p.type === 'lab');
    return {
      valid: false,
      error: hasLabIssue
        ? 'Research Lab level insufficient'
        : 'Research prerequisites not met',
      errorCode: hasLabIssue ? 'LAB_LEVEL_INSUFFICIENT' : 'PREREQUISITES_NOT_MET',
      details: { missingPrerequisites: missingPrereqs },
    };
  }

  // 3. Check resources
  const currentLevel = currentResearchLevels[techType] ?? 0;
  const targetLevel = currentLevel + 1;
  const cost = calculateResearchCost(techType, targetLevel);

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
 * Check if a research can be started (simplified boolean check)
 * Returns { canResearch: boolean, reason?: string }
 */
export function canResearch(
  techType: TechType,
  labLevel: number,
  researchLevels: Partial<ResearchLevelsMap>,
  resources: Resources,
  hasActiveQueue: boolean
): { canResearch: boolean; reason?: string } {
  if (hasActiveQueue) {
    return { canResearch: false, reason: 'queue_active' };
  }

  // Check lab level
  const prerequisites = RESEARCH_PREREQUISITES[techType];
  if (labLevel < prerequisites.labLevel) {
    return { canResearch: false, reason: 'lab_level' };
  }

  // Check research prerequisites
  if (prerequisites.research) {
    for (const [req, level] of Object.entries(prerequisites.research)) {
      if ((researchLevels[req as TechType] ?? 0) < level) {
        return { canResearch: false, reason: 'prerequisites' };
      }
    }
  }

  // Check resources
  const currentLevel = researchLevels[techType] ?? 0;
  const cost = calculateResearchCost(techType, currentLevel + 1);
  if (!hasEnoughResources(resources, cost)) {
    return { canResearch: false, reason: 'resources' };
  }

  return { canResearch: true };
}
