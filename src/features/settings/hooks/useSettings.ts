import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/api.constants";
import { settingsService } from "../services/settings.api";
import type { Setting } from "@/features/settings/types";
import { showToast } from "@/components/ui/custom-toast";

export const useSettings = () => {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN_SETTINGS.LIST,
        queryFn: () => settingsService.getSettings(),
    });
};

export const useSettingDetails = (slugOrId: string | number | null) => {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN_SETTINGS.DETAILS(slugOrId as any),
        queryFn: () => settingsService.getSettingDetails(slugOrId!),
        enabled: !!slugOrId,
    });
};

export const useUpdateSetting = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number | string; data: Partial<Setting> }) =>
            settingsService.updateSetting(id, data),
        onSuccess: (response, variables) => {
            if (response.status) {
                showToast(response.message || "Setting updated successfully", "success");
                queryClient.removeQueries({
                    queryKey: QUERY_KEYS.ADMIN_SETTINGS.DETAILS(variables.id as any),
                });
            } else {
                showToast(response.message || "Failed to update setting", "error");
            }
        },
        onError: (error: any) => {
            showToast(error.message || "An error occurred while updating the setting", "error");
        },
    });
};
