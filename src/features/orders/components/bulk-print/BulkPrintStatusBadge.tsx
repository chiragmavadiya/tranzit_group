import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { BulkPrintUiStatus } from '@/features/orders/types/bulk-print.types';
import { BULK_PRINT_STATUS_LABELS, BULK_PRINT_STATUS_STYLES } from '@/features/orders/utils/bulk-print.utils';

/**
 * Status pill for a bulk print batch. The wording always spells the status out, so the
 * colour is only ever a reinforcement.
 */
export const BulkPrintStatusBadge = ({ status, className }: { status: BulkPrintUiStatus; className?: string }) => {
    const style = BULK_PRINT_STATUS_STYLES[status];

    return (
        <Badge
            variant="secondary"
            className={cn(
                'px-2.5 py-0.5 min-h-6 h-auto text-[11px] font-semibold border flex items-center gap-1.5 rounded-full leading-none whitespace-normal',
                style.badge,
                className
            )}
        >
            <span
                aria-hidden="true"
                className={cn('h-1.5 w-1.5 rounded-full shrink-0', style.dot, status === 'processing' && 'animate-pulse')}
            />
            {BULK_PRINT_STATUS_LABELS[status]}
        </Badge>
    );
};
