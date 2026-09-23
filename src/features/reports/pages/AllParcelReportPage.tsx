import { useMemo, useCallback } from 'react';
import {
  ClipboardList, DollarSign, Users, TrendingUp, Truck, Search
} from 'lucide-react';
import { DataTable } from '@/components/common/DataTable';
import { ExportMenu } from '@/components/common/ExportMenu';
import { StatCard } from '@/components/common/StatCard';
import { ALL_PARCEL_COLUMNS, PARCEL_REPORT_SOURCE_OPTIONS } from '../constants';
import {
  useAllParcelReport,
  useExportAllParcelReport,
} from '../hooks/useReports';
import { FormSelect, FormInput } from '@/features/orders/components/OrderFormUI';
import { DateFilter } from '@/components/common/DateFilter';
import type { DateFilterValue } from '@/components/common/DateFilter/types';
import { hydrateDateFilter } from '@/components/common/DateFilter/utils';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { useAppSelector } from '@/hooks/store.hooks';
import { formateCurrency } from '@/lib/utils';
import type { ReportFilters } from '../types';

import useLocalStorage from '@/hooks/useLocalStorage';
import { DEFAULT_PAGE_SIZES } from '@/constants/global.constants';

export default function AllParcelReportPage() {
  const { is_sub_user, team_access } = useAppSelector((state) => state.auth);
  const canReadWrite = useMemo(() => !is_sub_user || team_access?.permissions?.report === 'full', [is_sub_user, team_access]);

  const [dateRange, setDateRange] = useLocalStorage<DateFilterValue>('all_parcel_report_date_range', {
    type: 'custom',
    from: undefined,
    to: undefined,
    label: 'All Time',
  }, hydrateDateFilter);

  const [search, setSearch] = useLocalStorage<string>('all_parcel_report_search', '');
  const [pageSize, setPageSize] = useLocalStorage<number>('all_parcel_report_page_size', 100);
  const [page, setPage] = useLocalStorage<number>('all_parcel_report_page', 1);
  const [selectedCustomer, setSelectedCustomer] = useLocalStorage<string>('all_parcel_report_customer', '');
  const [courierType, setCourierType] = useLocalStorage<string>('all_parcel_report_source', 'all');

  const handleDateRangeChange = useCallback((val: DateFilterValue) => {
    setPage(1);
    setDateRange(val);
  }, [setDateRange, setPage]);

  // The API rejects a half-open range, so send the dates only when both sides are set.
  const baseFilters: ReportFilters = useMemo(() => ({
    ...(dateRange.from && dateRange.to ? { start_date: dateRange.from, end_date: dateRange.to } : {}),
    search: search || undefined,
    customer: selectedCustomer !== '' ? selectedCustomer : undefined,
    courier_type: (courierType || 'all') as ReportFilters['courier_type'],
  }), [dateRange.from, dateRange.to, search, selectedCustomer, courierType]);

  const filters: ReportFilters = useMemo(() => ({
    ...baseFilters,
    per_page: pageSize,
    page: page,
  }), [baseFilters, pageSize, page]);

  const { data, isLoading } = useAllParcelReport(filters);
  const exportMutation = useExportAllParcelReport();
  const { data: customersData } = useCustomers({ per_page: 1000 });

  const stats = useMemo(() => [
    {
      label: 'Total Customer',
      value: data?.summary?.total_customers?.toString() || '0',
      icon: Users,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10 h-10 w-10',
    },
    {
      label: 'Total Order',
      value: data?.summary?.total_orders || 0,
      subValue: `Tranzit ${data?.summary?.tranzit_orders || 0} · BYO ${data?.summary?.integrated_orders || 0}`,
      icon: ClipboardList,
      iconColor: 'text-rose-500',
      iconBg: 'bg-rose-50 dark:bg-rose-500/10 h-10 w-10',
    },
    {
      label: 'Total Amount Paid',
      value: formateCurrency(data?.summary?.total_amount || data?.summary?.total_amount_paid || 0),
      icon: DollarSign,
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10 h-10 w-10',
    },
    {
      label: 'Total Margin',
      value: formateCurrency(data?.summary?.total_markup || 0),
      icon: TrendingUp,
      iconColor: 'text-orange-500',
      iconBg: 'bg-orange-50 dark:bg-orange-500/10 h-10 w-10',
    },
    {
      label: 'Total Pickup Charges',
      value: formateCurrency(data?.summary?.total_pickup || 0),
      icon: Truck,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50 dark:bg-amber-500/10',
    },
  ], [data?.summary]);

  return (
    <div className="flex flex-col flex-1 gap-4 p-page-padding animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">

      <div className="print:hidden">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat, idx) => (
            <StatCard
              key={idx}
              {...stat}
              className="shadow-sm border-gray-100 dark:border-zinc-800"
              contentClassName="py-3"
            />
          ))}
        </div>
      </div>

      <div className='rounded-lg min-h-[300px] shadow-md border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex-none h-auto'>
        <div className="flex flex-col gap-3 p-4 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-t-lg print:hidden">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-bold text-gray-800 dark:text-zinc-200 my-0">
              All Reports
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto flex-1 sm:flex-1">
              <div className="flex-1 min-w-[200px] sm:w-64 md:w-72">
                <FormInput
                  placeholder="Search..."
                  value={search}
                  onChange={(value) => { setSearch(value); setPage(1); }}
                  icon={Search}
                  className="w-full h-8"
                />
              </div>
              <div className="flex-1 min-w-[200px] sm:w-60 md:w-64">
                <DateFilter
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  className="w-full h-8"
                />
              </div>
              <div className="w-full sm:w-60 md:w-64 flex-none sm:flex-initial">
                <FormSelect
                  placeholder="Select Customer"
                  value={selectedCustomer}
                  onValueChange={(val) => { setSelectedCustomer(val || ''); setPage(1); }}
                  options={customersData?.data?.map((c: any) => ({
                    value: c.id.toString(),
                    label: `${c.first_name} ${c.last_name} (${c.email})`
                  })) || []}
                  selectClassName="h-8"
                />
              </div>
              <div className="w-full sm:w-64 md:w-72 flex-none sm:flex-initial">
                <FormSelect
                  placeholder="Report Type"
                  value={courierType}
                  onValueChange={(val) => { setCourierType(val || 'all'); setPage(1); }}
                  options={PARCEL_REPORT_SOURCE_OPTIONS}
                  selectClassName="h-8"
                  allowClear={false}
                  searchdisable
                />
              </div>

              <div className="flex items-center gap-1.5 h-8 shrink-0">
                <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Show:</span>
                <FormSelect
                  className="w-[80px]"
                  selectClassName="h-8 text-xs font-bold"
                  value={pageSize.toString()}
                  onValueChange={(val) => { if (val) { setPageSize(Number(val)); setPage(1); } }}
                  options={DEFAULT_PAGE_SIZES}
                  allowClear={false}
                  searchdisable
                />
              </div>

              {canReadWrite && (
                <ExportMenu
                  className="text-xs"
                  isExporting={exportMutation.isPending}
                  onExport={(format) => exportMutation.mutate({ ...baseFilters, format })}
                />
              )}
            </div>
          </div>
        </div>

        <DataTable
          columns={ALL_PARCEL_COLUMNS as any}
          data={data?.data || []}
          moduleName="allParcelReport"
          header={false}
          className="pb-3 text-xs flex-none h-auto"
          totalItems={data?.meta?.total || 0}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          loading={isLoading}
        />
      </div>
    </div>
  );
}
