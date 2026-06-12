import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { CancelOrderFilters, CancelOrderResponse, CancelOrderCountsResponse } from "../types";
import { getFileName } from "@/lib/utils";

export const cancelOrderService = {
    getList: async (params: CancelOrderFilters): Promise<CancelOrderResponse> => {
        const response = await api.get<CancelOrderResponse>(API_ENDPOINTS.ADMIN_CANCEL_ORDERS.BASE, { params });
        return response.data;
    },
    getCounts: async (params: { customer?: string | null }): Promise<CancelOrderCountsResponse> => {
        const response = await api.get<CancelOrderCountsResponse>(API_ENDPOINTS.ADMIN_CANCEL_ORDERS.COUNTS, { params });
        return response.data;
    },
    export: async (params: { format: string; status?: string; search?: string; customer?: string }): Promise<{ blob: Blob; filename: string }> => {
        const response = await api.get(API_ENDPOINTS.ADMIN_CANCEL_ORDERS.EXPORT, {
            params,
            responseType: "blob",
        });
        const format = params.format === "pdf" ? "pdf" : params.format === "csv" ? "csv" : "xls";
        const filename = getFileName(response) || `cancel-orders_${new Date().getTime()}.${format}`;

        return { blob: response.data, filename };
    }
};
