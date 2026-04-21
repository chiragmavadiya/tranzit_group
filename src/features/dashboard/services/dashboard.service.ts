import api from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { DashboardMetricsResponse } from "../types";

export const dashboardService = {
  /**
   * Get dashboard metrics
   */
  getMetrics: async (): Promise<DashboardMetricsResponse> => {
    const response = await api.get<DashboardMetricsResponse>(API_ENDPOINTS.DASHBOARD.METRICS);
    return response.data;
  },
};
