import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { API_ENDPOINTS, QUERY_KEYS } from "@/constants/api.constants";
import { useDebounce } from "./useDebounce";

export interface LocalityOption {
    suburb: string;
    state: string;
    postcode: string;
}

/** How far down the address Google managed to resolve the street line. */
export type AddressMatchLevel = 'street_address' | 'route' | 'locality' | 'none';

/** Google's canonical reading of a street address (API `data.address_suggestions[]`). */
export interface AddressSuggestion {
    match_level: AddressMatchLevel;
    partial_match: boolean;
    formatted_address: string;
    unit_number: string | null;
    street_number: string | null;
    street_name: string | null;
    suburb: string;
    state: string;
    postcode: string;
    latitude: number | null;
    longitude: number | null;
}

/** API `data.address`: the best match for the supplied street line, plus whether it was confirmed. */
export interface AddressMatch extends AddressSuggestion {
    valid: boolean;
}

export interface LocalityValidateResponse {
    status: boolean;
    message: string;
    data: {
        /** Overall answer: locality valid and, when a street was sent, street confirmed. */
        valid: boolean;
        /** The suburb/state/postcode check on its own. */
        locality_valid: boolean;
        matches: LocalityOption[];
        /** Locality corrections from the local postcode table (only when the locality is invalid). */
        suggestions?: LocalityOption[];
        /** null when no street line was sent. */
        address: AddressMatch | null;
        /** Street-level corrections from Google (only when the street could not be confirmed). */
        address_suggestions?: AddressSuggestion[];
    };
}

const localityKeyOf = (option: LocalityOption) =>
    `${option.suburb.trim().toUpperCase()}|${option.state.trim().toUpperCase()}|${option.postcode.trim()}`;

const hasLocality = (option: Pick<AddressSuggestion, 'suburb' | 'state' | 'postcode'>) =>
    !!(option.suburb && option.state && option.postcode);

/**
 * Validates a street/suburb/state/postcode combination against Google Geocoding
 * (`GET /localities/validate`).
 *
 * The values are debounced as one string so a half-typed address is never checked
 * against a stale sibling field, and the request is skipped unless all of them satisfy the
 * API's own rules, so an incomplete address never triggers a 422 error toast.
 *
 * `isPending` covers both the debounce window and the in-flight request — gate form
 * submission on it so a fast submit can't slip through on the previous address's result.
 *
 * Returned corrections:
 * - `suggestions` — suburb/state/postcode chips. When the locality itself is wrong these come
 *   from the local postcode table; when Google resolved the street in a different locality
 *   (e.g. the right suburb with the wrong postcode) that locality is offered first, so the
 *   existing chip handlers can fix it with one click.
 * - `addressSuggestions` — full street-level corrections from Google, for forms that also hold
 *   unit/street fields. Empty when the street was confirmed or no street was sent.
 * - `address` — Google's reading of the street that was sent, confirmed or not.
 */
export const useValidateLocality = (suburb?: string, state?: string, postcode?: string, address?: string) => {
    // The street goes last so a '|' typed into it can be rejoined instead of shifting the fields.
    const localityKey = `${suburb?.trim() || ''}|${state?.trim().toUpperCase() || ''}|${postcode?.trim() || ''}|${address?.trim() || ''}`;
    const debouncedKey = useDebounce(localityKey, 500);
    const [cleanSuburb, cleanState, cleanPostcode, ...addressParts] = debouncedKey.split('|');
    const cleanAddress = addressParts.join('|');

    // Australian postcodes are exactly 4 digits; a half-typed one always 422s.
    const enabled = cleanSuburb && cleanState && cleanAddress && /^\d{4}$/.test(cleanPostcode);

    const { data, isFetching } = useQuery({
        queryKey: QUERY_KEYS.LOCALITIES.VALIDATE(cleanSuburb, cleanState, cleanPostcode, cleanAddress),
        queryFn: async () => {
            const response = await api.get<LocalityValidateResponse>(API_ENDPOINTS.LOCALITIES.VALIDATE, {
                params: { suburb: cleanSuburb, state: cleanState, postcode: cleanPostcode, address: cleanAddress },
            });
            return response.data;
        },
        enabled: !!enabled,
        retry: false,
        staleTime: Infinity,
    });

    const result = data?.data;
    const invalid = result?.valid === false;
    const localityValid = result?.locality_valid ?? null;
    const addressMatch = result?.address ?? null;
    const addressValid = addressMatch ? addressMatch.valid : null;

    // Street-level corrections. Google's own reading of the input leads when it resolved a
    // street but we rejected it (wrong locality / partial match), then the API's candidates.
    const addressSuggestions: AddressSuggestion[] = [];
    if (invalid && addressMatch && !addressMatch.valid) {
        const seen = new Set<string>();
        const candidates: AddressSuggestion[] = [
            ...(addressMatch.match_level === 'street_address' ? [addressMatch] : []),
            ...(result?.address_suggestions ?? []),
        ];
        for (const candidate of candidates) {
            const key = candidate.formatted_address.trim().toUpperCase();
            if (!key || seen.has(key)) continue;
            seen.add(key);
            addressSuggestions.push(candidate);
        }
    }

    // Locality chips: localities Google placed the street in (when they differ from what was
    // typed) first, then the local-table suggestions / Google's postcode matches.
    const suggestions: LocalityOption[] = [];
    if (invalid && result) {
        const typedKey = `${cleanSuburb.toUpperCase()}|${cleanState.toUpperCase()}|${cleanPostcode}`;
        const seen = new Set<string>([typedKey]);
        const fromGoogleStreet: LocalityOption[] = [
            ...(addressMatch && hasLocality(addressMatch) ? [addressMatch] : []),
            ...addressSuggestions.filter(hasLocality),
        ].map(({ suburb, state, postcode }) => ({ suburb: suburb.toUpperCase(), state: state.toUpperCase(), postcode }));
        const fromLocality: LocalityOption[] = localityValid === false
            ? (result.suggestions?.length ? result.suggestions : result.matches)
            : [];

        for (const option of [...fromGoogleStreet, ...fromLocality]) {
            const key = localityKeyOf(option);
            if (seen.has(key)) continue;
            seen.add(key);
            suggestions.push(option);
        }
    }

    return {
        error: invalid ? data!.message : '',
        suggestions,
        addressSuggestions,
        address: addressMatch,
        /** null until a result arrives. */
        localityValid,
        /** null until a result arrives or when no street line was sent. */
        addressValid,
        isPending: debouncedKey !== localityKey || isFetching,
    };
};
