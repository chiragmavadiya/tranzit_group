import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
    type InfiniteData,
} from '@tanstack/react-query';
import { format } from 'date-fns';

import { QUERY_KEYS } from '@/constants/api.constants';
import { showToast } from '@/components/ui/custom-toast';
import { downloadFile } from '@/lib/utils';
import { bulkPrintService } from '@/features/orders/services/bulk-print.api';
import type {
    BulkPrintBatchListItem,
    BulkPrintBatchListResponse,
    BulkPrintUiStatus,
} from '@/features/orders/types/bulk-print.types';
import {
    getBulkPrintSummary,
    isActiveBulkPrintBatch,
    isTerminalBulkPrintStatus,
    mapBulkPrintStatus,
    sortBulkPrintBatches,
} from '@/features/orders/utils/bulk-print.utils';

/** Batches per page in the activity panel. Kept small so polling stays cheap. */
export const BULK_PRINT_PAGE_SIZE = 10;
/** Poll cadence while at least one batch is still queued or processing. */
const BULK_PRINT_POLL_INTERVAL = 4000;
/** Upper bound on the pages kept in cache, so a long history cannot grow polling forever. */
const BULK_PRINT_MAX_PAGES = 5;

const bulkPrintListQueryKey = [...QUERY_KEYS.ORDERS.BULK_PRINT_LIST, BULK_PRINT_PAGE_SIZE];

type BulkPrintListData = InfiniteData<BulkPrintBatchListResponse, number>;

const flattenBatches = (data?: BulkPrintListData): BulkPrintBatchListItem[] =>
    data?.pages?.flatMap((page) => page?.data?.batches ?? []) ?? [];

/**
 * Batch history from `GET /customer/orders/bulk-print`, the authoritative source for
 * every batch — including ones started before a refresh or in another tab.
 *
 * Polling is driven by the data itself: it runs only while a loaded batch is still in a
 * non-terminal status and stops as soon as they all finish. React Query pauses the
 * interval while the tab is hidden (`refetchIntervalInBackground: false`), and a failed
 * poll leaves the last successful snapshot in place instead of blanking the panel.
 */
export const useBulkPrintBatches = (enabled: boolean = true) =>
    useInfiniteQuery({
        queryKey: bulkPrintListQueryKey,
        queryFn: ({ pageParam }) => bulkPrintService.getBatches({ page: pageParam, per_page: BULK_PRINT_PAGE_SIZE }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const meta = lastPage?.data?.meta;
            if (!meta?.current_page || !meta?.last_page) return undefined;
            return meta.current_page < meta.last_page ? meta.current_page + 1 : undefined;
        },
        getPreviousPageParam: (firstPage) => {
            const current = firstPage?.data?.meta?.current_page;
            return current && current > 1 ? current - 1 : undefined;
        },
        maxPages: BULK_PRINT_MAX_PAGES,
        enabled,
        staleTime: 0,
        refetchIntervalInBackground: false,
        refetchInterval: (query) =>
            flattenBatches(query.state.data as BulkPrintListData | undefined).some(isActiveBulkPrintBatch)
                ? BULK_PRINT_POLL_INTERVAL
                : false,
        retry: 2,
    });

/**
 * Per-order results for a single batch. Only fetched while the batch is open in the UI.
 *
 * `isBatchFinished` comes from the list entry, so a batch that has already finished is
 * fetched once and never polled — including when that one request fails.
 */
export const useBulkPrintBatchDetail = (batchId: string, enabled: boolean = true, isBatchFinished: boolean = false) =>
    useQuery({
        queryKey: QUERY_KEYS.ORDERS.BULK_PRINT_DETAILS(batchId),
        queryFn: () => bulkPrintService.getBatch(batchId),
        enabled: Boolean(batchId) && enabled,
        staleTime: 0,
        refetchIntervalInBackground: false,
        refetchInterval: (query) => {
            if (isBatchFinished) return false;
            const detail = query.state.data;
            if (detail && isTerminalBulkPrintStatus(mapBulkPrintStatus(detail))) return false;
            return BULK_PRINT_POLL_INTERVAL;
        },
        retry: 2,
    });

/**
 * Queues a batch. The mutation is never retried automatically — a retried POST would
 * queue the same labels twice.
 */
export const useCreateBulkPrintBatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (orderNumbers: string[]) => bulkPrintService.createBatch(orderNumbers),
        retry: 0,
        onSuccess: (response, orderNumbers) => {
            const batchId = response?.data?.batch;

            if (batchId) {
                // Show the batch in the activity panel immediately; the refetch below
                // replaces this placeholder with the backend's own record.
                queryClient.setQueryData<BulkPrintListData>(bulkPrintListQueryKey, (current) => {
                    if (!current?.pages?.length) return current;
                    const alreadyListed = flattenBatches(current).some((batch) => batch.batch === batchId);
                    if (alreadyListed) return current;

                    const placeholder: BulkPrintBatchListItem = {
                        batch: batchId,
                        status: 'queued',
                        summary: {
                            total: Number(response?.data?.total ?? orderNumbers.length),
                            processed: 0,
                            succeeded: 0,
                            failed: 0,
                        },
                        created_at: format(new Date(), 'dd/MM/yy HH:mm'),
                    };

                    const [firstPage, ...rest] = current.pages;
                    return {
                        ...current,
                        pages: [
                            {
                                ...firstPage,
                                data: {
                                    ...firstPage.data,
                                    batches: [placeholder, ...(firstPage.data?.batches ?? [])],
                                },
                            },
                            ...rest,
                        ],
                    };
                });
            }

            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.BULK_PRINT_LIST });
        },
    });
};

/**
 * Downloads the merged label PDF for one batch.
 *
 * Download state is tracked per batch id, so a download in progress never disables the
 * buttons of the other batches and the same batch cannot be requested twice at once.
 */
export const useDownloadBulkPrintLabels = () => {
    const [downloadingIds, setDownloadingIds] = useState<string[]>([]);

    const mutation = useMutation({
        mutationFn: (batchId: string) => bulkPrintService.downloadBatchLabels(batchId),
        retry: 0,
        onSuccess: ({ blob, filename, skipped }) => {
            // `downloadFile` revokes the temporary object URL once the click is dispatched.
            downloadFile(blob, filename);
            if (skipped) {
                showToast('Some labels could not be added to the PDF.', 'warning', skipped, 8000);
            }
        },
        onError: async (error: any) => {
            // The API answers errors with JSON even though the request asked for a blob.
            let message = 'Failed to download the labels for this batch.';
            if (error?.response?.data instanceof Blob) {
                try {
                    const parsed = JSON.parse(await error.response.data.text());
                    message = parsed?.message || message;
                } catch {
                    message = error?.message || message;
                }
            } else {
                message = error?.response?.data?.message || error?.message || message;
            }
            showToast(message, 'error');
        },
    });

    const { mutate } = mutation;
    // Ref guard so two clicks landing before the re-render cannot fire two requests.
    const inFlight = useRef<Set<string>>(new Set());

    const download = useCallback((batchId: string) => {
        if (!batchId || inFlight.current.has(batchId)) return;
        inFlight.current.add(batchId);
        setDownloadingIds((current) => (current.includes(batchId) ? current : [...current, batchId]));
        mutate(batchId, {
            onSettled: () => {
                inFlight.current.delete(batchId);
                setDownloadingIds((current) => current.filter((id) => id !== batchId));
            },
        });
    }, [mutate]);

    const isDownloading = useCallback((batchId: string) => downloadingIds.includes(batchId), [downloadingIds]);

    return { download, isDownloading };
};

const buildCompletionToast = (batch: BulkPrintBatchListItem, status: BulkPrintUiStatus) => {
    const { succeeded, failed } = getBulkPrintSummary(batch);
    if (status === 'completed') {
        return {
            message: `Bulk print finished — ${succeeded} ${succeeded === 1 ? 'label is' : 'labels are'} ready to download.`,
            type: 'success' as const,
        };
    }
    if (status === 'partial') {
        return {
            message: `Bulk print finished with issues — ${succeeded} ready, ${failed} failed.`,
            type: 'warning' as const,
        };
    }
    return {
        message: 'Bulk print failed — no labels were created.',
        type: 'error' as const,
    };
};

/**
 * Everything the Print Activity UI needs: the sorted batch list, how many batches are
 * still running, and a one-time notification whenever a tracked batch finishes.
 *
 * Batches already finished when the list first loads never raise a notification, so a
 * page refresh does not replay old toasts.
 */
export const useBulkPrintActivity = (enabled: boolean = true) => {
    const queryClient = useQueryClient();
    const query = useBulkPrintBatches(enabled);

    const batches = useMemo(
        () => sortBulkPrintBatches(flattenBatches(query.data as BulkPrintListData | undefined)),
        [query.data]
    );

    const knownStatuses = useRef<Record<string, BulkPrintUiStatus>>({});
    const hasSeeded = useRef(false);

    useEffect(() => {
        if (!query.data) return;

        const finished: { batch: BulkPrintBatchListItem; status: BulkPrintUiStatus }[] = [];

        batches.forEach((batch) => {
            const status = mapBulkPrintStatus(batch);
            const previous = knownStatuses.current[batch.batch];
            if (hasSeeded.current && previous && !isTerminalBulkPrintStatus(previous) && isTerminalBulkPrintStatus(status)) {
                finished.push({ batch, status });
            }
            knownStatuses.current[batch.batch] = status;
        });

        if (!hasSeeded.current) {
            hasSeeded.current = true;
            return;
        }

        if (!finished.length) return;

        if (finished.length === 1) {
            const { message, type } = buildCompletionToast(finished[0].batch, finished[0].status);
            showToast(message, type, 'Open Print Activity to download the labels.', 8000);
        } else {
            showToast(`${finished.length} bulk print batches finished.`, 'default', 'Open Print Activity to review them.', 8000);
        }

        // Printing a label consigns the order and charges the wallet, so the order views
        // are refreshed once labels actually came out of a batch.
        if (finished.some(({ batch }) => getBulkPrintSummary(batch).succeeded > 0)) {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.LIST });
            queryClient.invalidateQueries({ queryKey: ['orders', 'counts'] });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WALLET.SUMMARY });
        }
    }, [batches, query.data, queryClient]);

    const activeCount = useMemo(() => batches.filter(isActiveBulkPrintBatch).length, [batches]);

    return {
        batches,
        activeCount,
        totalCount: (query.data as BulkPrintListData | undefined)?.pages?.[0]?.data?.meta?.total ?? batches.length,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        isRefetching: query.isRefetching,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
    };
};
