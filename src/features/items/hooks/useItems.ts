import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { itemsService } from "../services/items.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { ItemsFilters, ItemFormData } from "../types";
import { showToast } from "@/components/ui/custom-toast";

/**
 * Hook to fetch items list
 */
export const useItems = (filters: ItemsFilters) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ITEMS.LIST, filters],
    queryFn: () => itemsService.getList(filters),
    placeholderData: keepPreviousData,
  });
};

/**
 * Hook to fetch item details
 */
export const useItemDetails = (id: number | string | undefined) => {
  return useQuery({
    queryKey: QUERY_KEYS.ITEMS.DETAILS(id as any),
    queryFn: () => itemsService.getDetails(id as any),
    enabled: !!id,
  });
};

/**
 * Hook to create an item
 */
export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ItemFormData) => itemsService.create(data),
    onSuccess: (response) => {
      if (response.status) {
        showToast(response.message || "Item created successfully", "success");
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS.LIST });
      } else {
        showToast(response.message || "Failed to create item", "error");
      }
    },
    onError: (error: any) => {
      showToast(error.message || "An error occurred", "error");
    },
  });
};

/**
 * Hook to update an item
 */
export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: ItemFormData }) =>
      itemsService.update(id, data),
    onSuccess: (response, variables) => {
      if (response.status) {
        showToast(response.message || "Item updated successfully", "success");
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS.LIST });
        queryClient.removeQueries({
          queryKey: QUERY_KEYS.ITEMS.DETAILS(variables.id as any),
        });
      } else {
        showToast(response.message || "Failed to update item", "error");
      }
    },
    onError: (error: any) => {
      showToast(error.message || "An error occurred", "error");
    },
  });
};

/**
 * Hook to delete an item
 */
export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => itemsService.delete(id),
    onSuccess: () => {
      showToast("Item deleted successfully", "success");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS.LIST });
    },
    onError: (error: any) => {
      showToast(error.message || "Failed to delete item", "error");
    },
  });
};

/**
 * Hook to export items
 */
export const useExportItems = () => {
  return useMutation({
    mutationFn: ({ format, search }: { format: string; search?: string }) =>
      itemsService.export(format, search),
    onSuccess: ({ blob, filename }) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    onError: (error: any) => {
      showToast(error.message || "Failed to export items", "error");
    },
  });
};
