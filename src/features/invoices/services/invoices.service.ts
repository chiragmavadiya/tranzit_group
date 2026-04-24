import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/constants/api.constants';
import type { PaginatedInvoicesResponse, Invoice } from '../types';

export const invoicesService = {
  getCustomerInvoices: async (params?: { search?: string; page?: number; per_page?: number }): Promise<PaginatedInvoicesResponse> => {
    const response = await api.get(API_ENDPOINTS.INVOICES.BASE, { params });
    return response.data;
  },

  getCustomerInvoiceDetails: async (id: number): Promise<{ status: boolean; message: string; data: Invoice }> => {
    const response = await api.get(`${API_ENDPOINTS.INVOICES.BASE}/${id}`);
    return response.data;
  },

  exportCustomerInvoices: async (params: { format: string; search?: string }): Promise<{ blob: Blob; filename: string }> => {
    const response = await api.get(API_ENDPOINTS.INVOICES.EXPORT, {
      params,
      responseType: 'blob',
    });

    const filename = `Invoices_Export_${new Date().getTime()}.${params.format}`;
    return { blob: response.data, filename };
  }
};
