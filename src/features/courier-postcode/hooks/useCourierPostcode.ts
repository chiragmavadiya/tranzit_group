import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { courierPostcodeService } from "../services/courier-postcode.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { CourierPostcodeFilters, CourierPostcodeFormData } from "../types";

export const useCourierPostcodes = (params: CourierPostcodeFilters) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.ADMIN_COURIER_POSTCODES.LIST, params],
        queryFn: () => courierPostcodeService.getList(params),
        placeholderData: keepPreviousData,
    });
};

export const useCourierPostcodeDetails = (id: number | string | undefined) => {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN_COURIER_POSTCODES.DETAILS(id as any),
        queryFn: () => courierPostcodeService.getDetails(id as any),
        enabled: !!id,
    });
};

export const useCreateCourierPostcode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CourierPostcodeFormData) => courierPostcodeService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_COURIER_POSTCODES.LIST });
        },
    });
};

export const useUpdateCourierPostcode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number | string; data: CourierPostcodeFormData }) => 
            courierPostcodeService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_COURIER_POSTCODES.LIST });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_COURIER_POSTCODES.DETAILS(variables.id) });
        },
    });
};

export const useDeleteCourierPostcode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number | string) => courierPostcodeService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_COURIER_POSTCODES.LIST });
        },
    });
};

export const useExportCourierPostcodes = () => {
    return useMutation({
        mutationFn: (params: { format: string; search?: string }) => courierPostcodeService.export(params),
    });
};
