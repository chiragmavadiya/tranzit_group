import { useState, useMemo } from 'react';
import { Users, UserCheck, UserX, Plus } from 'lucide-react';
import { DataTable } from '@/components/common/DataTable';
import { StatCard } from '@/components/common/StatCard';
import SelectComponent from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SUBURBS, STATES } from '../constants';
import { getCustomerColumns } from '../columns';
import CustomerDialog from '../components/CustomerDialog';
import { useCustomers, useExportCustomers, useDeleteCustomer } from '../hooks/useCustomers';
import { downloadFile } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import { ConformationModal } from '@/components/common/ConformationModal';
import { showToast } from '@/components/ui/custom-toast';

export default function CustomerPage() {
    const [suburb, setSuburb] = useState('all');
    const [state, setState] = useState('all');
    const [search, setSearch] = useState('');
    const [pageSize, setPageSize] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editCustomerId, setEditCustomerId] = useState<string | number | undefined>(undefined);

    // Export hook
    const { mutate: exportCustomers, isPending: isExporting } = useExportCustomers();
    const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();

    // Delete state
    const [deleteId, setDeleteId] = useState<string | number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

        exportCustomers({ format, params: queryParams }, {
            onSuccess: ({ blob, filename }) => {
                downloadFile(blob, filename);
            },
            onError: () => {
                showToast('Failed to export customers', 'error');
            }
        });
    };

    const { data: customerData, isLoading } = useCustomers({ ...queryParams, search: useDebounce(search, 500) });

    const customers = useMemo(() => customerData?.data || [], [customerData?.data]);
    const meta = customerData?.meta;
    const totalItems = meta?.total || 0;

    const stats = useMemo(() => [
        {
            label: 'Total Customer',
            value: totalItems.toString(),
            icon: Users,
            iconColor: 'text-slate-600',
            iconBg: 'bg-slate-50 dark:bg-slate-500/10',
        },
        {
            label: 'Active Customer',
            value: customers.filter(c => c.status === 'active').length.toString(),
            icon: UserCheck,
            iconColor: 'text-emerald-600',
            iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
        },
        {
            label: 'Inactive Customer',
            value: customers.filter(c => c.status !== 'active').length.toString(),
            icon: UserX,
            iconColor: 'text-rose-600',
            iconBg: 'bg-rose-50 dark:bg-rose-500/10',
        },
    ], [totalItems, customers]);

    const suburbOptions = useMemo(() => [
        { label: 'All Suburbs', value: 'all' },
        ...SUBURBS.map(s => ({ label: s, value: s.toLowerCase() }))
    ], []);

    const stateOptions = useMemo(() => [
        { label: 'All States', value: 'all' },
        ...STATES.map(s => ({ label: s, value: s.toLowerCase() }))
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
            onSuccess: () => {
                showToast('Customer deleted successfully', "success");
                setIsDeleteDialogOpen(false);
                setDeleteId(null);
            },
            onError: (err: any) => {
                showToast(err?.response?.data?.message || 'Failed to delete customer', "error");
            }
        });
    };

    const handleAdd = () => {
        setEditCustomerId(undefined);
        setIsDialogOpen(true);
    };

    const columns = useMemo(() => getCustomerColumns(handleEdit, handleDelete), []);

    return (
        <div className="flex flex-col flex-1 gap-4 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30">

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <StatCard
                        key={idx}
                        {...stat}
                        className="shadow-sm border-gray-100 dark:border-zinc-800"
                        contentClassName="py-4"
                    />
                ))}
            </div>

            {/* Filter Section */}
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectComponent
                        data={suburbOptions}
                        value={suburb}
                        onValueChange={(val) => { setSuburb(val || 'all'); setCurrentPage(1); }}
                        placeholder="Select Suburb"
                        className="h-10 border-gray-200 dark:border-zinc-800"
                    />
                    <SelectComponent
                        data={stateOptions}
                        value={state}
                        onValueChange={(val) => { setState(val || 'all'); setCurrentPage(1); }}
                        placeholder="Select State"
                        className="h-10 border-gray-200 dark:border-zinc-800"
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="rounded-xl shadow-md flex-1 flex flex-col min-h-0 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
                <DataTable
                    columns={columns as any}
                    data={customers}
                    headerTitle="Customer"
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
                    className="pb-3"
                    customHeader={(
                        <Button
                            size="sm"
                            variant="default"
                            className="h-8 rounded-lg"
                            onClick={handleAdd}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Customer
                        </Button>
                    )}
                    totalItems={totalItems}
                />
            </div>

            <CustomerDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                customerId={editCustomerId}
            />

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


