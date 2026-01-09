'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { BuildingType } from '@/lib/db';

// ============================================
// TYPES
// ============================================

interface Resources {
  metal: number;
  crystal: number;
  deuterium: number;
}

interface BuildingPrerequisite {
  building?: Partial<Record<string, number>>;
  research?: Partial<Record<string, number>>;
}

interface Building {
  type: BuildingType;
  level: number;
  nextLevel: number;
  cost: Resources;
  timeSeconds: number;
  prerequisites: BuildingPrerequisite;
  canUpgrade: boolean;
  upgradeBlockedReason: string | null;
}

interface ActiveQueue {
  id: string;
  buildingType: BuildingType;
  targetLevel: number;
  startTime: string;
  endTime: string;
  cost: Resources;
}

interface BuildingsListProps {
  initialQueue: ActiveQueue | null;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatBuildingType(type: string): string {
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
      return 'Another building is under construction';
    case 'prerequisites':
      return 'Prerequisites not met';
    case 'resources':
      return 'Insufficient resources';
    default:
      return '';
  }
}

function calculateProgress(startTime: string, endTime: string): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const now = Date.now();
  const total = end - start;
  const elapsed = now - start;
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

// Building icon mapping (convert type to filename)
function getBuildingIcon(type: string): string {
  const iconMap: Record<string, string> = {
    METAL_MINE: 'metal-mine',
    CRYSTAL_MINE: 'crystal-mine',
    DEUTERIUM_SYNTHESIZER: 'deuterium-synthesizer',
    SOLAR_PLANT: 'solar-plant',
    METAL_STORAGE: 'metal-storage',
    CRYSTAL_STORAGE: 'crystal-storage',
    DEUTERIUM_TANK: 'deuterium-tank',
    RESEARCH_LAB: 'research-lab',
    SHIPYARD: 'shipyard',
    ROBOT_FACTORY: 'robot-factory',
    NANITE_FACTORY: 'nanite-factory',
  };
  return iconMap[type] || type.toLowerCase().replace(/_/g, '-');
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
      <Image src={`/sprites/resources/${icon}.png`} alt={icon} width={14} height={14} />
      <span className={isInsufficient ? 'text-red-400' : 'text-slate-300'}>
        {formatNumber(amount)}
      </span>
    </div>
  );
}

function BuildingCard({
  building,
  resources,
  onUpgrade,
  isUpgrading,
  hasActiveQueue,
}: {
  building: Building;
  resources: Resources;
  onUpgrade: () => void;
  isUpgrading: boolean;
  hasActiveQueue: boolean;
}) {
  const canUpgrade = building.canUpgrade && !hasActiveQueue && !isUpgrading;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col">
      <div className="flex items-start gap-4">
        {/* Building Icon */}
        <div className="w-16 h-16 flex-shrink-0 bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden">
          <Image
            src={`/sprites/buildings/${getBuildingIcon(building.type)}.png`}
            alt={formatBuildingType(building.type)}
            width={48}
            height={48}
            className="object-contain"
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Building Name & Level */}
          <h3 className="text-white font-semibold truncate">
            {formatBuildingType(building.type)}
          </h3>
          <p className="text-slate-400 text-sm">Level {building.level}</p>

          {/* Upgrade Costs */}
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
            <ResourceCost icon="metal" amount={building.cost.metal} available={resources.metal} />
            <ResourceCost
              icon="crystal"
              amount={building.cost.crystal}
              available={resources.crystal}
            />
            {building.cost.deuterium > 0 && (
              <ResourceCost
                icon="deuterium"
                amount={building.cost.deuterium}
                available={resources.deuterium}
              />
            )}
          </div>

          {/* Construction Time */}
          <p className="text-slate-500 text-xs mt-2">
            Build time: {formatDuration(building.timeSeconds)}
          </p>
        </div>
      </div>

      {/* Prerequisites (if any) */}
      {(building.prerequisites.building || building.prerequisites.research) && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <p className="text-xs text-slate-500 mb-1">Requirements:</p>
          <div className="flex flex-wrap gap-2 text-xs">
            {building.prerequisites.building &&
              Object.entries(building.prerequisites.building).map(([req, level]) => (
                <span key={req} className="text-slate-400">
                  {formatBuildingType(req)} {level}
                </span>
              ))}
            {building.prerequisites.research &&
              Object.entries(building.prerequisites.research).map(([req, level]) => (
                <span key={req} className="text-slate-400">
                  {formatBuildingType(req)} {level}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Upgrade Button */}
      <button
        onClick={onUpgrade}
        disabled={!canUpgrade}
        className={`
          w-full mt-4 px-4 py-2 rounded-lg text-sm font-medium
          transition-colors
          ${
            canUpgrade
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }
        `}
      >
        {isUpgrading ? 'Starting...' : `Upgrade to Level ${building.nextLevel}`}
      </button>

      {/* Blocked Reason */}
      {!building.canUpgrade && building.upgradeBlockedReason && (
        <p className="text-red-400 text-xs mt-2 text-center">
          {getBlockedReasonText(building.upgradeBlockedReason)}
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
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const endTime = new Date(queue.endTime).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        onComplete();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [queue.endTime, onComplete]);

  return (
    <div className="bg-slate-800 border border-yellow-600/50 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex-shrink-0 bg-slate-900 rounded-lg flex items-center justify-center">
            <Image
              src={`/sprites/buildings/${getBuildingIcon(queue.buildingType)}.png`}
              alt=""
              width={32}
              height={32}
            />
          </div>
          <div>
            <h3 className="text-white font-semibold">
              Building: {formatBuildingType(queue.buildingType)} Level {queue.targetLevel}
            </h3>
            <p className="text-yellow-400 text-sm">
              Time remaining: {formatDuration(timeRemaining)}
            </p>
          </div>
        </div>

        <button
          onClick={onCancel}
          disabled={cancelling}
          className="px-4 py-2 bg-red-600/20 border border-red-600 text-red-400
                     hover:bg-red-600/30 rounded-lg text-sm transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelling ? 'Cancelling...' : 'Cancel'}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-500 transition-all duration-1000"
          style={{
            width: `${calculateProgress(queue.startTime, queue.endTime)}%`,
          }}
        />
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function BuildingsList({ initialQueue }: BuildingsListProps) {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [activeQueue, setActiveQueue] = useState<ActiveQueue | null>(initialQueue);
  const [resources, setResources] = useState<Resources>({ metal: 0, crystal: 0, deuterium: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  // Fetch buildings data
  const fetchBuildings = useCallback(async () => {
    try {
      const res = await fetch('/api/buildings');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setBuildings(data.buildings);
      setActiveQueue(data.activeQueue);
      setResources(data.resources);
    } catch (error) {
      console.error('Failed to fetch buildings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings]);

  // Handle upgrade
  const handleUpgrade = async (buildingType: BuildingType) => {
    setUpgrading(buildingType);
    try {
      const res = await fetch('/api/buildings/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildingType }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Failed to start upgrade');
        return;
      }

      // Refresh data
      await fetchBuildings();
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert('Failed to start upgrade');
    } finally {
      setUpgrading(null);
    }
  };

  // Handle cancel
  const handleCancel = async () => {
    if (!confirm('Cancel this construction? You will receive a full refund.')) {
      return;
    }

    setCancelling(true);
    try {
      const res = await fetch('/api/buildings/cancel', {
        method: 'POST',
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Failed to cancel');
        return;
      }

      // Refresh data
      await fetchBuildings();
    } catch (error) {
      console.error('Cancel failed:', error);
      alert('Failed to cancel construction');
    } finally {
      setCancelling(false);
    }
  };

  // Handle queue completion
  const handleQueueComplete = useCallback(() => {
    // Delay fetch slightly to allow server to process
    setTimeout(() => {
      fetchBuildings();
    }, 1000);
  }, [fetchBuildings]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(11)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-800 border border-slate-700 rounded-lg p-4 h-48 animate-pulse"
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

      {/* Buildings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buildings.map((building) => (
          <BuildingCard
            key={building.type}
            building={building}
            resources={resources}
            onUpgrade={() => handleUpgrade(building.type)}
            isUpgrading={upgrading === building.type}
            hasActiveQueue={!!activeQueue}
          />
        ))}
      </div>
    </div>
  );
}
