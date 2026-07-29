import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConformationModal } from '@/components/common/ConformationModal';
import { showToast } from '@/components/ui/custom-toast';
import { Loader2, RefreshCw } from 'lucide-react';
import { XeroMark } from '../components/XeroMark';
import { XeroConnectionCard } from '../components/XeroConnectionCard';
import { XeroConnectionDetails } from '../components/XeroConnectionDetails';
import { useXeroConnect, useXeroDisconnect, useXeroStatus } from '../hooks/useXero';
import type { XeroStatus } from '../types';

const AUTH_TIMEOUT_MS = 5 * 60 * 1000;

// A fresh authorisation always moves at least one of these, so comparing against the
// snapshot taken when the flow started detects a reconnect the same way it detects a
// first-time connect (where `connected` alone would flip false -> true).
const authSignature = (status?: XeroStatus) =>
    [
        status?.connected,
        status?.tenant_id,
        status?.connected_at,
        status?.last_refreshed_at,
        status?.token_expires_at,
    ].join('|');

export default function XeroIntegrationPage() {
    const [awaitingAuth, setAwaitingAuth] = useState(false);
    const [disconnectOpen, setDisconnectOpen] = useState(false);
    const popupRef = useRef<Window | null>(null);
    const authBaseline = useRef<{ signature: string; wasConnected: boolean } | null>(null);

    const { data, isLoading, isFetching, refetch } = useXeroStatus({ refetchInterval: awaitingAuth ? 3000 : false });
    const { mutate: connect, isPending: isConnecting } = useXeroConnect();
    const { mutate: disconnect, isPending: isDisconnecting } = useXeroDisconnect();

    const status = data?.data;

    const stopWaiting = () => {
        setAwaitingAuth(false);
        popupRef.current?.close();
        popupRef.current = null;
        authBaseline.current = null;
    };

    // Close the popup as soon as a poll shows the authorisation landed.
    useEffect(() => {
        const baseline = authBaseline.current;
        if (!awaitingAuth || !baseline || !status) return;
        if (authSignature(status) === baseline.signature) return;

        showToast(
            baseline.wasConnected ? 'Xero reconnected successfully' : 'Xero connected successfully',
            'success'
        );
        stopWaiting();
    }, [awaitingAuth, status]);

    // Stop polling once the authorisation window is gone or the flow is abandoned.
    useEffect(() => {
        if (!awaitingAuth) return;

        let settleTimer: ReturnType<typeof setTimeout> | undefined;

        const timeout = setTimeout(() => {
            stopWaiting();
            showToast('Xero authorisation was not completed. Please try again.', 'warning');
        }, AUTH_TIMEOUT_MS);

        const watcher = setInterval(() => {
            if (!popupRef.current || !popupRef.current.closed) return;
            // Popup is gone: take one last look at the status before dropping out of waiting mode,
            // so a manually closed window still reports the result.
            popupRef.current = null;
            refetch();
            settleTimer = setTimeout(stopWaiting, 2000);
        }, 1000);

        return () => {
            clearTimeout(timeout);
            clearInterval(watcher);
            if (settleTimer) clearTimeout(settleTimer);
        };
    }, [awaitingAuth, refetch]);

    const handleConnect = () => {
        // Opened synchronously on the click so the browser does not treat it as a blocked popup.
        const popup = window.open('', 'xero-oauth', 'width=620,height=760,menubar=no,toolbar=no');

        connect(undefined, {
            onSuccess: (response) => {
                const authorizationUrl = response?.data?.authorization_url;
                if (!authorizationUrl) {
                    popup?.close();
                    showToast('Xero did not return an authorization URL', 'error');
                    return;
                }
                if (popup) {
                    popup.location.href = authorizationUrl;
                    popup.focus();
                    popupRef.current = popup;
                    authBaseline.current = {
                        signature: authSignature(status),
                        wasConnected: !!status?.connected,
                    };
                    setAwaitingAuth(true);
                } else {
                    window.location.href = authorizationUrl;
                }
            },
            onError: () => popup?.close(),
        });
    };

    const handleDisconnect = () => {
        disconnect(undefined, {
            onSuccess: () => setDisconnectOpen(false),
        });
    };

    return (
        <div className="flex flex-col flex-1 gap-4 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <XeroMark className="w-10 h-10" />
                    <div>
                        <h1 className="my-0 text-xl font-bold text-slate-900 dark:text-white">Xero Integration</h1>
                        <p className="mb-0 text-xs text-slate-500 dark:text-zinc-400">
                            Link your Xero organisation to sync invoices and contacts
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="h-8 gap-2 text-xs font-bold"
                >
                    <RefreshCw className={isFetching ? 'w-3.5 h-3.5 animate-spin' : 'w-3.5 h-3.5'} />
                    Refresh Status
                </Button>
            </div>

            {awaitingAuth && (
                <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2.5">
                        <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                        <p className="my-0 text-xs font-semibold text-primary">
                            Waiting for authorisation — complete the sign in inside the Xero window.
                        </p>
                    </div>
                    <button
                        onClick={stopWaiting}
                        className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100 bg-transparent border-0 cursor-pointer p-0"
                    >
                        Cancel
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
                <div className="xl:col-span-5">
                    <XeroConnectionCard
                        status={status}
                        isLoading={isLoading}
                        isConnecting={isConnecting || awaitingAuth}
                        isDisconnecting={isDisconnecting}
                        onConnect={handleConnect}
                        onDisconnect={() => setDisconnectOpen(true)}
                    />
                </div>
                <div className="xl:col-span-7">
                    <XeroConnectionDetails status={status} isLoading={isLoading} />
                </div>
            </div>

            <ConformationModal
                open={disconnectOpen}
                onOpenChange={setDisconnectOpen}
                title="Disconnect Xero"
                description={`This removes the stored Xero tokens${status?.organisation_name ? ` for ${status.organisation_name}` : ''}. Invoices and contacts will stop syncing until you connect again.`}
                onConfirm={handleDisconnect}
                confirmText="Disconnect"
                confirmVariant="destructive"
                loading={isDisconnecting}
            />
        </div>
    );
}
