import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format, parse, isValid } from 'date-fns';
import { useAppSelector } from '@/hooks/store.hooks';
import { useDebounce } from '@/hooks/useDebounce';
import { InvoiceStats } from '../components/InvoiceStats';
import { InvoiceFilters } from '../components/InvoiceFilters';
import { InvoiceTable } from '../components/InvoiceTable';
import { useAdminInvoices, useCustomerInvoices, useExportAdminInvoices, useExportCustomerInvoices, useDeleteAdminInvoice, useRemindAdminInvoice, useDownloadAdminInvoice, useDownloadCustomerInvoice } from '../hooks/useInvoices';
import { ConformationModal } from '@/components/common/ConformationModal';
import type { DateFilterValue } from '@/components/common/DateFilter/types';
import { hydrateDateFilter } from '@/components/common/DateFilter/utils';
import useLocalStorage from '@/hooks/useLocalStorage';

export default function InvoicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useLocalStorage<string>('invoice_search', '');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [pageSize, setPageSize] = useLocalStorage<number>('invoice_page_size', 25);
  const [page, setPage] = useLocalStorage<number>('invoice_page', 1);
  const [selectedCustomer, setSelectedCustomer] = useLocalStorage<string>('invoice_selected_customer', '');
  const [selectedStatus, setSelectedStatus] = useLocalStorage<string>('invoice_selected_status', '');
  const [invoiceToDelete, setInvoiceToDelete] = useState<number | null>(null);

  const { role } = useAppSelector((state) => state.auth);
  const isAdmin = useMemo(() => role === 'admin', [role]);
  const navigate = useNavigate();

  // Helper date parsing and formatting methods matching ReportsPage reference
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

  const initialDateFilter = useMemo<DateFilterValue>(() => {
    const sDate = parseLocalDate(searchParams.get('start_date'));
    const eDate = parseLocalDate(searchParams.get('end_date'));
    if (sDate && eDate) {
      return {
        type: 'custom',
        from: format(sDate, 'dd/MM/yyyy'),
        to: format(eDate, 'dd/MM/yyyy'),
        label: `${format(sDate, 'dd MMM yyyy')} - ${format(eDate, 'dd MMM yyyy')}`,
      };
    }
    return {
      type: 'custom',
      from: '',
      to: '',
      label: 'All Time',
    };
  }, [searchParams, parseLocalDate]);

  const [dateRange, setDateRange] = useLocalStorage<DateFilterValue>('invoice_date_range', initialDateFilter, hydrateDateFilter);

  // Synchronize date range filters from URL searchParams (e.g. Dashboard redirect)
  useEffect(() => {
    const sDate = parseLocalDate(searchParams.get('start_date'));
    const eDate = parseLocalDate(searchParams.get('end_date'));
    if (sDate && eDate) {
      const fromStr = format(sDate, 'dd/MM/yyyy');
      const toStr = format(eDate, 'dd/MM/yyyy');

      if (dateRange.from !== fromStr || dateRange.to !== toStr) {
        setDateRange({
          type: 'custom',
          from: fromStr,
          to: toStr,
          label: `${format(sDate, 'dd MMM yyyy')} - ${format(eDate, 'dd MMM yyyy')}`,
        });
      }
    }
  }, [searchParams, parseLocalDate]);

  useEffect(() => {
    setSearchParams((prev) => {
      let hasChanged = false;

      const currentStartDate = prev.get('start_date') || undefined;
      let newStartDate: string | undefined;
      if (dateRange.from) {
        const parsedFrom = parse(dateRange.from, 'dd/MM/yyyy', new Date());
        if (isValid(parsedFrom)) {
          newStartDate = format(parsedFrom, 'dd-MM-yyyy');
        }
      }

      if (currentStartDate !== newStartDate) {
        if (newStartDate) {
          prev.set('start_date', newStartDate);
        } else {
          prev.delete('start_date');
        }
        hasChanged = true;
      }

      const currentEndDate = prev.get('end_date') || undefined;
      let newEndDate: string | undefined;
      if (dateRange.to) {
        const parsedTo = parse(dateRange.to, 'dd/MM/yyyy', new Date());
        if (isValid(parsedTo)) {
          newEndDate = format(parsedTo, 'dd-MM-yyyy');
        }
      }

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
  }, [dateRange, setSearchParams]);

  // Connect to API hooks
  const { data: adminData, isLoading: isAdminLoading } = useAdminInvoices({
    search: debouncedSearchTerm || undefined,
    page: page,
    per_page: pageSize,
    customer: selectedCustomer || undefined,
    status: selectedStatus || undefined,
    date_from: dateRange.from || undefined,
    date_to: dateRange.to || undefined,
  }, isAdmin);

  const { data: customerData, isLoading: isCustomerLoading } = useCustomerInvoices({
    search: debouncedSearchTerm || undefined,
    page: page,
    per_page: pageSize,
    date_from: dateRange.from || undefined,
    date_to: dateRange.to || undefined,
  }, !isAdmin);

  const deleteMutation = useDeleteAdminInvoice();
  const remindMutation = useRemindAdminInvoice();
  const downloadAdminMutation = useDownloadAdminInvoice();
  const downloadCustomerMutation = useDownloadCustomerInvoice();
  const downloadMutation = isAdmin ? downloadAdminMutation : downloadCustomerMutation;

  const handleDownload = useCallback((id: number) => {
    downloadMutation.mutate(id);
  }, [downloadMutation]);

  const downloadingId = downloadMutation.isPending ? (downloadMutation.variables as number) : null;

  const data = isAdmin ? adminData : customerData;
  const isLoading = isAdmin ? isAdminLoading : isCustomerLoading;

  const adminExportMutation = useExportAdminInvoices();
  const customerExportMutation = useExportCustomerInvoices();
  const exportMutation = isAdmin ? adminExportMutation : customerExportMutation;

  const handleDelete = useCallback((id: number) => {
    setInvoiceToDelete(id);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (invoiceToDelete !== null) {
      deleteMutation.mutate(invoiceToDelete, {
        onSuccess: () => {
          setInvoiceToDelete(null);
        }
      });
    }
  }, [invoiceToDelete, deleteMutation]);

  const handleExport = useCallback((format: string) => {
    if (isAdmin) {
      adminExportMutation.mutate({
        format,
        search: debouncedSearchTerm || undefined,
        customer: selectedCustomer || undefined,
        status: selectedStatus || undefined,
        date_from: dateRange.from || undefined,
        date_to: dateRange.to || undefined,
      });
    } else {
      customerExportMutation.mutate({
        format,
        search: debouncedSearchTerm || undefined,
        date_from: dateRange.from || undefined,
        date_to: dateRange.to || undefined,
      });
    }
  }, [isAdmin, adminExportMutation, customerExportMutation, debouncedSearchTerm, selectedCustomer, selectedStatus, dateRange]);

  const handleDateRangeChange = useCallback((value: DateFilterValue) => {
    setPage(1);
    setDateRange(value);
  }, [setPage, setDateRange]);

  const handleSearchChange = useCallback((value: string) => {
    setPage(1);
    setSearchTerm(value);
  }, [setPage, setSearchTerm]);

  const handlePageSizeChange = useCallback((value: string | number | null) => {
    if (value) {
      setPage(1);
      setPageSize(Number(value));
    }
  }, [setPage, setPageSize]);

  const handleCustomerChange = useCallback((value: string | null) => {
    setPage(1);
    setSelectedCustomer(value || '');
  }, [setPage, setSelectedCustomer]);

  const handleStatusChange = useCallback((value: string | null) => {
    setPage(1);
    setSelectedStatus(value || '');
  }, [setPage, setSelectedStatus]);

  const handleView = useCallback((invoiceNumber: string) => {
    const path = isAdmin ? `/admin/invoices/${invoiceNumber}` : `/invoices/${invoiceNumber}`;
    navigate(path);
  }, [isAdmin, navigate]);

  return (
    <div className="flex flex-col flex-1 gap-4 p-page-padding animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">

      {/* Stats Cards */}
      <InvoiceStats stats={data?.summary} />

      {/* Main Content Area */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-0 flex-none h-auto">
        <InvoiceFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          pageSize={pageSize.toString()}
          onPageSizeChange={handlePageSizeChange}
          isAdmin={isAdmin}
          selectedCustomer={selectedCustomer}
          onCustomerChange={handleCustomerChange}
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
        />

        <InvoiceTable
          invoices={data?.data || []}
          loading={isLoading}
          totalItems={data?.meta?.total || 0}
          currentPage={page}
          pageSize={pageSize}
          search={searchTerm}
          onPageChange={setPage}
          onPageSizeChange={(size) => handlePageSizeChange(size)}
          onSearchChange={handleSearchChange}
          onExport={handleExport}
          isExporting={exportMutation.isPending}
          onEdit={(id) => navigate(`${isAdmin ? '/admin' : ''}/invoices/${id}`)}
          onDelete={handleDelete}
          onView={handleView}
          onSend={(id) => remindMutation.mutate(id)}
          onDownload={handleDownload}
          downloadingId={downloadingId}
          isAdmin={isAdmin}
        />
      </div>
      {invoiceToDelete !== null && (
        <ConformationModal
          open={invoiceToDelete !== null}
          onOpenChange={(open) => !open && setInvoiceToDelete(null)}
          title="Delete Invoice"
          description="Are you sure you want to delete this invoice? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          confirmText="Delete"
          confirmVariant="destructive"
          loading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
