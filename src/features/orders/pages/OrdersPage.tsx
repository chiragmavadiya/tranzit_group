"use client";

import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import type { Order, TabType } from '@/features/orders/types';
import { useOrders, useExportOrders, useImportOrders, useDownloadLabel, useCancelOrder, useArchiveOrder, usePrintOrder, useWalletCheck, useCreateAuspostManifest } from '@/features/orders/hooks/useOrders';
import WalletCheckDialog from '@/features/orders/components/WalletCheckDialog';
import { DataTable } from '@/components/common/DataTable';
import { getOrdersColumns } from '../column';
import DatePicker from '@/components/common/DatePicker';
import { Button } from '@/components/ui/button';
import {
  Download, Plus, Loader2,
  Zap,
  ChevronDown,
} from 'lucide-react';
import { useAppSelector } from '@/hooks/store.hooks';
import { showToast } from '@/components/ui/custom-toast';
import { ConformationModal } from '@/components/common/ConformationModal';
import { useDebounce } from '@/hooks/useDebounce';
import { FormSelect } from '../components/OrderFormUI';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { DropdownCustomMenu } from '@/components/ui/dropdown-menu';

const ImportOrdersDialog = lazy(() => import('@/features/orders/components/ImportOrdersDialog'));
const CreateOrderDialog = lazy(() => import('@/features/orders/components/CreateOrderDialog'));

export default function OrdersPage({ fromCustomer, customerId }: { fromCustomer?: boolean, customerId?: string }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab')?.toLowerCase() as TabType) || 'new';
  const { role, team_access } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const isAdmin = role === 'admin';
  const isSubUser = role === 'customer' && team_access?.is_sub_user;
  const canReadWrite = !isSubUser || team_access?.permissions?.order === 'full';

  // State for pagination and search
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const debouncedSearch = useDebounce(search, 400);

  const parseLocalDate = useCallback((dateStr?: string | null) => {
    if (!dateStr) return undefined;
    const parts = dateStr.includes('/') ? dateStr.split('/') : dateStr.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // 0-based
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return undefined;
  }, []);

  const formatDate = useCallback((date?: Date) => {
    return date ? format(date, 'dd-MM-yyyy') : undefined;
  }, []);

  const initialStartDate = useMemo(() => {
    return parseLocalDate(searchParams.get('start_date'));
  }, [searchParams, parseLocalDate]);

  const initialEndDate = useMemo(() => {
    return parseLocalDate(searchParams.get('end_date'));
  }, [searchParams, parseLocalDate]);

  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>(() => [initialStartDate, initialEndDate]);
  const [appliedDateRange, setAppliedDateRange] = useState<[Date | undefined, Date | undefined]>(() => [initialStartDate, initialEndDate]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isDownloadingLabels, setIsDownloadingLabels] = useState(false);
  const [isCancellingOrders, setIsCancellingOrders] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [orderToArchive, setOrderToArchive] = useState<string | null>(null);
  const [addressEditModal, setAddressEditModal] = useState<string>();
  // const [courierEditModal, setCourierEditModal] = useState<Order>();

  const selectedCustomer = searchParams.get('customerId') || undefined;
  const setSelectedCustomer = useCallback((val: string | undefined) => {
    setSelectedRows([])
    setSearchParams((prev) => {
      if (val) {
        prev.set('customerId', val);
      } else {
        prev.delete('customerId');
      }
      return prev;
    });
  }, [setSearchParams]);

  // Synchronize search and date range filters with URL searchParams
  useEffect(() => {
    setSelectedRows([])
    setSearchParams((prev) => {
      let hasChanged = false;

      const currentStartDate = prev.get('start_date') || undefined;
      const newStartDate = formatDate(appliedDateRange[0]);
      if (currentStartDate !== newStartDate) {
        if (newStartDate) {
          prev.set('start_date', newStartDate);
        } else {
          prev.delete('start_date');
        }
        hasChanged = true;
      }

      const currentEndDate = prev.get('end_date') || undefined;
      const newEndDate = formatDate(appliedDateRange[1]);
      if (currentEndDate !== newEndDate) {
        if (newEndDate) {
          prev.set('end_date', newEndDate);
        } else {
          prev.delete('end_date');
        }
        hasChanged = true;
      }

      return hasChanged ? prev : prev;
    }, { replace: true });
  }, [debouncedSearch, appliedDateRange, setSearchParams, formatDate]);

  const downloadLabelMutation = useDownloadLabel();
  const cancelOrderMutation = useCancelOrder();
  const archiveOrderMutation = useArchiveOrder();
  const printOrderMutation = usePrintOrder();
  const createAuspostManifestMutation = useCreateAuspostManifest();
  const { data: customersData } = useCustomers({ per_page: 1000 }, isAdmin);

  const [walletCheckOpen, setWalletCheckOpen] = useState(false);
  const [walletCheckData, setWalletCheckData] = useState<any>(null);
  const [orderToPrint, setOrderToPrint] = useState<{ orderNumber: string | number; amount: number; canConsign: boolean } | null>(null);
  const [showItemCountModal, setShowItemCountModal] = useState(false);
  const [pendingPrintArgs, setPendingPrintArgs] = useState<{ orderNumber: string | number; amount: number; row: Order } | null>(null);

  const { mutate: checkWallet, isPending: walletLoading } = useWalletCheck();
  const { mutate: printLabel } = useDownloadLabel(true);

  const executePrint = useCallback((orderNumber: string | number, canConsign: boolean = true) => {
    printOrderMutation.mutate(orderNumber, {
      onSuccess: () => {
        setWalletCheckOpen(false);
        if (canConsign) {
          printLabel(orderNumber);
        }
        setOrderToPrint(null);
      },
      onError: (err: any) => {
        if (err?.response?.data?.need_edit) {
          navigate(`/orders/consign/${orderNumber}`)
        }
        setOrderToPrint(null);
      }
    });
  }, [printOrderMutation, printLabel, navigate]);

  const proceedPrint = useCallback((orderNumber: string | number, amount: number, row: Order) => {
    setOrderToPrint({ orderNumber, amount, canConsign: row.can_consign });

    if (row.is_own_courier) {
      executePrint(orderNumber, row.can_consign);
      return;
    }

    checkWallet({ total: amount, customer_id: row.customer_id || '', role }, {
      onSuccess: (res) => {
        if (res.ok) {
          setWalletCheckData(res);
          setWalletCheckOpen(true);
        }
        // else {
        //   executePrint(orderNumber);
        // }
      },
      onError: (err: any) => {
        showToast(err?.error || 'Failed to check wallet balance', 'error');
        setOrderToPrint(null);
      }
    });
  }, [role, checkWallet, executePrint]);

  const handlePrintClick = useCallback((orderNumber: string | number, amount: number, row: Order) => {
    if (row.can_consign === false) {
      setPendingPrintArgs({ orderNumber, amount, row });
      setShowItemCountModal(true);
      return;
    }

    proceedPrint(orderNumber, amount, row);
  }, [proceedPrint]);


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
    start_date: formatDate(appliedDateRange[0]),
    end_date: formatDate(appliedDateRange[1]),
    customer: selectedCustomer || customerId || undefined,
  }), [activeTab, pageSize, page, debouncedSearch, appliedDateRange, selectedCustomer, customerId, formatDate]);

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
        const order = ordersData?.data.find((order) => order.order_number === orderId);
        if (order?.is_own_courier || activeTab === 'new') {
          await archiveOrderMutation.mutateAsync(orderId);
        } else {
          await cancelOrderMutation.mutateAsync({ orderId, data: { manually: false } });

        }
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
  }, [selectedRows, ordersData, activeTab, archiveOrderMutation, cancelOrderMutation]);

  const handleCustomerEdit = useCallback((id: string) => {
    setAddressEditModal(id);
  }, []);

  const handleCourierEdit = useCallback((row: Order) => {
    navigate(`${isAdmin ? '/admin' : ''}/orders/consign/${row.order_number}`);
  }, [navigate, isAdmin]);

  // const updateCourier = useUpdateOrderCourier();

  // const handleUpdateCourier = useCallback((orderNumber: string, courierId: string) => {
  //   updateCourier.mutate({ orderNumber, courierId });
  // }, [updateCourier]);

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

  const handleManifestOrders = useCallback(() => {
    const auspostOrders = selectedRows.filter((orderId) => {
      const order = ordersData?.data?.find((o: any) => String(o.order_number) === String(orderId));
      return order?.courier_code?.toLowerCase() === 'auspost';
    });
    if (auspostOrders.length === 0) {
      showToast("No AusPost orders selected for manifesting", "error");
      return;
    }
    createAuspostManifestMutation.mutate(auspostOrders, {
      onSuccess: () => {
        setSelectedRows([]);
      }
    });
  }, [selectedRows, ordersData?.data, createAuspostManifestMutation]);

  const downloadingLabelId = downloadLabelMutation.isPending ? String(downloadLabelMutation.variables) : null;
  const updateToArchiveId = archiveOrderMutation.isPending ? String(archiveOrderMutation.variables) : null;

  const columns = useMemo(() => getOrdersColumns(
    role,
    activeTab,
    navigate,
    handleCustomerEdit,
    handleCourierEdit,
    handleDownloadSingleLabel,
    handleCancelSingleOrderClick,
    downloadingLabelId,
    fromCustomer,
    handleArchiveOrder,
    updateToArchiveId,
    handlePrintClick,
    printOrderMutation.isPending ? printOrderMutation.variables : (walletLoading ? orderToPrint?.orderNumber : null),
    canReadWrite
  ), [role, activeTab, navigate, handleCustomerEdit, handleCourierEdit, handleDownloadSingleLabel, handleCancelSingleOrderClick, downloadingLabelId, fromCustomer, handleArchiveOrder, updateToArchiveId, handlePrintClick, printOrderMutation.isPending, printOrderMutation.variables, walletLoading, orderToPrint?.orderNumber, canReadWrite]);

  return (
    <div className={`${fromCustomer ? "p-0" : "p-page-padding"} flex-1 flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 h-full overflow-hidden min-h-0`}>

      <div className='rounded-lg shadow-sm flex-1 flex flex-col min-h-0 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 '>
        {!fromCustomer && (
          <div className="flex flex-col md:flex-row md:items-end md:justify-end gap-4 p-4 pb-0 print:hidden w-full">
            {isAdmin && (
              <div className="w-full md:w-64">
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
                    label: `${c.first_name} ${c.last_name} (${c.email})`
                  })) || []}
                />
              </div>
            )}
            {selectedRows.length > 0 && (
              <div className="flex items-center gap-2 mr-0 md:mr-2 border-b md:border-b-0 md:border-r border-gray-200 dark:border-zinc-800 pb-2 md:pb-0 pr-0 md:pr-4 w-full md:w-auto">
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
                  <span>{activeTab === 'new' ? 'Delete' : 'Cancel'} Orders</span>
                </Button>
                {activeTab === 'printed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2"
                    onClick={handleManifestOrders}
                    disabled={createAuspostManifestMutation.isPending}
                  >
                    {createAuspostManifestMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    <span>Manifest orders ({selectedRows.length})</span>
                  </Button>
                )}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto md:flex md:items-end md:gap-4">
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
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <Button
                onClick={handleApplyFilters}
                variant="default"
                size="sm"
                className="h-8 px-4 flex-1 md:flex-none"
              >
                Apply
              </Button>

              {appliedDateRange[0] || appliedDateRange[1] ? (
                <Button
                  onClick={handleClearFilters}
                  variant="ghost"
                  size="sm"
                  className="h-8 px-4 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex-1 md:flex-none"
                >
                  Clear
                </Button>
              ) : null}
            </div>
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
          selectable={!isAdmin && activeTab !== 'archived'}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          exportable={!fromCustomer && canReadWrite}
          customHeader={!fromCustomer && canReadWrite ? (() => (
            <div className="flex items-center justify-between gap-2 w-full md:w-auto">
              {!isAdmin && (
                <Button
                  variant="outline"
                  className="h-8 flex-1 md:flex-none gap-2 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 font-medium text-slate-700 dark:text-zinc-300 transition-colors"
                  onClick={() => setIsImportDialogOpen(true)}
                  disabled={importOrders.isPending}
                >
                  {importOrders.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>{importOrders.isPending ? 'Importing...' : 'Import'}</span>
                </Button>
              )}
              {isAdmin ? (
                <DropdownCustomMenu
                  menus={[
                    {
                      label: "Create an order",
                      onClick: () => navigate(`${role === 'admin' ? '/admin' : ''}/orders/create`),
                      className: 'font-medium',
                    },
                    {
                      label: "Create a Manual Order",
                      onClick: () => navigate(`${role === 'admin' ? '/admin' : ''}/orders/create-menual`),
                      className: 'font-medium',
                    }
                  ]}
                >
                  <Button
                    className="h-8 flex-1 md:flex-none w-full md:w-auto gap-2 bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 dark:shadow-none transition-all active:scale-[0.98] font-semibold border-none px-4"
                  >
                    <span>Create Order</span>
                    <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
                  </Button>
                </DropdownCustomMenu>
              ) : (
                <Button
                  className="h-8 flex-1 md:flex-none gap-2 bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 dark:shadow-none transition-all active:scale-[0.98] font-semibold border-none px-4"
                  onClick={() => navigate(`${role === 'admin' ? '/admin' : ''}/orders/create`)}
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Order</span>
                </Button>
              )}
            </div>
          )) : undefined}
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
            title={`${activeTab === 'new' ? 'Delete' : 'Cancel'} Selected Orders`}
            description={`Are you sure you want to ${activeTab === 'new' ? 'delete' : 'cancel'} the ${selectedRows.length} selected order(s)? This action cannot be undone.`}
            onConfirm={handleCancelMultipleOrders}
            confirmText={`Yes, ${activeTab === 'new' ? 'Delete' : 'Cancel'}`}
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
                await cancelOrderMutation.mutateAsync({ orderId: orderToCancel, data: { manually: false } });
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
          // isUpdate={true}
          />
        </Suspense>
      )}
      {/* {courierEditModal && (
        <UpdateCourierModal
          open={!!courierEditModal}
          onOpenChange={() => setCourierEditModal(undefined)}
          orderData={courierEditModal}
        />
      )} */}
      {walletCheckOpen && walletCheckData && orderToPrint && (
        <WalletCheckDialog
          open={walletCheckOpen}
          onOpenChange={setWalletCheckOpen}
          walletBalance={walletCheckData.wallet_balance}
          orderTotal={orderToPrint.amount}
          isPending={printOrderMutation.isPending}
          onConfirm={() => executePrint(orderToPrint.orderNumber, orderToPrint.canConsign)}
        />
      )}
      {showItemCountModal && (
        <ConformationModal
          open={showItemCountModal}
          onOpenChange={(open) => {
            setShowItemCountModal(open);
            if (!open) {
              setPendingPrintArgs(null);
            }
          }}
          title="Shipping Label Not Generated"
          description={
            <div className="space-y-4">
              <p className="text-sm">The shipping label cannot be generated for this order at the moment.</p>
              <p className="text-sm font-semibold">
                The shipping label will be created by our support team once the payment has been successfully completed.
              </p>
            </div>
          }
          onConfirm={() => {
            setShowItemCountModal(false);
            if (pendingPrintArgs) {
              proceedPrint(pendingPrintArgs.orderNumber, pendingPrintArgs.amount, pendingPrintArgs.row);
              setPendingPrintArgs(null);
            }
          }}
          confirmText="Continue"
          cancelText="Cancel"
          className="sm:max-w-[500px]"
        />
      )}
      {/* {showReceiverPhoneModal && (
        <CustomModel
          open={showReceiverPhoneModal}
          onOpenChange={setShowReceiverPhoneModal}
          title="Receiver Phone Number Required"
          description="A contact number for the receiver is required to book this consignment."
          onSubmit={() => {
            if (!receiverPhoneInput.trim() || !isPhoneValid(receiverPhoneInput)) {
              showToast("Please enter a valid phone number", "error");
              return;
            }
            handleReceiverPhoneSubmit(receiverPhoneInput);
          }}
          submitText="Print Order"
          cancelText="Cancel"
          contentClass="sm:max-w-[450px]"
        >
          <div className="p-4 space-y-4">
            <FormInput
              label="Receiver Phone Number"
              value={receiverPhoneInput}
              onChange={(val) => setReceiverPhoneInput(val)}
              placeholder="e.g. 0412345678"
              required
              isFullWidth
              error={!receiverPhoneInput.trim() || !isPhoneValid(receiverPhoneInput)}
            />
          </div>
        </CustomModel>
      )} */}
    </div>
  );
}
