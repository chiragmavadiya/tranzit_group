import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, UserX, Plus } from 'lucide-react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { SUBURBS, STATES } from '../constants';
import { getCustomerColumns } from '../columns';
import CustomerDialog from '../components/CustomerDialog';
import { useCustomers, useExportCustomers, useDeleteCustomer, useCustomerCounts } from '../hooks/useCustomers';
import { downloadFile } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import { ConformationModal } from '@/components/common/ConformationModal';
import { showToast } from '@/components/ui/custom-toast';
import { FormSelect } from '@/features/orders/components/OrderFormUI';
import ChangePasswordModal from '../components/ChangePasswordModal';
import useLocalStorage from '@/hooks/useLocalStorage';

export default function CustomerPage() {
    const [suburb, setSuburb] = useLocalStorage<string>('customer_suburb', '');
    const [state, setState] = useLocalStorage<string>('customer_state', '');
    const [search, setSearch] = useLocalStorage<string>('customer_search', '');
    const [pageSize, setPageSize] = useLocalStorage<number>('customer_page_size', 25);
    const [currentPage, setCurrentPage] = useLocalStorage<number>('customer_page', 1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editCustomerId, setEditCustomerId] = useState<string | number | undefined>(undefined);

    // Export hook
    const { mutate: exportCustomers, isPending: isExporting } = useExportCustomers();
    const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();

    // Delete state
    const [deleteId, setDeleteId] = useState<string | number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Change password state
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [passwordCustomerId, setPasswordCustomerId] = useState<string | number | null>(null);

    // Prepare API params
    const queryParams = useMemo(() => {
        const params: Record<string, any> = {
            page: currentPage,
            per_page: pageSize,
        };
        if (search) params.search = search;
        if (suburb !== 'all') params.suburb = suburb;
        if (state !== 'all') params.state = state;
        return params;
    }, [currentPage, pageSize, search, suburb, state]);

    const handleExport = (type: "pdf" | "excel" | "print" | "csv") => {
        const format = type === 'excel' ? 'xlsx' : type;
        if (format === 'print') {
            window.print();
            return;
        }

        exportCustomers({ format, params: { search, suburb, state } }, {
            onSuccess: ({ blob, filename }) => {
                downloadFile(blob, filename);
            },
            onError: () => {
                showToast('Failed to export customers', 'error');
            }
        });
    };

    const { data: customerData, isLoading } = useCustomers({ ...queryParams, search: useDebounce(search, 500) });
    const { data: countsData } = useCustomerCounts();

    const customers = useMemo(() => customerData?.data || [], [customerData?.data]);
    const meta = customerData?.meta;
    const totalItems = meta?.total || 0;

    const stats = useMemo(() => [
        {
            label: 'Total Customer',
            value: (countsData?.data?.total ?? totalItems).toString(),
            icon: Users,
            iconColor: 'text-slate-600',
            iconBg: 'bg-slate-50 dark:bg-slate-500/10',
        },
        {
            label: 'Active Customer',
            value: (countsData?.data?.active ?? customers.filter(c => c.status === 'active').length).toString(),
            icon: UserCheck,
            iconColor: 'text-emerald-600',
            iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
        },
        {
            label: 'Inactive Customer',
            value: (countsData?.data?.inactive ?? customers.filter(c => c.status !== 'active').length).toString(),
            icon: UserX,
            iconColor: 'text-rose-600',
            iconBg: 'bg-rose-50 dark:bg-rose-500/10',
        },
    ], [totalItems, customers, countsData]);

    const suburbOptions = useMemo(() => [
        ...SUBURBS.map(s => ({ label: s, value: s }))
    ], []);

    const stateOptions = useMemo(() => [
        ...STATES.map(s => ({ label: s, value: s }))
    ], []);

    const handleEdit = (id: string | number) => {
        setEditCustomerId(id);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string | number) => {
        setDeleteId(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!deleteId) return;
        deleteCustomer(deleteId, {
            onSuccess: (data: any) => {
                showToast(data?.message || 'Customer deleted successfully', "success");
                setIsDeleteDialogOpen(false);
                setDeleteId(null);
            },
            onError: (err: any) => {
                showToast(err?.response?.data?.message || 'Failed to delete customer', "error");
            }
        });
    };

    const handleChangePassword = (id: string | number) => {
        setPasswordCustomerId(id);
        setIsPasswordDialogOpen(true);
    };

    const handleAdd = () => {
        setEditCustomerId(undefined);
        setIsDialogOpen(true);
    };

    const navigate = useNavigate();
    const columns = useMemo(() => getCustomerColumns(handleEdit, handleDelete, navigate, handleChangePassword), [navigate]);

    return (
        <div className="flex flex-col flex-1 gap-3 p-page-padding animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">

            {/* Compact Stats Ribbon */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={idx}
                            className="bg-white dark:bg-zinc-950 rounded-xl border border-slate-150 dark:border-zinc-800 shadow-2xs px-2 py-1.5 sm:px-4 sm:py-2.5 flex items-center gap-2 sm:gap-3.5 hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200"
                        >
                            <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 ${stat.iconBg}`}>
                                <Icon className={`w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 ${stat.iconColor}`} />
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-[8px] sm:text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide truncate">
                                    {stat.label}
                                </span>
                                <span className="text-xs sm:text-base md:text-lg font-extrabold text-slate-900 dark:text-white leading-tight truncate">
                                    {stat.value}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Table Section */}
            <div className="rounded-xl shadow-md border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex-none h-auto">
                <DataTable
                    columns={columns as any}
                    data={customers}
                    // headerTitle="Customer"
                    searchable
                    searchValue={search}
                    onSearchChange={(val) => { setSearch(val); setCurrentPage(1); }}
                    pageSize={pageSize}
                    onPageSizeChange={(val) => { setPageSize(Number(val)); setCurrentPage(1); }}
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                    loading={isLoading}
                    exportable
                    isExporting={isExporting}
                    onExport={handleExport}
                    className="pb-3 flex-none h-auto"
                    customHeader={(
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 justify-end w-full sm:w-auto">
                            <FormSelect
                                options={suburbOptions}
                                value={suburb}
                                onValueChange={(val) => { setSuburb(val || ''); setCurrentPage(1); }}
                                placeholder="Select Suburb"
                                className="flex-1 sm:flex-none sm:w-[155px] !space-y-0 order-2 sm:order-1"
                                selectClassName="h-8 text-xs font-semibold"
                            />
                            <FormSelect
                                options={stateOptions}
                                value={state}
                                onValueChange={(val) => { setState(val || ''); setCurrentPage(1); }}
                                placeholder="Select State"
                                className="flex-1 sm:flex-none sm:w-[145px] !space-y-0 order-3 sm:order-2"
                                selectClassName="h-8 text-xs font-semibold"
                            />
                            <Button
                                size="sm"
                                variant="default"
                                className="h-8 w-full sm:w-auto shrink-0 order-1 sm:order-3"
                                onClick={handleAdd}
                            >
                                <Plus className="mr-1.5 h-4 w-4" />
                                Add Customer
                            </Button>
                        </div>
                    )}
                    totalItems={totalItems}
                />
            </div>

            {isDialogOpen && (
                <CustomerDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    customerId={editCustomerId}
                />
            )}

            {isPasswordDialogOpen && (
                <ChangePasswordModal
                    open={isPasswordDialogOpen}
                    onOpenChange={setIsPasswordDialogOpen}
                    customerId={passwordCustomerId}
                />
            )}

            <ConformationModal
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Delete Customer"
                description="Are you sure you want to delete this customer? This action cannot be undone."
                onConfirm={confirmDelete}
                confirmText="Delete"
                confirmVariant="destructive"
                loading={isDeleting}
            />
        </div>
    );
}


