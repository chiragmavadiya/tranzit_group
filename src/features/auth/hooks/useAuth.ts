import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { authService } from "@/features/auth/services/auth.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { ForgotPasswordRequest, LoginRequest, RegisterRequest, OnboardingRequest, ResetPasswordRequest } from "@/features/auth/auth.types";

/**
 * Hook for customer login
 */
export const useLogin = (role: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: useCallback((data: LoginRequest) => authService.login(data, role), [role]),
        onSuccess: (data) => {
            // Save token to localStorage
            if (data?.token) {
                localStorage.setItem("auth_token", JSON.stringify(data.token));
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
 * Hook to submit onboarding data
 */
export const useOnboarding = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: useCallback((data: OnboardingRequest) => authService.submitOnboarding(data), []),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.VERIFICATION_STATUS });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER_DETAILS });
        },
    });
};

/**
 * Hook to verify email with token
 */
export const useVerifyEmail = () => {
    return useMutation({
        mutationFn: useCallback((token: string) => authService.verifyEmail(token), []),
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

// logout api 
export const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: useCallback(() => authService.logout(), []),
        onSuccess: () => {
            // Clear all sensitive data and query cache on logout
            localStorage.clear();
            queryClient.clear();
        },
    });
};

// forgot password api 
export const useForgotPassword = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: useCallback((data: ForgotPasswordRequest) => authService.forgotPassword(data), []),
        onSuccess: () => {
            // Invalidate verification status
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.VERIFICATION_STATUS });
        },
    });
};

// get user details api 
export const useGetUserDetails = (enabled: boolean) => {
    const token = localStorage.getItem("auth_token");
    return useQuery({
        queryKey: QUERY_KEYS.AUTH.USER_DETAILS,
        queryFn: () => authService.getUserDetails(),
        enabled: !!(enabled && token),
        staleTime: Infinity,
    });
};

/**
 * Hook for reset password
 */
export const useResetPassword = () => {
    return useMutation({
        mutationFn: useCallback((data: ResetPasswordRequest) => authService.resetPassword(data), []),
    });
};
