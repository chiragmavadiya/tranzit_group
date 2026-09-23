import { useState, useMemo, useCallback } from 'react';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';
import { DataTable } from '@/components/common/DataTable';
import { StatCard } from '@/components/common/StatCard';
import { FormSelect } from '@/features/orders/components/OrderFormUI';
import { DateFilter } from '@/components/common/DateFilter';
import type { DateFilterValue } from '@/components/common/DateFilter/types';
import { hydrateDateFilter } from '@/components/common/DateFilter/utils';

import { getWalletColumns, TRANSACTION_TYPES } from '../constants';
import { useWalletTransactions, useWalletExport, useDownloadReceipt } from '../hooks/useWalletTransactions';
import type { WalletTransaction } from '../types';
import { useAppSelector } from '@/hooks/store.hooks';
import { formateCurrency } from '@/lib/utils';
import useLocalStorage from '@/hooks/useLocalStorage';

export default function TransactionsPage() {
  const { is_sub_user, team_access } = useAppSelector((state) => state.auth);
  const canReadWrite = useMemo(() => !is_sub_user || team_access?.permissions?.get_quote === 'full', [is_sub_user, team_access]);
  const [transactionType, setTransactionType] = useLocalStorage<string>('wallet_transaction_type', 'all');
  const [search, setSearch] = useLocalStorage<string>('wallet_search', '');
  const [pageSize, setPageSize] = useLocalStorage<number>('wallet_page_size', 25);
  const [currentPage, setCurrentPage] = useLocalStorage<number>('wallet_current_page', 1);
  const [downloadingId, setDownloadingId] = useState<string | number | null>(null);

  const [dateRange, setDateRange] = useLocalStorage<DateFilterValue>('wallet_date_range', {
    type: 'custom',
    from: '',
    to: '',
    label: 'All Time',
  }, hydrateDateFilter);

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

  const { data: transactionsData, isLoading } = useWalletTransactions({
    transaction_type: transactionType === 'all' ? undefined : transactionType,
    search: search || undefined,
    page: currentPage,
    per_page: pageSize,
    start_date: formattedStartDate,
    end_date: formattedEndDate,
  });
  const { summary } = useAppSelector((state) => state.wallet);

  const exportMutation = useWalletExport();
  const downloadReceiptMutation = useDownloadReceipt();

  const handleDownloadReceipt = useCallback((row: WalletTransaction) => {
    const targetId = row.id || row.transaction_id;
    if (!targetId) return;

    setDownloadingId(targetId);
    downloadReceiptMutation.mutate(targetId, {
      onSettled: () => {
        setDownloadingId(null);
      }
    });
  }, [downloadReceiptMutation]);

  const columns = useMemo(() => {
    return getWalletColumns(handleDownloadReceipt, downloadingId, canReadWrite);
  }, [handleDownloadReceipt, downloadingId, canReadWrite]);

  const stats = useMemo(() => [
    {
      label: 'Credits',
      value: formateCurrency(summary?.total_credit ?? 0),
      icon: TrendingDown,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
    },
    {
      label: 'Debits',
      value: formateCurrency(summary?.total_debit ?? 0),
      icon: TrendingUp,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50 dark:bg-rose-500/10',
    },
    {
      label: 'Balance',
      value: formateCurrency(summary?.wallet_balance ?? 0),
      icon: Wallet,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/5 dark:bg-primary/10',
    },
  ], [summary?.total_credit, summary?.total_debit, summary?.wallet_balance]);

  const handleTransactionTypeChange = (val: string) => {
    setTransactionType(val);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleExport = useCallback((formatType: 'pdf' | 'excel' | 'print' | 'csv') => {
    exportMutation.mutate({
      format: formatType as any,
      search: search || undefined,
      transaction_type: transactionType === 'all' ? undefined : transactionType,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
    });
  }, [exportMutation, search, transactionType, formattedStartDate, formattedEndDate]);

  return (
    <div className="flex flex-col flex-1 gap-4 p-page-padding animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">



      {/* Summary Section */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} className="shadow-sm border-gray-100 dark:border-zinc-800" contentClassName="py-4" />
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-xl shadow-md border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex-none h-auto">
        <div className="flex flex-wrap items-end justify-end gap-3 px-4 pt-3 sm:pt-0 print:hidden">
          <div className="w-full sm:w-60 space-y-1 text-left">
            <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400">Date Range</span>
            <DateFilter
              value={dateRange}
              onChange={setDateRange}
              className="w-full"
            />
          </div>

          {/* Devider */}
          <div className="hidden sm:block w-[2px] h-8 bg-gray-400 dark:bg-zinc-800" />

          <div className="w-full sm:w-60 space-y-1 text-left">
            <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400">Transaction Type</span>
            <FormSelect
              options={TRANSACTION_TYPES}
              value={transactionType}
              onValueChange={(val) => handleTransactionTypeChange(val as any)}
              placeholder="Select Transaction Type"
              className="h-8 w-full"
              searchdisable
              allowClear={false}
            />
          </div>
        </div>
        <DataTable
          columns={columns as any}
          data={transactionsData?.data || []}
          headerTitle="Transactions List"
          searchable
          searchValue={search}
          onSearchChange={handleSearchChange}
          pageSize={pageSize}
          onPageSizeChange={(val) => {
            setPageSize(Number(val));
            setCurrentPage(1);
          }}
          className="pb-3 flex-none h-auto"
          totalItems={transactionsData?.meta?.total || 0}
          loading={isLoading}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onExport={handleExport}
          isExporting={exportMutation.isPending}
          exportable={canReadWrite}
        />
      </div>
    </div>
  );
}
