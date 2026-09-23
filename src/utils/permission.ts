import type { AuthState } from "@/types/store.types";

export const ROUTE_PERMISSIONS: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/orders': 'order',
  '/quote': 'get_quote',
  '/manifest': 'manifest_order',
  '/wallet': 'my_wallet',
  '/items': 'my_items',
  '/address-book': 'my_address_book',
  '/reports': 'report',
  '/parcel-report': 'report',
  '/invoices': 'invoice',
  '/enquiry': 'enquiry',
  '/settings/account': 'settings_account_detail',
  '/settings/team': 'settings_team_access',
  '/settings/rules': 'settings_rule_management',
  '/settings/packing-slips-summary': 'settings_packing_documents',
  '/settings/ecommerce': 'settings_integrations',
  '/settings/carriers': 'settings_integrations',
};

/**
 * Checks if the customer user has permission for a specific module key.
 */
export const hasCustomerPermission = (
  key: string | undefined,
  teamAccess: AuthState['team_access'] | null | undefined,
  role: string
): boolean => {
  if (role !== 'customer') return true;
  if (!key) return true;

  if (teamAccess?.is_sub_user) {
    const permissions = teamAccess.permissions;
    if (permissions && permissions[key] === 'no_access') {
      return false;
    }
  }

  return true;
};

/**
 * Checks if the customer user has permission for a specific route path.
 */
export const hasRoutePermission = (
  pathname: string,
  teamAccess: AuthState['team_access'] | null | undefined,
  role: string
): boolean => {
  if (role !== 'customer') return true;
  if (!teamAccess?.is_sub_user) return true;

  // Find permission key for the path
  const keys = Object.keys(ROUTE_PERMISSIONS).sort((a, b) => b.length - a.length);
  let permissionKey: string | null = null;
  for (const prefix of keys) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      permissionKey = ROUTE_PERMISSIONS[prefix];
      break;
    }
  }

  if (permissionKey) {
    const permissions = teamAccess.permissions || {};
    if (pathname === '/orders/create' || pathname.startsWith('/orders/create/')) {
      return permissions['order'] === 'full';
    }
    if (permissions[permissionKey] === 'no_access') {
      return false;
    }
  }

  return true;
};

/**
 * Gets the first allowed settings sub-route path for a customer sub-user.
 */
export const getFirstAllowedSettingsPath = (
  teamAccess: AuthState['team_access'] | null | undefined,
  role: string
): string | null => {
  if (role !== 'customer') return '/settings/account';
  if (!teamAccess?.is_sub_user) return '/settings/account';

  const permissions = teamAccess.permissions || {};

  const settingsOrder = [
    { key: 'settings_account_detail', path: '/settings/account' },
    { key: 'settings_team_access', path: '/settings/team' },
    { key: 'settings_rule_management', path: '/settings/rules' },
    { key: 'settings_packing_documents', path: '/settings/packing-slips-summary' },
    { key: 'settings_integrations', path: '/settings/ecommerce' },
  ];

  for (const item of settingsOrder) {
    if (permissions[item.key] !== 'no_access') {
      return item.path;
    }
  }

  return null;
};

/**
 * Gets the first allowed route path for a customer sub-user.
 */
export const getFirstAllowedPath = (
  teamAccess: AuthState['team_access'] | null | undefined,
  role: string
): string => {
  if (role !== 'customer' || !teamAccess?.is_sub_user) {
    return '/orders?tab=new';
  }

  const permissions = teamAccess.permissions || {};

  // Check dashboard first
  if (permissions['dashboard'] !== 'no_access') {
    return '/dashboard';
  }
  // Check orders
  if (permissions['order'] !== 'no_access') {
    return '/orders?tab=new';
  }

  // Iterate over preference order
  const checkOrder = [
    { key: 'dashboard', path: '/dashboard' },
    { key: 'order', path: '/orders?tab=new' },
    { key: 'get_quote', path: '/quote' },
    { key: 'manifest_order', path: '/manifest' },
    { key: 'my_items', path: '/items' },
    { key: 'my_address_book', path: '/address-book' },
    { key: 'report', path: '/reports' },
    { key: 'my_wallet', path: '/wallet/transactions' },
    { key: 'invoice', path: '/invoices' },
    { key: 'enquiry', path: '/enquiry' },
    { key: 'settings_account_detail', path: '/settings/account' },
    { key: 'settings_team_access', path: '/settings/team' },
    { key: 'settings_rule_management', path: '/settings/rules' },
    { key: 'settings_integrations', path: '/settings/ecommerce' },
  ];

  for (const item of checkOrder) {
    if (permissions[item.key] !== 'no_access') {
      return item.path;
    }
  }

  return '/orders?tab=new';
};
