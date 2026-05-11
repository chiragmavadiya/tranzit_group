import type { Column } from '@/components/common/types/DataTable.types';
import type { UndeliveredParcel } from './types';

export const UNDELIVERED_COLUMNS: Column<UndeliveredParcel>[] = [
  {
    key: 'tracking_number',
    header: 'TRACKING NUMBER',
    sortable: true,
    cell: (val) => <span className="font-bold text-slate-900 dark:text-zinc-100 text-[12px] tracking-tight">{val}</span>
  },
  {
    key: 'customer_name',
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
  }
];
