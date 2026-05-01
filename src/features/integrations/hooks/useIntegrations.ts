import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { integrationService } from "../services/integrationService";
import { toast } from "sonner";

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
            toast.success("Integration settings updated successfully!");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to connect");
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
            toast.success("Disconnected successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to disconnect");
        }
    });
};

export const useSyncIntegration = () => {
    return useMutation({
        mutationFn: (provider: string) => integrationService.sync(provider),
        onSuccess: () => {
            toast.success("Synchronization started");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to start synchronization");
        }
    });
};
