import { AlertTriangle, Info } from 'lucide-react';

import { ConformationModal } from '@/components/common/ConformationModal';
import { cn } from '@/lib/utils';
import type { BulkPrintOrderIssue } from '@/features/orders/types/bulk-print.types';

interface BulkPrintConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Order numbers that will be submitted. */
    eligible: string[];
    /** Selected orders that are excluded, with the reason why. */
    ineligible?: BulkPrintOrderIssue[];
    /** Submitted orders that carry a caveat. */
    warnings?: BulkPrintOrderIssue[];
    /** Selected orders that are not on the current page, so they could not be checked. */
    unverifiedCount?: number;
    loading: boolean;
    onConfirm: () => void;
    title?: string;
    confirmText?: string;
    /** Surfaced inside the dialog so a failed submit is not hidden behind the modal. */
    errorMessage?: string | null;
    /** Extra context about what is being submitted, e.g. the batch a retry came from. */
    details?: React.ReactNode;
}

const MAX_LISTED_ORDERS = 5;

/** Compact "CGG002335, CGG002334 +3 more" summary so a long list cannot overflow. */
const IssueList = ({ issues }: { issues: BulkPrintOrderIssue[] }) => {
    const reasons = new Map<string, string[]>();
    issues.forEach(({ order_number, reason }) => {
        reasons.set(reason, [...(reasons.get(reason) ?? []), order_number]);
    });

    return (
        <span className="block space-y-1">
            {[...reasons.entries()].map(([reason, orderNumbers]) => (
                <span key={reason} className="block text-xs">
                    <span className="font-semibold">{reason}:</span>{' '}
                    <span className="break-words">
                        {orderNumbers.slice(0, MAX_LISTED_ORDERS).join(', ')}
                        {orderNumbers.length > MAX_LISTED_ORDERS && ` +${orderNumbers.length - MAX_LISTED_ORDERS} more`}
                    </span>
                </span>
            ))}
        </span>
    );
};

const Callout = ({
    tone,
    icon: Icon,
    children,
}: {
    tone: 'warning' | 'info';
    icon: typeof Info;
    children: React.ReactNode;
}) => (
    <span
        className={cn(
            'flex gap-2 rounded-md border p-2.5',
            tone === 'warning'
                ? 'border-amber-200 bg-amber-50/70 text-amber-800 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-300'
                : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400'
        )}
    >
        <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="block min-w-0 flex-1">{children}</span>
    </span>
);

/**
 * Confirmation shown before a batch is queued. It states exactly how many orders are
 * going in, names the ones being left out, and warns that the job runs in the background.
 */
export const BulkPrintConfirmDialog = ({
    open,
    onOpenChange,
    eligible,
    ineligible = [],
    warnings = [],
    unverifiedCount = 0,
    loading,
    onConfirm,
    title = 'Start bulk print',
    confirmText = 'Start Bulk Print',
    errorMessage = null,
    details = null,
}: BulkPrintConfirmDialogProps) => (
    <ConformationModal
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        className="sm:max-w-[520px]"
        loading={loading}
        confirmText={confirmText}
        cancelText="Cancel"
        onConfirm={onConfirm}
        description={
            <span className="block space-y-3 pt-1">
                <span className="block text-sm text-slate-600 dark:text-zinc-400">
                    Labels will be prepared for{' '}
                    <strong className="font-bold text-slate-800 dark:text-zinc-200">
                        {eligible.length} {eligible.length === 1 ? 'order' : 'orders'}
                    </strong>
                    .
                </span>

                {details && <span className="block text-sm text-slate-600 dark:text-zinc-400">{details}</span>}

                <span className="block text-sm text-slate-600 dark:text-zinc-400">
                    Printing runs in the background, so you can keep working while it finishes. Large batches may take
                    several minutes — you'll be notified when the labels are ready to download from Print Activity.
                </span>

                {ineligible.length > 0 && (
                    <Callout tone="warning" icon={AlertTriangle}>
                        <span className="block text-xs font-semibold">
                            {ineligible.length} selected {ineligible.length === 1 ? 'order is' : 'orders are'} not ready to
                            print and will be skipped.
                        </span>
                        <IssueList issues={ineligible} />
                    </Callout>
                )}

                {warnings.length > 0 && (
                    <Callout tone="info" icon={Info}>
                        <IssueList issues={warnings} />
                    </Callout>
                )}

                {unverifiedCount > 0 && (
                    <Callout tone="info" icon={Info}>
                        <span className="block text-xs">
                            {unverifiedCount} selected {unverifiedCount === 1 ? 'order is' : 'orders are'} on another page
                            and could not be checked here. They will be submitted and validated by the server.
                        </span>
                    </Callout>
                )}

                {errorMessage && (
                    <span
                        role="alert"
                        className="flex gap-2 rounded-md border border-red-200 bg-red-50/70 p-2.5 text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400"
                    >
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="block min-w-0 flex-1 break-words text-xs">{errorMessage}</span>
                    </span>
                )}
            </span>
        }
    />
);
