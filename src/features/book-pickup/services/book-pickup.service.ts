import { api } from "@/services/api";
import type { BookPickupResponse, BookPickupParams, CreatePickupRequest, CreatePickupResponse } from "../types";

export const bookPickupService = {
    getList: async (params?: BookPickupParams): Promise<BookPickupResponse> => {
        const response = await api.get("/admin/book-pickup", { params });
        return response.data;
    },
    create: async (data: CreatePickupRequest): Promise<CreatePickupResponse> => {
        const response = await api.post("/admin/book-pickup", data);
        return response.data;
    },
};
