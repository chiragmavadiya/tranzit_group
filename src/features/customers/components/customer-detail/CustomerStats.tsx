import { formateCurrency } from '@/lib/utils';
import { Package, Wallet, MapPin, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';

export const CustomerStats = ({ customer }: { customer: any }) => {
    const stats = [
        {
            label: "Total Order",
            value: customer?.total_order || 0,
            icon: Package,
            iconColor: "text-blue-600 dark:text-blue-400",
            iconBg: "bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/30",
        },
        {
            label: "Total Wallet Balance",
            value: formateCurrency(customer?.total_wallet_balance || 0),
            icon: Wallet,
            iconColor: "text-violet-600 dark:text-violet-400",
            iconBg: "bg-violet-50 dark:bg-violet-950/50 border border-violet-100 dark:border-violet-900/30",
        },
        {
            label: "Total Pickup Charge",
            value: formateCurrency(customer?.total_pickup_charge || 0),
            icon: MapPin,
            iconColor: "text-amber-600 dark:text-amber-400",
            iconBg: "bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900/30",
        },
        {
            label: "Total Credit",
            value: formateCurrency(customer?.total_credit || 0),
            icon: TrendingUp,
            iconColor: "text-emerald-600 dark:text-emerald-400",
            iconBg: "bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/30",
        },
        {
            label: "Total Debit",
            value: formateCurrency(customer?.total_debit || 0),
            icon: TrendingDown,
            iconColor: "text-red-600 dark:text-red-400",
            iconBg: "bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900/30",
        },
        {
            label: "Total Margin",
            value: formateCurrency(customer?.total_margin || 0),
            icon: CreditCard,
            iconColor: "text-teal-600 dark:text-teal-400",
            iconBg: "bg-teal-50 dark:bg-teal-950/50 border border-teal-100 dark:border-teal-900/30",
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={idx}
                        className="bg-white dark:bg-zinc-950 rounded-xl border border-slate-150 dark:border-zinc-800 shadow-sm p-3 flex items-center gap-2.5 hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200"
                    >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${stat.iconBg}`}>
                            <Icon className={`w-4.5 h-4.5 ${stat.iconColor}`} />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                            <span
                                className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider truncate"
                                title={stat.label}
                            >
                                {stat.label}
                            </span>
                            <span
                                className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate"
                                title={String(stat.value)}
                            >
                                {stat.value}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
