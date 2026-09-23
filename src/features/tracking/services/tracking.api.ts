import axios from 'axios';
import { API_ENDPOINTS } from '@/constants/api.constants';
import { TrackingError, type PublicTrackingResponse, type TrackingMethod } from '../types';

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://127.0.0.1:8000/api';


const publicApi = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'ngrok-skip-browser-warning': '1',
  },
});

export const trackingService = {
  getShipment: async (
    method: TrackingMethod,
    value: string,
  ): Promise<PublicTrackingResponse> => {
    try {
      const response = await publicApi.get(API_ENDPOINTS.PUBLIC_TRACKING.SEARCH, {
        params: { [method]: value },
      });
      const body = response.data;
      return (body?.data ?? body) as PublicTrackingResponse;
    } catch (error) {
      // Collapse to a coarse kind so no backend copy can reach the public page.
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status === 404) throw new TrackingError('not_found');
      if (status === 400 || status === 422) throw new TrackingError('invalid');
      throw new TrackingError('unavailable');
    }
  },
};
