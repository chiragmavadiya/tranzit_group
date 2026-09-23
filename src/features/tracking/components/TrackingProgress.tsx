import { AlertTriangle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  EXCEPTION_COPY,
  TRACKING_STAGES,
  resolveProgress,
  type ExceptionKind,
} from '../lib/trackingStages';

interface TrackingProgressProps {
  status: string;
}

const EXCEPTION_TONE: Record<ExceptionKind, string> = {
  delayed:
    'border-amber-200 bg-amber-50/70 text-amber-900 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-300',
  failed:
    'border-rose-200 bg-rose-50/70 text-rose-900 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-300',
  returned:
    'border-amber-200 bg-amber-50/70 text-amber-900 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-300',
  cancelled:
    'border-slate-200 bg-slate-50 text-slate-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300',
};

export const TrackingProgress = ({ status }: TrackingProgressProps) => {
  const { reachedIndex, exception } = resolveProgress(status);

  // Reaching the last stage is an outcome, not a step still in progress. Without this the
  // final dot renders as "current" — hollow, next to five filled ticks — so a delivered
  // parcel reads as stalled at the finish.
  const isJourneyComplete =
    exception === null && reachedIndex === TRACKING_STAGES.length - 1;

  return (
    <section
      aria-label="Delivery progress"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6"
    >
      <ol className="flex flex-col sm:flex-row">
        {TRACKING_STAGES.map((stage, index) => {
          const isCurrent = index === reachedIndex;
          const isDone = index < reachedIndex || (isJourneyComplete && isCurrent);
          const isLast = index === TRACKING_STAGES.length - 1;
          const isFlagged = isCurrent && exception !== null;

          return (
            <li
              key={stage.key}
              aria-current={isCurrent ? 'step' : undefined}
              className="relative flex flex-1 gap-3 pb-7 last:pb-0 sm:flex-col sm:items-center sm:gap-2.5 sm:pb-0 sm:text-center"
            >
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute left-[11px] top-7 h-[calc(100%-1.75rem)] w-0.5 rounded-full sm:left-1/2 sm:top-[11px] sm:h-0.5 sm:w-full',
                    isDone ? 'bg-primary' : 'bg-slate-200 dark:bg-zinc-800',
                  )}
                />
              ) : null}

              <span
                aria-hidden="true"
                className={cn(
                  'relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 bg-white transition-colors dark:bg-zinc-950',
                  isDone && 'border-primary bg-primary dark:bg-primary',
                  isCurrent && !isFlagged && 'border-primary ring-4 ring-primary/15',
                  isFlagged && 'border-amber-500 ring-4 ring-amber-500/15',
                  !isDone && !isCurrent && 'border-slate-200 dark:border-zinc-800',
                )}
              >
                {isDone ? (
                  <Check className="size-3.5 text-white" strokeWidth={3} />
                ) : isFlagged ? (
                  <AlertTriangle className="size-3 text-amber-500" strokeWidth={2.5} />
                ) : isCurrent ? (
                  <span className="size-2 rounded-full bg-primary" />
                ) : null}
              </span>

              <span
                className={cn(
                  'text-[13px] leading-tight sm:px-1',
                  isDone && 'font-semibold text-slate-600 dark:text-zinc-400',
                  isCurrent && 'font-bold text-slate-900 dark:text-zinc-100',
                  !isDone && !isCurrent && 'font-medium text-slate-400 dark:text-zinc-600',
                )}
              >
                {stage.label}
              </span>
            </li>
          );
        })}
      </ol>

      {exception ? (
        <div
          className={cn(
            'mt-6 flex items-start gap-3 rounded-lg border px-4 py-3',
            EXCEPTION_TONE[exception],
          )}
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div>
            <p className="my-0 text-sm font-bold">{EXCEPTION_COPY[exception].title}</p>
            <p className="my-0 mt-0.5 text-[13px] leading-relaxed opacity-90">
              {EXCEPTION_COPY[exception].body}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
};
