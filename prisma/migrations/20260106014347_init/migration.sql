-- CreateEnum
CREATE TYPE "BuildingType" AS ENUM ('METAL_MINE', 'CRYSTAL_MINE', 'DEUTERIUM_SYNTHESIZER', 'SOLAR_PLANT', 'METAL_STORAGE', 'CRYSTAL_STORAGE', 'DEUTERIUM_TANK', 'RESEARCH_LAB', 'SHIPYARD', 'ROBOT_FACTORY', 'NANITE_FACTORY');

-- CreateEnum
CREATE TYPE "TechType" AS ENUM ('ENERGY', 'COMPUTER', 'WEAPONS', 'SHIELDING', 'ARMOR', 'COMBUSTION_DRIVE', 'IMPULSE_DRIVE', 'HYPERSPACE_DRIVE', 'ESPIONAGE');

-- CreateEnum
CREATE TYPE "ShipType" AS ENUM ('SMALL_CARGO', 'LARGE_CARGO', 'LIGHT_FIGHTER', 'HEAVY_FIGHTER', 'CRUISER');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "dark_matter_balance" INTEGER NOT NULL DEFAULT 0,
    "last_login_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "login_streak" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planets" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Homeworld',
    "coord_x" INTEGER NOT NULL,
    "coord_y" INTEGER NOT NULL,
    "temperature" INTEGER NOT NULL DEFAULT 25,
    "fields" INTEGER NOT NULL DEFAULT 163,
    "fields_used" INTEGER NOT NULL DEFAULT 0,
    "metal" DOUBLE PRECISION NOT NULL DEFAULT 500,
    "crystal" DOUBLE PRECISION NOT NULL DEFAULT 500,
    "deuterium" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "last_resource_update" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metal_per_hour" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "crystal_per_hour" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deuterium_per_hour" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "energy_production" INTEGER NOT NULL DEFAULT 0,
    "energy_consumption" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildings" (
    "id" TEXT NOT NULL,
    "planet_id" TEXT NOT NULL,
    "type" "BuildingType" NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "researches" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "type" "TechType" NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "researches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planet_ships" (
    "id" TEXT NOT NULL,
    "planet_id" TEXT NOT NULL,
    "type" "ShipType" NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "planet_ships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "building_queues" (
    "id" TEXT NOT NULL,
    "planet_id" TEXT NOT NULL,
    "building_type" "BuildingType" NOT NULL,
    "target_level" INTEGER NOT NULL,
    "metal_cost" DOUBLE PRECISION NOT NULL,
    "crystal_cost" DOUBLE PRECISION NOT NULL,
    "deuterium_cost" DOUBLE PRECISION NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "status" "QueueStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "building_queues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_queues" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "planet_id" TEXT NOT NULL,
    "tech_type" "TechType" NOT NULL,
    "target_level" INTEGER NOT NULL,
    "metal_cost" DOUBLE PRECISION NOT NULL,
    "crystal_cost" DOUBLE PRECISION NOT NULL,
    "deuterium_cost" DOUBLE PRECISION NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "status" "QueueStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "research_queues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ship_queues" (
    "id" TEXT NOT NULL,
    "planet_id" TEXT NOT NULL,
    "ship_type" "ShipType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "completed_count" INTEGER NOT NULL DEFAULT 0,
    "metal_cost" DOUBLE PRECISION NOT NULL,
    "crystal_cost" DOUBLE PRECISION NOT NULL,
    "deuterium_cost" DOUBLE PRECISION NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "current_ship_end_time" TIMESTAMP(3) NOT NULL,
    "status" "QueueStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ship_queues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_configs" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_configs_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "dark_matter_ledger" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "reference_id" TEXT,
    "balance_after" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dark_matter_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "action_logs" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "action_type" TEXT NOT NULL,
    "details" JSONB,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "action_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "players_user_id_key" ON "players"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "players_username_key" ON "players"("username");

-- CreateIndex
CREATE UNIQUE INDEX "planets_player_id_key" ON "planets"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "buildings_planet_id_type_key" ON "buildings"("planet_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "researches_player_id_type_key" ON "researches"("player_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "planet_ships_planet_id_type_key" ON "planet_ships"("planet_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "building_queues_planet_id_key" ON "building_queues"("planet_id");

-- CreateIndex
CREATE UNIQUE INDEX "research_queues_player_id_key" ON "research_queues"("player_id");

-- CreateIndex
CREATE INDEX "dark_matter_ledger_player_id_created_at_idx" ON "dark_matter_ledger"("player_id", "created_at");

-- CreateIndex
CREATE INDEX "action_logs_player_id_created_at_idx" ON "action_logs"("player_id", "created_at");

-- CreateIndex
CREATE INDEX "action_logs_action_type_created_at_idx" ON "action_logs"("action_type", "created_at");

-- AddForeignKey
ALTER TABLE "planets" ADD CONSTRAINT "planets_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildings" ADD CONSTRAINT "buildings_planet_id_fkey" FOREIGN KEY ("planet_id") REFERENCES "planets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "researches" ADD CONSTRAINT "researches_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planet_ships" ADD CONSTRAINT "planet_ships_planet_id_fkey" FOREIGN KEY ("planet_id") REFERENCES "planets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "building_queues" ADD CONSTRAINT "building_queues_planet_id_fkey" FOREIGN KEY ("planet_id") REFERENCES "planets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_queues" ADD CONSTRAINT "research_queues_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ship_queues" ADD CONSTRAINT "ship_queues_planet_id_fkey" FOREIGN KEY ("planet_id") REFERENCES "planets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dark_matter_ledger" ADD CONSTRAINT "dark_matter_ledger_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_logs" ADD CONSTRAINT "action_logs_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;
