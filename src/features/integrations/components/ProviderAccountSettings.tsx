import type { ReactNode } from 'react';
import { format } from 'date-fns';
import { AlertCircle, Activity, User, Mail, Phone, Globe, MapPin, Copy, ExternalLink } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { cn } from '@/lib/utils';
import ShopifyLiveRatesSettings from './ShopifyLiveRatesSettings';
import { toParcelDraft, parseSyncError, getStoreUrl } from '../utils';
import {
    useToggleEbayAutoSync,
    useToggleEbayAutoFulfillment,
    useToggleShopifyAutoFulfillment,
    useToggleShopifyLiveRates,
    useToggleSquarespaceAutoFulfillment,
    useToggleShoplineAutoSync,
    useToggleShoplineAutoFulfillment,
    useToggleEtsyAutoSync,
    useToggleEtsyAutoFulfillment
} from '../hooks/useIntegrations';

interface ProviderAccountSettingsProps {
    provider: string;
    account: any;
    canReadWrite: boolean;
    /** Applies an optimistic change to the cached account, so a toggle reads back immediately. */
    onPatch: (patch: Record<string, any>) => void;
}

const dateLabel = (value?: string) => (value ? format(new Date(value), 'dd MMM yyyy, hh:mm a') : null);

const DetailField = ({ label, value }: { label: string; value?: ReactNode }) => (
    <div className="space-y-1">
        <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide block">{label}</span>
        <div className="text-sm font-semibold text-slate-700 dark:text-zinc-200 truncate">{value || "-"}</div>
    </div>
);

/** The provider's failure, said plainly. The raw payload is never put in front of the customer. */
const SyncErrorAlert = ({ message }: { message: string }) => {
    const error = parseSyncError(message);
    if (!error) return null;

    return (
        <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/15 border border-red-200 dark:border-red-900/30 rounded-xl text-red-800 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
                <h5 className="my-0 font-bold text-xs">Orders could not be imported</h5>
                <p className="my-0 text-xs mt-1 font-semibold text-red-700/90 dark:text-red-400/90">{error.title}</p>
                {error.action && (
                    <p className="my-0 text-xs mt-1 text-red-700/80 dark:text-red-400/80 leading-relaxed">{error.action}</p>
                )}
            </div>
        </div>
    );
};

/** Last success and last attempt are different facts; showing only one hides an ongoing failure. */
const SyncTimeline = ({ account }: { account: any }) => {
    const lastSuccess = dateLabel(account.last_synced_at);
    const lastAttempt = dateLabel(account.last_sync_attempt_at);
    const failed = !!account.last_sync_error;

    return (
        <>
            <DetailField label="Last Successful Sync" value={lastSuccess || "Never"} />
            {lastAttempt && lastAttempt !== lastSuccess && (
                <DetailField
                    label="Last Attempt"
                    value={
                        <span className={failed ? "text-red-600 dark:text-red-400" : undefined}>
                            {lastAttempt}{failed ? " · failed" : ` · imported ${account.last_sync_import_count ?? 0}`}
                        </span>
                    }
                />
            )}
        </>
    );
};

const SettingRow = ({
    label,
    description,
    checked,
    onChange,
    disabled
}: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled: boolean;
}) => (
    <div className="flex items-center justify-between gap-4 p-3 bg-slate-50/60 dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-800/60 rounded-xl">
        <div className="space-y-0.5">
            <label className="text-sm font-bold text-slate-800 dark:text-zinc-200">{label}</label>
            <p className="my-0 text-xs text-slate-500 dark:text-zinc-400">{description}</p>
        </div>
        <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
);

const SectionHeading = ({ title }: { title: string }) => (
    <h3 className="my-0 text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">{title}</h3>
);

/** A setting the API reports but has no endpoint to change, so it reads rather than toggles. */
const ReadOnlySetting = ({ label, description, enabled }: { label: string; description: string; enabled: boolean }) => (
    <div className="flex items-center justify-between gap-4 p-3 bg-slate-50/60 dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-800/60 rounded-xl">
        <div className="space-y-0.5">
            <span className="block text-sm font-bold text-slate-800 dark:text-zinc-200">{label}</span>
            <p className="my-0 text-xs text-slate-500 dark:text-zinc-400">{description}</p>
        </div>
        <Badge
            variant="outline"
            className={cn(
                "font-semibold text-[11px] shrink-0",
                enabled
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
                    : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800"
            )}
        >
            {enabled ? "On" : "Off"}
        </Badge>
    </div>
);

const StoreLinkField = ({ account, label }: { account: any; label: string }) => {
    const url = getStoreUrl(account);
    if (!url) return null;
    const href = url.startsWith('http') ? url : `https://${url}`;
    return (
        <div className="space-y-1 min-w-0">
            <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide block">{label}</span>
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline min-w-0"
            >
                <span className="truncate">{url.replace(/^https?:\/\//, '')}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
        </div>
    );
};

/** What the provider holds against what actually made it into Tranzit. The gap is the useful bit. */
const OrderStats = ({ stats, providerName }: { stats?: any; providerName: string }) => {
    if (!stats) return null;
    const external = stats.external_orders ?? 0;
    const linked = stats.linked_portal_orders ?? 0;
    const missing = Math.max(external - linked, 0);

    return (
        <div className="space-y-2">
            <h4 className="my-0 text-xs font-bold text-slate-800 dark:text-zinc-200 tracking-wide flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-primary" />
                Orders
            </h4>
            <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800/80 rounded-xl">
                    <div className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">On {providerName}</div>
                    <div className="text-lg font-bold text-slate-800 dark:text-zinc-100 mt-1">{external}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800/80 rounded-xl">
                    <div className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">Imported into Tranzit</div>
                    <div className="text-lg font-bold text-slate-800 dark:text-zinc-100 mt-1">{linked}</div>
                </div>
            </div>
            {missing > 0 && (
                <p className="my-0 text-xs text-amber-700 dark:text-amber-400">
                    {missing} {missing === 1 ? 'order has' : 'orders have'} not been imported yet.
                </p>
            )}
        </div>
    );
};

/** The settings that differ per e-commerce provider, for one connected account. */
export default function ProviderAccountSettings({ provider, account, canReadWrite, onPatch }: ProviderAccountSettingsProps) {
    const { copy } = useCopyToClipboard('Webhook URL copied to clipboard');

    const shopifyFulfillment = useToggleShopifyAutoFulfillment();
    const shopifyLiveRates = useToggleShopifyLiveRates();
    const ebaySync = useToggleEbayAutoSync();
    const ebayFulfillment = useToggleEbayAutoFulfillment();
    const squarespaceFulfillment = useToggleSquarespaceAutoFulfillment();
    const shoplineSync = useToggleShoplineAutoSync();
    const shoplineFulfillment = useToggleShoplineAutoFulfillment();
    const etsySync = useToggleEtsyAutoSync();
    const etsyFulfillment = useToggleEtsyAutoFulfillment();

    /** Flips the cached value first and rolls it back if the request fails. */
    const optimistic = (
        mutate: (variables: any, options: any) => void,
        variables: any,
        field: string,
        checked: boolean
    ) => {
        onPatch({ [field]: checked });
        mutate(variables, { onError: () => onPatch({ [field]: !checked }) });
    };

    const syncError = account?.last_sync_error;

    switch (provider) {
        case 'shopify':
            return (
                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailField label="Store Owner Email" value={account.shop_owner_email} />
                        <DetailField label="Installed On" value={dateLabel(account.installed_at)} />
                    </div>

                    {canReadWrite && (
                        <>
                            <SectionHeading title="Orders & Fulfillment" />
                            <SettingRow
                                label="Auto-fulfillment"
                                description="Send tracking to Shopify automatically once the order is Printed."
                                checked={account.auto_fulfillment_enabled ?? false}
                                disabled={shopifyFulfillment.isPending}
                                onChange={(checked) => optimistic(
                                    shopifyFulfillment.mutate,
                                    { enabled: checked, storeId: account.id },
                                    'auto_fulfillment_enabled',
                                    checked
                                )}
                            />

                            <SectionHeading title="Checkout" />
                            <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                                <div className="p-3 bg-slate-50/60 dark:bg-zinc-900/40">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="space-y-0.5">
                                            <label className="text-sm font-bold text-slate-800 dark:text-zinc-200">Live Checkout Rates</label>
                                            <p className="my-0 text-xs text-slate-500 dark:text-zinc-400">
                                                Show real-time shipping rates to shoppers at your Shopify checkout.
                                            </p>
                                        </div>
                                        <Switch
                                            checked={account.live_rates_enabled ?? false}
                                            disabled={shopifyLiveRates.isPending}
                                            onCheckedChange={(checked) => optimistic(
                                                shopifyLiveRates.mutate,
                                                { enabled: checked, storeId: account.id },
                                                'live_rates_enabled',
                                                checked
                                            )}
                                        />
                                    </div>
                                </div>
                                {account.live_rates_enabled && (
                                    <div className="p-3 border-t border-slate-200 dark:border-zinc-800">
                                        <ShopifyLiveRatesSettings
                                            storeId={account.id}
                                            enabled={!!account.live_rates_enabled}
                                            canReadWrite={canReadWrite}
                                            parcelDefaults={toParcelDraft(account)}
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            );

        case 'woocommerce':
            return (
                <div className="grid grid-cols-1 gap-4">
                    <DetailField label="Store URL" value={account.store_url} />
                    {account.webhook_url && (
                        <DetailField
                            label="Webhook URL"
                            value={
                                <span className="flex items-center gap-2">
                                    <span className="truncate">{account.webhook_url}</span>
                                    <button
                                        type="button"
                                        onClick={() => copy(account.webhook_url)}
                                        className="shrink-0 text-slate-400 hover:text-primary transition-colors bg-transparent border-0 cursor-pointer p-0"
                                        aria-label="Copy webhook URL"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                </span>
                            }
                        />
                    )}
                </div>
            );

        case 'ebay': {
            const meta = account.meta || {};
            const userInfo = meta.user_info || {};
            const businessAccount = userInfo.businessAccount || {};
            const address = businessAccount.address || {};
            const primaryContact = businessAccount.primaryContact || {};
            const primaryPhone = businessAccount.primaryPhone || {};
            const stats = account.stats || {};
            const formattedAddress = [address.addressLine1, address.city, address.stateOrProvince, address.postalCode, address.country]
                .filter(Boolean).join(', ');

            return (
                <div className="space-y-5">
                    {syncError && <SyncErrorAlert message={syncError} />}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailField label="Connected On" value={dateLabel(account.created_at)} />
                        <SyncTimeline account={account} />
                    </div>

                    <OrderStats stats={stats} providerName="eBay" />

                    {userInfo.username && (
                        <div className="space-y-2">
                            <h4 className="my-0 text-xs font-bold text-slate-800 dark:text-zinc-200 tracking-wide flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-primary" />
                                eBay Seller Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-4">
                                <DetailField label="Username" value={`${userInfo.username} (${userInfo.accountType || "Individual"})`} />
                                {businessAccount.name && (
                                    <DetailField
                                        label="Business Entity"
                                        value={`${businessAccount.name}${businessAccount.doingBusinessAs ? ` (DBA: ${businessAccount.doingBusinessAs})` : ""}`}
                                    />
                                )}
                                {(primaryContact.firstName || businessAccount.email) && (
                                    <div className="space-y-1 md:col-span-2 pt-3 border-t border-slate-100 dark:border-zinc-800/60">
                                        <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide block">Primary Contact</span>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                                            {primaryContact.firstName && (
                                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-zinc-200">
                                                    <User className="w-3.5 h-3.5 text-slate-400 animate-none" />
                                                    <span>{primaryContact.firstName} {primaryContact.lastName || ""}</span>
                                                </div>
                                            )}
                                            {businessAccount.email && (
                                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-zinc-200">
                                                    <Mail className="w-3.5 h-3.5 text-slate-400 animate-none" />
                                                    <span className="truncate">{businessAccount.email}</span>
                                                </div>
                                            )}
                                            {primaryPhone.number && (
                                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-zinc-200">
                                                    <Phone className="w-3.5 h-3.5 text-slate-400 animate-none" />
                                                    <span>{primaryPhone.countryCode ? `+${primaryPhone.countryCode} ` : ""}{primaryPhone.number}</span>
                                                </div>
                                            )}
                                            {userInfo.registrationMarketplaceId && (
                                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-zinc-200">
                                                    <Globe className="w-3.5 h-3.5 text-slate-400 animate-none" />
                                                    <span>Marketplace: {userInfo.registrationMarketplaceId}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {formattedAddress && (
                                    <div className="space-y-1 md:col-span-2 pt-3 border-t border-slate-100 dark:border-zinc-800/60">
                                        <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide block">Registered Address</span>
                                        <div className="flex items-start gap-2 text-sm font-semibold text-slate-700 dark:text-zinc-200 mt-1">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5 animate-none" />
                                            <span>{formattedAddress}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {canReadWrite && (
                        <>
                            <SectionHeading title="Orders & Fulfillment" />
                            <SettingRow
                                label="Automatic Order Sync"
                                description="Import new orders from this eBay account periodically."
                                checked={account.ebay_auto_sync_enabled ?? false}
                                disabled={ebaySync.isPending}
                                onChange={(checked) => optimistic(
                                    ebaySync.mutate,
                                    { enabled: checked, accountId: account.id },
                                    'ebay_auto_sync_enabled',
                                    checked
                                )}
                            />
                            <SettingRow
                                label="Automatic Tracking Upload"
                                description="Upload tracking details to eBay once the order is shipped."
                                checked={account.ebay_auto_fulfillment_enabled ?? false}
                                disabled={ebayFulfillment.isPending}
                                onChange={(checked) => optimistic(
                                    ebayFulfillment.mutate,
                                    { enabled: checked, accountId: account.id },
                                    'ebay_auto_fulfillment_enabled',
                                    checked
                                )}
                            />
                        </>
                    )}
                </div>
            );
        }

        case 'squarespace':
            return (
                <div className="space-y-5">
                    {syncError && <SyncErrorAlert message={syncError} />}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <StoreLinkField account={account} label="Site Address" />
                        <DetailField label="Connected On" value={dateLabel(account.created_at)} />
                        <SyncTimeline account={account} />
                    </div>

                    <OrderStats stats={account.stats} providerName="Squarespace" />

                    {canReadWrite && (
                        <>
                            <SectionHeading title="Orders & Fulfillment" />
                            <ReadOnlySetting
                                label="Automatic Order Sync"
                                description="Squarespace orders are imported on a schedule. This cannot be turned off here."
                                enabled={account.squarespace_auto_sync_enabled ?? false}
                            />
                            <SettingRow
                                label="Auto-fulfillment"
                                description="Send tracking to Squarespace automatically once the order is Printed."
                                checked={account.squarespace_auto_fulfillment_enabled ?? false}
                                disabled={squarespaceFulfillment.isPending}
                                onChange={(checked) => optimistic(
                                    squarespaceFulfillment.mutate,
                                    { enabled: checked, accountId: account.id },
                                    'squarespace_auto_fulfillment_enabled',
                                    checked
                                )}
                            />
                        </>
                    )}
                </div>
            );

        case 'shopline':
            return (
                <div className="space-y-5">
                    {syncError && <SyncErrorAlert message={syncError} />}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <StoreLinkField account={account} label="Store URL" />
                        <DetailField label="Connected On" value={dateLabel(account.created_at)} />
                        <SyncTimeline account={account} />
                    </div>

                    <OrderStats stats={account.stats} providerName="Shopline" />

                    {canReadWrite && (
                        <>
                            <SectionHeading title="Orders & Fulfillment" />
                            <SettingRow
                                label="Automatic Order Sync"
                                description="Import new orders from this Shopline account periodically."
                                checked={account.shopline_auto_sync_enabled ?? false}
                                disabled={shoplineSync.isPending}
                                onChange={(checked) => optimistic(
                                    shoplineSync.mutate,
                                    { enabled: checked, accountId: account.id },
                                    'shopline_auto_sync_enabled',
                                    checked
                                )}
                            />
                            <SettingRow
                                label="Auto-fulfillment"
                                description="Send tracking to Shopline automatically once the order is Printed."
                                checked={account.shopline_auto_fulfillment_enabled ?? false}
                                disabled={shoplineFulfillment.isPending}
                                onChange={(checked) => optimistic(
                                    shoplineFulfillment.mutate,
                                    { enabled: checked, accountId: account.id },
                                    'shopline_auto_fulfillment_enabled',
                                    checked
                                )}
                            />
                        </>
                    )}
                </div>
            );

        case 'etsy': {
            // Older Etsy payloads carry the flags without the provider prefix.
            const syncField = account.etsy_auto_sync_enabled !== undefined ? 'etsy_auto_sync_enabled' : 'auto_sync_enabled';
            const fulfillmentField = account.etsy_auto_fulfillment_enabled !== undefined ? 'etsy_auto_fulfillment_enabled' : 'auto_fulfillment_enabled';

            return (
                <div className="space-y-5">
                    {syncError && <SyncErrorAlert message={syncError} />}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailField label="Connected On" value={dateLabel(account.created_at)} />
                        <SyncTimeline account={account} />
                    </div>

                    <OrderStats stats={account.stats} providerName="Etsy" />

                    {canReadWrite && (
                        <>
                            <SectionHeading title="Orders & Fulfillment" />
                            <SettingRow
                                label="Automatic Order Sync"
                                description="Import new orders from this Etsy account periodically."
                                checked={account[syncField] ?? false}
                                disabled={etsySync.isPending}
                                onChange={(checked) => optimistic(
                                    etsySync.mutate,
                                    { enabled: checked, accountId: account.id },
                                    syncField,
                                    checked
                                )}
                            />
                            <SettingRow
                                label="Auto-fulfillment"
                                description="Send tracking to Etsy automatically once the order is Printed."
                                checked={account[fulfillmentField] ?? false}
                                disabled={etsyFulfillment.isPending}
                                onChange={(checked) => optimistic(
                                    etsyFulfillment.mutate,
                                    { enabled: checked, accountId: account.id },
                                    fulfillmentField,
                                    checked
                                )}
                            />
                        </>
                    )}
                </div>
            );
        }

        default:
            return null;
    }
}
