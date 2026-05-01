"use client";

import { useState, Suspense, lazy, useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { TabType } from '@/features/orders/types';
import { useOrders, useExportOrders, useImportOrders } from '@/features/orders/hooks/useOrders';
import { DataTable } from '@/components/common';
import { COLUMN_CONFIG } from '../column';
import DatePicker from '@/components/common/DatePicker';
import { Button } from '@/components/ui/button';
import { Download, Plus, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const CreateOrderDialog = lazy(() => import('@/features/orders/components/CreateOrderDialog'));

export default function OrdersPage() {
  const [searchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as TabType) || 'new';

  const [orderDialogMode, setOrderDialogMode] = useState<'receiver' | 'return' | null>(null);

  // State for pagination and search
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);
  const [appliedDateRange, setAppliedDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);

  // Reset page when tab changes
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  // Memoized filters for useOrders
  const filters = useMemo(() => ({
    status: activeTab.toLowerCase(),
    per_page: pageSize,
    page: page,
    search: search || undefined,
    start_date: appliedDateRange[0]?.toISOString(),
    end_date: appliedDateRange[1]?.toISOString(),
  }), [activeTab, pageSize, page, search, appliedDateRange]);

  // Fetch orders data
  const { data: ordersData, isLoading } = useOrders(filters);

  // Export mutation
  const exportOrders = useExportOrders();
  const importOrders = useImportOrders();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  const handleExport = useCallback((format: string) => {
    exportOrders.mutate({
      ...filters,
      format: format as 'pdf' | 'csv' | 'excel'
    });
  }, [filters, exportOrders]);

  const handleDateRangeChange = useCallback((value: Date | undefined, key: 'start' | 'end') => {
    setDateRange((prev) => {
      return key === 'start' ? [value, prev[1]] : [prev[0], value];
    });
  }, []);

  const handleApplyFilters = useCallback(() => {
    setAppliedDateRange(dateRange);
    setPage(1);
  }, [dateRange]);

  const handleClearFilters = useCallback(() => {
    setDateRange([undefined, undefined]);
    setAppliedDateRange([undefined, undefined]);
    setPage(1);
  }, []);

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please select a valid CSV file');
      return;
    }

    importOrders.mutate(file, {
      onSuccess: (response) => {
        toast.success(response.message || 'Orders imported successfully');
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to import orders');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    });
  }, [importOrders]);

  return (
    <div className="p-page-padding flex-1 flex flex-col space-y-4 animate-in fade-in duration-700 h-full overflow-hidden min-h-0 bg-white dark:bg-zinc-950">

      <div className='rounded-lg shadow-sm flex-1 flex flex-col min-h-0 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 '>
        <div className="flex flex-wrap items-end justify-end gap-4 p-4">
          <DatePicker
            label="Start Date"
            date={dateRange[0]}
            setDate={(value) => handleDateRangeChange(value, 'start')}
          />

          <DatePicker
            label="End Date"
            date={dateRange[1]}
            setDate={(value) => handleDateRangeChange(value, 'end')}
          />

          <Button
            onClick={handleApplyFilters}
            variant="default"
            size="sm"
            className="h-8 p-3"
          >
            Apply
          </Button>


          {appliedDateRange[0] || appliedDateRange[1] ? (
            <Button
              onClick={handleClearFilters}
              variant="outline"
              size="sm"
              className="h-8 p-3 text-red-500 border-red-500/50 hover:text-red-600 hover:bg-red-500/10"
            >
              <X />
              Clear
            </Button>
          ) : null}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept=".csv"
          onChange={handleFileChange}
        />
        <DataTable
          columns={COLUMN_CONFIG}
          data={ordersData?.data || []}
          rowKey="order_number"
          loading={isLoading}
          searchPlaceholder="Search orders..."
          onSearchChange={handleSearch}
          searchValue={search}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          pageSizeInFooter
          headerTitle='Orders'
          headerDescription='Manage and track your customer orders across all channels.'
          headerClass="h-20"
          className='pb-3'
          totalItems={ordersData?.meta?.total || 0}
          currentPage={page}
          onPageChange={setPage}
          onExport={handleExport}
          isExporting={exportOrders.isPending}
          // header={false}
          customHeader={() => (
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                className="gap-2 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 font-medium text-slate-700 dark:text-zinc-300 transition-colors"
                onClick={handleImportClick}
                disabled={importOrders.isPending}
              >
                {importOrders.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>{importOrders.isPending ? 'Importing...' : 'Import'}</span>
              </Button>
              <Button
                onClick={() => setOrderDialogMode('receiver')}
                className="gap-2 bg-[#0060FE] hover:bg-[#0052db] text-white shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-[0.98] font-semibold border-none px-4"
              >
                <Plus className="w-4 h-4" />
                <span>Create Order</span>
              </Button>
            </div>
          )}

        />
      </div>

      {orderDialogMode && (
        <Suspense>
          <CreateOrderDialog
            open={!!orderDialogMode}
            onOpenChange={(open) => !open && setOrderDialogMode(null)}
            type={orderDialogMode as any}
          />
        </Suspense>
      )}
    </div>
  );
}
