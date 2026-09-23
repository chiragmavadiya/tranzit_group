import { useCallback, useMemo, useState } from 'react';
import { Loader2, Store, ArrowLeft, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Drawer } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormInput } from '@/features/orders/components/OrderFormUI';
import { showToast } from '@/components/ui/custom-toast';
import { cn } from '@/lib/utils';
import { useConnectIntegration } from '../hooks/useIntegrations';
import { ECOMMERCE_PLATFORMS, OAUTH_ECOMMERCE_PROVIDERS, findEcommercePlatform } from '../constants';
import { toShopHandle } from '../utils';

interface EcommerceConnectDrawerProps {
    open: boolean;
    onClose: () => void;
    /** `ecommerce_connections` from the integrations list, for logos and descriptions. */
    connections?: any[];
}

const REQUIRED_FIELDS: Record<string, string[]> = {
    shopify: ['shop'],
    shopline: ['shop'],
    woocommerce: ['store_url', 'consumer_key', 'consumer_secret'],
};

const SHOP_SUFFIX: Record<string, string> = {
    shopify: '.myshopify.com',
    shopline: '.myshopline.com',
};

export default function EcommerceConnectDrawer({ open, onClose, connections }: EcommerceConnectDrawerProps) {
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const connectMutation = useConnectIntegration();

    const platform = findEcommercePlatform(selectedPlatform);
    const shopSuffix = selectedPlatform ? SHOP_SUFFIX[selectedPlatform] : undefined;

    const connectionBySlug = useMemo(() => {
        const map: Record<string, any> = {};
        (connections || []).forEach((connection: any) => { map[connection.slug] = connection; });
        return map;
    }, [connections]);

    const resetForm = useCallback(() => {
        setFormData({});
        setErrors({});
        setSubmitted(false);
    }, []);

    const handleClose = useCallback(() => {
        onClose();
        // Wait for the close transition so the panel does not visibly jump back to step one.
        setTimeout(() => {
            setSelectedPlatform(null);
            resetForm();
        }, 300);
    }, [onClose, resetForm]);

    const handleSelectPlatform = useCallback((id: string) => {
        resetForm();
        setSelectedPlatform(id);
    }, [resetForm]);

    const handleChange = (value: string, name: string) => {
        setFormData((previous) => ({ ...previous, [name]: value }));
        setErrors((previous) => {
            if (!previous[name]) return previous;
            const next = { ...previous };
            delete next[name];
            return next;
        });
    };

    const handleConnect = () => {
        if (!selectedPlatform) return;
        setSubmitted(true);

        const newErrors: Record<string, string> = {};
        (REQUIRED_FIELDS[selectedPlatform] || []).forEach((field) => {
            if (!formData[field]?.trim()) {
                const label = field.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                newErrors[field] = `Please enter ${label}`;
            }
        });
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            showToast("Please fill in all required fields.", "error");
            return;
        }

        // The handle is typed without its suffix, but the API expects the full domain.
        const payload = shopSuffix && formData.shop
            ? { ...formData, shop: `${toShopHandle(formData.shop, shopSuffix)}${shopSuffix}` }
            : formData;

        connectMutation.mutate({ provider: selectedPlatform, data: payload }, {
            onSuccess: (response: any) => {
                const authorizationUrl = response?.data?.authorization_url;
                if (authorizationUrl) {
                    // Same tab: the provider redirects back to /settings/ecommerce with its result params.
                    window.location.assign(authorizationUrl);
                    return;
                }
                // WooCommerce saves directly; the mutation already refreshed the list.
                handleClose();
            }
        });
    };

    const isOauth = !!selectedPlatform && OAUTH_ECOMMERCE_PROVIDERS.includes(selectedPlatform);
    const isSubmitting = connectMutation.isPending;

    const renderPlatformGrid = () => {
        const available = ECOMMERCE_PLATFORMS.filter((item) => item.status === 'available');
        const comingSoon = ECOMMERCE_PLATFORMS.filter((item) => item.status === 'coming_soon');

        const renderCard = (item: typeof ECOMMERCE_PLATFORMS[number]) => {
            const details = connectionBySlug[item.id];
            const isComingSoon = item.status === 'coming_soon';
            const connectedCount = details?.connected ? (details.accounts?.length || 1) : 0;

            const body = (
                <>
                    <div className={cn(
                        "w-14 h-14 rounded-xl bg-white dark:bg-zinc-900 p-2 border border-slate-100 dark:border-zinc-800/80 flex items-center justify-center shrink-0 shadow-xs",
                        isComingSoon && "grayscale"
                    )}>
                        {details?.logo_url
                            ? <img src={details.logo_url} alt="" className="h-full w-full object-contain" />
                            : <Store className="w-5 h-5 text-slate-400" />}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={cn(
                                "text-sm font-bold",
                                isComingSoon ? "text-slate-400 dark:text-zinc-500" : "text-slate-800 dark:text-zinc-200"
                            )}>
                                {item.name}
                            </span>
                            {isComingSoon && (
                                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                                    Coming Soon
                                </span>
                            )}
                            {connectedCount > 0 && (
                                <span className="text-[10px] font-bold text-slate-600 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full">
                                    {connectedCount} connected
                                </span>
                            )}
                        </div>
                        <p className={cn(
                            "my-0 text-xs mt-1 leading-relaxed line-clamp-2",
                            isComingSoon ? "text-slate-400 dark:text-zinc-600" : "text-slate-500 dark:text-zinc-400"
                        )}>
                            {details?.description || `Sync orders and tracking with ${item.name}.`}
                        </p>
                    </div>
                </>
            );

            if (isComingSoon) {
                return (
                    <div
                        key={item.id}
                        aria-disabled="true"
                        className="flex items-start gap-3 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30"
                    >
                        {body}
                    </div>
                );
            }

            return (
                <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectPlatform(item.id)}
                    className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-left cursor-pointer transition-all hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                    {body}
                </button>
            );
        };

        return (
            <div className="space-y-6">
                <div className="space-y-3">
                    <h3 className="my-0 text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">Available now</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {available.map(renderCard)}
                    </div>
                </div>
                <div className="space-y-3">
                    <h3 className="my-0 text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">Coming soon</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {comingSoon.map(renderCard)}
                    </div>
                </div>
            </div>
        );
    };

    const renderConnectForm = () => {
        if (isOauth) {
            return (
                <div className="space-y-4">
                    <div className="border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">
                        <h3 className="my-0 text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">Tranzit will be able to</h3>
                        <ul className="mt-3 mb-0 space-y-2 list-none p-0">
                            <li className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                                Read your paid, unshipped orders and their delivery addresses
                            </li>
                            <li className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                                Upload the carrier and tracking number once a label is printed
                            </li>
                            <li className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                                Not change your prices or listings, or message your buyers
                            </li>
                        </ul>
                    </div>
                    <p className="my-0 text-xs text-slate-500 dark:text-zinc-400">
                        {platform?.name} opens in this tab and returns you here once you approve the connection.
                    </p>
                </div>
            );
        }

        if (shopSuffix) {
            return (
                <div className="space-y-2">
                    <label htmlFor="shop-handle" className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                        Shop Domain <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-stretch">
                        <Input
                            id="shop-handle"
                            value={formData.shop || ""}
                            onChange={(event) => handleChange(event.target.value, 'shop')}
                            placeholder="your-store"
                            className="rounded-r-none"
                            disabled={isSubmitting}
                            error={submitted && !!errors.shop}
                        />
                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-input bg-slate-50 dark:bg-zinc-900 text-sm font-semibold text-slate-500 dark:text-zinc-400 whitespace-nowrap">
                            {shopSuffix}
                        </span>
                    </div>
                    {submitted && errors.shop && <p className="my-0 text-xs text-red-500">{errors.shop}</p>}
                    <p className="my-0 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                        Paste the whole domain if that is easier — the <span className="font-semibold">{shopSuffix}</span> is trimmed for you.
                    </p>
                </div>
            );
        }

        if (selectedPlatform === 'woocommerce') {
            const fieldProps = (name: string) => ({
                name,
                value: formData[name] || "",
                onChange: (value: any) => handleChange(value, name),
                required: true,
                error: submitted && !!errors[name],
                errormsg: errors[name],
                disabled: isSubmitting,
                isHalf: true
            });
            return (
                <div className="grid grid-cols-12 gap-x-4 gap-y-3.5">
                    <FormInput label="Store URL" {...fieldProps("store_url")} placeholder="https://your-store.com" />
                    <FormInput label="Consumer Key" {...fieldProps("consumer_key")} />
                    <FormInput label="Consumer Secret" {...fieldProps("consumer_secret")} type="password" />
                    <div className="col-span-12 border border-slate-200 dark:border-zinc-800 rounded-2xl bg-slate-50/60 dark:bg-zinc-900/40 p-4">
                        <h3 className="my-0 text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">Where to find your keys</h3>
                        <ol className="mt-2 mb-0 pl-4 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed space-y-1">
                            <li>In WordPress, open WooCommerce → Settings → Advanced → REST API.</li>
                            <li>Choose Add key and set permissions to Read/Write.</li>
                            <li>Copy the consumer key and secret into the fields above.</li>
                        </ol>
                    </div>
                </div>
            );
        }

        return (
            <p className="my-0 text-sm text-slate-500 dark:text-zinc-400">Configuration is coming soon.</p>
        );
    };

    return (
        <Drawer
            open={open}
            onClose={handleClose}
            className="max-w-[800px]"
            title={
                selectedPlatform ? (
                    <span className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 shrink-0"
                            onClick={() => { setSelectedPlatform(null); resetForm(); }}
                            aria-label="Back to platform list"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        {connectionBySlug[selectedPlatform]?.logo_url && (
                            <span className="flex items-center h-9 shrink-0 bg-white p-1 rounded-md border border-slate-100 dark:border-zinc-800/80 shadow-xs">
                                <img src={connectionBySlug[selectedPlatform].logo_url} alt="" className="h-7 w-auto object-contain max-w-[100px]" />
                            </span>
                        )}
                        <span>Connect your {platform?.name} {platform?.noun}</span>
                    </span>
                ) : "Add integration"
            }
            description={
                selectedPlatform
                    ? "Orders import automatically, and tracking goes back once a label is printed."
                    : "Choose the platform you sell on. You will set up the connection on the next step."
            }
            footer={
                <div className="flex justify-end gap-2">
                    {selectedPlatform ? (
                        <>
                            <Button
                                variant="outline"
                                className="h-8 text-[13px] rounded-sm font-semibold"
                                onClick={() => { setSelectedPlatform(null); resetForm(); }}
                                disabled={isSubmitting}
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleConnect}
                                disabled={isSubmitting}
                                className="h-8 text-[13px] rounded-sm font-semibold gap-2"
                            >
                                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                {isOauth || shopSuffix ? `Continue to ${platform?.name}` : "Connect"}
                                {(isOauth || shopSuffix) && !isSubmitting && <ExternalLink className="w-3.5 h-3.5" />}
                            </Button>
                        </>
                    ) : (
                        <Button variant="outline" className="h-8 text-[13px] rounded-sm font-semibold" onClick={handleClose}>
                            Close
                        </Button>
                    )}
                </div>
            }
        >
            <div className="px-6 py-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedPlatform || "select-platform"}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                    >
                        {selectedPlatform ? renderConnectForm() : renderPlatformGrid()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </Drawer>
    );
}
