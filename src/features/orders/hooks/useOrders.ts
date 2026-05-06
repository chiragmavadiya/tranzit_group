import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "@/features/orders/services/orders.api";
import { QUERY_KEYS } from "@/constants/api.constants";

/**
 * Hook to fetch customer orders with filters
 */
export const useOrders = (params?: {
  status?: string;
  start_date?: string;
  end_date?: string;
  per_page?: number;
  page?: number;
  search?: string;
}, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ORDERS.LIST, params],
    queryFn: () => ordersService.getOrders(params),
    refetchInterval: 30000, // Poll every 30 seconds for list updates
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
    refetchInterval: 30000, // Poll every 30 seconds for detail updates
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
    mutationFn: ordersService.cancelOrder,
    onSuccess: (_, orderId) => {
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
export const useConsignOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string | number; data: any }) =>
      ordersService.consignOrder(orderId, data),
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
    mutationFn: ordersService.importOrders,
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

/**
 * Hook to download label
 */
export const useDownloadLabel = () => {
  return useMutation({
    mutationFn: ordersService.downloadLabel,
    onSuccess: (blob, orderId) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `label-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });
};
