/**
 * The two ways a customer can look a shipment up. The value doubles as the query
 * parameter name sent to GET /tracking, so it must stay in step with the backend.
 */
export type TrackingMethod = 'order_number' | 'tracking_number';

export const TRACKING_METHODS: ReadonlyArray<{
  key: TrackingMethod;
  /** Segmented control option. */
  tab: string;
  /** Field label and placeholder for the selected method. */
  label: string;
  placeholder: string;
  /** Shown when the lookup comes back empty. */
  notFound: string;
}> = [
  {
    key: 'tracking_number',
    tab: 'Track by Tracking Number',
    label: 'Tracking number',
    placeholder: 'Enter your tracking number',
    notFound: "We couldn't find a shipment for this tracking number.",
  },
  {
    key: 'order_number',
    tab: 'Track by Order Number',
    label: 'Order number',
    placeholder: 'Enter your order number',
    notFound: "We couldn't find a shipment for this order number.",
  },
];

export const DEFAULT_TRACKING_METHOD: TrackingMethod = 'tracking_number';

export const trackingMethodCopy = (method: TrackingMethod) =>
  TRACKING_METHODS.find((entry) => entry.key === method) ?? TRACKING_METHODS[0];

/**
 * Response contract for GET /tracking?order_number= | ?tracking_number=.
 *
 * Fields stay optional so a partial response still renders rather than throwing.
 * `normalizeShipment` is the single place that adapts this to the view model.
 */
export interface TrackingEventResponse {
  id?: string | number | null;
  status?: string | null;
  title?: string | null;
  description?: string | null;
  location?: string | null;
  occurred_at?: string | null;
}

/**
 * Branding for the customer who owns this shipment, resolved server-side. It travels with
 * the tracking response precisely so the public page never has to identify the customer
 * itself or call the authenticated settings endpoint.
 */
export interface TrackingBrandingResponse {
  logo?: string | null;
  brand_url?: string | null;
  header_color?: string | null;
}

export interface PublicTrackingResponse {
  branding?: TrackingBrandingResponse | null;
  tracking_number?: string | null;
  order_number?: string | null;
  order_ref?: string | null;
  /** Machine value, e.g. "in_transit" — never rendered directly. */
  status?: string | null;
  /** Display text for the status badge, e.g. "In transit". */
  status_label?: string | null;
  status_description?: string | null;
  courier?: {
    name?: string | null;
    logo?: string | null;
    tracking_url?: string | null;
  } | null;
  origin?: string | null;
  destination?: string | null;
  estimated_delivery_at?: string | null;
  delivered_at?: string | null;
  last_updated_at?: string | null;
  events?: TrackingEventResponse[] | null;
}

/** The normalised view model the UI renders. */
export interface TrackingEvent {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  dateTime: string | null;
}

/** Validated branding. Every field is null unless it survived validation. */
export interface ShipmentBranding {
  logoUrl: string | null;
  brandUrl: string | null;
  headerColor: string | null;
}

export const DEFAULT_BRANDING: ShipmentBranding = {
  logoUrl: null,
  brandUrl: null,
  headerColor: null,
};

export interface Shipment {
  branding: ShipmentBranding;
  trackingNumber: string;
  orderNumber: string | null;
  orderReference: string | null;
  status: string;
  statusLabel: string;
  statusDescription: string | null;
  courierName: string | null;
  courierLogoUrl: string | null;
  courierTrackingUrl: string | null;
  origin: string | null;
  destination: string | null;
  estimatedDeliveryAt: string | null;
  deliveredAt: string | null;
  lastUpdatedAt: string | null;
  events: TrackingEvent[];
}

export type TrackingErrorKind = 'not_found' | 'invalid' | 'unavailable';

/** Carries only a coarse kind, so no backend message can reach the public page. */
export class TrackingError extends Error {
  readonly kind: TrackingErrorKind;

  constructor(kind: TrackingErrorKind) {
    super(kind);
    this.name = 'TrackingError';
    this.kind = kind;
  }
}
