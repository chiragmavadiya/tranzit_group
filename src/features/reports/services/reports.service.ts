import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { 
    ReportFilters, 
    ShipmentReport, 
    TransactionReport, 
    InvoiceReport, 
    ParcelReport, 
    PaginatedResponse 
} from "../types";

export const reportsService = {
    getShipmentReport: async (filters: ReportFilters): Promise<PaginatedResponse<ShipmentReport>> => {
        const response = await api.get(API_ENDPOINTS.REPORTS.SHIPMENT, { params: filters });
        return response.data;
    },

    exportShipmentReport: async (filters: ReportFilters & { format: string }): Promise<{ blob: Blob; filename: string }> => {
        const response = await api.get(API_ENDPOINTS.REPORTS.SHIPMENT_EXPORT, {
            params: filters,
            responseType: 'blob',
        });
        
        const filename = `Shipment_Report_${new Date().getTime()}.${filters.format}`;
        return { blob: response.data, filename };
    },

    getTransactionReport: async (filters: ReportFilters): Promise<PaginatedResponse<TransactionReport>> => {
        const response = await api.get(API_ENDPOINTS.REPORTS.TRANSACTION, { params: filters });
        return response.data;
    },

    exportTransactionReport: async (filters: ReportFilters & { format: string }): Promise<{ blob: Blob; filename: string }> => {
        const response = await api.get(API_ENDPOINTS.REPORTS.TRANSACTION_EXPORT, {
            params: filters,
            responseType: 'blob',
        });
        
        const filename = `Transaction_Report_${new Date().getTime()}.${filters.format}`;
        return { blob: response.data, filename };
    },

    getInvoiceReport: async (filters: ReportFilters): Promise<PaginatedResponse<InvoiceReport>> => {
        const response = await api.get(API_ENDPOINTS.REPORTS.INVOICE, { params: filters });
        return response.data;
    },

    getParcelReport: async (filters: ReportFilters): Promise<PaginatedResponse<ParcelReport>> => {
        const response = await api.get(API_ENDPOINTS.REPORTS.PARCELS, { params: filters });
        return response.data;
    },

    exportParcelReport: async (filters: ReportFilters & { format: string }): Promise<{ blob: Blob; filename: string }> => {
        const response = await api.get(API_ENDPOINTS.REPORTS.PARCELS_EXPORT, {
            params: filters,
            responseType: 'blob',
        });
        
        const filename = `Parcel_Report_${new Date().getTime()}.${filters.format}`;
        return { blob: response.data, filename };
    }
};
