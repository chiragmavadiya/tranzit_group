export const DEFAULT_PAGE_SIZE = 25;
export const PAGE_SIZES = [
    { label: "10", value: 10 },
    { label: "25", value: 25 },
    { label: "50", value: 50 },
    { label: "100", value: 100 }
];

export const STREET_TYPES = [
    { value: 'Alley', label: 'Alley' },
    { value: 'Avenue', label: 'Avenue' },
    { value: 'Boulevard', label: 'Boulevard' },
    { value: 'Byway', label: 'Byway' },
    { value: 'Close', label: 'Close' },
    { value: 'Circuit', label: 'Circuit' },
    { value: 'Crescent', label: 'Crescent' },
    { value: 'Court', label: 'Court' },
    { value: 'Cove', label: 'Cove' },
    { value: 'Drive', label: 'Drive' },
    { value: 'Esplanade', label: 'Esplanade' },
    { value: 'Grove', label: 'Grove' },
    { value: 'Heights', label: 'Heights' },
    { value: 'Highway', label: 'Highway' },
    { value: 'Lane', label: 'Lane' },
    { value: 'Lookout', label: 'Lookout' },
    { value: 'Lower', label: 'Lower' },
    { value: 'Meadow', label: 'Meadow' },
    { value: 'Parade', label: 'Parade' },
    { value: 'Place', label: 'Place' },
    { value: 'Road', label: 'Road' },
    { value: 'Square', label: 'Square' },
    { value: 'Street', label: 'Street' },
    { value: 'Terrace', label: 'Terrace' },
    { value: 'Town', label: 'Town' },
    { value: 'Towers', label: 'Towers' },
    { value: 'Upper', label: 'Upper' },
    { value: 'View', label: 'View' },
    { value: 'Walk', label: 'Walk' },
    { value: 'Way', label: 'Way' }
]

export const STATES = [
    { value: 'ACT', label: 'ACT' },
    { value: 'NSW', label: 'NSW' },
    { value: 'NT', label: 'NT' },
    { value: 'QLD', label: 'QLD' },
    { value: 'SA', label: 'SA' },
    { value: 'TAS', label: 'TAS' },
    { value: 'VIC', label: 'VIC' },
    { value: 'WA', label: 'WA' }
]

export const TERMS_CONDITIONS_URL = "/terms-and-conditions"
export const PRIVACY_POLICY_URL = "/privacy-policy"
export const DANGEROUS_GOODS_URL = "/dangerous-goods"
<<<<<<< HEAD
=======

export const PHONE_REGEX = /^(\+61|0)[2-478](\d{8})$/;
export const PHONE_REGEX_WITH_SPACE = /^(\+61|0)[2-478](\s?\d){8}$/;
// export const PHONE_REGEX_WITH_SPACE = /^(?:(?:0[23478])|(?:\+61[23478]))(?:\s?\d){8}$/;

>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c

export const STATUS_STYLE: Record<string, string> = {
    New: 'bg-primary/10 text-primary border-primary/20',
    Shipped: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    Archived: 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-700',
    'courier not assigned': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    paid: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    printed: 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400',
    'payment pending': 'bg-amber-100 text-amber-600 dark:bg-primary/10 dark:text-primary',
    partial: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    unpaid: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    draft: 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400',
    voided: 'bg-zinc-200 text-zinc-600 line-through dark:bg-zinc-700/40 dark:text-zinc-400',
    active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    completed: 'bg-primary/10 text-primary',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    draft1: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    failed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    processing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',

}

export const ADMIN_ROLES = ['admin', 'Staff', 'Operation Manager', 'It Manager', 'Super Admin'];


export const MODULE_PERMISSIONS: Record<string, string[]> = {
    dashboard: [
        'view_dashboard',
        'dashboard.statistics',
        'dashboard.margin_count',
        'dashboard.orders_count',
        'dashboard.paid_invoices_count',
        'dashboard.unpaid_invoices_count',
        'dashboard.invoices_count',
        'dashboard.topup_count',
        'dashboard.transactions_table',
        'dashboard.pending_invoices_table'
    ],
    customer: [
        'view_customer',
        'customer.view_customer_statistics',
        'customer.view_customer_profile_tab',
        'customer.view_customer_orders_tab',
        'customer.view_customer_integration_tab',
        'customer.view_customer_transaction_tab',
        'customer.view_customer_credit_application_tab',
        'customer.view_customer_invoice_tab',
        'customer.can_verify_customer_account',
        'add_customer',
        'edit_customer',
        'delete_customer',
        'active_customer'
    ],
    order: [
        'view_order',
        'add_order',
        'edit_order',
        'delete_order',
        'active_order',
        'view_cancel_order'
    ],
    subuser: [
        'view_subuser',
        'add_subuser',
        'edit_subuser',
        'delete_subuser',
        'active_subuser'
    ],
    invoice: [
        'view_invoice',
        'invoice.can_send_invoice',
        'invoice.can_download_invoice',
        'invoice.can_print_invoice',
        'invoice.can_add_payment',
        'add_invoice',
        'edit_invoice',
        'delete_invoice',
        'active_invoice'
    ],
    topup: [
        'view_topup',
        'add_topup',
        'edit_topup',
        'delete_topup',
        'active_topup'
    ],
    ratecard: [
        'view_ratecard',
        'add_ratecard',
        'edit_ratecard',
        'delete_ratecard',
        'active_ratecard'
    ],
    profile: [
        'view_profile',
        'add_profile',
        'edit_profile',
        'delete_profile',
        'active_profile'
    ],
    report: [
        'view_report',
        'add_report',
        'edit_report',
        'delete_report',
        'active_report'
    ],
    setting: ['view_setting', 'edit_setting'],
    'Book a Pickup': ['view_book_pickup', 'book_with_direct_freight'],
    'Credit Application': ['view_credit_application', 'edit_status'],
    'Courier Surcharge': [
        'view_surcharge',
        'add_surcharge',
        'edit_surcharge',
        'delete_surcharge'
    ],
    'Courier Base Postcode': [
        'view_courier_base_postcode',
        'add_courier_base_postcode',
        'edit_courier_base_postcode',
        'delete_courier_base_postcode'
    ],
    'Enquiry Management': ['view_enquiry_management'],
    'Admin Activity Log': ['view_activity'],
    'AusPost Order Summary': ['view_auspost_summary'],
    'Un-Delivered Parcel': ['view_undelivered_parcel'],
    'Customer Quote': ['view_customer_quote', 'view_customer_quote_history'],
    'Customer Parcel Report': ['view_customer_parcel_report'],
    'Help Center': [
        'view_help_center',
        'add_help_center',
        'edit_help_center',
        'delete_help_center'
    ]
}

<<<<<<< HEAD
export const DO_NOT_REDIRECT_URLS: string[] = ['/terms-and-conditions', '/privacy-policy', '/dangerous-goods', '/track']

// `/track/:trackingNumber` has to be exempt as well, so match on the prefix. The other
// entries have no sub-paths, so this stays equivalent to an exact match for them.
export const isRedirectExemptPath = (pathname: string): boolean =>
    DO_NOT_REDIRECT_URLS.some((url) => pathname === url || pathname.startsWith(`${url}/`))

// Show the low-balance reminder to customers when their wallet balance drops below this amount.
export const LOW_BALANCE_THRESHOLD = 200

// The couriers print this name on the label, so it has to stay short.
export const SENDER_NAME_MAX_LENGTH = 30
=======
export const DO_NOT_REDIRECT_URLS: string[] = ['/terms-and-conditions', '/privacy-policy', '/dangerous-goods']

// Show the low-balance reminder to customers when their wallet balance drops below this amount.
export const LOW_BALANCE_THRESHOLD = 200
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
