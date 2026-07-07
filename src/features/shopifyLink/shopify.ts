import { apiRequest } from './client';

export type ShopifyStatusResponse = {
    status: boolean;
    message: string;
    data: {
        connected: boolean;
        store: {
            id: number;
            shop_domain: string;
            shop_name: string | null;
            shop_owner_email: string | null;
            is_active: boolean;
            auto_fulfillment_enabled: boolean;
            installed_at: string | null;
            last_synced_at: string | null;
        } | null;
    };
};

export type ShopifyConnectResponse = {
    status: boolean;
    message: string;
    data: {
        shop_domain: string;
        authorization_url: string;
        already_connected: boolean;
        redirect_after_connect: string;
    };
};

export type ShopifyLinkInfoResponse = {
    shop: string;
    shop_name: string | null;
    shop_owner_email: string | null;
    link_token: string;
    flow: string;
    requires_auth: boolean;
    message: string;
    redirect_after_link: string;
    login_url: string;
    register_url: string;
};

export type ShopifyLinkResponse = {
    success: boolean;
    message: string;
    redirect_url: string;
};

export type ShopifyAutoLoginResponse = {
    token: string;
    user: { id: number; name: string; email: string };
    store_id: number;
    redirect_url: string;
};

export function fetchShopifyStatus() {
    return apiRequest<ShopifyStatusResponse>('/customer/integrations/shopify', { auth: true });
}

export function connectShopify(shop: string, popup = false) {
    return apiRequest<ShopifyConnectResponse>('/customer/integrations/shopify/connect', {
        method: 'POST',
        auth: true,
        body: { shop, popup },
    });
}

export function fetchShopifyLinkInfo(token: string) {
    return apiRequest<ShopifyLinkInfoResponse>(`/shopify/link-info?token=${encodeURIComponent(token)}`);
}

export function linkShopifyStore(linkToken: string) {
    return apiRequest<ShopifyLinkResponse>('/shopify/link', {
        method: 'POST',
        auth: true,
        body: { link_token: linkToken },
    });
}

export function exchangeShopifyAutoLogin(token: string) {
    return apiRequest<ShopifyAutoLoginResponse>(
        `/shopify/auto-login/exchange?token=${encodeURIComponent(token)}`,
    );
}

export function disconnectShopify() {
    return apiRequest<{ status: boolean; message: string }>('/customer/integrations/shopify/disconnect', {
        method: 'POST',
        auth: true,
    });
}

export function syncShopify() {
    return apiRequest<{ status: boolean; message: string }>('/customer/integrations/shopify/sync', {
        method: 'POST',
        auth: true,
    });
}

export function setShopifyAutoFulfillment(enabled: boolean) {
    return apiRequest<{ status: boolean; message: string }>(
        '/customer/integrations/shopify/auto-fulfillment',
        {
            method: 'POST',
            auth: true,
            body: { enabled },
        },
    );
}