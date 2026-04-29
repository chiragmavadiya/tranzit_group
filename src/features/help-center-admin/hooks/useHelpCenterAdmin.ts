import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { helpCenterAdminService } from "../services/help-center-admin.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { HelpArticleFilters, HelpArticleFormData } from "../types";
import { toast } from "sonner";

export const useHelpArticles = (filters: HelpArticleFilters) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_HELP_CENTER.LIST, filters],
    queryFn: () => helpCenterAdminService.getList(filters),
    placeholderData: keepPreviousData,
  });
};

export const useHelpArticleDetails = (id: string | number | null) => {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN_HELP_CENTER.DETAILS(id || ""),
    queryFn: () => helpCenterAdminService.getDetails(id!),
    enabled: !!id,
  });
};

export const useHelpArticleMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: helpCenterAdminService.create,
    onSuccess: (response) => {
      if (response.status) {
        toast.success("Article created successfully");
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_HELP_CENTER.LIST });
      } else {
        toast.error(response.message || "Failed to create article");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create article");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: HelpArticleFormData }) =>
      helpCenterAdminService.update(id, data),
    onSuccess: (response, variables) => {
      if (response.status) {
        toast.success("Article updated successfully");
        // Update the detail cache with new data immediately
        queryClient.setQueryData(QUERY_KEYS.ADMIN_HELP_CENTER.DETAILS(variables.id), response);
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_HELP_CENTER.LIST });
      } else {
        toast.error(response.message || "Failed to update article");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update article");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: helpCenterAdminService.delete,
    onSuccess: (response) => {
      if (response.status) {
        toast.success("Article deleted successfully");
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_HELP_CENTER.LIST });
      } else {
        toast.error(response.message || "Failed to delete article");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete article");
    },
  });

  return {
    createArticle: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateArticle: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteArticle: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
