import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/api.constants';
import { showToast } from '@/components/ui/custom-toast';
import { downloadFile } from '@/lib/utils';
import { bulkPrintService } from '@/features/orders/services/bulk-print.api';
import { printLabelsPollInterval } from '@/features/orders/lib/printLabelsUi';

export const usePrintLabelsCheck = () =>
    useMutation({
        mutationFn: (orderNumbers: string[]) => bulkPrintService.checkPrintLabels(orderNumbers),
        retry: 0,
    });

export const useStartPrintLabels = () =>
    useMutation({
        mutationFn: (orderNumbers: string[]) => bulkPrintService.startPrintLabels(orderNumbers),
        retry: 0,
    });

export const usePrintLabelsStatus = (printId: string | null) =>
    useQuery({
        queryKey: QUERY_KEYS.ORDERS.PRINT_LABELS_STATUS(printId || ''),
        queryFn: () => bulkPrintService.getPrintLabelsStatus(printId as string),
        enabled: Boolean(printId),
        staleTime: 0,
        refetchIntervalInBackground: false,
        refetchInterval: (query) => {
            return printLabelsPollInterval(query.state.data?.status, query.state.status);
        },
        retry: 2,
    });

export const useDownloadPrintLabelsFile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (printId: string) => bulkPrintService.downloadPrintLabelsFile(printId),
        retry: 0,
        onSuccess: ({ blob, filename, skipped }) => {
            downloadFile(blob, filename);
            if (skipped) {
                showToast('Some labels could not be added to the PDF.', 'warning', skipped, 8000);
            }
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.LIST });
            queryClient.invalidateQueries({ queryKey: ['orders', 'counts'] });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WALLET.SUMMARY });
        },
        onError: async (error: any) => {
            let message = 'Failed to download the combined label PDF.';
            if (error?.response?.data instanceof Blob) {
                try {
                    const parsed = JSON.parse(await error.response.data.text());
                    message = parsed?.message || message;
                } catch {
                    message = error?.message || message;
                }
            } else {
                message = error?.response?.data?.message || error?.message || message;
            }
            showToast(message, 'error');
        },
    });
};
