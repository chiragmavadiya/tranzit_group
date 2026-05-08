import { useCallback, useMemo } from 'react';
import { Pencil, Trash2, Eye, Bell, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Invoice } from '../types';
import { INVOICE_STATUS_COLORS } from '../constants';
import { cn } from '@/lib/utils';
import { CustomTooltip } from '@/components/common/CustomTooltip';
import { DataTable } from '@/components/common/DataTable';
import type { Column } from '@/components/common/types/DataTable.types';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/store.hooks';

interface InvoiceTableProps {
  invoices: Invoice[];
  loading?: boolean;
  isAdmin?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (invoiceNumber: string) => void;
  onSend?: (id: number) => void;
  totalItems?: number;
  currentPage?: number;
  pageSize?: number;
  search?: string;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSearchChange?: (search: string) => void;
  onExport?: (format: string) => void;
  isExporting?: boolean;
}

export function InvoiceTable({
  invoices, loading, isAdmin, onEdit, onDelete, onView, onSend,
  totalItems = 0, currentPage = 1, pageSize = 10, search = '',
  onPageChange, onPageSizeChange, onSearchChange, onExport, isExporting
}: InvoiceTableProps) {
  const { role } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }, []);

  const onAddInvoice = () => {
    // redirect to /createpage
    navigate('/admin/invoices/create');
  }

  const renderStatus = useCallback((status: Invoice['status']) => {
    return (
      <Badge className={cn("px-3 py-0.5 rounded-md font-medium border-none shadow-none", INVOICE_STATUS_COLORS[status as keyof typeof INVOICE_STATUS_COLORS])}>
        {status}
      </Badge>
    );
  }, []);

  const columns = useMemo<Column<Invoice>[]>(() => [
    {
      accessor: 'id',
      key: 'id',
      header: 'Invoice #',
      sticky: 'left',
      cell: (value, row) => (
        <NavLink to={`${isAdmin ? '/admin' : ''}/invoices/${row.id}`} className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
          {value}
        </NavLink>
      )
    },
    {
      accessor: 'zoho_invoice_number',
      key: 'zoho_invoice_number',
      header: 'Zoho Invoice #',
      // cell: (value) => (
      //   <div className="text-gray-400">
      //     {value || '-'}
      //   </div>
      // )
    },
    {
      accessor: 'status',
      key: 'status',
      header: 'Status',
      cell: (value) => (
        renderStatus(value)
      )
    },
    {
      accessor: 'user',
      key: 'user',
      header: 'Customer',
      cell: (_, row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 dark:text-zinc-200">{row.customer_full_name || row.user?.name}</span>
          <span className="text-xs text-gray-500 dark:text-zinc-400">{row.customer_email || row.user?.email}</span>
        </div>
      )
    },
    {
      accessor: 'amount',
      key: 'amount',
      header: 'Total',
      cell: (_, row) => (
        <div className="text-right font-medium text-gray-700 dark:text-zinc-300">
          {formatCurrency(Number(row.total ?? row.amount ?? 0))}
        </div>
      )
    },
    {
      accessor: 'invoice_date',
      key: 'invoice_date',
      header: 'Issued Date',
      cell: (_, row) => (
        <div className="text-gray-500 dark:text-zinc-400 whitespace-nowrap">
          {row.issue_date || row.invoice_date}
        </div>
      )
    },
    {
      accessor: 'amount_paid',
      key: 'amount_paid',
      header: 'Till Date Paid',
      cell: (_, row) => {
        const val = Number(row.till_date_paid ?? row.amount_paid ?? 0);
        return (
          <div className={cn("text-right font-medium", val > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400")}>
            {formatCurrency(val)}
          </div>
        );
      }
    },
    {
      accessor: 'balance',
      key: 'balance',
      header: 'Remaining Balance',
      cell: (_, row) => {
        const val = Number(row.remaining_balance ?? row.balance ?? 0);
        return (
          <div className={cn("text-right font-medium", val > 0 ? "text-rose-600 dark:text-rose-400" : "text-gray-400")}>
            {formatCurrency(val)}
          </div>
        );
      }
    },
    {
      accessor: 'actions',
      key: 'actions',
      header: 'Action',
      sticky: 'right',
      cell: (_, row) => {
        const rowStatus = row.status.toUpperCase();
        const isCustomer = role === 'customer';

        if (isCustomer) {
          return (
            <div className="flex items-center gap-2">
              <CustomTooltip title="View invoice" placement="bottom">
                <Button variant="ghost" size="sm" className="p-0 hover:text-blue-500 bg-transparent hover:bg-transparent dark:hover:bg-transparent" onClick={() => onView?.(row.invoice_number)}>
                  <Eye className="w-4 h-4" />
                </Button>
              </CustomTooltip>
            </div>
          );
        }

        // Admin rules
        const showPreview = rowStatus === 'PAID';
        const showEdit = ['SEND', 'DRAFT', 'OVERDUE', 'PARTIAL', 'UNPAID'].includes(rowStatus);
        const showReminder = ['SEND', 'OVERDUE'].includes(rowStatus);
        const disableReminder = ['DRAFT', 'PARTIAL', 'UNPAID'].includes(rowStatus);
        const showDelete = ['DRAFT', 'OVERDUE', 'PARTIAL', 'UNPAID'].includes(rowStatus);

        return (
          <div className="flex items-center gap-2">
            {showPreview && (
              <CustomTooltip title="View invoice" placement="bottom">
                <Button variant="ghost" size="sm" className="p-0 hover:text-blue-500 bg-transparent hover:bg-transparent dark:hover:bg-transparent" onClick={() => onView?.(row.invoice_number)}>
                  <Eye className="w-4 h-4" />
                </Button>
              </CustomTooltip>
            )}

            {showEdit && (
              <CustomTooltip title="Edit invoice" placement="bottom">
                <Button variant="ghost" size="sm" className="p-0 hover:text-blue-500 bg-transparent hover:bg-transparent dark:hover:bg-transparent" onClick={() => onEdit?.(row.id)}>
                  <Pencil className="w-4 h-4" />
                </Button>
              </CustomTooltip>
            )}

            {(showReminder || disableReminder) && (
              <CustomTooltip title={disableReminder ? "Cannot send reminder" : "Send reminder"} placement="bottom">
                <span>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={disableReminder}
                    className={`p-0 bg-transparent hover:bg-transparent dark:hover:bg-transparent ${disableReminder ? 'text-gray-400 opacity-50 cursor-not-allowed' : 'hover:text-blue-500'}`}
                    onClick={() => !disableReminder && onSend?.(row.id)}
                  >
                    <Bell className="w-4 h-4" />
                  </Button>
                </span>
              </CustomTooltip>
            )}

            {showDelete && (
              <CustomTooltip title="Delete invoice" placement="bottom">
                <Button variant="ghost" size="sm" className="p-0 hover:text-rose-600 bg-transparent hover:bg-transparent dark:hover:bg-transparent" onClick={() => onDelete?.(row.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CustomTooltip>
            )}
          </div>
        );
      }
    },
  ], [onEdit, onDelete, onView, onSend, formatCurrency, renderStatus, isAdmin, role]);

  const customHeader = () => {
    return (
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Button
          onClick={onAddInvoice}
          className="gap-2 bg-[#0060FE] hover:bg-[#0052db] text-white shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-[0.98] font-semibold border-none px-4"
        >
          <Plus className="w-4 h-4" />
          <span>Add Invoice</span>
        </Button>
      </div>
    )
  }

  return (

    <div className="w-full flex-1 flex flex-col min-h-0 overflow-hidden rounded-lg border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="flex flex-col h-full min-h-0">
        <DataTable
          columns={columns}
          data={invoices}
          searchPlaceholder="Search invoices..."
          onSearchChange={onSearchChange}
          searchValue={search}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
          headerTitle="Customer Invoice Management"
          className='pb-3'
          customHeader={isAdmin ? customHeader : undefined}
          totalItems={totalItems}
          currentPage={currentPage}
          onPageChange={onPageChange}
          loading={loading}
          onExport={onExport}
          isExporting={isExporting}
        />
      </div>
    </div>

  );
}
