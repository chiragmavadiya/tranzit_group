import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { OrdersResponse } from "@/features/orders/types";
import type {
    CreateOrderRequest,
    CreateOrderResponse,
    QuoteServicesRequest,
    QuoteServicesResponse,
    WalletCheckResponse,
    PaymentInfoResponse,
    OrderCountsResponse
} from "../types/api.types";
import type { OrderDetailData } from "../types/order-details.types";
import { getFileName } from "@/lib/utils";

export const ordersService = {
    /**
     * Get customer orders with optional filters and pagination
     */
    getOrders: async (params?: {
        status?: string;
        start_date?: Date | string | undefined;
        end_date?: Date | string | undefined;
        per_page?: number;
        page?: number;
        search?: string;
    }): Promise<OrdersResponse> => {
        const response = await api.get<OrdersResponse>(API_ENDPOINTS.ORDERS.LIST, { params });
        return response.data;
    },

    /**
     * Get details for a specific order
     */
    getOrderDetails: async (orderNumber: string | number): Promise<{ status: boolean; message: string; data: OrderDetailData }> => {
        const response = await api.get(API_ENDPOINTS.ORDERS.DETAILS(orderNumber));
        return response.data;
    },

    /**
     * Create a new order
     */
    createOrder: async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
        const response = await api.post(data.is_own ? API_ENDPOINTS.ORDERS.CREATE_OWN_COURIER : API_ENDPOINTS.ORDERS.CREATE, data);
        return response.data;
    },

    /**
     * Create an order with user's own courier
     */
    createOwnCourierOrder: async (data: any): Promise<any> => {
        const response = await api.post(API_ENDPOINTS.ORDERS.CREATE_OWN_COURIER, data);
        return response.data;
    },

    /**
     * Get available courier services for a quote
     */
    getQuoteServices: async (data: QuoteServicesRequest): Promise<QuoteServicesResponse> => {
        const response = await api.post(API_ENDPOINTS.ORDERS.GET_QUOTE_SERVICES, data);
        return response.data;
    },

    /**
     * Check wallet balance against a total amount
     */
    checkWalletBalance: async (total: number): Promise<WalletCheckResponse> => {
        const response = await api.post(API_ENDPOINTS.ORDERS.WALLET_CHECK, { total });
        return response.data;
    },

    /**
     * Pay for an order using wallet balance
     */
    payWithWallet: async (orderNumber: string | number): Promise<{ status: boolean; message: string; redirect: string }> => {
        const response = await api.post(API_ENDPOINTS.ORDERS.PAY_WITH_WALLET(orderNumber));
        return response.data;
    },

    /**
     * Get payment information for an order
     */
    getPaymentInfo: async (orderNumber: string | number): Promise<PaymentInfoResponse> => {
        const response = await api.get(API_ENDPOINTS.ORDERS.PAYMENT_INFO(orderNumber));
        return response.data;
    },

    /**
     * Cancel an order
     */
    cancelOrder: async (orderId: string | number, data: any): Promise<any> => {
        const response = await api.post(API_ENDPOINTS.ORDERS.CANCEL(orderId), data);
        return response.data;
    },

    /**
     * Consign an order
     */
    consignOrder: async (orderId: string | number, data: any, isAdmin: boolean = false): Promise<any> => {
        const response = await api.post(API_ENDPOINTS.ORDERS.CONSIGN(orderId, isAdmin), data);
        return response.data;
    },


    /**
     * Import orders via CSV
     */
    importOrders: async (file: File, customerId?: string): Promise<{ status: boolean; message: string }> => {
        const formData = new FormData();
        formData.append("csv", file);
        if (customerId) {
            formData.append("customer_id", customerId);
        }
        const response = await api.post(API_ENDPOINTS.ORDERS.IMPORT, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    /**
     * Export orders in specified format
     */
    exportOrders: async (params: {
        format: "pdf" | "csv" | "excel";
        status?: string;
        start_date?: Date | string | undefined;
        end_date?: Date | string | undefined;
        search?: string;
    }): Promise<{ blob: Blob, filename: string }> => {
        const response = await api.get(API_ENDPOINTS.ORDERS.EXPORT, {
            params,
            responseType: "blob",
        });

        const formated = params.format === 'csv' ? 'csv' : params.format === 'excel' ? 'xlsx' : 'pdf';
        const filename = getFileName(response) || `customer-orders-${new Date().getTime()}.${formated}`;

        return { blob: response.data, filename };
    },

    /**
     * Download order label
     */
    downloadLabel: async (orderId: string | number): Promise<Blob> => {
        const response = await api.get(API_ENDPOINTS.ORDERS.LABEL_DOWNLOAD(orderId), {
            responseType: "blob",
        });
        return response.data;
    },

    /**
     * Get order status counts
     */
    getOrderCounts: async (params?: {
        customer?: string | number;
        search?: string;
        start_date?: Date | string | undefined;
        end_date?: Date | string | undefined;
    }): Promise<OrderCountsResponse> => {
        const response = await api.get<OrderCountsResponse>(API_ENDPOINTS.ORDERS.COUNTS, { params });
        return response.data;
    },

    /**
     * Get receiver address for a specific order
     */
    getReceiverAddress: async (orderId: string | number): Promise<any> => {
        const response = await api.get(API_ENDPOINTS.ORDERS.RECEIVER_ADDRESS(orderId));
        return response.data;
    },

    /**
     * Update receiver address for a specific order
     */
    updateReceiverAddress: async (orderId: string | number, data: any): Promise<any> => {
        const response = await api.put(API_ENDPOINTS.ORDERS.RECEIVER_ADDRESS(orderId), data);
        return response.data;
    },

    /**
     * Download sample CSV for order import
     */
    downloadImportSample: async (): Promise<Blob> => {
        const response = await api.get(API_ENDPOINTS.ORDERS.IMPORT_SAMPLE, {
            responseType: "blob",
        });
        return response.data;
    },

    /**
     * Archive an order
     */
    archiveOrder: async (orderId: string | number): Promise<any> => {
        const response = await api.post(API_ENDPOINTS.ORDERS.ARCHIVE(orderId));
        return response.data;
    },

    /**
     * Print order label
     */
    printOrder: async (orderNumber: string | number): Promise<any> => {
        const response = await api.post(API_ENDPOINTS.ORDERS.PRINT_ORDER, {
            order_number: orderNumber,
        });
        return response.data;
    },
};
