import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { AdminTopupParams, AdminTopupResponse, WalletTransactionsParams, WalletTransactionsResponse, WalletExportParams, WalletSummaryResponse } from "../types";
import { getFileName } from "@/lib/utils";

export const walletService = {
  getAdminTopups: async (params?: AdminTopupParams): Promise<AdminTopupResponse> => {
    const response = await api.get("/admin/top-ups", { params });
    return response.data;
  },

  getTransactions: async (params?: WalletTransactionsParams): Promise<WalletTransactionsResponse> => {
    const response = await api.get("/wallet/transactions", { params });
    return response.data;
  },

  getWalletSummary: async (): Promise<WalletSummaryResponse> => {
    const response = await api.get(API_ENDPOINTS.WALLET.SUMMARY);
    return response.data;
  },

  downloadTransactionReceipt: async (transactionId: string | number): Promise<{ blob: Blob; filename: string }> => {
    const response = await api.get(API_ENDPOINTS.WALLET.RECEIPT(transactionId), {
      responseType: 'blob',
    });
    const filename = `Receipt_${transactionId}.pdf`;
    return { blob: response.data, filename };
  },

  exportTransactions: async (params: WalletExportParams): Promise<{ blob: Blob; filename: string }> => {
    const response = await api.get("/wallet/transactions/export", {
      params,
      responseType: 'blob'
    });

    const format = params.format === "pdf" ? "pdf" : params.format === "csv" ? "csv" : "xls";
    const filename = getFileName(response) || `wallet-transactions_${new Date().getTime()}.${format}`;

    return { blob: response.data, filename };
  },

  exportAdminTopups: async ({ format }: { format: string }): Promise<{ blob: Blob; filename: string }> => {
    const response = await api.get("/admin/top-ups/export", {
      params: { format },
      responseType: 'blob'
    });

    const fileformat = format === "pdf" ? "pdf" : format === "csv" ? "csv" : "xls";
    const filename = getFileName(response) || `admin-topups_${new Date().getTime()}.${fileformat}`;

    return { blob: response.data, filename };
  },
};
