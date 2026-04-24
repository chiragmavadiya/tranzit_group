import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SelectComponent from '@/components/ui/select';
import { DataTable } from '@/components/common';
import { MOCK_CANCEL_REQUESTS, MOCK_CANCELED_ORDERS } from '../constants/cancel-order.mock';

export default function CancelOrderPage() {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'request';
    const [search, setSearch] = useState('');
    const [customer, setCustomer] = useState('all');

    const columns = [
        { key: 'customerName', header: 'CUSTOMER NAME' },
        { key: 'orderNumber', header: 'ORDER NUMBER', cell: (val: string) => <span className="font-bold text-blue-600 dark:text-blue-400 italic underline cursor-pointer">{val}</span> },
        { key: 'amount', header: 'AMOUNT', cell: (val: string) => <span className="font-bold">{val}</span> },
        { key: 'requestSubmittedAt', header: 'REQUEST SUBMITTED AT' },
        { key: 'processedBy', header: 'PROCESSED BY' },
        { key: 'processedAt', header: 'PROCESSED AT' },
    ];

    return (
        <div className="flex flex-col flex-1 gap-6 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-50/30 dark:bg-zinc-950/30">
            {/* Table Section */}
            <div className="rounded-lg shadow-sm flex-1 flex flex-col min-h-0 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 ">
                <DataTable
                    columns={columns}
                    data={activeTab === 'request' ? MOCK_CANCEL_REQUESTS : MOCK_CANCELED_ORDERS}
                    totalItems={activeTab === 'request' ? MOCK_CANCEL_REQUESTS.length : MOCK_CANCELED_ORDERS.length}
                    pageSize={25}
                    searchable={true}
                    headerTitle={activeTab === 'request' ? "Cancel Request" : "Canceled Order"}
                    emptyMessage="No data available in table"
                    className='pb-3'
                    searchPlaceholder="Search orders..."
                    onSearchChange={(val) => setSearch(val)}
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
                            className="h-8 rounded-lg"
                        />
                    }
                />
            </div>
        </div>
    );
}
