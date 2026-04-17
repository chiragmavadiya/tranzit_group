export type InvoiceStatus = 'Paid' | 'Partial' | 'Draft' | 'Pending' | 'Unpaid';

export interface Customer {
  name: string;
  email: string;
}

export interface Invoice {
  id: number;
  user_id: number;
  invoice_number: string;
  invoice_date: string;
  created_at: string;
  amount: string;
  amount_paid: string;
  status: InvoiceStatus;
  zoho_invoice_number: string | null;
  send_email: string;
  reminder_count: number;
  last_reminder_sent_at: string | null;
  has_linked_orders: number;
  credit_amount: string;
  user: {
    name: string;
    email: string;
  };
  balance: string;
  is_custom: number;
  can_remind: boolean;
  reminder_reason: string;
  till_date_paid: string;
}

export interface InvoiceStats {
  total_invoices: number;
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
