import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { AuspostOrderFilters, AuspostOrderResponse } from "../types";
import { getFileName } from "@/lib/utils";

export const auspostOrderService = {
    getSummary: async (params: AuspostOrderFilters): Promise<AuspostOrderResponse> => {
        const response = await api.get<AuspostOrderResponse>(API_ENDPOINTS.ADMIN_REPORTS.AUSPOST_ORDER_SUMMARY, { params });
        return response.data;
    },
    export: async (params: { format: string; search?: string }): Promise<{ blob: Blob; filename: string }> => {
        const response = await api.get(API_ENDPOINTS.ADMIN_REPORTS.AUSPOST_ORDER_SUMMARY_EXPORT, {
            params,
            responseType: "blob",
        });
        const format = params.format === "pdf" ? "pdf" : params.format === "csv" ? "csv" : "xls";
        const filename = getFileName(response) || `auspost-order-summary_${new Date().getTime()}.${format}`;

        return { blob: response.data, filename };
    },
};
