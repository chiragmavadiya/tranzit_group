import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";

export interface GlobalSearchResponse {
    status: boolean;
    message: string;
    data: {
        query: string;
        limit: number;
        totals: {
            orders: number;
            invoices: number;
            addresses?: number;
            customers?: number;
            items?: number;
        };
        orders: Array<{
            id: number;
            order_number: string;
            tracking_number: string | null;
            status: number;
            created_at: string;
        }>;
        invoices: any[];
        addresses?: any[];
        customers?: any[];
        items?: any[];
    };
}

export const searchService = {
    globalSearch: async (q: string, limit: number = 10): Promise<GlobalSearchResponse> => {
        const response = await api.get(API_ENDPOINTS.SEARCH.GLOBAL, {
            params: { q, limit },
        });
        return response.data;
    },
};
