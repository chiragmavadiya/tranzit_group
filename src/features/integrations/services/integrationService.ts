import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
    IntegrationResponse,
    IntegrationsResponse,
    WooCommerceConnectData
} from "../types";

export const integrationService = {
    getIntegrations: async () => {
        const response = await api.get(API_ENDPOINTS.INTEGRATIONS.BASE);
        return response.data as IntegrationsResponse;
    },

    getStatus: async (provider: string) => {
        const response = await api.get(API_ENDPOINTS.INTEGRATIONS.DETAILS(provider));
        return response.data as IntegrationResponse;
    },

    connect: async (provider: string, data: any) => {
        const response = await api.post(API_ENDPOINTS.INTEGRATIONS.CONNECT(provider), data);
        return response.data;
    },

    saveWooCommerce: async (data: WooCommerceConnectData) => {
        const response = await api.post(API_ENDPOINTS.INTEGRATIONS.SAVE_WOOCOMMERCE, data);
        return response.data;
    },

    disconnect: async (provider: string) => {
        // Some use DELETE, some use POST /disconnect
        const postProviders = ['shopify', 'woocommerce'];
        if (postProviders.includes(provider)) {
            const response = await api.post(API_ENDPOINTS.INTEGRATIONS.DISCONNECT(provider));
            return response.data;
        }
        const response = await api.delete(API_ENDPOINTS.INTEGRATIONS.DISCONNECT(provider));
        return response.data;
    },

    sync: async (provider: string) => {
        const response = await api.post(API_ENDPOINTS.INTEGRATIONS.SYNC(provider));
        return response.data;
    },

    toggleAutoFulfillment: async (enabled: boolean) => {
        const response = await api.post(API_ENDPOINTS.INTEGRATIONS.AUTO_FULFILLMENT, { enabled });
        return response.data;
    },

    toggleProductStatus: async (provider: string, productCode: string, enabled: boolean) => {
        const response = await api.post(API_ENDPOINTS.INTEGRATIONS.PRODUCTS_STATUS(provider), { product_code: productCode, enabled });
        return response.data;
    },

    updateAdvancedSettings: async (provider: string, settings: any) => {
        const response = await api.post(API_ENDPOINTS.INTEGRATIONS.ADVANCED_SETTINGS(provider), settings);
        return response.data;
    },

    addManualProduct: async (provider: string, data: { product_code: string; product_name: string; enabled: boolean }) => {
        const response = await api.post(API_ENDPOINTS.INTEGRATIONS.PRODUCTS(provider), data);
        return response.data;
    },

    getManualProducts: async (provider: string) => {
        const response = await api.get(API_ENDPOINTS.INTEGRATIONS.MANUAL_PRODUCTS(provider));
        return response.data;
    },

    updateManualProduct: async (provider: string, productCode: string, data: { product_code?: string; product_name?: string; enabled?: boolean }) => {
        const response = await api.put(API_ENDPOINTS.INTEGRATIONS.MANUAL_PRODUCT_DETAILS(provider, productCode), data);
        return response.data;
    },

    deleteManualProduct: async (provider: string, productCode: string) => {
        const response = await api.delete(API_ENDPOINTS.INTEGRATIONS.MANUAL_PRODUCT_DETAILS(provider, productCode));
        return response.data;
    },

    patchProductStatus: async (provider: string, productCode: string, enabled: boolean) => {
        const response = await api.patch(API_ENDPOINTS.INTEGRATIONS.PATCH_PRODUCT_STATUS(provider, productCode), { enabled });
        return response.data;
    },

    getProducts: async (provider: string) => {
        const response = await api.get(API_ENDPOINTS.INTEGRATIONS.PRODUCTS(provider));
        return response.data;
    },

    getDeliveryPreferences: async () => {
        const response = await api.get(API_ENDPOINTS.INTEGRATIONS.DELIVERY_PREFERENCES);
        return response.data;
    },

    setDeliveryPreferences: async (data: any) => {
        const response = await api.put(API_ENDPOINTS.INTEGRATIONS.DELIVERY_PREFERENCES, data);
        return response.data;
    }
};
