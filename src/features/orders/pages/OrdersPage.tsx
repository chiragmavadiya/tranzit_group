"use client";

import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { TabType } from '@/features/orders/types';
import { useOrders, useExportOrders, useImportOrders, useDownloadLabel, useCancelOrder, useArchiveOrder } from '@/features/orders/hooks/useOrders';
import { DataTable } from '@/components/common/DataTable';
import { getOrdersColumns } from '../column';
import DatePicker from '@/components/common/DatePicker';
import { Button } from '@/components/ui/button';
import {
  Download, Plus, Loader2,
  // ChevronDown,
  // Package
} from 'lucide-react';
// import { DropdownCustomMenu } from '@/components/ui/dropdown-menu';
import { useAppSelector } from '@/hooks/store.hooks';
import { showToast } from '@/components/ui/custom-toast';
// import { ImportOrdersDialog } from '../components/ImportOrdersDialog';
import { ConformationModal } from '@/components/common/ConformationModal';
// import CreateOrderDialog from '../components/CreateOrderDialog';
import { useDebounce } from '@/hooks/useDebounce';
import { FormSelect } from '../components/OrderFormUI';
import { useCustomers } from '@/features/customers/hooks/useCustomers';

const ImportOrdersDialog = lazy(() => import('@/features/orders/components/ImportOrdersDialog'));
const CreateOrderDialog = lazy(() => import('@/features/orders/components/CreateOrderDialog'));

export default function OrdersPage({ fromCustomer, customerId }: { fromCustomer?: boolean, customerId?: string }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab')?.toLowerCase() as TabType) || 'new';
  const { role } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const isAdmin = role === 'admin';

  // State for pagination and search
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);
  const [appliedDateRange, setAppliedDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isDownloadingLabels, setIsDownloadingLabels] = useState(false);
  const [isCancellingOrders, setIsCancellingOrders] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [orderToArchive, setOrderToArchive] = useState<string | null>(null);
  const [addressEditModal, setAddressEditModal] = useState<string>();
  const selectedCustomer = searchParams.get('customerId') || undefined;
  const setSelectedCustomer = useCallback((val: string | undefined) => {
    setSearchParams((prev) => {
      if (val) {
        prev.set('customerId', val);
      } else {
        prev.delete('customerId');
      }
      return prev;
    });
  }, [setSearchParams]);

  const downloadLabelMutation = useDownloadLabel();
  const cancelOrderMutation = useCancelOrder();
  const archiveOrderMutation = useArchiveOrder();
  const { data: customersData } = useCustomers({ pageSize: 1000 }, isAdmin);


  // Reset page when tab changes
  useEffect(() => {
    setPage(1);
    setSelectedRows([]);
    localStorage.setItem('order_tab', activeTab);
  }, [activeTab]);

  // Memoized filters for useOrders
  const filters = useMemo(() => ({
    status: activeTab.toLowerCase(),
    per_page: pageSize,
    page: page,
    search: debouncedSearch || undefined,
    start_date: appliedDateRange[0],
    end_date: appliedDateRange[1],
    customer: selectedCustomer || customerId || undefined,
  }), [activeTab, pageSize, page, debouncedSearch, appliedDateRange, selectedCustomer, customerId]);

  // Fetch orders data
  const { data: ordersData, isLoading } = useOrders(filters);

  // Mutations
  const exportOrders = useExportOrders();
  const importOrders = useImportOrders();

  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

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
    setSelectedRows([]);
  }, [dateRange]);

  const handleClearFilters = useCallback(() => {
    setDateRange([undefined, undefined]);
    setAppliedDateRange([undefined, undefined]);
    setPage(1);
    setSelectedRows([]);
  }, []);

  const handleImportOrders = useCallback((file: File, customerId?: string) => {
    importOrders.mutate({ file, customerId }, {
      onSuccess: (response) => {
        showToast(response.message || 'Orders imported successfully', "success");
        setIsImportDialogOpen(false);
      },
      onError: (error: any) => {
        showToast(error?.response?.data?.message || 'Failed to import orders', "error");
      }
    });
  }, [importOrders]);

  const handleDownloadMultipleLabels = useCallback(async () => {
    if (selectedRows.length === 0) return;
    setIsDownloadingLabels(true);
    // let successCount = 0;
    // let failCount = 0;
    // for (const orderId of selectedRows) {
    //   try {
    //     downloadLabelMutation.mutateAsync(orderId);
    //     successCount++;
    //   } catch {
    //     failCount++;
    //   }
    // }
    const results = await Promise.allSettled(
      selectedRows.map((orderId) =>
        downloadLabelMutation.mutateAsync(orderId)
      )
    );

    const successCount = results.filter(
      (result) => result.status === "fulfilled"
    ).length;

    const failCount = results.filter(
      (result) => result.status === "rejected"
    ).length;
    if (successCount > 0) {
      showToast(`Successfully downloaded ${successCount} label(s).`, "success");
    }
    if (failCount > 0) {
      showToast(`Failed to download ${failCount} label(s).`, "error");
    }
    setSelectedRows([]);
    setIsDownloadingLabels(false);
  }, [selectedRows, downloadLabelMutation]);

  const handleCancelMultipleOrders = useCallback(async () => {
    if (selectedRows.length === 0) return;
    setIsCancellingOrders(true);
    let successCount = 0;
    let failCount = 0;
    for (const orderId of selectedRows) {
      try {
        await cancelOrderMutation.mutateAsync({ orderId, data: { manual: false } });
        successCount++;
      } catch {
        failCount++;
      }
    }
    if (successCount > 0) {
      showToast(`Successfully cancelled ${successCount} order(s).`, "success");
    }
    if (failCount > 0) {
      showToast(`Failed to cancel ${failCount} order(s).`, "error");
    }
    setSelectedRows([]);
    setShowCancelModal(false);
    setIsCancellingOrders(false);
  }, [selectedRows, cancelOrderMutation]);

  const handleCustomerEdit = useCallback((id: string) => {
    setAddressEditModal(id);

  }, []);

  const handleDownloadSingleLabel = useCallback(async (orderId: string) => {
    try {
      await downloadLabelMutation.mutateAsync(orderId);
      showToast(`Label for order ${orderId} downloaded successfully.`, "success");
    } catch {
      showToast(`Failed to download label for order ${orderId}.`, "error");
    }
  }, [downloadLabelMutation]);

  const handleCancelSingleOrderClick = useCallback((orderId: string) => {
    setOrderToCancel(orderId);
  }, []);

  const handleArchiveOrder = useCallback((orderId: string) => {
    setOrderToArchive(orderId);
  }, []);

  const downloadingLabelId = downloadLabelMutation.isPending ? String(downloadLabelMutation.variables) : null;
  const updateToArchiveId = archiveOrderMutation.isPending ? String(archiveOrderMutation.variables) : null;

  const columns = useMemo(() => getOrdersColumns(
    role,
    activeTab,
    navigate,
    handleCustomerEdit,
    handleDownloadSingleLabel,
    handleCancelSingleOrderClick,
    downloadingLabelId,
    fromCustomer,
    handleArchiveOrder,
    updateToArchiveId
  ), [role, activeTab, navigate, handleCustomerEdit, handleDownloadSingleLabel, handleCancelSingleOrderClick, downloadingLabelId, fromCustomer, handleArchiveOrder, updateToArchiveId]);

  return (
    <div className={`${fromCustomer ? "p-0" : "p-page-padding"} flex-1 flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 h-full overflow-hidden min-h-0`}>

      <div className='rounded-lg shadow-sm flex-1 flex flex-col min-h-0 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 '>
        {!fromCustomer && (
          <div className="flex flex-wrap items-end justify-end gap-4 p-4 pb-0 bg-gray-50/50 dark:bg-zinc-950/50 print:hidden">
            {isAdmin && (
              <FormSelect
                label="Customer"
                placeholder="Select Customer"
                value={selectedCustomer || ''}
                onValueChange={(val) => {
                  const selectedCustomer = customersData?.data?.find((c: any) => c.id.toString() === val);
                  if (selectedCustomer) {
                    setSelectedCustomer(selectedCustomer.id.toString());
                  } else {
                    setSelectedCustomer(undefined);
                  }
                }}
                options={customersData?.data?.map((c: any) => ({
                  value: c.id.toString(),
                  label: `${c.first_name} ${c.last_name}`
                })) || []}
              />
            )}
            {selectedRows.length > 0 && (
              <div className="flex items-center gap-2 mr-2 border-r border-gray-200 dark:border-zinc-800 pr-4">
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium mr-2 whitespace-nowrap">
                  {selectedRows.length} Selected
                </span>
                {activeTab === 'printed' && (
                  <Button
                    variant="default"
                    size="sm"
                    className="h-8 gap-2 bg-primary hover:bg-primary-hover text-white transition-colors font-semibold shadow-lg shadow-primary/20 dark:shadow-none"
                    onClick={handleDownloadMultipleLabels}
                    disabled={isDownloadingLabels || isCancellingOrders}
                  >
                    {isDownloadingLabels ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span>Download Labels</span>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2 border-red-200 dark:border-red-900/30 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 transition-colors font-semibold"
                  onClick={() => setShowCancelModal(true)}
                  disabled={isCancellingOrders || isDownloadingLabels}
                >
                  {isCancellingOrders ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Cancel Orders</span>
                </Button>

              </div>
            )}
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
                variant="ghost"
                size="sm"
                className="h-8 p-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
              >
                Clear
              </Button>
            ) : null}
          </div>
        )}

        <DataTable
          columns={columns}
          data={ordersData?.data || []}
          rowKey="order_number"
          loading={isLoading}
          searchPlaceholder="Search orders..."
          onSearchChange={handleSearch}
          searchValue={search}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          headerTitle='Orders'
          headerDescription='Manage and track your customer orders across all channels.'
          headerClass="h-20"
          className='pb-3'
          totalItems={ordersData?.meta?.total || 0}
          currentPage={page}
          onPageChange={setPage}
          onExport={handleExport}
          isExporting={exportOrders.isPending}
          selectable={!fromCustomer}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          exportable={!fromCustomer}
          customHeader={!fromCustomer && (() => (
            <div className="flex items-center justify-between gap-2">

              <Button
                variant="outline"
                className="gap-2 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 font-medium text-slate-700 dark:text-zinc-300 transition-colors"
                onClick={() => setIsImportDialogOpen(true)}
                disabled={importOrders.isPending}
              >
                {importOrders.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>{importOrders.isPending ? 'Importing...' : 'Import'}</span>
              </Button>
              {/* <DropdownCustomMenu
                menus={[
                  {
                    label: "Create an order",
                    onClick: () => navigate(`${role === 'admin' ? '/admin' : ''}/orders/create`),
                    className: 'font-medium',
                    icon: Plus,
                  },
                  {
                    label: "Create a Return Order",
                    onClick: () => navigate(`${role === 'admin' ? '/admin' : ''}/orders/return`),
                    className: 'font-medium',
                    icon: Package,
                  }
                ]}
              > */}
              <Button
                className="gap-2 bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 dark:shadow-none transition-all active:scale-[0.98] font-semibold border-none px-4"
                onClick={() => navigate(`${role === 'admin' ? '/admin' : ''}/orders/create`)}
              >
                <Plus className="w-4 h-4" />
                <span>Create Order</span>
                {/* <ChevronDown className="w-4 h-4 ml-1 opacity-70" /> */}
              </Button>
              {/* </DropdownCustomMenu> */}
              {/* DO NOT REMOVE THIS BUTTON */}
              {/* <Button
                onClick={() => navigate(`${role === 'admin' ? '/admin' : ''}/orders/create`)}
                className="gap-2 bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 dark:shadow-none transition-all active:scale-[0.98] font-semibold border-none px-4"
              >
                <Plus className="w-4 h-4" />
                <span>Create Order</span>
              </Button> */}
            </div>
          ))}
        />
      </div>
      {
        isImportDialogOpen && (
          <Suspense fallback={null}>
            <ImportOrdersDialog
              open={isImportDialogOpen}
              onOpenChange={setIsImportDialogOpen}
              onImport={handleImportOrders}
              isLoading={importOrders.isPending}
              isAdmin={isAdmin}
            />
          </Suspense>
        )
      }
      {
        showCancelModal && (
          <ConformationModal
            open={showCancelModal}
            onOpenChange={setShowCancelModal}
            title="Cancel Selected Orders"
            description={`Are you sure you want to cancel the ${selectedRows.length} selected order(s)? This action cannot be undone.`}
            onConfirm={handleCancelMultipleOrders}
            confirmText="Yes, Cancel"
            cancelText="No, Keep"
            confirmVariant="destructive"
            loading={isCancellingOrders}
          />
        )
      }
      {
        orderToCancel && (
          <ConformationModal
            open={!!orderToCancel}
            onOpenChange={(open) => !open && setOrderToCancel(null)}
            title={activeTab === 'printed' || activeTab === 'shipped' ? "Archive Order" : "Cancel Order"}
            description={activeTab === 'printed' || activeTab === 'shipped'
              ? `Are you sure you want to archive order ${orderToCancel}? This action cannot be undone.`
              : `Are you sure you want to cancel order ${orderToCancel}? This action cannot be undone.`}
            onConfirm={async () => {
              setIsCancellingOrders(true);
              try {
                await cancelOrderMutation.mutateAsync({ orderId: orderToCancel, data: { manual: false } });
                showToast(
                  activeTab === 'printed' || activeTab === 'shipped'
                    ? `Order ${orderToCancel} archived successfully.`
                    : `Order ${orderToCancel} cancelled successfully.`,
                  "success"
                );
              } catch (err: any) {
                showToast(
                  err?.response?.data?.message ||
                  (activeTab === 'printed' || activeTab === 'shipped'
                    ? `Failed to archive order ${orderToCancel}.`
                    : `Failed to cancel order ${orderToCancel}.`),
                  "error"
                );
              } finally {
                setIsCancellingOrders(false);
                setOrderToCancel(null);
              }
            }}
            confirmText={activeTab === 'printed' || activeTab === 'shipped' ? "Yes, Archive" : "Yes, Cancel"}
            cancelText="No, Keep"
            confirmVariant="destructive"
            loading={isCancellingOrders}
          />
        )
      }
      {
        orderToArchive && (
          <ConformationModal
            open={!!orderToArchive}
            onOpenChange={(open) => !open && setOrderToArchive(null)}
            title="Archive Order"
            description={`Are you sure you want to archive order ${orderToArchive}? This action cannot be undone.`}
            onConfirm={() => {
              archiveOrderMutation.mutate(orderToArchive, {
                onSettled: () => {
                  setOrderToArchive(null);
                }
              });
            }}
            confirmText="Yes, Archive"
            cancelText="No, Keep"
            confirmVariant="destructive"
            loading={archiveOrderMutation.isPending}
          />
        )
      }
      {addressEditModal && (
        <Suspense fallback={null}>
          <CreateOrderDialog
            orderId={addressEditModal}
            open={!!addressEditModal}
            onOpenChange={() => setAddressEditModal('')}
            type="receiver"
            onSubmit={() => { }}
            // initialData={{}}
            isEdit={true}
            isUpdate={true}
          />
        </Suspense>
      )}
    </div>
  );
}
