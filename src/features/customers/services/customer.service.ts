import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
    CustomerListResponse,
    CustomerFormData,
    GenericResponse,
    GenericDataResponse,
    CustomerDetailsResponse,
    CustomerProfileResponse,
    CustomerOrdersResponse,
    CustomerTransactionsResponse,
    CustomerInvoicesResponse,
} from "../types";

export const customerService = {
    /**
     * Get list of customers
     */
    getList: async (params?: Record<string, any>): Promise<CustomerListResponse> => {
        const response = await api.get<CustomerListResponse>(API_ENDPOINTS.ADMIN_CUSTOMERS.BASE, { params });
        return response.data;
    },

    /**
     * Create a new customer
     */
    create: async (data: CustomerFormData): Promise<GenericDataResponse<{ id: number; first_name: string; last_name: string; email: string }>> => {
        const response = await api.post(API_ENDPOINTS.ADMIN_CUSTOMERS.BASE, data);
        return response.data;
    },

    /**
     * Get customer details
     */
    getDetails: async (id: number | string): Promise<CustomerDetailsResponse> => {
        const response = await api.get<CustomerDetailsResponse>(API_ENDPOINTS.ADMIN_CUSTOMERS.DETAILS(id));
        return response.data;
    },

    /**
     * Get customer edit details
     */
    getEditDetails: async (id: number | string): Promise<GenericDataResponse<CustomerFormData>> => {
        const response = await api.get<GenericDataResponse<CustomerFormData>>(API_ENDPOINTS.ADMIN_CUSTOMERS.DETAILS(id));
        return response.data;
    },

    /**
     * Get customer profile
     */
    getProfile: async (id: number | string): Promise<CustomerProfileResponse> => {
        const response = await api.get<CustomerProfileResponse>(API_ENDPOINTS.ADMIN_CUSTOMERS.PROFILE(id));
        return response.data;
    },

    /**
     * Get customer orders
     */
    getOrders: async (id: number | string, params?: Record<string, any>): Promise<CustomerOrdersResponse> => {
        const response = await api.get<CustomerOrdersResponse>(API_ENDPOINTS.ADMIN_CUSTOMERS.ORDERS(id), { params });
        return response.data;
    },

    /**
     * Get customer transactions
     */
    getTransactions: async (id: number | string, params?: Record<string, any>): Promise<CustomerTransactionsResponse> => {
        const response = await api.get<CustomerTransactionsResponse>(API_ENDPOINTS.ADMIN_CUSTOMERS.TRANSACTION(id), { params });
        return response.data;
    },

    /**
     * Update customer
     */
    update: async (id: number | string, data: CustomerFormData): Promise<GenericDataResponse<{ id: number; first_name: string; last_name: string; email: string }>> => {
        const response = await api.put(API_ENDPOINTS.ADMIN_CUSTOMERS.DETAILS(id), data);
        return response.data;
    },

    /**
     * Get customer invoices
     */
    getInvoices: async (id: number | string): Promise<CustomerInvoicesResponse> => {
        const response = await api.get<CustomerInvoicesResponse>(API_ENDPOINTS.ADMIN_CUSTOMERS.INVOICE(id));
        return response.data;
    },

    /**
     * Delete customer
     */
    delete: async (id: number | string): Promise<any> => {
        const response = await api.delete(API_ENDPOINTS.ADMIN_CUSTOMERS.DETAILS(id));
        return response.data;
    },

    /**
     * Verify customer
     */
    verify: async (id: number | string): Promise<GenericResponse> => {
        const response = await api.post(API_ENDPOINTS.ADMIN_CUSTOMERS.VERIFY(id));
        return response.data;
    },

    /**
     * Toggle customer status
     */
    toggleStatus: async (id: number | string): Promise<GenericDataResponse<{ customer_id: number; status: string }>> => {
        const response = await api.patch(API_ENDPOINTS.ADMIN_CUSTOMERS.TOGGLE_STATUS(id));
        return response.data;
    },

    /**
     * Sync customer to Zoho
     */
    zohoSync: async (id: number | string, syncData?: any): Promise<GenericResponse> => {
        const response = await api.post(API_ENDPOINTS.ADMIN_CUSTOMERS.ZOHO_SYNC(id), { syncData });
        return response.data;
    },

    /**
     * Export list of customers
     */
    exportList: async (format: string, params?: Record<string, any>): Promise<{ blob: Blob; filename: string }> => {
        const response = await api.get(API_ENDPOINTS.ADMIN_CUSTOMERS.EXPORT, {
            params: { format, ...params },
            responseType: 'blob',
        });

        const disposition = response.headers['content-disposition'];
        let filename = `customers_export_${new Date().getTime()}.${format}`;

        if (disposition && disposition.indexOf('filename=') !== -1) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }

        return { blob: response.data, filename };
    },

    /**
     * Export customer orders
     */
    exportOrders: async (id: number | string, format: string, params?: Record<string, any>): Promise<{ blob: Blob; filename: string }> => {
        const response = await api.get(API_ENDPOINTS.ADMIN_CUSTOMERS.ORDERS_EXPORT(id), {
            params: { format, ...params },
            responseType: 'blob',
        });

        const disposition = response.headers['content-disposition'];
        let filename = `customer_${id}_orders_${new Date().getTime()}.${format}`;

        if (disposition && disposition.indexOf('filename=') !== -1) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }

        return { blob: response.data, filename };
    },

    /**
     * Export customer transactions
     */
    exportTransactions: async (id: number | string, format: string, params?: Record<string, any>): Promise<{ blob: Blob; filename: string }> => {
        const response = await api.get(API_ENDPOINTS.ADMIN_CUSTOMERS.TRANSACTION_EXPORT(id), {
            params: { format, ...params },
            responseType: 'blob',
        });

        const disposition = response.headers['content-disposition'];
        let filename = `customer_${id}_transactions_${new Date().getTime()}.${format}`;

        if (disposition && disposition.indexOf('filename=') !== -1) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }

        return { blob: response.data, filename };
    },

    /**
     * Export customer invoices
     */
    exportInvoices: async (id: number | string, format: string, params?: Record<string, any>): Promise<{ blob: Blob; filename: string }> => {
        const response = await api.get(API_ENDPOINTS.ADMIN_CUSTOMERS.INVOICE_EXPORT(id), {
            params: { format, ...params },
            responseType: 'blob',
        });

        const filename = `invoices_${new Date().getTime()}.${format}`;
        return { blob: response.data, filename };
    },
};
