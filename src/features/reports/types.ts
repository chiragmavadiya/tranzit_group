
export type ReportType = 'shipment' | 'transaction' | 'invoice' | 'parcel';

export interface ShipmentReport {
  parcel_id: number;
  order_number: string;
  parcel_type: string;
  description: string | null;
  quantity: number;
  weight: number;
  dimensions: string;
  tracking_number: string;
  courier: string;
  receiver_name: string;
  receiver_suburb: string;
  status: string;
  created_at: string;
}

export interface TransactionReport {
  transaction_id: string;
  amount: number;
  reason: string;
  date_time: string;
}

export interface InvoiceReport {
  invoice: string;
  status: string;
  invoice_date: string;
  due_date: string;
  total: number;
  paid: number;
  balance: number;
  items: number;
  created_at: string;
}

export interface ParcelReport {
  receiver_name: string;
  receiver_full_address: string;
  tranzit_group_order_number: string;
  actual_parcel_tracking_number: string;
  parcel_status: string | null;
  courier: string;
  total: number;
  create_date: string;
}

export interface ReportTab {
  id: ReportType;
  label: string;
  count: number;
}

export interface ReportFilters {
  start_date?: string;
  end_date?: string;
  search?: string;
  per_page?: number;
  page?: number;
}

export interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: T[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}
