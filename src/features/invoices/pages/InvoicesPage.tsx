import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useAppSelector } from '@/hooks/store.hooks';
import { useDebounce } from '@/hooks/useDebounce';
import { InvoiceStats } from '../components/InvoiceStats';
import { InvoiceFilters } from '../components/InvoiceFilters';
import { InvoiceTable } from '../components/InvoiceTable';
import { useAdminInvoices, useCustomerInvoices, useExportAdminInvoices, useExportCustomerInvoices, useDeleteAdminInvoice, useRemindAdminInvoice, useDownloadAdminInvoice, useDownloadCustomerInvoice } from '../hooks/useInvoices';
import { ConformationModal } from '@/components/common/ConformationModal';

export default function InvoicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState('');
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

  const formatUrlDate = useCallback((date?: Date) => {
    return date ? format(date, 'dd-MM-yyyy') : undefined;
  }, []);

  const formatDate = useCallback((date?: Date) => {
    return date ? format(date, 'dd/MM/yyyy') : undefined;
  }, []);

  const initialStartDate = useMemo(() => {
    const s = searchParams.get('start_date');
    return s ? parseLocalDate(s) : undefined;
  }, [searchParams, parseLocalDate]);

  const initialEndDate = useMemo(() => {
    const e = searchParams.get('end_date');
    return e ? parseLocalDate(e) : undefined;
  }, [searchParams, parseLocalDate]);

  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>(() => [initialStartDate, initialEndDate]);
  const [appliedDateRange, setAppliedDateRange] = useState<[Date | undefined, Date | undefined]>(() => [initialStartDate, initialEndDate]);

  // Synchronize date range filters with URL searchParams
  useEffect(() => {
    setSearchParams((prev) => {
      let hasChanged = false;

      const currentStartDate = prev.get('start_date') || undefined;
      const newStartDate = formatUrlDate(appliedDateRange[0]);
      if (currentStartDate !== newStartDate) {
        if (newStartDate) {
          prev.set('start_date', newStartDate);
        } else {
          prev.delete('start_date');
        }
        hasChanged = true;
      }

      const currentEndDate = prev.get('end_date') || undefined;
      const newEndDate = formatUrlDate(appliedDateRange[1]);
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
  }, [appliedDateRange, setSearchParams, formatUrlDate]);

  const handleApplyFilters = useCallback(() => {
    setAppliedDateRange(dateRange);
    setPage(1);
  }, [dateRange]);

  const handleClearFilters = useCallback(() => {
    setDateRange([undefined, undefined]);
    setAppliedDateRange([undefined, undefined]);
    setPage(1);
  }, []);

  // Connect to API hooks
  const { data: adminData, isLoading: isAdminLoading } = useAdminInvoices({
    search: debouncedSearchTerm || undefined,
    page: page,
    per_page: pageSize,
    customer: selectedCustomer || undefined,
    date_from: formatDate(appliedDateRange[0]),
    date_to: formatDate(appliedDateRange[1]),
  }, isAdmin);

  const { data: customerData, isLoading: isCustomerLoading } = useCustomerInvoices({
    search: debouncedSearchTerm || undefined,
    page: page,
    per_page: pageSize,
    date_from: formatDate(appliedDateRange[0]),
    date_to: formatDate(appliedDateRange[1]),
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
        date_from: formatDate(appliedDateRange[0]),
        date_to: formatDate(appliedDateRange[1]),
      });
    } else {
      customerExportMutation.mutate({
        format,
        search: debouncedSearchTerm || undefined,
        date_from: formatDate(appliedDateRange[0]),
        date_to: formatDate(appliedDateRange[1]),
      });
    }
  }, [isAdmin, adminExportMutation, customerExportMutation, debouncedSearchTerm, selectedCustomer, appliedDateRange, formatDate]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page on search
  }, []);

  const handlePageSizeChange = useCallback((value: string | number | null) => {
    if (value) {
      setPageSize(Number(value));
      setPage(1); // Reset to first page on page size change
    }
  }, []);

  const handleCustomerChange = useCallback((value: string | null) => {
    setSelectedCustomer(value || '');
    setPage(1);
  }, []);

  const handleView = useCallback((invoiceNumber: string) => {
    const path = isAdmin ? `/admin/invoices/${invoiceNumber}` : `/invoices/${invoiceNumber}`;
    navigate(path);
  }, [isAdmin, navigate]);

  return (
    <div className="flex flex-col flex-1 gap-4 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30">

      {/* Stats Cards */}
      <InvoiceStats stats={data?.summary} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-0">
        <InvoiceFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          pageSize={pageSize.toString()}
          onPageSizeChange={handlePageSizeChange}
          isAdmin={isAdmin}
          selectedCustomer={selectedCustomer}
          onCustomerChange={handleCustomerChange}
          startDate={dateRange[0]}
          endDate={dateRange[1]}
          onStartDateChange={(d) => setDateRange(prev => [d, prev[1]])}
          onEndDateChange={(d) => setDateRange(prev => [prev[0], d])}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
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
