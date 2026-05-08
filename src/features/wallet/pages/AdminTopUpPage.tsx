import { useState, useMemo, useEffect } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { StatCard, DataTable } from '@/components/common';
import { ADMIN_TOPUP_COLUMNS, TRANSACTION_TYPES } from '../constants';
import { FormSelect } from '@/features/orders/components/OrderFormUI';
import { Button } from '@/components/ui/button';
import { useAdminTopups } from '../hooks/useWallet';
import { useDebounce } from '@/hooks/useDebounce';

export default function AdminTopUpPage() {
  const [search, setSearch] = useState('');
  const [transactionType, setTransactionType] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState('all');
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const { data: topupResponse, isLoading } = useAdminTopups({
    customer: selectedCustomer === 'all' ? undefined : selectedCustomer,
    status: transactionType === 'all' ? undefined : transactionType,
    search: debouncedSearch,
    page,
    per_page: pageSize
  });

  const transactions = topupResponse?.data || [];
  const totalItems = topupResponse?.meta?.total || 0;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, transactionType, selectedCustomer]);

  const stats = useMemo(() => [
    {
      label: 'Credits',
      value: '$4,569.86',
      icon: ArrowDownLeft,
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
      trend: { value: '+12.5%', isUp: true }
    },
    {
      label: 'Debits',
      value: '$2,468.16',
      icon: ArrowUpRight,
      iconColor: 'text-rose-500',
      iconBg: 'bg-rose-50 dark:bg-rose-500/10',
      trend: { value: '+5.2%', isUp: false }
    },
    {
      label: 'Balance',
      value: '$2,101.70',
      icon: Wallet,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50 dark:bg-blue-500/10',
    },
  ], []);

  return (
    <div className="flex flex-col flex-1 gap-4 p-page-padding min-h-0 overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} className="shadow-sm py-1 border-gray-100 dark:border-zinc-800" />
        ))}
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-4">
            <FormSelect
              label="Transaction Type"
              value={transactionType}
              onValueChange={(val) => setTransactionType(val || 'all')}
              options={TRANSACTION_TYPES}
              placeholder="Select Transaction Type"
              className="w-full space-y-0"
            />
          </div>
          <div className="lg:col-span-4">
            <FormSelect
              label="Select Customer"
              value={selectedCustomer}
              onValueChange={(val) => setSelectedCustomer(val || 'all')}
              options={[
                { label: 'All Customers', value: 'all' },
                { label: 'Ashish Tukadiya', value: '87' },
                { label: 'Chirag 10 Gondaliya 10', value: '88' },
              ]}
              placeholder="Select Customer"
              className="w-full space-y-0"
            />
          </div>
          <div className="lg:col-span-4 flex gap-3">
            <Button
              variant="outline"
              className="h-8 max-w-42 flex-1 border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-[10px]"
              onClick={() => {
                setSearch('');
                setTransactionType('all');
                setSelectedCustomer('all');
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex-1 flex flex-col min-h-[400px]">
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
          className="text-xs pb-3"
          rowKey="id"
        />
      </div>
    </div>
  );
}
