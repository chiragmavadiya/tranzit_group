import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  getAccountSubtitle,
  hasParcelDefaults,
  isParcelSetupPending,
  parseSyncError,
  toAccounts,
  toShopHandle,
  validateParcelDraft,
} from './utils.ts';

describe('toAccounts', () => {
  it('returns nothing when the provider is not connected', () => {
    assert.deepEqual(toAccounts('shopify', { connected: false, stores: [{ id: 1 }] }), []);
    assert.deepEqual(toAccounts('ebay', undefined), []);
  });

  it('prefers the Shopify stores list over the legacy single store', () => {
    const stores = [{ id: 1 }, { id: 2 }];
    assert.deepEqual(toAccounts('shopify', { connected: true, stores, store: { id: 9 } }), stores);
    assert.deepEqual(toAccounts('shopify', { connected: true, store: { id: 9 } }), [{ id: 9 }]);
    assert.deepEqual(toAccounts('shopify', { connected: true }), []);
  });

  it('merges the payload into a legacy single account, so its sync flags survive', () => {
    const data = { connected: true, ebay_auto_sync_enabled: true, account: { id: 7, name: 'seller' } };
    assert.deepEqual(toAccounts('ebay', data), [{ ...data, id: 7, name: 'seller' }]);
  });

  it('falls back to the flat payload for WooCommerce', () => {
    const data = { connected: true, store_url: 'https://shop.test' };
    assert.deepEqual(toAccounts('woocommerce', data), [data]);
    assert.deepEqual(toAccounts('woocommerce', { connected: true }), []);
  });
});

describe('hasParcelDefaults', () => {
  const complete = {
    default_package_length: 30,
    default_package_width: 22,
    default_package_height: 12,
    default_package_weight: 1.2,
  };

  it('accepts a store with all four positive values', () => {
    assert.equal(hasParcelDefaults(complete), true);
  });

  it('reads Shopline values out of meta and parcel_defaults', () => {
    assert.equal(hasParcelDefaults({ meta: complete }), true);
    assert.equal(hasParcelDefaults({ parcel_defaults: { length: 1, width: 2, height: 3, weight: 4 } }), true);
  });

  it('rejects a zero or missing value', () => {
    assert.equal(hasParcelDefaults({ ...complete, default_package_weight: 0 }), false);
    assert.equal(hasParcelDefaults({ ...complete, default_package_height: undefined }), false);
    assert.equal(hasParcelDefaults({}), false);
  });
});

describe('isParcelSetupPending', () => {
  it('stays quiet when the payload carries no parcel fields at all', () => {
    assert.equal(isParcelSetupPending({ id: 1 }), false);
  });

  it('reports a store that carries the fields but has not filled them in', () => {
    assert.equal(isParcelSetupPending({ default_package_length: 0 }), true);
  });

  it('does not report a fully configured store', () => {
    assert.equal(isParcelSetupPending({
      default_package_length: 30,
      default_package_width: 22,
      default_package_height: 12,
      default_package_weight: 1.2,
    }), false);
  });
});

describe('validateParcelDraft', () => {
  it('passes a complete draft', () => {
    assert.deepEqual(validateParcelDraft({ length: '30', width: '22', height: '12', weight: '1.2' }), {});
  });

  it('flags empty, non-numeric and non-positive values', () => {
    const errors = validateParcelDraft({ length: '', width: 'abc', height: '0', weight: '-1' });
    assert.equal(errors.length, 'Please enter default length');
    assert.equal(errors.width, 'Default Width must be a number');
    assert.equal(errors.height, 'Default Height must be greater than 0');
    assert.equal(errors.weight, 'Fallback Weight must be greater than 0');
  });
});

describe('parseSyncError', () => {
  const squarespaceError = 'Squarespace order fetch failed: {\n  "type" : "WEBSITE_EXPIRED",\n'
    + '  "subtype" : null,\n  "message" : "The current request cannot be served at this time.",\n'
    + '  "details" : null,\n  "contextId" : "JAYPLAYPIZEADRASMAWC"\n}';

  it('returns nothing when there is no error', () => {
    assert.equal(parseSyncError(undefined), null);
    assert.equal(parseSyncError('   '), null);
  });

  it('explains a cause it recognises', () => {
    const parsed = parseSyncError(squarespaceError)!;
    assert.equal(parsed.title, "This site's subscription has expired");
    assert.match(parsed.action!, /Renew the site/);
  });

  it('never leaks the payload, its generic message or the context id', () => {
    const shown = Object.values(parseSyncError(squarespaceError)!).join(' ');
    assert.equal(shown.includes('JAYPLAYPIZEADRASMAWC'), false);
    assert.equal(shown.includes('cannot be served at this time'), false);
    assert.equal(shown.includes('{'), false);
  });

  it('humanises an unrecognised code rather than showing the blob', () => {
    const parsed = parseSyncError('fetch failed: {"type":"RATE_LIMIT_EXCEEDED"}')!;
    assert.equal(parsed.title, 'Rate limit exceeded');
    assert.equal(parsed.action, undefined);
  });

  it('passes a plain-text error straight through', () => {
    assert.equal(parseSyncError('Connection timed out')!.title, 'Connection timed out');
  });

  it('keeps the readable prefix when the payload is not valid JSON or has no type', () => {
    assert.equal(parseSyncError('Order fetch failed: {not json}')!.title, 'Order fetch failed');
    assert.equal(parseSyncError('Order fetch failed: {"message":"nope"}')!.title, 'Order fetch failed');
  });
});

describe('getAccountSubtitle', () => {
  it('reads the Squarespace storefront out of meta', () => {
    const account = { platformSlug: 'squarespace', meta: { store_url: 'https://drum-flatworm.squarespace.com' } };
    assert.equal(getAccountSubtitle(account), 'https://drum-flatworm.squarespace.com');
  });

  it('still accepts a top-level store_url', () => {
    assert.equal(getAccountSubtitle({ platformSlug: 'squarespace', store_url: 'https://a.test' }), 'https://a.test');
  });
});

describe('toShopHandle', () => {
  it('leaves a bare handle alone', () => {
    assert.equal(toShopHandle('northbound', '.myshopify.com'), 'northbound');
  });

  it('trims a pasted full domain', () => {
    assert.equal(toShopHandle('northbound.myshopify.com', '.myshopify.com'), 'northbound');
    assert.equal(toShopHandle('https://northbound.myshopify.com/', '.myshopify.com'), 'northbound');
    assert.equal(toShopHandle('  NORTHBOUND.MyShopify.com  ', '.myshopify.com'), 'NORTHBOUND');
  });

  it('trims the Shopline suffix too', () => {
    assert.equal(toShopHandle('northbound.myshopline.com', '.myshopline.com'), 'northbound');
  });
});
