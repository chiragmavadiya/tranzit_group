import { cn } from '@/lib/utils';
import type { ReportType, ReportTab } from '../types';
import { REPORT_TABS } from '../constants';
import { useReportCounts } from '../hooks/useReports';

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
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "h-10 px-6 border cursor-pointer font-semibold text-[13px] rounded-t-md transition-all duration-200 relative flex items-center gap-2 outline-none whitespace-nowrap",
              isActive
                ? "border-gray-200 border-b-white text-primary dark:border-zinc-800 dark:border-b-zinc-950"
                : "border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200"
            )}
          >
            {tab.label}
            {typeof count === 'number' && (
              <span className={cn(
                "px-2 py-0.5 text-[11px] rounded-full font-bold transition-all duration-300",
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
