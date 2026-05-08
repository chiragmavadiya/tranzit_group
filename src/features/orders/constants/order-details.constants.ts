export const STATUS_TONE_MAP: Record<string, string> = {
    'ready for dispatch': 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20',
    delivered: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20',
    cancelled: 'bg-rose-500/10 text-rose-700 ring-rose-500/20',
    pending: 'bg-amber-500/10 text-amber-700 ring-amber-500/20'
}

export const PAYMENT_TONE_MAP: Record<string, string> = {
    paid: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20',
    'partially paid': 'bg-amber-500/10 text-amber-700 ring-amber-500/20',
    unpaid: 'bg-rose-500/10 text-rose-700 ring-rose-500/20'
}
