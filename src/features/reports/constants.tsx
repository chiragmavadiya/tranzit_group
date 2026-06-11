import type { ReportTab, ShipmentReport, TransactionReport, InvoiceReport, ParcelReport } from './types';
import type { Column } from '@/components/common/types/DataTable.types';
import { LinkCell } from '@/components/common/DataTableCells';
import { StatusBadge } from '../orders/components/StatusBadge';
import { NavLink } from 'react-router-dom';
import { formateCurrency } from '@/lib/utils';

export const REPORT_TABS: ReportTab[] = [
  { id: 'shipment', label: 'Shipment', count: 9 },
  { id: 'transaction', label: 'Transaction', count: 4 },
  { id: 'invoice', label: 'Invoice', count: 1 },
  // { id: 'parcel', label: 'Parcel', count: 3 },
];

export const SHIPMENT_COLUMNS: Column<ShipmentReport>[] = [
  {
    key: 'order_number', header: 'ORDER #',
    cell: (value: string) => (
      <NavLink to={`/orders/view/${value}`} className="font-bold text-primary underline">
        {value}
      </NavLink>
    )
  },
  { key: 'parcel_type', header: 'PARCEL TYPE', sortable: true, cell: (value: string) => value === "box" ? "Parcel" : value },
  { key: 'description', header: 'DESCRIPTION' },
  { key: 'quantity', header: 'QTY', sortable: true },
  { key: 'weight', header: 'WEIGHT (KG)', sortable: true },
  { key: 'dimensions', header: 'DIMENSIONS (L X W X H)' },
  { key: 'tracking_number', header: 'TRACKING #', sortable: true, searchable: true },
  {
    key: 'courier', header: 'COURIER', sortable: true, searchable: true, width: '200px',
    cell: (value: string, row: ShipmentReport) => (
      <div className="flex items-center gap-1">
        <img src={row?.courier_logo_url} className="h-6" alt="" />
        <span>{value}</span>
      </div>
    )
  },
  { key: 'receiver_name', header: 'RECEIVER', sortable: true, searchable: true, width: '160px' },
  { key: 'status', header: 'STATUS', sortable: true, cell: (value: string) => <StatusBadge status={value} /> },
  { key: 'tracking_status', header: 'TRANSIT STATUS', sortable: true, cell: (value: string) => <StatusBadge status={value} /> },
  { key: 'created_at', header: 'CREATE DATE', width: '200px' },
];

export const TRANSACTION_COLUMNS: Column<TransactionReport>[] = [
  { key: 'date_time', header: 'DATE', sortable: true },
  { key: 'transaction_id', header: 'TRANSACTION ID', sortable: true, searchable: true },
  { key: 'reason', header: 'REASON', sortable: true },
  { key: 'amount', header: 'AMOUNT', sortable: true },
];

export const INVOICE_COLUMNS: Column<InvoiceReport>[] = [
  { key: 'invoice', header: 'INVOICE #', sortable: true, searchable: true },
  { key: 'invoice_date', header: 'DATE', sortable: true },
  { key: 'total', header: 'AMOUNT', sortable: true },
  { key: 'due_date', header: 'DUE DATE', sortable: true },
  { key: 'status', header: 'STATUS', sortable: true },
];

export const PARCEL_COLUMNS: Column<ParcelReport>[] = [
  { key: 'receiver_name', header: 'RECEIVER NAME', sortable: true, searchable: true },
  { key: 'receiver_full_address', header: 'RECEIVER FULL ADDRESS', sortable: true, searchable: true },
  {
    key: 'tranzit_group_order_number',
    header: 'TRANZIT GROUP ORDER NUMBER',
    sortable: true,
    searchable: true,
    cell: (value, record) => (
      <LinkCell value={value} className="font-bold" path={`/orders/view/${record.tranzit_group_order_number}`} />
    )
  },
  {
    key: 'actual_parcel_tracking_number', header: 'ACTUAL PARCEL TRACKING NUMBER',
  },
  { key: 'parcel_status', header: 'PARCEL STATUS' },
  {
    key: 'courier', header: 'COURIER', width: '200px',
    cell: (value: string, row: ParcelReport) => (
      <div className="flex items-center gap-1">
        <img src={row?.courier_logo_url} className="h-6" alt="" />
        <span>{value}</span>
      </div>
    )
  },
  { key: 'total', header: 'TOTAL', sortable: true },
  { key: 'create_date', header: 'CREATE DATE', sortable: true },
];

export const ADMIN_PARCEL_COLUMNS: Column<ParcelReport>[] = [
  {
    key: 'customer_name',
    header: 'CUSTOMER NAME (SENDER NAME)',
    sortable: true,
    searchable: true,
    cell: (val) => <span className="font-medium text-slate-700 dark:text-zinc-300">{val || '-'}</span>
  },
  { key: 'receiver_name', header: 'RECEIVER NAME', sortable: true, searchable: true },
  {
    key: 'receiver_full_address',
    header: 'RECEIVER FULL ADDRESS',
    sortable: true,
    searchable: true,
    cell: (val) => <span className="text-sm text-slate-600 max-w-[200px] inline-block">{val}</span>
  },
  {
    key: 'tranzit_group_order_number',
    header: 'TRANZIT GROUP ORDER NUMBER',
    sortable: true,
    searchable: true,
    cell: (value) => (
      <LinkCell value={value} className="font-bold text-primary" path={`/admin/orders/view/${value}`} />
    )
  },
  { key: 'actual_parcel_tracking_number', header: 'ACTUAL PARCEL TRACKING NUMBER', sortable: true, searchable: true },
  { key: 'actual_australia_post_mailing_statement_no', header: 'ACTUAL AUSTRALIA POST MAILING STATEMENT NO', sortable: true },
  { key: 'parcel_status', header: 'PARCEL STATUS', sortable: true },
  {
    key: 'courier', header: 'COURIER', width: "220px",
    cell: (val: string, row: ParcelReport) => (
      <div className="flex items-center gap-1">
        <img src={row?.courier_logo_url} className="h-6" alt="" />
        <span>{val}</span>
      </div>)
  },
  {
    key: 'pickup_charge',
    header: 'PICKUP CHARGE',
    sortable: true,
    cell: (val) => val ? formateCurrency(val) : '-'
  },
  {
    key: 'extra_surcharge',
    header: 'EXTRA SURCHARGE',
    sortable: true,
    cell: (val) => val ? formateCurrency(val) : '$0.00'
  },
  {
    key: 'tranzit_group_markup',
    header: 'TRANZIT GROUP MARKUP',
    sortable: true,
    cell: (val) => val ? formateCurrency(val) : '$0.00'
  },
];

export const ADMIN_INTEGRATED_PARCEL_COLUMNS: Column<ParcelReport>[] = [
  {
    key: 'customer_name',
    header: 'CUSTOMER NAME (SENDER NAME)',
    sortable: true,
    searchable: true,
    cell: (val) => <span className="font-medium text-slate-700 dark:text-zinc-300">{val || '-'}</span>
  },
  { key: 'receiver_name', header: 'RECEIVER NAME', sortable: true, searchable: true },
  {
    key: 'receiver_full_address',
    header: 'RECEIVER FULL ADDRESS',
    sortable: true,
    searchable: true,
    cell: (val) => <span className="text-sm text-slate-600 max-w-[200px] inline-block">{val}</span>
  },
  {
    key: 'tranzit_group_order_number',
    header: 'TRANZIT GROUP ORDER NUMBER',
    sortable: true,
    searchable: true,
    cell: (value) => (
      <LinkCell value={value} className="font-bold text-primary" path={`/admin/orders/view/${value}`} />
    )
  },
  { key: 'actual_parcel_tracking_number', header: 'ACTUAL PARCEL TRACKING NUMBER', sortable: true, searchable: true },
  { key: 'actual_australia_post_mailing_statement_no', header: 'ACTUAL AUSTRALIA POST MAILING STATEMENT NO', sortable: true },
  { key: 'parcel_status', header: 'PARCEL STATUS', sortable: true },
  {
    key: 'courier', header: 'COURIER', width: "220px",
    cell: (val: string, row: ParcelReport) => (
      <div className="flex items-center gap-1">
        <img src={row?.courier_logo_url} className="h-6" alt="" />
        <span>{val}</span>
      </div>)
  },
  {
    key: 'total',
    header: 'TOTAL',
    sortable: true,
    cell: (val) => val ? formateCurrency(val) : '-'
  },
];
