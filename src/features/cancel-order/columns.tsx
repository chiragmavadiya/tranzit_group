import type { Column } from '@/components/common/types/DataTable.types';
import type { CancelOrder } from './types';
import { NavLink } from 'react-router-dom';
import { formateCurrency } from '@/lib/utils';

export const getCancelOrderColumns = (role: string): Column<CancelOrder>[] => [
    {
        key: 'customer_name',
        header: 'CUSTOMER NAME',
        cell: (val: string, row) => (
            <div className="flex flex-col">
                <span className="font-medium text-slate-900 dark:text-zinc-100">{val}</span>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400">{row.customer_email}</span>
            </div>
        )
    },
    {
        key: 'order_number',
        header: 'ORDER NUMBER',
        cell: (val: string) => (
            <NavLink to={`${role === "admin" ? "/admin/orders/cancel" : "/orders/cancel"}/${val}`} className="font-bold text-primary underline">
                {val}
            </NavLink>
        )
    },
    {
        key: 'courier',
        header: 'COURIER',
        cell: (val: string, row) => (
            <div className='flex items-center gap-2'>
                <img src={row?.courier_logo_url} className="h-6" alt="" />
                <div className="flex flex-col">
                    <span className="font-medium">{val}</span>
                    <span className="text-[11px] text-slate-500 dark:text-zinc-400">{row.label_no}</span>
                </div>
            </div>
        )
    },
    {
        key: 'refund_amount',
        header: 'AMOUNT',
        cell: (val: number) => (
            <span className="font-bold text-slate-900 dark:text-zinc-100">
                {formateCurrency(val)}
            </span>
        )
    },
    {
        key: 'request_submitted_at',
        header: 'REQUESTED',
        cell: (val: string) => (
            <div className="flex flex-col">
                <span className="text-slate-700 dark:text-zinc-300">{val}</span>
                {/* <span className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase font-bold tracking-wide">By: {row.submitted_by}</span> */}
            </div>
        )
    },
    {
        key: 'processed_at',
        header: 'PROCESSED',
        cell: (val: string | null, row) => (
            <div className="flex flex-col">
                <span className="text-slate-700 dark:text-zinc-300">{val || '—'}</span>
                {row.processed_by && (
                    <span className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase font-bold tracking-wide">By: {row.processed_by}</span>
                )}
            </div>
        )
    },
    {
        key: 'status',
        header: 'STATUS',
        cell: (val: string) => {
            const isPending = val.toLowerCase() === 'pending';
            return (
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${isPending
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    }`}>
                    {val}
                </span>
            );
        }
    },
];
