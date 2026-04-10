export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "/customer/auth/login",
        REGISTER: "/customer/auth/register",
        RESEND_VERIFICATION: "/customer/auth/email/resend",
        VERIFICATION_STATUS: "/customer/auth/verification-status",
    },
} as const;

export const QUERY_KEYS = {
    AUTH: {
        VERIFICATION_STATUS: ["auth", "verification-status"],
    },
} as const;
