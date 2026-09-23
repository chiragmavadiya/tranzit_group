import { useState } from 'react';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConformationModal } from '@/components/common/ConformationModal';
import { useDeleteShopifyShippingMethod, useRefreshShopifyShippingMethods } from '../hooks/useIntegrations';
import type { ShopifyShippingMethod } from '../types';

interface ShopifyShippingMethodsProps {
    storeId: string | number;
    methods?: ShopifyShippingMethod[];
    canReadWrite: boolean;
}

/** Rate providers registered on the Shopify store. Removing one deletes it from Shopify itself. */
export default function ShopifyShippingMethods({ storeId, methods }: ShopifyShippingMethodsProps) {
    const [methodToRemove, setMethodToRemove] = useState<ShopifyShippingMethod | null>(null);
    const { mutate: removeMethod, isPending } = useDeleteShopifyShippingMethod();
    const { mutate: refreshMethods, isPending: isRefreshing } = useRefreshShopifyShippingMethods();

    const handleConfirm = () => {
        if (!methodToRemove) return;
        removeMethod(methodToRemove.id, {
            onSuccess: () => setMethodToRemove(null)
        });
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
                <h3 className="my-0 text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
                    Shipping methods on this store
                </h3>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px] font-bold gap-1.5 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300"
                    onClick={() => refreshMethods(storeId)}
                    disabled={isRefreshing}
                    title="Re-read the shipping methods from Shopify"
                >
                    {isRefreshing
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                        : <RefreshCw className="w-3.5 h-3.5" />}
                    Refresh
                </Button>
            </div>

            <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-zinc-800/80">
                    <p className="my-0 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-3xl">
                        Rate providers registered on your Shopify store.
                        {/* Removing one{' '}
                        <span className="font-semibold text-slate-700 dark:text-zinc-300">deletes it from Shopify</span>,
                        not just from Tranzit — shoppers stop seeing the options it was serving at checkout. */}
                    </p>
                </div>

                {!methods?.length ? (
                    <p className="my-0 px-4 py-6 text-xs text-slate-500 dark:text-zinc-400 text-center">
                        No shipping methods are registered on this store yet.
                    </p>
                ) : (
                    methods.map((method) => {
                        return (
                            <div
                                key={method.id}
                                className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-zinc-800/60 last:border-0"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-bold text-slate-800 dark:text-zinc-200 truncate">{method.name}</div>
                                    <div className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono mt-0.5">{method.id}</div>
                                </div>

                                <Badge
                                    variant="outline"
                                    className={method.active
                                        ? "font-semibold text-[11px] bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
                                        : "font-semibold text-[11px] bg-slate-50 text-slate-500 border-slate-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800"}
                                >
                                    {method.active ? "Active" : "Inactive"}
                                </Badge>

                                {/* {canReadWrite && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 shrink-0"
                                        onClick={() => setMethodToRemove(method)}
                                        disabled={isRemoving}
                                        title={`Remove ${method.name} from Shopify`}
                                        aria-label={`Remove ${method.name} from Shopify`}
                                    >
                                        {isRemoving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    </Button>
                                )} */}
                            </div>
                        );
                    })
                )}
            </div>

            <ConformationModal
                open={!!methodToRemove}
                onOpenChange={(open: boolean) => { if (!open) setMethodToRemove(null); }}
                title={`Remove "${methodToRemove?.name}" from Shopify?`}
                description={
                    <span className="space-y-3 block">
                        <span className="block">
                            This deletes the rate provider from your Shopify store, not just from Tranzit.
                            Shoppers will stop seeing any shipping option it was providing at checkout.
                        </span>
                        <span className="flex items-start gap-2.5 p-3 bg-amber-50 dark:bg-amber-950/15 border border-amber-200 dark:border-amber-900/30 rounded-xl text-amber-800 dark:text-amber-300">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span className="text-xs leading-relaxed">
                                If this is the only provider serving rates for a zone, that zone will show no shipping
                                options and customers will not be able to check out. Adding it back means reconnecting the store.
                            </span>
                        </span>
                    </span>
                }
                onConfirm={handleConfirm}
                onCancel={() => setMethodToRemove(null)}
                confirmText="Remove from Shopify"
                cancelText="Keep it"
                confirmVariant="destructive"
                className="sm:max-w-lg"
                loading={isPending}
            />
        </div>
    );
}
