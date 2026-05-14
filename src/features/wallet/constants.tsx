import { Download } from 'lucide-react';
import type { Column } from '@/components/common/types/DataTable.types';
import { StatusCell } from '@/components/common/DataTableCells';
import type { WalletTransaction } from './types';
import { Button } from '@/components/ui/button';

export const TRANSACTION_STATUS_CONFIG = {
  credit: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  debit: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
};

export const WALLET_COLUMNS: Column<WalletTransaction>[] = [
  {
    key: 'transaction_type',
    header: 'TRANSACTION TYPE',
    sortable: true,
    cell: (value: any) => <StatusCell value={value?.toLowerCase()} statusConfig={TRANSACTION_STATUS_CONFIG} />
  },
  {
    key: 'amount',
    header: 'AMOUNT',
    sortable: true,
    cell: (value: any) => {
      const amount = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]+/g, ""));
      return <span className="font-semibold text-slate-900 dark:text-zinc-100">${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
    }
  },
  { key: 'reason', header: 'REASON', sortable: true },
  { key: 'transaction_id', header: 'TRANSACTION ID', sortable: true },
  { key: 'transaction_date_time', header: 'TRANSACTION DATE & TIME', sortable: true },
  {
    key: 'receipt',
    header: 'PAYMENT RECEIPT',
    className: 'text-center',
    cell: () => (
      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary/70 hover:text-primary hover:bg-primary/10">
        <Download className="h-4 w-4" />
      </Button>
    )
  },
];

export const ADMIN_TOPUP_COLUMNS: Column<any>[] = [
  {
    key: 'customer_name',
    header: 'NAME',
    sortable: true,
    searchable: true,
    cell: (val) => <span className="font-medium text-slate-900 dark:text-zinc-100">{val}</span>
  },
  {
    key: 'type',
    header: 'TRANSACTION TYPE',
    sortable: true,
    cell: (value: any) => <StatusCell value={value?.toLowerCase()} statusConfig={TRANSACTION_STATUS_CONFIG} />
  },
  { key: 'amount', header: 'AMOUNT', sortable: true },
  { key: 'reason', header: 'REASON', sortable: true },
  { key: 'transaction_id', header: 'TRANSACTION ID', sortable: true, noPrint: true },
  { key: 'date', header: 'TRANSACTION DATE & TIME', sortable: true, noPrint: true },
];

export const TRANSACTION_TYPES = [
  { value: 'all', label: 'All Transactions' },
  { value: '1', label: 'Credit' },
  { value: '2', label: 'Debit' },
  { value: '3', label: 'Refund' },
];

export const TOP_UP_COLUMNS: Column<any>[] = [
  { key: 'transaction_id', header: 'TRANSACTION ID', sortable: true },
  { key: 'amount', header: 'AMOUNT', sortable: true },
  { key: 'date', header: 'PAYMENT DATE', sortable: true },
  {
    key: 'status',
    header: 'PAYMENT STATUS',
    sortable: true,
    cell: (value: any) => (
      <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${value === 'Success' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
        'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
        }`}>
        {value}
      </div>
    )
  },
];

export const MOCK_TOP_UP_RECORDS = [
  { id: '1', transaction_id: 'TRX-123456', amount: '$100.00', date: '21 Jan 2026, 10:35 AM', status: 'Success' },
  { id: '2', transaction_id: 'TRX-789012', amount: '$50.00', date: '20 Jan 2026, 11:25 AM', status: 'Success' },
  { id: '3', transaction_id: 'TRX-345678', amount: '$200.00', date: '19 Jan 2026, 1:40 PM', status: 'Pending' },
];
