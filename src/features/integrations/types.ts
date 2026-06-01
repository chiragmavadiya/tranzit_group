import type { CustomerIntegration } from "../customers/types";

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

export interface IntegrationsResponse {
    status: boolean;
    message: string;
    data: {
        courier_integrations: CustomerIntegration[];
        ecommerce_connections: CustomerIntegration[];
    };
}







export interface WooCommerceConnectData {
    store_url: string;
    consumer_key: string;
    consumer_secret: string;
}
