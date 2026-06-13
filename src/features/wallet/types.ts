export type TransactionType = 'Credit' | 'Debit';

export interface WalletTransaction {
  id?: number | string;
  transaction_type: string;
  amount: number | string;
  reason: string;
  transaction_id: string;
  transaction_date_time: string;
}


export interface WalletTransactionsParams {
  search?: string;
  transaction_type?: string | number;
  page?: number;
  per_page?: number;
  start_date?: string;
  end_date?: string;
}

export interface WalletTransactionsResponse {
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
  data: any[];
  summary: {
    balance: number;
    total_credit: number;
    total_debit: number;
  };
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface WalletExportParams {
  format: 'pdf' | 'csv' | 'excel';
  search?: string;
  transaction_type?: string | number;
  start_date?: string;
  end_date?: string;
}

export interface WalletSummaryResponse {
  status: boolean;
  message: string;
  data: {
    wallet_balance: number;
    total_credit: number;
    total_debit: number;
  };
}

