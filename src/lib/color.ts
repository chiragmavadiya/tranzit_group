const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export const isValidHexColor = (value: string): boolean => HEX_COLOR.test(value.trim());

/** Uppercase so a saved value and a freshly typed one compare equal. */
export const normalizeHexColor = (value: string): string => value.trim().toUpperCase();

/**
 * Relative luminance per WCAG 2.x, used to decide whether content sitting on a
 * customer-chosen background should be light or dark. Falls back to dark-on-light for an
 * unusable value so the surface is never unreadable.
 */
export const readableForeground = (hex: string | null): 'light' | 'dark' => {
  if (!hex || !isValidHexColor(hex)) return 'dark';

  const value = hex.trim().slice(1);
  const channel = (offset: number) => {
    const srgb = parseInt(value.slice(offset, offset + 2), 16) / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  };

  const luminance = 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);

  // Contrast against white vs black; 0.179 is where the two cross over.
  return luminance > 0.179 ? 'dark' : 'light';
};
