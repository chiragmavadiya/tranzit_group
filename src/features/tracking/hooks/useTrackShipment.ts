import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/api.constants';
import { trackingService } from '../services/tracking.api';
import { normalizeShipment } from '../lib/normalizeShipment';
import { TrackingError, type Shipment, type TrackingMethod } from '../types';

/**
 * Disabled until a lookup is committed to the URL, so a direct link, a refresh and a
 * submit all take the same path. Keying on method + value means the two lookup types
 * never share a cache entry, and a repeat submit of the same value is served from cache
 * instead of firing a second request.
 */
export const useTrackShipment = (
  method: TrackingMethod,
  value: string,
  enabled = true,
) => {
  return useQuery<Shipment, TrackingError>({
    queryKey: QUERY_KEYS.PUBLIC_TRACKING(method, value),
    queryFn: async () => {
      const response = await trackingService.getShipment(method, value);
      return normalizeShipment(response, method === 'tracking_number' ? value : '');
    },
    enabled: enabled && value.length > 0,
    // A missing shipment is an answer, not a failure worth retrying. Neither is a
    // rejected lookup value.
    retry: (failureCount, error) =>
      error.kind === 'unavailable' && failureCount < 1,
    staleTime: 1000 * 60,
  });
};
