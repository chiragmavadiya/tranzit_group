import { useState, type ReactNode } from 'react';
import { Check, Copy, MapPin, MoveRight, PackageCheck } from 'lucide-react';
import { StatusBadge } from '@/features/orders/components/StatusBadge';
import { formatDate, formatDateTime } from '../lib/normalizeShipment';
import type { Shipment } from '../types';

interface ShipmentSummaryProps {
  shipment: Shipment;
}

export const ShipmentSummary = ({ shipment }: ShipmentSummaryProps) => {
  const [copied, setCopied] = useState(false);

  const copyTrackingNumber = async () => {
    try {
      await navigator.clipboard.writeText(shipment.trackingNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is unavailable (insecure context or denied permission); the number is
      // already on screen, so there is nothing useful to tell the user here.
    }
  };

  const facts: { label: string; value: ReactNode }[] = [
    ...(shipment.orderNumber
      ? [{ label: 'Order number', value: shipment.orderNumber }]
      : []),
    ...(shipment.orderReference
      ? [{ label: 'Order reference', value: shipment.orderReference }]
      : []),
    ...(shipment.courierName
      ? [{
          label: 'Courier',
          value: (
            <span className="flex items-center gap-2">
              {shipment.courierLogoUrl ? (
                <img
                  src={shipment.courierLogoUrl}
                  alt=""
                  className="h-6 max-w-[64px] shrink-0 object-contain"
                />
              ) : null}
              {shipment.courierName}
            </span>
          ),
        }]
      : []),
    ...(shipment.deliveredAt || shipment.estimatedDeliveryAt
      ? [{
          label: shipment.deliveredAt ? 'Delivered' : 'Estimated delivery',
          value: formatDate(shipment.deliveredAt ?? shipment.estimatedDeliveryAt),
        }]
      : []),
    ...(shipment.lastUpdatedAt
      ? [{ label: 'Last updated', value: formatDateTime(shipment.lastUpdatedAt) }]
      : []),
  ];

  const hasRoute = Boolean(shipment.origin || shipment.destination);

  return (
    <section
      aria-label="Shipment summary"
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-zinc-800/80">
        {shipment.trackingNumber ? (
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Tracking number
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span className="break-all font-mono text-lg font-bold text-slate-900 dark:text-zinc-100">
                {shipment.trackingNumber}
              </span>
              <button
                type="button"
                onClick={copyTrackingNumber}
                className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                aria-label={copied ? 'Tracking number copied' : 'Copy tracking number'}
              >
                {copied ? (
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                ) : (
                  <Copy className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        ) : null}

        {shipment.statusLabel ? (
          <StatusBadge status={shipment.statusLabel} compact={false} />
        ) : null}
      </div>

      {shipment.statusDescription ? (
        <p className="my-0 border-b border-slate-100 px-5 py-3 text-sm text-slate-600 dark:border-zinc-800/80 dark:text-zinc-400">
          {shipment.statusDescription}
        </p>
      ) : null}

      {shipment.deliveredAt ? (
        <div className="flex items-start gap-3 border-b border-emerald-100 bg-emerald-50/60 px-5 py-3.5 dark:border-emerald-900/30 dark:bg-emerald-950/20">
          <PackageCheck
            className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400"
            aria-hidden="true"
          />
          <div>
            <p className="my-0 text-sm font-bold text-emerald-900 dark:text-emerald-300">
              Delivered
            </p>
            <p className="my-0 mt-0.5 text-[13px] text-emerald-800/80 dark:text-emerald-400/80">
              {formatDateTime(shipment.deliveredAt)}
            </p>
          </div>
        </div>
      ) : null}

      {facts.length > 0 ? (
        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 px-5 py-4 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="min-w-0">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                {fact.label}
              </dt>
              <dd className="mt-1 ml-0 text-sm font-semibold text-slate-900 dark:text-zinc-100">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      {hasRoute ? (
        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/60 sm:flex-row sm:items-center sm:gap-5">
          <div className="min-w-0 flex-1">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
              From
            </span>
            <p className="my-0 mt-1 break-words text-[15px] font-bold leading-snug text-slate-900 dark:text-zinc-100">
              {shipment.origin ?? 'Not available'}
            </p>
          </div>

          <MoveRight
            className="size-5 shrink-0 rotate-90 self-start text-[#f59e0b] sm:mt-4 sm:rotate-0 sm:self-auto"
            aria-hidden="true"
          />

          <div className="min-w-0 flex-1">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
              To
            </span>
            <p className="my-0 mt-1 break-words text-[15px] font-bold leading-snug text-slate-900 dark:text-zinc-100">
              {shipment.destination ?? 'Not available'}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
};
