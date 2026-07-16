import { cn } from '@/lib/utils';
import type { ReportType, ReportTab } from '../types';
import { REPORT_TABS } from '../constants';
import { useReportCounts } from '../hooks/useReports';
import ModuleTabs from '@/components/common/ModuleTabs';
import { LayoutGroup } from 'framer-motion';

import { useSearchParams } from 'react-router-dom';

import { FormSelect } from '@/features/orders/components/OrderFormUI';

interface ReportsTabsProps {
  activeTab: ReportType;
  onTabChange: (tab: ReportType) => void;
  tabs?: ReportTab[];
  className?: string;
}

const key_destructor = {
  'shipment': 'shipment_count',
  'transaction': 'transaction_count',
  'invoice': 'invoice_count'
} as const;

export function ReportsTabs({ activeTab, onTabChange, tabs = REPORT_TABS, className }: ReportsTabsProps) {
  const [searchParams] = useSearchParams();
  const rawStartDate = searchParams.get('start_date');
  const rawEndDate = searchParams.get('end_date');

  const start_date = rawStartDate ? rawStartDate.replace(/-/g, '/') : undefined;
  const end_date = rawEndDate ? rawEndDate.replace(/-/g, '/') : undefined;

  const filters = start_date || end_date ? { start_date, end_date } : undefined;
  const { data: countsData } = useReportCounts(filters);

  return (
    <>
      <LayoutGroup id="reports-tabs">
        <nav className={cn("hidden tablet:flex h-full items-end gap-6", className)} aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const key = key_destructor[tab.id as keyof typeof key_destructor];
            const count = countsData?.data?.[key] ?? 0;

            return (
              <ModuleTabs
                key={tab.id}
                tab={tab.label}
                onTabChange={() => onTabChange(tab.id)}
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
            if (val) onTabChange(val as ReportType);
          }}
          options={tabs.map((tab) => {
            const key = key_destructor[tab.id as keyof typeof key_destructor];
            const count = countsData?.data?.[key] ?? 0;
            return {
              label: `${tab.label} (${count})`,
              value: tab.id,
            };
          })}
          placeholder="Select report"
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
