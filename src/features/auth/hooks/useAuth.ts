import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { authService } from "@/features/auth/services/auth.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { LoginRequest, RegisterRequest } from "@/features/auth/auth.types";

/**
 * Hook for customer login
 */
export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: useCallback((data: LoginRequest) => authService.login(data), []),
        onSuccess: (data) => {
            console.log('on Success')
            // Save token to localStorage
            if (data?.data?.accessToken) {
                console.log(data.data, ' data.data')
                localStorage.setItem("auth_token", JSON.stringify(data.data));
            }
            // redirect to order page
            // window.location.href = "/orders";
            // Invalidate verification status
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.VERIFICATION_STATUS });
            // 🔥 IMPORTANT: manually throw error
            // if (!data.status) {
            //     throw new Error(data.message || "Login failed");
            // }
        },
    });
};


/**
 * Hook for customer registration
 */
export const useRegister = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: useCallback((data: RegisterRequest) => authService.register(data), []),
        onSuccess: (data) => {
            // Save token to localStorage
            if (data?.data?.accessToken) {
                localStorage.setItem("auth_token", data.data.accessToken);
            }
            // Invalidate verification status
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.VERIFICATION_STATUS });
        },
    });
};

/**
 * Hook to resend verification email
 */
export const useResendVerification = () => {
    return useMutation({
        mutationFn: useCallback(() => authService.resendVerification(), []),
    });
};

/**
 * Hook to get customer verification status
 */
export const useVerificationStatus = () => {
    return useQuery({
        queryKey: QUERY_KEYS.AUTH.VERIFICATION_STATUS,
        queryFn: useCallback(() => authService.getVerificationStatus(), []),
    });
};
