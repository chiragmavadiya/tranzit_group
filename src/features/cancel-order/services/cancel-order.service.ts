import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { CancelOrderFilters, CancelOrderResponse, CancelOrderCountsResponse } from "../types";

export const cancelOrderService = {
    getList: async (params: CancelOrderFilters): Promise<CancelOrderResponse> => {
        const response = await api.get<CancelOrderResponse>(API_ENDPOINTS.ADMIN_CANCEL_ORDERS.BASE, { params });
        return response.data;
    },
    getCounts: async (): Promise<CancelOrderCountsResponse> => {
        const response = await api.get<CancelOrderCountsResponse>(API_ENDPOINTS.ADMIN_CANCEL_ORDERS.COUNTS);
        return response.data;
    }
};
