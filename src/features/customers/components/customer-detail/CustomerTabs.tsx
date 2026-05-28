import { cn } from '@/lib/utils';
import { CUSTOMER_TABS } from './constants';

interface CustomerTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const CustomerTabs = ({ activeTab, onTabChange }: CustomerTabsProps) => {
    return (
        <div className="border-b border-slate-200 dark:border-zinc-800 w-full">
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
                {CUSTOMER_TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className={cn(
                            "pb-2 px-2 pt-1 text-sm font-medium relative transition-all duration-200 whitespace-nowrap tracking-normal",
                            activeTab === tab
                                ? "text-slate-900 dark:text-white font-bold"
                                : "text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                        )}
                    >
                        {tab}
                        {activeTab === tab && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};
