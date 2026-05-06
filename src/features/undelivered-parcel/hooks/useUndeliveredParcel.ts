import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import { undeliveredParcelService } from "../services/undelivered-parcel.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { UndeliveredParcelFilters } from "../types";
import { showToast } from "@/components/ui/custom-toast";

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
        onSuccess: (blob, params) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Undelivered_Parcels_${new Date().getTime()}.${params.format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to export undelivered parcels", "error");
        }
    });
}
