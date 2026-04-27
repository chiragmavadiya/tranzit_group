import api from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { 
    QuoteSummary, 
    QuoteDetails, 
    QuoteFilters, 
    GetQuoteServicesPayload, 
    CreateQuotePayload,
    ServiceRate
} from "../types";

export interface QuoteListResponse {
    status: boolean;
    message: string;
    data: QuoteSummary[];
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
}

export interface QuoteDetailsResponse {
    status: boolean;
    message: string;
    data: QuoteDetails;
}

export interface QuoteServicesResponse {
    services: ServiceRate[];
    surcharges: any;
}

export const quoteService = {
    getList: async (params: QuoteFilters): Promise<QuoteListResponse> => {
        const response = await api.get<QuoteListResponse>(API_ENDPOINTS.ADMIN_QUOTES.BASE, { params });
        return response.data;
    },
    getDetails: async (id: number | string): Promise<QuoteDetailsResponse> => {
        const response = await api.get<QuoteDetailsResponse>(API_ENDPOINTS.ADMIN_QUOTES.DETAILS(id));
        return response.data;
    },
    getServices: async (data: GetQuoteServicesPayload): Promise<QuoteServicesResponse> => {
        const response = await api.post<QuoteServicesResponse>(API_ENDPOINTS.ADMIN_QUOTES.SERVICES, data);
        return response.data;
    },
    create: async (data: CreateQuotePayload): Promise<{ status: boolean; message: string; data: any }> => {
        const response = await api.post(API_ENDPOINTS.ADMIN_QUOTES.BASE, data);
        return response.data;
    },
    export: async (params: { format: string; search?: string }): Promise<Blob> => {
        const response = await api.get(API_ENDPOINTS.ADMIN_QUOTES.EXPORT, {
            params,
            responseType: 'blob',
        });
        return response.data;
    }
};
