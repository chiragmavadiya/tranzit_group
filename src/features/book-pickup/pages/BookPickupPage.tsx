import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common';
import type { Column } from '@/components/common/types/DataTable.types';
import { useBookPickups, useCreatePickup } from '../hooks/useBookPickup';
import type { BookPickup } from '../types';
import { showToast } from '@/components/ui/custom-toast';
import { Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export default function BookPickupPage() {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'new';
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    // Map activeTab to book parameter: new = 0, booked = 1
    const isBooked = activeTab === 'booked' ? 1 : 0;

    const { data: pickupsResponse, isLoading } = useBookPickups({
        book: isBooked,
        page,
        per_page: pageSize,
        search: useDebounce(search, 500)
    });

    const { mutate: createPickup, isPending: isBooking } = useCreatePickup();

    const pickups = pickupsResponse?.data || [];
    const totalItems = pickupsResponse?.meta?.total || 0;

    const handleBookPickup = () => {
        if (selectedRows.length === 0) {
            showToast("Please select at least one pickup", "error");
            return;
        }

        createPickup({
            ids: selectedRows,
            type: "courier",
            courier: "Direct Freight"
        }, {
            onSuccess: (data) => {
                showToast(data.message || "Pickups booked successfully", "success");
                setSelectedRows([]);
            },
            onError: (error: any) => {
                showToast(error.message || "Failed to book pickups", "error");
            }
        });
    };

    const columns: Column<BookPickup>[] = [
        { key: 'customer_name', header: 'CUSTOMER NAME' },
        { key: 'order_number', header: 'ORDER NUMBER' },
        {
            key: 'amount',
            header: 'AMOUNT',
            cell: (val: number) => <span className="font-bold">${Number(val).toFixed(2)}</span>
        },
        { key: 'shipping_address', header: 'SHIPPING ADDRESS' },
        { key: 'order_created_date', header: 'ORDER CREATED DATE' },
    ];

    return (
        <div className="flex flex-col flex-1 gap-6 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-50/30 dark:bg-zinc-950/30">
            <div className="rounded-lg shadow-sm flex-1 flex flex-col min-h-0 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <DataTable
                    columns={columns}
                    data={pickups}
                    totalItems={totalItems}
                    pageSize={pageSize}
                    currentPage={page}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                    loading={isLoading}
                    searchable={true}
                    selectable={activeTab === 'new'}
                    selectedRows={selectedRows}
                    onSelectionChange={setSelectedRows}
                    headerTitle={activeTab === 'new' ? "New Pickups" : "Booked Pickups"}
                    emptyMessage="No pickups available"
                    className="pb-3"
                    searchPlaceholder="Search pickups..."
                    onSearchChange={(val) => {
                        setSearch(val);
                        setPage(1); // Reset to first page on search
                    }}
                    searchValue={search}
                    rowKey="id"
                    customHeader={activeTab === 'new' ? (
                        <Button
                            onClick={handleBookPickup}
                            disabled={isBooking || selectedRows.length === 0}
                            className="gap-2 bg-[#0060FE] hover:bg-[#0052db] text-white shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-[0.98] font-semibold border-none px-4 h-8"
                        >
                            {isBooking ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            Book with Direct Freight
                        </Button>
                    ) : null}
                />
            </div>
        </div>
    );
}
