import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { integrationService } from "../services/integrationService";
import { showToast } from "@/components/ui/custom-toast";
import { QUERY_KEYS } from "@/constants/api.constants";
<<<<<<< HEAD
import type { ShopifyLiveRatesSettingsPayload, ShopifyParcelDefaultsPayload, ShoplineParcelDefaultsPayload } from "../types";

// `id` targets one store/account when a provider has several connected.
export type IntegrationTarget = { provider: string; id?: string | number };
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c

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

<<<<<<< HEAD
export const useRefreshShopifyShippingMethods = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (storeId: string | number) => integrationService.getShopifyShippingMethods(storeId),
        onSuccess: (response: any, storeId) => {
            // The endpoint has been seen returning the list either bare or under `shipping_methods`.
            const methods = Array.isArray(response?.data) ? response.data : response?.data?.shipping_methods;
            if (!Array.isArray(methods)) {
                // Shape we don't recognise: fall back to re-reading the whole status.
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS('shopify') });
                return;
            }
            // Write straight into the cached status, which is where the page reads them from.
            queryClient.setQueryData(QUERY_KEYS.INTEGRATIONS.STATUS('shopify'), (previous: any) => {
                if (!previous?.data) return previous;
                const applyTo = (store: any) =>
                    (String(store?.id) === String(storeId) ? { ...store, shipping_methods: methods } : store);
                return {
                    ...previous,
                    data: {
                        ...previous.data,
                        ...(previous.data.stores ? { stores: previous.data.stores.map(applyTo) } : {}),
                        ...(previous.data.store ? { store: applyTo(previous.data.store) } : {})
                    }
                };
            });
            showToast(response?.message || "Shipping methods refreshed", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to refresh shipping methods", "error");
        }
    });
};

export const useDeleteShopifyShippingMethod = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => integrationService.deleteShopifyShippingMethod(id),
        onSuccess: (response: any) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS('shopify') });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.LIST });
            showToast(response?.message || "Shipping method removed from Shopify", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to remove shipping method", "error");
        }
=======
export const useIntegrationStatusMutation = () => {
    return useMutation({
        mutationFn: (provider: string) => integrationService.getStatus(provider)
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
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
<<<<<<< HEAD
        mutationFn: ({ provider, id }: IntegrationTarget) => integrationService.disconnect(provider, id),
        onSuccess: (_, { provider }) => {
=======
        mutationFn: (provider: string) => integrationService.disconnect(provider),
        onSuccess: (_, provider) => {
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
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
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ provider, id }: IntegrationTarget) => integrationService.sync(provider, id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.LIST });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS(variables.provider) });
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

<<<<<<< HEAD
export const useUpdateShopifyParcelDefaults = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: ShopifyParcelDefaultsPayload) => integrationService.updateShopifyParcelDefaults(payload),
        onSuccess: (response: any) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS('shopify') });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.LIST });
            // ME carries the flag behind the blocking parcel-details modal, so it has to be re-read.
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER_DETAILS });
            showToast(response?.message || "Default parcel details saved", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to save default parcel details", "error");
        }
    });
};

export const useUpdateShoplineParcelDefaults = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: ShoplineParcelDefaultsPayload) => integrationService.updateShoplineParcelDefaults(payload),
        onSuccess: (response: any) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS('shopline') });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.LIST });
            showToast(response?.message || "Default parcel details saved", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to save default parcel details", "error");
        }
    });
};

=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
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

<<<<<<< HEAD
=======
export const useGetManualProducts = (provider: string, enabled = true) => {
    return useQuery({
        queryKey: QUERY_KEYS.INTEGRATIONS.MANUAL_PRODUCTS(provider),
        queryFn: () => integrationService.getManualProducts(provider),
        enabled: !!provider && enabled
    });
};

>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
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

<<<<<<< HEAD
=======
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

>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
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
<<<<<<< HEAD
        mutationFn: ({ enabled, accountId }: { enabled: boolean; accountId?: string | number }) =>
            integrationService.toggleEbayAutoSync(enabled, accountId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS("ebay") });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.LIST });
=======
        mutationFn: (enabled: boolean) => integrationService.toggleEbayAutoSync(enabled),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS("ebay") });
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
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
<<<<<<< HEAD
        mutationFn: ({ enabled, accountId }: { enabled: boolean; accountId?: string | number }) =>
            integrationService.toggleEbayAutoFulfillment(enabled, accountId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS("ebay") });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.LIST });
=======
        mutationFn: (enabled: boolean) => integrationService.toggleEbayAutoFulfillment(enabled),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS("ebay") });
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
            showToast("eBay Auto-fulfillment status updated", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update eBay Auto-fulfillment status", "error");
        }
    });
};

<<<<<<< HEAD
export const useToggleSquarespaceAutoFulfillment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ enabled, accountId }: { enabled: boolean; accountId?: string | number }) =>
            integrationService.toggleSquarespaceAutoFulfillment(enabled, accountId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS("squarespace") });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.LIST });
            showToast("Squarespace Auto-fulfillment status updated", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update Squarespace Auto-fulfillment status", "error");
        }
    });
};

export const useToggleShopifyAutoFulfillment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ enabled, storeId }: { enabled: boolean; storeId?: string | number }) =>
            integrationService.toggleAutoFulfillment(enabled, storeId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS("shopify") });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.LIST });
=======
export const useToggleShopifyAutoFulfillment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (enabled: boolean) => integrationService.toggleAutoFulfillment(enabled),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS("shopify") });
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
            showToast("Shopify Auto-fulfillment status updated", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update Shopify Auto-fulfillment status", "error");
        }
    });
};
<<<<<<< HEAD

export const useToggleShopifyLiveRates = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ enabled, storeId }: { enabled: boolean; storeId?: string | number }) =>
            integrationService.toggleShopifyLiveRates(enabled, storeId),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS("shopify") });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.LIST });
            showToast(response?.message || "Shopify Live Checkout Rates status updated", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update Shopify Live Checkout Rates status", "error");
        }
    });
};

export const useShopifyLiveRatesSettings = (storeId?: string | number, enabled = true) => {
    return useQuery({
        queryKey: QUERY_KEYS.INTEGRATIONS.SHOPIFY_LIVE_RATES_SETTINGS(storeId!),
        queryFn: () => integrationService.getShopifyLiveRatesSettings(storeId!),
        enabled: storeId != null && enabled
    });
};

export const useUpdateShopifyLiveRatesSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: ShopifyLiveRatesSettingsPayload) => integrationService.updateShopifyLiveRatesSettings(payload),
        onSuccess: (response, payload) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.SHOPIFY_LIVE_RATES_SETTINGS(payload.store_id) });
            showToast(response?.message || "Live Checkout Rates settings updated", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update Live Checkout Rates settings", "error");
        }
    });
};

export const useToggleShoplineAutoSync = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ enabled, accountId }: { enabled: boolean; accountId?: string | number }) =>
            integrationService.toggleShoplineAutoSync(enabled, accountId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS("shopline") });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.LIST });
            showToast("Shopline Auto-sync status updated", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update Shopline Auto-sync status", "error");
        }
    });
};

export const useToggleShoplineAutoFulfillment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ enabled, accountId }: { enabled: boolean; accountId?: string | number }) =>
            integrationService.toggleShoplineAutoFulfillment(enabled, accountId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS("shopline") });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.LIST });
            showToast("Shopline Auto-fulfillment status updated", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update Shopline Auto-fulfillment status", "error");
        }
    });
};

export const useToggleEtsyAutoSync = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ enabled, accountId }: { enabled: boolean; accountId?: string | number }) =>
            integrationService.toggleEtsyAutoSync(enabled, accountId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS("etsy") });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.LIST });
            showToast("Etsy Auto-sync status updated", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update Etsy Auto-sync status", "error");
        }
    });
};

export const useToggleEtsyAutoFulfillment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ enabled, accountId }: { enabled: boolean; accountId?: string | number }) =>
            integrationService.toggleEtsyAutoFulfillment(enabled, accountId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.STATUS("etsy") });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.LIST });
            showToast("Etsy Auto-fulfillment status updated", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update Etsy Auto-fulfillment status", "error");
        }
    });
};

=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
