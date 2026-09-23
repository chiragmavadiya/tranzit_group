import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PublicTrackingHeader } from '../components/PublicTrackingHeader';
import { PublicTrackingFooter } from '../components/PublicTrackingFooter';
import { TrackingHero } from '../components/TrackingHero';
import { HowTrackingWorks } from '../components/HowTrackingWorks';
import { TrackingSearchForm } from '../components/TrackingSearchForm';
import { TrackingResult } from '../components/TrackingResult';
import {
  TrackingInvalidLink,
  TrackingInvalidValue,
  TrackingNotFound,
  TrackingSkeleton,
  TrackingUnavailable,
} from '../components/TrackingStates';
import { useTrackShipment } from '../hooks/useTrackShipment';
import {
  DEFAULT_TRACKING_METHOD,
  trackingMethodCopy,
  type TrackingMethod,
} from '../types';

const upsertMeta = (name: string, content: string) => {
  let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  const created = !meta;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  const previous = meta.content;
  meta.content = content;

  return () => {
    if (created) meta?.remove();
    else if (meta) meta.content = previous;
  };
};

export default function PublicTrackingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // useSearchParams already decodes, so these are the raw values the customer sent.
  const orderNumber = searchParams.get('order_number')?.trim() ?? '';
  const trackingNumber = searchParams.get('tracking_number')?.trim() ?? '';

  // Both at once is unresolvable — we will not guess which shipment was meant.
  const isAmbiguousLink = Boolean(orderNumber) && Boolean(trackingNumber);

  const urlMethod: TrackingMethod = orderNumber ? 'order_number' : 'tracking_number';
  const urlValue = isAmbiguousLink ? '' : orderNumber || trackingNumber;

  const [method, setMethod] = useState<TrackingMethod>(
    urlValue ? urlMethod : DEFAULT_TRACKING_METHOD,
  );
  const [inputValue, setInputValue] = useState(urlValue);
  const [syncedUrl, setSyncedUrl] = useState(`${urlMethod}:${urlValue}`);

  // Keep the form in step with the URL without an effect, so back/forward, a direct link
  // and a refresh all show the lookup that is actually being tracked.
  const currentUrl = `${urlMethod}:${urlValue}`;
  if (syncedUrl !== currentUrl) {
    setSyncedUrl(currentUrl);
    setInputValue(urlValue);
    if (urlValue) setMethod(urlMethod);
  }

  const { data: shipment, isFetching, error, refetch } = useTrackShipment(
    urlMethod,
    urlValue,
    !isAmbiguousLink,
  );

  const hasQuery = Boolean(urlValue) || isAmbiguousLink;
  // A lookup is in flight and its branding is not known yet.
  const brandingPending = hasQuery && !isAmbiguousLink && !error && !shipment;

  // Switching lookup type clears the result, which empties the URL. The search view has
  // to outlive that, or the customer is thrown back to the hero mid-search.
  const [keepSearchView, setKeepSearchView] = useState(false);
  const showSearchView = hasQuery || keepSearchView;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = urlValue ? `Track ${urlValue} | Tranzit` : 'Track Your Shipment | Tranzit';

    const restoreDescription = upsertMeta(
      'description',
      'Track a Tranzit shipment. Enter your order number or tracking number to see the latest delivery updates for your parcel.',
    );
    // Result URLs carry a customer's order or tracking number, so keep them out of
    // search results.
    const restoreRobots = upsertMeta('robots', hasQuery ? 'noindex, nofollow' : 'index, follow');

    return () => {
      document.title = previousTitle;
      restoreDescription();
      restoreRobots();
    };
  }, [urlValue, hasQuery]);

  const handleSubmit = (nextMethod: TrackingMethod, value: string) => {
    // Same lookup again: refetch rather than push a duplicate history entry.
    if (nextMethod === urlMethod && value === urlValue && !isAmbiguousLink) {
      refetch();
      return;
    }
    navigate(`/track?${new URLSearchParams({ [nextMethod]: value })}`);
  };

  // Switching lookup type clears the field, the validation error and the result, but
  // leaves the customer on the search view so they can type the other number straight away.
  const handleMethodChange = (nextMethod: TrackingMethod) => {
    setMethod(nextMethod);
    setInputValue('');
    if (hasQuery) {
      setKeepSearchView(true);
      navigate('/track');
    }
  };

  // "Track another package" is the deliberate way back to the hero.
  const handleTrackAnother = () => {
    setKeepSearchView(false);
    setInputValue('');
    navigate('/track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * The Tranzit logo is the way home from anywhere. Its <Link> alone is not enough: after
   * a method switch the URL is already /track, so the click would be a no-op and leave the
   * customer pinned to the search view with no way out.
   */
  const handleGoHome = () => {
    setKeepSearchView(false);
    setInputValue('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const announcement = isAmbiguousLink
    ? 'This tracking link is not valid.'
    : isFetching
      ? 'Loading tracking details.'
      : error?.kind === 'not_found'
        ? trackingMethodCopy(urlMethod).notFound
        : error?.kind === 'invalid'
          ? `That does not look like a ${trackingMethodCopy(urlMethod).label.toLowerCase()}.`
          : error
            ? 'Tracking is unavailable right now.'
            : shipment
              ? `Shipment found. Current status: ${shipment.statusLabel || 'not available'}.`
              : '';

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-zinc-950">
      {/*
        Branding belongs to the shipment currently on screen and nothing else. An error,
        a not-found, an invalid link or no search yet all fall back to Tranzit, and
        because each lookup has its own query key, `shipment` is undefined while a new
        one loads — so one customer's branding can never linger over another's shipment.
      */}
      <PublicTrackingHeader
        branding={error ? undefined : shipment?.branding}
        isLoading={brandingPending}
        onHome={handleGoHome}
      />

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {!showSearchView ? (
        <>
          <TrackingHero
            method={method}
            onMethodChange={handleMethodChange}
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            isLoading={isFetching}
          />

          <HowTrackingWorks />
        </>
      ) : (
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-7 sm:px-6 sm:py-9">
          <div className="mb-6">
            <TrackingSearchForm
              method={method}
              onMethodChange={handleMethodChange}
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSubmit}
              isLoading={isFetching}
              compact
            />
          </div>

          {isAmbiguousLink ? (
            <TrackingInvalidLink />
          ) : isFetching ? (
            <TrackingSkeleton />
          ) : error?.kind === 'not_found' ? (
            <TrackingNotFound method={urlMethod} value={urlValue} />
          ) : error?.kind === 'invalid' ? (
            <TrackingInvalidValue method={urlMethod} />
          ) : error ? (
            <TrackingUnavailable onRetry={() => refetch()} />
          ) : shipment ? (
            <TrackingResult shipment={shipment} onTrackAnother={handleTrackAnother} />
          ) : null}
        </main>
      )}

      <PublicTrackingFooter />
    </div>
  );
}
