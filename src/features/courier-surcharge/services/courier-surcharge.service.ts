import api from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { 
    CourierSurcharge, 
    CourierSurchargeFormData, 
    CourierSurchargeFilters 
} from "../types";

export interface GlobalCourier {
    id: number;
    name: string;
}

export interface GlobalCourierResponse {
    status: boolean;
    message: string;
    data: GlobalCourier[];
}

export interface SurchargeListResponse {
    status: boolean;
    message: string;
    data: CourierSurcharge[];
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
}

export interface SurchargeDetailsResponse {
    status: boolean;
    message: string;
    data: CourierSurcharge;
}

export const courierSurchargeService = {
    getList: async (params: CourierSurchargeFilters): Promise<SurchargeListResponse> => {
        const response = await api.get<SurchargeListResponse>(API_ENDPOINTS.ADMIN_COURIER_SURCHARGES.BASE, { params });
        return response.data;
    },
    getDetails: async (id: number | string): Promise<SurchargeDetailsResponse> => {
        const response = await api.get<SurchargeDetailsResponse>(API_ENDPOINTS.ADMIN_COURIER_SURCHARGES.DETAILS(id));
        return response.data;
    },
    create: async (data: CourierSurchargeFormData): Promise<{ status: boolean; message: string; data: { id: number } }> => {
        const response = await api.post(API_ENDPOINTS.ADMIN_COURIER_SURCHARGES.BASE, data);
        return response.data;
    },
    update: async (id: number | string, data: CourierSurchargeFormData): Promise<{ status: boolean; message: string; data: { id: number } }> => {
        const response = await api.put(API_ENDPOINTS.ADMIN_COURIER_SURCHARGES.DETAILS(id), data);
        return response.data;
    },
    delete: async (id: number | string): Promise<{ status: boolean; message: string }> => {
        const response = await api.delete(API_ENDPOINTS.ADMIN_COURIER_SURCHARGES.DETAILS(id));
        return response.data;
    },
    getGlobalCouriers: async (): Promise<GlobalCourierResponse> => {
        const response = await api.get<GlobalCourierResponse>(API_ENDPOINTS.ADMIN_COURIER_SURCHARGES.GLOBAL_COURIERS);
        return response.data;
    },
    export: async (params: { format: string; search?: string }): Promise<Blob> => {
        const response = await api.get(API_ENDPOINTS.ADMIN_COURIER_SURCHARGES.EXPORT, {
            params,
            responseType: 'blob',
        });
        return response.data;
    }
};
