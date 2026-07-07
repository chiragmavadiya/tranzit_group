import { useState, useMemo } from 'react';
import { ClipboardList, DollarSign, Receipt, Banknote, Coins } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';
import { useSearchParams } from 'react-router-dom';
import { DataTable } from '@/components/common/DataTable';
import { StatCard } from '@/components/common/StatCard';
import { AUSPOST_REPORT_COLUMNS } from '../constants';
import { useAuspostReport, useExportAuspostReport } from '../hooks/useReports';
import DatePicker from '@/components/common/DatePicker';
import { formateCurrency } from '@/lib/utils';
import { useAppSelector } from '@/hooks/store.hooks';
import { CustomLabel } from '@/features/orders/components/OrderFormUI';

export default function AuspostReportPage() {
  const { is_sub_user, team_access } = useAppSelector((state) => state.auth);
  const canReadWrite = useMemo(() => !is_sub_user || team_access?.permissions?.report === 'full', [is_sub_user, team_access]);

  const [searchParams] = useSearchParams();

  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    const fromParam = searchParams.get('start_date');
    if (fromParam) {
      const parsed = parse(fromParam, 'dd/MM/yyyy', new Date());
      return isValid(parsed) ? parsed : undefined;
    }
    return undefined;
  });

  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    const toParam = searchParams.get('end_date');
    if (toParam) {
      const parsed = parse(toParam, 'dd/MM/yyyy', new Date());
      return isValid(parsed) ? parsed : undefined;
    }
    return undefined;
  });
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);

  const formatDateStr = (date?: Date) => date ? format(date, 'dd/MM/yyyy') : undefined;

  const filters = useMemo(() => ({
    start_date: formatDateStr(startDate),
    end_date: formatDateStr(endDate),
    search: search || undefined,
    per_page: pageSize,
    page: page,
  }), [startDate, endDate, search, pageSize, page]);

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
    <div className="flex flex-col flex-1 gap-4 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30">

      {/* Summary Section */}
      <div className="space-y-3 print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-5  gap-4">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} className="shadow-sm border-gray-100 dark:border-zinc-800" contentClassName="py-4" />
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-lg min-h-[300px] shadow-md flex-1 flex flex-col border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
        <DataTable
          columns={AUSPOST_REPORT_COLUMNS as any}
          data={data?.data || []}
          headerTitle="Australia Post Report"
          searchable
          searchValue={search}
          onSearchChange={(val) => { setSearch(val); setPage(1); }}
          pageSize={pageSize}
          onPageSizeChange={(val) => { setPageSize(Number(val)); setPage(1); }}
          className="pb-3 text-xs"
          totalItems={data?.meta?.total || 0}
          currentPage={page}
          onPageChange={setPage}
          rowKey="order_number"
          loading={isLoading}
          onExport={(format) => exportMutation.mutate({ ...filters, format })}
          isExporting={exportMutation.isPending}
          exportable={canReadWrite}
          headerPosition='left'
          customHeader={<div className="flex gap-2 mr-4">
            <div className="flex gap-1 items-center">
              <CustomLabel label="From:" />
              <DatePicker
                date={startDate}
                setDate={setStartDate}
                placeholder="Start Date"
                className="w-full h-8"
                showClear={true}
              />
            </div>
            <div className="flex gap-1 items-center">
              <CustomLabel label="To:" />
              <DatePicker
                date={endDate}
                setDate={setEndDate}
                placeholder="End Date"
                className="w-full h-8"
                showClear={true}
              />
            </div>
          </div>}
        />
      </div>
    </div>
  );
}
