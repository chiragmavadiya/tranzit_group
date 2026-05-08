import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { bookPickupService } from "../services/book-pickup.service";
import type { BookPickupParams, CreatePickupRequest } from "../types";

export const useBookPickups = (params?: BookPickupParams) => {
    return useQuery({
        queryKey: ["admin", "book-pickup", params],
        queryFn: () => bookPickupService.getList(params),
        placeholderData: keepPreviousData,
    });
};

export const useCreatePickup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreatePickupRequest) => bookPickupService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "book-pickup"] });
        },
    });
};
