import { format, isValid, parse } from 'date-fns';
import type { Order } from '@/features/orders/types';
import type {
    BulkPrintBatchDetail,
    BulkPrintBatchListItem,
    BulkPrintOrderIssue,
    BulkPrintSelectionCheck,
    BulkPrintSummary,
    BulkPrintUiStatus,
} from '@/features/orders/types/bulk-print.types';

/**
 * The API has only been observed returning `completed`, and it returns it even when
 * every order in the batch failed. Queued/processing wording is therefore matched
 * defensively against the usual Laravel queue vocabulary, and whenever a status is
 * not recognised the summary counts decide the UI state instead.
 */
const QUEUED_STATUSES = ['queued', 'pending', 'waiting', 'created', 'new', 'accepted', 'scheduled'];
const PROCESSING_STATUSES = ['processing', 'in_progress', 'running', 'started', 'working', 'executing'];
const FAILED_STATUSES = ['failed', 'error', 'errored', 'cancelled', 'canceled', 'aborted'];
const FINISHED_STATUSES = [
    'completed', 'complete', 'completed_with_errors', 'finished', 'done', 'processed',
    'partial', 'partially_completed', 'partially_complete',
];

const normalizeStatus = (status?: string | null) =>
    (status || '').trim().toLowerCase().replace(/[\s-]+/g, '_');

/** Safely reads the summary block, which older batches may not carry. */
export const getBulkPrintSummary = (batch?: Pick<BulkPrintBatchListItem, 'summary'> | null): BulkPrintSummary => ({
    total: Number(batch?.summary?.total ?? 0),
    processed: Number(batch?.summary?.processed ?? 0),
    succeeded: Number(batch?.summary?.succeeded ?? 0),
    failed: Number(batch?.summary?.failed ?? 0),
});

/**
 * A finished batch is only "Completed" when nothing failed. The backend reports
 * `completed` for mixed and fully failed batches too, so the counts refine it.
 */
const refineFinishedStatus = (summary: BulkPrintSummary): BulkPrintUiStatus => {
    if (summary.failed > 0 && summary.succeeded > 0) return 'partial';
    if (summary.failed > 0 && summary.succeeded === 0) return 'failed';
    return 'completed';
};

/** Maps a backend batch onto the five states the UI knows how to render. */
export const mapBulkPrintStatus = (batch?: Pick<BulkPrintBatchListItem, 'status' | 'summary'> | null): BulkPrintUiStatus => {
    const raw = normalizeStatus(batch?.status);
    const summary = getBulkPrintSummary(batch);

    if (QUEUED_STATUSES.includes(raw)) return 'queued';
    if (PROCESSING_STATUSES.includes(raw)) return 'processing';
    if (FAILED_STATUSES.includes(raw)) return 'failed';
    if (FINISHED_STATUSES.includes(raw)) return refineFinishedStatus(summary);

    // Unknown wording: fall back to what the counts say rather than guessing.
    if (summary.total > 0 && summary.processed >= summary.total) return refineFinishedStatus(summary);
    if (summary.processed > 0) return 'processing';
    return 'queued';
};

export const isTerminalBulkPrintStatus = (status: BulkPrintUiStatus) =>
    status === 'completed' || status === 'partial' || status === 'failed';

export const isActiveBulkPrintBatch = (batch: BulkPrintBatchListItem) =>
    !isTerminalBulkPrintStatus(mapBulkPrintStatus(batch));

export const BULK_PRINT_STATUS_LABELS: Record<BulkPrintUiStatus, string> = {
    queued: 'Queued',
    processing: 'Processing',
    completed: 'Completed',
    partial: 'Partially completed',
    failed: 'Failed',
};

/**
 * Badge styling per UI status. The label always carries the meaning in words so the
 * state is never communicated by colour alone.
 */
export const BULK_PRINT_STATUS_STYLES: Record<BulkPrintUiStatus, { badge: string; dot: string }> = {
    queued: {
        badge: 'bg-slate-50 text-slate-600 border-slate-200/80 dark:bg-zinc-900/40 dark:text-zinc-400 dark:border-zinc-800',
        dot: 'bg-slate-400 dark:bg-zinc-500',
    },
    processing: {
        badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30',
        dot: 'bg-blue-500',
    },
    completed: {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
        dot: 'bg-emerald-500',
    },
    partial: {
        badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
        dot: 'bg-amber-500',
    },
    failed: {
        badge: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30',
        dot: 'bg-red-500',
    },
};

export interface BulkPrintProgress {
    processed: number;
    total: number;
    /** Null while the batch has no usable total, which is when the bar goes indeterminate. */
    percent: number | null;
    label: string;
}

/**
 * Progress comes straight from `summary.processed` / `summary.total`. When the API
 * gives no usable total the caller renders an indeterminate bar rather than a
 * made up percentage.
 */
export const getBulkPrintProgress = (batch?: Pick<BulkPrintBatchListItem, 'status' | 'summary'> | null): BulkPrintProgress => {
    const { processed, total } = getBulkPrintSummary(batch);
    if (!total || total <= 0) {
        return { processed, total: 0, percent: null, label: 'Preparing labels…' };
    }
    const bounded = Math.min(Math.max(processed, 0), total);
    return {
        processed: bounded,
        total,
        percent: Math.round((bounded / total) * 100),
        label: `${bounded} of ${total} processed`,
    };
};

/**
 * The list endpoint has no "labels ready" flag, so a finished batch with at least one
 * successful order is treated as downloadable; the detail endpoint's `merged_pdf_ready`
 * is authoritative and wins whenever it has been loaded.
 */
export const hasDownloadableLabels = (
    batch: BulkPrintBatchListItem,
    detail?: BulkPrintBatchDetail | null
): boolean => {
    if (!isTerminalBulkPrintStatus(mapBulkPrintStatus(batch))) return false;
    if (detail && typeof detail.merged_pdf_ready === 'boolean') return detail.merged_pdf_ready;
    return getBulkPrintSummary(batch).succeeded > 0;
};

/** `fbd3054d-7836-…` is unreadable in a narrow panel, so only the first block is shown. */
export const getShortBatchId = (batchId: string) => (batchId || '').split('-')[0] || batchId || '';

/** The API formats timestamps as `dd/MM/yy HH:mm`; ISO strings are accepted as a fallback. */
export const formatBulkPrintDate = (value?: string | null): string => {
    if (!value) return '-';
    const parsed = parse(value, 'dd/MM/yy HH:mm', new Date());
    if (isValid(parsed)) return format(parsed, 'dd MMM yyyy, HH:mm');
    const fallback = new Date(value);
    if (isValid(fallback)) return format(fallback, 'dd MMM yyyy, HH:mm');
    return value;
};

/** Active batches float to the top; everything else keeps the API's newest-first order. */
export const sortBulkPrintBatches = <T extends BulkPrintBatchListItem>(batches: T[]): T[] =>
    [...batches].sort((a, b) => Number(isActiveBulkPrintBatch(b)) - Number(isActiveBulkPrintBatch(a)));

const hasCourier = (order: Order) => {
    const courier = (order.courier || '').trim().toLowerCase();
    return Boolean(courier) && courier !== 'unknown';
};

/**
 * Applies the same rules the single-order Print button uses: an order needs a courier
 * before a label can be created, an order the API cannot consign yet is flagged, and
 * own-courier orders are billed on the customer's own carrier account.
 *
 * Selected orders that are not on the current page cannot be checked locally. They are
 * still submitted — the backend validates every order number and reports the outcome
 * per order — but they are counted so the confirmation dialog can say so.
 */
export const checkBulkPrintSelection = (
    selectedOrderNumbers: string[],
    orders: Order[] = []
): BulkPrintSelectionCheck => {
    const ordersByNumber = new Map(orders.map((order) => [String(order.order_number), order]));
    const eligible: string[] = [];
    const ineligible: BulkPrintOrderIssue[] = [];
    const warnings: BulkPrintOrderIssue[] = [];
    const seen = new Set<string>();
    let unverifiedCount = 0;

    selectedOrderNumbers.forEach((value) => {
        const orderNumber = String(value);
        // The same order must never be queued twice inside one batch.
        if (seen.has(orderNumber)) return;
        seen.add(orderNumber);

        const order = ordersByNumber.get(orderNumber);
        if (!order) {
            unverifiedCount += 1;
            eligible.push(orderNumber);
            return;
        }

        if (!hasCourier(order)) {
            ineligible.push({ order_number: orderNumber, reason: 'No courier assigned' });
            return;
        }

        if (order.can_consign === false) {
            warnings.push({ order_number: orderNumber, reason: 'Label may need support review before it can be created' });
        } else if (order.is_own_courier) {
            warnings.push({ order_number: orderNumber, reason: 'Billed to your own carrier account' });
        }

        eligible.push(orderNumber);
    });

    return { eligible, ineligible, warnings, unverifiedCount };
};
