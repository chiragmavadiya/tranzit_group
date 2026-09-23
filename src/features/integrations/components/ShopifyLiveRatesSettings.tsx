import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { FormInput } from '@/features/orders/components/OrderFormUI';
import { cn } from '@/lib/utils';
import { useShopifyLiveRatesSettings, useUpdateShopifyLiveRatesSettings } from '../hooks/useIntegrations';
import type { ShopifyLiveRateCourier, ShopifyLiveRatesSettings } from '../types';

interface ShopifyLiveRatesSettingsProps {
    storeId: string | number;
    /** Settings only load once the store has Live Checkout Rates switched on. */
    enabled: boolean;
    canReadWrite: boolean;
    /** Store's default parcel details, used to seed the checkout parcel before it has been saved once. */
    parcelDefaults: Record<string, string>;
}

const PARCEL_FIELDS = [
    { key: 'length', field: 'checkout_package_length', label: 'Length', unit: 'cm' },
    { key: 'width', field: 'checkout_package_width', label: 'Width', unit: 'cm' },
    { key: 'height', field: 'checkout_package_height', label: 'Height', unit: 'cm' },
    { key: 'weight', field: 'checkout_package_weight', label: 'Weight', unit: 'kg' }
] as const;

type Draft = Pick<ShopifyLiveRatesSettings, 'cheapest_rate_only'> & {
    cheapest_rate_label: string;
    parcel: Record<string, string>;
    couriers: Array<Omit<ShopifyLiveRateCourier, 'label' | 'margin_percent'> & { label: string; margin_percent: string }>;
};

// Labels and margins come back as null when unset; the inputs need strings. The checkout parcel is
// null until it is saved for the first time, so it starts from the store's default parcel details.
const toDraft = (settings: ShopifyLiveRatesSettings, parcelDefaults: Record<string, string>): Draft => ({
    cheapest_rate_only: settings.cheapest_rate_only ?? false,
    cheapest_rate_label: settings.cheapest_rate_label ?? "",
    parcel: PARCEL_FIELDS.reduce((parcel, { key, field }) => {
        const value = settings[field] ?? parcelDefaults[key];
        parcel[key] = value == null ? "" : String(value);
        return parcel;
    }, {} as Record<string, string>),
    couriers: (settings.couriers ?? []).map((courier) => ({
        ...courier,
        label: courier.label ?? "",
        margin_percent: courier.margin_percent == null ? "" : String(courier.margin_percent)
    }))
});

const trimmed = (value: string) => value.trim() || null;

const toMargin = (value: string) => (value.trim() ? Number(value) : null);

/** Which couriers a Shopify store quotes at checkout, how each rate is labelled, and the parcel it quotes for. */
const ShopifyLiveRatesSettingsPanel = ({ storeId, enabled, canReadWrite, parcelDefaults }: ShopifyLiveRatesSettingsProps) => {
    const { data, isLoading, isError } = useShopifyLiveRatesSettings(storeId, enabled);
    const { mutate: saveSettings, isPending: isSaving } = useUpdateShopifyLiveRatesSettings();
    const [draft, setDraft] = useState<Draft | null>(null);
    const [submitted, setSubmitted] = useState(false);

    // The parent rebuilds this object on every render, so pin it to the values themselves.
    const { length = "", width = "", height = "", weight = "" } = parcelDefaults;
    const defaults = useMemo(() => ({ length, width, height, weight }), [length, width, height, weight]);

    const settings = data?.data;
    // Re-baseline whenever the store's saved settings arrive or change.
    useEffect(() => {
        setDraft(settings ? toDraft(settings, defaults) : null);
        setSubmitted(false);
    }, [settings, defaults]);

    const isDirty = useMemo(
        () => !!draft && !!settings && JSON.stringify(draft) !== JSON.stringify(toDraft(settings, defaults)),
        [draft, settings, defaults]
    );

    // Anything shown at checkout needs a label. Cheapest-rate-only replaces the per-courier
    // rates with one option, so only the label that is actually on screen is validated.
    // Margins still apply to the quoted price in either mode.
    const errors = useMemo(() => {
        const next: Record<string, string> = {};
        if (!draft) return next;
        if (draft.cheapest_rate_only && !draft.cheapest_rate_label.trim()) {
            next.cheapest_rate_label = "Checkout label is required";
        }
        PARCEL_FIELDS.forEach(({ key, label }) => {
            const raw = (draft.parcel[key] ?? "").trim();
            const value = Number(raw);
            if (!raw) next[`parcel-${key}`] = `Please enter ${label.toLowerCase()}`;
            else if (!Number.isFinite(value)) next[`parcel-${key}`] = `${label} must be a number`;
            else if (value <= 0) next[`parcel-${key}`] = `${label} must be greater than 0`;
        });
        draft.couriers.forEach((courier) => {
            if (!courier.enabled) return;
            if (!draft.cheapest_rate_only && !courier.label.trim()) {
                next[`${courier.courier_code}-label`] = "Checkout label is required";
            }
            const margin = courier.margin_percent.trim();
            if (margin && !(Number(margin) >= 0)) next[`${courier.courier_code}-margin`] = "Enter a valid margin %";
        });
        return next;
    }, [draft]);

    if (!enabled) return null;

    if (isLoading) {
        return (
            <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
        );
    }

    if (isError || !draft) {
        return (
            <p className="my-0 text-xs text-slate-500 dark:text-zinc-400">
                Could not load Live Checkout Rates settings for this store.
            </p>
        );
    }

    const patchCourier = (courierCode: string, patch: Partial<Draft['couriers'][number]>) =>
        setDraft((prev) => prev && ({
            ...prev,
            couriers: prev.couriers.map((courier) => (courier.courier_code === courierCode ? { ...courier, ...patch } : courier))
        }));

    const handleSave = () => {
        setSubmitted(true);
        if (Object.keys(errors).length > 0) return;
        saveSettings({
            store_id: storeId,
            cheapest_rate_only: draft.cheapest_rate_only,
            cheapest_rate_label: trimmed(draft.cheapest_rate_label),
            checkout_package_length: Number(draft.parcel.length),
            checkout_package_width: Number(draft.parcel.width),
            checkout_package_height: Number(draft.parcel.height),
            checkout_package_weight: Number(draft.parcel.weight),
            couriers: draft.couriers.map((courier) => ({
                courier_code: courier.courier_code,
                enabled: courier.enabled,
                label: trimmed(courier.label),
                margin_percent: toMargin(courier.margin_percent)
            }))
        });
    };

    return (
        <div className="space-y-3">
            <div className="space-y-3 p-3 bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800/60 rounded-lg">
                <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                        <label className="text-sm font-bold text-slate-800 dark:text-zinc-200">Cheapest rate only</label>
                        <p className="my-0 text-xs text-slate-500 dark:text-zinc-400">
                            Show a single cheapest option at checkout instead of every enabled courier.
                        </p>
                    </div>
                    <Switch
                        checked={draft.cheapest_rate_only}
                        onCheckedChange={(checked) => setDraft({ ...draft, cheapest_rate_only: checked })}
                        disabled={!canReadWrite || isSaving}
                    />
                </div>

                {draft.cheapest_rate_only && (
                    <Input
                        value={draft.cheapest_rate_label}
                        onChange={(e) => setDraft({ ...draft, cheapest_rate_label: e.target.value })}
                        placeholder="Rate label shown at checkout, e.g. Standard Shipping"
                        disabled={!canReadWrite || isSaving}
                        error={submitted && !!errors.cheapest_rate_label}
                        errormsg={errors.cheapest_rate_label}
                    />
                )}
            </div>

            <div className="space-y-2 p-3 bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800/60 rounded-lg">
                <div className="space-y-0.5">
                    <label className="text-sm font-bold text-slate-800 dark:text-zinc-200">Couriers</label>
                    <p className="my-0 text-xs text-slate-500 dark:text-zinc-400">
                        Margin % is added on top of the customer's margin for that courier's checkout rate.
                    </p>
                </div>
                {draft.couriers.length === 0 && (
                    <p className="my-0 text-xs text-slate-500 dark:text-zinc-400">No couriers available for this store.</p>
                )}
                {draft.couriers.map((courier) => (
                    <div
                        key={courier.courier_code}
                        className="flex items-center gap-3 py-1.5 border-b border-slate-100 dark:border-zinc-800/60 last:border-0"
                    >
                        <Switch
                            checked={courier.enabled}
                            onCheckedChange={(checked) => patchCourier(courier.courier_code, { enabled: checked })}
                            disabled={!canReadWrite || isSaving}
                        />
                        <span className="min-w-0 flex-1 text-xs font-semibold text-slate-700 dark:text-zinc-200 truncate">
                            {courier.courier_name || courier.courier_code}
                        </span>
                        <div className="w-2/5 shrink-0">
                            <Input
                                value={courier.label}
                                onChange={(e) => patchCourier(courier.courier_code, { label: e.target.value })}
                                placeholder="Checkout label"
                                disabled={!canReadWrite || isSaving || !courier.enabled}
                                error={submitted && !!errors[`${courier.courier_code}-label`]}
                                errormsg={errors[`${courier.courier_code}-label`]}
                            />
                        </div>
                        <div className="w-28 shrink-0 relative">
                            <Input
                                type="number"
                                min={0}
                                step="0.01"
                                // The spin buttons sit on top of the % suffix in this narrow column.
                                className="pr-6 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                value={courier.margin_percent}
                                onChange={(e) => patchCourier(courier.courier_code, { margin_percent: e.target.value })}
                                placeholder="Margin"
                                disabled={!canReadWrite || isSaving || !courier.enabled}
                                error={submitted && !!errors[`${courier.courier_code}-margin`]}
                                errormsg={errors[`${courier.courier_code}-margin`]}
                            />
                            <span className={cn(
                                "pointer-events-none absolute right-2.5 top-1.5 text-sm text-slate-400 dark:text-zinc-500",
                                (!canReadWrite || isSaving || !courier.enabled) && "opacity-50"
                            )}>
                                %
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-3 p-3 bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800/60 rounded-lg">
                <div className="space-y-0.5">
                    <label className="text-sm font-bold text-slate-800 dark:text-zinc-200">Checkout Rate Parcel Details</label>
                    <p className="my-0 text-xs text-slate-500 dark:text-zinc-400">
                        The parcel quoted at checkout. Starts from the store's default parcel details; changing it here
                        does not change those defaults.
                    </p>
                </div>

                <div className="grid grid-cols-12 gap-x-4 gap-y-3.5">
                    {PARCEL_FIELDS.map(({ key, label, unit }) => (
                        <FormInput
                            key={key}
                            label={`${label} (${unit})`}
                            type="number"
                            placeholder="0.00"
                            required
                            isHalf
                            value={draft.parcel[key]}
                            onChange={(val: any) => setDraft({ ...draft, parcel: { ...draft.parcel, [key]: val } })}
                            disabled={!canReadWrite || isSaving}
                            error={submitted && !!errors[`parcel-${key}`]}
                            errormsg={errors[`parcel-${key}`]}
                        />
                    ))}
                </div>
            </div>

            {canReadWrite && (
                <div className="flex justify-end">
                    <Button
                        size="sm"
                        className="h-8 text-xs font-bold gap-1.5"
                        onClick={handleSave}
                        disabled={!isDirty || isSaving}
                    >
                        {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>Save changes</span>
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ShopifyLiveRatesSettingsPanel;
