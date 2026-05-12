import { useEffect, useRef, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { FormInput } from '@/features/orders/components/OrderFormUI';
import type { FormInputProps } from '@/features/orders/components/types/OrderFormUI.types';

// Define the interface for your form data
export interface AddressData {
    formatted_address: string;
    unit_number: string;
    street_number: string;
    street_name: string;
    street_type: string;
    suburb: string;
    state: string;
    post_code: string;
    latitude: number | null;
    longitude: number | null;
    country: string;
}

interface PlaceAutocompleteProps extends FormInputProps {
    onPlaceSelect: (data: AddressData) => void
}

export const PlaceAutocomplete = ({ onPlaceSelect, ...rest }: PlaceAutocompleteProps) => {
    // 1. Fix the 'never' type error by adding the Google Autocomplete type
    const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const places = useMapsLibrary('places');

    useEffect(() => {
        if (!places || !inputRef.current) return;

        const options = {
            fields: ['address_components', 'geometry', 'formatted_address'],
            componentRestrictions: { country: 'au' }
        };

        const autocomplete = new places.Autocomplete(inputRef.current, options);
        setPlaceAutocomplete(autocomplete);
    }, [places]);

    useEffect(() => {
        if (!placeAutocomplete) return;

        placeAutocomplete.addListener('place_changed', () => {
            const place = placeAutocomplete.getPlace();
            console.log(place, "place")
            if (!place.address_components) return;

            // 2. Map Google components to the fields in image_ed5179.png
            const address: AddressData = {
                formatted_address: place.formatted_address || '',
                unit_number: '',
                street_number: '',
                street_name: '',
                street_type: '',
                suburb: '',
                state: '',
                post_code: '',
                country: '',
                latitude: place.geometry?.location?.lat() || null,
                longitude: place.geometry?.location?.lng() || null,
            };

            place.address_components.forEach((component: google.maps.GeocoderAddressComponent) => {
                const types = component.types;
                const value = component.short_name;

                if (types.includes('subpremise')) address.unit_number = value;
                if (types.includes('street_number')) address.street_number = value;

                if (types.includes('route')) {
                    // Australia street logic: "George St" -> Name: George, Type: St
                    const parts = component.long_name.split(' ');
                    address.street_type = parts.length > 1 ? parts.pop() || '' : '';
                    address.street_name = parts.join(' ');
                }
                if (types.includes('country')) address.country = component.short_name;
                if (types.includes('locality')) address.suburb = value;
                if (types.includes('administrative_area_level_1')) address.state = component.short_name; // e.g. NSW
                if (types.includes('postal_code')) address.post_code = value;
            });

            console.log(address, 'address')
            onPlaceSelect(address);
        });
    }, [onPlaceSelect, placeAutocomplete]);

    return (
        <div className="autocomplete-container w-full">
            <FormInput
                ref={inputRef}
                placeholder="Start typing address..."
                className="address-input"
                {...rest}
            />

        </div>
    );
};