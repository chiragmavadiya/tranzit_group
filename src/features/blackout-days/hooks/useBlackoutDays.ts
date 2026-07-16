import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blackoutDaysService, type BlackoutDayPayload } from "../services/blackout-days.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import { showToast } from "@/components/ui/custom-toast";

export function useBlackoutDays(params?: { page?: number; per_page?: number; search?: string }) {
  return useQuery({
    queryKey: [...QUERY_KEYS.BLACKOUT_DAYS.LIST, params],
    queryFn: () => blackoutDaysService.getBlackoutDays(params),
  });
}

export function useCreateBlackoutDay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BlackoutDayPayload) => blackoutDaysService.createBlackoutDay(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BLACKOUT_DAYS.LIST });
      showToast(response.message || "Blackout day created successfully", "success");
    },
    onError: (error: any) => {
      showToast(error.message || "Failed to create blackout day", "error");
    },
  });
}

export function useUpdateBlackoutDay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: BlackoutDayPayload }) =>
      blackoutDaysService.updateBlackoutDay(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BLACKOUT_DAYS.LIST });
      showToast(response.message || "Blackout day updated successfully", "success");
    },
    onError: (error: any) => {
      showToast(error.message || "Failed to update blackout day", "error");
    },
  });
}

export function useDeleteBlackoutDay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => blackoutDaysService.deleteBlackoutDay(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BLACKOUT_DAYS.LIST });
      showToast(response.message || "Blackout day deleted successfully", "success");
    },
    onError: (error: any) => {
      showToast(error.message || "Failed to delete blackout day", "error");
    },
  });
}
