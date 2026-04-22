import { useState, useCallback, useMemo } from 'react';
import { Calendar as CalendarIcon, ClipboardList, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { DataTable, StatCard } from '@/components/common';
import { PARCEL_COLUMNS } from '../constants';
import { useParcelReport } from '../hooks/useReports';

export default function ParcelReportPage() {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);

  const formatDate = (date?: Date) => date ? format(date, 'dd/MM/yyyy') : undefined;

  const filters = useMemo(() => ({
    start_date: formatDate(startDate),
    end_date: formatDate(endDate),
    search: search || undefined,
    per_page: pageSize,
    page: page,
  }), [startDate, endDate, search, pageSize, page]);

  const { data, isLoading } = useParcelReport(filters);

  // You can still compute dynamic stats from the paginated API response, 
  // or use meta fields if your API provides global statistics.
  const stats = useMemo(() => [
    {
      label: 'Total Order',
      value: data?.meta?.total?.toString() || '0',
      icon: ClipboardList,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50 dark:bg-rose-500/10',
    },
    {
      label: 'Total Amount Paid',
      value: '-', // Needs to come from API or be calculated if available globally
      icon: DollarSign,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
    },
  ], [data?.meta?.total]);

  const handleApplyFilters = useCallback(() => {
    setPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSearch('');
    setPage(1);
  }, []);

  return (
    <div className="flex flex-col flex-1 gap-4 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} className="shadow-sm border-gray-100 dark:border-zinc-800" contentClassName="py-3" />
        ))}
      </div>

      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end bg-white dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        <div className="lg:col-span-3 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 ml-0.5">Start Date</label>
          <Popover>
            <PopoverTrigger>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-8 justify-between text-left font-normal border-gray-200 dark:border-zinc-800",
                  !startDate && "text-muted-foreground"
                )}
              >
                {startDate ? format(startDate, "dd/MM/yyyy") : <span>Pick a date</span>}
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 ml-0.5">End Date</label>
          <Popover>
            <PopoverTrigger>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-8 justify-between text-left font-normal border-gray-200 dark:border-zinc-800",
                  !endDate && "text-muted-foreground"
                )}
              >
                {endDate ? format(endDate, "dd/MM/yyyy") : <span>Pick a date</span>}
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleApplyFilters}
            variant="default"
            size="sm"
            className="h-8 p-3"
          >
            Filter
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="h-8 p-3"
            size="sm"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className='rounded-xl min-h-[300px] shadow-md flex-1 flex flex-col min-h-0 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden'>
        <DataTable
          columns={PARCEL_COLUMNS as any}
          data={data?.data || []}
          headerTitle="Customer Parcel Report"
          searchable
          searchValue={search}
          onSearchChange={(val) => { setSearch(val); setPage(1); }}
          pageSize={pageSize}
          onPageSizeChange={(val) => { setPageSize(Number(val)); setPage(1); }}
          className="pb-3"
          totalItems={data?.meta?.total || 0}
          currentPage={page}
          onPageChange={setPage}
          loading={isLoading}
        />
      </div>
    </div>
  );
}
