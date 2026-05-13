export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot?: {
        model_type: string;
        model_id: number;
        role_id: number;
    };
}

export type Roles = Role;

export interface UserAddress {
    id: number;
    addressable_type: string;
    addressable_id: number;
    address_type: string;
    parent_customer_id: number | null;
    label: string | null;
    address: string;
    suburb: string;
    postcode: string;
    latitude: string | null;
    longitude: string | null;
    unit_number: string;
    street_number: string;
    street_name: string;
    street_type: string;
    state: string;
    created_by: number | null;
    updated_by: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    email_verified_at: string | null;
    office_number: string | null;
    personal_email: string | null;
    personal_mobile: string | null;
    last_login_at: string | null;
    last_login_ip: string | null;
    stripe_customer_id: string | null;
    status: string;
    is_onboarded: boolean;
    created_by: number | null;
    updated_by: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    roles: Role[];
    addresses: UserAddress[];
    // Compatibility & frontend-specific fields
    name?: string;
    gender?: string;
    image?: string;
    accessToken?: string;
    refreshToken?: string;
    business_name?: string;
    company_name?: string;
    mobile?: string;
}


export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    status: boolean;
    user: User
    message: string;
    token: string;
    next_step: string;
}

export interface RegisterRequest {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    terms: boolean;
}

export interface RegisterResponse {
    status: boolean;
    data: User
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ForgotPasswordResponse {
    status: boolean;
    message: string;
    token: string;
}

export interface ResetPasswordRequest {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
}

export interface ResetPasswordResponse {
    status: boolean;
    message: string;
}

export interface VerificationStatusResponse {
    status: boolean;
    message: string;
    data: {
        email_verified: boolean;
        verified_at: string | null;
        is_onboarded: boolean;
        next_step: string;
    };
}

export interface OnboardingRequest {
    first_name: string;
    last_name: string;
    mobile: string;
    business_name: string;
    gst_number: string;
    address: string;
    latitude?: number;
    longitude?: number;
    unit_number: string;
    street_number: string;
    street_name: string;
    street_type: string;
    suburb: string;
    state: string;
    postcode: string;
    hasBillingAddress: boolean;
    billing_address?: string;
    billing_latitude?: number;
    billing_longitude?: number;
    billing_unit_number?: string;
    billing_street_number?: string;
    billing_street_name?: string;
    billing_street_type?: string;
    billing_suburb?: string;
    billing_state?: string;
    billing_postcode?: string;
}

export interface GenericResponse {
    status: boolean;
    message: string;
}
