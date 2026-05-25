import { cn } from '@/lib/utils';
import type { ReportType, ReportTab } from '../types';
import { REPORT_TABS } from '../constants';
import { useReportCounts } from '../hooks/useReports';
import ModuleTabs from '@/components/common/ModuleTabs';

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
  const { data: countsData } = useReportCounts();

  return (
    <nav className={cn("flex h-full items-end", className)} aria-label="Tabs">
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
  );
}
