import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { prisma, TechType } from '@/lib/db';
import { calculateResearchCost, calculateTechResearchTime } from '@/lib/game/formulas';
import { calculateCurrentResources, deductResources } from '@/lib/game/resources';
import {
  buildingArrayToMap,
  researchArrayToMap,
  planetToPlanetState,
} from '@/lib/game/validation/buildings';
import { validateResearch } from '@/lib/game/validation/research';

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await request.json();
    const { techType } = body;

    if (!techType) {
      return NextResponse.json(
        { error: 'Missing techType' },
        { status: 400 }
      );
    }

    // Validate techType is a valid enum value
    if (!Object.values(TechType).includes(techType)) {
      return NextResponse.json(
        { error: 'Invalid technology type' },
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
          },
        },
        researches: true,
        researchQueue: true,
      },
    });

    if (!player?.planet) {
      return NextResponse.json(
        { error: 'Player or planet not found' },
        { status: 404 }
      );
    }

    const { planet, researches, researchQueue } = player;
    const now = new Date();

    // 4. Prepare validation context
    const buildingLevels = buildingArrayToMap(planet.buildings);
    const researchLevels = researchArrayToMap(researches);
    const labLevel = buildingLevels.RESEARCH_LAB ?? 0;
    const planetState = planetToPlanetState(planet);
    const currentResources = calculateCurrentResources(planetState, now);

    // Check if there's an active research queue
    const hasActiveQueue =
      researchQueue !== null && researchQueue.status === 'IN_PROGRESS';

    const validationContext = {
      techType: techType as TechType,
      labLevel,
      currentResearchLevels: researchLevels,
      currentResources,
      hasActiveQueue,
    };

    // 5. Validate research
    const validation = validateResearch(validationContext);

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
    const currentLevel = researchLevels[techType as TechType] ?? 0;
    const targetLevel = currentLevel + 1;
    const cost = calculateResearchCost(techType as TechType, targetLevel);
    const timeSeconds = calculateTechResearchTime(
      techType as TechType,
      targetLevel,
      labLevel
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

      // Create research queue (playerId is unique, planetId tracks which lab)
      const queue = await tx.researchQueue.create({
        data: {
          playerId: player.id,
          planetId: planet.id,
          techType: techType as TechType,
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
        techType: result.techType,
        targetLevel: result.targetLevel,
        startTime: result.startTime.toISOString(),
        endTime: result.endTime.toISOString(),
        cost: {
          metal: result.metalCost,
          crystal: result.crystalCost,
          deuterium: result.deuteriumCost,
        },
        planetName: planet.name,
      },
    });
  } catch (error) {
    console.error('Research start error:', error);

    // Handle Prisma unique constraint error (queue already exists)
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'Research is already in progress', code: 'QUEUE_ACTIVE' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to start research' },
      { status: 500 }
    );
  }
}
