import { RefreshCw, Radar, ShieldCheck, Truck } from 'lucide-react';
import { TrackingSearchForm } from './TrackingSearchForm';
import { DeliveryJourneyArt } from './DeliveryJourneyArt';
import type { TrackingMethod } from '../types';

interface TrackingHeroProps {
  method: TrackingMethod;
  onMethodChange: (method: TrackingMethod) => void;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (method: TrackingMethod, value: string) => void;
  isLoading: boolean;
}

const TRUST_POINTS = [
  { icon: RefreshCw, label: 'Real-time delivery updates' },
  { icon: Truck, label: 'Multiple couriers supported' },
  { icon: ShieldCheck, label: 'Secure shipment lookup' },
];

export const TrackingHero = ({
  method,
  onMethodChange,
  value,
  onChange,
  onSubmit,
  isLoading,
}: TrackingHeroProps) => (
  <section className="border-b border-slate-200/70 bg-white dark:border-zinc-800 dark:bg-zinc-950">
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          {/* Not a pill: at 320px this copy wraps, and a wrapped rounded-full badge looks broken. */}
          <span className="flex items-center gap-2 text-[11px] font-bold uppercase leading-relaxed tracking-[0.12em] text-[#b45309] dark:text-[#f59e0b]">
            <Radar className="size-4 shrink-0 text-[#f59e0b]" aria-hidden="true" />
            Fast and reliable shipment tracking
          </span>

          <h1 className="my-0 mt-5 text-3xl font-extrabold leading-[1.12] tracking-tight text-[#0f2847] dark:text-zinc-50 sm:text-4xl lg:text-[2.75rem]">
            Your delivery journey,
            <br className="hidden sm:block" /> all in one place
          </h1>

          <p className="my-0 mt-4 max-w-lg text-[15px] leading-relaxed text-slate-600 dark:text-zinc-400">
            Enter your tracking number to see the latest shipment status and delivery updates
            from the courier carrying your parcel.
          </p>

          <div className="mt-7 max-w-xl">
            <TrackingSearchForm
              method={method}
              onMethodChange={onMethodChange}
              value={value}
              onChange={onChange}
              onSubmit={onSubmit}
              isLoading={isLoading}
            />
          </div>

          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2.5">
            {TRUST_POINTS.map((point) => {
              const Icon = point.icon;
              return (
                <li
                  key={point.label}
                  className="flex items-center gap-2 text-[13px] font-semibold text-slate-600 dark:text-zinc-400"
                >
                  <Icon
                    className="size-4 shrink-0 text-[#0f2847]/50 dark:text-zinc-500"
                    aria-hidden="true"
                  />
                  {point.label}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="hidden sm:block lg:col-span-5">
          <DeliveryJourneyArt />
        </div>
      </div>
    </div>
  </section>
);
