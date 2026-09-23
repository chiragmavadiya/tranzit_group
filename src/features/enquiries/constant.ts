import type { EnquiryStatus } from "./types";

export const ENQUIRY_STATUS_CONFIG: Record<EnquiryStatus, { label: string; className: string }> = {
    pending: {
        label: 'Pending',
        className: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border-orange-100 dark:border-orange-500/20'
    },
    resolved: {
        label: 'Resolved',
        className: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20'
    },
    closed: {
        label: 'Closed',
        className: 'bg-slate-50 text-slate-600 dark:bg-zinc-500/10 dark:text-zinc-400 border-slate-100 dark:border-zinc-500/20'
    }
};