import { BuildingType, TechType, ShipType } from '@/lib/db';
import type { ConstructionTimeInput, ResearchTimeInput, ShipBuildTimeInput } from '@/types/game';
import { TIME_CONSTANTS, GAME_SPEED } from './constants';
import { calculateBuildingCost, calculateResearchCost, calculateShipCost } from './costs';

/**
 * Calculate building construction time in seconds
 * Formula: (metal + crystal) / (2500 * (1 + robotLevel) * 2^naniteLevel) * 3600
 */
export function calculateConstructionTime(input: ConstructionTimeInput): number {
  const { metalCost, crystalCost, robotFactoryLevel, naniteFactoryLevel } = input;

  const totalCost = metalCost + crystalCost;
  const divisor =
    TIME_CONSTANTS.CONSTRUCTION_BASE *
    (1 + robotFactoryLevel) *
    Math.pow(2, naniteFactoryLevel);

  const seconds = (totalCost / divisor) * TIME_CONSTANTS.SECONDS_PER_HOUR / GAME_SPEED;

  return Math.max(TIME_CONSTANTS.MINIMUM_SECONDS, Math.floor(seconds));
}

/**
 * Calculate building construction time given building type and levels
 */
export function calculateBuildingTime(
  buildingType: BuildingType,
  targetLevel: number,
  robotFactoryLevel: number,
  naniteFactoryLevel: number
): number {
  const cost = calculateBuildingCost(buildingType, targetLevel);

  return calculateConstructionTime({
    metalCost: cost.metal,
    crystalCost: cost.crystal,
    robotFactoryLevel,
    naniteFactoryLevel,
  });
}

/**
 * Calculate research time in seconds
 * Formula: (metal + crystal + deut) / (1000 * (1 + labLevel)) * 3600
 */
export function calculateResearchTime(input: ResearchTimeInput): number {
  const { metalCost, crystalCost, deuteriumCost, labLevel } = input;

  const totalCost = metalCost + crystalCost + deuteriumCost;
  const divisor = TIME_CONSTANTS.RESEARCH_BASE * (1 + labLevel);

  const seconds = (totalCost / divisor) * TIME_CONSTANTS.SECONDS_PER_HOUR / GAME_SPEED;

  return Math.max(TIME_CONSTANTS.MINIMUM_SECONDS, Math.floor(seconds));
}

/**
 * Calculate research time given tech type and lab level
 */
export function calculateTechResearchTime(
  techType: TechType,
  targetLevel: number,
  labLevel: number
): number {
  const cost = calculateResearchCost(techType, targetLevel);

  return calculateResearchTime({
    metalCost: cost.metal,
    crystalCost: cost.crystal,
    deuteriumCost: cost.deuterium,
    labLevel,
  });
}

/**
 * Calculate single ship build time in seconds
 * Formula: (metal + crystal) / (2500 * (1 + shipyardLevel) * 2^naniteLevel) * 3600
 */
export function calculateShipBuildTime(input: ShipBuildTimeInput): number {
  const { metalCost, crystalCost, shipyardLevel, naniteFactoryLevel } = input;

  const totalCost = metalCost + crystalCost;
  const divisor =
    TIME_CONSTANTS.CONSTRUCTION_BASE *
    (1 + shipyardLevel) *
    Math.pow(2, naniteFactoryLevel);

  const seconds = (totalCost / divisor) * TIME_CONSTANTS.SECONDS_PER_HOUR / GAME_SPEED;

  return Math.max(TIME_CONSTANTS.MINIMUM_SECONDS, Math.floor(seconds));
}

/**
 * Calculate ship build time given ship type and facility levels
 */
export function calculateShipTime(
  shipType: ShipType,
  shipyardLevel: number,
  naniteFactoryLevel: number
): number {
  const cost = calculateShipCost(shipType);

  return calculateShipBuildTime({
    metalCost: cost.metal,
    crystalCost: cost.crystal,
    shipyardLevel,
    naniteFactoryLevel,
  });
}

/**
 * Calculate total time for a batch of ships
 */
export function calculateShipBatchTime(
  shipType: ShipType,
  quantity: number,
  shipyardLevel: number,
  naniteFactoryLevel: number
): number {
  const singleShipTime = calculateShipTime(shipType, shipyardLevel, naniteFactoryLevel);
  return singleShipTime * quantity;
}

/**
 * Format seconds into human-readable time string
 * Returns format: "Xd Xh Xm Xs" or shorter versions if applicable
 */
export function formatDuration(seconds: number): string {
  if (seconds < 0) return '0s';

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
}
