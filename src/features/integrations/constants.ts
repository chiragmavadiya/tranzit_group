<<<<<<< HEAD
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
=======
import { Truck, ShoppingCart } from "lucide-react";

export const PROVIDERS = [
    { id: 'auspost', name: 'AusPost', type: 'courier', description: 'Australia Post eParcel integration.', icon: Truck },
    { id: 'aramex', name: 'Aramex', type: 'courier', description: 'Aramex (Fastway) shipping services.', icon: Truck },
    { id: 'mypostbusiness', name: 'MyPost Business', type: 'courier', description: 'Australia Post MyPost Business.', icon: Truck },
    { id: 'directfreight', name: 'Direct Freight', type: 'courier', description: 'Direct Freight Express integration.', icon: Truck },
    { id: 'couriersplease', name: 'Couriers Please', type: 'courier', description: 'Couriers Please shipping integration.', icon: Truck },
    { id: 'startrack', name: 'StarTrack', type: 'courier', description: 'StarTrack shipping integration.', icon: Truck },
    { id: 'shopify', name: 'Shopify', type: 'ecommerce', description: 'Sync orders and fulfillments with Shopify.', icon: ShoppingCart },
    { id: 'ebay', name: 'eBay', type: 'ecommerce', description: 'Sync orders and fulfillments with eBay.', icon: ShoppingCart },
    { id: 'woocommerce', name: 'WooCommerce', type: 'ecommerce', description: 'Sync orders and fulfillments with WooCommerce.', icon: ShoppingCart },
    { id: 'amazon', name: 'Amazon', type: 'ecommerce', description: 'Sync orders and fulfillments with Amazon.', icon: ShoppingCart },
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
] as const;

export type EcommercePlatform = typeof ECOMMERCE_PLATFORMS[number];

export const findEcommercePlatform = (slug?: string | null) =>
    ECOMMERCE_PLATFORMS.find((platform) => platform.id === slug);

/** Providers whose connect step is an OAuth redirect rather than a credentials form. */
export const OAUTH_ECOMMERCE_PROVIDERS = ['ebay', 'squarespace', 'etsy'];

/** Providers that keep default parcel dimensions per connected account. */
export const PARCEL_DEFAULT_PROVIDERS = ['shopify', 'shopline'];
