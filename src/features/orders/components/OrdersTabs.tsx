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
          <ModuleTabs
            key={tab}
            tab={tab}
            onTabChange={(tabStr) => onTabChange(tabStr.toLowerCase() as TabType)}
            isActive={isActive}
            count={Number(count)}
          />
        );
      })}
    </nav>
  );
}
