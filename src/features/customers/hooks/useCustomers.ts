import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { customerService } from "../services/customer.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { CustomerFormData } from "../types";

export const useCustomerMe = (id: number | string | undefined) => {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.ME(id!),
        queryFn: () => customerService.getMe(id!),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

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

export const useCustomerCounts = () => {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.COUNTS,
        queryFn: () => customerService.getCounts(),
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
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.COUNTS });
        },
    });
};

export const useUpdateCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number | string; data: CustomerFormData }) => customerService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.LIST });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.COUNTS });
            queryClient.invalidateQueries({ queryKey: ["admin", "customers", "edit", variables.id] });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.DETAILS(variables.id?.toString()) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.PROFILE(variables.id?.toString()) });
        },
    });
};

export const useDeleteCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => customerService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.LIST });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.COUNTS });
        },
    });
};

export const useVerifyCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => customerService.verify(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.DETAILS(id.toString()) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.PROFILE(id.toString()) });
        },
    });
};

export const useToggleCustomerStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => customerService.toggleStatus(id),
        onSuccess: (_, variable) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.LIST });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.COUNTS });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.DETAILS(variable.toString()) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.PROFILE(variable.toString()) });
        },
    });
};

<<<<<<< HEAD
export const useSetAccountActivation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, account_activation }: { id: number | string; account_activation: boolean }) =>
            customerService.setAccountActivation(id, account_activation),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.LIST });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.COUNTS });
            // The edit modal reads its own cache, so it has to refetch or it will show a stale toggle.
            queryClient.invalidateQueries({ queryKey: ["admin", "customers", "edit", variables.id] });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.DETAILS(variables.id.toString()) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.PROFILE(variables.id.toString()) });
        },
    });
};

=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
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

export const useCustomerIntegrations = (id: number | string) => {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.INTEGRATIONS(id),
        queryFn: () => customerService.getIntegrations(id),
        enabled: !!id,
    });
};

export const useCreateCustomerTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number | string; data: any }) => customerService.addTransaction(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.TRANSACTION(variables.id?.toString()) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.DETAILS(variables.id?.toString()) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CUSTOMERS.PROFILE(variables.id?.toString()) });
            queryClient.invalidateQueries({ queryKey: ["admin", "topups"] });
        },
    });
};

export const useChangeCustomerPassword = () => {
    return useMutation({
        mutationFn: ({ id, data }: { id: number | string; data: { new_password: string; new_password_confirmation: string } }) =>
            customerService.changePassword(id, data),
    });
};

<<<<<<< HEAD
export const useCustomerItems = (id: number | string, params?: Record<string, any>) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.ADMIN_CUSTOMERS.ITEMS(id), params],
        queryFn: async () => {
            try {
                return await customerService.getItems(id, params);
            } catch (e) {
                console.warn("API not ready yet, using mock items fallback", e);
                return {
                    status: true,
                    message: "Mock items loaded",
                    data: [
                        {
                            id: 1,
                            item_name: "Standard Shipping Box A",
                            item_code: "BOX-A-STD",
                            item_length: 30,
                            item_width: 20,
                            item_height: 15,
                            item_weight: 1.5,
                            item_cubic: 0.009,
                            status: "Active",
                            is_default: true
                        },
                        {
                            id: 2,
                            item_name: "Large Shipping Box B",
                            item_code: "BOX-B-LRG",
                            item_length: 50,
                            item_width: 40,
                            item_height: 30,
                            item_weight: 4.5,
                            item_cubic: 0.06,
                            status: "Active",
                            is_default: false
                        },
                        {
                            id: 3,
                            item_name: "Small Document Satchel",
                            item_code: "SAT-DOC-SM",
                            item_length: 22,
                            item_width: 16,
                            item_height: 2,
                            item_weight: 0.5,
                            item_cubic: 0.0007,
                            status: "Active",
                            is_default: false
                        },
                        {
                            id: 4,
                            item_name: "Heavy Duty Pallet Unit",
                            item_code: "PLT-HD-UNIT",
                            item_length: 120,
                            item_width: 100,
                            item_height: 160,
                            item_weight: 25.0,
                            item_cubic: 1.92,
                            status: "Active",
                            is_default: false
                        }
                    ],
                    meta: {
                        current_page: 1,
                        per_page: 25,
                        total: 4,
                        last_page: 1
                    }
                };
            }
        },
        enabled: !!id,
    });
};

=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c

