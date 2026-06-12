import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import { auspostOrderService } from "../services/auspost-order.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { AuspostOrderFilters } from "../types";
import { showToast } from "@/components/ui/custom-toast";
import { downloadFile } from "@/lib/utils";

export const useAuspostOrderSummary = (filters: AuspostOrderFilters) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.REPORTS.AUSPOST_SUMMARY, filters],
    queryFn: () => auspostOrderService.getSummary(filters),
    placeholderData: keepPreviousData,
  });
};

export function useExportAuspostOrderSummary() {
  return useMutation({
    mutationFn: (params: { format: string; search?: string }) =>
      auspostOrderService.export(params),
    onSuccess: ({ blob, filename }) => {
      downloadFile(blob, filename);
    },
    onError: (error: any) => {
      showToast(error.message || "Failed to export Auspost order summary", "error");
    },
  });
}
