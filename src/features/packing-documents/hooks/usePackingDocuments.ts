import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/api.constants'
import { showToast } from '@/components/ui/custom-toast'
import { packingDocumentsService } from '../services/packing-documents.service'

const errorMessage = (error: any, fallback: string) =>
    error?.response?.data?.message || error?.message || fallback

export const usePackingSlipSettings = () =>
    useQuery({
        queryKey: QUERY_KEYS.PACKING_DOCUMENTS.SLIP_SETTINGS,
        queryFn: packingDocumentsService.getSlipSettings
    })

export const usePackingSummarySettings = () =>
    useQuery({
        queryKey: QUERY_KEYS.PACKING_DOCUMENTS.SUMMARY_SETTINGS,
        queryFn: packingDocumentsService.getSummarySettings
    })

export const usePackingDocumentsSorting = () =>
    useQuery({
        queryKey: QUERY_KEYS.PACKING_DOCUMENTS.SORTING,
        queryFn: packingDocumentsService.getSorting
    })

/**
 * Each section saves on its own, so editing one never touches the other endpoints
 * and only that section's query is refetched.
 */
const useSaveSection = <T,>(
    mutationFn: (data: T) => Promise<unknown>,
    queryKey: readonly unknown[],
    label: string
) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn,
        onSuccess: () => {
            showToast(`${label} saved successfully`, 'success')
            queryClient.invalidateQueries({ queryKey })
        },
        onError: (error: any) => {
            // The server message alone does not say which section failed.
            const detail = errorMessage(error, '')
            showToast(`${label} could not be saved${detail ? `: ${detail}` : ''}`, 'error')
        }
    })
}

export const useSavePackingSlipSettings = () =>
    useSaveSection(
        packingDocumentsService.updateSlipSettings,
        QUERY_KEYS.PACKING_DOCUMENTS.SLIP_SETTINGS,
        'Packing slip settings'
    )

export const useSavePackingSummarySettings = () =>
    useSaveSection(
        packingDocumentsService.updateSummarySettings,
        QUERY_KEYS.PACKING_DOCUMENTS.SUMMARY_SETTINGS,
        'Packing summary settings'
    )

export const useSavePackingDocumentsSorting = () =>
    useSaveSection(
        packingDocumentsService.updateSorting,
        QUERY_KEYS.PACKING_DOCUMENTS.SORTING,
        'Sorting settings'
    )

const openSample = (blob: Blob) => {
    const url = window.URL.createObjectURL(blob)
    const preview = window.open(url, '_blank')
    if (!preview) {
        showToast('Allow pop-ups to preview the sample', 'error')
        window.URL.revokeObjectURL(url)
    }
}

const sampleError = (label: string) => async (error: any) => {
    let message = `Failed to load the sample ${label}`
    // The sample is requested as a blob, so an error body arrives as one too.
    if (error?.response?.data instanceof Blob) {
        try {
            message = JSON.parse(await error.response.data.text()).message || message
        } catch {
            message = error.message || message
        }
    } else {
        message = errorMessage(error, message)
    }
    showToast(message, 'error')
}

export const usePackingSummarySample = () =>
    useMutation({
        mutationFn: packingDocumentsService.getSummarySample,
        onSuccess: openSample,
        onError: sampleError('packing summary')
    })

export const usePackingSlipSample = () =>
    useMutation({
        mutationFn: packingDocumentsService.getSlipSample,
        onSuccess: openSample,
        onError: sampleError('packing slip')
    })
