import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courierSurchargeService } from "../services/courier-surcharge.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import { toast } from "sonner";
import type { CourierSurchargeFilters, CourierSurchargeFormData } from "../types";

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
                toast.success(res.message || "Surcharge created successfully");
                queryClient.invalidateQueries({ queryKey: ["admin", "courier-surcharges"] });
            } else {
                toast.error(res.message || "Failed to create surcharge");
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "An error occurred");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number | string, data: CourierSurchargeFormData }) => 
            courierSurchargeService.update(id, data),
        onSuccess: (res) => {
            if (res.status) {
                toast.success(res.message || "Surcharge updated successfully");
                queryClient.invalidateQueries({ queryKey: ["admin", "courier-surcharges"] });
            } else {
                toast.error(res.message || "Failed to update surcharge");
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "An error occurred");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number | string) => courierSurchargeService.delete(id),
        onSuccess: (res) => {
            if (res.status) {
                toast.success(res.message || "Surcharge deleted successfully");
                queryClient.invalidateQueries({ queryKey: ["admin", "courier-surcharges"] });
            } else {
                toast.error(res.message || "Failed to delete surcharge");
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "An error occurred");
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
            toast.error(error.message || "Failed to export courier surcharges");
        }
    });
}
