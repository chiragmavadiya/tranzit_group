import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import { walletService } from "../services/wallet.service";
import type { WalletTransactionsParams, WalletExportParams } from "../types";
import { showToast } from "@/components/ui/custom-toast";

export const useWalletTransactions = (params?: WalletTransactionsParams) => {
  return useQuery({
    queryKey: ["wallet", "transactions", params],
    queryFn: () => walletService.getTransactions(params),
    placeholderData: keepPreviousData,
  });
};

export const useWalletExport = () => {
  return useMutation({
    mutationFn: (params: WalletExportParams) => walletService.exportTransactions(params),
    onSuccess: ({ blob, filename }) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast("Transactions exported successfully", "success");
    },
    onError: (error: any) => {
      showToast(error.message || "Failed to export transactions", "error");
    },
  });
};
