import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  LOGO_MAX_SIZE_MB,
  buildBrandingUpdate,
  hasBrandingChanges,
  isValidBrandUrl,
  isValidHexColor,
  normalizeHexColor,
  readableForeground,
  validateLogoFile,
  type BrandingFormState,
} from './branding.ts';
import type { TrackingPageSettings } from '../types.ts';

const EMPTY: TrackingPageSettings = { logo: null, brand_url: null, header_color: null };
const SAVED: TrackingPageSettings = {
  logo: 'https://cdn.example.com/logo.png',
  brand_url: 'https://store.example.com',
  header_color: '#102A43',
};

const form = (overrides: Partial<BrandingFormState> = {}): BrandingFormState => ({
  logoFile: null,
  logoRemoved: false,
  brandUrl: '',
  headerColor: '',
  ...overrides,
});

/** Stands in for a File; only `type` and `size` are read. */
const fakeFile = (type: string, sizeMb: number) =>
  ({ type, size: sizeMb * 1024 * 1024, name: 'logo' }) as File;

const savedForm = () => form({ brandUrl: SAVED.brand_url!, headerColor: SAVED.header_color! });

describe('isValidHexColor', () => {
  it('accepts a six-digit hex colour', () => {
    assert.equal(isValidHexColor('#123456'), true);
    assert.equal(isValidHexColor('  #aabbcc  '), true);
  });

  it('rejects shorthand, missing hash and non-hex characters', () => {
    for (const bad of ['#123', '123456', '#12345', '#1234567', '#12345g', '', 'red']) {
      assert.equal(isValidHexColor(bad), false, `expected ${bad} to be rejected`);
    }
  });
});

describe('isValidBrandUrl', () => {
  it('accepts absolute http and https URLs', () => {
    assert.equal(isValidBrandUrl('https://store.example.com'), true);
    assert.equal(isValidBrandUrl('http://store.example.com/path?a=1'), true);
    assert.equal(isValidBrandUrl('  https://store.example.com  '), true);
  });

  it('rejects unsafe schemes', () => {
    for (const bad of ['javascript:alert(1)', 'data:text/html,<script>', 'file:///etc/passwd']) {
      assert.equal(isValidBrandUrl(bad), false, `expected ${bad} to be rejected`);
    }
  });

  it('rejects a bare domain rather than guessing a scheme', () => {
    assert.equal(isValidBrandUrl('yourstore.com'), false);
    assert.equal(isValidBrandUrl(''), false);
  });
});

describe('validateLogoFile', () => {
  it('accepts png, jpeg and webp', () => {
    for (const type of ['image/png', 'image/jpeg', 'image/webp']) {
      assert.equal(validateLogoFile(fakeFile(type, 1)), null);
    }
  });

  it('rejects svg and other unsupported types', () => {
    assert.notEqual(validateLogoFile(fakeFile('image/svg+xml', 0.1)), null);
    assert.notEqual(validateLogoFile(fakeFile('application/pdf', 0.1)), null);
  });

  it('rejects a file over the size limit', () => {
    assert.equal(validateLogoFile(fakeFile('image/png', LOGO_MAX_SIZE_MB)), null);
    assert.notEqual(validateLogoFile(fakeFile('image/png', LOGO_MAX_SIZE_MB + 0.1)), null);
  });
});

describe('buildBrandingUpdate', () => {
  it('sends nothing when nothing changed', () => {
    assert.deepEqual(buildBrandingUpdate(form(), EMPTY), {});
    assert.deepEqual(buildBrandingUpdate(savedForm(), SAVED), {});
    assert.equal(hasBrandingChanges(savedForm(), SAVED), false);
  });

  it('sends only the header colour when only it changed', () => {
    const update = buildBrandingUpdate(
      form({ brandUrl: SAVED.brand_url!, headerColor: '#123456' }),
      SAVED,
    );
    assert.deepEqual(update, { header_color: '#123456' });
  });

  it('sends null to clear the brand url', () => {
    const update = buildBrandingUpdate(
      form({ brandUrl: '', headerColor: SAVED.header_color! }),
      SAVED,
    );
    assert.deepEqual(update, { brand_url: null });
  });

  it('sends null to clear the header colour', () => {
    const update = buildBrandingUpdate(
      form({ brandUrl: SAVED.brand_url!, headerColor: '' }),
      SAVED,
    );
    assert.deepEqual(update, { header_color: null });
  });

  it('sends the file when a new logo is selected, and never remove_logo alongside it', () => {
    const file = fakeFile('image/png', 1);
    const update = buildBrandingUpdate(
      { ...savedForm(), logoFile: file, logoRemoved: true },
      SAVED,
    );
    assert.deepEqual(update, { logo: file });
    assert.equal('remove_logo' in update, false);
  });

  it('sends remove_logo only when a saved logo is actually removed', () => {
    assert.deepEqual(
      buildBrandingUpdate({ ...savedForm(), logoRemoved: true }, SAVED),
      { remove_logo: true },
    );
    // Nothing saved to remove: no key at all, never remove_logo: false.
    assert.deepEqual(buildBrandingUpdate(form({ logoRemoved: true }), EMPTY), {});
  });

  it('sends every changed field together', () => {
    const update = buildBrandingUpdate(
      form({ logoRemoved: true, brandUrl: 'https://new.example.com', headerColor: '#102a43' }),
      { ...SAVED, header_color: '#FFFFFF' },
    );
    assert.deepEqual(update, {
      remove_logo: true,
      brand_url: 'https://new.example.com',
      header_color: '#102A43',
    });
  });

  it('treats a case-only hex change as unchanged', () => {
    assert.deepEqual(
      buildBrandingUpdate(form({ brandUrl: SAVED.brand_url!, headerColor: '#102a43' }), SAVED),
      {},
    );
  });

  it('trims the brand url and does not treat whitespace as a change', () => {
    assert.deepEqual(
      buildBrandingUpdate(
        form({ brandUrl: '  https://store.example.com  ', headerColor: SAVED.header_color! }),
        SAVED,
      ),
      {},
    );
    assert.equal(normalizeHexColor('  #abcdef '), '#ABCDEF');
  });
});

describe('readableForeground', () => {
  it('uses light text on dark backgrounds and dark text on light ones', () => {
    assert.equal(readableForeground('#000000'), 'light');
    assert.equal(readableForeground('#102A43'), 'light');
    assert.equal(readableForeground('#FFFFFF'), 'dark');
    assert.equal(readableForeground('#F59E0B'), 'dark');
  });

  it('falls back to dark text for a missing or unusable colour', () => {
    assert.equal(readableForeground(null), 'dark');
    assert.equal(readableForeground('not-a-colour'), 'dark');
  });
});
