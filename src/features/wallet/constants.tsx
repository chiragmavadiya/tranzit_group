import { Download } from 'lucide-react';
import type { Column } from '@/components/common/types/DataTable.types';
import { StatusCell } from '@/components/common/DataTableCells';
import type { WalletTransaction } from './types';
import { Button } from '@/components/ui/button';

export const TRANSACTION_STATUS_CONFIG = {
  credit: { className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', label: 'Credit' },
  debit: { className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', label: 'Debit' },
};

export const WALLET_COLUMNS: Column<WalletTransaction>[] = [
  {
    key: 'type',
    header: 'TRANSACTION TYPE',
    sortable: true,
    cell: (value: any) => <StatusCell value={value?.toLowerCase()} statusConfig={TRANSACTION_STATUS_CONFIG} />
  },
  { key: 'amount', header: 'AMOUNT', sortable: true },
  { key: 'reason', header: 'REASON', sortable: true },
  { key: 'transaction_id', header: 'TRANSACTION ID', sortable: true },
  { key: 'date', header: 'TRANSACTION DATE & TIME', sortable: true },
  {
    key: 'receipt',
    header: 'PAYMENT RECEIPT',
    className: 'text-center',
    cell: () => (
      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50">
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

export const MOCK_TRANSACTIONS: WalletTransaction[] = [
  { id: '1', type: 'Credit', amount: '$8.64', reason: 'Wallet Topup', transaction_id: 'pi_3Sk1r7BUIF6mLDI12f2a4f20', date: '30 Dec 2025, 5:46 PM' },
  { id: '2', type: 'Credit', amount: '$1000.00', reason: 'Wallet Topup', transaction_id: 'pi_3Ski36BUIF6mLDI10CAAloPo', date: '01 Jan 2026, 2:50 PM' },
  { id: '3', type: 'Credit', amount: '$65.00', reason: 'Tet enter', transaction_id: '-', date: '19 Jan 2026, 10:15 AM' },
  { id: '4', type: 'Credit', amount: '$78.00', reason: 'Wallet Topup', transaction_id: 'pi_3SrDXFBUIf6mLDll0v9l4BbL', date: '19 Jan 2026, 1:40 PM' },
  { id: '5', type: 'Credit', amount: '$10.00', reason: 'Wallet Topup', transaction_id: 'pi_3SrXulBUIF6mLDI10TWD8FxD', date: '20 Jan 2026, 11:25 AM' },
  { id: '6', type: 'Credit', amount: '$500.00', reason: 'Wallet Topup', transaction_id: 'pi_3SrZS0BUIF6mLDI11nFcl2jr', date: '20 Jan 2026, 1:04 PM' },
  { id: '7', type: 'Credit', amount: '$150.00', reason: 'Wallet Topup', transaction_id: 'pi_3SrtbhBUIF6mLDI113JgAmkf', date: '21 Jan 2026, 10:35 AM' },
];

export const ADMIN_MOCK_TRANSACTIONS = [
  { id: '1', customer_name: 'Ashish Tukadiya', type: 'Credit', amount: '$95.26', reason: 'Wallet Topup', transaction_id: 'pi_3SuvdNBUIf6mLDll15s9iRuU', date: '29 Jan 2026, 7:21 PM' },
  { id: '2', customer_name: 'Ashish Tukadiya', type: 'Debit', amount: '$95.26', reason: 'Consignment 01KG50BQFH4TJKTFEZB4ASCGY8', transaction_id: '-', date: '29 Jan 2026, 7:21 PM' },
  { id: '3', customer_name: 'Chirag 10 Gondaliya 10', type: 'Credit', amount: '$14.83', reason: 'Wallet Topup', transaction_id: 'pi_3Sk29gBUIF6mLDIll0rf0RYnQ', date: '30 Dec 2025, 6:06 PM' },
  { id: '4', customer_name: 'Chirag 10 Gondaliya 10', type: 'Debit', amount: '$14.83', reason: 'Consignment 01KDQM3F6PDC0KPWTCH3E5B456', transaction_id: '-', date: '30 Dec 2025, 6:06 PM' },
  { id: '5', customer_name: 'Chirag 10 Gondaliya 10', type: 'Credit', amount: '$100.00', reason: 'Wallet Topup', transaction_id: 'pi_3Sk2AlBUIF6mLDI107h9dNEN', date: '30 Dec 2025, 6:07 PM' },

];

export const TRANSACTION_TYPES = [
  { value: 'all', label: 'All Transactions' },
  { value: 'credit', label: 'Credit' },
  { value: 'debit', label: 'Debit' },
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
