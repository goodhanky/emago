import { NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { prisma, BuildingType } from '@/lib/db';
import {
  calculateBuildingCost,
  calculateBuildingTime,
  BUILDING_PREREQUISITES,
} from '@/lib/game/formulas';
import { calculateCurrentResources } from '@/lib/game/resources';
import {
  buildingArrayToMap,
  researchArrayToMap,
  planetToPlanetState,
  canUpgradeBuilding,
} from '@/lib/game/validation/buildings';

export async function GET() {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get player with planet, buildings, researches, and queue
    const player = await prisma.player.findUnique({
      where: { userId: user.id },
      include: {
        planet: {
          include: {
            buildings: true,
            buildingQueue: true,
          },
        },
        researches: true,
      },
    });

    if (!player?.planet) {
      return NextResponse.json(
        { error: 'Player or planet not found' },
        { status: 404 }
      );
    }

    const { planet, researches } = player;
    const buildingLevels = buildingArrayToMap(planet.buildings);
    const researchLevels = researchArrayToMap(researches);

    // 3. Calculate current resources
    const planetState = planetToPlanetState(planet);
    const now = new Date();
    const currentResources = calculateCurrentResources(planetState, now);

    // 4. Check if there's an active queue
    const activeQueue =
      planet.buildingQueue && planet.buildingQueue.status === 'IN_PROGRESS'
        ? planet.buildingQueue
        : null;

    // 5. Build response with all building info
    const buildings = Object.values(BuildingType).map((type) => {
      const currentLevel = buildingLevels[type] ?? 0;
      const nextLevel = currentLevel + 1;
      const cost = calculateBuildingCost(type, nextLevel);
      const timeSeconds = calculateBuildingTime(
        type,
        nextLevel,
        buildingLevels.ROBOT_FACTORY ?? 0,
        buildingLevels.NANITE_FACTORY ?? 0
      );
      const prerequisites = BUILDING_PREREQUISITES[type];

      // Check if can upgrade
      const { canUpgrade, reason } = canUpgradeBuilding(
        type,
        buildingLevels,
        researchLevels,
        currentResources,
        activeQueue !== null
      );

      return {
        type,
        level: currentLevel,
        nextLevel,
        cost,
        timeSeconds,
        prerequisites,
        canUpgrade,
        upgradeBlockedReason: reason ?? null,
      };
    });

    // 6. Format active queue for response
    const activeQueueResponse = activeQueue
      ? {
          id: activeQueue.id,
          buildingType: activeQueue.buildingType,
          targetLevel: activeQueue.targetLevel,
          startTime: activeQueue.startTime.toISOString(),
          endTime: activeQueue.endTime.toISOString(),
          cost: {
            metal: activeQueue.metalCost,
            crystal: activeQueue.crystalCost,
            deuterium: activeQueue.deuteriumCost,
          },
        }
      : null;

    return NextResponse.json({
      buildings,
      activeQueue: activeQueueResponse,
      resources: currentResources,
    });
  } catch (error) {
    console.error('Buildings GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch buildings' },
      { status: 500 }
    );
  }
}
