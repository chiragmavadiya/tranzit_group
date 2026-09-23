import { User, CreditCard, AtSign, Phone, MapPin } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ActivityTimeline } from './ActivityTimeline';
import { useCustomerProfile } from '../../hooks/useCustomers';
import { cn } from '@/lib/utils';
import { WEIGHT_TIERS } from '../../constants';

interface ProfileTabProps {
    customerId: string;
}

export const ProfileTab = ({ customerId }: ProfileTabProps) => {
    const { data: response, isLoading } = useCustomerProfile(customerId);

    if (isLoading) {
        return <div className="p-8 flex justify-center"><span className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
    }

    const customer = response?.data;

    if (!customer) return null;

    const markupCharges = customer.markup_charges || [];
    const pickupCharges = customer.pickup_charges || [];


    // Check if we have weight based charges
    const hasWeightCharges = markupCharges.length > 0 || pickupCharges.length > 0;

    const tiers = customer.byo_courier_pricing_tiers || [];
    const tier_0_25 = tiers.find((t: any) => t.min_labels === 0 && t.max_labels === 25);
    const tier_26_50 = tiers.find((t: any) => t.min_labels === 26 && t.max_labels === 50);
    const tier_51_100 = tiers.find((t: any) => t.min_labels === 51 && t.max_labels === 100);
    const tier_101_250 = tiers.find((t: any) => t.min_labels === 101 && t.max_labels === 250);
    const tier_250plus = tiers.find((t: any) => t.min_labels === 251);

    const val_0_25 = tier_0_25 ? tier_0_25.price_per_label : 0;
    const val_26_50 = tier_26_50 ? tier_26_50.price_per_label : 0;
    const val_51_100 = tier_51_100 ? tier_51_100.price_per_label : 0;
    const val_101_250 = tier_101_250 ? tier_101_250.price_per_label : 0;
    const val_250plus = tier_250plus ? tier_250plus.price_per_label : 0;

    // Filter to active couriers based on the flags, or fallback to any courier present in the charges arrays
    // filter((courier) => customer[courier.enableKey])
    const activeCouriersWithCharges = [
        { key: "DirectFreight", name: "Direct Freight Express", enableKey: "direct_freight_active" },
        { key: "AusPost", name: "Auspost Tranzit Group", enableKey: "auspost_active" },
        { key: "CouriersPlease", name: "Courier Please", enableKey: "couriersplease_active" },
        { key: "Aramex", name: "Aramex Tranzit Group", enableKey: "aramex_active" },
        { key: "Pallet", name: "Pallet Tranzit Group", enableKey: "pallet_active" },
        { key: "Fedex", name: "Fedex Tranzit Group", enableKey: "fedex_active" },
        { key: "TNT", name: "TNT Tranzit Group", enableKey: "tnt_active" },
        { key: "TEG", name: "TEG Tranzit Group", enableKey: "teg_active" }
    ].filter((courier) => (customer as any)[courier.enableKey]).map(courier => {
        const markup = markupCharges.find((c: any) => c.courier === courier.key) || { over_3kg: 0, over_5kg: 0, over_10kg: 0, over_15kg: 0 };
        const pickup = pickupCharges.find((c: any) => c.courier === courier.key) || { over_3kg: 0, over_5kg: 0, over_10kg: 0, over_15kg: 0 };
        return {
            ...courier,
            markup,
            pickup
        };
    });
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
            {/* Top Tier: Combined Customer Overview */}
            <Card className="col-span-12 bg-white dark:bg-zinc-950 rounded-xl border border-slate-150 dark:border-zinc-800 shadow-sm overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-zinc-900/50 border-b border-slate-150 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
                        <h3 className="my-0 text-sm font-bold text-slate-900 dark:text-white">Customer Overview & Contact Details</h3>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3">
                        <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">Full Name</span>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white truncate" title={customer.about.full_name}>{customer.about.full_name}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">Business Name</span>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white truncate" title={customer.about.business_name || "N/A"}>{customer.about.business_name || "N/A"}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">GST Number</span>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">{customer.about.gst?.toString() || 'N/A'}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">Role & Status</span>
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white capitalize">
                                <span>{customer.about.role}</span>
                                <span className="text-slate-300 dark:text-zinc-700">•</span>
                                <div className="flex items-center gap-1">
                                    <span className={cn("w-2 h-2 rounded-full", customer.about.status_code === '1' ? "bg-emerald-500" : "bg-red-500")} />
                                    <span>{customer.about.status_code === '1' ? 'Active' : 'Inactive'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>Phone</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white truncate" title={customer.contacts.contact || "N/A"}>{customer.contacts.contact || "N/A"}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
                                <AtSign className="w-3 h-3 text-slate-400" />
                                <span>Email</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white truncate" title={customer.contacts.email || "N/A"}>{customer.contacts.email || "N/A"}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>Pickup Address</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white" title={customer?.pickup_address?.address_info || (customer?.pickup_address?.address ? `${customer?.pickup_address?.address}, ${customer?.pickup_address?.post_code}` : "No Address")}>
                                {customer?.pickup_address?.address_info || (customer?.pickup_address?.address ? `${customer?.pickup_address?.address}, ${customer?.pickup_address?.post_code}` : "No Address")}
                            </span>
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>Billing Address</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white" title={customer?.billing_address?.address_info || (customer?.billing_address?.address ? `${customer?.billing_address?.address}, ${customer?.billing_address?.post_code}` : "No Address")}>
                                {customer?.billing_address?.address_info || (customer?.billing_address?.address ? `${customer?.billing_address?.address}, ${customer?.billing_address?.post_code}` : "No Address")}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bottom Tier: Charges & Markups + Timeline */}
            <div className="col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-6 xl:col-span-7 flex flex-col">
                    {/* Charges & Markups Card */}
                    <Card className="bg-white dark:bg-zinc-950 rounded-xl border border-slate-150 dark:border-zinc-800 shadow-sm flex-1 overflow-hidden">
                        <CardHeader className="flex flex-row items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-zinc-900/50 border-b border-slate-150 dark:border-zinc-800">
                            <CreditCard className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
                            <h3 className="text-sm my-0 font-bold text-slate-900 dark:text-white">Charges & Markups</h3>
                        </CardHeader>
                        <CardContent className="p-4">
                            {hasWeightCharges ? (
                                <div className="space-y-4">
                                    {/* {hasVolumeTiers && ( */}
                                    <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/20">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide block">BYO Courier Volume-Based Tiered Fees (Weekly)</span>
                                            <span className={cn(
                                                "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide",
                                                customer.byo_courier_invoice_enable
                                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                                                    : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                                            )}>
                                                BYO Invoicing: {customer.byo_courier_invoice_enable ? "Enabled" : "Disabled"}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                            {[
                                                { label: "0-25 Labels", value: val_0_25 },
                                                { label: "26-50 Labels", value: val_26_50 },
                                                { label: "51-100 Labels", value: val_51_100 },
                                                { label: "101-250 (Weekly)", value: val_101_250 },
                                                { label: "More Than 250 Labels", value: val_250plus },
                                            ].map((tier, idx) => (
                                                <div key={idx} className="flex flex-col p-2 bg-white dark:bg-zinc-950 rounded-lg border border-slate-100 dark:border-zinc-900 shadow-2xs">
                                                    <span className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400 truncate">{tier.label}</span>
                                                    <span className="text-sm font-bold text-slate-800 dark:text-white">${Number(tier.value || 0).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* )} */}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {activeCouriersWithCharges.map((courier) => (
                                            <div key={courier.name} className="p-3 rounded-xl bg-slate-50/60 dark:bg-zinc-900/40 border border-slate-150 dark:border-zinc-800/80 space-y-2">
                                                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-zinc-800/60 pb-1.5">
                                                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wide truncate">{courier.name}</span>
                                                </div>

                                                <table className="w-full text-left border-collapse text-[11px]">
                                                    <thead>
                                                        <tr className="text-slate-500 dark:text-zinc-400 font-semibold tracking-wide text-[10px] border-b border-slate-200/50 dark:border-zinc-800/50">
                                                            <th className="pb-1 font-bold">Weight Tier</th>
                                                            <th className="pb-1 font-bold text-right">Markup (%)</th>
                                                            <th className="pb-1 font-bold text-right">Pickup ($)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100/50 dark:divide-zinc-800/30">
                                                        {WEIGHT_TIERS.map((tier) => {
                                                            const mValue = (courier.markup as any)[tier.key] ?? 0;
                                                            const pValue = (courier.pickup as any)[tier.key] ?? 0;
                                                            return (
                                                                <tr key={tier.key} className="text-slate-600 dark:text-zinc-300 text-xs">
                                                                    <td className="py-1.5 font-medium">{tier.label}</td>
                                                                    <td className="py-1.5 text-right font-semibold text-slate-900 dark:text-white">{Number(mValue).toFixed(2)}%</td>
                                                                    <td className="py-1.5 text-right font-semibold text-slate-900 dark:text-white">${Number(pValue).toFixed(2)}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 px-4">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 mb-3">
                                        <CreditCard className="w-6 h-6 text-slate-400 dark:text-zinc-500" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">No Charges & Markups Configured</h4>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400 text-center max-w-xs">
                                        This customer doesn't have any custom charges or markup configurations yet. Default rates will apply to their orders.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-6 xl:col-span-5 flex flex-col">
                    <ActivityTimeline activities={customer.activity_timeline} />
                </div>
            </div>
        </div>
    );
};
