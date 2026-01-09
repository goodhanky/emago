import type { EnergyBalance } from '@/types/game';
import { ENERGY_CONSTANTS, PRODUCTION_CONSTANTS } from './constants';

/**
 * Calculate energy consumption for a metal mine
 * Formula: 10 * level * (1.1 ^ level)
 */
export function calculateMetalMineEnergyConsumption(level: number): number {
  if (level <= 0) return 0;
  return Math.floor(
    ENERGY_CONSTANTS.METAL_MINE_CONSUMPTION_BASE *
      level *
      Math.pow(PRODUCTION_CONSTANTS.MULTIPLIER, level)
  );
}

/**
 * Calculate energy consumption for a crystal mine
 * Formula: 10 * level * (1.1 ^ level)
 */
export function calculateCrystalMineEnergyConsumption(level: number): number {
  if (level <= 0) return 0;
  return Math.floor(
    ENERGY_CONSTANTS.CRYSTAL_MINE_CONSUMPTION_BASE *
      level *
      Math.pow(PRODUCTION_CONSTANTS.MULTIPLIER, level)
  );
}

/**
 * Calculate energy consumption for a deuterium synthesizer
 * Formula: 20 * level * (1.1 ^ level)
 */
export function calculateDeuteriumSynthesizerEnergyConsumption(level: number): number {
  if (level <= 0) return 0;
  return Math.floor(
    ENERGY_CONSTANTS.DEUTERIUM_SYNTHESIZER_CONSUMPTION_BASE *
      level *
      Math.pow(PRODUCTION_CONSTANTS.MULTIPLIER, level)
  );
}

/**
 * Calculate total energy consumption for all mines
 */
export function calculateTotalEnergyConsumption(
  metalMineLevel: number,
  crystalMineLevel: number,
  deuteriumSynthLevel: number
): number {
  return (
    calculateMetalMineEnergyConsumption(metalMineLevel) +
    calculateCrystalMineEnergyConsumption(crystalMineLevel) +
    calculateDeuteriumSynthesizerEnergyConsumption(deuteriumSynthLevel)
  );
}

/**
 * Calculate energy factor (production efficiency)
 * Formula: min(1.0, production / consumption)
 * Returns 1.0 when consumption is 0 or production >= consumption
 */
export function calculateEnergyFactor(production: number, consumption: number): number {
  if (consumption <= 0) return 1.0;
  return Math.min(1.0, production / consumption);
}

/**
 * Calculate solar plant energy output
 * Formula: 20 * level * (1.1 ^ level)
 */
export function calculateSolarPlantEnergy(level: number): number {
  if (level <= 0) return 0;
  return Math.floor(
    PRODUCTION_CONSTANTS.SOLAR_BASE * level * Math.pow(PRODUCTION_CONSTANTS.MULTIPLIER, level)
  );
}

/**
 * Get complete energy balance for a planet
 */
export function calculateEnergyBalance(
  metalMineLevel: number,
  crystalMineLevel: number,
  deuteriumSynthLevel: number,
  solarPlantLevel: number
): EnergyBalance {
  const production = calculateSolarPlantEnergy(solarPlantLevel);
  const consumption = calculateTotalEnergyConsumption(
    metalMineLevel,
    crystalMineLevel,
    deuteriumSynthLevel
  );
  const factor = calculateEnergyFactor(production, consumption);

  return {
    production,
    consumption,
    factor,
  };
}
