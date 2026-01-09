import { NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { prisma } from '@/lib/db';
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

    // 2. Get player with planet and active queue
    const player = await prisma.player.findUnique({
      where: { userId: user.id },
      include: {
        planet: {
          include: {
            buildings: true,
            buildingQueue: true,
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

    // 3. Check if there's an active queue
    if (!planet.buildingQueue || planet.buildingQueue.status !== 'IN_PROGRESS') {
      return NextResponse.json(
        { error: 'No active building queue to cancel' },
        { status: 400 }
      );
    }

    const queue = planet.buildingQueue;
    const now = new Date();

    // 4. Calculate refund amount (100%)
    const refund = {
      metal: queue.metalCost,
      crystal: queue.crystalCost,
      deuterium: queue.deuteriumCost,
    };

    // 5. Execute transaction: cancel queue + refund resources
    await prisma.$transaction(async (tx) => {
      // Mark queue as cancelled
      await tx.buildingQueue.update({
        where: { id: queue.id },
        data: { status: 'CANCELLED' },
      });

      // Refund resources (respects storage caps)
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
    });
  } catch (error) {
    console.error('Building cancel error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel building' },
      { status: 500 }
    );
  }
}
