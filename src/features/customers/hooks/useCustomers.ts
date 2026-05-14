import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { customerService } from "../services/customer.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { CustomerFormData } from "../types";

export const useCustomers = (params?: Record<string, any>, enabled: boolean = true) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.ADMIN_CUSTOMERS.LIST, params],
        queryFn: () => customerService.getList(params),
        placeholderData: keepPreviousData,
        enabled: enabled,
        staleTime: 30 * 60 * 1000,
        // select: (data: any) => {
        //     return data?.data?.map((c: any) => ({
        //         value: c.id.toString(),
        //         label: `${c.first_name} ${c.last_name}`
        //     }));
        // }
    });
};

export const useCustomerDetails = (id: number | string) => {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.DETAILS(id),
        queryFn: () => customerService.getDetails(id),
        enabled: !!id,
    });
};

export const useCustomerEditDetails = (id: number | string) => {
    return useQuery({
        queryKey: ["admin", "customers", "edit", id],
        queryFn: () => customerService.getEditDetails(id),
        enabled: !!id,
    });
};

export const useCustomerProfile = (id: number | string) => {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.PROFILE(id),
        queryFn: () => customerService.getProfile(id),
        enabled: !!id,
    });
};

export const useCustomerOrders = (id: number | string, params?: Record<string, any>) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.ADMIN_CUSTOMERS.ORDERS(id), params],
        queryFn: () => customerService.getOrders(id, params),
        enabled: !!id,
    });
};

export const useCustomerTransactions = (id: number | string, params?: Record<string, any>) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.ADMIN_CUSTOMERS.TRANSACTION(id), params],
        queryFn: () => customerService.getTransactions(id, params),
        enabled: !!id,
    });
};

export const useCustomerInvoices = (id: number | string) => {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.INVOICE(id),
        queryFn: () => customerService.getInvoices(id),
        enabled: !!id,
    });
};

export const useCreateCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CustomerFormData) => customerService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.LIST });
        },
    });
};

export const useUpdateCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number | string; data: CustomerFormData }) => customerService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.LIST });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.DETAILS(variables.id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.PROFILE(variables.id) });
        },
    });
};

export const useDeleteCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => customerService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.LIST });
        },
    });
};

export const useVerifyCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => customerService.verify(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.DETAILS(id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.PROFILE(id) });
        },
    });
};

export const useToggleCustomerStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => customerService.toggleStatus(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.LIST });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.DETAILS(id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.PROFILE(id) });
        },
    });
};

export const useZohoSyncCustomer = () => {
    return useMutation({
        mutationFn: ({ id, syncData }: { id: number | string; syncData?: any }) => customerService.zohoSync(id, syncData),
    });
};

export const useExportCustomers = () => {
    return useMutation({
        mutationFn: ({ format, params }: { format: string; params?: Record<string, any> }) => customerService.exportList(format, params),
    });
};

export const useExportCustomerOrders = () => {
    return useMutation({
        mutationFn: ({ id, format, params }: { id: number | string; format: string; params?: Record<string, any> }) => customerService.exportOrders(id, format, params),
    });
};

export const useExportCustomerTransactions = () => {
    return useMutation({
        mutationFn: ({ id, format, params }: { id: number | string; format: string; params?: Record<string, any> }) => customerService.exportTransactions(id, format, params),
    });
};

export const useExportCustomerInvoices = () => {
    return useMutation({
        mutationFn: ({ id, format, params }: { id: number | string; format: string; params?: Record<string, any> }) => customerService.exportInvoices(id, format, params),
    });
};

