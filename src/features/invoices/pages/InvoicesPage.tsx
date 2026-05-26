import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/store.hooks';
import { InvoiceStats } from '../components/InvoiceStats';
import { InvoiceFilters } from '../components/InvoiceFilters';
import { InvoiceTable } from '../components/InvoiceTable';
import { useAdminInvoices, useCustomerInvoices, useExportAdminInvoices, useExportCustomerInvoices, useDeleteAdminInvoice, useRemindAdminInvoice } from '../hooks/useInvoices';
import { ConformationModal } from '@/components/common/ConformationModal';

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [invoiceToDelete, setInvoiceToDelete] = useState<number | null>(null);

  const { role } = useAppSelector((state) => state.auth);
  const isAdmin = useMemo(() => role === 'admin', [role]);
  const navigate = useNavigate();

  // Connect to API hooks
  const { data: adminData, isLoading: isAdminLoading } = useAdminInvoices({
    search: searchTerm || undefined,
    page: page,
    per_page: pageSize,
    customer: selectedCustomer || undefined,
  }, isAdmin);

  const { data: customerData, isLoading: isCustomerLoading } = useCustomerInvoices({
    search: searchTerm || undefined,
    page: page,
    per_page: pageSize,
  }, !isAdmin);

  const deleteMutation = useDeleteAdminInvoice();
  const remindMutation = useRemindAdminInvoice();

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
      adminExportMutation.mutate({ format, search: searchTerm || undefined, customer: selectedCustomer || undefined });
    } else {
      customerExportMutation.mutate({ format, search: searchTerm || undefined });
    }
  }, [isAdmin, adminExportMutation, customerExportMutation, searchTerm, selectedCustomer]);

  // Transform the API summary object to match InvoiceStats expected props
  // const stats = data?.summary ? {
  //   total_invoices: data.summary.total_invoice,
  //   invoice_pending: data.summary.invoice_pending,
  //   invoice_partial: data.summary.invoice_partial,
  //   invoice_paid: data.summary.invoice_paid,
  //   amount_pending: data.summary.amount_pending,
  //   amount_paid: data.summary.amount_paid,
  // } : undefined;

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
        {isAdmin && <InvoiceFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          pageSize={pageSize.toString()}
          onPageSizeChange={handlePageSizeChange}
          isAdmin={isAdmin}
          selectedCustomer={selectedCustomer}
          onCustomerChange={handleCustomerChange}
        />}

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
          isAdmin={isAdmin}
        />
      </div>

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
    </div>
  );
}
