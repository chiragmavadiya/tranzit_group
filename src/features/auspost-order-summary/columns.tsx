import type { Column } from '@/components/common';
import type { AuspostOrder } from './types';

export const AUSPOST_COLUMNS: Column<AuspostOrder>[] = [
  {
    key: 'orderNumber',
    header: 'ORDER NUMBER',
    sortable: true,
    cell: (val) => <span className="font-bold text-slate-900 dark:text-zinc-100 text-[12px] tracking-tight">{val}</span>
  },
  {
    key: 'customerName',
    header: 'CUSTOMER NAME',
    sortable: true,
    cell: (val) => <span className="text-slate-600 font-medium text-[12px]">{val}</span>
  },
  {
    key: 'suburb',
    header: 'SUBURB',
    sortable: true,
    cell: (val) => <span className="text-slate-500 font-medium text-[12px]">{val}</span>
  },
  {
    key: 'postcode',
    header: 'POSTCODE',
    sortable: true,
    cell: (val) => <span className="text-slate-500 font-medium text-[12px]">{val}</span>
  },
  {
    key: 'orderDate',
    header: 'ORDER DATE',
    sortable: true,
    cell: (val) => <span className="text-slate-500 font-medium text-[12px]">{val}</span>
  }
];
