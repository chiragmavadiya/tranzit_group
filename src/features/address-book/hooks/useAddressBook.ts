import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressBookService } from "../services/address-book.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { AddressFormData, AddressBookFilters } from "../types";
import { showToast } from "@/components/ui/custom-toast";

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
                showToast(response.message || "Address added successfully", "success");
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADDRESS_BOOK.LIST });
            } else {
                showToast(response.message || "Failed to add address", "error");
            }
        },
        onError: (error: any) => {
            showToast(error.response?.data?.message || "An error occurred while adding address", "error");
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
                showToast(response.message || "Address updated successfully", "success");
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADDRESS_BOOK.LIST });
                queryClient.removeQueries({ queryKey: QUERY_KEYS.ADDRESS_BOOK.DETAILS(variables.id as any) });
            } else {
                showToast(response.message || "Failed to update address", "error");
            }
        },
        onError: (error: any) => {
            showToast(error.response?.data?.message || "An error occurred while updating address", "error");
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
                showToast(response.message || "Address deleted successfully", "success");
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADDRESS_BOOK.LIST });
            } else {
                showToast(response.message || "Failed to delete address", "error");
            }
        },
        onError: (error: any) => {
            showToast(error.response?.data?.message || "An error occurred while deleting address", "error");
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
        },
        onError: (error: any) => {
            showToast(error.response?.data?.message || "Failed to export address book", "error");
        },
    });
};
