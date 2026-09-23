const currencyFormatter = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD'
})

const numberFormatter = new Intl.NumberFormat('en-AU', {
    maximumFractionDigits: 2
})

export const formatCurrency = (value: number) => currencyFormatter.format(value)

export const formatMeasure = (value: number, unit: string) =>
    `${numberFormatter.format(value)} ${unit}`

export const getInitials = (name: string) =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('')

export const getDisplayCourierName = (courierName?: string) => {
    const rawName = courierName || '';
    if (!rawName) return '';
    if (rawName === 'auspost') return 'Australia Post';
    if (rawName === 'direct-freight') return 'Direct Freight Express';
    if (rawName === 'aramex') return 'Aramex';
    if (rawName === 'couriersplease' || rawName === 'couriers-please') return 'Couriers Please';
    if (rawName === 'startrack' || rawName === 'star-track') return 'StarTrack';
<<<<<<< HEAD
    if (rawName === 'fedex') return 'FedEx';
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
    return rawName
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Only an unpaid order can be restored from the archive — a paid or partially paid
 * order stays archived. Adjust this list if the API reports a different wording.
 */
const RESTORABLE_PAYMENT_STATUSES = ['payment pending', 'pending', 'unpaid'];

export const canRestoreByPaymentStatus = (paymentStatus?: string | null) =>
    RESTORABLE_PAYMENT_STATUSES.includes((paymentStatus || '').trim().toLowerCase());
