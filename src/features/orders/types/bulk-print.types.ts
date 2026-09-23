/**
 * Request/response types for the queued bulk label printing endpoints.
 *
 * Every field below was taken from a live response of the shipping portal API
 * (`/api/customer/orders/bulk-print`), not from the Postman collection, which ships
 * without response examples. Anything the API has not been observed to return is
 * marked optional so a missing field degrades the UI instead of crashing it.
 */

/** Counts the API reports for a batch. `processed` drives the progress bar. */
export interface BulkPrintSummary {
    total: number;
    processed: number;
    succeeded: number;
    failed: number;
}

/** A row of `GET /customer/orders/bulk-print`. */
export interface BulkPrintBatchListItem {
    /** Backend generated batch id (UUID). */
    batch: string;
    /** Raw backend status, e.g. "completed". Map it with `mapBulkPrintStatus`. */
    status: string;
    summary: BulkPrintSummary;
    /** Formatted by the API as `dd/MM/yy HH:mm`. */
    created_at: string;
}

/** Laravel style pagination block returned alongside the batch list. */
export interface BulkPrintPaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
}

export interface BulkPrintBatchListResponse {
    status: boolean;
    data: {
        batches: BulkPrintBatchListItem[];
        meta: BulkPrintPaginationMeta;
    };
}

/** Per order outcome, only returned by the batch detail endpoint. */
export interface BulkPrintOrderResult {
    order_number: string;
    /** `true` when the label was created for this order. */
    status: boolean;
    /** Success confirmation or the courier/validation failure reason. */
    message: string;
    /** Courier error code. Observed as an empty string on both outcomes. */
    code?: string;
    /** Direct courier label link. Null for couriers that only return a tracking number. */
    label_url?: string | null;
    tracking_number?: string | null;
}

/** `GET /customer/orders/bulk-print/{batch}`. */
export interface BulkPrintBatchDetail extends BulkPrintBatchListItem {
    results: BulkPrintOrderResult[];
    /** `true` when the merged label PDF can be downloaded. */
    merged_pdf_ready: boolean;
    /** Labels the API could not merge into the PDF. Observed only as an empty array. */
    merge_skipped?: Array<string | { order_number?: string; message?: string }>;
    updated_at?: string;
}

export interface BulkPrintBatchDetailResponse {
    status: boolean;
    data: BulkPrintBatchDetail;
}

/** Wallet snapshot the create endpoint returns so the customer can be warned up front. */
export interface BulkPrintWalletWarning {
    required_total: number;
    wallet_balance: number;
    sufficient: boolean;
}

export interface CreateBulkPrintBatchRequest {
    order_numbers: string[];
}

export interface CreateBulkPrintBatchResponse {
    status: boolean;
    message: string;
    data: {
        batch: string;
        total: number;
        wallet_warning?: BulkPrintWalletWarning;
    };
}

/** Merged label PDF plus anything the API reported as skipped while merging. */
export interface BulkPrintLabelsDownload {
    blob: Blob;
    filename: string;
    /** From the `X-Skipped-Labels` response header. */
    skipped: string;
}

/** Statuses the UI renders. Backend statuses are mapped onto these. */
export type BulkPrintUiStatus = 'queued' | 'processing' | 'completed' | 'partial' | 'failed';

/** One selected order that cannot (or should not) be sent to the bulk print endpoint. */
export interface BulkPrintOrderIssue {
    order_number: string;
    reason: string;
}

/** Result of checking the current table selection against the print eligibility rules. */
export interface BulkPrintSelectionCheck {
    /** Deduplicated order numbers that will be submitted. */
    eligible: string[];
    /** Selected orders that are excluded from the request, with the reason why. */
    ineligible: BulkPrintOrderIssue[];
    /** Submitted orders that carry a caveat (own courier billing, support review). */
    warnings: BulkPrintOrderIssue[];
    /** Selected orders that are not on the current page, so eligibility is unknown. */
    unverifiedCount: number;
}

/** One row from POST /print-labels/check (consign, reprint, or skip). */
export interface PrintLabelPlanRow {
    order_number: string;
    action: 'consign' | 'reprint' | 'skip';
    code: string;
    message: string;
    due?: number;
    is_own_courier?: boolean;
    tracking_number?: string | null;
    label_url?: string | null;
}

export interface PrintLabelsWallet {
    required_total: number;
    wallet_balance: number | null;
    sufficient: boolean;
}

export interface PrintLabelsPreview {
    can_print: boolean;
    consign: PrintLabelPlanRow[];
    reprint: PrintLabelPlanRow[];
    skip: PrintLabelPlanRow[];
    printable: PrintLabelPlanRow[];
    wallet: PrintLabelsWallet;
    counts: {
        consign: number;
        reprint: number;
        skip: number;
        printable: number;
    };
}

export interface PrintLabelsPreviewResponse {
    status: boolean;
    message?: string;
    data: PrintLabelsPreview;
}

export interface PrintLabelsJobOrder {
    order_number: string;
    status: boolean;
    code?: string;
    message: string;
    tracking_number?: string | null;
    label_url?: string | null;
}

export interface PrintLabelsJob {
    print_id: string;
    batch?: string;
    status: 'queued' | 'printing' | 'done' | string;
    summary: BulkPrintSummary;
    orders?: PrintLabelsJobOrder[];
    results?: PrintLabelsJobOrder[];
    pdf_ready?: boolean;
    merged_pdf_ready?: boolean;
    use_per_order_label_urls?: boolean;
    skipped_labels?: string[];
    merge_skipped?: string[];
    preview?: PrintLabelsPreview;
}

export interface PrintLabelsStartResponse {
    status: boolean;
    message?: string;
    data: PrintLabelsJob;
}

export interface PrintLabelsStatusResponse {
    status: boolean;
    data: PrintLabelsJob;
}
