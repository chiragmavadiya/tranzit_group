export type TransactionType = 'Credit' | 'Debit';

export interface WalletTransaction {
  id: string | number;
  type: TransactionType;
  amount: string | number;
  reason: string;
  transaction_id: string;
  date: string;
  customer_name?: string;
}

export interface WalletStats {
  credits: string;
  debits: string;
  balance: string;
}

export interface AdminTopupParams {
  customer?: string | number;
  per_page?: number;
  page?: number;
  status?: string;
  search?: string;
}

export interface AdminTopupResponse {
  status: boolean;
  message: string;
  data: WalletTransaction[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}
