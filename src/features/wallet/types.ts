export type TransactionType = 'Credit' | 'Debit';

export interface WalletTransaction {
  id: string;
  type: TransactionType;
  amount: string;
  reason: string;
  transaction_id: string;
  date: string;
}

export interface WalletStats {
  credits: string;
  debits: string;
  balance: string;
}
