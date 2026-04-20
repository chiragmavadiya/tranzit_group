export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    image: string;
    accessToken: string;
    refreshToken: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    status: boolean;
    data: User
    message: string;
}

export interface RegisterRequest {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
    password_confirmation: string;
    terms: boolean;
}

export interface RegisterResponse {
    status: boolean;
    data: User
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

export interface GenericResponse {
    status: boolean;
    message: string;
}
