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
    return rawName
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
