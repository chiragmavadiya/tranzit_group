export type CustomerStatus = 'active' | 'inactive';

export interface Customer {
    id: number | string;
    first_name: string;
    last_name: string;
    email: string;
    personal_mobile: string | null;
    office_number: string | null;
    status: string;
    business_name: string;
    suburb: string;
    state: string;
    created_at: string;
}

export interface Meta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
}

export interface CustomerListResponse {
    status: boolean;
    message: string;
    data: Customer[];
    meta: Meta;
}

export interface CustomerFormData {
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    business_name: string;
    gst_number: string;
    billing_address: string;
    billing_street_name: string;
    billing_street_number: string;
    billing_street_type: string;
    billing_suburb: string;
    billing_state: string;
    billing_postcode: string;
    address: string;
    street_name: string;
    street_number: string;
    street_type: string;
    suburb: string;
    state: string;
    postcode: string;
    direct_freight_active: number;
    direct_freight_markup_charge: number;
    direct_freight_pickup_charge: number;
    auspost_active: number;
    auspost_markup_charge: number;
    auspost_pickup_charge: number;
    pallet_active: number;
    pallet_markup_charge: number;
    pallet_pickup_charge: number;
    topup_enable: boolean;
    order_prefix: string;
}

export interface CustomerDetails {
    id: number | string;
    first_name: string;
    last_name: string;
    join_date: string;
    wallet_balance: number;
    is_verified: boolean;
    address: string;
    total_order: number;
    total_wallet_balance: number;
    total_pickup_charge: number;
    total_credit: number;
    total_debit: number;
    total_margin: number;
}

export interface CustomerDetailsResponse {
    status: boolean;
    message: string;
    data: CustomerDetails;
}

export interface CustomerProfileActivity {
    id: number;
    type: string;
    title: string;
    description: string;
    created_at: string;
}

export interface CustomerProfile {
    about: {
        full_name: string;
        status: string;
        customer: string;
        gst: number | null;
        business_name: string;
        role: string;
    };
    contacts: {
        contact: string;
        email: string;
    };
    pickup_address: {
        address: string;
        post_code: string;
    };
    charges_markups: {
        aus_post: { title: string; markup: number; pickup: number; };
        direct_freight: { title: string; markup: number; pickup: number; };
        pallet: { title: string; markup: number; pickup: number; };
    };
    activity_timeline: CustomerProfileActivity[];
}

export interface CustomerProfileResponse {
    status: boolean;
    message: string;
    data: CustomerProfile;
}

export interface CustomerOrder {
    order_number: string;
    date: string;
    suburb: string;
    amount: number;
    status: string;
    payment_status: string;
    courier: string;
    order_type: string;
    consignment_date: string;
}

export interface CustomerOrdersResponse {
    status: boolean;
    message: string;
    data: CustomerOrder[];
    meta: Meta;
}

export interface CustomerTransaction {
    transaction_id: string;
    amount: number;
    payment_status: string;
    type: string;
    payment_date: string;
}

export interface CustomerTransactionsResponse {
    status: boolean;
    message: string;
    data: CustomerTransaction[];
    meta: Meta;
}

export interface CustomerInvoice {
    invoice_number: string;
    invoice_date: string;
    invoice_due_date: string | null;
    amount: number;
    amount_paid: number;
    balance: number;
    status: string;
}

export interface CustomerInvoicesResponse {
    status: boolean;
    message: string;
    data: CustomerInvoice[];
    summary: {
        total_invoices: number;
        total_paid: number;
        total_unpaid: number;
    };
    meta: Meta;
}

export interface GenericResponse {
    status: boolean;
    message: string;
}

export interface GenericDataResponse<T> extends GenericResponse {
    data: T;
}

export interface CustomerStats {
    total: number;
    active: number;
    inactive: number;
}
