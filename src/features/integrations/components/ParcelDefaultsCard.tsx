import { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/features/orders/components/OrderFormUI';
import { useUpdateShopifyParcelDefaults, useUpdateShoplineParcelDefaults } from '../hooks/useIntegrations';
import { PARCEL_FIELDS, toParcelDraft, validateParcelDraft } from '../utils';

interface ParcelDefaultsCardProps {
    account: any;
    provider: 'shopify' | 'shopline';
    canReadWrite: boolean;
    /** True while the account still has no saved defaults, which blocks its orders from shipping. */
    isRequired: boolean;
}

const PLATFORM_NAME: Record<string, string> = { shopify: 'Shopify', shopline: 'Shopline' };

/** Parcel size and fallback weight used when an order arrives without its own measurements. */
export default function ParcelDefaultsCard({ account, provider, canReadWrite, isRequired }: ParcelDefaultsCardProps) {
    const [draft, setDraft] = useState<Record<string, string>>(() => toParcelDraft(account));
    const [errors, setErrors] = useState<Record<string, string>>({});
    // Which account the draft was seeded from, so a background refetch never overwrites typing.
    const [draftAccountId, setDraftAccountId] = useState<any>(account?.id);

    const shopify = useUpdateShopifyParcelDefaults();
    const shopline = useUpdateShoplineParcelDefaults();
    const { mutate: save, isPending } = provider === 'shopify' ? shopify : shopline;

    useEffect(() => {
        if (account?.id === draftAccountId) return;
        setDraft(toParcelDraft(account));
        setErrors({});
        setDraftAccountId(account?.id);
    }, [account, draftAccountId]);

    const handleChange = (key: string, value: string) => {
        setDraft((previous) => ({ ...previous, [key]: value }));
        setErrors((previous) => {
            if (!previous[key]) return previous;
            const next = { ...previous };
            delete next[key];
            return next;
        });
    };

    const handleSave = () => {
        const validationErrors = validateParcelDraft(draft);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        save({
            ...(provider === 'shopify' ? { store_id: account.id } : { account_id: account.id }),
            default_package_length: Number(draft.length),
            default_package_width: Number(draft.width),
            default_package_height: Number(draft.height),
            default_package_weight: Number(draft.weight)
        } as any);
    };

    const platformName = PLATFORM_NAME[provider];

    return (
        <div className="space-y-2">
            <h3 className="my-0 text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
                Default parcel details
            </h3>

            <div className="border border-slate-200 dark:border-zinc-800 rounded-xl p-4 space-y-3">
                <p className="my-0 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-3xl">
                    Used when a {platformName} order arrives without its own parcel measurements.
                    {platformName} normally provides the product weight with each order; the fallback weight
                    below is only used when it is missing.
                </p>

                {isRequired && (
                    <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/15 border border-amber-200 dark:border-amber-900/30 rounded-xl text-amber-800 dark:text-amber-300">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p className="my-0 text-xs leading-relaxed">
                            {platformName} orders from this {provider === 'shopify' ? 'store' : 'account'} cannot be
                            quoted or shipped until these are saved.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-12 gap-x-4 gap-y-3.5">
                    {PARCEL_FIELDS.map(({ key, label, unit }) => (
                        <FormInput
                            key={key}
                            label={`${label} (${unit})`}
                            type="number"
                            placeholder="0.00"
                            required
                            isHalf
                            value={draft[key]}
                            onChange={(value: any) => handleChange(key, value)}
                            error={!!errors[key]}
                            errormsg={errors[key]}
                            disabled={!canReadWrite || isPending}
                        />
                    ))}
                </div>

                {canReadWrite && (
                    <div className="flex justify-end">
                        <Button
                            onClick={handleSave}
                            disabled={isPending}
                            className="h-8 text-[13px] rounded-sm font-semibold gap-2"
                        >
                            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            Save parcel details
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
