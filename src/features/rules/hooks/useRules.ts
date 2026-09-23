import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rulesService } from "../services/rules.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import { showToast } from "@/components/ui/custom-toast";
<<<<<<< HEAD
import type { RuleFormType, RuleRunStatusResponse } from "../types/rules.types";
=======
import type { RuleFormType } from "../types/rules.types";
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c

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
<<<<<<< HEAD
=======
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
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
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
<<<<<<< HEAD
    mutationFn: (newRuleData: RuleFormType) => rulesService.create(newRuleData),
=======
    mutationFn: async (newRuleData: any) => {
      return rulesService.create(newRuleData);
    },
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
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
<<<<<<< HEAD
    onSuccess: () => {
      showToast("Rule updated successfully", "success");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RULES.LIST });
=======
    onSuccess: (_response, variables) => {
      showToast("Rule updated successfully", "success");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RULES.LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RULES.DETAILS(variables.id) });
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
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
<<<<<<< HEAD

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
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
