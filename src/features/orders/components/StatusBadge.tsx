import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const StatusBadge = ({ status }: { status: string }) => {
    const variants: Record<string, { bg: string; dot: string }> = {
        'Printed': {
            bg: 'bg-slate-50 text-slate-600 border-slate-200/80 dark:bg-zinc-900/40 dark:text-zinc-400 dark:border-zinc-800',
            dot: 'bg-slate-400 dark:bg-zinc-500'
        },
        'Payment pending': {
            bg: 'bg-amber-50/80 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
            dot: 'bg-amber-500'
        },
        'Partial': {
            bg: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30',
            dot: 'bg-orange-500'
        },
        'Unpaid': {
            bg: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30',
            dot: 'bg-red-500'
        },
        'Courier not assign': {
            bg: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30',
            dot: 'bg-red-500'
        },
        'Draft': {
            bg: 'bg-slate-50 text-slate-600 border-slate-200/80 dark:bg-zinc-900/40 dark:text-zinc-400 dark:border-zinc-800',
            dot: 'bg-slate-400 dark:bg-zinc-500'
        },
        'Paid': {
            bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
            dot: 'bg-emerald-500'
        },
    };

    const variant = variants[status] || variants.Draft;

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