import type { InvoiceStatus } from '../types';

export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
  Paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Partial: 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
  Draft: 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400',
  Pending: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  Unpaid: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  Send: 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400',
  Overdue: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
};

export const TERMS_CONDITIONS = [
  "Payment is due within 7 days of the invoice date.",
  "Late payments may incur a 1.5% interest fee per month.",
  "Ownership of deliverables transfers upon receipt of full payment.",
  "Any disputes should be reported within 7 business days of receiving the invoice.",
  "Either party may terminate with 7 days' notice."
];

export const BANKING_DETAILS = {
  bank_name: "Commonwealth Bank",
  account_name: "Tranzit Group Pty Ltd",
  bsb: "063 138",
  account_number: "1112 4733"
};

export const COMPANY_DETAILS = {
  name: "Tranzit Group Pty Ltd",
  abn: "12 690 967 198",
  address: "12B Bass Ct, Keysborough VIC 3173",
  email: "accounts@tranzitgroup.com.au"
};