import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { auspostOrderService } from "../services/auspost-order.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { AuspostOrderFilters } from "../types";

export const useAuspostOrderSummary = (filters: AuspostOrderFilters) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.REPORTS.AUSPOST_SUMMARY, filters],
    queryFn: () => auspostOrderService.getSummary(filters),
    placeholderData: keepPreviousData,
  });
};
