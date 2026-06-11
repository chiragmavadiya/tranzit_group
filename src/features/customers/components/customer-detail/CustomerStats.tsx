import { StatCard } from '@/components/common/StatCard';
import { formateCurrency } from '@/lib/utils';
import { Package, Wallet, MapPin, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';

export const CustomerStats = ({ customer }: { customer: any }) => {
    console.log(customer, 'customer')
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {/* {MOCK_STATS.map((stat, idx) => ( */}
                <StatCard
                    label="Total Order"
                    value={customer?.total_order || 0}
                    icon={Package}
                    iconColor="text-blue-500"
                    iconBg="bg-blue-50 dark:bg-blue-900/20"
                    className="bg-white dark:bg-zinc-900 shadow-md border-none group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                />
                <StatCard
                    label="Total Wallet Balance"
                    value={formateCurrency(customer?.total_wallet_balance || 0)}
                    icon={Wallet}
                    iconColor="text-violet-500"
                    iconBg="bg-violet-50 dark:bg-violet-900/20"
                    className="bg-white dark:bg-zinc-900 shadow-md border-none group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                />
                <StatCard
                    label="Total Pickup Charge"
                    value={formateCurrency(customer?.total_pickup_charge || 0)}
                    icon={MapPin}
                    iconColor="text-amber-500"
                    iconBg="bg-amber-50 dark:bg-amber-900/20"
                    className="bg-white dark:bg-zinc-900 shadow-md border-none group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                />
                <StatCard
                    label="Total Credit"
                    value={formateCurrency(customer?.total_credit || 0)}
                    icon={TrendingUp}
                    iconColor="text-emerald-500"
                    iconBg="bg-emerald-50"
                    className="bg-white dark:bg-zinc-900 shadow-md border-none group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                />
                <StatCard
                    label="Total Debit"
                    value={formateCurrency(customer?.total_debit || 0)}
                    icon={TrendingDown}
                    iconColor="text-red-500"
                    iconBg="bg-red-50"
                    className="bg-white dark:bg-zinc-900 shadow-md border-none group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                />
                <StatCard
                    label="Total Margin"
                    value={formateCurrency(customer?.total_margin || 0)}
                    icon={CreditCard}
                    iconColor="text-emerald-500"
                    iconBg="bg-emerald-50"
                    className="bg-white dark:bg-zinc-900 shadow-md border-none group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                />
                {/* ))} */}
            </div>
        </div>
    );
};
