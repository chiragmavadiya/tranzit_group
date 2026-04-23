import { cn } from '@/lib/utils';
import { BOOK_PICKUP_TABS } from '../constants/book-pickup.constants';
import type { BookPickupTabType } from '../constants/book-pickup.constants';

interface BookPickupTabsProps {
    activeTab: BookPickupTabType;
    onTabChange: (tab: BookPickupTabType) => void;
    className?: string;
}

export function BookPickupTabs({ activeTab, onTabChange, className }: BookPickupTabsProps) {
    return (
        <nav className={cn("flex items-center space-x-8 h-full", className)} aria-label="Book Pickup Tabs">
            {BOOK_PICKUP_TABS.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id as BookPickupTabType)}
                        className={cn(
                            "h-full px-1 border-b-2 font-bold text-[13px] uppercase tracking-wider transition-all duration-300 relative flex items-center gap-2 outline-none whitespace-nowrap",
                            isActive
                                ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                                : "border-transparent text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 hover:border-slate-200 dark:hover:border-zinc-800"
                        )}
                    >
                        {tab.label}
                        <span className={cn(
                            "px-1.5 py-0.5 text-[10px] rounded-full font-bold transition-all duration-300",
                            isActive
                                ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                                : "bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500"
                        )}>
                            {tab.count}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}
