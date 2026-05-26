import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const StatusBadge = ({ status }: { status: string }) => {
    const variants: Record<string, string> = {
        'Printed': 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400',
        'Payment pending': 'bg-amber-100 text-amber-600 dark:bg-primary/20 dark:text-primary/80',
        'Partial': 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
        'Unpaid': 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
        'Courier not assign': 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
        'Draft': 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400',
        'Paid': 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    };
    return (
        <Badge variant="secondary" className={cn("px-2 py-0 h-6 text-[12px] leading-none font-bold border-none", variants[status] || variants.Draft)}>
            {status}
        </Badge>
    );
};