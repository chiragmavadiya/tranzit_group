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
        RESET_PASSWORD: "/customer/auth/reset-password",
    },
    ORDERS: {
        LIST: "/orders",
        CREATE: "/orders",
        DETAILS: (id: string | number) => `/orders/${id}`,
        CANCEL: (id: string | number) => `/customer/orders/${id}/cancel`,
        CONSIGN: (id: string | number) => `/customer/orders/${id}/consign`,
        LABEL_DOWNLOAD: (id: string | number) => `/orders/${id}/label/download`,
        PAYMENT_INFO: (id: string | number) => `/customer/orders/${id}/payment`,
        PAY_WITH_WALLET: (id: string | number) => `/customer/orders/${id}/pay-with-wallet`,
        WALLET_CHECK: "/customer/orders/wallet-check",
        IMPORT: "/orders/import",
        EXPORT: "/orders/export",
        CREATE_OWN_COURIER: "/customer/orders/create-own-courier",
        GET_QUOTE_SERVICES: "/customer/get-quote/services",
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
    ADMIN_INVOICES: {
        BASE: "/admin/customer-invoice-management",
        DETAILS: (id: string | number) => `/admin/customer-invoice-management/${id}`,
        SEND: (id: string | number) => `/admin/customer-invoice-management/${id}/send`,
        DOWNLOAD: (id: string | number) => `/admin/customer-invoice-management/${id}/download`,
        REMIND: (id: string | number) => `/admin/customer-invoice-management/${id}/remind`,
        PAYMENTS: (id: string | number) => `/admin/customer-invoice-management/${id}/payments`,
        PAYMENT_DETAILS: (invoiceId: string | number, paymentId: string | number) => `/admin/customer-invoice-management/${invoiceId}/payments/${paymentId}`,
        ZOHO_SYNC: (id: string | number) => `/admin/customer-invoice-management/${id}/zoho-sync`,
        EXPORT: "/admin/customer-invoice-management/export",
    },
    ENQUIRIES: {
        BASE: "/customer/enquiries",
    },
    HELP_CENTER: {
        LIST: "/customer/help-center",
        DETAILS: (slug: string) => `/customer/help-center/${slug}`,
    },
    ADMIN_CUSTOMERS: {
        BASE: "/admin/customers",
        DETAILS: (id: string | number) => `/admin/customers/${id}`,
        EDIT: (id: string | number) => `/admin/customers/${id}/edit`,
        PROFILE: (id: string | number) => `/admin/customers/${id}/profile`,
        ORDERS: (id: string | number) => `/admin/customers/${id}/orders`,
        TRANSACTION: (id: string | number) => `/admin/customers/${id}/transaction`,
        INVOICE: (id: string | number) => `/admin/customers/${id}/invoice`,
        VERIFY: (id: string | number) => `/admin/customers/${id}/verify`,
        TOGGLE_STATUS: (id: string | number) => `/admin/customers/${id}/toggle-status`,
        ZOHO_SYNC: (id: string | number) => `/admin/customers/${id}/zoho-sync`,
        EXPORT: "/admin/customers/export",
        ORDERS_EXPORT: (id: string | number) => `/admin/customers/${id}/orders/export`,
        TRANSACTION_EXPORT: (id: string | number) => `/admin/customers/${id}/transaction/export`,
        INVOICE_EXPORT: (id: string | number) => `/admin/customers/${id}/invoice/export`,
    },
    ADMIN_ACTIVITIES: {
        BASE: "/admin/activities",
    },
    ADMIN_COURIER_POSTCODES: {
        BASE: "/admin/courier-postcodes",
        DETAILS: (id: string | number) => `/admin/courier-postcodes/${id}`,
        EXPORT: "/admin/courier-postcodes/export",
    },
    ADMIN_QUOTES: {
        BASE: "/admin/quotes",
        DETAILS: (id: string | number) => `/admin/quotes/${id}`,
        SERVICES: "/quotes/services",
        EXPORT: "/admin/quotes/export",
    },
    CUSTOMER_QUOTES: {
        SERVICES: "/customer/get-quote/services",
    },
    ADMIN_COURIER_SURCHARGES: {
        BASE: "/admin/courier-surcharges",
        DETAILS: (id: string | number) => `/admin/courier-surcharges/${id}`,
        GLOBAL_COURIERS: "/admin/courier-surcharges/global-couriers",
        EXPORT: "/admin/courier-surcharges/export",
    },
    ADMIN_CANCEL_ORDERS: {
        BASE: "/admin/cancel-orders",
    },
    ADMIN_REPORTS: {
        PARCELS: "/admin/reports/customer-parcels",
        PARCELS_EXPORT: "/admin/reports/customer-parcels/export",
        AUSPOST_ORDER_SUMMARY: "/admin/reports/auspost-order-summary",
        UNDELIVERED_PARCELS: "/admin/reports/undelivered-parcels",
        UNDELIVERED_PARCELS_EXPORT: "/admin/reports/undelivered-parcels/export",
        DIRECT_FREIGHT_UPLOAD: "/admin/reports/customer-parcels/direct-freight-upload",
        AUSPOST_UPLOAD: "/admin/reports/customer-parcels/auspost-upload",
    },
    ADMIN_HELP_CENTER: {
        BASE: "/admin/help-center/articles",
        DETAILS: (id: string | number) => `/admin/help-center/articles/${id}`,
    },
    ADMIN_SETTINGS: {
        BASE: "/admin/settings",
        DETAILS: (id: string | number) => `/admin/settings/${id}`,
    },
    SEARCH: {
        GLOBAL: "/globalsearch",
    },
    ZOHO: {
        GET_CONFIG: "/admin/zoho",
        SAVE_CONFIG: "/admin/zoho/save",
        GET_REDIRECT_URL: "/admin/zoho/redirect",
    },
    PROFILE: {
        UPDATE: "/profile",
        CHANGE_PASSWORD: "/profile/change-password",
    }
};

export const QUERY_KEYS = {
    AUTH: {
        VERIFICATION_STATUS: ["auth", "verification-status"],
        USER_DETAILS: ["auth", "user-details"],
    },
    ORDERS: {
        LIST: ["orders", "list"],
        DETAILS: (id: string | number) => ["orders", "details", id],
        PAYMENT_INFO: (id: string | number) => ["orders", "payment", id],
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
        AUSPOST_SUMMARY: ["reports", "auspost-summary"],
        UNDELIVERED_PARCELS: ["reports", "undelivered-parcels"],
    },
    ADMIN_HELP_CENTER: {
        LIST: ["admin", "help-center", "list"],
        DETAILS: (id: string | number) => ["admin", "help-center", "details", id],
    },
    INVOICES: {
        LIST: ["invoices", "list"],
        DETAILS: (id: number | string) => ["invoices", "details", id],
    },
    HELP_CENTER: {
        LIST: ["help-center", "list"],
        DETAILS: (slug: string) => ["help-center", "details", slug],
    },
    ADMIN_CUSTOMERS: {
        LIST: ["admin", "customers", "list"],
        DETAILS: (id: string | number) => ["admin", "customers", "details", id],
        PROFILE: (id: string | number) => ["admin", "customers", "profile", id],
        ORDERS: (id: string | number) => ["admin", "customers", "orders", id],
        TRANSACTION: (id: string | number) => ["admin", "customers", "transaction", id],
        INVOICE: (id: string | number) => ["admin", "customers", "invoice", id],
    },
    ADMIN_ACTIVITIES: {
        LIST: ["admin", "activities", "list"],
    },
    ADMIN_COURIER_POSTCODES: {
        LIST: ["admin", "courier-postcodes", "list"],
        DETAILS: (id: string | number) => ["admin", "courier-postcodes", "details", id],
    },
    ADMIN_QUOTES: {
        LIST: ["admin", "quotes", "list"],
        DETAILS: (id: string | number) => ["admin", "quotes", "details", id],
    },
    ADMIN_COURIER_SURCHARGES: {
        GLOBAL_COURIERS: ["admin", "courier-surcharges", "global-couriers"],
    },
    ADMIN_CANCEL_ORDERS: {
        LIST: ["admin", "cancel-orders", "list"],
    },
    ADMIN_SETTINGS: {
        LIST: ["admin", "settings", "list"],
        DETAILS: (slug: string) => ["admin", "settings", "details", slug],
    },
    SEARCH: {
        GLOBAL: (q: string) => ["search", "global", q],
    }
};