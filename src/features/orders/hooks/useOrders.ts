import { useQuery } from "@tanstack/react-query";
import { ordersService } from "@/features/orders/services/orders.api";
import { QUERY_KEYS } from "@/constants/api.constants";

/**
 * Hook to fetch customer orders
 */
export const useOrders = (tab?: string, rowsPerPage?: number, currentPage?: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ORDERS.LIST, tab, rowsPerPage, currentPage],
    queryFn: () => ordersService.getOrders(tab),
    staleTime: 0, // Force re-fetch on tab change even if previously cached
  });
};
