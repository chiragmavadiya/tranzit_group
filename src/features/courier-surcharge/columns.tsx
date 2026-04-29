import { CustomTooltip, type Column } from '@/components/common';
import type { CourierSurcharge } from './types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SURCHARGE_COLUMNS = (onEdit: (row: any) => void, onDelete: (row: any) => void): Column<CourierSurcharge>[] => [
  {
    key: 'courier_name',
    header: 'COURIER NAME',
    sortable: true,
    cell: (val) => <span className="font-bold text-slate-900 dark:text-zinc-100 text-[13px]">{val}</span>
  },
  {
    key: 'code',
    header: 'CODE',
    sortable: true,
    cell: (val) => <span className="text-slate-500 font-medium text-[12px]">{val}</span>
  },
  {
    key: 'name',
    header: 'NAME',
    sortable: true,
    cell: (val) => <span className="text-slate-700 font-semibold text-[13px]">{val}</span>
  },
  {
    key: 'description',
    header: 'DESCRIPTION',
    className: 'max-w-[250px] truncate',
    cell: (val) => <span className="text-slate-400 dark:text-zinc-500 text-[11px] font-medium leading-relaxed line-clamp-1">{val}</span>
  },
  {
    key: 'amount',
    header: 'AMOUNT',
    sortable: true,
    cell: (val) => <span className="font-bold text-slate-900 dark:text-zinc-100 text-[13px] tracking-tight">${Number(val).toFixed(2)}</span>
  },
  {
    key: 'customer_selectable',
    header: 'CUSTOMER SELECTABLE',
    cell: (val) => (
      <div className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider transition-all",
        val
          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20"
          : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20"
      )}>
        {val ? <CheckCircle2 className="w-3 h-3 stroke-[2.5]" /> : <XCircle className="w-3 h-3 stroke-[2.5]" />}
        <span>{val ? 'YES' : 'NO'}</span>
      </div>
    )
  },
  {
    key: 'auto_apply',
    header: 'AUTO APPLY',
    cell: (val) => (
      <div className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider transition-all",
        val
          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20"
          : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20"
      )}>
        {val ? <CheckCircle2 className="w-3 h-3 stroke-[2.5]" /> : <XCircle className="w-3 h-3 stroke-[2.5]" />}
        <span>{val ? 'YES' : 'NO'}</span>
      </div>
    )
  },
  {
    key: 'actions',
    header: 'ACTIONS',
    className: 'text-right',
    sticky: 'right',
    noPrint: true,
    cell: (_, row) => (
      <div className="flex items-center justify-end gap-2 pr-2">
        <CustomTooltip title="Edit">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all active:scale-90"
            onClick={() => onEdit(row)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </CustomTooltip>
        <CustomTooltip title="Delete">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-90"
            onClick={() => onDelete(row)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </CustomTooltip>

      </div>
    )
  }
];
