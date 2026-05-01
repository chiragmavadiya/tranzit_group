import { cn } from '@/lib/utils';
import type { TabType } from '@/features/orders/types';
import { TABS } from '@/features/orders/constants';

interface OrdersTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  className?: string;
}

// border: 1px solid #ebe6e7;
// border - top - left - radius: 10px;
// border - top - right - radius: 10px;
// padding: 0 30px;
// border - bottom - color: #fff;

export function OrdersTabs({ activeTab, onTabChange, className }: OrdersTabsProps) {
  return (
    <nav className={cn("flex space-x-6 h-full items-end", className)} aria-label="Tabs">
      {TABS.map((tab) => {
        // const count = 61;
        const isActive = activeTab === tab.toLowerCase();

        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab.toLowerCase() as TabType)}
            className={cn(
              "h-10 px-6 border font-semibold text-[13px] rounded-t-md transition-all duration-200 relative flex items-center gap-2 outline-none whitespace-nowrap",
              isActive
                ? "border-gray-200 border-b-white text-blue-600 dark:text-blue-400 dark:border-blue-400"
                : "border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:border-gray-200 dark:hover:border-zinc-600"
            )}
          >
            {tab}
            {/* {count > 0 && (
              <span className={cn(
                "px-1.5 py-0.5 text-[10px] rounded-full font-bold transition-all duration-300",
                isActive
                  ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                  : "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500"
              )}>
                {count}
              </span>
            )} */}
          </button>
        );
      })}
    </nav>
  );
}

