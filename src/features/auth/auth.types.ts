export interface User {
    id: number;
    name: string;
    email: string;
    first_name: string;
    last_name: string;
    gender: string;
    image: string;
    accessToken: string;
    refreshToken: string;
    roles: Roles[];
    business_name?: string;
    mobile?: string;
    personal_email?: string;
    personal_mobile?: string;
}

export interface Roles {
    id: number;
    name: string;
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
