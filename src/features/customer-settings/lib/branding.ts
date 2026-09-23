// Relative, not aliased: this module runs under node:test, which cannot resolve "@/".
import { normalizeHexColor } from '../../../lib/color.ts';
import type {
  TrackingPageSettings,
  TrackingPageSettingsUpdate,
} from '../types';

/**
 * SVG is excluded on purpose: it can carry script, and the backend has not confirmed it
 * is accepted or sanitised. Revisit only once that is documented.
 */
export const LOGO_ACCEPTED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
] as const;

export const LOGO_ACCEPT_ATTRIBUTE = '.png,.jpg,.jpeg,.webp';

/**
 * PROVISIONAL — the backend limit for this endpoint is not documented anywhere in the
 * repo. Chosen to fail fast in the browser rather than to mirror a known server rule;
 * align it the moment the real limit is confirmed.
 */
export const LOGO_MAX_SIZE_MB = 2;

// Shared with the public tracking header, which must not import from this feature.
export { isValidHexColor, normalizeHexColor, readableForeground } from '../../../lib/color.ts';

/**
 * Absolute http(s) only. Anything else — javascript:, data:, file:, a bare domain — is
 * rejected rather than repaired, so we never redirect a recipient somewhere the customer
 * did not actually type.
 */
export const isValidBrandUrl = (value: string): boolean => {
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    const url = new URL(trimmed);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
};

export const validateLogoFile = (file: File): string | null => {
  if (!(LOGO_ACCEPTED_TYPES as readonly string[]).includes(file.type)) {
    return 'Choose a PNG, JPG or WebP image.';
  }
  if (file.size > LOGO_MAX_SIZE_MB * 1024 * 1024) {
    return `Logo must be ${LOGO_MAX_SIZE_MB}MB or smaller.`;
  }
  return null;
};

/** What the form holds, before it is diffed against the saved settings. */
export interface BrandingFormState {
  /** A newly chosen file, not yet uploaded. */
  logoFile: File | null;
  /** The saved logo was removed and no replacement chosen. */
  logoRemoved: boolean;
  brandUrl: string;
  headerColor: string;
}

/** Empty string and null both mean "not set", so they must not read as a change. */
const sameText = (a: string, b: string | null): boolean => a.trim() === (b ?? '').trim();

/**
 * Builds the request from only what actually changed, per the endpoint's partial-update
 * rules: never `logo: null`, never `remove_logo: false`, and an explicit `null` to clear
 * a text field. Returns an empty object when nothing changed, which the caller treats as
 * "don't send a request".
 */
export const buildBrandingUpdate = (
  form: BrandingFormState,
  saved: TrackingPageSettings,
): TrackingPageSettingsUpdate => {
  const update: TrackingPageSettingsUpdate = {};

  if (form.logoFile) {
    update.logo = form.logoFile;
  } else if (form.logoRemoved && saved.logo) {
    update.remove_logo = true;
  }

  if (!sameText(form.brandUrl, saved.brand_url)) {
    update.brand_url = form.brandUrl.trim() || null;
  }

  const color = form.headerColor.trim();
  const savedColor = saved.header_color ? normalizeHexColor(saved.header_color) : null;
  const nextColor = color ? normalizeHexColor(color) : null;
  if (nextColor !== savedColor) {
    update.header_color = nextColor;
  }

  return update;
};

export const hasBrandingChanges = (
  form: BrandingFormState,
  saved: TrackingPageSettings,
): boolean => Object.keys(buildBrandingUpdate(form, saved)).length > 0;
