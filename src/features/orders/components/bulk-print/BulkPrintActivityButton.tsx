import { useCallback, useEffect, useRef, useState } from 'react';
import { Printer } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useBulkPrintActivity } from '@/features/orders/hooks/useBulkPrint';

import { BulkPrintActivityDrawer } from './BulkPrintActivityDrawer';
import { BulkPrintRetryDialog, type PendingBulkPrintRetry } from './BulkPrintRetryDialog';

/**
 * Safety net for opening the retry dialog, in case the drawer's exit-complete callback
 * never arrives (an interrupted animation, or reduced-motion settings). Roughly matches
 * how long the drawer's spring transition takes to settle.
 */
const DRAWER_EXIT_FALLBACK_MS = 450;

/**
 * Compact entry point to the Print Activity panel, with a badge counting the batches
 * that are still queued or processing.
 *
 * The batch query lives here rather than in the drawer, so batches keep being tracked —
 * and completion notifications keep firing — while the panel is closed. This component
 * also sequences the drawer and the retry confirmation: both are portalled overlays, so
 * the drawer is closed first and the dialog only opens once its exit animation is done.
 */
export const BulkPrintActivityButton = ({ enabled = true }: { enabled?: boolean }) => {
    const [open, setOpen] = useState(false);
    const [pendingRetry, setPendingRetry] = useState<PendingBulkPrintRetry | null>(null);
    const [retryDialogOpen, setRetryDialogOpen] = useState(false);
    const activity = useBulkPrintActivity(enabled);

    const openDialogTimer = useRef<number | null>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const clearOpenDialogTimer = useCallback(() => {
        if (openDialogTimer.current !== null) {
            window.clearTimeout(openDialogTimer.current);
            openDialogTimer.current = null;
        }
    }, []);

    useEffect(() => clearOpenDialogTimer, [clearOpenDialogTimer]);

    // Step 1: remember what to retry, then start closing the drawer. The retry data lives
    // here rather than in the drawer, so closing the panel cannot discard it.
    const handleRetryRequested = useCallback(
        (batchId: string, orderNumbers: string[]) => {
            if (!orderNumbers.length) return;
            setPendingRetry({ batchId, orderNumbers });
            setOpen(false);
            clearOpenDialogTimer();
            openDialogTimer.current = window.setTimeout(() => {
                openDialogTimer.current = null;
                setRetryDialogOpen(true);
            }, DRAWER_EXIT_FALLBACK_MS);
        },
        [clearOpenDialogTimer]
    );

    // Step 2: the drawer has finished animating out, so the dialog can take the screen.
    const handleDrawerCloseComplete = useCallback(() => {
        if (!pendingRetry) return;
        clearOpenDialogTimer();
        setRetryDialogOpen(true);
    }, [pendingRetry, clearOpenDialogTimer]);

    const closeRetryDialog = useCallback(() => {
        clearOpenDialogTimer();
        setRetryDialogOpen(false);
        setPendingRetry(null);
    }, [clearOpenDialogTimer]);

    // Cancelling only dismisses the dialog. The drawer stays closed, so focus is handed
    // back to this button rather than being dropped on the document body.
    const handleCancelRetry = useCallback(() => {
        closeRetryDialog();
        triggerRef.current?.focus();
    }, [closeRetryDialog]);

    // A queued retry returns the customer to the activity panel, where the new batch shows up.
    const handleRetrySuccess = useCallback(() => {
        closeRetryDialog();
        setOpen(true);
    }, [closeRetryDialog]);

    if (!enabled) return null;

    const { activeCount } = activity;

    return (
        <>
            <Button
                ref={triggerRef}
                variant="outline"
                className="h-8 shrink-0 gap-1.5 border-gray-200 px-2.5 font-medium text-slate-700 transition-colors hover:bg-gray-50 sm:gap-2 sm:px-3 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                onClick={() => setOpen(true)}
                aria-label={
                    activeCount > 0
                        ? `Print Activity, ${activeCount} ${activeCount === 1 ? 'batch' : 'batches'} in progress`
                        : 'Print Activity'
                }
            >
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Print Activity</span>
                {activeCount > 0 && (
                    <span
                        aria-hidden="true"
                        className={cn(
                            'inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white'
                        )}
                    >
                        {activeCount}
                    </span>
                )}
            </Button>

            <BulkPrintActivityDrawer
                open={open}
                onClose={() => setOpen(false)}
                onCloseComplete={handleDrawerCloseComplete}
                activity={activity}
                onRetryFailed={handleRetryRequested}
            />

            {pendingRetry && (
                <BulkPrintRetryDialog
                    open={retryDialogOpen}
                    retry={pendingRetry}
                    onOpenChange={(next) => !next && handleCancelRetry()}
                    onSuccess={handleRetrySuccess}
                />
            )}
        </>
    );
};
