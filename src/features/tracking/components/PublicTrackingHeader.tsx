import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import brandLogo from '@/assets/Tranzit_Logo.svg';
import brandLogoDark from '@/assets/Tranzit_Logo_dark.svg';
import { useTheme } from '@/app/providers/theme-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { readableForeground } from '@/lib/color';
import { cn } from '@/lib/utils';
import { DEFAULT_BRANDING, type ShipmentBranding } from '../types';

interface PublicTrackingHeaderProps {
  /** Branding for the shipment currently on screen. Omitted until one is resolved. */
  branding?: ShipmentBranding;
  /**
   * A lookup is in flight and its branding is not known yet. Renders the bar empty rather
   * than showing Tranzit branding that would visibly swap to the customer's a moment later.
   */
  isLoading?: boolean;
  /** Runs alongside the Tranzit logo's link home, so it also resets the page's own view state. */
  onHome?: () => void;
}

export const PublicTrackingHeader = ({
  branding = DEFAULT_BRANDING,
  isLoading = false,
  onHome,
}: PublicTrackingHeaderProps) => {
  const { theme } = useTheme();

  // Keyed by URL rather than a boolean, so tracking another package with a different
  // logo clears the failure automatically instead of staying stuck on the fallback.
  const [failedLogoUrl, setFailedLogoUrl] = useState<string | null>(null);

  const { logoUrl, brandUrl, headerColor } = branding;
  const showCustomLogo = Boolean(logoUrl) && failedLogoUrl !== logoUrl;

  // On a custom background the theme no longer decides which wordmark reads — contrast does.
  const onCustomColor = Boolean(headerColor);
  const isLightOnDark = onCustomColor
    ? readableForeground(headerColor) === 'light'
    : theme === 'dark';
  const tranzitLogo = isLightOnDark ? brandLogoDark : brandLogo;

  const logo = showCustomLogo ? (
    <img
      src={logoUrl as string}
      alt="Store logo"
      onError={() => setFailedLogoUrl(logoUrl)}
      // Capped in both axes so a tall or very wide logo cannot stretch the header.
      className="h-8 w-auto max-w-[140px] object-contain sm:h-9 sm:max-w-[200px]"
    />
  ) : (
    <img src={tranzitLogo} alt="Tranzit Group" className="h-9 w-auto object-contain" />
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-20 border-b backdrop-blur-sm',
        onCustomColor
          ? 'border-black/10'
          : 'border-slate-200/70 bg-white/95 dark:border-zinc-800 dark:bg-zinc-950/95',
      )}
      style={onCustomColor ? { backgroundColor: headerColor as string } : undefined}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
        {/* Same height and padding as the resolved header, so nothing shifts when branding lands. */}
        {isLoading ? (
          <>
            <Skeleton className="h-9 w-32 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </>
        ) : (
        <>
        <div className="flex min-w-0 items-center gap-3">
          {showCustomLogo ? (
            brandUrl ? (
              <a
                href={brandUrl}
                rel="noreferrer"
                aria-label="Visit our store"
                className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
              >
                {logo}
              </a>
            ) : (
              <span className="shrink-0">{logo}</span>
            )
          ) : (
            <Link
              to="/track"
              onClick={onHome}
              className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
              aria-label="Tranzit shipment tracking"
            >
              {logo}
            </Link>
          )}

          <span
            aria-hidden="true"
            className={cn(
              'hidden h-6 w-px sm:block',
              onCustomColor
                ? isLightOnDark
                  ? 'bg-white/30'
                  : 'bg-black/20'
                : 'bg-slate-200 dark:bg-zinc-800',
            )}
          />
          <span
            className={cn(
              'hidden truncate text-[13px] font-semibold sm:block',
              onCustomColor
                ? isLightOnDark
                  ? 'text-white/90'
                  : 'text-slate-900/80'
                : 'text-slate-500 dark:text-zinc-400',
            )}
          >
            Shipment tracking
          </span>
        </div>

        <Link
          to="/login"
          className={cn(
            'group inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[13px] font-semibold transition-colors',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current',
            onCustomColor
              ? isLightOnDark
                ? 'border-white/40 text-white hover:border-white/70 hover:bg-white/10'
                : 'border-black/20 text-slate-900 hover:border-black/40 hover:bg-black/5'
              : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900',
          )}
        >
          Sign in
          <ArrowRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            aria-hidden="true"
          />
        </Link>
        </>
        )}
      </div>
    </header>
  );
};
