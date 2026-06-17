import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { TeamUserFormData } from "../types";

export const teamUsersService = {
  /**
   * Get list of team users
   */
  getList: async (params?: Record<string, any>) => {
    const response = await api.get(API_ENDPOINTS.CUSTOMER_TEAM.BASE, { params });
    return response.data;
  },

  /**
   * Get form options (roles/permissions options if applicable)
   */
  getFormOptions: async () => {
    const response = await api.get(API_ENDPOINTS.CUSTOMER_TEAM.FORM_OPTIONS);
    return response.data;
  },

  /**
   * Get team user details
   */
  getDetails: async (id: number | string) => {
    const response = await api.get(API_ENDPOINTS.CUSTOMER_TEAM.DETAILS(id));
    return response.data;
  },

  /**
   * Create team user
   */
  create: async (data: TeamUserFormData) => {
    const response = await api.post(API_ENDPOINTS.CUSTOMER_TEAM.BASE, data);
    return response.data;
  },

  /**
   * Update team user
   */
  update: async (id: number | string, data: TeamUserFormData) => {
    const response = await api.put(API_ENDPOINTS.CUSTOMER_TEAM.DETAILS(id), data);
    return response.data;
  },

  /**
   * Toggle team user status
   */
  toggleStatus: async (id: number | string) => {
    const response = await api.patch(API_ENDPOINTS.CUSTOMER_TEAM.TOGGLE_STATUS(id));
    return response.data;
  },

  /**
   * Delete team user
   */
  delete: async (id: number | string) => {
    const response = await api.delete(API_ENDPOINTS.CUSTOMER_TEAM.DETAILS(id));
    return response.data;
  },
};
