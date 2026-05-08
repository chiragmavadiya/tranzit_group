import type { ReportTab, ShipmentReport, TransactionReport, InvoiceReport, ParcelReport } from './types';
import type { Column } from '@/components/common';
import { LinkCell } from '@/components/common/DataTableCells';

export const REPORT_TABS: ReportTab[] = [
  { id: 'shipment', label: 'Shipment', count: 9 },
  { id: 'transaction', label: 'Transaction', count: 4 },
  { id: 'invoice', label: 'Invoice', count: 1 },
  { id: 'parcel', label: 'Parcel', count: 3 },
];

export const SHIPMENT_COLUMNS: Column<ShipmentReport>[] = [
  { key: 'order_number', header: 'ORDER #', sortable: true, searchable: true },
  { key: 'parcel_type', header: 'PARCEL TYPE', sortable: true },
  { key: 'description', header: 'DESCRIPTION' },
  { key: 'quantity', header: 'QTY', sortable: true },
  { key: 'weight', header: 'WEIGHT (KG)', sortable: true },
  { key: 'dimensions', header: 'DIMENSIONS (L X W X H)' },
  { key: 'tracking_number', header: 'TRACKING #', sortable: true, searchable: true },
  { key: 'courier', header: 'COURIER', sortable: true, searchable: true },
  { key: 'receiver_name', header: 'RECEIVER', sortable: true, searchable: true },
  { key: 'status', header: 'STATUS', sortable: true },
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

export const MOCK_PARCEL_REPORTS: ParcelReport[] = [
  {
    receiver_name: 'chirag work',
    receiver_full_address: '150 Pacific Highway, North Sydney NSW, Australia',
    tranzit_group_order_number: '#SHP000115',
    actual_parcel_tracking_number: 'ASDASDASD',
    parcel_status: '-',
    courier: 'Directfreight',
    total: 20.59,
    create_date: '16 Apr 2026',
  },
  {
    receiver_name: 'Ashis',
    receiver_full_address: '150 Mary Street, Brisbane City QLD, Australia',
    tranzit_group_order_number: '#SHP000114',
    actual_parcel_tracking_number: 'MANUAL_CREATE_ORDER',
    parcel_status: '-',
    courier: 'Pallet',
    total: 1300.00,
    create_date: '16 Apr 2026',
  },
  {
    receiver_name: 'Chirag Dayabhai Mavadiya',
    receiver_full_address: '150 Collins Street, Melbourne VIC, Australia',
    tranzit_group_order_number: '#SHP000113',
    actual_parcel_tracking_number: '111JD8606266',
    parcel_status: '-',
    courier: 'Auspost',
    total: 36.53,
    create_date: '16 Apr 2026',
  },
  {
    receiver_name: 'Chirag Dayabhai Mavadiya',
    receiver_full_address: '150 Collins Street, Melbourne VIC, Australia',
    tranzit_group_order_number: '#SHP000113',
    actual_parcel_tracking_number: '111JD8606266',
    parcel_status: '-',
    courier: 'Auspost',
    total: 36.53,
    create_date: '16 Apr 2026',
  },
  {
    receiver_name: 'Chirag Dayabhai Mavadiya',
    receiver_full_address: '150 Collins Street, Melbourne VIC, Australia',
    tranzit_group_order_number: '#SHP000113',
    actual_parcel_tracking_number: '111JD8606266',
    parcel_status: '-',
    courier: 'Auspost',
    total: 36.53,
    create_date: '16 Apr 2026',
  },
  {
    receiver_name: 'Chirag Dayabhai Mavadiya',
    receiver_full_address: '150 Collins Street, Melbourne VIC, Australia',
    tranzit_group_order_number: '#SHP000113',
    actual_parcel_tracking_number: '111JD8606266',
    parcel_status: '-',
    courier: 'Auspost',
    total: 36.53,
    create_date: '16 Apr 2026',
  },
  {
    receiver_name: 'Chirag Dayabhai Mavadiya',
    receiver_full_address: '150 Collins Street, Melbourne VIC, Australia',
    tranzit_group_order_number: '#SHP000113',
    actual_parcel_tracking_number: '111JD8606266',
    parcel_status: '-',
    courier: 'Auspost',
    total: 36.53,
    create_date: '16 Apr 2026',
  },
  {
    receiver_name: 'Chirag Dayabhai Mavadiya',
    receiver_full_address: '150 Collins Street, Melbourne VIC, Australia',
    tranzit_group_order_number: '#SHP000113',
    actual_parcel_tracking_number: '111JD8606266',
    parcel_status: '-',
    courier: 'Auspost',
    total: 36.53,
    create_date: '16 Apr 2026',
  }
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
      <LinkCell value={value} className="font-bold" path={`/orders/${record.tranzit_group_order_number}`} />
    )
  },
  { key: 'actual_parcel_tracking_number', header: 'ACTUAL PARCEL TRACKING NUMBER', sortable: true, searchable: true },
  { key: 'parcel_status', header: 'PARCEL STATUS', sortable: true },
  { key: 'courier', header: 'COURIER', sortable: true },
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
    cell: (val) => <span className="text-xs text-slate-500 max-w-[200px] inline-block">{val}</span>
  },
  {
    key: 'tranzit_group_order_number',
    header: 'TRANZIT GROUP ORDER NUMBER',
    sortable: true,
    searchable: true,
    cell: (value) => (
      <LinkCell value={value} className="font-bold text-blue-600" path={`/admin/orders/all/${value?.replace('#', '')}`} />
    )
  },
  { key: 'actual_parcel_tracking_number', header: 'ACTUAL PARCEL TRACKING NUMBER', sortable: true, searchable: true },
  { key: 'actual_australia_post_mailing_statement_no', header: 'ACTUAL AUSTRALIA POST MAILING STATEMENT NO', sortable: true },
  { key: 'parcel_status', header: 'PARCEL STATUS', sortable: true },
  { key: 'courier', header: 'COURIER', sortable: true },
  {
    key: 'pickup_charge',
    header: 'PICKUP CHARGE',
    sortable: true,
    cell: (val) => val ? `$${Number(val).toFixed(2)}` : '-'
  },
  {
    key: 'extra_surcharge',
    header: 'EXTRA SURCHARGE',
    sortable: true,
    cell: (val) => val ? `$${Number(val).toFixed(2)}` : '$0.00'
  },
  {
    key: 'tranzit_group_markup',
    header: 'TRANZIT GROUP MARKUP',
    sortable: true,
    cell: (val) => val ? `$${Number(val).toFixed(2)}` : '$0.00'
  },
];
