import { cn } from '@/lib/utils';
import type { ReportType, ReportTab } from '../types';
import { REPORT_TABS } from '../constants';

interface ReportsTabsProps {
  activeTab: ReportType;
  onTabChange: (tab: ReportType) => void;
  tabs?: ReportTab[];
  className?: string;
}

export function ReportsTabs({ activeTab, onTabChange, tabs = REPORT_TABS, className }: ReportsTabsProps) {
  return (
    <nav className={cn("flex space-x-6 h-full items-end", className)} aria-label="Tabs">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "h-10 px-6 border font-semibold text-[13px] rounded-t-md transition-all duration-200 relative flex items-center gap-2 outline-none whitespace-nowrap",
              isActive
                ? "border-gray-200 border-b-white text-primary dark:border-zinc-800 dark:border-b-zinc-950"
                : "border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:border-gray-200 dark:hover:border-zinc-600"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
