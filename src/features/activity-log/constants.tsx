import type { Column } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import type { ActivityLog } from './types';
import { format } from 'date-fns';

export const ACTIVITY_COLUMNS: Column<ActivityLog>[] = [
    {
        key: 'index',
        accessor: 'index',
        header: '#',
        cell: (_, row) => <span className="text-slate-500 font-medium">{row.index}</span>,
    },
    {
        accessor: 'dateTime',
        key: 'dateTime',
        header: 'DATE & TIME',
        cell: (_, row) => {
            const date = new Date(row.dateTime);
            return (
                <div className="flex flex-col">
                    <span className="font-semibold text-slate-700 dark:text-zinc-300">
                        {format(date, 'dd MMM yyyy, hh:mm a')}
                    </span>
                </div>
            );
        },
    },
    {
        accessor: 'adminName',
        key: 'adminName',
        header: 'ADMIN',
        cell: (_, row) => (
            <div className="flex flex-col gap-1">
                <span className="font-bold text-slate-700 dark:text-zinc-300">{row.adminName}</span>
                <Badge variant="secondary" className="w-fit h-5 text-[10px] bg-slate-100 text-slate-600 border-slate-200">
                    {row.adminRole}
                </Badge>
            </div>
        ),
    },
    {
        accessor: 'email',
        key: 'email',
        header: 'EMAIL',
        cell: (_, row) => <span className="text-slate-600 dark:text-zinc-400 font-medium">{row.email}</span>,
    },
    {
        accessor: 'action',
        key: 'action',
        header: 'ACTION',
        cell: (_, row) => {
            const action = row.action;
            const variants: Record<string, string> = {
                Created: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
                Updated: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
                Deleted: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
                'Logged In': 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
            };
            return (
                <Badge variant="outline" className={variants[action] || ''}>
                    {action === 'Created' ? '+ ' : action === 'Updated' ? '✎ ' : ''}
                    {action}
                </Badge>
            );
        },
    },
    {
        accessor: 'model',
        key: 'model',
        header: 'MODEL',
        cell: (_, row) => <span className="text-slate-600 dark:text-zinc-400 font-bold">{row.model}</span>,
    },
    {
        accessor: 'description',
        key: 'description',
        header: 'DESCRIPTION',
        cell: (_, row) => <span className="text-slate-600 dark:text-zinc-400">{row.description}</span>,
    },
    {
        accessor: 'details',
        key: 'details',
        header: 'DETAILS',
        cell: (_, row) => (
            <div className="flex flex-col gap-0.5 text-[11px]">
                {row.details.modelId && (
                    <div className="flex gap-1.5">
                        <span className="font-bold text-slate-700 dark:text-zinc-300">Model:</span>
                        <span className="text-slate-500">{row.model} #{row.details.modelId}</span>
                    </div>
                )}
                <div className="flex gap-1.5">
                    <span className="font-bold text-slate-700 dark:text-zinc-300">Route:</span>
                    <span className="text-slate-500">{row.details.route}</span>
                </div>
                <div className="flex gap-1.5">
                    <span className="font-bold text-slate-700 dark:text-zinc-300">IP:</span>
                    <span className="text-slate-500">{row.details.ip}</span>
                </div>
            </div>
        ),
    },
];

export const MOCK_ACTIVITIES: ActivityLog[] = [
    {
        id: '1',
        index: 1,
        dateTime: '2026-04-23T23:13:00',
        adminName: 'Super Admin',
        adminRole: 'Admin',
        email: 'admin@gmail.com',
        action: 'Created',
        model: 'User',
        description: 'Created sub-user: q q',
        details: { modelId: '27', route: 'admin.sub-user.store', ip: '171.61.167.80' },
    },
    {
        id: '2',
        index: 2,
        dateTime: '2026-04-22T11:27:00',
        adminName: 'Super Admin',
        adminRole: 'Admin',
        email: 'admin@gmail.com',
        action: 'Updated',
        model: 'User',
        description: 'Updated customer: MyPost Business Testing User',
        details: { modelId: '3', route: 'customer.update', ip: '203.76.224.97' },
    },
    {
        id: '3',
        index: 3,
        dateTime: '2026-04-21T15:49:00',
        adminName: 'Super Admin',
        adminRole: 'Admin',
        email: 'admin@gmail.com',
        action: 'Updated',
        model: 'User',
        description: 'Updated customer: Customer1 User',
        details: { modelId: '2', route: 'customer.update', ip: '106.215.154.139' },
    },
    {
        id: '4',
        index: 4,
        dateTime: '2026-04-16T09:52:00',
        adminName: 'Super Admin',
        adminRole: 'Admin',
        email: 'admin@gmail.com',
        action: 'Created',
        model: 'Order',
        description: 'Created Manual Order #SHP000114 for customer Custo...',
        details: { modelId: '114', route: 'order.manual-store', ip: '171.61.167.89' },
    },
    {
        id: '5',
        index: 5,
        dateTime: '2026-04-16T17:04:00',
        adminName: 'Super Admin',
        adminRole: 'Admin',
        email: 'admin@gmail.com',
        action: 'Created',
        model: 'Order',
        description: 'Created Manual Order #CG000111 for customer Chirag...',
        details: { modelId: '111', route: 'order.manual-store', ip: '106.215.154.62' },
    },
];
