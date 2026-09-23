import { api } from '@/services/api'
import { API_ENDPOINTS } from '@/constants/api.constants'
import type {
    PackingDocumentsSorting,
    PackingSlipSettings,
    PackingSummaryOptions
} from '../types/packing-documents.types'

/**
 * The API replies `{ status, message, data: { settings, ...options } }`. Only
 * `settings` is the configuration, so both layers have to come off.
 */
const unwrap = <T,>(payload: any): T => {
    const body = payload?.data ?? payload
    return (body?.settings ?? body) as T
}

export const packingDocumentsService = {
    getSlipSettings: async (): Promise<PackingSlipSettings> => {
        const response = await api.get(API_ENDPOINTS.PACKING_SLIP_SETTINGS.BASE)
        return unwrap<PackingSlipSettings>(response.data)
    },

    updateSlipSettings: async (data: PackingSlipSettings): Promise<PackingSlipSettings> => {
        const response = await api.put(API_ENDPOINTS.PACKING_SLIP_SETTINGS.BASE, data)
        return unwrap<PackingSlipSettings>(response.data)
    },

    getSlipSample: async (settings: PackingSlipSettings): Promise<Blob> => {
        const response = await api.get(API_ENDPOINTS.PACKING_SLIP_SETTINGS.SAMPLE, {
            params: {
                template: settings.template,
                display_item_barcode: settings.display_item_barcode ? 1 : 0,
                rotate_packing_slip: settings.rotate_packing_slip ? 1 : 0,
                use_our_ref_barcode: settings.use_our_ref_barcode ? 1 : 0,
                use_their_ref_barcode: settings.use_their_ref_barcode ? 1 : 0,
                slip_per_package: settings.slip_per_package ? 1 : 0
            },
            responseType: 'blob'
        })
        return response.data
    },

    getSorting: async (): Promise<PackingDocumentsSorting> => {
        const response = await api.get(API_ENDPOINTS.PACKING_SLIP_SETTINGS.SORTING)
        return unwrap<PackingDocumentsSorting>(response.data)
    },

    updateSorting: async (data: PackingDocumentsSorting): Promise<PackingDocumentsSorting> => {
        const response = await api.put(API_ENDPOINTS.PACKING_SLIP_SETTINGS.SORTING, data)
        return unwrap<PackingDocumentsSorting>(response.data)
    },

    getSummarySettings: async (): Promise<PackingSummaryOptions> => {
        const response = await api.get(API_ENDPOINTS.PACKING_SLIP_SETTINGS.SUMMARY)
        return unwrap<PackingSummaryOptions>(response.data)
    },

    updateSummarySettings: async (data: PackingSummaryOptions): Promise<PackingSummaryOptions> => {
        const response = await api.put(API_ENDPOINTS.PACKING_SLIP_SETTINGS.SUMMARY, data)
        return unwrap<PackingSummaryOptions>(response.data)
    },

    getSummarySample: async (settings: PackingSummaryOptions): Promise<Blob> => {
        const response = await api.get(API_ENDPOINTS.PACKING_SLIP_SETTINGS.SUMMARY_SAMPLE, {
            params: {
                summary_template: settings.summary_template,
                summary_include_color_size: settings.summary_include_color_size,
                summary_include_bin: settings.summary_include_bin
            },
            responseType: 'blob'
        })
        return response.data
    }
}
