'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { ShipType } from '@/lib/db';

// ============================================
// TYPES
// ============================================

interface Resources {
  metal: number;
  crystal: number;
  deuterium: number;
}

interface ShipPrerequisites {
  research?: Partial<Record<string, number>>;
}

interface Ship {
  type: ShipType;
  count: number;
  cost: Resources;
  timeSeconds: number;
  shipyardRequirement: number;
  prerequisites: ShipPrerequisites;
  canBuild: boolean;
  buildBlockedReason: string | null;
}

interface ActiveQueue {
  id: string;
  shipType: ShipType;
  quantity: number;
  completedCount: number;
  startTime: string;
  endTime: string;
  currentShipEndTime: string;
  cost: Resources;
}

interface ShipyardListProps {
  initialQueue: ActiveQueue | null;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatShipType(type: string): string {
  return type
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

function formatDuration(seconds: number): string {
  if (seconds < 0) seconds = 0;
  if (seconds < 60) return `${seconds}s`;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  return parts.join(' ');
}

function formatNumber(num: number): string {
  return Math.floor(num).toLocaleString();
}

function getBlockedReasonText(reason: string | null): string {
  switch (reason) {
    case 'queue_active':
      return 'Ship construction in progress';
    case 'shipyard_level':
      return 'Shipyard level too low';
    case 'prerequisites':
      return 'Research prerequisites not met';
    case 'resources':
      return 'Insufficient resources';
    default:
      return '';
  }
}

function hasEnoughResources(current: Resources, required: Resources): boolean {
  return (
    current.metal >= required.metal &&
    current.crystal >= required.crystal &&
    current.deuterium >= required.deuterium
  );
}

// ============================================
// COMPONENTS
// ============================================

function ResourceCost({
  icon,
  amount,
  available,
}: {
  icon: string;
  amount: number;
  available?: number;
}) {
  const isInsufficient = available !== undefined && available < amount;

  return (
    <div className="flex items-center gap-1">
      <Image src={`/sprites/resources/${icon}.png`} alt={icon} width={14} height={14} unoptimized />
      <span className={isInsufficient ? 'text-red-400' : 'text-slate-300'}>
        {formatNumber(amount)}
      </span>
    </div>
  );
}

function ShipCard({
  ship,
  resources,
  shipyardLevel,
  onBuild,
  isBuilding,
  hasActiveQueue,
}: {
  ship: Ship;
  resources: Resources;
  shipyardLevel: number;
  onBuild: (quantity: number) => void;
  isBuilding: boolean;
  hasActiveQueue: boolean;
}) {
  const [quantity, setQuantity] = useState(1);

  // Calculate batch cost and time for display
  const batchCost = {
    metal: ship.cost.metal * quantity,
    crystal: ship.cost.crystal * quantity,
    deuterium: ship.cost.deuterium * quantity,
  };
  const batchTime = ship.timeSeconds * quantity;

  // Check if can afford the batch
  const canAffordBatch = hasEnoughResources(resources, batchCost);
  const shipyardInsufficient = shipyardLevel < ship.shipyardRequirement;

  // Can build if: meets prereqs, can afford, no active queue, not currently building
  const canBuild =
    ship.canBuild &&
    canAffordBatch &&
    !hasActiveQueue &&
    !isBuilding &&
    !shipyardInsufficient;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col">
      <div className="flex items-start gap-4">
        {/* Ship Icon - using placeholder */}
        <div className="w-16 h-16 flex-shrink-0 bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden">
          <Image
            src="/sprites/icons/nav-shipyard.png"
            alt={formatShipType(ship.type)}
            width={48}
            height={48}
            className="object-contain"
            unoptimized
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Ship Name & Count */}
          <h3 className="text-white font-semibold truncate">{formatShipType(ship.type)}</h3>
          <p className="text-slate-400 text-sm">Owned: {ship.count}</p>

          {/* Per-unit costs */}
          <div className="mt-2">
            <p className="text-xs text-slate-500 mb-1">Cost per ship:</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
              {ship.cost.metal > 0 && (
                <ResourceCost icon="metal" amount={ship.cost.metal} />
              )}
              {ship.cost.crystal > 0 && (
                <ResourceCost icon="crystal" amount={ship.cost.crystal} />
              )}
              {ship.cost.deuterium > 0 && (
                <ResourceCost icon="deuterium" amount={ship.cost.deuterium} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Batch costs (dynamic based on quantity) */}
      <div className="mt-3 pt-3 border-t border-slate-700">
        <p className="text-xs text-slate-500 mb-1">Total for {quantity}x:</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
          {batchCost.metal > 0 && (
            <ResourceCost icon="metal" amount={batchCost.metal} available={resources.metal} />
          )}
          {batchCost.crystal > 0 && (
            <ResourceCost icon="crystal" amount={batchCost.crystal} available={resources.crystal} />
          )}
          {batchCost.deuterium > 0 && (
            <ResourceCost
              icon="deuterium"
              amount={batchCost.deuterium}
              available={resources.deuterium}
            />
          )}
        </div>
        <p className="text-slate-500 text-xs mt-1">
          Build time: {formatDuration(batchTime)} ({formatDuration(ship.timeSeconds)} each)
        </p>
      </div>

      {/* Requirements */}
      <div className="mt-3 pt-3 border-t border-slate-700">
        <p className="text-xs text-slate-500 mb-1">Requirements:</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className={shipyardInsufficient ? 'text-red-400' : 'text-slate-400'}>
            Shipyard {ship.shipyardRequirement}
          </span>
          {ship.prerequisites.research &&
            Object.entries(ship.prerequisites.research).map(([req, level]) => (
              <span key={req} className="text-slate-400">
                {formatShipType(req)} {level}
              </span>
            ))}
        </div>
      </div>

      {/* Quantity Input & Build Button */}
      <div className="mt-4 flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={999}
          value={quantity}
          onChange={(e) =>
            setQuantity(Math.min(999, Math.max(1, parseInt(e.target.value) || 1)))
          }
          className="w-20 px-2 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-center text-sm focus:outline-none focus:border-orange-500"
        />
        <button
          onClick={() => onBuild(quantity)}
          disabled={!canBuild}
          className={`
            flex-1 px-4 py-2 rounded-lg text-sm font-medium
            transition-colors
            ${
              canBuild
                ? 'bg-orange-600 hover:bg-orange-500 text-white'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }
          `}
        >
          {isBuilding ? 'Starting...' : `Build ${quantity}x`}
        </button>
      </div>

      {/* Blocked Reason */}
      {!ship.canBuild && ship.buildBlockedReason && (
        <p className="text-red-400 text-xs mt-2 text-center">
          {getBlockedReasonText(ship.buildBlockedReason)}
        </p>
      )}
    </div>
  );
}

function ActiveQueuePanel({
  queue,
  onCancel,
  cancelling,
  onComplete,
}: {
  queue: ActiveQueue;
  onCancel: () => void;
  cancelling: boolean;
  onComplete: () => void;
}) {
  const [timeToCurrentShip, setTimeToCurrentShip] = useState<number>(0);
  const [timeToBatch, setTimeToBatch] = useState<number>(0);
  const [currentShipProgress, setCurrentShipProgress] = useState<number>(0);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    const startTime = new Date(queue.startTime).getTime();
    const batchEnd = new Date(queue.endTime).getTime();
    const currentShipEnd = new Date(queue.currentShipEndTime).getTime();
    const totalBatchDuration = batchEnd - startTime;
    const singleShipDuration = totalBatchDuration / queue.quantity;

    const updateTimer = () => {
      const now = Date.now();

      // Time remaining for current ship
      const remainingCurrentShip = Math.max(0, Math.floor((currentShipEnd - now) / 1000));
      setTimeToCurrentShip(remainingCurrentShip);

      // Time remaining for batch
      const remainingBatch = Math.max(0, Math.floor((batchEnd - now) / 1000));
      setTimeToBatch(remainingBatch);

      // Progress for current ship only
      const currentShipStart = currentShipEnd - singleShipDuration;
      const elapsed = now - currentShipStart;
      const progress = Math.min(100, Math.max(0, (elapsed / singleShipDuration) * 100));
      setCurrentShipProgress(progress);

      if (remainingCurrentShip <= 0 && !isCompleting) {
        setIsCompleting(true);
        onComplete();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 100);

    return () => clearInterval(interval);
  }, [queue, onComplete, isCompleting]);

  const unbuiltCount = queue.quantity - queue.completedCount;

  return (
    <div className="bg-slate-800 border border-orange-600/50 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex-shrink-0 bg-slate-900 rounded-lg flex items-center justify-center">
            <Image
              src="/sprites/icons/nav-shipyard.png"
              alt=""
              width={32}
              height={32}
              unoptimized
            />
          </div>
          <div>
            <h3 className="text-white font-semibold">
              Building: {formatShipType(queue.shipType)}
            </h3>
            <p className="text-orange-400 text-sm">
              {isCompleting ? (
                <span className="animate-pulse">Completing ship...</span>
              ) : (
                <>
                  Progress: {queue.completedCount + 1} / {queue.quantity}
                </>
              )}
            </p>
            <p className="text-slate-400 text-xs">
              Current ship: {formatDuration(timeToCurrentShip)} | Batch: {formatDuration(timeToBatch)}
            </p>
          </div>
        </div>

        <button
          onClick={onCancel}
          disabled={cancelling || isCompleting}
          className="px-4 py-2 bg-red-600/20 border border-red-600 text-red-400
                     hover:bg-red-600/30 rounded-lg text-sm transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelling ? 'Cancelling...' : `Cancel (${unbuiltCount} remaining)`}
        </button>
      </div>

      {/* Current Ship Progress Bar */}
      <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500"
          style={{
            width: `${currentShipProgress}%`,
            transition: 'width 0.1s linear',
          }}
        />
      </div>

      {/* Batch Progress Indicator */}
      <div className="mt-2 flex gap-1">
        {Array.from({ length: Math.min(queue.quantity, 20) }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded ${
              i < queue.completedCount
                ? 'bg-green-500'
                : i === queue.completedCount
                  ? 'bg-orange-500'
                  : 'bg-slate-600'
            }`}
          />
        ))}
        {queue.quantity > 20 && (
          <span className="text-xs text-slate-500 ml-1">+{queue.quantity - 20}</span>
        )}
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ShipyardList({ initialQueue }: ShipyardListProps) {
  const router = useRouter();
  const [ships, setShips] = useState<Ship[]>([]);
  const [activeQueue, setActiveQueue] = useState<ActiveQueue | null>(initialQueue);
  const [resources, setResources] = useState<Resources>({ metal: 0, crystal: 0, deuterium: 0 });
  const [shipyardLevel, setShipyardLevel] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [building, setBuilding] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  // Fetch ships data
  const fetchShips = useCallback(async () => {
    try {
      const res = await fetch('/api/ships');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setShips(data.ships);
      setActiveQueue(data.activeQueue);
      setResources(data.resources);
      setShipyardLevel(data.shipyardLevel);
    } catch (error) {
      console.error('Failed to fetch ships:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchShips();
  }, [fetchShips]);

  // Handle ship build
  const handleBuild = async (shipType: ShipType, quantity: number) => {
    setBuilding(shipType);
    try {
      const res = await fetch('/api/ships/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipType, quantity }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Failed to start ship build');
        return;
      }

      // Refresh data and server components (resource bar)
      await fetchShips();
      router.refresh();
    } catch (error) {
      console.error('Ship build failed:', error);
      alert('Failed to start ship build');
    } finally {
      setBuilding(null);
    }
  };

  // Handle cancel
  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await fetch('/api/ships/cancel', {
        method: 'POST',
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Failed to cancel');
        return;
      }

      // Refresh data and server components (resource bar)
      await fetchShips();
      router.refresh();
    } catch (error) {
      console.error('Cancel failed:', error);
      alert('Failed to cancel ship build');
    } finally {
      setCancelling(false);
    }
  };

  // Handle queue completion - poll until cron processes the ship
  const handleQueueComplete = useCallback(() => {
    let attempts = 0;
    const maxAttempts = 30;

    const pollForCompletion = async () => {
      attempts++;
      try {
        const res = await fetch('/api/ships');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();

        // Check if queue state changed (either more ships completed or queue cleared)
        const queueCleared = !data.activeQueue;
        const queueUpdated =
          data.activeQueue &&
          activeQueue &&
          data.activeQueue.completedCount > activeQueue.completedCount;

        if (queueCleared || queueUpdated) {
          // Queue updated, update UI
          setShips(data.ships);
          setActiveQueue(data.activeQueue);
          setResources(data.resources);
          setShipyardLevel(data.shipyardLevel);
        } else {
          // Still processing, try triggering cron manually in dev
          if (attempts === 1) {
            const cronSecret = process.env.NEXT_PUBLIC_CRON_SECRET;
            fetch('/api/cron/ships', {
              headers: cronSecret ? { Authorization: `Bearer ${cronSecret}` } : {},
            }).catch(() => {});
          }

          if (attempts < maxAttempts) {
            setTimeout(pollForCompletion, 2000);
          } else {
            // Give up polling, just update with current data
            setShips(data.ships);
            setActiveQueue(data.activeQueue);
            setResources(data.resources);
            setShipyardLevel(data.shipyardLevel);
          }
        }
      } catch (error) {
        console.error('Poll failed:', error);
        if (attempts < maxAttempts) {
          setTimeout(pollForCompletion, 2000);
        }
      }
    };

    // Start polling after a short delay
    setTimeout(pollForCompletion, 1000);
  }, [activeQueue]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-800 border border-slate-700 rounded-lg p-4 h-64 animate-pulse"
          >
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-slate-700 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-700 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Queue Panel */}
      {activeQueue && (
        <ActiveQueuePanel
          queue={activeQueue}
          onCancel={handleCancel}
          cancelling={cancelling}
          onComplete={handleQueueComplete}
        />
      )}

      {/* Ships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ships.map((ship) => (
          <ShipCard
            key={ship.type}
            ship={ship}
            resources={resources}
            shipyardLevel={shipyardLevel}
            onBuild={(quantity) => handleBuild(ship.type, quantity)}
            isBuilding={building === ship.type}
            hasActiveQueue={!!activeQueue}
          />
        ))}
      </div>
    </div>
  );
}
