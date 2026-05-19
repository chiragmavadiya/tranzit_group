import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { bookPickupService } from "../services/book-pickup.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { BookPickupParams, CreatePickupRequest } from "../types";

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
