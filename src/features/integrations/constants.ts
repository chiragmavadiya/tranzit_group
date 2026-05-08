import { Truck, ShoppingCart } from "lucide-react";

export const PROVIDERS = [
    { id: 'auspost', name: 'AusPost', type: 'courier', description: 'Australia Post eParcel integration.', icon: Truck },
    { id: 'aramex', name: 'Aramex', type: 'courier', description: 'Aramex (Fastway) shipping services.', icon: Truck },
    { id: 'mypostbusiness', name: 'MyPost Business', type: 'courier', description: 'Australia Post MyPost Business.', icon: Truck },
    { id: 'directfreight', name: 'Direct Freight', type: 'courier', description: 'Direct Freight Express integration.', icon: Truck },
    { id: 'shopify', name: 'Shopify', type: 'ecommerce', description: 'Sync orders and fulfillments with Shopify.', icon: ShoppingCart },
    { id: 'ebay', name: 'eBay', type: 'ecommerce', description: 'Sync orders and fulfillments with eBay.', icon: ShoppingCart },
    { id: 'woocommerce', name: 'WooCommerce', type: 'ecommerce', description: 'Sync orders and fulfillments with WooCommerce.', icon: ShoppingCart },
    { id: 'amazon', name: 'Amazon', type: 'ecommerce', description: 'Sync orders and fulfillments with Amazon.', icon: ShoppingCart },
] as const;

export type ProviderId = typeof PROVIDERS[number]['id'];
