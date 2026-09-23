import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { StaffFormData } from "../types";

export const staffService = {
  /**
   * Get list of staff users
   */
  getList: async (params?: Record<string, any>) => {
    const response = await api.get(API_ENDPOINTS.ADMIN_STAFF.BASE, { params });
    return response.data;
  },

  /**
   * Get counts (total, active, pending/inactive)
   */
  getCounts: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN_STAFF.COUNTS);
    return response.data;
  },

  /**
   * Get permissions and form options
   */
  getFormOptions: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN_STAFF.FORM_OPTIONS);
    return response.data;
  },

  /**
   * Create staff user
   */
  create: async (data: StaffFormData) => {
    const response = await api.post(API_ENDPOINTS.ADMIN_STAFF.BASE, data);
    return response.data;
  },

  /**
   * Get staff detail + permissions
   */
  getDetails: async (id: number | string) => {
    const response = await api.get(API_ENDPOINTS.ADMIN_STAFF.DETAILS(id));
    return response.data;
  },

  /**
   * Update staff user
   */
  update: async (id: number | string, data: StaffFormData) => {
    const response = await api.put(API_ENDPOINTS.ADMIN_STAFF.DETAILS(id), data);
    return response.data;
  },

  /**
   * Toggle status (Status Change PATCH)
   */
  toggleStatus: async (id: number | string, status: string | number) => {
    const response = await api.patch(API_ENDPOINTS.ADMIN_STAFF.TOGGLE_STATUS(id), { status: status.toString() });
    return response.data;
  },

  /**
   * Delete staff user
   */
  delete: async (id: number | string) => {
    const response = await api.delete(API_ENDPOINTS.ADMIN_STAFF.DETAILS(id));
    return response.data;
  },

  /**
   * Export staff list (csv or excel)
   */
  exportList: async (format: string, params?: Record<string, any>): Promise<{ blob: Blob; filename: string }> => {
    const response = await api.get(API_ENDPOINTS.ADMIN_STAFF.EXPORT, {
      params: { format, ...params },
      responseType: 'blob',
    });

    const disposition = response.headers['content-disposition'];
    let filename = `staff_export_${new Date().getTime()}.${format}`;

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
