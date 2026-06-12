import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { BookPickupResponse, BookPickupParams, CreatePickupRequest, CreatePickupResponse, BookPickupCountsResponse } from "../types";
import { getFileName } from "@/lib/utils";

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
    export: async (
        format: string,
        book?: number
    ): Promise<{ blob: Blob; filename: string }> => {
        const response = await api.get(API_ENDPOINTS.ADMIN_BOOK_PICKUP.EXPORT, {
            params: { format, book },
            responseType: "blob",
        });
        const formated = format === "pdf" ? "pdf" : format === "csv" ? "csv" : "xls";
        const filename = getFileName(response) || `book-pickup_${new Date().getTime()}.${formated}`;

        return { blob: response.data, filename };
    },

};
