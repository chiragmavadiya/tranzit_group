import type { PackingColumn, ItemsColumn, Order, TabType } from '@/features/orders/types';

export const PACKAGING_COLUMNS: PackingColumn[] = [
  { key: 'package', label: 'PACKAGE', editable: false, type: 'select' },
  { key: 'qty', label: 'QTY', editable: true, type: 'number' },
  { key: 'length', label: 'L (CM)', editable: true, type: 'number' },
  { key: 'width', label: 'W (CM)', editable: true, type: 'number' },
  { key: 'height', label: 'H (CM)', editable: true, type: 'number' },
  { key: 'weight', label: 'WGT (KG)', editable: true, type: 'number' },
  { key: 'cubic', label: 'CUBIC (M³)', editable: true, type: 'number' },
  { key: 'tracking', label: 'SCAN OR ENTER TRACKING', editable: true, type: 'text' }
];

export const ITEMS_COLUMNS: ItemsColumn[] = [
  { key: 'type', label: 'TYPE', editable: true, type: 'text' },
  { key: 'qty', label: 'QTY', editable: true, type: 'number' },
  { key: 'length', label: 'L (CM)', editable: true, type: 'number' },
  { key: 'width', label: 'W (CM)', editable: true, type: 'number' },
  { key: 'height', label: 'H (CM)', editable: true, type: 'number' },
  { key: 'weight', label: 'WGT (KG)', editable: true, type: 'number' },


];

export const DOCUMENT_TYPES = [
  { label: "Customs Invoice", value: "customs_invoice" },
  { label: "Proof of Purchase", value: "proof_of_purchase" },
  { label: "Licence/Permit", value: "licence_permit" },
  { label: "Order Document", value: "order_document" },
  { label: "Invoice", value: "invoice" },
  { label: "Proforma", value: "proforma" },
  { label: "Certificate of Origin", value: "certificate_of_origin" },
  { label: "Nafta Certificate of Origin", value: "nafta_certificate_of_origin" },
  { label: "Commercial Invoice", value: "commercial_invoice" },
  { label: "Custom Declaration", value: "custom_declaration" },
];


export const TABS: TabType[] = ['New', 'Printed', 'Shipped', 'Archived'];

export const ORDER_TYPES = ['All Types', 'Marketplace', 'Manual', 'Integration'];
export const STATUSES = ['All Statuses', 'New', 'Printed', 'Shipped', 'Archived'];

export const Order_status_styles: Record<string, string> = {
  New: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  Printed: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  Shipped: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  Archived: 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-700',
  'Courier Not Assigned': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
  'Payment Pending': 'bg-orange-100 dark:bg-orange-900/30 text-orange-500 dark:text-orange-300 border-orange-500 dark:border-orange-800',
  'Paid': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
};

// API DATA 

export const MOCK_ORDERS_DATA: Order[] = [
  {
    "customer_name": "Customer1 User",
    "order_number": "5NTDMQM9AO",
    "suburb": null,
    "amount": 567,
    "status": "Payment pending",
    "payment_status": "Paid",
    "courier": "Australia Post",
    "order_type": "manual",
    "consignment_date": "20 Apr 2026 11:22 AM"
  },
  {
    "customer_name": "Customer1 User",
    "order_number": "OICAELDHYB",
    "suburb": null,
    "amount": 501,
    "status": "Payment pending",
    "payment_status": "Paid",
    "courier": "Australia Post",
    "order_type": "manual",
    "consignment_date": "20 Apr 2026 11:22 AM"
  },
  {
    "customer_name": "Customer1 User",
    "order_number": "1APAHAACSW",
    "suburb": null,
    "amount": 687,
    "status": "Payment pending",
    "payment_status": "Paid",
    "courier": "Australia Post",
    "order_type": "manual",
    "consignment_date": "20 Apr 2026 11:22 AM"
  },
  {
    "customer_name": "Customer1 User",
    "order_number": "S4VWMVBH3S",
    "suburb": null,
    "amount": 176,
    "status": "Payment pending",
    "payment_status": "Paid",
    "courier": "Australia Post",
    "order_type": "manual",
    "consignment_date": "20 Apr 2026 11:22 AM"
  },
  {
    "customer_name": "Customer1 User",
    "order_number": "B3RRKERBV1",
    "suburb": null,
    "amount": 601,
    "status": "Payment pending",
    "payment_status": "Paid",
    "courier": "Australia Post",
    "order_type": "manual",
    "consignment_date": "20 Apr 2026 11:22 AM"
  }
];

