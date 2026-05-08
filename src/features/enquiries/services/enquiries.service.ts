import { api } from '@/services/api';
import type { AdminInquiryResponse, AdminInquiryDetailResponse, EnquiryStatus } from '../types';

export const enquiriesService = {
  getAdminInquiries: async (params?: Record<string, any>): Promise<AdminInquiryResponse> => {
    const response = await api.get("/admin/inquiries", { params });
    return response.data;
  },

  getAdminInquiryDetails: async (id: number | string): Promise<AdminInquiryDetailResponse> => {
    const response = await api.get(`/admin/inquiries/${id}`);
    return response.data;
  },

  updateInquiryStatus: async (id: number | string, status: EnquiryStatus): Promise<{ status: boolean; message: string }> => {
    const response = await api.post(`/admin/inquiries/${id}/status`, { status });
    return response.data;
  },
};
