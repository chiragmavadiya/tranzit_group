import { api } from "@/services/api";
import type {
    IntegrationResponse,
    // AusPostConnectData,
    // AramexConnectData,
    // MyPostBusinessConnectData,
    // DirectFreightConnectData,
    // ShopifyConnectData,
    WooCommerceConnectData
} from "../types";

export const integrationService = {
    getIntegrations: async () => {
        const response = await api.get("/integrations");
        return response.data;
    },

    getStatus: async (provider: string) => {
        const response = await api.get(`/integrations/${provider}`);
        return response.data as IntegrationResponse;
    },

    connect: async (provider: string, data: any) => {
        const response = await api.post(`/integrations/${provider}/connect`, data);
        return response.data;
    },

    saveWooCommerce: async (data: WooCommerceConnectData) => {
        const response = await api.post(`/integrations/woocommerce/save`, data);
        return response.data;
    },

    disconnect: async (provider: string) => {
        // Some use DELETE, some use POST /disconnect
        const postProviders = ['shopify', 'woocommerce'];
        if (postProviders.includes(provider)) {
            const response = await api.post(`/integrations/${provider}/disconnect`);
            return response.data;
        }
        const response = await api.delete(`/integrations/${provider}/disconnect`);
        return response.data;
    },

    sync: async (provider: string) => {
        const response = await api.post(`/integrations/${provider}/sync`);
        return response.data;
    },

    toggleAutoFulfillment: async (enabled: boolean) => {
        const response = await api.post(`/integrations/shopify/auto-fulfillment`, { enabled });
        return response.data;
    }
};
