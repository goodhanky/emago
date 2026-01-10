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

    // 2. Get player with research queue and planet (for refund)
    const player = await prisma.player.findUnique({
      where: { userId: user.id },
      include: {
        planet: {
          include: {
            buildings: true,
          },
        },
        researchQueue: true,
      },
    });

    if (!player?.planet) {
      return NextResponse.json(
        { error: 'Player or planet not found' },
        { status: 404 }
      );
    }

    const { planet, researchQueue } = player;

    // 3. Check if there's an active research queue
    if (!researchQueue || researchQueue.status !== 'IN_PROGRESS') {
      return NextResponse.json(
        { error: 'No active research to cancel' },
        { status: 400 }
      );
    }

    const now = new Date();

    // 4. Calculate refund amount (100%)
    const refund = {
      metal: researchQueue.metalCost,
      crystal: researchQueue.crystalCost,
      deuterium: researchQueue.deuteriumCost,
    };

    // 5. Execute transaction: cancel queue + refund resources
    await prisma.$transaction(async (tx) => {
      // Delete queue (unique constraint allows only one per player)
      await tx.researchQueue.delete({
        where: { id: researchQueue.id },
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
    });
  } catch (error) {
    console.error('Research cancel error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel research' },
      { status: 500 }
    );
  }
}
