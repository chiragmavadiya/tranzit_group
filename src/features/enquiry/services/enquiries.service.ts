import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/constants/api.constants';

export const enquiriesService = {
  createEnquiry: async (formData: FormData): Promise<{ status: boolean; message: string; data: any }> => {
    const response = await api.post(API_ENDPOINTS.ENQUIRIES.BASE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
