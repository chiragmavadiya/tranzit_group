import { cn } from '@/lib/utils';
import { CUSTOMER_TABS } from './constants';

interface CustomerTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const CustomerTabs = ({ activeTab, onTabChange }: CustomerTabsProps) => {
    return (
        <div className="flex items-center gap-2 p-1 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl w-fit border border-white dark:border-zinc-800 shadow-sm">
            {CUSTOMER_TABS.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={cn(
                        "px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-300",
                        activeTab === tab
                            ? "bg-blue-100 text-blue-600 shadow-lg dark:bg-zinc-100 dark:text-zinc-950"
                            : "text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                    )}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};
