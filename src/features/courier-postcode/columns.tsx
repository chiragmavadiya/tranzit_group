import type { Column } from '@/components/common';
import type { CourierPostcode } from './types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

export const POSTCODE_COLUMNS = (onEdit: (row: any) => void, onDelete: (row: any) => void): Column<CourierPostcode>[] => [
  {
    key: 'courierName',
    header: 'COURIER NAME',
    sortable: true,
    cell: (val) => <span className="font-bold text-slate-900 dark:text-zinc-100 text-[13px]">{val}</span>
  },
  {
    key: 'postCode',
    header: 'POST CODE',
    sortable: true,
    cell: (val) => <span className="text-slate-500 font-medium text-[12px]">{val}</span>
  },
  {
    key: 'price',
    header: 'PRICE',
    sortable: true,
    cell: (val) => <span className="font-bold text-slate-900 dark:text-zinc-100 text-[13px] tracking-tight">${Number(val).toFixed(2)}</span>
  },
  {
    key: 'actions',
    header: 'ACTIONS',
    className: 'text-right',
    sticky: 'right',
    noPrint: true,
    cell: (_, row) => (
      <div className="flex items-center justify-end gap-2 pr-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all active:scale-90"
          onClick={() => onEdit(row)}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-90"
          onClick={() => onDelete(row)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    )
  }
];
