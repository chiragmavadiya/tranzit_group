import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { xeroService } from "../services/xero.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import { showToast } from "@/components/ui/custom-toast";

export const useXeroStatus = (options?: { refetchInterval?: number | false; enabled?: boolean }) => {
    return useQuery({
        queryKey: QUERY_KEYS.XERO.STATUS,
        queryFn: xeroService.getStatus,
        refetchInterval: options?.refetchInterval ?? false,
        enabled: options?.enabled ?? true,
    });
};

/**
 * Contacts are only requested once Xero reports a live connection — calling the endpoint
 * while disconnected fails and the API interceptor would surface a toast to the admin.
 *
 * `xeroContactId` is the contact already assigned to the record being edited: the API filters
 * assigned contacts out of the list, so it has to be passed back to keep it selectable.
 */
export const useXeroContacts = (enabled = true, xeroContactId?: string) => {
    const statusQuery = useXeroStatus({ enabled });
    const isConnected = !!statusQuery.data?.data?.connected;

    const contactsQuery = useQuery({
        queryKey: QUERY_KEYS.XERO.CONTACTS(xeroContactId),
        queryFn: () => xeroService.getContacts(xeroContactId),
        enabled: enabled && isConnected,
        staleTime: 5 * 60 * 1000,
    });

    return {
        contacts: contactsQuery.data?.data?.contacts || [],
        isConnected,
        isLoading: statusQuery.isLoading || contactsQuery.isLoading,
    };
};

export const useXeroConnect = () => {
    return useMutation({
        mutationFn: () => xeroService.connect(),
    });
};

export const useXeroSyncInvoice = () => {
    return useMutation({
        mutationFn: (invoiceId: string | number) => xeroService.syncInvoice(invoiceId),
        onSuccess: (response) => {
            showToast(response.message || "Invoice synced to Xero", "success");
        },
    });
};

export const useXeroDisconnect = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => xeroService.disconnect(),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.XERO.STATUS });
            showToast(response.message || "Xero disconnected", "success");
        },
    });
};
