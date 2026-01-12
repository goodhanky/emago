import { NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { prisma, ShipType } from '@/lib/db';
import {
  calculateShipCost,
  calculateShipTime,
  SHIP_PREREQUISITES,
} from '@/lib/game/formulas';
import { calculateCurrentResources } from '@/lib/game/resources';
import {
  buildingArrayToMap,
  researchArrayToMap,
  planetToPlanetState,
} from '@/lib/game/validation/buildings';
import { canBuildShip, shipArrayToMap } from '@/lib/game/validation/ships';

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

    // 2. Get player with planet, buildings, researches, ships, and ship queue
    const player = await prisma.player.findUnique({
      where: { userId: user.id },
      include: {
        planet: {
          include: {
            buildings: true,
            ships: true,
            shipQueues: {
              where: { status: 'IN_PROGRESS' },
            },
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
    const shipCounts = shipArrayToMap(planet.ships);
    const shipyardLevel = buildingLevels.SHIPYARD ?? 0;
    const naniteLevel = buildingLevels.NANITE_FACTORY ?? 0;

    // 3. Calculate current resources
    const planetState = planetToPlanetState(planet);
    const now = new Date();
    const currentResources = calculateCurrentResources(planetState, now);

    // 4. Check if there's an active ship queue
    const activeQueue =
      planet.shipQueues.length > 0 && planet.shipQueues[0].status === 'IN_PROGRESS'
        ? planet.shipQueues[0]
        : null;

    // 5. Build response with all ship info
    const ships = Object.values(ShipType).map((type) => {
      const count = shipCounts[type] ?? 0;
      const cost = calculateShipCost(type);
      const timeSeconds = calculateShipTime(type, shipyardLevel, naniteLevel);
      const prerequisites = SHIP_PREREQUISITES[type];

      // Check if can build (with quantity=1 for display)
      const { canBuild, reason } = canBuildShip(
        type,
        1,
        shipyardLevel,
        researchLevels,
        currentResources,
        activeQueue !== null
      );

      return {
        type,
        count,
        cost,
        timeSeconds,
        shipyardRequirement: prerequisites.shipyardLevel,
        prerequisites: {
          research: prerequisites.research,
        },
        canBuild,
        buildBlockedReason: reason ?? null,
      };
    });

    // 6. Format active queue for response
    const activeQueueResponse = activeQueue
      ? {
          id: activeQueue.id,
          shipType: activeQueue.shipType,
          quantity: activeQueue.quantity,
          completedCount: activeQueue.completedCount,
          startTime: activeQueue.startTime.toISOString(),
          endTime: activeQueue.endTime.toISOString(),
          currentShipEndTime: activeQueue.currentShipEndTime.toISOString(),
          cost: {
            metal: activeQueue.metalCost,
            crystal: activeQueue.crystalCost,
            deuterium: activeQueue.deuteriumCost,
          },
        }
      : null;

    return NextResponse.json({
      ships,
      activeQueue: activeQueueResponse,
      resources: currentResources,
      shipyardLevel,
      naniteLevel,
    });
  } catch (error) {
    console.error('Ships GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ships' },
      { status: 500 }
    );
  }
}
