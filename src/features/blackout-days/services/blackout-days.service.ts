import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";

export interface BlackoutDayPayload {
  name: string;
  date: string; // 'yyyy-MM-dd'
}

export interface BlackoutDayResponse {
  id: number;
  name: string;
  date: string; // 'yyyy-MM-dd' or ISO date string
  created_at: string;
  updated_at?: string;
}

export interface BlackoutDayListApiResponse {
  status: boolean;
  message: string;
  data: BlackoutDayResponse[] | {
    data: BlackoutDayResponse[];
    total: number;
    current_page: number;
    per_page: number;
    last_page: number;
  };
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface BlackoutDaySingleApiResponse {
  status: boolean;
  message: string;
  data: BlackoutDayResponse;
}

export const blackoutDaysService = {
  getBlackoutDays: async (params?: { page?: number; per_page?: number; search?: string }): Promise<BlackoutDayListApiResponse> => {
    const response = await api.get<BlackoutDayListApiResponse>(API_ENDPOINTS.BLACKOUT_DAYS.BASE, { params });
    return response.data;
  },

  createBlackoutDay: async (payload: BlackoutDayPayload): Promise<BlackoutDaySingleApiResponse> => {
    const response = await api.post<BlackoutDaySingleApiResponse>(API_ENDPOINTS.BLACKOUT_DAYS.BASE, payload);
    return response.data;
  },

  updateBlackoutDay: async (id: number | string, payload: BlackoutDayPayload): Promise<BlackoutDaySingleApiResponse> => {
    const response = await api.put<BlackoutDaySingleApiResponse>(API_ENDPOINTS.BLACKOUT_DAYS.DETAILS(id), payload);
    return response.data;
  },

  deleteBlackoutDay: async (id: number | string): Promise<{ status: boolean; message: string }> => {
    const response = await api.delete<{ status: boolean; message: string }>(API_ENDPOINTS.BLACKOUT_DAYS.DETAILS(id));
    return response.data;
  },
};
