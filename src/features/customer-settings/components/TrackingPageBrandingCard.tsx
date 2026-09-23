import { useEffect, useRef, useState } from 'react';
import { ImageIcon, Loader2, Trash2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomLabel, FormInput } from '@/features/orders/components/OrderFormUI';
import { cn } from '@/lib/utils';
import {
  useTrackingPageSettings,
  useUpdateTrackingPageSettings,
} from '../hooks/useTrackingPageSettings';
import {
  LOGO_ACCEPT_ATTRIBUTE,
  LOGO_MAX_SIZE_MB,
  buildBrandingUpdate,
  isValidBrandUrl,
  isValidHexColor,
  normalizeHexColor,
  readableForeground,
  validateLogoFile,
  type BrandingFormState,
} from '../lib/branding';
import type { TrackingPageSettings } from '../types';

const TRANZIT_HEADER_COLOR = '#FFFFFF';

const EMPTY_SETTINGS: TrackingPageSettings = {
  logo: null,
  brand_url: null,
  header_color: null,
};

const EMPTY_FORM: BrandingFormState = {
  logoFile: null,
  logoRemoved: false,
  brandUrl: '',
  headerColor: '',
};

export default function TrackingPageBrandingCard({ canEdit = true }: { canEdit?: boolean }) {
  const { data: response, isLoading } = useTrackingPageSettings();
  const updateMutation = useUpdateTrackingPageSettings();

  const saved = response?.data ?? EMPTY_SETTINGS;

  const [form, setForm] = useState<BrandingFormState>(EMPTY_FORM);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [logoError, setLogoError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Seed the form once the saved settings arrive, without an effect that would fight the
  // user's edits: the response identity only changes when the query refetches.
  const [seededFrom, setSeededFrom] = useState<TrackingPageSettings | null>(null);
  if (response?.data && seededFrom !== response.data) {
    setSeededFrom(response.data);
    setForm({
      logoFile: null,
      logoRemoved: false,
      brandUrl: response.data.brand_url ?? '',
      headerColor: response.data.header_color ?? '',
    });
    setLogoError('');
    setSubmitted(false);
  }

  // A blob URL leaks until it is revoked, so tie its lifetime to the chosen file.
  useEffect(() => {
    if (!form.logoFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(form.logoFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [form.logoFile]);

  const update = buildBrandingUpdate(form, saved);
  const hasChanges = Object.keys(update).length > 0;

  const colorValue = form.headerColor.trim();
  const colorInvalid = Boolean(colorValue) && !isValidHexColor(colorValue);
  const urlValue = form.brandUrl.trim();
  const urlInvalid = Boolean(urlValue) && !isValidBrandUrl(urlValue);

  // What the recipient would actually see right now.
  const effectiveLogo = form.logoFile
    ? previewUrl
    : form.logoRemoved
      ? null
      : saved.logo;
  const effectiveColor = colorInvalid || !colorValue ? null : normalizeHexColor(colorValue);
  const foreground = readableForeground(effectiveColor);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Allow re-picking the same file after a cancel.
    event.target.value = '';
    if (!file) return;

    const error = validateLogoFile(file);
    if (error) {
      setLogoError(error);
      return;
    }
    setLogoError('');
    setForm((prev) => ({ ...prev, logoFile: file, logoRemoved: false }));
  };

  const cancelSelectedFile = () => {
    setLogoError('');
    setForm((prev) => ({ ...prev, logoFile: null }));
  };

  const removeSavedLogo = () => {
    setLogoError('');
    setForm((prev) => ({ ...prev, logoFile: null, logoRemoved: true }));
  };

  const handleSave = () => {
    setSubmitted(true);
    if (colorInvalid || urlInvalid || !hasChanges) return;
    updateMutation.mutate(update);
  };

  const isBusy = updateMutation.isPending;
  const disabled = !canEdit || isBusy;

  return (
    <Card className="flex flex-col w-full hover:shadow-md transition-shadow duration-300 border-gray-200 shadow-xs rounded-md">
      <CardHeader className="flex flex-col items-start gap-1 px-6 py-4 border-b border-gray-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-950 space-y-0 rounded-t-md">
        <CardTitle className="text-base font-medium text-gray-800 dark:text-zinc-200">
          Tracking Page Branding
        </CardTitle>
        <p className="my-0 text-[13px] text-gray-500 dark:text-zinc-400">
          Customise the branding displayed to recipients when they track their shipments.
        </p>
      </CardHeader>

      <CardContent className="p-6 flex-1">
        {isLoading ? (
          <div className="flex items-center gap-2 py-6 text-sm text-gray-500 dark:text-zinc-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading branding settings…
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-5">
              {/* Brand logo */}
              <div className="flex flex-col gap-2">
                <CustomLabel label="Brand logo" />
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex h-14 w-28 shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed border-gray-300 bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900">
                    {effectiveLogo ? (
                      <img
                        src={effectiveLogo}
                        alt="Brand logo preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-gray-400 dark:text-zinc-600" aria-hidden="true" />
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={fileInputRef}
                      id="branding-logo"
                      type="file"
                      accept={LOGO_ACCEPT_ATTRIBUTE}
                      onChange={handleFileChange}
                      disabled={disabled}
                      className="sr-only"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={disabled}
                      onClick={() => fileInputRef.current?.click()}
                      className="h-8 gap-1.5"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      {effectiveLogo ? 'Replace' : 'Upload logo'}
                    </Button>

                    {form.logoFile ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={disabled}
                        onClick={cancelSelectedFile}
                        className="h-8 gap-1.5 text-slate-600 dark:text-zinc-400"
                      >
                        <X className="h-3.5 w-3.5" />
                        Cancel
                      </Button>
                    ) : null}

                    {!form.logoFile && saved.logo && !form.logoRemoved ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={disabled}
                        onClick={removeSavedLogo}
                        className="h-8 gap-1.5 text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </Button>
                    ) : null}

                    {form.logoRemoved && !form.logoFile ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={disabled}
                        onClick={() => setForm((prev) => ({ ...prev, logoRemoved: false }))}
                        className="h-8 text-slate-600 dark:text-zinc-400"
                      >
                        Undo remove
                      </Button>
                    ) : null}
                  </div>
                </div>
                <p className="my-0 text-[12px] text-gray-500 dark:text-zinc-400">
                  A transparent, horizontally oriented logo works best. PNG, JPG or WebP,
                  up to {LOGO_MAX_SIZE_MB}MB.
                </p>
                {logoError ? (
                  <p className="my-0 text-[11px] font-semibold text-red-600 dark:text-red-400">
                    {logoError}
                  </p>
                ) : null}
              </div>

              {/* Header colour */}
              <div className="flex flex-col gap-2">
                <CustomLabel label="Header colour" />
                <div className="flex items-center gap-2">
                  <input
                    id="branding-header-color"
                    type="color"
                    aria-label="Pick header colour"
                    value={isValidHexColor(colorValue) ? colorValue : TRANZIT_HEADER_COLOR}
                    disabled={disabled}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, headerColor: event.target.value.toUpperCase() }))
                    }
                    className="h-8 w-12 shrink-0 cursor-pointer rounded-sm border border-slate-200 bg-white p-0.5 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950"
                  />
                  <input
                    type="text"
                    aria-label="Header colour hex value"
                    value={form.headerColor}
                    disabled={disabled}
                    placeholder="#123456"
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, headerColor: event.target.value }))
                    }
                    className={cn(
                      'h-8 w-32 rounded-sm border bg-white px-2.5 font-mono text-sm uppercase outline-none transition-colors disabled:opacity-50 dark:bg-zinc-950',
                      'focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30',
                      colorInvalid
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-slate-200 dark:border-zinc-800',
                    )}
                  />
                  {colorValue ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={disabled}
                      onClick={() => setForm((prev) => ({ ...prev, headerColor: '' }))}
                      className="h-8 text-slate-600 dark:text-zinc-400"
                    >
                      Clear
                    </Button>
                  ) : null}
                </div>
                {colorInvalid ? (
                  <p className="my-0 text-[11px] font-semibold text-red-600 dark:text-red-400">
                    Enter a six-digit hex colour, for example #123456.
                  </p>
                ) : (
                  <p className="my-0 text-[12px] text-gray-500 dark:text-zinc-400">
                    Leave empty to use the default Tranzit header.
                  </p>
                )}
              </div>

              {/* Brand website URL */}
              <div className="flex flex-col gap-1">
                <FormInput
                  label="Brand website URL"
                  value={form.brandUrl}
                  onChange={(val) => setForm((prev) => ({ ...prev, brandUrl: val }))}
                  placeholder="https://yourstore.com"
                  disabled={disabled}
                  isFullWidth
                  error={submitted && urlInvalid}
                  errormsg="Enter a full URL starting with http:// or https://"
                />
                <p className="my-0 text-[12px] text-gray-500 dark:text-zinc-400">
                  Recipients will be redirected to this website when they click your logo
                  on the tracking page.
                </p>
              </div>
            </div>

            {/* Live preview */}
            <div className="flex flex-col gap-2">
              <CustomLabel label="Preview" />
              <div className="overflow-hidden rounded-md border border-gray-200 dark:border-zinc-800">
                <div
                  className="flex items-center justify-between gap-3 px-4 py-3"
                  style={{ backgroundColor: effectiveColor ?? TRANZIT_HEADER_COLOR }}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    {effectiveLogo ? (
                      <img
                        src={effectiveLogo}
                        alt="Brand logo preview"
                        className="h-8 max-w-[130px] object-contain"
                      />
                    ) : (
                      <span
                        className={cn(
                          'text-sm font-bold',
                          foreground === 'light' ? 'text-white' : 'text-slate-900',
                        )}
                      >
                        Tranzit
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      'shrink-0 text-[11px] font-semibold',
                      foreground === 'light' ? 'text-white/80' : 'text-slate-600',
                    )}
                  >
                    Shipment tracking
                  </span>
                </div>
                <div className="bg-slate-50 px-4 py-6 text-center text-[12px] text-gray-500 dark:bg-zinc-900 dark:text-zinc-400">
                  Tracking details appear here
                </div>
              </div>
              <p className="my-0 text-[12px] text-gray-500 dark:text-zinc-400">
                {urlValue && !urlInvalid
                  ? 'Your logo will link to your website.'
                  : 'Add a brand website URL to make your logo clickable.'}
              </p>
            </div>
          </div>
        )}

        {canEdit ? (
          <div className="mt-6 flex justify-end border-t border-gray-100 pt-4 dark:border-zinc-800">
            <Button
              type="button"
              onClick={handleSave}
              disabled={disabled || !hasChanges || colorInvalid || urlInvalid}
              className="h-9 px-5"
            >
              {isBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save branding
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
