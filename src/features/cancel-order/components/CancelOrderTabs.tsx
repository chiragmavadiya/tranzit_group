import { cn } from '@/lib/utils';
import { CANCEL_ORDER_TABS, type CancelOrderTabType } from '../constants/cancelOrder.constants';

interface CancelOrderTabsProps {
    activeTab: CancelOrderTabType;
    onTabChange: (tab: CancelOrderTabType) => void;
    className?: string;
}

export function CancelOrderTabs({ activeTab, onTabChange, className }: CancelOrderTabsProps) {
    return (
        <nav className={cn("flex space-x-6 h-full items-end", className)} aria-label="Cancel Order Tabs">
            {CANCEL_ORDER_TABS.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id as CancelOrderTabType)}
                        className={cn(
                            "h-10 px-6 border font-semibold text-[13px] rounded-t-md transition-all duration-200 relative flex items-center gap-2 outline-none whitespace-nowrap",
                            isActive
                                ? "border-gray-200 border-b-white text-primary dark:border-zinc-800 dark:border-b-zinc-950"
                                : "border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:border-gray-200 dark:hover:border-zinc-600"
                        )}
                    >
                        {tab.label}
                        {tab.count > 0 && (
                            <span className={cn(
                                "px-1.5 py-0.5 text-[10px] rounded-full font-bold transition-all duration-300",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500"
                            )}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </nav>
    );
}
