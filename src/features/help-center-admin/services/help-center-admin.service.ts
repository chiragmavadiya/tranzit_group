import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
    HelpArticleFilters,
    HelpArticleResponse,
    HelpArticleFormData,
    SingleArticleResponse,
} from "../types";

export const helpCenterAdminService = {
    getList: async (params: HelpArticleFilters): Promise<HelpArticleResponse> => {
        const response = await api.get<HelpArticleResponse>(API_ENDPOINTS.ADMIN_HELP_CENTER.BASE, { params });
        return response.data;
    },

    getDetails: async (id: string | number): Promise<SingleArticleResponse> => {
        const response = await api.get<SingleArticleResponse>(API_ENDPOINTS.ADMIN_HELP_CENTER.DETAILS(id));
        return response.data;
    },

    create: async (data: HelpArticleFormData): Promise<SingleArticleResponse> => {
        const response = await api.post<SingleArticleResponse>(API_ENDPOINTS.ADMIN_HELP_CENTER.BASE, data);
        return response.data;
    },

    update: async (id: string | number, data: HelpArticleFormData): Promise<SingleArticleResponse> => {
        const response = await api.put<SingleArticleResponse>(API_ENDPOINTS.ADMIN_HELP_CENTER.DETAILS(id), data);
        return response.data;
    },

    delete: async (id: string | number): Promise<{ status: boolean; message: string }> => {
        const response = await api.delete<{ status: boolean; message: string }>(API_ENDPOINTS.ADMIN_HELP_CENTER.DETAILS(id));
        return response.data;
    },
};
