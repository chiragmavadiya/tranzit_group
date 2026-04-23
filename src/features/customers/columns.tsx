import { Eye, Pencil } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { Customer } from './types';
import type { Column } from '@/components/common/types/DataTable.types';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';

export const CUSTOMER_COLUMNS: Column<Customer>[] = [

    {
        key: 'name',
        header: 'NAME',
        sticky: "left",
        cell: (_, customer) => {
            const initials = customer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
            return (
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm",
                        customer.avatar_color || 'bg-gray-400'
                    )}>
                        {initials}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">{customer.name}</span>
                        <span className="text-xs text-muted-foreground">{customer.email}</span>
                    </div>
                </div>
            );
        },
    },
    {
        key: 'mobile',
        header: 'MOBILE',
        cell: (_, customer) => <span className="text-sm text-slate-600">{customer.mobile}</span>,
    },
    {
        key: 'business_name',
        header: 'BUSINESS NAME',
        cell: (_, customer) => <span className="text-sm text-slate-600">{customer.business_name}</span>,
    },
    {
        key: 'customer_id',
        header: 'CUSTOMER ID',
        cell: (_, customer) => <span className="text-sm font-mono text-slate-600">{customer.customer_id}</span>,
    },
    {
        key: 'suburb',
        header: 'SUBURB',
        cell: (_, customer) => <span className="text-sm text-slate-600">{customer.suburb}</span>,
    },
    {
        key: 'state',
        header: 'STATE',
        cell: (_, customer) => <span className="text-sm text-slate-600">{customer.state}</span>,
    },
    {
        key: 'status',
        header: 'STATUS',
        cell: (_, customer) => (
            <div className="flex items-center">
                <Switch
                    checked={customer.status === 'active'}
                    className="data-[state=checked]:bg-slate-950"
                />
            </div>
        ),
    },
    {
        key: 'created_at',
        header: 'CREATED AT',
        cell: (_, customer) => <span className="text-sm text-slate-600">{customer.created_at}</span>,
    },
    {
        key: 'last_login_at',
        header: 'LAST LOGIN AT',
        cell: (_, customer) => <span className="text-sm text-slate-600">{customer.last_login_at || '-'}</span>,
    },
    {
        key: 'actions',
        header: 'ACTIONS',
        sticky: "right",
        cell: (_, customer) => (
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="p-0 hover:text-blue-500 bg-transparent hover:bg-transparent dark:hover:bg-transparent">
                    <Pencil className="w-4 h-4" />
                </Button>
                <NavLink to={`/admin/customers/${customer.id}`}>
                    <Button variant="ghost" size="sm" className="p-0 hover:text-blue-500 bg-transparent hover:bg-transparent dark:hover:bg-transparent">
                        <Eye className="w-4 h-4" />
                    </Button>
                </NavLink>
            </div>
        ),
    },
];
