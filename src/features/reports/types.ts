
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
  sender_name?: string;
  receiver_name: string;
  receiver_full_address: string;
  tranzit_group_order_number: string;
  actual_parcel_tracking_number: string;
  actual_australia_post_mailing_statement_no?: string;
  parcel_status: string | null;
  courier: string;
  pickup_charge?: number;
  extra_surcharge?: number;
  tranzit_group_markup?: number;
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
  customer_id?: string;
  invoice_type?: string;
}

export interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: T[];
  summary?: {
    total_customers?: number;
    total_orders: number;
    total_amount: number;
    total_markup: number;
    total_pickup: number;
    total_surcharge: number;

  }
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}
