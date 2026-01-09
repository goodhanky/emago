import { NextRequest, NextResponse } from 'next/server';
import { prisma, BuildingType } from '@/lib/db';
import {
  calculateAllProductionRates,
  calculateEnergyBalance,
} from '@/lib/game/formulas';
import { buildingArrayToMap } from '@/lib/game/validation/buildings';

// Verify cron secret to prevent unauthorized access
const CRON_SECRET = process.env.CRON_SECRET;

/**
 * Building Completion Cron Job
 *
 * Processes all completed building queues:
 * 1. Updates building level
 * 2. Recalculates production rates if applicable
 * 3. Updates energy balance
 * 4. Increments fieldsUsed
 * 5. Marks queue as COMPLETED
 *
 * Idempotent: Only processes IN_PROGRESS queues with endTime <= now
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authorization (Vercel Cron sends this header)
    const authHeader = request.headers.get('authorization');
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();

    // Find all completed building queues
    const completedQueues = await prisma.buildingQueue.findMany({
      where: {
        status: 'IN_PROGRESS',
        endTime: { lte: now },
      },
      include: {
        planet: {
          include: {
            buildings: true,
          },
        },
      },
    });

    if (completedQueues.length === 0) {
      return NextResponse.json({
        success: true,
        processed: 0,
        message: 'No completed building queues',
      });
    }

    const results: Array<{
      planetId: string;
      buildingType: BuildingType;
      newLevel: number;
    }> = [];

    // Process each completed queue
    for (const queue of completedQueues) {
      const { planet } = queue;
      const buildingLevels = buildingArrayToMap(planet.buildings);

      // Calculate new level (should match targetLevel, but we use it for safety)
      const newLevel = queue.targetLevel;

      // Update building levels map with the new level
      const updatedLevels = { ...buildingLevels, [queue.buildingType]: newLevel };

      // Recalculate production rates and energy
      const productionRates = calculateAllProductionRates(
        updatedLevels.METAL_MINE ?? 0,
        updatedLevels.CRYSTAL_MINE ?? 0,
        updatedLevels.DEUTERIUM_SYNTHESIZER ?? 0,
        updatedLevels.SOLAR_PLANT ?? 0,
        planet.temperature
      );

      const energyBalance = calculateEnergyBalance(
        updatedLevels.METAL_MINE ?? 0,
        updatedLevels.CRYSTAL_MINE ?? 0,
        updatedLevels.DEUTERIUM_SYNTHESIZER ?? 0,
        updatedLevels.SOLAR_PLANT ?? 0
      );

      // Execute transaction: update building, planet, and queue
      await prisma.$transaction(async (tx) => {
        // Double-check queue is still IN_PROGRESS (idempotency)
        const currentQueue = await tx.buildingQueue.findUnique({
          where: { id: queue.id },
        });

        if (!currentQueue || currentQueue.status !== 'IN_PROGRESS') {
          // Already processed, skip
          return;
        }

        // Update building level
        await tx.building.update({
          where: {
            planetId_type: {
              planetId: planet.id,
              type: queue.buildingType,
            },
          },
          data: { level: newLevel },
        });

        // Update planet production rates and energy
        await tx.planet.update({
          where: { id: planet.id },
          data: {
            metalPerHour: productionRates.metalPerHour,
            crystalPerHour: productionRates.crystalPerHour,
            deuteriumPerHour: productionRates.deuteriumPerHour,
            energyProduction: energyBalance.production,
            energyConsumption: energyBalance.consumption,
            fieldsUsed: { increment: 1 },
          },
        });

        // Mark queue as completed
        await tx.buildingQueue.update({
          where: { id: queue.id },
          data: { status: 'COMPLETED' },
        });

        results.push({
          planetId: planet.id,
          buildingType: queue.buildingType,
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
    console.error('Building cron error:', error);
    return NextResponse.json(
      { error: 'Failed to process building completions' },
      { status: 500 }
    );
  }
}
