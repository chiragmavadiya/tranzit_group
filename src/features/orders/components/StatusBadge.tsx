import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const StatusBadge = ({ status }: { status: string }) => {
    const variants: Record<string, { bg: string; dot: string }> = {
        'printed': {
            // bg: 'bg-slate-50 text-slate-600 border-slate-200/80 dark:bg-zinc-900/40 dark:text-zinc-400 dark:border-zinc-800',
            // dot: 'bg-slate-400 dark:bg-zinc-500'
            bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
            dot: 'bg-emerald-500'
        },
        'payment pending': {
            bg: 'bg-amber-50/80 text-amber-500 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
            dot: 'bg-amber-500'
        },
        'partial': {
            bg: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30',
            dot: 'bg-orange-500'
        },
        'unpaid': {
            bg: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30',
            dot: 'bg-red-500'
        },
        'courier not assign': {
            bg: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30',
            dot: 'bg-red-500'
        },
        'draft': {
            bg: 'bg-slate-50 text-slate-600 border-slate-200/80 dark:bg-zinc-900/40 dark:text-zinc-400 dark:border-zinc-800',
            dot: 'bg-slate-400 dark:bg-zinc-500'
        },
        'paid': {
            bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
            dot: 'bg-emerald-500'
        },
        'cancelled': {
            bg: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30',
            dot: 'bg-red-500'
        },
        'order placed / information received': {
            bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30',
            dot: 'bg-blue-500'
        },
        'information received': {
            bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30',
            dot: 'bg-blue-500'
        },
        'order placed': {
            bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30',
            dot: 'bg-blue-500'
        },
        'picked up': {
            bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30',
            dot: 'bg-indigo-500'
        },
        'in transit': {
            bg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30',
            dot: 'bg-purple-500'
        },
        'transit': {
            bg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30',
            dot: 'bg-purple-500'
        },
        'out for delivery': {
            bg: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/20 dark:text-cyan-400 dark:border-cyan-900/30',
            dot: 'bg-cyan-500'
        },
        'delivered': {
            bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
            dot: 'bg-emerald-500'
        },
        'delivery attempt failed': {
            bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30',
            dot: 'bg-rose-500'
        },
        'exception / delayed': {
            bg: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30',
            dot: 'bg-red-500'
        },
        'delayed': {
            bg: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30',
            dot: 'bg-red-500'
        },
        'exception': {
            bg: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30',
            dot: 'bg-red-500'
        },
    };
    if (!status) return '-';
    const variant = variants[status.toLowerCase()] || variants.draft;

    return (
        <Badge
            variant="secondary"
            className={cn(
                "px-2.5 py-0.5 h-6 text-[11px] font-semibold border flex items-center gap-1.5 rounded-full transition-all duration-200 hover:opacity-90 leading-none whitespace-nowrap",
                variant.bg
            )}
        >
            <span className={cn("w-1.5 h-1.5 rounded-full shrink-0 animate-pulse", variant.dot)} />
            <span className="capitalize">{status}</span>
        </Badge>
    );
};