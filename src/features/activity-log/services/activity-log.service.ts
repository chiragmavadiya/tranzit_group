import api from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { ActivityLog, ActivityLogFilters } from "../types";

export interface ActivityLogListResponse {
    status: boolean;
    message: string;
    data: ActivityLog[];
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
}

export const activityLogService = {
    getList: async (params: ActivityLogFilters): Promise<ActivityLogListResponse> => {
        const response = await api.get<ActivityLogListResponse>(API_ENDPOINTS.ADMIN_ACTIVITIES.BASE, { params });
        return response.data;
    }
};
