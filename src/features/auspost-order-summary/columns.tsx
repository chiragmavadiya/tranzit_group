import type { Column } from '@/components/common/types/DataTable.types';
import type { AuspostOrder } from './types';
import { LinkCell } from '@/components/common';

export const AUSPOST_COLUMNS: Column<AuspostOrder>[] = [
  {
    key: 'order_number',
    header: 'ORDER NUMBER',
    sortable: true,
    cell: (value) => <LinkCell value={value} className="font-bold text-primary" path={`/admin/orders/view/${value}`} />
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
  },
  {
    key: 'order_date',
    header: 'ORDER DATE',
    sortable: true,
    noPrint: true,
    cell: (val) => <span className="text-slate-500 font-medium text-[12px]">{val}</span>
  }
];
