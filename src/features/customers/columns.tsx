import { Eye, Pencil, Loader2, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import type { Customer } from './types';
import type { Column } from '@/components/common/types/DataTable.types';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { useToggleCustomerStatus } from './hooks/useCustomers';
import { toast } from 'sonner';

// eslint-disable-next-line react-refresh/only-export-components
const StatusSwitch = ({ customer }: { customer: Customer }) => {
    const { mutate: toggleStatus, isPending } = useToggleCustomerStatus();

    const handleToggle = () => {
        toggleStatus(customer.id, {
            onSuccess: (res) => {
                toast.success(res.message || `Customer status updated to ${customer.status === 'active' ? 'inactive' : 'active'}`);
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.message || 'Failed to update status');
            }
        });
    };

    return (
        <div className="flex items-center gap-2">
            <Switch
                checked={customer.status === 'active'}
                disabled={isPending}
                onCheckedChange={handleToggle}
                className="data-[state=checked]:bg-slate-950"
            />
            {isPending && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
        </div>
    );
};

export const getCustomerColumns = (onEdit: (id: string | number) => void, handleDelete: (id: string | number) => void): Column<Customer>[] => [
    {
        key: 'name',
        header: 'NAME',
        sticky: "left",
        cell: (_, customer) => {
            const fullName = `${customer.first_name} ${customer.last_name}`;
            return (
                <NavLink to={`/admin/customers/${customer.id}`}>
                    <div className="flex items-center gap-3">
                        <div className='w-[35px] h-[35px]'>
                            <img className='w-[35px] h-[35px] object-cover rounded-full' src={`https://ui-avatars.com/api/?format=svg&name=${fullName}&background=random&rounded=true`} alt={fullName} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-900">{fullName}</span>
                            <span className="text-xs text-muted-foreground">{customer.email}</span>
                        </div>
                    </div>
                </NavLink>
            );
        },
    },
    {
        key: 'mobile',
        header: 'MOBILE',
        cell: (_, customer) => <span className="text-sm text-slate-600">{customer.personal_mobile || customer.office_number || '-'}</span>,
    },
    {
        key: 'business_name',
        header: 'BUSINESS NAME',
        cell: (_, customer) => <span className="text-sm text-slate-600">{customer.business_name}</span>,
    },
    {
        key: 'customer_id',
        header: 'CUSTOMER ID',
        cell: (_, customer) => <span className="text-sm font-mono text-slate-600">{customer.id}</span>,
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
        cell: (_, customer) => <StatusSwitch customer={customer} />,
    },
    {
        key: 'created_at',
        header: 'CREATED AT',
        cell: (_, customer) => <span className="text-sm text-slate-600">{customer.created_at}</span>,
    },
    {
        key: 'actions',
        header: 'ACTIONS',
        sticky: "right",
        cell: (_, customer) => (
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 hover:text-blue-500 bg-transparent hover:bg-transparent dark:hover:bg-transparent"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onEdit(customer.id);
                    }}
                >
                    <Pencil className="w-4 h-4" />
                </Button>
                <NavLink to={`/admin/customers/${customer.id}`}>
                    <Button variant="ghost" size="sm" className="p-0 hover:text-blue-500 bg-transparent hover:bg-transparent dark:hover:bg-transparent">
                        <Eye className="w-4 h-4" />
                    </Button>
                </NavLink>
                {/* delete button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 hover:text-red-500 bg-transparent hover:bg-transparent dark:hover:bg-transparent"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(customer.id);
                    }}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        ),
    },
];


