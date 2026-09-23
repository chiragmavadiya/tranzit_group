import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/constants/api.constants';
import type {
  TrackingPageSettingsResponse,
  TrackingPageSettingsUpdate,
} from '../types';

/**
 * The shared client prefixes the signed-in role, so this resolves to
 * /customer/tracking-page/settings.
 */
export const trackingPageService = {
  getSettings: async (): Promise<TrackingPageSettingsResponse> => {
    const response = await api.get<TrackingPageSettingsResponse>(
      API_ENDPOINTS.TRACKING_PAGE.SETTINGS,
    );
    return response.data;
  },

  /**
   * POST rather than PUT: the endpoint accepts both, and PHP does not parse multipart
   * bodies on PUT, so a logo upload would arrive empty.
   *
   * The multipart Content-Type has to be set explicitly. The shared client defaults every
   * request to application/json, and axios v1 responds to a JSON content type on FormData
   * by converting it with `JSON.stringify(formDataToJSON(data))` — which turns the File
   * into `{}` and fails backend validation. Naming multipart here stops that conversion;
   * the browser then replaces the header with its own boundary-carrying one.
   */
  updateSettings: async (
    update: TrackingPageSettingsUpdate,
  ): Promise<TrackingPageSettingsResponse> => {
    const formData = new FormData();

    if (update.logo) formData.append('logo', update.logo);
    if (update.remove_logo) formData.append('remove_logo', '1');
    // An empty string is how multipart carries "clear this field".
    if (update.brand_url !== undefined) formData.append('brand_url', update.brand_url ?? '');
    if (update.header_color !== undefined) {
      formData.append('header_color', update.header_color ?? '');
    }

    const response = await api.post<TrackingPageSettingsResponse>(
      API_ENDPOINTS.TRACKING_PAGE.SETTINGS,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response.data;
  },
};
