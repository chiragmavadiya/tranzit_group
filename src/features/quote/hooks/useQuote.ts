import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { quoteService } from "../services/quote.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { QuoteFilters, GetQuoteServicesPayload, CreateQuotePayload } from "../types";

export const useAdminQuotes = (params: QuoteFilters) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.ADMIN_QUOTES.LIST, params],
        queryFn: () => quoteService.getList(params),
        placeholderData: keepPreviousData,
    });
};

export const useQuoteDetails = (id: number | string | undefined) => {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN_QUOTES.DETAILS(id as any),
        queryFn: () => quoteService.getDetails(id as any),
        enabled: !!id,
    });
};

export const useGetQuoteServices = () => {
    return useMutation({
        mutationFn: (data: GetQuoteServicesPayload) => quoteService.getServices(data),
    });
};

export const useCreateQuote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateQuotePayload) => quoteService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_QUOTES.LIST });
        },
    });
};

export const useExportQuotes = () => {
    return useMutation({
        mutationFn: (params: { format: string; search?: string }) => quoteService.export(params),
    });
};
