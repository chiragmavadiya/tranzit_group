import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";
import { QUERY_KEYS } from "@/constants/api.constants";

/**
 * Hook to fetch dashboard metrics
 */
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.METRICS,
    queryFn: () => dashboardService.getMetrics(),
  });
};
