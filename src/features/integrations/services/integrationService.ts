import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
    IntegrationResponse,
    IntegrationsResponse,
    ShopifyLiveRatesSettingsPayload,
    ShopifyLiveRatesSettingsResponse,
    ShopifyParcelDefaultsPayload,
    ShoplineParcelDefaultsPayload,
    WooCommerceConnectData
} from "../types";

// Shopify actions are scoped by store_id, eBay/WooCommerce by account_id.
const accountParam = (provider: string, id?: string | number) =>
    id == null ? {} : provider === 'shopify' ? { store_id: id } : { account_id: id };

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
        // OAuth providers have nothing to post: the GET returns the authorization URL.
        if (provider === 'ebay' || provider === 'squarespace' || provider === 'etsy') {
            const response = await api.get(API_ENDPOINTS.INTEGRATIONS.CONNECT(provider));
            return response.data;
        }
        const response = await api.post(API_ENDPOINTS.INTEGRATIONS.CONNECT(provider), data);
        return response.data;
    },

    saveWooCommerce: async (data: WooCommerceConnectData) => {
        const response = await api.post(API_ENDPOINTS.INTEGRATIONS.SAVE_WOOCOMMERCE, data);
        return response.data;
    },

    disconnect: async (provider: string, id?: string | number) => {
        // Some use DELETE, some use POST /disconnect
        const postProviders = ['shopify', 'woocommerce', 'ebay', 'squarespace', 'shopline', 'etsy'];
        if (postProviders.includes(provider)) {
            const response = await api.post(API_ENDPOINTS.INTEGRATIONS.DISCONNECT(provider), accountParam(provider, id));
            return response.data;
        }
        const response = await api.delete(API_ENDPOINTS.INTEGRATIONS.DISCONNECT(provider));
        return response.data;
    },

    sync: async (provider: string, id?: string | number) => {
        const response = await api.post(API_ENDPOINTS.INTEGRATIONS.SYNC(provider), accountParam(provider, id));
        return response.data;
    },

    toggleAutoFulfillment: async (enabled: boolean, storeId?: string | number) => {
        const response = await api.post(API_ENDPOINTS.INTEGRATIONS.AUTO_FULFILLMENT, { enabled, ...accountParam('shopify', storeId) });
        return response.data;
    },

    toggleShopifyLiveRates: async (enabled: boolean, storeId?: string | number) => {
        const response = await api.post(API_ENDPOINTS.INTEGRATIONS.SHOPIFY_LIVE_RATES, { enabled, ...accountParam('shopify', storeId) });
        return response.data;
    },

    // Reading the settings is a POST too: the same endpoint returns them when the body carries only store_id.
    getShopifyLiveRatesSettings: async (storeId: string | number) => {
        const response = await api.post(API_ENDPOINTS.INTEGRATIONS.SHOPIFY_LIVE_RATES_SETTINGS, { store_id: storeId });
        return response.data as ShopifyLiveRatesSettingsResponse;
    },

    updateShopifyLiveRatesSettings: async (payload: ShopifyLiveRatesSettingsPayload) => {
        const response = await api.put(API_ENDPOINTS.INTEGRATIONS.SHOPIFY_LIVE_RATES_SETTINGS, payload);
        return response.data;
    },

    updateShopifyParcelDefaults: async (payload: ShopifyParcelDefaultsPayload) => {
        const response = await api.put(API_ENDPOINTS.INTEGRATIONS.SHOPIFY_PARCEL_DEFAULTS, payload);
        return response.data;
    },

    // Re-reads the store's rate providers from Shopify, rather than the copy held against the account.
    getShopifyShippingMethods: async (storeId: string | number) => {
        const response = await api.get(API_ENDPOINTS.INTEGRATIONS.SHOPIFY_SHIPPING_METHODS, {
            params: { store_id: storeId }
        });
        return response.data;
    },

    // Deletes the rate provider from Shopify itself, not just from Tranzit's record of it.
    deleteShopifyShippingMethod: async (id: string) => {
        const response = await api.delete(API_ENDPOINTS.INTEGRATIONS.SHOPIFY_SHIPPING_METHOD(id));
        return response.data;
    },

    updateShoplineParcelDefaults: async (payload: ShoplineParcelDefaultsPayload) => {
        const response = await api.put(API_ENDPOINTS.INTEGRATIONS.SHOPLINE_PARCEL_DEFAULTS, payload);
        return response.data;
    },

    toggleEbayAutoSync: async (enabled: boolean, accountId?: string | number) => {
        const response = await api.request({
            method: "POST",
            url: API_ENDPOINTS.INTEGRATIONS.EBAY_AUTO_SYNC,
            data: { enabled, ...accountParam('ebay', accountId) }
        });
        return response.data;
    },

    toggleEbayAutoFulfillment: async (enabled: boolean, accountId?: string | number) => {
        const response = await api.request({
            method: "POST",
            url: API_ENDPOINTS.INTEGRATIONS.EBAY_AUTO_FULFILLMENT,
            data: { enabled, ...accountParam('ebay', accountId) }
        });
        return response.data;
    },

    toggleSquarespaceAutoFulfillment: async (enabled: boolean, accountId?: string | number) => {
        const response = await api.post(API_ENDPOINTS.INTEGRATIONS.SQUARESPACE_AUTO_FULFILLMENT, { enabled, ...accountParam('squarespace', accountId) });
        return response.data;
    },

    toggleShoplineAutoSync: async (enabled: boolean, accountId?: string | number) => {
        const response = await api.post(API_ENDPOINTS.INTEGRATIONS.SHOPLINE_AUTO_SYNC, { enabled, ...accountParam('shopline', accountId) });
        return response.data;
    },

    toggleShoplineAutoFulfillment: async (enabled: boolean, accountId?: string | number) => {
        const response = await api.post(API_ENDPOINTS.INTEGRATIONS.SHOPLINE_AUTO_FULFILLMENT, { enabled, ...accountParam('shopline', accountId) });
        return response.data;
    },

    toggleEtsyAutoSync: async (enabled: boolean, accountId?: string | number) => {
        const response = await api.post(API_ENDPOINTS.INTEGRATIONS.ETSY_AUTO_SYNC, { enabled, ...accountParam('etsy', accountId) });
        return response.data;
    },

    toggleEtsyAutoFulfillment: async (enabled: boolean, accountId?: string | number) => {
        const response = await api.post(API_ENDPOINTS.INTEGRATIONS.ETSY_AUTO_FULFILLMENT, { enabled, ...accountParam('etsy', accountId) });
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

    setDefault: async (provider: string) => {
        const response = await api.post(API_ENDPOINTS.INTEGRATIONS.DEFAULT(provider));
        return response.data;
    },

    removeDefault: async (provider: string) => {
        const response = await api.delete(API_ENDPOINTS.INTEGRATIONS.DEFAULT(provider));
        return response.data;
    }
};
