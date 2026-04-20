export interface Transaction {
  id: string;
  type: 'debit' | 'credit';
  title: string;
  subtitle: string;
  amount: number;
  date: string;
}

export interface DashboardOrder {
  id: number;
  orderNumber: string;
  suburb: string;
  amount: number | string;
  status: 'Printed' | 'Payment Pending' | 'Partial' | 'Unpaid' | 'Draft';
}

export interface DashboardInvoice {
  id: number;
  user_id: number;
  invoice_number: string;
  amount: string;
  invoice_date: string;
  amount_paid: string;
  status: 'partial' | 'unpaid' | 'draft';
  user: {
    name: string;
    email: string;
    id: number;
  };
  balance: number;
  DT_RowIndex: number;
}

export interface CustomerMetrics {
  totalOrder: number;
  totalSpend: string | number;
  pendingInvoiceCount: number;
  transactions: {
    last28days: number;
    lastmonth: number;
    lastyear: number;
  };
  order: {
    total: number;
    printed?: number;
    payment_pending?: number;
    partial?: number;
    unpaid?: number;
    draft?: number;
  };
}

export interface AdminMetrics {
  totalOrder: number;
  totalCustomers: number;
  pendingInvoiceCount: number;
  undeliveredOrder: number;
  last28Days: any[];
  lastMonth: any[];
  lastYear: any[];
  totalMarginAmount: string;
  totalOrderAmount: string;
  totalInvoiceAmount: string;
  totalPaidInvoiceAmount: string;
  totalUnpaidInvoiceAmount: string;
  totalTopupAmount: number;
  periodLabels: Record<string, string>;
  statsByPeriod: Record<string, any>;
  financeByPeriod: Record<string, any>;
  toDateFrom: string;
  toDateTo: string;
  toDateError: null | string;
  activePeriod: string;
}

export type DashboardMetrics = CustomerMetrics | AdminMetrics;

export interface DashboardMetricsResponse {
  status: boolean;
  message: string;
  data: DashboardMetrics;
}
