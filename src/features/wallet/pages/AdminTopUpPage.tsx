import { useState, useMemo, useEffect } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { format, parse, isValid } from 'date-fns';
import { DataTable } from '@/components/common/DataTable';
import { StatCard } from '@/components/common/StatCard';
import { ADMIN_TOPUP_COLUMNS, TRANSACTION_TYPES } from '../constants';
import { FormSelect } from '@/features/orders/components/OrderFormUI';
import { Button } from '@/components/ui/button';
import { DateFilter } from '@/components/common/DateFilter';
import type { DateFilterValue } from '@/components/common/DateFilter/types';
import { useAdminTopups, useExportAdminTopups } from '../hooks/useWallet';
import { useDebounce } from '@/hooks/useDebounce';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { formateCurrency } from '@/lib/utils';

export default function AdminTopUpPage() {
  const [search, setSearch] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateFilterValue>({
    type: 'custom',
    from: '',
    to: '',
    label: 'All Time',
  });

  const debouncedSearch = useDebounce(search, 500);

  const formattedStartDate = useMemo(() => {
    if (!dateRange.from) return undefined;
    const parsed = parse(dateRange.from, 'dd/MM/yyyy', new Date());
    return isValid(parsed) ? format(parsed, 'dd-MM-yyyy') : undefined;
  }, [dateRange.from]);

  const formattedEndDate = useMemo(() => {
    if (!dateRange.to) return undefined;
    const parsed = parse(dateRange.to, 'dd/MM/yyyy', new Date());
    return isValid(parsed) ? format(parsed, 'dd-MM-yyyy') : undefined;
  }, [dateRange.to]);

  const { data: topupResponse, isLoading } = useAdminTopups({
    customer: selectedCustomer === 'all' ? undefined : selectedCustomer,
    status: transactionType === 'all' ? undefined : transactionType,
    search: debouncedSearch,
    page,
    per_page: pageSize,
    start_date: formattedStartDate,
    end_date: formattedEndDate,
  });
  const { data: customersData } = useCustomers({ per_page: 1000 });

  const transactions = topupResponse?.data || [];
  const totalItems = topupResponse?.meta?.total || 0;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, transactionType, selectedCustomer, dateRange]);

  const { mutate: exportAdminTopups, isPending: isExporting } = useExportAdminTopups();

  const onExport = (formatType: string) => {
    exportAdminTopups({
      format: formatType as any,
      customer: selectedCustomer === 'all' ? undefined : selectedCustomer,
      status: transactionType === 'all' ? undefined : transactionType,
      search: debouncedSearch,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
    });
  };

  const handleReset = () => {
    setSearch('');
    setTransactionType('');
    setSelectedCustomer('');
    setDateRange({
      type: 'custom',
      from: '',
      to: '',
      label: 'All Time',
    });
  };

  const stats = useMemo(() => [
    {
      label: 'Credits',
      value: formateCurrency(topupResponse?.summary?.total_credit || 0),
      icon: ArrowDownLeft,
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
      trend: { value: '+12.5%', isUp: true }
    },
    {
      label: 'Debits',
      value: formateCurrency(topupResponse?.summary?.total_debit || 0),
      icon: ArrowUpRight,
      iconColor: 'text-rose-500',
      iconBg: 'bg-rose-50 dark:bg-rose-500/10',
      trend: { value: '+5.2%', isUp: false }
    },
    {
      label: 'Balance',
      value: formateCurrency(topupResponse?.summary?.balance || 0),
      icon: Wallet,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/5 dark:bg-primary/10',
    },
  ], [topupResponse?.summary]);

  return (
    <div className="flex flex-col flex-1 gap-4 p-page-padding overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} className="shadow-sm py-1 border-gray-100 dark:border-zinc-800" />
        ))}
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-3">
            <FormSelect
              label="Transaction Type"
              value={transactionType}
              onValueChange={(val) => setTransactionType(val || 'all')}
              options={TRANSACTION_TYPES}
              placeholder="Select Transaction Type"
              className="w-full space-y-0"
            />
          </div>
          <div className="lg:col-span-3">
            <FormSelect
              label="Customer"
              placeholder="Select Customer"
              value={selectedCustomer}
              onValueChange={(val) => setSelectedCustomer(val || 'all')}
              options={customersData?.data?.map((c: any) => ({
                value: c.id.toString(),
                label: `${c.first_name} ${c.last_name} (${c.email})`
              })) || []}
            />
          </div>
          <div className="lg:col-span-4">
            <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1">Date Range</span>
            <DateFilter
              value={dateRange}
              onChange={setDateRange}
              className="w-full"
            />
          </div>
          <div className="lg:col-span-2 flex gap-3">
            <Button
              variant="outline"
              className="h-8 w-full border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wide text-[10px]"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex-none h-auto">
        <DataTable
          headerTitle="Transactions History"
          columns={ADMIN_TOPUP_COLUMNS}
          data={transactions}
          searchable
          searchValue={search}
          onSearchChange={setSearch}
          pageSize={pageSize}
          onPageSizeChange={(val) => setPageSize(Number(val))}
          currentPage={page}
          onPageChange={setPage}
          totalItems={totalItems}
          loading={isLoading}
          className="text-xs pb-3 flex-none h-auto [&_div.overflow-auto]:flex-none [&_div.overflow-auto]:h-auto [&_div.overflow-auto]:min-h-0 [&_div.overflow-auto]:overflow-y-visible [&_div.overflow-auto]:overflow-x-auto"
          rowKey="id"
          onExport={onExport}
          isExporting={isExporting}
        />
      </div>
    </div>
  );
}
