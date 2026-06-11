import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
    ReportFilters,
    ShipmentReport,
    TransactionReport,
    InvoiceReport,
    ParcelReport,
    PaginatedResponse,
    UploadInvoiceResponse,
    ReportCountsResponse
} from "../types";
import { getFileName } from "@/lib/utils";

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

    getParcelReport: async (filters: ReportFilters, isAdmin: boolean = false): Promise<PaginatedResponse<ParcelReport>> => {
        const endpoint = isAdmin ? API_ENDPOINTS.ADMIN_REPORTS.PARCELS : API_ENDPOINTS.REPORTS.PARCELS;
        const response = await api.get(endpoint, { params: filters });
        return response.data;
    },
    getIntegratedParcelReport: async (filters: ReportFilters): Promise<PaginatedResponse<ParcelReport>> => {
        const endpoint = API_ENDPOINTS.ADMIN_REPORTS.INTEGRATED_PARCELS;
        const response = await api.get(endpoint, { params: filters });
        return response.data;
    },

    exportParcelReport: async (filters: ReportFilters & { format: string }, isAdmin: boolean = false): Promise<{ blob: Blob; filename: string }> => {
        const endpoint = isAdmin ? API_ENDPOINTS.ADMIN_REPORTS.PARCELS_EXPORT : API_ENDPOINTS.REPORTS.PARCELS_EXPORT;
        const response = await api.get(endpoint, {
            params: filters,
            responseType: 'blob',
        });

        const fileName = getFileName(response)
        return { blob: response.data, filename: fileName };
    },
    exportIntegratedParcelReport: async (filters: ReportFilters & { format: string }): Promise<{ blob: Blob; filename: string }> => {
        const endpoint = API_ENDPOINTS.ADMIN_REPORTS.INTEGRATED_PARCELS_EXPORT;
        const response = await api.get(endpoint, {
            params: filters,
            responseType: 'blob',
        });

        const fileName = getFileName(response)
        return { blob: response.data, filename: fileName };
    },

    uploadDirectFreightInvoice: async (file: File): Promise<UploadInvoiceResponse> => {
        const formData = new FormData();
        formData.append("direct_freight_invoice", file);
        const response = await api.post(API_ENDPOINTS.ADMIN_REPORTS.DIRECT_FREIGHT_UPLOAD, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    uploadAusPostInvoice: async (file: File): Promise<UploadInvoiceResponse> => {
        const formData = new FormData();
        formData.append("auspost_invoice", file);
        const response = await api.post(API_ENDPOINTS.ADMIN_REPORTS.AUSPOST_UPLOAD, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    getReportCounts: async (): Promise<ReportCountsResponse> => {
        const response = await api.get<ReportCountsResponse>(API_ENDPOINTS.REPORTS.COUNTS);
        return response.data;
    },
};
