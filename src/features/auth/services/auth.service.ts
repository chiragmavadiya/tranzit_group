import api from "../../../services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
    RegisterRequest,
    RegisterResponse,
    VerificationStatusResponse,
    GenericResponse,
    LoginRequest,
    LoginResponse,
    ForgotPasswordRequest,
    OnboardingRequest
} from "@/features/auth/auth.types";
// role can be admin or customer 

export const authService = {
    /**
     * Login a customer
     */
    login: async (data: LoginRequest, role: string): Promise<LoginResponse> => {
        const endpoint = role === 'admin'
            ? API_ENDPOINTS.AUTH.ADMIN_LOGIN
            : API_ENDPOINTS.AUTH.CUSTOMER_LOGIN;
        const response = await api.post<LoginResponse>(endpoint, data);
        return response.data;
    },
    /**
     * Register a new customer
     */
    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const response = await api.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
        return response.data;
    },

    // forgot password services
    forgotPassword: async (data: ForgotPasswordRequest): Promise<GenericResponse> => {
        const response = await api.post<GenericResponse>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
        return response.data;
    },


    /**
     * Resend verification email
     */
    resendVerification: async (): Promise<GenericResponse> => {
        const response = await api.post<GenericResponse>(API_ENDPOINTS.AUTH.RESEND_VERIFICATION);
        return response.data;
    },

    /**
     * Get verification status
     */
    getVerificationStatus: async (): Promise<VerificationStatusResponse> => {
        const response = await api.get<VerificationStatusResponse>(API_ENDPOINTS.AUTH.VERIFICATION_STATUS);
        return response.data;
    },

    /**
     * Verify email with token
     */
    verifyEmail: async (token: string): Promise<GenericResponse> => {
        const response = await api.post<GenericResponse>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
        return response.data;
    },

    /**
     * Submit onboarding data
     */
    submitOnboarding: async (data: OnboardingRequest): Promise<GenericResponse> => {
        const response = await api.put<GenericResponse>(API_ENDPOINTS.AUTH.ONBOARDING, data);
        return response.data;
    },

    /**
     * Logout a customer
     */
    logout: async (): Promise<GenericResponse> => {
        const response = await api.post<GenericResponse>(API_ENDPOINTS.AUTH.LOGOUT);
        return response.data;
    },

    // get user details api
    getUserDetails: async (): Promise<LoginResponse> => {
        const response = await api.get<LoginResponse>(API_ENDPOINTS.AUTH.USER_DETAILS);
        return response.data;
    },
};
