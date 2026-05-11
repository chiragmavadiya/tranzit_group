export type InvoiceStatus = 'Paid' | 'Partial' | 'Draft' | 'Pending' | 'Unpaid' | 'Send' | 'Overdue';

export interface Customer {
  name: string;
  email: string;
}

export interface InvoiceDocumentData {
  invoice: {
    id?: number;
    invoice_number: string;
    invoice_date: string;
    issued_at: string;
    due_date: string | null;
    status: string;
    amount_paid: number;
    balance_due: number;
    send_email: string;
    zoho_invoice_number: string | null;
  };
  customer: any;
  items: any[];
  summary: {
    subtotal_ex_gst: number;
    gst: number;
    total_inc_gst: number;
    amount_paid: number;
    credit_amount: number;
    amount_due: number;
  };
  payments: any[];
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
}

export interface InvoiceSummary {
  total_invoice: number;
  invoice_pending: number;
  invoice_partial: number;
  invoice_paid: number;
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
