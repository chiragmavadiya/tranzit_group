import { useCallback, useMemo, useState } from 'react';
import {
    AlertCircle,
    Check,
    ChevronDown,
    Copy,
    Download,
    Loader2,
    RefreshCw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { CustomTooltip } from '@/components/common/CustomTooltip';
import { showToast } from '@/components/ui/custom-toast';
import { cn } from '@/lib/utils';
import { useBulkPrintBatchDetail } from '@/features/orders/hooks/useBulkPrint';
import type { BulkPrintBatchListItem } from '@/features/orders/types/bulk-print.types';
import {
    formatBulkPrintDate,
    getBulkPrintProgress,
    getBulkPrintSummary,
    getShortBatchId,
    hasDownloadableLabels,
    isTerminalBulkPrintStatus,
    mapBulkPrintStatus,
} from '@/features/orders/utils/bulk-print.utils';

import { BulkPrintProgressBar } from './BulkPrintProgressBar';
import { BulkPrintStatusBadge } from './BulkPrintStatusBadge';

interface BulkPrintBatchCardProps {
    batch: BulkPrintBatchListItem;
    expanded: boolean;
    onToggleExpanded: (batchId: string) => void;
    onDownload: (batchId: string) => void;
    isDownloading: boolean;
    /** Asks the owner to open the retry confirmation for this batch's failed orders. */
    onRetryFailed: (batchId: string, orderNumbers: string[]) => void;
}

const CountChip = ({ tone, children }: { tone: 'success' | 'danger'; children: React.ReactNode }) => (
    <span
        className={cn(
            'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold',
            tone === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-400'
                : 'border-red-200 bg-red-50 text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400'
        )}
    >
        {children}
    </span>
);

/**
 * One batch in the Print Activity panel. The list endpoint supplies the headline state;
 * the per-order results are only fetched once the customer expands the batch.
 */
export const BulkPrintBatchCard = ({
    batch,
    expanded,
    onToggleExpanded,
    onDownload,
    isDownloading,
    onRetryFailed,
}: BulkPrintBatchCardProps) => {
    const [copied, setCopied] = useState(false);

    const status = mapBulkPrintStatus(batch);
    const isTerminal = isTerminalBulkPrintStatus(status);

    const detailQuery = useBulkPrintBatchDetail(batch.batch, expanded, isTerminal);
    const detail = detailQuery.data;
    const summary = getBulkPrintSummary(batch);
    const progress = getBulkPrintProgress(batch);
    const canDownload = hasDownloadableLabels(batch, detail);
    const panelId = `bulk-print-batch-${batch.batch}`;

    const failedOrderNumbers = useMemo(
        () => (detail?.results ?? []).filter((result) => !result.status).map((result) => result.order_number),
        [detail?.results]
    );
    const successfulResults = useMemo(
        () => (detail?.results ?? []).filter((result) => result.status),
        [detail?.results]
    );
    const failedResults = useMemo(
        () => (detail?.results ?? []).filter((result) => !result.status),
        [detail?.results]
    );

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(batch.batch);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            showToast('Could not copy the batch ID.', 'error');
        }
    }, [batch.batch]);

    const skipped = (detail?.merge_skipped ?? []).map((entry) =>
        typeof entry === 'string' ? entry : entry?.order_number || entry?.message || ''
    ).filter(Boolean);

    return (
        <li className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <h3 className="my-0 truncate text-sm font-bold text-slate-800 dark:text-zinc-100">
                        Bulk Print · {summary.total} {summary.total === 1 ? 'order' : 'orders'}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500 dark:text-zinc-400">
                        <CustomTooltip title={batch.batch}>
                            <span className="font-mono">#{getShortBatchId(batch.batch)}</span>
                        </CustomTooltip>
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={handleCopy}
                            aria-label={`Copy full batch ID ${batch.batch}`}
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
                        >
                            {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                        </Button>
                        <span aria-hidden="true">·</span>
                        <span>{formatBulkPrintDate(batch.created_at)}</span>
                    </div>
                </div>
                <BulkPrintStatusBadge status={status} />
            </div>

            {!isTerminal && (
                <BulkPrintProgressBar
                    className="mt-3"
                    percent={progress.percent}
                    label={progress.label}
                    ariaLabel={`Bulk print batch ${getShortBatchId(batch.batch)} progress`}
                />
            )}

            {isTerminal && (summary.succeeded > 0 || summary.failed > 0) && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {summary.succeeded > 0 && <CountChip tone="success">{summary.succeeded} label(s) created</CountChip>}
                    {summary.failed > 0 && <CountChip tone="danger">{summary.failed} failed</CountChip>}
                </div>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {canDownload && (
                    <Button
                        size="sm"
                        onClick={() => onDownload(batch.batch)}
                        disabled={isDownloading}
                        aria-label={`Download labels for batch ${getShortBatchId(batch.batch)}`}
                    >
                        {isDownloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                        {isDownloading ? 'Preparing…' : 'Download Labels'}
                    </Button>
                )}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleExpanded(batch.batch)}
                    aria-expanded={expanded}
                    aria-controls={panelId}
                >
                    {summary.failed > 0 ? 'View issues' : 'View details'}
                    <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', expanded && 'rotate-180')} />
                </Button>

                {expanded && failedOrderNumbers.length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRetryFailed(batch.batch, failedOrderNumbers)}
                        className="text-slate-600 dark:text-zinc-300"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Retry {failedOrderNumbers.length} failed
                    </Button>
                )}
            </div>

            {expanded && (
                <div id={panelId} className="mt-3 border-t border-gray-100 pt-3 dark:border-zinc-800">
                    {detailQuery.isLoading && (
                        <p className="my-0 flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                            <Spinner className="h-3.5 w-3.5" /> Loading batch results…
                        </p>
                    )}

                    {detailQuery.isError && !detail && (
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="my-0 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                <span className="break-words">
                                    {(detailQuery.error as any)?.message || 'Could not load the results for this batch.'}
                                </span>
                            </p>
                            <Button variant="outline" size="xs" onClick={() => detailQuery.refetch()}>
                                Try again
                            </Button>
                        </div>
                    )}

                    {detail && (
                        <div className="space-y-3">
                            {failedResults.length > 0 && (
                                <div>
                                    <p className="my-0 mb-1 text-[11px] font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
                                        Failed ({failedResults.length})
                                    </p>
                                    <ul className="my-0 list-none space-y-1 p-0">
                                        {failedResults.map((result) => (
                                            <li
                                                key={`failed-${result.order_number}`}
                                                className="rounded-md bg-red-50/60 px-2 py-1.5 text-xs dark:bg-red-950/20"
                                            >
                                                <span className="font-semibold text-slate-800 dark:text-zinc-200">
                                                    {result.order_number}
                                                </span>
                                                <span className="block break-words text-slate-600 dark:text-zinc-400">
                                                    {result.message || 'No reason was returned by the courier.'}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {successfulResults.length > 0 && (
                                <div>
                                    <p className="my-0 mb-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                                        Labels created ({successfulResults.length})
                                    </p>
                                    <ul className="my-0 list-none space-y-1 p-0">
                                        {successfulResults.map((result) => (
                                            <li
                                                key={`ok-${result.order_number}`}
                                                className="flex flex-wrap items-center justify-between gap-1 rounded-md bg-slate-50 px-2 py-1.5 text-xs dark:bg-zinc-900/50"
                                            >
                                                <span className="font-semibold text-slate-800 dark:text-zinc-200">
                                                    {result.order_number}
                                                </span>
                                                {result.tracking_number && (
                                                    <span className="break-all font-mono text-[11px] text-slate-500 dark:text-zinc-400">
                                                        {result.tracking_number}
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {skipped.length > 0 && (
                                <p className="my-0 break-words text-xs text-amber-700 dark:text-amber-400">
                                    {skipped.length} label(s) could not be merged into the PDF: {skipped.join(', ')}
                                </p>
                            )}

                            {!detail.results?.length && (
                                <p className="my-0 text-xs text-slate-500 dark:text-zinc-400">
                                    No per-order results have been recorded for this batch yet.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </li>
    );
};
