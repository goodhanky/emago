import { NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { prisma } from '@/lib/db';
import { calculateShipCost } from '@/lib/game/formulas';
import { addResources } from '@/lib/game/resources';
import { planetToPlanetState } from '@/lib/game/validation/buildings';

export async function POST() {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get player with planet and ship queue
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
      },
    });

    if (!player?.planet) {
      return NextResponse.json(
        { error: 'Player or planet not found' },
        { status: 404 }
      );
    }

    const { planet } = player;
    const shipQueue = planet.shipQueues[0];

    // 3. Check if there's an active ship queue
    if (!shipQueue || shipQueue.status !== 'IN_PROGRESS') {
      return NextResponse.json(
        { error: 'No active ship build to cancel' },
        { status: 400 }
      );
    }

    const now = new Date();

    // 4. Calculate partial refund (only unbuilt ships)
    // Ships already completed stay on planet - they were upserted by cron
    const unbuiltCount = shipQueue.quantity - shipQueue.completedCount;
    const unitCost = calculateShipCost(shipQueue.shipType);

    const refund = {
      metal: unitCost.metal * unbuiltCount,
      crystal: unitCost.crystal * unbuiltCount,
      deuterium: unitCost.deuterium * unbuiltCount,
    };

    // 5. Execute transaction: delete queue + refund resources
    await prisma.$transaction(async (tx) => {
      // Delete queue
      await tx.shipQueue.delete({
        where: { id: shipQueue.id },
      });

      // Refund resources to the planet (respects storage caps)
      const planetState = planetToPlanetState(planet);
      const updatedState = addResources(planetState, refund, now);

      await tx.planet.update({
        where: { id: planet.id },
        data: {
          metal: updatedState.metal,
          crystal: updatedState.crystal,
          deuterium: updatedState.deuterium,
          lastResourceUpdate: now,
        },
      });
    });

    // 6. Return success response
    return NextResponse.json({
      success: true,
      refunded: refund,
      shipsBuilt: shipQueue.completedCount,
    });
  } catch (error) {
    console.error('Ship cancel error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel ship build' },
      { status: 500 }
    );
  }
}
