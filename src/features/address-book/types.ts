export interface Address {
    id: number;
    code: string;
    contact_person: string;
    business_name: string;
    additional_details: string;
    email: string;
    phone: string;
    special_instructions: string;
    address: string;
    unit_number: string;
    street_number: string;
    street_name: string;
    street_type: string;
    suburb: string;
    state: string;
    postcode: string;
    latitude: string | number;
    longitude: string | number;
    created_at?: string;
    updated_at?: string;
    is_active?: number;
}

export interface AddressFormData {
    id?: number;
    address: string;
    unit_number: string;
    street_number: string;
    street_name: string;
    street_type: string;
    suburb: string;
    state: string;
    postcode: string;
    latitude: number;
    longitude: number;
    code: string;
    contact_person: string;
    business_name: string;
    email: string;
    phone: string;
    additional_details: string;
    special_instructions: string;
}

export interface AddressBookListResponse {
    status: boolean;
    message: string;
    data: Address[];
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
}

export interface AddressBookDetailsResponse {
    status: boolean;
    message: string;
    data: Address;
}

export interface AddressBookFilters {
    search?: string;
    page?: number;
    per_page?: number;
}
