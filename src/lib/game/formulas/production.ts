import type { ProductionInput, DeuteriumProductionInput, ResourceRates } from '@/types/game';
import { PRODUCTION_CONSTANTS, DEUTERIUM_TEMPERATURE } from './constants';
import { calculateEnergyBalance } from './energy';

/**
 * Calculate hourly metal production for a metal mine
 * Formula: 30 * level * (1.1 ^ level) * energy_factor
 */
export function calculateMetalProduction(input: ProductionInput): number {
  const { mineLevel, energyFactor } = input;
  if (mineLevel <= 0) return 0;

  return Math.floor(
    PRODUCTION_CONSTANTS.METAL_BASE *
      mineLevel *
      Math.pow(PRODUCTION_CONSTANTS.MULTIPLIER, mineLevel) *
      energyFactor
  );
}

/**
 * Calculate hourly crystal production for a crystal mine
 * Formula: 20 * level * (1.1 ^ level) * energy_factor
 */
export function calculateCrystalProduction(input: ProductionInput): number {
  const { mineLevel, energyFactor } = input;
  if (mineLevel <= 0) return 0;

  return Math.floor(
    PRODUCTION_CONSTANTS.CRYSTAL_BASE *
      mineLevel *
      Math.pow(PRODUCTION_CONSTANTS.MULTIPLIER, mineLevel) *
      energyFactor
  );
}

/**
 * Calculate hourly deuterium production for a deuterium synthesizer
 * Formula: 10 * level * (1.1 ^ level) * energy_factor * (1.36 - 0.004 * temperature)
 */
export function calculateDeuteriumProduction(input: DeuteriumProductionInput): number {
  const { mineLevel, energyFactor, planetTemperature } = input;
  if (mineLevel <= 0) return 0;

  const temperatureFactor =
    DEUTERIUM_TEMPERATURE.BASE_FACTOR -
    DEUTERIUM_TEMPERATURE.TEMPERATURE_COEFFICIENT * planetTemperature;

  return Math.floor(
    PRODUCTION_CONSTANTS.DEUTERIUM_BASE *
      mineLevel *
      Math.pow(PRODUCTION_CONSTANTS.MULTIPLIER, mineLevel) *
      energyFactor *
      temperatureFactor
  );
}

/**
 * Calculate energy output from a solar plant
 * Formula: 20 * level * (1.1 ^ level)
 */
export function calculateSolarEnergy(level: number): number {
  if (level <= 0) return 0;

  return Math.floor(
    PRODUCTION_CONSTANTS.SOLAR_BASE * level * Math.pow(PRODUCTION_CONSTANTS.MULTIPLIER, level)
  );
}

/**
 * Calculate production rates for all resources given building levels
 * Returns rates adjusted by energy factor
 */
export function calculateAllProductionRates(
  metalMineLevel: number,
  crystalMineLevel: number,
  deuteriumSynthLevel: number,
  solarPlantLevel: number,
  planetTemperature: number
): ResourceRates {
  const energyBalance = calculateEnergyBalance(
    metalMineLevel,
    crystalMineLevel,
    deuteriumSynthLevel,
    solarPlantLevel
  );

  const metalPerHour = calculateMetalProduction({
    mineLevel: metalMineLevel,
    energyFactor: energyBalance.factor,
  });

  const crystalPerHour = calculateCrystalProduction({
    mineLevel: crystalMineLevel,
    energyFactor: energyBalance.factor,
  });

  const deuteriumPerHour = calculateDeuteriumProduction({
    mineLevel: deuteriumSynthLevel,
    energyFactor: energyBalance.factor,
    planetTemperature,
  });

  return {
    metalPerHour,
    crystalPerHour,
    deuteriumPerHour,
  };
}
