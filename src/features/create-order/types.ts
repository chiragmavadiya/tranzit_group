import type { QuoteItem } from "../quote/types";

export interface OrderCalculations {
    totalItems: number;
    deadWeight: number;
    volumetricWeight: number;
    serviceCost: number;
    gst: number;
    surcharges: number;
    total: number;
}

export interface OrderSummaryProps {
    calculations: OrderCalculations;
}

export interface CustomerAddress {
    contact_name: string;
    business_name: string;
    street_address: string;
    unit: string;
    street_number: string;
    street_name: string;
    suburb: string;
    state: string;
    postcode: string;
    phone: string;
    email: string;
    country: string;
    label: string;
    save_to_address_book?: boolean;
}

export interface OrderAddressFormProps {
    items: QuoteItem[];
    setItems: React.Dispatch<React.SetStateAction<QuoteItem[]>>;
    locations: {
        sender: CustomerAddress;
        receiver: CustomerAddress;
    };
    setLocations: React.Dispatch<React.SetStateAction<{ sender: CustomerAddress; receiver: CustomerAddress }>>;
    onGetRate: () => void;
    isValid: boolean;
}