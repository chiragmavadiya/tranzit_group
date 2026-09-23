import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDateTime } from '../lib/normalizeShipment';
import type { TrackingEvent } from '../types';

interface TrackingTimelineProps {
  events: TrackingEvent[];
}

export const TrackingTimeline = ({ events }: TrackingTimelineProps) => {
  return (
    <section
      aria-label="Tracking history"
      className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <h2 className="my-0 border-b border-slate-100 px-5 py-4 text-base font-bold text-slate-900 dark:border-zinc-800/80 dark:text-zinc-100">
        Tracking history
      </h2>

      <ol className="flex flex-col px-5 py-5">
        {events.map((event, index) => {
          const isLatest = index === 0;
          const isLast = index === events.length - 1;

          return (
            <li key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className="absolute left-[7px] top-4 h-[calc(100%-1rem)] w-0.5 rounded-full bg-slate-200 dark:bg-zinc-800"
                />
              ) : null}

              <span
                aria-hidden="true"
                className={cn(
                  'relative z-10 mt-1 size-4 shrink-0 rounded-full border-2 bg-white dark:bg-zinc-950',
                  isLatest
                    ? 'border-primary ring-4 ring-primary/15'
                    : 'border-slate-300 dark:border-zinc-700',
                )}
              >
                {isLatest ? (
                  <span className="absolute inset-[3px] rounded-full bg-primary" />
                ) : null}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-x-4 gap-y-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3
                    className={cn(
                      'my-0 text-sm leading-snug',
                      isLatest
                        ? 'font-bold text-slate-900 dark:text-zinc-100'
                        : 'font-semibold text-slate-700 dark:text-zinc-300',
                    )}
                  >
                    {event.title}
                  </h3>
                  {event.dateTime ? (
                    <time className="shrink-0 text-xs font-medium text-slate-500 dark:text-zinc-500">
                      {formatDateTime(event.dateTime)}
                    </time>
                  ) : null}
                </div>

                {event.description ? (
                  <p className="my-0 mt-1 text-[13px] leading-relaxed text-slate-600 dark:text-zinc-400">
                    {event.description}
                  </p>
                ) : null}

                {event.location ? (
                  <p className="my-0 mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-zinc-500">
                    <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                    {event.location}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};
