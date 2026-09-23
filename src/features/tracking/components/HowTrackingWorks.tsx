import { MapPinned, PackageSearch, ScanLine } from 'lucide-react';

const STEPS = [
  {
    icon: PackageSearch,
    title: 'Enter your tracking number',
    body: "It's in your shipping confirmation email or on your receipt from the store.",
  },
  {
    icon: ScanLine,
    title: 'See the latest courier update',
    body: 'Current status, location and estimated delivery, straight from the carrier.',
  },
  {
    icon: MapPinned,
    title: 'Follow your parcel until delivery',
    body: 'Check back any time — the timeline updates as your parcel moves.',
  },
];

export const HowTrackingWorks = () => (
  <section aria-labelledby="how-tracking-works" className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
    <h2
      id="how-tracking-works"
      className="my-0 text-lg font-bold text-[#0f2847] dark:text-zinc-100"
    >
      How tracking works
    </h2>

    <ol className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        return (
          <li
            key={step.title}
            className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#0f2847]/[0.06] text-[#0f2847] dark:bg-white/5 dark:text-zinc-300">
                <Icon className="size-[18px]" aria-hidden="true" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-zinc-600">
                Step {index + 1}
              </span>
            </div>

            <h3 className="my-0 mt-4 text-sm font-bold text-slate-900 dark:text-zinc-100">
              {step.title}
            </h3>
            <p className="my-0 mt-1.5 text-[13px] leading-relaxed text-slate-600 dark:text-zinc-400">
              {step.body}
            </p>
          </li>
        );
      })}
    </ol>
  </section>
);
