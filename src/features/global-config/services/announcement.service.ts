import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";

export interface AnnouncementPayload {
  target_type: 'all' | 'customer';
  customer_ids?: number[];
  text: string;
  text_color: string;
  background_color: string;
  expire_date: string;
}

export interface AnnouncementResponse {
  id: number;
  target_type: 'all' | 'customer';
  customer_ids: number[];
  text: string;
  text_color: string;
  background_color: string;
  expire_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface AnnouncementListApiResponse {
  status: boolean;
  message: string;
  data: AnnouncementResponse[] | {
    data: AnnouncementResponse[];
    total: number;
    current_page: number;
    per_page: number;
    last_page: number;
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface AnnouncementSingleApiResponse {
  status: boolean;
  message: string;
  data: AnnouncementResponse;
}

export const announcementService = {
  getAnnouncements: async (params?: { page?: number; per_page?: number; search?: string }): Promise<AnnouncementListApiResponse> => {
    const response = await api.get<AnnouncementListApiResponse>(API_ENDPOINTS.ANNOUNCEMENTS.BASE, { params });
    return response.data;
  },

  getAnnouncementById: async (id: number | string): Promise<AnnouncementSingleApiResponse> => {
    const response = await api.get<AnnouncementSingleApiResponse>(API_ENDPOINTS.ANNOUNCEMENTS.DETAILS(id));
    return response.data;
  },

  createAnnouncement: async (payload: AnnouncementPayload): Promise<AnnouncementSingleApiResponse> => {
    const response = await api.post<AnnouncementSingleApiResponse>(API_ENDPOINTS.ANNOUNCEMENTS.BASE, payload);
    return response.data;
  },

  updateAnnouncement: async (id: number | string, payload: AnnouncementPayload): Promise<AnnouncementSingleApiResponse> => {
    const response = await api.put<AnnouncementSingleApiResponse>(API_ENDPOINTS.ANNOUNCEMENTS.DETAILS(id), payload);
    return response.data;
  },

  deleteAnnouncement: async (id: number | string): Promise<{ status: boolean; message: string }> => {
    const response = await api.delete<{ status: boolean; message: string }>(API_ENDPOINTS.ANNOUNCEMENTS.DETAILS(id));
    return response.data;
  },
};
