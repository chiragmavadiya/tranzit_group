import { api } from "@/services/api";
import type { AdminTopupParams, AdminTopupResponse, WalletTransactionsParams, WalletTransactionsResponse, WalletExportParams } from "../types";

export const walletService = {
  getAdminTopups: async (params?: AdminTopupParams): Promise<AdminTopupResponse> => {
    const response = await api.get("/admin/top-ups", { params });
    return response.data;
  },

  getTransactions: async (params?: WalletTransactionsParams): Promise<WalletTransactionsResponse> => {
    const response = await api.get("/wallet/transactions", { params });
    return response.data;
  },

  exportTransactions: async (params: WalletExportParams): Promise<{ blob: Blob; filename: string }> => {
    const response = await api.get("/wallet/transactions/export", {
      params,
      responseType: 'blob'
    });

    // Extract filename from Content-Disposition header
    const disposition = response.headers['content-disposition'];
    let filename = `wallet-transactions_${new Date().getTime()}.${params.format}`;

    if (disposition && disposition.indexOf('filename=') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    return { blob: response.data, filename };
  },
};
