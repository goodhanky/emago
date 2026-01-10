import { NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { prisma, TechType } from '@/lib/db';
import {
  calculateResearchCost,
  calculateTechResearchTime,
  RESEARCH_PREREQUISITES,
} from '@/lib/game/formulas';
import { calculateCurrentResources } from '@/lib/game/resources';
import {
  buildingArrayToMap,
  researchArrayToMap,
  planetToPlanetState,
} from '@/lib/game/validation/buildings';
import { canResearch } from '@/lib/game/validation/research';

export async function GET() {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get player with researches, research queue, and planet (for resources + lab)
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
    const buildingLevels = buildingArrayToMap(planet.buildings);
    const researchLevels = researchArrayToMap(researches);
    const labLevel = buildingLevels.RESEARCH_LAB ?? 0;

    // 3. Calculate current resources
    const planetState = planetToPlanetState(planet);
    const now = new Date();
    const currentResources = calculateCurrentResources(planetState, now);

    // 4. Check if there's an active research queue
    const activeQueue =
      researchQueue && researchQueue.status === 'IN_PROGRESS'
        ? researchQueue
        : null;

    // 5. Build response with all technology info
    const technologies = Object.values(TechType).map((type) => {
      const currentLevel = researchLevels[type] ?? 0;
      const nextLevel = currentLevel + 1;
      const cost = calculateResearchCost(type, nextLevel);
      const timeSeconds = calculateTechResearchTime(type, nextLevel, labLevel);
      const prerequisites = RESEARCH_PREREQUISITES[type];

      // Check if can research
      const { canResearch: canStart, reason } = canResearch(
        type,
        labLevel,
        researchLevels,
        currentResources,
        activeQueue !== null
      );

      return {
        type,
        level: currentLevel,
        nextLevel,
        cost,
        timeSeconds,
        labRequirement: prerequisites.labLevel,
        prerequisites: {
          research: prerequisites.research,
        },
        canResearch: canStart,
        researchBlockedReason: reason ?? null,
      };
    });

    // 6. Format active queue for response
    const activeQueueResponse = activeQueue
      ? {
          id: activeQueue.id,
          techType: activeQueue.techType,
          targetLevel: activeQueue.targetLevel,
          startTime: activeQueue.startTime.toISOString(),
          endTime: activeQueue.endTime.toISOString(),
          cost: {
            metal: activeQueue.metalCost,
            crystal: activeQueue.crystalCost,
            deuterium: activeQueue.deuteriumCost,
          },
          planetName: planet.name,
        }
      : null;

    return NextResponse.json({
      technologies,
      activeQueue: activeQueueResponse,
      resources: currentResources,
      labLevel,
    });
  } catch (error) {
    console.error('Research GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch research' },
      { status: 500 }
    );
  }
}
