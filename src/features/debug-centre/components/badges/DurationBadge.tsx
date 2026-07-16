import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DurationBadgeProps {
  duration: number; // in milliseconds
  threshold?: number; // in milliseconds
}

function formatDuration(ms: number): string {
  if (!ms) return '-'
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export const DurationBadge = ({ duration, threshold }: DurationBadgeProps) => {
  const isSlowRequest = threshold && duration > threshold;
  if (!duration) return '-'
  return (
    <Badge
      variant="secondary"
      className={cn(
        'px-2 py-1 text-xs font-medium border',
        isSlowRequest
          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 animate-pulse'
          : 'bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
      )}
    >
      {formatDuration(duration)}
    </Badge>
  );
};
