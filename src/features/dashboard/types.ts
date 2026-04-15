import type { LucideIcon } from 'lucide-react';

export interface StatItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subValue?: string;
  color?: string;
}

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
