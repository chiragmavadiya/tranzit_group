export const API_ENDPOINTS = {
    AUTH: {
        ADMIN_LOGIN: "/admin/auth/login",
        CUSTOMER_LOGIN: "/customer/auth/login",
        REGISTER: "/customer/auth/register",
        FORGOT_PASSWORD: "/customer/auth/forgot-password",
        RESEND_VERIFICATION: "/customer/auth/email/resend",
        VERIFICATION_STATUS: "/customer/auth/verification-status",
        VERIFY_EMAIL: "/customer/auth/verify-email",
        ONBOARDING: "/customer/onboarding",
        LOGOUT: "/auth/logout",
        USER_DETAILS: "/auth/me",
    },
    ORDERS: {
        LIST: "/customer/orders",
    },
    DASHBOARD: {
        METRICS: "/dashboard/metrics",
    },
    ITEMS: {
        BASE: "/items",
        EXPORT: "/items/export",
    }
};

export const QUERY_KEYS = {
    AUTH: {
        VERIFICATION_STATUS: ["auth", "verification-status"],
        USER_DETAILS: ["auth", "user-details"],
    },
    ORDERS: {
        LIST: ["orders", "list"],
    },
    DASHBOARD: {
        METRICS: ["dashboard", "metrics"],
    },
    ITEMS: {
        LIST: ["items", "list"],
        DETAILS: (id: number | string) => ["items", "details", id],
    },
};