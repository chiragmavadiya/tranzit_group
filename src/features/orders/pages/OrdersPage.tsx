"use client";

import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format, parse, isValid } from 'date-fns';
import type { Order, TabType } from '@/features/orders/types';
import { useOrders, useExportOrders, useImportOrders, useDownloadLabel, useCancelOrder, useArchiveOrder, useMassOrderAction, usePrintOrder, useWalletCheck, useCreateAuspostManifest, useDownloadPackingDocument } from '@/features/orders/hooks/useOrders';
import type { PackingDocument } from '@/features/orders/services/orders.api';
import { useRestoreOrderConfirm } from '@/features/orders/hooks/useRestoreOrderConfirm';
import WalletCheckDialog from '@/features/orders/components/WalletCheckDialog';
import { DataTable } from '@/components/common/DataTable';
import { getOrdersColumns, getAddressCheckerColumns } from '../column';
import { DateFilter } from '@/components/common/DateFilter';
import type { DateFilterValue } from '@/components/common/DateFilter/types';
import { hydrateDateFilter } from '@/components/common/DateFilter/utils';
// import { calculateDateRange } from '@/components/common/DateFilter/utils';
import { Button } from '@/components/ui/button';
import {
  Download, Plus, Loader2,
  Zap,
  ChevronDown,
  Search,
  Printer,
  File,
  FileText,
  Upload,
  Trash2,
  X
} from 'lucide-react';
import { useAppSelector } from '@/hooks/store.hooks';
import { DEFAULT_PAGE_SIZES } from '@/constants/global.constants';
import { showToast } from '@/components/ui/custom-toast';
import { ConformationModal } from '@/components/common/ConformationModal';
import { useDebounce } from '@/hooks/useDebounce';
import { FormSelect, FormInput } from '../components/OrderFormUI';
import { CustomModel } from '@/components/ui/dialog';
import { isPhoneValid, PHONE_ERROR_MESSAGE } from '@/lib/phone';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { DropdownCustomMenu } from '@/components/ui/dropdown-menu';
import { getDisplayCourierName } from '../utils/order-details.utils';
import useLocalStorage from '@/hooks/useLocalStorage';
import { BulkPrintAction } from '../components/bulk-print/BulkPrintAction';
import { useApplyAddressValidation } from '../hooks/useAddressValidation';

const ImportOrdersDialog = lazy(() => import('@/features/orders/components/ImportOrdersDialog'));
const CreateOrderDialog = lazy(() => import('@/features/orders/components/CreateOrderDialog'));

const BULK_PRINT_ENABLED = String(import.meta.env.VITE_ENABLE_BULK_PRINT).toLowerCase() === 'true';

export default function OrdersPage({ fromCustomer, customerId }: { fromCustomer?: boolean, customerId?: string }) {

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab')?.toLowerCase() as TabType) || 'new';
  const { role, team_access } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const isAdmin = role === 'admin';
  const isSubUser = role === 'customer' && team_access?.is_sub_user;
  const canReadWrite = !isSubUser || team_access?.permissions?.order === 'full';
  // useLocalStorage('low_balance_dismissed', false);
  // State for pagination and search
  const [page, setPage] = useLocalStorage<number>('order_page', 1);
  const [pageSize, setPageSize] = useLocalStorage<number>('order_page_size', 100);

  const [localSearch, setLocalSearch] = useLocalStorage<string>('orders_search', '');
  const [customerSearch, setCustomerSearch] = useState('');
  const search = fromCustomer ? customerSearch : localSearch;
  const setSearch = fromCustomer ? setCustomerSearch : setLocalSearch;
  const debouncedSearch = useDebounce(search, 400);

  const [localDateRange, setLocalDateRange] = useLocalStorage<DateFilterValue>('orders_date_range', {
    type: 'custom',
    from: '',
    to: '',
    label: 'All Time',
  }, hydrateDateFilter);
  const [customerDateRange, setCustomerDateRange] = useState<DateFilterValue>({
    type: 'custom',
    from: '',
    to: '',
    label: 'All Time',
  });
  const dateRange = fromCustomer ? customerDateRange : localDateRange;
  const setDateRange = fromCustomer ? setCustomerDateRange : setLocalDateRange;
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isCancellingOrders, setIsCancellingOrders] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [orderToArchive, setOrderToArchive] = useState<string | null>(null);
  const [addressEditModal, setAddressEditModal] = useState<string>();
  const [addressCheckerOpen, setAddressCheckerOpen] = useState(false);
  // const [courierEditModal, setCourierEditModal] = useState<Order>();

  const [selectedCustomer, setSelectedCustomerState] = useLocalStorage<string | undefined>('orders_selected_customer', undefined);
  const setSelectedCustomer = useCallback((val: string | undefined) => {
    setSelectedRows([]);
    setSelectedCustomerState(val);
  }, [setSelectedCustomerState]);

  // Synchronize state to URL searchParams for TopBar OrdersTabs counts API
  useEffect(() => {
    if (fromCustomer) return;
    setPage(1)
    setSearchParams((prev) => {
      let hasChanged = false;

      // customerId
      const currentCustomer = prev.get('customerId') || undefined;
      if (currentCustomer !== selectedCustomer) {
        if (selectedCustomer) {
          prev.set('customerId', selectedCustomer);
        } else {
          prev.delete('customerId');
        }
        hasChanged = true;
      }

      // search
      const currentSearch = prev.get('search') || undefined;
      const newSearch = debouncedSearch || undefined;
      if (currentSearch !== newSearch) {
        if (newSearch) {
          prev.set('search', newSearch);
        } else {
          prev.delete('search');
        }
        hasChanged = true;
      }

      // start_date & end_date
      let newStartDate: string | undefined;
      if (dateRange.from) {
        const parsedFrom = parse(dateRange.from, 'dd/MM/yyyy', new Date());
        if (isValid(parsedFrom)) {
          newStartDate = format(parsedFrom, 'dd-MM-yyyy');
        }
      }
      const currentStartDate = prev.get('start_date') || undefined;
      if (currentStartDate !== newStartDate) {
        if (newStartDate) {
          prev.set('start_date', newStartDate);
        } else {
          prev.delete('start_date');
        }
        hasChanged = true;
      }

      let newEndDate: string | undefined;
      if (dateRange.to) {
        const parsedTo = parse(dateRange.to, 'dd/MM/yyyy', new Date());
        if (isValid(parsedTo)) {
          newEndDate = format(parsedTo, 'dd-MM-yyyy');
        }
      }
      const currentEndDate = prev.get('end_date') || undefined;
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
  }, [selectedCustomer, debouncedSearch, dateRange, setSearchParams, fromCustomer]);

  const downloadLabelMutation = useDownloadLabel();
  const cancelOrderMutation = useCancelOrder();
  const archiveOrderMutation = useArchiveOrder();
  const massOrderAction = useMassOrderAction();
  const { requestRestore, restoreModal, restoringOrderId } = useRestoreOrderConfirm();
  const printOrderMutation = usePrintOrder();
  const createAuspostManifestMutation = useCreateAuspostManifest();
  const packingDocumentMutation = useDownloadPackingDocument();
  const { data: customersData } = useCustomers({ per_page: 1000 }, isAdmin);

  const [walletCheckOpen, setWalletCheckOpen] = useState(false);
  const [walletCheckData, setWalletCheckData] = useState<any>(null);
  const [orderToPrint, setOrderToPrint] = useState<{ orderNumber: string | number; amount: number; canConsign: boolean } | null>(null);
  const [showItemCountModal, setShowItemCountModal] = useState(false);
  const [pendingPrintArgs, setPendingPrintArgs] = useState<{ orderNumber: string | number; amount: number; row: Order } | null>(null);
  const [showCarrierConfirm, setShowCarrierConfirm] = useState(false);
  const [carrierConfirmData, setCarrierConfirmData] = useState<{ orderNumber: string | number; canConsign: boolean; courier: string } | null>(null);
  const [showReceiverPhoneModal, setShowReceiverPhoneModal] = useState(false);
  const [receiverPhoneInput, setReceiverPhoneInput] = useState('');
  const [phoneModalData, setPhoneModalData] = useState<{ orderNumber: string | number; canConsign: boolean } | null>(null);

  const { mutate: checkWallet, isPending: walletLoading } = useWalletCheck();
  const { mutate: printLabel } = useDownloadLabel(true);

  const executePrint = useCallback((orderNumber: string | number, canConsign: boolean = true, phone?: string) => {
    printOrderMutation.mutate({ order_number: orderNumber, phone }, {
      onSuccess: () => {
        setWalletCheckOpen(false);
        setShowReceiverPhoneModal(false);
        if (canConsign) {
          printLabel(orderNumber);
        }
        setOrderToPrint(null);
      },
      onError: (err: any) => {
        if (err?.response?.data?.requires_phone_or_email || err.response?.data?.requires_phone) {
          setPhoneModalData({ orderNumber, canConsign });
          setReceiverPhoneInput('');
          setShowReceiverPhoneModal(true);
        } else if (err?.response?.data?.need_edit) {
          navigate(`${isAdmin ? '/admin' : ''}/orders/consign/${orderNumber}`);
        }
        setOrderToPrint(null);
      }
    });
  }, [printOrderMutation, printLabel, navigate, isAdmin]);



  const proceedPrint = useCallback((orderNumber: string | number, amount: number, row: Order) => {
    setOrderToPrint({ orderNumber, amount, canConsign: row.can_consign });

    if (!row.courier) {
      showToast('Courier is not selected', 'error');
      navigate(`${isAdmin ? '/admin' : ''}/orders/consign/${orderNumber}`);
      return;
    }

    if (row.is_own_courier) {
      setCarrierConfirmData({ orderNumber, canConsign: row.can_consign, courier: row.courier });
      setShowCarrierConfirm(true);
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
  }, [role, checkWallet, navigate, isAdmin]);

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
  const filters = useMemo(() => {
    let start_date: string | undefined;
    let end_date: string | undefined;

    if (dateRange.from) {
      const parsedFrom = parse(dateRange.from, 'dd/MM/yyyy', new Date());
      if (isValid(parsedFrom)) {
        start_date = format(parsedFrom, 'dd-MM-yyyy');
      }
    }
    if (dateRange.to) {
      const parsedTo = parse(dateRange.to, 'dd/MM/yyyy', new Date());
      if (isValid(parsedTo)) {
        end_date = format(parsedTo, 'dd-MM-yyyy');
      }
    }

    return {
      status: activeTab.toLowerCase(),
      per_page: pageSize,
      page: page,
      search: debouncedSearch || undefined,
      start_date,
      end_date,
      customer: fromCustomer ? customerId : (selectedCustomer || undefined),
      address_status: addressCheckerOpen ? 'invalid' : undefined,
    };
  }, [activeTab, pageSize, page, debouncedSearch, dateRange, selectedCustomer, customerId, fromCustomer, addressCheckerOpen]);

  useEffect(() => {
    if (activeTab !== 'new') {
      setAddressCheckerOpen(false);
    }
  }, [activeTab]);

  const { data: ordersData, isLoading } = useOrders(filters);

  // Mutations
  const exportOrders = useExportOrders();
  const importOrders = useImportOrders();
  const applyAddressValidation = useApplyAddressValidation();

  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, [setSearch]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, [setPage, setPageSize]);

  const handleExport = useCallback((format: string) => {
    exportOrders.mutate({
      // ...filters,
      start_date: filters.start_date,
      end_date: filters.end_date,
      status: activeTab.toLowerCase(),
      format: format as 'pdf' | 'csv' | 'excel'
    });
  }, [activeTab, exportOrders, filters.start_date, filters.end_date]);



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

  // One request covers every order, so a bulk download is a single API call.
  const handleDownloadPackingDocument = useCallback((document: PackingDocument, orderNumbers: string[]) => {
    if (!orderNumbers.length || packingDocumentMutation.isPending) return;
    packingDocumentMutation.mutate({ document, orderNumbers });
  }, [packingDocumentMutation]);

  const handleCancelMultipleOrders = useCallback(() => {
    if (selectedRows.length === 0) return;
    // Only label-printed orders are cancelled with the courier; pending and dispatched ones are archived.
    const action = activeTab === 'printed' ? 'cancel' : 'archive';
    massOrderAction.mutate({ action, orderNumbers: selectedRows }, {
      onSuccess: (response: any) => {
        // The API reports per-order outcomes, so a 200 can still hide individual failures.
        const failures: { order_number: string; message?: string }[] = (response?.results || []).filter((result: any) => !result?.status);
        const listed = failures.slice(0, 2).map((failure) => `${failure.order_number}: ${failure.message || 'Failed'}`).join(' ');
        showToast(
          response?.message || `Successfully ${action === 'archive' ? 'archived' : 'cancelled'} ${selectedRows.length} order(s).`,
          failures.length ? "warning" : "success",
          failures.length > 2 ? `${listed} +${failures.length - 2} more` : listed || undefined,
          failures.length ? 8000 : undefined
        );
        // Leave the failed orders selected so they stay visible and can be retried.
        setSelectedRows(failures.map((failure) => failure.order_number));
        setShowCancelModal(false);
      },
      onError: (error: any) => {
        showToast(error?.message || `Failed to ${action} the selected orders.`, "error");
        setShowCancelModal(false);
      }
    });
  }, [selectedRows, activeTab, massOrderAction]);

  const handleCustomerEdit = useCallback((id: string) => {
    setAddressEditModal(id);
  }, []);

  const handleApplySelectedAddresses = useCallback(() => {
    const selected = (ordersData?.data || []).filter((order: Order) => selectedRows.includes(order.order_number));
    const updates = selected.flatMap((order: Order) => {
      const suggestion = order.address_suggestions?.[0];
      if (!suggestion) return [];
      return [{
        order_number: order.order_number,
        suburb: suggestion.suburb,
        state: suggestion.state,
        postcode: suggestion.postcode,
      }];
    });

    if (updates.length === 0) {
      showToast('Select orders that have a suggested suburb/postcode, or use Update on the row to edit the street.', 'error');
      return;
    }

    applyAddressValidation.mutate(updates, {
      onSuccess: (response) => {
        showToast(response.message || 'Addresses updated.', 'success');
        setSelectedRows([]);
      },
    });
  }, [ordersData?.data, selectedRows, applyAddressValidation]);

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
      // showToast(`Failed to download label for order ${orderId}.`, "error");
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
      return order?.courier_code?.toLowerCase() === 'auspost' || order?.courier_code?.toLowerCase() === 'startrack';
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

  const canPrintLabels = BULK_PRINT_ENABLED && canReadWrite && (!fromCustomer || isAdmin);

  // Printed labels leave the selection. Skipped and failed orders stay ticked so the
  // customer can fix them and retry, the same way Starshipit leaves problem orders selected.
  const handlePrintLabelsFinished = useCallback((printedOrderNumbers: string[]) => {
    const printed = new Set(printedOrderNumbers);
    setSelectedRows((current) => current.filter((orderNumber) => !printed.has(orderNumber)));
  }, []);

  const downloadingLabelId = downloadLabelMutation.isPending ? String(downloadLabelMutation.variables) : null;
  const updateToArchiveId = archiveOrderMutation.isPending ? String(archiveOrderMutation.variables) : null;

  const columns = useMemo(() => addressCheckerOpen
    ? getAddressCheckerColumns(role, handleCustomerEdit)
    : getOrdersColumns(
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
      printOrderMutation.isPending
        ? (printOrderMutation.variables && typeof printOrderMutation.variables === 'object' && 'order_number' in printOrderMutation.variables
          ? (printOrderMutation.variables as any).order_number
          : printOrderMutation.variables)
        : (walletLoading ? orderToPrint?.orderNumber : null),
      canReadWrite,
      requestRestore,
      restoringOrderId,
      handleDownloadPackingDocument
    ), [addressCheckerOpen, role, activeTab, navigate, handleCustomerEdit, handleCourierEdit, handleDownloadSingleLabel, handleCancelSingleOrderClick, downloadingLabelId, fromCustomer, handleArchiveOrder, updateToArchiveId, handlePrintClick, printOrderMutation.isPending, printOrderMutation.variables, walletLoading, orderToPrint?.orderNumber, canReadWrite, requestRestore, restoringOrderId, handleDownloadPackingDocument]);

  const invalidCount = ordersData?.meta?.total || 0;

  return (
    <div className={`${fromCustomer ? "p-0" : "p-page-padding"} flex-1 flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-y-auto`}>

      <div className='rounded-lg shadow-sm border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex-none h-auto'>
        {!fromCustomer && (
          <div className="flex flex-col gap-3 p-4 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-t-lg print:hidden">
            {/* Row 1: Filters & Search */}
            <div className="flex flex-wrap items-center gap-2.5 w-full">
              {/* Left Section (Filters & Search) */}
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto sm:flex-1">
                {/* Search & Date Filter Group */}
                <div className="flex items-center gap-2 w-full sm:w-auto flex-1 sm:flex-initial">
                  <div className="flex-1 sm:w-64 md:w-72">
                    <FormInput
                      placeholder="Search orders..."
                      value={search}
                      onChange={handleSearch}
                      icon={Search}
                      className="w-full h-8"
                    />
                  </div>
                  <div className="flex-1 sm:w-60 md:w-64">
                    <DateFilter
                      value={dateRange}
                      onChange={setDateRange}
                      className="w-full h-8"
                    />
                  </div>
                </div>

                {/* Customer Select (Admin Only) */}
                {isAdmin && (
                  <div className="w-full sm:w-60 md:w-64 flex-none sm:flex-initial">
                    <FormSelect
                      placeholder="Select Customer"
                      value={selectedCustomer || ''}
                      onValueChange={(val) => {
                        const customer = customersData?.data?.find((c: any) => c.id.toString() === val);
                        if (customer) {
                          setSelectedCustomer(customer.id.toString());
                        } else {
                          setSelectedCustomer(undefined);
                        }
                      }}
                      options={customersData?.data?.map((c: any) => ({
                        value: c.id.toString(),
                        label: `${c.first_name} ${c.last_name} (${c.email})`
                      })) || []}
                      selectClassName="h-8"
                    />
                  </div>
                )}
              </div>

              {/* Actions Row (Page Size, Export, Import, Create Order) */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
                {/* Page Size Selector */}
                <div className="flex items-center gap-1.5 h-8 shrink-0">
                  <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Show:</span>
                  <FormSelect
                    className="w-[80px]"
                    selectClassName="h-8 text-xs font-bold"
                    value={pageSize.toString()}
                    onValueChange={(value) => value && handlePageSizeChange(Number(value))}
                    options={DEFAULT_PAGE_SIZES}
                    placeholder="Select Page Size"
                    allowClear={false}
                    searchdisable
                  />
                </div>

                {canReadWrite && (
                  <>
                    {/* Export */}
                    <DropdownCustomMenu
                      menus={[
                        {
                          label: "Print",
                          onClick: () => window.print(),
                          icon: Printer,
                        },
                        {
                          label: "CSV",
                          onClick: () => handleExport('csv'),
                          icon: File,
                        },
                        {
                          label: "Excel",
                          onClick: () => handleExport('excel'),
                          icon: Upload,
                        },
                        {
                          label: "PDF",
                          onClick: () => handleExport('pdf'),
                          icon: FileText,
                        },
                      ]}
                    >
                      <Button
                        variant="outline"
                        className="h-8 px-2.5 sm:px-3 gap-1.5 sm:gap-2 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 font-medium text-slate-700 dark:text-zinc-300 transition-colors shrink-0"
                        disabled={exportOrders.isPending}
                      >
                        {exportOrders.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        <span className="hidden sm:inline">Export</span>
                      </Button>
                    </DropdownCustomMenu>

                    {/* Import */}
                    {!isAdmin && (
                      <Button
                        variant="outline"
                        className="h-8 px-2.5 sm:px-3 gap-1.5 sm:gap-2 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 font-medium text-slate-700 dark:text-zinc-300 transition-colors shrink-0"
                        onClick={() => setIsImportDialogOpen(true)}
                        disabled={importOrders.isPending}
                      >
                        {importOrders.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        <span className="hidden sm:inline">Import</span>
                      </Button>
                    )}

                    {activeTab === 'new' && (
                      <Button
                        variant="outline"
                        className="h-8 px-2.5 sm:px-3 gap-1.5 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 font-medium text-slate-700 dark:text-zinc-300 transition-colors shrink-0"
                        onClick={() => {
                          setAddressCheckerOpen(true);
                          setSelectedRows([]);
                          setPage(1);
                        }}
                      >
                        <Zap className="w-4 h-4 text-sky-500" />
                        <span className="hidden sm:inline">Check addresses</span>
                      </Button>
                    )}

                    {/* Create Order */}
                    {isAdmin ? (
                      <div className="flex-1 sm:flex-initial min-w-[90px] sm:min-w-0">
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
                            className="h-8 w-full px-3 sm:px-4 gap-1.5 sm:gap-2 bg-primary hover:bg-primary-hover text-white shadow-sm transition-all active:scale-[0.98] font-semibold border-none flex items-center justify-center shrink-0"
                          >
                            <span className="hidden sm:inline">Create Order</span>
                            <span className="inline sm:hidden">Create</span>
                            <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
                          </Button>
                        </DropdownCustomMenu>
                      </div>
                    ) : (
                      <Button
                        className="h-8 px-3 sm:px-4 gap-1.5 sm:gap-2 bg-primary hover:bg-primary-hover text-white shadow-sm transition-all active:scale-[0.98] font-semibold border-none flex-1 sm:flex-none flex items-center justify-center shrink-0"
                        onClick={() => navigate(`${role === 'admin' ? '/admin' : ''}/orders/create`)}
                      >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Create Order</span>
                        <span className="inline sm:hidden">Create</span>
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Bulk Actions (Shown only when rows are selected) */}
            {selectedRows.length > 0 && (
              <div className="flex items-center justify-between gap-2.5 p-1.5 px-3 bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-lg w-full transition-all">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-semibold text-primary dark:text-primary-foreground/90">
                    <span className="hidden sm:inline">{selectedRows.length} {selectedRows.length === 1 ? 'order' : 'orders'} selected</span>
                    <span className="inline sm:hidden">{selectedRows.length} selected</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-1.5 shrink-0">
                  {addressCheckerOpen && selectedRows.length > 0 && (
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 px-2.5 sm:px-3 gap-1.5 bg-primary hover:bg-primary-hover text-white font-semibold"
                      onClick={handleApplySelectedAddresses}
                      disabled={applyAddressValidation.isPending}
                    >
                      {applyAddressValidation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Update ({selectedRows.length})
                    </Button>
                  )}
                  {canPrintLabels && (activeTab === 'new' || activeTab === 'printed') && !addressCheckerOpen && (
                    <BulkPrintAction
                      selectedOrderNumbers={selectedRows}
                      onFinished={handlePrintLabelsFinished}
                      disabled={massOrderAction.isPending}
                    />
                  )}
                  {/* {activeTab === 'new' && (
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 px-2.5 sm:px-3 gap-1.5 bg-primary hover:bg-primary-hover text-white transition-colors font-semibold shadow-sm"
                      onClick={handleDownloadMultipleLabels}
                      disabled={isDownloadingLabels || isCancellingOrders}
                    >
                      {isDownloadingLabels ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
                      <span className="hidden sm:inline">Print bulk Labels</span>
                    </Button>
                  )} */}
                  {activeTab === 'printed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2.5 sm:px-3 gap-1.5 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors font-semibold"
                      onClick={handleManifestOrders}
                      disabled={createAuspostManifestMutation.isPending}
                    >
                      {createAuspostManifestMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-500" />}
                      <span className="hidden sm:inline">Manifest</span>
                    </Button>
                  )}

                  {activeTab !== 'archived' && (
                    <DropdownCustomMenu
                      contentClassName="w-52"
                      menus={[
                        {
                          label: 'Print packing slip',
                          onClick: () => handleDownloadPackingDocument('packing-slip', selectedRows),
                        },
                        {
                          label: 'Print packing summary',
                          onClick: () => handleDownloadPackingDocument('packing-summary', selectedRows),
                        },
                      ]}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2.5 sm:px-3 gap-1.5 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors font-semibold"
                        disabled={packingDocumentMutation.isPending}
                      >
                        {packingDocumentMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                        <span className="hidden sm:inline">Packing</span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownCustomMenu>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2.5 sm:px-3 gap-1.5 border-red-200 dark:border-red-950/30 hover:border-red-300 hover:bg-red-50/50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 transition-colors font-semibold"
                    onClick={() => setShowCancelModal(true)}
                    disabled={massOrderAction.isPending}
                  >
                    {massOrderAction.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    <span className="hidden sm:inline">{activeTab === 'new' ? 'Delete' : 'Cancel'}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 text-xs font-semibold gap-1"
                    onClick={() => setSelectedRows([])}
                  >
                    <X className="w-4 h-4 sm:hidden" />
                    <span className="hidden sm:inline">Clear</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {addressCheckerOpen && (
          <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-gray-100 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/40">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-zinc-200">
                Invalid
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">
                {invalidCount} {invalidCount === 1 ? 'order needs' : 'orders need'} attention
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 font-semibold"
              onClick={() => {
                setAddressCheckerOpen(false);
                setSelectedRows([]);
                setPage(1);
              }}
            >
              <X className="w-4 h-4" />
              Close address checker
            </Button>
          </div>
        )}

        <DataTable
          columns={columns}
          data={ordersData?.data || []}
          rowKey="order_number"
          moduleName='order'
          loading={isLoading}
          searchPlaceholder="Search orders..."
          onSearchChange={handleSearch}
          searchValue={search}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          headerClass="h-20"
          className='pb-3 flex-none h-auto [&_div.overflow-auto]:flex-none [&_div.overflow-auto]:h-auto [&_div.overflow-auto]:min-h-0 [&_div.overflow-auto]:overflow-y-visible [&_div.overflow-auto]:overflow-x-auto'
          totalItems={ordersData?.meta?.total || 0}
          currentPage={page}
          onPageChange={setPage}
          onExport={handleExport}
          isExporting={exportOrders.isPending}
          selectable={activeTab !== 'archived' && canReadWrite}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          selectOnRowClick
          exportable={!fromCustomer && canReadWrite}
          header={!!fromCustomer}
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
            loading={massOrderAction.isPending}
          />
        )
      }
      {
        orderToCancel && (
          <ConformationModal
            open={!!orderToCancel}
            onOpenChange={(open) => !open && setOrderToCancel(null)}
            title={activeTab === 'printed' || activeTab === 'shipped' ? "Cancel Order" : "Archive Order"}
            description={activeTab === 'printed' || activeTab === 'shipped'
              ? `Are you sure you want to cancel order ${orderToCancel}? This action cannot be undone.`
              : `Are you sure you want to archive order ${orderToCancel}? This action cannot be undone.`}
            onConfirm={async () => {
              setIsCancellingOrders(true);
              try {
                await cancelOrderMutation.mutateAsync({ orderId: orderToCancel, data: { manually: false } });
                showToast(
                  activeTab === 'printed' || activeTab === 'shipped'
                    ? `Order ${orderToCancel} cancelled successfully.` : `Order ${orderToCancel} archived successfully.`,
                  "success"
                );
              } catch (err: any) {
                showToast(
                  err?.response?.data?.message ||
                  (activeTab === 'printed' || activeTab === 'shipped'
                    ? `Failed to cancel order ${orderToCancel}.` : `Failed to archive order ${orderToCancel}.`),
                  "error"
                );
              } finally {
                setIsCancellingOrders(false);
                setOrderToCancel(null);
              }
            }}
            confirmText={activeTab === 'printed' || activeTab === 'shipped' ? "Yes, Cancel" : "Yes, Archive"}
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
      {restoreModal}
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
      {showCarrierConfirm && (
        <ConformationModal
          open={showCarrierConfirm}
          onOpenChange={setShowCarrierConfirm}
          title="Confirm carrier"
          description={
            <div className="space-y-4 pt-2">
              <p className="text-sm text-slate-600 dark:text-zinc-400">
                You're about to create this shipment using your connected <strong className="font-bold text-slate-800 dark:text-zinc-200">{getDisplayCourierName(carrierConfirmData?.courier)}</strong> account.
              </p>
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Shipping charges will be billed according to your {getDisplayCourierName(carrierConfirmData?.courier)} account and contract setup.
              </p>
            </div>
          }
          onConfirm={() => {
            setShowCarrierConfirm(false);
            if (carrierConfirmData) {
              executePrint(carrierConfirmData.orderNumber, carrierConfirmData.canConsign);
            }
          }}
          confirmText={`Continue`}
          cancelText="Cancel"
          className='sm:max-w-[500px]'
        />
      )}
      {showReceiverPhoneModal && (
        <CustomModel
          open={showReceiverPhoneModal}
          onOpenChange={setShowReceiverPhoneModal}
          title="Receiver Phone Number Required"
          description="A contact number for the receiver is required to book this consignment."
          onSubmit={() => {
            if (!receiverPhoneInput.trim() || !isPhoneValid(receiverPhoneInput)) {
              showToast(PHONE_ERROR_MESSAGE, "error");
              return;
            }
            setShowReceiverPhoneModal(false);
            if (phoneModalData) {
              executePrint(phoneModalData.orderNumber, phoneModalData.canConsign, receiverPhoneInput);
            }
          }}
          submitText="Print Order"
          cancelText="Cancel"
          contentClass="sm:max-w-[450px]"
          isLoading={printOrderMutation.isPending}
        >
          <div className="p-4 space-y-4">
            <FormInput
              label="Receiver Phone Number"
              value={receiverPhoneInput}
              onChange={(val) => setReceiverPhoneInput(val)}
              placeholder="e.g. 0412345678"
              required
              isFullWidth
              error={receiverPhoneInput.trim() !== '' && !isPhoneValid(receiverPhoneInput)}
              errormsg={PHONE_ERROR_MESSAGE}
            />
          </div>
        </CustomModel>
      )}
    </div>
  );
}
