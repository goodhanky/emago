import { NextRequest, NextResponse } from 'next/server';
import { prisma, ShipType } from '@/lib/db';
import { calculateShipTime } from '@/lib/game/formulas';
import { buildingArrayToMap } from '@/lib/game/validation/buildings';

// Verify cron secret to prevent unauthorized access
const CRON_SECRET = process.env.CRON_SECRET;

/**
 * Ship Completion Cron Job
 *
 * Processes ship queues where currentShipEndTime has passed:
 * 1. Upserts completed ship(s) to PlanetShip
 * 2. Updates completedCount and currentShipEndTime for next ship
 * 3. Deletes queue when entire batch is complete
 *
 * Ships are built one at a time within a batch.
 * Idempotent: Only processes IN_PROGRESS queues with currentShipEndTime <= now
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

    // Find all queues where current ship has completed
    const completedShipQueues = await prisma.shipQueue.findMany({
      where: {
        status: 'IN_PROGRESS',
        currentShipEndTime: { lte: now },
      },
      include: {
        planet: {
          include: {
            buildings: true,
          },
        },
      },
    });

    if (completedShipQueues.length === 0) {
      return NextResponse.json({
        success: true,
        processed: 0,
        message: 'No completed ship builds',
      });
    }

    const results: Array<{
      planetId: string;
      shipType: ShipType;
      shipsCompleted: number;
      totalCompleted: number;
      batchComplete: boolean;
    }> = [];

    // Process each queue
    for (const queue of completedShipQueues) {
      const { planet } = queue;
      const buildingLevels = buildingArrayToMap(planet.buildings);
      const shipyardLevel = buildingLevels.SHIPYARD ?? 0;
      const naniteLevel = buildingLevels.NANITE_FACTORY ?? 0;

      // Calculate single ship build time (in milliseconds)
      const singleShipTimeSeconds = calculateShipTime(queue.shipType, shipyardLevel, naniteLevel);
      const singleShipTimeMs = singleShipTimeSeconds * 1000;

      // Execute transaction
      await prisma.$transaction(async (tx) => {
        // Double-check queue is still IN_PROGRESS (idempotency)
        const currentQueue = await tx.shipQueue.findUnique({
          where: { id: queue.id },
        });

        if (!currentQueue || currentQueue.status !== 'IN_PROGRESS') {
          // Already processed, skip
          return;
        }

        // Calculate how many ships have completed since last check
        // This handles cases where cron was delayed and multiple ships finished
        let shipsToComplete = 0;
        let checkTime = currentQueue.currentShipEndTime.getTime();
        const nowMs = now.getTime();
        const remaining = currentQueue.quantity - currentQueue.completedCount;

        while (checkTime <= nowMs && shipsToComplete < remaining) {
          shipsToComplete++;
          checkTime += singleShipTimeMs;
        }

        if (shipsToComplete === 0) {
          return; // No ships to complete
        }

        const newCompletedCount = currentQueue.completedCount + shipsToComplete;

        // Upsert ship count (increment by shipsToComplete)
        await tx.planetShip.upsert({
          where: {
            planetId_type: {
              planetId: queue.planetId,
              type: queue.shipType,
            },
          },
          update: {
            count: { increment: shipsToComplete },
          },
          create: {
            planetId: queue.planetId,
            type: queue.shipType,
            count: shipsToComplete,
          },
        });

        // Check if batch is complete
        if (newCompletedCount >= currentQueue.quantity) {
          // Delete queue (batch complete)
          await tx.shipQueue.delete({
            where: { id: queue.id },
          });

          results.push({
            planetId: queue.planetId,
            shipType: queue.shipType,
            shipsCompleted: shipsToComplete,
            totalCompleted: newCompletedCount,
            batchComplete: true,
          });
        } else {
          // Update for next ship
          const nextShipEndTime = new Date(
            currentQueue.currentShipEndTime.getTime() + (singleShipTimeMs * shipsToComplete)
          );

          await tx.shipQueue.update({
            where: { id: queue.id },
            data: {
              completedCount: newCompletedCount,
              currentShipEndTime: nextShipEndTime,
            },
          });

          results.push({
            planetId: queue.planetId,
            shipType: queue.shipType,
            shipsCompleted: shipsToComplete,
            totalCompleted: newCompletedCount,
            batchComplete: false,
          });
        }
      });
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      completions: results,
    });
  } catch (error) {
    console.error('Ship cron error:', error);
    return NextResponse.json(
      { error: 'Failed to process ship completions' },
      { status: 500 }
    );
  }
}
