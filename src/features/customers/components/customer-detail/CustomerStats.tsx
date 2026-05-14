import { StatCard } from '@/components/common/StatCard';
import { MOCK_STATS } from './constants';

export const CustomerStats = () => {
    return (
        <div className="flex flex-col gap-4">
            {/* <h2 className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Statistics</h2> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {MOCK_STATS.map((stat, idx) => (
                    <StatCard
                        key={idx}
                        {...stat}
                        className="bg-white dark:bg-zinc-900 shadow-md border-none group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                    />
                ))}
            </div>
        </div>
    );
};
