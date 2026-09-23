import { useState, type FormEvent } from 'react';
import { AlertCircle, Loader2, PackageSearch, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TRACKING_METHODS, trackingMethodCopy, type TrackingMethod } from '../types';

interface TrackingSearchFormProps {
  method: TrackingMethod;
  onMethodChange: (method: TrackingMethod) => void;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (method: TrackingMethod, value: string) => void;
  isLoading: boolean;
  /** Slimmer presentation used alongside a result, where the hero copy is gone. */
  compact?: boolean;
}

export const TrackingSearchForm = ({
  method,
  onMethodChange,
  value,
  onChange,
  onSubmit,
  isLoading,
  compact = false,
}: TrackingSearchFormProps) => {
  const [error, setError] = useState('');
  const copy = trackingMethodCopy(method);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    const trimmed = value.trim();
    if (!trimmed) {
      setError(`Enter your ${copy.label.toLowerCase()} to continue.`);
      return;
    }

    setError('');
    onSubmit(method, trimmed);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <div
        role="radiogroup"
        aria-label="How would you like to track your shipment?"
        className="mb-3 inline-flex w-full flex-col gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900 sm:w-auto sm:flex-row"
      >
        {TRACKING_METHODS.map((entry) => {
          const isActive = entry.key === method;
          return (
            <button
              key={entry.key}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => {
                if (isActive) return;
                setError('');
                onMethodChange(entry.key);
              }}
              className={cn(
                'cursor-pointer rounded-lg px-4 py-2 text-[13px] font-bold transition-colors',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                isActive
                  ? 'bg-[#0f2847] text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800',
              )}
            >
              {entry.tab}
            </button>
          );
        })}
      </div>

      <label
        htmlFor="tracking-lookup-value"
        className={cn(
          'text-[13px] font-bold text-slate-700 dark:text-zinc-300',
          compact ? 'sr-only' : 'mb-2 block',
        )}
      >
        {copy.label}
      </label>

      <div
        className={cn(
          'flex flex-col gap-2 rounded-xl border bg-white p-2 transition-colors dark:bg-zinc-900 sm:flex-row sm:items-center',
          'focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10',
          error
            ? 'border-red-400 dark:border-red-500/60'
            : 'border-slate-200 dark:border-zinc-800',
          compact ? 'shadow-xs' : 'shadow-sm',
        )}
      >
        <div className="flex flex-1 items-center gap-2.5 pl-2.5">
          <PackageSearch
            className="size-5 shrink-0 text-slate-400 dark:text-zinc-500"
            aria-hidden="true"
          />
          <input
            id="tracking-lookup-value"
            name={method}
            type="text"
            value={value}
            onChange={(event) => {
              onChange(event.target.value);
              if (error) setError('');
            }}
            disabled={isLoading}
            required
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            enterKeyHint="search"
            placeholder={copy.placeholder}
            aria-describedby={compact ? undefined : 'tracking-lookup-hint'}
            aria-invalid={Boolean(error)}
            className={cn(
              'w-full min-w-0 border-0 bg-transparent p-0 text-base font-medium text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400 disabled:opacity-60 dark:text-zinc-100 dark:placeholder:text-zinc-500',
              compact ? 'h-10' : 'h-11',
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className={cn(
            'w-full shrink-0 rounded-lg px-6 text-sm font-bold text-[#0f2847] sm:w-auto',
            'bg-[#f59e0b] hover:bg-[#e08c07] focus-visible:ring-[#f59e0b]/40',
            compact ? 'h-10' : 'h-11',
          )}
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          ) : (
            <Search className="size-4" aria-hidden="true" />
          )}
          {isLoading ? 'Tracking…' : 'Track shipment'}
        </Button>
      </div>

      {!compact ? (
        <p
          id="tracking-lookup-hint"
          className="mt-2.5 text-[13px] leading-relaxed text-slate-500 dark:text-zinc-400"
        >
          You'll find this in your shipping confirmation email or on your receipt.
        </p>
      ) : null}

      {/* Reserves its own height so showing an error doesn't shift the layout below. */}
      <p
        aria-live="assertive"
        className={cn('flex min-h-5 items-center gap-1.5', compact ? 'mt-2' : 'mt-1')}
      >
        {error ? (
          <>
            <AlertCircle className="size-3.5 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
            <span className="text-[13px] font-semibold text-red-600 dark:text-red-400">{error}</span>
          </>
        ) : null}
      </p>
    </form>
  );
};
