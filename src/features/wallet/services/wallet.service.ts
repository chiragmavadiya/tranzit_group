import { api } from "@/services/api";
import type { AdminTopupParams, AdminTopupResponse } from "../types";

export const walletService = {
  getAdminTopups: async (params?: AdminTopupParams): Promise<AdminTopupResponse> => {
    // Note: The interceptor will handle /admin prefix if not present, 
    // but the user's API is /api/admin/top-ups. 
    // Our base URL is already .../api, and interceptor handles the role prefix.
    const response = await api.get("/admin/top-ups", { params });
    return response.data;
  },
};
