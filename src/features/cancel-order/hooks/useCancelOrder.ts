import { useQuery, useMutation } from "@tanstack/react-query";
import { cancelOrderService } from "../services/cancel-order.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { CancelOrderFilters } from "../types";
import { showToast } from "@/components/ui/custom-toast";
import { downloadFile } from "@/lib/utils";

export function useCancelOrders(filters: CancelOrderFilters) {
    return useQuery({
        queryKey: [...QUERY_KEYS.ADMIN_CANCEL_ORDERS.LIST, filters],
        queryFn: () => cancelOrderService.getList(filters),
    });
}

export function useCancelOrderCounts(params: { customer?: string | null }) {
    return useQuery({
        queryKey: [...QUERY_KEYS.ADMIN_CANCEL_ORDERS.COUNTS, params],
        queryFn: () => cancelOrderService.getCounts(params),
    });
}

export function useExportCancelOrders() {
    return useMutation({
        mutationFn: (params: { format: string; status?: string; search?: string; customer?: string }) =>
            cancelOrderService.export(params),
        onSuccess: ({ blob, filename }) => {
            downloadFile(blob, filename);
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to export canceled orders", "error");
        }
    });
}

