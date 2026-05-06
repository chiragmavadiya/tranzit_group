import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { integrationService } from "../services/integrationService";
import { showToast } from "@/components/ui/custom-toast";

export const useIntegrationsList = () => {
    return useQuery({
        queryKey: ["integrations"],
        queryFn: integrationService.getIntegrations
    });
};

export const useIntegrationStatus = (provider: string, enabled = true) => {
    return useQuery({
        queryKey: ["integration-status", provider],
        queryFn: () => integrationService.getStatus(provider),
        enabled: !!provider && enabled
    });
};

export const useConnectIntegration = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ provider, data }: { provider: string; data: any }) => {
            if (provider === 'woocommerce') {
                return integrationService.saveWooCommerce(data);
            }
            return integrationService.connect(provider, data);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["integrations"] });
            queryClient.invalidateQueries({ queryKey: ["integration-status", variables.provider] });
            showToast("Integration settings updated successfully!", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to connect", "error");
        }
    });
};

export const useDisconnectIntegration = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (provider: string) => integrationService.disconnect(provider),
        onSuccess: (_, provider) => {
            queryClient.invalidateQueries({ queryKey: ["integrations"] });
            queryClient.invalidateQueries({ queryKey: ["integration-status", provider] });
            showToast("Disconnected successfully", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to disconnect", "error");
        }
    });
};

export const useSyncIntegration = () => {
    return useMutation({
        mutationFn: (provider: string) => integrationService.sync(provider),
        onSuccess: () => {
            showToast("Synchronization started", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to start synchronization", "error");
        }
    });
};
