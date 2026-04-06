import { cn } from '@/lib/utils';
import type { TabType } from '../types';
import { TABS, MOCK_ORDERS, Order_status_styles } from '../constants';

interface OrdersTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function OrdersTabs({ activeTab, onTabChange }: OrdersTabsProps) {
  return (
    <div className="border-b border-gray-200 dark:border-zinc-800 transition-colors">
      <nav className="flex space-x-8" aria-label="Tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 relative",
              activeTab === tab
                ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                : "border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:border-gray-300 dark:hover:border-zinc-600"
            )}
          >
            {tab}
            {activeTab === tab && (
              <span className={cn("absolute -top-1 -right-4 px-2 py-0.5 text-[10px] rounded-full font-bold shadow-sm shadow-blue-200 animate-in zoom-in duration-300", Order_status_styles[tab])}>
                {MOCK_ORDERS.filter(o => o.status === tab).length}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
