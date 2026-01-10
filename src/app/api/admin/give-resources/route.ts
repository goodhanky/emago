import { NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { prisma } from '@/lib/db';

/**
 * DEV ONLY: Give resources to the current player for testing
 * POST /api/admin/give-resources
 */
export async function POST() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const player = await prisma.player.findUnique({
      where: { userId: user.id },
      include: { planet: true },
    });

    if (!player?.planet) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Give generous resources for testing
    const updated = await prisma.planet.update({
      where: { id: player.planet.id },
      data: {
        metal: 100000,
        crystal: 100000,
        deuterium: 50000,
        lastResourceUpdate: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      resources: {
        metal: updated.metal,
        crystal: updated.crystal,
        deuterium: updated.deuterium,
      },
    });
  } catch (error) {
    console.error('Give resources error:', error);
    return NextResponse.json({ error: 'Failed to give resources' }, { status: 500 });
  }
}
