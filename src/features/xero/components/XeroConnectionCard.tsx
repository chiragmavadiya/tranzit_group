import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Link2, Link2Off, Loader2, RefreshCw, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { XeroMark } from './XeroMark';
import { formatDateTime } from '../utils';
import type { XeroStatus } from '../types';

interface XeroConnectionCardProps {
    status?: XeroStatus;
    isLoading: boolean;
    isConnecting: boolean;
    isDisconnecting: boolean;
    onConnect: () => void;
    onDisconnect: () => void;
}

const DetailRow = ({ label, value }: { label: string; value?: string }) => (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 dark:border-zinc-900 last:border-b-0">
        <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide shrink-0">
            {label}
        </span>
        <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 truncate">
            {value || '-'}
        </span>
    </div>
);

export const XeroConnectionCard = ({
    status,
    isLoading,
    isConnecting,
    isDisconnecting,
    onConnect,
    onDisconnect,
}: XeroConnectionCardProps) => {
    const isConnected = !!status?.connected;
    const needsReconnect = isConnected && (!!status?.token_expired || !!status?.last_error);

    if (isLoading) {
        return (
            <Card className="p-6 flex flex-col gap-4 h-full">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-10 w-full mt-auto" />
            </Card>
        );
    }

    return (
        <Card className="p-6 flex flex-col h-full">
            <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-center gap-3 min-w-0">
                    <XeroMark className={cn('w-12 h-12 transition-all', !isConnected && 'grayscale opacity-60')} />
                    <div className="min-w-0">
                        <h3 className="my-0 text-base font-bold text-slate-900 dark:text-zinc-100 truncate">
                            {isConnected ? status?.organisation_name || 'Xero Organisation' : 'Xero Accounting'}
                        </h3>
                        <p className="mb-0 text-[11px] text-slate-500 dark:text-zinc-400">
                            {isConnected ? status?.tenant_type || 'ORGANISATION' : 'Not linked to any organisation'}
                        </p>
                    </div>
                </div>
                <div
                    className={cn(
                        'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide leading-[100%] shrink-0 border',
                        isConnected
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20'
                            : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800'
                    )}
                >
                    <span className={cn('w-1.5 h-1.5 rounded-full', isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400')} />
                    <span className="pt-[2px]">{isConnected ? 'Connected' : 'Not Connected'}</span>
                </div>
            </div>

            {isConnected ? (
                <div className="flex flex-col flex-1">
                    <div className="rounded-lg bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 px-3 py-1">
                        <DetailRow label="Connected By" value={status?.connected_by} />
                        <DetailRow label="Connected At" value={formatDateTime(status?.connected_at)} />
                        <DetailRow label="Last Refreshed" value={formatDateTime(status?.last_refreshed_at)} />
                    </div>

                    {needsReconnect && (
                        <div className="mt-4 flex gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <p className="mb-0 text-[10px] text-amber-700 dark:text-amber-300 leading-relaxed">
                                This connection needs attention. Re-authorise the organisation to restore synchronisation.
                            </p>
                        </div>
                    )}

                    <div className="mt-auto pt-5 flex gap-2">
                        <Button
                            variant="outline"
                            onClick={onConnect}
                            disabled={isConnecting || isDisconnecting}
                            className="flex-1 h-10 font-bold uppercase tracking-wide text-[11px]"
                        >
                            {isConnecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                            Reconnect
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onDisconnect}
                            disabled={isConnecting || isDisconnecting}
                            className="flex-1 h-10 font-bold uppercase tracking-wide text-[11px] text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-950/20"
                        >
                            {isDisconnecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Link2Off className="w-3.5 h-3.5" />}
                            Disconnect
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col flex-1">
                    <div className="flex flex-col items-center justify-center text-center gap-2 px-4 py-8 rounded-lg border border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-900/30">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center">
                            <Link2Off className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                        </div>
                        <p className="mb-0 text-sm font-bold text-slate-700 dark:text-zinc-300">No organisation linked</p>
                        <p className="mb-0 text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed max-w-[260px]">
                            Authorise Tranzit to access your Xero organisation to sync invoices and contacts automatically.
                        </p>
                    </div>

                    <div className="mt-auto pt-5">
                        <Button
                            onClick={onConnect}
                            disabled={isConnecting}
                            className="w-full h-10 font-bold uppercase tracking-wide text-[11px]"
                        >
                            {isConnecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Link2 className="w-3.5 h-3.5" />}
                            Connect to Xero
                        </Button>

                        <div className="mt-4 flex gap-2 p-3 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20">
                            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <p className="mb-0 text-[10px] text-primary leading-relaxed">
                                You will be redirected to Xero to sign in and approve access. Tokens are stored securely and
                                refreshed automatically.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};
