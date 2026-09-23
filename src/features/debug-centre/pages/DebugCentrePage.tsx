import { useMemo, useCallback, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';
import { DebugStatsGrid } from '../components/DebugStatsGrid';
import { DebugFilterBar } from '../components/DebugFilterBar';
import { TracesTab } from '../components/tabs/TracesTab';
import { AlertsTab } from '../components/tabs/AlertsTab';
import { FailedJobsTab } from '../components/tabs/FailedJobsTab';
import { ExternalApiFailuresTab } from '../components/tabs/ExternalApiFailuresTab';
import { SlowRequestsTab } from '../components/tabs/SlowRequestsTab';
import { SlowExternalCallsTab } from '../components/tabs/SlowExternalCallsTab';
import { CustomerActivityTab } from '../components/tabs/CustomerActivityTab';
import { DEBUG_TABS, type TabKey } from '../constants/tabs';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import ModuleTabs from '@/components/common/ModuleTabs';
import { LayoutGroup } from 'framer-motion';
import type { DebugFilters } from '../types';
import { FormSelect } from '@/features/orders/components/OrderFormUI';

const TAB_CONTENT: Record<TabKey, typeof TracesTab> = {
  'traces': TracesTab,
  'alerts': AlertsTab,
  'failed-jobs': FailedJobsTab,
  'external-api-failures': ExternalApiFailuresTab,
  'slow-requests': SlowRequestsTab,
  'slow-external-calls': SlowExternalCallsTab,
  'customer-activity': CustomerActivityTab,
};

const FILTERS_KEY = 'debug_centre_filters';
const DEFAULT_FILTERS: DebugFilters = { search: '', page: 1, per_page: 25 };

const readStoredFilters = (): DebugFilters => {
  try {
    const stored = localStorage.getItem(FILTERS_KEY);
    return stored ? { ...DEFAULT_FILTERS, ...JSON.parse(stored) } : DEFAULT_FILTERS;
  } catch {
    return DEFAULT_FILTERS;
  }
};

export default function DebugCentrePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as TabKey) || 'traces';

  const { data: customersData } = useCustomers({ per_page: 1000 });

  const customerOptions = useMemo(() => {
    const options = customersData?.data?.map((c: any) => ({
      value: c.id.toString(),
      label: `${c.first_name} ${c.last_name} (${c.email})`
    })) || [];
    return [
      { value: '1', label: 'Super Admin' },
      ...options
    ];
  }, [customersData]);

  const [filters, setFilters] = useState<DebugFilters>(readStoredFilters);

  useEffect(() => {
    localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
  }, [filters]);

  // Every filter change goes through here as a patch of just the fields it owns,
  // merged into the latest state. Callers never spread a snapshot of `filters`,
  // so a memoized child holding an older handler still cannot revert other fields.
  const updateFilters = useCallback((patch: Partial<DebugFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const debouncedSearch = useDebounce(filters.search || '', 400);

  // What actually hits the API: the live filters with the search term debounced.
  const queryFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch]
  );

  const handleTabChange = (newTab: string) => {
    // Alerts uses a different status vocabulary, so status can't carry across that boundary.
    const crossesAlertBoundary = (activeTab === 'alerts') !== (newTab === 'alerts');
    updateFilters({ page: 1, ...(crossesAlertBoundary && { status: undefined }) });
    setSearchParams({ tab: newTab });
  };

  const handlePageChange = useCallback((page: number) => updateFilters({ page }), [updateFilters]);
  const handlePageSizeChange = useCallback((per_page: number) => updateFilters({ per_page, page: 1 }), [updateFilters]);
  const handleSearchChange = useCallback((search: string) => updateFilters({ search, page: 1 }), [updateFilters]);

  const TabContent = TAB_CONTENT[activeTab] ?? TracesTab;

  return (
    <div className="flex flex-col flex-1 gap-4 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      {/* Stats */}
      <DebugStatsGrid />

      {/* Filters */}
      <DebugFilterBar
        filters={filters}
        onFilterChange={updateFilters}
        activeTab={activeTab}
        customerOptions={customerOptions}
      />

      {/* Tabs */}
      <div className="flex flex-col gap-4 flex-1">
        <LayoutGroup id="debug-tabs">
          <nav className="hidden tablet:flex space-x-0 items-end gap-6 border-b border-slate-200 dark:border-zinc-800">
            {DEBUG_TABS.map((tab) => (
              <ModuleTabs
                key={tab.key}
                tab={tab.label}
                onTabChange={() => handleTabChange(tab.key)}
                isActive={activeTab === tab.key}
                count={0}
                showCount={false}
              />
            ))}
          </nav>
        </LayoutGroup>

        <div className="flex tablet:hidden h-fit items-center px-1">
          <FormSelect
            value={activeTab}
            onValueChange={(val) => {
              if (val) handleTabChange(val);
            }}
            options={DEBUG_TABS.map((tab) => ({
              label: tab.label,
              value: tab.key,
            }))}
            placeholder="Select tab"
            allowClear={false}
            searchdisable={true}
            className="w-full"
            selectClassName="h-8 [&_input]:text-[12px]! font-semibold"
            optionClassName="text-[12px]!"
          />
        </div>

        {/* Tab Content */}
        <div className="rounded-2xl h-fit shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex-1 flex flex-col border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
          <TabContent
            filters={queryFilters}
            searchValue={filters.search || ''}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onSearchChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
}
