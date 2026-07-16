import type { ReportTab, ShipmentReport, TransactionReport, InvoiceReport, ParcelReport, OrderLabelCharge } from './types';
import type { Column } from '@/components/common/types/DataTable.types';
import { LinkCell } from '@/components/common/DataTableCells';
import { StatusBadge } from '../orders/components/StatusBadge';
import { NavLink } from 'react-router-dom';
import { formateCurrency } from '@/lib/utils';

export const ORDER_LABEL_CHARGES_COLUMNS: Column<OrderLabelCharge>[] = [
  {
    key: 'tranzit_group_order_number',
    header: 'ORDER NUMBER',
    width: '120px',
    className: 'text-[13px]',
    cell: (value) => (
      <LinkCell value={value} className="font-bold text-primary" path={`/admin/orders/view/${value}`} />
    )
  },
  { key: 'consignment_date', header: 'CONSIGNMENT DATE', className: 'text-[13px]' },
  { key: 'receiver_name', header: 'RECEIVER NAME', className: 'text-[13px]' },
  {
    key: 'receiver_full_address',
    header: 'RECEIVER FULL ADDRESS',
    className: 'text-[13px]',
    width: '200px',
    cell: (val) => <span className="text-[13px] text-slate-600 max-w-[200px] inline-block">{val}</span>
  },
  {
    key: 'receiver_suburb',
    header: 'RECEIVER SUBURB',
    className: 'text-[13px]',
    cell: (val) => <span className="text-sm text-slate-600 max-w-[200px] inline-block">{val}</span>
  },
  { key: 'actual_parcel_tracking_number', className: 'text-[13px]', header: 'TRACKING NUMBER' },
  {
    key: 'courier_and_product',
    header: 'COURIER & PRODUCT',
    className: 'text-[13px]',
    width: '160px',
    cell: (value, row) => (
      <div className="flex items-center gap-2">
        {row?.courier_logo_url && (
          <div className="shrink-0">
            <img src={row.courier_logo_url} className="h-6! object-contain" />
          </div>
        )}
        <span className="break-normal min-w-[60px] font-normal">{value && value !== 'unknown' ? value : '-'}</span>
      </div>
    )
  },
  {
    key: 'is_byo',
    header: 'BYO',
    className: 'text-[13px]',
    cell: (val) => val ? (
      <span className="whitespace-nowrap inline-flex items-center px-2 py-0.5 rounded text-[13px] font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Yes</span>
    ) : (
      <span className="whitespace-nowrap inline-flex items-center px-2 py-0.5 rounded text-[13px] font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">No</span>
    )
  },
  // { key: 'label_count', header: 'LABEL COUNT', sortable: true },
  {
    key: 'rate_per_label',
    header: 'RATE PER LABEL',
    className: 'text-[13px]',
    cell: (val) => val !== undefined && val !== null ? formateCurrency(val) : '-'
  },
  // {
  //   key: 'total_charge',
  //   header: 'TOTAL CHARGE',
  //   sortable: true,
  //   cell: (val) => val !== undefined && val !== null ? formateCurrency(val) : '-'
  // },
  {
    key: 'billing_period_start',
    header: 'BILLING PERIOD',
    className: 'text-[13px] break-normal',
    cell: (_, row) => row.billing_period_start && row.billing_period_end ? `${row.billing_period_start} - ${row.billing_period_end}` : '-'
  }
];

export const REPORT_TABS: ReportTab[] = [
  { id: 'shipment', label: 'Shipment', count: 9 },
  { id: 'transaction', label: 'Transaction', count: 4 },
  { id: 'invoice', label: 'Invoice', count: 1 },
  // { id: 'parcel', label: 'Parcel', count: 3 },
];

export const SHIPMENT_COLUMNS: Column<ShipmentReport>[] = [
  {
    key: 'order_number', header: 'ORDER #',
    width: '120px',
    cell: (value: string) => (
      <NavLink to={`/orders/view/${value}`} className="font-bold text-primary underline">
        {value}
      </NavLink>
    )
  },
  { key: 'parcel_type', header: 'TYPE', width: '90px', sortable: true, cell: (value: string) => value === "box" ? "Parcel" : value },
  { key: 'description', header: 'DESCRIPTION' },
  { key: 'quantity', header: 'QTY', sortable: true },
  { key: 'weight', header: 'WEIGHT (KG)', sortable: true },
  { key: 'dimensions', header: 'DIMENSIONS (L X W X H)' },
  { key: 'tracking_number', header: 'TRACKING #', sortable: true, searchable: true },
  {
    key: 'courier', header: 'COURIER & PRODUCT', sortable: true, searchable: true, width: '200px',
    cell: (value: string, row: ShipmentReport) => (
      <div className="flex items-center gap-2">
        {(row?.courier_logo_url) && (
          <div className="">
            <img src={row?.courier_logo_url} className="h-6! min-w-[60px] object-contain" />
          </div>
        )}
        <div className="flex">
          <span className="whitespace-nowrap font-normal">{value && value !== 'unknown' ? value : '-'}</span>
          {row.product_id && <span className="font-normal text-sm whitespace-nowrap"> - {row.product_id}</span>}
        </div>
      </div>
    )
  },
  { key: 'receiver_name', header: 'RECEIVER', sortable: true, searchable: true, width: '160px' },
  { key: 'status', header: 'STATUS', sortable: true, cell: (value: string) => <StatusBadge status={value} /> },
  { key: 'tracking_status', header: 'TRANSIT STATUS', sortable: true, cell: (value: string) => <StatusBadge status={value} /> },
  { key: 'created_at', header: 'CREATE ON', width: '200px' },
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
  { key: 'parcel_status', header: 'PARCEL STATUS', cell: (value: string) => <StatusBadge status={value} /> },
  {
    key: 'courier', header: 'COURIER & PRODUCT', width: '200px',
    cell: (value: string, row: ParcelReport) => (
      <div className="flex items-center gap-2">
        {(row?.courier_logo_url) && (
          <div className="">
            <img src={row?.courier_logo_url} className="h-6! min-w-[60px] object-contain" />
          </div>
        )}
        <div className="">
          <span className=" font-normal">{value && value !== 'unknown' ? value : '-'}</span>
          {row.product_id && <span className="font-normal text-sm "> - {row.product_id}</span>}
        </div>
      </div>
    )
  },
  { key: 'total', header: 'TOTAL', sortable: true, cell: (val) => val ? formateCurrency(val) : '-' },
  { key: 'create_date', header: 'CREATE ON', sortable: true },
];

export const ADMIN_PARCEL_COLUMNS: Column<ParcelReport>[] = [
  {
    key: 'customer_name',
    header: 'CUSTOMER NAME (SENDER NAME)',
    cell: (val) => <span className="font-medium text-slate-700 dark:text-zinc-300">{val || '-'}</span>
  },
  { key: 'receiver_name', header: 'RECEIVER NAME', sortable: true, searchable: true },
  {
    key: 'receiver_full_address',
    header: 'RECEIVER FULL ADDRESS',
    cell: (val) => <span className="text-sm text-slate-600 max-w-[200px] inline-block">{val}</span>
  },
  { key: 'receiver_suburb', header: 'RECEIVER SUBURB', sortable: true, searchable: true },
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
  { key: 'parcel_status', header: 'PARCEL STATUS', cell: (value: string) => <StatusBadge status={value} /> },
  {
    key: 'courier', header: 'COURIER & PRODUCT', width: "220px",
    cell: (val: string, row: ParcelReport) => (
      <div className="flex items-center gap-1">
        <img src={row?.courier_logo_url} className="h-6" alt="" />
        <span className=''>{val} {row.product_id && ` - ${row.product_id}`}</span>
      </div>)
  },
  {
    key: 'pickup_charge',
    header: 'PICKUP CHARGE',
    sortable: true,
    cell: (val) => val ? formateCurrency(val) : '$0.00'
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
  {
    key: 'total',
    header: 'TOTAL',
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
  { key: 'receiver_suburb', header: 'RECEIVER SUBURB', sortable: true, searchable: true },

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
    key: 'courier', header: 'COURIER & PRODUCT', width: "220px",
    cell: (val: string, row: ParcelReport) => (
      <div className="flex items-center gap-1">
        <img src={row?.courier_logo_url} className="h-6" alt="" />
        <span>{val} {row.product_id && ` - ${row.product_id}`}</span>
      </div>)
  },
  {
    key: 'total',
    header: 'TOTAL',
    sortable: true,
    cell: (val) => val ? formateCurrency(val) : '-'
  },
];

export const AUSPOST_REPORT_COLUMNS: Column<any>[] = [
  {
    key: 'tranzit_group_order_number',
    header: 'ORDER NUMBER',
    sortable: true,
    searchable: true,
    cell: (value, record) => {
      const orderNo = value || record.order_number || record.orderNumber || '';
      return (
        <LinkCell value={orderNo} className="font-bold text-primary" path={`/admin/orders/view/${orderNo}`} />
      );
    }
  },
  {
    key: 'customer_name',
    header: 'CUSTOMER NAME',
    sortable: true,
    searchable: true,
    cell: (value, record) => value || record.customer_name || record.customerName || '-'
  },
  {
    key: 'ap_mailing_statement_number',
    header: 'AP MAILING STATEMENT NUMBER',
    sortable: true,
    searchable: true,
    cell: (value, record) => value || record.ap_mailing_statement_number || record.actual_australia_post_mailing_statement_no || record.apMailingStatementNumber || '-'
  },
  {
    key: 'australia_post_estimated_billing',
    header: 'SHIPPING COST(AUSPOST)',
    sortable: true,
    cell: (value, record) => {
      const val = value !== undefined && value !== null ? value : (record.auspost_estimated_billing || record.auspostEstimatedBilling || 0);
      return formateCurrency(Number(val));
    }
  },
  {
    key: 'total_fuel_levy',
    header: 'TOTAL FUEL LEVY',
    sortable: true,
    cell: (value, record) => {
      const val = value !== undefined && value !== null ? value : (record.total_fuel_levy || record.totalFuelLevy || 0);
      return formateCurrency(Number(val));
    }
  },
  {
    key: 'total_gst',
    header: 'TOTAL GST',
    sortable: true,
    cell: (value, record) => {
      const val = value !== undefined && value !== null ? value : (record.total_gst || record.totalGst || record.totalGST || 0);
      return formateCurrency(Number(val));
    }
  },
  {
    key: 'total_shipping_cost',
    header: 'AUSTRALIA POST ESTIMATED BILLING',
    sortable: true,
    cell: (value, record) => {
      const val = value !== undefined && value !== null ? value : (record.total_shipping_cost || record.totalShippingCost || 0);
      return formateCurrency(Number(val));
    }
  },
  {
    key: 'total_paid_amount',
    header: 'TOTAL PAID AMOUNT',
    sortable: true,
    cell: (value, record) => {
      const val = value !== undefined && value !== null ? value : (record.total_paid_amount || record.totalPaidAmount || 0);
      return formateCurrency(Number(val));
    }
  },
  {
    key: 'total_markup',
    header: 'TOTAL MARKUP',
    sortable: true,
    cell: (value, record) => {
      const val = value !== undefined && value !== null ? value : (record.total_markup || record.totalMarkup || 0);
      return formateCurrency(Number(val));
    }
  },
];
