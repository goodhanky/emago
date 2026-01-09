import { createClient } from '@/lib/auth/supabase-server';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { BuildingsList } from './BuildingsList';

async function getPlayerData(userId: string) {
  return prisma.player.findUnique({
    where: { userId },
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
}

export default async function BuildingsPage() {
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

  // Serialize queue for client component
  const serializedQueue =
    player.planet.buildingQueue && player.planet.buildingQueue.status === 'IN_PROGRESS'
      ? {
          id: player.planet.buildingQueue.id,
          buildingType: player.planet.buildingQueue.buildingType,
          targetLevel: player.planet.buildingQueue.targetLevel,
          startTime: player.planet.buildingQueue.startTime.toISOString(),
          endTime: player.planet.buildingQueue.endTime.toISOString(),
          cost: {
            metal: player.planet.buildingQueue.metalCost,
            crystal: player.planet.buildingQueue.crystalCost,
            deuterium: player.planet.buildingQueue.deuteriumCost,
          },
        }
      : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Buildings</h1>
        <p className="text-slate-400 mt-1">
          Construct and upgrade buildings on {player.planet.name}
        </p>
      </div>

      <BuildingsList initialQueue={serializedQueue} />
    </div>
  );
}
