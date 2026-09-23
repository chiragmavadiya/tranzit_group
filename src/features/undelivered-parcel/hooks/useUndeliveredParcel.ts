import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import { undeliveredParcelService } from "../services/undelivered-parcel.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { UndeliveredParcelFilters } from "../types";
import { showToast } from "@/components/ui/custom-toast";
import { downloadFile } from "@/lib/utils";

export const useUndeliveredParcels = (filters: UndeliveredParcelFilters) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.REPORTS.UNDELIVERED_PARCELS, filters],
        queryFn: () => undeliveredParcelService.getList(filters),
        placeholderData: keepPreviousData,
    });
};

export function useExportUndeliveredParcels() {
    return useMutation({
        mutationFn: (params: { format: string; search?: string }) =>
            undeliveredParcelService.export(params),
        onSuccess: ({ blob, filename }) => {
            downloadFile(blob, filename)
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to export undelivered parcels", "error");
        }
    });
}
