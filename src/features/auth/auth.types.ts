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

// {
//   "status": true,
// data: {
//   "id": 1,
//   "username": "emilys",
//   "email": "emily.johnson@x.dummyjson.com",
//   "firstName": "Emily",
//   "lastName": "Johnson",
//   "gender": "female",
//   "image": "https://dummyjson.com/icon/emilys/128",
//   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // JWT accessToken (for backward compatibility) in response and cookies
//   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // refreshToken in response and cookies
// }
// } // login response

export interface LoginResponse {
    status: boolean;
    data: User
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
