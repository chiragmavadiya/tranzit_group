import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
    MAX_PRINT_LABELS,
    filenameFromContentDisposition,
    // printIdFromStartPayload,
    printJobFailedOrderNumbers,
    printJobHasCombinedPdf,
    printJobSucceededOrderNumbers,
    printLabelsPollInterval,
    printLabelsSelectionError,
    shouldOfferPerOrderLabelLinks,
    successfulPrintLabelUrls,
} from './printLabelsUi.ts';

describe('printLabelsUi', () => {
    it('blocks empty and oversized selections', () => {
        assert.equal(printLabelsSelectionError(0), 'Select at least one order.');
        assert.equal(
            printLabelsSelectionError(MAX_PRINT_LABELS + 1),
            `You can print a maximum of ${MAX_PRINT_LABELS} labels at a time.`
        );
        assert.equal(printLabelsSelectionError(MAX_PRINT_LABELS), null);
        assert.equal(printLabelsSelectionError(2), null);
    });

    it('stops polling when the print job is done or the status request failed', () => {
        assert.equal(printLabelsPollInterval('queued'), 1500);
        assert.equal(printLabelsPollInterval('printing'), 1500);
        assert.equal(printLabelsPollInterval('done'), false);
        assert.equal(printLabelsPollInterval('queued', 'error'), false);
        assert.equal(printLabelsPollInterval(undefined, 'error'), false);
    });

    it('detects a combined PDF and per-order label URLs', () => {
        assert.equal(printJobHasCombinedPdf({ pdf_ready: true }), true);
        assert.equal(printJobHasCombinedPdf({ merged_pdf_ready: true }), true);
        assert.equal(printJobHasCombinedPdf({ pdf_ready: false }), false);
        assert.deepEqual(
            successfulPrintLabelUrls({
                orders: [
                    { status: true, label_url: 'https://labels.test/a.pdf' },
                    { status: false, label_url: 'https://labels.test/failed.pdf' },
                    { status: true, label_url: '  ' },
                ],
            }),
            ['https://labels.test/a.pdf']
        );
        assert.equal(
            shouldOfferPerOrderLabelLinks({ pdf_ready: false, use_per_order_label_urls: true }),
            true
        );
        assert.equal(shouldOfferPerOrderLabelLinks({ pdf_ready: true, skipped_labels: [] }), false);
        assert.equal(shouldOfferPerOrderLabelLinks({ pdf_ready: true, skipped_labels: ['T-1'] }), true);
    });

    it('parses Content-Disposition filenames without throwing', () => {
        assert.equal(filenameFromContentDisposition(undefined, 'fallback.pdf'), 'fallback.pdf');
        assert.equal(filenameFromContentDisposition('inline', 'fallback.pdf'), 'fallback.pdf');
        assert.equal(
            filenameFromContentDisposition('attachment; filename="labels-abc.pdf"', 'fallback.pdf'),
            'labels-abc.pdf'
        );
        assert.equal(
            filenameFromContentDisposition("attachment; filename*=UTF-8''labels%20batch.pdf", 'fallback.pdf'),
            'labels batch.pdf'
        );
    });

    it('keeps failed order numbers for retry and only treats successes as printed', () => {
        const job = {
            orders: [
                { order_number: 'T-OK', status: true },
                { order_number: 'T-FAIL', status: false, message: 'Suburb does not match postcode' },
            ],
        };
        assert.deepEqual(printJobSucceededOrderNumbers(job), ['T-OK']);
        assert.deepEqual(printJobFailedOrderNumbers(job), ['T-FAIL']);
    });
});
