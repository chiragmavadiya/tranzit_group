import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
// import SelectComponent from '@/components/ui/select';
import { DataTable } from '@/components/common';
import type { Column } from '@/components/common/types/DataTable.types';

const MOCK_PICKUPS = [
    {
        id: 1,
        customerName: 'Chirag 10 Gondaliya 10',
        orderNumber: 'CG000099',
        amount: '$50.00',
        shippingAddress: '130 Lonsdale Street, Melbourne VIC, Australia',
        orderCreatedDate: '24 Feb 2026'
    },
    {
        id: 2,
        customerName: 'Chirag 10 Gondaliya 10',
        orderNumber: 'CG000110',
        amount: '$150.94',
        shippingAddress: '150 Collins Street, Melbourne VIC, Australia',
        orderCreatedDate: '16 Apr 2026'
    },
    {
        id: 3,
        customerName: 'Chirag 10 Gondaliya 10',
        orderNumber: 'CG000111',
        amount: '$150.00',
        shippingAddress: '180 Ann Street, Brisbane City QLD, Australia',
        orderCreatedDate: '16 Apr 2026'
    },
    {
        id: 4,
        customerName: 'Customer1 User',
        orderNumber: 'SHP000113',
        amount: '$36.53',
        shippingAddress: '150 Collins Street, Melbourne VIC, Australia',
        orderCreatedDate: '16 Apr 2026'
    },
    {
        id: 5,
        customerName: 'Customer1 User',
        orderNumber: 'SHP000114',
        amount: '$1300.00',
        shippingAddress: '150 Mary Street, Brisbane City QLD, Australia',
        orderCreatedDate: '16 Apr 2026'
    },
    {
        id: 6,
        customerName: 'Customer1 User',
        orderNumber: 'SHP000115',
        amount: '$20.59',
        shippingAddress: '150 Pacific Highway, North Sydney NSW, Australia',
        orderCreatedDate: '16 Apr 2026'
    }
];

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
    // const [customer, setCustomer] = useState('all');
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
                    data={MOCK_PICKUPS}
                    totalItems={MOCK_PICKUPS.length}
                    pageSize={25}
                    searchable={true}
                    selectable={true}
                    selectedRows={selectedRows}
                    onSelectionChange={setSelectedRows}
                    headerTitle={activeTab === 'new' ? "New" : "Booked"}
                    emptyMessage="No data available in table"
                    className="pb-3"
                    searchPlaceholder="Search..."
                    onSearchChange={setSearch}
                    searchValue={search}
                    customHeader={
                        <Button className="gap-2 bg-[#0060FE] hover:bg-[#0052db] text-white shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-[0.98] font-semibold border-none px-4 h-8">
                            Book with Direct Freight
                        </Button>
                    }
                />
            </div>
        </div>
    );
}
