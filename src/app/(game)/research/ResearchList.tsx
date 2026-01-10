'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { TechType } from '@/lib/db';

// ============================================
// TYPES
// ============================================

interface Resources {
  metal: number;
  crystal: number;
  deuterium: number;
}

interface ResearchPrerequisites {
  research?: Partial<Record<string, number>>;
}

interface Technology {
  type: TechType;
  level: number;
  nextLevel: number;
  cost: Resources;
  timeSeconds: number;
  labRequirement: number;
  prerequisites: ResearchPrerequisites;
  canResearch: boolean;
  researchBlockedReason: string | null;
}

interface ActiveQueue {
  id: string;
  techType: TechType;
  targetLevel: number;
  startTime: string;
  endTime: string;
  cost: Resources;
  planetName: string;
}

interface ResearchListProps {
  initialQueue: ActiveQueue | null;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatTechType(type: string): string {
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
      return 'Research already in progress';
    case 'lab_level':
      return 'Research Lab level too low';
    case 'prerequisites':
      return 'Research prerequisites not met';
    case 'resources':
      return 'Insufficient resources';
    default:
      return '';
  }
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

function ResearchCard({
  tech,
  resources,
  labLevel,
  onResearch,
  isResearching,
  hasActiveQueue,
}: {
  tech: Technology;
  resources: Resources;
  labLevel: number;
  onResearch: () => void;
  isResearching: boolean;
  hasActiveQueue: boolean;
}) {
  const canResearch = tech.canResearch && !hasActiveQueue && !isResearching;
  const labInsufficient = labLevel < tech.labRequirement;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col">
      <div className="flex items-start gap-4">
        {/* Tech Icon - using placeholder */}
        <div className="w-16 h-16 flex-shrink-0 bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden">
          <Image
            src="/sprites/icons/nav-research.png"
            alt={formatTechType(tech.type)}
            width={48}
            height={48}
            className="object-contain"
            unoptimized
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Tech Name & Level */}
          <h3 className="text-white font-semibold truncate">{formatTechType(tech.type)}</h3>
          <p className="text-slate-400 text-sm">Level {tech.level}</p>

          {/* Research Costs */}
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
            {tech.cost.metal > 0 && (
              <ResourceCost icon="metal" amount={tech.cost.metal} available={resources.metal} />
            )}
            {tech.cost.crystal > 0 && (
              <ResourceCost
                icon="crystal"
                amount={tech.cost.crystal}
                available={resources.crystal}
              />
            )}
            {tech.cost.deuterium > 0 && (
              <ResourceCost
                icon="deuterium"
                amount={tech.cost.deuterium}
                available={resources.deuterium}
              />
            )}
          </div>

          {/* Research Time */}
          <p className="text-slate-500 text-xs mt-2">
            Research time: {formatDuration(tech.timeSeconds)}
          </p>
        </div>
      </div>

      {/* Requirements */}
      <div className="mt-3 pt-3 border-t border-slate-700">
        <p className="text-xs text-slate-500 mb-1">Requirements:</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className={labInsufficient ? 'text-red-400' : 'text-slate-400'}>
            Research Lab {tech.labRequirement}
          </span>
          {tech.prerequisites.research &&
            Object.entries(tech.prerequisites.research).map(([req, level]) => (
              <span key={req} className="text-slate-400">
                {formatTechType(req)} {level}
              </span>
            ))}
        </div>
      </div>

      {/* Research Button */}
      <button
        onClick={onResearch}
        disabled={!canResearch}
        className={`
          w-full mt-4 px-4 py-2 rounded-lg text-sm font-medium
          transition-colors
          ${
            canResearch
              ? 'bg-purple-600 hover:bg-purple-500 text-white'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }
        `}
      >
        {isResearching ? 'Starting...' : `Research Level ${tech.nextLevel}`}
      </button>

      {/* Blocked Reason */}
      {!tech.canResearch && tech.researchBlockedReason && (
        <p className="text-red-400 text-xs mt-2 text-center">
          {getBlockedReasonText(tech.researchBlockedReason)}
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
  const [progress, setProgress] = useState<number>(0);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    const startTime = new Date(queue.startTime).getTime();
    const endTime = new Date(queue.endTime).getTime();
    const totalDuration = endTime - startTime;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      const elapsed = now - startTime;
      const currentProgress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

      setTimeRemaining(remaining);
      setProgress(currentProgress);

      if (remaining <= 0 && !isCompleting) {
        setIsCompleting(true);
        // Poll for completion
        onComplete();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 100);

    return () => clearInterval(interval);
  }, [queue.startTime, queue.endTime, onComplete, isCompleting]);

  return (
    <div className="bg-slate-800 border border-purple-600/50 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex-shrink-0 bg-slate-900 rounded-lg flex items-center justify-center">
            <Image
              src="/sprites/icons/nav-research.png"
              alt=""
              width={32}
              height={32}
              unoptimized
            />
          </div>
          <div>
            <h3 className="text-white font-semibold">
              Researching: {formatTechType(queue.techType)} Level {queue.targetLevel}
            </h3>
            <p className="text-purple-400 text-sm">
              {isCompleting ? (
                <span className="animate-pulse">Completing...</span>
              ) : (
                `Time remaining: ${formatDuration(timeRemaining)}`
              )}
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
          {cancelling ? 'Cancelling...' : 'Cancel'}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-purple-500"
          style={{
            width: `${progress}%`,
            transition: 'width 0.1s linear',
          }}
        />
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ResearchList({ initialQueue }: ResearchListProps) {
  const router = useRouter();
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [activeQueue, setActiveQueue] = useState<ActiveQueue | null>(initialQueue);
  const [resources, setResources] = useState<Resources>({ metal: 0, crystal: 0, deuterium: 0 });
  const [labLevel, setLabLevel] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [researching, setResearching] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  // Fetch research data
  const fetchResearch = useCallback(async () => {
    try {
      const res = await fetch('/api/research');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setTechnologies(data.technologies);
      setActiveQueue(data.activeQueue);
      setResources(data.resources);
      setLabLevel(data.labLevel);
    } catch (error) {
      console.error('Failed to fetch research:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchResearch();
  }, [fetchResearch]);

  // Handle research start
  const handleResearch = async (techType: TechType) => {
    setResearching(techType);
    try {
      const res = await fetch('/api/research/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ techType }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Failed to start research');
        return;
      }

      // Refresh data and server components (resource bar)
      await fetchResearch();
      router.refresh();
    } catch (error) {
      console.error('Research failed:', error);
      alert('Failed to start research');
    } finally {
      setResearching(null);
    }
  };

  // Handle cancel
  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await fetch('/api/research/cancel', {
        method: 'POST',
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Failed to cancel');
        return;
      }

      // Refresh data and server components (resource bar)
      await fetchResearch();
      router.refresh();
    } catch (error) {
      console.error('Cancel failed:', error);
      alert('Failed to cancel research');
    } finally {
      setCancelling(false);
    }
  };

  // Handle queue completion - poll until cron processes the research
  const handleQueueComplete = useCallback(() => {
    let attempts = 0;
    const maxAttempts = 30; // Poll for up to 60 seconds

    const pollForCompletion = async () => {
      attempts++;
      try {
        const res = await fetch('/api/research');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();

        // Check if queue is still active
        if (data.activeQueue) {
          // Still processing, try triggering cron manually in dev
          if (attempts === 1) {
            // Trigger cron to process the completed research
            const cronSecret = process.env.NEXT_PUBLIC_CRON_SECRET;
            fetch('/api/cron/research', {
              headers: cronSecret ? { Authorization: `Bearer ${cronSecret}` } : {},
            }).catch(() => {});
          }

          if (attempts < maxAttempts) {
            setTimeout(pollForCompletion, 2000);
          } else {
            // Give up polling, just update with current data
            setTechnologies(data.technologies);
            setActiveQueue(data.activeQueue);
            setResources(data.resources);
            setLabLevel(data.labLevel);
          }
        } else {
          // Queue cleared, update UI
          setTechnologies(data.technologies);
          setActiveQueue(data.activeQueue);
          setResources(data.resources);
          setLabLevel(data.labLevel);
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
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => (
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

      {/* Technologies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {technologies.map((tech) => (
          <ResearchCard
            key={tech.type}
            tech={tech}
            resources={resources}
            labLevel={labLevel}
            onResearch={() => handleResearch(tech.type)}
            isResearching={researching === tech.type}
            hasActiveQueue={!!activeQueue}
          />
        ))}
      </div>
    </div>
  );
}
