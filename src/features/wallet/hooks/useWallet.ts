import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { walletService } from "../services/wallet.service";
import type { AdminTopupParams } from "../types";

export const useAdminTopups = (params?: AdminTopupParams) => {
  return useQuery({
    queryKey: ["admin", "topups", params],
    queryFn: () => walletService.getAdminTopups(params),
    placeholderData: keepPreviousData,
  });
};
