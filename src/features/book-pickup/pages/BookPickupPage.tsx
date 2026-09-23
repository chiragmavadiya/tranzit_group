import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import type { Column } from '@/components/common/types/DataTable.types';
import { useBookPickups, useCreatePickup, useExportBookPickup } from '../hooks/useBookPickup';
import type { BookPickup } from '../types';
import { showToast } from '@/components/ui/custom-toast';
import { Loader2, Search, Upload, File, FileText, Printer } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import { DropdownCustomMenu } from '@/components/ui/dropdown-menu';
import { DEFAULT_PAGE_SIZES } from '@/constants/global.constants';
<<<<<<< HEAD
import useLocalStorage from '@/hooks/useLocalStorage';
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c

export default function BookPickupPage() {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'new';
    const [search, setSearch] = useState('');
    const [page, setPage] = useLocalStorage<number>('bookpickup_page', 1);
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
    const { mutate: exportBookPickup, isPending: isExporting } = useExportBookPickup();

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

    const handleExport = (format: string) => {
        exportBookPickup({ format, book: isBooked });
    };

    const columns: Column<BookPickup>[] = [
        { key: 'customer_name', header: 'CUSTOMER NAME', width: '180px' },
        { key: 'order_number', header: 'ORDER NUMBER', width: '160px' },
        {
            key: 'amount',
            header: 'AMOUNT',
            width: '110px',
            cell: (val: number) => <span className="font-bold">${Number(val).toFixed(2)}</span>
        },
        { key: 'shipping_address', header: 'SHIPPING ADDRESS', width: '280px' },
        { key: 'order_created_date', header: 'ORDER CREATED DATE', width: '160px' },
    ];

    return (
        <div className="flex flex-col flex-1 gap-6 p-page-padding animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
            <div className="rounded-lg min-h-[300px] shadow-md border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex-none h-auto">
                <div className="flex flex-col gap-3 p-4 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-t-lg print:hidden">
                    {/* Row 1: Title */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-base font-bold text-gray-800 dark:text-zinc-200 my-0">
                            {activeTab === 'new' ? "New Pickups" : "Booked Pickups"}
                        </h1>
                    </div>

                    {/* Row 2: Filters & Actions */}
                    <div className="flex flex-wrap items-center gap-2.5 w-full">
                        {/* Left Section (Search) */}
                        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto sm:flex-1">
                            <div className="w-full sm:w-64 md:w-72 flex-none sm:flex-initial">
                                <FormInput
                                    placeholder="Search pickups..."
                                    value={search}
                                    onChange={(value) => { setSearch(value); setPage(1); }}
                                    icon={Search}
                                    className="w-full h-8"
                                />
                            </div>
                        </div>

                        {/* Actions Row (Page Size, Export, Book) */}
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

                            {pickups.length > 0 && (
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

                            {activeTab === 'new' && (
                                <Button
                                    onClick={handleBookPickup}
                                    disabled={isBooking || selectedRows.length === 0}
                                    className="gap-2 text-white shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-[0.98] font-semibold border-none px-4 h-8 shrink-0"
                                >
                                    {isBooking ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    Book with Direct Freight
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={pickups}
                    totalItems={totalItems}
                    pageSize={pageSize}
                    currentPage={page}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                    loading={isLoading}
                    header={false}
                    selectable={activeTab === 'new'}
                    selectedRows={selectedRows}
                    onSelectionChange={setSelectedRows}
                    emptyMessage="No pickups available"
                    className="pb-3 flex-none h-auto"
                    rowKey="id"
                />
            </div>
        </div>
    );
}
