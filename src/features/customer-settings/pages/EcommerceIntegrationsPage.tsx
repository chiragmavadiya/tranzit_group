import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, Loader2, RefreshCw, Link2Off, Plus, Settings2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ConformationModal } from '@/components/common/ConformationModal';
import { DataTable } from '@/components/common/DataTable';
import { showToast, suspendToast } from '@/components/ui/custom-toast';
import { useAppSelector } from '@/hooks/store.hooks';
import { QUERY_KEYS } from '@/constants/api.constants';
import { cn } from '@/lib/utils';
import {
    useDisconnectIntegration,
    useIntegrationsList,
    useSyncIntegration,
    useToggleEbayAutoSync,
    useToggleEbayAutoFulfillment,
    useToggleShopifyAutoFulfillment,
    useToggleSquarespaceAutoFulfillment,
    useToggleShoplineAutoSync,
    useToggleShoplineAutoFulfillment,
    useToggleEtsyAutoSync,
    useToggleEtsyAutoFulfillment
} from '@/features/integrations/hooks/useIntegrations';
import EcommerceConnectDrawer from '@/features/integrations/components/EcommerceConnectDrawer';
import { getAccountDisplayName, getAccountSubtitle, isParcelSetupPending } from '@/features/integrations/utils';
import { PARCEL_DEFAULT_PROVIDERS } from '@/features/integrations/constants';

// Each provider reports its OAuth result back on its own query param.
const OAUTH_CALLBACKS = [
    { key: 'ebay_oauth', name: 'eBay' },
    { key: 'temu_oauth', name: 'Temu' },
    { key: 'squarespace_oauth', name: 'Squarespace' },
    { key: 'etsy_oauth', name: 'Etsy' },
    { key: 'amazon_oauth', name: 'Amazon' },
    { key: 'shopline_oauth', name: 'Shopline' },
];

const REALTIME_PROVIDERS = ['shopify', 'woocommerce'];

export default function EcommerceIntegrationsPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [accountToDisconnect, setAccountToDisconnect] = useState<any>(null);

    const { data: listResponse, isLoading: listLoading } = useIntegrationsList();
    const { is_sub_user, team_access } = useAppSelector((state) => state.auth);
    const canReadWrite = useMemo(
        () => !is_sub_user || team_access?.permissions?.settings_integrations === 'full',
        [is_sub_user, team_access]
    );

    const disconnectMutation = useDisconnectIntegration();
    const { mutate: manualSync, isPending: isSyncing, variables: syncVars } = useSyncIntegration();
    const ebaySync = useToggleEbayAutoSync();
    const ebayFulfillment = useToggleEbayAutoFulfillment();
    const shopifyFulfillment = useToggleShopifyAutoFulfillment();
    const squarespaceFulfillment = useToggleSquarespaceAutoFulfillment();
    const shoplineSync = useToggleShoplineAutoSync();
    const shoplineFulfillment = useToggleShoplineAutoFulfillment();
    const etsySync = useToggleEtsyAutoSync();
    const etsyFulfillment = useToggleEtsyAutoFulfillment();

    const openAccount = useCallback((slug: string, id: any) => {
        navigate(`/settings/ecommerce/${slug}/${id}`);
    }, [navigate]);

    // One row per connected account, not per provider.
    const connectedAccounts = useMemo(() => {
        const rows: any[] = [];
        listResponse?.data?.ecommerce_connections?.forEach((connection: any) => {
            if (!connection.connected || !connection.accounts) return;
            connection.accounts.forEach((account: any) => {
                rows.push({
                    ...account,
                    platformSlug: connection.slug,
                    platformName: connection.name,
                    platformLogo: connection.logo_url,
                });
            });
        });
        return rows;
    }, [listResponse]);

    const needsAttentionCount = useMemo(
        () => connectedAccounts.filter((row) =>
            row.last_sync_error || (PARCEL_DEFAULT_PROVIDERS.includes(row.platformSlug) && isParcelSetupPending(row))
        ).length,
        [connectedAccounts]
    );

    const handleConfirmDisconnect = () => {
        if (!accountToDisconnect) return;
        disconnectMutation.mutate(
            { provider: accountToDisconnect.platformSlug, id: accountToDisconnect.id },
            { onSuccess: () => setAccountToDisconnect(null) }
        );
    };

    const renderAutoSync = (row: any) => {
        const slug = row.platformSlug;
        if (slug === 'ebay') {
            return (
                <Switch
                    checked={row.ebay_auto_sync_enabled ?? false}
                    onCheckedChange={(checked) => ebaySync.mutate({ enabled: checked, accountId: row.id })}
                    disabled={!canReadWrite || (ebaySync.isPending && ebaySync.variables?.accountId === row.id)}
                    aria-label={`Auto-sync for ${getAccountDisplayName(row)}`}
                />
            );
        }
        if (slug === 'shopline') {
            return (
                <Switch
                    checked={row.shopline_auto_sync_enabled ?? false}
                    onCheckedChange={(checked) => shoplineSync.mutate({ enabled: checked, accountId: row.id })}
                    disabled={!canReadWrite || (shoplineSync.isPending && shoplineSync.variables?.accountId === row.id)}
                    aria-label={`Auto-sync for ${getAccountDisplayName(row)}`}
                />
            );
        }
        if (slug === 'etsy') {
            return (
                <Switch
                    checked={row.etsy_auto_sync_enabled ?? row.auto_sync_enabled ?? false}
                    onCheckedChange={(checked) => etsySync.mutate({ enabled: checked, accountId: row.id })}
                    disabled={!canReadWrite || (etsySync.isPending && etsySync.variables?.accountId === row.id)}
                    aria-label={`Auto-sync for ${getAccountDisplayName(row)}`}
                />
            );
        }
        // Shopify and WooCommerce push over a webhook, so there is nothing to switch.
        if (REALTIME_PROVIDERS.includes(slug)) {
            return (
                <Badge
                    variant="outline"
                    className="font-semibold text-[11px] bg-emerald-50/50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
                >
                    Realtime
                </Badge>
            );
        }
        // Squarespace polls on a schedule and reports the flag, but has no endpoint to change it.
        const scheduled = row.squarespace_auto_sync_enabled ?? false;
        return (
            <Badge
                variant="outline"
                className={cn(
                    "font-semibold text-[11px]",
                    scheduled
                        ? "bg-emerald-50/50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
                        : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800"
                )}
            >
                {scheduled ? "On" : "Off"}
            </Badge>
        );
    };

    const renderAutoFulfillment = (row: any) => {
        const slug = row.platformSlug;
        const label = `Auto-fulfilment for ${getAccountDisplayName(row)}`;
        if (slug === 'shopify') {
            return (
                <Switch
                    checked={row.auto_fulfillment_enabled ?? false}
                    onCheckedChange={(checked) => shopifyFulfillment.mutate({ enabled: checked, storeId: row.id })}
                    disabled={!canReadWrite || (shopifyFulfillment.isPending && shopifyFulfillment.variables?.storeId === row.id)}
                    aria-label={label}
                />
            );
        }
        if (slug === 'squarespace') {
            return (
                <Switch
                    checked={row.squarespace_auto_fulfillment_enabled ?? false}
                    onCheckedChange={(checked) => squarespaceFulfillment.mutate({ enabled: checked, accountId: row.id })}
                    disabled={!canReadWrite || (squarespaceFulfillment.isPending && squarespaceFulfillment.variables?.accountId === row.id)}
                    aria-label={label}
                />
            );
        }
        if (slug === 'ebay') {
            return (
                <Switch
                    checked={row.ebay_auto_fulfillment_enabled ?? false}
                    onCheckedChange={(checked) => ebayFulfillment.mutate({ enabled: checked, accountId: row.id })}
                    disabled={!canReadWrite || (ebayFulfillment.isPending && ebayFulfillment.variables?.accountId === row.id)}
                    aria-label={label}
                />
            );
        }
        if (slug === 'shopline') {
            return (
                <Switch
                    checked={row.shopline_auto_fulfillment_enabled ?? false}
                    onCheckedChange={(checked) => shoplineFulfillment.mutate({ enabled: checked, accountId: row.id })}
                    disabled={!canReadWrite || (shoplineFulfillment.isPending && shoplineFulfillment.variables?.accountId === row.id)}
                    aria-label={label}
                />
            );
        }
        if (slug === 'etsy') {
            return (
                <Switch
                    checked={row.etsy_auto_fulfillment_enabled ?? row.auto_fulfillment_enabled ?? false}
                    onCheckedChange={(checked) => etsyFulfillment.mutate({ enabled: checked, accountId: row.id })}
                    disabled={!canReadWrite || (etsyFulfillment.isPending && etsyFulfillment.variables?.accountId === row.id)}
                    aria-label={label}
                />
            );
        }
        return <span className="text-slate-400 dark:text-zinc-500">—</span>;
    };

    const columns = useMemo(() => [
        {
            header: 'Channel',
            key: 'platformSlug',
            cell: (_: any, row: any) => (
                <div
                    onClick={() => openAccount(row.platformSlug, row.id)}
                    className="flex items-center gap-3 cursor-pointer group/channel select-none min-w-0"
                >
                    <div className="w-14 h-12 rounded-xl bg-white p-1.5 border border-slate-100 dark:border-zinc-800/80 flex items-center justify-center shrink-0 shadow-sm group-hover/row:border-primary/50 transition-colors">
                        <img src={row.platformLogo} alt="" className="h-full w-full object-contain" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-slate-800 dark:text-zinc-200 truncate group-hover/channel:text-primary transition-colors">
                            {getAccountDisplayName(row)}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                            {[row.platformName, getAccountSubtitle(row)].filter(Boolean).join(' · ')}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: 'Status',
            key: 'status',
            cell: (_: any, row: any) => {
                if (row.last_sync_error) {
                    return (
                        <Badge
                            variant="outline"
                            className="font-semibold text-[11px] py-1 px-2.5 gap-1 bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30"
                            title={row.last_sync_error}
                        >
                            <AlertCircle className="w-3 h-3 stroke-[2.5]" />
                            Sync failed
                        </Badge>
                    );
                }
                if (PARCEL_DEFAULT_PROVIDERS.includes(row.platformSlug) && isParcelSetupPending(row)) {
                    return (
                        <Badge
                            variant="outline"
                            className="font-semibold text-[11px] py-1 px-2.5 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30"
                        >
                            Setup needed
                        </Badge>
                    );
                }
                return (
                    <Badge
                        variant="outline"
                        className="font-semibold text-[11px] py-1 px-2.5 gap-1 bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30"
                    >
                        <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse bg-green-400" />
                        Connected
                    </Badge>
                );
            }
        },
        { header: 'Auto Sync', key: 'auto_sync', cell: (_: any, row: any) => renderAutoSync(row) },
        { header: 'Auto Fulfillment', key: 'auto_fulfillment', cell: (_: any, row: any) => renderAutoFulfillment(row) },
        {
            header: 'Last Synced',
            key: 'last_synced_at',
            // A failing account keeps attempting, so the attempt time must never read as a success.
            cell: (_: any, row: any) => (
                <div className="flex flex-col gap-0.5 items-start">
                    <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        {row.last_synced_at
                            ? format(new Date(row.last_synced_at), 'dd MMM yyyy, hh:mm a')
                            : "Never"}
                    </span>
                    {row.last_sync_error && row.last_sync_attempt_at && (
                        <span className="text-[11px] font-semibold text-red-600 dark:text-red-400">
                            Failed {format(new Date(row.last_sync_attempt_at), 'dd MMM, hh:mm a')}
                        </span>
                    )}
                </div>
            )
        },
        {
            header: '',
            key: 'actions',
            className: '',
            width: '200px',
            static: '',
            cell: (_: any, row: any) => {
                const syncInProgress = isSyncing && syncVars?.id === row.id && syncVars?.provider === row.platformSlug;
                return (
                    <div className="flex items-center justify-end gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-slate-200 dark:border-zinc-850 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900"
                            onClick={() => manualSync({ provider: row.platformSlug, id: row.id })}
                            disabled={syncInProgress}
                            title="Sync Orders Now"
                            aria-label={`Sync orders for ${getAccountDisplayName(row)}`}
                        >
                            {syncInProgress
                                ? <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                : <RefreshCw className="w-4 h-4" />}
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs font-bold border-slate-200 dark:border-zinc-850 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 gap-1.5"
                            onClick={() => openAccount(row.platformSlug, row.id)}
                            title="Configure Account"
                        >
                            <Settings2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Configure</span>
                        </Button>

                        {canReadWrite && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                onClick={() => setAccountToDisconnect(row)}
                                title="Disconnect Integration"
                                aria-label={`Disconnect ${getAccountDisplayName(row)}`}
                            >
                                <Link2Off className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                );
            }
        }
    ], [canReadWrite, openAccount, manualSync, isSyncing, syncVars, renderAutoSync, renderAutoFulfillment]);

    // Handles the params providers redirect back to, plus the legacy `?configure=` deep link.
    useEffect(() => {
        const configureProvider = searchParams.get('configure');
        if (configureProvider) {
            const storeId = searchParams.get('store_id');
            if (storeId) navigate(`/settings/ecommerce/${configureProvider}/${storeId}`, { replace: true });
            else setSearchParams('', { replace: true });
            return;
        }

        const shopifyStatus = searchParams.get('shopify');
        if (shopifyStatus) {
            const message = searchParams.get('message');
            if (shopifyStatus === 'connected') {
                showToast(message || "Shopify account connected successfully.", "success");
            } else if (shopifyStatus === 'already_connected') {
                showToast(message || "Shopify account is already connected.", "warning");
            } else if (shopifyStatus === 'error') {
                showToast(message || "Failed to connect Shopify account.", "error");
            }
            suspendToast();
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.LIST });
            setSearchParams('', { replace: true });
            return;
        }

        for (const item of OAUTH_CALLBACKS) {
            const status = searchParams.get(item.key);
            if (!status) continue;
            const message = searchParams.get('message');
            if (status === 'success') {
                showToast(message || `${item.name} account connected successfully.`, "success");
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTEGRATIONS.LIST });
            } else if (status === 'error') {
                showToast(message || `Failed to connect ${item.name} account.`, "error");
            }
            suspendToast();
            setSearchParams('', { replace: true });
            return;
        }
    }, [searchParams, setSearchParams, navigate, queryClient]);

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white p-page-padding dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm flex flex-col min-h-[calc(100vh-120px)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-zinc-100 my-0">
                            <ShoppingCart className="w-6 h-6 text-primary" />
                            E-commerce Integrations
                        </h1>
                        <p className="mb-0 text-sm text-slate-500 dark:text-zinc-400">
                            Connect your stores and marketplaces so orders flow into Tranzit automatically.
                        </p>
                        {!listLoading && connectedAccounts.length > 0 && (
                            <div className="flex items-center gap-3 mt-2">
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-zinc-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    {connectedAccounts.length} {connectedAccounts.length === 1 ? 'channel' : 'channels'} connected
                                </span>
                                {needsAttentionCount > 0 && (
                                    <>
                                        <span className="w-px h-3 bg-slate-200 dark:bg-zinc-800" />
                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            {needsAttentionCount} needs attention
                                        </span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    {canReadWrite && !listLoading && connectedAccounts.length > 0 && (
                        <Button onClick={() => setIsAddOpen(true)} className="h-8 text-xs font-bold gap-2 self-start sm:self-auto">
                            <Plus className="w-4 h-4" />
                            Connect Integration
                        </Button>
                    )}
                </div>

                <div className="flex-1 flex flex-col min-h-0 mt-4">
                    {listLoading || connectedAccounts.length > 0 ? (
                        <div className="overflow-hidden bg-white dark:bg-zinc-950">
                            <DataTable
                                columns={columns}
                                data={connectedAccounts}
                                loading={listLoading}
                                pagination={false}
                                searchable={false}
                                exportable={false}
                                header={false}
                                totalItems={connectedAccounts.length}
                            />
                        </div>
                    ) : (
                        <div className={cn(
                            "flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl",
                            "bg-slate-50/50 dark:bg-zinc-900/30 border border-dashed border-slate-200 dark:border-zinc-800"
                        )}>
                            <ShoppingCart className="w-12 h-12 text-slate-300 dark:text-zinc-700 mb-4 stroke-[1.5]" />
                            <h3 className="text-base font-bold text-slate-800 dark:text-zinc-200 mb-1">No sales channels connected yet</h3>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mb-6">
                                Connect Shopify, eBay, WooCommerce, Etsy, Squarespace or Shopline and your orders will
                                appear in Tranzit ready to ship.
                            </p>
                            {canReadWrite && (
                                <Button onClick={() => setIsAddOpen(true)} className="h-8 text-xs font-bold gap-2">
                                    <Plus className="w-4 h-4" />
                                    Connect Integration
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <EcommerceConnectDrawer
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                connections={listResponse?.data?.ecommerce_connections}
            />

            <ConformationModal
                open={!!accountToDisconnect}
                onOpenChange={(open) => { if (!open) setAccountToDisconnect(null); }}
                title="Disconnect Integration"
                description={`Are you sure you want to disconnect ${accountToDisconnect ? getAccountDisplayName(accountToDisconnect) : 'this integration'}? This will stop syncing your orders.`}
                onConfirm={handleConfirmDisconnect}
                onCancel={() => setAccountToDisconnect(null)}
                confirmText="Disconnect"
                cancelText="Cancel"
                confirmVariant="destructive"
                className="w-full"
                loading={disconnectMutation.isPending}
            />
        </div>
    );
}
