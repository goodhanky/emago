import { createClient } from '@/lib/auth/supabase-server';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { ShipyardList } from './ShipyardList';

async function getPlayerData(userId: string) {
  return prisma.player.findUnique({
    where: { userId },
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
}

export default async function ShipyardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const player = await getPlayerData(user.id);

  if (!player?.planet) {
    redirect('/login');
  }

  // Get shipyard level from buildings
  const shipyardLevel =
    player.planet.buildings.find((b) => b.type === 'SHIPYARD')?.level ?? 0;

  // Get active ship queue
  const shipQueue = player.planet.shipQueues[0];

  // Serialize queue for client component
  const serializedQueue =
    shipQueue && shipQueue.status === 'IN_PROGRESS'
      ? {
          id: shipQueue.id,
          shipType: shipQueue.shipType,
          quantity: shipQueue.quantity,
          completedCount: shipQueue.completedCount,
          startTime: shipQueue.startTime.toISOString(),
          endTime: shipQueue.endTime.toISOString(),
          currentShipEndTime: shipQueue.currentShipEndTime.toISOString(),
          cost: {
            metal: shipQueue.metalCost,
            crystal: shipQueue.crystalCost,
            deuterium: shipQueue.deuteriumCost,
          },
        }
      : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Shipyard</h1>
        <p className="text-slate-400 mt-1">
          Build ships at your Shipyard (Level {shipyardLevel})
        </p>
      </div>

      <ShipyardList initialQueue={serializedQueue} />
    </div>
  );
}
