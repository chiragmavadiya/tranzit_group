import api from "@/services/api";
// import { API_ENDPOINTS } from "@/constants/api.constants";
import type { OrdersResponse } from "@/features/orders/types";

export const ordersService = {
    /**
     * Get customer orders
     */
    getOrders: async (tab?: string, rowsPerPage?: number, currentPage?: number): Promise<OrdersResponse> => {
        console.log(`Fetching orders for tab: ${tab || 'all'}`, rowsPerPage, currentPage);
        const response = await api.get<OrdersResponse>("https://dummyjson.com/c/777d-9016-4312-b5e1");
        return response.data;
    },
};
