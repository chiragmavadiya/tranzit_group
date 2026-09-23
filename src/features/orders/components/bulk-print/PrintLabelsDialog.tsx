import { AlertTriangle, Download, Info, Loader2, Printer } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { CustomModel } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/features/orders/utils/order-details.utils';
import {
    printJobHasCombinedPdf,
    shouldOfferPerOrderLabelLinks,
    successfulPrintLabelLinks,
} from '@/features/orders/lib/printLabelsUi';
import type {
    PrintLabelPlanRow,
    PrintLabelsJob,
    PrintLabelsJobOrder,
    PrintLabelsPreview,
} from '@/features/orders/types/bulk-print.types';

export type PrintLabelsPhase = 'checking' | 'preview' | 'printing' | 'done';

interface PrintLabelsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    phase: PrintLabelsPhase;
    preview: PrintLabelsPreview | null;
    job: PrintLabelsJob | null;
    checking: boolean;
    starting: boolean;
    downloading: boolean;
    errorMessage?: string | null;
    onConfirm: () => void;
    onDownloadPdf?: () => void;
    onRetryFailed?: () => void;
}

const PlanList = ({ rows, tone }: { rows: PrintLabelPlanRow[]; tone: 'ok' | 'info' | 'skip' }) => {
    if (rows.length === 0) return null;

    return (
        <div className="max-h-40 space-y-1 overflow-y-auto pr-1">
            {rows.map((row) => (
                <p key={row.order_number} className="my-0 text-xs leading-5">
                    <span className="font-semibold">{row.order_number}</span>
                    <span className="text-slate-500 dark:text-zinc-400"> — {row.message}</span>
                </p>
            ))}
            {tone === 'ok' && rows.some((row) => (row.due ?? 0) > 0) && (
                <p className="my-0 text-[11px] text-slate-500">
                    Wallet due is only for unpaid consignments (BYO is $0).
                </p>
            )}
        </div>
    );
};

const Section = ({
    title,
    count,
    children,
    tone,
}: {
    title: string;
    count: number;
    children: ReactNode;
    tone: 'ok' | 'info' | 'skip';
}) => {
    if (count === 0) return null;

    return (
        <div
            className={cn(
                'rounded-lg border p-3',
                tone === 'ok' && 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/40 dark:bg-emerald-950/20',
                tone === 'info' && 'border-sky-200 bg-sky-50/60 dark:border-sky-900/40 dark:bg-sky-950/20',
                tone === 'skip' && 'border-amber-200 bg-amber-50/70 dark:border-amber-900/30 dark:bg-amber-950/20'
            )}
        >
            <p className="my-0 mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-zinc-200">
                {title} ({count})
            </p>
            {children}
        </div>
    );
};

const jobOrders = (job: PrintLabelsJob | null): PrintLabelsJobOrder[] =>
    job?.orders?.length ? job.orders : (job?.results ?? []);

export const PrintLabelsDialog = ({
    open,
    onOpenChange,
    phase,
    preview,
    job,
    checking,
    starting,
    downloading,
    errorMessage,
    onConfirm,
    onDownloadPdf,
    onRetryFailed,
}: PrintLabelsDialogProps) => {
    const canPrint = Boolean(preview?.can_print);
    const wallet = preview?.wallet;
    const isAdminWallet = wallet?.wallet_balance == null;
    const insufficient = Boolean(wallet && !wallet.sufficient);
    const summary = job?.summary;
    const processed = Number(summary?.processed ?? 0);
    const total = Number(summary?.total ?? preview?.counts.printable ?? 0);
    const percent = total > 0 ? Math.min(100, Math.round((processed / total) * 100)) : 0;
    const orders = jobOrders(job);
    const failed = orders.filter((row) => !row.status);
    const hasCombinedPdf = printJobHasCombinedPdf(job);
    const perOrderLinks = successfulPrintLabelLinks(job);
    const showPerOrderLinks = phase === 'done' && shouldOfferPerOrderLabelLinks(job) && perOrderLinks.length > 0;

    const isBusy = checking || starting || downloading;
    const closeOnly = phase === 'done' || phase === 'printing' || (phase === 'preview' && (!canPrint || insufficient));

    const title =
        phase === 'checking'
            ? 'Checking labels'
            : phase === 'printing'
                ? 'Printing labels'
                : phase === 'done'
                    ? 'Print finished'
                    : 'Print labels';

    const submitText = closeOnly ? (phase === 'printing' ? 'Hide' : 'Close') : 'Print labels';
    const cancelText = phase === 'printing' ? 'Hide — keeps printing' : 'Cancel';

    const description =
        phase === 'preview'
            ? 'Review what will consign, reprint, or skip before any courier is called.'
            : phase === 'printing'
                ? 'Labels are being created with each order’s saved courier. You can hide this window — printing continues.'
                : phase === 'done'
                    ? hasCombinedPdf
                        ? 'Download the combined PDF. If the browser blocked the automatic download, use the button below.'
                        : 'A combined PDF was not created. Open each successful label link below.'
                    : 'Checking the selected orders…';

    return (
        <CustomModel
            open={open}
            onOpenChange={(next) => {
                if ((checking || starting) && !next) return;
                onOpenChange(next);
            }}
            title={title}
            description={description}
            contentClass="sm:max-w-lg"
            submitText={submitText}
            cancelText={cancelText}
            onSubmit={closeOnly ? () => onOpenChange(false) : onConfirm}
            isLoading={isBusy}
            showFooter={phase !== 'checking'}
        >
            <div className="space-y-3 pb-1">
                {checking && (
                    <div className="flex items-center gap-2 py-6 text-sm text-slate-600 dark:text-zinc-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading print preview…
                    </div>
                )}

                {phase === 'preview' && preview && (
                    <>
                        <Section title="Will consign" count={preview.counts.consign} tone="ok">
                            <PlanList rows={preview.consign} tone="ok" />
                        </Section>
                        <Section title="Reprint (no new consignment)" count={preview.counts.reprint} tone="info">
                            <PlanList rows={preview.reprint} tone="info" />
                        </Section>
                        <Section title="Skipped" count={preview.counts.skip} tone="skip">
                            <PlanList rows={preview.skip} tone="skip" />
                        </Section>

                        {!isAdminWallet && (
                            <div className="rounded-lg border border-slate-200 p-3 dark:border-zinc-800">
                                <p className="my-0 text-xs font-bold uppercase tracking-wide text-slate-500">Wallet</p>
                                <p className="my-0 mt-1 text-sm">
                                    Needed {formatCurrency(Number(wallet?.required_total ?? 0))} · Balance{' '}
                                    {formatCurrency(Number(wallet?.wallet_balance ?? 0))}
                                </p>
                                {insufficient && (
                                    <p className="my-0 mt-2 flex gap-2 text-xs text-amber-700 dark:text-amber-400">
                                        <AlertTriangle className="h-4 w-4 shrink-0" />
                                        Top up or deselect unpaid orders. Print will not start.
                                    </p>
                                )}
                            </div>
                        )}

                        {!canPrint && (
                            <p className="my-0 flex gap-2 text-xs text-amber-700 dark:text-amber-400">
                                <Info className="h-4 w-4 shrink-0" />
                                Nothing can be printed from this selection.
                            </p>
                        )}
                    </>
                )}

                {(phase === 'printing' || phase === 'done') && (
                    <>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-zinc-300">
                                <span className="flex items-center gap-1.5">
                                    {phase === 'printing' ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                        <Printer className="h-3.5 w-3.5" />
                                    )}
                                    {processed} / {total || '—'}
                                </span>
                                <span>{percent}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                                <div
                                    className="h-full rounded-full bg-primary transition-all"
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                        </div>

                        {preview && preview.counts.skip > 0 && (
                            <p className="my-0 text-xs text-slate-500">
                                {preview.counts.skip} selected {preview.counts.skip === 1 ? 'order was' : 'orders were'} skipped
                                before print and {preview.counts.skip === 1 ? 'is' : 'are'} still selected on the orders list.
                            </p>
                        )}

                        {failed.length > 0 && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs dark:border-amber-900/30 dark:bg-amber-950/20">
                                <p className="my-0 mb-1 font-bold">Could not print ({failed.length})</p>
                                <div className="max-h-40 space-y-1 overflow-y-auto pr-1">
                                    {failed.map((row) => (
                                        <p key={row.order_number} className="my-0 leading-5">
                                            <span className="font-semibold">{row.order_number}</span>
                                            {row.message ? ` — ${row.message}` : ''}
                                        </p>
                                    ))}
                                </div>
                                {phase === 'done' && (
                                    <p className="my-0 mt-2 text-[11px] text-amber-800 dark:text-amber-300">
                                        These orders stay selected so you can fix the issue and retry.
                                    </p>
                                )}
                            </div>
                        )}

                        {phase === 'done' && hasCombinedPdf && onDownloadPdf && (
                            <Button
                                type="button"
                                className="h-8 w-full gap-1.5 bg-primary font-semibold text-white hover:bg-primary-hover"
                                onClick={onDownloadPdf}
                                disabled={downloading}
                            >
                                {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                Download combined PDF
                            </Button>
                        )}

                        {phase === 'done' && failed.length > 0 && onRetryFailed && (
                            <Button
                                type="button"
                                variant="outline"
                                className="h-8 w-full gap-1.5 font-semibold"
                                onClick={onRetryFailed}
                                disabled={checking || starting}
                            >
                                Retry orders that could not print
                            </Button>
                        )}

                        {showPerOrderLinks && (
                            <div className="rounded-lg border border-slate-200 p-3 text-xs dark:border-zinc-800">
                                <p className="my-0 mb-1.5 font-bold uppercase tracking-wide text-slate-500">
                                    Individual labels
                                </p>
                                <div className="max-h-40 space-y-1 overflow-y-auto pr-1">
                                    {perOrderLinks.map((row) => (
                                        <p key={`${row.order_number}-${row.label_url}`} className="my-0 leading-5">
                                            <a
                                                href={row.label_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-semibold text-primary underline-offset-2 hover:underline"
                                            >
                                                {row.order_number}
                                            </a>
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {errorMessage && (
                    <p
                        role="alert"
                        className="my-0 flex gap-2 rounded-md border border-red-200 bg-red-50/70 p-2.5 text-xs text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400"
                    >
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                        {errorMessage}
                    </p>
                )}
            </div>
        </CustomModel>
    );
};
