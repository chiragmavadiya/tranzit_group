import { useState, useCallback, useMemo } from 'react';
import { Calendar as CalendarIcon, ClipboardList, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { DataTable, StatCard } from '@/components/common';
import { MOCK_PARCEL_REPORTS, PARCEL_COLUMNS } from '../constants';

export default function ParcelReportPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date('2026-04-01'));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date('2026-04-17'));
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(25);

  const stats = useMemo(() => [
    {
      label: 'Total Order',
      value: '3',
      icon: ClipboardList,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50 dark:bg-rose-500/10',
    },
    {
      label: 'Total Amount Paid',
      value: '$1357.12',
      icon: DollarSign,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
    },
  ], []);

  const handleApplyFilters = useCallback(() => {
    console.log('Applying filters:', { startDate, endDate });
  }, [startDate, endDate]);

  const handleReset = useCallback(() => {
    setStartDate(undefined);
    setEndDate(undefined);
  }, []);

  const filteredData = useMemo(() => {
    if (!search) return MOCK_PARCEL_REPORTS;
    return MOCK_PARCEL_REPORTS.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

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
          // className="w-full h-10 bg-[#001F3F] hover:bg-[#001F3F]/90 text-white font-semibold transition-colors"
          >
            Filter
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            // className="w-full h-10 bg-[#7F8C8D] hover:bg-[#7F8C8D]/90 text-white border-none font-semibold transition-colors"
            className="h-8 p-3"
            size="sm"
          >
            Reset
          </Button>
        </div>

        <div className="">
        </div>
      </div>

      {/* Table Section */}
      <div className='rounded-xl min-h-[300px] shadow-md flex-1 flex flex-col min-h-0 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden'>
        <DataTable
          columns={PARCEL_COLUMNS as any}
          data={filteredData}
          headerTitle="Customer Parcel Report"
          searchable
          searchValue={search}
          onSearchChange={setSearch}
          pageSize={pageSize}
          onPageSizeChange={(val) => setPageSize(Number(val))}
          className="pb-3"
        />
      </div>
    </div>
  );
}
