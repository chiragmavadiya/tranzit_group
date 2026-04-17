import type { ReportTab, ShipmentReport, TransactionReport, InvoiceReport } from './types';
import type { Column } from '@/components/common';

export const REPORT_TABS: ReportTab[] = [
  { id: 'shipment', label: 'Shipment Report', count: 9 },
  { id: 'transaction', label: 'Transaction Report', count: 4 },
  { id: 'invoice', label: 'Invoice Report', count: 1 },
];

export const MOCK_SHIPMENTS: ShipmentReport[] = [
  {
    id: '1',
    order_number: '01KDYJ5P5PPFZ0WCJNG9N3R6Y1',
    parcel_type: 'Parcel',
    description: '-',
    qty: 1,
    weight: 2.00,
    dimensions: '2.00 x 2.00 x 2.00',
    tracking_number: '2148387294420',
    courier: 'Direct Freight',
    receiver: 'Shikhar c (Melbourne)',
    status: 'Printed',
  },
  {
    id: '2',
    order_number: '01KDYJ5P7QH5ZYX46WW0CF1HAE',
    parcel_type: 'Parcel',
    description: '-',
    qty: 1,
    weight: 5.00,
    dimensions: '10.00 x 15.00 x 20.00',
    tracking_number: '111JD8606298',
    courier: 'Australia Post',
    receiver: 'Shikhar c (Melbourne)',
    status: 'Printed',
  },
  // Add more mock data as needed to reflect count 9
  ...Array.from({ length: 17 }).map((_, i) => ({
    id: `3-${i}`,
    order_number: `01KDYJ5P${i}QH5ZYX46WW0CF${i}HAE`,
    parcel_type: 'Parcel',
    description: '-',
    qty: 1,
    weight: 3.5 + i,
    dimensions: '5.00 x 5.00 x 5.00',
    tracking_number: `TRK${123456789 + i}`,
    courier: i % 2 === 0 ? 'Australia Post' : 'Direct Freight',
    receiver: 'John Doe (Sydney)',
    status: 'Shipped',
  }))
];

export const MOCK_TRANSACTIONS: TransactionReport[] = [
  {
    id: '1',
    date: '2026-04-16',
    transaction_id: 'TXN001',
    type: 'Topup',
    amount: 500.00,
    status: 'Completed',
  },
  {
    id: '2',
    date: '2026-04-15',
    transaction_id: 'TXN002',
    type: 'Shipping Fee',
    amount: 25.40,
    status: 'Completed',
  },
  {
    id: '3',
    date: '2026-04-14',
    transaction_id: 'TXN003',
    type: 'Refund',
    amount: 15.00,
    status: 'Pending',
  },
  {
    id: '4',
    date: '2026-04-13',
    transaction_id: 'TXN004',
    type: 'Topup',
    amount: 100.00,
    status: 'Failed',
  },
];

export const MOCK_INVOICES: InvoiceReport[] = [
  {
    id: '1',
    invoice_number: 'INV-2026-001',
    date: '2026-04-01',
    customer: 'Shikhar c',
    amount: 1250.00,
    due_date: '2026-04-15',
    status: 'Paid',
  },
];

export const SHIPMENT_COLUMNS: Column<ShipmentReport>[] = [
  { key: 'order_number', header: 'ORDER #', sortable: true, searchable: true },
  { key: 'parcel_type', header: 'PARCEL TYPE', sortable: true },
  { key: 'description', header: 'DESCRIPTION' },
  { key: 'qty', header: 'QTY', sortable: true },
  { key: 'weight', header: 'WEIGHT (KG)', sortable: true },
  { key: 'dimensions', header: 'DIMENSIONS (L X W X H)' },
  { key: 'tracking_number', header: 'TRACKING #', sortable: true, searchable: true },
  { key: 'courier', header: 'COURIER', sortable: true, searchable: true },
  { key: 'receiver', header: 'RECEIVER', sortable: true, searchable: true },
  { key: 'status', header: 'STATUS', sortable: true },
];

export const TRANSACTION_COLUMNS: Column<TransactionReport>[] = [
  { key: 'date', header: 'DATE', sortable: true },
  { key: 'transaction_id', header: 'TRANSACTION ID', sortable: true, searchable: true },
  { key: 'type', header: 'TYPE', sortable: true },
  { key: 'amount', header: 'AMOUNT', sortable: true },
  { key: 'status', header: 'STATUS', sortable: true },
];

export const INVOICE_COLUMNS: Column<InvoiceReport>[] = [
  { key: 'invoice_number', header: 'INVOICE #', sortable: true, searchable: true },
  { key: 'date', header: 'DATE', sortable: true },
  { key: 'customer', header: 'CUSTOMER', sortable: true, searchable: true },
  { key: 'amount', header: 'AMOUNT', sortable: true },
  { key: 'due_date', header: 'DUE DATE', sortable: true },
  { key: 'status', header: 'STATUS', sortable: true },
];
