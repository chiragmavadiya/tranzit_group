import { Download } from 'lucide-react';
import type { Column } from '@/components/common';
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
    cell: (value: any) => <StatusCell value={value} statusConfig={TRANSACTION_STATUS_CONFIG} />
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

export const MOCK_TRANSACTIONS: WalletTransaction[] = [
  { id: '1', type: 'Credit', amount: '$8.64', reason: 'Wallet Topup', transaction_id: 'pi_3Sk1r7BUIF6mLDI12f2a4f20', date: '30 Dec 2025, 5:46 PM' },
  { id: '2', type: 'Credit', amount: '$1000.00', reason: 'Wallet Topup', transaction_id: 'pi_3Ski36BUIF6mLDI10CAAloPo', date: '01 Jan 2026, 2:50 PM' },
  { id: '3', type: 'Credit', amount: '$65.00', reason: 'Tet enter', transaction_id: '-', date: '19 Jan 2026, 10:15 AM' },
  { id: '4', type: 'Credit', amount: '$78.00', reason: 'Wallet Topup', transaction_id: 'pi_3SrDXFBUIf6mLDll0v9l4BbL', date: '19 Jan 2026, 1:40 PM' },
  { id: '5', type: 'Credit', amount: '$10.00', reason: 'Wallet Topup', transaction_id: 'pi_3SrXulBUIF6mLDI10TWD8FxD', date: '20 Jan 2026, 11:25 AM' },
  { id: '6', type: 'Credit', amount: '$500.00', reason: 'Wallet Topup', transaction_id: 'pi_3SrZS0BUIF6mLDI11nFcl2jr', date: '20 Jan 2026, 1:04 PM' },
  { id: '7', type: 'Credit', amount: '$150.00', reason: 'Wallet Topup', transaction_id: 'pi_3SrtbhBUIF6mLDI113JgAmkf', date: '21 Jan 2026, 10:35 AM' },
];

export const TRANSACTION_TYPES = [
  { value: 'all', label: 'All Transactions' },
  { value: 'credit', label: 'Credit' },
  { value: 'debit', label: 'Debit' },
];
