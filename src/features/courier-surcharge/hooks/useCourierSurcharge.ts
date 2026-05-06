import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courierSurchargeService } from "../services/courier-surcharge.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { CourierSurchargeFilters, CourierSurchargeFormData } from "../types";
import { showToast } from "@/components/ui/custom-toast";

export function useCourierSurcharges(filters: CourierSurchargeFilters) {
    return useQuery({
        queryKey: [...QUERY_KEYS.ADMIN_COURIER_SURCHARGES.GLOBAL_COURIERS.slice(0, -1), "list", filters],
        queryFn: () => courierSurchargeService.getList(filters),
    });
}

export function useCourierSurchargeDetails(id: number | string | null) {
    return useQuery({
        queryKey: [...QUERY_KEYS.ADMIN_COURIER_SURCHARGES.GLOBAL_COURIERS.slice(0, -1), "details", id],
        queryFn: () => courierSurchargeService.getDetails(id!),
        enabled: !!id,
    });
}

export function useCourierSurchargeMutations() {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: CourierSurchargeFormData) => courierSurchargeService.create(data),
        onSuccess: (res) => {
            if (res.status) {
                showToast(res.message || "Surcharge created successfully", "success");
                queryClient.invalidateQueries({ queryKey: ["admin", "courier-surcharges"] });
            } else {
                showToast(res.message || "Failed to create surcharge", "error");
            }
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to create surcharge", "error");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number | string, data: CourierSurchargeFormData }) =>
            courierSurchargeService.update(id, data),
        onSuccess: (res) => {
            if (res.status) {
                showToast(res.message || "Surcharge updated successfully", "success");
                queryClient.invalidateQueries({ queryKey: ["admin", "courier-surcharges"] });
            } else {
                showToast(res.message || "Failed to update surcharge", "error");
            }
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update surcharge", "error");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number | string) => courierSurchargeService.delete(id),
        onSuccess: (res) => {
            if (res.status) {
                showToast(res.message || "Surcharge deleted successfully", "success");
                queryClient.invalidateQueries({ queryKey: ["admin", "courier-surcharges"] });
            } else {
                showToast(res.message || "Failed to delete surcharge", "error");
            }
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to delete surcharge", "error");
        }
    });

    return {
        createSurcharge: createMutation.mutate,
        isCreating: createMutation.isPending,
        updateSurcharge: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
        deleteSurcharge: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    };
}

export function useExportCourierSurcharge() {
    return useMutation({
        mutationFn: (params: { format: string; search?: string }) =>
            courierSurchargeService.export(params),
        onSuccess: (blob, params) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Courier_Surcharges_${new Date().getTime()}.${params.format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to export courier surcharges", "error");
        }
    });
}
