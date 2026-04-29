export interface IntegrationData {
    courier?: string;
    connected: boolean;
    account_label?: string;
    base_url?: string;
    account_number?: string;
    merchant_token?: string;
    client_id?: string;
    client_secret?: string;
    account_name?: string;
    site_id?: string;
    token?: string;
    account?: string;
    consignment_token?: string;
    status?: string;
    store?: any;
    shop_domain?: string;
    auto_fulfillment_enabled?: boolean;
    last_synced_at?: string;
}

export interface IntegrationResponse {
    status: boolean;
    message: string;
    data: IntegrationData;
}

export interface IntegrationListItem {
    id: number;
    name: string;
    provider: string;
    connected: boolean;
    logo?: string;
    type: 'courier' | 'ecommerce';
}

export type IntegrationProvider = 'auspost' | 'aramex' | 'mypostbusiness' | 'directfreight' | 'shopify' | 'woocommerce';

export interface AusPostConnectData {
    api_key: string;
    api_password: string;
    base_url: string;
    account_number: string;
    account_label: string;
}

export interface AramexConnectData {
    client_id: string;
    client_secret: string;
    account_name: string;
    account_label: string;
}

export interface MyPostBusinessConnectData {
    merchant_token: string;
    base_url: string;
    account_label: string;
}

export interface DirectFreightConnectData {
    token: string;
    account: string;
    site_id: string;
    base_url: string;
    consignment_token: string;
    account_label: string;
}

export interface ShopifyConnectData {
    shop: string;
}

export interface WooCommerceConnectData {
    store_url: string;
    consumer_key: string;
    consumer_secret: string;
}
