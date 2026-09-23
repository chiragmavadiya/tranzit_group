import { useCallback, useState } from 'react';
import { AlertCircle, Loader2, Printer, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/drawer';
import { Skeleton } from '@/components/ui/skeleton';
import { useDownloadBulkPrintLabels, type useBulkPrintActivity } from '@/features/orders/hooks/useBulkPrint';
import { isActiveBulkPrintBatch } from '@/features/orders/utils/bulk-print.utils';

import { BulkPrintBatchCard } from './BulkPrintBatchCard';

interface BulkPrintActivityDrawerProps {
    open: boolean;
    onClose: () => void;
    /** Fires once the close animation has finished and the panel has left the DOM. */
    onCloseComplete?: () => void;
    activity: ReturnType<typeof useBulkPrintActivity>;
    /**
     * Asks the owner to run a retry for the failed orders of a batch. The confirmation
     * lives outside this drawer, so the owner closes the panel before showing it.
     */
    onRetryFailed: (batchId: string, orderNumbers: string[]) => void;
}

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
    <h3 className="my-0 mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-zinc-500">
        {children}
    </h3>
);

/**
 * Side panel listing every bulk print batch: the ones still running first, then the
 * recent history. Batch data always comes from the API, so the panel shows the same
 * thing after a refresh or in a second tab.
 */
export const BulkPrintActivityDrawer = ({
    open,
    onClose,
    onCloseComplete,
    activity,
    onRetryFailed,
}: BulkPrintActivityDrawerProps) => {
    const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null);

    const { download, isDownloading } = useDownloadBulkPrintLabels();

    const { batches, isLoading, isError, error, refetch, isRefetching, hasNextPage, fetchNextPage, isFetchingNextPage } =
        activity;

    const activeBatches = batches.filter(isActiveBulkPrintBatch);
    const historyBatches = batches.filter((batch) => !isActiveBulkPrintBatch(batch));

    const handleToggleExpanded = useCallback((batchId: string) => {
        setExpandedBatchId((current) => (current === batchId ? null : batchId));
    }, []);

    return (
        <Drawer
            open={open}
            onClose={onClose}
            onCloseComplete={onCloseComplete}
            className="w-full max-w-full sm:max-w-[480px] lg:max-w-[520px]"
            title="Print Activity"
            description="Bulk label batches prepared in the background."
        >
            <div className="space-y-4 px-4 py-4 sm:px-6">
                {isError && (
                    <div className="flex flex-wrap items-center gap-2 rounded-md border border-red-200 bg-red-50/60 p-3 dark:border-red-900/30 dark:bg-red-950/20">
                        <p className="my-0 flex min-w-0 flex-1 items-start gap-1.5 text-xs text-red-600 dark:text-red-400">
                            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            <span className="break-words">
                                {batches.length
                                    ? "Couldn't refresh the batch list. Showing the last known state."
                                    : (error as any)?.message || 'Could not load your bulk print batches.'}
                            </span>
                        </p>
                        <Button variant="outline" size="xs" onClick={() => refetch()} disabled={isRefetching}>
                            {isRefetching ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                            Retry
                        </Button>
                    </div>
                )}

                {isLoading && (
                    <div className="space-y-3" aria-live="polite" aria-busy="true">
                        <span className="sr-only">Loading bulk print batches</span>
                        {[0, 1, 2].map((key) => (
                            <Skeleton key={key} className="h-28 w-full rounded-lg" />
                        ))}
                    </div>
                )}

                {!isLoading && !batches.length && !isError && (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 py-12 text-center dark:border-zinc-800">
                        <Printer className="h-7 w-7 text-slate-300 dark:text-zinc-700" aria-hidden="true" />
                        <p className="my-0 text-sm font-semibold text-slate-700 dark:text-zinc-300">No print batches yet</p>
                        <p className="my-0 max-w-[280px] text-xs text-slate-500 dark:text-zinc-400">
                            Select orders in the table and choose Bulk Print to prepare labels in the background.
                        </p>
                    </div>
                )}

                {activeBatches.length > 0 && (
                    <section aria-label="Batches in progress">
                        <SectionHeading>In progress ({activeBatches.length})</SectionHeading>
                        <ul className="my-0 list-none space-y-2 p-0">
                            {activeBatches.map((batch) => (
                                <BulkPrintBatchCard
                                    key={batch.batch}
                                    batch={batch}
                                    expanded={expandedBatchId === batch.batch}
                                    onToggleExpanded={handleToggleExpanded}
                                    onDownload={download}
                                    isDownloading={isDownloading(batch.batch)}
                                    onRetryFailed={onRetryFailed}
                                />
                            ))}
                        </ul>
                    </section>
                )}

                {historyBatches.length > 0 && (
                    <section aria-label="Recent batches">
                        <SectionHeading>Recent</SectionHeading>
                        <ul className="my-0 list-none space-y-2 p-0">
                            {historyBatches.map((batch) => (
                                <BulkPrintBatchCard
                                    key={batch.batch}
                                    batch={batch}
                                    expanded={expandedBatchId === batch.batch}
                                    onToggleExpanded={handleToggleExpanded}
                                    onDownload={download}
                                    isDownloading={isDownloading(batch.batch)}
                                    onRetryFailed={onRetryFailed}
                                />
                            ))}
                        </ul>
                    </section>
                )}

                {hasNextPage && (
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                    >
                        {isFetchingNextPage && <Loader2 className="h-4 w-4 animate-spin" />}
                        Load more
                    </Button>
                )}
            </div>
        </Drawer>
    );
};
