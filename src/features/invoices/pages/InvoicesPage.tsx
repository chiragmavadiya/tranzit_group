import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Plus } from 'lucide-react';
// import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/hooks/store.hooks';
import { InvoiceStats } from '../components/InvoiceStats';
import { InvoiceFilters } from '../components/InvoiceFilters';
import { InvoiceTable } from '../components/InvoiceTable';
import { CreateInvoiceDialog } from '../components/CreateInvoiceDialog';
import { MOCK_INVOICES } from '../constants';
import type { InvoiceStats as InvoiceStatsType } from '../types';

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState('25');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const { role } = useAppSelector((state) => state.auth);
  const isAdmin = useMemo(() => role === 'admin', [role]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const stats: InvoiceStatsType = useMemo(() => ({
    total_invoices: 8,
    invoice_pending: 3,
    invoice_partial: 4,
    invoice_paid: 1,
    amount_pending: 2387.46,
    amount_paid: 1561.00,
  }), []);

  const filteredInvoices = useMemo(() => {
    return MOCK_INVOICES.filter(invoice => {
      const matchesSearch =
        invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCustomer = selectedCustomer === 'all' ||
        invoice.user.name.toLowerCase().includes(selectedCustomer.toLowerCase());

      return matchesSearch && matchesCustomer;
    });
  }, [searchTerm, selectedCustomer]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handlePageSizeChange = useCallback((value: string | null) => {
    if (value) setPageSize(value);
  }, []);

  const handleCustomerChange = useCallback((value: string | null) => {
    setSelectedCustomer(value || '');
  }, []);

  // const handleAddInvoice = useCallback(() => {
  //   setIsDialogOpen(true);
  // }, []);

  const handleInvoiceCreate = useCallback((data: any) => {
    console.log('Invoice Created:', data);
    setIsDialogOpen(false);
  }, []);

  const handleView = useCallback((invoiceNumber: string) => {
    const path = isAdmin ? `/admin/invoices/${invoiceNumber}` : `/invoices/${invoiceNumber}`;
    navigate(path);
  }, [isAdmin, navigate]);


  return (
    <div className="flex flex-col flex-1 gap-2 p-page-padding min-h-0 bg-slate-50/30 dark:bg-zinc-950/30">

      {/* Stats Cards */}
      <InvoiceStats stats={stats} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-0">
        {isAdmin && <InvoiceFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          isAdmin={isAdmin}
          selectedCustomer={selectedCustomer}
          onCustomerChange={handleCustomerChange}
        />}

        <InvoiceTable
          invoices={filteredInvoices}
          onEdit={(id) => console.log('Edit', id)}
          onDelete={(id) => console.log('Delete', id)}
          onView={handleView}
          onSend={(id) => console.log('Send', id)}
          isAdmin={isAdmin}
        />
      </div>

      <CreateInvoiceDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleInvoiceCreate}
      />
    </div>
  );
}
