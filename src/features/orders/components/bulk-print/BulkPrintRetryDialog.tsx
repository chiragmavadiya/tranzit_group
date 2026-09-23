import { useCallback, useRef } from 'react';

import { showToast } from '@/components/ui/custom-toast';
import { useCreateBulkPrintBatch } from '@/features/orders/hooks/useBulkPrint';
import { getShortBatchId } from '@/features/orders/utils/bulk-print.utils';

import { BulkPrintConfirmDialog } from './BulkPrintConfirmDialog';

/** The batch a retry was requested from, plus the orders that failed in it. */
export interface PendingBulkPrintRetry {
    batchId: string;
    orderNumbers: string[];
}

interface BulkPrintRetryDialogProps {
    open: boolean;
    /** Kept by the caller across the drawer close, so the dialog always has its data. */
    retry: PendingBulkPrintRetry;
    onOpenChange: (open: boolean) => void;
    /** Called after a retry batch was queued successfully. */
    onSuccess: () => void;
}

const MAX_LISTED_ORDERS = 5;

/**
 * Confirmation for retrying the failed orders of a batch.
 *
 * It is rendered as a sibling of the activity drawer rather than inside it, and the
 * caller only opens it once the drawer has finished closing — so the two overlays never
 * compete for stacking order.
 */
export const BulkPrintRetryDialog = ({ open, retry, onOpenChange, onSuccess }: BulkPrintRetryDialogProps) => {
    const createBatch = useCreateBulkPrintBatch();
    // Ref guard so a double click cannot queue the same orders twice before `isPending` flips.
    const isSubmitting = useRef(false);

    const { batchId, orderNumbers } = retry;

    const handleConfirm = useCallback(() => {
        if (isSubmitting.current || createBatch.isPending || !orderNumbers.length) return;
        isSubmitting.current = true;

        createBatch.mutate(orderNumbers, {
            onSettled: () => {
                isSubmitting.current = false;
            },
            onSuccess: (response) => {
                if (!response?.data?.batch) {
                    showToast(
                        'Bulk print was accepted but no batch ID was returned.',
                        'warning',
                        'Check Print Activity in a moment to follow its progress.',
                        8000
                    );
                } else {
                    showToast(
                        `Bulk print restarted for ${orderNumbers.length} ${orderNumbers.length === 1 ? 'order' : 'orders'}.`,
                        'success'
                    );
                }
                onSuccess();
            },
            // On failure the dialog stays open with the API message rendered inside it, so
            // the retry can be attempted again without reopening the activity panel.
        });
    }, [createBatch, orderNumbers, onSuccess]);

    const createError = createBatch.error as any;
    const errorMessage = createBatch.isError
        ? createError?.response?.data?.message || createError?.message || 'Could not restart the bulk print.'
        : null;

    return (
        <BulkPrintConfirmDialog
            open={open}
            onOpenChange={(next) => {
                // Never dismiss while the retry request is in flight.
                if (createBatch.isPending) return;
                onOpenChange(next);
            }}
            eligible={orderNumbers}
            loading={createBatch.isPending}
            onConfirm={handleConfirm}
            title="Retry failed orders"
            confirmText="Retry Bulk Print"
            errorMessage={errorMessage}
            details={
                <>
                    These orders failed in batch{' '}
                    <span className="font-mono font-semibold text-slate-800 dark:text-zinc-200">
                        #{getShortBatchId(batchId)}
                    </span>
                    :{' '}
                    <span className="break-words">
                        {orderNumbers.slice(0, MAX_LISTED_ORDERS).join(', ')}
                        {orderNumbers.length > MAX_LISTED_ORDERS && ` +${orderNumbers.length - MAX_LISTED_ORDERS} more`}
                    </span>
                    . They are queued as a new batch — the original batch is left untouched.
                </>
            }
        />
    );
};
