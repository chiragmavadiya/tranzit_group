type StageKey =
  | 'received'
  | 'label_created'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered';

export const TRACKING_STAGES: ReadonlyArray<{ key: StageKey; label: string; shortLabel: string }> = [
  { key: 'received', label: 'Order received', shortLabel: 'Received' },
  { key: 'label_created', label: 'Label created', shortLabel: 'Label' },
  { key: 'picked_up', label: 'Picked up', shortLabel: 'Picked up' },
  { key: 'in_transit', label: 'In transit', shortLabel: 'In transit' },
  { key: 'out_for_delivery', label: 'Out for delivery', shortLabel: 'Out for delivery' },
  { key: 'delivered', label: 'Delivered', shortLabel: 'Delivered' },
];

export type ExceptionKind = 'delayed' | 'failed' | 'returned' | 'cancelled';

interface TrackingProgressState {
  reachedIndex: number;
  exception: ExceptionKind | null;
}

/**
 * The canonical statuses the API returns. Matched first and exactly, because keyword
 * matching gets them wrong — "out_for_delivery" contains "deliver" but not "out for",
 * so it would otherwise resolve all the way to Delivered.
 */
const CANONICAL_PROGRESS: Record<string, TrackingProgressState> = {
  pending: { reachedIndex: 0, exception: null },
  label_created: { reachedIndex: 1, exception: null },
  picked_up: { reachedIndex: 2, exception: null },
  in_transit: { reachedIndex: 3, exception: null },
  out_for_delivery: { reachedIndex: 4, exception: null },
  delivered: { reachedIndex: 5, exception: null },
  delivery_attempted: { reachedIndex: 4, exception: 'failed' },
  exception: { reachedIndex: 3, exception: 'delayed' },
  returned: { reachedIndex: 3, exception: 'returned' },
  cancelled: { reachedIndex: 0, exception: 'cancelled' },
};

/**
 * Progress is derived from the status rather than a per-event `completed` flag. A
 * canonical status maps directly; anything else falls back to keyword matching, since
 * carrier statuses can still arrive as free text. Order matters in the fallback:
 * "delivery attempt failed" and "out for delivery" both contain "deliver", so the
 * narrower checks have to run first — the same reason StatusBadge orders its fallbacks
 * that way.
 */
export function resolveProgress(status: string): TrackingProgressState {
  const value = status.trim().toLowerCase();
  if (!value) return { reachedIndex: 0, exception: null };

  const canonical = CANONICAL_PROGRESS[value];
  if (canonical) return canonical;

  if (value.includes('cancel')) return { reachedIndex: 0, exception: 'cancelled' };
  if (value.includes('return')) return { reachedIndex: 3, exception: 'returned' };
  if (value.includes('fail') || value.includes('unsuccessful') || value.includes('attempt')) {
    return { reachedIndex: 4, exception: 'failed' };
  }
  if (
    value.includes('delay') ||
    value.includes('exception') ||
    value.includes('held') ||
    value.includes('hold')
  ) {
    return { reachedIndex: 3, exception: 'delayed' };
  }

  if (value.includes('out for') || value.includes('out-for')) {
    return { reachedIndex: 4, exception: null };
  }
  if (value.includes('deliver')) return { reachedIndex: 5, exception: null };
  if (
    value.includes('transit') ||
    value.includes('shipping') ||
    value.includes('depot') ||
    value.includes('sorted') ||
    value.includes('scan')
  ) {
    return { reachedIndex: 3, exception: null };
  }
  if (value.includes('pick') || value.includes('collect')) return { reachedIndex: 2, exception: null };
  if (
    value.includes('label') ||
    value.includes('printed') ||
    value.includes('manifest') ||
    value.includes('consign')
  ) {
    return { reachedIndex: 1, exception: null };
  }
  return { reachedIndex: 0, exception: null };
}

export const EXCEPTION_COPY: Record<ExceptionKind, { title: string; body: string }> = {
  delayed: {
    title: 'This shipment is delayed',
    body: 'The courier has not moved it on schedule. Updates will appear here as soon as it is scanned again.',
  },
  failed: {
    title: 'A delivery attempt was unsuccessful',
    body: 'The courier was unable to complete delivery. They will usually try again on the next business day.',
  },
  returned: {
    title: 'This shipment is being returned',
    body: 'It is on its way back to the sender. Contact the sender if you were expecting this parcel.',
  },
  cancelled: {
    title: 'This shipment was cancelled',
    body: 'No further tracking updates are expected. Contact the sender if you need more information.',
  },
};
