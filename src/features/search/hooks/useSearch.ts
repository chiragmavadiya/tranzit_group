import { useQuery } from "@tanstack/react-query";
import { searchService } from "../services/search.service";
import { QUERY_KEYS } from "@/constants/api.constants";

export const useGlobalSearch = (q: string, limit: number = 10) => {
    return useQuery({
        queryKey: QUERY_KEYS.SEARCH.GLOBAL(q),
        queryFn: () => searchService.globalSearch(q, limit),
        enabled: q?.length >= 2, // Only search if query is at least 2 characters
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
