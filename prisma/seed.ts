/**
 * Seed script for Emago game configuration
 * Based on PRD v2.0 - All values verified against OGameX data
 */

import { config } from 'dotenv'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { PrismaClient } from '../src/lib/db/prisma'

// Load environment variables
config({ path: '.env.local' })

// Create pg pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

// Create Prisma adapter
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

// Game configuration values from PRD
const gameConfig = [
  // ===========================================
  // GAME SETTINGS
  // ===========================================
  {
    key: 'GAME_SPEED',
    value: 1.0,
    description: 'Game speed multiplier (1.0 = normal)',
  },

  // ===========================================
  // RESOURCE PRODUCTION BASE VALUES
  // ===========================================
  {
    key: 'METAL_MINE_BASE_PRODUCTION',
    value: 30,
    description: 'Base hourly metal production per mine level',
  },
  {
    key: 'CRYSTAL_MINE_BASE_PRODUCTION',
    value: 20,
    description: 'Base hourly crystal production per mine level',
  },
  {
    key: 'DEUTERIUM_SYNTHESIZER_BASE_PRODUCTION',
    value: 10,
    description: 'Base hourly deuterium production per synthesizer level',
  },
  {
    key: 'SOLAR_PLANT_BASE_ENERGY',
    value: 20,
    description: 'Base energy output per solar plant level',
  },
  {
    key: 'PRODUCTION_MULTIPLIER',
    value: 1.1,
    description: 'Production growth multiplier per level (1.1^level)',
  },

  // ===========================================
  // ENERGY CONSUMPTION BASE VALUES
  // ===========================================
  {
    key: 'METAL_MINE_ENERGY_CONSUMPTION',
    value: 10,
    description: 'Base energy consumption per metal mine level',
  },
  {
    key: 'CRYSTAL_MINE_ENERGY_CONSUMPTION',
    value: 10,
    description: 'Base energy consumption per crystal mine level',
  },
  {
    key: 'DEUTERIUM_SYNTHESIZER_ENERGY_CONSUMPTION',
    value: 20,
    description: 'Base energy consumption per deuterium synthesizer level',
  },

  // ===========================================
  // BUILDING COSTS - MINES
  // ===========================================
  {
    key: 'METAL_MINE_BASE_METAL_COST',
    value: 80,
    description: 'Base metal cost for metal mine level 1',
  },
  {
    key: 'METAL_MINE_BASE_CRYSTAL_COST',
    value: 20,
    description: 'Base crystal cost for metal mine level 1',
  },
  {
    key: 'CRYSTAL_MINE_BASE_METAL_COST',
    value: 64,
    description: 'Base metal cost for crystal mine level 1',
  },
  {
    key: 'CRYSTAL_MINE_BASE_CRYSTAL_COST',
    value: 32,
    description: 'Base crystal cost for crystal mine level 1',
  },
  {
    key: 'DEUTERIUM_SYNTHESIZER_BASE_METAL_COST',
    value: 340,
    description: 'Base metal cost for deuterium synthesizer level 1',
  },
  {
    key: 'DEUTERIUM_SYNTHESIZER_BASE_CRYSTAL_COST',
    value: 100,
    description: 'Base crystal cost for deuterium synthesizer level 1',
  },
  {
    key: 'MINE_COST_MULTIPLIER',
    value: 1.5,
    description: 'Cost growth multiplier for mines (1.5^(level-1))',
  },

  // ===========================================
  // BUILDING COSTS - SOLAR PLANT
  // ===========================================
  {
    key: 'SOLAR_PLANT_BASE_METAL_COST',
    value: 100,
    description: 'Base metal cost for solar plant level 1',
  },
  {
    key: 'SOLAR_PLANT_BASE_CRYSTAL_COST',
    value: 40,
    description: 'Base crystal cost for solar plant level 1',
  },

  // ===========================================
  // BUILDING COSTS - STORAGE
  // ===========================================
  {
    key: 'STORAGE_BASE_COST',
    value: 10000,
    description: 'Base cost multiplier for storage buildings (cost = base * 2^level)',
  },
  {
    key: 'STORAGE_COST_MULTIPLIER',
    value: 2,
    description: 'Cost growth multiplier for storage (2^level)',
  },

  // ===========================================
  // BUILDING COSTS - FACILITIES
  // ===========================================
  {
    key: 'RESEARCH_LAB_BASE_METAL_COST',
    value: 200,
    description: 'Base metal cost for research lab level 1',
  },
  {
    key: 'RESEARCH_LAB_BASE_CRYSTAL_COST',
    value: 400,
    description: 'Base crystal cost for research lab level 1',
  },
  {
    key: 'RESEARCH_LAB_BASE_DEUTERIUM_COST',
    value: 200,
    description: 'Base deuterium cost for research lab level 1',
  },
  {
    key: 'SHIPYARD_BASE_METAL_COST',
    value: 400,
    description: 'Base metal cost for shipyard level 1',
  },
  {
    key: 'SHIPYARD_BASE_CRYSTAL_COST',
    value: 200,
    description: 'Base crystal cost for shipyard level 1',
  },
  {
    key: 'SHIPYARD_BASE_DEUTERIUM_COST',
    value: 100,
    description: 'Base deuterium cost for shipyard level 1',
  },
  {
    key: 'ROBOT_FACTORY_BASE_METAL_COST',
    value: 400,
    description: 'Base metal cost for robot factory level 1',
  },
  {
    key: 'ROBOT_FACTORY_BASE_CRYSTAL_COST',
    value: 120,
    description: 'Base crystal cost for robot factory level 1',
  },
  {
    key: 'ROBOT_FACTORY_BASE_DEUTERIUM_COST',
    value: 200,
    description: 'Base deuterium cost for robot factory level 1',
  },
  {
    key: 'NANITE_FACTORY_BASE_METAL_COST',
    value: 1000000,
    description: 'Base metal cost for nanite factory level 1',
  },
  {
    key: 'NANITE_FACTORY_BASE_CRYSTAL_COST',
    value: 500000,
    description: 'Base crystal cost for nanite factory level 1',
  },
  {
    key: 'NANITE_FACTORY_BASE_DEUTERIUM_COST',
    value: 100000,
    description: 'Base deuterium cost for nanite factory level 1',
  },
  {
    key: 'FACILITY_COST_MULTIPLIER',
    value: 2,
    description: 'Cost growth multiplier for facilities (2^(level-1))',
  },

  // ===========================================
  // STORAGE CAPACITY
  // ===========================================
  {
    key: 'BASE_STORAGE_CAPACITY',
    value: 10000,
    description: 'Base storage capacity before any storage buildings',
  },
  {
    key: 'STORAGE_CAPACITY_MULTIPLIER',
    value: 2.5,
    description: 'Storage capacity multiplier per storage level',
  },

  // ===========================================
  // CONSTRUCTION TIME
  // ===========================================
  {
    key: 'CONSTRUCTION_TIME_BASE',
    value: 2500,
    description: 'Base construction speed factor',
  },

  // ===========================================
  // RESEARCH COSTS - BASE VALUES
  // ===========================================
  {
    key: 'ENERGY_TECH_BASE_CRYSTAL_COST',
    value: 800,
    description: 'Base crystal cost for energy technology level 1',
  },
  {
    key: 'ENERGY_TECH_BASE_DEUTERIUM_COST',
    value: 400,
    description: 'Base deuterium cost for energy technology level 1',
  },
  {
    key: 'COMPUTER_TECH_BASE_CRYSTAL_COST',
    value: 400,
    description: 'Base crystal cost for computer technology level 1',
  },
  {
    key: 'COMPUTER_TECH_BASE_DEUTERIUM_COST',
    value: 600,
    description: 'Base deuterium cost for computer technology level 1',
  },
  {
    key: 'WEAPONS_TECH_BASE_METAL_COST',
    value: 800,
    description: 'Base metal cost for weapons technology level 1',
  },
  {
    key: 'WEAPONS_TECH_BASE_CRYSTAL_COST',
    value: 200,
    description: 'Base crystal cost for weapons technology level 1',
  },
  {
    key: 'SHIELDING_TECH_BASE_METAL_COST',
    value: 200,
    description: 'Base metal cost for shielding technology level 1',
  },
  {
    key: 'SHIELDING_TECH_BASE_CRYSTAL_COST',
    value: 600,
    description: 'Base crystal cost for shielding technology level 1',
  },
  {
    key: 'ARMOR_TECH_BASE_METAL_COST',
    value: 1000,
    description: 'Base metal cost for armor technology level 1',
  },
  {
    key: 'COMBUSTION_DRIVE_BASE_METAL_COST',
    value: 400,
    description: 'Base metal cost for combustion drive level 1',
  },
  {
    key: 'COMBUSTION_DRIVE_BASE_DEUTERIUM_COST',
    value: 600,
    description: 'Base deuterium cost for combustion drive level 1',
  },
  {
    key: 'IMPULSE_DRIVE_BASE_METAL_COST',
    value: 2000,
    description: 'Base metal cost for impulse drive level 1',
  },
  {
    key: 'IMPULSE_DRIVE_BASE_CRYSTAL_COST',
    value: 4000,
    description: 'Base crystal cost for impulse drive level 1',
  },
  {
    key: 'IMPULSE_DRIVE_BASE_DEUTERIUM_COST',
    value: 600,
    description: 'Base deuterium cost for impulse drive level 1',
  },
  {
    key: 'HYPERSPACE_DRIVE_BASE_METAL_COST',
    value: 10000,
    description: 'Base metal cost for hyperspace drive level 1',
  },
  {
    key: 'HYPERSPACE_DRIVE_BASE_CRYSTAL_COST',
    value: 20000,
    description: 'Base crystal cost for hyperspace drive level 1',
  },
  {
    key: 'HYPERSPACE_DRIVE_BASE_DEUTERIUM_COST',
    value: 6000,
    description: 'Base deuterium cost for hyperspace drive level 1',
  },
  {
    key: 'ESPIONAGE_TECH_BASE_METAL_COST',
    value: 200,
    description: 'Base metal cost for espionage technology level 1',
  },
  {
    key: 'ESPIONAGE_TECH_BASE_CRYSTAL_COST',
    value: 1000,
    description: 'Base crystal cost for espionage technology level 1',
  },
  {
    key: 'ESPIONAGE_TECH_BASE_DEUTERIUM_COST',
    value: 200,
    description: 'Base deuterium cost for espionage technology level 1',
  },
  {
    key: 'RESEARCH_COST_MULTIPLIER',
    value: 2,
    description: 'Cost growth multiplier for research (2^(level-1))',
  },

  // ===========================================
  // SHIP COSTS
  // ===========================================
  {
    key: 'SMALL_CARGO_METAL_COST',
    value: 2000,
    description: 'Metal cost for small cargo ship',
  },
  {
    key: 'SMALL_CARGO_CRYSTAL_COST',
    value: 2000,
    description: 'Crystal cost for small cargo ship',
  },
  {
    key: 'LARGE_CARGO_METAL_COST',
    value: 6000,
    description: 'Metal cost for large cargo ship',
  },
  {
    key: 'LARGE_CARGO_CRYSTAL_COST',
    value: 6000,
    description: 'Crystal cost for large cargo ship',
  },
  {
    key: 'LIGHT_FIGHTER_METAL_COST',
    value: 3000,
    description: 'Metal cost for light fighter',
  },
  {
    key: 'LIGHT_FIGHTER_CRYSTAL_COST',
    value: 1000,
    description: 'Crystal cost for light fighter',
  },
  {
    key: 'HEAVY_FIGHTER_METAL_COST',
    value: 6000,
    description: 'Metal cost for heavy fighter',
  },
  {
    key: 'HEAVY_FIGHTER_CRYSTAL_COST',
    value: 4000,
    description: 'Crystal cost for heavy fighter',
  },
  {
    key: 'CRUISER_METAL_COST',
    value: 20000,
    description: 'Metal cost for cruiser',
  },
  {
    key: 'CRUISER_CRYSTAL_COST',
    value: 7000,
    description: 'Crystal cost for cruiser',
  },
  {
    key: 'CRUISER_DEUTERIUM_COST',
    value: 2000,
    description: 'Deuterium cost for cruiser',
  },

  // ===========================================
  // DARK MATTER (Login Rewards)
  // ===========================================
  {
    key: 'DAILY_LOGIN_DM_REWARD',
    value: 10,
    description: 'Dark Matter awarded for daily login',
  },
  {
    key: 'WEEKLY_STREAK_DM_REWARD',
    value: 100,
    description: 'Dark Matter bonus for 7-day login streak',
  },

  // ===========================================
  // STARTING VALUES
  // ===========================================
  {
    key: 'STARTING_METAL',
    value: 500,
    description: 'Starting metal for new players',
  },
  {
    key: 'STARTING_CRYSTAL',
    value: 500,
    description: 'Starting crystal for new players',
  },
  {
    key: 'STARTING_DEUTERIUM',
    value: 0,
    description: 'Starting deuterium for new players',
  },
  {
    key: 'STARTING_PLANET_FIELDS',
    value: 163,
    description: 'Number of fields on starting planet',
  },
  {
    key: 'STARTING_PLANET_TEMPERATURE',
    value: 25,
    description: 'Temperature of starting planet (affects deuterium production)',
  },
]

async function main() {
  console.log('Seeding game configuration...')

  for (const config of gameConfig) {
    await prisma.gameConfig.upsert({
      where: { key: config.key },
      update: {
        value: config.value,
        description: config.description,
      },
      create: {
        key: config.key,
        value: config.value,
        description: config.description,
      },
    })
    console.log(`  ✓ ${config.key}`)
  }

  console.log(`\nSeeded ${gameConfig.length} game configuration values.`)
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
