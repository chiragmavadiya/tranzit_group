import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { SettingsResponse, Setting, SingleSettingResponse } from "../types";

export const settingsService = {
    /**
     * Get all system settings
     */
    getSettings: async (): Promise<SettingsResponse> => {
        const response = await api.get<SettingsResponse>(API_ENDPOINTS.ADMIN_SETTINGS.BASE);
        return response.data;
    },

    /**
     * Get details for a specific setting (uses slug or id)
     */
    getSettingDetails: async (slugOrId: number | string): Promise<SingleSettingResponse> => {
        const response = await api.get<SingleSettingResponse>(API_ENDPOINTS.ADMIN_SETTINGS.DETAILS(slugOrId));
        return response.data;
    },

    /**
     * Update a specific setting
     * The API requires a POST request to update settings
     */
    updateSetting: async (slugOrId: number | string, data: Partial<Setting>): Promise<{ status: boolean; message: string; data: Setting }> => {
        const response = await api.post(API_ENDPOINTS.ADMIN_SETTINGS.DETAILS(slugOrId), data);
        return response.data;
    },
};
