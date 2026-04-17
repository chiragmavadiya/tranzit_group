
export type ReportType = 'shipment' | 'transaction' | 'invoice';

export interface ShipmentReport {
  id: string;
  order_number: string;
  parcel_type: string;
  description: string;
  qty: number;
  weight: number;
  dimensions: string;
  tracking_number: string;
  courier: string;
  receiver: string;
  status: string;
}

export interface TransactionReport {
  id: string;
  date: string;
  transaction_id: string;
  type: string;
  amount: number;
  status: string;
}

export interface InvoiceReport {
  id: string;
  invoice_number: string;
  date: string;
  customer: string;
  amount: number;
  due_date: string;
  status: string;
}

export interface ReportTab {
  id: ReportType;
  label: string;
  count: number;
}
