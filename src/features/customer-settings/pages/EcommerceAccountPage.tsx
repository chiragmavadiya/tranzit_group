import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Link2Off, Loader2, RefreshCw, Store, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConformationModal } from '@/components/common/ConformationModal';
import { useAppSelector } from '@/hooks/store.hooks';
import { QUERY_KEYS } from '@/constants/api.constants';
import { cn } from '@/lib/utils';
import {
    useDisconnectIntegration,
    useIntegrationStatus,
    useIntegrationsList,
    useSyncIntegration
} from '@/features/integrations/hooks/useIntegrations';
import ProviderAccountSettings from '@/features/integrations/components/ProviderAccountSettings';
import ParcelDefaultsCard from '@/features/integrations/components/ParcelDefaultsCard';
import ShopifyShippingMethods from '@/features/integrations/components/ShopifyShippingMethods';
import { findEcommercePlatform, PARCEL_DEFAULT_PROVIDERS } from '@/features/integrations/constants';
import {
    toAccounts,
    hasParcelDefaults,
    getAccountDisplayName,
    getAccountSubtitle
} from '@/features/integrations/utils';

export default function EcommerceAccountPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { provider = '', accountId = '' } = useParams<{ provider: string; accountId: string }>();

    const { is_sub_user, team_access } = useAppSelector((state) => state.auth);
    const canReadWrite = useMemo(
        () => !is_sub_user || team_access?.permissions?.settings_integrations === 'full',
        [is_sub_user, team_access]
    );

    const [isConfirmDisconnectOpen, setIsConfirmDisconnectOpen] = useState(false);

    const platform = findEcommercePlatform(provider);
    const { data: listResponse } = useIntegrationsList();
    const { data: statusResponse, isLoading } = useIntegrationStatus(provider);

    const connection = listResponse?.data?.ecommerce_connections?.find((item: any) => item.slug === provider);

    const account = useMemo(() => {
        const accounts = toAccounts(provider, statusResponse?.data);
        // The id comes from the URL, so compare as strings.
        return accounts.find((item: any) => String(item.id) === String(accountId)) ?? null;
    }, [provider, statusResponse, accountId]);

    const accountWithSlug = useMemo(
        () => (account ? { ...account, platformSlug: provider } : null),
        [account, provider]
    );

    const { mutate: sync, isPending: isSyncing } = useSyncIntegration();
    const disconnectMutation = useDisconnectIntegration();

    /** Writes an optimistic change straight into the cached status response. */
    const patchAccount = useCallback((patch: Record<string, any>) => {
        queryClient.setQueryData(QUERY_KEYS.INTEGRATIONS.STATUS(provider), (previous: any) => {
            if (!previous?.data) return previous;
            const applyTo = (item: any) => (String(item?.id) === String(accountId) ? { ...item, ...patch } : item);
            return {
                ...previous,
                data: {
                    ...previous.data,
                    ...(String(previous.data.id) === String(accountId) ? patch : {}),
                    ...(previous.data.stores ? { stores: previous.data.stores.map(applyTo) } : {}),
                    ...(previous.data.accounts ? { accounts: previous.data.accounts.map(applyTo) } : {}),
                    ...(previous.data.store ? { store: applyTo(previous.data.store) } : {}),
                    ...(previous.data.account ? { account: applyTo(previous.data.account) } : {})
                }
            };
        });
    }, [queryClient, provider, accountId]);

    const handleDisconnect = () => {
        disconnectMutation.mutate({ provider, id: accountId }, {
            onSuccess: () => {
                setIsConfirmDisconnectOpen(false);
                navigate('/settings/ecommerce');
            }
        });
    };

    const needsParcelDefaults = PARCEL_DEFAULT_PROVIDERS.includes(provider) && !!account && !hasParcelDefaults(account);
    const hasSyncError = !!account?.last_sync_error;

    const statusBadge = hasSyncError
        ? { label: "Connection issue", className: "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30" }
        : needsParcelDefaults
            ? { label: "Setup incomplete", className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30" }
            : { label: "Connected", className: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30" };

    return (
        <div className="flex flex-col gap-6 min-h-[calc(100vh-120px)]">
            <div className="bg-white p-page-padding dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm flex flex-col flex-1 min-h-[calc(100vh-120px)]">

                <Button
                    onClick={() => navigate('/settings/ecommerce')}
                    variant="ghost"
                    size="sm"
                    className="self-start flex gap-2 items-center py-4 text-xs font-semibold group/btn"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover/btn:-translate-x-1 transition-transform" />
                    Back to integrations
                </Button>

                {isLoading ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        <span className="text-sm text-slate-500 dark:text-zinc-400 font-medium">Loading configuration...</span>
                    </div>
                ) : !accountWithSlug ? (
                    <div className="flex flex-1 flex-col items-center justify-center text-center gap-3 py-16">
                        <AlertCircle className="w-10 h-10 text-slate-300 dark:text-zinc-700" />
                        <h1 className="my-0 text-base font-bold text-slate-800 dark:text-zinc-200">This integration is no longer connected</h1>
                        <p className="my-0 text-xs text-slate-500 dark:text-zinc-400 max-w-sm">
                            It may have been disconnected from another device or from the {platform?.name || provider} side.
                        </p>
                        <Button onClick={() => navigate('/settings/ecommerce')} className="h-8 text-xs font-bold mt-2">
                            Back to integrations
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 mt-2 border-b border-slate-100 dark:border-zinc-800">
                            <div className="flex items-start gap-4 min-w-0">
                                <div className="w-14 h-14 rounded-xl bg-white dark:bg-zinc-950 p-2 border border-slate-100 dark:border-zinc-800/80 flex items-center justify-center shrink-0 shadow-xs">
                                    {connection?.logo_url
                                        ? <img src={connection.logo_url} alt="" className="h-full w-full object-contain" />
                                        : <Store className="w-6 h-6 text-primary" />}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                        <h1 className="my-0 text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
                                            {getAccountDisplayName(accountWithSlug)}
                                        </h1>
                                        <Badge
                                            variant="outline"
                                            className={cn("font-semibold text-[11px] py-1 px-2.5 rounded-full shrink-0", statusBadge.className)}
                                        >
                                            {statusBadge.label}
                                        </Badge>
                                    </div>
                                    <p className="my-0 text-sm text-slate-500 dark:text-zinc-400 mt-1">
                                        {[platform?.name || connection?.name, getAccountSubtitle(accountWithSlug)].filter(Boolean).join(' · ')}
                                    </p>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs font-bold gap-2 shrink-0 self-start"
                                onClick={() => sync({ provider, id: accountId })}
                                disabled={isSyncing}
                            >
                                {isSyncing ? <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" /> : <RefreshCw className="w-3.5 h-3.5" />}
                                Sync orders now
                            </Button>
                        </div>

                        <div className="flex flex-col gap-6 mt-6">
                            <ProviderAccountSettings
                                provider={provider}
                                account={account}
                                canReadWrite={canReadWrite}
                                onPatch={patchAccount}
                            />

                            {PARCEL_DEFAULT_PROVIDERS.includes(provider) && (
                                <ParcelDefaultsCard
                                    account={account}
                                    provider={provider as 'shopify' | 'shopline'}
                                    canReadWrite={canReadWrite}
                                    isRequired={needsParcelDefaults}
                                />
                            )}

                            {provider === 'shopify' && (
                                <ShopifyShippingMethods
                                    storeId={account.id}
                                    methods={account.shipping_methods}
                                    canReadWrite={canReadWrite}
                                />
                            )}

                            {canReadWrite && (
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-red-200 dark:border-red-900/30 rounded-xl bg-red-50/40 dark:bg-red-950/10 p-4">
                                    <div className="space-y-0.5">
                                        <h3 className="my-0 text-sm font-bold text-red-700 dark:text-red-400">Disconnect this {platform?.noun || 'account'}</h3>
                                        <p className="my-0 text-xs text-red-600/90 dark:text-red-400/80 leading-relaxed">
                                            Orders already in Tranzit are kept. No new orders are imported and tracking stops flowing back.
                                        </p>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="h-8 text-xs font-bold gap-2 shrink-0 self-start sm:self-auto"
                                        onClick={() => setIsConfirmDisconnectOpen(true)}
                                    >
                                        <Link2Off className="w-3.5 h-3.5" />
                                        Disconnect
                                    </Button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <ConformationModal
                open={isConfirmDisconnectOpen}
                onOpenChange={setIsConfirmDisconnectOpen}
                title="Disconnect Integration"
                description={`Are you sure you want to disconnect ${accountWithSlug ? getAccountDisplayName(accountWithSlug) : 'this integration'}? This will stop syncing your orders.`}
                onConfirm={handleDisconnect}
                onCancel={() => setIsConfirmDisconnectOpen(false)}
                confirmText="Disconnect"
                cancelText="Cancel"
                confirmVariant="destructive"
                className="w-full"
                loading={disconnectMutation.isPending}
            />
        </div>
    );
}
