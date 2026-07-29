import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { FormSelect, CustomLabel } from '@/features/orders/components/OrderFormUI';
import { DateFilter } from '@/components/common/DateFilter';
import type { DateFilterValue } from '@/components/common/DateFilter/types';
import type { DebugFilters } from '../types';

interface DebugFilterBarProps {
  filters: DebugFilters;
  onFiltersChange: (filters: DebugFilters) => void;
  customerOptions?: Array<{ label: string; value: string }>;
  endpointOptions?: Array<{ label: string; value: string }>;
  activeTab: string;
}

export const DebugFilterBar = ({
  filters,
  onFiltersChange,
  customerOptions = [],
  endpointOptions = [],
  activeTab,
}: DebugFilterBarProps) => {
  const statusOptions = activeTab === 'alerts'
    ? [
      { label: 'All Statuses', value: 'all' },
      { label: 'Open', value: 'open' },
      { label: 'Resolved', value: 'resolved' },
      { label: 'Ignored', value: 'ignored' },
    ]
    : [
      { label: 'All Statuses', value: 'all' },
      { label: 'Success', value: 'success' },
      { label: 'Failed', value: 'failed' },
    ];

  const [dateRange, setDateRange] = useState<DateFilterValue>({
    type: 'custom',
    from: filters.from_date || '',
    to: filters.to_date || '',
    label: 'Custom',
  });

  // const handleSearchChange = useCallback((search: string) => {
  //   onFiltersChange({ ...filters, search, page: 1 });
  // }, [filters, onFiltersChange]);

  const handleCustomerChange = useCallback((customer: string) => {
    onFiltersChange({ ...filters, user_id: customer === 'all' ? undefined : customer, page: 1 });
  }, [filters, onFiltersChange]);

  const handleEndpointChange = useCallback((endpoint: string) => {
    onFiltersChange({ ...filters, endpoint: endpoint === 'all' ? undefined : endpoint, page: 1 });
  }, [filters, onFiltersChange]);

  const handleStatusChange = useCallback((status: string) => {
    onFiltersChange({ ...filters, status: status === 'all' ? undefined : status, page: 1 });
  }, [filters, onFiltersChange]);

  const handleDateRangeChange = useCallback((range: DateFilterValue) => {
    setDateRange(range);
    onFiltersChange({
      ...filters,
      from_date: range.from,
      to_date: range.to,
      page: 1,
    });
  }, [filters, onFiltersChange]);

  const handleReset = useCallback(() => {
    setDateRange({ type: 'custom', from: '', to: '', label: 'Custom' });
    onFiltersChange({ search: '', page: 1, per_page: 10 });
  }, [onFiltersChange]);

  return (
    <div className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] space-y-4 print:hidden">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-10 gap-4">
        {/* <div className="lg:col-span-2">
          <FormInput
            label="Search"
            placeholder="Trace ID, customer..."
            value={filters.search || ''}
            onChange={(val) => handleSearchChange(val)}
          />
        </div> */}

        {customerOptions.length > 0 && (
          <div className="lg:col-span-3">
            <FormSelect
              label="Customer"
              value={filters.user_id || 'all'}
              onValueChange={handleCustomerChange}
              options={[{ label: 'All Customers', value: 'all' }, ...customerOptions]}
              placeholder="All"
              searchdisable={false}
              allowClear={false}
            />
          </div>
        )}

        {endpointOptions.length > 0 && (
          <div className="lg:col-span-3">
            <FormSelect
              label="Endpoint"
              value={filters.endpoint || 'all'}
              onValueChange={handleEndpointChange}
              options={[{ label: 'All Endpoints', value: 'all' }, ...endpointOptions]}
              placeholder="All"
              searchdisable={false}
            />
          </div>
        )}

        {activeTab !== 'failed-jobs' && activeTab !== 'external-api-failures' && statusOptions.length > 0 && (
          <div className="lg:col-span-3">
            <FormSelect
              label="Status"
              value={filters.status || 'all'}
              onValueChange={handleStatusChange}
              options={statusOptions}
              placeholder="All"
              searchdisable={true}
              allowClear={false}
            />
          </div>
        )}

        {/* {sourceOptions.length > 0 && (
          <div className="lg:col-span-3">
            <FormSelect
              label="Source"
              value={filters.source || 'all'}
              onValueChange={handleSourceChange}
              options={sourceOptions}
              placeholder="All"
              searchdisable={true}
              allowClear={false}
            />
          </div>
        )} */}

        <div className="lg:col-span-3 flex flex-col">
          <CustomLabel label="Date Range" />
          <DateFilter value={dateRange} onChange={handleDateRangeChange} className="w-full" />
        </div>

        <div className=" flex items-end">
          <Button
            onClick={handleReset}
            variant="ghost"
            size="sm"
            className="h-8 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-bold tracking-wide text-[11px] gap-1 px-3 transition-all w-full"
          >
            <XCircle className="w-3.5 h-3.5" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};
