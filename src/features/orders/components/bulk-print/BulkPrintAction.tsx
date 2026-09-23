import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, Printer } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { showToast } from '@/components/ui/custom-toast';
import {
    useDownloadPrintLabelsFile,
    usePrintLabelsCheck,
    usePrintLabelsStatus,
    useStartPrintLabels,
} from '@/features/orders/hooks/usePrintLabels';
import type { PrintLabelsJob, PrintLabelsPreview } from '@/features/orders/types/bulk-print.types';
import {
    printIdFromStartPayload,
    printJobFailedOrderNumbers,
    printJobHasCombinedPdf,
    printJobSucceededOrderNumbers,
    printLabelsSelectionError,
} from '@/features/orders/lib/printLabelsUi';
import { PrintLabelsDialog, type PrintLabelsPhase } from './PrintLabelsDialog';

interface BulkPrintActionProps {
    selectedOrderNumbers: string[];
    onFinished: (printedOrderNumbers: string[]) => void;
    disabled?: boolean;
}

export const BulkPrintAction = ({
    selectedOrderNumbers,
    onFinished,
    disabled = false,
}: BulkPrintActionProps) => {
    const [open, setOpen] = useState(false);
    const [phase, setPhase] = useState<PrintLabelsPhase>('checking');
    const [preview, setPreview] = useState<PrintLabelsPreview | null>(null);
    const [printId, setPrintId] = useState<string | null>(null);
    const [orderNumbers, setOrderNumbers] = useState<string[]>([]);
    const downloadedFor = useRef<string | null>(null);

    const check = usePrintLabelsCheck();
    const start = useStartPrintLabels();
    const download = useDownloadPrintLabelsFile();
    const statusQuery = usePrintLabelsStatus(printId);

    const job: PrintLabelsJob | null = statusQuery.data ?? null;
    const isSubmitting = useRef(false);
    const printingInBackground = phase === 'printing' && !open;

    const reset = useCallback(() => {
        setPhase('checking');
        setPreview(null);
        setPrintId(null);
        setOrderNumbers([]);
        downloadedFor.current = null;
        check.reset();
        start.reset();
        isSubmitting.current = false;
    }, [check, start]);

    const runCheck = useCallback((numbers: string[]) => {
        setOrderNumbers(numbers);
        setPhase('checking');
        check.mutate(numbers, {
            onSuccess: (data) => {
                setPreview(data);
                setPhase('preview');
            },
            onError: (error: any) => {
                showToast(
                    error?.response?.data?.message || error?.message || 'Could not load the print preview.',
                    'error'
                );
                setOpen(false);
            },
        });
    }, [check]);

    const handleOpen = useCallback(() => {
        if (phase === 'printing' && printId) {
            setOpen(true);
            return;
        }

        if (disabled || selectedOrderNumbers.length === 0) return;
        const selectionError = printLabelsSelectionError(selectedOrderNumbers.length);
        if (selectionError) {
            showToast(selectionError, 'error');
            return;
        }

        reset();
        setOpen(true);
        runCheck(selectedOrderNumbers);
    }, [disabled, phase, printId, reset, runCheck, selectedOrderNumbers]);

    const handleConfirm = useCallback(() => {
        if (isSubmitting.current || start.isPending || !preview?.can_print) return;
        isSubmitting.current = true;
        start.mutate(orderNumbers.length ? orderNumbers : selectedOrderNumbers, {
            onSettled: () => {
                isSubmitting.current = false;
            },
            onSuccess: (response) => {
                const id = printIdFromStartPayload(response?.data);
                if (!id) {
                    showToast('Print was accepted but no print id was returned.', 'error');
                    return;
                }
                setPrintId(id);
                setPhase('printing');
            },
            onError: (error: any) => {
                const message = error?.response?.data?.message || error?.message || 'Could not start printing.';
                showToast(message, 'error');
                const data = error?.response?.data?.data;
                if (data?.counts) {
                    setPreview(data);
                    setPhase('preview');
                }
            },
        });
    }, [orderNumbers, preview?.can_print, selectedOrderNumbers, start]);

    const handleRetryFailed = useCallback(() => {
        const failed = printJobFailedOrderNumbers(job);
        if (failed.length === 0) {
            showToast('There are no failed orders to retry.', 'default');
            return;
        }

        downloadedFor.current = null;
        setPrintId(null);
        start.reset();
        setOpen(true);
        runCheck(failed);
    }, [job, runCheck, start]);

    useEffect(() => {
        if (!printId || job?.status !== 'done' || downloadedFor.current === printId) return;
        downloadedFor.current = printId;
        setPhase('done');
        if (!open) {
            setOpen(true);
        }

        onFinished(printJobSucceededOrderNumbers(job));

        if (job.pdf_ready || job.merged_pdf_ready) {
            download.mutate(printId);
        } else {
            const failed = printJobFailedOrderNumbers(job);
            showToast(
                failed.length
                    ? 'Print finished. Some orders need attention — they are still selected.'
                    : 'Print finished. Open the per-order label links below.',
                failed.length ? 'warning' : 'success'
            );
        }
    }, [download, job, onFinished, open, printId]);

    const handleDownloadPdf = useCallback(() => {
        if (!printId || !printJobHasCombinedPdf(job)) {
            return;
        }
        download.mutate(printId);
    }, [download, job, printId]);

    const startError = start.error as any;
    const statusError = statusQuery.error as any;
    const errorMessage = start.isError
        ? startError?.response?.data?.message || startError?.message || 'Could not start printing.'
        : statusQuery.isError
            ? statusError?.response?.data?.message || statusError?.message || 'Could not load print status.'
            : null;

    return (
        <>
            <Button
                variant="default"
                size="sm"
                className="h-8 gap-1.5 bg-primary px-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover sm:px-3"
                onClick={handleOpen}
                disabled={disabled || (selectedOrderNumbers.length === 0 && !printingInBackground && phase !== 'printing')}
                aria-label={printingInBackground ? 'Show label print progress' : 'Print labels for selected orders'}
            >
                {check.isPending || printingInBackground ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Printer className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{printingInBackground ? 'Printing…' : 'Print labels'}</span>
                <span>({printingInBackground ? (job?.summary?.processed ?? 0) : selectedOrderNumbers.length})</span>
            </Button>

            {open && (
                <PrintLabelsDialog
                    open={open}
                    onOpenChange={(next) => {
                        if (!next && phase === 'printing') {
                            setOpen(false);
                            showToast('Printing continues in the background. Click Printing… to watch progress.', 'default');
                            return;
                        }
                        if (!next) {
                            reset();
                        }
                        setOpen(next);
                    }}
                    phase={phase}
                    preview={preview}
                    job={job}
                    checking={check.isPending}
                    starting={start.isPending}
                    downloading={download.isPending}
                    errorMessage={errorMessage}
                    onConfirm={handleConfirm}
                    onDownloadPdf={handleDownloadPdf}
                    onRetryFailed={handleRetryFailed}
                />
            )}
        </>
    );
};
