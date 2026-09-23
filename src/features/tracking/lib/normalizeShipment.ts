import { format, isValid, parseISO } from 'date-fns';
// Relative, not aliased: this module runs under node:test, which cannot resolve "@/".
import { isValidHexColor } from '../../../lib/color.ts';
import type {
  PublicTrackingResponse,
  Shipment,
  TrackingEvent,
  TrackingEventResponse,
} from '../types';

const text = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

/** Only ever hand an http(s) link to the browser, whatever the backend sends. */
const safeHttpUrl = (value: unknown): string | null => {
  const raw = text(value);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
};

/** "out_for_delivery" -> "Out for delivery". Only a fallback; prefer `status_label`. */
const humanize = (value: string): string => {
  const words = value.replace(/[_-]+/g, ' ').trim();
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : '';
};

const toTimestamp = (value: string | null): number | null => {
  if (!value) return null;
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed.getTime() : null;
};

/**
 * Renders an ISO timestamp in a readable form and passes anything else through untouched —
 * parts of this API return pre-formatted strings like "01/09/26 22:16" that must not be
 * guessed at.
 */
export const formatDateTime = (value: string | null): string | null => {
  if (!value) return null;
  const parsed = parseISO(value);
  return isValid(parsed) ? format(parsed, 'd MMM yyyy, h:mm a') : value;
};

export const formatDate = (value: string | null): string | null => {
  if (!value) return null;
  const parsed = parseISO(value);
  return isValid(parsed) ? format(parsed, 'EEEE d MMM yyyy') : value;
};

const toEvent = (event: TrackingEventResponse, index: number): TrackingEvent | null => {
  const title = text(event?.title) ?? text(event?.status);
  const description = text(event?.description);
  const dateTime = text(event?.occurred_at);

  if (!title && !description && !dateTime) return null;

  return {
    id: event?.id != null ? String(event.id) : `event-${index}`,
    title: title ?? 'Tracking update',
    description: description === title ? null : description,
    location: text(event?.location),
    dateTime,
  };
};

/**
 * The single adaptation point between the backend and the UI — if the response shape
 * changes, this is the only function that should need editing.
 *
 * `fallbackTrackingNumber` is only what the customer typed, so callers pass it for a
 * tracking-number lookup and an empty string for an order-number one — an order number
 * must never be displayed under the "Tracking number" label.
 */
export function normalizeShipment(
  raw: PublicTrackingResponse | null | undefined,
  fallbackTrackingNumber: string,
): Shipment {
  const rawEvents = Array.isArray(raw?.events) ? raw.events : [];

  const events = rawEvents
    .map(toEvent)
    .filter((event): event is TrackingEvent => event !== null);

  // Only reorder when every event carries a parseable timestamp; otherwise the backend's
  // own ordering is the better guess.
  const timestamps = events.map((event) => toTimestamp(event.dateTime));
  const sortable = timestamps.every((value) => value !== null);
  const orderedEvents = sortable
    ? events
        .map((event, index) => ({ event, at: timestamps[index] as number }))
        .sort((a, b) => b.at - a.at)
        .map((entry) => entry.event)
    : events;

  const status = text(raw?.status) ?? '';
  const headerColor = text(raw?.branding?.header_color);

  return {
    branding: {
      // Both go through the http(s) guard: they are rendered as an <img src> and an
      // <a href> on a public page, so a javascript:/data: value must never reach either.
      logoUrl: safeHttpUrl(raw?.branding?.logo),
      brandUrl: safeHttpUrl(raw?.branding?.brand_url),
      headerColor: headerColor && isValidHexColor(headerColor) ? headerColor : null,
    },
    trackingNumber: text(raw?.tracking_number) ?? fallbackTrackingNumber,
    orderNumber: text(raw?.order_number),
    orderReference: text(raw?.order_ref),
    status,
    // Older responses carry only a free-text status; showing the raw enum would print
    // "in_transit", so fall back to the humanised form of it.
    statusLabel: text(raw?.status_label) ?? humanize(status),
    statusDescription: text(raw?.status_description),
    courierName: text(raw?.courier?.name),
    courierLogoUrl: safeHttpUrl(raw?.courier?.logo),
    courierTrackingUrl: safeHttpUrl(raw?.courier?.tracking_url),
    origin: text(raw?.origin),
    destination: text(raw?.destination),
    estimatedDeliveryAt: text(raw?.estimated_delivery_at),
    deliveredAt: text(raw?.delivered_at),
    lastUpdatedAt: text(raw?.last_updated_at),
    events: orderedEvents,
  };
}
