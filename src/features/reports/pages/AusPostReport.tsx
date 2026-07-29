import { useMemo, useEffect, useCallback } from 'react';
import { ClipboardList, DollarSign, Receipt, Banknote, Coins, Search } from 'lucide-react';
import { format } from 'date-fns';
import { useSearchParams } from 'react-router-dom';
import { DataTable } from '@/components/common/DataTable';
import { ExportMenu } from '@/components/common/ExportMenu';
import { StatCard } from '@/components/common/StatCard';
import { AUSPOST_REPORT_COLUMNS } from '../constants';
import { useAuspostReport, useExportAuspostReport } from '../hooks/useReports';
import { DateFilter } from '@/components/common/DateFilter';
import type { DateFilterValue } from '@/components/common/DateFilter/types';
import { formateCurrency } from '@/lib/utils';
import { useAppSelector } from '@/hooks/store.hooks';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';

import useLocalStorage from '@/hooks/useLocalStorage';
import { DEFAULT_PAGE_SIZES } from '@/constants/global.constants';

export default function AuspostReportPage() {
  const { is_sub_user, team_access } = useAppSelector((state) => state.auth);
  const canReadWrite = useMemo(() => !is_sub_user || team_access?.permissions?.report === 'full', [is_sub_user, team_access]);

  const [searchParams, setSearchParams] = useSearchParams();

  const parseLocalDate = useCallback((dateStr?: string | null) => {
    if (!dateStr) return undefined;
    const parts = dateStr.includes('/') ? dateStr.split('/') : dateStr.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // 0-based
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return undefined;
  }, []);

  const initialDateFilter = useMemo<DateFilterValue>(() => {
    const sDate = parseLocalDate(searchParams.get('start_date'));
    const eDate = parseLocalDate(searchParams.get('end_date'));
    if (sDate && eDate) {
      return {
        type: 'custom',
        from: format(sDate, 'dd/MM/yyyy'),
        to: format(eDate, 'dd/MM/yyyy'),
        label: `${format(sDate, 'dd MMM yyyy')} - ${format(eDate, 'dd MMM yyyy')}`,
      };
    }
    return {
      type: 'custom',
      from: undefined,
      to: undefined,
      label: 'All Time',
    };
  }, [searchParams, parseLocalDate]);

  const [dateRange, setDateRange] = useLocalStorage<DateFilterValue>('auspost_report_date_range', initialDateFilter);
  const [search, setSearch] = useLocalStorage<string>('auspost_report_search', '');
  const [pageSize, setPageSize] = useLocalStorage<number>('auspost_report_page_size', 100);
  const [page, setPage] = useLocalStorage<number>('auspost_report_page', 1);

  const handleDateRangeChange = useCallback((val: DateFilterValue) => {
    setPage(1);
    setDateRange(val);
  }, [setDateRange, setPage]);

  // If URL has start_date & end_date (e.g. redirected from Dashboard), synchronize dateRange state
  useEffect(() => {
    const sDate = parseLocalDate(searchParams.get('start_date'));
    const eDate = parseLocalDate(searchParams.get('end_date'));
    if (sDate && eDate) {
      const fromStr = format(sDate, 'dd/MM/yyyy');
      const toStr = format(eDate, 'dd/MM/yyyy');

      if (dateRange.from !== fromStr || dateRange.to !== toStr) {
        setDateRange({
          type: 'custom',
          from: fromStr,
          to: toStr,
          label: `${format(sDate, 'dd MMM yyyy')} - ${format(eDate, 'dd MMM yyyy')}`,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, parseLocalDate]);

  // Synchronize dateRange state to URL searchParams
  useEffect(() => {
    setSearchParams((prev) => {
      let hasChanged = false;

      const currentStartDate = prev.get('start_date') || undefined;
      const newStartDate = dateRange.from;

      if (currentStartDate !== newStartDate) {
        if (newStartDate) {
          prev.set('start_date', newStartDate);
        } else {
          prev.delete('start_date');
        }
        hasChanged = true;
      }

      const currentEndDate = prev.get('end_date') || undefined;
      const newEndDate = dateRange.to;

      if (currentEndDate !== newEndDate) {
        if (newEndDate) {
          prev.set('end_date', newEndDate);
        } else {
          prev.delete('end_date');
        }
        hasChanged = true;
      }

      return hasChanged ? prev : prev;
    }, { replace: true });
  }, [dateRange, setSearchParams]);

  const filters = useMemo(() => ({
    start_date: dateRange.from,
    end_date: dateRange.to,
    search: search || undefined,
    per_page: pageSize,
    page: page,
  }), [dateRange, search, pageSize, page]);

  const { data, isLoading } = useAuspostReport(filters);
  const exportMutation = useExportAuspostReport();

  const stats = useMemo(() => {
    const summary = data?.summary as any;
    return [
      {
        label: 'Total Orders',
        value: summary?.total_orders || 0,
        icon: ClipboardList,
        iconColor: 'text-rose-500',
        iconBg: 'bg-rose-50 dark:bg-rose-500/10 h-10 w-10',
      },
      {
        label: 'Total Paid Amount',
        value: formateCurrency(summary?.total_paid_amount || 0),
        icon: DollarSign,
        iconColor: 'text-emerald-500',
        iconBg: 'bg-emerald-50 dark:bg-emerald-500/10 h-10 w-10',
      },
      {
        label: 'Australia Post Estimated Billing',
        value: formateCurrency(summary?.australia_post_estimated_billing || 0),
        icon: Receipt,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-50 dark:bg-blue-500/10 h-10 w-10',
      },
      {
        label: 'Total GST',
        value: formateCurrency(summary?.total_gst || 0),
        icon: Banknote,
        iconColor: 'text-indigo-500',
        iconBg: 'bg-indigo-50 dark:bg-indigo-500/10 h-10 w-10',
      },
      {
        label: 'Total Fuel Levy',
        value: formateCurrency(summary?.total_fuel_levy || 0),
        icon: Coins,
        iconColor: 'text-amber-500',
        iconBg: 'bg-amber-50 dark:bg-amber-500/10 h-10 w-10',
      },
    ];
  }, [data?.summary]);

  return (
    <div className="flex flex-col flex-1 gap-4 p-page-padding animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">

      {/* Summary Section */}
      <div className="print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} className="shadow-sm border-gray-100 dark:border-zinc-800" contentClassName="py-3" />
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-lg min-h-[300px] shadow-md border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex-none h-auto">
        <div className="flex flex-col gap-3 p-4 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-t-lg print:hidden">
          {/* Row 1: Title */}
          <div className="flex items-center justify-between">
            <h1 className="text-base font-bold text-gray-800 dark:text-zinc-200 my-0">
              Australia Post Report
            </h1>
          </div>

          {/* Row 2: Filters & Actions */}
          <div className="flex flex-wrap items-center gap-2.5 w-full">
            {/* Search & Date Filter Group */}
            <div className="flex items-center gap-2 w-full sm:w-auto flex-1 sm:flex-1">
              <div className="flex-1 sm:w-64 md:w-72">
                <FormInput
                  placeholder="Search..."
                  value={search}
                  onChange={(value) => { setSearch(value); setPage(1); }}
                  icon={Search}
                  className="w-full h-8"
                />
              </div>
              <div className="flex-1 sm:w-60 md:w-64">
                <DateFilter
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  className="w-full h-8"
                />
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
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
                  onExport={(format) => exportMutation.mutate({
                    start_date: dateRange.from,
                    end_date: dateRange.to,
                    search: search || undefined, format
                  })}
                />
              )}
            </div>
          </div>
        </div>

        <DataTable
          columns={AUSPOST_REPORT_COLUMNS as any}
          data={data?.data || []}
          header={false}
          className="pb-3 text-xs flex-none h-auto"
          totalItems={data?.meta?.total || 0}
          currentPage={page}
          onPageChange={setPage}
          pageSize={pageSize}
          rowKey="order_number"
          loading={isLoading}
        />
      </div>
    </div>
  );
}
