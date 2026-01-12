import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { prisma, ShipType } from '@/lib/db';
import { calculateShipBatchCost, calculateShipTime } from '@/lib/game/formulas';
import { calculateCurrentResources, deductResources } from '@/lib/game/resources';
import {
  buildingArrayToMap,
  researchArrayToMap,
  planetToPlanetState,
} from '@/lib/game/validation/buildings';
import { validateShipBuild } from '@/lib/game/validation/ships';

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await request.json();
    const { shipType, quantity } = body;

    if (!shipType) {
      return NextResponse.json(
        { error: 'Missing shipType' },
        { status: 400 }
      );
    }

    // Validate shipType is a valid enum value
    if (!Object.values(ShipType).includes(shipType)) {
      return NextResponse.json(
        { error: 'Invalid ship type' },
        { status: 400 }
      );
    }

    // Validate quantity
    const qty = parseInt(quantity, 10);
    if (!Number.isInteger(qty) || qty < 1 || qty > 999) {
      return NextResponse.json(
        { error: 'Quantity must be between 1 and 999' },
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
    const now = new Date();

    // 4. Prepare validation context
    const buildingLevels = buildingArrayToMap(planet.buildings);
    const researchLevels = researchArrayToMap(researches);
    const shipyardLevel = buildingLevels.SHIPYARD ?? 0;
    const naniteLevel = buildingLevels.NANITE_FACTORY ?? 0;
    const planetState = planetToPlanetState(planet);
    const currentResources = calculateCurrentResources(planetState, now);

    // Check if there's an active ship queue
    const hasActiveQueue = planet.shipQueues.length > 0;

    const validationContext = {
      shipType: shipType as ShipType,
      quantity: qty,
      shipyardLevel,
      currentResearchLevels: researchLevels,
      currentResources,
      hasActiveQueue,
    };

    // 5. Validate ship build
    const validation = validateShipBuild(validationContext);

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
    const batchCost = calculateShipBatchCost(shipType as ShipType, qty);
    const singleShipTimeSeconds = calculateShipTime(
      shipType as ShipType,
      shipyardLevel,
      naniteLevel
    );
    const batchTimeSeconds = singleShipTimeSeconds * qty;

    const startTime = now;
    const endTime = new Date(now.getTime() + batchTimeSeconds * 1000);
    const currentShipEndTime = new Date(now.getTime() + singleShipTimeSeconds * 1000);

    // 7. Execute transaction: deduct resources + create queue
    const result = await prisma.$transaction(async (tx) => {
      // Deduct resources and update timestamp
      const updatedPlanetState = deductResources(planetState, batchCost, now);

      await tx.planet.update({
        where: { id: planet.id },
        data: {
          metal: updatedPlanetState.metal,
          crystal: updatedPlanetState.crystal,
          deuterium: updatedPlanetState.deuterium,
          lastResourceUpdate: now,
        },
      });

      // Create ship queue
      const queue = await tx.shipQueue.create({
        data: {
          planetId: planet.id,
          shipType: shipType as ShipType,
          quantity: qty,
          completedCount: 0,
          metalCost: batchCost.metal,
          crystalCost: batchCost.crystal,
          deuteriumCost: batchCost.deuterium,
          startTime,
          endTime,
          currentShipEndTime,
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
        shipType: result.shipType,
        quantity: result.quantity,
        completedCount: result.completedCount,
        startTime: result.startTime.toISOString(),
        endTime: result.endTime.toISOString(),
        currentShipEndTime: result.currentShipEndTime.toISOString(),
        cost: {
          metal: result.metalCost,
          crystal: result.crystalCost,
          deuterium: result.deuteriumCost,
        },
      },
    });
  } catch (error) {
    console.error('Ship build error:', error);

    // Handle Prisma unique constraint error (shouldn't happen for ships, but safe to check)
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'Ship construction is already in progress', code: 'QUEUE_ACTIVE' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to start ship build' },
      { status: 500 }
    );
  }
}
