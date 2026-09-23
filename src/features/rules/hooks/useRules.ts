import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rulesService } from "../services/rules.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import { showToast } from "@/components/ui/custom-toast";
import type { RuleFormType, RuleRunStatusResponse } from "../types/rules.types";

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
    mutationFn: (newRuleData: RuleFormType) => rulesService.create(newRuleData),
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
    onSuccess: () => {
      showToast("Rule updated successfully", "success");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RULES.LIST });
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

/**
 * Hook to persist a new running order (list of {id, sort_order})
 */
export const useReorderRules = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rules: { id: number; sort_order: number }[]) => rulesService.reorder(rules),
    onSuccess: (response) => {
      queryClient.setQueryData(QUERY_KEYS.RULES.LIST, response);
    },
    onError: (error: any) => {
      showToast(error.message || "Failed to reorder rules", "error");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RULES.LIST });
    }
  });
};

/**
 * Hook to queue a manual "run rules now" job
 */
export const useRunRules = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => rulesService.run(),
    onSuccess: () => {
      showToast("Rule run queued", "success");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RULES.RUN_STATUS });
    },
    onError: (error: any) => {
      showToast(error.message || "Failed to run rules", "error");
    }
  });
};

/**
 * Hook polling the rule-run status while a run is queued/running
 */
export const useRuleRunStatus = (enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.RULES.RUN_STATUS,
    queryFn: () => rulesService.runStatus(),
    enabled,
    refetchInterval: (query) => {
      const state = (query.state.data as RuleRunStatusResponse | undefined)?.data?.state;
      return state === 'queued' || state === 'running' ? 3000 : false;
    },
  });
};
