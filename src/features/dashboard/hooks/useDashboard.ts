import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";
import { QUERY_KEYS } from "@/constants/api.constants";

/**
 * Hook to fetch dashboard metrics
 */
export const useDashboardMetrics = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: params ? [...QUERY_KEYS.DASHBOARD.METRICS, params] : QUERY_KEYS.DASHBOARD.METRICS,
    queryFn: () => dashboardService.getMetrics(params),
  });
};
