import { AlertTriangle, MapPin } from 'lucide-react';
import type { AddressSuggestion } from '@/hooks/useValidateLocality';

export interface LocalitySuggestion {
  suburb: string;
  state: string;
  postcode: string;
}

export type { AddressSuggestion };

const chipClass =
  'rounded-full border border-red-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-primary/40 dark:border-red-900/50 dark:bg-zinc-950 dark:text-zinc-200';

/**
 * Inline banner for an address Google Geocoding could not confirm.
 *
 * `suggestions` are suburb/state/postcode chips; `addressSuggestions` are full street
 * addresses Google resolved (offered when the street line itself was not confirmed).
 * Each list renders only when its handler is supplied.
 */
export const LocalityWarning = ({
  message,
  suggestions = [],
  onSelect,
  addressSuggestions = [],
  onSelectAddress,
}: {
  message: string;
  suggestions?: LocalitySuggestion[];
  onSelect?: (suggestion: LocalitySuggestion) => void;
  addressSuggestions?: AddressSuggestion[];
  onSelectAddress?: (suggestion: AddressSuggestion) => void;
}) => (
  <div className="rounded-md border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 px-4 py-3 space-y-2">
    <div className="flex items-center gap-2.5">
      <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
      <p className="m-0 text-sm font-semibold text-red-700 dark:text-red-300">{message}</p>
    </div>
    {addressSuggestions.length > 0 && onSelectAddress && (
      <div className="pl-6 space-y-1">
        <p className="m-0 text-[11px] font-medium text-red-700/80 dark:text-red-300/80">Did you mean:</p>
        <div className="flex flex-wrap gap-1.5">
          {addressSuggestions.map((suggestion) => (
            <button
              key={suggestion.formatted_address}
              type="button"
              onClick={() => onSelectAddress(suggestion)}
              className={`${chipClass} inline-flex items-center gap-1`}
              title="Use this address"
            >
              <MapPin className="h-3 w-3 shrink-0 text-red-500" />
              {suggestion.formatted_address}
            </button>
          ))}
        </div>
      </div>
    )}
    {suggestions.length > 0 && onSelect && (
      <div className="flex flex-wrap gap-1.5 pl-6">
        {suggestions.map((suggestion) => (
          <button
            key={`${suggestion.suburb}|${suggestion.state}|${suggestion.postcode}`}
            type="button"
            onClick={() => onSelect(suggestion)}
            className={chipClass}
          >
            {suggestion.suburb} {suggestion.state} {suggestion.postcode}
          </button>
        ))}
      </div>
    )}
  </div>
);
