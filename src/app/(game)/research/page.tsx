import { createClient } from '@/lib/auth/supabase-server';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { ResearchList } from './ResearchList';

async function getPlayerData(userId: string) {
  return prisma.player.findUnique({
    where: { userId },
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
}

export default async function ResearchPage() {
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

  // Get lab level from buildings
  const labLevel =
    player.planet.buildings.find((b) => b.type === 'RESEARCH_LAB')?.level ?? 0;

  // Serialize queue for client component
  const serializedQueue =
    player.researchQueue && player.researchQueue.status === 'IN_PROGRESS'
      ? {
          id: player.researchQueue.id,
          techType: player.researchQueue.techType,
          targetLevel: player.researchQueue.targetLevel,
          startTime: player.researchQueue.startTime.toISOString(),
          endTime: player.researchQueue.endTime.toISOString(),
          cost: {
            metal: player.researchQueue.metalCost,
            crystal: player.researchQueue.crystalCost,
            deuterium: player.researchQueue.deuteriumCost,
          },
          planetName: player.planet.name,
        }
      : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Research</h1>
        <p className="text-slate-400 mt-1">
          Research new technologies at your Research Lab (Level {labLevel})
        </p>
      </div>

      <ResearchList initialQueue={serializedQueue} />
    </div>
  );
}
