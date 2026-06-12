import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { UndeliveredParcelFilters, UndeliveredParcelResponse } from "../types";
import { getFileName } from "@/lib/utils";

export const undeliveredParcelService = {
    getList: async (params: UndeliveredParcelFilters): Promise<UndeliveredParcelResponse> => {
        const response = await api.get<UndeliveredParcelResponse>(API_ENDPOINTS.ADMIN_REPORTS.UNDELIVERED_PARCELS, { params });
        return response.data;
    },

    export: async (params: { format: string; search?: string }): Promise<{ blob: Blob; filename: string }> => {
        const response = await api.get(API_ENDPOINTS.ADMIN_REPORTS.UNDELIVERED_PARCELS_EXPORT, {
            params,
            responseType: "blob",
        });
        const format = params.format === "pdf" ? "pdf" : params.format === "csv" ? "csv" : "xls";
        const filename = getFileName(response) || `undelivered-parcels_${new Date().getTime()}.${format}`;


        return { blob: response.data, filename };
    },
};
