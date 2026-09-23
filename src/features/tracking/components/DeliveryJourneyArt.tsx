import { MapPin, PackageCheck, Truck, Warehouse } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Decorative only — an abstract illustration of what a tracked shipment looks like.
 * It carries no shipment data and is hidden from assistive technology.
 */
const JOURNEY_STAGES = [
  { icon: Warehouse, label: 'Collected', caption: 'Picked up from the sender' },
  { icon: Truck, label: 'In transit', caption: 'Moving through the courier network', current: true },
  { icon: MapPin, label: 'Out for delivery', caption: 'On board for the final leg' },
  { icon: PackageCheck, label: 'Delivered', caption: 'Handed over at the destination' },
];

export const DeliveryJourneyArt = () => (
  <div
    aria-hidden="true"
    className="relative isolate overflow-hidden rounded-2xl bg-[#0f2847] px-6 py-7 dark:bg-[#0b1a2e] sm:px-8 sm:py-9"
  >
    <svg
      className="pointer-events-none absolute -right-16 -top-12 -z-10 size-64 text-white/[0.07]"
      viewBox="0 0 200 200"
      fill="none"
    >
      <path
        d="M16 168C16 96 64 44 136 32"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="9 9"
        strokeLinecap="round"
      />
      <circle cx="16" cy="168" r="6" fill="currentColor" />
      <circle cx="136" cy="32" r="6" fill="currentColor" />
    </svg>

    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#f59e0b]">
      Every step, tracked
    </span>

    <ol className="mt-6 flex flex-col">
      {JOURNEY_STAGES.map((stage, index) => {
        const Icon = stage.icon;
        const isLast = index === JOURNEY_STAGES.length - 1;

        return (
          <li key={stage.label} className="relative flex gap-4 pb-5 last:pb-0">
            {!isLast ? (
              <span className="absolute left-[21px] top-12 h-[calc(100%-3rem)] w-px bg-white/15" />
            ) : null}

            <span
              className={cn(
                'flex size-11 shrink-0 items-center justify-center rounded-xl',
                stage.current
                  ? 'bg-[#f59e0b] text-[#0f2847] ring-4 ring-[#f59e0b]/20'
                  : 'bg-white/10 text-slate-300',
              )}
            >
              <Icon className="size-5" strokeWidth={2.2} />
            </span>

            <div className="min-w-0 pt-1">
              <p
                className={cn(
                  'my-0 text-sm font-bold',
                  stage.current ? 'text-white' : 'text-slate-300',
                )}
              >
                {stage.label}
              </p>
              <p className="my-0 mt-0.5 text-xs leading-relaxed text-slate-400">{stage.caption}</p>
            </div>
          </li>
        );
      })}
    </ol>
  </div>
);
