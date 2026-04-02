import { cn } from '@/lib/utils';
import type { TabType } from '../types';
import { TABS, MOCK_ORDERS } from '../constants';

interface OrdersTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function OrdersTabs({ activeTab, onTabChange }: OrdersTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8" aria-label="Tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 relative",
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute -top-1 -right-4 px-1.5 py-0.5 bg-blue-600 text-white text-[10px] rounded-full font-bold">
                {MOCK_ORDERS.filter(o => o.status === tab).length}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
