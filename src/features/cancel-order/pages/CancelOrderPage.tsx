import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataTable } from '@/components/common/DataTable';
import { getCancelOrderColumns } from '../columns';
import { useCancelOrders } from '../hooks/useCancelOrder';
import { useDebounce } from '@/hooks/useDebounce';
import { FormSelect } from '@/features/orders/components/OrderFormUI';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { useRole } from '@/lib/utils';

export default function CancelOrderPage() {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'request';
    const role = useRole();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [customer, setCustomer] = useState('');

    const debouncedSearch = useDebounce(search, 500);

    const { data: cancelOrderData, isLoading } = useCancelOrders({
        status: activeTab === 'request' ? 'pending' : 'processed',
        search: debouncedSearch,
        page,
        per_page: pageSize,
        customer: customer
    });
    const { data: customersData } = useCustomers({ pageSize: 1000 });

    const orders = useMemo(() => cancelOrderData?.data || [], [cancelOrderData]);
    const totalItems = useMemo(() => cancelOrderData?.meta?.total || 0, [cancelOrderData]);

    const headerTitle = activeTab === 'request' ? "Cancel Request" : "Canceled Order";

    const columns = useMemo(() => getCancelOrderColumns(role || ''), [role]);

    return (
        <div className="flex flex-col flex-1 gap-6 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-50/30 dark:bg-zinc-950/30">
            {/* Table Section */}
            <div className="rounded-lg shadow-sm flex-1 flex flex-col min-h-0 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 ">
                <DataTable
                    columns={columns}
                    data={orders}
                    totalItems={totalItems}
                    pageSize={pageSize}
                    currentPage={page}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                    loading={isLoading}
                    searchable={true}
                    headerTitle={headerTitle}
                    emptyMessage="No data available in table"
                    className='pb-3'
                    searchPlaceholder="Search orders..."
                    onSearchChange={(val) => { setSearch(val); setPage(1); }}
                    searchValue={search}
                    headerPosition="left"
                    customHeader={
                        // <SelectComponent
                        //     placeholder="Select Customer"
                        //     value={customer}
                        //     onValueChange={(val) => setCustomer(val || 'all')}
                        //     data={[
                        //         { label: 'All Customers', value: 'all' },
                        //         { label: 'Shikhar Digisite', value: 'shikhar' },
                        //         { label: 'Ashish', value: 'ashish' },
                        //     ]}
                        //     className="h-8 w-64 rounded-lg"
                        // />
                        <FormSelect
                            placeholder='All Customers'
                            value={customer}
                            onValueChange={(val) => setCustomer(val || '')}
                            options={customersData?.data?.map((c: any) => ({
                                value: c.id.toString(),
                                label: `${c.first_name} ${c.last_name}`
                            })) || []}
                            className='w-40'
                        />
                    }
                />
            </div>
        </div>
    );
}
