import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
    AddressFormData,
    AddressBookListResponse,
    AddressBookDetailsResponse,
    AddressBookFilters,
} from "../types";
import type { GenericResponse } from "@/features/auth/auth.types";

export const addressBookService = {
    /**
     * Get list of addresses
     */
    getList: async (filters: AddressBookFilters): Promise<AddressBookListResponse> => {
        const response = await api.get<AddressBookListResponse>(API_ENDPOINTS.ADDRESS_BOOK.BASE, {
            params: filters,
        });
        return response.data;
    },

    /**
     * Create a new address entry
     */
    create: async (data: AddressFormData): Promise<GenericResponse & { data: { id: number } }> => {
        const response = await api.post(API_ENDPOINTS.ADDRESS_BOOK.BASE, data);
        return response.data;
    },

    /**
     * Get address details
     */
    getDetails: async (id: number | string): Promise<AddressBookDetailsResponse> => {
        const response = await api.get<AddressBookDetailsResponse>(`${API_ENDPOINTS.ADDRESS_BOOK.BASE}/${id}`);
        return response.data;
    },

    /**
     * Update an address entry
     */
    update: async (id: number | string, data: AddressFormData): Promise<GenericResponse> => {
        const response = await api.put(`${API_ENDPOINTS.ADDRESS_BOOK.BASE}/${id}`, data);
        return response.data;
    },

    /**
     * Delete an address entry
     */
    delete: async (id: number | string): Promise<GenericResponse> => {
        const response = await api.delete<GenericResponse>(`${API_ENDPOINTS.ADDRESS_BOOK.BASE}/${id}`);
        return response.data;
    },

    /**
     * Search addresses
     */
    search: async (query: string): Promise<AddressBookListResponse> => {
        const response = await api.get<AddressBookListResponse>(API_ENDPOINTS.ADDRESS_BOOK.SEARCH, {
            params: { q: query },
        });
        return response.data;
    },

    /**
     * Export address book
     */
    export: async (format: string, search?: string): Promise<{ blob: Blob; filename: string }> => {
        const response = await api.get(API_ENDPOINTS.ADDRESS_BOOK.EXPORT, {
            params: { format, search },
            responseType: 'blob',
        });

        const disposition = response.headers['content-disposition'];
        let filename = `address_book_export_${new Date().getTime()}.${format}`;

        if (disposition && disposition.indexOf('filename=') !== -1) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }

        return { blob: response.data, filename };
    },
};
