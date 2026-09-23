const STORAGE_KEY = 'shopify_pending_link_token';

export function savePendingShopifyLinkToken(token: string): void {
    sessionStorage.setItem(STORAGE_KEY, token);
}

export function getPendingShopifyLinkToken(): string | null {
    return sessionStorage.getItem(STORAGE_KEY);
}

export function clearPendingShopifyLinkToken(): void {
    sessionStorage.removeItem(STORAGE_KEY);
}

/**
* Token from URL ?token= or sessionStorage (survives login if redirect param is lost).
*/
export function resolveShopifyLinkToken(searchParams: URLSearchParams): string | null {
    const fromUrl = searchParams.get('token');
    if (fromUrl) {
        savePendingShopifyLinkToken(fromUrl);
        return fromUrl;
    }
    return getPendingShopifyLinkToken();
}
