import { api } from "@/services/api";
import type { ZohoConfig, ZohoConfigResponse, ZohoRedirectResponse } from "../types";
import { API_ENDPOINTS } from "@/constants/api.constants";

export const zohoService = {
    getConfig: async (): Promise<ZohoConfigResponse> => {
        const response = await api.get(API_ENDPOINTS.ZOHO.GET_CONFIG);
        return response.data;
    },
    saveConfig: async (data: ZohoConfig): Promise<{ status: boolean; message: string }> => {
        const response = await api.post(API_ENDPOINTS.ZOHO.SAVE_CONFIG, data);
        return response.data;
    },
    getRedirectUrl: async (): Promise<ZohoRedirectResponse> => {
        const response = await api.get(API_ENDPOINTS.ZOHO.GET_REDIRECT_URL);
        return response.data;
    },
};
