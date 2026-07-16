import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { integrationService } from "../services/integrationService";
import { showToast } from "@/components/ui/custom-toast";
import { QUERY_KEYS } from "@/constants/api.constants";

export const useIntegrationsList = () => {
    return useQuery({
        queryKey: QUERY_KEYS.INTEGRATIONS.LIST,
        queryFn: integrationService.getIntegrations
    });
};

export const useIntegrationStatus = (provider: string, enabled = true) => {
    return useQuery({
        queryKey: QUERY_KEYS.INTEGRATIONS.STATUS(provider),
        queryFn: () => integrationService.getStatus(provider),
        enabled: !!provider && enabled
    });
};

export const useIntegrationStatusMutation = () => {
    return useMutation({
        mutationFn: (provider: string) => integrationService.getStatus(provider)
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
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS(variables.provider) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.LIST });
            showToast(response?.message || "Integration settings updated successfully!", "success");
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
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.LIST });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS(provider) });
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

export const useToggleProductStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ provider, productCode, enabled }: { provider: string; productCode: string; enabled: boolean }) =>
            integrationService.toggleProductStatus(provider, productCode, enabled),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS(variables.provider) });
            showToast("Product status updated", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update product status", "error");
        }
    });
};

export const useUpdateAdvancedSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ provider, settings }: { provider: string; settings: any }) =>
            integrationService.updateAdvancedSettings(provider, settings),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS(variables.provider) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER_DETAILS });
            showToast("Advanced settings updated", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update advanced settings", "error");
        }
    });
};

export const useAddManualProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ provider, data }: { provider: string; data: { product_code: string; product_name: string; enabled: boolean } }) =>
            integrationService.addManualProduct(provider, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS(variables.provider) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.MANUAL_PRODUCTS(variables.provider) });
            showToast("Product added successfully", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to add product", "error");
        }
    });
};

export const useGetManualProducts = (provider: string, enabled = true) => {
    return useQuery({
        queryKey: QUERY_KEYS.INTEGRATIONS.MANUAL_PRODUCTS(provider),
        queryFn: () => integrationService.getManualProducts(provider),
        enabled: !!provider && enabled
    });
};

export const useUpdateManualProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ provider, productCode, data }: { provider: string; productCode: string; data: { product_code?: string; product_name?: string; enabled?: boolean } }) =>
            integrationService.updateManualProduct(provider, productCode, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS(variables.provider) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.MANUAL_PRODUCTS(variables.provider) });
            showToast("Product updated successfully", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update product", "error");
        }
    });
};

export const useDeleteManualProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ provider, productCode }: { provider: string; productCode: string }) =>
            integrationService.deleteManualProduct(provider, productCode),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS(variables.provider) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.MANUAL_PRODUCTS(variables.provider) });
            showToast("Product deleted successfully", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to delete product", "error");
        }
    });
};

export const usePatchProductStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ provider, productCode, enabled }: { provider: string; productCode: string; enabled: boolean }) =>
            integrationService.patchProductStatus(provider, productCode, enabled),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS(variables.provider) });
            showToast("Product status updated", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update product status", "error");
        }
    });
};

export const useGetProducts = (provider: string, enabled = true) => {
    return useQuery({
        queryKey: QUERY_KEYS.INTEGRATIONS.PRODUCTS(provider),
        queryFn: () => integrationService.getProducts(provider),
        enabled: !!provider && enabled
    });
};

export const useGetDeliveryPreferences = (enabled = true) => {
    return useQuery({
        queryKey: QUERY_KEYS.INTEGRATIONS.DELIVERY_PREFERENCES,
        queryFn: integrationService.getDeliveryPreferences,
        enabled
    });
};

export const useSetDeliveryPreferences = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => integrationService.setDeliveryPreferences(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.DELIVERY_PREFERENCES });
            showToast("Delivery preferences updated", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update delivery preferences", "error");
        }
    });
};

export const useSetDefaultIntegration = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (provider: string) => integrationService.setDefault(provider),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.LIST });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER_DETAILS });
            showToast("Default integration updated successfully", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to set default integration", "error");
        }
    });
};

export const useRemoveDefaultIntegration = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (provider: string) => integrationService.removeDefault(provider),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.LIST });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER_DETAILS });
            showToast(response.message || "Default integration removed successfully", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to remove default integration", "error");
        }
    });
};

export const useToggleEbayAutoSync = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (enabled: boolean) => integrationService.toggleEbayAutoSync(enabled),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS("ebay") });
            showToast("eBay Auto-sync status updated", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update eBay Auto-sync status", "error");
        }
    });
};

export const useToggleEbayAutoFulfillment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (enabled: boolean) => integrationService.toggleEbayAutoFulfillment(enabled),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS("ebay") });
            showToast("eBay Auto-fulfillment status updated", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update eBay Auto-fulfillment status", "error");
        }
    });
};

export const useToggleShopifyAutoFulfillment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (enabled: boolean) => integrationService.toggleAutoFulfillment(enabled),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS("shopify") });
            showToast("Shopify Auto-fulfillment status updated", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update Shopify Auto-fulfillment status", "error");
        }
    });
};
