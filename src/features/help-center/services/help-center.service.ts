import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/constants/api.constants';
import type { HelpCenterCategory, HelpCenterArticle } from '../types';

export const helpCenterService = {
    getArticles: async (search?: string): Promise<{ status: boolean; message: string; data: HelpCenterCategory[] }> => {
        const response = await api.get(API_ENDPOINTS.HELP_CENTER.LIST, {
            params: { search }
        });
        return response.data;
    },

    getArticleDetails: async (slug: string): Promise<{ status: boolean; message: string; data: HelpCenterArticle }> => {
        const response = await api.get(API_ENDPOINTS.HELP_CENTER.DETAILS(slug));
        return response.data;
    }
};
