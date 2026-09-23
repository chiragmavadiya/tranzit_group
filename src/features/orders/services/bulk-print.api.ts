import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/constants/api.constants';
import { filenameFromContentDisposition } from '@/features/orders/lib/printLabelsUi';
import type {
    BulkPrintBatchDetail,
    BulkPrintBatchDetailResponse,
    BulkPrintBatchListResponse,
    BulkPrintLabelsDownload,
    CreateBulkPrintBatchResponse,
    PrintLabelsPreview,
    PrintLabelsPreviewResponse,
    PrintLabelsJob,
    PrintLabelsStartResponse,
    PrintLabelsStatusResponse,
} from '@/features/orders/types/bulk-print.types';

/**
 * Bulk label printing is queued on the backend, so the client creates a batch and then
 * follows it through the list/detail endpoints. Auth is handled by the shared `api`
 * instance — no token is ever passed in from here.
 */
export const bulkPrintService = {
    checkPrintLabels: async (orderNumbers: string[]): Promise<PrintLabelsPreview> => {
        const response = await api.post<PrintLabelsPreviewResponse>(API_ENDPOINTS.ORDERS.PRINT_LABELS_CHECK, {
            order_numbers: orderNumbers,
        });
        return response.data.data;
    },

    startPrintLabels: async (orderNumbers: string[]): Promise<PrintLabelsStartResponse> => {
        const response = await api.post<PrintLabelsStartResponse>(API_ENDPOINTS.ORDERS.PRINT_LABELS, {
            order_numbers: orderNumbers,
        });
        return response.data;
    },

    getPrintLabelsStatus: async (printId: string): Promise<PrintLabelsJob> => {
        const response = await api.get<PrintLabelsStatusResponse>(API_ENDPOINTS.ORDERS.PRINT_LABELS_STATUS(printId));
        return response.data.data;
    },

    downloadPrintLabelsFile: async (printId: string): Promise<BulkPrintLabelsDownload> => {
        const response = await api.get(API_ENDPOINTS.ORDERS.PRINT_LABELS_FILE(printId), {
            responseType: 'blob',
        });

        const filename = filenameFromContentDisposition(
            response.headers['content-disposition'],
            `labels-${printId}.pdf`,
        );

        return {
            blob: response.data,
            filename,
            skipped: String(response.headers['x-skipped-labels'] || '').trim(),
        };
    },

    /** Queues a batch and returns the backend generated batch id. */
    createBatch: async (orderNumbers: string[]): Promise<CreateBulkPrintBatchResponse> => {
        const response = await api.post<CreateBulkPrintBatchResponse>(API_ENDPOINTS.ORDERS.BULK_PRINT, {
            order_numbers: orderNumbers,
        });
        return response.data;
    },

    /** Paginated batch history — the source of truth for everything the activity panel shows. */
    getBatches: async (params?: { page?: number; per_page?: number }): Promise<BulkPrintBatchListResponse> => {
        // GET must not carry the `order_numbers` body the Postman collection leaves attached.
        const response = await api.get<BulkPrintBatchListResponse>(API_ENDPOINTS.ORDERS.BULK_PRINT, { params });
        return response.data;
    },

    /** Per order results for one batch, used when a batch is expanded. */
    getBatch: async (batchId: string): Promise<BulkPrintBatchDetail> => {
        const response = await api.get<BulkPrintBatchDetailResponse>(API_ENDPOINTS.ORDERS.BULK_PRINT_DETAILS(batchId));
        return response.data?.data;
    },

    /**
     * Downloads the merged label PDF. The API answers with `application/pdf` plus a
     * `Content-Disposition` filename, and reports labels it could not merge through the
     * `X-Skipped-Labels` header (exposed via CORS).
     */
    downloadBatchLabels: async (batchId: string): Promise<BulkPrintLabelsDownload> => {
        const response = await api.get(API_ENDPOINTS.ORDERS.BULK_PRINT_LABELS(batchId), {
            responseType: 'blob',
        });

        const filename = filenameFromContentDisposition(
            response.headers['content-disposition'],
            `bulk-labels-${batchId}.pdf`,
        );

        return {
            blob: response.data,
            filename,
            skipped: String(response.headers['x-skipped-labels'] || '').trim(),
        };
    },
};
