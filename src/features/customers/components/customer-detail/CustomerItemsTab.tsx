import React, { useState, useMemo, useCallback } from 'react';
import { DataTable } from '@/components/common/DataTable';
import type { Column } from '@/components/common/types/DataTable.types';
import { Star } from 'lucide-react';
import { useCustomerItems } from '../../hooks/useCustomers';
import { useDebounce } from '@/hooks/useDebounce';
import type { Item } from '@/features/items/types';

interface CustomerItemsTabProps {
    customerId: string;
}

export const CustomerItemsTab: React.FC<CustomerItemsTabProps> = ({ customerId }) => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [pageSize, setPageSize] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);

    const { data: itemsData, isLoading } = useCustomerItems(customerId, {
        search: debouncedSearch,
        per_page: pageSize,
        page: currentPage
    });

    const handleSearch = useCallback((searchStr: string) => {
        setSearch(searchStr);
        setCurrentPage(1);
    }, []);

    const handlePageSizeChange = useCallback((size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    }, []);

    const columns = useMemo<Column<Item>[]>(() => [
        {
            key: "item_name",
            accessor: "item_name",
            header: "Item Name",
            sortable: true,
            searchable: true,
            cell: (val, row) => (
                <div className='flex items-center gap-3'>
                    {row.is_default && (
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
                    )}
                    <div className='min-w-0'>
                        <span className='text-[13px] xl:text-sm font-medium'>{val}</span>
                        <p className='md:hidden m-0 text-[11px] text-gray-500 dark:text-zinc-400'>
                            {row.item_code} · {row.item_length} × {row.item_width} × {row.item_height} cm · {typeof row.item_weight === 'number' ? row.item_weight.toFixed(2) : row.item_weight} kg
                        </p>
                    </div>
                </div>
            )
        },
        {
            key: "item_code",
            accessor: "item_code",
            header: "Item Code",
            sortable: true,
            searchable: true,
            className: "hidden md:table-cell",
        },
        {
            key: "dimensions",
            accessor: "dimensions",
            header: "Dimensions",
            className: "hidden md:table-cell",
            cell: (_, row) => `${row.item_length} × ${row.item_width} × ${row.item_height}`
        },
        {
            key: "item_weight",
            accessor: "item_weight",
            header: "Weight",
            className: "hidden md:table-cell",
            cell: (val) => typeof val === 'number' ? val.toFixed(2) + ' kg' : val
        },
        {
            key: "item_cubic",
            accessor: "item_cubic",
            header: "Item Cubic",
            sortable: true,
            className: "hidden lg:table-cell",
            cell: (val) => typeof val === 'number' ? val.toFixed(4) : val
        },
        {
            key: "status",
            accessor: "status",
            header: "Status",
            cell: (val) => {
                const isActive = val === 'Active';
                return (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        isActive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-slate-50 text-slate-600 dark:bg-zinc-800/30 dark:text-zinc-400'
                    }`}>
                        {val}
                    </span>
                );
            }
        }
    ], []);

    return (
        <div className="flex flex-col flex-1 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-y-auto">
            <div className='rounded-lg shadow-sm border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex-none h-auto'>
                <DataTable
                    columns={columns}
                    data={itemsData?.data || []}
                    loading={isLoading}
                    searchPlaceholder="Search items..."
                    onSearchChange={handleSearch}
                    searchValue={search}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                    headerTitle='Customer Items'
                    headerDescription='List of items saved by the customer for consignment prepopulation.'
                    headerClass="h-20"
                    className='pb-3 flex-none h-auto [&_div.overflow-auto]:flex-none [&_div.overflow-auto]:h-auto [&_div.overflow-auto]:min-h-0 [&_div.overflow-auto]:overflow-y-visible [&_div.overflow-auto]:overflow-x-auto'
                    totalItems={itemsData?.meta?.total || 0}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};
