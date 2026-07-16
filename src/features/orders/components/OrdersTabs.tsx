import { cn } from '@/lib/utils';
import type { TabType } from '@/features/orders/types';
import { TABS } from '@/features/orders/constants';
import { useOrderCounts } from '@/features/orders/hooks/useOrders';
import { useAppSelector } from '@/hooks/store.hooks';
import ModuleTabs from '@/components/common/ModuleTabs';
import { useSearchParams } from 'react-router-dom';
import { LayoutGroup } from 'framer-motion';

import { FormSelect } from '@/features/orders/components/OrderFormUI';

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
  const [searchParams] = useSearchParams();

  const search = searchParams.get('search') || undefined;
  const startDate = searchParams.get('start_date') || undefined;
  const endDate = searchParams.get('end_date') || undefined;

  // Fetch status counts from the counts API
  const { data: countsData } = useOrderCounts({
    customer: customerId,
    search,
    start_date: startDate,
    end_date: endDate,
  }, !!role);

  return (
    <>
      <LayoutGroup id="orders-tabs">
        <nav className={cn("hidden tablet:flex space-x-0 h-full items-end gap-6", className)} aria-label="Tabs">
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
      </LayoutGroup>

      <div className="flex tablet:hidden h-full items-center px-1">
        <FormSelect
          value={activeTab}
          onValueChange={(val) => {
            if (val) onTabChange(val as TabType);
          }}
          options={TABS.map((tab) => {
            const key = tab.toLowerCase();
            const count = countsData?.data?.[key] ?? countsData?.data?.[tab] ?? 0;
            return {
              label: `${tabsMap[tab] || tab} (${count})`,
              value: key,
            };
          })}
          placeholder="Select status"
          allowClear={false}
          searchdisable={true}
          className="w-[160px]"
          selectClassName="h-8 [&_input]:text-[12px]! font-semibold"
          optionClassName="text-[12px]!"
        />
      </div>
    </>
  );
}
