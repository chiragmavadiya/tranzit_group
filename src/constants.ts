export const DEFAULT_PAGE_SIZE = 25;
export const PAGE_SIZES = [
    { label: "10", value: 10 },
    { label: "25", value: 25 },
    { label: "50", value: 50 },
    { label: "100", value: 100 }
];

export const LOCATION_OPTIONS = [
    {
        value: 'TRU-3029',
        label: '150 Palmers Road, Truganina VIC 3029',
        suburb: 'Truganina',
        state: 'VIC',
        postcode: '3029',
        country: 'Au',
        streetNumber: '150',
        streetName: 'Palmers',
        streetType: 'Road'
    },
    {
        value: 'WEE-3030',
        label: '45 Synnot Street, Werribee VIC 3030',
        suburb: 'Werribee',
        state: 'VIC',
        postcode: '3030',
        country: 'Australia',
        streetNumber: '45',
        streetName: 'Synnot',
        streetType: 'Street'
    },
    {
        value: 'TAR-3029',
        label: '12 Leakes Road, Tarneit VIC 3029',
        suburb: 'Tarneit',
        state: 'VIC',
        postcode: '3029',
        country: 'Australia',
        streetNumber: '12',
        streetName: 'Leakes',
        streetType: 'Road'
    },
    {
        value: 'HOP-3029',
        label: '78 Derrimut Road, Hoppers Crossing VIC 3029',
        suburb: 'Hoppers Crossing',
        state: 'VIC',
        postcode: '3029',
        country: 'Australia',
        streetNumber: '78',
        streetName: 'Derrimut',
        streetType: 'Road'
    },
    {
        value: 'WIL-3027',
        label: '22 Old Geelong Road, Williams Landing VIC 3027',
        suburb: 'Williams Landing',
        state: 'VIC',
        postcode: '3027',
        country: 'Australia',
        streetNumber: '22',
        streetName: 'Old Geelong',
        streetType: 'Road'
    },
    {
        value: 'ALA-3028',
        label: '5 Main Street, Altona Meadows VIC 3028',
        suburb: 'Altona Meadows',
        state: 'VIC',
        postcode: '3028',
        country: 'Australia',
        streetNumber: '5',
        streetName: 'Main',
        streetType: 'Street'
    },
    {
        value: 'POI-3030',
        label: '33 Boardwalk Boulevard, Point Cook VIC 3030',
        suburb: 'Point Cook',
        state: 'VIC',
        postcode: '3030',
        country: 'Australia',
        streetNumber: '33',
        streetName: 'Boardwalk',
        streetType: 'Boulevard'
    },
    {
        value: 'LAV-3028',
        label: '10 Aviation Road, Laverton VIC 3028',
        suburb: 'Laverton',
        state: 'VIC',
        postcode: '3028',
        country: 'Australia',
        streetNumber: '10',
        streetName: 'Aviation',
        streetType: 'Road'
    },
    {
        value: 'SUN-3020',
        label: '90 Hampshire Road, Sunshine VIC 3020',
        suburb: 'Sunshine',
        state: 'VIC',
        postcode: '3020',
        country: 'Australia',
        streetNumber: '90',
        streetName: 'Hampshire',
        streetType: 'Road'
    },
    {
        value: 'FOO-3011',
        label: '18 Ballarat Road, Footscray VIC 3011',
        suburb: 'Footscray',
        state: 'VIC',
        postcode: '3011',
        country: 'Australia',
        streetNumber: '18',
        streetName: 'Ballarat',
        streetType: 'Road'
    }
];

export const LOCATION_OPTIONS1 = [
    {
        value: 'MEL-3000', label: '18 Ballarat Road Melbourne VIC 3000, AU', suburb: 'Melbourne', state: 'VIC', postcode: '3000', country: 'AU', streetNumber: '18',
        streetName: 'Ballarat',
        streetType: 'Road'
    },

    { value: 'TRU-3029', label: 'Truganina VIC 3029, AU', suburb: 'Truganina', state: 'VIC', postcode: '3029', country: 'AU' },

    { value: 'WER-3030', label: 'Werribee VIC 3030, AU', suburb: 'Werribee', state: 'VIC', postcode: '3030', country: 'AU' },

    { value: 'TAR-3029', label: 'Tarneit VIC 3029, AU', suburb: 'Tarneit', state: 'VIC', postcode: '3029', country: 'AU' },

    { value: 'POC-3030', label: 'Point Cook VIC 3030, AU', suburb: 'Point Cook', state: 'VIC', postcode: '3030', country: 'AU' },

    { value: 'LAV-3028', label: 'Laverton VIC 3028, AU', suburb: 'Laverton', state: 'VIC', postcode: '3028', country: 'AU' },

    { value: 'SUN-3020', label: 'Sunshine VIC 3020, AU', suburb: 'Sunshine', state: 'VIC', postcode: '3020', country: 'AU' },

    { value: 'FOO-3011', label: 'Footscray VIC 3011, AU', suburb: 'Footscray', state: 'VIC', postcode: '3011', country: 'AU' },

    { value: 'GEE-3220', label: 'Geelong VIC 3220, AU', suburb: 'Geelong', state: 'VIC', postcode: '3220', country: 'AU' },

    { value: 'BAL-3350', label: 'Ballarat VIC 3350, AU', suburb: 'Ballarat', state: 'VIC', postcode: '3350', country: 'AU' }
]

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

export const TERMS_CONDITIONS_URL = "https://tranzit.digisite.net/terms-conditions"
export const PRIVACY_POLICY_URL = "https://tranzit.digisite.net/privacy-policy"
export const DANGEROUS_GOODS_URL = "https://tranzit.digisite.net/dangerous-goods"

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
    active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    completed: 'bg-primary/10 text-primary',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    draft1: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
}