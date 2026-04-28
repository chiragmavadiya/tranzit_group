import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { UndeliveredParcelFilters, UndeliveredParcelResponse } from "../types";

export const undeliveredParcelService = {
    getList: async (params: UndeliveredParcelFilters): Promise<UndeliveredParcelResponse> => {
        const response = await api.get<UndeliveredParcelResponse>(API_ENDPOINTS.ADMIN_REPORTS.UNDELIVERED_PARCELS, { params });
        return response.data;
    },

    export: async (params: { format: string; search?: string }): Promise<Blob> => {
        const response = await api.get(API_ENDPOINTS.ADMIN_REPORTS.UNDELIVERED_PARCELS_EXPORT, {
            params,
            responseType: "blob",
        });
        return response.data;
    },
};
