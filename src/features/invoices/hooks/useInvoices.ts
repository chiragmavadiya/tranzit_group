import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { invoicesService } from '../services/invoices.service';
import { QUERY_KEYS } from '@/constants/api.constants';
import { showToast } from '@/components/ui/custom-toast';

export const useCustomerInvoices = (params?: { search?: string; page?: number; per_page?: number; }, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.INVOICES.LIST, params],
    queryFn: () => invoicesService.getCustomerInvoices(params),
    placeholderData: keepPreviousData,
    enabled: enabled
  });
};

export const useCustomerInvoiceDetails = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.INVOICES.DETAILS(id),
    queryFn: () => invoicesService.getCustomerInvoiceDetails(id),
    enabled: !!id && enabled,
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
      showToast(error?.response?.data?.message || "Failed to export invoices", "error");
    },
  });
};

export const useCreateCustomerInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => invoicesService.createCustomerInvoice(data),
    onSuccess: (response) => {
      if (response.status) {
        showToast(response.message || "Invoice created successfully", "success");
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INVOICES.LIST });
      } else {
        showToast(response.message || "Failed to create invoice", "error");
      }
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || "Failed to create invoice", "error");
    },
  });
};

export const useAdminInvoices = (params?: { search?: string; page?: number; per_page?: number; customer?: string }, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['admin', 'invoices', 'list', params],
    queryFn: () => invoicesService.getAdminInvoices(params),
    placeholderData: keepPreviousData,
    enabled: enabled,
    staleTime: 0,
  });
};

export const useAdminInvoiceDetails = (id: string | number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['admin', 'invoices', 'details', id],
    queryFn: () => invoicesService.getAdminInvoiceDetails(id),
    enabled: !!id && enabled,
  });
};

export const useUpdateAdminInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: any }) => invoicesService.updateAdminInvoice(id, data),
    onSuccess: (response, variables) => {
      if (response.status) {
        showToast(response.message || "Invoice updated successfully", "success");
        // queryClient.invalidateQueries({ queryKey: ['admin', 'invoices'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'invoices', 'details', variables.id] });
      }
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || "Failed to update invoice", "error");
    },
  });
};

export const useDeleteAdminInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => invoicesService.deleteAdminInvoice(id),
    onSuccess: (response) => {
      if (response.status) {
        showToast(response.message || "Invoice deleted successfully", "success");
        queryClient.invalidateQueries({ queryKey: ['admin', 'invoices'] });
      }
    },
  });
};

export const useSendAdminInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => invoicesService.sendAdminInvoice(id),
    onSuccess: (response, id) => {
      if (response.status) {
        showToast(response.message || "Invoice sent successfully", "success");
        queryClient.invalidateQueries({ queryKey: ['admin', 'invoices', 'details', id] });
      }
    },
  });
};

export const useDownloadAdminInvoice = () => {
  return useMutation({
    mutationFn: (id: string | number) => invoicesService.downloadAdminInvoice(id),
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
  });
};

export const useRemindAdminInvoice = () => {
  return useMutation({
    mutationFn: (id: string | number) => invoicesService.remindAdminInvoice(id),
    onSuccess: (response) => {
      if (response.status) {
        showToast(response.message || "Reminder sent successfully", "success");
      }
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || "Failed to send reminder", "error");
    },
  });
};

export const useZohoSyncAdminInvoice = () => {
  return useMutation({
    mutationFn: (id: string | number) => invoicesService.zohoSyncAdminInvoice(id),
    onSuccess: (response) => {
      if (response.status) {
        showToast(response.message || "Synced to Zoho successfully", "success");
      }
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || "Failed to sync to Zoho", "error");
    },
  });
};

export const useAdminInvoicePayment = () => {
  const queryClient = useQueryClient();
  return {
    add: useMutation({
      mutationFn: ({ id, data }: { id: string | number; data: any }) => invoicesService.addAdminInvoicePayment(id, data),
      onSuccess: (response, variables) => {
        if (response.status) {
          showToast("Payment added successfully", "success");
          queryClient.invalidateQueries({ queryKey: ['admin', 'invoices', 'details', variables.id] });
        }
      },
    }),
    update: useMutation({
      mutationFn: ({ invoiceId, paymentId, data }: { invoiceId: string | number; paymentId: string | number; data: any }) => invoicesService.updateAdminInvoicePayment(invoiceId, paymentId, data),
      onSuccess: (response, variables) => {
        if (response.status) {
          showToast("Payment updated successfully", "success");
          queryClient.invalidateQueries({ queryKey: ['admin', 'invoices', 'details', variables.invoiceId] });
        }
      },
    }),
    delete: useMutation({
      mutationFn: ({ invoiceId, paymentId }: { invoiceId: string | number; paymentId: string | number }) => invoicesService.deleteAdminInvoicePayment(invoiceId, paymentId),
      onSuccess: (response, variables) => {
        if (response.status) {
          showToast("Payment deleted successfully", "success");
          queryClient.invalidateQueries({ queryKey: ['admin', 'invoices', 'details', variables.invoiceId] });
        }
      },
    }),
  };
};

export const useExportAdminInvoices = () => {
  return useMutation({
    mutationFn: (params: { format: string; customer?: string; search?: string }) => invoicesService.exportAdminInvoices(params),
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
  });
};
