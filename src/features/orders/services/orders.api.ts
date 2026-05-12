import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { OrdersResponse } from "@/features/orders/types";
import type {
    CreateOrderRequest,
    CreateOrderResponse,
    QuoteServicesRequest,
    QuoteServicesResponse,
    WalletCheckResponse,
    PaymentInfoResponse
} from "../types/api.types";
import type { OrderDetailData } from "../types/order-details.types";

export const ordersService = {
    /**
     * Get customer orders with optional filters and pagination
     */
    getOrders: async (params?: {
        status?: string;
        start_date?: string;
        end_date?: string;
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
        const response = await api.post(API_ENDPOINTS.ORDERS.CREATE, data);
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
    cancelOrder: async (orderId: string | number): Promise<any> => {
        const response = await api.post(API_ENDPOINTS.ORDERS.CANCEL(orderId));
        return response.data;
    },

    /**
     * Consign an order
     */
    consignOrder: async (orderId: string | number, data: any): Promise<any> => {
        const response = await api.post(API_ENDPOINTS.ORDERS.CONSIGN(orderId), data);
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
        start_date?: string;
        end_date?: string;
        search?: string;
    }): Promise<{ blob: Blob, filename: string }> => {
        const response = await api.get(API_ENDPOINTS.ORDERS.EXPORT, {
            params,
            responseType: "blob",
        });

        const filename = `orders_${new Date().getTime()}.${params.format}`;

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
};
