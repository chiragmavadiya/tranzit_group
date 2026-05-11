import { useQuery } from "@tanstack/react-query";
import { cancelOrderService } from "../services/cancel-order.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { CancelOrderFilters } from "../types";

export function useCancelOrders(filters: CancelOrderFilters) {
    return useQuery({
        queryKey: [...QUERY_KEYS.ADMIN_CANCEL_ORDERS.LIST, filters],
        queryFn: () => cancelOrderService.getList(filters),
    });
}
