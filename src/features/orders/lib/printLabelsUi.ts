export const MAX_PRINT_LABELS = 100;

export const PRINT_LABELS_POLL_MS = 1500;

export function printLabelsSelectionError(selectedCount: number): string | null {
    if (selectedCount <= 0) {
        return 'Select at least one order.';
    }

    if (selectedCount > MAX_PRINT_LABELS) {
        return `You can print a maximum of ${MAX_PRINT_LABELS} labels at a time.`;
    }

    return null;
}

export function printLabelsPollInterval(
    status: string | undefined,
    fetchStatus?: 'pending' | 'error' | 'success' | string,
): number | false {
    if (status === 'done' || fetchStatus === 'error') {
        return false;
    }

    return PRINT_LABELS_POLL_MS;
}

export function printJobHasCombinedPdf(job: { pdf_ready?: boolean; merged_pdf_ready?: boolean } | null | undefined): boolean {
    return Boolean(job?.pdf_ready || job?.merged_pdf_ready);
}

export function successfulPrintLabelLinks(
    job: {
        orders?: Array<{ order_number?: string; status?: boolean; label_url?: string | null }>;
        results?: Array<{ order_number?: string; status?: boolean; label_url?: string | null }>;
    } | null | undefined,
): Array<{ order_number: string; label_url: string }> {
    const rows = job?.orders?.length ? job.orders : (job?.results ?? []);
    const links: Array<{ order_number: string; label_url: string }> = [];

    for (const row of rows) {
        if (row.status === false) {
            continue;
        }

        const url = typeof row.label_url === 'string' ? row.label_url.trim() : '';
        if (!url) {
            continue;
        }

        links.push({
            order_number: String(row.order_number ?? 'Label'),
            label_url: url,
        });
    }

    return links;
}

export function successfulPrintLabelUrls(
    job: { orders?: Array<{ status?: boolean; label_url?: string | null }>; results?: Array<{ status?: boolean; label_url?: string | null }> } | null | undefined,
): string[] {
    return successfulPrintLabelLinks(job).map((row) => row.label_url);
}

export function shouldOfferPerOrderLabelLinks(job: {
    pdf_ready?: boolean;
    merged_pdf_ready?: boolean;
    use_per_order_label_urls?: boolean;
    skipped_labels?: unknown[];
    merge_skipped?: unknown[];
} | null | undefined): boolean {
    if (!job) {
        return false;
    }

    const skipped = job.skipped_labels ?? job.merge_skipped ?? [];

    return Boolean(job.use_per_order_label_urls) || !printJobHasCombinedPdf(job) || skipped.length > 0;
}

export function filenameFromContentDisposition(header: string | undefined | null, fallback: string): string {
    if (!header) {
        return fallback;
    }

    const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(header);
    if (utf8?.[1]) {
        try {
            return decodeURIComponent(utf8[1].trim()) || fallback;
        } catch {
            return utf8[1].trim() || fallback;
        }
    }

    const ascii = /filename=(?:"([^"]+)"|([^;]+))/i.exec(header);
    const raw = (ascii?.[1] ?? ascii?.[2] ?? '').trim();

    return raw || fallback;
}

export function printIdFromStartPayload(payload: { print_id?: string; batch?: string } | null | undefined): string | null {
    return payload?.print_id || payload?.batch || null;
}

type PrintJobOrderRow = {
    order_number?: string;
    status?: boolean;
    message?: string;
    label_url?: string | null;
};

export function printJobOrderRows(
    job: { orders?: PrintJobOrderRow[]; results?: PrintJobOrderRow[] } | null | undefined,
): PrintJobOrderRow[] {
    return job?.orders?.length ? job.orders : (job?.results ?? []);
}

export function printJobSucceededOrderNumbers(
    job: { orders?: PrintJobOrderRow[]; results?: PrintJobOrderRow[] } | null | undefined,
): string[] {
    return printJobOrderRows(job)
        .filter((row) => row.status !== false)
        .map((row) => String(row.order_number ?? '').trim())
        .filter(Boolean);
}

export function printJobFailedRows(
    job: { orders?: PrintJobOrderRow[]; results?: PrintJobOrderRow[] } | null | undefined,
): PrintJobOrderRow[] {
    return printJobOrderRows(job).filter((row) => row.status === false);
}

export function printJobFailedOrderNumbers(
    job: { orders?: PrintJobOrderRow[]; results?: PrintJobOrderRow[] } | null | undefined,
): string[] {
    return printJobFailedRows(job)
        .map((row) => String(row.order_number ?? '').trim())
        .filter(Boolean);
}
