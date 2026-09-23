import type { LoginResponse } from '@/features/auth/auth.types';

/**
 * A connected Shopify store with no default parcel details blocks the app. It outranks the Terms
 * and low-balance modals, so those check this too and hold back while it is pending.
 */
export const hasPendingParcelDefaults = (userData?: LoginResponse) => {
  const parcelDefaults = userData?.shopify_package_defaults;
  return !!parcelDefaults?.has_stores
    && parcelDefaults.all_configured === false
    && (parcelDefaults.stores_missing_defaults?.length ?? 0) > 0;
};

// A provider can have several connected accounts: Shopify returns `stores`, eBay and
// WooCommerce return `accounts`. Older responses only carry the single legacy fields.
export const toAccounts = (provider: string, data: any): any[] => {
  // Disconnecting the last account can leave the account payload in place, so `connected` decides.
  if (!data || data.connected === false) return [];
  if (provider === 'shopify') return data.stores?.length ? data.stores : data.store ? [data.store] : [];
  // eBay, Squarespace, Shopline and Etsy keep their sync flags/stats on the payload, next to the account itself.
  if (provider === 'ebay' || provider === 'squarespace' || provider === 'shopline' || provider === 'etsy') {
    return data.accounts?.length ? data.accounts : data.account ? [{ ...data, ...data.account }] : [];
  }
  return data.accounts?.length ? data.accounts : (data.account || data.store_url) ? [data.account || data] : [];
};

export const PARCEL_FIELDS: { key: string; label: string; unit: string }[] = [
  { key: 'length', label: 'Default Length', unit: 'cm' },
  { key: 'width', label: 'Default Width', unit: 'cm' },
  { key: 'height', label: 'Default Height', unit: 'cm' },
  { key: 'weight', label: 'Fallback Weight', unit: 'kg' },
];

export const EMPTY_PARCEL_DRAFT: Record<string, string> = { length: '', width: '', height: '', weight: '' };

// Shopify keeps these on the store itself, Shopline returns them inside the account `meta`.
export const parcelValue = (store: any, key: string) =>
  store?.[`default_package_${key}`] ?? store?.meta?.[`default_package_${key}`] ?? store?.parcel_defaults?.[key];

export const toParcelDraft = (store: any): Record<string, string> => {
  if (!store) return EMPTY_PARCEL_DRAFT;
  return PARCEL_FIELDS.reduce((draft, { key }) => {
    const value = parcelValue(store, key);
    draft[key] = value == null ? '' : String(value);
    return draft;
  }, {} as Record<string, string>);
};

/** A store counts as configured only once the API hands back all four values as positive numbers. */
export const hasParcelDefaults = (store: any) =>
  PARCEL_FIELDS.every(({ key }) => Number(parcelValue(store, key)) > 0);

export const validateParcelDraft = (draft: Record<string, string>) => {
  const errors: Record<string, string> = {};
  PARCEL_FIELDS.forEach(({ key, label }) => {
    const raw = (draft[key] ?? '').trim();
    const value = Number(raw);
    if (!raw) errors[key] = `Please enter ${label.toLowerCase()}`;
    else if (!Number.isFinite(value)) errors[key] = `${label} must be a number`;
    else if (value <= 0) errors[key] = `${label} must be greater than 0`;
  });
  return errors;
};

/**
 * True only when the account carries parcel fields and they are not all set. A payload that omits
 * them entirely tells us nothing, so it is not reported as incomplete.
 */
export const isParcelSetupPending = (account: any) =>
  PARCEL_FIELDS.some(({ key }) => parcelValue(account, key) !== undefined) && !hasParcelDefaults(account);

export const getAccountDisplayName = (account: any): string => {
  switch (account?.platformSlug) {
    case 'shopify': return account.shop_name || account.shop_domain || "Shopify Store";
    case 'shopline': return account.name || "Shopline Store";
    case 'squarespace': return account.name || account.store_url || "Squarespace Site";
    case 'ebay': return account.name || account.meta?.user_info?.username || "eBay Account";
    case 'woocommerce': return account.store_url || "WooCommerce Store";
    case 'etsy': return account.name || account.meta?.shop_name || account.shop_name || "Etsy Shop";
    default: return account?.name || account?.store_url || account?.shop_domain || "Integration Account";
  }
};

export const getAccountSubtitle = (account: any): string => {
  switch (account?.platformSlug) {
    case 'shopify': return account.shop_domain || "";
    case 'shopline': return account.meta?.store_url || account.external_account_id || "";
    // Squarespace returns the storefront address inside `meta`, not at the top level.
    case 'squarespace': return account.meta?.store_url || account.store_url || "";
    case 'ebay': return account.meta?.user_info?.username || account.email || "";
    case 'woocommerce': return account.store_url || "";
    case 'etsy': return account.meta?.shop_name || account.shop_name || "";
    default: return "";
  }
};

/** The storefront address, wherever the provider happens to put it. */
export const getStoreUrl = (account: any): string | undefined =>
  account?.meta?.store_url || account?.store_url || account?.shop_domain;

export interface ParsedSyncError {
  /** Plain-English summary of what went wrong. */
  title: string;
  /** What the customer can do about it, when the cause is one we recognise. */
  action?: string;
}

// Causes we have actually seen from a provider. Anything else falls back to the humanised code,
// which still beats showing the customer a JSON blob.
const SYNC_ERROR_CAUSES: Record<string, { title: string; action: string }> = {
  WEBSITE_EXPIRED: {
    title: "This site's subscription has expired",
    action: "Renew the site with its provider, then sync again. Until then its orders cannot be read.",
  },
};

const humanise = (code: string) => {
  const words = code.replace(/_/g, ' ').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

/**
 * Providers wrap their failures in a JSON blob. Keep only the part a customer can act on; the
 * raw payload, its generic message and the provider's context id are never shown. A plain-text
 * error has nothing to unwrap, so it is passed through as-is.
 */
export const parseSyncError = (raw?: string | null): ParsedSyncError | null => {
  const message = raw?.trim();
  if (!message) return null;

  const start = message.indexOf('{');
  const end = message.lastIndexOf('}');
  if (start === -1 || end <= start) return { title: message };

  let payload: any;
  try {
    payload = JSON.parse(message.slice(start, end + 1));
  } catch {
    // Not JSON after all: the text before the brace is still the readable part.
    return { title: message.slice(0, start).replace(/[:\s]+$/, '') || message };
  }

  const code = typeof payload?.type === 'string' ? payload.type : null;
  if (!code) return { title: message.slice(0, start).replace(/[:\s]+$/, '') || message };

  const known = SYNC_ERROR_CAUSES[code];
  return { title: known?.title ?? humanise(code), action: known?.action };
};

/**
 * The shop domain field takes the handle only and appends the suffix itself, so a pasted
 * full domain (or a pasted admin URL) has to be reduced back to the handle.
 */
export const toShopHandle = (value: string, suffix: string) =>
  value
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .replace(new RegExp(`${suffix.replace(/\./g, '\\.')}$`, 'i'), '')
    .replace(/\.$/, '');
