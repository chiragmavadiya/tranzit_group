import api from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { 
    CourierPostcode, 
    CourierPostcodeFormData, 
    CourierPostcodeFilters 
} from "../types";

export interface CourierPostcodeListResponse {
    status: boolean;
    message: string;
    data: CourierPostcode[];
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
}

export interface CourierPostcodeDetailsResponse {
    status: boolean;
    message: string;
    data: CourierPostcode;
}

export const courierPostcodeService = {
    getList: async (params: CourierPostcodeFilters): Promise<CourierPostcodeListResponse> => {
        const response = await api.get<CourierPostcodeListResponse>(API_ENDPOINTS.ADMIN_COURIER_POSTCODES.BASE, { params });
        return response.data;
    },
    getDetails: async (id: number | string): Promise<CourierPostcodeDetailsResponse> => {
        const response = await api.get<CourierPostcodeDetailsResponse>(API_ENDPOINTS.ADMIN_COURIER_POSTCODES.DETAILS(id));
        return response.data;
    },
    create: async (data: CourierPostcodeFormData): Promise<{ status: boolean; message: string; data: { id: number } }> => {
        const response = await api.post(API_ENDPOINTS.ADMIN_COURIER_POSTCODES.BASE, data);
        return response.data;
    },
    update: async (id: number | string, data: CourierPostcodeFormData): Promise<{ status: boolean; message: string; data: { id: number } }> => {
        const response = await api.put(API_ENDPOINTS.ADMIN_COURIER_POSTCODES.DETAILS(id), data);
        return response.data;
    },
    delete: async (id: number | string): Promise<{ status: boolean; message: string }> => {
        const response = await api.delete(API_ENDPOINTS.ADMIN_COURIER_POSTCODES.DETAILS(id));
        return response.data;
    },
    export: async (params: { format: string; search?: string }): Promise<Blob> => {
        const response = await api.get(API_ENDPOINTS.ADMIN_COURIER_POSTCODES.EXPORT, {
            params,
            responseType: 'blob',
        });
        return response.data;
    }
};
