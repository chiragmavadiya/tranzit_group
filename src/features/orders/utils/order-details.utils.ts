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
