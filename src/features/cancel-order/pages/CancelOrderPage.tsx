import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Upload, File, FileText, Printer, Loader2 } from 'lucide-react';
import { DataTable } from '@/components/common/DataTable';
import { getCancelOrderColumns } from '../columns';
import { useCancelOrders, useExportCancelOrders } from '../hooks/useCancelOrder';
import { useDebounce } from '@/hooks/useDebounce';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { useRole } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DropdownCustomMenu } from '@/components/ui/dropdown-menu';
import { DEFAULT_PAGE_SIZES } from '@/constants/global.constants';
import useLocalStorage from '@/hooks/useLocalStorage';

export default function CancelOrderPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'request';
    const role = useRole();
    const [search, setSearch] = useLocalStorage<string>('cancel_order_search', '');
    const [page, setPage] = useLocalStorage<number>('cancel_order_page', 1);
    const [pageSize, setPageSize] = useLocalStorage<number>('cancel_order_page_size', 25);
    const [customer, setCustomer] = useLocalStorage<string>('cancel_order_customer', '');

    const debouncedSearch = useDebounce(search, 500);

    const { data: cancelOrderData, isLoading } = useCancelOrders({
        status: activeTab === 'request' ? 'pending' : 'processed',
        search: debouncedSearch,
        page,
        per_page: pageSize,
        customer: customer
    });
    const { data: customersData } = useCustomers({ per_page: 1000 });

    const { mutate: exportCancelOrders, isPending: isExporting } = useExportCancelOrders();

    const handleExport = (format: string) => {
        exportCancelOrders({
            format,
            status: activeTab === 'request' ? 'pending' : 'processed',
            search: debouncedSearch,
            customer: customer || undefined
        });
    };

    const orders = useMemo(() => cancelOrderData?.data || [], [cancelOrderData]);
    const totalItems = useMemo(() => cancelOrderData?.meta?.total || 0, [cancelOrderData]);

    const headerTitle = activeTab === 'request' ? "Cancel Request" : "Canceled Order";

    const columns = useMemo(() => {
        const allColumns = getCancelOrderColumns(role || '');
        if (activeTab === 'request') {
            return allColumns.filter(col => col.key !== 'processed_at' && col.key !== 'status');
        }
        return allColumns;
    }, [role, activeTab]);

    useEffect(() => {
        setSearchParams(prev => {
            const current = prev.get('customer') || '';
            if (current !== customer) {
                if (customer) {
                    prev.set('customer', customer);
                } else {
                    prev.delete('customer');
                }
                return prev;
            }
            return prev;
        }, { replace: true });
    }, [customer, setSearchParams]);


    return (
        <div className="flex flex-col flex-1 gap-4 p-page-padding animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
            {/* Table Section */}
            <div className="rounded-lg min-h-[300px] shadow-md border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex-none h-auto">
                <div className="flex flex-col gap-3 p-4 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-t-lg print:hidden">
                    {/* Row 1: Title */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-base font-bold text-gray-800 dark:text-zinc-200 my-0">
                            {headerTitle}
                        </h1>
                    </div>

                    {/* Row 2: Filters & Actions */}
                    <div className="flex flex-wrap items-center gap-2.5 w-full">
                        {/* Left Section (Search & Filters) */}
                        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto sm:flex-1">
                            <div className="w-full sm:w-64 md:w-72 flex-none sm:flex-initial">
                                <FormInput
                                    placeholder="Search orders..."
                                    value={search}
                                    onChange={(value) => { setSearch(value); setPage(1); }}
                                    icon={Search}
                                    className="w-full h-8"
                                />
                            </div>
                            <div className="w-full sm:w-60 md:w-64 flex-none sm:flex-initial">
                                <FormSelect
                                    placeholder="All Customers"
                                    value={customer}
                                    onValueChange={(val) => { setCustomer(val || ''); setPage(1); }}
                                    options={customersData?.data?.map((c: any) => ({
                                        value: c.id.toString(),
                                        label: `${c.first_name} ${c.last_name} (${c.email})`
                                    })) || []}
                                    selectClassName="h-8"
                                />
                            </div>
                        </div>

                        {/* Actions Row (Page Size, Export) */}
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
                            <div className="flex items-center gap-1.5 h-8 shrink-0">
                                <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Show:</span>
                                <FormSelect
                                    className="w-[80px]"
                                    selectClassName="h-8 text-xs font-bold"
                                    value={pageSize.toString()}
                                    onValueChange={(val) => { if (val) { setPageSize(Number(val)); setPage(1); } }}
                                    options={DEFAULT_PAGE_SIZES}
                                    allowClear={false}
                                    searchdisable
                                />
                            </div>

                            {orders.length > 0 && (
                                <DropdownCustomMenu
                                    menus={[
                                        { label: "Print", onClick: () => window.print(), icon: Printer },
                                        { label: "CSV", onClick: () => handleExport('csv'), icon: File },
                                        { label: "Excel", onClick: () => handleExport('excel'), icon: Upload },
                                        { label: "PDF", onClick: () => handleExport('pdf'), icon: FileText },
                                    ]}
                                >
                                    <Button
                                        variant="outline"
                                        className="h-8 gap-2 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 font-medium text-slate-700 dark:text-zinc-300 transition-colors shrink-0 text-xs"
                                        disabled={isExporting}
                                    >
                                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                        <span>Export</span>
                                    </Button>
                                </DropdownCustomMenu>
                            )}
                        </div>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={orders}
                    totalItems={totalItems}
                    pageSize={pageSize}
                    currentPage={page}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                    loading={isLoading}
                    header={false}
                    emptyMessage="No data available in table"
                    className='pb-3 flex-none h-auto'
                />
            </div>
        </div>
    );
}
