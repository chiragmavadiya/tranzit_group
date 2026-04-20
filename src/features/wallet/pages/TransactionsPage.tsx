import { useState, useMemo } from 'react';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { DataTable, StatCard } from '@/components/common';
import SelectComponent from '@/components/ui/select';
import { MOCK_TRANSACTIONS, WALLET_COLUMNS, TRANSACTION_TYPES } from '../constants';

export default function TransactionsPage() {
  const [transactionType, setTransactionType] = useState('all');
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(7);

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

  const filteredData = useMemo(() => {
    let data = MOCK_TRANSACTIONS;

    if (transactionType !== 'all') {
      data = data.filter(t => t.type.toLowerCase() === transactionType);
    }

    if (search) {
      data = data.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    return data;
  }, [transactionType, search]);

  return (
    <div className="flex flex-col flex-1 gap-6 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30">

      {/* Summary Section */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} className="shadow-sm border-gray-100 dark:border-zinc-800" contentClassName="py-4" />
          ))}
        </div>
      </div>

      {/* Filter Section */}
      <div className="space-y-3">
        <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div className="w-full md:w-72">
            <SelectComponent
              data={TRANSACTION_TYPES}
              value={transactionType}
              onValueChange={(val) => setTransactionType(val || 'all')}
              placeholder="Select Transaction Type"
              className="h-10 border-gray-200 dark:border-zinc-800"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className='rounded-xl shadow-md flex-1 flex flex-col min-h-0 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden'>
        <DataTable
          columns={WALLET_COLUMNS as any}
          data={filteredData}
          headerTitle="Transactions List"
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
