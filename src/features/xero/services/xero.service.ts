import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { XeroConnectResponse, XeroContactsResponse, XeroDisconnectResponse, XeroStatusResponse, XeroSyncInvoiceResponse } from "../types";

export const xeroService = {
    getStatus: async (): Promise<XeroStatusResponse> => {
        const response = await api.get(API_ENDPOINTS.XERO.STATUS);
        return response.data;
    },
    connect: async (): Promise<XeroConnectResponse> => {
        const response = await api.get(API_ENDPOINTS.XERO.CONNECT);
        return response.data;
    },
    disconnect: async (): Promise<XeroDisconnectResponse> => {
        const response = await api.delete(API_ENDPOINTS.XERO.DISCONNECT);
        return response.data;
    },
    syncInvoice: async (invoiceId: string | number): Promise<XeroSyncInvoiceResponse> => {
        const response = await api.post(API_ENDPOINTS.XERO.SYNC_INVOICE(invoiceId));
        return response.data;
    },
    getContacts: async (xeroContactId?: string): Promise<XeroContactsResponse> => {
        const response = await api.get(API_ENDPOINTS.XERO.CONTACTS, {
            params: xeroContactId ? { xero_contact_id: xeroContactId } : undefined,
        });
        return response.data;
    },
};
