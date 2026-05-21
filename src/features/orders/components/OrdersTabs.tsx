import { cn } from '@/lib/utils';
import type { TabType } from '@/features/orders/types';
import { TABS } from '@/features/orders/constants';
import { useOrderCounts } from '@/features/orders/hooks/useOrders';
import { useAppSelector } from '@/hooks/store.hooks';

interface OrdersTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  className?: string;
}

export function OrdersTabs({ activeTab, onTabChange, className }: OrdersTabsProps) {
  const { role } = useAppSelector((state) => state.auth);
  // Fetch status counts from the counts API
  const { data: countsData } = useOrderCounts(undefined, !!role);

  return (
    <nav className={cn("flex space-x-0 h-full items-end", className)} aria-label="Tabs">
      {TABS.map((tab) => {
        const key = tab.toLowerCase();
        const count = countsData?.data?.[key] ?? countsData?.data?.[tab] ?? 0;
        const isActive = activeTab === key;

        return (
          <button
            key={tab}
            onClick={() => onTabChange(key as TabType)}
            className={cn(
              "h-10 px-4 border cursor-pointer font-semibold text-[13px] rounded-t-md transition-all duration-200 relative flex items-center gap-2 outline-none whitespace-nowrap",
              isActive
                ? "border-gray-200 border-b-white text-primary dark:border-zinc-800 dark:border-b-zinc-950"
                : "border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 "
            )}
          >
            {tab}
            {typeof count === 'number' && (
              <span className={cn(
                "px-2 py-0.5 text-[10px] rounded-full font-bold transition-all duration-300",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500"
              )}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
