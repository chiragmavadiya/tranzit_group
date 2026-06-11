export type InvoiceStatus = 'paid' | 'partial' | 'draft' | 'pending' | 'unpaid' | 'send' | 'overdue';

export interface Customer {
  name: string;
  email: string;
}

export interface InvoiceDocumentData {
  id?: number;
  invoice_number: string;
  zoho_invoice_number: string | null;
  status: string;
  customer_full_name?: string;
  customer_email?: string;
  customer_business_name?: string;
  customer?: any;
  total: number;
  issue_date: string;
  due_date?: string | null;
  send_email?: string;
  till_date_paid: number;
  remaining_balance: number;
  totals: {
    subtotal_ex_gst: number;
    gst: number;
    total_inc_gst: number;
    amount_paid: number;
    amount_due: number;
    credit_amount: number;
  };
  address: {
    address: string;
    suburb: string;
    state: string;
    postcode: string;
  };
  items: any[];
  orders: any[];
  payment_transactions: any[];
}


export interface Invoice {
  id: number;
  invoice_number: string;
  zoho_invoice_number: string | null;
  status: string;

  // From Customer API
  customer_full_name?: string;
  customer_email?: string;
  total?: number | string;
  issue_date?: string;
  remaining_balance?: number | string;

  // From Admin API / Older mocks
  user_id?: number;
  invoice_date?: string;
  created_at?: string;
  amount?: string | number;
  amount_paid?: string | number;
  send_email?: string;
  reminder_count?: number;
  last_reminder_sent_at?: string | null;
  has_linked_orders?: number;
  credit_amount?: string;
  user?: {
    name: string;
    email: string;
  };
  balance?: string | number;
  is_custom?: number;
  can_remind?: boolean;
  reminder_reason?: string;
  till_date_paid?: string | number;
  totals: any;
  payment_transactions: any;
  customer_business_name: string,
  items: InvoiceItem
  address: any
  actions: string[];
}

export interface InvoiceSummary {
  total_invoices: number;
  pending_invoices: number;
  partial_invoices: number;
  paid_invoices: number;
  amount_pending: number;
  amount_paid: number;
}
export interface InvoiceFormData {
  invoice_number: string;
  zoho_invoice_number: string;
  status: InvoiceStatus;
  customerName: string;
  customerEmail: string;
  total: number;
  issued_date: string;
  till_date_paid: number;
}

export interface InvoiceItem {
  type: 'custom' | 'order' | 'credit';
  description: string;
  total: number;
  order_number?: string;
  item_date?: string;
  from?: string;
  destination?: string;
  to?: string;
  receiver?: string;
}

export interface CreateInvoiceRequest {
  customer_id: number;
  invoice_date: string;
  items: InvoiceItem[];
}

export interface PaginatedInvoicesResponse {
  status: boolean;
  message: string;
  data: Invoice[];
  summary: InvoiceSummary;
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}
