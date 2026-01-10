import { NextRequest, NextResponse } from 'next/server';
import { prisma, TechType } from '@/lib/db';

// Verify cron secret to prevent unauthorized access
const CRON_SECRET = process.env.CRON_SECRET;

/**
 * Research Completion Cron Job
 *
 * Processes all completed research queues:
 * 1. Updates research level for the player
 * 2. Deletes the queue record
 *
 * Idempotent: Only processes IN_PROGRESS queues with endTime <= now
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authorization (Vercel Cron sends this header)
    // Skip auth in development for easier testing
    const authHeader = request.headers.get('authorization');
    if (process.env.NODE_ENV === 'production' && CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();

    // Find all completed research queues
    const completedQueues = await prisma.researchQueue.findMany({
      where: {
        status: 'IN_PROGRESS',
        endTime: { lte: now },
      },
      include: {
        player: {
          include: {
            researches: true,
          },
        },
      },
    });

    if (completedQueues.length === 0) {
      return NextResponse.json({
        success: true,
        processed: 0,
        message: 'No completed research queues',
      });
    }

    const results: Array<{
      playerId: string;
      techType: TechType;
      newLevel: number;
    }> = [];

    // Process each completed queue
    for (const queue of completedQueues) {
      const { player } = queue;
      const newLevel = queue.targetLevel;

      // Execute transaction: update research level + delete queue
      await prisma.$transaction(async (tx) => {
        // Double-check queue is still IN_PROGRESS (idempotency)
        const currentQueue = await tx.researchQueue.findUnique({
          where: { id: queue.id },
        });

        if (!currentQueue || currentQueue.status !== 'IN_PROGRESS') {
          // Already processed, skip
          return;
        }

        // Update research level
        await tx.research.update({
          where: {
            playerId_type: {
              playerId: player.id,
              type: queue.techType,
            },
          },
          data: { level: newLevel },
        });

        // Delete queue after completion (unique constraint allows only one per player)
        await tx.researchQueue.delete({
          where: { id: queue.id },
        });

        results.push({
          playerId: player.id,
          techType: queue.techType,
          newLevel,
        });
      });
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      completions: results,
    });
  } catch (error) {
    console.error('Research cron error:', error);
    return NextResponse.json(
      { error: 'Failed to process research completions' },
      { status: 500 }
    );
  }
}
