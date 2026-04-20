import { useCallback, useMemo, useState } from 'react';
import { Pencil, Trash2, Eye, Bell, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Invoice } from '../types';
import { INVOICE_STATUS_COLORS } from '../constants';
import { cn } from '@/lib/utils';
import { CustomTooltip, DataTable, type Column } from '@/components/common';
import { NavLink } from 'react-router-dom';

interface InvoiceTableProps {
  invoices: Invoice[];
  isAdmin?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (invoiceNumber: string) => void;
  onSend?: (id: number) => void;
}

export function InvoiceTable({ invoices, isAdmin, onEdit, onDelete, onView, onSend, }: InvoiceTableProps) {

  const [search, setSearch] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)

  const handleSearch = (value: string) => {
    setSearch(value)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
  }


  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }, []);

  const renderStatus = useCallback((status: Invoice['status']) => {
    return (
      <Badge className={cn("px-3 py-0.5 rounded-md font-medium border-none shadow-none", INVOICE_STATUS_COLORS[status])}>
        {status}
      </Badge>
    );
  }, []);

  const columns = useMemo<Column<Invoice>[]>(() => [
    {
      accessor: 'invoice_number',
      key: 'invoice_number',
      header: 'Invoice #',
      sticky: 'left',
      cell: (value, row) => (
        <NavLink to={`${isAdmin ? '/admin' : ''}/invoices/${row.invoice_number}`} className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
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
          <span className="font-semibold text-gray-800 dark:text-zinc-200">{row.user.name}</span>
          <span className="text-xs text-gray-500 dark:text-zinc-400">{row.user.email}</span>
        </div>
      )
    },
    {
      accessor: 'amount',
      key: 'amount',
      header: 'Total',
      cell: (value) => (
        <div className="text-right font-medium text-gray-700 dark:text-zinc-300">
          {formatCurrency(Number(value))}
        </div>
      )
    },
    {
      accessor: 'invoice_date',
      key: 'invoice_date',
      header: 'Issued Date',
      cell: (value) => (
        <div className="text-gray-500 dark:text-zinc-400 whitespace-nowrap">
          {value}
        </div>
      )
    },
    {
      accessor: 'amount_paid',
      key: 'amount_paid',
      header: 'Till Date Paid',
      cell: (value) => (
        <div className={cn("text-right font-medium", Number(value) > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400")}>
          {formatCurrency(Number(value))}
        </div>
      )
    },
    {
      accessor: 'balance',
      key: 'balance',
      header: 'Remaining Balance',
      cell: (value) => (
        <div className={cn("text-right font-medium", Number(value) > 0 ? "text-rose-600 dark:text-rose-400" : "text-gray-400")}>
          {formatCurrency(Number(value))}
        </div>
      )
    },
    {
      accessor: 'actions',
      key: 'actions',
      header: 'Action',
      sticky: 'right',
      cell: (_, row) => (
        <div className="flex items-center justify-center gap-2">
          <CustomTooltip title="Edit invoice" placement="bottom">
            <Button variant="ghost" size="sm" className="p-0 hover:text-blue-500 bg-transparent hover:bg-transparent dark:hover:bg-transparent" onClick={() => onEdit?.(row.id)}>
              <Pencil className="w-4 h-4" />
            </Button>
          </CustomTooltip>
          <CustomTooltip title="Delete invoice" placement="bottom">
            <Button variant="ghost" size="sm" className="p-0 hover:text-rose-600 bg-transparent hover:bg-transparent dark:hover:bg-transparent" onClick={() => onDelete?.(row.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </CustomTooltip>
          <CustomTooltip title="View invoice" placement="bottom">
            <Button variant="ghost" size="sm" className="p-0 hover:text-blue-500 bg-transparent hover:bg-transparent dark:hover:bg-transparent" onClick={() => onView?.(row.invoice_number)}>
              <Eye className="w-4 h-4" />
            </Button>
          </CustomTooltip>
          <CustomTooltip title="Send invoice before reminding" placement="bottom">
            <Button variant="ghost" size="sm" className="p-0 hover:text-blue-500 bg-transparent hover:bg-transparent dark:hover:bg-transparent" onClick={() => onSend?.(row.id)}>
              <Bell className="w-4 h-4" />
            </Button>
          </CustomTooltip>
        </div>
      )
    },
  ], [onEdit, onDelete, onView, onSend, formatCurrency, renderStatus, isAdmin]);

  const customHeader = () => {
    return (
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Button
          // onClick={onAddAddress}
          className="gap-2 bg-[#0060FE] hover:bg-[#0052db] text-white shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-[0.98] font-semibold border-none px-4"
        >
          <Plus className="w-4 h-4" />
          <span>Add Address</span>
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
          onSearchChange={handleSearch}
          searchValue={search}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          headerTitle="Customer Invoice Management"
          className='pb-3'
          customHeader={isAdmin ? customHeader : undefined}
        />
      </div>
    </div>

  );
}
