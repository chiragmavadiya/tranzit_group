import { Loader2, MoreVertical } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import type { Customer } from './types';
import type { Column } from '@/components/common/types/DataTable.types';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { useToggleCustomerStatus } from './hooks/useCustomers';
import { showToast } from '@/components/ui/custom-toast';
import { DropdownCustomMenu } from "@/components/ui/dropdown-menu";

// eslint-disable-next-line react-refresh/only-export-components
const StatusSwitch = ({ customer }: { customer: Customer }) => {
    const { mutate: toggleStatus, isPending } = useToggleCustomerStatus();

    const handleToggle = () => {
        toggleStatus(customer.id, {
            onSuccess: (res) => {
                showToast(res.message || `Customer status updated to ${customer.status === 'active' ? 'inactive' : 'active'}`, "success")
            },
            onError: (err: any) => {
                showToast(err?.response?.data?.message || 'Failed to update status', "error");
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

export const getCustomerColumns = (
    onEdit: (id: string | number) => void,
    handleDelete: (id: string | number) => void,
    navigate: any
): Column<Customer>[] => [
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
                                <img className='w-[32px] h-[32px] object-cover rounded-full' src={`https://ui-avatars.com/api/?format=svg&name=${fullName}&background=random&rounded=true&font-size=0.33&bold=true`} alt={fullName} />
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
            cell: (_, customer) => <span className="text-xs text-slate-600">{customer.personal_mobile || customer.office_number || '-'}</span>,
        },
        {
            key: 'business_name',
            header: 'BUSINESS NAME',
            // cell: (_, customer) => <span className="text-sm text-slate-600">{customer.business_name}</span>,
        },
        {
            key: 'customer_id',
            header: 'CUSTOMER ID',
            // cell: (_, customer) => <span className="text-sm font-mono text-slate-600">{customer.id}</span>,
        },
        {
            key: 'suburb',
            header: 'SUBURB',
            // cell: (_, customer) => <span className="text-sm text-slate-600">{customer.suburb}</span>,
        },
        {
            key: 'state',
            header: 'STATE',
            // cell: (_, customer) => <span className="text-sm text-slate-600">{customer.state}</span>,
        },
        {
            key: 'status',
            header: 'STATUS',
            cell: (_, customer) => <StatusSwitch customer={customer} />,
        },
        {
            key: 'created_at',
            header: 'CREATED AT',
            // cell: (_, customer) => <span className="text-sm text-slate-600">{customer.created_at}</span>,
        },
        {
            key: 'actions',
            header: 'ACTIONS',
            sticky: "right",
            cell: (_, customer) => {
                const menus = [
                    {
                        label: "View customer",
                        onClick: () => navigate(`/admin/customers/${customer.id}`),
                    },
                    {
                        label: "Edit customer",
                        onClick: () => onEdit(customer.id),
                    },
                    {
                        label: "Delete customer",
                        onClick: () => handleDelete(customer.id),
                        variant: "destructive" as const,
                        className: "text-red-600 dark:text-red-400 font-medium"
                    }
                ];

                return (
                    <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <DropdownCustomMenu
                            menus={menus}
                            contentClassName="w-40"
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-zinc-800"
                            >
                                <MoreVertical className="h-4! w-4!" />
                            </Button>
                        </DropdownCustomMenu>
                    </div>
                );
            },
        },
    ];


