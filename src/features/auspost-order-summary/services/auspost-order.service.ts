import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { AuspostOrderFilters, AuspostOrderResponse } from "../types";

export const auspostOrderService = {
    getSummary: async (params: AuspostOrderFilters): Promise<AuspostOrderResponse> => {
        const response = await api.get<AuspostOrderResponse>(API_ENDPOINTS.ADMIN_REPORTS.AUSPOST_ORDER_SUMMARY, { params });
        return response.data;
    },
};
