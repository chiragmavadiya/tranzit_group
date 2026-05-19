import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { BookPickupResponse, BookPickupParams, CreatePickupRequest, CreatePickupResponse, BookPickupCountsResponse } from "../types";

export const bookPickupService = {
    getList: async (params?: BookPickupParams): Promise<BookPickupResponse> => {
        const response = await api.get<BookPickupResponse>(API_ENDPOINTS.ADMIN_BOOK_PICKUP.BASE, { params });
        return response.data;
    },
    getCounts: async (): Promise<BookPickupCountsResponse> => {
        const response = await api.get<BookPickupCountsResponse>(API_ENDPOINTS.ADMIN_BOOK_PICKUP.COUNTS);
        return response.data;
    },
    create: async (data: CreatePickupRequest): Promise<CreatePickupResponse> => {
        const response = await api.post<CreatePickupResponse>(API_ENDPOINTS.ADMIN_BOOK_PICKUP.BASE, data);
        return response.data;
    },
};
