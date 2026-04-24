import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common';
import type { Column } from '@/components/common/types/DataTable.types';

import { MOCK_PICKUPS, MOCK_BOOKED_PICKUPS } from '../constants/book-pickup.mock';

interface Pickup {
    id: number;
    customerName: string;
    orderNumber: string;
    amount: string;
    shippingAddress: string;
    orderCreatedDate: string;
}

export default function BookPickupPage() {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'new';
    const [search, setSearch] = useState('');
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    const columns: Column<Pickup>[] = [
        { key: 'customerName', header: 'CUSTOMER NAME' },
        { key: 'orderNumber', header: 'ORDER NUMBER' },
        { key: 'amount', header: 'AMOUNT', cell: (val: string) => <span className="font-bold">{val}</span> },
        { key: 'shippingAddress', header: 'SHIPPING ADDRESS' },
        { key: 'orderCreatedDate', header: 'ORDER CREATED DATE' },
    ];

    return (
        <div className="flex flex-col flex-1 gap-6 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-50/30 dark:bg-zinc-950/30">
            <div className="rounded-lg shadow-sm flex-1 flex flex-col min-h-0 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <DataTable
                    columns={columns}
                    data={activeTab === 'new' ? MOCK_PICKUPS : MOCK_BOOKED_PICKUPS}
                    totalItems={activeTab === 'new' ? MOCK_PICKUPS.length : MOCK_BOOKED_PICKUPS.length}
                    pageSize={25}
                    searchable={true}
                    selectable={activeTab === 'new'}
                    selectedRows={selectedRows}
                    onSelectionChange={setSelectedRows}
                    headerTitle={activeTab === 'new' ? "New" : "Booked"}
                    emptyMessage="No data available in table"
                    className="pb-3"
                    searchPlaceholder="Search..."
                    onSearchChange={setSearch}
                    searchValue={search}
                    customHeader={activeTab === 'new' ? (
                        <Button className="gap-2 bg-[#0060FE] hover:bg-[#0052db] text-white shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-[0.98] font-semibold border-none px-4 h-8">
                            Book with Direct Freight
                        </Button>
                    ) : null}
                />
            </div>
        </div>
    );
}
