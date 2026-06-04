import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "@/features/orders/services/orders.api";
import { QUERY_KEYS } from "@/constants/api.constants";
import { showToast } from "@/components/ui/custom-toast";

/**
 * Hook to fetch customer orders with filters
 */
export const useOrders = (params?: {
  status?: string;
  start_date?: Date | undefined;
  end_date?: Date | undefined;
  per_page?: number;
  page?: number;
  search?: string;
}, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ORDERS.LIST, params],
    queryFn: () => ordersService.getOrders(params),
    enabled
  });
};

/**
 * Hook to fetch details for a specific order
 */
export const useOrderDetails = (orderNumber: string | number) => {
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS.DETAILS(orderNumber),
    queryFn: () => ordersService.getOrderDetails(orderNumber),
    enabled: !!orderNumber,
    // refetchInterval: 30000, // Poll every 30 seconds for detail updates
  });
};

/**
 * Hook to fetch payment information for an order
 */
export const useOrderPaymentInfo = (orderNumber: string | number) => {
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS.PAYMENT_INFO(orderNumber),
    queryFn: () => ordersService.getPaymentInfo(orderNumber),
    enabled: !!orderNumber,
  });
};

/**
 * Hook to create a new order
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ordersService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.LIST });
    },
  });
};

/**
 * Hook to cancel an order
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string | number; data?: any }) => ordersService.cancelOrder(orderId, data),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.DETAILS(orderId) });
    },
  });
};

/**
 * Hook to pay with wallet
 */
export const usePayWithWallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ordersService.payWithWallet,
    onSuccess: (_, orderNumber) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.DETAILS(orderNumber) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.PAYMENT_INFO(orderNumber) });
    },
  });
};

/**
 * Hook to create an order with own courier
 */
export const useCreateOwnCourierOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ordersService.createOwnCourierOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.LIST });
    },
  });
};

/**
 * Hook to get quote services
 */
export const useQuoteServices = () => {
  return useMutation({
    mutationFn: ordersService.getQuoteServices,
  });
};

/**
 * Hook to check wallet balance
 */
export const useWalletCheck = () => {
  return useMutation({
    mutationFn: ordersService.checkWalletBalance,
  });
};

/**
 * Hook to consign an order
 */
export const useConsignOrder = (isAdmin: boolean = false) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string | number; data: any }) =>
      ordersService.consignOrder(orderId, data, isAdmin),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.DETAILS(orderId) });
    },
  });
};


/**
 * Hook to import orders
 */
export const useImportOrders = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, customerId }: { file: File; customerId?: string }) =>
      ordersService.importOrders(file, customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.LIST });
    },
  });
};

/**
 * Hook to export orders
 */
export const useExportOrders = () => {
  return useMutation({
    mutationFn: ordersService.exportOrders,
    onSuccess: ({ blob, filename }) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });
};

// const printPdf = async () => {
//   const response = await fetch('/api/pdf');

//   const blob = await response.blob();

//   const fileURL = URL.createObjectURL(blob);

//   const printWindow = window.open(fileURL);

//   printWindow.onload = () => {
//     printWindow.print();
//   };
// };

/**
 * Hook to download label
 */
export const useDownloadLabel = (printAfterDownload: boolean = false) => {
  return useMutation({
    mutationFn: ordersService.downloadLabel,
    onSuccess: (blob, orderId) => {
      const url = window.URL.createObjectURL(blob);

      // const printWindow = window.open(url);
      if (printAfterDownload) {

        const iframe = document.createElement('iframe');

        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';

        iframe.src = url;

        document.body.appendChild(iframe);

        iframe.onload = () => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        }
      } else {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `label-${orderId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }


    },
    onError: (error: any) => {
      showToast(error?.message || "Failed to download label", "error")
    }
  });
};

/**
 * Hook to fetch order status counts
 */
export const useOrderCounts = (customerId?: string | number, enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS.COUNTS(customerId),
    queryFn: () => ordersService.getOrderCounts(customerId),
    enabled
  });
};

/**
 * Hook to fetch receiver address for a specific order
 */
export const useOrderReceiverAddress = (orderId: string | number, enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS.RECEIVER_ADDRESS(orderId),
    queryFn: () => ordersService.getReceiverAddress(orderId),
    enabled: !!orderId && enabled,
  });
};

/**
 * Hook to update receiver address for a specific order
 */
export const useUpdateOrderReceiverAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string | number; data: any }) =>
      ordersService.updateReceiverAddress(orderId, data),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.RECEIVER_ADDRESS(orderId) });
    },
    onError: (error: any) => {
      showToast(error?.message || "Failed to update receiver address", "error")
    }
  });
};

/**
 * Hook to download sample CSV for order import
 */
export const useDownloadImportSample = () => {
  return useMutation({
    mutationFn: ordersService.downloadImportSample,
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'orders_import_sample.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('Sample CSV downloaded successfully', 'success');
    },
    onError: (error: any) => {
      showToast(error?.message || "Failed to download sample CSV", "error");
    }
  });
};

/**
 * Hook to archive an order
 */
export const useArchiveOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ordersService.archiveOrder,
    onSuccess: () => {
      showToast('Order archived successfully', 'success');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.LIST });
    },
    onError: (error: any) => {
      showToast(error?.message || "Failed to archive order", "error");
    }
  });
};

