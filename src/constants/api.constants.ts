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
    },
    ADDRESS_BOOK: {
        BASE: "/customer/address-book",
        EXPORT: "/customer/address-book/export",
        SEARCH: "/customer/address-book/search",
    },
    REPORTS: {
        SHIPMENT: "/customer/report/shipment",
        SHIPMENT_EXPORT: "/customer/report/shipment/export",
        TRANSACTION: "/customer/report/transection",
        TRANSACTION_EXPORT: "/customer/report/transection/export",
        INVOICE: "/customer/report/invoice",
        PARCELS: "/customer/report/parcels",
        PARCELS_EXPORT: "/customer/report/parcels/Export",
    },
    INVOICES: {
        BASE: "/customer/invoices",
        EXPORT: "/customer/invoices/export",
    },
    ENQUIRIES: {
        BASE: "/customer/enquiries",
    },
    HELP_CENTER: {
        LIST: "/customer/help-center",
        DETAILS: (slug: string) => `/customer/help-center/${slug}`,
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
    ADDRESS_BOOK: {
        LIST: ["address-book", "list"],
        DETAILS: (id: number | string) => ["address-book", "details", id],
    },
    REPORTS: {
        SHIPMENT: ["reports", "shipment"],
        TRANSACTION: ["reports", "transaction"],
        INVOICE: ["reports", "invoice"],
        PARCELS: ["reports", "parcels"],
    },
    INVOICES: {
        LIST: ["invoices", "list"],
        DETAILS: (id: number | string) => ["invoices", "details", id],
    },
    HELP_CENTER: {
        LIST: ["help-center", "list"],
        DETAILS: (slug: string) => ["help-center", "details", slug],
    }
};