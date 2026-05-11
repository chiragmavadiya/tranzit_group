import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { CancelOrderFilters, CancelOrderResponse } from "../types";

export const cancelOrderService = {
    getList: async (params: CancelOrderFilters): Promise<CancelOrderResponse> => {
        const response = await api.get<CancelOrderResponse>(API_ENDPOINTS.ADMIN_CANCEL_ORDERS.BASE, { params });
        return response.data;
    }
};
