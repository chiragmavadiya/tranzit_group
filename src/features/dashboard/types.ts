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

export interface TransactionMetrics {
  last28days: Transaction[];
  lastmonth: Transaction[];
  lastyear: Transaction[];
}

export interface CustomerMetrics {
  totalOrder: number;
  totalSpend: string | number;
  pendingInvoiceCount: number;
  transactions: TransactionMetrics;
  order: {
    total: number;
    printed?: number;
    payment_pending?: number;
    partial?: number;
    unpaid?: number;
    draft?: number;
  };
}

export interface BarChartData {
  label: string;
  total_orders: number;
  total_tranzit_group_orders: number;
  total_byo_courier_orders: number;
  total_paid_amount: number;
  total_tranzit_group_markup: number;
  total_tranzit_group_pickup_charge: number;
  total_tranzit_group_revenue: number;
  total_customer_spending: number;
}

export interface AdminMetrics {
  totalOrder: number;
  totalCustomers: number;
  pendingInvoiceCount?: number;
  totalInvoiceCount?: number;
  undeliveredOrder?: number;
  totalUndeliveredOrder?: number;
  last28Days?: any[];
  lastMonth?: any[];
  lastYear?: any[];
  last28DaysCount?: number;
  lastMonthCount?: number;
  lastYearCount?: number;
  totalMarginAmount: string | number;
  totalOrderAmount: string | number;
  totalInvoiceAmount: string | number;
  totalPaidInvoiceAmount: string | number;
  totalUnpaidInvoiceAmount: string | number;
  totalTopupAmount: string | number;
  totalPickupChargeAmount?: string | number;
  australia_post_estimated_billing?: string | number;
  dateFrom?: string;
  dateTo?: string;
  dateError?: null | string;
  transactions?: any[];
  periodLabels?: Record<string, string>;
  statsByPeriod?: Record<string, any>;
  financeByPeriod?: Record<string, any>;
  toDateFrom?: string;
  toDateTo?: string;
  toDateError?: null | string;
  activePeriod?: string;
  chart?: {
    bars: BarChartData[];
    summary?: {
      total_orders: number;
      total_customer_spending: number;
      total_tranzit_group_revenue: number;
    };
  }
}

export type DashboardMetrics = CustomerMetrics | AdminMetrics;

export interface DashboardMetricsResponse {
  status: boolean;
  message: string;
  data: DashboardMetrics;
}
