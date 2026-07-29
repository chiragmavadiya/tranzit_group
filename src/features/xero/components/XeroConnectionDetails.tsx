import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Check, Copy, Info, KeyRound, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { formatDateTime, formatRelative } from '../utils';
import type { XeroStatus } from '../types';

const SCOPE_LABELS: Record<string, string> = {
    openid: 'Identity',
    profile: 'Profile',
    email: 'Email address',
    'accounting.transactions': 'Invoices & transactions',
    'accounting.contacts': 'Contacts',
    offline_access: 'Background token refresh',
};

const CONNECT_STEPS = [
    'Sign in to Xero and pick the organisation you want to link.',
    'Approve the requested permissions for invoices and contacts.',
    'Tranzit stores the tokens and refreshes them in the background.',
];

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">{label}</span>
        <div className="text-xs font-semibold text-slate-800 dark:text-zinc-200 break-all">{children}</div>
    </div>
);

const TokenPill = ({ present, label }: { present?: boolean; label: string }) => (
    <div
        className={cn(
            'flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-bold',
            present
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20'
                : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-zinc-900 dark:text-zinc-500 dark:border-zinc-800'
        )}
    >
        {present ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
        {label}
    </div>
);

export const XeroConnectionDetails = ({ status, isLoading }: { status?: XeroStatus; isLoading: boolean }) => {
    const { copy } = useCopyToClipboard('Tenant ID copied');
    const scopes = status?.scopes?.split(' ').filter(Boolean) || [];

    if (isLoading) {
        return (
            <Card className="py-4">
                <CardHeader className="pb-3 border-b border-slate-200 dark:border-zinc-800">
                    <Skeleton className="h-4 w-40" />
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-5 pt-1">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <div key={idx} className="space-y-2">
                            <Skeleton className="h-2.5 w-20" />
                            <Skeleton className="h-3.5 w-32" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (!status?.connected) {
        return (
            <Card className="py-4 h-full">
                <CardHeader className="flex flex-row items-center gap-2 pb-3 border-b border-slate-200 dark:border-zinc-800">
                    <Info className="w-4 h-4 text-primary" />
                    <h3 className="my-0 text-sm font-bold text-slate-900 dark:text-white">How the connection works</h3>
                </CardHeader>
                <CardContent className="pt-1 space-y-5">
                    <ol className="my-0 pl-0 list-none space-y-3">
                        {CONNECT_STEPS.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <span className="w-5 h-5 shrink-0 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                                    {idx + 1}
                                </span>
                                <span className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">{step}</span>
                            </li>
                        ))}
                    </ol>

                    <div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
                            Permissions requested
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {Object.values(SCOPE_LABELS).map((label) => (
                                <span
                                    key={label}
                                    className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[10px] font-semibold text-slate-600 dark:text-zinc-400"
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="py-4 h-full">
            <CardHeader className="flex flex-row items-center gap-2 pb-3 border-b border-slate-200 dark:border-zinc-800">
                <KeyRound className="w-4 h-4 text-primary" />
                <h3 className="my-0 text-sm font-bold text-slate-900 dark:text-white">Connection Details</h3>
            </CardHeader>
            <CardContent className="pt-1 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Organisation">{status.organisation_name || '-'}</Field>
                    <Field label="Tenant Type">{status.tenant_type || '-'}</Field>
                    <div className="sm:col-span-2">
                        <Field label="Tenant ID">
                            <div className="flex items-center gap-2">
                                <code className="font-mono text-slate-700 dark:text-zinc-300">
                                    {status.tenant_id || '-'}
                                </code>
                                {status.tenant_id && (
                                    <Button
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={() => copy(status.tenant_id as string)}
                                        className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
                                    >
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                )}
                            </div>
                        </Field>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-zinc-900 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Token Expires">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span
                                className={cn(
                                    'px-2 py-0.5 rounded-md text-[10px] font-bold border',
                                    status.token_expired
                                        ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:border-red-500/20'
                                        : 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20'
                                )}
                            >
                                {status.token_expired ? 'Expired' : 'Valid'}
                            </span>
                            <span>{formatDateTime(status.token_expires_at) || '-'}</span>
                            {status.token_expires_at && (
                                <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                                    ({formatRelative(status.token_expires_at)})
                                </span>
                            )}
                        </div>
                    </Field>
                    <Field label="Last Refreshed">{formatDateTime(status.last_refreshed_at) || '-'}</Field>
                    <div className="sm:col-span-2">
                        <Field label="Stored Tokens">
                            <div className="flex flex-wrap gap-2">
                                <TokenPill present={status.has_access_token} label="Access Token" />
                                <TokenPill present={status.has_refresh_token} label="Refresh Token" />
                            </div>
                        </Field>
                    </div>
                </div>

                {scopes.length > 0 && (
                    <div className="pt-4 border-t border-slate-100 dark:border-zinc-900">
                        <Field label="Granted Scopes">
                            <div className="flex flex-wrap gap-1.5">
                                {scopes.map((scope) => (
                                    <span
                                        key={scope}
                                        title={scope}
                                        className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[10px] font-semibold text-slate-600 dark:text-zinc-400"
                                    >
                                        {SCOPE_LABELS[scope] || scope}
                                    </span>
                                ))}
                            </div>
                        </Field>
                    </div>
                )}

                {status.last_error && (
                    <div className="flex gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="my-0 text-[10px] font-bold text-red-700 dark:text-red-300 uppercase tracking-wide">
                                Last Error
                            </p>
                            <p className="mb-0 mt-1 text-[11px] text-red-600 dark:text-red-400 leading-relaxed break-all">
                                {status.last_error}
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
