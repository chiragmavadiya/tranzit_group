import { useEffect } from "react";
import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { walletService } from "../services/wallet.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { AdminTopupParams } from "../types";
import { useAppDispatch } from "@/hooks/store.hooks";
import { setWalletSummary } from "../walletSlice";
import { downloadFile } from "@/lib/utils";

export const useAdminTopups = (params?: AdminTopupParams) => {
  return useQuery({
    queryKey: ["admin", "topups", params],
    queryFn: () => walletService.getAdminTopups(params),
    placeholderData: keepPreviousData,
  });
};

export const useWalletSummary = (enabled: boolean = true) => {
  const dispatch = useAppDispatch();
  const query = useQuery({
    queryKey: QUERY_KEYS.WALLET.SUMMARY,
    queryFn: () => walletService.getWalletSummary(),
    enabled,
  });

  useEffect(() => {
    if (query.data?.data) {
      dispatch(setWalletSummary(query.data.data));
    }
  }, [query.data, dispatch]);

  return query;
};


export const useExportAdminTopups = () => {
  return useMutation({
    mutationFn: ({ format }: { format: string; }) =>
      walletService.exportAdminTopups({ format }),
    onSuccess: ({ blob, filename }) => {
      downloadFile(blob, filename)
    }
  })
}

