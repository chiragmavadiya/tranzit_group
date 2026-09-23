import { useCallback, useMemo } from 'react';
import { Pencil, Trash2, Eye, Bell, Plus, Download, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Invoice } from '../types';
import { INVOICE_STATUS_COLORS } from '../constants';
import { cn, formateCurrency } from '@/lib/utils';
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
  onDownload?: (id: number) => void;
  downloadingId?: number | null;
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
  invoices, loading, isAdmin, onEdit, onDelete, onView, onSend, onDownload, downloadingId,
  totalItems = 0, currentPage = 1, pageSize = 10, search = '',
  onPageChange, onPageSizeChange, onSearchChange, onExport, isExporting
}: InvoiceTableProps) {
  const { role, is_sub_user, team_access } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const canReadWrite = useMemo(() => !is_sub_user || team_access?.permissions?.invoice === 'full', [is_sub_user, team_access]);

  const onAddInvoice = () => {
    // redirect to /createpage
    navigate('/admin/invoices/create');
  }

  const renderStatus = useCallback((val: Invoice['status']) => {
    const status = val.toLowerCase() as Invoice['status']
    return (
      <Badge className={cn("px-3 py-0.5 leading-relaxed rounded-md font-medium border-none shadow-none", INVOICE_STATUS_COLORS[status as keyof typeof INVOICE_STATUS_COLORS])}>
        {status}
      </Badge>
    );
  }, []);

  const columns = useMemo<Column<Invoice>[]>(() => [
    {
      accessor: 'id',
      key: 'id',
      header: 'Invoice#',
      sticky: 'left',
      disableToggle: true,
      // width: '140px',
      cell: (value, row) => (
        <NavLink to={`${isAdmin ? '/admin' : ''}/invoices/${value}`} className="font-bold text-primary hover:underline">
          #{row.invoice_number}
        </NavLink>
      )
    },
    ...(role === 'admin' ? [{
      key: 'xero_invoice_id',
      header: 'Xero Invoice#',
      // width: '160px',
    }] : []),
    {
      accessor: 'status',
      key: 'status',
      header: 'Status',
      className: 'capitalize',
      // width: '120px',
      cell: (value) => (
        renderStatus(value)
      )
    },
    ...(role === 'admin' ? [{
      accessor: 'user',
      key: 'user',
      header: 'Customer',
      width: '180px',
      cell: (_: string, row: Invoice) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 dark:text-zinc-200">{row.customer_full_name || row.user?.name}</span>
          <span className="text-xs text-gray-500 dark:text-zinc-400">{row.customer_email || row.user?.email}</span>
        </div>
      )
    }] : []),
    {
      accessor: 'amount',
      key: 'amount',
      header: 'Total',
      className: 'break-normal',
      // width: '110px',
      cell: (_, row) => (
        <div className="font-medium text-gray-700 dark:text-zinc-300">
          {formateCurrency(Number(row.total ?? row.amount ?? 0))}
        </div>
      )
    },
    {
      accessor: 'invoice_date',
      key: 'invoice_date',
      header: 'Issued Date',
      // width: '130px',
      cell: (_, row) => (
        <div className="text-gray-500 dark:text-zinc-400 whitespace-nowrap">
          {row.issue_date || row?.issued_at || row.invoice_date}
        </div>
      )
    },
    {
      accessor: 'amount_paid',
      key: 'amount_paid',
      header: 'Till Date Paid',
      className: 'break-normal',
      // width: '130px',
      cell: (_, row) => {
        const val = Number(row.till_date_paid ?? row.amount_paid ?? 0);
        return (
          <div className={cn("font-medium", val > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400")}>
            {formateCurrency(val)}
          </div>
        );
      }
    },
    {
      accessor: 'balance',
      key: 'balance',
      header: 'Remaining Balance',
      className: 'break-normal',
      // width: '160px',
      cell: (_, row) => {
        const val = Number(row.remaining_balance ?? row.balance ?? 0);
        return (
          <div className={cn("font-medium", val > 0 ? "text-rose-600 dark:text-rose-400" : "text-gray-400")}>
            {formateCurrency(val)}
          </div>
        );
      }
    },
    ...(canReadWrite ? [{
      accessor: 'actions',
      key: 'actions',
      header: 'Action',
      sticky: 'right' as const,
      disableToggle: true,
      width: '120px',
      cell: (_: any, row: any) => {
        const isCustomer = role === 'customer';

        if (isCustomer) {
          const isDownloading = downloadingId === row.id;
          return (
            <div className="flex items-center gap-2">
              <CustomTooltip title="View invoice" placement="bottom">
                <Button variant="ghost" size="sm" className="p-0 hover:text-blue-500 bg-transparent hover:bg-transparent dark:hover:bg-transparent" onClick={() => onView?.(row.id?.toString())}>
                  <Eye className="w-4 h-4" />
                </Button>
              </CustomTooltip>
              <CustomTooltip title="Download PDF" placement="bottom">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 hover:text-blue-500 bg-transparent hover:bg-transparent dark:hover:bg-transparent"
                  onClick={() => onDownload?.(row.id)}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </Button>
              </CustomTooltip>
            </div>
          );
        }

        // Admin rules
        const showPreview = row.actions.includes('view');
        const showEdit = row.actions.includes('edit');
        const showReminder = row.actions.includes('reminder');
        const showDelete = row.actions.includes('delete');
        const isDownloading = downloadingId === row.id;

        return (
          <div className="flex items-center gap-2">
            {showPreview && (
              <CustomTooltip title="View invoice" placement="bottom">
                <Button variant="ghost" size="sm" className="p-0 hover:text-blue-500 bg-transparent hover:bg-transparent dark:hover:bg-transparent" onClick={() => onView?.(row.id?.toString())}>
                  <Eye className="w-4 h-4" />
                </Button>
              </CustomTooltip>
            )}

            <CustomTooltip title="Download PDF" placement="bottom">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 hover:text-blue-500 bg-transparent hover:bg-transparent dark:hover:bg-transparent"
                onClick={() => onDownload?.(row.id)}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </Button>
            </CustomTooltip>

            {showEdit && (
              <CustomTooltip title="Edit invoice" placement="bottom">
                <Button variant="ghost" size="sm" className="p-0 hover:text-blue-500 bg-transparent hover:bg-transparent dark:hover:bg-transparent" onClick={() => onEdit?.(row.id)}>
                  <Pencil className="w-4 h-4" />
                </Button>
              </CustomTooltip>
            )}

            {(showReminder) && (
              <CustomTooltip title={"Send reminder"} placement="bottom">
                <span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`p-0 bg-transparent hover:bg-transparent dark:hover:bg-transparent hover:text-primary`}
                    onClick={() => onSend?.(row.id)}
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
    }] : []),
  ], [onEdit, onDelete, onView, onSend, onDownload, downloadingId, renderStatus, isAdmin, role, canReadWrite]);

  const customHeader = () => {
    return (
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Button
          onClick={onAddInvoice}
          className="gap-2 bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 dark:shadow-none transition-all active:scale-[0.98] font-semibold border-none px-4"
        >
          <Plus className="w-4 h-4" />
          <span>Add Invoice</span>
        </Button>
      </div>
    )
  }

  return (

    <div className="w-full rounded-lg border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex-none h-auto">
      <div className="flex flex-col h-auto">
        <DataTable
          columns={columns}
          data={invoices}
          moduleName="invoice"
          searchPlaceholder="Search invoices..."
          onSearchChange={onSearchChange}
          searchValue={search}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
          headerTitle="Customer Invoice Management"
          className='pb-3 flex-none h-auto'
          customHeader={isAdmin ? customHeader : undefined}
          totalItems={totalItems}
          currentPage={currentPage}
          onPageChange={onPageChange}
          loading={loading}
          onExport={onExport}
          isExporting={isExporting}
          exportable={canReadWrite}
        />
      </div>
    </div>

  );
}
