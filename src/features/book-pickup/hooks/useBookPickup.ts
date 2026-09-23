import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { bookPickupService } from "../services/book-pickup.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { BookPickupParams, CreatePickupRequest } from "../types";
import { downloadFile } from "@/lib/utils";
import { showToast } from "@/components/ui/custom-toast";

export const useBookPickups = (params?: BookPickupParams) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.ADMIN_BOOK_PICKUP.LIST, params],
        queryFn: () => bookPickupService.getList(params),
        placeholderData: keepPreviousData,
    });
};

export const useBookPickupCounts = () => {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN_BOOK_PICKUP.COUNTS,
        queryFn: () => bookPickupService.getCounts(),
    });
};

export const useCreatePickup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreatePickupRequest) => bookPickupService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_BOOK_PICKUP.LIST });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_BOOK_PICKUP.COUNTS });
        },
    });
};

export const useExportBookPickup = () => {
    return useMutation({
        mutationFn: ({ format, book }: { format: string; book: number }) =>
            bookPickupService.export(format, book),
        onSuccess: ({ blob, filename }) => {
            downloadFile(blob, filename)
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to export book pickup", "error");
        },
    });
};