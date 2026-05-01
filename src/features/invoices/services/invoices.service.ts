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
  },

  createCustomerInvoice: async (data: any): Promise<{ status: boolean; message: string; data: any }> => {
    const response = await api.post(API_ENDPOINTS.ADMIN_INVOICES.BASE, data);
    return response.data;
  },

  getAdminInvoices: async (params?: { search?: string; page?: number; per_page?: number; customer?: string }): Promise<PaginatedInvoicesResponse> => {
    const response = await api.get(API_ENDPOINTS.ADMIN_INVOICES.BASE, { params });
    return response.data;
  },

  getAdminInvoiceDetails: async (id: string | number): Promise<{ status: boolean; message: string; data: any }> => {
    const response = await api.get(API_ENDPOINTS.ADMIN_INVOICES.DETAILS(id));
    return response.data;
  },

  updateAdminInvoice: async (id: string | number, data: any): Promise<{ status: boolean; message: string; data: any }> => {
    const response = await api.put(API_ENDPOINTS.ADMIN_INVOICES.DETAILS(id), data);
    return response.data;
  },

  deleteAdminInvoice: async (id: string | number): Promise<{ status: boolean; message: string }> => {
    const response = await api.delete(API_ENDPOINTS.ADMIN_INVOICES.DETAILS(id));
    return response.data;
  },

  sendAdminInvoice: async (id: string | number): Promise<{ status: boolean; message: string; data: any }> => {
    const response = await api.post(API_ENDPOINTS.ADMIN_INVOICES.SEND(id));
    return response.data;
  },

  downloadAdminInvoice: async (id: string | number): Promise<{ blob: Blob; filename: string }> => {
    const response = await api.get(API_ENDPOINTS.ADMIN_INVOICES.DOWNLOAD(id), {
      responseType: 'blob',
    });
    const filename = `Invoice_${id}.pdf`;
    return { blob: response.data, filename };
  },

  remindAdminInvoice: async (id: string | number): Promise<{ status: boolean; message: string }> => {
    const response = await api.post(API_ENDPOINTS.ADMIN_INVOICES.REMIND(id));
    return response.data;
  },

  zohoSyncAdminInvoice: async (id: string | number): Promise<{ status: boolean; message: string }> => {
    const response = await api.post(API_ENDPOINTS.ADMIN_INVOICES.ZOHO_SYNC(id));
    return response.data;
  },

  addAdminInvoicePayment: async (id: string | number, data: any): Promise<{ status: boolean; message: string; data: any }> => {
    const response = await api.post(API_ENDPOINTS.ADMIN_INVOICES.PAYMENTS(id), data);
    return response.data;
  },

  updateAdminInvoicePayment: async (invoiceId: string | number, paymentId: string | number, data: any): Promise<{ status: boolean; message: string; data: any }> => {
    const response = await api.put(API_ENDPOINTS.ADMIN_INVOICES.PAYMENT_DETAILS(invoiceId, paymentId), data);
    return response.data;
  },

  deleteAdminInvoicePayment: async (invoiceId: string | number, paymentId: string | number): Promise<{ status: boolean; message: string; data: any }> => {
    const response = await api.delete(API_ENDPOINTS.ADMIN_INVOICES.PAYMENT_DETAILS(invoiceId, paymentId));
    return response.data;
  },

  exportAdminInvoices: async (params: { format: string; customer?: string; search?: string }): Promise<{ blob: Blob; filename: string }> => {
    const response = await api.get(API_ENDPOINTS.ADMIN_INVOICES.EXPORT, {
      params,
      responseType: 'blob',
    });
    const filename = `Admin_Invoices_Export_${new Date().getTime()}.${params.format}`;
    return { blob: response.data, filename };
  }
};
