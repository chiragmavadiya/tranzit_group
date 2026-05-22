import { MutationCache, QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
            retry: 1,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 0,
        },
    },
    mutationCache: new MutationCache({
        onError: (error: any) => {
            // If Axios already handled it globally, don't show a second toast notification
            if (error.isHandledGlobally) return;

            //   showToast(error.response?.data?.message || "An error occurred", "error");
        }
    })
});
