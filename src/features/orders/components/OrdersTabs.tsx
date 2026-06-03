import { cn } from '@/lib/utils';
import type { TabType } from '@/features/orders/types';
import { TABS } from '@/features/orders/constants';
import { useOrderCounts } from '@/features/orders/hooks/useOrders';
import { useAppSelector } from '@/hooks/store.hooks';
import ModuleTabs from '@/components/common/ModuleTabs';

interface OrdersTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  className?: string;
  customerId?: string;
}

const tabsMap: Record<string, string> = {
  new: 'Pending',
  printed: 'Label Printed',
  shipped: 'Dispatched',
  archived: 'Archived',
};

export function OrdersTabs({ activeTab, onTabChange, className, customerId }: OrdersTabsProps) {
  const { role } = useAppSelector((state) => state.auth);
  // Fetch status counts from the counts API
  const { data: countsData } = useOrderCounts(customerId, !!role);

  return (
    <nav className={cn("flex space-x-0 h-full items-end", className)} aria-label="Tabs">
      {TABS.map((tab) => {
        const key = tab.toLowerCase();
        const count = countsData?.data?.[key] ?? countsData?.data?.[tab] ?? 0;
        const isActive = activeTab === key;

        return (
          <ModuleTabs
            key={tab}
            tab={tab}
            tabKey={tabsMap[tab]}
            onTabChange={(tabStr) => onTabChange(tabStr.toLowerCase() as TabType)}
            isActive={isActive}
            count={Number(count)}
          />
        );
      })}
    </nav>
  );
}
