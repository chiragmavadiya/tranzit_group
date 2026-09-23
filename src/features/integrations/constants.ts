/**
 * The e-commerce channels offered in the connect drawer, in the order they are shown.
 * `logo_url` and `description` come from the integrations list API; these are the fallbacks
 * plus the availability flag, which the API does not carry.
 */
export const ECOMMERCE_PLATFORMS = [
    { id: 'shopify', name: 'Shopify', noun: 'store', status: 'available' },
    { id: 'woocommerce', name: 'WooCommerce', noun: 'store', status: 'available' },
    { id: 'ebay', name: 'eBay', noun: 'account', status: 'available' },
    { id: 'squarespace', name: 'Squarespace', noun: 'site', status: 'available' },
    { id: 'shopline', name: 'Shopline', noun: 'store', status: 'available' },
    { id: 'etsy', name: 'Etsy', noun: 'shop', status: 'available' },
    { id: 'temu', name: 'Temu', noun: 'account', status: 'coming_soon' },
    { id: 'amazon', name: 'Amazon', noun: 'account', status: 'coming_soon' },
] as const;

export type EcommercePlatform = typeof ECOMMERCE_PLATFORMS[number];

export const findEcommercePlatform = (slug?: string | null) =>
    ECOMMERCE_PLATFORMS.find((platform) => platform.id === slug);

/** Providers whose connect step is an OAuth redirect rather than a credentials form. */
export const OAUTH_ECOMMERCE_PROVIDERS = ['ebay', 'squarespace', 'etsy'];

/** Providers that keep default parcel dimensions per connected account. */
export const PARCEL_DEFAULT_PROVIDERS = ['shopify', 'shopline'];
