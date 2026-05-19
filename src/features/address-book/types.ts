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
    latitude: string;
    longitude: string;
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
    latitude: string;
    longitude: string;
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

// {
//     "status": true,
//     "message": "Addresses loaded",
//     "data": [
//         {
//             "label": "Chirag-Mavadiya-Transite-Transite-chiragmavadiya38@gmail.com",
//             "value": "Chirag-Mavadiya-Transite-Transite-chiragmavadiya38@gmail.com",
//             "data": {
//                 "receiver_name": "Chirag Mavadiya",
//                 "receiver_business_name": "Transite",
//                 "receiver_phone": "08160704401",
//                 "receiver_email": "chiragmavadiya38@gmail.com",
//                 "receiver_address": "90 Hampshire Road, Sunshine VIC 3020",
//                 "street_name": "Hampshire",
//                 "street_number": "90",
//                 "street_type": "",
//                 "suburb": "Sunshine",
//                 "state": "VIC",
//                 "postcode": "3020",
//                 "latitude": "",
//                 "longitude": ""
//             }
//         }
//     ]
// }
export interface SearchAddressBookListResponse {
    status: boolean;
    message: string;
    data: {
        label: string;
        value: string;
        data: {
            receiver_name: string;
            receiver_business_name: string;
            receiver_phone: string;
            receiver_email: string;
            receiver_address: string;
            street_name: string;
            street_number: string;
            street_type: string;
            suburb: string;
            state: string;
            postcode: string;
            latitude: string;
            longitude: string;
        };
    }[];
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
