import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { itemsService } from "../services/items.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { ItemsFilters, ItemFormData } from "../types";
import { toast } from "sonner";

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
    queryKey: QUERY_KEYS.ITEMS.DETAILS(id!),
    queryFn: () => itemsService.getDetails(id!),
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
        toast.success(response.message || "Item created successfully");
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS.LIST });
      } else {
        toast.error(response.message || "Failed to create item");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
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
    onSuccess: (response) => {
      if (response.status) {
        toast.success(response.message || "Item updated successfully");
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS.LIST });
      } else {
        toast.error(response.message || "Failed to update item");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
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
      toast.success("Item deleted successfully");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS.LIST });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete item");
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
      toast.error(error.message || "Failed to export items");
    },
  });
};
