import { useState, useMemo, useCallback, useEffect } from 'react';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { DataTable } from '@/components/common/DataTable';
import { StatCard } from '@/components/common/StatCard';
import { FormSelect } from '@/features/orders/components/OrderFormUI';
import DatePicker from '@/components/common/DatePicker';
import { Button } from '@/components/ui/button';

import { getWalletColumns, TRANSACTION_TYPES } from '../constants';
import { useWalletTransactions, useWalletExport, useDownloadReceipt } from '../hooks/useWalletTransactions';
import type { WalletTransaction } from '../types';
import { useAppSelector } from '@/hooks/store.hooks';
import { formateCurrency } from '@/lib/utils';

export default function TransactionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [transactionType, setTransactionType] = useState('all');
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadingId, setDownloadingId] = useState<string | number | null>(null);

  const parseLocalDate = useCallback((dateStr?: string | null) => {
    if (!dateStr) return undefined;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // 0-based
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return undefined;
  }, []);

  const formatDate = useCallback((date?: Date) => {
    return date ? format(date, 'dd-MM-yyyy') : undefined;
  }, []);

  const initialStartDate = useMemo(() => {
    return parseLocalDate(searchParams.get('start_date'));
  }, [searchParams, parseLocalDate]);

  const initialEndDate = useMemo(() => {
    return parseLocalDate(searchParams.get('end_date'));
  }, [searchParams, parseLocalDate]);

  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>(() => [initialStartDate, initialEndDate]);
  const [appliedDateRange, setAppliedDateRange] = useState<[Date | undefined, Date | undefined]>(() => [initialStartDate, initialEndDate]);

  useEffect(() => {
    setSearchParams((prev) => {
      let hasChanged = false;

      const currentStartDate = prev.get('start_date') || undefined;
      const newStartDate = formatDate(appliedDateRange[0]);
      if (currentStartDate !== newStartDate) {
        if (newStartDate) {
          prev.set('start_date', newStartDate);
        } else {
          prev.delete('start_date');
        }
        hasChanged = true;
      }

      const currentEndDate = prev.get('end_date') || undefined;
      const newEndDate = formatDate(appliedDateRange[1]);
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
  }, [appliedDateRange, setSearchParams, formatDate]);

  const { data: transactionsData, isLoading } = useWalletTransactions({
    transaction_type: transactionType === 'all' ? undefined : transactionType,
    search: search || undefined,
    page: currentPage,
    per_page: pageSize,
    start_date: formatDate(appliedDateRange[0]),
    end_date: formatDate(appliedDateRange[1]),
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
    return getWalletColumns(handleDownloadReceipt, downloadingId);
  }, [handleDownloadReceipt, downloadingId]);

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

  const handleDateRangeChange = useCallback((value: Date | undefined, key: 'start' | 'end') => {
    setDateRange((prev) => {
      if (key === 'start') {
        const nextStart = value;
        const nextEnd = prev[1];
        if (nextStart && nextEnd && nextEnd < nextStart) {
          return [nextStart, nextStart];
        }
        return [nextStart, nextEnd];
      } else {
        return [prev[0], value];
      }
    });
  }, []);

  const handleApplyFilters = useCallback(() => {
    setAppliedDateRange(dateRange);
    setCurrentPage(1);
  }, [dateRange]);

  const handleClearFilters = useCallback(() => {
    setDateRange([undefined, undefined]);
    setAppliedDateRange([undefined, undefined]);
    setCurrentPage(1);
  }, []);

  const handleExport = useCallback((format: 'pdf' | 'excel' | 'print' | 'csv') => {
    exportMutation.mutate({
      format: format as any,
      search: search || undefined,
      transaction_type: transactionType === 'all' ? undefined : transactionType,
      start_date: formatDate(appliedDateRange[0]),
      end_date: formatDate(appliedDateRange[1]),
    });
  }, [exportMutation, search, transactionType, appliedDateRange, formatDate]);

  return (
    <div className="flex flex-col flex-1 gap-4 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30">

      <div className="flex flex-wrap items-end justify-end gap-3 print:hidden">
        <DatePicker
          label="Start Date"
          date={dateRange[0]}
          setDate={(value) => handleDateRangeChange(value, 'start')}
        />

        <DatePicker
          label="End Date"
          date={dateRange[1]}
          setDate={(value) => handleDateRangeChange(value, 'end')}
          disabled={dateRange[0] ? { before: dateRange[0] } : undefined}
        />

        <Button
          onClick={handleApplyFilters}
          variant="default"
          size="sm"
          className="h-8 px-4 font-semibold"
        >
          Apply
        </Button>

        {appliedDateRange[0] || appliedDateRange[1] ? (
          <Button
            onClick={handleClearFilters}
            variant="ghost"
            size="sm"
            className="h-8 px-4 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 font-semibold"
          >
            Clear
          </Button>
        ) : null}

        {/* Devider */}
        <div className="w-[2px] h-8 bg-gray-400 dark:bg-zinc-800" />

        <FormSelect
          options={TRANSACTION_TYPES}
          value={transactionType}
          onValueChange={(val) => handleTransactionTypeChange(val as any)}
          placeholder="Select Transaction Type"
          className="h-8 w-60"
          searchdisable
          allowClear={false}
        />
      </div>

      {/* Summary Section */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} className="shadow-sm border-gray-100 dark:border-zinc-800" contentClassName="py-4" />
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-xl shadow-md flex-1 flex flex-col min-h-0 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
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
          className="pb-3"
          totalItems={transactionsData?.meta?.total || 0}
          loading={isLoading}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onExport={handleExport}
          isExporting={exportMutation.isPending}
        />
      </div>
    </div>
  );
}
