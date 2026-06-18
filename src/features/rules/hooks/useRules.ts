import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rulesService } from "../services/rules.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import { showToast } from "@/components/ui/custom-toast";
import type { RuleFormType } from "../types/rules.types";

/**
 * Hook to fetch rules list
 */
export const useRules = (enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.RULES.LIST,
    queryFn: () => rulesService.getList(),
    enabled,
  });
};

/**
 * Hook to fetch rule details
 */
// export const useRuleDetails = (id: number | string | undefined) => {
//   return useQuery({
//     queryKey: QUERY_KEYS.RULES.DETAILS(id as any),
//     queryFn: () => rulesService.getDetails(id as any),
//     enabled: !!id,
//   });
// };

/**
 * Hook to fetch rule options
 */
export const useRuleOptions = (enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.RULES.OPTIONS,
    queryFn: () => rulesService.getOptions(),
    enabled,
  });
};

/**
 * Hook to create a rule
 */
export const useCreateRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRuleData: any) => {
      return rulesService.create(newRuleData);
    },
    onSuccess: () => {
      showToast("Rule created successfully", "success");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RULES.LIST });
    },
    onError: (error: any) => {
      showToast(error.message || "Failed to create rule", "error");
    }
  });
};

/**
 * Hook to update a rule
 */
export const useUpdateRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: RuleFormType }) => {
      return rulesService.update(id, data);
    },
    onSuccess: (_response, variables) => {
      showToast("Rule updated successfully", "success");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RULES.LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RULES.DETAILS(variables.id) });
    },
    onError: (error: any) => {
      showToast(error.message || "Failed to update rule", "error");
    }
  });
};

/**
 * Hook to delete a rule
 */
export const useDeleteRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => rulesService.delete(id),
    onSuccess: () => {
      showToast("Rule deleted successfully", "success");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RULES.LIST });
    },
    onError: (error: any) => {
      showToast(error.message || "Failed to delete rule", "error");
    }
  });
};
