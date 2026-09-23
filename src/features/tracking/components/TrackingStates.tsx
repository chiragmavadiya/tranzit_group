import type { ReactNode } from 'react';
import { PackageSearch, RefreshCw, ServerCrash, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { trackingMethodCopy, type TrackingMethod } from '../types';

const StateCard = ({
  icon,
  tone,
  title,
  children,
  action,
}: {
  icon: ReactNode;
  tone: string;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) => (
  <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
    <div
      className={cn(
        'mx-auto flex size-12 items-center justify-center rounded-full',
        tone,
      )}
    >
      {icon}
    </div>
    <h2 className="my-0 mt-4 text-lg font-bold text-slate-900 dark:text-zinc-100">{title}</h2>
    <div className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
      {children}
    </div>
    {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
  </div>
);

export const TrackingSkeleton = () => (
  <div className="flex flex-col gap-4" aria-hidden="true">
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <Skeleton className="h-3 w-28" />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
    </div>
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="mt-4 h-3 w-3/4" />
    </div>
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <Skeleton className="h-5 w-36" />
      <Skeleton className="mt-5 h-12 w-full" />
      <Skeleton className="mt-3 h-12 w-full" />
      <Skeleton className="mt-3 h-12 w-full" />
    </div>
  </div>
);

export const TrackingNotFound = ({
  method,
  value,
}: {
  method: TrackingMethod;
  value: string;
}) => {
  const copy = trackingMethodCopy(method);
  return (
    <StateCard
      icon={<PackageSearch className="size-6 text-slate-500 dark:text-zinc-400" aria-hidden="true" />}
      tone="bg-slate-100 dark:bg-zinc-900"
      title="We couldn't find that shipment"
    >
      <p className="my-0">
        {copy.notFound}{' '}
        <span className="break-all font-mono font-semibold text-slate-900 dark:text-zinc-200">
          {value}
        </span>
      </p>
      <p className="my-0 mt-2">
        Check the {copy.label.toLowerCase()} and try again. If your parcel was only just
        booked, it can take a few hours to appear here.
      </p>
    </StateCard>
  );
};

export const TrackingInvalidValue = ({ method }: { method: TrackingMethod }) => {
  const copy = trackingMethodCopy(method);
  return (
    <StateCard
      icon={<AlertTriangle className="size-6 text-amber-600 dark:text-amber-400" aria-hidden="true" />}
      tone="bg-amber-50 dark:bg-amber-950/30"
      title={`That doesn't look like a ${copy.label.toLowerCase()}`}
    >
      <p className="my-0">
        Check the {copy.label.toLowerCase()} on your shipping confirmation and enter it
        again. If you have an order number instead, switch the lookup above.
      </p>
    </StateCard>
  );
};

export const TrackingInvalidLink = () => (
  <StateCard
    icon={<AlertTriangle className="size-6 text-amber-600 dark:text-amber-400" aria-hidden="true" />}
    tone="bg-amber-50 dark:bg-amber-950/30"
    title="This tracking link isn't valid"
  >
    <p className="my-0">
      The link carries both an order number and a tracking number, so we can't tell which
      shipment you meant. Choose a lookup above and enter one of them.
    </p>
  </StateCard>
);

export const TrackingUnavailable = ({ onRetry }: { onRetry: () => void }) => (
  <StateCard
    icon={<ServerCrash className="size-6 text-amber-600 dark:text-amber-400" aria-hidden="true" />}
    tone="bg-amber-50 dark:bg-amber-950/30"
    title="Tracking is unavailable right now"
    action={
      <Button type="button" onClick={onRetry} className="h-9 px-5">
        <RefreshCw className="size-4" aria-hidden="true" />
        Try again
      </Button>
    }
  >
    <p className="my-0">
      We're unable to retrieve tracking details at the moment. Please try again shortly.
    </p>
  </StateCard>
);

export const TrackingNoEvents = () => (
  <StateCard
    icon={<Clock className="size-6 text-primary" aria-hidden="true" />}
    tone="bg-primary/10"
    title="No tracking updates yet"
  >
    <p className="my-0">
      Your shipment has been created, but the courier hasn't scanned it yet. Updates will
      appear here as soon as it starts moving.
    </p>
  </StateCard>
);
