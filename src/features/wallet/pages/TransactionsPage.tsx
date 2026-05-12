import { useState, useMemo, useCallback } from 'react';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/common/DataTable';
import { StatCard } from '@/components/common/StatCard';
import { FormSelect } from '@/features/orders/components/OrderFormUI';

import { WALLET_COLUMNS, TRANSACTION_TYPES } from '../constants';
import { useWalletTransactions, useWalletExport } from '../hooks/useWalletTransactions';

export default function TransactionsPage() {
  const [transactionType, setTransactionType] = useState('all');
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  // const navigate = useNavigate();

  const { data: transactionsData, isLoading } = useWalletTransactions({
    transaction_type: transactionType === 'all' ? undefined : transactionType,
    search: search || undefined,
    page: currentPage,
    per_page: pageSize,
  });

  const exportMutation = useWalletExport();

  const stats = useMemo(() => [
    {
      label: 'Credits',
      value: '$2,011.64',
      icon: TrendingDown,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
    },
    {
      label: 'Debits',
      value: '$632.61',
      icon: TrendingUp,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50 dark:bg-rose-500/10',
    },
    {
      label: 'Balance',
      value: '$1,379.03',
      icon: Wallet,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 dark:bg-blue-500/10',
    },
  ], []);

  const handleTransactionTypeChange = (val: string) => {
    setTransactionType(val);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleExport = useCallback((format: 'pdf' | 'excel' | 'print' | 'csv') => {
    exportMutation.mutate({
      format: format as any,
      search: search || undefined,
      transaction_type: transactionType === 'all' ? undefined : transactionType,
    });
  }, [exportMutation, search, transactionType]);

  return (
    <div className="flex flex-col flex-1 gap-6 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30">

      {/* Summary Section */}
      <div className="space-y-3">
        {/* <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">Wallet Summary</h2>
          <Button
            onClick={() => navigate('/wallet/top-up')}
            className="h-8 gap-1 bg-[#0060FE] hover:bg-[#0052db]"
          >
            <Plus className="h-4 w-4" />
            Top Up Wallet
          </Button>
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} className="shadow-sm border-gray-100 dark:border-zinc-800" contentClassName="py-4" />
          ))}
        </div>
      </div>


      {/* Filter Section */}
      <div className="space-y-3">
        <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full md:w-72">
            <FormSelect
              options={TRANSACTION_TYPES}
              value={transactionType}
              onValueChange={(val) => handleTransactionTypeChange(val as any)}
              placeholder="Select Transaction Type"
              className="h-8"
            // label="Transaction Type"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className='rounded-xl shadow-md flex-1 flex flex-col min-h-0 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden'>
        <DataTable
          columns={WALLET_COLUMNS as any}
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
