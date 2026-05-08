import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zohoService } from "../services/zoho.service";
import type { ZohoConfig } from "../types";

export const useZohoConfig = () => {
    return useQuery({
        queryKey: ["admin", "zoho", "config"],
        queryFn: () => zohoService.getConfig(),
    });
};

export const useSaveZohoConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ZohoConfig) => zohoService.saveConfig(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "zoho", "config"] });
        },
    });
};

export const useZohoRedirect = () => {
    return useMutation({
        mutationFn: () => zohoService.getRedirectUrl(),
        onSuccess: (response) => {
            if (response.data?.redirect_url) {
                window.location.href = response.data.redirect_url;
            }
        },
    });
};
