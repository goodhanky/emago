import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { prisma, BuildingType } from '@/lib/db';
import { calculateBuildingCost, calculateBuildingTime } from '@/lib/game/formulas';
import { calculateCurrentResources, deductResources } from '@/lib/game/resources';
import {
  validateBuildingUpgrade,
  buildingArrayToMap,
  researchArrayToMap,
  planetToPlanetState,
} from '@/lib/game/validation/buildings';

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await request.json();
    const { buildingType } = body;

    if (!buildingType) {
      return NextResponse.json(
        { error: 'Missing buildingType' },
        { status: 400 }
      );
    }

    // Validate buildingType is a valid enum value
    if (!Object.values(BuildingType).includes(buildingType)) {
      return NextResponse.json(
        { error: 'Invalid building type' },
        { status: 400 }
      );
    }

    // 2. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 3. Get player data with all required relations
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
    const now = new Date();

    // 4. Prepare validation context
    const buildingLevels = buildingArrayToMap(planet.buildings);
    const researchLevels = researchArrayToMap(researches);
    const planetState = planetToPlanetState(planet);
    const currentResources = calculateCurrentResources(planetState, now);

    // Check if there's an active queue
    const hasActiveQueue =
      planet.buildingQueue !== null &&
      planet.buildingQueue.status === 'IN_PROGRESS';

    const validationContext = {
      buildingType: buildingType as BuildingType,
      currentBuildingLevels: buildingLevels,
      currentResearchLevels: researchLevels,
      currentResources,
      hasActiveQueue,
    };

    // 5. Validate upgrade
    const validation = validateBuildingUpgrade(validationContext);

    if (!validation.valid) {
      const statusCode = validation.errorCode === 'QUEUE_ACTIVE' ? 409 : 400;
      return NextResponse.json(
        {
          error: validation.error,
          code: validation.errorCode,
          details: validation.details,
        },
        { status: statusCode }
      );
    }

    // 6. Calculate costs and time
    const currentLevel = buildingLevels[buildingType as BuildingType] ?? 0;
    const targetLevel = currentLevel + 1;
    const cost = calculateBuildingCost(buildingType as BuildingType, targetLevel);
    const timeSeconds = calculateBuildingTime(
      buildingType as BuildingType,
      targetLevel,
      buildingLevels.ROBOT_FACTORY ?? 0,
      buildingLevels.NANITE_FACTORY ?? 0
    );

    const startTime = now;
    const endTime = new Date(now.getTime() + timeSeconds * 1000);

    // 7. Execute transaction: deduct resources + create queue
    const result = await prisma.$transaction(async (tx) => {
      // Deduct resources and update timestamp
      const updatedPlanetState = deductResources(planetState, cost, now);

      await tx.planet.update({
        where: { id: planet.id },
        data: {
          metal: updatedPlanetState.metal,
          crystal: updatedPlanetState.crystal,
          deuterium: updatedPlanetState.deuterium,
          lastResourceUpdate: now,
        },
      });

      // Create building queue
      const queue = await tx.buildingQueue.create({
        data: {
          planetId: planet.id,
          buildingType: buildingType as BuildingType,
          targetLevel,
          metalCost: cost.metal,
          crystalCost: cost.crystal,
          deuteriumCost: cost.deuterium,
          startTime,
          endTime,
          status: 'IN_PROGRESS',
        },
      });

      return queue;
    });

    // 8. Return success response
    return NextResponse.json({
      success: true,
      queue: {
        id: result.id,
        buildingType: result.buildingType,
        targetLevel: result.targetLevel,
        startTime: result.startTime.toISOString(),
        endTime: result.endTime.toISOString(),
        cost: {
          metal: result.metalCost,
          crystal: result.crystalCost,
          deuterium: result.deuteriumCost,
        },
      },
    });
  } catch (error) {
    console.error('Building upgrade error:', error);

    // Handle Prisma unique constraint error (queue already exists)
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'A building is already being constructed', code: 'QUEUE_ACTIVE' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to start building upgrade' },
      { status: 500 }
    );
  }
}
