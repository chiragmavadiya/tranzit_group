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
    <nav className={cn("flex items-center space-x-6 h-full", className)} aria-label="Tabs">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "h-full px-1 border-b-2 font-semibold text-[13px] transition-all duration-200 relative flex items-center gap-2 outline-none whitespace-nowrap",
              isActive
                ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                : "border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:border-gray-300 dark:hover:border-zinc-600"
            )}
          >
            {tab.label}
            {/* {tab.count > 0 && (
              <span className={cn(
                "px-1.5 py-0.5 text-[10px] rounded-full font-bold transition-all duration-300",
                isActive
                  ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                  : "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500"
              )}>
                {tab.count}
              </span>
            )} */}
          </button>
        );
      })}
    </nav>
  );
}
