import api from "../../../services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
    RegisterRequest,
    RegisterResponse,
    VerificationStatusResponse,
    GenericResponse,
    LoginRequest,
    LoginResponse
} from "@/features/auth/auth.types";

export const authService = {
    /**
     * Login a customer
     */
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
        return response.data;
    },
    /**
     * Register a new customer
     */
    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const response = await api.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
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
};
