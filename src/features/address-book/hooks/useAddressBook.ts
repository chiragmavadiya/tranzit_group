import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressBookService } from "../services/address-book.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { AddressFormData, AddressBookFilters } from "../types";
import { toast } from "sonner";

/**
 * Hook to get the list of address book entries
 */
export const useAddressBookList = (filters: AddressBookFilters) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.ADDRESS_BOOK.LIST, filters],
        queryFn: () => addressBookService.getList(filters),
    });
};

/**
 * Hook to get address book entry details
 */
export const useAddressBookDetails = (id: number | string | undefined) => {
    return useQuery({
        queryKey: QUERY_KEYS.ADDRESS_BOOK.DETAILS(id as any),
        queryFn: () => addressBookService.getDetails(id as any),
        enabled: !!id,
    });
};

/**
 * Hook to create a new address book entry
 */
export const useCreateAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AddressFormData) => addressBookService.create(data),
        onSuccess: (response) => {
            if (response.status) {
                toast.success(response.message || "Address added successfully");
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADDRESS_BOOK.LIST });
            } else {
                toast.error(response.message || "Failed to add address");
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "An error occurred while adding address");
        },
    });
};

/**
 * Hook to update an address book entry
 */
export const useUpdateAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number | string; data: AddressFormData }) =>
            addressBookService.update(id, data),
        onSuccess: (response, variables) => {
            if (response.status) {
                toast.success(response.message || "Address updated successfully");
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADDRESS_BOOK.LIST });
                queryClient.removeQueries({ queryKey: QUERY_KEYS.ADDRESS_BOOK.DETAILS(variables.id as any) });
            } else {
                toast.error(response.message || "Failed to update address");
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "An error occurred while updating address");
        },
    });
};

/**
 * Hook to delete an address book entry
 */
export const useDeleteAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => addressBookService.delete(id),
        onSuccess: (response) => {
            if (response.status) {
                toast.success(response.message || "Address deleted successfully");
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADDRESS_BOOK.LIST });
            } else {
                toast.error(response.message || "Failed to delete address");
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "An error occurred while deleting address");
        },
    });
};

/**
 * Hook to export address book
 */
export const useExportAddressBook = () => {
    return useMutation({
        mutationFn: ({ format, search }: { format: string; search?: string }) =>
            addressBookService.export(format, search),
        onSuccess: ({ blob, filename }) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Export started successfully");
        },
        onError: () => {
            toast.error("Failed to export address book");
        },
    });
};
