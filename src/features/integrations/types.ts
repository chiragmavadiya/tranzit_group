import type { CustomerIntegration } from "../customers/types";

/** Shopify: one rate provider (carrier service) registered on the store. `id` is Shopify's own id. */
export interface ShopifyShippingMethod {
    id: string;
    name: string;
    active: boolean;
}

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
    /** Shopify: every connected store. `store` stays populated with the newest one. */
    stores?: any[];
    /** eBay / WooCommerce / Squarespace: every connected account. `account` stays populated with the newest one. */
    accounts?: any[];
    shop_domain?: string;
    auto_fulfillment_enabled?: boolean;
    /** Shopify: serve live shipping rates at the store's checkout. */
    live_rates_enabled?: boolean;
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







/**
 * One courier row in the Shopify live checkout rates settings. `label` overrides the name shown at
 * checkout, `margin_percent` is added on top of the customer's margin % for this courier's rate.
 */
export interface ShopifyLiveRateCourier {
    courier_code: string;
    courier_name?: string;
    enabled: boolean;
    label: string | null;
    margin_percent: number | null;
}

export interface ShopifyLiveRatesSettings {
    store_id: number;
    shop_domain?: string;
    live_rates_enabled: boolean;
    cheapest_rate_only: boolean;
    cheapest_rate_label: string | null;
    /**
     * Parcel quoted at checkout. Null until the store saves its own; the form then seeds these from
     * the store's default parcel details, so the two configurations stay independent once saved.
     */
    checkout_package_length: number | null;
    checkout_package_width: number | null;
    checkout_package_height: number | null;
    checkout_package_weight: number | null;
    couriers: ShopifyLiveRateCourier[];
}

export interface ShopifyLiveRatesSettingsResponse {
    status: boolean;
    message: string;
    data: ShopifyLiveRatesSettings;
}

export interface ShopifyLiveRatesSettingsPayload {
    store_id: string | number;
    cheapest_rate_only: boolean;
    cheapest_rate_label: string | null;
    checkout_package_length: number;
    checkout_package_width: number;
    checkout_package_height: number;
    checkout_package_weight: number;
    couriers: Array<Pick<ShopifyLiveRateCourier, 'courier_code' | 'enabled' | 'label' | 'margin_percent'>>;
}

/** Shopify: parcel size/weight used when an order arrives without its own. Dimensions in cm, weight in kg. */
export interface ShopifyParcelDefaults {
    length: number;
    width: number;
    height: number;
    weight: number;
}

export interface ShopifyParcelDefaultsPayload {
    store_id: string | number;
    default_package_length: number;
    default_package_width: number;
    default_package_height: number;
    default_package_weight: number;
}

export interface ShoplineParcelDefaultsPayload {
    account_id: string | number;
    default_package_length: number;
    default_package_width: number;
    default_package_height: number;
    default_package_weight: number;
}

export interface WooCommerceConnectData {
    store_url: string;
    consumer_key: string;
    consumer_secret: string;
}
