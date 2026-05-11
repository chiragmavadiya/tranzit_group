import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SelectComponent from '@/components/ui/select';
import { DataTable } from '@/components/common/DataTable';
import { CANCEL_ORDER_COLUMNS } from '../columns';
import { useCancelOrders } from '../hooks/useCancelOrder';
import { useDebounce } from '@/hooks/useDebounce';

export default function CancelOrderPage() {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'request';
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [customer, setCustomer] = useState('all');

    const debouncedSearch = useDebounce(search, 500);

    const { data: cancelOrderData, isLoading } = useCancelOrders({
        status: activeTab === 'request' ? 'pending' : 'processed',
        search: debouncedSearch,
        page,
        per_page: pageSize
    });

    const orders = useMemo(() => cancelOrderData?.data || [], [cancelOrderData]);
    const totalItems = useMemo(() => cancelOrderData?.meta?.total || 0, [cancelOrderData]);

    const headerTitle = activeTab === 'request' ? "Cancel Request" : "Canceled Order";

    return (
        <div className="flex flex-col flex-1 gap-6 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
            {/* Table Section */}
            <div className="rounded-lg shadow-sm flex-1 flex flex-col min-h-0 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 ">
                <DataTable
                    columns={CANCEL_ORDER_COLUMNS}
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
                        <SelectComponent
                            placeholder="Select Customer"
                            value={customer}
                            onValueChange={(val) => setCustomer(val || 'all')}
                            data={[
                                { label: 'All Customers', value: 'all' },
                                { label: 'Shikhar Digisite', value: 'shikhar' },
                                { label: 'Ashish', value: 'ashish' },
                            ]}
                            className="h-8 w-64 rounded-lg"
                        />
                    }
                />
            </div>
        </div>
    );
}
