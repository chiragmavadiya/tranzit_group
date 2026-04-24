import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query';
import { invoicesService } from '../services/invoices.service';
import { QUERY_KEYS } from '@/constants/api.constants';
import { toast } from 'sonner';

export const useCustomerInvoices = (params?: { search?: string; page?: number; per_page?: number }) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.INVOICES.LIST, params],
    queryFn: () => invoicesService.getCustomerInvoices(params),
    placeholderData: keepPreviousData,
  });
};

export const useCustomerInvoiceDetails = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.INVOICES.DETAILS(id),
    queryFn: () => invoicesService.getCustomerInvoiceDetails(id),
    enabled: !!id,
  });
};

export const useExportCustomerInvoices = () => {
  return useMutation({
    mutationFn: (params: { format: string; search?: string }) => 
      invoicesService.exportCustomerInvoices(params),
    onSuccess: ({ blob, filename }) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to export invoices");
    },
  });
};
