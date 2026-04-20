import api from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
  ItemFormData,
  ItemsListResponse,
  ItemDetailsResponse,
  ItemsFilters,
} from "../types";
import type { GenericResponse } from "@/features/auth/auth.types";

export const itemsService = {
  /**
   * Get list of items
   */
  getList: async (filters: ItemsFilters): Promise<ItemsListResponse> => {
    const response = await api.get<ItemsListResponse>(API_ENDPOINTS.ITEMS.BASE, {
      params: filters,
    });
    return response.data;
  },

  /**
   * Create a new item
   */
  create: async (data: ItemFormData): Promise<GenericResponse & { data: { id: number } }> => {
    const response = await api.post(API_ENDPOINTS.ITEMS.BASE, data);
    return response.data;
  },

  /**
   * Get item details
   */
  getDetails: async (id: number | string): Promise<ItemDetailsResponse> => {
    const response = await api.get<ItemDetailsResponse>(`${API_ENDPOINTS.ITEMS.BASE}/${id}`);
    return response.data;
  },

  /**
   * Update an item
   */
  update: async (id: number | string, data: ItemFormData): Promise<GenericResponse> => {
    const response = await api.put(`${API_ENDPOINTS.ITEMS.BASE}/${id}`, data);
    return response.data;
  },

  /**
   * Delete an item
   */
  delete: async (id: number | string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.ITEMS.BASE}/${id}`);
  },

  /**
   * Export items
   */
  export: async (format: string, search?: string): Promise<{ blob: Blob; filename: string }> => {
    const response = await api.get(API_ENDPOINTS.ITEMS.EXPORT, {
      params: { format, search },
      responseType: 'blob',
    });

    // Extract filename from Content-Disposition header
    const disposition = response.headers['content-disposition'];
    let filename = `items_export_${new Date().getTime()}.${format}`;

    if (disposition && disposition.indexOf('filename=') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    return { blob: response.data, filename };
  },
};
