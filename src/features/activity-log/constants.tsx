import type { Column } from '@/components/common/types/DataTable.types';
import { Badge } from '@/components/ui/badge';
import type { ActivityLog } from './types';
import { cn } from '@/lib/utils';

export const ACTIVITY_COLUMNS: Column<ActivityLog>[] = [
    {
        accessor: 'date',
        key: 'date',
        header: 'DATE & TIME',
        cell: (_, row) => (
            <div className="flex flex-col">
                <span className="font-semibold text-slate-700 dark:text-zinc-300">
                    {row.date}
                </span>
            </div>
        ),
    },
    {
        accessor: 'admin',
        key: 'admin',
        header: 'ADMIN',
        cell: (_, row) => (
            <div className="flex flex-col gap-1">
                <span className="font-bold text-slate-700 dark:text-zinc-300">{row.admin}</span>
                <span className="text-[10px] text-slate-500">{row.email}</span>
            </div>
        ),
    },
    {
        accessor: 'action',
        key: 'action',
        header: 'ACTION',
        cell: (_, row) => {
            const action = row.action;
            const variants: Record<string, string> = {
                created: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
                updated: 'bg-primary/10 text-primary border-primary/20',
                deleted: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
                status_changed: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
                verified: 'bg-cyan-50 text-cyan-600 border-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20',
                settings_updated: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
            };
            return (
                <Badge variant="outline" className={cn("capitalize font-bold px-2 py-0.5", variants[action] || '')}>
                    {action.replace('_', ' ')}
                </Badge>
            );
        },
    },
    {
        accessor: 'description',
        key: 'description',
        header: 'DESCRIPTION',
        cell: (_, row) => (
            <div className="flex flex-col gap-1 max-w-[300px]">
                <span className="text-slate-600 dark:text-zinc-400 leading-relaxed">{row.description}</span>
                {row.changes && (
                    <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="text-slate-400 line-through">{row.changes.old_status}</span>
                        <span className="text-slate-400">→</span>
                        <span className="text-emerald-600 font-bold">{row.changes.new_status}</span>
                    </div>
                )}
            </div>
        ),
    },
    {
        accessor: 'model_type',
        key: 'model_type',
        header: 'MODEL',
        cell: (_, row) => (
            <div className="flex flex-col">
                <span className="text-slate-600 dark:text-zinc-400 font-bold">{row.model_type}</span>
                <span className="text-[10px] text-slate-400">ID: #{row.model_id}</span>
            </div>
        ),
    },
    {
        accessor: 'details',
        key: 'details',
        header: 'DETAILS',
        cell: (_, row) => (
            <div className="flex flex-col gap-0.5 text-[11px]">
                <div className="flex gap-1.5">
                    <span className="font-bold text-slate-700 dark:text-zinc-300">Route:</span>
                    <span className="text-slate-500 truncate max-w-[150px]">{row.route || 'N/A'}</span>
                </div>
                <div className="flex gap-1.5">
                    <span className="font-bold text-slate-700 dark:text-zinc-300">IP:</span>
                    <span className="text-slate-500">{row.ip_address}</span>
                </div>
            </div>
        ),
    },
];

